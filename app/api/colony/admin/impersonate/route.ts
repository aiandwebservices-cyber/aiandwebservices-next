import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/colony/admin'
import { startImpersonation, stopImpersonation } from '@/lib/colony/impersonation'

export async function POST(req: Request) {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ status: 'unauthorized' }, { status: 401 })

  const body = (await req.json().catch(() => ({}))) as { cohortId?: string }
  if (!body.cohortId) {
    return NextResponse.json({ status: 'degraded', error: 'cohortId required' }, { status: 400 })
  }

  await startImpersonation(body.cohortId, admin)
  return NextResponse.json({ status: 'ok', impersonating: body.cohortId })
}

export async function DELETE() {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ status: 'unauthorized' }, { status: 401 })
  await stopImpersonation(admin)
  return NextResponse.json({ status: 'ok', impersonating: null })
}
