'use client'

import { formatAge } from '../lib/lead-helpers'

interface StaleIndicatorProps {
  lastSuccessAt?: string
}

export function StaleIndicator({ lastSuccessAt }: StaleIndicatorProps) {
  const ago = lastSuccessAt ? formatAge(lastSuccessAt) : null

  return (
    <div
      className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full"
      style={{
        background: 'rgba(245,158,11,0.12)',
        color: 'var(--colony-warning)',
        border: '1px solid rgba(245,158,11,0.2)',
      }}
    >
      <span style={{ fontSize: 8 }}>●</span>
      Data delayed{ago ? ` · updated ${ago}` : ''}
    </div>
  )
}
