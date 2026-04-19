import { BreadcrumbSchema } from '@/components/Schema';

export const metadata = {
  title: 'Add-On Services | AIandWEBservices',
  description: 'Expand your plan with individual add-ons: extra automations, chatbot upgrades, content, SEO, and more. À la carte.',
  alternates: { canonical: 'https://www.aiandwebservices.com/services/add-ons' },
  openGraph: {
    title: 'Add-On Services | AIandWEBservices',
    description: 'Expand your plan with individual add-ons: extra automations, chatbot upgrades, content, SEO, and more. À la carte.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Add-On Services | AIandWEBservices',
    description: 'Expand your plan with individual add-ons: extra automations, chatbot upgrades, content, SEO, and more. À la carte.',
  },
};

const BASE = 'https://www.aiandwebservices.com';
const ITEMS = [
  { name: 'Home', url: BASE },
  { name: 'Services', url: `${BASE}/services` },
  { name: 'Add-On Services', url: `${BASE}/services/add-ons` },
];

export default function Layout({ children }) {
  return <><BreadcrumbSchema items={ITEMS} />{children}</>;
}
