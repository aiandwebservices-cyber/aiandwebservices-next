'use client'

import { useSortable } from '@dnd-kit/sortable'
import type { Deal } from '@/app/colony/lib/types'
import { useSidePanel } from '../../components/SidePanel'
import { DealDetailPanel } from './DealDetailPanel'
import { formatAge } from '../../lib/lead-helpers'
import { capture } from '../../lib/posthog'

interface DealCardProps {
  deal: Deal
  isDragging?: boolean
}

export function DealCard({ deal, isDragging = false }: DealCardProps) {
  const { open } = useSidePanel()
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: deal.id })

  const isStale = deal.last_activity_at
    ? Date.now() - new Date(deal.last_activity_at).getTime() > 7 * 86400000
    : false

  const cardStyle: React.CSSProperties = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    transition: transition ?? undefined,
    opacity: isSortableDragging ? 0.3 : 1,
    background: 'var(--colony-bg-elevated)',
    border: `1px solid var(--colony-border)`,
    boxShadow: isDragging
      ? '0 12px 32px rgba(0,0,0,0.25)'
      : '0 1px 3px rgba(0,0,0,0.08)',
    borderRadius: 10,
    padding: '10px 12px',
    cursor: isDragging ? 'grabbing' : 'grab',
    userSelect: 'none',
    touchAction: 'none',
  }

  const handleClick = () => {
    if (isSortableDragging || isDragging) return
    capture('colony_deal_card_clicked', { deal_id: deal.id, stage: deal.stage })
    open({
      title: deal.business_name,
      subtitle: `$${deal.amount}/mo · ${deal.stage}`,
      children: <DealDetailPanel deal={deal} />,
      width: 'medium',
    })
  }

  return (
    <div
      ref={setNodeRef}
      style={cardStyle}
      {...attributes}
      {...listeners}
      onClick={handleClick}
      aria-label={`Deal: ${deal.business_name}, $${deal.amount}/mo`}
    >
      {/* Business name */}
      <p className="font-semibold text-sm leading-snug" style={{ color: 'var(--colony-text-primary)' }}>
        {deal.business_name}
      </p>

      {/* Amount */}
      <p className="text-base font-bold mt-0.5" style={{ color: 'var(--colony-accent)' }}>
        ${deal.amount.toLocaleString()}
        <span className="text-xs font-normal" style={{ color: 'var(--colony-text-secondary)' }}>/mo</span>
      </p>

      {/* Meta row */}
      <div className="flex items-center justify-between mt-2">
        <span className="text-xs" style={{ color: 'var(--colony-text-secondary)' }}>
          {deal.days_in_stage}d in stage
        </span>
        {isStale && (
          <span
            className="text-xs font-semibold px-1.5 py-0.5 rounded"
            style={{ background: 'rgba(239,68,68,0.12)', color: 'var(--colony-danger)' }}
          >
            ● stale
          </span>
        )}
        {deal.last_activity_at && !isStale && (
          <span className="text-xs" style={{ color: 'var(--colony-text-secondary)', opacity: 0.7 }}>
            {formatAge(deal.last_activity_at)}
          </span>
        )}
      </div>
    </div>
  )
}
