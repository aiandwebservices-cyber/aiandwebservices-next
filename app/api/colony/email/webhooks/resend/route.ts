import { Webhook } from 'svix'
import { qdrantUpdateEmailSendStatus } from '@/lib/colony/qdrant'

export async function POST(req: Request) {
  const secret = process.env.RESEND_WEBHOOK_SECRET
  if (!secret) {
    console.warn('[Colony Email Webhook] RESEND_WEBHOOK_SECRET not set — skipping verification')
  }

  const payload = await req.text()

  // Verify signature if secret is configured
  if (secret) {
    const headers = {
      'svix-id': req.headers.get('svix-id') ?? '',
      'svix-timestamp': req.headers.get('svix-timestamp') ?? '',
      'svix-signature': req.headers.get('svix-signature') ?? '',
    }
    try {
      const wh = new Webhook(secret)
      wh.verify(payload, headers)
    } catch {
      return Response.json({ error: 'Invalid webhook signature' }, { status: 401 })
    }
  }

  let event: Record<string, unknown>
  try {
    event = JSON.parse(payload) as Record<string, unknown>
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const type = event.type as string | undefined
  const data = event.data as Record<string, unknown> | undefined
  const messageId = data?.email_id as string | undefined

  if (!messageId) {
    return Response.json({ ok: true, skipped: true })
  }

  try {
    switch (type) {
      case 'email.delivered':
        await qdrantUpdateEmailSendStatus(messageId, 'delivered')
        break
      case 'email.bounced':
        await qdrantUpdateEmailSendStatus(messageId, 'bounced')
        break
      case 'email.complained':
        // Treat complaint as permanent unsubscribe
        await qdrantUpdateEmailSendStatus(messageId, 'complained')
        break
      case 'email.opened':
      case 'email.clicked':
        // Engagement tracking — no status change, just log
        console.info(`[Colony Email] ${type} for message ${messageId}`)
        break
      default:
        break
    }
  } catch (err) {
    console.error('[Colony Email Webhook] Failed to update status:', err)
    return Response.json({ error: 'Status update failed' }, { status: 500 })
  }

  return Response.json({ ok: true })
}
