import type { InboundEmail, ThreadMatch } from './types'
import {
  qdrantFetchEmailSendByMessageId,
  qdrantSearchEmailSendsBySubject,
} from './qdrant-helpers'

function stripAngleBrackets(id: string): string {
  return id.replace(/^</, '').replace(/>$/, '').trim()
}

export async function matchReplyToThread(inbound: InboundEmail): Promise<ThreadMatch> {
  // Priority 1: In-Reply-To → exact match against stored provider_message_id
  if (inbound.in_reply_to) {
    const send = await qdrantFetchEmailSendByMessageId(stripAngleBrackets(inbound.in_reply_to))
    if (send) {
      return {
        matched: true,
        confidence: 'high',
        cohort_id: send.cohort_id,
        lead_id: send.lead_id,
        original_send_id: send.id,
        reason: `In-Reply-To header matched send ${send.id}`,
      }
    }
  }

  // Priority 2: References chain — walk back looking for any of our sends
  if (inbound.references?.length) {
    for (const refId of inbound.references) {
      const send = await qdrantFetchEmailSendByMessageId(stripAngleBrackets(refId))
      if (send) {
        return {
          matched: true,
          confidence: 'medium',
          cohort_id: send.cohort_id,
          lead_id: send.lead_id,
          original_send_id: send.id,
          reason: `References chain matched send ${send.id}`,
        }
      }
    }
  }

  // Priority 3: Subject fallback — strip Re:/Fwd: and match a send with same to_email
  const cleanSubject = inbound.subject.replace(/^(Re:|Fwd:|RE:|FW:)\s*/i, '').trim()
  if (cleanSubject) {
    const candidates = await qdrantSearchEmailSendsBySubject(cleanSubject, inbound.from_email)
    if (candidates.length === 1) {
      const send = candidates[0]
      return {
        matched: true,
        confidence: 'low',
        cohort_id: send.cohort_id,
        lead_id: send.lead_id,
        original_send_id: send.id,
        reason: `Subject match with single candidate (${send.id})`,
      }
    }
    if (candidates.length > 1) {
      // Ambiguous — take the most recent, mark low confidence
      const recent = candidates.sort(
        (a, b) => new Date(b.sent_at).getTime() - new Date(a.sent_at).getTime()
      )[0]
      return {
        matched: true,
        confidence: 'low',
        cohort_id: recent.cohort_id,
        lead_id: recent.lead_id,
        original_send_id: recent.id,
        reason: `Ambiguous subject match — ${candidates.length} candidates, used most recent`,
      }
    }
  }

  return {
    matched: false,
    confidence: 'low',
    reason: `No thread match. From: ${inbound.from_email}, Subject: ${inbound.subject}`,
  }
}
