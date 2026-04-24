import type { Deal, DealStage } from '@/app/colony/lib/types'

export const STAGE_ORDER: DealStage[] = [
  'Lead',
  'Audit Scheduled',
  'Audit Complete',
  'Proposal Sent',
  'Proposal Signed',
  'Active',
  'Churned',
]

export const STAGE_META: Record<DealStage, { label: string; probability: number; accentColor: string }> = {
  'Lead':             { label: 'Lead',             probability: 10,  accentColor: '#525252' },
  'Audit Scheduled':  { label: 'Audit Scheduled',  probability: 25,  accentColor: '#3b82f6' },
  'Audit Complete':   { label: 'Audit Complete',   probability: 40,  accentColor: '#8b5cf6' },
  'Proposal Sent':    { label: 'Proposal Sent',    probability: 60,  accentColor: '#f59e0b' },
  'Proposal Signed':  { label: 'Proposal Signed',  probability: 100, accentColor: '#10b981' },
  'Active':           { label: 'Active',           probability: 100, accentColor: '#00d4ff' },
  'Churned':          { label: 'Churned',          probability: 0,   accentColor: '#ef4444' },
}

export function groupDealsByStage(deals: Deal[]): Record<DealStage, Deal[]> {
  const result = {} as Record<DealStage, Deal[]>
  for (const stage of STAGE_ORDER) result[stage] = []
  for (const deal of deals) {
    if (result[deal.stage]) result[deal.stage].push(deal)
  }
  return result
}
