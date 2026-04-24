import { resolveCohort, unauthorizedResponse } from '../../_shared/auth'
import { haltEnrollment } from '@/lib/colony/sequences/enrollment'

export async function POST(req: Request) {
  const authed = await resolveCohort(req)
  if (!authed) return unauthorizedResponse()

  const body = (await req.json().catch(() => ({}))) as { enrollmentId?: string }
  if (!body.enrollmentId) {
    return Response.json({ status: 'degraded', error: 'enrollmentId required' }, { status: 400 })
  }

  try {
    const ok = await haltEnrollment(body.enrollmentId, 'manual', authed.userId)
    return Response.json({ status: 'ok', data: { enrollmentId: body.enrollmentId, halted: ok } })
  } catch (err) {
    return Response.json({
      status: 'degraded',
      error: err instanceof Error ? err.message : 'halt failed',
    }, { status: 500 })
  }
}
