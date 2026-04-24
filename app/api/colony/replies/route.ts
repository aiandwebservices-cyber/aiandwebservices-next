import { resolveCohort, okResponse, unauthorizedResponse, degradedResponse } from '../_shared/auth'
import {
  qdrantFetchRepliesForLead,
  qdrantFetchRepliesForCohort,
} from '@/lib/colony/email/inbound/qdrant-helpers'

export async function GET(req: Request) {
  const authed = await resolveCohort(req)
  if (!authed) return unauthorizedResponse()

  if (authed.isDemo) {
    return okResponse([])
  }

  const url = new URL(req.url)
  const leadId = url.searchParams.get('lead_id') ?? undefined
  const since = url.searchParams.get('since') ?? undefined
  const limit = url.searchParams.has('limit')
    ? Number(url.searchParams.get('limit'))
    : 50

  try {
    const data = leadId
      ? await qdrantFetchRepliesForLead(authed.cohortId, leadId, limit)
      : await qdrantFetchRepliesForCohort(authed.cohortId, since, limit)
    return okResponse(data)
  } catch (err) {
    return degradedResponse(
      err instanceof Error ? err.message : 'Unknown error fetching replies'
    )
  }
}
