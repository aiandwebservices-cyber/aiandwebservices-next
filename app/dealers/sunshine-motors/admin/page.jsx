'use client';
import { config } from '../config';
import { AdminPanel } from '@/lib/dealer-platform/admin/AdminPanel';

export default function SunshineAdminPage() {
  return <AdminPanel config={config} />;
}
