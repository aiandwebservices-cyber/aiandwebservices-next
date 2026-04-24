import crypto from 'crypto'
import { getProvider } from './provider'
import { buildEmailBody } from './templates'
import {
  qdrantUpsertEmailSend,
  qdrantCountRecentSends,
  qdrantCheckUnsubscribed,
} from '../qdrant'
import { ColonyFetchError } from '../contracts'
import type { EmailSendRequest, EmailSendResult } from './types'

const SENDER = 'david@aiandwebservices.com'
const REPLY_TO = 'david@aiandwebservices.com'
const RATE_LIMIT = 50
const RATE_WINDOW_MS = 60 * 60 * 1000 // 1 hour

export async function sendEmail(req: EmailSendRequest): Promise<EmailSendResult> {
  const blank: EmailSendResult = { success: false, sentAt: new Date().toISOString(), unsubscribeToken: '' }

  // 1. Rate limit: max 50 sends per cohort per hour
  try {
    const count = await qdrantCountRecentSends(req.cohortId, RATE_WINDOW_MS)
    if (count >= RATE_LIMIT) {
      return { ...blank, error: 'Rate limit exceeded (50/hour per cohort)' }
    }
  } catch (err) {
    if (!(err instanceof ColonyFetchError)) throw err
    // If Qdrant is down, allow the send (fail open on rate limit) but log
    console.warn('[Colony Email] Rate limit check failed (Qdrant unreachable):', err.message)
  }

  // 2. Check unsubscribe list
  try {
    const unsub = await qdrantCheckUnsubscribed(req.cohortId, req.leadId)
    if (unsub) {
      return { ...blank, error: 'Recipient has unsubscribed' }
    }
  } catch (err) {
    if (!(err instanceof ColonyFetchError)) throw err
    console.warn('[Colony Email] Unsubscribe check failed (Qdrant unreachable):', err.message)
  }

  // 3. Build email with unsubscribe footer
  const { html, text, unsubscribeToken } = buildEmailBody({
    bodyText: req.bodyText,
    bodyHTML: req.bodyHTML,
    leadId: req.leadId,
    cohortId: req.cohortId,
  })

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://aiandwebservices.com'
  const headers: Record<string, string> = {
    'List-Unsubscribe': `<${baseUrl}/unsubscribe?token=${unsubscribeToken}>`,
    'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
  }

  // 4. Send via provider
  try {
    const provider = getProvider()
    const { messageId } = await provider.send({
      from: SENDER,
      replyTo: REPLY_TO,
      to: req.toEmail,
      subject: req.subject,
      html,
      text,
      headers,
    })

    const sentAt = new Date().toISOString()
    const recordId = crypto.randomUUID()

    // 5. Record in Qdrant (non-blocking — don't fail the send if this errors)
    qdrantUpsertEmailSend({
      id: recordId,
      cohort_id: req.cohortId,
      lead_id: req.leadId,
      to_email: req.toEmail,
      from_email: SENDER,
      subject: req.subject,
      body_text: req.bodyText,
      body_html: html,
      provider: provider.name,
      provider_message_id: messageId,
      sent_at: sentAt,
      draft_source: req.draftSource,
      generated_by: req.generatedBy,
      unsubscribe_token: unsubscribeToken,
    }).catch(err => console.error('[Colony Email] Failed to record send in Qdrant:', err))

    // 6. Write activity to EspoCRM (non-blocking)
    writeEmailActivityToEspoCRM(req.leadId, req.subject)
      .catch(err => console.error('[Colony Email] Failed to write EspoCRM activity:', err))

    return { success: true, providerMessageId: messageId, sentAt, unsubscribeToken }
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown send error'
    console.error('[Colony Email] Send failed:', msg)
    return { ...blank, error: msg }
  }
}

async function writeEmailActivityToEspoCRM(leadId: string, subject: string): Promise<void> {
  const baseUrl = process.env.COLONY_ESPOCRM_URL?.replace(/\/$/, '')
  const apiKey = process.env.COLONY_ESPOCRM_API_KEY
  if (!baseUrl || !apiKey) return

  await fetch(`${baseUrl}/api/v1/Note`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Api-Key': apiKey,
    },
    body: JSON.stringify({
      parentType: 'Lead',
      parentId: leadId,
      post: `Email sent: ${subject}`,
      type: 'Post',
    }),
    signal: AbortSignal.timeout(5000),
  })
}
