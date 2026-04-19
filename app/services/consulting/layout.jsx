import { BreadcrumbSchema } from '@/components/Schema';

export const metadata = {
  title: 'Consulting & Strategy | AIandWEBservices',
  description: 'One-on-one AI and automation consulting with David Pulis. Strategy, audits, and implementation advice — no fluff.',
  alternates: { canonical: 'https://www.aiandwebservices.com/services/consulting' },
  openGraph: {
    title: 'Consulting & Strategy | AIandWEBservices',
    description: 'One-on-one AI and automation consulting with David Pulis. Strategy, audits, and implementation advice — no fluff.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Consulting & Strategy | AIandWEBservices',
    description: 'One-on-one AI and automation consulting with David Pulis. Strategy, audits, and implementation advice — no fluff.',
  },
};

const BASE = 'https://www.aiandwebservices.com';
const ITEMS = [
  { name: 'Home', url: BASE },
  { name: 'Services', url: `${BASE}/services` },
  { name: 'Consulting & Strategy', url: `${BASE}/services/consulting` },
];

export default function Layout({ children }) {
  return <><BreadcrumbSchema items={ITEMS} />{children}</>;
}
