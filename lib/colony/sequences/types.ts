export type SequenceStepDelay = { days: number } | { hours: number }

export interface SequenceStep {
  step_index: number           // 0-based
  name: string
  delay_from_previous: SequenceStepDelay
  body_template?: string
  body_generator?: 'bob'
  subject_template: string
  halt_if_replied: boolean
}

export interface SequenceTemplate {
  id: string
  cohort_id: string
  name: string
  description: string
  steps: SequenceStep[]
  default_for_cohort: boolean
  active: boolean
}

export type HaltReason =
  | 'replied'
  | 'unsubscribed'
  | 'manual'
  | 'lead_status_change'
  | 'template_paused'

export interface SequenceEnrollment {
  id: string
  cohort_id: string
  lead_id: string
  template_id: string
  enrolled_at: string
  enrolled_by: string
  original_send_id: string
  current_step: number
  next_send_due_at?: string
  status: 'active' | 'halted' | 'completed'
  halt_reason?: HaltReason
  halted_at?: string
  completed_at?: string
}

export interface SequenceExecution {
  enrollment_id: string
  step_index: number
  sent_at: string
  send_id: string
  success: boolean
  error?: string
}

export interface EnrollmentWithTemplateName extends SequenceEnrollment {
  template_name: string
}
