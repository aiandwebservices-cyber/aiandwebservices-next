import './globals.css';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import Script from 'next/script';
import CrispChat from '@/components/CrispChat';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { OrganizationSchema, LocalBusinessSchema, WebSiteSchema, PersonSchema } from '@/components/Schema';

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
  display: 'block',
  preload: true,
  adjustFontFallback: false,
  fallback: ['Arial Black', 'Helvetica Neue', 'Arial', 'sans-serif'],
});

export const metadataBase = new URL('https://www.aiandwebservices.com');

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export const metadata = {
  title: 'AI Automation for Small Business | AIandWEBservices',
  description: 'AI chatbots, automation, websites, and SEO for small business — built personally by David Pulis. No agency markup. Free audit in 30 minutes.',
  keywords: 'AI agents, AI chatbot, AI automation, chatbot development, web design, SEO, small business, David Pulis, AIandWEBservices',
  authors: [{ name: 'David Pulis — AIandWEBservices' }],
  robots: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
  alternates: { canonical: 'https://www.aiandwebservices.com' },
  openGraph: {
    title: 'AI Automation for Small Business | AIandWEBservices',
    description: 'AI chatbots, automation, websites, and SEO for small business — built personally by David Pulis.',
    type: 'website',
    url: 'https://www.aiandwebservices.com',
    images: [{ url: 'https://www.aiandwebservices.com/og-image.jpg', width: 1200, height: 630, alt: 'AIandWEBservices — AI Agents, Chatbots, Automation and Web Services' }],
    siteName: 'AIandWEBservices',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@aiandwebservice',
    title: 'AI Automation for Small Business | AIandWEBservices',
    description: 'AI chatbots, automation, and websites for small business. Personal service by David Pulis.',
    images: ['https://www.aiandwebservices.com/og-image.jpg'],
  },
  icons: {
    icon: [
      { url: '/favicon.svg?v=2', type: 'image/svg+xml' },
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16.png', sizes: '16x16', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${plusJakarta.variable}`} suppressHydrationWarning={true}>
      <head>
        <link
          rel="preload"
          href="/_next/static/media/636a5ac981f94f8b-s.p.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link rel="preconnect" href="https://client.crisp.chat" />
        <link rel="dns-prefetch" href="https://client.crisp.chat" />
        {/* Block browser scroll restoration before any rendering — must be synchronous */}
        <script dangerouslySetInnerHTML={{ __html: `
          if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
          window.scrollTo(0, 0);
        `}} />
        <meta name="geo.region" content="US" />
        <meta name="geo.placename" content="United States" />
        <OrganizationSchema />
        <LocalBusinessSchema />
        <WebSiteSchema />
        <PersonSchema />
      </head>
      <body>
        {children}
        <Script
          id="hs-script"
          src="//js.hs-scripts.com/245878112.js"
          strategy="lazyOnload"
        />
        <CrispChat />
        <SpeedInsights />
      </body>
    </html>
  );
}
