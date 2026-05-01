import { BreadcrumbSchema } from '@/components/Schema';

export const metadata = {
  title: 'AI Consultant for Small Business — A La Carte Services | AIandWEBservices',
  description: 'Pick exactly what you need — website, AI chatbot, sales funnel, ads, voice AI, SEO, or automation. Custom quote, no lock-in, no subscription required.',
  alternates: { canonical: 'https://www.aiandwebservices.com/services/consulting' },
  openGraph: {
    title: 'AI Consultant for Small Business — A La Carte Services | AIandWEBservices',
    description: 'Pick exactly what you need — website, AI chatbot, sales funnel, ads, voice AI, SEO, or automation. Custom quote, no lock-in, no subscription required.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Consultant for Small Business — A La Carte Services | AIandWEBservices',
    description: 'Pick exactly what you need — website, AI chatbot, sales funnel, ads, voice AI, SEO, or automation. Custom quote, no lock-in, no subscription required.',
  },
};

const BASE = 'https://www.aiandwebservices.com';
const ITEMS = [
  { name: 'Home', url: BASE },
  { name: 'Services', url: `${BASE}/services` },
  { name: 'A La Carte', url: `${BASE}/services/consulting` },
];

export default function Layout({ children }) {
  return <><BreadcrumbSchema items={ITEMS} />{children}</>;
}
