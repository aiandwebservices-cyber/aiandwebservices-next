'use client'

import { useEffect, useState } from 'react'
import { useCohort } from './CohortSwitcher'
import { colonyFetch } from '../lib/api-client'
import { getBotsForCohort } from '../lib/mock-data'
import { formatLastRun } from '../lib/bot-helpers'
import type { BotPayload } from '@/lib/colony/contracts'
import BotCard from './BotCard'
import { LoadingSkeleton } from './LoadingSkeleton'

export default function BotRoster() {
  const { cohortId } = useCohort()
  const [bots, setBots] = useState<BotPayload[] | null>(null)

  useEffect(() => {
    let cancelled = false
    colonyFetch<BotPayload[]>('bots', { cohortId }).then(res => {
      if (cancelled) return
      if (res.status === 'ok' && res.data && res.data.length > 0) {
        setBots(res.data)
      } else {
        // Real cohort with no heartbeats yet — fall back to static metadata so the
        // roster still displays before the first agent run writes to Qdrant.
        setBots(getBotsForCohort(cohortId))
      }
    })
    return () => { cancelled = true }
  }, [cohortId])

  if (!bots) {
    return (
      <section>
        <div className="mb-3">
          <h2 className="colony-headline" style={{ fontSize: 22, letterSpacing: '-0.3px' }}>
            Your Crew
          </h2>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2">
          <LoadingSkeleton variant="card" count={4} />
        </div>
      </section>
    )
  }

  const mostRecentRun = bots.reduce<string>((latest, bot) => {
    return bot.last_run_at > latest ? bot.last_run_at : latest
  }, bots[0]?.last_run_at ?? '')

  return (
    <section>
      <div className="mb-3">
        <h2 className="colony-headline" style={{ fontSize: 22, letterSpacing: '-0.3px' }}>
          Your Crew
        </h2>
        <p
          className="mt-1 flex items-center gap-2"
          style={{ fontSize: 12, color: 'var(--colony-text-secondary)' }}
        >
          <span className="colony-pulse" aria-hidden="true" />
          {bots.length} agents · Last run {mostRecentRun ? formatLastRun(mostRecentRun) : '—'}
        </p>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'thin' }}>
        {bots.map(bot => (
          <BotCard key={bot.id} bot={bot} />
        ))}
      </div>
    </section>
  )
}
