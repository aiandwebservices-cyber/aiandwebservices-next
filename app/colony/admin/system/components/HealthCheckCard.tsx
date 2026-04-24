import type { HealthCheck } from '@/app/api/colony/admin/system/health/route'

const STATUS_COLOR: Record<HealthCheck['status'], string> = {
  healthy: 'var(--colony-success)',
  degraded: 'var(--colony-warning)',
  down: 'var(--colony-danger)',
  not_configured: 'var(--colony-text-secondary)',
}

export default function HealthCheckCard({ check }: { check: HealthCheck }) {
  return (
    <div
      className="rounded-xl p-4"
      style={{
        background: 'var(--colony-bg-elevated)',
        border: '1px solid var(--colony-border)',
        borderLeftWidth: 4,
        borderLeftColor: STATUS_COLOR[check.status],
      }}
    >
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-sm font-bold" style={{ color: 'var(--colony-text-primary)' }}>
          {check.service}
        </h3>
        <span
          className="text-xs font-semibold uppercase tracking-wide"
          style={{ color: STATUS_COLOR[check.status] }}
        >
          {check.status.replace('_', ' ')}
        </span>
      </div>
      <p className="text-xs" style={{ color: 'var(--colony-text-secondary)' }}>
        {check.detail ?? '—'}
        {check.latency_ms !== undefined && ` · ${check.latency_ms}ms`}
      </p>
    </div>
  )
}
