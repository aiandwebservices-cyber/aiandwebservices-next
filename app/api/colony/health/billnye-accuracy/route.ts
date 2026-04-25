import { NextRequest, NextResponse } from 'next/server'
import { fetchBillNyeAccuracy } from '@/lib/colony/billnye-accuracy'

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
    const stats = await fetchBillNyeAccuracy(cohortId)
    return NextResponse.json(stats)
  } catch (e) {
    console.error('[health/billnye-accuracy]', e)
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }
}
