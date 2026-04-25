import { NextRequest } from 'next/server'
import { resolveCohort, okResponse, unauthorizedResponse, degradedResponse } from '@/app/api/colony/_shared/auth'
import { espoFetchLeadById } from '@/lib/colony/espocrm'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authed = await resolveCohort(req)
  if (!authed) return unauthorizedResponse()

  const { id } = await params

  if (authed.isDemo) {
    return degradedResponse('Lead not found in demo mode')
  }

  try {
    const lead = await espoFetchLeadById(authed.cohortId, id)
    if (!lead) return degradedResponse('Lead not found')
    return okResponse(lead)
  } catch (err) {
    console.error('[colony/leads/id] fetch failed', { id, cohortId: authed.cohortId, err })
    return degradedResponse(err instanceof Error ? err.message : 'Unknown error fetching lead')
  }
}
