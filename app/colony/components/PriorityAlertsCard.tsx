'use client'

import Link from 'next/link'
import { useAlerts } from '../health/hooks/useAlerts'
import type { Alert } from '../health/types'

const URGENCY_COLOR: Record<Alert['urgency'], string> = {
  critical: '#ef4444',
  important: '#f59e0b',
  fyi: 'rgba(255,255,255,.35)',
}

const URGENCY_BG: Record<Alert['urgency'], string> = {
  critical: 'rgba(239,68,68,.07)',
  important: 'rgba(245,158,11,.06)',
  fyi: 'rgba(255,255,255,.03)',
}

export function PriorityAlertsCard() {
  const { alerts, count } = useAlerts()

  const critical = alerts.filter((a) => a.urgency === 'critical')
  const important = alerts.filter((a) => a.urgency === 'important')
  const top = alerts.filter((a) => a.urgency !== 'fyi').slice(0, 3)
  const allClear = count === 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, flexShrink: 0 }}>
        <span style={{ fontSize: 14, lineHeight: 1 }}>{allClear ? '✅' : '⚡'}</span>
        <span style={{
          fontSize: 9, fontWeight: 700, letterSpacing: '1.5px',
          color: 'rgba(255,255,255,.4)', textTransform: 'uppercase',
        }}>
          Today&apos;s Priorities
        </span>
        {count > 0 && (
          <span style={{
            marginLeft: 'auto', fontSize: 9, fontWeight: 800,
            background: 'rgba(239,68,68,.15)', color: '#f87171',
            border: '1px solid rgba(239,68,68,.25)',
            borderRadius: 6, padding: '2px 7px', flexShrink: 0,
          }}>
            {count} need attention
          </span>
        )}
      </div>

      {/* All-clear state */}
      {allClear ? (
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>
          <div style={{ fontSize: 32, color: '#34d399', lineHeight: 1 }}>✓</div>
          <p style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,.75)', textAlign: 'center', margin: 0 }}>
            You&apos;re ahead of everything
          </p>
          <p style={{ fontSize: 10, color: 'rgba(255,255,255,.3)', textAlign: 'center', margin: 0 }}>
            No urgent items right now
          </p>
        </div>
      ) : (
        <>
          {/* Summary badges */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexShrink: 0, flexWrap: 'wrap' }}>
            {critical.length > 0 && (
              <span style={{
                fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 6,
                background: 'rgba(239,68,68,.12)', color: '#f87171',
                border: '1px solid rgba(239,68,68,.2)',
              }}>
                {critical.length} critical
              </span>
            )}
            {important.length > 0 && (
              <span style={{
                fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 6,
                background: 'rgba(245,158,11,.10)', color: '#fbbf24',
                border: '1px solid rgba(245,158,11,.2)',
              }}>
                {important.length} important
              </span>
            )}
          </div>

          {/* Top alert items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1, minHeight: 0, overflow: 'hidden' }}>
            {top.map((alert) => (
              <div
                key={alert.id}
                style={{
                  padding: '8px 10px',
                  borderRadius: 8,
                  background: URGENCY_BG[alert.urgency],
                  borderLeft: `2px solid ${URGENCY_COLOR[alert.urgency]}`,
                  flexShrink: 0,
                }}
              >
                <p style={{
                  fontSize: 11, fontWeight: 600,
                  color: 'rgba(255,255,255,.82)',
                  lineHeight: 1.35, margin: 0,
                }}>
                  {alert.icon} {alert.title}
                </p>
                <p style={{
                  fontSize: 10, color: 'rgba(255,255,255,.38)',
                  marginTop: 3, lineHeight: 1.3, margin: '3px 0 0',
                }}>
                  {alert.context}
                </p>
              </div>
            ))}

            {alerts.filter((a) => a.urgency !== 'fyi').length > 3 && (
              <p style={{ fontSize: 10, color: 'rgba(255,255,255,.3)', margin: 0 }}>
                +{alerts.filter((a) => a.urgency !== 'fyi').length - 3} more
              </p>
            )}
          </div>

          {/* Link to full Health page */}
          <Link
            href="/colony/health"
            style={{
              marginTop: 12, fontSize: 10, fontWeight: 700, flexShrink: 0,
              color: 'var(--colony-accent, #2AA5A0)', textDecoration: 'none',
              letterSpacing: '0.3px', alignSelf: 'flex-start',
              transition: 'opacity 150ms',
            }}
          >
            View all alerts →
          </Link>
        </>
      )}
    </div>
  )
}
