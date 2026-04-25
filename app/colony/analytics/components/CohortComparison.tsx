'use client'

import { useEffect, useState } from 'react'
import { colonyFetch } from '@/app/colony/lib/api-client'
import { useCohort } from '../../components/CohortSwitcher'
import { capture } from '../../lib/posthog'
import type { LeadPayload, DealPayload } from '@/lib/colony/contracts'

interface Metrics {
  total_leads: number
  active_deals: number
  estimated_mrr: number
  conversion_rate: number
  avg_days_in_pipeline: number | null
}

function deriveMetrics(leads: LeadPayload[], deals: DealPayload[]): Metrics {
  const activeDeals = deals.filter(d => d.stage === 'Active')
  const estimatedMrr = activeDeals.reduce((s, d) => s + d.amount, 0)
  const conversionRate = leads.length > 0 ? Math.round((activeDeals.length / leads.length) * 1000) / 10 : 0
  const avgDays = activeDeals.length > 0
    ? Math.round(activeDeals.reduce((s, d) => s + d.days_in_stage, 0) / activeDeals.length)
    : null
  return { total_leads: leads.length, active_deals: activeDeals.length, estimated_mrr: estimatedMrr, conversion_rate: conversionRate, avg_days_in_pipeline: avgDays }
}

export function CohortComparison() {
  const { cohortId } = useCohort()
  const [metrics, setMetrics] = useState<Metrics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    let cancelled = false
    Promise.all([
      colonyFetch<LeadPayload[]>('leads', { cohortId }),
      colonyFetch<DealPayload[]>('deals', { cohortId }),
    ]).then(([leadsRes, dealsRes]) => {
      if (cancelled) return
      setMetrics(deriveMetrics(leadsRes.data ?? [], dealsRes.data ?? []))
      setLoading(false)
      capture('colony_analytics_section_viewed', { section: 'cohort_comparison' })
    }).catch(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [cohortId])

  return (
    <div className="rounded-xl p-4" style={{ background: 'var(--colony-bg-elevated)' }}>
      <p className="text-xs font-bold mb-3" style={{ color: 'var(--colony-accent)' }}>
        {cohortId.replace(/_/g, ' ')}
      </p>
      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-6 rounded colony-skeleton" />
          ))}
        </div>
      ) : metrics ? (
        <dl className="space-y-3">
          {[
            { label: 'Total leads',       value: String(metrics.total_leads) },
            { label: 'Active clients',    value: String(metrics.active_deals) },
            { label: 'Est. MRR',          value: `$${metrics.estimated_mrr.toLocaleString()}` },
            { label: 'Conversion rate',   value: `${metrics.conversion_rate}%` },
            { label: 'Avg days active',   value: metrics.avg_days_in_pipeline !== null ? `${metrics.avg_days_in_pipeline}d` : '—' },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between">
              <dt className="text-xs" style={{ color: 'var(--colony-text-secondary)' }}>{label}</dt>
              <dd className="text-xs font-bold tabular-nums" style={{ color: 'var(--colony-text-primary)' }}>{value}</dd>
            </div>
          ))}
        </dl>
      ) : (
        <p className="text-xs" style={{ color: 'var(--colony-text-secondary)' }}>No data</p>
      )}
    </div>
  )
}
