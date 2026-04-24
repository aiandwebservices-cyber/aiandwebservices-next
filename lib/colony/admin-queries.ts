// Admin-only query helpers. Aggregate data across multiple fetchers for admin screens.

import type { Cohort } from '@/app/colony/lib/types'
import type { MetricsPayload, LeadPayload, DealPayload, FeedEventPayload } from './contracts'
import { fetchers } from './fetchers'
import { readAuditLog, getExistingCohortIds } from './onboarding-writers'

export interface CustomerSummary {
  cohort_id: string
  business_name: string
  plan: string
  mrr: number
  active_subscriptions: number
  leads_this_week: number
  alert_count: number
  last_active_at: string | null
  status: 'active' | 'onboarding' | 'churned'
  primary_contact_email?: string
  onboarded_at?: string
}

export interface CustomerDetail extends CustomerSummary {
  metrics: MetricsPayload | null
  recent_activity: FeedEventPayload[]
  pipeline_summary: { stage_counts: Record<string, number>; total_value: number }
  deals: DealPayload[]
  audit_entries: Awaited<ReturnType<typeof readAuditLog>>
}

async function deriveCustomerFromAudit(cohortId: string) {
  const log = await readAuditLog(500)
  const onboard = log.find(e => e.action === 'onboard' && e.target_cohort_id === cohortId)
  const churn = log.find(
    e => e.action === 'manual_edit'
      && e.target_cohort_id === cohortId
      && typeof e.notes === 'string'
      && e.notes.toLowerCase().includes('churn')
  )
  const input = (onboard?.input as Record<string, unknown>) ?? {}
  return {
    business_name: (input.businessName as string) ?? cohortId,
    plan: (input.plan as string) ?? 'unknown',
    primary_contact_email: input.primaryContactEmail as string | undefined,
    onboarded_at: onboard?.timestamp,
    status: (churn ? 'churned' : 'active') as CustomerSummary['status'],
  }
}

function countAlerts(leads: LeadPayload[], deals: DealPayload[]): number {
  const agingHot = leads.filter(l => {
    if (l.temperature !== 'HOT') return false
    const age = Date.now() - new Date(l.last_activity_at ?? l.created_at).getTime()
    return age > 24 * 60 * 60 * 1000
  }).length
  const stuckProposals = deals.filter(d =>
    d.stage === 'Proposal Sent' && d.days_in_stage > 7
  ).length
  return agingHot + stuckProposals
}

function startOfWeek(): Date {
  const d = new Date()
  d.setUTCDate(d.getUTCDate() - 7)
  return d
}

async function summarize(cohortId: string): Promise<CustomerSummary> {
  const [metrics, leads, deals, feed, meta] = await Promise.all([
    fetchers.fetchMetrics(cohortId as Cohort).catch(() => null),
    fetchers.fetchLeads(cohortId as Cohort, { limit: 500 }).catch(() => [] as LeadPayload[]),
    fetchers.fetchDeals(cohortId as Cohort, { limit: 500 }).catch(() => [] as DealPayload[]),
    fetchers.fetchFeed(cohortId as Cohort, { limit: 10 }).catch(() => [] as FeedEventPayload[]),
    deriveCustomerFromAudit(cohortId),
  ])

  const weekStart = startOfWeek()
  const leadsThisWeek = leads.filter(l => new Date(l.created_at) >= weekStart).length
  const lastActive = feed[0]?.timestamp ?? null

  return {
    cohort_id: cohortId,
    business_name: meta.business_name,
    plan: meta.plan,
    primary_contact_email: meta.primary_contact_email,
    onboarded_at: meta.onboarded_at,
    status: meta.status,
    mrr: metrics?.mrr_current ?? 0,
    active_subscriptions: metrics?.active_subscriptions ?? 0,
    leads_this_week: leadsThisWeek,
    alert_count: countAlerts(leads, deals),
    last_active_at: lastActive,
  }
}

export async function listCustomers(): Promise<CustomerSummary[]> {
  const cohortIds = new Set<string>(await getExistingCohortIds())
  cohortIds.add('aiandwebservices')
  cohortIds.add('demo')
  const summaries = await Promise.all(Array.from(cohortIds).map(summarize))
  return summaries.sort((a, b) => b.mrr - a.mrr)
}

export async function getCustomerDetail(cohortId: string): Promise<CustomerDetail> {
  const [summary, metrics, deals, feed, audit] = await Promise.all([
    summarize(cohortId),
    fetchers.fetchMetrics(cohortId as Cohort).catch(() => null),
    fetchers.fetchDeals(cohortId as Cohort, { limit: 500 }).catch(() => [] as DealPayload[]),
    fetchers.fetchFeed(cohortId as Cohort, { limit: 10 }).catch(() => [] as FeedEventPayload[]),
    readAuditLog(50).then(all => all.filter(e => e.target_cohort_id === cohortId)),
  ])

  const stage_counts: Record<string, number> = {}
  let total_value = 0
  for (const d of deals) {
    stage_counts[d.stage] = (stage_counts[d.stage] ?? 0) + 1
    total_value += d.amount
  }

  return {
    ...summary,
    metrics,
    recent_activity: feed,
    pipeline_summary: { stage_counts, total_value },
    deals,
    audit_entries: audit,
  }
}

// ─── Identity merge candidates (dry-run scanner) ────────────────────────────

export interface IdentityCandidatePair {
  id: string
  left: { cohort_id: string; entity_type: string; entity_id: string; display: string; email?: string; phone?: string }
  right: { cohort_id: string; entity_type: string; entity_id: string; display: string; email?: string; phone?: string }
  reason: 'same_email' | 'same_phone' | 'similar_name'
  confidence: number
}

function levenshtein(a: string, b: string): number {
  const m = a.length, n = b.length
  if (m === 0) return n
  if (n === 0) return m
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0))
  for (let i = 0; i <= m; i++) dp[i][0] = i
  for (let j = 0; j <= n; j++) dp[0][j] = j
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost)
    }
  }
  return dp[m][n]
}

export async function scanIdentityCandidates(): Promise<IdentityCandidatePair[]> {
  const cohortIds = new Set<string>(await getExistingCohortIds())
  cohortIds.add('aiandwebservices')
  cohortIds.add('demo')

  const allLeads: Array<LeadPayload & { _cohort: string }> = []
  for (const cid of cohortIds) {
    try {
      const leads = await fetchers.fetchLeads(cid as Cohort, { limit: 500 })
      for (const lead of leads) allLeads.push({ ...lead, _cohort: cid })
    } catch {
      // skip cohorts whose lead sources are unavailable
    }
  }

  const pairs: IdentityCandidatePair[] = []
  const seen = new Set<string>()

  for (let i = 0; i < allLeads.length; i++) {
    for (let j = i + 1; j < allLeads.length; j++) {
      const a = allLeads[i], b = allLeads[j]
      const key = [a.id, b.id].sort().join('::')
      if (seen.has(key)) continue

      let reason: IdentityCandidatePair['reason'] | null = null
      let confidence = 0

      if (a.email && b.email && a.email.toLowerCase() === b.email.toLowerCase()) {
        reason = 'same_email'
        confidence = 0.95
      } else if (a.phone && b.phone && a.phone.replace(/\D/g, '') === b.phone.replace(/\D/g, '')) {
        reason = 'same_phone'
        confidence = 0.85
      } else {
        const distance = levenshtein(a.business_name.toLowerCase(), b.business_name.toLowerCase())
        const maxLen = Math.max(a.business_name.length, b.business_name.length)
        if (maxLen > 6 && distance <= 3 && distance > 0) {
          reason = 'similar_name'
          confidence = 1 - distance / maxLen
        }
      }

      if (reason) {
        seen.add(key)
        pairs.push({
          id: key,
          left: {
            cohort_id: a._cohort,
            entity_type: 'Lead',
            entity_id: a.id,
            display: a.business_name,
            email: a.email,
            phone: a.phone,
          },
          right: {
            cohort_id: b._cohort,
            entity_type: 'Lead',
            entity_id: b.id,
            display: b.business_name,
            email: b.email,
            phone: b.phone,
          },
          reason,
          confidence,
        })
      }
    }
  }

  return pairs.sort((a, b) => b.confidence - a.confidence)
}
