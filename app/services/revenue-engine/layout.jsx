import { BreadcrumbSchema, ServicePageSchema } from '@/components/Schema';
import { getTier } from '@/lib/pricing';

export const metadata = {
  title: 'Sales Funnel Design + CRM Setup for Small Business — Revenue Engine | AIandWEBservices',
  description: 'Full-stack revenue system: AI chatbot, email automation, SEO, and paid ads — managed monthly. Maximum ROI.',
  alternates: { canonical: 'https://www.aiandwebservices.com/services/revenue-engine' },
  openGraph: {
    title: 'Sales Funnel Design + CRM Setup for Small Business — Revenue Engine | AIandWEBservices',
    description: 'Full-stack revenue system: AI chatbot, email automation, SEO, and paid ads — managed monthly. Maximum ROI.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sales Funnel Design + CRM Setup for Small Business — Revenue Engine | AIandWEBservices',
    description: 'Full-stack revenue system: AI chatbot, email automation, SEO, and paid ads — managed monthly. Maximum ROI.',
  },
};

const BASE = 'https://www.aiandwebservices.com';
const ITEMS = [
  { name: 'Home', url: BASE },
  { name: 'Services', url: `${BASE}/services` },
  { name: 'Revenue Engine', url: `${BASE}/services/revenue-engine` },
];

export default function Layout({ children }) {
  const tier = getTier('revenue-engine');
  return (
    <>
      <BreadcrumbSchema items={ITEMS} />
      {tier && <ServicePageSchema tier={tier} />}
      {children}
    </>
  );
}
