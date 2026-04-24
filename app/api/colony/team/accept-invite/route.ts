import { NextRequest } from 'next/server'
import { resolveCohort, okResponse, unauthorizedResponse } from '../../_shared/auth'

// Called by the client after Clerk processes __clerk_ticket and the user joins the org.
// Clerk handles the actual org membership — this endpoint confirms the session is now
// associated with a cohort and returns it for client-side redirect logic.
export async function POST(req: NextRequest) {
  const authed = await resolveCohort(req)
  if (!authed) return unauthorizedResponse()

  return okResponse({
    cohortId: authed.cohortId,
    role: authed.role,
    isDemo: authed.isDemo,
  })
}
