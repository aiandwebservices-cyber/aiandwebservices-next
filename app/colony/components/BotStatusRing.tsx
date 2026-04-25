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
    ringColor: 'rgba(129, 140, 248, 0.7)',
    glow: {
      subtle: '0 0 10px 3px rgba(129, 140, 248, 0.25)',
      normal: '0 0 18px 5px rgba(129, 140, 248, 0.35)',
      strong: '0 0 26px 7px rgba(129, 140, 248, 0.45)',
    },
    animate: true,
  },
  live: {
    ringColor: 'rgba(52, 211, 153, 0.6)',
    glow: {
      subtle: '0 0 8px 2px rgba(52, 211, 153, 0.25)',
      normal: '0 0 16px 4px rgba(52, 211, 153, 0.35)',
      strong: '0 0 24px 6px rgba(52, 211, 153, 0.45)',
    },
    animate: true,
  },
  online: {
    ringColor: 'rgba(16, 185, 129, 0.5)',
    glow: {
      subtle: '0 0 6px 1px rgba(16, 185, 129, 0.15)',
      normal: '0 0 10px 2px rgba(16, 185, 129, 0.20)',
      strong: '0 0 14px 3px rgba(16, 185, 129, 0.25)',
    },
    animate: false,
  },
  idle: {
    ringColor: 'rgba(245, 158, 11, 0.4)',
    glow: {
      subtle: '0 0 6px 1px rgba(245, 158, 11, 0.15)',
      normal: '0 0 10px 2px rgba(245, 158, 11, 0.20)',
      strong: '0 0 14px 3px rgba(245, 158, 11, 0.25)',
    },
    animate: false,
  },
  offline: null,  // no ring for offline
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
