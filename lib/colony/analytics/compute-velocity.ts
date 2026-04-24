import { espoFetchLeads, espoFetchDeals } from '../espocrm'
import { qdrantFetchAllEmailSends, qdrantFetchReplies } from '../qdrant'
import type { VelocityPayload } from '../contracts'

const MS_PER_HOUR = 3_600_000
const MS_PER_DAY  = 86_400_000

function avg(nums: number[]): number | null {
  if (nums.length === 0) return null
  return Math.round((nums.reduce((s, n) => s + n, 0) / nums.length) * 10) / 10
}

function p90(nums: number[]): number | null {
  if (nums.length === 0) return null
  const sorted = [...nums].sort((a, b) => a - b)
  return Math.round(sorted[Math.min(Math.floor(sorted.length * 0.9), sorted.length - 1)] * 10) / 10
}

function getMockVelocity(): VelocityPayload {
  return {
    avg_hours_lead_to_first_touch:  2.3,
    avg_hours_first_touch_to_reply: 47.2,
    avg_days_reply_to_audit:        3.1,
    avg_days_audit_to_signed:       12.4,
    avg_days_lead_to_active:        19.7,
    p90_days_lead_to_active:        38.2,
  }
}

export async function computeVelocity(cohortId: string): Promise<VelocityPayload> {
  if (cohortId === 'demo') return getMockVelocity()

  const [leads, deals, sends, replies] = await Promise.all([
    espoFetchLeads(cohortId, {}),
    espoFetchDeals(cohortId, {}),
    qdrantFetchAllEmailSends(cohortId),
    qdrantFetchReplies(cohortId),
  ])

  const firstSendByLead = new Map<string, number>()
  for (const s of sends) {
    const t = new Date(s.sent_at).getTime()
    const existing = firstSendByLead.get(s.lead_id)
    if (!existing || t < existing) firstSendByLead.set(s.lead_id, t)
  }

  const firstReplyByLead = new Map<string, number>()
  for (const r of replies) {
    if (!r.received_at) continue
    const t = new Date(r.received_at).getTime()
    const existing = firstReplyByLead.get(r.lead_id)
    if (!existing || t < existing) firstReplyByLead.set(r.lead_id, t)
  }

  const leadToTouch: number[] = []
  for (const lead of leads) {
    const send = firstSendByLead.get(lead.id)
    if (send) {
      const hours = (send - new Date(lead.created_at).getTime()) / MS_PER_HOUR
      if (hours >= 0) leadToTouch.push(hours)
    }
  }

  const touchToReply: number[] = []
  for (const [leadId, firstReply] of firstReplyByLead.entries()) {
    const send = firstSendByLead.get(leadId)
    if (send) {
      const hours = (firstReply - send) / MS_PER_HOUR
      if (hours >= 0) touchToReply.push(hours)
    }
  }

  const leadById = new Map(leads.map(l => [l.id, l]))
  const leadToActive: number[] = []
  for (const deal of deals.filter(d => d.stage === 'Active')) {
    const lead = leadById.get(deal.lead_id)
    if (lead) {
      const days = (new Date(deal.last_activity_at ?? deal.created_at).getTime() - new Date(lead.created_at).getTime()) / MS_PER_DAY
      if (days >= 0) leadToActive.push(days)
    }
  }

  return {
    avg_hours_lead_to_first_touch:  avg(leadToTouch),
    avg_hours_first_touch_to_reply: avg(touchToReply),
    avg_days_reply_to_audit:        null,
    avg_days_audit_to_signed:       null,
    avg_days_lead_to_active:        avg(leadToActive),
    p90_days_lead_to_active:        p90(leadToActive),
  }
}
