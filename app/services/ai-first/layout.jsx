import { BreadcrumbSchema, ServicePageSchema } from '@/components/Schema';
import { getTier } from '@/lib/pricing';

export const metadata = {
  title: 'Voice AI for Business + AI Phone Receptionist — AI-First Plan | AIandWEBservices',
  description: 'AI-first business infrastructure: chatbots, CRM automation, and workflows built to run your business while you sleep.',
  alternates: { canonical: 'https://www.aiandwebservices.com/services/ai-first' },
  openGraph: {
    title: 'Voice AI for Business + AI Phone Receptionist — AI-First Plan | AIandWEBservices',
    description: 'AI-first business infrastructure: chatbots, CRM automation, and workflows built to run your business while you sleep.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Voice AI for Business + AI Phone Receptionist — AI-First Plan | AIandWEBservices',
    description: 'AI-first business infrastructure: chatbots, CRM automation, and workflows built to run your business while you sleep.',
  },
};

const BASE = 'https://www.aiandwebservices.com';
const ITEMS = [
  { name: 'Home', url: BASE },
  { name: 'Services', url: `${BASE}/services` },
  { name: 'AI-First', url: `${BASE}/services/ai-first` },
];

export default function Layout({ children }) {
  const tier = getTier('ai-first');
  return (
    <>
      <BreadcrumbSchema items={ITEMS} />
      {tier && <ServicePageSchema tier={tier} />}
      {children}
    </>
  );
}
