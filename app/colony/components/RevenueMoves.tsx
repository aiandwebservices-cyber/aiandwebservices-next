'use client'

import { useState, useEffect, useCallback } from 'react'
import { useCohort } from './CohortSwitcher'
import { deriveRevenueMoves } from '../lib/revenue-helpers'
import { colonyFetch } from '../lib/api-client'
import { LoadingSkeleton } from './LoadingSkeleton'
import { ErrorState } from './ErrorState'
import { StaleIndicator } from './StaleIndicator'
import { capture } from '../lib/posthog'
import RevenueMoveCard from './RevenueMoveCard'
import type { LeadPayload, DealPayload } from '@/lib/colony/contracts'

export function RevenueMoves() {
  const { cohortId } = useCohort()
  const [leads, setLeads] = useState<LeadPayload[] | null>(null)
  const [deals, setDeals] = useState<DealPayload[] | null>(null)
  const [status, setStatus] = useState<'loading' | 'ok' | 'stale' | 'error'>('loading')
  const [error, setError] = useState<string | null>(null)
  const [lastSuccess, setLastSuccess] = useState<string | null>(null)

  const load = useCallback(async () => {
    setStatus('loading')
    const [leadsRes, dealsRes] = await Promise.all([
      colonyFetch<LeadPayload[]>('leads', { cohortId }),
      colonyFetch<DealPayload[]>('deals', { cohortId }),
    ])

    const failed = leadsRes.status === 'degraded' || leadsRes.status === 'unauthorized' ||
                   dealsRes.status === 'degraded' || dealsRes.status === 'unauthorized'
    const anyStale = leadsRes.status === 'stale' || dealsRes.status === 'stale'

    if (failed) {
      const errMsg = leadsRes.error ?? dealsRes.error ?? 'Revenue data unavailable'
      setStatus('error')
      setError(errMsg)
      capture('colony_api_error', { resource: 'revenue-moves', error: errMsg })
      return
    }

    setLeads(leadsRes.data ?? [])
    setDeals(dealsRes.data ?? [])

    if (anyStale) {
      setStatus('stale')
      setLastSuccess(leadsRes.last_success ?? dealsRes.last_success ?? null)
      capture('colony_api_stale', { resource: 'revenue-moves' })
    } else {
      setStatus('ok')
      setLastSuccess(leadsRes.cached_at ?? new Date().toISOString())
    }
  }, [cohortId])

  useEffect(() => { load() }, [load])

  if (status === 'loading' && leads === null) {
    return (
      <div>
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="text-sm font-bold" style={{ color: 'var(--colony-text-primary)' }}>
            Today&apos;s Revenue Moves
          </h2>
        </div>
        <div className="space-y-3">
          <LoadingSkeleton variant="card" count={3} />
        </div>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div>
        <h2 className="text-sm font-bold mb-3" style={{ color: 'var(--colony-text-primary)' }}>
          Today&apos;s Revenue Moves
        </h2>
        <ErrorState message={error ?? undefined} onRetry={load} />
      </div>
    )
  }

  const moves = deriveRevenueMoves(leads ?? [], deals ?? [])

  return (
    <div>
      <div className="flex items-baseline justify-between mb-4">
        <h2 className="text-sm font-bold" style={{ color: 'var(--colony-text-primary)' }}>
          Today&apos;s Revenue Moves
        </h2>
        <div className="flex items-center gap-2">
          {status === 'stale' && <StaleIndicator lastSuccessAt={lastSuccess ?? undefined} />}
          <span className="text-xs" style={{ color: 'var(--colony-text-secondary)', opacity: 0.5 }}>
            as of {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>

      {moves.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="text-4xl mb-3" style={{ color: 'var(--colony-success)' }}>✓</div>
          <p className="text-sm font-semibold" style={{ color: 'var(--colony-text-primary)' }}>
            You&apos;re ahead of everything.
          </p>
          <p className="text-xs mt-1" style={{ color: 'var(--colony-text-secondary)' }}>Nice.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {moves.map(move => (
            <RevenueMoveCard key={move.id} move={move} />
          ))}
        </div>
      )}
    </div>
  )
}
