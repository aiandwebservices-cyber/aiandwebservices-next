import type { Metadata } from "next";
import { FL_CONFIG } from "@/lib/site-config";
import ServiceAreasPage from "@/components/pages/ServiceAreasPage";
import { FL_SERVICE_AREAS } from "@/lib/service-areas";

const URL = "https://mitigationrestorationservice.com/service-areas";

const HERO =
  "Mitigation Restoration Services responds across South Florida from Boca Raton south through Broward County to Miami-Dade. Wherever you're located in our service area, our team arrives fast — average response time under 60 minutes for emergency calls. Below is a closer look at the areas we serve, the building types we see most often, and the damage patterns specific to each.";

export const metadata: Metadata = {
  title: "Service Areas — South Florida | MRS",
  description: "Mitigation Restoration Services across South Florida — Boca Raton, Fort Lauderdale, Miami, Coral Gables, Homestead, and surrounding communities. 24/7 emergency response.",
  alternates: { canonical: URL },
  openGraph: {
    title: "Service Areas — South Florida | MRS",
    description: "Restoration services across South Florida — Boca Raton through Miami-Dade. 24/7.",
    url: URL,
    type: "website",
  },
};

export default function Page() {
  return (
    <ServiceAreasPage
      config={FL_CONFIG}
      title="Service Areas — South Florida"
      heroIntro={HERO}
      areas={FL_SERVICE_AREAS}
    />
  );
}
