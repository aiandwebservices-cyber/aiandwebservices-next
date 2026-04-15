import type { Metadata } from "next";
import { Montserrat, Open_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

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
const SEO_ENABLED = process.env.NEXT_PUBLIC_SEO_ENABLED === "true";
const PRODUCTION_URL = "https://mitigationrestorationservices.com"; // update when going live

export const metadata: Metadata = {
  title: "Mitigation Restoration Services | 24/7 Emergency Restoration South Florida",
  description: "24/7 emergency water, fire, mold & storm damage restoration serving Boca Raton, Fort Lauderdale, Miami & all of South Florida. Licensed & insured. Se Habla Español.",

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
    keywords: "water damage restoration, mold remediation, fire damage restoration, storm damage, South Florida restoration, Fort Lauderdale, Miami, Boca Raton, IICRC certified, 24/7 emergency restoration",
    openGraph: {
      title: "Mitigation Restoration Services | 24/7 Emergency Restoration South Florida",
      description: "When disaster strikes, we respond. 24/7 emergency restoration for South Florida. Call (754) 777-8956.",
      type: "website",
      locale: "en_US",
      url: PRODUCTION_URL,
      siteName: "Mitigation Restoration Services",
    },
    twitter: {
      card: "summary_large_image",
      title: "Mitigation Restoration Services | 24/7 Emergency Restoration South Florida",
      description: "When disaster strikes, we respond. 24/7 emergency restoration for South Florida.",
    },
    alternates: {
      canonical: PRODUCTION_URL,
    },
  }),
};

// Schema.org LocalBusiness markup — only injected when SEO is on
const schemaMarkup = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${PRODUCTION_URL}/#business`,
  name: "Mitigation Restoration Services",
  telephone: "+17547778956",
  email: "Sam@mitigationrestorationservice.co.site",
  url: PRODUCTION_URL,
  description: "24/7 emergency property damage restoration serving South Florida — water damage, fire, mold, storm & biohazard cleanup.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "11322 Miramar Pkwy",
    addressLocality: "Miramar",
    addressRegion: "FL",
    postalCode: "33025",
    addressCountry: "US",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 25.9786,
    longitude: -80.2327,
  },
  areaServed: [
    "Boca Raton", "Deerfield Beach", "Pompano Beach", "Fort Lauderdale",
    "Hollywood", "Hallandale Beach", "Aventura", "North Miami",
    "Miami Beach", "Miami", "Coral Gables", "Homestead",
    "Palm Beach County", "Broward County", "Miami-Dade County",
  ],
  openingHours: "Mo-Su 00:00-24:00",
  priceRange: "$$",
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Restoration Services",
    itemListElement: [
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Water Damage Restoration", url: `${PRODUCTION_URL}/services#water` } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Fire & Smoke Damage Restoration", url: `${PRODUCTION_URL}/services#fire` } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Mold Remediation & Testing", url: `${PRODUCTION_URL}/services#mold` } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Storm & Wind Damage Repair", url: `${PRODUCTION_URL}/services#storm` } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Sewage & Biohazard Cleanup", url: `${PRODUCTION_URL}/services#biohazard` } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Reconstruction & Rebuild", url: `${PRODUCTION_URL}/services#reconstruction` } },
    ],
  },
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

        {/* Schema markup only injected when SEO is enabled */}
        {SEO_ENABLED && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
          />
        )}
      </head>
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
