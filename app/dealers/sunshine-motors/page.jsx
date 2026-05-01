'use client';
import { config } from './config';
import { CustomerSite } from '@/lib/dealer-platform/customer/CustomerSite';

export default function SunshineCustomerPage() {
  return <CustomerSite config={config} />;
}
