import type { FeedEventPayload, FeedQuery } from './contracts'
import type { FeedEventType } from '@/app/colony/lib/types'
import { espoFetchLeads, espoFetchActivities } from './espocrm'
import { qdrantFetchReports, qdrantFetchBotRuns, qdrantFetchRecentInstantlySends } from './qdrant'
import { qdrantFetchReplyFeedEvents } from './email/inbound/feed-emitter'

const BOT_ICONS: Record<string, string> = {
  'Bill Nye': '🧪',
  'Coach': '🎯',
  'Fact Checker': '✅',
  'Lead Researcher': '🔍',
  'Bob': '✍️',
  'Scheduler': '⏱️',
  'Harvester': '🌾',
  'Archivist': '📚',
}

export async function buildFeed(cohortId: string, query: FeedQuery = {}): Promise<FeedEventPayload[]> {
  const since48h = new Date(Date.now() - 48 * 3_600_000).toISOString()
  const since = query.since ?? since48h
  const limit = query.limit ?? 50

  const events: FeedEventPayload[] = []

  const [leads, activities, reports, botRuns, replies, instantlySends] = await Promise.allSettled([
    espoFetchLeads(cohortId, { limit: 50 }),
    espoFetchActivities(cohortId, { since, limit: 100 }),
    qdrantFetchReports(cohortId, { limit: 10 }),
    qdrantFetchBotRuns(cohortId, { since, limit: 20 }),
    qdrantFetchReplyFeedEvents(cohortId, since, 50),
    qdrantFetchRecentInstantlySends(cohortId, since, 50),
  ])

  // Build a quick lead_id → business_name map so the email_sent events can
  // show the business name instead of just an opaque lead UUID.
  const leadNameById = new Map<string, string>()
  if (leads.status === 'fulfilled') {
    for (const lead of leads.value) {
      leadNameById.set(lead.id, lead.business_name)
    }
  }

  // 1. New leads from last 48h
  if (leads.status === 'fulfilled') {
    for (const lead of leads.value) {
      if (new Date(lead.created_at).getTime() < new Date(since).getTime()) continue
      const isHot = lead.temperature === 'HOT'
      const name = lead.first_name
        ? `${lead.first_name} ${lead.last_name ?? ''}`.trim()
        : lead.business_name
      events.push({
        id: `lead-new-${lead.id}`,
        cohort_id: lead.cohort_id,
        timestamp: lead.created_at,
        type: (isHot ? 'lead_hot' : 'lead_new') as FeedEventType,
        title: isHot ? `HOT lead: ${name}` : `New lead: ${name}`,
        subtitle: `${lead.business_name} · ${lead.utm_source ?? lead.source}`,
        icon: isHot ? '🔥' : '🆕',
        drill_target: { type: 'lead', id: lead.id },
      })
    }
  }

  // 2. Stage changes from EspoCRM Notes
  if (activities.status === 'fulfilled') {
    for (const note of activities.value) {
      const isStageChange = note.subject.toLowerCase().includes('stage') ||
        note.subject.toLowerCase().includes('moved') ||
        note.subject.toLowerCase().includes('pipeline')
      if (!isStageChange) continue
      events.push({
        id: `note-${note.related_entity_id}-${note.created_at}`,
        cohort_id: cohortId as FeedEventPayload['cohort_id'],
        timestamp: note.created_at,
        type: 'pipeline_move',
        title: note.subject,
        subtitle: note.body?.slice(0, 80) ?? '',
        icon: '📋',
        drill_target: {
          type: note.related_entity_type === 'Opportunity' ? 'deal' : 'lead',
          id: note.related_entity_id,
        },
      })
    }
  }

  // 3. Bill Nye reports
  if (reports.status === 'fulfilled') {
    for (const report of reports.value) {
      if (new Date(report.generated_at).getTime() < new Date(since).getTime()) continue
      const isCoach = report.title.toLowerCase().includes('coach') ||
        report.title.toLowerCase().includes('flag')
      events.push({
        id: `report-${report.id}`,
        cohort_id: report.cohort_id,
        timestamp: report.generated_at,
        type: (isCoach ? 'coach_alert' : 'bill_nye_finding') as FeedEventType,
        title: isCoach ? `Coach flagged: ${report.title}` : `Bill Nye: ${report.title}`,
        subtitle: report.top_findings[0] ?? '',
        icon: isCoach ? '🎯' : '🧪',
        drill_target: { type: 'report', id: report.id },
      })
    }
  }

  // 4. Bot runs
  if (botRuns.status === 'fulfilled') {
    for (const run of botRuns.value) {
      events.push({
        id: `botrun-${run.bot_name}-${run.ran_at}`,
        cohort_id: cohortId as FeedEventPayload['cohort_id'],
        timestamp: run.ran_at,
        type: 'bot_run',
        title: `${run.bot_name} ran`,
        subtitle: run.summary,
        icon: BOT_ICONS[run.bot_name] ?? '🤖',
        drill_target: { type: 'bot', id: run.bot_name.toLowerCase().replace(/\s+/g, '-') },
      })
    }
  }

  // 5. Reply events (INTERESTED replies bubble to top regardless of timestamp)
  const interestedReplyIds = new Set<string>()
  if (replies.status === 'fulfilled') {
    for (const reply of replies.value) {
      if (reply.classification === 'INTERESTED') interestedReplyIds.add(reply.id)
      events.push({
        id: reply.id,
        cohort_id: reply.cohort_id as FeedEventPayload['cohort_id'],
        timestamp: reply.timestamp,
        type: reply.type as FeedEventType,
        title: reply.title,
        subtitle: reply.subtitle,
        icon: reply.icon,
        drill_target: { type: 'lead', id: reply.drill_target_id },
      })
    }
  }

  // 6. Outbound Instantly sends — qdrant emails_sent, delivered=true,
  //    delivery_method=instantly. Surfaces every email the master_pipeline
  //    actually queued and confirmed. Uses business name from the lead lookup
  //    when available, else falls back to the recipient email.
  if (instantlySends.status === 'fulfilled') {
    for (const s of instantlySends.value) {
      const businessName = leadNameById.get(s.lead_id) ?? s.recipient_email
      events.push({
        id: `email-sent-${s.lead_id}-${s.sent_at}`,
        cohort_id: cohortId as FeedEventPayload['cohort_id'],
        timestamp: s.sent_at,
        type: 'email_sent',
        title: `Sent via Instantly: ${businessName}`,
        subtitle: s.subject,
        icon: '📤',
        drill_target: { type: 'lead', id: s.lead_id },
      })
    }
  }

  return events
    .sort((a, b) => {
      // Priority boost: INTERESTED replies always appear before non-interested items
      const aInterested = interestedReplyIds.has(a.id)
      const bInterested = interestedReplyIds.has(b.id)
      if (aInterested && !bInterested) return -1
      if (!aInterested && bInterested) return 1
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    })
    .slice(0, limit)
}
