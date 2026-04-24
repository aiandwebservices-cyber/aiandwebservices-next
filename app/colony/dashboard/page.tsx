import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { ColonyNav } from '@/components/colony/ColonyNav';
import { DashboardContent } from '@/components/colony/DashboardContent';

export default async function DashboardPage() {
  const { userId, sessionClaims } = await auth();
  if (!userId) redirect('/colony/sign-in');

  const plan = (sessionClaims?.publicMetadata as Record<string, unknown>)
    ?.cohort_id as string | undefined;

  return (
    <>
      <ColonyNav />
      <DashboardContent plan={plan} />
    </>
  );
}
