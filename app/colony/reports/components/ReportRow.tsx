'use client'
import { useState } from 'react'
import { ReportModal } from './ReportModal'
import type { BillNyeReport } from '@/app/colony/lib/types'

interface ReportRowProps {
  report: BillNyeReport
}

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days} days ago`
  const weeks = Math.floor(days / 7)
  if (weeks === 1) return '1 week ago'
  if (weeks < 5) return `${weeks} weeks ago`
  const months = Math.floor(days / 30)
  return months <= 1 ? '1 month ago' : `${months} months ago`
}

function truncate(s: string, n: number) {
  return s.length > n ? s.slice(0, n - 1) + '…' : s
}

export function ReportRow({ report }: ReportRowProps) {
  const [open, setOpen] = useState(false)
  const preview = report.top_findings.slice(0, 2)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full text-left flex items-start gap-3 px-4 py-3 rounded-xl transition-all duration-150 hover:-translate-y-0.5 hover:shadow-sm"
        style={{
          border: '1px solid var(--colony-border)',
          background: 'var(--colony-bg-elevated)',
        }}
      >
        <span className="text-2xl mt-0.5 shrink-0">🧪</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline justify-between gap-2">
            <span className="font-semibold text-sm truncate" style={{ color: 'var(--colony-text-primary)' }}>
              {report.title}
            </span>
            <span className="text-xs shrink-0" style={{ color: 'var(--colony-text-secondary)' }}>
              {relativeTime(report.generated_at)}
            </span>
          </div>
          <div className="mt-1 flex flex-col gap-0.5">
            {preview.map((f, i) => (
              <p key={i} className="text-xs" style={{ color: 'var(--colony-text-secondary)' }}>
                · {truncate(f, 80)}
              </p>
            ))}
          </div>
        </div>
      </button>
      {open && <ReportModal report={report} onClose={() => setOpen(false)} />}
    </>
  )
}
