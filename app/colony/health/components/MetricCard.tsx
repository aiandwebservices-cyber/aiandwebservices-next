'use client'

import { useState } from 'react'
import { Sparkline } from './Sparkline'
import { capture } from '../../lib/posthog'

interface MetricCardProps {
  label: string
  value: string | number
  delta?: number | null
  sparklineData?: number[]
  subtitle?: string
}

export function MetricCard({ label, value, delta, sparklineData, subtitle }: MetricCardProps) {
  const [hovered, setHovered] = useState(false)

  const handleClick = () => {
    capture('colony_metric_card_clicked', { label })
  }

  return (
    <div
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
      className="rounded-xl p-4 flex flex-col gap-2 cursor-pointer transition-all"
      style={{
        background: 'var(--colony-bg-elevated)',
        border: '1px solid var(--colony-border)',
        transform: hovered ? 'translateY(-2px)' : 'none',
        boxShadow: hovered ? '0 6px 20px rgba(0,0,0,0.15)' : '0 1px 4px rgba(0,0,0,0.06)',
        transition: 'transform 150ms ease, box-shadow 150ms ease',
      }}
    >
      {/* Label */}
      <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--colony-text-secondary)' }}>
        {label}
      </p>

      {/* Value + delta */}
      <div className="flex items-end gap-2">
        <span className="text-3xl font-bold leading-none" style={{ color: 'var(--colony-text-primary)' }}>
          {value}
        </span>
        {delta !== null && delta !== undefined && (
          <span
            className="text-xs font-semibold px-1.5 py-0.5 rounded mb-0.5"
            style={{
              background: delta >= 0 ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
              color: delta >= 0 ? 'var(--colony-success)' : 'var(--colony-danger)',
            }}
          >
            {delta >= 0 ? '+' : ''}{delta.toFixed(1)}%
          </span>
        )}
      </div>

      {/* Sparkline */}
      {sparklineData && sparklineData.length >= 2 && (
        <div className="mt-1">
          <Sparkline data={sparklineData} height={40} />
        </div>
      )}

      {/* Subtitle */}
      {subtitle && (
        <p className="text-xs" style={{ color: 'var(--colony-text-secondary)' }}>
          {subtitle}
        </p>
      )}
    </div>
  )
}
