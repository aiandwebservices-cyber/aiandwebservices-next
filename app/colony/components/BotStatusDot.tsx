'use client'

import { useEffect, useState } from 'react'
import type { BotStatus, StatusTier } from '@/lib/colony/bot-status'

interface BotStatusDotProps {
  botId: string
  cohortId?: string
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  refreshInterval?: number
}

const TIER_CONFIG: Record<StatusTier, { color: string; label: string; pulse: boolean }> = {
  running: { color: '#34d399', label: 'Live',    pulse: true  }, // strong green, pulsing
  live:    { color: '#22c47a', label: 'Recent',  pulse: false }, // normal green
  online:  { color: '#16a05e', label: 'Active',  pulse: false }, // subtle green
  idle:    { color: '#52525b', label: 'Offline', pulse: false }, // off
  offline: { color: '#52525b', label: 'Offline', pulse: false }, // off
  failed:  { color: '#ef4444', label: 'Failed',  pulse: true  },
}

const SIZE_PX: Record<string, number> = { sm: 7, md: 9, lg: 11 }

export function BotStatusDot({
  botId,
  cohortId,
  size = 'md',
  showLabel = false,
  refreshInterval = 30000,
}: BotStatusDotProps) {
  const [status, setStatus] = useState<BotStatus | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      try {
        const params = new URLSearchParams()
        if (cohortId) params.set('cohort_id', cohortId)
        const resp = await fetch(`/api/colony/bots/status?${params.toString()}`)
        const data = await resp.json()
        if (cancelled) return
        setStatus(data[botId] || null)
        setLoading(false)
      } catch {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    const interval = setInterval(load, refreshInterval)
    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [botId, cohortId, refreshInterval])

  const tier: StatusTier = status?.status_tier || 'offline'
  const cfg = TIER_CONFIG[tier]
  const px = SIZE_PX[size] ?? 9

  const tooltipText = !status
    ? `${botId}: no heartbeat data`
    : `${status.bot_name || botId} — ${cfg.label}` +
      (status.age_minutes !== null ? ` (${formatAge(status.age_minutes ?? 0)} ago)` : '') +
      (status.last_summary ? `\n${status.last_summary}` : '')

  return (
    <span
      className="inline-flex items-center gap-1.5 align-middle"
      title={tooltipText}
      aria-label={tooltipText}
      style={{ lineHeight: 1 }}
    >
      <span style={{ position: 'relative', display: 'inline-block', width: px, height: px, flexShrink: 0 }}>
        {cfg.pulse && (
          <span
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              background: cfg.color,
              opacity: 0.6,
              animation: 'colonyPulse 2s ease-in-out infinite',
            }}
          />
        )}
        <span
          style={{
            position: 'relative',
            display: 'inline-block',
            width: px,
            height: px,
            borderRadius: '50%',
            background: cfg.color,
            flexShrink: 0,
          }}
        />
      </span>
      {showLabel && (
        <span style={{ fontSize: 11, color: 'var(--colony-text-secondary)', fontWeight: 600 }}>
          {loading ? '…' : cfg.label}
        </span>
      )}
    </span>
  )
}

function formatAge(minutes: number): string {
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${Math.round(minutes)}m`
  if (minutes < 1440) return `${Math.round(minutes / 60)}h`
  return `${Math.round(minutes / 1440)}d`
}
