import { resolveCohort, okResponse, unauthorizedResponse, degradedResponse } from '../../_shared/auth'
import { qdrantCountRecentSends } from '@/lib/colony/qdrant'

const ONE_DAY_MS = 24 * 60 * 60 * 1000

export async function GET(req: Request) {
  const authed = await resolveCohort(req)
  if (!authed) return unauthorizedResponse()

  try {
    const sentToday = await qdrantCountRecentSends(authed.cohortId, ONE_DAY_MS)
    return okResponse({ sent_today: sentToday })
  } catch (err) {
    console.error('[email/stats] qdrantCountRecentSends failed', { cohortId: authed.cohortId, err })
    return degradedResponse(err instanceof Error ? err.message : 'Failed to fetch email stats')
  }
}
