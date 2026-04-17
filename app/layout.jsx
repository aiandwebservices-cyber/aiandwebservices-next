import './globals.css';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import Script from 'next/script';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import CrispChat from '@/components/CrispChat';
import { OrganizationSchema } from '@/components/Schema';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-inter',
  display: 'swap',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['700', '800'],
  variable: '--font-plus-jakarta',
  display: 'swap',
});

export const metadata = {
  title: 'AIandWEBservices | AI Automation, Agents & Chatbots for Small Business — David Pulis',
  description: 'I build AI agents, AI chatbots, and automation systems that grow your small business 24/7 — plus SEO, web design, and digital marketing. No agency markup. Direct personal service from David Pulis at AIandWEBservices.',
  keywords: 'AI agents, AI chatbot, AI automation, chatbot development, web design, SEO, small business, David Pulis, AIandWEBservices',
  authors: [{ name: 'David Pulis — AIandWEBservices' }],
  robots: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
  alternates: { canonical: 'https://www.aiandwebservices.com' },
  openGraph: {
    title: 'AIandWEBservices | AI Automation, Agents & Chatbots for Small Business',
    description: 'AI agents, AI chatbots, automation, SEO, and web design built personally by David Pulis. Enterprise-grade intelligence at startup-friendly pricing.',
    type: 'website',
    url: 'https://www.aiandwebservices.com',
    images: [{ url: 'https://www.aiandwebservices.com/og-image.jpg', width: 1200, height: 630, alt: 'AIandWEBservices — AI Agents, Chatbots, Automation and Web Services' }],
    siteName: 'AIandWEBservices',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AIandWEBservices | AI Automation, Agents & Chatbots for Small Business',
    description: 'AI agents, chatbots, automation systems, SEO, and web design for small businesses. Personal service by David Pulis.',
    images: ['https://www.aiandwebservices.com/og-image.jpg'],
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/logo-icon-transparent.png', type: 'image/png', sizes: '192x192' },
      { url: '/favicon.ico', type: 'image/x-icon' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180' },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${plusJakarta.variable}`}>
      <head>
        <meta name="geo.region" content="US" />
        <meta name="geo.placename" content="United States" />
        <OrganizationSchema />
      </head>
      <body>
        {children}
        <Script
          id="hs-script"
          src="//js.hs-scripts.com/245878112.js"
          strategy="lazyOnload"
        />
        <Script
          id="calendly"
          src="https://assets.calendly.com/assets/external/widget.js"
          strategy="lazyOnload"
        />
        <CrispChat />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
