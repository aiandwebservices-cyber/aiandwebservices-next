import { NextRequest, NextResponse } from 'next/server';
import { fetchFunnelCrossTabs, type CrossTabDimension, type TimeWindow } from '@/lib/colony/funnel-crosstabs';

const VALID_DIMS: CrossTabDimension[] = ['niche', 'source', 'city', 'assignedUser'];
const VALID_WINDOWS: TimeWindow[] = ['30d', '90d', 'all'];

export async function GET(req: NextRequest) {
  try {
    const dimA = (req.nextUrl.searchParams.get('dim_a') || 'niche') as CrossTabDimension;
    const dimB = (req.nextUrl.searchParams.get('dim_b') || 'source') as CrossTabDimension;
    const window = (req.nextUrl.searchParams.get('window') || '30d') as TimeWindow;

    if (!VALID_DIMS.includes(dimA) || !VALID_DIMS.includes(dimB)) {
      return NextResponse.json({ error: `Invalid dimension. Valid: ${VALID_DIMS.join(', ')}` }, { status: 400 });
    }
    if (!VALID_WINDOWS.includes(window)) {
      return NextResponse.json({ error: `Invalid window. Valid: ${VALID_WINDOWS.join(', ')}` }, { status: 400 });
    }

    const data = await fetchFunnelCrossTabs(dimA, dimB, window);
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
