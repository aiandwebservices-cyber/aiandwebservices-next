import type { SiteConfig } from "@/lib/site-config";

const FL_BUSINESS_ID = "https://mitigationrestorationservice.com/#business";
const NY_BUSINESS_ID = "https://mitigationrestorationservice.com/ny/#business";

export default function ReviewsSchema({ config }: { config: SiteConfig }) {
  const businessId = config.location === "newYork" ? NY_BUSINESS_ID : FL_BUSINESS_ID;

  const reviewSchemas = config.testimonials.map(t => ({
    "@context": "https://schema.org",
    "@type": "Review",
    author: { "@type": "Person", name: t.name },
    reviewBody: t.quote,
    itemReviewed: { "@type": "LocalBusiness", "@id": businessId, name: "Mitigation Restoration Services" },
    reviewRating: {
      "@type": "Rating",
      ratingValue: t.stars,
      bestRating: 5,
      worstRating: 1,
    },
  }));

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchemas) }}
    />
  );
}
