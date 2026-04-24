'use client'

import { useState, useEffect, useCallback } from 'react'
import { useCohort } from '../../components/CohortSwitcher'
import { colonyFetch } from '../../lib/api-client'
import type { Deal, DealStage } from '@/app/colony/lib/types'

export function useDeals() {
  const { cohortId } = useCohort()
  const [deals, setDeals] = useState<Deal[] | null>(null)
  const [status, setStatus] = useState<'loading' | 'ok' | 'error'>('loading')
  const [error, setError] = useState<string | null>(null)

  const reload = useCallback(async () => {
    setStatus('loading')
    const res = await colonyFetch<Deal[]>('deals', { cohortId })
    if (res.status === 'ok' || res.status === 'stale') {
      setDeals(res.data ?? [])
      setStatus('ok')
    } else {
      setStatus('error')
      setError(res.error ?? 'Failed to load deals')
    }
  }, [cohortId])

  useEffect(() => { reload() }, [reload])

  const optimisticMove = useCallback((dealId: string, newStage: DealStage) => {
    setDeals(prev =>
      prev ? prev.map(d => d.id === dealId ? { ...d, stage: newStage, days_in_stage: 0 } : d) : prev
    )
  }, [])

  const rollbackMove = useCallback((dealId: string, originalStage: DealStage) => {
    setDeals(prev =>
      prev ? prev.map(d => d.id === dealId ? { ...d, stage: originalStage } : d) : prev
    )
  }, [])

  return { deals, status, error, reload, optimisticMove, rollbackMove }
}
