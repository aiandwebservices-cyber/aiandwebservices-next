'use client'

import { useEffect, useState } from 'react'

interface AccuracyStats {
  total_hypotheses: number
  resolved_count: number
  confirmed_count: number
  invalidated_count: number
  expired_count: number
  pending_count: number
  accuracy_pct_30d: number | null
  accuracy_pct_all_time: number | null
  weekly_trend: Array<{
    week_start: string
    confirmed: number
    invalidated: number
    total_resolved: number
    accuracy: number | null
  }>
  has_data: boolean
}

export function BillNyeAccuracyWidget({ cohortId }: { cohortId?: string }) {
  const [stats, setStats] = useState<AccuracyStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const url = cohortId
      ? `/api/colony/health/billnye-accuracy?cohort_id=${encodeURIComponent(cohortId)}`
      : '/api/colony/health/billnye-accuracy'
    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        setStats(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [cohortId])

  if (loading) {
    return (
      <div className="p-4 rounded" style={{ background: 'var(--colony-bg-elevated)', border: '1px solid var(--colony-border)' }}>
        <div className="text-sm" style={{ color: 'var(--colony-text-secondary)' }}>Loading Bill Nye accuracy...</div>
      </div>
    )
  }

  if (!stats || !stats.has_data) {
    return (
      <div className="p-4 rounded" style={{ background: 'var(--colony-bg-elevated)', border: '1px solid var(--colony-border)' }}>
        <div className="flex items-center justify-between mb-2">
          <div className="text-xs uppercase tracking-wider" style={{ color: 'var(--colony-text-secondary)' }}>
            Bill Nye Accuracy
          </div>
          <div className="text-xs" style={{ color: 'var(--colony-text-secondary)', opacity: 0.5 }}>no hypotheses yet</div>
        </div>
        <div className="text-sm" style={{ color: 'var(--colony-text-secondary)' }}>
          Bill Nye hasn&apos;t emitted hypotheses for this cohort yet. Once he does, accuracy tracking starts here.
        </div>
      </div>
    )
  }

  // Build sparkline path from weekly_trend
  const trend = stats.weekly_trend
  const sparklinePath = trend
    .map((w, i) => {
      const x = (i / Math.max(trend.length - 1, 1)) * 100
      const y = w.accuracy === null ? 50 : 100 - (w.accuracy / 100) * 100
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`
    })
    .join(' ')

  const accuracy30dColor =
    stats.accuracy_pct_30d === null
      ? 'var(--colony-text-secondary)'
      : stats.accuracy_pct_30d >= 70
      ? '#34d399'
      : stats.accuracy_pct_30d >= 50
      ? '#fbbf24'
      : '#f87171'

  return (
    <div className="p-4 rounded" style={{ background: 'var(--colony-bg-elevated)', border: '1px solid var(--colony-border)' }}>
      <div className="flex items-center justify-between mb-3">
        <div className="text-xs uppercase tracking-wider" style={{ color: 'var(--colony-text-secondary)' }}>
          🧪 Bill Nye Accuracy
        </div>
        <div className="text-xs" style={{ color: 'var(--colony-text-secondary)', opacity: 0.6 }}>
          {stats.total_hypotheses} hypotheses tracked
        </div>
      </div>

      <div className="flex items-baseline gap-3 mb-3">
        <div className="text-3xl font-semibold" style={{ color: accuracy30dColor }}>
          {stats.accuracy_pct_30d !== null ? `${stats.accuracy_pct_30d}%` : '—'}
        </div>
        <div className="text-xs" style={{ color: 'var(--colony-text-secondary)' }}>last 30 days</div>
      </div>

      {trend.length > 1 && (
        <div className="mb-3">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: '100%', height: 48 }}>
            <path
              d={sparklinePath}
              fill="none"
              stroke="#34d399"
              strokeWidth="1.5"
              vectorEffect="non-scaling-stroke"
            />
            <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(255,255,255,.1)" strokeWidth="0.5" strokeDasharray="2 2" />
          </svg>
        </div>
      )}

      <div className="grid grid-cols-4 gap-2" style={{ fontSize: 12 }}>
        <div>
          <div style={{ color: 'var(--colony-text-secondary)' }}>Confirmed</div>
          <div style={{ color: '#34d399', fontWeight: 600 }}>{stats.confirmed_count}</div>
        </div>
        <div>
          <div style={{ color: 'var(--colony-text-secondary)' }}>Invalidated</div>
          <div style={{ color: '#f87171', fontWeight: 600 }}>{stats.invalidated_count}</div>
        </div>
        <div>
          <div style={{ color: 'var(--colony-text-secondary)' }}>Expired</div>
          <div style={{ color: 'var(--colony-text-secondary)', fontWeight: 600 }}>{stats.expired_count}</div>
        </div>
        <div>
          <div style={{ color: 'var(--colony-text-secondary)' }}>Pending</div>
          <div style={{ color: 'var(--colony-text-primary)', fontWeight: 600 }}>{stats.pending_count}</div>
        </div>
      </div>

      {stats.accuracy_pct_all_time !== null && stats.accuracy_pct_all_time !== stats.accuracy_pct_30d && (
        <div className="mt-3 pt-3" style={{ borderTop: '1px solid var(--colony-border)', fontSize: 12, color: 'var(--colony-text-secondary)' }}>
          All-time: <span style={{ color: 'var(--colony-text-primary)' }}>{stats.accuracy_pct_all_time}%</span>
        </div>
      )}
    </div>
  )
}
