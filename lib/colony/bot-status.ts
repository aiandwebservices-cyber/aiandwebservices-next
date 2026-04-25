/**
 * Bot status fetcher — reads latest heartbeat per bot_id from bot_runs.
 * Returns status tier for each bot for UI light indicators.
 */

export type StatusTier = 'running' | 'live' | 'online' | 'idle' | 'offline' | 'failed'

export interface BotStatus {
  bot_id: string
  bot_name?: string
  bot_role?: string
  avatar_emoji?: string
  status_tier: StatusTier
  last_heartbeat_at: string | null
  last_status: string | null
  last_summary: string | null
  decisions_count: number | null
  run_duration_seconds: number | null
  age_minutes: number | null
  started_at: string | null
  completed_at: string | null
  run_id: string | null
}

interface HeartbeatPoint {
  payload?: {
    bot_id?: string
    bot_name?: string
    bot_role?: string
    avatar_emoji?: string
    status?: string
    run_id?: string
    started_at?: string
    completed_at?: string
    ended_at?: string
    ran_at?: string
    summary?: string
    decisions_count?: number
    run_duration_seconds?: number
    cohort_id?: string
  }
}

function qdrantUrl(): string {
  return (process.env.COLONY_QDRANT_URL || process.env.QDRANT_URL || 'http://localhost:6333').replace(/\/$/, '')
}

const STATUS_THRESHOLDS = {
  LIVE_MIN: 30,   // normal green for 0–30 min after end heartbeat
  ONLINE_MIN: 60, // subtle green for 31–60 min after end heartbeat
  // after 60 min → offline (grey, no green)
}

function tierFromHeartbeat(ageMinutes: number | null, status: string | null): StatusTier {
  if (ageMinutes === null) return 'offline'
  if (status === 'running') return 'running'                      // strong green — actively running now
  if (status === 'failed' || status === 'error') return 'failed'
  if (ageMinutes < STATUS_THRESHOLDS.LIVE_MIN) return 'live'     // normal green — 0–30 min after end
  if (ageMinutes < STATUS_THRESHOLDS.ONLINE_MIN) return 'online' // subtle green — 31–60 min after end
  return 'offline'
}

/**
 * Fetch the latest heartbeat per bot_id for a cohort.
 * Scrolls bot_runs filtered by cohort_id, sorts client-side by timestamp desc, dedupes by bot_id.
 */
export async function fetchBotStatuses(cohortId = 'aiandwebservices'): Promise<Record<string, BotStatus>> {
  const out: Record<string, BotStatus> = {}
  let nextOffset: string | number | null = null
  let safety = 0
  const collected: HeartbeatPoint[] = []

  while (safety < 20) {
    const body: Record<string, unknown> = {
      limit: 250,
      with_payload: true,
      with_vector: false,
      filter: {
        must: [{ key: 'cohort_id', match: { value: cohortId } }],
      },
    }
    if (nextOffset !== null) body.offset = nextOffset

    let resp
    try {
      resp = await fetch(`${qdrantUrl()}/collections/bot_runs/points/scroll`, {
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
      collected.push({ payload: p.payload || {} })
    }
    nextOffset = data.result?.next_page_offset ?? null
    if (nextOffset === null) break
    safety += 1
  }

  // Sort by most-recent timestamp desc, then dedupe keeping first (latest) per bot_id.
  // For running bots, prefer the running point over any older completed point.
  collected.sort((a, b) => {
    const aRunning = a.payload?.status === 'running' ? 1 : 0
    const bRunning = b.payload?.status === 'running' ? 1 : 0
    if (aRunning !== bRunning) return bRunning - aRunning
    const aTs = a.payload?.completed_at || a.payload?.ended_at || a.payload?.ran_at || a.payload?.started_at || ''
    const bTs = b.payload?.completed_at || b.payload?.ended_at || b.payload?.ran_at || b.payload?.started_at || ''
    return bTs.localeCompare(aTs)
  })

  const now = Date.now()
  const seen = new Set<string>()

  for (const p of collected) {
    const pl = p.payload
    if (!pl || !pl.bot_id) continue
    if (seen.has(pl.bot_id)) continue
    seen.add(pl.bot_id)

    const lastTs = pl.completed_at || pl.ended_at || pl.ran_at || pl.started_at
    let ageMin: number | null = null
    if (lastTs) {
      ageMin = (now - new Date(lastTs).getTime()) / 60000
    }

    out[pl.bot_id] = {
      bot_id: pl.bot_id,
      bot_name: pl.bot_name,
      bot_role: pl.bot_role,
      avatar_emoji: pl.avatar_emoji,
      status_tier: tierFromHeartbeat(ageMin, pl.status || null),
      last_heartbeat_at: lastTs || null,
      last_status: pl.status || null,
      last_summary: pl.summary || null,
      decisions_count: pl.decisions_count ?? null,
      run_duration_seconds: pl.run_duration_seconds ?? null,
      age_minutes: ageMin === null ? null : Math.round(ageMin * 10) / 10,
      started_at: pl.started_at || null,
      completed_at: pl.completed_at || null,
      run_id: pl.run_id || null,
    }
  }

  return out
}

export async function fetchSingleBotStatus(botId: string, cohortId = 'aiandwebservices'): Promise<BotStatus | null> {
  const all = await fetchBotStatuses(cohortId)
  return all[botId] || null
}
