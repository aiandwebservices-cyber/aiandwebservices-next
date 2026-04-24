import { NextRequest } from 'next/server'
import { resolveCohort, okResponse, unauthorizedResponse, degradedResponse } from '@/app/api/colony/_shared/auth'
import { espoUpdateDealStage } from '@/lib/colony/espocrm'
import { cache } from '@/lib/colony/cache'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authed = await resolveCohort(req)
  if (!authed) return unauthorizedResponse()

  const { id } = await params
  const body = await req.json().catch(() => null) as { stage?: string } | null
  if (!body?.stage) {
    return Response.json(
      { status: 'degraded', data: null, error: 'stage required' },
      { status: 400 }
    )
  }

  if (authed.isDemo) {
    return okResponse({ id, stage: body.stage })
  }

  try {
    await espoUpdateDealStage(authed.cohortId, id, body.stage)
    cache.invalidateCohort(authed.cohortId)
    return okResponse({ id, stage: body.stage })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Stage update failed'
    console.error('[colony/deals/stage] update failed', { id, cohortId: authed.cohortId, stage: body.stage, err })
    return degradedResponse(msg)
  }
}
