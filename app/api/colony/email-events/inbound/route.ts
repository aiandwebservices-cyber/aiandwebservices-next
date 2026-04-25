import { NextRequest, NextResponse } from 'next/server'
import { createHmac, timingSafeEqual } from 'crypto'
import { qdrantUpdateDeliveryStatus } from '@/lib/colony/qdrant'

const RESEND_WEBHOOK_SECRET = process.env.RESEND_WEBHOOK_SECRET || ''

interface ResendDeliveryEvent {
  type: string
  created_at: string
  data: {
    email_id?: string
    message_id?: string
    from?: string
    to?: string[]
    subject?: string
    bounce?: {
      type?: string
      message?: string
      sub_type?: string
    }
    complaint?: {
      type?: string
    }
    click?: {
      ipAddress?: string
      userAgent?: string
      link?: string
    }
    open?: {
      ipAddress?: string
      userAgent?: string
    }
  }
}

function verifyResendSignature(rawBody: string, signature: string): boolean {
  if (!RESEND_WEBHOOK_SECRET) {
    console.warn('[email-events/inbound] RESEND_WEBHOOK_SECRET not set — skipping verification (DEV ONLY)')
    return true
  }
  if (!signature) return false
  const expected = createHmac('sha256', RESEND_WEBHOOK_SECRET).update(rawBody).digest('hex')
  try {
    return timingSafeEqual(Buffer.from(expected), Buffer.from(signature))
  } catch {
    return false
  }
}

function mapEventToStatus(eventType: string): string {
  const map: Record<string, string> = {
    'email.delivered': 'delivered',
    'email.bounced': 'bounced',
    'email.complained': 'complained',
    'email.opened': 'opened',
    'email.clicked': 'clicked',
    'email.delivery_delayed': 'delayed',
    'email.failed': 'failed',
    'email.sent': 'sent',
  }
  return map[eventType] || eventType.replace('email.', '')
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text()
    const signature =
      req.headers.get('resend-signature') ||
      req.headers.get('svix-signature') ||
      req.headers.get('webhook-signature') ||
      ''

    if (!verifyResendSignature(rawBody, signature)) {
      console.warn('[email-events/inbound] signature verification failed')
      return NextResponse.json({ error: 'invalid signature' }, { status: 401 })
    }

    const event: ResendDeliveryEvent = JSON.parse(rawBody)
    const providerMessageId = event.data?.email_id || event.data?.message_id

    if (!providerMessageId) {
      return NextResponse.json({ ok: true, skipped: 'no message_id' })
    }

    if (!event.type?.startsWith('email.')) {
      return NextResponse.json({ ok: true, skipped: 'non-email event' })
    }

    const deliveryStatus = mapEventToStatus(event.type)
    const deliveryStatusAt = event.created_at || new Date().toISOString()

    const result = await qdrantUpdateDeliveryStatus({
      providerMessageId,
      deliveryStatus,
      deliveryStatusAt,
      bounceType: event.data.bounce?.type || event.data.bounce?.sub_type,
      bounceMessage: event.data.bounce?.message,
      complaintType: event.data.complaint?.type,
      clickLink: event.data.click?.link,
    })

    return NextResponse.json({
      ok: true,
      event_type: event.type,
      status: deliveryStatus,
      message_id: providerMessageId,
      qdrant_updated: result.ok,
    })
  } catch (e) {
    // Always return 200 to prevent Resend retry storms
    console.error('[email-events/inbound] handler error:', e)
    return NextResponse.json({ ok: false, error: (e as Error).message }, { status: 200 })
  }
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    endpoint: 'email_events_inbound',
    note: 'Resend delivery status webhook. POST email events here.',
  })
}
