export type ReplyClassification =
  | 'INTERESTED'
  | 'NOT_INTERESTED'
  | 'QUESTION'
  | 'UNSUBSCRIBE'
  | 'AUTOMATED'
  | 'UNKNOWN'

export interface InboundEmail {
  message_id: string
  in_reply_to?: string
  references?: string[]
  from_email: string
  from_name?: string
  to_email: string
  subject: string
  body_text: string
  body_html?: string
  received_at: string
  provider: 'postmark' | 'imap' | 'sendgrid'
  provider_raw_id?: string
}

export interface ReplyRecord {
  id: string
  cohort_id: string
  lead_id: string
  original_send_id?: string
  message_id: string
  in_reply_to?: string
  from_email: string
  subject: string
  body_text: string
  body_html?: string
  received_at: string
  classification: ReplyClassification
  classification_confidence: number
  classification_reasoning: string
  requires_action: boolean
  status: 'new' | 'reviewed' | 'responded' | 'archived'
}

export interface ThreadMatch {
  matched: boolean
  confidence: 'high' | 'medium' | 'low'
  cohort_id?: string
  lead_id?: string
  original_send_id?: string
  reason: string
}
