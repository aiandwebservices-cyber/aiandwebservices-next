'use client'

import { useEffect, useState, ReactNode } from 'react'
import type { BotStatus, StatusTier } from '@/lib/colony/bot-status'

interface BotStatusRingProps {
  botId: string
  cohortId?: string
  children: ReactNode
  refreshInterval?: number
  intensity?: 'subtle' | 'normal' | 'strong'
  className?: string
}

interface TierStyle {
  ringColor: string  // CSS color for ring border
  glow: { subtle: string; normal: string; strong: string }
  animate: boolean
}

const TIER_STYLES: Record<StatusTier, TierStyle | null> = {
  running: {
    // strong — opacity 0.55 — actively running right now
    ringColor: 'rgba(52, 211, 153, 0.55)',
    glow: {
      subtle: '0 0 10px 3px rgba(52, 211, 153, 0.30)',
      normal: '0 0 18px 5px rgba(52, 211, 153, 0.45)',
      strong: '0 0 26px 7px rgba(52, 211, 153, 0.55)',
    },
    animate: true,
  },
  live: {
    // normal — opacity 0.40 — 0–30 min after end heartbeat
    ringColor: 'rgba(52, 211, 153, 0.40)',
    glow: {
      subtle: '0 0 6px 2px rgba(52, 211, 153, 0.18)',
      normal: '0 0 12px 3px rgba(52, 211, 153, 0.28)',
      strong: '0 0 18px 4px rgba(52, 211, 153, 0.38)',
    },
    animate: false,
  },
  online: {
    // subtle — opacity 0.25 — 31–60 min after end heartbeat
    ringColor: 'rgba(52, 211, 153, 0.25)',
    glow: {
      subtle: '0 0 4px 1px rgba(52, 211, 153, 0.10)',
      normal: '0 0 8px 2px rgba(52, 211, 153, 0.18)',
      strong: '0 0 12px 3px rgba(52, 211, 153, 0.25)',
    },
    animate: false,
  },
  idle: null,    // off — no ring
  offline: null, // off — no ring
  failed: {
    ringColor: 'rgba(239, 68, 68, 0.6)',
    glow: {
      subtle: '0 0 8px 2px rgba(239, 68, 68, 0.25)',
      normal: '0 0 12px 3px rgba(239, 68, 68, 0.35)',
      strong: '0 0 18px 4px rgba(239, 68, 68, 0.45)',
    },
    animate: true,
  },
}

export function BotStatusRing({
  botId,
  cohortId,
  children,
  refreshInterval = 30000,
  intensity = 'normal',
  className = '',
}: BotStatusRingProps) {
  const [tier, setTier] = useState<StatusTier>('offline')

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      try {
        const params = new URLSearchParams()
        if (cohortId) params.set('cohort_id', cohortId)
        const resp = await fetch(`/api/colony/bots/status?${params.toString()}`)
        const data = await resp.json()
        if (cancelled) return
        const bot: BotStatus | undefined = data[botId]
        setTier(bot?.status_tier || 'offline')
      } catch {
        // keep last state
      }
    }

    load()
    const interval = setInterval(load, refreshInterval)
    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [botId, cohortId, refreshInterval])

  const style = TIER_STYLES[tier]

  if (!style) {
    // offline — no ring, transparent passthrough
    return <div className={className}>{children}</div>
  }

  return (
    <div
      className={className}
      style={{
        position: 'relative',
        borderRadius: 14,
        boxShadow: `inset 0 0 0 1px ${style.ringColor}, ${style.glow[intensity]}`,
        transition: 'box-shadow 500ms ease',
        animation: style.animate ? 'colonyRingPulse 2.4s ease-in-out infinite' : undefined,
      }}
    >
      {children}
    </div>
  )
}
