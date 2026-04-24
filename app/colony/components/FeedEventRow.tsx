'use client'

import type { FeedEvent, Lead, Bot, Deal, BillNyeReport } from '../lib/types'
import { formatRelativeTime } from '../lib/feed-helpers'
import { useSidePanel } from './SidePanel'
import { useCohort } from './CohortSwitcher'
import { capture } from '../lib/posthog'
import {
  getLeadsForCohort,
  getBotsForCohort,
  getDealsForCohort,
  getReportsForCohort,
} from '../lib/mock-data'

// ─── Detail panel content ─────────────────────────────────────────────────────

const TEMP_COLORS: Record<string, string> = {
  HOT: 'var(--colony-danger)',
  WARM: 'var(--colony-warning)',
  COOL: '#3b82f6',
  COLD: 'var(--colony-text-secondary)',
}

function Field({ label, value }: { label: string; value?: string | number | null }) {
  if (!value && value !== 0) return null
  return (
    <div className="flex gap-2 text-sm py-1.5 border-b last:border-0" style={{ borderColor: 'var(--colony-border)' }}>
      <span className="w-28 shrink-0 text-xs" style={{ color: 'var(--colony-text-secondary)' }}>{label}</span>
      <span style={{ color: 'var(--colony-text-primary)' }}>{value}</span>
    </div>
  )
}

function LeadPanel({ lead }: { lead: Lead }) {
  return (
    <div className="p-5 space-y-1">
      <div className="mb-4 flex items-center gap-2">
        <span
          className="text-xs font-bold px-2 py-0.5 rounded-full"
          style={{ background: TEMP_COLORS[lead.temperature] + '22', color: TEMP_COLORS[lead.temperature] }}
        >
          {lead.temperature}
        </span>
        <span className="text-xs" style={{ color: 'var(--colony-text-secondary)' }}>
          ${lead.deal_tier}/mo
        </span>
      </div>
      {lead.first_name && <Field label="Name" value={`${lead.first_name} ${lead.last_name ?? ''}`.trim()} />}
      <Field label="Email" value={lead.email} />
      <Field label="Phone" value={lead.phone} />
      <Field label="Business" value={lead.business_name} />
      <Field label="Niche" value={lead.niche} />
      <Field label="Location" value={`${lead.city}, ${lead.state}`} />
      <Field label="Source" value={lead.utm_source} />
      <Field label="Website" value={lead.website} />
      <Field label="Added" value={new Date(lead.created_at).toLocaleDateString()} />
    </div>
  )
}

function BotPanel({ bot }: { bot: Bot }) {
  return (
    <div className="p-5 space-y-1">
      <div className="mb-4 text-4xl">{bot.avatar_emoji}</div>
      <Field label="Role" value={bot.role} />
      <Field label="Last run" value={new Date(bot.last_run_at).toLocaleString()} />
      <Field label="Last output" value={bot.last_output_summary} />
      <Field label="Decisions/wk" value={bot.decisions_this_week} />
    </div>
  )
}

function DealPanel({ deal }: { deal: Deal }) {
  return (
    <div className="p-5 space-y-1">
      <div className="mb-4">
        <span
          className="text-xs font-bold px-2 py-0.5 rounded-full"
          style={{ background: 'var(--colony-accent)22', color: 'var(--colony-accent)' }}
        >
          {deal.stage}
        </span>
      </div>
      <Field label="Business" value={deal.business_name} />
      <Field label="Amount" value={`$${deal.amount}/mo`} />
      <Field label="Probability" value={`${deal.probability}%`} />
      <Field label="Days in stage" value={deal.days_in_stage} />
      <Field label="Created" value={new Date(deal.created_at).toLocaleDateString()} />
    </div>
  )
}

function ReportPanel({ report }: { report: BillNyeReport }) {
  return (
    <div className="p-5">
      <p className="text-xs mb-4" style={{ color: 'var(--colony-text-secondary)' }}>
        {new Date(report.generated_at).toLocaleDateString('en-US', { dateStyle: 'long' })}
      </p>
      <ul className="space-y-2 mb-5">
        {report.top_findings.map((f, i) => (
          <li key={i} className="flex gap-2 text-sm">
            <span style={{ color: 'var(--colony-accent)' }}>•</span>
            <span style={{ color: 'var(--colony-text-primary)' }}>{f}</span>
          </li>
        ))}
      </ul>
      <div
        className="text-sm leading-relaxed prose-sm"
        style={{ color: 'var(--colony-text-secondary)' }}
        dangerouslySetInnerHTML={{ __html: report.html_content }}
      />
    </div>
  )
}

// ─── FeedEventRow ─────────────────────────────────────────────────────────────

interface Props {
  event: FeedEvent
  index: number
}

export default function FeedEventRow({ event, index }: Props) {
  const { open } = useSidePanel()
  const { cohortId } = useCohort()
  const delay = Math.min(index * 50, 1000)

  const handleClick = () => {
    capture('colony_feed_event_clicked', { event_id: event.id, event_type: event.type })
    if (!event.drill_target) return

    const { type, id } = event.drill_target

    if (type === 'lead') {
      const lead = getLeadsForCohort(cohortId).find(l => l.id === id)
      if (!lead) return
      open({
        title: lead.business_name,
        subtitle: `${lead.city}, ${lead.state} · ${lead.niche}`,
        children: <LeadPanel lead={lead} />,
      })
    } else if (type === 'bot') {
      const bot = getBotsForCohort(cohortId).find(b => b.id === id)
      if (!bot) return
      open({
        title: `${bot.avatar_emoji} ${bot.name}`,
        subtitle: bot.role,
        children: <BotPanel bot={bot} />,
      })
    } else if (type === 'deal') {
      const deal = getDealsForCohort(cohortId).find(d => d.id === id)
      if (!deal) return
      open({
        title: deal.business_name,
        subtitle: `${deal.stage} · $${deal.amount}/mo`,
        children: <DealPanel deal={deal} />,
      })
    } else if (type === 'report') {
      const report = getReportsForCohort(cohortId).find(r => r.id === id)
      if (!report) return
      open({
        title: report.title,
        subtitle: new Date(report.generated_at).toLocaleDateString(),
        width: 'wide',
        children: <ReportPanel report={report} />,
      })
    }
  }

  return (
    <div
      className="colony-feed-row flex items-start gap-3 px-4 py-3 rounded-lg cursor-pointer"
      style={{
        animationDelay: `${delay}ms`,
        transition: 'background 150ms ease',
      }}
      onMouseEnter={e => (e.currentTarget.style.background = 'var(--colony-bg-elevated)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && handleClick()}
    >
      {/* Icon */}
      <span className="text-xl leading-none mt-0.5 shrink-0">{event.icon}</span>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className="leading-snug" style={{ fontSize: 14, fontWeight: 700, color: 'var(--colony-text-primary)' }}>
          {event.title}
        </p>
        <p className="mt-0.5 truncate" style={{ fontSize: 12, color: 'rgba(255,255,255,.6)' }}>
          {event.subtitle}
        </p>
      </div>

      {/* Time */}
      <span className="shrink-0 mt-0.5" style={{ fontSize: 11, color: 'rgba(255,255,255,.3)' }}>
        {formatRelativeTime(event.timestamp)}
      </span>
    </div>
  )
}
