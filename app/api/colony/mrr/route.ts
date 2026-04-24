import { resolveCohort, okResponse, unauthorizedResponse, degradedResponse } from '../_shared/auth'
import { computeMetrics } from '@/lib/colony/metrics'
import { cache } from '@/lib/colony/cache'
import type { MetricsPayload } from '@/lib/colony/contracts'

export async function GET(req: Request) {
  const authed = await resolveCohort(req)
  if (!authed) return unauthorizedResponse()

  const cacheKey = `colony:${authed.cohortId}:metrics:current`
  const cached = cache.get<MetricsPayload>(cacheKey)
  if (cached) return okResponse(cached.data)

  try {
    const data = await computeMetrics(authed.cohortId)
    cache.set(cacheKey, data)
    return okResponse(data)
  } catch (err) {
    return degradedResponse(err instanceof Error ? err.message : 'Metrics unavailable')
  }
}
