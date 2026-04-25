import { NextRequest, NextResponse } from 'next/server'
import { createHmac, timingSafeEqual } from 'crypto'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

const RESEND_WEBHOOK_SECRET = process.env.RESEND_WEBHOOK_SECRET || ''
const ESPOCRM_URL = (process.env.ESPOCRM_URL || 'http://localhost:8080').replace(/\/$/, '')
const ESPOCRM_API_KEY = process.env.COLONY_ESPOCRM_API_KEY || process.env.ESPOCRM_API_KEY || ''
const PYTHON_BIN = process.env.AGENTS_PYTHON_BIN || '/home/lina/ai_agents/master_pipeline/.venv/bin/python'
const AGENTS_ROOT = process.env.AGENTS_ROOT || '/home/lina/ai_agents'

interface ResendInboundPayload {
  type: string
  data: {
    message_id: string
    in_reply_to?: string | null
    from: { email: string; name?: string }
    to: Array<{ email: string }>
    subject: string
    text?: string
    html?: string
    received_at: string
  }
}

interface ClassifyResult {
  classification: string
  confidence: number
  reasoning: string
  extracted_data?: Record<string, unknown>
  suggested_reply_draft?: string | null
}

function verifyResendSignature(rawBody: string, signature: string): boolean {
  if (!RESEND_WEBHOOK_SECRET) {
    console.warn('[replies/inbound] RESEND_WEBHOOK_SECRET not set — skipping sig verification')
    return true
  }
  const expected = createHmac('sha256', RESEND_WEBHOOK_SECRET).update(rawBody).digest('hex')
  try {
    return timingSafeEqual(Buffer.from(expected, 'hex'), Buffer.from(signature.replace('sha256=', ''), 'hex'))
  } catch {
    return false
  }
}

async function classifyAndSave(args: {
  resend_message_id: string
  original_email_id: string | null
  lead_id: string | null
  from_address: string
  subject: string
  body: string
  received_at: string
}): Promise<{ classification: string; confidence: number; reasoning: string; point_id: string | null }> {
  const script = `
import sys, json, os
sys.path.insert(0, '${AGENTS_ROOT}')
args = json.loads(os.environ['COLONY_REPLY_DATA'])

from shared.reply_classifier import classify_reply
from shared.qdrant_memory import save_email_reply

cls = classify_reply(
    reply_body=args['body'],
    reply_subject=args['subject'],
    sender_email=args['from_address'],
)

classification = cls.get('bucket', 'OTHER')
confidence = float(cls.get('confidence', 0.5))
reasoning = cls.get('reasoning', '')

pid = save_email_reply(
    resend_message_id=args['resend_message_id'],
    original_email_id=args.get('original_email_id'),
    lead_id=args.get('lead_id'),
    from_address=args['from_address'],
    subject=args['subject'],
    body=args['body'],
    classification=classification,
    classification_confidence=confidence,
    classification_reasoning=reasoning,
    received_at=args['received_at'],
)

print(json.dumps({
    'classification': classification,
    'confidence': confidence,
    'reasoning': reasoning,
    'point_id': pid,
    'suggested_reply_draft': cls.get('suggested_reply_draft'),
}))
`

  try {
    const { stdout } = await execAsync(
      `${PYTHON_BIN} -c ${JSON.stringify(script)}`,
      { timeout: 45000, env: { ...process.env, COLONY_REPLY_DATA: JSON.stringify(args) } }
    )
    const stdoutStr = typeof stdout === 'string' ? stdout : (stdout as Buffer).toString()
    const lastLine = stdoutStr.trim().split('\n').pop() || '{}'
    const parsed = JSON.parse(lastLine)
    return {
      classification: parsed.classification || 'OTHER',
      confidence: parsed.confidence || 0.5,
      reasoning: parsed.reasoning || '',
      point_id: parsed.point_id || null,
    }
  } catch (e) {
    console.error('[replies/inbound] classify+save subprocess failed:', e)
    return { classification: 'OTHER', confidence: 0, reasoning: `subprocess failed: ${(e as Error).message}`, point_id: null }
  }
}

async function findEspocrmLeadByEmail(email: string): Promise<string | null> {
  if (!ESPOCRM_API_KEY) return null
  try {
    const url = new URL(`${ESPOCRM_URL}/api/v1/Lead`)
    url.searchParams.set('where[0][type]', 'equals')
    url.searchParams.set('where[0][attribute]', 'emailAddress')
    url.searchParams.set('where[0][value]', email)
    url.searchParams.set('select', 'id,firstName,lastName,accountName')
    url.searchParams.set('maxSize', '1')
    const resp = await fetch(url.toString(), { headers: { 'X-Api-Key': ESPOCRM_API_KEY } })
    if (!resp.ok) return null
    const data = await resp.json()
    return (data.list?.[0]?.id as string) || null
  } catch (e) {
    console.error('[replies/inbound] EspoCRM lookup failed:', e)
    return null
  }
}

async function addEspocrmNote(leadId: string, classification: string, body: string, fromAddress: string): Promise<boolean> {
  if (!ESPOCRM_API_KEY) return false
  try {
    const noteBody = `**Reply received from ${fromAddress}**\n\nClassification: **${classification}**\n\n---\n\n${body.slice(0, 2000)}`
    const resp = await fetch(`${ESPOCRM_URL}/api/v1/Note`, {
      method: 'POST',
      headers: { 'X-Api-Key': ESPOCRM_API_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'Post', post: noteBody, parentType: 'Lead', parentId: leadId }),
    })
    return resp.ok
  } catch (e) {
    console.error('[replies/inbound] EspoCRM note failed:', e)
    return false
  }
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text()

    // Signature check — Resend uses svix-style header or resend-signature
    const signature =
      req.headers.get('resend-signature') ||
      req.headers.get('svix-signature') ||
      req.headers.get('x-resend-signature') ||
      ''

    if (!verifyResendSignature(rawBody, signature)) {
      console.warn('[replies/inbound] signature verification failed')
      return NextResponse.json({ error: 'invalid signature' }, { status: 401 })
    }

    const payload: ResendInboundPayload = JSON.parse(rawBody)

    if (payload.type !== 'email.inbound' && payload.type !== 'inbound') {
      return NextResponse.json({ ok: true, skipped: 'non-inbound event type' })
    }

    const { data } = payload
    const fromEmail = data.from.email.toLowerCase()
    const replyText = data.text || ''

    // Find matching EspoCRM lead (parallel with classify so we don't block)
    const [leadId, classifyResult] = await Promise.all([
      findEspocrmLeadByEmail(fromEmail),
      classifyAndSave({
        resend_message_id: data.message_id,
        original_email_id: data.in_reply_to || null,
        lead_id: null,  // filled in below after lookup
        from_address: fromEmail,
        subject: data.subject,
        body: replyText,
        received_at: data.received_at,
      }),
    ])

    if (!leadId) {
      console.warn(`[replies/inbound] no matching EspoCRM Lead for ${fromEmail}`)
    }

    // Add EspoCRM note (best-effort)
    let espoOk = false
    if (leadId) {
      espoOk = await addEspocrmNote(leadId, classifyResult.classification, replyText, fromEmail)
    }

    console.log(`[replies/inbound] ${fromEmail} → ${classifyResult.classification} (${classifyResult.confidence}) lead=${leadId} qdrant=${!!classifyResult.point_id}`)

    return NextResponse.json({
      ok: true,
      classification: classifyResult.classification,
      confidence: classifyResult.confidence,
      lead_id: leadId,
      qdrant_saved: !!classifyResult.point_id,
      espocrm_note_added: espoOk,
    })
  } catch (e) {
    // Always 200 — prevent Resend retry loops
    console.error('[replies/inbound] handler error:', e)
    return NextResponse.json({ ok: false, error: (e as Error).message }, { status: 200 })
  }
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    endpoint: 'colony_email_replies_inbound',
    version: '1.0',
  })
}
