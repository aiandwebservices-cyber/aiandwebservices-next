import type { ReplyClassification } from './types'

function espoConfig(): { baseUrl: string; apiKey: string } | null {
  const baseUrl = process.env.COLONY_ESPOCRM_URL?.replace(/\/$/, '')
  const apiKey = process.env.COLONY_ESPOCRM_API_KEY
  if (!baseUrl || !apiKey) return null
  return { baseUrl, apiKey }
}

export async function espoWriteReplyActivity(
  _cohortId: string,
  leadId: string,
  reply: {
    subject: string
    body: string
    classification: ReplyClassification
    received_at: string
  }
): Promise<void> {
  const cfg = espoConfig()
  if (!cfg) return

  const post = `Reply received [${reply.classification}] at ${reply.received_at}

Subject: ${reply.subject}

${reply.body.slice(0, 4000)}`

  await fetch(`${cfg.baseUrl}/api/v1/Note`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Api-Key': cfg.apiKey,
    },
    body: JSON.stringify({
      parentType: 'Lead',
      parentId: leadId,
      post,
      type: 'Post',
    }),
    signal: AbortSignal.timeout(5000),
  })
}

export async function espoUpdateLeadTemperature(
  _cohortId: string,
  leadId: string,
  temperature: 'HOT' | 'WARM' | 'COOL' | 'COLD'
): Promise<void> {
  const cfg = espoConfig()
  if (!cfg) return

  await fetch(`${cfg.baseUrl}/api/v1/Lead/${leadId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Api-Key': cfg.apiKey,
    },
    body: JSON.stringify({ cTemperature: temperature }),
    signal: AbortSignal.timeout(5000),
  })
}

export async function markLeadUnsubscribed(
  _cohortId: string,
  leadId: string
): Promise<void> {
  const cfg = espoConfig()
  if (!cfg) return

  await fetch(`${cfg.baseUrl}/api/v1/Lead/${leadId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Api-Key': cfg.apiKey,
    },
    body: JSON.stringify({ cUnsubscribed: true, cUnsubscribedAt: new Date().toISOString() }),
    signal: AbortSignal.timeout(5000),
  })
}
