'use client'
import { useEffect, useState, useCallback } from 'react'
import { useCohort } from '../../components/CohortSwitcher'
import { colonyFetch } from '../../lib/api-client'
import type { ReportPayload } from '@/lib/colony/contracts'

export function useReports(limit = 20) {
  const { cohortId } = useCohort()
  const [reports, setReports] = useState<ReportPayload[]>([])
  const [status, setStatus] = useState<'loading' | 'ok' | 'stale' | 'error'>('loading')
  const [error, setError] = useState<string | null>(null)

  const reload = useCallback(async () => {
    setStatus('loading')
    const res = await colonyFetch<ReportPayload[]>('reports', { cohortId, query: { limit } })
    if (res.status === 'ok') {
      setReports(res.data ?? [])
      setStatus('ok')
    } else if (res.status === 'stale') {
      setReports(res.data ?? [])
      setStatus('stale')
    } else {
      setStatus('error')
      setError(res.error ?? 'Reports unavailable')
    }
  }, [cohortId, limit])

  useEffect(() => { reload() }, [reload])

  return { reports, status, error, reload }
}
