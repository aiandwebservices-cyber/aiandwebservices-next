import Link from 'next/link'
import type { CustomerSummary } from '@/lib/colony/admin-queries'
import ImpersonateButton from './ImpersonateButton'
import MarkChurnedButton from './MarkChurnedButton'

function formatLastActive(iso: string | null): string {
  if (!iso) return '—'
  const diffMs = Date.now() - new Date(iso).getTime()
  const h = Math.floor(diffMs / 3600000)
  if (h < 1) return 'just now'
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

export default function CustomerRow({ summary }: { summary: CustomerSummary }) {
  const statusColor =
    summary.status === 'churned' ? 'var(--colony-danger)'
    : summary.status === 'onboarding' ? 'var(--colony-warning)'
    : 'var(--colony-success)'

  return (
    <tr
      className="text-sm"
      style={{ borderBottom: '1px solid var(--colony-border)' }}
    >
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: statusColor }} />
          <span className="font-semibold" style={{ color: 'var(--colony-text-primary)' }}>
            {summary.business_name}
          </span>
        </div>
        <div className="text-xs mt-0.5" style={{ color: 'var(--colony-text-secondary)' }}>
          {summary.cohort_id}
        </div>
      </td>
      <td className="px-4 py-3 text-xs" style={{ color: 'var(--colony-text-secondary)' }}>
        {summary.plan}
      </td>
      <td className="px-4 py-3 font-mono text-right" style={{ color: 'var(--colony-text-primary)' }}>
        ${summary.mrr}/mo
      </td>
      <td className="px-4 py-3 text-right" style={{ color: 'var(--colony-text-primary)' }}>
        {summary.leads_this_week}
      </td>
      <td className="px-4 py-3 text-xs" style={{ color: 'var(--colony-text-secondary)' }}>
        {formatLastActive(summary.last_active_at)}
      </td>
      <td className="px-4 py-3 text-center">
        {summary.alert_count > 0 ? (
          <span
            className="inline-block rounded-full px-2 py-0.5 text-xs font-semibold"
            style={{ background: 'var(--colony-warning)', color: '#0a0a0a' }}
          >
            {summary.alert_count}
          </span>
        ) : (
          <span style={{ color: 'var(--colony-text-secondary)' }}>—</span>
        )}
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2 justify-end">
          <ImpersonateButton cohortId={summary.cohort_id} />
          <Link
            href={`/colony/admin/customers/${summary.cohort_id}`}
            className="text-xs font-semibold px-3 py-1.5 rounded-md"
            style={{ border: '1px solid var(--colony-border)', color: 'var(--colony-text-primary)' }}
          >
            Details
          </Link>
          {summary.status !== 'churned' && (
            <MarkChurnedButton cohortId={summary.cohort_id} businessName={summary.business_name} />
          )}
        </div>
      </td>
    </tr>
  )
}
