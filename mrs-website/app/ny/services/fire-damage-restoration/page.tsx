import type { Metadata } from "next";
import ServiceDetailPage from "@/components/pages/ServiceDetailPage";
import { NY_CONFIG } from "@/lib/site-config";
import { NY_SERVICE_DETAILS_BY_SLUG } from "@/lib/services-ny-detail";

const detail = NY_SERVICE_DETAILS_BY_SLUG["fire-damage-restoration"];
const URL = "https://mitigationrestorationservice.com/ny/services/fire-damage-restoration";

export const metadata: Metadata = {
  title: detail.metaTitle,
  description: detail.metaDescription,
  alternates: { canonical: URL },
  openGraph: {
    title: detail.metaTitle,
    description: detail.metaDescription,
    url: URL,
    type: "website",
  },
};

export default function Page() {
  return <ServiceDetailPage detail={detail} config={NY_CONFIG} />;
}
