import { resolveCohort, unauthorizedResponse } from '../../_shared/auth'
import { enrollLead } from '@/lib/colony/sequences/enrollment'

export async function POST(req: Request) {
  const authed = await resolveCohort(req)
  if (!authed) return unauthorizedResponse()

  const body = (await req.json().catch(() => ({}))) as {
    leadId?: string
    templateId?: string
    originalSendId?: string
    cohortId?: string
  }

  if (!body.leadId || !body.templateId || !body.originalSendId) {
    return Response.json(
      { status: 'degraded', error: 'leadId, templateId, originalSendId required' },
      { status: 400 },
    )
  }

  // cohortId from body only when authed user is impersonating or cohort matches;
  // otherwise trust the resolved cohort (security).
  const cohortId = (body.cohortId && authed.isImpersonating) ? body.cohortId : authed.cohortId

  try {
    const enrollment = await enrollLead({
      cohortId,
      leadId: body.leadId,
      templateId: body.templateId,
      originalSendId: body.originalSendId,
      adminEmail: authed.userId,
    })
    return Response.json({ status: 'ok', data: enrollment })
  } catch (err) {
    return Response.json({
      status: 'degraded',
      error: err instanceof Error ? err.message : 'enroll failed',
    }, { status: 500 })
  }
}
