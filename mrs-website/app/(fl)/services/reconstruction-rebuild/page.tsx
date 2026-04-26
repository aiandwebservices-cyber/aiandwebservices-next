import type { Metadata } from "next";
import ServiceDetailPage from "@/components/pages/ServiceDetailPage";
import { FL_SERVICE_DETAILS_BY_SLUG } from "@/lib/services-fl-detail";

/*
  PHOTO TODO — reconstruction-rebuild
    1. /photos/kitchen-after.jpeg
       (already exists; used as hero photo-1)
    2. /photos/services/reconstruction-rebuild/photo-2.jpg
       Source: Pexels search "drywall installation"
    3. /photos/services/reconstruction-rebuild/photo-3.jpg
       Source: Unsplash search "home renovation interior finish"
*/

const detail = FL_SERVICE_DETAILS_BY_SLUG["reconstruction-rebuild"];
const URL = "https://mitigationrestorationservice.com/services/reconstruction-rebuild";

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
