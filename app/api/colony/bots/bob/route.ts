import { NextRequest, NextResponse } from 'next/server'
import { fetchBobProfile } from '@/lib/colony/bob'

export async function GET(req: NextRequest) {
  try {
    let cohortFromSession: string | undefined
    try {
      const { auth } = await import('@clerk/nextjs/server')
      const { sessionClaims } = await auth()
      cohortFromSession = (sessionClaims?.publicMetadata as Record<string, unknown>)?.cohort_id as string | undefined
    } catch {
      // Clerk not configured — OK during dev
    }

    const cohortFromQuery = req.nextUrl.searchParams.get('cohort_id') ?? undefined
    const cohortId = cohortFromSession || cohortFromQuery || 'aiandwebservices'

    const profile = await fetchBobProfile(cohortId)
    return NextResponse.json(profile)
  } catch (e) {
    console.error('[bots/bob] error:', e)
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }
}
