import type { Metadata } from 'next';
import { Bricolage_Grotesque, Manrope } from 'next/font/google';
import './lotpilot.css';
import Navigation from './components/Navigation';
import Footer from './components/Footer';

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  variable: '--font-bricolage',
  display: 'swap',
});

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-manrope',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'LotPilot.ai — Your entire dealership. On autopilot.',
  description:
    'The all-in-one AI command center for independent auto dealers. 6 AI agents replace your website, CRM, F&I tools, inventory system, and more. Live in 5 days.',
  keywords:
    'dealership AI, auto dealer software, dealership CRM, vehicle inventory AI, dealer chatbot, dealer website, F&I tools, lead scoring AI, independent dealer',
  openGraph: {
    title: 'LotPilot.ai — Your entire dealership. On autopilot.',
    description:
      'Six AI agents. One platform. Replaces $30k+/yr in dealer software. Live in 5 business days.',
    type: 'website',
    url: 'https://lotpilot.ai',
    siteName: 'LotPilot.ai',
    images: [
      {
        url: 'https://lotpilot.ai/og.jpg',
        width: 1200,
        height: 630,
        alt: 'LotPilot.ai — AI command center for independent auto dealers',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LotPilot.ai — Your entire dealership. On autopilot.',
    description: 'Six AI agents. One platform. Live in 5 days.',
  },
  robots: 'index, follow',
};

export default function LotpilotLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`lp-root ${bricolage.variable} ${manrope.variable}`}>
      <Navigation />
      {children}
      <Footer />
    </div>
  );
}
