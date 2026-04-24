'use client'

import { useSidePanel } from '../../components/SidePanel'
import type { Alert } from '../types'

const URGENCY_COLOR: Record<Alert['urgency'], string> = {
  critical: 'var(--colony-danger)',
  important: 'var(--colony-warning)',
  fyi: 'var(--colony-text-secondary)',
}

const URGENCY_BG: Record<Alert['urgency'], string> = {
  critical: 'rgba(239,68,68,0.06)',
  important: 'rgba(245,158,11,0.06)',
  fyi: 'transparent',
}

const URGENCY_ORDER: Alert['urgency'][] = ['critical', 'important', 'fyi']
const URGENCY_LABEL: Record<Alert['urgency'], string> = {
  critical: 'Critical',
  important: 'Important',
  fyi: 'FYI',
}

interface AlertRowProps {
  alert: Alert
}

function AlertRow({ alert }: AlertRowProps) {
  const { open } = useSidePanel()
  const borderColor = URGENCY_COLOR[alert.urgency]

  const handleAction = () => {
    if (!alert.drillTarget) return
    open({
      title: alert.title,
      subtitle: alert.context,
      children: (
        <div className="p-5">
          <div className="flex items-center gap-3 mb-4">
            <span style={{ fontSize: 32 }}>{alert.icon}</span>
            <div>
              <p className="font-semibold text-sm" style={{ color: 'var(--colony-text-primary)' }}>{alert.title}</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--colony-text-secondary)' }}>{alert.context}</p>
            </div>
          </div>
          <p className="text-xs" style={{ color: 'var(--colony-text-secondary)' }}>
            {alert.drillTarget.type === 'lead' ? 'Open the Lead Inbox' : 'Open the Pipeline'} to take action on this item.
          </p>
        </div>
      ),
      width: 'narrow',
    })
  }

  return (
    <div
      className="flex items-start gap-3 px-4 py-3 rounded-lg"
      style={{
        borderLeft: `3px solid ${borderColor}`,
        background: URGENCY_BG[alert.urgency],
        marginBottom: 6,
      }}
    >
      <span style={{ fontSize: 18, flexShrink: 0, marginTop: 1 }}>{alert.icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold" style={{ color: 'var(--colony-text-primary)' }}>
          {alert.title}
        </p>
        <p className="text-xs mt-0.5" style={{ color: 'var(--colony-text-secondary)' }}>
          {alert.context}
        </p>
      </div>
      {alert.actionLabel && alert.drillTarget && (
        <button
          onClick={handleAction}
          className="shrink-0 text-xs font-semibold px-2.5 py-1 rounded-lg transition-opacity hover:opacity-80"
          style={{
            background: 'rgba(163,163,163,0.1)',
            border: '1px solid var(--colony-border)',
            color: 'var(--colony-text-secondary)',
          }}
        >
          {alert.actionLabel}
        </button>
      )}
    </div>
  )
}

interface AlertsPanelProps {
  alerts: Alert[]
}

export function AlertsPanel({ alerts }: AlertsPanelProps) {
  if (alerts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="text-4xl mb-3" style={{ color: 'var(--colony-success)' }}>✓</div>
        <p className="text-sm font-semibold" style={{ color: 'var(--colony-text-primary)' }}>No alerts. Nice work.</p>
        <p className="text-xs mt-1" style={{ color: 'var(--colony-text-secondary)' }}>Everything looks healthy.</p>
      </div>
    )
  }

  const grouped = URGENCY_ORDER.map((urgency) => ({
    urgency,
    items: alerts.filter((a) => a.urgency === urgency),
  })).filter((g) => g.items.length > 0)

  return (
    <div className="space-y-4">
      {grouped.map(({ urgency, items }) => (
        <div key={urgency}>
          <p
            className="text-xs font-bold uppercase tracking-wide mb-2"
            style={{ color: URGENCY_COLOR[urgency] }}
          >
            {URGENCY_LABEL[urgency]} ({items.length})
          </p>
          <div>
            {items.map((alert) => (
              <AlertRow key={alert.id} alert={alert} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
