'use client'

import { useEffect, useState } from 'react'

interface KPIs {
  leads_this_month: number
  monthly_lead_target: number
  leads_pace_pct: number | null
  days_remaining_in_month: number
  projected_month_end_leads: number | null
  median_response_minutes: number | null
  response_sample_size: number
  pipeline_value_usd: number
  pipeline_deal_count: number
  active_mrr_usd: number
  expected_12mo_value_usd: number
  assumed_close_rate_pct: number
  wins_30d: number
  losses_30d: number
  win_rate_pct: number | null
  customer_health_score: number | null
  health_grade: string | null
  at_risk_signals: string[]
  projected_monthly_revenue_usd: number
  expected_next_deal_days: number | null
  has_data: boolean
  warnings: string[]
}

function fmtUsd(v: number): string {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(2)}M`
  if (v >= 1000) return `$${(v / 1000).toFixed(1)}k`
  return `$${Math.round(v).toLocaleString()}`
}

function fmtResponse(m: number | null): string {
  if (m === null) return '—'
  if (m < 1) return `${Math.round(m * 60)}s`
  if (m < 60) return `${Math.round(m)}m`
  if (m < 1440) return `${(m / 60).toFixed(1)}h`
  return `${(m / 1440).toFixed(1)}d`
}

function paceColor(pct: number | null): string {
  if (pct === null) return 'var(--colony-text-muted)'
  if (pct >= 100) return '#34d399'
  if (pct >= 70) return 'var(--colony-accent)'
  if (pct >= 40) return '#f59e0b'
  return '#ef4444'
}

function responseColor(m: number | null): string {
  if (m === null) return 'var(--colony-text-muted)'
  if (m < 5) return '#34d399'
  if (m < 60) return 'var(--colony-accent)'
  if (m < 1440) return '#f59e0b'
  return '#ef4444'
}

const panelStyle: React.CSSProperties = {
  background: 'var(--colony-bg-elevated)',
  border: '1px solid var(--colony-border)',
  borderRadius: 14,
  padding: '1.25rem',
}

const tileStyle: React.CSSProperties = {
  padding: '0.75rem',
  background: 'var(--colony-row-bg)',
  border: '1px solid var(--colony-row-border)',
  borderRadius: 10,
}

export function CustomerKPICard({ cohortId }: { cohortId?: string }) {
  const [kpis, setKpis] = useState<KPIs | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const params = new URLSearchParams()
    if (cohortId) params.set('cohort_id', cohortId)
    fetch(`/api/colony/health/customer-kpis?${params.toString()}`)
      .then((r) => r.json())
      .then((d) => {
        setKpis(d)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [cohortId])

  if (loading) {
    return (
      <div style={panelStyle}>
        <div style={{ fontSize: '0.875rem', color: 'var(--colony-text-secondary)' }}>Loading your results...</div>
      </div>
    )
  }

  if (!kpis || !kpis.has_data) {
    return (
      <div style={panelStyle}>
        <div
          style={{
            fontSize: '0.75rem',
            color: 'var(--colony-text-secondary)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '0.5rem',
          }}
        >
          Your Results
        </div>
        <div style={{ fontSize: '0.875rem', color: 'var(--colony-text-secondary)' }}>
          No data yet — metrics will appear as leads and deals come in.
        </div>
      </div>
    )
  }

  return (
    <div style={panelStyle}>
      <div style={{ marginBottom: '1rem' }}>
        <div
          style={{
            fontSize: '0.75rem',
            color: 'var(--colony-text-secondary)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          Your Results
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--colony-text-secondary)', marginTop: '0.25rem' }}>
          What your investment is producing
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '0.75rem',
        }}
      >
        {/* Leads pace */}
        <div style={tileStyle}>
          <div
            style={{
              fontSize: '0.7rem',
              color: 'var(--colony-text-secondary)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Leads This Month
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '0.4rem' }}>
            <div style={{ fontSize: '1.75rem', fontWeight: 700, color: paceColor(kpis.leads_pace_pct) }}>
              {kpis.leads_this_month}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--colony-text-secondary)' }}>
              of {kpis.monthly_lead_target}
            </div>
          </div>
          {kpis.leads_pace_pct !== null && (
            <div style={{ fontSize: '0.7rem', color: paceColor(kpis.leads_pace_pct), marginTop: '0.25rem' }}>
              {kpis.leads_pace_pct}% of target
            </div>
          )}
          {kpis.projected_month_end_leads !== null && (
            <div style={{ fontSize: '0.7rem', color: 'var(--colony-text-secondary)', marginTop: '0.25rem' }}>
              on pace for {kpis.projected_month_end_leads} ({kpis.days_remaining_in_month}d left)
            </div>
          )}
        </div>

        {/* Response time */}
        <div style={tileStyle}>
          <div
            style={{
              fontSize: '0.7rem',
              color: 'var(--colony-text-secondary)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Avg Response Time
          </div>
          <div
            style={{
              fontSize: '1.75rem',
              fontWeight: 700,
              color: responseColor(kpis.median_response_minutes),
              marginTop: '0.4rem',
            }}
          >
            {fmtResponse(kpis.median_response_minutes)}
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--colony-text-secondary)', marginTop: '0.25rem' }}>
            median over last 30d
            {kpis.response_sample_size > 0 ? ` · n=${kpis.response_sample_size}` : ''}
          </div>
        </div>

        {/* Pipeline value */}
        <div style={tileStyle}>
          <div
            style={{
              fontSize: '0.7rem',
              color: 'var(--colony-text-secondary)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Pipeline Value
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--colony-text-primary)', marginTop: '0.4rem' }}>
            {fmtUsd(kpis.pipeline_value_usd)}
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--colony-text-secondary)', marginTop: '0.25rem' }}>
            {kpis.pipeline_deal_count} deal{kpis.pipeline_deal_count === 1 ? '' : 's'}
          </div>
        </div>

        {/* Expected 12-month value */}
        <div style={tileStyle}>
          <div
            style={{
              fontSize: '0.7rem',
              color: 'var(--colony-text-secondary)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Expected 12-Mo Value
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#34d399', marginTop: '0.4rem' }}>
            {fmtUsd(kpis.expected_12mo_value_usd)}
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--colony-text-secondary)', marginTop: '0.25rem' }}>
            {fmtUsd(kpis.active_mrr_usd)} MRR + proposals @ {kpis.assumed_close_rate_pct}%
          </div>
        </div>

        {/* Win rate */}
        <div style={tileStyle}>
          <div
            style={{
              fontSize: '0.7rem',
              color: 'var(--colony-text-secondary)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Win Rate (30d)
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--colony-text-primary)', marginTop: '0.4rem' }}>
            {kpis.win_rate_pct === null ? '—' : `${kpis.win_rate_pct}%`}
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--colony-text-secondary)', marginTop: '0.25rem' }}>
            {kpis.wins_30d} won · {kpis.losses_30d} lost
          </div>
        </div>
      </div>

      {/* Looking Forward section */}
      {kpis.customer_health_score !== null && (
        <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--colony-border)' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--colony-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
            Looking Forward
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.5rem' }}>
            <div style={{ padding: '0.5rem', background: 'var(--colony-bg)', borderRadius: '4px' }}>
              <div style={{ fontSize: '0.65rem', color: 'var(--colony-text-muted)' }}>Customer Health</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '0.25rem' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 600, color:
                  (kpis.customer_health_score ?? 0) >= 80 ? 'var(--colony-success, #10b981)' :
                  (kpis.customer_health_score ?? 0) >= 60 ? 'var(--colony-warning, #f59e0b)' :
                  'var(--colony-danger, #ef4444)'
                }}>
                  {kpis.customer_health_score}
                </div>
                {kpis.health_grade && (
                  <div style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--colony-text-muted)' }}>
                    {kpis.health_grade}
                  </div>
                )}
              </div>
            </div>

            {kpis.expected_next_deal_days !== null && (
              <div style={{ padding: '0.5rem', background: 'var(--colony-bg)', borderRadius: '4px' }}>
                <div style={{ fontSize: '0.65rem', color: 'var(--colony-text-muted)' }}>Next Deal ETA</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--colony-text-primary)', marginTop: '0.25rem' }}>
                  ~{kpis.expected_next_deal_days}d
                </div>
              </div>
            )}

            <div style={{ padding: '0.5rem', background: 'var(--colony-bg)', borderRadius: '4px' }}>
              <div style={{ fontSize: '0.65rem', color: 'var(--colony-text-muted)' }}>Monthly Revenue</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--colony-success, #10b981)', marginTop: '0.25rem' }}>
                {fmtUsd(kpis.projected_monthly_revenue_usd)}
              </div>
            </div>
          </div>

          {kpis.at_risk_signals.length > 0 && (
            <div style={{ marginTop: '0.75rem', padding: '0.5rem', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '4px' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--colony-warning, #f59e0b)', fontWeight: 500, marginBottom: '0.25rem' }}>
                At-Risk Signals ({kpis.at_risk_signals.length})
              </div>
              {kpis.at_risk_signals.map((s, i) => (
                <div key={i} style={{ fontSize: '0.7rem', color: 'var(--colony-text-secondary)', marginLeft: '0.75rem' }}>
                  • {s}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {kpis.warnings && kpis.warnings.length > 0 && (
        <div
          style={{
            marginTop: '0.75rem',
            padding: '0.5rem 0.75rem',
            background: 'rgba(245,158,11,.08)',
            border: '1px solid rgba(245,158,11,.25)',
            borderRadius: 8,
            fontSize: '0.7rem',
            color: '#f59e0b',
          }}
        >
          {kpis.warnings.map((w, i) => (
            <div key={i}>⚠ {w}</div>
          ))}
        </div>
      )}
    </div>
  )
}
