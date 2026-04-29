/**
 * External API cost fetcher — sums external_cost_plan_a_usd across bot_runs
 * within a calendar-aligned window. Plan A is the small-volume tier
 * (Outscraper starter, Firecrawl hobby, Instantly nano) — what the operator
 * actually pays today.
 *
 * The window aligns to local-calendar day boundaries via time-window helpers,
 * so the 1d card resets at 12:00 AM Eastern.
 */

import { startOfDayInTz, type TimeWindow } from './time-window'

interface BotRunCostPayload {
  cohort_id?: string
  ran_at?: string
  ran_at_unix?: number
  external_cost_plan_a_usd?: number
  external_cost_plan_b_usd?: number
  external_api_call_count?: number
  external_cost_breakdown?: Record<string, { plan_a_usd?: number; plan_b_usd?: number; calls?: number; units?: number }>
}

export interface ExternalCostSummary {
  window: TimeWindow
  window_start_iso: string
  cohort_id: string
  total_plan_a_usd: number
  total_plan_b_usd: number
  total_api_calls: number
  bot_runs_with_cost: number
  bot_runs_total: number
  by_service: Record<string, { plan_a_usd: number; plan_b_usd: number; calls: number }>
  has_data: boolean
}

const QDRANT_URL = process.env.COLONY_QDRANT_URL || process.env.QDRANT_URL || 'http://localhost:6333'
const DEFAULT_COHORT = process.env.COLONY_COHORT_ID || 'aiandwebservices'

async function scrollBotRunsCosts(cohortId: string, startMs: number): Promise<BotRunCostPayload[]> {
  const out: BotRunCostPayload[] = []
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
        cache: 'no-store',
      })
    } catch {
      break
    }
    if (!resp.ok) break
    const data = await resp.json()
    const points: Array<{ payload?: BotRunCostPayload }> = data.result?.points || []

    for (const p of points) {
      const pl = p.payload || {}
      const ranAt = pl.ran_at ? new Date(pl.ran_at).getTime() : 0
      if (ranAt >= startMs) out.push(pl)
    }

    nextOffset = data.result?.next_page_offset ?? null
    if (nextOffset === null) break
    safety += 1
  }

  return out
}

/**
 * Returns the summed Plan A external API cost (Outscraper + Firecrawl + Instantly,
 * priced at the small-volume tier) across all bot_runs in the calendar window.
 *
 * `1d` = today since 12:00 AM Eastern; `7d` = since 12:00 AM Eastern, 6 days ago
 * (covers today + the previous six full calendar days).
 */
export async function getExternalCostSummary(
  window: TimeWindow,
  cohortId: string = DEFAULT_COHORT,
): Promise<ExternalCostSummary> {
  const daysAgo = window === '1d' ? 0 : window === '7d' ? 6 : window === '30d' ? 29 : window === '90d' ? 89 : 365
  const start = startOfDayInTz(daysAgo)
  const startMs = start.getTime()

  const runs = await scrollBotRunsCosts(cohortId, startMs)

  let totalA = 0
  let totalB = 0
  let totalCalls = 0
  let runsWithCost = 0
  const byService: Record<string, { plan_a_usd: number; plan_b_usd: number; calls: number }> = {}

  for (const r of runs) {
    const a = typeof r.external_cost_plan_a_usd === 'number' ? r.external_cost_plan_a_usd : 0
    const b = typeof r.external_cost_plan_b_usd === 'number' ? r.external_cost_plan_b_usd : 0
    const calls = typeof r.external_api_call_count === 'number' ? r.external_api_call_count : 0
    if (a > 0 || b > 0 || calls > 0) runsWithCost += 1
    totalA += a
    totalB += b
    totalCalls += calls

    const breakdown = r.external_cost_breakdown
    if (breakdown && typeof breakdown === 'object') {
      for (const [svc, v] of Object.entries(breakdown)) {
        if (!byService[svc]) byService[svc] = { plan_a_usd: 0, plan_b_usd: 0, calls: 0 }
        byService[svc].plan_a_usd += v?.plan_a_usd || 0
        byService[svc].plan_b_usd += v?.plan_b_usd || 0
        byService[svc].calls += v?.calls || 0
      }
    }
  }

  return {
    window,
    window_start_iso: start.toISOString(),
    cohort_id: cohortId,
    total_plan_a_usd: Math.round(totalA * 10000) / 10000,
    total_plan_b_usd: Math.round(totalB * 10000) / 10000,
    total_api_calls: totalCalls,
    bot_runs_with_cost: runsWithCost,
    bot_runs_total: runs.length,
    by_service: byService,
    has_data: runsWithCost > 0,
  }
}
