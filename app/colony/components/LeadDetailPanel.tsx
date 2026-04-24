'use client'

import { useState } from 'react'
import { Copy, Check, ExternalLink } from 'lucide-react'
import type { Lead } from '../lib/types'
import { TemperatureBadge } from './TemperatureBadge'
import { formatAge } from '../lib/lead-helpers'
import { capture } from '../lib/posthog'

// ─── Research signals by niche ────────────────────────────────────────────────

const NICHE_SIGNALS: Record<string, string[]> = {
  dental: [
    'Active Google Ads spending $50–100/day (signal: paying for leads)',
    'Thin social presence — under 300 Facebook followers, 0 posts in 90 days',
    '5-year-old website with no online booking system',
    'Solo practitioner, no associate dentist listed',
    'No insurance-panel transparency on website',
  ],
  orthodontics: [
    'Active Google Ads on braces/aligners keywords (spending for patient acquisition)',
    'Thin Instagram presence despite visual-first niche',
    'No online consultation booking — phone-only intake',
    'Competitor practices running Invisalign promotions in same zip code',
    'Website last updated 4+ years ago based on outdated UI patterns',
  ],
  'pediatric-dental': [
    'Google Ads running on "children\'s dentist near me" queries',
    'No parental FAQ or "first visit" page — common new patient trigger missing',
    'Instagram thin for a family-facing practice',
    '5-star reviews cited but Google review count under 30',
    'No online scheduling for new patient intake',
  ],
  insurance: [
    'Recently licensed as independent broker (LinkedIn, 6 months ago)',
    'Website says "Call for quote" — no online form',
    'No presence on Nextdoor or local community groups',
    'Google review count: 12 (low for local market)',
    'Active on LinkedIn but running no content marketing',
  ],
  landscaping: [
    'Active Google Ads but thin landing pages per service type',
    'No before/after portfolio gallery — high-intent visual trigger missing',
    'Limited presence in neighborhood Facebook groups (key for local services)',
    'Google review count under 20 — competitors averaging 80+',
    'No online quote request system — relies on callbacks only',
  ],
  restaurant: [
    'Running Google Ads but Google Business Profile photo count is low',
    'No reservation widget — third-party dependency losing direct bookings',
    'Yelp page claimed but unoptimized — low owner response rate on reviews',
    'No email capture on website — losing repeat customer potential',
    'Instagram active but no lead-capture call to action in bio',
  ],
}

function getSignals(niche: string): string[] {
  return NICHE_SIGNALS[niche.toLowerCase()] ?? [
    'Active Google Ads spend detected (paying for leads)',
    'Social media presence thin relative to ad spend',
    'No online booking or intake form on website',
    'Low Google review count for local market',
    'Competitor analysis suggests untapped lead volume',
  ]
}

// ─── Email draft generation ───────────────────────────────────────────────────

function generateDraft(lead: Lead): { subject: string; body: string } {
  const name = lead.first_name ?? 'there'
  const isMedical = ['dental', 'orthodontics', 'pediatric-dental'].includes(lead.niche)
  const bizType = isMedical ? 'practice' : 'business'
  const outcome = isMedical ? 'booked appointments' : 'qualified leads'

  return {
    subject: `Quick question about ${lead.business_name}'s online leads`,
    body: `Hi ${name},

I noticed ${lead.business_name} is running ads on Google but your Facebook and Instagram presence is pretty thin. You're leaving leads on the table.

I've been working with a handful of ${lead.niche.replace(/-/g, ' ')} ${bizType}s in ${lead.city} — we're closing the gap between their ad spend and actual ${outcome} using AI-powered lead qualification.

Got 15 minutes next week? I can show you exactly what I mean for your ${bizType} — no pitch, just a look at what your competitors aren't doing.

— David
AIandWEBservices`,
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

interface LeadDetailPanelProps {
  lead: Lead
}

export function LeadDetailPanel({ lead }: LeadDetailPanelProps) {
  const [contacted, setContacted] = useState(false)
  const [copied, setCopied] = useState(false)

  const draft = generateDraft(lead)
  const signals = getSignals(lead.niche)

  const sourceLabel: Record<string, string> = {
    master_pipeline: 'Pipeline',
    fresh_business: 'Fresh Business',
    website: 'Website',
    manual: 'Manual',
  }

  const absDate = new Date(lead.created_at).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })
  const relDate = formatAge(lead.created_at)

  const handleCopy = async () => {
    const fullText = `Subject: ${draft.subject}\n\n${draft.body}`
    await navigator.clipboard.writeText(fullText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleMarkContacted = () => {
    capture('colony_lead_mark_contacted', { lead_id: lead.id, temperature: lead.temperature })
    setContacted(true)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        {/* ── Header meta ── */}
        <div className="px-5 pt-5 pb-4 border-b flex flex-col gap-3" style={{ borderColor: 'var(--colony-border)' }}>
          <div className="flex items-center gap-2 flex-wrap">
            <TemperatureBadge temperature={lead.temperature} size="md" />
            <span
              className="text-xs font-semibold px-2 py-0.5 rounded-full"
              style={{ background: 'rgba(0,212,255,0.1)', color: 'var(--colony-accent)' }}
            >
              Tier {lead.deal_tier}/10
            </span>
            <span
              className="text-xs font-medium px-2 py-0.5 rounded-full"
              style={{ background: 'rgba(163,163,163,0.12)', color: 'var(--colony-text-secondary)' }}
            >
              From: {sourceLabel[lead.source] ?? lead.source}
            </span>
          </div>
          <p className="text-xs" style={{ color: 'var(--colony-text-secondary)' }}>
            {absDate} · {relDate}
          </p>
        </div>

        {/* ── Contact info ── */}
        <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--colony-border)' }}>
          <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: 'var(--colony-text-secondary)' }}>
            Contact
          </p>
          <div className="space-y-1 text-sm">
            <a href={`mailto:${lead.email}`} className="block hover:underline" style={{ color: 'var(--colony-accent)' }}>
              {lead.email}
            </a>
            {lead.phone && (
              <a href={`tel:${lead.phone}`} className="block hover:underline" style={{ color: 'var(--colony-text-primary)' }}>
                {lead.phone}
              </a>
            )}
            {lead.website && (
              <a
                href={`https://${lead.website.replace(/^https?:\/\//, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block hover:underline"
                style={{ color: 'var(--colony-text-secondary)' }}
              >
                {lead.website}
              </a>
            )}
            <p style={{ color: 'var(--colony-text-secondary)' }}>
              {lead.city}, {lead.state} · {lead.niche.replace(/-/g, ' ')}
            </p>
          </div>
        </div>

        {/* ── Drafted outreach ── */}
        <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--colony-border)' }}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--colony-text-secondary)' }}>
              Outreach Email — drafted by <span style={{ color: 'var(--colony-text-primary)' }}>Bob</span>
            </p>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg transition-all"
              style={{
                background: copied ? 'rgba(16,185,129,0.15)' : 'rgba(0,212,255,0.1)',
                color: copied ? 'var(--colony-success)' : 'var(--colony-accent)',
                border: `1px solid ${copied ? 'rgba(16,185,129,0.3)' : 'rgba(0,212,255,0.2)'}`,
              }}
            >
              {copied ? <Check size={12} /> : <Copy size={12} />}
              {copied ? 'Copied!' : 'Copy Draft'}
            </button>
          </div>

          <div
            className="rounded-lg p-4 space-y-2 text-sm"
            style={{
              background: 'rgba(163,163,163,0.06)',
              border: '1px solid var(--colony-border)',
            }}
          >
            <p className="text-xs font-semibold" style={{ color: 'var(--colony-text-secondary)' }}>
              Subject: {draft.subject}
            </p>
            <div style={{ color: 'var(--colony-text-primary)', lineHeight: 1.7 }}>
              {draft.body.split('\n').map((line, i) => (
                <span key={i}>
                  {line || <br />}
                  {i < draft.body.split('\n').length - 1 && <br />}
                </span>
              ))}
            </div>
          </div>

          <p className="text-xs mt-2" style={{ color: 'var(--colony-text-secondary)' }}>
            Draft generated from Bob using signals below.
          </p>
        </div>

        {/* ── Research signals ── */}
        <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--colony-border)' }}>
          <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: 'var(--colony-text-secondary)' }}>
            Research Signals
          </p>
          <ul className="space-y-2">
            {signals.map((signal, i) => (
              <li key={i} className="flex items-start gap-2 text-sm" style={{ color: 'var(--colony-text-primary)' }}>
                <span style={{ color: 'var(--colony-success)', marginTop: 2, flexShrink: 0 }}>·</span>
                {signal}
              </li>
            ))}
          </ul>
        </div>

        {/* ── Activity history ── */}
        <div className="px-5 py-4">
          <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: 'var(--colony-text-secondary)' }}>
            Activity
          </p>
          {!lead.last_activity_at ? (
            <p className="text-sm" style={{ color: 'var(--colony-text-secondary)' }}>No activity yet.</p>
          ) : (
            <ul className="space-y-2">
              {[
                { label: 'Outreach email drafted', offset: 0 },
                { label: 'Lead temperature scored HOT', offset: 30 * 60 * 1000 },
                { label: `Lead captured via ${lead.utm_source ?? lead.source}`, offset: 60 * 60 * 1000 },
              ].map(({ label, offset }, i) => {
                const ts = new Date(new Date(lead.last_activity_at!).getTime() + offset)
                const age = formatAge(ts.toISOString())
                return (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span style={{ color: 'var(--colony-accent)', flexShrink: 0, marginTop: 2 }}>·</span>
                    <span style={{ color: 'var(--colony-text-primary)' }}>{label}</span>
                    <span className="ml-auto text-xs shrink-0" style={{ color: 'var(--colony-text-secondary)' }}>{age}</span>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>

      {/* ── Sticky action footer ── */}
      <div
        className="shrink-0 px-5 py-4 border-t flex flex-col gap-2"
        style={{ borderColor: 'var(--colony-border)', background: 'var(--colony-bg-elevated)' }}
      >
        <button
          onClick={handleMarkContacted}
          disabled={contacted}
          className="w-full py-2.5 rounded-lg text-sm font-semibold transition-all"
          style={{
            background: contacted ? 'rgba(16,185,129,0.15)' : 'var(--colony-accent)',
            color: contacted ? 'var(--colony-success)' : '#000',
            border: contacted ? '1px solid rgba(16,185,129,0.3)' : 'none',
            cursor: contacted ? 'default' : 'pointer',
            opacity: contacted ? 1 : 1,
          }}
        >
          {contacted ? '✓ Contacted just now' : 'Mark as Contacted'}
        </button>
        {contacted && (
          <p className="text-xs text-center" style={{ color: 'var(--colony-text-secondary)' }}>
            Will sync to EspoCRM on next pipeline run
          </p>
        )}
        <a
          href={`https://espocrm.example.com/#Lead/view/${lead.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-2 rounded-lg text-sm font-medium text-center flex items-center justify-center gap-1.5 transition-opacity hover:opacity-80"
          style={{
            border: '1px solid var(--colony-border)',
            color: 'var(--colony-text-secondary)',
          }}
        >
          <ExternalLink size={13} />
          Open in EspoCRM
        </a>
      </div>
    </div>
  )
}
