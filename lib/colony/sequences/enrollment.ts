import type { HaltReason, SequenceEnrollment, SequenceStepDelay } from './types'
import { getTemplate } from './templates'
import {
  qdrantFetchEnrollmentsForLead,
  qdrantUpdateEnrollment,
  qdrantWriteEnrollment,
  qdrantGetEnrollment,
} from './qdrant-store'

export function computeDueDate(from: Date, delay: SequenceStepDelay): Date {
  const result = new Date(from)
  if ('days' in delay) result.setUTCDate(result.getUTCDate() + delay.days)
  if ('hours' in delay) result.setUTCHours(result.getUTCHours() + delay.hours)
  return result
}

export async function enrollLead(params: {
  cohortId: string
  leadId: string
  templateId: string
  originalSendId: string
  adminEmail: string
}): Promise<SequenceEnrollment> {
  // Don't double-enroll: if an active enrollment exists for this lead + template, return it.
  const existing = await qdrantFetchEnrollmentsForLead(params.cohortId, params.leadId)
  const active = existing.find(
    e => e.template_id === params.templateId && e.status === 'active'
  )
  if (active) return active

  const template = await getTemplate(params.cohortId, params.templateId)
  if (!template) throw new Error(`Template ${params.templateId} not found for cohort ${params.cohortId}`)

  const step1 = template.steps[1]
  const nextDue = step1 ? computeDueDate(new Date(), step1.delay_from_previous) : null

  const enrollment: Omit<SequenceEnrollment, 'id'> = {
    cohort_id: params.cohortId,
    lead_id: params.leadId,
    template_id: params.templateId,
    enrolled_at: new Date().toISOString(),
    enrolled_by: params.adminEmail,
    original_send_id: params.originalSendId,
    current_step: 0,
    next_send_due_at: nextDue?.toISOString(),
    status: step1 ? 'active' : 'completed',
    completed_at: step1 ? undefined : new Date().toISOString(),
  }

  const id = await qdrantWriteEnrollment(enrollment)
  return { ...enrollment, id }
}

export async function haltEnrollment(
  enrollmentId: string,
  reason: HaltReason,
  admin?: string
): Promise<boolean> {
  const existing = await qdrantGetEnrollment(enrollmentId)
  if (!existing || existing.status !== 'active') return false
  await qdrantUpdateEnrollment(enrollmentId, {
    status: 'halted',
    halt_reason: reason,
    halted_at: new Date().toISOString(),
    next_send_due_at: undefined,
  })
  if (admin) {
    // Lightweight audit — not using the formal writeAuditEntry to avoid tight coupling.
    console.log(`[sequences] Enrollment ${enrollmentId} halted by ${admin}: ${reason}`)
  }
  return true
}

export async function markEnrollmentCompleted(enrollmentId: string): Promise<void> {
  await qdrantUpdateEnrollment(enrollmentId, {
    status: 'completed',
    completed_at: new Date().toISOString(),
    next_send_due_at: undefined,
  })
}
