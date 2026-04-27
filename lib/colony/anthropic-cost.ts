/**
 * Anthropic Admin API cost reporter.
 *
 * Calls GET /v1/organizations/cost_report and returns the org's total spend
 * for a window. Used as the source of truth for the colony cost cards when
 * ANTHROPIC_ADMIN_KEY is configured — the org-billed number can't drift from
 * per-bot instrumentation.
 *
 * Note on units: the API returns `amount` as a string in the **smallest unit**
 * of `currency` (cents for USD), not dollars. Empirically verified by summing
 * full account history against known wallet balance.
 */

import { windowToUtcDayISO, type TimeWindow } from './time-window'

const ANTHROPIC_API = 'https://api.anthropic.com'
const ANTHROPIC_VERSION = '2023-06-01'

interface CostBucket {
  starting_at: string
  ending_at: string
  results: Array<{
    currency?: string
    amount?: string
    workspace_id?: string | null
    model?: string | null
    cost_type?: string | null
  }>
}

interface CostReportResponse {
  data: CostBucket[]
  has_more: boolean
  next_page: string | null
}

export interface AnthropicCostSummary {
  total_cost_usd: number
  daily: Array<{ date: string; cost_usd: number }>
  window_start: string
  window_end: string
  source: 'anthropic_admin_api'
  fetched_at: string
}

export function hasAnthropicAdminKey(): boolean {
  return !!(process.env.ANTHROPIC_ADMIN_KEY && process.env.ANTHROPIC_ADMIN_KEY.startsWith('sk-ant-admin'))
}

export async function fetchAnthropicCost(window: TimeWindow): Promise<AnthropicCostSummary | null> {
  const key = process.env.ANTHROPIC_ADMIN_KEY
  if (!key) return null

  // Anthropic only finalizes daily buckets after the UTC day closes, so the
  // 1d window can never return today's data — fall back to bot_runs (the
  // per-bot instrumentation, which is real-time).
  if (window === '1d') return null

  const { start, end } = windowToUtcDayISO(window)
  const daily: Array<{ date: string; cost_usd: number }> = []
  let totalCents = 0
  let nextPage: string | null = null
  let safety = 0

  while (safety < 50) {
    const params = new URLSearchParams({ starting_at: start, ending_at: end, limit: '31' })
    if (nextPage) params.set('page', nextPage)

    const resp = await fetch(`${ANTHROPIC_API}/v1/organizations/cost_report?${params.toString()}`, {
      headers: {
        'x-api-key': key,
        'anthropic-version': ANTHROPIC_VERSION,
      },
      cache: 'no-store',
    })
    if (!resp.ok) {
      throw new Error(`anthropic cost_report ${resp.status}: ${await resp.text().catch(() => '')}`)
    }
    const data: CostReportResponse = await resp.json()

    for (const bucket of data.data || []) {
      const cents = (bucket.results || []).reduce((sum, r) => sum + (parseFloat(r.amount || '0') || 0), 0)
      totalCents += cents
      daily.push({ date: bucket.starting_at.slice(0, 10), cost_usd: cents / 100 })
    }

    if (!data.has_more || !data.next_page) break
    nextPage = data.next_page
    safety += 1
  }

  return {
    total_cost_usd: Math.round((totalCents / 100) * 10000) / 10000,
    daily,
    window_start: start,
    window_end: end,
    source: 'anthropic_admin_api',
    fetched_at: new Date().toISOString(),
  }
}
