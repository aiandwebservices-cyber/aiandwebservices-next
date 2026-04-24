import type { InboundEmail, ReplyRecord } from './types'
import { matchReplyToThread } from './thread-matcher'
import { classifyReply } from './classifier'
import { qdrantWriteReplyRecord } from './qdrant-helpers'
import {
  espoWriteReplyActivity,
  espoUpdateLeadTemperature,
  markLeadUnsubscribed,
} from './espocrm-helpers'
import { emitReplyFeedEvent } from './feed-emitter'

export interface IngestResult {
  success: boolean
  record_id?: string
  match_confidence?: 'high' | 'medium' | 'low'
  matched?: boolean
  classification?: string
  error?: string
}

export async function ingestInboundReply(inbound: InboundEmail): Promise<IngestResult> {
  try {
    const match = await matchReplyToThread(inbound)

    const classification = await classifyReply({
      from_email: inbound.from_email,
      subject: inbound.subject,
      body_text: inbound.body_text,
    })

    const record: Omit<ReplyRecord, 'id'> = {
      cohort_id: match.cohort_id ?? 'orphan',
      lead_id: match.lead_id ?? 'orphan',
      original_send_id: match.original_send_id,
      message_id: inbound.message_id,
      in_reply_to: inbound.in_reply_to,
      from_email: inbound.from_email,
      subject: inbound.subject,
      body_text: inbound.body_text,
      body_html: inbound.body_html,
      received_at: inbound.received_at,
      classification: classification.classification,
      classification_confidence: classification.confidence,
      classification_reasoning: classification.reasoning,
      requires_action: ['INTERESTED', 'QUESTION', 'UNSUBSCRIBE'].includes(
        classification.classification
      ),
      status: 'new',
    }

    const recordId = await qdrantWriteReplyRecord(record)

    // Side-effects only when matched to a real lead
    if (match.matched && match.lead_id && match.cohort_id) {
      espoWriteReplyActivity(match.cohort_id, match.lead_id, {
        subject: inbound.subject,
        body: inbound.body_text,
        classification: classification.classification,
        received_at: inbound.received_at,
      }).catch(err => console.error('[Colony Reply] EspoCRM activity write failed:', err))

      if (
        classification.classification === 'INTERESTED' &&
        classification.confidence > 0.75
      ) {
        espoUpdateLeadTemperature(match.cohort_id, match.lead_id, 'HOT').catch(err =>
          console.error('[Colony Reply] Temperature update failed:', err)
        )
      }

      if (classification.classification === 'UNSUBSCRIBE') {
        markLeadUnsubscribed(match.cohort_id, match.lead_id).catch(err =>
          console.error('[Colony Reply] Unsubscribe mark failed:', err)
        )
      }
    }

    await emitReplyFeedEvent({
      cohort_id: match.cohort_id ?? 'orphan',
      lead_id: match.lead_id ?? 'orphan',
      reply_id: recordId,
      classification: classification.classification,
      from_name: inbound.from_name ?? inbound.from_email,
      subject: inbound.subject,
      received_at: inbound.received_at,
    })

    return {
      success: true,
      record_id: recordId,
      match_confidence: match.confidence,
      matched: match.matched,
      classification: classification.classification,
    }
  } catch (err) {
    console.error('[Colony Reply] Ingest failed:', err)
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown ingest error',
    }
  }
}
