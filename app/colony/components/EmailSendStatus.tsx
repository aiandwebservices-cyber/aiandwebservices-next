'use client'
import { useState, useEffect, useCallback } from 'react'
import { useCohort } from './CohortSwitcher'
import type { EmailSendRecord } from '@/lib/colony/email/types'

const STATUS_ICON: Record<EmailSendRecord['status'], string> = {
  sent: '📤',
  delivered: '✅',
  bounced: '⚠️',
  complained: '🚫',
  unsubscribed: '🔕',
}

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

interface EmailSendStatusProps {
  leadId: string
}

export function EmailSendStatus({ leadId }: EmailSendStatusProps) {
  const { cohortId } = useCohort()
  const [sends, setSends] = useState<EmailSendRecord[]>([])
  const [status, setStatus] = useState<'loading' | 'ok' | 'empty' | 'error'>('loading')

  const load = useCallback(async () => {
    setStatus('loading')
    try {
      const res = await fetch(
        `/api/colony/email/send?leadId=${encodeURIComponent(leadId)}${cohortId === 'demo' ? '&cohort=demo' : ''}`,
        { credentials: 'include', cache: 'no-store' }
      )
      const json = await res.json() as { status: string; data?: EmailSendRecord[] }
      if (json.status === 'ok' && json.data) {
        setSends(json.data)
        setStatus(json.data.length === 0 ? 'empty' : 'ok')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }, [leadId, cohortId])

  useEffect(() => { load() }, [load])

  if (status === 'loading') {
    return (
      <div className="mt-3">
        <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: 'var(--colony-text-secondary)' }}>
          Send History
        </p>
        <div className="colony-skeleton h-8 rounded w-full" />
      </div>
    )
  }

  if (status === 'empty' || status === 'error') {
    return null
  }

  return (
    <div className="mt-3">
      <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: 'var(--colony-text-secondary)' }}>
        Send History
      </p>
      <ul className="space-y-1.5">
        {sends.map(send => (
          <li
            key={send.id}
            className="flex items-center gap-2 text-xs px-3 py-2 rounded-lg"
            style={{ background: 'var(--colony-bg-elevated)', border: '1px solid var(--colony-border)' }}
          >
            <span className="shrink-0">{STATUS_ICON[send.status]}</span>
            <span className="flex-1 truncate" style={{ color: 'var(--colony-text-primary)' }}>
              {send.subject}
            </span>
            <span className="shrink-0 capitalize" style={{ color: 'var(--colony-text-secondary)' }}>
              {send.status}
            </span>
            <span className="shrink-0" style={{ color: 'var(--colony-text-secondary)' }}>
              {relativeTime(send.sent_at)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
