'use client'

import { useCohort } from './CohortSwitcher'
import { getBotsForCohort } from '../lib/mock-data'
import { formatLastRun } from '../lib/bot-helpers'
import BotCard from './BotCard'

export default function BotRoster() {
  const { cohortId } = useCohort()
  const bots = getBotsForCohort(cohortId)

  const mostRecentRun = bots.reduce<string>((latest, bot) => {
    return bot.last_run_at > latest ? bot.last_run_at : latest
  }, bots[0]?.last_run_at ?? '')

  return (
    <section>
      <div className="mb-3">
        <h2 className="text-lg font-bold leading-tight" style={{ color: 'var(--colony-text-primary)' }}>
          Your Crew
        </h2>
        <p className="text-xs mt-0.5" style={{ color: 'var(--colony-text-secondary)' }}>
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
