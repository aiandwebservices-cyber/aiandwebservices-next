import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/colony/admin'
import { getImpersonatedCohort } from '@/lib/colony/impersonation'

export async function GET() {
  const admin = await requireAdmin()
  if (!admin) {
    return NextResponse.json({ isAdmin: false, isImpersonating: false, impersonatedCohort: null }, { status: 200 })
  }
  const impersonatedCohort = await getImpersonatedCohort()
  return NextResponse.json({
    isAdmin: true,
    email: admin.email,
    isImpersonating: Boolean(impersonatedCohort),
    impersonatedCohort,
  })
}
