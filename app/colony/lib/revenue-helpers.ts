import type { Lead, Deal } from './types'

export interface RevenueMove {
  id: string
  urgency: 'high' | 'medium' | 'low'
  title: string
  subtitle: string
  actionLabel: string
  drillTarget: { type: 'lead' | 'deal'; id: string }
}

export function deriveRevenueMoves(leads: Lead[], deals: Deal[]): RevenueMove[] {
  const now = Date.now()
  const moves: RevenueMove[] = []

  // HOT leads with no activity > 2h
  for (const lead of leads) {
    if (lead.temperature !== 'HOT') continue
    const lastSeen = new Date(lead.last_activity_at ?? lead.created_at).getTime()
    const diffH = (now - lastSeen) / 3_600_000
    if (diffH > 2) {
      const label = lead.first_name
        ? `${lead.first_name} ${lead.last_name ?? ''}`.trim()
        : lead.business_name
      moves.push({
        id: `move-lead-${lead.id}`,
        urgency: 'high',
        title: `Respond to ${label}`,
        subtitle: `HOT lead, ${Math.floor(diffH)}h no response · ${lead.business_name}`,
        actionLabel: 'View lead',
        drillTarget: { type: 'lead', id: lead.id },
      })
    }
  }

  // Proposal Sent > 7 days
  for (const deal of deals) {
    if (deal.stage !== 'Proposal Sent' || deal.days_in_stage <= 7) continue
    moves.push({
      id: `move-proposal-${deal.id}`,
      urgency: 'medium',
      title: `Follow up on ${deal.business_name} proposal`,
      subtitle: `Sent ${deal.days_in_stage} days ago · $${deal.amount}/mo`,
      actionLabel: 'Draft follow-up',
      drillTarget: { type: 'deal', id: deal.id },
    })
  }

  // Active client, no activity > 30 days
  for (const deal of deals) {
    if (deal.stage !== 'Active') continue
    const lastSeen = new Date(deal.last_activity_at ?? deal.created_at).getTime()
    const diffDays = (now - lastSeen) / 86_400_000
    if (diffDays > 30) {
      moves.push({
        id: `move-active-${deal.id}`,
        urgency: 'medium',
        title: `Check in with ${deal.business_name}`,
        subtitle: `Active client · no activity in ${Math.floor(diffDays)}d · churn risk`,
        actionLabel: 'View',
        drillTarget: { type: 'deal', id: deal.id },
      })
    }
  }

  // Audit Scheduled > 4 days
  for (const deal of deals) {
    if (deal.stage !== 'Audit Scheduled' || deal.days_in_stage <= 4) continue
    moves.push({
      id: `move-audit-${deal.id}`,
      urgency: 'low',
      title: `Reschedule audit — ${deal.business_name}`,
      subtitle: `Scheduled ${deal.days_in_stage} days ago · may need a bump`,
      actionLabel: 'View',
      drillTarget: { type: 'deal', id: deal.id },
    })
  }

  const order = { high: 0, medium: 1, low: 2 }
  return moves.sort((a, b) => order[a.urgency] - order[b.urgency]).slice(0, 5)
}
