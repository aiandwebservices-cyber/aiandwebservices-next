'use client'

import type { RevenueMove } from '../lib/revenue-helpers'
import { capture } from '../lib/posthog'

const URGENCY_DOT: Record<string, string> = {
  high: 'var(--colony-danger)',
  medium: 'var(--colony-warning)',
  low: '#3b82f6',
}

export default function RevenueMoveCard({ move }: { move: RevenueMove }) {
  const handleClick = () => {
    capture('colony_revenue_move_clicked', { move_id: move.id, urgency: move.urgency })
  }

  return (
    <div
      className="rounded-xl p-4 border cursor-pointer"
      style={{
        borderColor: 'var(--colony-border)',
        background: 'var(--colony-bg-content)',
        transition: 'background 150ms ease, box-shadow 150ms ease',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = 'var(--colony-bg-elevated)'
        e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.08)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = 'var(--colony-bg-content)'
        e.currentTarget.style.boxShadow = 'none'
      }}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && handleClick()}
    >
      <div className="flex items-start gap-2.5 mb-2">
        <div
          className="mt-1 shrink-0 rounded-full"
          style={{ width: 8, height: 8, background: URGENCY_DOT[move.urgency] }}
        />
        <p className="text-sm font-semibold leading-snug" style={{ color: 'var(--colony-text-primary)' }}>
          {move.title}
        </p>
      </div>
      <p className="text-xs ml-[22px] mb-3" style={{ color: 'var(--colony-text-secondary)' }}>
        {move.subtitle}
      </p>
      <div className="ml-[22px]">
        <button
          className="text-xs font-semibold px-3 py-1.5 rounded-lg"
          style={{ background: 'var(--colony-accent)', color: '#000' }}
          onClick={e => { e.stopPropagation(); handleClick() }}
        >
          {move.actionLabel}
        </button>
      </div>
    </div>
  )
}
