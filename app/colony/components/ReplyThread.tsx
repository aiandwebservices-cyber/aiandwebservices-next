'use client'

import { useEffect, useState } from 'react'
import { colonyFetch } from '../lib/api-client'
import type { ReplyRecord, ReplyClassification } from '@/lib/colony/email/inbound/types'

interface ReplyThreadProps {
  leadId: string
}

const CLASSIFICATION_STYLE: Record<
  ReplyClassification,
  { bg: string; border: string; fg: string; label: string; icon: string }
> = {
  INTERESTED: {
    bg: 'rgba(239,68,68,0.1)',
    border: 'rgba(239,68,68,0.35)',
    fg: '#fca5a5',
    label: 'Interested',
    icon: '🔥',
  },
  QUESTION: {
    bg: 'rgba(251,191,36,0.1)',
    border: 'rgba(251,191,36,0.35)',
    fg: '#fcd34d',
    label: 'Question',
    icon: '❓',
  },
  NOT_INTERESTED: {
    bg: 'rgba(163,163,163,0.1)',
    border: 'rgba(163,163,163,0.3)',
    fg: '#a3a3a3',
    label: 'Not interested',
    icon: '👎',
  },
  UNSUBSCRIBE: {
    bg: 'rgba(236,72,153,0.1)',
    border: 'rgba(236,72,153,0.35)',
    fg: '#f9a8d4',
    label: 'Unsubscribe',
    icon: '🚫',
  },
  AUTOMATED: {
    bg: 'rgba(99,102,241,0.08)',
    border: 'rgba(99,102,241,0.3)',
    fg: '#a5b4fc',
    label: 'Automated',
    icon: '🤖',
  },
  UNKNOWN: {
    bg: 'rgba(163,163,163,0.08)',
    border: 'rgba(163,163,163,0.25)',
    fg: '#a3a3a3',
    label: 'Unclassified',
    icon: '•',
  },
}

function formatWhen(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function ReplyBubble({ reply }: { reply: ReplyRecord }) {
  const [expanded, setExpanded] = useState(false)
  const style = CLASSIFICATION_STYLE[reply.classification] ?? CLASSIFICATION_STYLE.UNKNOWN
  const isLong = reply.body_text.length > 500
  const body = expanded || !isLong ? reply.body_text : reply.body_text.slice(0, 500) + '…'

  return (
    <div
      className="rounded-lg p-3 space-y-2"
      style={{ background: 'var(--colony-bg-elevated)', border: '1px solid var(--colony-border)' }}
    >
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <span
            className="text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1"
            style={{ background: style.bg, color: style.fg, border: `1px solid ${style.border}` }}
          >
            <span>{style.icon}</span>
            {style.label}
          </span>
          <span className="text-xs" style={{ color: 'var(--colony-text-secondary)' }}>
            {reply.from_email}
          </span>
        </div>
        <span className="text-xs" style={{ color: 'var(--colony-text-secondary)' }}>
          {formatWhen(reply.received_at)}
        </span>
      </div>

      <div className="text-xs font-semibold" style={{ color: 'var(--colony-text-primary)' }}>
        {reply.subject}
      </div>

      <div
        className="text-sm whitespace-pre-wrap"
        style={{ color: 'var(--colony-text-primary)', lineHeight: 1.6 }}
      >
        {body}
      </div>

      {isLong && (
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="text-xs underline"
          style={{ color: 'var(--colony-accent)' }}
        >
          {expanded ? 'Show less' : 'Show full message'}
        </button>
      )}

      {reply.classification_reasoning && (
        <p className="text-xs italic" style={{ color: 'var(--colony-text-secondary)' }}>
          Classifier: {reply.classification_reasoning}
          {reply.classification_confidence > 0 && (
            <> · {Math.round(reply.classification_confidence * 100)}% conf.</>
          )}
        </p>
      )}
    </div>
  )
}

export function ReplyThread({ leadId }: ReplyThreadProps) {
  const [replies, setReplies] = useState<ReplyRecord[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let alive = true
    setReplies(null)
    setError(null)

    colonyFetch<ReplyRecord[]>('replies', { query: { lead_id: leadId } })
      .then(res => {
        if (!alive) return
        if (res.status === 'ok' && res.data) {
          setReplies(res.data)
        } else if (res.status === 'unauthorized') {
          setError('Not authorized')
        } else if (res.status === 'degraded') {
          setError(res.error ?? 'Could not load replies')
        } else {
          setReplies([])
        }
      })
      .catch(e => {
        if (!alive) return
        setError(e instanceof Error ? e.message : 'Network error')
      })

    return () => {
      alive = false
    }
  }, [leadId])

  if (error) {
    return (
      <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--colony-border)' }}>
        <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: 'var(--colony-text-secondary)' }}>
          Replies
        </p>
        <p className="text-xs" style={{ color: '#fca5a5' }}>{error}</p>
      </div>
    )
  }

  if (replies === null) {
    return (
      <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--colony-border)' }}>
        <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: 'var(--colony-text-secondary)' }}>
          Replies
        </p>
        <p className="text-xs" style={{ color: 'var(--colony-text-secondary)' }}>Loading…</p>
      </div>
    )
  }

  if (replies.length === 0) {
    return (
      <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--colony-border)' }}>
        <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: 'var(--colony-text-secondary)' }}>
          Replies
        </p>
        <p className="text-xs" style={{ color: 'var(--colony-text-secondary)' }}>No replies yet.</p>
      </div>
    )
  }

  return (
    <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--colony-border)' }}>
      <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: 'var(--colony-text-secondary)' }}>
        Replies ({replies.length})
      </p>
      <div className="space-y-3">
        {replies.map(r => (
          <ReplyBubble key={r.id} reply={r} />
        ))}
      </div>
    </div>
  )
}
