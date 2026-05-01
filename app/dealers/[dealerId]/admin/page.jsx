import { notFound } from 'next/navigation';
import AdminAuthGate from '@/lib/dealer-platform/admin/AdminAuthGate';
import { AdminPanel } from '@/lib/dealer-platform/admin/AdminPanel';

// Static routes (lotcrm, sunshine-motors, primo) take precedence over this
// dynamic fallback. Update this map when adding a new dealer.
const dealerConfigs = {
  lotcrm: () => import('../lotcrm/config').then((m) => m.config),
  primo: () => import('../primo/config').then((m) => m.config),
  'sunshine-motors': () => import('../sunshine-motors/config').then((m) => m.config),
};

export default async function DealerAdminPage({ params }) {
  const { dealerId } = await params;
  const loader = dealerConfigs[dealerId];
  if (!loader) notFound();
  const config = await loader();
  return (
    <AdminAuthGate dealerId={dealerId}>
      <AdminPanel config={config} />
    </AdminAuthGate>
  );
}
