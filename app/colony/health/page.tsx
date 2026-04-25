'use client'

import { useEffect, useState, useCallback } from 'react'
import { MetricCard } from './components/MetricCard'
import { AlertsPanel } from './components/AlertsPanel'
import { MRRBreakdownTable } from './components/MRRBreakdownTable'
import { useMetrics } from './hooks/useMetrics'
import { useAlerts } from './hooks/useAlerts'
import { LoadingSkeleton } from '../components/LoadingSkeleton'
import { ErrorState } from '../components/ErrorState'
import { StaleIndicator } from '../components/StaleIndicator'
import { colonyFetch } from '../lib/api-client'
import { useCohort } from '../components/CohortSwitcher'
import { capture } from '../lib/posthog'
import { ColonyErrorBoundary } from '../components/ColonyErrorBoundary'
import { BillNyeAccuracyWidget } from '../components/BillNyeAccuracyWidget'
import { UnitEconomicsCard } from '../components/UnitEconomicsCard'
import { CustomerHealthAlerts } from '../components/CustomerHealthAlerts'
import { TimeToFirstTouchCard } from '../components/TimeToFirstTouchCard'
import { FunnelCrossTabsCard } from '../components/FunnelCrossTabsCard'
import { CustomerKPICard } from '../components/CustomerKPICard'
import type { LeadPayload } from '@/lib/colony/contracts'

// ─── Lead volume card (fetches independently) ────────────────────────────────

function LeadMetricCard() {
  const { cohortId } = useCohort()
  const [leads, setLeads] = useState<LeadPayload[] | null>(null)

  const load = useCallback(async () => {
    const res = await colonyFetch<LeadPayload[]>('leads', { cohortId })
    if (res.data) setLeads(res.data)
  }, [cohortId])

  useEffect(() => { load() }, [load])

  if (!leads) return <LoadingSkeleton variant="card" count={1} />

  const weekAgo = new Date(Date.now() - 7 * 86400000)
  const thisWeek = leads.filter((l) => new Date(l.created_at) >= weekAgo)
  const hotCount = leads.filter((l) => l.temperature === 'HOT').length
  const hotRate = leads.length > 0 ? ((hotCount / leads.length) * 100).toFixed(0) : '0'

  return (
    <MetricCard
      label="Lead Volume"
      value={thisWeek.length}
      delta={null}
      subtitle={`${hotRate}% HOT rate · ${leads.length} total`}
    />
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HealthPage() {
  const { data: metrics, status: metricsStatus, error: metricsError, lastSuccess, reload: reloadMetrics } = useMetrics()
  const { alerts, count: alertCount } = useAlerts()

  useEffect(() => { capture('colony_health_viewed') }, [])

  const sparklineData = metrics
    ? [metrics.mrr_last_month, metrics.mrr_current]
    : undefined

  return (
    <ColonyErrorBoundary>
    <main className="p-6 flex flex-col gap-6 h-[calc(100vh-48px)] overflow-y-auto">
      <header>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--colony-text-primary)' }}>
          Operations Health
        </h1>
        <p className="text-sm" style={{ color: 'var(--colony-text-secondary)' }}>
          Your business, at a glance. Updated every minute.
        </p>
      </header>

      {/* Customer-facing outcomes — what your investment is producing */}
      <section>
        <CustomerKPICard />
      </section>

      {/* 4 hero metric cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricsStatus === 'loading' && !metrics && (
          <LoadingSkeleton variant="card" count={4} />
        )}
        {metricsStatus === 'error' && (
          <div className="col-span-full">
            <ErrorState message={metricsError ?? undefined} onRetry={reloadMetrics} />
          </div>
        )}
        {metrics && (
          <>
            <MetricCard
              label="MRR"
              value={`$${metrics.mrr_current.toLocaleString()}`}
              delta={metrics.mrr_delta_pct}
              sparklineData={sparklineData}
              subtitle={`ARR: $${metrics.arr.toLocaleString()}`}
            />
            <MetricCard
              label="Active Clients"
              value={metrics.active_subscriptions}
              delta={null}
              subtitle={
                metrics.churn_rate_30d > 0
                  ? `Churn: ${(metrics.churn_rate_30d * 100).toFixed(1)}%`
                  : 'No churn this month'
              }
            />
            <MetricCard
              label="New Revenue (this month)"
              value={`$${metrics.new_revenue_this_month.toLocaleString()}`}
              delta={null}
              subtitle="Setup fees + new subscriptions"
            />
            <LeadMetricCard />
          </>
        )}
        {metricsStatus === 'stale' && metrics && (
          <div className="col-span-full">
            <StaleIndicator lastSuccessAt={lastSuccess ?? undefined} />
          </div>
        )}
      </section>

      {/* Alerts */}
      <section>
        <h2 className="text-lg font-semibold mb-3" style={{ color: 'var(--colony-text-primary)' }}>
          Today&apos;s Alerts
          {alertCount > 0 && (
            <span className="ml-2 text-sm font-normal" style={{ color: 'var(--colony-danger)' }}>
              {alertCount} need attention
            </span>
          )}
        </h2>
        <AlertsPanel alerts={alerts} />
      </section>

      {/* Customer health */}
      <section>
        <h2 className="text-lg font-semibold mb-3" style={{ color: 'var(--colony-text-primary)' }}>
          Customer Health
        </h2>
        <CustomerHealthAlerts />
      </section>

      {/* MRR breakdown */}
      {metrics && metrics.breakdown_by_plan.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-3" style={{ color: 'var(--colony-text-primary)' }}>
            Revenue by Plan
          </h2>
          <MRRBreakdownTable breakdown={metrics.breakdown_by_plan} />
        </section>
      )}

      {/* Unit economics — CFO-grade cost-per-stage view */}
      <section>
        <h2 className="text-lg font-semibold mb-3" style={{ color: 'var(--colony-text-primary)' }}>
          Unit Economics
        </h2>
        <UnitEconomicsCard />
      </section>

      {/* Speed to Lead */}
      <section>
        <h2 className="text-lg font-semibold mb-3" style={{ color: 'var(--colony-text-primary)' }}>
          Speed to Lead
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <TimeToFirstTouchCard />
        </div>
      </section>

      {/* Funnel Analysis */}
      <section>
        <h2 className="text-lg font-semibold mb-3" style={{ color: 'var(--colony-text-primary)' }}>
          Funnel Analysis
        </h2>
        <FunnelCrossTabsCard />
      </section>

      {/* Agent intelligence */}
      <section>
        <h2 className="text-lg font-semibold mb-3" style={{ color: 'var(--colony-text-primary)' }}>
          Agent Intelligence
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <BillNyeAccuracyWidget />
        </div>
      </section>
    </main>
    </ColonyErrorBoundary>
  )
}
