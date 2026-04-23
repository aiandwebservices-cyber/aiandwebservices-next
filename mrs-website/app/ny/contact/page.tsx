import type { Metadata } from "next";
import { NY_CONFIG } from "@/lib/site-config";
import ContactPage from "@/components/pages/ContactPage";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

export const metadata: Metadata = {
  title: `Contact & Emergency Help | ${NY_CONFIG.siteName} | ${NY_CONFIG.serviceAreaLabel}`,
  description: `24/7 emergency property damage restoration. Call ${NY_CONFIG.phone} or submit our online form. Serving ${NY_CONFIG.serviceAreaLabel}.`,
};

const BASE = "https://mitigationrestorationservice.com";

export default function Page() {
  return (
    <>
      <BreadcrumbSchema items={[{ name: "Home", item: `${BASE}/ny` }, { name: "Contact", item: `${BASE}/ny/contact` }]} />
      <ContactPage config={NY_CONFIG} />
    </>
  );
}
