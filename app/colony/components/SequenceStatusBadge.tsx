'use client'

import { useEffect, useState } from 'react'
import type { EnrollmentWithTemplateName, HaltReason } from '@/lib/colony/sequences/types'

function formatRelative(iso: string): string {
  const diff = new Date(iso).getTime() - Date.now()
  const days = Math.round(diff / (1000 * 60 * 60 * 24))
  if (Math.abs(days) >= 1) return days > 0 ? `in ${days}d` : `${Math.abs(days)}d ago`
  const hours = Math.round(diff / (1000 * 60 * 60))
  return hours > 0 ? `in ${hours}h` : `${Math.abs(hours)}h ago`
}

const HALT_LABEL: Record<HaltReason, string> = {
  replied: 'prospect replied',
  unsubscribed: 'unsubscribed',
  manual: 'halted manually',
  lead_status_change: 'lead status changed',
  template_paused: 'template paused',
}

export default function SequenceStatusBadge({ leadId }: { leadId: string }) {
  const [enrollments, setEnrollments] = useState<EnrollmentWithTemplateName[] | null>(null)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    let cancelled = false
    fetch(`/api/colony/sequences/active?leadId=${encodeURIComponent(leadId)}`, {
      credentials: 'include',
      cache: 'no-store',
    })
      .then(r => r.json())
      .then((body: { status: string; data?: EnrollmentWithTemplateName[] }) => {
        if (!cancelled) setEnrollments(body.data ?? [])
      })
      .catch(() => setEnrollments([]))
    return () => { cancelled = true }
  }, [leadId])

  if (enrollments === null) return null
  if (enrollments.length === 0) return null

  const latest = enrollments[0]

  let label: string
  let color: string
  if (latest.status === 'active') {
    label = latest.next_send_due_at
      ? `In sequence: ${latest.template_name} · next ${formatRelative(latest.next_send_due_at)}`
      : `In sequence: ${latest.template_name}`
    color = 'var(--colony-accent)'
  } else if (latest.status === 'halted') {
    label = `Sequence halted: ${latest.halt_reason ? HALT_LABEL[latest.halt_reason] : 'unknown'}`
    color = 'var(--colony-warning)'
  } else {
    label = `Sequence completed (${latest.template_name})`
    color = 'var(--colony-success)'
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={() => setExpanded(v => !v)}
        className="inline-flex items-center gap-2 text-xs font-semibold px-2 py-1 rounded-full self-start hover:opacity-80 transition-opacity"
        style={{ background: 'rgba(42,165,160,0.08)', color, border: `1px solid ${color}` }}
      >
        <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
        {label}
        <span className="text-[10px] opacity-70">{expanded ? '▾' : '▸'}</span>
      </button>

      {expanded && enrollments.length > 0 && (
        <div
          className="text-xs rounded-lg p-3"
          style={{ background: 'var(--colony-bg-elevated)', border: '1px solid var(--colony-border)' }}
        >
          <p className="font-semibold mb-1" style={{ color: 'var(--colony-text-primary)' }}>
            Sequence history
          </p>
          <ul className="space-y-1">
            {enrollments.map(e => (
              <li key={e.id} style={{ color: 'var(--colony-text-secondary)' }}>
                <span style={{ color: 'var(--colony-text-primary)' }}>{e.template_name}</span>
                {' · '}
                <span>step {e.current_step}</span>
                {' · '}
                <span>{e.status}</span>
                {e.halt_reason && ` (${HALT_LABEL[e.halt_reason]})`}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
