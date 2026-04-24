'use client'

import { useEffect, useState, useCallback } from 'react'
import { useCohort } from '../../components/CohortSwitcher'
import { colonyFetch } from '../../lib/api-client'
import { capture } from '../../lib/posthog'
import type { MetricsPayload } from '../types'

export function useMetrics() {
  const { cohortId } = useCohort()
  const [data, setData] = useState<MetricsPayload | null>(null)
  const [status, setStatus] = useState<'loading' | 'ok' | 'stale' | 'error'>('loading')
  const [error, setError] = useState<string | null>(null)
  const [lastSuccess, setLastSuccess] = useState<string | null>(null)

  const reload = useCallback(async () => {
    setStatus('loading')
    const res = await colonyFetch<MetricsPayload>('mrr', { cohortId })
    if (res.status === 'ok') {
      setData(res.data)
      setStatus('ok')
      setLastSuccess(res.cached_at ?? new Date().toISOString())
    } else if (res.status === 'stale') {
      setData(res.data)
      setStatus('stale')
      setLastSuccess(res.last_success ?? null)
      capture('colony_api_stale', { resource: 'mrr' })
    } else {
      setStatus('error')
      setError(res.error ?? 'Metrics unavailable')
      if (res.status !== 'unauthorized') {
        capture('colony_api_error', { resource: 'mrr', error: res.error })
      }
    }
  }, [cohortId])

  useEffect(() => { reload() }, [reload])

  return { data, status, error, lastSuccess, reload }
}
