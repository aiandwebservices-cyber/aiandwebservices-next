import type { ColonyFetchers, LeadsQuery, DealsQuery, ReportsQuery, FeedQuery, MetricsQuery, MetricsPayload, BotsQuery, BotPayload } from './contracts'
import type { LeadPayload, DealPayload, ReportPayload, FeedEventPayload } from './contracts'
import { computeMetrics } from './metrics'
import { fetchBotsFromRuns } from './bots'
import { cache } from './cache'
import * as espo from './espocrm'
import * as qdrant from './qdrant'
import { buildFeed } from './feed-builder'
import {
  getLeadsForCohort,
  getDealsForCohort,
  getReportsForCohort,
  getFeedForCohort,
} from '@/app/colony/lib/mock-data'

function hashQuery(query: unknown): string {
  if (!query || typeof query !== 'object') return '{}'
  const sorted = Object.fromEntries(
    Object.entries(query as Record<string, unknown>)
      .filter(([, v]) => v !== undefined)
      .sort(([a], [b]) => a.localeCompare(b))
  )
  return JSON.stringify(sorted)
}

export const fetchers: ColonyFetchers = {
  async fetchLeads(cohortId, query?: LeadsQuery): Promise<LeadPayload[]> {
    if (cohortId === 'demo') return getLeadsForCohort('demo')

    const key = `colony:${cohortId}:leads:${hashQuery(query)}`
    const hit = cache.get<LeadPayload[]>(key)
    if (hit) return hit.data

    const data = await espo.espoFetchLeads(cohortId, query ?? {})
    cache.set(key, data)
    return data
  },

  async fetchDeals(cohortId, query?: DealsQuery): Promise<DealPayload[]> {
    if (cohortId === 'demo') return getDealsForCohort('demo')

    const key = `colony:${cohortId}:deals:${hashQuery(query)}`
    const hit = cache.get<DealPayload[]>(key)
    if (hit) return hit.data

    const data = await espo.espoFetchDeals(cohortId, query ?? {})
    cache.set(key, data)
    return data
  },

  async fetchReports(cohortId, query?: ReportsQuery): Promise<ReportPayload[]> {
    if (cohortId === 'demo') return getReportsForCohort('demo')

    const key = `colony:${cohortId}:reports:${hashQuery(query)}`
    const hit = cache.get<ReportPayload[]>(key)
    if (hit) return hit.data

    const data = await qdrant.qdrantFetchReports(cohortId, query ?? {})
    cache.set(key, data)
    return data
  },

  async fetchFeed(cohortId, query?: FeedQuery): Promise<FeedEventPayload[]> {
    if (cohortId === 'demo') return getFeedForCohort('demo')

    const key = `colony:${cohortId}:feed:${hashQuery(query)}`
    const hit = cache.get<FeedEventPayload[]>(key)
    if (hit) return hit.data

    const data = await buildFeed(cohortId, query ?? {})
    cache.set(key, data)
    return data
  },

  async fetchMetrics(cohortId, query?: MetricsQuery): Promise<MetricsPayload> {
    const key = `colony:${cohortId}:metrics:${hashQuery(query)}`
    const hit = cache.get<MetricsPayload>(key)
    if (hit) return hit.data

    const data = await computeMetrics(cohortId)
    cache.set(key, data)
    return data
  },

  async fetchBots(cohortId, query?: BotsQuery): Promise<BotPayload[]> {
    const key = `colony:${cohortId}:bots:${hashQuery(query)}`
    const hit = cache.get<BotPayload[]>(key)
    if (hit) return hit.data

    const data = await fetchBotsFromRuns(cohortId)
    cache.set(key, data)
    return data
  },

  async updateDealStage(cohortId, dealId, newStage): Promise<boolean> {
    if (cohortId === 'demo') return true
    return espo.espoUpdateDealStage(cohortId, dealId, newStage)
  },
}
