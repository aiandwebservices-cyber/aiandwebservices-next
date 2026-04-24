'use client'

import Link from 'next/link'
import { useMetrics } from '../hooks/useMetrics'

export function MRRWidget() {
  const { data, status } = useMetrics()

  if (status === 'loading' || status === 'error') return null

  const mrr = data?.mrr_current ?? 0
  const delta = data?.mrr_delta_pct ?? null

  return (
    <Link
      href="/colony/health"
      className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg transition-opacity hover:opacity-80"
      style={{ border: '1px solid var(--colony-border)' }}
      title="Operations Health"
    >
      <span className="text-xs font-semibold" style={{ color: 'var(--colony-text-secondary)' }}>MRR</span>
      <span className="text-sm font-bold" style={{ color: 'var(--colony-text-primary)' }}>
        ${mrr.toLocaleString()}
      </span>
      {delta !== null && (
        <span
          className="text-xs font-semibold"
          style={{ color: delta >= 0 ? 'var(--colony-success)' : 'var(--colony-danger)' }}
        >
          {delta >= 0 ? '+' : ''}{delta.toFixed(1)}%
        </span>
      )}
    </Link>
  )
}
