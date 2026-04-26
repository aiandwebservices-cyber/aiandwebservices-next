'use client'
import { useState, useEffect, useCallback } from 'react'
import { useCohort } from './CohortSwitcher'
import { colonyFetch } from '../lib/api-client'
import { ReportModal } from '../reports/components/ReportModal'
import BotClickable from './BotClickable'
import type { ReportPayload } from '@/lib/colony/contracts'

export function BillNyeHomeCard() {
  const { cohortId } = useCohort()
  const [report, setReport] = useState<ReportPayload | null>(null)
  const [status, setStatus] = useState<'loading' | 'ok' | 'empty' | 'error'>('loading')
  const [modalOpen, setModalOpen] = useState(false)

  const load = useCallback(async () => {
    setStatus('loading')
    const res = await colonyFetch<ReportPayload[]>('reports', { cohortId, query: { limit: 1 } })
    if ((res.status === 'ok' || res.status === 'stale') && res.data && res.data.length > 0) {
      setReport(res.data[0])
      setStatus('ok')
    } else if (res.status === 'ok' || res.status === 'stale') {
      setStatus('empty')
    } else {
      setStatus('error')
    }
  }, [cohortId])

  useEffect(() => { load() }, [load])

  if (status === 'loading') {
    return (
      <div className="flex flex-col gap-2 h-full">
        <div className="flex items-center gap-2">
          <span className="text-lg">🧪</span>
          <span className="text-xs font-bold" style={{ color: 'var(--colony-text-secondary)' }}>BILL NYE</span>
        </div>
        <div className="colony-skeleton h-4 rounded w-3/4" />
        <div className="colony-skeleton h-3 rounded w-1/2" />
        <div className="colony-skeleton h-3 rounded w-2/3" />
      </div>
    )
  }

  if (status === 'empty' || status === 'error') {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">🧪</span>
          <span className="text-xs font-bold" style={{ color: 'var(--colony-text-secondary)' }}>BILL NYE</span>
        </div>
        <p className="text-sm font-semibold" style={{ color: 'var(--colony-text-primary)' }}>
          Bill Nye&apos;s first analysis runs Sunday night
        </p>
        <p className="text-xs mt-1" style={{ color: 'var(--colony-text-secondary)' }}>
          Weekly findings will appear here after his first run.
        </p>
      </div>
    )
  }

  if (!report) return null

  const daysDiff = Math.floor((Date.now() - new Date(report.generated_at).getTime()) / 86400000)
  const age = daysDiff === 0 ? 'Today' : daysDiff === 1 ? 'Yesterday' : `${daysDiff}d ago`
  const findings = report.top_findings.slice(0, 4)

  return (
    <>
      <div className="flex flex-col h-full min-h-0">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">🧪</span>
          <BotClickable
            botId={`bot-${cohortId}-billnye`}
            className="text-xs font-bold tracking-wide"
          >
            <span style={{ color: 'var(--colony-accent)' }}>BILL NYE</span>
          </BotClickable>
          <span className="text-[10px] ml-auto" style={{ color: 'var(--colony-text-secondary)' }}>
            {age}
          </span>
        </div>
        <h3 className="text-sm font-bold leading-snug mb-2" style={{ color: 'var(--colony-text-primary)' }}>
          {report.title}
        </h3>

        <div className="flex flex-col gap-1.5 flex-1 min-h-0 overflow-hidden">
          {findings.map((finding, i) => (
            <button
              key={i}
              onClick={() => setModalOpen(true)}
              className="flex items-start gap-2 text-left transition-opacity hover:opacity-80"
              style={{ color: 'var(--colony-text-primary)' }}
            >
              <span className="text-xs mt-0.5 shrink-0">🔬</span>
              <p className="text-xs leading-snug truncate">{finding}</p>
            </button>
          ))}
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="text-xs font-semibold transition-opacity hover:opacity-70 mt-2 self-start"
          style={{ color: 'var(--colony-accent)' }}
        >
          Read full report →
        </button>
      </div>

      {modalOpen && <ReportModal report={report} onClose={() => setModalOpen(false)} />}
    </>
  )
}
