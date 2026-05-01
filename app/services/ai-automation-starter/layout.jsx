import { BreadcrumbSchema, ServicePageSchema } from '@/components/Schema';
import { getTier } from '@/lib/pricing';

export const metadata = {
  title: 'AI Chatbot for Small Business — Done-for-You in 7–14 Days | AIandWEBservices',
  description: 'Your first AI chatbot, workflow automation, and web presence — done-for-you in 5 days. Starting at $49 setup.',
  alternates: { canonical: 'https://www.aiandwebservices.com/services/ai-automation-starter' },
  openGraph: {
    title: 'AI Chatbot for Small Business — Done-for-You in 7–14 Days | AIandWEBservices',
    description: 'Your first AI chatbot, workflow automation, and web presence — done-for-you in 5 days. Starting at $49 setup.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Chatbot for Small Business — Done-for-You in 7–14 Days | AIandWEBservices',
    description: 'Your first AI chatbot, workflow automation, and web presence — done-for-you in 5 days. Starting at $49 setup.',
  },
};

const BASE = 'https://www.aiandwebservices.com';
const ITEMS = [
  { name: 'Home', url: BASE },
  { name: 'Services', url: `${BASE}/services` },
  { name: 'AI Automation Starter', url: `${BASE}/services/ai-automation-starter` },
];

export default function Layout({ children }) {
  const tier = getTier('ai-automation-starter');
  return (
    <>
      <BreadcrumbSchema items={ITEMS} />
      {tier && <ServicePageSchema tier={tier} />}
      {children}
    </>
  );
}
