import { BreadcrumbSchema, ServicePageSchema } from '@/components/Schema';
import { getTier } from '@/lib/pricing';

export const metadata = {
  title: 'Presence Plan | AIandWEBservices',
  description: 'Professional website, local SEO, and Google Business setup — built personally in 5 days. Your foundation for growth.',
  alternates: { canonical: 'https://www.aiandwebservices.com/services/presence' },
  openGraph: {
    title: 'Presence Plan | AIandWEBservices',
    description: 'Professional website, local SEO, and Google Business setup — built personally in 5 days. Your foundation for growth.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Presence Plan | AIandWEBservices',
    description: 'Professional website, local SEO, and Google Business setup — built personally in 5 days. Your foundation for growth.',
  },
};

const BASE = 'https://www.aiandwebservices.com';
const ITEMS = [
  { name: 'Home', url: BASE },
  { name: 'Services', url: `${BASE}/services` },
  { name: 'Presence', url: `${BASE}/services/presence` },
];

export default function Layout({ children }) {
  const tier = getTier('presence');
  return (
    <>
      <BreadcrumbSchema items={ITEMS} />
      {tier && <ServicePageSchema tier={tier} />}
      {children}
    </>
  );
}
