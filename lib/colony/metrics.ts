import type { MetricsPayload } from './contracts'
import {
  squareFetchActiveSubscriptions,
  squareFetchPaymentsThisMonth,
  squareFetchCanceledSubscriptionsThisMonth,
} from './square'

export async function computeMetrics(cohortId: string): Promise<MetricsPayload> {
  if (cohortId === 'demo') return getMockMetrics()

  const [subs, payments, canceled] = await Promise.all([
    squareFetchActiveSubscriptions(),
    squareFetchPaymentsThisMonth(),
    squareFetchCanceledSubscriptionsThisMonth(),
  ])

  const mrr_current = subs.reduce((sum, s) => sum + s.monthly_amount, 0)
  const mrr_last_month = mrr_current + canceled.reduce((sum, c) => sum + c.monthly_amount, 0)
  const mrr_delta_pct = mrr_last_month > 0
    ? ((mrr_current - mrr_last_month) / mrr_last_month) * 100
    : 0

  const new_revenue_this_month = payments
    .filter(p => p.status === 'COMPLETED' && p.type !== 'subscription')
    .reduce((sum, p) => sum + p.amount, 0)

  const churn_rate_30d = mrr_last_month > 0
    ? canceled.length / (subs.length + canceled.length)
    : 0

  const planMap = new Map<string, { count: number; monthly_amount: number }>()
  for (const sub of subs) {
    const existing = planMap.get(sub.plan_name) ?? { count: 0, monthly_amount: 0 }
    planMap.set(sub.plan_name, {
      count: existing.count + 1,
      monthly_amount: existing.monthly_amount + sub.monthly_amount,
    })
  }

  return {
    mrr_current,
    mrr_last_month,
    mrr_delta_pct,
    arr: mrr_current * 12,
    active_subscriptions: subs.length,
    churn_rate_30d,
    new_revenue_this_month,
    breakdown_by_plan: Array.from(planMap.entries()).map(([plan, v]) => ({ plan, ...v })),
    computed_at: new Date().toISOString(),
  }
}

function getMockMetrics(): MetricsPayload {
  return {
    mrr_current: 149,
    mrr_last_month: 149,
    mrr_delta_pct: 0,
    arr: 1788,
    active_subscriptions: 1,
    churn_rate_30d: 0,
    new_revenue_this_month: 99,
    breakdown_by_plan: [{ plan: 'Growth', count: 1, monthly_amount: 149 }],
    computed_at: new Date().toISOString(),
  }
}
