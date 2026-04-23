import type { Metadata } from "next";
import { FL_CONFIG } from "@/lib/site-config";
import FaqPage from "@/components/pages/FaqPage";

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FL_CONFIG.faqItems.map(({ q, a }) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
};

export const metadata: Metadata = {
  title: `FAQ — Water, Fire & Mold Restoration Questions | ${FL_CONFIG.siteName}`,
  description: "Get answers about water damage, fire & smoke cleanup, mold remediation, insurance claims, and response times for South Florida restoration services. Available 24/7.",
  ...(process.env.NEXT_PUBLIC_SEO_ENABLED === "true" && {
    alternates: { canonical: `${FL_CONFIG.productionUrl}/faq` },
    openGraph: {
      title: `Restoration FAQ | ${FL_CONFIG.siteName}`,
      description: "Common questions about water, fire, mold & storm restoration in South Florida. Licensed, IICRC-certified — available 24/7.",
      url: `${FL_CONFIG.productionUrl}/faq`,
    },
  }),
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <FaqPage config={FL_CONFIG} />
    </>
  );
}
