import { resolveCohort, unauthorizedResponse } from '../../_shared/auth'
import { qdrantFetchEnrollmentsForCohort, qdrantFetchEnrollmentsForLead } from '@/lib/colony/sequences/qdrant-store'
import { listTemplates } from '@/lib/colony/sequences/templates'

export async function GET(req: Request) {
  const authed = await resolveCohort(req)
  if (!authed) return unauthorizedResponse()

  const url = new URL(req.url)
  const leadId = url.searchParams.get('leadId') ?? undefined
  const statusFilter = url.searchParams.get('status') as 'active' | 'halted' | 'completed' | null

  try {
    const enrollments = leadId
      ? await qdrantFetchEnrollmentsForLead(authed.cohortId, leadId)
      : await qdrantFetchEnrollmentsForCohort(authed.cohortId, statusFilter ?? undefined)

    const templates = await listTemplates(authed.cohortId)
    const templateMap = new Map(templates.map(t => [t.id, t.name]))

    const enriched = enrollments
      .map(e => ({ ...e, template_name: templateMap.get(e.template_id) ?? e.template_id }))
      .sort((a, b) => (b.enrolled_at ?? '').localeCompare(a.enrolled_at ?? ''))

    return Response.json({ status: 'ok', data: enriched })
  } catch (err) {
    return Response.json({
      status: 'degraded',
      error: err instanceof Error ? err.message : 'active lookup failed',
    }, { status: 500 })
  }
}
