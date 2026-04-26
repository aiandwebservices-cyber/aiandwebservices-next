import type { Metadata } from "next";
import { NY_CONFIG } from "@/lib/site-config";
import ServiceAreasPage from "@/components/pages/ServiceAreasPage";
import { NY_SERVICE_AREAS } from "@/lib/service-areas";

const URL = "https://mitigationrestorationservice.com/ny/service-areas";

const HERO =
  "Mitigation Restoration Services responds across all five boroughs of New York City. From pre-war Manhattan apartment buildings to single-family homes in Staten Island, the building stock and damage patterns vary widely across NYC — and our crews understand the differences. Below is a closer look at each borough, the buildings we work in most often, and the damage types we see most commonly.";

export const metadata: Metadata = {
  title: "Service Areas — New York | MRS",
  description: "Mitigation Restoration Services across all five NYC boroughs — Manhattan, Brooklyn, Queens, The Bronx, and Staten Island. 24/7 emergency response.",
  alternates: { canonical: URL },
  openGraph: {
    title: "Service Areas — New York | MRS",
    description: "Restoration services across all five NYC boroughs. 24/7.",
    url: URL,
    type: "website",
  },
};

export default function Page() {
  return (
    <ServiceAreasPage
      config={NY_CONFIG}
      title="Service Areas — New York"
      heroIntro={HERO}
      areas={NY_SERVICE_AREAS}
    />
  );
}
