'use client'

import { useEffect, useState, useCallback } from 'react'
import { useCohort } from './CohortSwitcher'
import { groupByRecency } from '../lib/feed-helpers'
import { colonyFetch } from '../lib/api-client'
import { LoadingSkeleton } from './LoadingSkeleton'
import { ErrorState } from './ErrorState'
import { StaleIndicator } from './StaleIndicator'
import { capture } from '../lib/posthog'
import FeedEventRow from './FeedEventRow'
import type { FeedEventPayload } from '@/lib/colony/contracts'

export function ActivityFeed() {
  const { cohortId } = useCohort()
  const [events, setEvents] = useState<FeedEventPayload[] | null>(null)
  const [status, setStatus] = useState<'loading' | 'ok' | 'stale' | 'error'>('loading')
  const [error, setError] = useState<string | null>(null)
  const [lastSuccess, setLastSuccess] = useState<string | null>(null)

  const load = useCallback(async () => {
    setStatus('loading')
    const res = await colonyFetch<FeedEventPayload[]>('feed', { cohortId })
    if (res.status === 'ok') {
      setEvents(res.data ?? [])
      setStatus('ok')
      setLastSuccess(res.cached_at ?? new Date().toISOString())
    } else if (res.status === 'stale') {
      setEvents(res.data ?? [])
      setStatus('stale')
      setLastSuccess(res.last_success ?? null)
      capture('colony_api_stale', { resource: 'feed' })
    } else {
      setStatus('error')
      setError(res.error ?? 'Feed unavailable')
      if (res.status !== 'unauthorized') {
        capture('colony_api_error', { resource: 'feed', error: res.error })
      }
    }
  }, [cohortId])

  useEffect(() => { load() }, [load])

  if (status === 'loading' && events === null) {
    return <LoadingSkeleton variant="feed-row" count={5} />
  }

  if (status === 'error') {
    return <ErrorState message={error ?? undefined} onRetry={load} />
  }

  const safeEvents = events ?? []

  if (safeEvents.length === 0) {
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

  const groups = groupByRecency(safeEvents)
  let runningIndex = 0

  return (
    <div className="space-y-5">
      {status === 'stale' && (
        <div className="px-4">
          <StaleIndicator lastSuccessAt={lastSuccess ?? undefined} />
        </div>
      )}
      {groups.map(group => (
        <div key={group.label}>
          <p
            className="colony-label px-4"
            style={{ color: 'rgba(255,255,255,.55)', margin: '12px 0 6px 0', fontSize: 11 }}
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
