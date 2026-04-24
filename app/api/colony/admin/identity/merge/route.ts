import { NextResponse } from 'next/server'
import { randomUUID } from 'node:crypto'
import { requireAdmin } from '@/lib/colony/admin'
import { writeAuditEntry } from '@/lib/colony/onboarding-writers'

interface MergeBody {
  candidate_id: string
  canonical: { entity_type: string; entity_id: string; cohort_id: string }
  duplicate: { entity_type: string; entity_id: string; cohort_id: string }
  reason?: string
  dismiss?: boolean
}

export async function POST(req: Request) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ status: 'unauthorized' }, { status: 401 })

  const body = (await req.json().catch(() => ({}))) as MergeBody
  if (!body.candidate_id || !body.canonical || !body.duplicate) {
    return NextResponse.json({ status: 'degraded', error: 'candidate_id, canonical, duplicate required' }, { status: 400 })
  }

  const operation = body.dismiss ? 'identity_dismiss' : 'identity_merge_dry_run'
  await writeAuditEntry({
    id: randomUUID(),
    timestamp: new Date().toISOString(),
    admin_email: admin.email,
    action: 'manual_edit',
    target_cohort_id: body.canonical.cohort_id,
    input: { operation, ...body } as unknown as Record<string, unknown>,
    result: { dry_run: !body.dismiss, executed: false },
    notes: body.dismiss
      ? `Dismissed merge candidate ${body.candidate_id}`
      : `DRY-RUN merge: ${body.duplicate.entity_type}/${body.duplicate.entity_id} -> ${body.canonical.entity_type}/${body.canonical.entity_id}. Phase 12B executes.`,
  })

  return NextResponse.json({
    status: 'ok',
    data: { candidate_id: body.candidate_id, operation, executed: false },
  })
}
