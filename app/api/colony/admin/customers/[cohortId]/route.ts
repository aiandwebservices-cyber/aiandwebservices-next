import { NextResponse } from 'next/server'
import { randomUUID } from 'node:crypto'
import { requireAdmin } from '@/lib/colony/admin'
import { getCustomerDetail } from '@/lib/colony/admin-queries'
import { writeAuditEntry } from '@/lib/colony/onboarding-writers'

export async function GET(_req: Request, { params }: { params: Promise<{ cohortId: string }> }) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ status: 'unauthorized', data: null }, { status: 401 })

  const { cohortId } = await params
  try {
    const data = await getCustomerDetail(cohortId)
    return NextResponse.json({ status: 'ok', data, cached_at: new Date().toISOString() })
  } catch (err) {
    return NextResponse.json({
      status: 'degraded',
      data: null,
      error: err instanceof Error ? err.message : 'Failed to load customer',
    })
  }
}

interface PatchBody {
  operation: 'mark_churned' | 'reactivate' | 'rename' | 'update_metadata'
  new_cohort_id?: string
  notes?: string
  metadata?: Record<string, unknown>
}

export async function PATCH(req: Request, { params }: { params: Promise<{ cohortId: string }> }) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ status: 'unauthorized', data: null }, { status: 401 })

  const { cohortId } = await params
  const body = (await req.json().catch(() => ({}))) as PatchBody
  if (!body.operation) {
    return NextResponse.json({ status: 'degraded', data: null, error: 'operation required' }, { status: 400 })
  }

  try {
    const note = buildNote(body, cohortId)
    await writeAuditEntry({
      id: randomUUID(),
      timestamp: new Date().toISOString(),
      admin_email: admin.email,
      action: body.operation === 'rename' ? 'cohort_rename' : 'manual_edit',
      target_cohort_id: cohortId,
      input: { ...body } as Record<string, unknown>,
      result: { applied: true, dry_run: body.operation === 'rename' },
      notes: note,
    })
    return NextResponse.json({ status: 'ok', data: { cohort_id: cohortId, operation: body.operation } })
  } catch (err) {
    return NextResponse.json({
      status: 'degraded',
      data: null,
      error: err instanceof Error ? err.message : 'Failed to apply operation',
    })
  }
}

function buildNote(body: PatchBody, cohortId: string): string {
  switch (body.operation) {
    case 'mark_churned': return `Marked ${cohortId} as churned. ${body.notes ?? ''}`.trim()
    case 'reactivate': return `Reactivated ${cohortId}. ${body.notes ?? ''}`.trim()
    case 'rename': return `Rename request: ${cohortId} → ${body.new_cohort_id ?? '?'} (dry-run, Phase 12B will execute)`
    case 'update_metadata': return `Metadata update on ${cohortId}. ${body.notes ?? ''}`.trim()
    default: return `Unknown operation on ${cohortId}`
  }
}
