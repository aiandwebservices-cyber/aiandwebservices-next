'use client'

import { useEffect, useState, useCallback, Suspense } from 'react'
import { useCohort } from '../components/CohortSwitcher'
import { InboxFilters, useInboxFilters } from '../components/InboxFilters'
import { LeadRow } from '../components/LeadRow'
import { LoadingSkeleton } from '../components/LoadingSkeleton'
import { ErrorState } from '../components/ErrorState'
import { StaleIndicator } from '../components/StaleIndicator'
import { colonyFetch } from '../lib/api-client'
import { filterLeads, getUniqueNiches } from '../lib/lead-helpers'
import { capture } from '../lib/posthog'
import type { LeadPayload } from '@/lib/colony/contracts'

// Inside Suspense boundary — safe to use useSearchParams via useInboxFilters
function InboxContent() {
  const { cohortId } = useCohort()
  const { filters } = useInboxFilters()

  const [allLeads, setAllLeads] = useState<LeadPayload[] | null>(null)
  const [status, setStatus] = useState<'loading' | 'ok' | 'stale' | 'error'>('loading')
  const [error, setError] = useState<string | null>(null)
  const [lastSuccess, setLastSuccess] = useState<string | null>(null)

  const load = useCallback(async () => {
    setStatus('loading')
    const res = await colonyFetch<LeadPayload[]>('leads', { cohortId })
    if (res.status === 'ok') {
      setAllLeads(res.data ?? [])
      setStatus('ok')
      setLastSuccess(res.cached_at ?? new Date().toISOString())
    } else if (res.status === 'stale') {
      setAllLeads(res.data ?? [])
      setStatus('stale')
      setLastSuccess(res.last_success ?? null)
      capture('colony_api_stale', { resource: 'leads' })
    } else {
      setStatus('error')
      setError(res.error ?? 'Leads unavailable')
      if (res.status !== 'unauthorized') {
        capture('colony_api_error', { resource: 'leads', error: res.error })
      }
    }
  }, [cohortId])

  useEffect(() => { load() }, [load])

  const filtered = allLeads ? filterLeads(allLeads, filters) : []
  const niches = allLeads ? getUniqueNiches(allLeads) : []

  return (
    <main className="p-6 h-[calc(100vh-48px)] flex flex-col gap-4 overflow-hidden">
      <header>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--colony-text-primary)' }}>
          Lead Inbox
        </h1>
        <p className="text-sm" style={{ color: 'var(--colony-text-secondary)' }}>
          Your prospects, prioritized. Click any lead to see the full story.
        </p>
      </header>

      <InboxFilters niches={niches} />

      {status === 'stale' && (
        <StaleIndicator lastSuccessAt={lastSuccess ?? undefined} />
      )}

      <section
        className="flex-1 overflow-y-auto rounded-lg"
        style={{ border: '1px solid var(--colony-border)' }}
      >
        {status === 'loading' && allLeads === null ? (
          <LoadingSkeleton variant="list-row" count={12} />
        ) : status === 'error' ? (
          <ErrorState message={error ?? undefined} onRetry={load} />
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 gap-2">
            <p className="text-sm font-medium" style={{ color: 'var(--colony-text-secondary)' }}>
              No leads match the current filters.
            </p>
          </div>
        ) : (
          <div>
            {filtered.map((lead) => (
              <LeadRow key={lead.id} lead={lead} />
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

export default function InboxPage() {
  useEffect(() => { capture('colony_inbox_viewed') }, [])

  return (
    <Suspense
      fallback={
        <main className="p-6">
          <p className="text-sm" style={{ color: 'var(--colony-text-secondary)' }}>Loading inbox…</p>
        </main>
      }
    >
      <InboxContent />
    </Suspense>
  )
}
