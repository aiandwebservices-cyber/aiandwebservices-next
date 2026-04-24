import { ImapFlow } from 'imapflow'
import { simpleParser } from 'mailparser'
import type { InboundEmail } from './types'
import { ingestInboundReply } from './ingest'

/**
 * Optional IMAP fallback poller. Only runs when COLONY_EMAIL_INBOUND=imap.
 * Polls the INBOX for UNSEEN messages, parses each, hands off to ingestInboundReply.
 *
 * Note: mailparser is a transitive dep of imapflow so it's available without extra install.
 * If it's ever missing, we still want the build to pass — the dynamic require is inside
 * the try/catch path and guarded by the env flag.
 */
export async function pollImapOnce(): Promise<{
  ok: boolean
  processed: number
  errors: string[]
}> {
  const host = process.env.IMAP_HOST
  const user = process.env.IMAP_USER
  const pass = process.env.IMAP_PASS
  const port = parseInt(process.env.IMAP_PORT ?? '993', 10)

  if (!host || !user || !pass) {
    return { ok: false, processed: 0, errors: ['IMAP_HOST/IMAP_USER/IMAP_PASS not set'] }
  }

  const client = new ImapFlow({
    host,
    port,
    secure: true,
    auth: { user, pass },
    logger: false,
  })

  const errors: string[] = []
  let processed = 0

  try {
    await client.connect()
    const lock = await client.getMailboxLock('INBOX')
    try {
      const unseen = await client.search({ seen: false })
      for (const seq of (Array.isArray(unseen) ? unseen : [])) {
        try {
          const { content } = await client.download(String(seq))
          if (!content) continue
          const parsed = await simpleParser(content)

          const inbound: InboundEmail = {
            message_id: parsed.messageId ?? `imap-${seq}-${Date.now()}`,
            in_reply_to: typeof parsed.inReplyTo === 'string' ? parsed.inReplyTo : undefined,
            references: Array.isArray(parsed.references)
              ? parsed.references
              : typeof parsed.references === 'string'
              ? [parsed.references]
              : undefined,
            from_email: parsed.from?.value?.[0]?.address ?? '',
            from_name: parsed.from?.value?.[0]?.name,
            to_email:
              Array.isArray(parsed.to)
                ? parsed.to[0]?.value?.[0]?.address ?? ''
                : parsed.to?.value?.[0]?.address ?? '',
            subject: parsed.subject ?? '(no subject)',
            body_text: parsed.text ?? '',
            body_html: typeof parsed.html === 'string' ? parsed.html : undefined,
            received_at: (parsed.date ?? new Date()).toISOString(),
            provider: 'imap',
            provider_raw_id: String(seq),
          }

          const result = await ingestInboundReply(inbound)
          if (!result.success && result.error) errors.push(result.error)
          processed++

          // Mark seen so we don't re-process
          await client.messageFlagsAdd(String(seq), ['\\Seen'])
        } catch (err) {
          errors.push(err instanceof Error ? err.message : String(err))
        }
      }
    } finally {
      lock.release()
    }
    await client.logout()
    return { ok: true, processed, errors }
  } catch (err) {
    return {
      ok: false,
      processed,
      errors: [...errors, err instanceof Error ? err.message : 'IMAP connection failed'],
    }
  }
}
