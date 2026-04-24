'use client'

import { useEffect, useState } from 'react'
import HealthCheckCard from './HealthCheckCard'
import type { HealthCheck, HealthStatus } from '@/app/api/colony/admin/system/health/route'

interface HealthResponse {
  status: string
  data: {
    overall: HealthStatus
    checks: HealthCheck[]
    checked_at: string
  } | null
  error?: string
}

export default function SystemHealthClient() {
  const [data, setData] = useState<HealthResponse['data']>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function poll() {
      try {
        const res = await fetch('/api/colony/admin/system/health', { credentials: 'include', cache: 'no-store' })
        const body = (await res.json()) as HealthResponse
        if (!cancelled) setData(body.data)
      } catch {
        // network error — leave previous data
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    poll()
    const id = setInterval(poll, 30000)
    return () => { cancelled = true; clearInterval(id) }
  }, [])

  if (loading && !data) {
    return <p className="text-sm" style={{ color: 'var(--colony-text-secondary)' }}>Running checks…</p>
  }

  if (!data) {
    return <p className="text-sm" style={{ color: 'var(--colony-danger)' }}>Failed to load health data</p>
  }

  return (
    <div>
      <div className="mb-4 flex items-center gap-2">
        <span className="text-xs" style={{ color: 'var(--colony-text-secondary)' }}>
          Overall:
        </span>
        <span
          className="text-xs font-bold uppercase tracking-wide"
          style={{
            color: data.overall === 'healthy' ? 'var(--colony-success)'
              : data.overall === 'degraded' ? 'var(--colony-warning)'
              : 'var(--colony-danger)',
          }}
        >
          {data.overall}
        </span>
        <span className="text-xs ml-auto" style={{ color: 'var(--colony-text-secondary)' }}>
          Last check {new Date(data.checked_at).toLocaleTimeString()}
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {data.checks.map(c => <HealthCheckCard key={c.service} check={c} />)}
      </div>
    </div>
  )
}
