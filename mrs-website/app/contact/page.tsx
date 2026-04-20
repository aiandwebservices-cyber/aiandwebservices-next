import type { Metadata } from "next";
import { FL_CONFIG } from "@/lib/site-config";
import ContactPage from "@/components/pages/ContactPage";

export const metadata: Metadata = {
  title: `Contact & Emergency Help | ${FL_CONFIG.siteName} | ${FL_CONFIG.serviceAreaLabel}`,
  description: `24/7 emergency property damage restoration. Call ${FL_CONFIG.phone} or submit our online form. Serving ${FL_CONFIG.serviceAreaLabel}.`,
};

export default function Page() {
  return <ContactPage config={FL_CONFIG} />;
}
