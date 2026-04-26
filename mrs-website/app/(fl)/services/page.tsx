import type { Metadata } from "next";
import { FL_CONFIG } from "@/lib/site-config";
import ServicesPage from "@/components/pages/ServicesPage";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import { FL_SERVICE_DETAILS } from "@/lib/services-fl-detail";

export const metadata: Metadata = {
  title: "Restoration Services — Water, Fire, Mold, Storm, Biohazard, Rebuild | South Florida | MRS",
  description: `Hub for all ${FL_CONFIG.serviceAreaLabel} restoration services from Mitigation Restoration Services — water damage, fire & smoke, mold, hurricane & storm, biohazard, and post-damage reconstruction. 24/7.`,
  alternates: { canonical: "https://mitigationrestorationservice.com/services" },
};

const BASE = "https://mitigationrestorationservice.com";

// Map each FL service id (matching FL_CONFIG.services) to its dedicated
// detail-page URL. Passed to ServicesPage so each in-page section also
// links out to the deeper guide. Slugs come from lib/services-fl-detail.ts.
const FL_SERVICE_ID_TO_SLUG: Record<string, string> = {
  water: "water-damage-restoration",
  fire: "fire-damage-restoration",
  mold: "mold-remediation",
  storm: "storm-damage-repair",
  biohazard: "biohazard-cleanup",
  reconstruction: "reconstruction-rebuild",
};

const FL_DETAIL_LINKS: Record<string, string> = Object.fromEntries(
  FL_SERVICE_DETAILS.map(s => {
    const id = Object.entries(FL_SERVICE_ID_TO_SLUG).find(([, slug]) => slug === s.slug)?.[0];
    return id ? [id, `/services/${s.slug}`] : ["", ""];
  }).filter(([k]) => k)
);

export default function Page() {
  return (
    <>
      <BreadcrumbSchema items={[{ name: "Home", item: BASE }, { name: "Services", item: `${BASE}/services` }]} />
      <ServicesPage config={FL_CONFIG} detailLinks={FL_DETAIL_LINKS} />
    </>
  );
}
