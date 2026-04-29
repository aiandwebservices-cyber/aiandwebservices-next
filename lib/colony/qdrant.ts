import { ColonyFetchError } from './contracts'
import type { ReportPayload, ReportsQuery } from './contracts'

const TIMEOUT_MS = 5000

const COLLECTIONS = {
  reports: 'bill_nye_reports_archive',
  knowledge: 'bill_nye_knowledge',
  hypotheses: 'bill_nye_hypotheses',
  emails: 'emails_sent',
  signals: 'research_signals',
  botRuns: 'bot_runs',
  emailSends: 'email_sends',
} as const

function baseUrl(): string {
  const url = process.env.COLONY_QDRANT_URL
  if (!url) throw new ColonyFetchError('qdrant', null, 'COLONY_QDRANT_URL not set')
  return url.replace(/\/$/, '')
}

async function qdrantScroll<T>(
  collection: string,
  filter: Record<string, unknown>,
  limit = 50,
  withPayload = true
): Promise<T[]> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)

  const url = `${baseUrl()}/collections/${collection}/points/scroll`
  const body = JSON.stringify({ filter, limit, with_payload: withPayload, with_vectors: false })

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      signal: controller.signal,
    })
    clearTimeout(timer)

    if (res.status === 404) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`[Colony] Qdrant: collection '${collection}' not found — returning empty`)
      }
      return []
    }

    if (!res.ok) {
      const text = await res.text().catch(() => res.statusText)
      throw new ColonyFetchError('qdrant', res.status, `Qdrant ${res.status}: ${text}`)
    }

    const json = await res.json() as { result?: { points?: Array<{ payload?: T }> } }
    return (json.result?.points ?? [])
      .map(p => p.payload)
      .filter((p): p is T => p !== null && p !== undefined)
  } catch (err) {
    clearTimeout(timer)
    if (err instanceof ColonyFetchError) throw err
    if ((err as Error).name === 'AbortError') {
      throw new ColonyFetchError('qdrant', null, 'Qdrant request timed out')
    }
    throw new ColonyFetchError('qdrant', null, 'Qdrant unreachable')
  }
}

function cohortFilter(cohortId: string): Record<string, unknown> {
  return { must: [{ key: 'cohort_id', match: { value: cohortId } }] }
}

// ─── Reports ──────────────────────────────────────────────────────────────────

export async function qdrantFetchReports(
  cohortId: string,
  query: ReportsQuery = {}
): Promise<ReportPayload[]> {
  type RawReport = {
    id?: string
    cohort_id?: string
    generated_at?: string
    title?: string
    top_findings?: string[]
    html_content?: string
  }

  const raw = await qdrantScroll<RawReport>(
    COLLECTIONS.reports,
    cohortFilter(cohortId),
    query.limit ?? 10
  )

  return raw
    .filter(r => r.id && r.title)
    .map(r => ({
      id: r.id!,
      cohort_id: (r.cohort_id ?? cohortId) as ReportPayload['cohort_id'],
      generated_at: r.generated_at ?? new Date().toISOString(),
      title: r.title!,
      top_findings: r.top_findings ?? [],
      html_content: r.html_content ?? '',
    }))
    .sort((a, b) => new Date(b.generated_at).getTime() - new Date(a.generated_at).getTime())
}

// ─── Email drafts ─────────────────────────────────────────────────────────────

export async function qdrantFetchDraftForLead(
  cohortId: string,
  leadId: string
): Promise<{ subject: string; body: string; generated_by: string; generated_at: string; delivered: boolean; draft_only: boolean } | null> {
  type RawDraft = {
    subject?: string
    body?: string
    generated_by?: string
    generated_at?: string
    sent_at?: string
    delivery_status?: string
    draft_only?: boolean
    lead_id?: string
    cohort_id?: string
  }

  const filter = {
    must: [
      { key: 'cohort_id', match: { value: cohortId } },
      { key: 'lead_id', match: { value: leadId } },
    ],
  }

  const results = await qdrantScroll<RawDraft>(COLLECTIONS.emails, filter, 1)
  const r = results[0]
  if (!r?.subject || !r?.body) return null

  return {
    subject: r.subject,
    body: r.body,
    generated_by: r.generated_by ?? 'Bob',
    generated_at: r.generated_at ?? r.sent_at ?? new Date().toISOString(),
    delivered: r.delivery_status === 'delivered',
    draft_only: r.draft_only ?? false,
  }
}

// ─── Research signals ─────────────────────────────────────────────────────────

export async function qdrantFetchSignalsForLead(
  cohortId: string,
  leadId: string
): Promise<string[]> {
  type RawSignal = { signal?: string; text?: string; cohort_id?: string; lead_id?: string }

  const filter = {
    must: [
      { key: 'cohort_id', match: { value: cohortId } },
      { key: 'lead_id', match: { value: leadId } },
    ],
  }

  const results = await qdrantScroll<RawSignal>(COLLECTIONS.signals, filter, 20)
  return results.map(r => r.signal ?? r.text ?? '').filter(Boolean)
}

// ─── Bot runs ─────────────────────────────────────────────────────────────────

export async function qdrantFetchBotRuns(
  cohortId: string,
  opts: { since?: string; limit?: number; botId?: string } = {}
): Promise<Array<{ bot_id?: string; bot_name: string; ran_at: string; summary: string; output_ids?: string[] }>> {
  type RawRun = {
    bot_id?: string
    bot_name?: string
    ran_at?: string
    summary?: string
    output_ids?: string[]
    cohort_id?: string
  }

  const must: unknown[] = [...((cohortFilter(cohortId).must as unknown[]) ?? [])]
  if (opts.since) must.push({ key: 'ran_at', range: { gt: opts.since } })
  if (opts.botId) must.push({ key: 'bot_id', match: { value: opts.botId } })
  const filter: Record<string, unknown> = { must }

  const results = await qdrantScroll<RawRun>(COLLECTIONS.botRuns, filter, opts.limit ?? 20)

  return results
    .filter(r => r.bot_name && r.ran_at)
    .map(r => ({
      bot_id: r.bot_id,
      bot_name: r.bot_name!,
      ran_at: r.ran_at!,
      summary: r.summary ?? '',
      output_ids: r.output_ids,
    }))
    .sort((a, b) => new Date(b.ran_at).getTime() - new Date(a.ran_at).getTime())
}

// ─── Email sends ──────────────────────────────────────────────────────────────

import type { EmailSendRecord } from './email/types'

async function ensureEmailSendsCollection(): Promise<void> {
  const url = `${baseUrl()}/collections/${COLLECTIONS.emailSends}`
  const res = await fetch(url, { signal: AbortSignal.timeout(3000) })
  if (res.ok) return
  await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ vectors: { size: 1, distance: 'Cosine' } }),
    signal: AbortSignal.timeout(5000),
  })
}

async function qdrantUpsertPoint(
  collection: string,
  id: string,
  payload: Record<string, unknown>
): Promise<void> {
  const url = `${baseUrl()}/collections/${collection}/points`
  const body = JSON.stringify({
    points: [{ id, vector: [0.0], payload }],
  })
  const res = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body,
    signal: AbortSignal.timeout(TIMEOUT_MS),
  })
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText)
    throw new ColonyFetchError('qdrant', res.status, `Qdrant upsert failed: ${text}`)
  }
}

async function qdrantUpdatePayload(
  collection: string,
  filter: Record<string, unknown>,
  payload: Record<string, unknown>
): Promise<void> {
  const url = `${baseUrl()}/collections/${collection}/points/payload`
  const body = JSON.stringify({ payload, filter })
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
    signal: AbortSignal.timeout(TIMEOUT_MS),
  })
  if (!res.ok && res.status !== 404) {
    const text = await res.text().catch(() => res.statusText)
    throw new ColonyFetchError('qdrant', res.status, `Qdrant payload update failed: ${text}`)
  }
}

export async function qdrantUpsertEmailSend(
  record: Omit<EmailSendRecord, 'status' | 'status_updated_at'> & { status?: EmailSendRecord['status'] }
): Promise<void> {
  await ensureEmailSendsCollection()
  const now = new Date().toISOString()
  await qdrantUpsertPoint(COLLECTIONS.emailSends, record.id, {
    ...record,
    status: record.status ?? 'sent',
    status_updated_at: now,
  })
}

export async function qdrantUpdateEmailSendStatus(
  providerMessageId: string,
  status: EmailSendRecord['status']
): Promise<void> {
  const filter = {
    must: [{ key: 'provider_message_id', match: { value: providerMessageId } }],
  }
  await qdrantUpdatePayload(COLLECTIONS.emailSends, filter, {
    status,
    status_updated_at: new Date().toISOString(),
  })
}

export async function qdrantFetchEmailSendsForLead(
  cohortId: string,
  leadId: string,
  limit = 20
): Promise<EmailSendRecord[]> {
  const filter = {
    must: [
      { key: 'cohort_id', match: { value: cohortId } },
      { key: 'lead_id', match: { value: leadId } },
    ],
  }
  const raw = await qdrantScroll<Record<string, unknown>>(COLLECTIONS.emailSends, filter, limit)
  return raw
    .filter(r => r.id && r.to_email)
    .map(r => r as unknown as EmailSendRecord)
    .sort((a, b) => new Date(b.sent_at).getTime() - new Date(a.sent_at).getTime())
}

export async function qdrantCountRecentSends(cohortId: string, sinceMs: number): Promise<number> {
  const since = new Date(Date.now() - sinceMs).toISOString()
  const filter = {
    must: [
      { key: 'cohort_id', match: { value: cohortId } },
      { key: 'sent_at', range: { gt: since } },
    ],
  }
  const results = await qdrantScroll<Record<string, unknown>>(COLLECTIONS.emailSends, filter, 100)
  return results.length
}

export async function qdrantCheckUnsubscribed(cohortId: string, leadId: string): Promise<boolean> {
  const filter = {
    must: [
      { key: 'cohort_id', match: { value: cohortId } },
      { key: 'lead_id', match: { value: leadId } },
      { key: 'status', match: { value: 'unsubscribed' } },
    ],
  }
  const results = await qdrantScroll<Record<string, unknown>>(COLLECTIONS.emailSends, filter, 1)
  return results.length > 0
}

export async function qdrantMarkUnsubscribed(cohortId: string, leadId: string): Promise<void> {
  const filter = {
    must: [
      { key: 'cohort_id', match: { value: cohortId } },
      { key: 'lead_id', match: { value: leadId } },
    ],
  }
  await qdrantUpdatePayload(COLLECTIONS.emailSends, filter, {
    status: 'unsubscribed',
    status_updated_at: new Date().toISOString(),
  })
}

// ─── Delivery status (Resend webhook) ────────────────────────────────────────

export async function qdrantUpdateDeliveryStatus(args: {
  providerMessageId: string
  deliveryStatus: string
  deliveryStatusAt: string
  bounceType?: string
  bounceMessage?: string
  complaintType?: string
  clickLink?: string
}): Promise<{ ok: boolean }> {
  const { providerMessageId, deliveryStatus, deliveryStatusAt, bounceType, bounceMessage, complaintType, clickLink } = args

  const payload: Record<string, unknown> = {
    delivery_status: deliveryStatus,
    delivery_status_at: deliveryStatusAt,
  }

  // Map to canonical status for records that track it
  const statusMap: Record<string, string> = { delivered: 'delivered', bounced: 'bounced', complained: 'complained' }
  if (statusMap[deliveryStatus]) {
    payload.status = statusMap[deliveryStatus]
    payload.status_updated_at = deliveryStatusAt
  }
  if (bounceType) payload.bounce_type = bounceType
  if (bounceMessage) payload.bounce_message = bounceMessage.slice(0, 500)
  if (complaintType) payload.complaint_type = complaintType
  if (clickLink) payload.latest_click_link = clickLink

  // Update both collections in parallel — whichever has the record gets updated; the other no-ops
  await Promise.allSettled([
    qdrantUpdatePayload(
      COLLECTIONS.emailSends,
      { must: [{ key: 'provider_message_id', match: { value: providerMessageId } }] },
      payload
    ),
    qdrantUpdatePayload(
      'emails_sent',
      { must: [{ key: 'resend_message_id', match: { value: providerMessageId } }] },
      payload
    ),
  ])

  return { ok: true }
}

// ─── Analytics bulk helpers ───────────────────────────────────────────────────

export async function qdrantFetchAllEmailSends(
  cohortId: string,
  limit = 200
): Promise<EmailSendRecord[]> {
  const filter = cohortFilter(cohortId)
  const raw = await qdrantScroll<Record<string, unknown>>(COLLECTIONS.emailSends, filter, limit)
  return raw
    .filter(r => r.id && r.lead_id)
    .map(r => r as unknown as EmailSendRecord)
}

export async function qdrantFetchReplies(
  cohortId: string,
  limit = 200
): Promise<Array<{ lead_id: string; classification?: string; received_at?: string }>> {
  type RawReply = { lead_id?: string; classification?: string; received_at?: string }
  const filter = cohortFilter(cohortId)
  const raw = await qdrantScroll<RawReply>('inbound_replies', filter, limit)
  return raw
    .filter(r => r.lead_id)
    .map(r => ({ lead_id: r.lead_id!, classification: r.classification, received_at: r.received_at }))
}
