import { resolveCohort, okResponse, unauthorizedResponse, degradedResponse } from '../../_shared/auth'
import { requireAdmin } from '@/lib/colony/admin'
import { sendEmail } from '@/lib/colony/email/send'
import { qdrantFetchEmailSendsForLead } from '@/lib/colony/qdrant'

export async function POST(req: Request) {
  const authed = await resolveCohort(req)
  if (!authed) return unauthorizedResponse()

  const admin = await requireAdmin()
  if (!admin) {
    return Response.json(
      { status: 'unauthorized', data: null, error: 'Email send is admin-only in Phase 13' },
      { status: 403 }
    )
  }

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return Response.json({ status: 'degraded', data: null, error: 'Invalid JSON body' }, { status: 400 })
  }

  if (!body.leadId || !body.toEmail || !body.subject || !body.bodyText) {
    return Response.json({ status: 'degraded', data: null, error: 'Missing required fields' }, { status: 400 })
  }

  // Demo cohort: simulate send without hitting Resend
  if (authed.isDemo) {
    return okResponse({ success: true, demo: true, providerMessageId: `demo-${Date.now()}` })
  }

  const result = await sendEmail({
    cohortId: authed.cohortId,
    leadId: body.leadId as string,
    toEmail: body.toEmail as string,
    subject: body.subject as string,
    bodyText: body.bodyText as string,
    bodyHTML: body.bodyHTML as string | undefined,
    draftSource: (body.draftSource as 'bob_generated' | 'manual' | 'follow_up') ?? 'manual',
    generatedBy: body.generatedBy as string | undefined,
  })

  if (!result.success) {
    return degradedResponse(result.error ?? 'Send failed')
  }

  return okResponse(result)
}

export async function GET(req: Request) {
  const authed = await resolveCohort(req)
  if (!authed) return unauthorizedResponse()

  const url = new URL(req.url)
  const leadId = url.searchParams.get('leadId')
  if (!leadId) {
    return Response.json({ status: 'degraded', data: null, error: 'leadId required' }, { status: 400 })
  }

  if (authed.isDemo) {
    return okResponse([])
  }

  try {
    const sends = await qdrantFetchEmailSendsForLead(authed.cohortId, leadId)
    return okResponse(sends)
  } catch (err) {
    return degradedResponse(err instanceof Error ? err.message : 'Failed to fetch send history')
  }
}
