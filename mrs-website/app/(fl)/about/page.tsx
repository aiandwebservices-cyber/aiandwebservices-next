import type { Metadata } from "next";
import { FL_CONFIG } from "@/lib/site-config";
import AboutPage from "@/components/pages/AboutPage";

export const metadata: Metadata = {
  title: `About Us | ${FL_CONFIG.siteName} | ${FL_CONFIG.serviceAreaLabel}`,
  description: `Licensed, IICRC-certified ${FL_CONFIG.serviceAreaLabel} restoration experts. ${FL_CONFIG.serviceAreaCities.slice(0, 3).join(', ')} and surrounding areas.`,
};

export default function Page() {
  return <AboutPage config={FL_CONFIG} />;
}
