'use client'

import { useState, useCallback } from 'react'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from '@dnd-kit/core'
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { restrictToWindowEdges } from '@dnd-kit/modifiers'
import type { Deal, DealStage } from '@/app/colony/lib/types'
import { useDeals } from '../hooks/useDeals'
import { STAGE_ORDER, groupDealsByStage } from '../lib/stage-helpers'
import { KanbanColumn } from './KanbanColumn'
import { DealCard } from './DealCard'
import { Toast } from './Toast'
import { LoadingSkeleton } from '../../components/LoadingSkeleton'
import { ErrorState } from '../../components/ErrorState'
import { capture } from '../../lib/posthog'

export function KanbanBoard() {
  const { deals, status, error, reload, optimisticMove, rollbackMove } = useDeals()
  const [activeDeal, setActiveDeal] = useState<Deal | null>(null)
  const [toast, setToast] = useState<{ type: 'error' | 'success'; message: string } | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const handleDragStart = useCallback((e: DragStartEvent) => {
    const deal = (deals ?? []).find(d => d.id === e.active.id)
    setActiveDeal(deal ?? null)
  }, [deals])

  const handleDragEnd = useCallback(async (e: DragEndEvent) => {
    setActiveDeal(null)
    const dealId = e.active.id as string
    const newStage = e.over?.id as DealStage | undefined
    if (!newStage || !STAGE_ORDER.includes(newStage)) return

    const deal = (deals ?? []).find(d => d.id === dealId)
    if (!deal || deal.stage === newStage) return

    capture('colony_deal_dragged', { from: deal.stage, to: newStage, deal_id: dealId })
    optimisticMove(dealId, newStage)

    try {
      const res = await fetch(`/api/colony/deals/${dealId}/stage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ stage: newStage }),
      })
      if (!res.ok) throw new Error(`API returned ${res.status}`)
    } catch (err) {
      rollbackMove(dealId, deal.stage)
      setToast({ type: 'error', message: `Couldn't update ${deal.business_name}. Reverted.` })
      capture('colony_deal_stage_failed', { deal_id: dealId, error: String(err) })
    }
  }, [deals, optimisticMove, rollbackMove])

  if (status === 'loading') {
    return <LoadingSkeleton variant="card" count={5} />
  }
  if (status === 'error') {
    return <ErrorState message={error ?? undefined} onRetry={reload} />
  }

  const grouped = groupDealsByStage(deals ?? [])

  return (
    <>
      <DndContext
        sensors={sensors}
        modifiers={[restrictToWindowEdges]}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-3 flex-1 overflow-x-auto pb-2">
          {STAGE_ORDER.map(stage => (
            <KanbanColumn key={stage} stage={stage} deals={grouped[stage]} />
          ))}
        </div>
        <DragOverlay>
          {activeDeal ? <DealCard deal={activeDeal} isDragging /> : null}
        </DragOverlay>
      </DndContext>
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </>
  )
}
