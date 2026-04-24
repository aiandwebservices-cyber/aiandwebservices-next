import { clerkClient } from '@clerk/nextjs/server'
import { randomUUID } from 'crypto'
import type { OnboardingInput } from './onboarding'

// ─── Types ───────────────────────────────────────────────────────────────────

export interface AuditEntry {
  id: string
  timestamp: string
  admin_email: string
  action: 'onboard' | 'rollback' | 'cohort_rename' | 'manual_edit'
  target_cohort_id: string
  input: Record<string, unknown>
  result: Record<string, unknown>
  notes?: string
  [key: string]: unknown
}

// ─── Clerk ───────────────────────────────────────────────────────────────────

export async function clerkInviteUser(
  email: string,
  cohortId: string,
  plan: string
): Promise<string> {
  const clerk = await clerkClient()
  const invite = await clerk.invitations.createInvitation({
    emailAddress: email,
    publicMetadata: { cohort_id: cohortId, plan },
    redirectUrl: 'https://colony.aiandwebservices.com/colony',
  })
  return invite.id
}

// ─── EspoCRM writes ───────────────────────────────────────────────────────────

function espoBase(): string {
  const url = process.env.COLONY_ESPOCRM_URL
  if (!url) throw new Error('COLONY_ESPOCRM_URL not set')
  return url.replace(/\/$/, '')
}

function espoKey(): string {
  const key = process.env.COLONY_ESPOCRM_API_KEY
  if (!key) throw new Error('COLONY_ESPOCRM_API_KEY not set')
  return key
}

async function espoPost<T>(path: string, body: Record<string, unknown>): Promise<T> {
  const res = await fetch(`${espoBase()}/api/v1/${path}`, {
    method: 'POST',
    headers: {
      'X-Api-Key': espoKey(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText)
    throw new Error(`EspoCRM POST ${path} ${res.status}: ${text}`)
  }
  return res.json() as Promise<T>
}

async function espoSearch<T>(entity: string, where: unknown[]): Promise<T[]> {
  const params = new URLSearchParams({
    where: JSON.stringify(where),
    maxSize: '1',
    offset: '0',
  })
  const res = await fetch(`${espoBase()}/api/v1/${entity}?${params}`, {
    headers: { 'X-Api-Key': espoKey(), 'Content-Type': 'application/json' },
  })
  if (!res.ok) return []
  const json = await res.json() as { list?: T[] }
  return json.list ?? []
}

export async function espoCreateCustomerRecords(
  input: OnboardingInput,
  cohortId: string,
  monthlyAmount: number
): Promise<{ accountId: string; contactId: string; oppId: string }> {
  // Idempotency: check if account already exists
  const existing = await espoSearch<{ id: string }>('Account', [
    { type: 'equals', attribute: 'cCohortId', value: cohortId },
  ])

  let accountId: string
  if (existing.length > 0) {
    accountId = existing[0].id
  } else {
    const account = await espoPost<{ id: string }>('Account', {
      name: input.businessName,
      website: input.businessWebsite ?? '',
      cCohortId: cohortId,
    })
    accountId = account.id
  }

  const contact = await espoPost<{ id: string }>('Contact', {
    firstName: input.primaryContactFirstName,
    lastName: input.primaryContactLastName,
    emailAddress: input.primaryContactEmail,
    phoneNumber: input.primaryContactPhone ?? '',
    accountId,
    cCohortId: cohortId,
  })

  const opp = await espoPost<{ id: string }>('Opportunity', {
    name: `${input.businessName} — ${input.plan.replace('_', ' ')}`,
    accountId,
    salesStage: 'Active',
    amount: monthlyAmount,
    cCohortId: cohortId,
    cPlan: input.plan,
    probability: 100,
  })

  return { accountId, contactId: contact.id, oppId: opp.id }
}

// ─── Square ──────────────────────────────────────────────────────────────────

function squareToken(): string {
  const env = process.env.SQUARE_ENVIRONMENT ?? 'sandbox'
  return env === 'production'
    ? (process.env.SQUARE_PRODUCTION_ACCESS_TOKEN ?? '')
    : (process.env.SQUARE_SANDBOX_ACCESS_TOKEN ?? '')
}

function squareBase(): string {
  const env = process.env.SQUARE_ENVIRONMENT ?? 'sandbox'
  return env === 'production'
    ? 'https://connect.squareup.com'
    : 'https://connect.squareupsandbox.com'
}

export async function squareTagCustomerCohort(
  email: string,
  cohortId: string
): Promise<{ customerId: string | null; success: boolean }> {
  const token = squareToken()
  if (!token) return { customerId: null, success: false }

  // Search for customer by email
  const searchRes = await fetch(`${squareBase()}/v2/customers/search`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Square-Version': '2024-10-17',
    },
    body: JSON.stringify({
      query: { filter: { email_address: { exact: email } } },
    }),
  })

  if (!searchRes.ok) return { customerId: null, success: false }

  const searchJson = await searchRes.json() as {
    customers?: Array<{ id: string }>
  }
  const customer = searchJson.customers?.[0]
  if (!customer) return { customerId: null, success: false }

  // Tag the customer with cohort_id
  const updateRes = await fetch(`${squareBase()}/v2/customers/${customer.id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Square-Version': '2024-10-17',
    },
    body: JSON.stringify({
      reference_id: cohortId,
      note: `Colony cohort: ${cohortId}`,
    }),
  })

  return { customerId: customer.id, success: updateRes.ok }
}

// ─── Qdrant ───────────────────────────────────────────────────────────────────

function qdrantBase(): string {
  const url = process.env.COLONY_QDRANT_URL
  if (!url) throw new Error('COLONY_QDRANT_URL not set')
  return url.replace(/\/$/, '')
}

async function qdrantEnsureCollection(name: string): Promise<void> {
  const checkRes = await fetch(`${qdrantBase()}/collections/${name}`)
  if (checkRes.ok) return

  await fetch(`${qdrantBase()}/collections/${name}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      vectors: { size: 1, distance: 'Cosine' },
    }),
  })
}

async function qdrantUpsertPoint(
  collection: string,
  id: string,
  payload: Record<string, unknown>
): Promise<void> {
  await fetch(`${qdrantBase()}/collections/${collection}/points`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      points: [{ id, vector: [1.0], payload }],
    }),
  })
}

export async function qdrantBootstrapCohort(cohortId: string): Promise<boolean> {
  try {
    await qdrantEnsureCollection('colony_audit')
    await qdrantEnsureCollection('bot_runs')

    await qdrantUpsertPoint('bot_runs', randomUUID(), {
      cohort_id: cohortId,
      bot_name: 'Scheduler',
      ran_at: new Date().toISOString(),
      summary: `Cohort ${cohortId} bootstrapped — ready for first agent run.`,
      output_ids: [],
    })

    return true
  } catch {
    return false
  }
}

// ─── Audit log ────────────────────────────────────────────────────────────────

export async function writeAuditEntry(entry: AuditEntry): Promise<string> {
  await qdrantEnsureCollection('colony_audit')
  await qdrantUpsertPoint('colony_audit', entry.id, entry)
  return entry.id
}

export async function readAuditLog(limit = 50): Promise<AuditEntry[]> {
  try {
    const res = await fetch(
      `${qdrantBase()}/collections/colony_audit/points/scroll`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          limit,
          with_payload: true,
          with_vectors: false,
          order_by: { key: 'timestamp', direction: 'desc' },
        }),
      }
    )
    if (!res.ok) return []
    const json = await res.json() as {
      result?: { points?: Array<{ payload?: AuditEntry }> }
    }
    return (json.result?.points ?? [])
      .map(p => p.payload)
      .filter((p): p is AuditEntry => p !== null && p !== undefined)
  } catch {
    return []
  }
}

export async function getExistingCohortIds(): Promise<string[]> {
  const entries = await readAuditLog(200)
  return entries
    .filter(e => e.action === 'onboard')
    .map(e => e.target_cohort_id)
}
