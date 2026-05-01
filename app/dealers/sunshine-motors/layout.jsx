import { Oswald, Inter, JetBrains_Mono } from 'next/font/google';
import { config } from './config';

const oswald = Oswald({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-oswald',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '900'],
  variable: '--font-inter',
  display: 'swap',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-mono',
  display: 'swap',
});

export const viewport = {
  themeColor: '#2AA5A0',
};

export const metadata = {
  title: `${config.dealerName} — ${config.tagline}`,
  description: config.subtitle,
  robots: { index: false, follow: false },
  manifest: '/lotpilot-manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'LotPilot',
  },
  icons: {
    apple: '/icons/lotpilot-192.svg',
  },
};

export default function SunshineDealerLayout({ children }) {
  return (
    <div className={`${oswald.variable} ${inter.variable} ${mono.variable}`}>
      {children}
    </div>
  );
}
