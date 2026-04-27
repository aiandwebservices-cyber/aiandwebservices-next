'use client'

import { useState, useEffect, useCallback } from 'react'
import { useCohort } from './CohortSwitcher'
import type { UnitEconomics } from '@/lib/colony/unit-economics'

export function CostPerLeadCard() {
  const { cohortId } = useCohort()
  const [data, setData] = useState<UnitEconomics | null>(null)
  const [status, setStatus] = useState<'loading' | 'ok' | 'error'>('loading')

  const load = useCallback(async () => {
    try {
      const params = new URLSearchParams({ window: '7d' })
      if (cohortId) params.set('cohort_id', cohortId)
      const res = await fetch(`/api/colony/health/unit-economics?${params}`, { credentials: 'include' })
      if (!res.ok) throw new Error('fetch failed')
      const json = await res.json()
      setData(json)
      setStatus('ok')
    } catch {
      setStatus('error')
    }
  }, [cohortId])

  useEffect(() => { load() }, [load])

  const hasRealCost = data && data.bot_runs_with_cost > 0
  const cpl = data?.cost_per_lead
  const totalCost = data?.total_cost_usd ?? 0
  const leadsInWindow = data?.leads_count ?? 0
  const hotWarm = (data?.audit_scheduled_count ?? 0) + (data?.audit_complete_count ?? 0)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
      {/* Header */}
      <div style={{ fontSize: 'clamp(11px, 1vw, 14px)', fontWeight: 700, letterSpacing: '1.5px', color: 'rgba(255,255,255,.4)', textTransform: 'uppercase', marginBottom: 12, textAlign: 'center' }}>
        Cost per Lead · 7d
      </div>

      {status === 'loading' && (
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,.3)' }}>Loading…</div>
      )}

      {status === 'error' && (
        <div style={{ fontSize: 12, color: 'rgba(239,68,68,.7)' }}>Cost data unavailable</div>
      )}

      {status === 'ok' && (
        <>
          {/* Big number */}
          <div style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 800,
            fontSize: '38px',
            color: cpl != null && cpl < 20 ? '#34d399' : cpl != null && cpl < 50 ? '#fbbf24' : '#ef4444',
            lineHeight: 1,
            letterSpacing: '-1px',
            textAlign: 'center',
          }}>
            {cpl != null ? `$${cpl < 1 ? cpl.toFixed(3) : cpl.toFixed(2)}` : 'No data yet'}
          </div>

          <div style={{ marginTop: 8, fontSize: 'clamp(9px, 0.75vw, 11px)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'rgba(255,255,255,.55)', textAlign: 'center' }}>
            {cpl != null ? 'per lead · Anthropic cost' : 'awaiting run data'}
          </div>

          {/* Breakdown */}
          <div style={{ marginTop: 16, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,.06)', display: 'flex', flexDirection: 'column', gap: 5 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 'clamp(11px, 1vw, 14px)', color: 'rgba(255,255,255,.3)' }}>Total spend (7d)</span>
              <span style={{ fontSize: 'clamp(11px, 1vw, 14px)', fontWeight: 700, color: 'rgba(255,255,255,.6)' }}>
                ${totalCost < 0.01 ? totalCost.toFixed(4) : totalCost.toFixed(2)}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 'clamp(11px, 1vw, 14px)', color: 'rgba(255,255,255,.3)' }}>Leads in window</span>
              <span style={{ fontSize: 'clamp(11px, 1vw, 14px)', fontWeight: 700, color: 'rgba(255,255,255,.6)' }}>{leadsInWindow}</span>
            </div>
            {hotWarm > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 'clamp(11px, 1vw, 14px)', color: 'rgba(255,255,255,.3)' }}>HOT + WARM Leads</span>
                <span style={{ fontSize: 'clamp(11px, 1vw, 14px)', fontWeight: 700, color: '#34d399' }}>{hotWarm}</span>
              </div>
            )}
            {!hasRealCost && status === 'ok' && (
              <div style={{ fontSize: 9, color: 'rgba(245,158,11,.6)', marginTop: 2, lineHeight: 1.4 }}>
                ⚠ No cost_usd in bot_runs yet — external API costs not tracked
              </div>
            )}
          </div>

        </>
      )}

      {/* Corner glow */}
      <div style={{ position: 'absolute', bottom: -20, right: -8, width: 90, height: 90, borderRadius: '50%', background: '#f97316', opacity: 0.07, filter: 'blur(30px)', pointerEvents: 'none' }} />
    </div>
  )
}
