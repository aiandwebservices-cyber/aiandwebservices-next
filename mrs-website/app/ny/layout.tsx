import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { NY_CONFIG } from "@/lib/site-config";

export const metadata: Metadata = {
  title: NY_CONFIG.metaTitle,
  description: NY_CONFIG.metaDescription,
  robots: true ? "index, follow" : "noindex, nofollow",
  ...(true && {
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
      canonical: `${NY_CONFIG.productionUrl}`,
    },
  }),
};

const sc = NY_CONFIG.schema;

// TODO(David) — Before NY launch:
//   Add NY street address + postal code (NY_CONFIG.schema.address.streetAddress / postalCode are currently null).
// Phone is confirmed (917) 288-9730 — do NOT reuse the FL number.
// areaServed (county names below) is JSON-LD only — invisible to site visitors.
// User-visible NY copy must use borough names (Manhattan, Brooklyn, Queens,
// The Bronx, Staten Island) — never county names. NYC market does not
// recognize "New York County" / "Kings County" / etc.
const NY_AREA_SERVED = [
  "New York County",   // Manhattan
  "Kings County",      // Brooklyn
  "Queens County",     // Queens
  "Bronx County",      // The Bronx
  "Richmond County",   // Staten Island
];

const schemaMarkup = {
  "@context": "https://schema.org",
  "@type": sc.type,
  additionalType: "https://schema.org/EmergencyService",
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
  geoArea: {
    "@type": "GeoCircle",
    geoMidpoint: {
      "@type": "GeoCoordinates",
      latitude: 40.7128,
      longitude: -74.0060,
    },
    geoRadius: "50000",
  },
  areaServed: NY_AREA_SERVED.map(name => ({
    "@type": "AdministrativeArea",
    name,
  })),
  openingHours: "Mo-Su 00:00-23:59",
  priceRange: "$$",
  serviceOutput: "Emergency response within 60 minutes",
  hoursAvailable: {
    "@type": "OpeningHoursSpecification",
    opens: "00:00",
    closes: "23:59",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
  },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Restoration Services",
    itemListElement: NY_CONFIG.services.map(s => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: s.title, url: `https://mitigationrestorationservice.com${s.href}` },
    })),
  },
};

export default function NYLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {true && (
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
