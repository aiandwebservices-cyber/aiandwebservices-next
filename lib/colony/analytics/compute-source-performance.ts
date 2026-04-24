import { espoFetchLeads, espoFetchDeals } from '../espocrm'
import { qdrantFetchAllEmailSends, qdrantFetchReplies } from '../qdrant'
import type { SourcesPayload, SourcePerformanceRow } from '../contracts'

function pct(num: number, denom: number): number {
  if (denom === 0) return 0
  return Math.round((num / denom) * 1000) / 10
}

function getMockSources(): SourcesPayload {
  return {
    rows: [
      { source: 'master_pipeline', leads_count: 28, outreach_rate: 96.4, reply_rate: 40.7, interested_rate: 55.6, conversion_rate: 10.7, avg_deal_value: 249 },
      { source: 'website',         leads_count: 10, outreach_rate: 90.0, reply_rate: 33.3, interested_rate: 33.3, conversion_rate: 10.0, avg_deal_value: 199 },
      { source: 'fresh_business',  leads_count:  4, outreach_rate: 75.0, reply_rate:  0.0, interested_rate:  0.0, conversion_rate:  0.0, avg_deal_value: 149 },
    ],
  }
}

export async function computeSourcePerformance(cohortId: string): Promise<SourcesPayload> {
  if (cohortId === 'demo') return getMockSources()

  const [leads, deals, sends, replies] = await Promise.all([
    espoFetchLeads(cohortId, {}),
    espoFetchDeals(cohortId, {}),
    qdrantFetchAllEmailSends(cohortId),
    qdrantFetchReplies(cohortId),
  ])

  const dealsByLeadId = new Map(deals.map(d => [d.lead_id, d]))
  const sentLeadIds       = new Set(sends.map(s => s.lead_id))
  const repliedLeadIds    = new Set(replies.map(r => r.lead_id))
  const interestedLeadIds = new Set(replies.filter(r => r.classification === 'INTERESTED').map(r => r.lead_id))

  type Bucket = { leads: typeof leads; sentIds: Set<string>; repliedIds: Set<string>; interestedIds: Set<string>; activeDeals: typeof deals }
  const bySource = new Map<string, Bucket>()

  for (const lead of leads) {
    const src = lead.source
    if (!bySource.has(src)) bySource.set(src, { leads: [], sentIds: new Set(), repliedIds: new Set(), interestedIds: new Set(), activeDeals: [] })
    const g = bySource.get(src)!
    g.leads.push(lead)
    if (sentLeadIds.has(lead.id))       g.sentIds.add(lead.id)
    if (repliedLeadIds.has(lead.id))    g.repliedIds.add(lead.id)
    if (interestedLeadIds.has(lead.id)) g.interestedIds.add(lead.id)
    const deal = dealsByLeadId.get(lead.id)
    if (deal?.stage === 'Active') g.activeDeals.push(deal)
  }

  const rows: SourcePerformanceRow[] = []
  for (const [src, g] of bySource.entries()) {
    const avgDeal = g.activeDeals.length > 0
      ? Math.round(g.activeDeals.reduce((s, d) => s + d.amount, 0) / g.activeDeals.length)
      : Math.round(g.leads.reduce((s, l) => s + l.deal_tier, 0) / Math.max(g.leads.length, 1))
    rows.push({
      source:          src,
      leads_count:     g.leads.length,
      outreach_rate:   pct(g.sentIds.size,       g.leads.length),
      reply_rate:      pct(g.repliedIds.size,    g.sentIds.size),
      interested_rate: pct(g.interestedIds.size, g.repliedIds.size),
      conversion_rate: pct(g.activeDeals.length, g.leads.length),
      avg_deal_value:  avgDeal,
    })
  }

  return { rows: rows.sort((a, b) => b.leads_count - a.leads_count) }
}
