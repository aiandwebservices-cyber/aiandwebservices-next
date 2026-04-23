import type { Metadata } from "next";
import { FL_CONFIG } from "@/lib/site-config";
import ServicesPage from "@/components/pages/ServicesPage";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

export const metadata: Metadata = {
  title: `Restoration Services | ${FL_CONFIG.siteName} | ${FL_CONFIG.serviceAreaLabel}`,
  description: `Water damage, fire & smoke, mold remediation, storm damage, biohazard cleanup & reconstruction services in ${FL_CONFIG.serviceAreaLabel}. 24/7 response.`,
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
