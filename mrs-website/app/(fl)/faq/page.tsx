import type { Metadata } from "next";
import { FL_CONFIG } from "@/lib/site-config";
import FaqPage from "@/components/pages/FaqPage";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

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
  ...(true && {
    alternates: { canonical: `${FL_CONFIG.productionUrl}/faq` },
    openGraph: {
      title: `Restoration FAQ | ${FL_CONFIG.siteName}`,
      description: "Common questions about water, fire, mold & storm restoration in South Florida. Licensed, IICRC-certified — available 24/7.",
      url: `${FL_CONFIG.productionUrl}/faq`,
    },
  }),
};

const BASE = "https://mitigationrestorationservice.com";

export default function Page() {
  return (
    <>
      <BreadcrumbSchema items={[{ name: "Home", item: BASE }, { name: "FAQ", item: `${BASE}/faq` }]} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <FaqPage config={FL_CONFIG} />
    </>
  );
}
