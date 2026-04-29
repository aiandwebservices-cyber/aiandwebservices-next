'use client'

import { useState, useEffect, useCallback } from 'react'
import { useCohort } from './CohortSwitcher'
import type { UnitEconomics } from '@/lib/colony/unit-economics'
import type { ExternalCostSummary } from '@/lib/colony/external-cost'

export function BotCostDayCard() {
  const { cohortId } = useCohort()
  const [day, setDay] = useState<UnitEconomics | null>(null)
  const [week, setWeek] = useState<UnitEconomics | null>(null)
  const [ext, setExt] = useState<ExternalCostSummary | null>(null)
  const [extWeek, setExtWeek] = useState<ExternalCostSummary | null>(null)
  const [status, setStatus] = useState<'loading' | 'ok' | 'error'>('loading')

  const load = useCallback(async () => {
    try {
      const p = cohortId ? `&cohort_id=${cohortId}` : ''
      const [d, w, e, ew] = await Promise.all([
        fetch(`/api/colony/health/unit-economics?window=1d${p}`, { credentials: 'include' }).then(r => r.json()),
        fetch(`/api/colony/health/unit-economics?window=7d${p}`, { credentials: 'include' }).then(r => r.json()),
        fetch(`/api/colony/external-cost?window=1d${p}`, { credentials: 'include' }).then(r => r.json()).catch(() => null),
        fetch(`/api/colony/external-cost?window=7d${p}`, { credentials: 'include' }).then(r => r.json()).catch(() => null),
      ])
      setDay(d)
      setWeek(w)
      setExt(e)
      setExtWeek(ew)
      setStatus('ok')
    } catch {
      setStatus('error')
    }
  }, [cohortId])

  useEffect(() => { load() }, [load])

  if (status === 'loading') return (
    <div style={{ fontSize: 'clamp(11px, 1vw, 14px)', color: 'rgba(255,255,255,.3)' }}>Loading…</div>
  )
  if (status === 'error') return (
    <div style={{ fontSize: 'clamp(11px, 1vw, 14px)', color: 'rgba(239,68,68,.7)' }}>Cost data unavailable</div>
  )

  const anthropicCost = day?.total_cost_usd ?? 0
  const externalCost = ext?.total_plan_a_usd ?? 0
  const totalCost = anthropicCost + externalCost
  const runs = day?.bot_runs_count ?? 0
  const runsWithCost = day?.bot_runs_with_cost ?? 0
  const apiCalls = day?.total_api_calls ?? 0
  const avgCostPerRun = runsWithCost > 0 ? totalCost / runsWithCost : null

  const weekTotalCost = (week?.total_cost_usd ?? 0) + (extWeek?.total_plan_a_usd ?? 0)
  const weekDailyAvg = weekTotalCost / 7
  const vsAvg = weekDailyAvg > 0 ? ((totalCost - weekDailyAvg) / weekDailyAvg) * 100 : null

  // Top bot by cost
  const costByBot = day?.cost_by_bot ?? {}
  const topBot = Object.entries(costByBot).sort((a, b) => b[1].cost_usd - a[1].cost_usd)[0]

  const trendColor = vsAvg === null ? 'rgba(255,255,255,.4)'
    : vsAvg > 20 ? '#ef4444'
    : vsAvg > 0 ? '#fbbf24'
    : '#34d399'

  const trendLabel = vsAvg === null ? 'no baseline'
    : vsAvg > 0 ? `+${vsAvg.toFixed(0)}% vs 7d avg`
    : `${vsAvg.toFixed(0)}% vs 7d avg`

  return (
    <div style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
      {/* Header */}
      <div style={{ fontSize: 'clamp(11px, 1vw, 14px)', fontWeight: 700, letterSpacing: '1.5px', color: 'rgba(255,255,255,.4)', textTransform: 'uppercase', marginBottom: 12, textAlign: 'center' }}>
        Bot Spend · Today
      </div>

      {/* Big number */}
      <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: '38px', color: trendColor, lineHeight: 1, letterSpacing: '-1px', textAlign: 'center' }}>
        ${totalCost < 0.01 ? totalCost.toFixed(4) : totalCost.toFixed(2)}
      </div>
      <div style={{ marginTop: 8, fontSize: 'clamp(9px, 0.75vw, 11px)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: trendColor, textAlign: 'center' }}>
        {trendLabel}
      </div>

      {/* Breakdown rows */}
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
          <span style={{ fontSize: 'clamp(11px, 1vw, 14px)', color: 'rgba(255,255,255,.3)' }}>7d daily avg</span>
          <span style={{ fontSize: 'clamp(11px, 1vw, 14px)', fontWeight: 700, color: 'rgba(255,255,255,.6)' }}>
            ${weekDailyAvg.toFixed(2)}
          </span>
        </div>
      </div>

      {/* External API cost · 1d */}
      <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid rgba(34,211,238,.15)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 'clamp(11px, 1vw, 14px)', color: 'rgba(34,211,238,.55)', fontWeight: 600, letterSpacing: '0.3px' }} title="Outscraper + Firecrawl + Instantly @ Plan A">
          Ext API · 1d
        </span>
        <span style={{ fontSize: 'clamp(11px, 1vw, 14px)', fontWeight: 700, color: '#22d3ee' }}>
          ${(ext?.total_plan_a_usd ?? 0).toFixed(2)}
        </span>
      </div>

      {/* Corner glow */}
      <div style={{ position: 'absolute', bottom: -20, right: -8, width: 90, height: 90, borderRadius: '50%', background: '#f97316', opacity: 0.07, filter: 'blur(30px)', pointerEvents: 'none' }} />
    </div>
  )
}
