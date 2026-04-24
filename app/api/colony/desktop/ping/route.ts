import { resolveCohort, okResponse } from '../../_shared/auth'

export async function GET(req: Request) {
  const authed = await resolveCohort(req)
  if (!authed) {
    return Response.json({ unread_count: 0, should_pulse: false })
  }

  return okResponse({
    unread_count: 0,
    should_pulse: false,
    last_checked: new Date().toISOString(),
  })
}
