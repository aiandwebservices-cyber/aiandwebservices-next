import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StickyCallBar from "@/components/StickyCallBar";
import { FL_CONFIG } from "@/lib/site-config";

const PRODUCTION_URL = "https://mitigationrestorationservice.com";
const sc = FL_CONFIG.schema;

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": sc.type,
  additionalType: "https://schema.org/EmergencyService",
  "@id": `${PRODUCTION_URL}/#business`,
  name: sc.name,
  telephone: sc.telephone,
  email: sc.email,
  url: PRODUCTION_URL,
  description: sc.description,
  address: {
    "@type": "PostalAddress",
    streetAddress: sc.address.streetAddress,
    addressLocality: sc.address.addressLocality,
    addressRegion: sc.address.addressRegion,
    postalCode: sc.address.postalCode,
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
      latitude: 25.9786,
      longitude: -80.2327,
    },
    geoRadius: "50000",
  },
  areaServed: ["Palm Beach County", "Broward County", "Miami-Dade County"].map(name => ({
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
    itemListElement: FL_CONFIG.services.map(s => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: s.title, url: `${PRODUCTION_URL}${s.href}` },
    })),
  },
};

const reviewSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${PRODUCTION_URL}/#business`,
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "5.0",
    reviewCount: "47",
    bestRating: "5",
    worstRating: "1",
  },
};

export default function FLLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([localBusinessSchema, reviewSchema]) }}
      />
      <Header config={FL_CONFIG} />
      <main className="flex-1">{children}</main>
      <Footer config={FL_CONFIG} />
      <StickyCallBar config={FL_CONFIG} />
    </>
  );
}
