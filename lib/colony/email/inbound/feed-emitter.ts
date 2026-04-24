import crypto from 'crypto'
import { ColonyFetchError } from '../../contracts'
import type { ReplyClassification } from './types'

const FEED_EVENTS = 'feed_events'
const TIMEOUT_MS = 5000

function baseUrl(): string {
  const url = process.env.COLONY_QDRANT_URL
  if (!url) throw new ColonyFetchError('qdrant', null, 'COLONY_QDRANT_URL not set')
  return url.replace(/\/$/, '')
}

async function ensureFeedEventsCollection(): Promise<void> {
  const url = `${baseUrl()}/collections/${FEED_EVENTS}`
  const res = await fetch(url, { signal: AbortSignal.timeout(3000) })
  if (res.ok) return
  await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ vectors: { size: 1, distance: 'Cosine' } }),
    signal: AbortSignal.timeout(5000),
  })
}

export interface ReplyFeedEvent {
  cohort_id: string
  lead_id: string
  reply_id: string
  classification: ReplyClassification
  from_name: string
  subject: string
  received_at: string
}

export async function emitReplyFeedEvent(event: ReplyFeedEvent): Promise<void> {
  try {
    await ensureFeedEventsCollection()

    const isInterested = event.classification === 'INTERESTED'
    const id = crypto.randomUUID()

    const payload = {
      id: `reply-${event.reply_id}`,
      cohort_id: event.cohort_id,
      timestamp: event.received_at,
      type: isInterested ? 'reply_interested' : 'reply_received',
      title: isInterested
        ? `${event.from_name} wants to talk`
        : `Reply from ${event.from_name}`,
      subtitle: event.subject,
      icon: isInterested ? '🔥' : '↩️',
      priority: isInterested ? 'critical' : 'normal',
      classification: event.classification,
      drill_target_type: 'lead',
      drill_target_id: event.lead_id,
      reply_id: event.reply_id,
    }

    const url = `${baseUrl()}/collections/${FEED_EVENTS}/points`
    await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ points: [{ id, vector: [0.0], payload }] }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    })
  } catch (err) {
    console.error('[Colony Reply] Failed to emit feed event:', err)
  }
}

export interface RawReplyFeedEvent {
  id: string
  cohort_id: string
  timestamp: string
  type: 'reply_interested' | 'reply_received'
  title: string
  subtitle: string
  icon: string
  priority: 'critical' | 'normal'
  classification: ReplyClassification
  drill_target_type: 'lead'
  drill_target_id: string
  reply_id: string
}

export async function qdrantFetchReplyFeedEvents(
  cohortId: string,
  since?: string,
  limit = 50
): Promise<RawReplyFeedEvent[]> {
  const must: Array<Record<string, unknown>> = [
    { key: 'cohort_id', match: { value: cohortId } },
  ]
  if (since) must.push({ key: 'timestamp', range: { gt: since } })

  const url = `${baseUrl()}/collections/${FEED_EVENTS}/points/scroll`
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        filter: { must },
        limit,
        with_payload: true,
        with_vectors: false,
      }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    })

    if (res.status === 404) return []
    if (!res.ok) return []

    const json = await res.json() as {
      result?: { points?: Array<{ payload?: RawReplyFeedEvent }> }
    }
    return (json.result?.points ?? [])
      .map(p => p.payload)
      .filter((p): p is RawReplyFeedEvent => p !== null && p !== undefined)
  } catch {
    return []
  }
}
