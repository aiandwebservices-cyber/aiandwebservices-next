import type { CustomerDetail } from '@/lib/colony/admin-queries'
import ImpersonateButton from './ImpersonateButton'
import MarkChurnedButton from './MarkChurnedButton'

function fmtDate(iso?: string | null): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleString()
}

export default function CustomerDetailPanel({ detail }: { detail: CustomerDetail }) {
  return (
    <div className="flex flex-col gap-6">
      <header className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--colony-text-primary)' }}>
            {detail.business_name}
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--colony-text-secondary)' }}>
            {detail.cohort_id} · {detail.plan} · {detail.status}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ImpersonateButton cohortId={detail.cohort_id} />
          {detail.status !== 'churned' && (
            <MarkChurnedButton cohortId={detail.cohort_id} businessName={detail.business_name} />
          )}
        </div>
      </header>

      <div className="grid grid-cols-4 gap-3">
        <Stat label="MRR" value={`$${detail.mrr}`} />
        <Stat label="Active subs" value={detail.active_subscriptions} />
        <Stat label="Leads this week" value={detail.leads_this_week} />
        <Stat label="Alerts" value={detail.alert_count} />
      </div>

      <section>
        <h2 className="text-sm font-bold uppercase tracking-wide mb-2" style={{ color: 'var(--colony-text-secondary)' }}>
          Contact
        </h2>
        <div className="rounded-xl p-4" style={{ background: 'var(--colony-bg-elevated)', border: '1px solid var(--colony-border)' }}>
          <p className="text-sm" style={{ color: 'var(--colony-text-primary)' }}>
            {detail.primary_contact_email ?? 'No contact on file'}
          </p>
          <p className="text-xs mt-1" style={{ color: 'var(--colony-text-secondary)' }}>
            Onboarded {fmtDate(detail.onboarded_at)}
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-sm font-bold uppercase tracking-wide mb-2" style={{ color: 'var(--colony-text-secondary)' }}>
          Pipeline
        </h2>
        <div className="rounded-xl p-4 space-y-2" style={{ background: 'var(--colony-bg-elevated)', border: '1px solid var(--colony-border)' }}>
          <p className="text-sm font-mono" style={{ color: 'var(--colony-text-primary)' }}>
            Total value: ${detail.pipeline_summary.total_value.toLocaleString()}
          </p>
          {Object.entries(detail.pipeline_summary.stage_counts).map(([stage, count]) => (
            <div key={stage} className="flex justify-between text-xs" style={{ color: 'var(--colony-text-secondary)' }}>
              <span>{stage}</span>
              <span>{count}</span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-sm font-bold uppercase tracking-wide mb-2" style={{ color: 'var(--colony-text-secondary)' }}>
          Recent activity
        </h2>
        <div className="rounded-xl divide-y" style={{ background: 'var(--colony-bg-elevated)', border: '1px solid var(--colony-border)', borderColor: 'var(--colony-border)' }}>
          {detail.recent_activity.length === 0 ? (
            <p className="p-4 text-sm" style={{ color: 'var(--colony-text-secondary)' }}>No recent activity</p>
          ) : detail.recent_activity.map(e => (
            <div key={e.id} className="p-3 text-sm" style={{ color: 'var(--colony-text-primary)' }}>
              <span className="mr-2">{e.icon}</span>
              <span>{e.title}</span>
              <span className="ml-2 text-xs" style={{ color: 'var(--colony-text-secondary)' }}>
                · {fmtDate(e.timestamp)}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-sm font-bold uppercase tracking-wide mb-2" style={{ color: 'var(--colony-text-secondary)' }}>
          Audit log
        </h2>
        <div className="rounded-xl divide-y text-xs" style={{ background: 'var(--colony-bg-elevated)', border: '1px solid var(--colony-border)', borderColor: 'var(--colony-border)' }}>
          {detail.audit_entries.length === 0 ? (
            <p className="p-4" style={{ color: 'var(--colony-text-secondary)' }}>No audit entries</p>
          ) : detail.audit_entries.map(e => (
            <div key={e.id} className="p-3 font-mono" style={{ color: 'var(--colony-text-primary)' }}>
              <span style={{ color: 'var(--colony-accent)' }}>{e.action}</span>
              <span className="ml-2" style={{ color: 'var(--colony-text-secondary)' }}>{fmtDate(e.timestamp)}</span>
              <span className="ml-2" style={{ color: 'var(--colony-text-secondary)' }}>{e.admin_email}</span>
              {e.notes && <div className="mt-1" style={{ color: 'var(--colony-text-secondary)' }}>{e.notes}</div>}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl p-3" style={{ background: 'var(--colony-bg-elevated)', border: '1px solid var(--colony-border)' }}>
      <p className="text-xs" style={{ color: 'var(--colony-text-secondary)' }}>{label}</p>
      <p className="text-lg font-bold mt-0.5" style={{ color: 'var(--colony-text-primary)' }}>{value}</p>
    </div>
  )
}
