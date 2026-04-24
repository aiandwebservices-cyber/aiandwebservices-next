'use client'

import { useEffect } from 'react'
import { useVelocity } from '../hooks/useVelocity'
import { LoadingSkeleton } from '../../components/LoadingSkeleton'
import { capture } from '../../lib/posthog'
import type { VelocityPayload } from '@/lib/colony/contracts'

interface TileProps {
  icon: string
  label: string
  value: number | null
  unit: string
  qualifier: 'avg' | 'p90'
}

function MetricTile({ icon, label, value, unit, qualifier }: TileProps) {
  return (
    <div className="p-4 rounded-xl" style={{ background: 'var(--colony-bg-elevated)' }}>
      <div className="flex items-start justify-between mb-2">
        <span className="text-lg leading-none">{icon}</span>
        <span
          className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
          style={{ background: 'rgba(163,163,163,0.1)', color: 'var(--colony-text-secondary)' }}
        >
          {qualifier}
        </span>
      </div>
      <div className="mt-1">
        <span className="text-2xl font-bold tabular-nums" style={{ color: 'var(--colony-text-primary)' }}>
          {value !== null ? value.toFixed(1) : '—'}
        </span>
        <span className="text-sm ml-1" style={{ color: 'var(--colony-text-secondary)' }}>{unit}</span>
      </div>
      <p className="text-xs mt-1" style={{ color: 'var(--colony-text-secondary)' }}>{label}</p>
    </div>
  )
}

export function VelocityPanel() {
  const { data, status } = useVelocity()

  useEffect(() => {
    if (status === 'ok') capture('colony_analytics_section_viewed', { section: 'velocity' })
  }, [status])

  if (status === 'loading') return <LoadingSkeleton variant="card" count={3} />
  if (status === 'error' || !data) {
    return (
      <div className="flex items-center justify-center h-40 rounded-xl" style={{ background: 'rgba(163,163,163,0.04)', border: '1px dashed var(--colony-border)' }}>
        <p className="text-sm" style={{ color: 'var(--colony-text-secondary)' }}>Need more data to compute</p>
      </div>
    )
  }

  const d: VelocityPayload = data
  return (
    <div className="grid grid-cols-2 gap-3">
      <MetricTile icon="⚡" label="Lead → First touch"   value={d.avg_hours_lead_to_first_touch}  unit="hr" qualifier="avg" />
      <MetricTile icon="💬" label="First touch → Reply"  value={d.avg_hours_first_touch_to_reply} unit="hr" qualifier="avg" />
      <MetricTile icon="📅" label="Reply → Audit"        value={d.avg_days_reply_to_audit}         unit="d"  qualifier="avg" />
      <MetricTile icon="✍️" label="Audit → Signed"       value={d.avg_days_audit_to_signed}        unit="d"  qualifier="avg" />
      <MetricTile icon="🚀" label="Lead → Active"        value={d.avg_days_lead_to_active}         unit="d"  qualifier="avg" />
      <MetricTile icon="📊" label="Lead → Active"        value={d.p90_days_lead_to_active}         unit="d"  qualifier="p90" />
    </div>
  )
}
