'use client'

import { useEffect, useState } from 'react'

type TimeWindow = '7d' | '30d' | '90d' | 'all'

interface UnitEconomics {
  window: TimeWindow
  window_start: string
  window_end: string
  cohort_id: string
  total_cost_usd: number
  total_api_calls: number
  total_tokens_in: number
  total_tokens_out: number
  bot_runs_count: number
  bot_runs_with_cost: number
  cost_by_bot: Record<string, { cost_usd: number; calls: number }>
  cost_by_model: Record<string, { cost_usd: number; calls: number }>
  leads_count: number
  audit_scheduled_count: number
  audit_complete_count: number
  proposal_sent_count: number
  proposal_signed_count: number
  active_customers_count: number
  churned_count: number
  cost_per_lead: number | null
  cost_per_audit_scheduled: number | null
  cost_per_audit_complete: number | null
  cost_per_proposal_sent: number | null
  cost_per_signed_deal: number | null
  lead_to_audit_pct: number | null
  audit_to_proposal_pct: number | null
  proposal_to_signed_pct: number | null
  overall_lead_to_customer_pct: number | null
  total_signed_amount_usd: number
  avg_deal_size_usd: number | null
  estimated_payback_days: number | null
  has_data: boolean
  warnings: string[]
}

function fmtUsd(v: number | null): string {
  if (v === null) return '—'
  if (v === 0) return '$0'
  if (v < 1) return `$${v.toFixed(3)}`
  if (v < 100) return `$${v.toFixed(2)}`
  return `$${Math.round(v).toLocaleString()}`
}

function fmtPct(v: number | null): string {
  return v === null ? '—' : `${v}%`
}

function fmtNum(v: number | null): string {
  return v === null ? '—' : v.toLocaleString()
}

const WINDOWS: TimeWindow[] = ['7d', '30d', '90d', 'all']

export function UnitEconomicsCard({ cohortId }: { cohortId?: string }) {
  const [window, setWindow] = useState<TimeWindow>('30d')
  const [data, setData] = useState<UnitEconomics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams({ window })
    if (cohortId) params.set('cohort_id', cohortId)
    fetch(`/api/colony/health/unit-economics?${params.toString()}`)
      .then((r) => r.json())
      .then((d) => {
        setData(d)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [window, cohortId])

  const panelStyle = {
    background: 'var(--colony-bg-elevated)',
    border: '1px solid var(--colony-border)',
  }

  if (loading) {
    return (
      <div className="p-4 rounded" style={panelStyle}>
        <div className="text-sm" style={{ color: 'var(--colony-text-secondary)' }}>
          Loading unit economics...
        </div>
      </div>
    )
  }

  if (!data || !data.has_data) {
    return (
      <div className="p-4 rounded" style={panelStyle}>
        <div className="text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--colony-text-secondary)' }}>
          Unit Economics
        </div>
        <div className="text-sm" style={{ color: 'var(--colony-text-secondary)' }}>
          No data yet for this cohort + window. Run a pipeline or wait for the EspoCRM funnel to populate.
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 rounded col-span-full" style={panelStyle}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-xs uppercase tracking-wider" style={{ color: 'var(--colony-text-secondary)' }}>
            Unit Economics
          </div>
          <div className="text-sm mt-1" style={{ color: 'var(--colony-text-secondary)' }}>
            CFO-grade view of cost per stage of funnel
          </div>
        </div>
        <div className="flex gap-1 text-xs">
          {WINDOWS.map((w) => (
            <button
              key={w}
              onClick={() => setWindow(w)}
              className="px-3 py-1 rounded transition-colors"
              style={
                window === w
                  ? { background: 'var(--colony-accent-tint)', color: 'var(--colony-teal-dark)', border: '1px solid var(--colony-accent)' }
                  : { background: 'transparent', color: 'var(--colony-text-secondary)', border: '1px solid var(--colony-border)' }
              }
            >
              {w}
            </button>
          ))}
        </div>
      </div>

      {data.warnings.length > 0 && (
        <div
          className="mb-3 p-2 rounded text-xs"
          style={{
            background: 'rgba(245,158,11,.08)',
            border: '1px solid rgba(245,158,11,.25)',
            color: '#f59e0b',
          }}
        >
          {data.warnings.map((w, i) => (
            <div key={i}>⚠ {w}</div>
          ))}
        </div>
      )}

      {/* Headline metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
        <div className="p-3 rounded" style={panelStyle}>
          <div className="text-xs" style={{ color: 'var(--colony-text-secondary)' }}>Cost per Lead</div>
          <div className="text-2xl font-semibold mt-1" style={{ color: 'var(--colony-text-primary)' }}>
            {fmtUsd(data.cost_per_lead)}
          </div>
          <div className="text-xs mt-1" style={{ color: 'var(--colony-text-secondary)' }}>
            {fmtNum(data.leads_count)} leads
          </div>
        </div>
        <div className="p-3 rounded" style={panelStyle}>
          <div className="text-xs" style={{ color: 'var(--colony-text-secondary)' }}>Cost per Audit</div>
          <div className="text-2xl font-semibold mt-1" style={{ color: 'var(--colony-text-primary)' }}>
            {fmtUsd(data.cost_per_audit_scheduled)}
          </div>
          <div className="text-xs mt-1" style={{ color: 'var(--colony-text-secondary)' }}>
            {fmtNum(data.audit_scheduled_count)} scheduled
          </div>
        </div>
        <div className="p-3 rounded" style={panelStyle}>
          <div className="text-xs" style={{ color: 'var(--colony-text-secondary)' }}>Cost per Signed Deal</div>
          <div className="text-2xl font-semibold mt-1" style={{ color: '#34d399' }}>
            {fmtUsd(data.cost_per_signed_deal)}
          </div>
          <div className="text-xs mt-1" style={{ color: 'var(--colony-text-secondary)' }}>
            {fmtNum(data.proposal_signed_count)} signed
          </div>
        </div>
        <div className="p-3 rounded" style={panelStyle}>
          <div className="text-xs" style={{ color: 'var(--colony-text-secondary)' }}>Estimated Payback</div>
          <div className="text-2xl font-semibold mt-1" style={{ color: 'var(--colony-text-primary)' }}>
            {data.estimated_payback_days === null ? '—' : `${data.estimated_payback_days} days`}
          </div>
          <div className="text-xs mt-1" style={{ color: 'var(--colony-text-secondary)' }}>
            avg deal {fmtUsd(data.avg_deal_size_usd)}
          </div>
        </div>
      </div>

      {/* Conversion funnel */}
      <div className="mb-4">
        <div className="text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--colony-text-secondary)' }}>
          Funnel Conversion ({window})
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
          <div className="p-2 rounded" style={panelStyle}>
            <div className="text-xs" style={{ color: 'var(--colony-text-secondary)' }}>Lead → Audit</div>
            <div style={{ color: 'var(--colony-text-primary)' }}>{fmtPct(data.lead_to_audit_pct)}</div>
          </div>
          <div className="p-2 rounded" style={panelStyle}>
            <div className="text-xs" style={{ color: 'var(--colony-text-secondary)' }}>Audit → Proposal</div>
            <div style={{ color: 'var(--colony-text-primary)' }}>{fmtPct(data.audit_to_proposal_pct)}</div>
          </div>
          <div className="p-2 rounded" style={panelStyle}>
            <div className="text-xs" style={{ color: 'var(--colony-text-secondary)' }}>Proposal → Signed</div>
            <div style={{ color: 'var(--colony-text-primary)' }}>{fmtPct(data.proposal_to_signed_pct)}</div>
          </div>
          <div className="p-2 rounded" style={panelStyle}>
            <div className="text-xs" style={{ color: 'var(--colony-text-secondary)' }}>Lead → Customer</div>
            <div style={{ color: '#34d399' }}>{fmtPct(data.overall_lead_to_customer_pct)}</div>
          </div>
        </div>
      </div>

      {/* Cost breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--colony-text-secondary)' }}>
            Cost by Bot
          </div>
          <div className="space-y-1 text-xs">
            {Object.entries(data.cost_by_bot)
              .sort((a, b) => b[1].cost_usd - a[1].cost_usd)
              .slice(0, 8)
              .map(([bot, v]) => (
                <div key={bot} className="flex justify-between">
                  <span style={{ color: 'var(--colony-text-secondary)' }}>{bot}</span>
                  <span style={{ color: 'var(--colony-text-primary)' }}>
                    {fmtUsd(v.cost_usd)}{' '}
                    <span style={{ color: 'var(--colony-text-secondary)', opacity: 0.7 }}>({v.calls} calls)</span>
                  </span>
                </div>
              ))}
            {Object.keys(data.cost_by_bot).length === 0 && (
              <div style={{ color: 'var(--colony-text-secondary)', fontStyle: 'italic' }}>no bot cost data yet</div>
            )}
          </div>
        </div>

        <div>
          <div className="text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--colony-text-secondary)' }}>
            Cost by Model
          </div>
          <div className="space-y-1 text-xs">
            {Object.entries(data.cost_by_model)
              .sort((a, b) => b[1].cost_usd - a[1].cost_usd)
              .map(([model, v]) => (
                <div key={model} className="flex justify-between">
                  <span style={{ color: 'var(--colony-text-secondary)' }}>{model}</span>
                  <span style={{ color: 'var(--colony-text-primary)' }}>
                    {fmtUsd(v.cost_usd)}{' '}
                    <span style={{ color: 'var(--colony-text-secondary)', opacity: 0.7 }}>({v.calls} calls)</span>
                  </span>
                </div>
              ))}
            {Object.keys(data.cost_by_model).length === 0 && (
              <div style={{ color: 'var(--colony-text-secondary)', fontStyle: 'italic' }}>no model cost data yet</div>
            )}
          </div>
        </div>
      </div>

      {/* Footer totals */}
      <div
        className="mt-4 pt-3 grid grid-cols-2 md:grid-cols-4 gap-2 text-xs"
        style={{ borderTop: '1px solid var(--colony-border)', color: 'var(--colony-text-secondary)' }}
      >
        <div>
          Total cost: <span style={{ color: 'var(--colony-text-primary)' }}>{fmtUsd(data.total_cost_usd)}</span>
        </div>
        <div>
          API calls: <span style={{ color: 'var(--colony-text-primary)' }}>{fmtNum(data.total_api_calls)}</span>
        </div>
        <div>
          Tokens in: <span style={{ color: 'var(--colony-text-primary)' }}>{fmtNum(data.total_tokens_in)}</span>
        </div>
        <div>
          Tokens out: <span style={{ color: 'var(--colony-text-primary)' }}>{fmtNum(data.total_tokens_out)}</span>
        </div>
      </div>
    </div>
  )
}
