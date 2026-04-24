// Shadow types for Phase 4B — delete this file when Phase 4A merges and
// MetricsPayload is exported from lib/colony/contracts.ts

export interface MRRBreakdown {
  plan: string
  count: number
  monthly_amount: number
}

export interface MetricsPayload {
  mrr_current: number
  mrr_last_month: number
  mrr_delta_pct: number
  arr: number
  active_subscriptions: number
  churn_rate_30d: number
  new_revenue_this_month: number
  breakdown_by_plan: MRRBreakdown[]
  computed_at: string
}

export interface Alert {
  id: string
  urgency: 'critical' | 'important' | 'fyi'
  icon: string
  title: string
  context: string
  actionLabel?: string
  drillTarget?: { type: 'lead' | 'deal'; id: string }
}
