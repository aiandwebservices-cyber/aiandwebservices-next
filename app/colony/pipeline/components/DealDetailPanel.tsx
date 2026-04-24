'use client'

import { ExternalLink } from 'lucide-react'
import type { Deal } from '@/app/colony/lib/types'
import { STAGE_META } from '../lib/stage-helpers'
import { formatAge } from '../../lib/lead-helpers'

interface DealDetailPanelProps {
  deal: Deal
}

function StageBadge({ stage }: { stage: Deal['stage'] }) {
  const meta = STAGE_META[stage]
  return (
    <span
      className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
      style={{
        background: `${meta.accentColor}20`,
        color: meta.accentColor,
        border: `1px solid ${meta.accentColor}40`,
      }}
    >
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: meta.accentColor, display: 'inline-block', flexShrink: 0 }} />
      {meta.label}
    </span>
  )
}

function stubActivities(deal: Deal) {
  const base = new Date(deal.last_activity_at ?? deal.created_at)
  return [
    { label: 'Stage updated', offset: 0 },
    { label: 'Email sent to prospect', offset: 2 * 3600000 },
    { label: 'Lead captured', offset: 6 * 3600000 },
  ].map(({ label, offset }) => ({
    label,
    ts: new Date(base.getTime() + offset).toISOString(),
  }))
}

export function DealDetailPanel({ deal }: DealDetailPanelProps) {
  const activities = deal.last_activity_at ? stubActivities(deal) : []
  const isStale = deal.last_activity_at
    ? Date.now() - new Date(deal.last_activity_at).getTime() > 7 * 86400000
    : true

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        {/* Hero */}
        <div className="px-5 pt-5 pb-4 border-b" style={{ borderColor: 'var(--colony-border)' }}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-bold text-base" style={{ color: 'var(--colony-text-primary)' }}>
                {deal.business_name}
              </p>
              <p className="text-2xl font-black mt-1" style={{ color: 'var(--colony-accent)' }}>
                ${deal.amount.toLocaleString()}<span className="text-sm font-normal" style={{ color: 'var(--colony-text-secondary)' }}>/mo</span>
              </p>
            </div>
            <StageBadge stage={deal.stage} />
          </div>
        </div>

        {/* Stage info */}
        <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--colony-border)' }}>
          <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: 'var(--colony-text-secondary)' }}>
            Stage Info
          </p>
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between">
              <span style={{ color: 'var(--colony-text-secondary)' }}>Days in stage</span>
              <span className="font-semibold" style={{ color: deal.days_in_stage > 7 ? 'var(--colony-danger)' : 'var(--colony-text-primary)' }}>
                {deal.days_in_stage} days
              </span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: 'var(--colony-text-secondary)' }}>Probability</span>
              <span className="font-semibold" style={{ color: 'var(--colony-text-primary)' }}>
                {STAGE_META[deal.stage].probability}%
              </span>
            </div>
            {deal.last_activity_at && (
              <div className="flex justify-between">
                <span style={{ color: 'var(--colony-text-secondary)' }}>Last activity</span>
                <span
                  className="font-semibold"
                  style={{ color: isStale ? 'var(--colony-danger)' : 'var(--colony-text-primary)' }}
                >
                  {formatAge(deal.last_activity_at)}
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span style={{ color: 'var(--colony-text-secondary)' }}>Created</span>
              <span style={{ color: 'var(--colony-text-secondary)' }}>{formatAge(deal.created_at)}</span>
            </div>
          </div>
        </div>

        {/* Lead reference */}
        {deal.lead_id && (
          <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--colony-border)' }}>
            <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: 'var(--colony-text-secondary)' }}>
              Source Lead
            </p>
            <p className="text-xs" style={{ color: 'var(--colony-text-secondary)' }}>
              Lead ID: <span className="font-mono" style={{ color: 'var(--colony-accent)' }}>{deal.lead_id}</span>
            </p>
            <p className="text-xs mt-1" style={{ color: 'var(--colony-text-secondary)', opacity: 0.7 }}>
              Open the Lead Inbox to see full lead profile.
            </p>
          </div>
        )}

        {/* Activity list */}
        <div className="px-5 py-4">
          <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: 'var(--colony-text-secondary)' }}>
            Activity
          </p>
          {activities.length === 0 ? (
            <p className="text-sm" style={{ color: 'var(--colony-text-secondary)' }}>No activity yet.</p>
          ) : (
            <ul className="space-y-2">
              {activities.map((act, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span style={{ color: 'var(--colony-accent)', flexShrink: 0, marginTop: 2 }}>·</span>
                  <span style={{ color: 'var(--colony-text-primary)' }}>{act.label}</span>
                  <span className="ml-auto text-xs shrink-0" style={{ color: 'var(--colony-text-secondary)' }}>
                    {formatAge(act.ts)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="shrink-0 px-5 py-4 border-t" style={{ borderColor: 'var(--colony-border)', background: 'var(--colony-bg-elevated)' }}>
        <a
          href={`https://espocrm.example.com/#Opportunity/view/${deal.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-2 rounded-lg text-sm font-medium text-center flex items-center justify-center gap-1.5 transition-opacity hover:opacity-80"
          style={{ border: '1px solid var(--colony-border)', color: 'var(--colony-text-secondary)' }}
        >
          <ExternalLink size={13} />
          Open in EspoCRM
        </a>
      </div>
    </div>
  )
}
