'use client';
import { config } from '../config';
import { AdminPanel } from '@/lib/dealer-platform/admin/AdminPanel';

export default function PrimoAdminPage() {
  return <AdminPanel config={config} />;
}
