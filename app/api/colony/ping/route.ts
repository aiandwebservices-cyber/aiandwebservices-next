import { resolveCohort, okResponse, unauthorizedResponse } from '../_shared/auth'

export async function GET(req: Request) {
  const authed = await resolveCohort(req)
  if (!authed) return unauthorizedResponse()
  return okResponse({
    cohortId: authed.cohortId,
    isDemo: authed.isDemo,
    timestamp: new Date().toISOString(),
    message: 'Colony API online',
  })
}
