'use client'
import { useState, useEffect } from 'react'
import posthog from 'posthog-js'
import { useRouter } from 'next/navigation'

let phBooted = false

function bootPostHog() {
  if (!phBooted && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://us.i.posthog.com',
      capture_pageview: false,
    })
    phBooted = true
  }
}

type FormState = {
  firstName: string
  lastName: string
  businessName: string
  businessWebsite: string
  email: string
  phone: string
  businessType: string
  businessSize: string
  monthlyMarketingSpend: string
  challenge: string
}

const INITIAL: FormState = {
  firstName: '',
  lastName: '',
  businessName: '',
  businessWebsite: '',
  email: '',
  phone: '',
  businessType: '',
  businessSize: '',
  monthlyMarketingSpend: '',
  challenge: '',
}

function validate(form: FormState): Partial<Record<keyof FormState, string>> {
  const errs: Partial<Record<keyof FormState, string>> = {}
  if (!form.firstName.trim()) errs.firstName = 'Required'
  if (!form.lastName.trim()) errs.lastName = 'Required'
  if (!form.businessName.trim()) errs.businessName = 'Required'
  if (!form.email.trim()) {
    errs.email = 'Required'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errs.email = 'Enter a valid email address'
  }
  return errs
}

export default function RequestAccessForm() {
  const router = useRouter()
  const [form, setForm] = useState<FormState>(INITIAL)
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})
  const [submitting, setSubmitting] = useState(false)
  const [networkError, setNetworkError] = useState(false)

  useEffect(() => {
    bootPostHog()
    posthog.capture('colony_marketing_viewed')
  }, [])

  function field(key: keyof FormState) {
    return (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) => {
      setForm(prev => ({ ...prev, [key]: e.target.value }))
      if (errors[key]) {
        setErrors(prev => {
          const next = { ...prev }
          delete next[key]
          return next
        })
      }
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate(form)
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    setSubmitting(true)
    setNetworkError(false)
    try {
      const res = await fetch('/api/colony/request-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({})) as Record<string, unknown>
        posthog.capture('colony_request_failed', { status: res.status, ...data })
        setNetworkError(true)
        return
      }
      posthog.capture('colony_request_submitted', {
        businessType: form.businessType,
        businessSize: form.businessSize,
      })
      router.push('/product/colony/requested')
    } catch {
      posthog.capture('colony_request_failed', { error: 'network' })
      setNetworkError(true)
    } finally {
      setSubmitting(false)
    }
  }

  const inp = (key: keyof FormState) =>
    [
      'w-full rounded-lg px-4 py-3 text-sm text-white placeholder-[#475569] focus:outline-none focus:ring-2 transition-colors',
      errors[key]
        ? 'border border-red-500 bg-red-500/5 focus:ring-red-500/40'
        : 'border border-white/10 bg-white/5 hover:border-white/20 focus:ring-[#2AA5A0]/50',
    ].join(' ')

  const lbl = 'block text-sm font-medium mb-1.5' + ' ' + 'text-[#cbd5e1]'

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {networkError && (
        <div
          className="rounded-lg px-4 py-3 text-sm flex items-center justify-between gap-3"
          style={{
            background: 'rgba(239,68,68,0.1)',
            border: '1px solid rgba(239,68,68,0.3)',
            color: '#fca5a5',
          }}
        >
          <span>Something went wrong. Check your connection and try again.</span>
          <button
            type="button"
            className="underline shrink-0"
            onClick={() => setNetworkError(false)}
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className={lbl}>
            First name <span style={{ color: '#f87171' }}>*</span>
          </label>
          <input
            type="text"
            className={inp('firstName')}
            value={form.firstName}
            onChange={field('firstName')}
            placeholder="Jane"
            autoComplete="given-name"
          />
          {errors.firstName && (
            <p className="mt-1 text-xs" style={{ color: '#f87171' }}>
              {errors.firstName}
            </p>
          )}
        </div>
        <div>
          <label className={lbl}>
            Last name <span style={{ color: '#f87171' }}>*</span>
          </label>
          <input
            type="text"
            className={inp('lastName')}
            value={form.lastName}
            onChange={field('lastName')}
            placeholder="Smith"
            autoComplete="family-name"
          />
          {errors.lastName && (
            <p className="mt-1 text-xs" style={{ color: '#f87171' }}>
              {errors.lastName}
            </p>
          )}
        </div>
      </div>

      <div>
        <label className={lbl}>
          Business name <span style={{ color: '#f87171' }}>*</span>
        </label>
        <input
          type="text"
          className={inp('businessName')}
          value={form.businessName}
          onChange={field('businessName')}
          placeholder="Smith Family Dental"
          autoComplete="organization"
        />
        {errors.businessName && (
          <p className="mt-1 text-xs" style={{ color: '#f87171' }}>
            {errors.businessName}
          </p>
        )}
      </div>

      <div>
        <label className={lbl}>Business website</label>
        <input
          type="url"
          className={inp('businessWebsite')}
          value={form.businessWebsite}
          onChange={field('businessWebsite')}
          placeholder="https://yoursite.com"
          autoComplete="url"
        />
      </div>

      <div>
        <label className={lbl}>
          Email <span style={{ color: '#f87171' }}>*</span>
        </label>
        <input
          type="email"
          className={inp('email')}
          value={form.email}
          onChange={field('email')}
          placeholder="jane@smithdental.com"
          autoComplete="email"
        />
        {errors.email && (
          <p className="mt-1 text-xs" style={{ color: '#f87171' }}>
            {errors.email}
          </p>
        )}
      </div>

      <div>
        <label className={lbl}>Phone (optional)</label>
        <input
          type="tel"
          className={inp('phone')}
          value={form.phone}
          onChange={field('phone')}
          placeholder="+1 (555) 000-0000"
          autoComplete="tel"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className={lbl}>Business type</label>
          <select
            className={inp('businessType')}
            value={form.businessType}
            onChange={field('businessType')}
          >
            <option value="">Select one...</option>
            <option value="dental">Dental</option>
            <option value="insurance">Insurance</option>
            <option value="legal">Legal</option>
            <option value="restaurant">Restaurant</option>
            <option value="landscaping">Landscaping</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label className={lbl}>Business size</label>
          <select
            className={inp('businessSize')}
            value={form.businessSize}
            onChange={field('businessSize')}
          >
            <option value="">Select one...</option>
            <option value="1-5">1 to 5 employees</option>
            <option value="6-10">6 to 10 employees</option>
            <option value="11-20">11 to 20 employees</option>
            <option value="20+">20 or more</option>
          </select>
        </div>
      </div>

      <div>
        <label className={lbl}>Current monthly marketing spend</label>
        <select
          className={inp('monthlyMarketingSpend')}
          value={form.monthlyMarketingSpend}
          onChange={field('monthlyMarketingSpend')}
        >
          <option value="">Select one...</option>
          <option value="under-500">Less than $500</option>
          <option value="500-2000">$500 to $2,000</option>
          <option value="2000-5000">$2,000 to $5,000</option>
          <option value="5000+">$5,000 or more</option>
        </select>
      </div>

      <div>
        <label className={lbl}>Your biggest lead-gen challenge (optional)</label>
        <textarea
          className={`${inp('challenge')} resize-none`}
          rows={4}
          value={form.challenge}
          onChange={field('challenge')}
          placeholder="Tell us what is not working today..."
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-xl py-4 text-base font-bold text-white transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
        style={{
          background: '#2AA5A0',
          boxShadow: submitting ? 'none' : '0 6px 22px rgba(42,165,160,.4)',
        }}
      >
        {submitting ? 'Sending...' : 'Request Access'}
      </button>

      <p className="text-center text-xs" style={{ color: '#475569' }}>
        David reviews every request personally. You will hear back within 24 hours.
      </p>
    </form>
  )
}
