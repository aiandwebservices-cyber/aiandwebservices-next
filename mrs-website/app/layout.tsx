import type { Metadata } from "next";
import { Montserrat, Open_Sans } from "next/font/google";
import "./globals.css";
import UTMTracker from "@/components/UTMTracker";
import { FL_CONFIG } from "@/lib/site-config";

// LocalBusiness JSON-LD is emitted from per-route layouts (app/(fl)/layout.tsx
// for FL, app/ny/layout.tsx for NY). The root layout intentionally emits no
// location-specific schema so FL data does not leak onto NY routes.

const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat", display: "swap" });
const openSans = Open_Sans({ subsets: ["latin"], variable: "--font-open-sans", display: "swap" });

// ─────────────────────────────────────────────────────────────────────────────
// SEO ACTIVATION SWITCH
// This site currently lives at mrs.aiandwebservices.com as a client preview.
// All SEO is OFF to protect aiandwebservices.com rankings.
//
// TO ACTIVATE when moving to the production domain:
//   1. Set NEXT_PUBLIC_SEO_ENABLED=true in Vercel environment variables
//   2. Update PRODUCTION_URL below to the real domain
//   3. Delete or update public/robots.txt to allow indexing
// ─────────────────────────────────────────────────────────────────────────────
const SEO_ENABLED = true;
const PRODUCTION_URL = "https://mitigationrestorationservice.com";

export const metadata: Metadata = {
  title: FL_CONFIG.metaTitle,
  description: FL_CONFIG.metaDescription,

  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },

  // Blocked on staging — activated by env var on production
  robots: SEO_ENABLED ? "index, follow" : "noindex, nofollow",

  // Keywords and OG only served when SEO is on
  ...(SEO_ENABLED && {
    keywords: FL_CONFIG.keywords,
    openGraph: {
      title: FL_CONFIG.ogTitle,
      description: FL_CONFIG.ogDescription,
      type: "website",
      locale: "en_US",
      url: PRODUCTION_URL,
      siteName: FL_CONFIG.siteName,
    },
    twitter: {
      card: "summary_large_image",
      title: FL_CONFIG.ogTitle,
      description: FL_CONFIG.ogDescription,
    },
    alternates: {
      canonical: PRODUCTION_URL,
    },
  }),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${montserrat.variable} ${openSans.variable}`}>
      <head>
        {/* Crisp live chat */}
        <script dangerouslySetInnerHTML={{ __html: `
          window.$crisp=[];
          window.CRISP_WEBSITE_ID="438bed34-ec5e-468c-9746-26bf7c79290c";
          (function(){var d=document;var s=d.createElement("script");
          s.src="https://client.crisp.chat/l.js";
          s.async=1;d.getElementsByTagName("head")[0].appendChild(s);})();
        `}} />
      </head>
      <body className="min-h-screen flex flex-col">
        <UTMTracker />
        {children}
      </body>
    </html>
  );
}
