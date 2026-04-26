"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import type { SiteConfig } from "@/lib/site-config";
import { trackEvent } from "@/components/analytics/track";

// Mobile-only sticky call bar. Fades in after 200px scroll. Two halves:
// 60% phone CTA (uses location-specific number from config), 40% Get Help
// (scrolls to #form on home, navigates to /contact otherwise). Hidden on
// desktop via CSS — the wrapper renders no DOM-visible content above 768px.
//
// Body padding-bottom (64px) is added/removed via the `has-sticky-call`
// class on <body> only when the bar is visible, so short pages don't get
// phantom space at the bottom. The matching CSS rule lives in globals.css.

const SCROLL_THRESHOLD = 200;

export default function StickyCallBar({ config }: { config: SiteConfig }) {
  const [visible, setVisible] = useState(false);
  const pathname = usePathname() ?? "";

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > SCROLL_THRESHOLD);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (visible) {
      document.body.classList.add("has-sticky-call");
    } else {
      document.body.classList.remove("has-sticky-call");
    }
    return () => document.body.classList.remove("has-sticky-call");
  }, [visible]);

  const basePath = config.location === "newYork" ? "/ny" : "";
  const isHome = pathname === "/" || pathname === "/ny" || pathname === "/ny/";
  const getHelpHref = isHome ? "#form" : `${basePath}/contact`;

  function onPhoneClick() {
    trackEvent("phone_click", { source: "sticky_bar" });
  }

  function onGetHelpClick(e: React.MouseEvent<HTMLAnchorElement>) {
    trackEvent("cta_sticky_get_help");
    if (isHome) {
      const formEl = document.getElementById("form");
      if (formEl) {
        e.preventDefault();
        formEl.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }

  return (
    <div className={`sticky-call-bar${visible ? " is-visible" : ""}`} aria-hidden={!visible}>
      <a
        href={config.phoneHref}
        onClick={onPhoneClick}
        className="sticky-call-phone"
        aria-label={`Call ${config.phone}`}
      >
        <span className="sticky-call-icon" aria-hidden="true">📞</span>
        <span className="sticky-call-phone-text">
          <span className="sticky-call-label">Call Now</span>
          <span className="sticky-call-number">{config.phone}</span>
        </span>
      </a>
      <Link
        href={getHelpHref}
        onClick={onGetHelpClick}
        className="sticky-call-get-help"
      >
        Get Help
      </Link>
      <style>{`
        .sticky-call-bar { display: none; }
        @media (max-width: 767px) {
          .sticky-call-bar {
            display: flex;
            position: fixed;
            left: 0;
            right: 0;
            bottom: 0;
            height: 64px;
            background: #ffffff;
            border-top: 1px solid var(--gray-light);
            box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.08);
            z-index: 40;
            opacity: 0;
            pointer-events: none;
            transition: opacity 200ms ease;
            font-family: Montserrat, sans-serif;
          }
          .sticky-call-bar.is-visible {
            opacity: 1;
            pointer-events: auto;
          }
          .sticky-call-phone {
            flex: 0 0 60%;
            background: var(--red);
            color: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            text-decoration: none;
            min-height: 64px;
          }
          .sticky-call-phone:active { background: #c43124; }
          .sticky-call-icon { font-size: 18px; }
          .sticky-call-phone-text { display: flex; flex-direction: column; line-height: 1.1; }
          .sticky-call-label {
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            opacity: 0.92;
          }
          .sticky-call-number { font-size: 16px; font-weight: 700; }
          .sticky-call-get-help {
            flex: 0 0 40%;
            background: #fff;
            color: var(--navy);
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 500;
            font-size: 15px;
            text-decoration: none;
            border-left: 1px solid var(--gray-light);
            min-height: 64px;
          }
          .sticky-call-get-help:active { background: #f0f4f9; }
        }
      `}</style>
    </div>
  );
}
