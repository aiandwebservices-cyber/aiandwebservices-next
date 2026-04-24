'use client'

import { useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { useCohort } from '../components/CohortSwitcher'
import { InboxFilters, useInboxFilters } from '../components/InboxFilters'
import { LeadRow } from '../components/LeadRow'
import { getLeadsForCohort } from '../lib/mock-data'
import { filterLeads, getUniqueNiches } from '../lib/lead-helpers'
import { capture } from '../lib/posthog'

function InboxListInner() {
  const { cohortId } = useCohort()
  const { filters } = useInboxFilters()
  const allLeads = getLeadsForCohort(cohortId)
  const filtered = filterLeads(allLeads, filters)

  if (filtered.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-48 gap-2">
        <p className="text-sm font-medium" style={{ color: 'var(--colony-text-secondary)' }}>
          No leads match the current filters.
        </p>
      </div>
    )
  }

  return (
    <div>
      {filtered.map((lead) => (
        <LeadRow key={lead.id} lead={lead} />
      ))}
    </div>
  )
}

function InboxList() {
  return (
    <Suspense fallback={<div className="h-8" />}>
      <InboxListInner />
    </Suspense>
  )
}

function NicheProvider({ children }: { children: (niches: string[]) => React.ReactNode }) {
  const { cohortId } = useCohort()
  const allLeads = getLeadsForCohort(cohortId)
  const niches = getUniqueNiches(allLeads)
  return <>{children(niches)}</>
}

function InboxPageInner() {
  useEffect(() => { capture('colony_inbox_viewed') }, [])

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

      <NicheProvider>
        {(niches) => <InboxFilters niches={niches} />}
      </NicheProvider>

      <section className="flex-1 overflow-y-auto rounded-lg" style={{ border: '1px solid var(--colony-border)' }}>
        <InboxList />
      </section>
    </main>
  )
}

// Suspense boundary at page level for useSearchParams used in child hooks
export default function InboxPage() {
  return (
    <Suspense fallback={<div className="p-6"><p className="text-sm" style={{ color: 'var(--colony-text-secondary)' }}>Loading inbox…</p></div>}>
      <InboxPageInner />
    </Suspense>
  )
}
