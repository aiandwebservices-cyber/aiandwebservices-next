import type { Metadata } from "next";
import { FL_CONFIG } from "@/lib/site-config";
import ContactPage from "@/components/pages/ContactPage";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

export const metadata: Metadata = {
  title: `Contact & Emergency Help | ${FL_CONFIG.siteName} | ${FL_CONFIG.serviceAreaLabel}`,
  description: `24/7 emergency property damage restoration. Call ${FL_CONFIG.phone} or submit our online form. Serving ${FL_CONFIG.serviceAreaLabel}.`,
};

const BASE = "https://mitigationrestorationservice.com";

export default function Page() {
  return (
    <>
      <BreadcrumbSchema items={[{ name: "Home", item: BASE }, { name: "Contact", item: `${BASE}/contact` }]} />
      <ContactPage config={FL_CONFIG} />
    </>
  );
}
