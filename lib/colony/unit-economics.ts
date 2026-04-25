/**
 * Unit Economics fetcher — joins bot_runs cost data with EspoCRM funnel counts
 * to produce CFO-grade metrics: cost-per-stage, payback period, gross margin.
 *
 * Stage-name mapping (memory → real EspoCRM values, as of 2026-04-25):
 *   Lead                → Lead.status in {New, Assigned, In Process} (count of all)
 *   Audit Scheduled     → Lead.status = Assigned       (proxy: David has engaged)
 *   Audit Complete      → Lead.status = In Process     (proxy: post-audit work)
 *   Proposal Sent       → Opportunity.stage = Lead     (proxy: opp created)
 *   Proposal Signed     → Opportunity.stage = Active   (real signed deal)
 *   Active              → Opportunity.stage = Active   (current snapshot)
 *   Churned             → none yet (no Churned stage in EspoCRM yet)
 *
 * If David later adds explicit "Audit Scheduled" / "Proposal Sent" stages, update STAGE_MAP.
 */

export type TimeWindow = '7d' | '30d' | '90d' | 'all'

interface BotRunPayload {
  bot_id?: string
  cost_usd?: number
  tokens_in?: number
  tokens_out?: number
  api_calls?: number
  ran_at?: string
  ran_at_unix?: number
  cohort_id?: string
  cost_by_model?: Record<string, { cost_usd: number; calls: number }>
}

export interface UnitEconomics {
  window: TimeWindow
  window_start: string
  window_end: string
  cohort_id: string

  // Cost side (from bot_runs)
  total_cost_usd: number
  total_api_calls: number
  total_tokens_in: number
  total_tokens_out: number
  bot_runs_count: number
  bot_runs_with_cost: number
  cost_by_bot: Record<string, { cost_usd: number; calls: number }>
  cost_by_model: Record<string, { cost_usd: number; calls: number }>

  // Funnel side (from EspoCRM)
  leads_count: number
  audit_scheduled_count: number
  audit_complete_count: number
  proposal_sent_count: number
  proposal_signed_count: number
  active_customers_count: number
  churned_count: number

  // Unit economics (null if denominator is 0)
  cost_per_lead: number | null
  cost_per_audit_scheduled: number | null
  cost_per_audit_complete: number | null
  cost_per_proposal_sent: number | null
  cost_per_signed_deal: number | null

  // Conversion rates (percent, e.g. 12.5)
  lead_to_audit_pct: number | null
  audit_to_proposal_pct: number | null
  proposal_to_signed_pct: number | null
  overall_lead_to_customer_pct: number | null

  // Revenue side
  total_signed_amount_usd: number
  avg_deal_size_usd: number | null

  // Derived: payback in days (rough — avg_deal_size_usd as monthly proxy)
  estimated_payback_days: number | null

  has_data: boolean
  warnings: string[]
}

const QDRANT_URL = process.env.COLONY_QDRANT_URL || process.env.QDRANT_URL || 'http://localhost:6333'
const ESPOCRM_URL = (process.env.COLONY_ESPOCRM_URL || process.env.ESPOCRM_URL || 'http://localhost:8080').replace(/\/$/, '')
const ESPOCRM_API_KEY = process.env.COLONY_ESPOCRM_API_KEY || process.env.ESPOCRM_API_KEY || ''

// Memory-stage → real EspoCRM Lead.status / Opportunity.stage values
const STAGE_MAP = {
  AUDIT_SCHEDULED: ['Assigned'],
  AUDIT_COMPLETE: ['In Process'],
  PROPOSAL_SENT_OPP: ['Lead'],
  PROPOSAL_SIGNED_OPP: ['Active'],
  ACTIVE_OPP: ['Active'],
  CHURNED_OPP: ['Churned'], // not currently used in EspoCRM but harmless if absent
} as const

function windowToISO(window: TimeWindow): { start: string; end: string } {
  const now = new Date()
  const end = now.toISOString()
  let startMs: number
  switch (window) {
    case '7d':
      startMs = now.getTime() - 7 * 86400000
      break
    case '30d':
      startMs = now.getTime() - 30 * 86400000
      break
    case '90d':
      startMs = now.getTime() - 90 * 86400000
      break
    case 'all':
    default:
      // Earliest possible — Colony cohort's onboarding floor
      startMs = new Date('2026-01-01').getTime()
      break
  }
  return { start: new Date(startMs).toISOString(), end }
}

async function qdrantScrollBotRuns(cohortId: string, startISO: string): Promise<BotRunPayload[]> {
  const out: BotRunPayload[] = []
  let nextOffset: string | number | null = null
  let safety = 0

  while (safety < 100) {
    const body: Record<string, unknown> = {
      limit: 250,
      with_payload: true,
      with_vector: false,
      filter: {
        must: [{ key: 'cohort_id', match: { value: cohortId } }],
      },
    }
    if (nextOffset !== null) body.offset = nextOffset

    let resp: Response
    try {
      resp = await fetch(`${QDRANT_URL}/collections/bot_runs/points/scroll`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
    } catch {
      break
    }
    if (!resp.ok) break
    const data = await resp.json()
    const points: Array<{ payload?: BotRunPayload }> = data.result?.points || []

    // Client-side date filter on ran_at since payload datetime range filtering
    // requires an index on ran_at and uses ISO strings — we filter in JS to avoid
    // index dependency.
    const startTs = new Date(startISO).getTime()
    for (const p of points) {
      const pl = p.payload || {}
      const ranAt = pl.ran_at ? new Date(pl.ran_at).getTime() : 0
      if (ranAt >= startTs) out.push(pl)
    }

    nextOffset = data.result?.next_page_offset ?? null
    if (nextOffset === null) break
    safety += 1
  }

  return out
}

interface EspocrmListResult {
  total?: number
  list?: Array<Record<string, unknown>>
}

interface EspocrmFilter {
  attribute: string
  type: string
  value: string | string[]
}

async function espocrmCount(entity: string, filters: EspocrmFilter[]): Promise<number> {
  if (!ESPOCRM_API_KEY) return 0
  try {
    const url = new URL(`${ESPOCRM_URL}/api/v1/${entity}`)
    filters.forEach((f, i) => {
      url.searchParams.set(`where[${i}][type]`, f.type)
      url.searchParams.set(`where[${i}][attribute]`, f.attribute)
      if (Array.isArray(f.value)) {
        f.value.forEach((v, j) => url.searchParams.set(`where[${i}][value][${j}]`, v))
      } else {
        url.searchParams.set(`where[${i}][value]`, f.value)
      }
    })
    url.searchParams.set('select', 'id')
    url.searchParams.set('maxSize', '1')

    const resp = await fetch(url.toString(), { headers: { 'X-Api-Key': ESPOCRM_API_KEY } })
    if (!resp.ok) return 0
    const data: EspocrmListResult = await resp.json()
    return data.total || 0
  } catch {
    return 0
  }
}

async function espocrmOpportunityAmount(
  startISO: string,
  stages: readonly string[]
): Promise<{ total: number; count: number }> {
  if (!ESPOCRM_API_KEY) return { total: 0, count: 0 }
  try {
    const url = new URL(`${ESPOCRM_URL}/api/v1/Opportunity`)
    url.searchParams.set('where[0][type]', 'in')
    url.searchParams.set('where[0][attribute]', 'stage')
    stages.forEach((s, i) => url.searchParams.set(`where[0][value][${i}]`, s))
    url.searchParams.set('where[1][type]', 'greaterThanOrEquals')
    url.searchParams.set('where[1][attribute]', 'createdAt')
    url.searchParams.set('where[1][value]', startISO)
    url.searchParams.set('select', 'amount')
    url.searchParams.set('maxSize', '200')

    const resp = await fetch(url.toString(), { headers: { 'X-Api-Key': ESPOCRM_API_KEY } })
    if (!resp.ok) return { total: 0, count: 0 }
    const data: EspocrmListResult = await resp.json()
    let total = 0
    let count = 0
    for (const opp of data.list || []) {
      const amount = (opp as Record<string, unknown>).amount
      if (typeof amount === 'number') {
        total += amount
        count += 1
      }
    }
    return { total, count }
  } catch {
    return { total: 0, count: 0 }
  }
}

function safeDiv(numerator: number, denominator: number): number | null {
  if (!denominator || !Number.isFinite(denominator)) return null
  return Math.round((numerator / denominator) * 100) / 100
}

function safePct(numerator: number, denominator: number): number | null {
  if (!denominator || !Number.isFinite(denominator)) return null
  return Math.round((numerator / denominator) * 1000) / 10
}

export async function fetchUnitEconomics(
  window: TimeWindow = '30d',
  cohortId = 'aiandwebservices'
): Promise<UnitEconomics> {
  const warnings: string[] = []
  const { start, end } = windowToISO(window)

  // Pull bot_runs costs
  let botRuns: BotRunPayload[] = []
  try {
    botRuns = await qdrantScrollBotRuns(cohortId, start)
  } catch (e) {
    warnings.push(`bot_runs fetch failed: ${(e as Error).message}`)
  }

  // Aggregate costs
  let totalCost = 0
  let totalCalls = 0
  let totalTokensIn = 0
  let totalTokensOut = 0
  let runsWithCost = 0
  const costByBot: Record<string, { cost_usd: number; calls: number }> = {}
  const costByModel: Record<string, { cost_usd: number; calls: number }> = {}

  for (const pl of botRuns) {
    const cost = typeof pl.cost_usd === 'number' ? pl.cost_usd : 0
    const calls = typeof pl.api_calls === 'number' ? pl.api_calls : 0
    const tIn = typeof pl.tokens_in === 'number' ? pl.tokens_in : 0
    const tOut = typeof pl.tokens_out === 'number' ? pl.tokens_out : 0

    if (cost > 0) runsWithCost += 1
    totalCost += cost
    totalCalls += calls
    totalTokensIn += tIn
    totalTokensOut += tOut

    const bot = pl.bot_id || 'unknown'
    if (!costByBot[bot]) costByBot[bot] = { cost_usd: 0, calls: 0 }
    costByBot[bot].cost_usd += cost
    costByBot[bot].calls += calls

    if (pl.cost_by_model) {
      for (const [m, v] of Object.entries(pl.cost_by_model)) {
        if (!costByModel[m]) costByModel[m] = { cost_usd: 0, calls: 0 }
        costByModel[m].cost_usd += v.cost_usd || 0
        costByModel[m].calls += v.calls || 0
      }
    }
  }

  // EspoCRM funnel counts (createdAt-windowed). Snapshot stages (active/churned) are
  // unwindowed because they reflect current state.
  const [
    leadsCount,
    auditScheduledCount,
    auditCompleteCount,
    proposalSentCount,
    proposalSignedCount,
    activeCount,
    churnedCount,
  ] = await Promise.all([
    espocrmCount('Lead', [{ attribute: 'createdAt', type: 'greaterThanOrEquals', value: start }]),
    espocrmCount('Lead', [
      { attribute: 'createdAt', type: 'greaterThanOrEquals', value: start },
      { attribute: 'status', type: 'in', value: [...STAGE_MAP.AUDIT_SCHEDULED] },
    ]),
    espocrmCount('Lead', [
      { attribute: 'createdAt', type: 'greaterThanOrEquals', value: start },
      { attribute: 'status', type: 'in', value: [...STAGE_MAP.AUDIT_COMPLETE] },
    ]),
    espocrmCount('Opportunity', [
      { attribute: 'createdAt', type: 'greaterThanOrEquals', value: start },
      { attribute: 'stage', type: 'in', value: [...STAGE_MAP.PROPOSAL_SENT_OPP] },
    ]),
    espocrmCount('Opportunity', [
      { attribute: 'createdAt', type: 'greaterThanOrEquals', value: start },
      { attribute: 'stage', type: 'in', value: [...STAGE_MAP.PROPOSAL_SIGNED_OPP] },
    ]),
    espocrmCount('Opportunity', [{ attribute: 'stage', type: 'in', value: [...STAGE_MAP.ACTIVE_OPP] }]),
    espocrmCount('Opportunity', [{ attribute: 'stage', type: 'in', value: [...STAGE_MAP.CHURNED_OPP] }]),
  ])

  const { total: totalSignedAmount, count: signedCount } = await espocrmOpportunityAmount(
    start,
    STAGE_MAP.PROPOSAL_SIGNED_OPP
  )

  // Surface gap-warnings honestly
  if (botRuns.length > 0 && runsWithCost === 0) {
    warnings.push(
      `bot_runs has ${botRuns.length} entries in window but 0 have cost_usd. ` +
        `Cost-tracking instrumentation hasn't shipped yet — cost-per-stage will be 0.`
    )
  }
  if (leadsCount === 0 && botRuns.length > 0) {
    warnings.push('EspoCRM returned 0 leads in window despite bot activity — confirm Lead.createdAt filter and stage names.')
  }
  warnings.push(
    'Stage mapping is approximate. EspoCRM lacks explicit Audit Scheduled/Proposal Sent stages — using Lead.status proxies (Assigned, In Process) and Opportunity.stage in {Lead, Active}.'
  )

  // Compute unit economics
  const costPerLead = safeDiv(totalCost, leadsCount)
  const costPerAuditScheduled = safeDiv(totalCost, auditScheduledCount)
  const costPerAuditComplete = safeDiv(totalCost, auditCompleteCount)
  const costPerProposalSent = safeDiv(totalCost, proposalSentCount)
  const costPerSignedDeal = safeDiv(totalCost, proposalSignedCount)

  const leadToAuditPct = safePct(auditScheduledCount, leadsCount)
  const auditToProposalPct = safePct(proposalSentCount, auditCompleteCount)
  const proposalToSignedPct = safePct(proposalSignedCount, proposalSentCount)
  const overallPct = safePct(proposalSignedCount, leadsCount)

  const avgDeal = safeDiv(totalSignedAmount, signedCount)

  // Payback: rough estimate using avg deal amount as monthly-revenue proxy.
  // True LTV needs subscription tier/MRR data; this is the best signal we have today.
  let estimatedPaybackDays: number | null = null
  if (costPerSignedDeal !== null && avgDeal !== null && avgDeal > 0) {
    const monthsToPayback = costPerSignedDeal / avgDeal
    estimatedPaybackDays = Math.round(monthsToPayback * 30 * 10) / 10
  }

  return {
    window,
    window_start: start,
    window_end: end,
    cohort_id: cohortId,

    total_cost_usd: Math.round(totalCost * 10000) / 10000,
    total_api_calls: totalCalls,
    total_tokens_in: totalTokensIn,
    total_tokens_out: totalTokensOut,
    bot_runs_count: botRuns.length,
    bot_runs_with_cost: runsWithCost,
    cost_by_bot: costByBot,
    cost_by_model: costByModel,

    leads_count: leadsCount,
    audit_scheduled_count: auditScheduledCount,
    audit_complete_count: auditCompleteCount,
    proposal_sent_count: proposalSentCount,
    proposal_signed_count: proposalSignedCount,
    active_customers_count: activeCount,
    churned_count: churnedCount,

    cost_per_lead: costPerLead,
    cost_per_audit_scheduled: costPerAuditScheduled,
    cost_per_audit_complete: costPerAuditComplete,
    cost_per_proposal_sent: costPerProposalSent,
    cost_per_signed_deal: costPerSignedDeal,

    lead_to_audit_pct: leadToAuditPct,
    audit_to_proposal_pct: auditToProposalPct,
    proposal_to_signed_pct: proposalToSignedPct,
    overall_lead_to_customer_pct: overallPct,

    total_signed_amount_usd: Math.round(totalSignedAmount * 100) / 100,
    avg_deal_size_usd: avgDeal,

    estimated_payback_days: estimatedPaybackDays,

    has_data: botRuns.length > 0 || leadsCount > 0 || activeCount > 0,
    warnings,
  }
}
