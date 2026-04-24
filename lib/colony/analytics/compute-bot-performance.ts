import { ColonyFetchError } from '../contracts'
import type { BotsAnalyticsPayload, BotPerformanceRow, BotRunPayload } from '../contracts'

const WEEK_MS = 7 * 24 * 60 * 60 * 1000

function getMockBotPerformance(): BotsAnalyticsPayload {
  return {
    rows: [
      { bot_name: 'Fact Checker',     total_runs: 32, total_decisions: 512, avg_decisions_per_run: 16.0, weekly_decisions: [118, 128, 132, 134], trend: 'stable' },
      { bot_name: 'Bob',              total_runs: 28, total_decisions: 392, avg_decisions_per_run: 14.0, weekly_decisions: [88,   95, 102, 107], trend: 'up'     },
      { bot_name: 'Lead Researcher',  total_runs: 20, total_decisions: 240, avg_decisions_per_run: 12.0, weekly_decisions: [56,   62,  60,  62], trend: 'stable' },
      { bot_name: 'Scheduler',        total_runs: 24, total_decisions: 216, avg_decisions_per_run:  9.0, weekly_decisions: [48,   52,  56,  60], trend: 'up'     },
      { bot_name: 'Bill Nye',         total_runs: 24, total_decisions: 156, avg_decisions_per_run:  6.5, weekly_decisions: [32,   38,  41,  45], trend: 'up'     },
      { bot_name: 'Coach',            total_runs: 16, total_decisions:  96, avg_decisions_per_run:  6.0, weekly_decisions: [24,   22,  26,  24], trend: 'stable' },
      { bot_name: 'Archivist',        total_runs: 20, total_decisions:  80, avg_decisions_per_run:  4.0, weekly_decisions: [18,   20,  21,  21], trend: 'stable' },
      { bot_name: 'Harvester',        total_runs:  8, total_decisions:  24, avg_decisions_per_run:  3.0, weekly_decisions: [ 6,    6,   6,   6], trend: 'stable' },
    ],
  }
}

export async function computeBotPerformance(cohortId: string): Promise<BotsAnalyticsPayload> {
  if (cohortId === 'demo') return getMockBotPerformance()

  const qdrantUrl = process.env.COLONY_QDRANT_URL?.replace(/\/$/, '')
  if (!qdrantUrl) throw new ColonyFetchError('qdrant', null, 'COLONY_QDRANT_URL not set')

  let runs: BotRunPayload[] = []
  try {
    const res = await fetch(`${qdrantUrl}/collections/bot_runs/points/scroll`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        limit: 500,
        with_payload: true,
        filter: { must: [{ key: 'cohort_id', match: { value: cohortId } }] },
      }),
      signal: AbortSignal.timeout(5000),
    })
    if (res.status === 404) return { rows: [] }
    if (!res.ok) throw new ColonyFetchError('qdrant', res.status, 'bot_runs fetch failed')
    const data = await res.json()
    runs = ((data.result?.points ?? []) as Array<{ payload: BotRunPayload }>)
      .map(p => p.payload)
      .filter(r => r.bot_name && r.ran_at)
  } catch (err) {
    if (err instanceof ColonyFetchError) throw err
    throw new ColonyFetchError('qdrant', null, 'Qdrant unreachable')
  }

  const now = Date.now()
  // weekStarts[0] = 4 weeks ago, [3] = most recent week
  const weekStarts = [3, 2, 1, 0].map(i => now - (i + 1) * WEEK_MS)

  type BotBucket = { runs: BotRunPayload[]; weekBuckets: number[] }
  const byBot = new Map<string, BotBucket>()

  for (const run of runs) {
    const name = run.bot_name
    if (!byBot.has(name)) byBot.set(name, { runs: [], weekBuckets: [0, 0, 0, 0] })
    const entry = byBot.get(name)!
    entry.runs.push(run)
    const runTime = new Date(run.ran_at).getTime()
    for (let i = 0; i < 4; i++) {
      if (runTime >= weekStarts[i] && runTime < weekStarts[i] + WEEK_MS) {
        entry.weekBuckets[i] += run.decisions_count ?? 0
        break
      }
    }
  }

  const rows: BotPerformanceRow[] = []
  for (const [name, { runs: botRuns, weekBuckets }] of byBot.entries()) {
    const totalRuns      = botRuns.length
    const totalDecisions = botRuns.reduce((s, r) => s + (r.decisions_count ?? 0), 0)
    const last = weekBuckets[3]
    const prev = weekBuckets[2]
    const trend: BotPerformanceRow['trend'] = last > prev * 1.1 ? 'up' : last < prev * 0.9 ? 'down' : 'stable'
    rows.push({
      bot_name:              name,
      total_runs:            totalRuns,
      total_decisions:       totalDecisions,
      avg_decisions_per_run: totalRuns > 0 ? Math.round((totalDecisions / totalRuns) * 10) / 10 : 0,
      weekly_decisions:      weekBuckets,
      trend,
    })
  }

  return { rows: rows.sort((a, b) => b.total_decisions - a.total_decisions) }
}
