import { espoFetchLeads, espoFetchDeals } from '../espocrm'
import { qdrantFetchAllEmailSends, qdrantFetchReplies } from '../qdrant'
import type { FunnelPayload } from '../contracts'

function pct(num: number, denom: number): number {
  if (denom === 0) return 0
  return Math.round((num / denom) * 1000) / 10
}

function getMockFunnel(): FunnelPayload {
  return {
    stages: [
      { name: 'Leads',           count: 42, conversion_from_previous: null },
      { name: 'Outreach Sent',   count: 38, conversion_from_previous: 90.5 },
      { name: 'Replied',         count: 14, conversion_from_previous: 36.8 },
      { name: 'Interested',      count:  8, conversion_from_previous: 57.1 },
      { name: 'Audit Scheduled', count:  6, conversion_from_previous: 75.0 },
      { name: 'Proposal Sent',   count:  5, conversion_from_previous: 83.3 },
      { name: 'Signed',          count:  4, conversion_from_previous: 80.0 },
      { name: 'Active',          count:  3, conversion_from_previous: 75.0 },
      { name: 'Churned',         count:  1, conversion_from_previous: 33.3 },
    ],
    total_leads: 42,
    period: 'all_time',
  }
}

const ADVANCED_STAGES  = ['Audit Scheduled','Audit Complete','Proposal Sent','Proposal Signed','Active','Churned']
const PROPOSAL_STAGES  = ['Proposal Sent','Proposal Signed','Active','Churned']
const SIGNED_STAGES    = ['Proposal Signed','Active','Churned']

export async function computeFunnel(cohortId: string): Promise<FunnelPayload> {
  if (cohortId === 'demo') return getMockFunnel()

  const [leads, deals, sends, replies] = await Promise.all([
    espoFetchLeads(cohortId, {}),
    espoFetchDeals(cohortId, {}),
    qdrantFetchAllEmailSends(cohortId),
    qdrantFetchReplies(cohortId),
  ])

  const leadIds = new Set(leads.map(l => l.id))
  const leadsWithSend     = new Set(sends.map(s => s.lead_id).filter(id => leadIds.has(id)))
  const leadsWithReply    = new Set(replies.map(r => r.lead_id).filter(id => leadIds.has(id)))
  const leadsInterested   = new Set(
    replies.filter(r => r.classification === 'INTERESTED').map(r => r.lead_id)
  )

  const dealsFromLeads      = deals.filter(d => leadIds.has(d.lead_id))
  const dealsAuditScheduled = dealsFromLeads.filter(d => ADVANCED_STAGES.includes(d.stage))
  const dealsProposalSent   = dealsFromLeads.filter(d => PROPOSAL_STAGES.includes(d.stage))
  const dealsSigned         = dealsFromLeads.filter(d => SIGNED_STAGES.includes(d.stage))
  const dealsActive         = dealsFromLeads.filter(d => d.stage === 'Active')
  const dealsChurned        = dealsFromLeads.filter(d => d.stage === 'Churned')

  return {
    stages: [
      { name: 'Leads',           count: leads.length,            conversion_from_previous: null },
      { name: 'Outreach Sent',   count: leadsWithSend.size,      conversion_from_previous: pct(leadsWithSend.size, leads.length) },
      { name: 'Replied',         count: leadsWithReply.size,     conversion_from_previous: pct(leadsWithReply.size, leadsWithSend.size) },
      { name: 'Interested',      count: leadsInterested.size,    conversion_from_previous: pct(leadsInterested.size, leadsWithReply.size) },
      { name: 'Audit Scheduled', count: dealsAuditScheduled.length, conversion_from_previous: pct(dealsAuditScheduled.length, leadsInterested.size) },
      { name: 'Proposal Sent',   count: dealsProposalSent.length,  conversion_from_previous: pct(dealsProposalSent.length, dealsAuditScheduled.length) },
      { name: 'Signed',          count: dealsSigned.length,        conversion_from_previous: pct(dealsSigned.length, dealsProposalSent.length) },
      { name: 'Active',          count: dealsActive.length,        conversion_from_previous: pct(dealsActive.length, dealsSigned.length) },
      { name: 'Churned',         count: dealsChurned.length,       conversion_from_previous: pct(dealsChurned.length, dealsSigned.length) },
    ],
    total_leads: leads.length,
    period: 'all_time',
  }
}
