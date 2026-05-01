'use client';
import { config } from '../config';
import { AdminPanel } from '@/lib/dealer-platform/admin/AdminPanel';
import AdminAuthGate from '@/lib/dealer-platform/admin/AdminAuthGate';

export default function LotcrmAdminPage() {
  return (
    <AdminAuthGate dealerId="lotcrm">
      <AdminPanel config={config} />
    </AdminAuthGate>
  );
}
