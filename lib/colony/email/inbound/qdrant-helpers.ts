import crypto from 'crypto'
import { ColonyFetchError } from '../../contracts'
import type { ReplyRecord } from './types'
import type { EmailSendRecord } from '../types'

const TIMEOUT_MS = 5000
const EMAIL_SENDS = 'email_sends'
const EMAIL_REPLIES = 'email_replies'

function baseUrl(): string {
  const url = process.env.COLONY_QDRANT_URL
  if (!url) throw new ColonyFetchError('qdrant', null, 'COLONY_QDRANT_URL not set')
  return url.replace(/\/$/, '')
}

async function qdrantScroll<T>(
  collection: string,
  filter: Record<string, unknown>,
  limit = 50
): Promise<T[]> {
  const url = `${baseUrl()}/collections/${collection}/points/scroll`
  const body = JSON.stringify({ filter, limit, with_payload: true, with_vectors: false })

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      signal: AbortSignal.timeout(TIMEOUT_MS),
    })

    if (res.status === 404) return []
    if (!res.ok) {
      const text = await res.text().catch(() => res.statusText)
      throw new ColonyFetchError('qdrant', res.status, `Qdrant ${res.status}: ${text}`)
    }

    const json = await res.json() as { result?: { points?: Array<{ payload?: T }> } }
    return (json.result?.points ?? [])
      .map(p => p.payload)
      .filter((p): p is T => p !== null && p !== undefined)
  } catch (err) {
    if (err instanceof ColonyFetchError) throw err
    throw new ColonyFetchError('qdrant', null, 'Qdrant unreachable')
  }
}

async function ensureRepliesCollection(): Promise<void> {
  const url = `${baseUrl()}/collections/${EMAIL_REPLIES}`
  const res = await fetch(url, { signal: AbortSignal.timeout(3000) })
  if (res.ok) return
  await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ vectors: { size: 1, distance: 'Cosine' } }),
    signal: AbortSignal.timeout(5000),
  })
}

export async function qdrantFetchEmailSendByMessageId(
  messageId: string
): Promise<EmailSendRecord | null> {
  const filter = {
    must: [{ key: 'provider_message_id', match: { value: stripAngleBrackets(messageId) } }],
  }
  const results = await qdrantScroll<Record<string, unknown>>(EMAIL_SENDS, filter, 1)
  return (results[0] as unknown as EmailSendRecord) ?? null
}

export async function qdrantSearchEmailSendsBySubject(
  cleanSubject: string,
  fromEmail: string
): Promise<EmailSendRecord[]> {
  // Match outbound sends where to_email == reply.from_email and subject matches (without Re:/Fwd:)
  const filter = {
    must: [{ key: 'to_email', match: { value: fromEmail } }],
  }
  const results = await qdrantScroll<Record<string, unknown>>(EMAIL_SENDS, filter, 50)
  const needle = cleanSubject.toLowerCase().trim()
  return results
    .filter(r => {
      const subj = typeof r.subject === 'string' ? r.subject.toLowerCase().trim() : ''
      return subj === needle || subj.includes(needle) || needle.includes(subj)
    })
    .map(r => r as unknown as EmailSendRecord)
}

export async function qdrantWriteReplyRecord(
  record: Omit<ReplyRecord, 'id'>
): Promise<string> {
  await ensureRepliesCollection()
  const id = crypto.randomUUID()
  const url = `${baseUrl()}/collections/${EMAIL_REPLIES}/points`
  const body = JSON.stringify({
    points: [{ id, vector: [0.0], payload: { ...record, id } }],
  })
  const res = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body,
    signal: AbortSignal.timeout(TIMEOUT_MS),
  })
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText)
    throw new ColonyFetchError('qdrant', res.status, `Qdrant reply upsert failed: ${text}`)
  }
  return id
}

export async function qdrantFetchRepliesForLead(
  cohortId: string,
  leadId: string,
  limit = 50
): Promise<ReplyRecord[]> {
  const filter = {
    must: [
      { key: 'cohort_id', match: { value: cohortId } },
      { key: 'lead_id', match: { value: leadId } },
    ],
  }
  const raw = await qdrantScroll<Record<string, unknown>>(EMAIL_REPLIES, filter, limit)
  return raw
    .map(r => r as unknown as ReplyRecord)
    .sort((a, b) => new Date(b.received_at).getTime() - new Date(a.received_at).getTime())
}

export async function qdrantFetchRepliesForCohort(
  cohortId: string,
  since?: string,
  limit = 50
): Promise<ReplyRecord[]> {
  const must: Array<Record<string, unknown>> = [
    { key: 'cohort_id', match: { value: cohortId } },
  ]
  if (since) must.push({ key: 'received_at', range: { gt: since } })
  const raw = await qdrantScroll<Record<string, unknown>>(EMAIL_REPLIES, { must }, limit)
  return raw
    .map(r => r as unknown as ReplyRecord)
    .sort((a, b) => new Date(b.received_at).getTime() - new Date(a.received_at).getTime())
}

function stripAngleBrackets(id: string): string {
  return id.replace(/^</, '').replace(/>$/, '').trim()
}
