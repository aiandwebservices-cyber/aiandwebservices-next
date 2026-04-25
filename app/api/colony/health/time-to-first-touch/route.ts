import { NextRequest, NextResponse } from 'next/server';
import { fetchTimeToFirstTouch, type TimeWindow } from '@/lib/colony/time-to-first-touch';

export async function GET(req: NextRequest) {
  try {
    const windowParam = (req.nextUrl.searchParams.get('window') || '30d') as TimeWindow;
    const validWindows: TimeWindow[] = ['7d', '30d', '90d', 'all'];
    const window = validWindows.includes(windowParam) ? windowParam : '30d';

    const stats = await fetchTimeToFirstTouch(window);
    return NextResponse.json(stats);
  } catch (e) {
    console.error('[health/time-to-first-touch]', e);
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
