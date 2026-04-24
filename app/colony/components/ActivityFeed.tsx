'use client'

import { useCohort } from './CohortSwitcher'
import { getFeedForCohort } from '../lib/mock-data'
import { groupByRecency } from '../lib/feed-helpers'
import FeedEventRow from './FeedEventRow'

export function ActivityFeed() {
  const { cohortId } = useCohort()
  const events = getFeedForCohort(cohortId)
  const groups = groupByRecency(events)

  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div
          className="text-5xl mb-4 opacity-30"
          style={{ color: 'var(--colony-accent)' }}
        >
          ◎
        </div>
        <p className="text-sm font-medium" style={{ color: 'var(--colony-text-secondary)' }}>
          Your crew hasn&apos;t run yet today.
        </p>
        <p className="text-xs mt-1" style={{ color: 'var(--colony-text-secondary)', opacity: 0.6 }}>
          Next pipeline run at 3:00pm.
        </p>
      </div>
    )
  }

  let runningIndex = 0

  return (
    <div className="space-y-5">
      {groups.map(group => (
        <div key={group.label}>
          <p
            className="text-xs font-bold uppercase tracking-widest px-4 mb-1"
            style={{ color: 'var(--colony-text-secondary)', opacity: 0.5 }}
          >
            {group.label}
          </p>
          <div>
            {group.events.map(event => {
              const idx = runningIndex++
              return <FeedEventRow key={event.id} event={event} index={idx} />
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
