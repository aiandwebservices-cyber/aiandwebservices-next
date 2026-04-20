import type { Metadata } from "next";
import { NY_CONFIG } from "@/lib/site-config";
import ServicesPage from "@/components/pages/ServicesPage";

export const metadata: Metadata = {
  title: `Restoration Services | ${NY_CONFIG.siteName} | ${NY_CONFIG.serviceAreaLabel}`,
  description: `Water damage, fire & smoke, mold remediation, storm damage, biohazard cleanup & reconstruction services in ${NY_CONFIG.serviceAreaLabel}. 24/7 response.`,
};

export default function Page() {
  return <ServicesPage config={NY_CONFIG} />;
}
