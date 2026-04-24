'use client'

import type { Temperature } from '../lib/types'

interface TemperatureBadgeProps {
  temperature: Temperature
  size?: 'sm' | 'md'
}

const TEMP_STYLES: Record<Temperature, { bg: string; color: string }> = {
  HOT:  { bg: 'rgba(239,68,68,0.15)',   color: '#ef4444' },
  WARM: { bg: 'rgba(245,158,11,0.15)',  color: '#f59e0b' },
  COOL: { bg: 'rgba(0,212,255,0.12)',   color: '#7dd3fc' },
  COLD: { bg: 'rgba(163,163,163,0.12)', color: '#a3a3a3' },
}

export function TemperatureBadge({ temperature, size = 'sm' }: TemperatureBadgeProps) {
  const { bg, color } = TEMP_STYLES[temperature]
  return (
    <span
      style={{
        background: bg,
        color,
        fontSize: size === 'sm' ? 10 : 12,
        fontWeight: 700,
        letterSpacing: '0.07em',
        borderRadius: 999,
        padding: size === 'sm' ? '2px 7px' : '4px 11px',
        display: 'inline-block',
        lineHeight: 1.5,
        textTransform: 'uppercase',
        flexShrink: 0,
      }}
    >
      {temperature}
    </span>
  )
}
