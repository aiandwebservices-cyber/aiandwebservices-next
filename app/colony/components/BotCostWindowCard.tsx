'use client'

import { useState, useEffect, useCallback } from 'react'
import { useCohort } from './CohortSwitcher'
import type { UnitEconomics } from '@/lib/colony/unit-economics'
import type { ExternalCostSummary } from '@/lib/colony/external-cost'

type WindowConfig = {
  window: '7d' | '30d'
  label: string
  compareWindow: '30d' | '90d'
  compareLabel: string
  compareDivisor: number  // how many of `window` fit in `compareWindow`
}

const CONFIGS: Record<string, WindowConfig> = {
  '7d': {
    window: '7d',
    label: '7d',
    compareWindow: '30d',
    compareLabel: '30d weekly avg',
    compareDivisor: 30 / 7,  // ~4.28 weeks in 30d
  },
  '30d': {
    window: '30d',
    label: '30d',
    compareWindow: '90d',
    compareLabel: '90d monthly avg',
    compareDivisor: 3,  // 3 months in 90d
  },
}

export function BotCostWindowCard({ window: w }: { window: '7d' | '30d' }) {
  const cfg = CONFIGS[w]
  const { cohortId } = useCohort()
  const [primary, setPrimary] = useState<UnitEconomics | null>(null)
  const [compare, setCompare] = useState<UnitEconomics | null>(null)
  const [ext, setExt] = useState<ExternalCostSummary | null>(null)
  const [extCompare, setExtCompare] = useState<ExternalCostSummary | null>(null)
  const [status, setStatus] = useState<'loading' | 'ok' | 'error'>('loading')

  const load = useCallback(async () => {
    try {
      const p = cohortId ? `&cohort_id=${cohortId}` : ''
      const [pData, cData, eData, ecData] = await Promise.all([
        fetch(`/api/colony/health/unit-economics?window=${cfg.window}${p}`, { credentials: 'include' }).then(r => r.json()),
        fetch(`/api/colony/health/unit-economics?window=${cfg.compareWindow}${p}`, { credentials: 'include' }).then(r => r.json()),
        fetch(`/api/colony/external-cost?window=${cfg.window}${p}`, { credentials: 'include' }).then(r => r.json()).catch(() => null),
        fetch(`/api/colony/external-cost?window=${cfg.compareWindow}${p}`, { credentials: 'include' }).then(r => r.json()).catch(() => null),
      ])
      setPrimary(pData)
      setCompare(cData)
      setExt(eData)
      setExtCompare(ecData)
      setStatus('ok')
    } catch {
      setStatus('error')
    }
  }, [cohortId, cfg.window, cfg.compareWindow])

  useEffect(() => { load() }, [load])

  if (status === 'loading') return (
    <div style={{ fontSize: 'clamp(11px, 1vw, 14px)', color: 'rgba(255,255,255,.3)' }}>Loading…</div>
  )
  if (status === 'error') return (
    <div style={{ fontSize: 'clamp(11px, 1vw, 14px)', color: 'rgba(239,68,68,.7)' }}>Cost data unavailable</div>
  )

  const anthropicCost = primary?.total_cost_usd ?? 0
  const externalCost = ext?.total_plan_a_usd ?? 0
  const totalCost = anthropicCost + externalCost
  const runs = primary?.bot_runs_count ?? 0
  const runsWithCost = primary?.bot_runs_with_cost ?? 0
  const apiCalls = primary?.total_api_calls ?? 0
  const avgCostPerRun = runsWithCost > 0 ? totalCost / runsWithCost : null

  const compareTotal = (compare?.total_cost_usd ?? 0) + (extCompare?.total_plan_a_usd ?? 0)
  const baseline = compareTotal > 0 ? compareTotal / cfg.compareDivisor : 0
  const vsAvg = baseline > 0 ? ((totalCost - baseline) / baseline) * 100 : null

  const costByBot = primary?.cost_by_bot ?? {}
  const topBot = Object.entries(costByBot).sort((a, b) => b[1].cost_usd - a[1].cost_usd)[0]

  const trendColor = vsAvg === null ? 'rgba(255,255,255,.4)'
    : vsAvg > 20 ? '#ef4444'
    : vsAvg > 0 ? '#fbbf24'
    : '#34d399'

  const trendLabel = vsAvg === null ? 'no baseline'
    : vsAvg > 0 ? `+${vsAvg.toFixed(0)}% vs ${cfg.compareLabel}`
    : `${vsAvg.toFixed(0)}% vs ${cfg.compareLabel}`

  return (
    <div style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <div style={{ fontSize: 'clamp(11px, 1vw, 14px)', fontWeight: 700, letterSpacing: '1.5px', color: 'rgba(255,255,255,.4)', textTransform: 'uppercase', marginBottom: 12, textAlign: 'center' }}>
        Bot Spend · {cfg.label}
      </div>

      <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: '38px', color: trendColor, lineHeight: 1, letterSpacing: '-1px', textAlign: 'center' }}>
        ${totalCost < 0.01 ? totalCost.toFixed(4) : totalCost.toFixed(2)}
      </div>
      {primary?.cost_source === 'anthropic_admin_api' && (
        <div
          title="Total comes from Anthropic Admin API cost report (org-billed truth)"
          style={{ marginTop: 4, fontSize: 'clamp(8px, 0.65vw, 10px)', color: 'rgba(52,211,153,.7)', textAlign: 'center', letterSpacing: '0.5px' }}
        >
          billed · Anthropic
        </div>
      )}
      <div style={{ marginTop: 8, fontSize: 'clamp(9px, 0.75vw, 11px)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: trendColor, textAlign: 'center' }}>
        {trendLabel}
      </div>

      <div style={{ marginTop: 16, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,.06)', display: 'flex', flexDirection: 'column', gap: 5 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 'clamp(11px, 1vw, 14px)', color: 'rgba(255,255,255,.3)' }}>Bot runs</span>
          <span style={{ fontSize: 'clamp(11px, 1vw, 14px)', fontWeight: 700, color: 'rgba(255,255,255,.6)' }}>
            {runsWithCost}/{runs} tracked
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 'clamp(11px, 1vw, 14px)', color: 'rgba(255,255,255,.3)' }}>API calls</span>
          <span style={{ fontSize: 'clamp(11px, 1vw, 14px)', fontWeight: 700, color: 'rgba(255,255,255,.6)' }}>{apiCalls}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 'clamp(11px, 1vw, 14px)', color: 'rgba(255,255,255,.3)' }}>Avg cost / run</span>
          <span style={{ fontSize: 'clamp(11px, 1vw, 14px)', fontWeight: 700, color: 'rgba(255,255,255,.6)' }}>
            {avgCostPerRun !== null ? `$${avgCostPerRun.toFixed(4)}` : '—'}
          </span>
        </div>
        {topBot && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 'clamp(11px, 1vw, 14px)', color: 'rgba(255,255,255,.3)' }}>{topBot[0]}</span>
            <span style={{ fontSize: 'clamp(11px, 1vw, 14px)', fontWeight: 700, color: '#f97316' }}>
              ${topBot[1].cost_usd.toFixed(2)}
            </span>
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 'clamp(11px, 1vw, 14px)', color: 'rgba(255,255,255,.3)' }}>{cfg.compareLabel}</span>
          <span style={{ fontSize: 'clamp(11px, 1vw, 14px)', fontWeight: 700, color: 'rgba(255,255,255,.6)' }}>
            ${baseline.toFixed(2)}
          </span>
        </div>
      </div>

      {/* External API cost · matches this card's window */}
      <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid rgba(34,211,238,.15)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 'clamp(11px, 1vw, 14px)', color: 'rgba(34,211,238,.55)', fontWeight: 600, letterSpacing: '0.3px' }} title="Outscraper + Firecrawl + Instantly @ Plan A">
          Ext API · {cfg.label}
        </span>
        <span style={{ fontSize: 'clamp(11px, 1vw, 14px)', fontWeight: 700, color: '#22d3ee' }}>
          ${(ext?.total_plan_a_usd ?? 0).toFixed(2)}
        </span>
      </div>

      <div style={{ position: 'absolute', bottom: -20, right: -8, width: 90, height: 90, borderRadius: '50%', background: '#f97316', opacity: 0.07, filter: 'blur(30px)', pointerEvents: 'none' }} />
    </div>
  )
}
