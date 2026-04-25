import { ColonyFetchError } from './contracts'
import type { BotPayload, BotRunPayload } from './contracts'
import type { Cohort } from '@/app/colony/lib/types'

const QDRANT_URL = process.env.COLONY_QDRANT_URL

export async function fetchBotsFromRuns(cohortId: Cohort): Promise<BotPayload[]> {
  if (!QDRANT_URL) {
    throw new ColonyFetchError('qdrant', null, 'COLONY_QDRANT_URL not set')
  }

  try {
    const res = await fetch(`${QDRANT_URL}/collections/bot_runs/points/scroll`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        limit: 200,
        with_payload: true,
        filter: {
          must: [{ key: 'cohort_id', match: { value: cohortId } }],
        },
      }),
      signal: AbortSignal.timeout(5000),
    })

    if (res.status === 404) return []

    if (!res.ok) {
      throw new ColonyFetchError('qdrant', res.status, `Qdrant bot_runs fetch failed: ${res.statusText}`)
    }

    const data = await res.json()
    const runs: BotRunPayload[] = (data.result?.points ?? []).map(
      (p: { payload: BotRunPayload }) => p.payload
    )

    const byBot = new Map<string, BotRunPayload>()
    const decisionsByBot = new Map<string, number>()
    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000

    for (const run of runs) {
      const existing = byBot.get(run.bot_id)
      if (!existing || new Date(run.ran_at) > new Date(existing.ran_at)) {
        byBot.set(run.bot_id, run)
      }
      if (new Date(run.ran_at).getTime() >= oneWeekAgo) {
        decisionsByBot.set(run.bot_id, (decisionsByBot.get(run.bot_id) ?? 0) + run.decisions_count)
      }
    }

    const bots: BotPayload[] = []
    for (const [botId, lastRun] of byBot.entries()) {
      bots.push({
        id: botId,
        cohort_id: cohortId,
        name: lastRun.bot_name,
        role: lastRun.bot_role,
        avatar_emoji: lastRun.avatar_emoji,
        last_run_at: lastRun.ran_at,
        last_output_summary: lastRun.summary,
        decisions_this_week: decisionsByBot.get(botId) ?? 0,
      })
    }

    return bots
  } catch (err) {
    if (err instanceof ColonyFetchError) throw err
    throw new ColonyFetchError('qdrant', null, err instanceof Error ? err.message : 'Unknown')
  }
}
