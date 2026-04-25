/**
 * Bill Nye accuracy fetcher.
 * Reads bill_nye_hypotheses, computes confirmation rate over time windows.
 */

interface HypothesisStatusEntry {
  status: string
  at: string
  notes?: string
}

interface Hypothesis {
  id: string
  hypothesis_text?: string
  current_status?: string
  status_history?: HypothesisStatusEntry[]
  proposed_at?: string
  resolved_at?: string
  cohort_id?: string
}

export interface AccuracyStats {
  total_hypotheses: number
  resolved_count: number
  confirmed_count: number
  invalidated_count: number
  expired_count: number
  pending_count: number
  accuracy_pct_30d: number | null
  accuracy_pct_all_time: number | null
  weekly_trend: Array<{
    week_start: string
    confirmed: number
    invalidated: number
    total_resolved: number
    accuracy: number | null
  }>
  has_data: boolean
}

function qdrantUrl(): string {
  return (process.env.COLONY_QDRANT_URL || process.env.QDRANT_URL || 'http://localhost:6333').replace(/\/$/, '')
}

async function qdrantScrollAll(collection: string, cohortId: string): Promise<Hypothesis[]> {
  const out: Hypothesis[] = []
  let nextOffset: string | number | null = null
  let safetyCounter = 0

  while (safetyCounter < 50) {
    const body: Record<string, unknown> = {
      limit: 100,
      with_payload: true,
      with_vector: false,
      filter: {
        must: [{ key: 'cohort_id', match: { value: cohortId } }],
      },
    }
    if (nextOffset !== null) body.offset = nextOffset

    let resp
    try {
      resp = await fetch(`${qdrantUrl()}/collections/${collection}/points/scroll`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
    } catch {
      break
    }
    if (!resp.ok) break
    const data = await resp.json()
    const points = data.result?.points || []

    for (const p of points) {
      out.push({ ...(p.payload as Hypothesis), id: String(p.id) })
    }

    nextOffset = data.result?.next_page_offset ?? null
    if (nextOffset === null) break
    safetyCounter += 1
  }

  return out
}

export async function fetchBillNyeAccuracy(cohortId = 'aiandwebservices'): Promise<AccuracyStats> {
  let hypotheses: Hypothesis[]
  try {
    hypotheses = await qdrantScrollAll('bill_nye_hypotheses', cohortId)
  } catch {
    return emptyStats()
  }

  if (hypotheses.length === 0) return emptyStats()

  let confirmed = 0
  let invalidated = 0
  let expired = 0
  let pending = 0

  const now = Date.now()
  const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000
  let confirmed30d = 0
  let resolved30d = 0

  // Weekly trend: 8 weeks back
  const weeklyBuckets: Record<string, { confirmed: number; invalidated: number; total_resolved: number }> = {}
  for (let i = 7; i >= 0; i -= 1) {
    const weekStart = new Date(now - i * 7 * 24 * 60 * 60 * 1000)
    weekStart.setUTCHours(0, 0, 0, 0)
    weekStart.setUTCDate(weekStart.getUTCDate() - weekStart.getUTCDay())
    const key = weekStart.toISOString().slice(0, 10)
    weeklyBuckets[key] = { confirmed: 0, invalidated: 0, total_resolved: 0 }
  }

  for (const h of hypotheses) {
    const status = (h.current_status || '').toUpperCase()

    if (status === 'CONFIRMED') confirmed += 1
    else if (status === 'INVALIDATED') invalidated += 1
    else if (status === 'EXPIRED') expired += 1
    else pending += 1

    const resolvedAt = h.resolved_at ? new Date(h.resolved_at).getTime() : null
    if (resolvedAt && (status === 'CONFIRMED' || status === 'INVALIDATED')) {
      if (resolvedAt >= thirtyDaysAgo) {
        resolved30d += 1
        if (status === 'CONFIRMED') confirmed30d += 1
      }

      const weekStart = new Date(resolvedAt)
      weekStart.setUTCHours(0, 0, 0, 0)
      weekStart.setUTCDate(weekStart.getUTCDate() - weekStart.getUTCDay())
      const key = weekStart.toISOString().slice(0, 10)
      if (weeklyBuckets[key]) {
        weeklyBuckets[key].total_resolved += 1
        if (status === 'CONFIRMED') weeklyBuckets[key].confirmed += 1
        else weeklyBuckets[key].invalidated += 1
      }
    }
  }

  const resolvedTotal = confirmed + invalidated

  return {
    total_hypotheses: hypotheses.length,
    resolved_count: resolvedTotal,
    confirmed_count: confirmed,
    invalidated_count: invalidated,
    expired_count: expired,
    pending_count: pending,
    accuracy_pct_30d: resolved30d > 0 ? Math.round((confirmed30d / resolved30d) * 1000) / 10 : null,
    accuracy_pct_all_time: resolvedTotal > 0 ? Math.round((confirmed / resolvedTotal) * 1000) / 10 : null,
    weekly_trend: Object.entries(weeklyBuckets)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([week_start, v]) => ({
        week_start,
        ...v,
        accuracy: v.total_resolved > 0 ? Math.round((v.confirmed / v.total_resolved) * 1000) / 10 : null,
      })),
    has_data: hypotheses.length > 0,
  }
}

function emptyStats(): AccuracyStats {
  return {
    total_hypotheses: 0,
    resolved_count: 0,
    confirmed_count: 0,
    invalidated_count: 0,
    expired_count: 0,
    pending_count: 0,
    accuracy_pct_30d: null,
    accuracy_pct_all_time: null,
    weekly_trend: [],
    has_data: false,
  }
}
