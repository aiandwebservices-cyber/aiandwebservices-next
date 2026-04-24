import { type NextRequest } from 'next/server'
import { resolveCohort, okResponse, unauthorizedResponse, degradedResponse } from '../../_shared/auth'
import { computeBotPerformance } from '@/lib/colony/analytics/compute-bot-performance'
import { ColonyCache } from '@/lib/colony/cache'

const analyticsCache = new ColonyCache(300)

export async function GET(req: NextRequest) {
  const authed = await resolveCohort(req)
  if (!authed) return unauthorizedResponse()

  const cacheKey = `colony:${authed.cohortId}:analytics:bots`
  const cached = analyticsCache.get(cacheKey)
  if (cached) return okResponse(cached.data)

  try {
    const data = await computeBotPerformance(authed.cohortId)
    analyticsCache.set(cacheKey, data)
    return okResponse(data)
  } catch (err) {
    console.error('[colony/analytics/bots]', { cohortId: authed.cohortId, err })
    return degradedResponse(err instanceof Error ? err.message : 'Bot analytics unavailable')
  }
}
