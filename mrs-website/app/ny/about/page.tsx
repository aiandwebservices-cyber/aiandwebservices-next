import type { Metadata } from "next";
import { NY_CONFIG } from "@/lib/site-config";
import AboutPage from "@/components/pages/AboutPage";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

export const metadata: Metadata = {
  title: `About Us | ${NY_CONFIG.siteName} | ${NY_CONFIG.serviceAreaLabel}`,
  description: `Licensed, IICRC-certified ${NY_CONFIG.serviceAreaLabel} restoration experts. ${NY_CONFIG.serviceAreaCities.slice(0, 3).join(', ')} and surrounding areas.`,
};

const BASE = "https://mitigationrestorationservice.com";

export default function Page() {
  return (
    <>
      <BreadcrumbSchema items={[{ name: "Home", item: `${BASE}/ny` }, { name: "About", item: `${BASE}/ny/about` }]} />
      <AboutPage config={NY_CONFIG} />
    </>
  );
}
