/**
 * Customer-facing KPIs — outcome metrics for paying customers, not operational internals.
 *
 * Stage mapping (memory → real EspoCRM values):
 *   Won  → Opportunity.stage = Active
 *   Lost → Opportunity.stage in {Churned, Lost}  (currently absent in EspoCRM)
 *   Pipeline → all Opportunities not in {Active churned/lost set}
 *   Active MRR → Opportunity.stage = Active
 *   Proposal Sent → Opportunity.stage = Lead   (proxy: opp created = proposal in flight)
 *
 * Response time = minutes from Lead.createdAt to first Note of type=Post
 * (filtering out auto-generated 'Create'/'Update'/'Status' system notes).
 */

export interface CustomerKPIs {
  // Leads pace
  leads_this_month: number
  monthly_lead_target: number
  leads_pace_pct: number | null
  days_remaining_in_month: number
  projected_month_end_leads: number | null

  // Response time
  median_response_minutes: number | null
  response_sample_size: number

  // Pipeline value
  pipeline_value_usd: number
  pipeline_deal_count: number

  // Expected value
  active_mrr_usd: number
  proposal_sent_value_usd: number
  assumed_close_rate_pct: number
  expected_12mo_value_usd: number

  // Win rate
  wins_30d: number
  losses_30d: number
  win_rate_pct: number | null

  // Forward-looking signals
  customer_health_score: number | null  // 0-100
  health_grade: 'A' | 'B' | 'C' | 'D' | 'F' | null
  at_risk_signals: string[]
  projected_monthly_revenue_usd: number
  expected_next_deal_days: number | null

  // Meta
  cohort_id: string
  computed_at: string
  has_data: boolean
  warnings: string[]
}

const ESPOCRM_URL = (process.env.COLONY_ESPOCRM_URL || process.env.ESPOCRM_URL || 'http://localhost:8080').replace(/\/$/, '')
const ESPOCRM_API_KEY = process.env.COLONY_ESPOCRM_API_KEY || process.env.ESPOCRM_API_KEY || ''

const DEFAULT_TARGETS_BY_TIER: Record<string, number> = {
  revenue_engine: 30,
  ai_first: 60,
  aiandwebservices: 100,
  default: 20,
}

const DEFAULT_ASSUMED_CLOSE_RATE_PCT = 30

// Real EspoCRM stages (mirrors the FIX12 stage mapping)
const SIGNED_STAGES = ['Active'] as const
const LOST_STAGES = ['Churned', 'Lost'] as const  // not currently used in EspoCRM but harmless
const PROPOSAL_SENT_STAGES = ['Lead'] as const   // Opportunity at "Lead" stage = proposal in flight
const ACTIVE_MRR_STAGES = ['Active'] as const

interface EspocrmLead {
  id: string
  createdAt: string
  status?: string
}

interface EspocrmOpportunity {
  id: string
  stage: string
  amount: number | null
  createdAt: string
}

async function espocrmGet<T = unknown>(entity: string, params: Record<string, string>): Promise<T | null> {
  if (!ESPOCRM_API_KEY) return null
  try {
    const url = new URL(`${ESPOCRM_URL}/api/v1/${entity}`)
    for (const [k, v] of Object.entries(params)) {
      url.searchParams.set(k, v)
    }
    const resp = await fetch(url.toString(), { headers: { 'X-Api-Key': ESPOCRM_API_KEY } })
    if (!resp.ok) return null
    return (await resp.json()) as T
  } catch {
    return null
  }
}

function startOfMonth(): Date {
  const now = new Date()
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1))
}

function daysRemainingInMonth(): number {
  const now = new Date()
  const endOfMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0, 23, 59, 59))
  return Math.max(0, Math.ceil((endOfMonth.getTime() - now.getTime()) / 86400000))
}

export async function fetchCustomerKPIs(cohortId = 'aiandwebservices'): Promise<CustomerKPIs> {
  const computedAt = new Date().toISOString()
  const warnings: string[] = []

  const monthlyTarget = DEFAULT_TARGETS_BY_TIER[cohortId] || DEFAULT_TARGETS_BY_TIER.default

  const empty: CustomerKPIs = {
    leads_this_month: 0,
    monthly_lead_target: monthlyTarget,
    leads_pace_pct: null,
    days_remaining_in_month: daysRemainingInMonth(),
    projected_month_end_leads: null,
    median_response_minutes: null,
    response_sample_size: 0,
    pipeline_value_usd: 0,
    pipeline_deal_count: 0,
    active_mrr_usd: 0,
    proposal_sent_value_usd: 0,
    assumed_close_rate_pct: DEFAULT_ASSUMED_CLOSE_RATE_PCT,
    expected_12mo_value_usd: 0,
    wins_30d: 0,
    losses_30d: 0,
    win_rate_pct: null,
    customer_health_score: null,
    health_grade: null,
    at_risk_signals: [],
    projected_monthly_revenue_usd: 0,
    expected_next_deal_days: null,
    cohort_id: cohortId,
    computed_at: computedAt,
    has_data: false,
    warnings,
  }

  if (!ESPOCRM_API_KEY) {
    warnings.push('ESPOCRM_API_KEY not configured — KPIs unavailable.')
    return empty
  }

  const monthStart = startOfMonth().toISOString()
  const daysLeft = daysRemainingInMonth()
  const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000).toISOString()

  // 1. Leads this month
  const leadsThisMonthResp = await espocrmGet<{ total: number; list: EspocrmLead[] }>('Lead', {
    'where[0][type]': 'greaterThanOrEquals',
    'where[0][attribute]': 'createdAt',
    'where[0][value]': monthStart,
    select: 'id,createdAt,status',
    maxSize: '500',
  })
  const leadsThisMonth = leadsThisMonthResp?.list || []
  const leadsCount = leadsThisMonthResp?.total ?? leadsThisMonth.length

  // 2. Median response time — for leads in last 30 days
  // Filter for type=Post (real human notes), not auto-generated Create/Update/Status
  const recentLeadsResp = await espocrmGet<{ list: EspocrmLead[] }>('Lead', {
    'where[0][type]': 'greaterThanOrEquals',
    'where[0][attribute]': 'createdAt',
    'where[0][value]': thirtyDaysAgo,
    select: 'id,createdAt',
    maxSize: '200',
  })
  const recentLeads = recentLeadsResp?.list || []

  const responseMinutes: number[] = []
  const CHUNK = 20
  for (let i = 0; i < recentLeads.length; i += CHUNK) {
    const chunk = recentLeads.slice(i, i + CHUNK)
    const results = await Promise.all(
      chunk.map(async (lead) => {
        const noteResp = await espocrmGet<{ list: Array<{ createdAt: string; type: string }> }>('Note', {
          'where[0][type]': 'equals',
          'where[0][attribute]': 'parentId',
          'where[0][value]': lead.id,
          'where[1][type]': 'equals',
          'where[1][attribute]': 'parentType',
          'where[1][value]': 'Lead',
          'where[2][type]': 'equals',
          'where[2][attribute]': 'type',
          'where[2][value]': 'Post',
          select: 'createdAt,type',
          orderBy: 'createdAt',
          order: 'asc',
          maxSize: '1',
        })
        const firstNote = noteResp?.list?.[0]
        if (!firstNote) return null
        const elapsed = (new Date(firstNote.createdAt).getTime() - new Date(lead.createdAt).getTime()) / 60000
        return elapsed >= 0 ? elapsed : null
      })
    )
    for (const r of results) {
      if (r !== null) responseMinutes.push(r)
    }
  }
  responseMinutes.sort((a, b) => a - b)
  const medianResponse =
    responseMinutes.length === 0
      ? null
      : Math.round(responseMinutes[Math.floor(responseMinutes.length / 2)] * 10) / 10

  // 3. Pipeline value — all opportunities not in lost/churned
  const pipelineResp = await espocrmGet<{ list: EspocrmOpportunity[] }>('Opportunity', {
    'where[0][type]': 'notIn',
    'where[0][attribute]': 'stage',
    'where[0][value][0]': 'Churned',
    'where[0][value][1]': 'Lost',
    select: 'id,stage,amount',
    maxSize: '200',
  })
  const opps = pipelineResp?.list || []

  let pipelineValue = 0
  let activeMrr = 0
  let proposalSentValue = 0
  const pipelineDealCount = opps.length

  for (const o of opps) {
    const amt = o.amount || 0
    pipelineValue += amt
    if ((ACTIVE_MRR_STAGES as readonly string[]).includes(o.stage)) activeMrr += amt
    if ((PROPOSAL_SENT_STAGES as readonly string[]).includes(o.stage)) proposalSentValue += amt
  }

  // 4. Expected 12-month value
  const expected12mo = activeMrr * 12 + (proposalSentValue * DEFAULT_ASSUMED_CLOSE_RATE_PCT) / 100 * 12

  // 5. Win rate (last 30d, by Opportunity.modifiedAt)
  const winsResp = await espocrmGet<{ total: number }>('Opportunity', {
    'where[0][type]': 'in',
    'where[0][attribute]': 'stage',
    ...Object.fromEntries(SIGNED_STAGES.map((s, i) => [`where[0][value][${i}]`, s])),
    'where[1][type]': 'greaterThanOrEquals',
    'where[1][attribute]': 'modifiedAt',
    'where[1][value]': thirtyDaysAgo,
    select: 'id',
    maxSize: '1',
  })
  const wins30d = winsResp?.total || 0

  const lossesResp = await espocrmGet<{ total: number }>('Opportunity', {
    'where[0][type]': 'in',
    'where[0][attribute]': 'stage',
    ...Object.fromEntries(LOST_STAGES.map((s, i) => [`where[0][value][${i}]`, s])),
    'where[1][type]': 'greaterThanOrEquals',
    'where[1][attribute]': 'modifiedAt',
    'where[1][value]': thirtyDaysAgo,
    select: 'id',
    maxSize: '1',
  })
  const losses30d = lossesResp?.total || 0

  const winRate =
    wins30d + losses30d === 0 ? null : Math.round((wins30d / (wins30d + losses30d)) * 1000) / 10

  // Pace
  const leadsPace =
    monthlyTarget === 0 ? null : Math.round((leadsCount / monthlyTarget) * 1000) / 10
  const daysSoFar = new Date().getUTCDate()
  const projected =
    daysSoFar === 0 ? null : Math.round((leadsCount / daysSoFar) * (daysSoFar + daysLeft))

  // Stage-mapping warning (mirrors FIX12 honesty)
  warnings.push(
    'Stage mapping is approximate. EspoCRM lacks explicit Proposal Sent / Churned / Lost stages — using Opportunity.stage in {Lead, Active} as proxies.'
  )

  // ============================================
  // FORWARD-LOOKING SIGNALS (FIX #29)
  // ============================================

  let healthScore: number | null = null
  const atRiskSignals: string[] = []

  if (leadsCount > 0 || pipelineDealCount > 0) {
    // Component 1: Response time (25%)
    let responseScore = 50
    if (medianResponse !== null) {
      if (medianResponse < 5) responseScore = 100
      else if (medianResponse < 60) responseScore = 85
      else if (medianResponse < 1440) responseScore = 65
      else if (medianResponse < 4320) responseScore = 40
      else {
        responseScore = 20
        atRiskSignals.push(`Response time >3 days (median ${Math.round(medianResponse / 1440)}d)`)
      }
    }

    // Component 2: Win rate (25%)
    let winScore = 50
    if (winRate !== null) {
      if (winRate >= 50) winScore = 100
      else if (winRate >= 30) winScore = 80
      else if (winRate >= 15) winScore = 60
      else {
        winScore = 30
        atRiskSignals.push(`Win rate ${winRate}% (below industry benchmark)`)
      }
    }

    // Component 3: Pace vs target (25%)
    let paceScore = 50
    if (leadsPace !== null) {
      if (leadsPace >= 100) paceScore = 100
      else if (leadsPace >= 70) paceScore = 80
      else if (leadsPace >= 40) paceScore = 55
      else {
        paceScore = 30
        atRiskSignals.push(`Lead pace ${leadsPace}% of target`)
      }
    }

    // Component 4: Active pipeline activity (25%)
    const activeCount = opps.filter(o => (ACTIVE_MRR_STAGES as readonly string[]).includes(o.stage)).length
    let activityScore = 50
    if (activeCount >= 3 || wins30d >= 1) activityScore = 100
    else if (pipelineDealCount >= 2) activityScore = 70
    else if (pipelineDealCount === 1) activityScore = 40
    else {
      activityScore = 20
      atRiskSignals.push('No active deals in pipeline')
    }

    healthScore = Math.round(
      responseScore * 0.25 +
      winScore * 0.25 +
      paceScore * 0.25 +
      activityScore * 0.25
    )

    if (losses30d > wins30d && losses30d >= 2) {
      atRiskSignals.push(`More losses than wins last 30d (${losses30d}L / ${wins30d}W)`)
    }
  }

  const healthGrade: CustomerKPIs['health_grade'] =
    healthScore === null ? null :
    healthScore >= 90 ? 'A' :
    healthScore >= 80 ? 'B' :
    healthScore >= 65 ? 'C' :
    healthScore >= 50 ? 'D' : 'F'

  const projectedMonthlyRevenue = activeMrr

  let expectedNextDealDays: number | null = null
  if (wins30d > 0) {
    expectedNextDealDays = Math.round(30 / wins30d)
  }

  return {
    customer_health_score: healthScore,
    health_grade: healthGrade,
    at_risk_signals: atRiskSignals,
    projected_monthly_revenue_usd: Math.round(projectedMonthlyRevenue * 100) / 100,
    expected_next_deal_days: expectedNextDealDays,
    leads_this_month: leadsCount,
    monthly_lead_target: monthlyTarget,
    leads_pace_pct: leadsPace,
    days_remaining_in_month: daysLeft,
    projected_month_end_leads: projected,
    median_response_minutes: medianResponse,
    response_sample_size: responseMinutes.length,
    pipeline_value_usd: Math.round(pipelineValue * 100) / 100,
    pipeline_deal_count: pipelineDealCount,
    active_mrr_usd: Math.round(activeMrr * 100) / 100,
    proposal_sent_value_usd: Math.round(proposalSentValue * 100) / 100,
    assumed_close_rate_pct: DEFAULT_ASSUMED_CLOSE_RATE_PCT,
    expected_12mo_value_usd: Math.round(expected12mo * 100) / 100,
    wins_30d: wins30d,
    losses_30d: losses30d,
    win_rate_pct: winRate,
    cohort_id: cohortId,
    computed_at: computedAt,
    has_data: leadsCount > 0 || pipelineDealCount > 0,
    warnings,
  }
}
