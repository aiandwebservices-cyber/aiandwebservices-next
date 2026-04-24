'use client'
import type { OnboardingInput } from '@/lib/colony/onboarding'

const NICHES = ['dental', 'insurance', 'legal', 'restaurant', 'landscaping', 'real_estate', 'other']
const PLANS: Array<{ value: OnboardingInput['plan']; label: string; price: string }> = [
  { value: 'starter',        label: 'AI Automation Starter', price: '$99/mo'  },
  { value: 'presence',       label: 'Presence',               price: '$99/mo'  },
  { value: 'growth',         label: 'Growth',                  price: '$179/mo' },
  { value: 'revenue_engine', label: 'Revenue Engine',          price: '$249/mo' },
  { value: 'ai_first',       label: 'AI-First',                price: '$499/mo' },
]

interface Props {
  value: Partial<OnboardingInput>
  onChange: (v: Partial<OnboardingInput>) => void
  onSubmit: () => void
  loading: boolean
}

export default function OnboardForm({ value, onChange, onSubmit, loading }: Props) {
  const set = <K extends keyof OnboardingInput>(k: K) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      onChange({ ...value, [k]: e.target.value })

  const inp = 'w-full rounded-lg px-3 py-2.5 text-sm bg-transparent focus:outline-none focus:ring-2 focus:ring-[var(--colony-accent)]/40'
  const inputStyle = {
    border: '1px solid var(--colony-border)',
    color: 'var(--colony-text-primary)',
    background: 'var(--colony-bg-elevated)',
  }
  const lbl = 'block text-xs font-medium mb-1.5'
  const lblStyle = { color: 'var(--colony-text-secondary)' }

  return (
    <form
      onSubmit={e => { e.preventDefault(); onSubmit() }}
      className="space-y-5"
    >
      <section>
        <h3 className="text-sm font-bold mb-4" style={{ color: 'var(--colony-text-primary)' }}>Business</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className={lbl} style={lblStyle}>Business name *</label>
            <input required type="text" className={inp} style={inputStyle}
              value={value.businessName ?? ''} onChange={set('businessName')}
              placeholder="Coral Gables Family Dental" />
          </div>
          <div>
            <label className={lbl} style={lblStyle}>City *</label>
            <input required type="text" className={inp} style={inputStyle}
              value={value.city ?? ''} onChange={set('city')} placeholder="Miami" />
          </div>
          <div>
            <label className={lbl} style={lblStyle}>State *</label>
            <input required type="text" className={inp} style={inputStyle}
              value={value.state ?? ''} onChange={set('state')} placeholder="FL" maxLength={2} />
          </div>
          <div>
            <label className={lbl} style={lblStyle}>Niche *</label>
            <select required className={inp} style={inputStyle}
              value={value.niche ?? ''} onChange={set('niche')}>
              <option value="">Select...</option>
              {NICHES.map(n => (
                <option key={n} value={n}>{n.charAt(0).toUpperCase() + n.slice(1).replace('_', ' ')}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={lbl} style={lblStyle}>Website</label>
            <input type="url" className={inp} style={inputStyle}
              value={value.businessWebsite ?? ''} onChange={set('businessWebsite')} placeholder="https://..." />
          </div>
        </div>
      </section>

      <section>
        <h3 className="text-sm font-bold mb-4" style={{ color: 'var(--colony-text-primary)' }}>Primary Contact</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={lbl} style={lblStyle}>First name *</label>
            <input required type="text" className={inp} style={inputStyle}
              value={value.primaryContactFirstName ?? ''} onChange={set('primaryContactFirstName')} placeholder="Anna" />
          </div>
          <div>
            <label className={lbl} style={lblStyle}>Last name *</label>
            <input required type="text" className={inp} style={inputStyle}
              value={value.primaryContactLastName ?? ''} onChange={set('primaryContactLastName')} placeholder="Patel" />
          </div>
          <div>
            <label className={lbl} style={lblStyle}>Email *</label>
            <input required type="email" className={inp} style={inputStyle}
              value={value.primaryContactEmail ?? ''} onChange={set('primaryContactEmail')} placeholder="anna@coralgablesdental.com" />
          </div>
          <div>
            <label className={lbl} style={lblStyle}>Phone</label>
            <input type="tel" className={inp} style={inputStyle}
              value={value.primaryContactPhone ?? ''} onChange={set('primaryContactPhone')} placeholder="+1 (305) 555-0100" />
          </div>
        </div>
      </section>

      <section>
        <h3 className="text-sm font-bold mb-4" style={{ color: 'var(--colony-text-primary)' }}>Plan + Payment</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className={lbl} style={lblStyle}>Plan *</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {PLANS.map(p => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => onChange({ ...value, plan: p.value })}
                  className="rounded-lg px-3 py-2.5 text-left text-sm transition-all"
                  style={{
                    border: value.plan === p.value
                      ? '2px solid var(--colony-accent)'
                      : '1px solid var(--colony-border)',
                    background: value.plan === p.value
                      ? 'rgba(0,212,255,0.08)'
                      : 'var(--colony-bg-elevated)',
                    color: 'var(--colony-text-primary)',
                  }}
                >
                  <div className="font-semibold text-xs">{p.label}</div>
                  <div className="text-xs mt-0.5" style={{ color: 'var(--colony-text-secondary)' }}>{p.price}</div>
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <input
              id="setupPaid"
              type="checkbox"
              className="w-4 h-4 rounded"
              checked={value.setupFeePaid ?? false}
              onChange={e => onChange({ ...value, setupFeePaid: e.target.checked })}
            />
            <label htmlFor="setupPaid" className="text-sm" style={{ color: 'var(--colony-text-primary)' }}>
              Setup fee paid
            </label>
          </div>
          {value.setupFeePaid && (
            <div>
              <label className={lbl} style={lblStyle}>Square payment ID</label>
              <input type="text" className={inp} style={inputStyle}
                value={value.setupFeePaymentId ?? ''} onChange={set('setupFeePaymentId')} placeholder="sq_pay_..." />
            </div>
          )}
        </div>
      </section>

      <section>
        <label className={lbl} style={lblStyle}>Internal notes</label>
        <textarea
          className={`${inp} resize-none`}
          style={inputStyle}
          rows={3}
          value={value.notes ?? ''}
          onChange={set('notes')}
          placeholder="Closed via LinkedIn DM. Needs onboarding call booked for next Tuesday..."
        />
      </section>

      <button
        type="submit"
        disabled={loading || !value.businessName || !value.primaryContactEmail || !value.plan}
        className="w-full rounded-xl py-3 font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ background: 'var(--colony-accent)', color: '#000' }}
      >
        {loading ? 'Building preview...' : 'Preview onboarding'}
      </button>
    </form>
  )
}
