'use client'
import Link from 'next/link'
import type { OnboardingResult } from '@/lib/colony/onboarding'

interface Props {
  result: OnboardingResult
  onReset: () => void
}

const STEP_LABELS: Record<string, string> = {
  clerkInvite:     'Clerk invitation',
  cohortAssigned:  'Cohort assigned',
  espoRecords:     'EspoCRM records',
  squareTagged:    'Square tagged',
  qdrantBootstrap: 'Qdrant bootstrap',
  welcomeEmail:    'Welcome email',
  auditLogged:     'Audit logged',
}

export default function OnboardResult({ result, onReset }: Props) {
  const steps = result.steps as Record<string, { success: boolean; error?: string; inviteId?: string; accountId?: string; oppId?: string; customerId?: string }>
  const allGood = Object.values(steps).every(s => s.success)

  return (
    <div className="space-y-5">
      <div
        className="rounded-xl px-4 py-3 flex items-center gap-3"
        style={{
          background: allGood ? 'rgba(52,211,153,0.08)' : 'rgba(251,191,36,0.08)',
          border: `1px solid ${allGood ? 'rgba(52,211,153,0.3)' : 'rgba(251,191,36,0.3)'}`,
          color: allGood ? '#34d399' : '#fbbf24',
        }}
      >
        <span className="text-xl">{allGood ? '✅' : '⚠️'}</span>
        <div>
          <div className="font-bold text-sm">
            {allGood ? 'Onboarding complete' : 'Partial success — check failures below'}
          </div>
          <div className="text-xs mt-0.5 opacity-80">
            Cohort ID: <span className="font-mono">{result.cohortId}</span>
          </div>
        </div>
      </div>

      <div
        className="rounded-xl overflow-hidden"
        style={{ border: '1px solid var(--colony-border)' }}
      >
        <div
          className="px-4 py-2.5 text-xs font-bold uppercase tracking-widest"
          style={{ background: 'var(--colony-bg-elevated)', color: 'var(--colony-text-secondary)' }}
        >
          Step results
        </div>
        <div style={{ background: 'var(--colony-bg-content)' }}>
          {Object.entries(steps).map(([key, step]) => (
            <div
              key={key}
              className="flex items-start gap-3 px-4 py-3"
              style={{ borderBottom: '1px solid var(--colony-border)' }}
            >
              <span className="shrink-0 mt-0.5">{step.success ? '✅' : '❌'}</span>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium" style={{ color: 'var(--colony-text-primary)' }}>
                  {STEP_LABELS[key] ?? key}
                </div>
                {step.error && (
                  <div className="text-xs mt-0.5 font-mono" style={{ color: 'var(--colony-danger, #ef4444)' }}>
                    {step.error}
                  </div>
                )}
                {step.inviteId && (
                  <div className="text-xs mt-0.5 font-mono" style={{ color: 'var(--colony-text-secondary)' }}>
                    Invite ID: {step.inviteId}
                  </div>
                )}
                {step.accountId && (
                  <div className="text-xs mt-0.5 font-mono" style={{ color: 'var(--colony-text-secondary)' }}>
                    Account: {step.accountId}{step.oppId ? ` · Opp: ${step.oppId}` : ''}
                  </div>
                )}
                {step.customerId && (
                  <div className="text-xs mt-0.5 font-mono" style={{ color: 'var(--colony-text-secondary)' }}>
                    Square customer: {step.customerId}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        className="rounded-xl px-4 py-4 space-y-2 text-sm"
        style={{ background: 'var(--colony-bg-elevated)', border: '1px solid var(--colony-border)' }}
      >
        <p className="font-semibold" style={{ color: 'var(--colony-text-primary)' }}>Next steps</p>
        <p className="text-xs leading-relaxed" style={{ color: 'var(--colony-text-secondary)' }}>
          Share this login URL with the customer:{' '}
          <span className="font-mono" style={{ color: 'var(--colony-accent)' }}>
            https://colony.aiandwebservices.com/colony
          </span>
        </p>
        <p className="text-xs leading-relaxed" style={{ color: 'var(--colony-text-secondary)' }}>
          Audit ID: <span className="font-mono">{result.auditId}</span>
        </p>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onReset}
          className="flex-1 rounded-xl py-3 font-semibold text-sm transition-all"
          style={{
            border: '1px solid var(--colony-border)',
            color: 'var(--colony-text-secondary)',
            background: 'transparent',
          }}
        >
          Onboard another customer
        </button>
        <Link
          href="/colony/admin/audit"
          className="flex-1 rounded-xl py-3 font-bold text-sm text-center transition-all"
          style={{ background: 'var(--colony-accent)', color: '#000' }}
        >
          View audit log
        </Link>
      </div>
    </div>
  )
}
