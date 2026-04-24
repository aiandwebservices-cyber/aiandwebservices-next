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

interface ColProps { label: string; cohortLabel: string; metrics: Metrics | null; loading: boolean }

function ComparisonColumn({ label, cohortLabel, metrics, loading }: ColProps) {
  return (
    <div className="flex-1 rounded-xl p-4" style={{ background: 'var(--colony-bg-elevated)' }}>
      <p className="text-xs font-bold mb-3" style={{ color: 'var(--colony-accent)' }}>{label}</p>
      <p className="text-[10px] mb-4" style={{ color: 'var(--colony-text-secondary)', opacity: 0.6 }}>{cohortLabel}</p>
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
          ].map(({ label: l, value }) => (
            <div key={l} className="flex items-center justify-between">
              <dt className="text-xs" style={{ color: 'var(--colony-text-secondary)' }}>{l}</dt>
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

export function CohortComparison() {
  const { cohortId } = useCohort()
  const [currentMetrics, setCurrentMetrics] = useState<Metrics | null>(null)
  const [demoMetrics, setDemoMetrics] = useState<Metrics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    let cancelled = false
    Promise.all([
      colonyFetch<LeadPayload[]>('leads', { cohortId }),
      colonyFetch<DealPayload[]>('deals', { cohortId }),
      colonyFetch<LeadPayload[]>('leads', { cohortId: 'demo' }),
      colonyFetch<DealPayload[]>('deals', { cohortId: 'demo' }),
    ]).then(([leadsRes, dealsRes, demoLeadsRes, demoDealsRes]) => {
      if (cancelled) return
      const leads      = leadsRes.data      ?? []
      const deals      = dealsRes.data      ?? []
      const demoLeads  = demoLeadsRes.data  ?? []
      const demoDeals  = demoDealsRes.data  ?? []
      setCurrentMetrics(deriveMetrics(leads, deals))
      setDemoMetrics(deriveMetrics(demoLeads, demoDeals))
      setLoading(false)
      capture('colony_analytics_section_viewed', { section: 'cohort_comparison' })
    }).catch(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [cohortId])

  const currentLabel = cohortId === 'demo' ? 'Demo' : cohortId.replace(/_/g, ' ')

  return (
    <div className="flex gap-4">
      <ComparisonColumn label="Your cohort" cohortLabel={currentLabel} metrics={currentMetrics} loading={loading} />
      <ComparisonColumn label="Demo baseline" cohortLabel="demo" metrics={demoMetrics} loading={loading} />
    </div>
  )
}
