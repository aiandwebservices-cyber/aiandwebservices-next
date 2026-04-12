import './globals.css';
import { Inter } from 'next/font/google';
import Script from 'next/script';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata = {
  title: 'AIandWEBservices | AI Agents, Chatbots, Automation & Web Services for Small Business — David Pulis',
  description: 'I build AI agents, AI chatbots, and automation systems that grow your small business 24/7 — plus SEO, web design, and digital marketing. No agency markup. Direct personal service from David Pulis at AIandWEBservices.',
  keywords: 'AI agents, AI chatbot, AI automation, chatbot development, web design, SEO, small business, David Pulis, AIandWEBservices',
  authors: [{ name: 'David Pulis — AIandWEBservices' }],
  robots: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
  alternates: { canonical: 'https://www.aiandwebservices.com' },
  openGraph: {
    title: 'AIandWEBservices | AI Agents, Chatbots & Automation for Small Business',
    description: 'AI agents, AI chatbots, automation, SEO, and web design built personally by David Pulis. Enterprise-grade intelligence at startup-friendly pricing.',
    type: 'website',
    url: 'https://www.aiandwebservices.com',
    images: [{ url: 'https://www.aiandwebservices.com/og-image.jpg', width: 1200, height: 630, alt: 'AIandWEBservices — AI Agents, Chatbots, Automation and Web Services' }],
    siteName: 'AIandWEBservices',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AIandWEBservices | AI Agents, Chatbots & Automation for Small Business',
    description: 'AI agents, chatbots, automation systems, SEO, and web design for small businesses. Personal service by David Pulis.',
    images: ['https://www.aiandwebservices.com/og-image.jpg'],
  },
  icons: {
    icon: '/favicon.ico',
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
          id="crisp"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{__html: `
            window.$crisp=[];window.CRISP_WEBSITE_ID="e76e44c0-a38a-4d5e-ab6a-41a380e83c69";
            window.$crisp.push(["config", "container:index", [1]]);
            (function(){var d=document,s=d.createElement("script");
            s.src="https://client.crisp.chat/l.js";s.async=1;
            d.getElementsByTagName("head")[0].appendChild(s);})();
            document.addEventListener('click', function(e) {
              var hamburger = document.getElementById('hamburger');
              if (hamburger && (hamburger === e.target || hamburger.contains(e.target))) {
                if (window.$crisp) window.$crisp.push(['do', 'chat:close']);
              }
            });
            // Close Crisp on pull-to-refresh attempt (touchstart near top of screen)
            document.addEventListener('touchstart', function(e) {
              if (window.scrollY === 0 && e.touches[0].clientY < 60) {
                if (window.$crisp) window.$crisp.push(['do', 'chat:close']);
              }
            }, { passive: true });
          `}}
        />
      </body>
    </html>
  );
}
