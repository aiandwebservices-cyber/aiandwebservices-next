import './globals.css';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import Script from 'next/script';
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
  display: 'swap',
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
  keywords: 'ai chatbot for small business, ai chatbot for website, custom ai chatbot, ai assistant for business, business ai assistant, lead capture chatbot, ai answering service, done for you chatbot, chatbot service, chatbot agency, ai automation for small business, ai automation services, ai workflow automation, business automation services, custom ai solutions, custom ai agent, ai for service businesses, small business website design, lead generation website, conversion focused web design, local seo for small business, google business profile optimization, ai seo services, voice ai for business, ai voice agent, voice ai answering service, david pulis, david pulis miami, AIandWEBservices',
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
        {/* Block browser scroll restoration before any rendering — must be synchronous */}
        <script dangerouslySetInnerHTML={{ __html: `
          if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
          window.scrollTo(0, 0);
        `}} />
        {/* Apply panel zoom + padding-top before first paint to prevent the 88px+ layout shift
            that scalePanels() in useHorizontalScroll.js was causing post-hydration. The values
            depend on viewport height (compensatedPadding = ceil(88 / scale)) so they cannot be
            expressed as static CSS — must be computed at runtime as early as possible. The
            useEffect version of scalePanels still runs later and reapplies identical values. */}
        <script dangerouslySetInnerHTML={{ __html: `
          (function(){
            var sel='.hero-inner, .hiw-inner, .comparison-inner, .pricing-inner, .about-inner, .work-inner, .faq-inner, .contact-inner, .contact-flex-inner';
            var applied=false,rafId;
            function scalePanels(){
              if(window.innerWidth<769){
                if(applied){
                  document.querySelectorAll(sel).forEach(function(el){el.style.zoom='';el.style.paddingTop='';});
                  applied=false;
                }
                return;
              }
              var avail=window.innerHeight-64;
              var scale=Math.min(1,avail/1100);
              var pad=Math.ceil(88/scale);
              document.querySelectorAll(sel).forEach(function(el){el.style.zoom=scale;el.style.paddingTop=pad+'px';});
              applied=true;
            }
            if(document.readyState==='loading'){
              document.addEventListener('DOMContentLoaded',scalePanels);
            } else {
              scalePanels();
            }
            window.addEventListener('resize',function(){
              if(rafId)cancelAnimationFrame(rafId);
              rafId=requestAnimationFrame(scalePanels);
            });
          })();
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
          id="vtag-ai-js"
          src="https://r2.leadsy.ai/tag.js"
          data-pid="XNfRiCKRtvN3kZ3r"
          data-version="062024"
          strategy="afterInteractive"
        />
        <SpeedInsights />
      </body>
    </html>
  );
}
