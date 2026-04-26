"use client";
import { useEffect } from "react";
import { trackEvent } from "./track";

// Global click delegation for tel: links. One listener at the document root
// catches every phone click site-wide (header, hero, footer, contact page,
// inline links inside paragraphs) without per-link wiring. Fires on mobile
// (where the tap actually opens the dialer) and desktop (where most clicks
// are accidental but still meaningful as engagement signal).
export default function PhoneClickTracker() {
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const link = target.closest('a[href^="tel:"]') as HTMLAnchorElement | null;
      if (!link) return;
      trackEvent("phone_click", {
        phone_href: link.getAttribute("href") ?? "",
      });
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
