import { NextRequest, NextResponse } from 'next/server'
import { resolveCohort, okResponse, unauthorizedResponse, degradedResponse } from '@/app/api/colony/_shared/auth'
import { qdrantFetchDraftForLead } from '@/lib/colony/qdrant'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authed = await resolveCohort(req)
  if (!authed) return unauthorizedResponse()

  const { id } = await params

  if (authed.isDemo) {
    return NextResponse.json({ error: 'no_draft' }, { status: 404 })
  }

  try {
    const draft = await qdrantFetchDraftForLead(authed.cohortId, id)
    if (!draft) {
      return NextResponse.json({ error: 'no_draft' }, { status: 404 })
    }
    return okResponse({
      subject: draft.subject,
      body: draft.body,
      draft_only: draft.draft_only,
      delivered: draft.delivered,
      created_at: draft.generated_at,
    })
  } catch (err) {
    console.error('[colony/leads/draft] fetch failed', { id, cohortId: authed.cohortId, err })
    return degradedResponse(err instanceof Error ? err.message : 'Unknown error fetching draft')
  }
}
