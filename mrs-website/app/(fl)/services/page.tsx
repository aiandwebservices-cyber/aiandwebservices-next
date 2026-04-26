import type { Metadata } from "next";
import { FL_CONFIG } from "@/lib/site-config";
import ServicesPage from "@/components/pages/ServicesPage";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "Restoration Services — Water, Fire, Mold, Storm, Biohazard, Rebuild | South Florida | MRS",
  description: `Hub for all ${FL_CONFIG.serviceAreaLabel} restoration services from Mitigation Restoration Services — water damage, fire & smoke, mold, hurricane & storm, biohazard, and post-damage reconstruction. 24/7.`,
  alternates: { canonical: "https://mitigationrestorationservice.com/services" },
};

const BASE = "https://mitigationrestorationservice.com";

export default function Page() {
  return (
    <>
      <BreadcrumbSchema items={[{ name: "Home", item: BASE }, { name: "Services", item: `${BASE}/services` }]} />
      <ServicesPage config={FL_CONFIG} />
    </>
  );
}
