import { parsePostmarkWebhook, validatePostmarkSignature } from '@/lib/colony/email/inbound/postmark'
import { ingestInboundReply } from '@/lib/colony/email/inbound/ingest'

export async function POST(req: Request) {
  const rawBody = await req.text()
  const signature = req.headers.get('X-Postmark-Signature')
  const secret = process.env.POSTMARK_WEBHOOK_SECRET ?? ''

  if (secret && !validatePostmarkSignature(rawBody, signature, secret)) {
    return Response.json({ error: 'Invalid signature' }, { status: 401 })
  }

  let body: unknown
  try {
    body = JSON.parse(rawBody)
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  try {
    const inbound = parsePostmarkWebhook(body)
    const result = await ingestInboundReply(inbound)
    return Response.json(result, { status: result.success ? 200 : 500 })
  } catch (err) {
    console.error('[Colony Reply] Postmark webhook failed:', err)
    return Response.json(
      { error: err instanceof Error ? err.message : 'Ingest error' },
      { status: 500 }
    )
  }
}
