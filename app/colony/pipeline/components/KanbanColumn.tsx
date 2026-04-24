'use client'

import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import type { Deal, DealStage } from '@/app/colony/lib/types'
import { STAGE_META } from '../lib/stage-helpers'
import { DealCard } from './DealCard'

interface KanbanColumnProps {
  stage: DealStage
  deals: Deal[]
}

export function KanbanColumn({ stage, deals }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: stage })
  const meta = STAGE_META[stage]
  const totalAmount = deals.reduce((sum, d) => sum + d.amount, 0)

  return (
    <div className="flex flex-col shrink-0" style={{ width: 268 }}>
      {/* Column header */}
      <div className="flex items-center justify-between px-1 pb-2">
        <div className="flex items-center gap-2">
          <span
            style={{ width: 8, height: 8, borderRadius: '50%', background: meta.accentColor, display: 'inline-block', flexShrink: 0 }}
          />
          <span className="text-xs font-bold" style={{ color: 'var(--colony-text-primary)' }}>
            {meta.label}
          </span>
          <span
            className="text-xs font-semibold px-1.5 py-0.5 rounded-full"
            style={{ background: 'rgba(163,163,163,0.12)', color: 'var(--colony-text-secondary)' }}
          >
            {deals.length}
          </span>
        </div>
        {deals.length > 0 && (
          <span className="text-xs font-semibold" style={{ color: 'var(--colony-text-secondary)' }}>
            ${totalAmount.toLocaleString()}
          </span>
        )}
      </div>

      {/* Drop zone */}
      <div
        ref={setNodeRef}
        className="flex-1 flex flex-col gap-2 p-2 rounded-xl overflow-y-auto transition-colors"
        style={{
          minHeight: 120,
          maxHeight: 'calc(100vh - 220px)',
          background: isOver
            ? `${meta.accentColor}18`
            : 'rgba(163,163,163,0.04)',
          border: `2px solid ${isOver ? meta.accentColor : 'transparent'}`,
          transition: 'background 120ms, border-color 120ms',
        }}
      >
        <SortableContext
          items={deals.map(d => d.id)}
          strategy={verticalListSortingStrategy}
        >
          {deals.length === 0 ? (
            <div className="flex items-center justify-center h-20 rounded-lg" style={{ border: '1px dashed var(--colony-border)' }}>
              <p className="text-xs" style={{ color: 'var(--colony-text-secondary)', opacity: 0.5 }}>
                Drop here
              </p>
            </div>
          ) : (
            deals.map(deal => <DealCard key={deal.id} deal={deal} />)
          )}
        </SortableContext>
      </div>
    </div>
  )
}
