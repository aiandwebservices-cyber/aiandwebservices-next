import type { Metadata } from "next";
import { NY_CONFIG } from "@/lib/site-config";
import ServicesPage from "@/components/pages/ServicesPage";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

export const metadata: Metadata = {
  title: `Restoration Services | ${NY_CONFIG.siteName} | ${NY_CONFIG.serviceAreaLabel}`,
  description: `Water damage, fire & smoke, mold remediation, storm damage, biohazard cleanup & reconstruction services in ${NY_CONFIG.serviceAreaLabel}. 24/7 response.`,
};

const BASE = "https://mitigationrestorationservice.com";

export default function Page() {
  return (
    <>
      <BreadcrumbSchema items={[{ name: "Home", item: `${BASE}/ny` }, { name: "Services", item: `${BASE}/ny/services` }]} />
      <ServicesPage config={NY_CONFIG} />
    </>
  );
}
