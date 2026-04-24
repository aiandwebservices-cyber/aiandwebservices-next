import { resolveCohort, okResponse, unauthorizedResponse, degradedResponse } from '../_shared/auth'
import { fetchers } from '@/lib/colony/fetchers'
import type { FeedQuery } from '@/lib/colony/contracts'

export async function GET(req: Request) {
  const authed = await resolveCohort(req)
  if (!authed) return unauthorizedResponse()

  const url = new URL(req.url)
  const query: FeedQuery = {
    since: url.searchParams.get('since') ?? undefined,
    limit: url.searchParams.has('limit') ? Number(url.searchParams.get('limit')) : 50,
  }

  try {
    const data = await fetchers.fetchFeed(authed.cohortId, query)
    return okResponse(data)
  } catch (err) {
    return degradedResponse(err instanceof Error ? err.message : 'Unknown error fetching feed')
  }
}
