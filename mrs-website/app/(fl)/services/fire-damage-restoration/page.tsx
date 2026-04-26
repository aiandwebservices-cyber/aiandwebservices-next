import type { Metadata } from "next";
import ServiceDetailPage from "@/components/pages/ServiceDetailPage";
import { FL_CONFIG } from "@/lib/site-config";
import { FL_SERVICE_DETAILS_BY_SLUG } from "@/lib/services-fl-detail";

/*
  PHOTO TODO — fire-damage-restoration
    1. /photos/services/fire-aftermath.jpg
       (already exists; used as hero photo-1)
    2. /photos/services/fire-damage-restoration/photo-2.jpg
       Source: Pexels search "house fire damage interior"
    3. /photos/services/fire-damage-restoration/photo-3.jpg
       Source: Unsplash search "smoke restoration equipment"
*/

const detail = FL_SERVICE_DETAILS_BY_SLUG["fire-damage-restoration"];
const URL = "https://mitigationrestorationservice.com/services/fire-damage-restoration";

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
  return <ServiceDetailPage detail={detail} config={FL_CONFIG} />;
}
