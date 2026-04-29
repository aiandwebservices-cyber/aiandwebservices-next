import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { ColonyNav } from '@/components/colony/ColonyNav';
import { DashboardContent } from '@/components/colony/DashboardContent';
import { getExternalCostSummary, type ExternalCostSummary } from '@/lib/colony/external-cost';

export const dynamic = 'force-dynamic';

const EMPTY_SUMMARY = (window: '1d' | '7d'): ExternalCostSummary => ({
  window,
  window_start_iso: '',
  cohort_id: '',
  total_plan_a_usd: 0,
  total_plan_b_usd: 0,
  total_api_calls: 0,
  bot_runs_with_cost: 0,
  bot_runs_total: 0,
  by_service: {},
  has_data: false,
});

export default async function DashboardPage() {
  const { userId, sessionClaims } = await auth();
  if (!userId) redirect('/colony/sign-in');

  const plan = (sessionClaims?.publicMetadata as Record<string, unknown>)
    ?.cohort_id as string | undefined;

  const [externalCost1d, externalCost7d] = await Promise.all([
    getExternalCostSummary('1d').catch(() => EMPTY_SUMMARY('1d')),
    getExternalCostSummary('7d').catch(() => EMPTY_SUMMARY('7d')),
  ]);

  return (
    <>
      <ColonyNav />
      <DashboardContent
        plan={plan}
        externalCost1d={externalCost1d}
        externalCost7d={externalCost7d}
      />
    </>
  );
}
