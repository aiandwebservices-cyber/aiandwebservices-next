'use client'

import { useEffect, useState } from 'react'
import { useCohort } from './CohortSwitcher'
import { colonyFetch } from '../lib/api-client'
import { formatLastRun } from '../lib/bot-helpers'
import type { BotPayload } from '@/lib/colony/contracts'
import BotCard from './BotCard'
import { BotStatusRing } from './BotStatusRing'
import { LoadingSkeleton } from './LoadingSkeleton'

export default function BotRoster() {
  const { cohortId } = useCohort()
  const [bots, setBots] = useState<BotPayload[] | null>(null)

  useEffect(() => {
    let cancelled = false
    colonyFetch<BotPayload[]>('bots', { cohortId }).then(res => {
      if (cancelled) return
      setBots(res.status === 'ok' && res.data ? res.data : [])
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

  if (bots.length === 0) {
    return (
      <section>
        <h2 className="colony-headline mb-3" style={{ fontSize: 22, letterSpacing: '-0.3px' }}>
          Your Crew
        </h2>
        <p className="text-sm" style={{ color: 'var(--colony-text-secondary)' }}>
          No agents have run yet. Run any pipeline to see the crew here.
        </p>
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
          <BotStatusRing key={bot.id} botId={bot.id} intensity="subtle" className="shrink-0">
            <BotCard bot={bot} />
          </BotStatusRing>
        ))}
      </div>
    </section>
  )
}
