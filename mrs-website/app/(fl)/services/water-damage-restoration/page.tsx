import type { Metadata } from "next";
import ServiceDetailPage from "@/components/pages/ServiceDetailPage";
import { FL_CONFIG } from "@/lib/site-config";
import { FL_SERVICE_DETAILS_BY_SLUG } from "@/lib/services-fl-detail";

/*
  PHOTO TODO — water-damage-restoration
    1. /photos/water-air-movers.jpeg
       (already exists; used as hero photo-1)
    2. /photos/services/water-damage-restoration/photo-2.jpg
       Source: Pexels search "water damage drying equipment"
    3. /photos/services/water-damage-restoration/photo-3.jpg
       Source: Unsplash search "flooded living room interior"
*/

const detail = FL_SERVICE_DETAILS_BY_SLUG["water-damage-restoration"];
const URL = "https://mitigationrestorationservice.com/services/water-damage-restoration";

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
