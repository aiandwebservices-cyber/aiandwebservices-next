"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { SiteConfig } from "@/lib/site-config";
import { trackEvent } from "@/components/analytics/track";

// Service detail pages used by both desktop dropdown and mobile expand.
// FL and NY both have all six pages — the only difference is the URL prefix.
const SERVICE_LABEL_AND_SLUG: { label: string; slug: string }[] = [
  { label: "Water Damage Restoration", slug: "water-damage-restoration" },
  { label: "Fire & Smoke Damage", slug: "fire-damage-restoration" },
  { label: "Mold Remediation", slug: "mold-remediation" },
  { label: "Storm & Wind Damage", slug: "storm-damage-repair" },
  { label: "Sewage & Biohazard", slug: "biohazard-cleanup" },
  { label: "Reconstruction & Rebuild", slug: "reconstruction-rebuild" },
];

function serviceLinksFor(basePath: string) {
  return SERVICE_LABEL_AND_SLUG.map(s => ({
    label: s.label,
    href: `${basePath}/services/${s.slug}`,
  }));
}

export default function Header({ config }: { config: SiteConfig }) {
  const basePath = config.location === 'newYork' ? '/ny' : '';
  const [open, setOpen] = useState(false);
  const [servicesExpanded, setServicesExpanded] = useState(false);
  const pathname = usePathname();
  const serviceLinks = serviceLinksFor(basePath);

  // Body scroll lock while mobile menu is open.
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = prev; };
    }
  }, [open]);

  // Auto-close menu when navigating to a new route.
  useEffect(() => {
    setOpen(false);
    setServicesExpanded(false);
  }, [pathname]);

  function closeMenu() {
    setOpen(false);
    setServicesExpanded(false);
  }

  const servicesActive = pathname === `${basePath}/services` || pathname.startsWith(`${basePath}/services/`);

  return (
    <header style={{ background: "var(--navy)", position: "sticky", top: 0, zIndex: 50, boxShadow: "0 2px 8px rgba(0,0,0,0.3)" }}>
      {/* Top bar */}
      <div style={{ background: "var(--red)", padding: "0.35rem 1rem", textAlign: "center", fontSize: "0.85rem", color: "#fff", fontWeight: 600, fontFamily: "Montserrat, sans-serif" }}>
        🚨 24/7 Emergency Response{config.showSpanishBadge ? ' — Se Habla Español' : ''}
      </div>

      <div style={{ padding: "0 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
        {/* Logo */}
        <Link href={`${basePath}/`} style={{ textDecoration: "none", display: "flex", alignItems: "center" }}>
          <Image src="/logo-icon-transparent.png" alt="Mitigation Restoration Services" width={40} height={48} style={{ filter: "drop-shadow(0 1px 4px rgba(0,0,0,0.4))" }} priority />
          <span style={{ marginLeft: "0.5rem", color: "#fff", fontFamily: "Montserrat, sans-serif", fontWeight: 800, fontSize: "0.9rem", lineHeight: 1.2, display: "none" }} className="logo-text">
            Mitigation<br />Restoration Services
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav style={{ gap: "1.5rem", alignItems: "center" }} className="hidden-mobile">
          <NavLink href={`${basePath}/`} active={pathname === `${basePath}/` || pathname === basePath}>Home</NavLink>

          <div className="svc-dd">
            <Link
              href={`${basePath}/services`}
              className={`svc-dd-trigger${servicesActive ? " is-active" : ""}`}
            >
              Services
              <span className="svc-dd-chevron" aria-hidden="true">▾</span>
            </Link>
            <div className="svc-dd-panel" role="menu" aria-label="Service categories">
              {serviceLinks.map(s => (
                <Link key={s.href} href={s.href} className="svc-dd-item" role="menuitem">
                  {s.label}
                </Link>
              ))}
            </div>
          </div>

          <NavLink href={`${basePath}/service-areas`} active={pathname === `${basePath}/service-areas`}>Service Areas</NavLink>
          <NavLink href={`${basePath}/about`} active={pathname === `${basePath}/about`}>About</NavLink>
          <NavLink href={`${basePath}/faq`} active={pathname === `${basePath}/faq`}>FAQ</NavLink>
          <NavLink href={`${basePath}/contact`} active={pathname === `${basePath}/contact`}>Contact</NavLink>
        </nav>

        {/* Desktop CTA */}
        <div style={{ alignItems: "center" }} className="hidden-mobile">
          <Link href={`${basePath}/contact`} className="btn-red" style={{ padding: "0.5rem 1rem", fontSize: "0.875rem" }} onClick={() => trackEvent("cta_header_click")}>Get Help Now</Link>
        </div>

        {/* Mobile: hamburger */}
        <div style={{ alignItems: "center" }} className="show-mobile">
          <button
            type="button"
            onClick={() => setOpen(o => !o)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="ham-btn"
          >
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              {open
                ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
                : <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>
              }
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu — overlay panel + dimmed backdrop */}
      {open && (
        <>
          <div
            className="mob-backdrop"
            onClick={closeMenu}
            aria-hidden="true"
          />
          <nav className="mob-panel" aria-label="Site navigation">
            <Link href={`${basePath}/`} onClick={closeMenu} className="mob-link">Home</Link>

            <button
              type="button"
              className="mob-link mob-svc-toggle"
              onClick={() => setServicesExpanded(e => !e)}
              aria-expanded={servicesExpanded}
            >
              <span>Services</span>
              <span className={`mob-chevron${servicesExpanded ? " is-open" : ""}`} aria-hidden="true">▾</span>
            </button>
            {servicesExpanded && (
              <div className="mob-sublist">
                {serviceLinks.map(s => (
                  <Link key={s.href} href={s.href} onClick={closeMenu} className="mob-sublink">
                    {s.label}
                  </Link>
                ))}
                <Link href={`${basePath}/services`} onClick={closeMenu} className="mob-sublink mob-sublink-overview">
                  View overview →
                </Link>
              </div>
            )}

            <Link href={`${basePath}/service-areas`} onClick={closeMenu} className="mob-link">Service Areas</Link>
            <Link href={`${basePath}/about`} onClick={closeMenu} className="mob-link">About</Link>
            <Link href={`${basePath}/faq`} onClick={closeMenu} className="mob-link">FAQ</Link>
            <Link href={`${basePath}/contact`} onClick={closeMenu} className="mob-link">Contact</Link>

            <Link
              href={`${basePath}/contact`}
              className="btn-red mob-cta"
              onClick={() => { trackEvent("cta_header_click"); closeMenu(); }}
            >
              Get Help Now →
            </Link>
          </nav>
        </>
      )}

      <style>{`
        .hidden-mobile { display: flex; }
        .show-mobile { display: none; }
        @media (max-width: 768px) {
          .hidden-mobile { display: none; }
          .show-mobile { display: flex; }
        }

        /* Hamburger — generous tap target, no tap highlight on touch */
        .ham-btn {
          background: none;
          border: none;
          color: #fff;
          cursor: pointer;
          padding: 10px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          -webkit-tap-highlight-color: transparent;
          touch-action: manipulation;
        }
        .ham-btn:focus-visible { outline: 2px solid var(--red); outline-offset: 2px; border-radius: 4px; }

        /* Desktop services dropdown — CSS-only hover, no JS needed */
        .svc-dd { position: relative; display: inline-flex; align-items: center; }
        .svc-dd-trigger {
          text-decoration: none;
          font-family: Montserrat, sans-serif;
          font-weight: 600;
          font-size: 0.9rem;
          color: #e2e8f0;
          border: 2px solid transparent;
          border-radius: 99px;
          padding: 0.2rem 0.75rem;
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          transition: color 0.15s ease, border-color 0.15s ease;
        }
        .svc-dd-trigger:hover { color: #fff; border-color: rgba(255,255,255,0.2); }
        .svc-dd-trigger.is-active { color: #fff; border-color: var(--red); }
        .svc-dd-chevron { font-size: 0.7rem; line-height: 1; transition: transform 0.15s ease; }
        .svc-dd:hover .svc-dd-chevron,
        .svc-dd:focus-within .svc-dd-chevron { transform: rotate(180deg); }

        .svc-dd-panel {
          position: absolute;
          top: calc(100% + 6px);
          left: 0;
          background: #0f1a33;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 8px;
          box-shadow: 0 10px 32px rgba(0,0,0,0.45);
          padding: 8px;
          min-width: 240px;
          opacity: 0;
          visibility: hidden;
          transform: translateY(-4px);
          transition: opacity 150ms ease, visibility 150ms ease, transform 150ms ease;
          z-index: 60;
        }
        .svc-dd:hover .svc-dd-panel,
        .svc-dd:focus-within .svc-dd-panel {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }
        .svc-dd-item {
          display: block;
          padding: 8px 12px;
          font-family: Montserrat, sans-serif;
          font-size: 14px;
          color: #e2e8f0;
          font-weight: 600;
          text-decoration: none;
          border-radius: 4px;
          transition: background-color 0.1s ease, color 0.1s ease;
        }
        .svc-dd-item:hover, .svc-dd-item:focus { background: rgba(255,255,255,0.08); color: #fff; outline: none; }

        /* Mobile menu overlay */
        .mob-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.55);
          z-index: 49;
          animation: mobFade 150ms ease both;
        }
        .mob-panel {
          position: fixed;
          top: 0;
          right: 0;
          bottom: 0;
          width: min(320px, 88vw);
          background: #162038;
          z-index: 51;
          padding: 5rem 1.25rem 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          overflow-y: auto;
          animation: mobSlide 220ms ease both;
          -webkit-overflow-scrolling: touch;
          font-family: Montserrat, sans-serif;
        }
        @keyframes mobFade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes mobSlide { from { transform: translateX(100%); } to { transform: translateX(0); } }

        .mob-link, .mob-svc-toggle {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: none;
          border: none;
          color: #fff;
          text-decoration: none;
          font-weight: 600;
          font-size: 1rem;
          padding: 0.85rem 0.25rem;
          border-bottom: 1px solid rgba(255,255,255,0.1);
          width: 100%;
          text-align: left;
          cursor: pointer;
          font-family: inherit;
          -webkit-tap-highlight-color: transparent;
        }
        .mob-link:active, .mob-svc-toggle:active { background: rgba(255,255,255,0.05); }

        .mob-chevron { font-size: 0.85rem; line-height: 1; transition: transform 150ms ease; opacity: 0.85; }
        .mob-chevron.is-open { transform: rotate(180deg); }

        .mob-sublist {
          display: flex;
          flex-direction: column;
          padding: 0.25rem 0 0.5rem 0.75rem;
          margin-bottom: 0.25rem;
        }
        .mob-sublink {
          color: #c8d4e8;
          text-decoration: none;
          font-weight: 500;
          font-size: 0.92rem;
          padding: 0.65rem 0.5rem;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          -webkit-tap-highlight-color: transparent;
        }
        .mob-sublink:active { background: rgba(255,255,255,0.05); }
        .mob-sublink-overview {
          color: #fff;
          font-weight: 600;
          font-size: 0.85rem;
          border-bottom: none;
          padding-top: 0.85rem;
        }

        .mob-cta {
          text-align: center;
          margin-top: 1rem;
        }
      `}</style>
    </header>
  );
}

function NavLink({ href, children, active }: { href: string; children: React.ReactNode; active?: boolean }) {
  return (
    <Link href={href} style={{
      textDecoration: "none",
      fontFamily: "Montserrat, sans-serif",
      fontWeight: 600,
      fontSize: "0.9rem",
      transition: "color 0.2s",
      color: active ? "#fff" : "#e2e8f0",
      border: active ? "2px solid var(--red)" : "2px solid transparent",
      borderRadius: 99,
      padding: "0.2rem 0.75rem",
    }}
      onMouseOver={e => { e.currentTarget.style.color = "#fff"; if (!active) e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; }}
      onMouseOut={e => { e.currentTarget.style.color = active ? "#fff" : "#e2e8f0"; e.currentTarget.style.borderColor = active ? "var(--red)" : "transparent"; }}>
      {children}
    </Link>
  );
}
