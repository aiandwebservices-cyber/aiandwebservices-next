import { BreadcrumbSchema } from '@/components/Schema';

export const metadata = {
  title: 'Get a Free AI Audit | AIandWEBservices',
  description: "Tell me what you're working on. I'll personally review your business and show you where AI creates the biggest impact. 30 minutes, no pitch.",
  alternates: { canonical: 'https://www.aiandwebservices.com/contact' },
  openGraph: {
    title: 'Get a Free AI Audit | AIandWEBservices',
    description: "Tell me what you're working on. I'll personally review your business and show you where AI creates the biggest impact.",
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Get a Free AI Audit | AIandWEBservices',
    description: "Tell me what you're working on. I'll personally review your business and show you where AI creates the biggest impact.",
  },
};

const BASE = 'https://www.aiandwebservices.com';
const ITEMS = [
  { name: 'Home', url: BASE },
  { name: 'Contact', url: `${BASE}/contact` },
];

export default function ContactLayout({ children }) {
  return <><BreadcrumbSchema items={ITEMS} />{children}</>;
}
