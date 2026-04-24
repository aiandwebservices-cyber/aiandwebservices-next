// Thin Qdrant wrappers for sequence-specific collections.
// All reads fail gracefully (return empty) when collections don't exist.

import { randomUUID } from 'node:crypto'
import type { SequenceEnrollment, SequenceExecution, SequenceTemplate } from './types'

const QDRANT_URL = process.env.COLONY_QDRANT_URL

const COLL_TEMPLATES = 'colony_sequence_templates'
const COLL_ENROLLMENTS = 'colony_sequence_enrollments'
const COLL_EXECUTIONS = 'colony_sequence_executions'

function qdrantRequired(): string {
  if (!QDRANT_URL) throw new Error('COLONY_QDRANT_URL not set')
  return QDRANT_URL.replace(/\/$/, '')
}

async function ensureCollection(name: string): Promise<void> {
  const base = qdrantRequired()
  const check = await fetch(`${base}/collections/${name}`, { signal: AbortSignal.timeout(5000) })
  if (check.ok) return
  await fetch(`${base}/collections/${name}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ vectors: { size: 1, distance: 'Cosine' } }),
    signal: AbortSignal.timeout(5000),
  })
}

async function upsertPoint(collection: string, id: string, payload: Record<string, unknown>): Promise<void> {
  const base = qdrantRequired()
  await ensureCollection(collection)
  await fetch(`${base}/collections/${collection}/points`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ points: [{ id, vector: [0.0], payload }] }),
    signal: AbortSignal.timeout(5000),
  })
}

interface ScrollBody {
  limit?: number
  with_payload?: boolean
  filter?: unknown
}

async function scroll<T>(collection: string, body: ScrollBody): Promise<T[]> {
  if (!QDRANT_URL) return []
  const base = QDRANT_URL.replace(/\/$/, '')
  try {
    const res = await fetch(`${base}/collections/${collection}/points/scroll`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ limit: 200, with_payload: true, ...body }),
      signal: AbortSignal.timeout(5000),
    })
    if (!res.ok) return []
    const json = await res.json() as { result?: { points?: Array<{ payload: T }> } }
    return (json.result?.points ?? []).map(p => p.payload)
  } catch {
    return []
  }
}

// ─── Templates ────────────────────────────────────────────────────────────────

export async function qdrantGetTemplate(cohortId: string, templateId: string): Promise<SequenceTemplate | null> {
  const rows = await scroll<SequenceTemplate>(COLL_TEMPLATES, {
    limit: 10,
    filter: {
      must: [
        { key: 'cohort_id', match: { value: cohortId } },
        { key: 'id', match: { value: templateId } },
      ],
    },
  })
  return rows[0] ?? null
}

export async function qdrantScrollTemplates(cohortId: string): Promise<SequenceTemplate[]> {
  return scroll<SequenceTemplate>(COLL_TEMPLATES, {
    limit: 50,
    filter: { must: [{ key: 'cohort_id', match: { value: cohortId } }] },
  })
}

export async function qdrantUpsertTemplate(template: SequenceTemplate): Promise<void> {
  await upsertPoint(COLL_TEMPLATES, deterministicId(`${template.cohort_id}:${template.id}`), template as unknown as Record<string, unknown>)
}

// ─── Enrollments ─────────────────────────────────────────────────────────────

export async function qdrantWriteEnrollment(enrollment: Omit<SequenceEnrollment, 'id'>): Promise<string> {
  const id = randomUUID()
  await upsertPoint(COLL_ENROLLMENTS, id, { ...enrollment, id } as unknown as Record<string, unknown>)
  return id
}

export async function qdrantUpdateEnrollment(id: string, patch: Partial<SequenceEnrollment>): Promise<void> {
  const existing = await qdrantGetEnrollment(id)
  if (!existing) return
  await upsertPoint(COLL_ENROLLMENTS, id, { ...existing, ...patch } as unknown as Record<string, unknown>)
}

export async function qdrantGetEnrollment(id: string): Promise<SequenceEnrollment | null> {
  const rows = await scroll<SequenceEnrollment>(COLL_ENROLLMENTS, {
    limit: 1,
    filter: { must: [{ key: 'id', match: { value: id } }] },
  })
  return rows[0] ?? null
}

export async function qdrantFetchEnrollmentsForCohort(
  cohortId: string,
  status?: SequenceEnrollment['status']
): Promise<SequenceEnrollment[]> {
  const must: Array<Record<string, unknown>> = [{ key: 'cohort_id', match: { value: cohortId } }]
  if (status) must.push({ key: 'status', match: { value: status } })
  return scroll<SequenceEnrollment>(COLL_ENROLLMENTS, { limit: 500, filter: { must } })
}

export async function qdrantFetchEnrollmentsForLead(
  cohortId: string,
  leadId: string
): Promise<SequenceEnrollment[]> {
  return scroll<SequenceEnrollment>(COLL_ENROLLMENTS, {
    limit: 50,
    filter: {
      must: [
        { key: 'cohort_id', match: { value: cohortId } },
        { key: 'lead_id', match: { value: leadId } },
      ],
    },
  })
}

export async function qdrantFetchDueEnrollments(limit = 200): Promise<SequenceEnrollment[]> {
  // Qdrant filter can't do range on string timestamps across all versions reliably;
  // fetch active and filter in-process.
  const active = await scroll<SequenceEnrollment>(COLL_ENROLLMENTS, {
    limit,
    filter: { must: [{ key: 'status', match: { value: 'active' } }] },
  })
  const now = Date.now()
  return active.filter(e => {
    if (!e.next_send_due_at) return false
    return new Date(e.next_send_due_at).getTime() <= now
  })
}

// ─── Executions ──────────────────────────────────────────────────────────────

export async function qdrantWriteExecution(execution: SequenceExecution): Promise<void> {
  const id = randomUUID()
  await upsertPoint(COLL_EXECUTIONS, id, execution as unknown as Record<string, unknown>)
}

export async function qdrantFetchExecutionsForEnrollment(enrollmentId: string): Promise<SequenceExecution[]> {
  return scroll<SequenceExecution>(COLL_EXECUTIONS, {
    limit: 50,
    filter: { must: [{ key: 'enrollment_id', match: { value: enrollmentId } }] },
  })
}

// ─── Replies (Phase 14; graceful empty when collection absent) ───────────────

export interface ReplyRecord {
  lead_id: string
  cohort_id: string
  classification: 'REAL' | 'AUTOMATED' | 'UNSUBSCRIBE' | 'OOO' | string
  received_at: string
}

export async function qdrantFetchRepliesForLead(
  cohortId: string,
  leadId: string,
  opts: { since?: string } = {}
): Promise<ReplyRecord[]> {
  const rows = await scroll<ReplyRecord>('colony_email_replies', {
    limit: 50,
    filter: {
      must: [
        { key: 'cohort_id', match: { value: cohortId } },
        { key: 'lead_id', match: { value: leadId } },
      ],
    },
  })
  if (!opts.since) return rows
  const cutoff = new Date(opts.since).getTime()
  return rows.filter(r => new Date(r.received_at).getTime() >= cutoff)
}

function deterministicId(input: string): string {
  // UUID v5-ish deterministic from input; keeps upserts idempotent per template key.
  let h1 = 0xdeadbeef ^ 0, h2 = 0x41c6ce57 ^ 0
  for (let i = 0; i < input.length; i++) {
    const ch = input.charCodeAt(i)
    h1 = Math.imul(h1 ^ ch, 2654435761)
    h2 = Math.imul(h2 ^ ch, 1597334677)
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507)
  h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909)
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507)
  h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909)
  const hex = (v: number) => (v >>> 0).toString(16).padStart(8, '0')
  return `${hex(h1)}-${hex(h2).slice(0, 4)}-4${hex(h2).slice(4, 7)}-8${hex(h1).slice(0, 3)}-${hex(h1).slice(3)}${hex(h2).slice(0, 4)}`
}
