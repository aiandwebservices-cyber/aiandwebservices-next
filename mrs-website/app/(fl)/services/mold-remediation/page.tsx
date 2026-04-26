import type { Metadata } from "next";
import ServiceDetailPage from "@/components/pages/ServiceDetailPage";
import { FL_SERVICE_DETAILS_BY_SLUG } from "@/lib/services-fl-detail";

/*
  PHOTO TODO — mold-remediation
    1. /photos/services/mold-ceiling.jpg
       (already exists; used as hero photo-1)
    2. /photos/services/mold-remediation/photo-2.jpg
       Source: Pexels search "mold remediation equipment"
    3. /photos/services/mold-remediation/photo-3.jpg
       Source: Unsplash search "HEPA air scrubber containment"
*/

const detail = FL_SERVICE_DETAILS_BY_SLUG["mold-remediation"];
const URL = "https://mitigationrestorationservice.com/services/mold-remediation";

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
  return <ServiceDetailPage detail={detail} />;
}
