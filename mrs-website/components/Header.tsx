"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { SiteConfig } from "@/lib/site-config";

export default function Header({ config }: { config: SiteConfig }) {
  const basePath = config.location === 'newYork' ? '/ny' : '';
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header style={{ background: "var(--navy)", position: "sticky", top: 0, zIndex: 50, boxShadow: "0 2px 8px rgba(0,0,0,0.3)" }}>
      {/* Top bar */}
      <div style={{ background: "var(--red)", padding: "0.35rem 1rem", textAlign: "center", fontSize: "0.85rem", color: "#fff", fontWeight: 600, fontFamily: "Montserrat, sans-serif" }}>
        🚨 24/7 Emergency Response{config.showSpanishBadge ? ' — Se Habla Español' : ''}
      </div>

      <div style={{ padding: "0 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
        {/* Logo */}
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center" }} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          <Image src="/logo-icon-transparent.png" alt="Mitigation Restoration Services" width={40} height={48} style={{ filter: "drop-shadow(0 1px 4px rgba(0,0,0,0.4))" }} priority />
          <span style={{ marginLeft: "0.5rem", color: "#fff", fontFamily: "Montserrat, sans-serif", fontWeight: 800, fontSize: "0.9rem", lineHeight: 1.2, display: "none" }} className="logo-text">
            Mitigation<br />Restoration Services
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav style={{ gap: "1.5rem", alignItems: "center" }} className="hidden-mobile">
          <NavLink href={`${basePath}/`} active={pathname === `${basePath}/` || pathname === basePath}>Home</NavLink>
          <NavLink href={`${basePath}/services`} active={pathname === `${basePath}/services`}>Services</NavLink>
          <NavLink href={`${basePath}/about`} active={pathname === `${basePath}/about`}>About</NavLink>
          <NavLink href={`${basePath}/faq`} active={pathname === `${basePath}/faq`}>FAQ</NavLink>
          <NavLink href={`${basePath}/contact`} active={pathname === `${basePath}/contact`}>Contact</NavLink>
        </nav>

        {/* Desktop CTA */}
        <div style={{ alignItems: "center" }} className="hidden-mobile">
          <Link href={`${basePath}/contact`} className="btn-red" style={{ padding: "0.5rem 1rem", fontSize: "0.875rem" }}>Get Help Now</Link>
        </div>

        {/* Mobile: hamburger */}
        <div style={{ alignItems: "center" }} className="show-mobile">
          <button onClick={() => setOpen(!open)} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", padding: 4 }} aria-label="Menu">
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              {open
                ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
                : <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>
              }
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div style={{ background: "#162038", padding: "1rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {([["Home", `${basePath}/`], ["Services", `${basePath}/services`], ["About", `${basePath}/about`], ["FAQ", `${basePath}/faq`], ["Contact", `${basePath}/contact`]] as [string, string][]).map(([label, href]) => (
            <Link key={href} href={href} onClick={() => setOpen(false)}
              style={{ color: pathname === href ? "var(--red)" : "#fff", textDecoration: "none", fontFamily: "Montserrat, sans-serif", fontWeight: 600, fontSize: "1rem", padding: "0.4rem 0", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
              {label}{pathname === href ? " •" : ""}
            </Link>
          ))}
          <Link href={`${basePath}/contact`} className="btn-red" style={{ textAlign: "center", marginTop: "0.5rem" }} onClick={() => setOpen(false)}>
            Get Help Now →
          </Link>
        </div>
      )}

      <style>{`
        .hidden-mobile { display: flex; }
        .show-mobile { display: none; }
        @media (max-width: 768px) {
          .hidden-mobile { display: none; }
          .show-mobile { display: flex; }
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
