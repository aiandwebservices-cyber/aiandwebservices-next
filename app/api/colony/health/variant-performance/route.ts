import { NextRequest, NextResponse } from 'next/server';
import { fetchVariantPerformance } from '@/lib/colony/variant-performance';

export async function GET(req: NextRequest) {
  try {
    const cohortFromQuery = req.nextUrl.searchParams.get('cohort_id');
    let cohortFromSession: string | undefined;
    try {
      const { auth } = await import('@clerk/nextjs/server');
      const { sessionClaims } = await auth();
      cohortFromSession = (sessionClaims?.publicMetadata as Record<string, unknown>)?.cohort_id as string | undefined;
    } catch {}
    const cohortId = cohortFromSession || cohortFromQuery || 'aiandwebservices';
    const data = await fetchVariantPerformance(cohortId);
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
