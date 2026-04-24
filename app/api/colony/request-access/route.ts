import { NextRequest, NextResponse } from 'next/server'
import { appendFileSync, mkdirSync, existsSync } from 'fs'
import path from 'path'
import { PostHog } from 'posthog-node'

const HUBSPOT_TOKEN = process.env.HUBSPOT_TOKEN

type FormBody = {
  firstName: string
  lastName: string
  businessName: string
  businessWebsite?: string
  email: string
  phone?: string
  businessType?: string
  businessSize?: string
  monthlyMarketingSpend?: string
  challenge?: string
}

function phCapture(event: string, props?: Record<string, unknown>) {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY
  if (!key) return
  const ph = new PostHog(key, {
    host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://us.i.posthog.com',
  })
  ph.capture({ distinctId: 'colony-marketing-server', event, properties: props })
  void ph.flush()
}

function logFallback(data: Record<string, unknown>) {
  try {
    const logsDir = path.join(process.cwd(), 'logs')
    if (!existsSync(logsDir)) mkdirSync(logsDir, { recursive: true })
    const line = `${new Date().toISOString()} ${JSON.stringify(data)}\n`
    appendFileSync(path.join(logsDir, 'colony-requests.log'), line, 'utf8')
  } catch {
    // filesystem not writable in this environment
  }
}

async function createHubSpotContact(body: FormBody): Promise<string | null> {
  if (!HUBSPOT_TOKEN) return null

  const res = await fetch('https://api.hubapi.com/crm/v3/objects/contacts', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${HUBSPOT_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      properties: {
        firstname: body.firstName,
        lastname: body.lastName,
        email: body.email,
        company: body.businessName,
        website: body.businessWebsite ?? '',
        phone: body.phone ?? '',
        colony_business_type: body.businessType ?? '',
        colony_business_size: body.businessSize ?? '',
        colony_monthly_marketing_spend: body.monthlyMarketingSpend ?? '',
        colony_lead_gen_challenge: body.challenge ?? '',
        colony_requested_access: 'true',
      },
    }),
  })

  if (res.status === 409) {
    const text = await res.text().catch(() => '')
    const match = text.match(/"id"\s*:\s*"(\d+)"/)
    return match?.[1] ?? null
  }

  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText)
    throw new Error(`HubSpot ${res.status}: ${text}`)
  }

  const json = (await res.json()) as { id: string }
  return json.id
}

async function addHubSpotNote(contactId: string): Promise<void> {
  if (!HUBSPOT_TOKEN) return

  const date = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const noteRes = await fetch('https://api.hubapi.com/crm/v3/objects/notes', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${HUBSPOT_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      properties: {
        hs_note_body: `Requested Colony access on ${date}`,
        hs_timestamp: Date.now().toString(),
      },
      associations: [
        {
          to: { id: contactId },
          types: [{ associationCategory: 'HUBSPOT_DEFINED', associationTypeId: 202 }],
        },
      ],
    }),
  })

  if (!noteRes.ok) {
    console.warn('[Colony] HubSpot note creation failed:', noteRes.status)
  }
}

export async function POST(req: NextRequest) {
  let body: FormBody
  try {
    body = (await req.json()) as FormBody
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { firstName, lastName, businessName, email } = body
  if (!firstName?.trim() || !lastName?.trim() || !businessName?.trim() || !email?.trim()) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
  }

  let hubspotOk = false
  try {
    const contactId = await createHubSpotContact(body)
    if (contactId) {
      await addHubSpotNote(contactId)
      hubspotOk = true
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    logFallback({ ...body, error: msg, timestamp: new Date().toISOString() })
    phCapture('colony_request_failed', { stage: 'hubspot', error: msg })
  }

  if (!hubspotOk) {
    logFallback({ ...body, timestamp: new Date().toISOString() })
  }

  phCapture('colony_request_submitted', {
    businessType: body.businessType,
    businessSize: body.businessSize,
    hubspotOk,
  })

  return NextResponse.json({ ok: true })
}
