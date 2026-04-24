import crypto from 'crypto'
import type { InboundEmail } from './types'

interface PostmarkHeader {
  Name: string
  Value: string
}

interface PostmarkFromFull {
  Email?: string
  Name?: string
}

interface PostmarkToFull {
  Email?: string
  Name?: string
}

interface PostmarkInboundBody {
  MessageID?: string
  From?: string
  FromFull?: PostmarkFromFull
  To?: string
  ToFull?: PostmarkToFull[]
  Subject?: string
  TextBody?: string
  HtmlBody?: string
  Date?: string
  Headers?: PostmarkHeader[]
}

export function parsePostmarkWebhook(body: unknown): InboundEmail {
  const b = body as PostmarkInboundBody

  const inReplyTo = b.Headers?.find(h => h.Name.toLowerCase() === 'in-reply-to')?.Value
  const referencesRaw = b.Headers?.find(h => h.Name.toLowerCase() === 'references')?.Value
  const references = referencesRaw
    ? referencesRaw.split(/\s+/).map(s => s.trim()).filter(Boolean)
    : undefined

  return {
    message_id: b.MessageID ?? crypto.randomUUID(),
    in_reply_to: inReplyTo,
    references,
    from_email: b.FromFull?.Email ?? b.From ?? '',
    from_name: b.FromFull?.Name,
    to_email: b.ToFull?.[0]?.Email ?? b.To ?? '',
    subject: b.Subject ?? '(no subject)',
    body_text: b.TextBody ?? '',
    body_html: b.HtmlBody,
    received_at: b.Date ?? new Date().toISOString(),
    provider: 'postmark',
    provider_raw_id: b.MessageID,
  }
}

/**
 * Postmark Inbound webhooks support HMAC-SHA256 signing via the
 * X-Postmark-Signature header. Signature is base64(hmac_sha256(secret, rawBody)).
 * Returns true when secret is unset (allow-unsigned dev mode) OR when signatures match.
 */
export function validatePostmarkSignature(
  body: string,
  signature: string | null,
  secret: string
): boolean {
  if (!secret) return true
  if (!signature) return false

  const expected = crypto.createHmac('sha256', secret).update(body).digest('base64')

  const a = Buffer.from(expected)
  const b = Buffer.from(signature)
  if (a.length !== b.length) return false
  return crypto.timingSafeEqual(a, b)
}
