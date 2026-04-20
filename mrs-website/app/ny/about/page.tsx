import type { Metadata } from "next";
import { NY_CONFIG } from "@/lib/site-config";
import AboutPage from "@/components/pages/AboutPage";

export const metadata: Metadata = {
  title: `About Us | ${NY_CONFIG.siteName} | ${NY_CONFIG.serviceAreaLabel}`,
  description: `Licensed, IICRC-certified ${NY_CONFIG.serviceAreaLabel} restoration experts. ${NY_CONFIG.serviceAreaCities.slice(0, 3).join(', ')} and surrounding areas.`,
};

export default function Page() {
  return <AboutPage config={NY_CONFIG} />;
}
