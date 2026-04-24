// Colony Phase 2 Contract — READ-ONLY during Phase 2
// All fetchers, API routes, and client calls must conform to these types.

import type {
  Cohort,
  FeedEvent,
  Lead,
  Deal,
  Bot,
  BillNyeReport,
  Temperature,
  DealStage,
} from '@/app/colony/lib/types'

// === Data payload types (mirror the existing types from app/colony/lib/types.ts) ===
export type FeedEventPayload = FeedEvent
export type LeadPayload = Lead
export type DealPayload = Deal
export type BotPayload = Bot
export type ReportPayload = BillNyeReport

// === Standard API response envelope ===
export type APIStatus = 'ok' | 'stale' | 'degraded' | 'unauthorized'

export interface APIResponse<T> {
  status: APIStatus
  data: T | null
  cached_at?: string      // ISO timestamp when this payload was fetched
  last_success?: string   // ISO timestamp of last successful fetch (for stale/degraded)
  error?: string          // human-readable error for degraded responses
}

// === Query parameter types ===
export interface LeadsQuery {
  temperature?: Temperature | 'ALL' | 'UNCONTACTED' | 'AGING'
  niche?: string
  source?: 'master_pipeline' | 'fresh_business' | 'website' | 'manual'
  dateRange?: 'today' | 'week' | 'month' | 'all'
  limit?: number
  cursor?: string
}

export interface DealsQuery {
  stage?: DealStage | 'ALL'
  limit?: number
}

export interface FeedQuery {
  since?: string  // ISO timestamp — only events after this
  limit?: number
}

export interface ReportsQuery {
  limit?: number
  type?: 'bill_nye_weekly' | 'coach_proposal' | 'retrospective' | 'ALL'
}

// === Fetcher signatures — Stream X implements these ===
export interface ColonyFetchers {
  fetchLeads(cohortId: Cohort, query?: LeadsQuery): Promise<LeadPayload[]>
  fetchDeals(cohortId: Cohort, query?: DealsQuery): Promise<DealPayload[]>
  fetchReports(cohortId: Cohort, query?: ReportsQuery): Promise<ReportPayload[]>
  fetchFeed(cohortId: Cohort, query?: FeedQuery): Promise<FeedEventPayload[]>
  fetchMetrics(cohortId: Cohort, query?: MetricsQuery): Promise<MetricsPayload>
  fetchBots(cohortId: Cohort, query?: BotsQuery): Promise<BotPayload[]>
  updateDealStage(cohortId: Cohort, dealId: string, newStage: DealStage): Promise<boolean>
}

// === Fetcher error types ===
export class ColonyFetchError extends Error {
  constructor(
    public source: 'espocrm' | 'qdrant' | 'cache' | 'unknown',
    public statusCode: number | null,
    message: string
  ) {
    super(message)
    this.name = 'ColonyFetchError'
  }
}

// === API endpoint contract — Stream Y must expose these ===
// GET /api/colony/feed      → APIResponse<FeedEventPayload[]>
// GET /api/colony/leads     → APIResponse<LeadPayload[]>    (accepts LeadsQuery as search params)
// GET /api/colony/deals     → APIResponse<DealPayload[]>    (accepts DealsQuery)
// GET /api/colony/reports   → APIResponse<ReportPayload[]>  (accepts ReportsQuery)
//
// All routes:
//  - Read cohort_id from Clerk session (never from query params)
//  - Return 401 with { status: 'unauthorized' } if no auth
//  - Return 500 with { status: 'degraded', error } if fetcher throws
//  - Cache successful responses for 60s
//  - Cohort 'demo' short-circuits to mock-data, never hits real EspoCRM/Qdrant

// === Cache key convention ===
// cache key format: `colony:${cohortId}:${resource}:${queryHash}`
// TTL: 60 seconds for metrics/lists, 5 seconds for single-record lookups

// === Demo cohort handling ===
// When cohortId === 'demo', ALL fetchers should short-circuit to mock-data helpers
// from app/colony/lib/mock-data.ts — never call real external APIs.
// This ensures sales demos are always fast, reliable, and cohort-isolated.

// === Phase 4: Metrics payload types ===

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

export interface MetricsQuery {
  // Future: date range params
}

// === Phase 9: Bot runs ===

export interface BotRunPayload {
  bot_id: string
  bot_name: string
  bot_role: string
  avatar_emoji: string
  cohort_id: Cohort
  summary: string
  decisions_count: number
  ran_at: string
  run_duration_seconds?: number
}

export interface BotsQuery {
  since?: string
  limit?: number
}

// === Phase 10: Deal stage write-back ===

export interface DealStageUpdateRequest {
  stage: DealStage
}

export interface DealStageUpdateResponse {
  id: string
  stage: DealStage
}

// === Phase 16: Analytics payload types ===

export interface FunnelStage {
  name: string
  count: number
  conversion_from_previous: number | null
}

export interface FunnelPayload {
  stages: FunnelStage[]
  total_leads: number
  period: 'all_time' | 'last_30d' | 'last_90d'
}

export interface VelocityPayload {
  avg_hours_lead_to_first_touch: number | null
  avg_hours_first_touch_to_reply: number | null
  avg_days_reply_to_audit: number | null
  avg_days_audit_to_signed: number | null
  avg_days_lead_to_active: number | null
  p90_days_lead_to_active: number | null
}

export interface SourcePerformanceRow {
  source: string
  leads_count: number
  outreach_rate: number
  reply_rate: number
  interested_rate: number
  conversion_rate: number
  avg_deal_value: number
}

export interface SourcesPayload {
  rows: SourcePerformanceRow[]
}

export interface NichePerformanceRow {
  niche: string
  leads_count: number
  outreach_rate: number
  reply_rate: number
  interested_rate: number
  conversion_rate: number
  avg_deal_value: number
}

export interface NichesPayload {
  rows: NichePerformanceRow[]
}

export interface BotPerformanceRow {
  bot_name: string
  total_runs: number
  total_decisions: number
  avg_decisions_per_run: number
  weekly_decisions: number[]
  trend: 'up' | 'down' | 'stable'
}

export interface BotsAnalyticsPayload {
  rows: BotPerformanceRow[]
}

// === Phase 11: Admin onboarding types ===
// New customer cohort IDs (e.g. "cust_cgfd_001") are not in the Cohort union.
// Admin operations use `string` for cohortId to allow dynamic provisioning.

export type AdminOnboardingInput = import('./onboarding').OnboardingInput
export type AdminOnboardingPreview = import('./onboarding').OnboardingPreview
export type AdminOnboardingResult = import('./onboarding').OnboardingResult
export type AdminAuditEntry = import('./onboarding-writers').AuditEntry

// === Phase 13: Email sending ===

export interface EmailSendAPIRequest {
  leadId: string
  toEmail: string
  subject: string
  bodyText: string
  bodyHTML?: string
  draftSource?: 'bob_generated' | 'manual' | 'follow_up'
  generatedBy?: string
}

export interface EmailSendAPIResponse {
  success: boolean
  demo?: boolean
  providerMessageId?: string
  sentAt?: string
  error?: string
}

// === Phase 15: Follow-up sequences ===

export type SequenceTemplatePayload = import('./sequences/types').SequenceTemplate
export type SequenceEnrollmentPayload = import('./sequences/types').SequenceEnrollment
export type SequenceExecutionPayload = import('./sequences/types').SequenceExecution
export type SequenceStepPayload = import('./sequences/types').SequenceStep
export type SequenceHaltReason = import('./sequences/types').HaltReason

// === Phase 14: Reply tracking ===

export type ReplyClassification = import('./email/inbound/types').ReplyClassification
export type ReplyRecord = import('./email/inbound/types').ReplyRecord
export type InboundEmail = import('./email/inbound/types').InboundEmail
export type ThreadMatch = import('./email/inbound/types').ThreadMatch

export interface RepliesQuery {
  lead_id?: string
  since?: string
  limit?: number
}
