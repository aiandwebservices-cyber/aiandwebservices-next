import { ColonyFetchError } from './contracts'
import type { LeadPayload, DealPayload, LeadsQuery, DealsQuery } from './contracts'
import type { Temperature, DealStage } from '@/app/colony/lib/types'

const TIMEOUT_MS = 5000

function baseUrl(): string {
  const url = process.env.COLONY_ESPOCRM_URL
  if (!url) throw new ColonyFetchError('espocrm', null, 'COLONY_ESPOCRM_URL not set')
  return url.replace(/\/$/, '')
}

function apiKey(): string {
  const key = process.env.COLONY_ESPOCRM_API_KEY
  if (!key) throw new ColonyFetchError('espocrm', null, 'COLONY_ESPOCRM_API_KEY not set')
  return key
}

async function espoGet<T>(path: string, params: Record<string, string>): Promise<T> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)

  const qs = new URLSearchParams(params).toString()
  const url = `${baseUrl()}/api/v1/${path}${qs ? `?${qs}` : ''}`

  try {
    const res = await fetch(url, {
      headers: { 'X-Api-Key': apiKey(), 'Content-Type': 'application/json' },
      signal: controller.signal,
    })
    clearTimeout(timer)

    if (!res.ok) {
      const text = await res.text().catch(() => res.statusText)
      throw new ColonyFetchError('espocrm', res.status, `EspoCRM ${res.status}: ${text}`)
    }

    return res.json() as Promise<T>
  } catch (err) {
    clearTimeout(timer)
    if (err instanceof ColonyFetchError) throw err
    if ((err as Error).name === 'AbortError') {
      throw new ColonyFetchError('espocrm', null, 'EspoCRM request timed out')
    }
    throw new ColonyFetchError('espocrm', null, 'EspoCRM unreachable')
  }
}

interface EspoListResponse<T> {
  total: number
  list: T[]
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildWhere(conditions: Array<{ type: string; attribute: string; value: unknown }>): string {
  return JSON.stringify(conditions)
}

// ─── Leads ────────────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapEspoLead(r: Record<string, any>, cohortId: string): LeadPayload | null {
  const id = r.id as string | undefined
  const email = (r.emailAddress ?? r.email ?? '') as string
  if (!id || !email) return null

  return {
    id,
    cohort_id: cohortId as LeadPayload['cohort_id'],
    business_name: (r.accountName ?? r.name ?? '') as string,
    first_name: r.firstName as string | undefined,
    last_name: r.lastName as string | undefined,
    email,
    phone: r.phoneNumber as string | undefined,
    website: r.website as string | undefined,
    niche: (r.cNiche ?? '') as string,
    city: (r.cCity ?? '') as string,
    state: (r.cState ?? 'FL') as string,
    temperature: (r.cTemperature ?? 'COOL') as Temperature,
    deal_tier: Number(r.cDealTier ?? 149),
    utm_source: r.cUtmSource as string | undefined,
    source: (r.cSource ?? 'master_pipeline') as LeadPayload['source'],
    created_at: (r.createdAt ?? new Date().toISOString()) as string,
    last_activity_at: r.modifiedAt as string | undefined,
  }
}

export async function espoFetchLeads(cohortId: string, query: LeadsQuery = {}): Promise<LeadPayload[]> {
  const where = buildWhere([{ type: 'equals', attribute: 'cCohortId', value: cohortId }])
  const params: Record<string, string> = {
    where,
    maxSize: String(query.limit ?? 50),
    offset: '0',
  }

  let result: EspoListResponse<Record<string, unknown>>
  try {
    result = await espoGet<EspoListResponse<Record<string, unknown>>>('Lead', params)
  } catch (err) {
    if (err instanceof ColonyFetchError && err.statusCode === 400) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('[Colony] EspoCRM: cCohortId field missing on Lead entity — returning empty array')
      }
      return []
    }
    throw err
  }

  return result.list
    .map(r => mapEspoLead(r as Record<string, unknown>, cohortId))
    .filter((l): l is LeadPayload => l !== null)
}

// ─── Deals (Opportunities) ────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapEspoDeal(r: Record<string, any>, cohortId: string): DealPayload | null {
  const id = r.id as string | undefined
  if (!id) return null

  const createdAt = (r.createdAt ?? new Date().toISOString()) as string
  const modifiedAt = r.modifiedAt as string | undefined
  const lastActivityAt = modifiedAt ?? createdAt
  const daysInStage = Math.floor(
    (Date.now() - new Date(lastActivityAt).getTime()) / 86_400_000
  )

  return {
    id,
    cohort_id: cohortId as DealPayload['cohort_id'],
    lead_id: (r.cLeadId ?? '') as string,
    business_name: (r.accountName ?? r.name ?? '') as string,
    amount: Number(r.amount ?? r.cDealTier ?? 149),
    stage: (r.salesStage ?? r.cStage ?? 'Lead') as DealStage,
    probability: Number(r.probability ?? 20),
    days_in_stage: daysInStage,
    created_at: createdAt,
    last_activity_at: lastActivityAt,
  }
}

export async function espoFetchDeals(cohortId: string, query: DealsQuery = {}): Promise<DealPayload[]> {
  const where = buildWhere([{ type: 'equals', attribute: 'cCohortId', value: cohortId }])
  const params: Record<string, string> = {
    where,
    maxSize: String(query.limit ?? 50),
    offset: '0',
  }

  let result: EspoListResponse<Record<string, unknown>>
  try {
    result = await espoGet<EspoListResponse<Record<string, unknown>>>('Opportunity', params)
  } catch (err) {
    if (err instanceof ColonyFetchError && err.statusCode === 400) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('[Colony] EspoCRM: cCohortId field missing on Opportunity entity — returning empty array')
      }
      return []
    }
    throw err
  }

  return result.list
    .map(r => mapEspoDeal(r as Record<string, unknown>, cohortId))
    .filter((d): d is DealPayload => d !== null)
}

// ─── Stage write-back ─────────────────────────────────────────────────────────

export async function espoUpdateDealStage(
  cohortId: string,
  dealId: string,
  newStage: string
): Promise<boolean> {
  void cohortId  // cohortId not needed for the PATCH — deal ID is globally unique in EspoCRM
  const res = await fetch(`${baseUrl()}/api/v1/Opportunity/${dealId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'X-Api-Key': apiKey(),
    },
    body: JSON.stringify({ salesStage: newStage }),
    signal: AbortSignal.timeout(5000),
  })

  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText)
    throw new ColonyFetchError('espocrm', res.status, `Stage update failed: ${text}`)
  }
  return true
}

// ─── Activities (Notes) ───────────────────────────────────────────────────────

export async function espoFetchActivities(
  cohortId: string,
  opts: { since?: string; limit?: number } = {}
): Promise<Array<{
  type: 'note' | 'email' | 'call' | 'task'
  subject: string
  body?: string
  created_at: string
  related_entity_id: string
  related_entity_type: 'Lead' | 'Opportunity'
}>> {
  void cohortId // filter is applied via parent entity's cohortId
  const params: Record<string, string> = {
    maxSize: String(opts.limit ?? 50),
    offset: '0',
    orderBy: 'createdAt',
    order: 'desc',
  }

  if (opts.since) {
    const where = buildWhere([{ type: 'greaterThan', attribute: 'createdAt', value: opts.since }])
    params.where = where
  }

  try {
    const result = await espoGet<EspoListResponse<Record<string, unknown>>>('Note', params)
    return result.list.map(r => ({
      type: ((r.type as string)?.toLowerCase() ?? 'note') as 'note' | 'email' | 'call' | 'task',
      subject: (r.name ?? r.post ?? '') as string,
      body: r.post as string | undefined,
      created_at: (r.createdAt ?? new Date().toISOString()) as string,
      related_entity_id: (r.parentId ?? '') as string,
      related_entity_type: (r.parentType === 'Opportunity' ? 'Opportunity' : 'Lead') as 'Lead' | 'Opportunity',
    }))
  } catch (err) {
    if (err instanceof ColonyFetchError && err.statusCode === 400) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('[Colony] EspoCRM: Note entity query failed — returning empty array')
      }
      return []
    }
    throw err
  }
}
