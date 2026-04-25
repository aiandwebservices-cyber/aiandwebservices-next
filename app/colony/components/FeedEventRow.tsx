'use client'

import { useEffect, useState } from 'react'
import type { FeedEvent } from '../lib/types'
import type { Lead } from '../lib/types'
import { formatRelativeTime } from '../lib/feed-helpers'
import { capture } from '../lib/posthog'
import { useSidePanel } from './SidePanel'
import { LeadDetailPanel } from './LeadDetailPanel'
import { LoadingSkeleton } from './LoadingSkeleton'
import { colonyFetchLead } from '../lib/api-client'

// ─── Lead loader rendered inside the side panel ──────────────────────────────

function LeadPanelLoader({ leadId, cohortId }: { leadId: string; cohortId: string }) {
  const [lead, setLead] = useState<Lead | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const ctrl = new AbortController()
    colonyFetchLead(leadId, { cohortId, signal: ctrl.signal })
      .then(res => {
        if (res.status === 'ok' && res.data) setLead(res.data)
        else setFailed(true)
      })
      .catch(err => { if ((err as Error).name !== 'AbortError') setFailed(true) })
    return () => ctrl.abort()
  }, [leadId, cohortId])

  if (failed) {
    return (
      <div className="px-5 py-8 text-sm text-center" style={{ color: 'var(--colony-text-secondary)' }}>
        Could not load lead data.
      </div>
    )
  }

  if (!lead) return <LoadingSkeleton variant="feed-row" count={4} />

  return <LeadDetailPanel lead={lead} />
}

// ─── FeedEventRow ─────────────────────────────────────────────────────────────

interface Props {
  event: FeedEvent
  index: number
}

export default function FeedEventRow({ event, index }: Props) {
  const delay = Math.min(index * 50, 1000)
  const { open } = useSidePanel()

  const handleClick = () => {
    capture('colony_feed_event_clicked', { event_id: event.id, event_type: event.type })

    if (event.drill_target?.type === 'lead') {
      open({
        title: event.title,
        subtitle: event.subtitle,
        children: <LeadPanelLoader leadId={event.drill_target.id} cohortId={event.cohort_id} />,
        width: 'medium',
      })
    }
  }

  return (
    <div
      className="colony-feed-row flex items-start gap-3 px-4 py-3 rounded-lg cursor-pointer"
      style={{
        animationDelay: `${delay}ms`,
        transition: 'background 150ms ease',
        cursor: event.drill_target ? 'pointer' : 'default',
      }}
      onMouseEnter={e => { if (event.drill_target) e.currentTarget.style.background = 'var(--colony-bg-elevated)' }}
      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
      onClick={handleClick}
      role={event.drill_target ? 'button' : undefined}
      tabIndex={event.drill_target ? 0 : undefined}
      onKeyDown={e => e.key === 'Enter' && handleClick()}
    >
      {/* Icon */}
      <span className="text-xl leading-none mt-0.5 shrink-0">{event.icon}</span>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className="leading-snug" style={{ fontSize: 14, fontWeight: 700, color: 'var(--colony-text-primary)' }}>
          {event.title}
        </p>
        <p className="mt-0.5 truncate" style={{ fontSize: 12, color: 'rgba(255,255,255,.6)' }}>
          {event.subtitle}
        </p>
      </div>

      {/* Time */}
      <span className="shrink-0 mt-0.5" style={{ fontSize: 11, color: 'rgba(255,255,255,.3)' }}>
        {formatRelativeTime(event.timestamp)}
      </span>
    </div>
  )
}
