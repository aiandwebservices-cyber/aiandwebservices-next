import { BreadcrumbSchema } from '@/components/Schema';

export const metadata = {
  title: 'Compare All Plans | AIandWEBservices',
  description: 'Side-by-side comparison of all 5 service tiers. Features, pricing, and real deliverables. Find your plan in 60 seconds.',
  alternates: { canonical: 'https://www.aiandwebservices.com/services/compare' },
  openGraph: {
    title: 'Compare All Plans | AIandWEBservices',
    description: 'Side-by-side comparison of all 5 service tiers. Features, pricing, and real deliverables. Find your plan in 60 seconds.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Compare All Plans | AIandWEBservices',
    description: 'Side-by-side comparison of all 5 service tiers. Features, pricing, and real deliverables. Find your plan in 60 seconds.',
  },
};

const BASE = 'https://www.aiandwebservices.com';
const ITEMS = [
  { name: 'Home', url: BASE },
  { name: 'Services', url: `${BASE}/services` },
  { name: 'Compare All Plans', url: `${BASE}/services/compare` },
];

export default function CompareLayout({ children }) {
  return <><BreadcrumbSchema items={ITEMS} />{children}</>;
}
