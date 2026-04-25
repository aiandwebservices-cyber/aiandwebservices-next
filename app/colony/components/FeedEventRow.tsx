'use client'

import type { FeedEvent } from '../lib/types'
import { formatRelativeTime } from '../lib/feed-helpers'
import { capture } from '../lib/posthog'

// ─── FeedEventRow ─────────────────────────────────────────────────────────────

interface Props {
  event: FeedEvent
  index: number
}

export default function FeedEventRow({ event, index }: Props) {
  const delay = Math.min(index * 50, 1000)

  const handleClick = () => {
    capture('colony_feed_event_clicked', { event_id: event.id, event_type: event.type })
  }

  return (
    <div
      className="colony-feed-row flex items-start gap-3 px-4 py-3 rounded-lg cursor-pointer"
      style={{
        animationDelay: `${delay}ms`,
        transition: 'background 150ms ease',
      }}
      onMouseEnter={e => (e.currentTarget.style.background = 'var(--colony-bg-elevated)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
      onClick={handleClick}
      role="button"
      tabIndex={0}
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
