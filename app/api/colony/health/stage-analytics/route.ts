import { NextRequest, NextResponse } from 'next/server';
import { fetchStageAnalytics, type TimeWindow } from '@/lib/colony/stage-analytics';

export async function GET(req: NextRequest) {
  try {
    const w = (req.nextUrl.searchParams.get('window') || '90d') as TimeWindow;
    const valid: TimeWindow[] = ['30d', '90d', 'all'];
    const window = valid.includes(w) ? w : '90d';

    const data = await fetchStageAnalytics(window);
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
