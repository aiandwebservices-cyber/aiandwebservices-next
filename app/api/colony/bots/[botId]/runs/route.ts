import { resolveCohort, okResponse, unauthorizedResponse, degradedResponse } from '../../../_shared/auth'
import { qdrantFetchBotRuns } from '@/lib/colony/qdrant'

const slug = (s: string) => s.toLowerCase().replace(/\s+/g, '-')

export async function GET(req: Request, { params }: { params: Promise<{ botId: string }> }) {
  const authed = await resolveCohort(req)
  if (!authed) return unauthorizedResponse()

  const { botId } = await params
  const url = new URL(req.url)
  const limit = Math.min(Number(url.searchParams.get('limit') ?? 20), 100)

  try {
    let runs = await qdrantFetchBotRuns(authed.cohortId, { botId, limit })
    if (runs.length === 0) {
      const all = await qdrantFetchBotRuns(authed.cohortId, { limit: 200 })
      runs = all.filter(r => slug(r.bot_name) === botId || r.bot_id === botId).slice(0, limit)
    }
    return okResponse(runs)
  } catch (err) {
    return degradedResponse(err instanceof Error ? err.message : 'Bot runs unavailable')
  }
}
