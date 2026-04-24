'use client'
import type { OnboardingPreview } from '@/lib/colony/onboarding'

interface Props {
  preview: OnboardingPreview
  onConfirm: () => void
  onBack: () => void
  loading: boolean
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between py-2.5 gap-4" style={{ borderBottom: '1px solid var(--colony-border)' }}>
      <span className="text-xs shrink-0 w-40" style={{ color: 'var(--colony-text-secondary)' }}>{label}</span>
      <span className="text-xs font-mono text-right" style={{ color: 'var(--colony-text-primary)' }}>{value}</span>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--colony-border)' }}>
      <div className="px-4 py-2.5 text-xs font-bold uppercase tracking-widest"
        style={{ background: 'var(--colony-bg-elevated)', color: 'var(--colony-accent)' }}>
        {title}
      </div>
      <div className="px-4" style={{ background: 'var(--colony-bg-content)' }}>
        {children}
      </div>
    </div>
  )
}

export default function OnboardPreview({ preview, onConfirm, onBack, loading }: Props) {
  return (
    <div className="space-y-4">
      <div
        className="rounded-xl px-4 py-3 flex items-center gap-3 text-sm font-semibold"
        style={{ background: 'rgba(42,165,160,0.08)', border: '1px solid rgba(42,165,160,0.2)', color: 'var(--colony-accent)' }}
      >
        <span className="text-lg">🔍</span>
        Review what will be created — no writes until you confirm.
      </div>

      <Section title="Identity">
        <Row label="Cohort ID" value={preview.cohortId} />
        <Row label="Monthly" value={`$${preview.monthlyAmount}/month`} />
        <Row label="Setup fee" value={`$${preview.setupAmount}`} />
      </Section>

      <Section title="Clerk invitation">
        <Row label="Email" value={preview.clerkEmail} />
        <Row label="Invite will send" value={preview.clerkInviteWillSend ? 'Yes' : 'No'} />
        <Row label="Redirect after signup" value="colony.aiandwebservices.com/colony" />
      </Section>

      <Section title="EspoCRM records">
        <Row label="Account" value={preview.espoRecords.account.name} />
        <Row label="Contact" value={`${preview.espoRecords.contact.firstName} ${preview.espoRecords.contact.lastName} — ${preview.espoRecords.contact.email}`} />
        <Row label="Opportunity" value={`${preview.espoRecords.opportunity.name} · $${preview.espoRecords.opportunity.amount}/mo · ${preview.espoRecords.opportunity.stage}`} />
      </Section>

      <Section title="Square">
        <Row label="Search email" value={preview.squareCustomerEmail} />
        <Row label="Tag with" value={preview.cohortId} />
      </Section>

      <Section title="Qdrant">
        <Row label="Collections" value={preview.qdrantCollections.join(', ')} />
        <Row label="Bootstrap record" value={`bot_runs → cohort ${preview.cohortId}`} />
      </Section>

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onBack}
          disabled={loading}
          className="flex-1 rounded-xl py-3 font-semibold text-sm transition-all disabled:opacity-50"
          style={{
            border: '1px solid var(--colony-border)',
            color: 'var(--colony-text-secondary)',
            background: 'transparent',
          }}
        >
          Back
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={loading}
          className="flex-[2] rounded-xl py-3 font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ background: 'var(--colony-accent)', color: '#000' }}
        >
          {loading ? 'Executing...' : 'Confirm and execute'}
        </button>
      </div>
    </div>
  )
}
