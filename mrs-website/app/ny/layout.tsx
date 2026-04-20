import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { NY_CONFIG } from "@/lib/site-config";

export const metadata: Metadata = {
  title: NY_CONFIG.metaTitle,
  description: NY_CONFIG.metaDescription,
  robots: process.env.NEXT_PUBLIC_SEO_ENABLED === "true" ? "index, follow" : "noindex, nofollow",
  ...(process.env.NEXT_PUBLIC_SEO_ENABLED === "true" && {
    keywords: NY_CONFIG.keywords,
    openGraph: {
      title: NY_CONFIG.ogTitle,
      description: NY_CONFIG.ogDescription,
      type: "website",
      locale: "en_US",
      url: NY_CONFIG.productionUrl,
      siteName: NY_CONFIG.siteName,
    },
    twitter: {
      card: "summary_large_image",
      title: NY_CONFIG.ogTitle,
      description: NY_CONFIG.ogDescription,
    },
    alternates: {
      canonical: NY_CONFIG.productionUrl,
    },
  }),
};

const sc = NY_CONFIG.schema;
const schemaMarkup = {
  "@context": "https://schema.org",
  "@type": sc.type,
  "@id": `${NY_CONFIG.productionUrl}/#business`,
  name: sc.name,
  telephone: sc.telephone,
  email: sc.email,
  url: NY_CONFIG.productionUrl,
  description: sc.description,
  address: {
    "@type": "PostalAddress",
    ...(sc.address.streetAddress && { streetAddress: sc.address.streetAddress }),
    addressLocality: sc.address.addressLocality,
    addressRegion: sc.address.addressRegion,
    ...(sc.address.postalCode && { postalCode: sc.address.postalCode }),
    addressCountry: sc.address.addressCountry,
  },
  ...(sc.geo && {
    geo: {
      "@type": "GeoCoordinates",
      latitude: sc.geo.latitude,
      longitude: sc.geo.longitude,
    },
  }),
  areaServed: sc.areaServed,
  openingHours: "Mo-Su 00:00-24:00",
  priceRange: "$$",
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Restoration Services",
    itemListElement: NY_CONFIG.services.map(s => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: s.title, url: `${NY_CONFIG.productionUrl}${s.href.replace('/ny', '')}` },
    })),
  },
};

export default function NYLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {process.env.NEXT_PUBLIC_SEO_ENABLED === "true" && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
        />
      )}
      <Header config={NY_CONFIG} />
      <main className="flex-1">{children}</main>
      <Footer config={NY_CONFIG} />
    </>
  );
}
