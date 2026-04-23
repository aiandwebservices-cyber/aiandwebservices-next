import type { Metadata } from "next";
import { NY_CONFIG } from "@/lib/site-config";
import FaqPage from "@/components/pages/FaqPage";

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: NY_CONFIG.faqItems.map(({ q, a }) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
};

export const metadata: Metadata = {
  title: `FAQ — Water, Fire & Mold Restoration Questions | ${NY_CONFIG.siteName} NYC`,
  description: "Get answers about water damage, fire & smoke cleanup, mold remediation, insurance claims, and response times for NYC restoration services. Serving all five boroughs 24/7.",
  ...(process.env.NEXT_PUBLIC_SEO_ENABLED === "true" && {
    alternates: { canonical: `${NY_CONFIG.productionUrl}/faq` },
    openGraph: {
      title: `Restoration FAQ | ${NY_CONFIG.siteName} NYC`,
      description: "Common questions about water, fire, mold & storm restoration in NYC. Licensed, IICRC-certified — available 24/7.",
      url: `${NY_CONFIG.productionUrl}/faq`,
    },
  }),
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <FaqPage config={NY_CONFIG} />
    </>
  );
}
