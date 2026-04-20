import type { Metadata } from "next";
import { NY_CONFIG } from "@/lib/site-config";
import ContactPage from "@/components/pages/ContactPage";

export const metadata: Metadata = {
  title: `Contact & Emergency Help | ${NY_CONFIG.siteName} | ${NY_CONFIG.serviceAreaLabel}`,
  description: `24/7 emergency property damage restoration. Call ${NY_CONFIG.phone} or submit our online form. Serving ${NY_CONFIG.serviceAreaLabel}.`,
};

export default function Page() {
  return <ContactPage config={NY_CONFIG} />;
}
