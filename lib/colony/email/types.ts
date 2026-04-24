export interface EmailSendRequest {
  cohortId: string
  leadId: string
  toEmail: string
  subject: string
  bodyText: string
  bodyHTML?: string
  draftSource: 'bob_generated' | 'manual' | 'follow_up'
  generatedBy?: string
}

export interface EmailSendResult {
  success: boolean
  providerMessageId?: string
  error?: string
  sentAt: string
  unsubscribeToken: string
}

export interface EmailSendRecord {
  id: string
  cohort_id: string
  lead_id: string
  to_email: string
  from_email: string
  subject: string
  body_text: string
  body_html: string
  provider: 'resend' | 'ses'
  provider_message_id: string
  sent_at: string
  status: 'sent' | 'delivered' | 'bounced' | 'complained' | 'unsubscribed'
  status_updated_at: string
  draft_source: string
  generated_by?: string
  unsubscribe_token: string
}
