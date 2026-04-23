import type { Metadata } from "next";
import { FL_CONFIG } from "@/lib/site-config";
import AboutPage from "@/components/pages/AboutPage";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

export const metadata: Metadata = {
  title: `About Us | ${FL_CONFIG.siteName} | ${FL_CONFIG.serviceAreaLabel}`,
  description: `Licensed, IICRC-certified ${FL_CONFIG.serviceAreaLabel} restoration experts. ${FL_CONFIG.serviceAreaCities.slice(0, 3).join(', ')} and surrounding areas.`,
};

const BASE = "https://mitigationrestorationservice.com";

export default function Page() {
  return (
    <>
      <BreadcrumbSchema items={[{ name: "Home", item: BASE }, { name: "About", item: `${BASE}/about` }]} />
      <AboutPage config={FL_CONFIG} />
    </>
  );
}
