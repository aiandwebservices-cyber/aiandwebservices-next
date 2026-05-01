import { Plus_Jakarta_Sans } from 'next/font/google';
import './lotpilot.css';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-plus-jakarta',
  display: 'swap',
});

export const metadata = {
  title: 'LotPilot.ai — Your Dealership on Autopilot | AI-Powered Dealer Platform',
  description: '6 AI agents, full dealer website, complete CRM — one platform replacing $2,800/mo in tools. Starting at $699/mo.',
  robots: { index: true, follow: true },
  openGraph: {
    title: 'LotPilot.ai — Your Dealership on Autopilot',
    description: '6 AI agents, full dealer website, complete CRM — one platform replacing $2,800/mo in tools. Starting at $699/mo.',
    type: 'website',
    url: 'https://lotpilot.ai',
    images: [{ url: '/lotpilot-og.jpg', width: 1200, height: 630, alt: 'LotPilot.ai — AI-Powered Dealer Platform' }],
    siteName: 'LotPilot.ai',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LotPilot.ai — Your Dealership on Autopilot',
    description: '6 AI agents. Full website. Complete CRM. One platform starting at $699/mo.',
    images: ['/lotpilot-og.jpg'],
  },
};

export default function LotPilotLayout({ children }) {
  return (
    <div className={`lp-root ${plusJakarta.variable}`}>
      {children}
    </div>
  );
}
