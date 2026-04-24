import type { SequenceEnrollment } from './types'
import { getTemplate } from './templates'
import { computeDueDate, markEnrollmentCompleted, haltEnrollment } from './enrollment'
import { shouldHaltEnrollment } from './halt-checker'
import { draftStepBody } from './drafter'
import {
  qdrantFetchDueEnrollments,
  qdrantFetchExecutionsForEnrollment,
  qdrantUpdateEnrollment,
  qdrantWriteExecution,
} from './qdrant-store'
import { sendEmail } from '../email/send'
import { espoFetchLeads } from '../espocrm'
import type { Cohort } from '@/app/colony/lib/types'

export interface TickStats {
  scanned: number
  halted: number
  sent: number
  errored: number
  completed: number
}

export async function tickScheduler(): Promise<TickStats> {
  const stats: TickStats = { scanned: 0, halted: 0, sent: 0, errored: 0, completed: 0 }

  const due = await qdrantFetchDueEnrollments(200)

  for (const enrollment of due) {
    stats.scanned++

    const decision = await shouldHaltEnrollment(enrollment)
    if (decision.halt) {
      await haltEnrollment(enrollment.id, decision.reason ?? 'manual')
      stats.halted++
      continue
    }

    try {
      const advanced = await executeStep(enrollment)
      if (advanced === 'completed') stats.completed++
      else if (advanced === 'sent') stats.sent++
    } catch (err) {
      stats.errored++
      console.error(`[sequences] executeStep failed for ${enrollment.id}:`, err instanceof Error ? err.message : err)
    }
  }

  return stats
}

type ExecuteResult = 'sent' | 'completed' | 'error'

async function executeStep(enrollment: SequenceEnrollment): Promise<ExecuteResult> {
  const template = await getTemplate(enrollment.cohort_id, enrollment.template_id)
  if (!template) throw new Error('Template missing')

  const nextStepIndex = enrollment.current_step + 1
  const step = template.steps[nextStepIndex]
  if (!step) {
    await markEnrollmentCompleted(enrollment.id)
    return 'completed'
  }

  // Look up the lead
  const leads = await espoFetchLeads(enrollment.cohort_id as Cohort, { limit: 500 })
  const lead = leads.find(l => l.id === enrollment.lead_id)
  if (!lead) throw new Error(`Lead ${enrollment.lead_id} not found in cohort ${enrollment.cohort_id}`)

  const previousExecs = await qdrantFetchExecutionsForEnrollment(enrollment.id)
  const previousEmails = previousExecs.map(e => `step ${e.step_index} @ ${e.sent_at}`)

  const { subject, body } = await draftStepBody({
    template,
    step,
    lead,
    previousEmails,
  })

  const result = await sendEmail({
    cohortId: enrollment.cohort_id,
    leadId: enrollment.lead_id,
    toEmail: lead.email,
    subject,
    bodyText: body,
    draftSource: 'follow_up',
    generatedBy: step.body_generator === 'bob' ? 'bob' : undefined,
  })

  if (!result.success) throw new Error(result.error ?? 'Send failed')

  // Advance enrollment
  const nextNextStep = template.steps[nextStepIndex + 1]
  const nextDueAt = nextNextStep
    ? computeDueDate(new Date(), nextNextStep.delay_from_previous).toISOString()
    : undefined
  const finishing = !nextNextStep

  await qdrantUpdateEnrollment(enrollment.id, {
    current_step: nextStepIndex,
    next_send_due_at: nextDueAt,
    status: finishing ? 'completed' : 'active',
    completed_at: finishing ? new Date().toISOString() : undefined,
  })

  await qdrantWriteExecution({
    enrollment_id: enrollment.id,
    step_index: nextStepIndex,
    sent_at: new Date().toISOString(),
    send_id: result.providerMessageId ?? '',
    success: true,
  })

  return finishing ? 'completed' : 'sent'
}
