import { NextRequest, NextResponse } from 'next/server'
import { fetchCustomerKPIs } from '@/lib/colony/customer-kpis'

export async function GET(req: NextRequest) {
  try {
    let cohortFromSession: string | undefined
    try {
      const { auth } = await import('@clerk/nextjs/server')
      const { sessionClaims } = await auth()
      cohortFromSession = (sessionClaims?.publicMetadata as Record<string, unknown>)?.cohort_id as string | undefined
    } catch {
      // Clerk not yet configured — graceful fallback
    }

    const cohortFromQuery = req.nextUrl.searchParams.get('cohort_id') ?? undefined
    const cohortId = cohortFromSession || cohortFromQuery || 'aiandwebservices'

    const kpis = await fetchCustomerKPIs(cohortId)
    return NextResponse.json(kpis)
  } catch (e) {
    console.error('[health/customer-kpis]', e)
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }
}
