import type { Metadata } from "next";
import ServiceDetailPage from "@/components/pages/ServiceDetailPage";
import { FL_SERVICE_DETAILS_BY_SLUG } from "@/lib/services-fl-detail";

/*
  PHOTO TODO — biohazard-cleanup
    1. /photos/services/bio-spray.jpg
       (already exists; used as hero photo-1)
    2. /photos/services/biohazard-cleanup/photo-2.jpg
       Source: Pexels search "biohazard cleanup PPE"
    3. /photos/services/biohazard-cleanup/photo-3.jpg
       Source: Pixabay search "hazmat disinfection"
*/

const detail = FL_SERVICE_DETAILS_BY_SLUG["biohazard-cleanup"];
const URL = "https://mitigationrestorationservice.com/services/biohazard-cleanup";

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
