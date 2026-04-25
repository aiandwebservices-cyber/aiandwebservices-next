import { NextRequest, NextResponse } from 'next/server';
import { fetchOpportunityTimeline } from '@/lib/colony/stage-analytics';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const timeline = await fetchOpportunityTimeline(id);
    return NextResponse.json({ opportunity_id: id, transitions: timeline });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
