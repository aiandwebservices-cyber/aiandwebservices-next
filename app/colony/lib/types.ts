export type Cohort = 'aiandwebservices'

export type Temperature = 'HOT' | 'WARM' | 'COOL' | 'COLD'

export type DealStage = 'Lead' | 'Audit Scheduled' | 'Audit Complete' | 'Proposal Sent' | 'Proposal Signed' | 'Active' | 'Churned'

export type FeedEventType = 'bot_run' | 'lead_new' | 'lead_hot' | 'pipeline_move' | 'revenue' | 'bill_nye_finding' | 'coach_alert' | 'reply_received' | 'reply_interested'

export interface FeedEvent {
  id: string
  cohort_id: Cohort
  timestamp: string
  type: FeedEventType
  title: string
  subtitle: string
  icon: string
  drill_target?: { type: 'lead' | 'bot' | 'deal' | 'report'; id: string }
}

export interface Lead {
  id: string
  cohort_id: Cohort
  business_name: string
  first_name?: string
  last_name?: string
  email: string
  phone?: string
  website?: string
  niche: string
  city: string
  state: string
  temperature: Temperature
  deal_tier: number
  utm_source?: string
  source: 'master_pipeline' | 'fresh_business' | 'website' | 'manual'
  created_at: string
  last_activity_at?: string
}

export interface Deal {
  id: string
  cohort_id: Cohort
  lead_id: string
  business_name: string
  amount: number
  stage: DealStage
  probability: number
  days_in_stage: number
  created_at: string
  last_activity_at?: string
}

export interface Bot {
  id: string
  cohort_id: Cohort
  name: string
  role: string
  avatar_emoji: string
  last_run_at: string
  last_output_summary: string
  decisions_this_week: number
}

export interface BillNyeReport {
  id: string
  cohort_id: Cohort
  generated_at: string
  title: string
  top_findings: string[]
  html_content: string
}
