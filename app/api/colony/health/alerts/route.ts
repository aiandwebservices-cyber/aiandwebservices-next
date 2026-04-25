import { NextRequest, NextResponse } from 'next/server';

const QDRANT_URL = process.env.QDRANT_URL || 'http://localhost:6333';

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

    const resp = await fetch(`${QDRANT_URL}/collections/customer_health_alerts/points/scroll`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        limit: 50,
        with_payload: true,
        with_vector: false,
        filter: {
          must: [
            { key: 'cohort_id', match: { value: cohortId } },
            { key: 'resolved', match: { value: false } },
          ],
        },
      }),
    });

    if (!resp.ok) {
      return NextResponse.json({ alerts: [], count: 0 });
    }

    const data = await resp.json();
    const points = data.result?.points || [];
    const alerts = points.map((p: { id: string; payload: Record<string, unknown> }) => ({
      id: String(p.id),
      ...p.payload,
    })).sort((a: Record<string, unknown>, b: Record<string, unknown>) => {
      const aTs = (a.detected_at as string) || '';
      const bTs = (b.detected_at as string) || '';
      return bTs.localeCompare(aTs);
    });

    return NextResponse.json({ alerts, count: alerts.length });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
