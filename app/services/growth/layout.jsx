import { BreadcrumbSchema, ServicePageSchema } from '@/components/Schema';
import { getTier } from '@/lib/pricing';

export const metadata = {
  title: 'AI Automation for Small Business — Growth Plan | AIandWEBservices',
  description: 'Everything in Starter plus SEO, content, and lead generation automation — built to grow your revenue month over month.',
  alternates: { canonical: 'https://www.aiandwebservices.com/services/growth' },
  openGraph: {
    title: 'AI Automation for Small Business — Growth Plan | AIandWEBservices',
    description: 'Everything in Starter plus SEO, content, and lead generation automation — built to grow your revenue month over month.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Automation for Small Business — Growth Plan | AIandWEBservices',
    description: 'Everything in Starter plus SEO, content, and lead generation automation — built to grow your revenue month over month.',
  },
};

const BASE = 'https://www.aiandwebservices.com';
const ITEMS = [
  { name: 'Home', url: BASE },
  { name: 'Services', url: `${BASE}/services` },
  { name: 'Growth', url: `${BASE}/services/growth` },
];

export default function Layout({ children }) {
  const tier = getTier('growth');
  return (
    <>
      <BreadcrumbSchema items={ITEMS} />
      {tier && <ServicePageSchema tier={tier} />}
      {children}
    </>
  );
}
