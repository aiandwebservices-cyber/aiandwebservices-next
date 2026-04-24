'use client'

import { useEffect, useState } from 'react'
import { colonyFetch } from '@/app/colony/lib/api-client'
import { useCohort } from '../../components/CohortSwitcher'
import type { FunnelPayload } from '@/lib/colony/contracts'

interface State { data: FunnelPayload | null; status: 'loading' | 'ok' | 'error'; error?: string }

export function useFunnel() {
  const { cohortId } = useCohort()
  const [state, setState] = useState<State>({ data: null, status: 'loading' })

  useEffect(() => {
    setState({ data: null, status: 'loading' })
    let cancelled = false
    colonyFetch<FunnelPayload>('analytics/funnel', { cohortId })
      .then(res => {
        if (cancelled) return
        if ((res.status === 'ok' || res.status === 'stale') && res.data) {
          setState({ data: res.data, status: 'ok' })
        } else {
          setState({ data: null, status: 'error', error: res.error ?? res.status })
        }
      })
      .catch(err => { if (!cancelled) setState({ data: null, status: 'error', error: String(err) }) })
    return () => { cancelled = true }
  }, [cohortId])

  return state
}
