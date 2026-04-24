'use client'
import { useEffect } from 'react'
import { useReports } from './hooks/useReports'
import { ReportRow } from './components/ReportRow'
import { LoadingSkeleton } from '../components/LoadingSkeleton'
import { ErrorState } from '../components/ErrorState'
import { capture } from '../lib/posthog'
import { ColonyErrorBoundary } from '../components/ColonyErrorBoundary'

export default function ReportsPage() {
  const { reports, status, error, reload } = useReports()

  useEffect(() => { capture('colony_reports_viewed') }, [])

  return (
    <ColonyErrorBoundary>
    <main className="p-6 flex flex-col gap-4 h-[calc(100vh-56px)] overflow-y-auto">
      <header>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--colony-text-primary)' }}>
          Reports
        </h1>
        <p className="text-sm" style={{ color: 'var(--colony-text-secondary)' }}>
          Weekly analyses from Bill Nye — your data scientist agent.
        </p>
      </header>

      {status === 'loading' && <LoadingSkeleton variant="list-row" count={5} />}
      {status === 'error' && <ErrorState message={error ?? undefined} onRetry={reload} />}
      {status === 'ok' && reports.length === 0 && <EmptyState />}
      {(status === 'ok' || status === 'stale') && reports.length > 0 && (
        <div className="flex flex-col gap-2">
          {reports.map(r => <ReportRow key={r.id} report={r} />)}
        </div>
      )}
    </main>
    </ColonyErrorBoundary>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="text-6xl mb-4">🧪</div>
      <h2 className="text-xl font-semibold mb-2" style={{ color: 'var(--colony-text-primary)' }}>
        Bill Nye hasn&apos;t filed a report yet
      </h2>
      <p className="text-sm max-w-md" style={{ color: 'var(--colony-text-secondary)' }}>
        Bill Nye runs his weekly analysis on Sundays at 11pm. Your first report will appear here after his first run.
      </p>
    </div>
  )
}
