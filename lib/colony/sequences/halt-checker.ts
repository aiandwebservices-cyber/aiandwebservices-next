import type { HaltReason, SequenceEnrollment } from './types'
import { qdrantFetchRepliesForLead } from './qdrant-store'
import { getTemplate } from './templates'
import { espoFetchLeads } from '../espocrm'
import { qdrantCheckUnsubscribed } from '../qdrant'
import type { Cohort } from '@/app/colony/lib/types'

export interface HaltDecision {
  halt: boolean
  reason?: HaltReason
}

export async function shouldHaltEnrollment(enrollment: SequenceEnrollment): Promise<HaltDecision> {
  // 1. Any real reply since enrollment?
  try {
    const replies = await qdrantFetchRepliesForLead(
      enrollment.cohort_id,
      enrollment.lead_id,
      { since: enrollment.enrolled_at }
    )
    if (replies.some(r => r.classification === 'UNSUBSCRIBE')) {
      return { halt: true, reason: 'unsubscribed' }
    }
    if (replies.some(r => r.classification !== 'AUTOMATED' && r.classification !== 'OOO')) {
      return { halt: true, reason: 'replied' }
    }
  } catch {
    // reply store absent — skip this check
  }

  // 2. Global unsubscribe flag (Phase 13)
  try {
    const unsub = await qdrantCheckUnsubscribed(enrollment.cohort_id, enrollment.lead_id)
    if (unsub) return { halt: true, reason: 'unsubscribed' }
  } catch {
    // skip
  }

  // 3. Lead status change (Churned / NOT_INTERESTED-ish)
  try {
    const leads = await espoFetchLeads(enrollment.cohort_id as Cohort, { limit: 500 })
    const lead = leads.find(l => l.id === enrollment.lead_id)
    if (lead) {
      const temp = String(lead.temperature ?? '').toUpperCase()
      if (temp === 'NOT_INTERESTED' || temp === 'CHURNED') {
        return { halt: true, reason: 'lead_status_change' }
      }
    }
  } catch {
    // skip
  }

  // 4. Template paused or missing
  const template = await getTemplate(enrollment.cohort_id, enrollment.template_id)
  if (!template || !template.active) return { halt: true, reason: 'template_paused' }

  return { halt: false }
}
