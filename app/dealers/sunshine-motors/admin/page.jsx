'use client';
import { config } from '../config';
import { AdminPanel } from '@/lib/dealer-platform/admin/AdminPanel';
import AdminAuthGate from '@/lib/dealer-platform/admin/AdminAuthGate';

export default function SunshineAdminPage() {
  return (
    <AdminAuthGate dealerId="sunshine-motors">
      <AdminPanel config={config} />
    </AdminAuthGate>
  );
}
