import type { Metadata } from "next";
import ServiceDetailPage from "@/components/pages/ServiceDetailPage";
import { FL_CONFIG } from "@/lib/site-config";
import { FL_SERVICE_DETAILS_BY_SLUG } from "@/lib/services-fl-detail";

/*
  PHOTO TODO — storm-damage-repair
    1. /photos/services/storm-flood.jpg
       (already exists; used as hero photo-1)
    2. /photos/services/storm-damage-repair/photo-2.jpg
       Source: Pexels search "hurricane roof tarp"
    3. /photos/services/storm-damage-repair/photo-3.jpg
       Source: Unsplash search "storm damage debris"
*/

const detail = FL_SERVICE_DETAILS_BY_SLUG["storm-damage-repair"];
const URL = "https://mitigationrestorationservice.com/services/storm-damage-repair";

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
