import './globals.css';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import CrispChat from '@/components/CrispChat';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-inter',
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
      { url: '/favicon.ico', type: 'image/x-icon' },
    ],
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <meta name="geo.region" content="US" />
        <meta name="geo.placename" content="United States" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{__html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ProfessionalService",
            "name": "AIandWEBservices",
            "founder": { "@type": "Person", "name": "David Pulis", "jobTitle": "Founder & AI Systems Specialist", "email": "david@aiandwebservices.com", "telephone": "+13155720710" },
            "description": "AIandWEBservices builds AI automation systems, intelligent assistant chatbots, high-converting websites, SEO strategies, and automated marketing pipelines for small and mid-sized businesses.",
            "url": "https://www.aiandwebservices.com",
            "email": "david@aiandwebservices.com",
            "telephone": "+13155720710",
            "areaServed": { "@type": "Country", "name": "United States" },
            "slogan": "Intelligent solutions. Personal service.",
            "priceRange": "$997 - $4497 setup",
            "paymentAccepted": ["Credit Card", "Bank Transfer", "Cryptocurrency"],
          })}}
        />
      </head>
      <body>
        {children}
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
