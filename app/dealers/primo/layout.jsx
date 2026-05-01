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

export const metadata = {
  title: `${config.dealerName} — ${config.tagline}`,
  description: config.subtitle,
  robots: { index: false, follow: false },
};

export default function PrimoDealerLayout({ children }) {
  return (
    <div className={`${oswald.variable} ${inter.variable} ${mono.variable}`}>
      {children}
    </div>
  );
}
