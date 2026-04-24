import { resolveCohort, okResponse, unauthorizedResponse, degradedResponse } from '../_shared/auth'
import { fetchers } from '@/lib/colony/fetchers'
import type { LeadsQuery } from '@/lib/colony/contracts'
import type { Temperature, DealStage } from '@/app/colony/lib/types'

export async function GET(req: Request) {
  const authed = await resolveCohort(req)
  if (!authed) return unauthorizedResponse()

  const url = new URL(req.url)
  const query: LeadsQuery = {
    temperature: (url.searchParams.get('temperature') as Temperature | 'ALL' | 'UNCONTACTED' | 'AGING') ?? undefined,
    niche: url.searchParams.get('niche') ?? undefined,
    source: (url.searchParams.get('source') as LeadsQuery['source']) ?? undefined,
    dateRange: (url.searchParams.get('dateRange') as LeadsQuery['dateRange']) ?? undefined,
    limit: url.searchParams.has('limit') ? Number(url.searchParams.get('limit')) : undefined,
    cursor: url.searchParams.get('cursor') ?? undefined,
  }

  try {
    const data = await fetchers.fetchLeads(authed.cohortId, query)
    return okResponse(data)
  } catch (err) {
    return degradedResponse(err instanceof Error ? err.message : 'Unknown error fetching leads')
  }
}
