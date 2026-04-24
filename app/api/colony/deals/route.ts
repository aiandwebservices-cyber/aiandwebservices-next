import { resolveCohort, okResponse, unauthorizedResponse, degradedResponse } from '../_shared/auth'
import { fetchers } from '@/lib/colony/fetchers'
import type { DealsQuery } from '@/lib/colony/contracts'

export async function GET(req: Request) {
  const authed = await resolveCohort(req)
  if (!authed) return unauthorizedResponse()

  const url = new URL(req.url)
  const query: DealsQuery = {
    stage: (url.searchParams.get('stage') as DealsQuery['stage']) ?? undefined,
    limit: url.searchParams.has('limit') ? Number(url.searchParams.get('limit')) : undefined,
  }

  try {
    const data = await fetchers.fetchDeals(authed.cohortId, query)
    return okResponse(data)
  } catch (err) {
    return degradedResponse(err instanceof Error ? err.message : 'Unknown error fetching deals')
  }
}
