import Link from "next/link";
import Image from "next/image";
import type { SiteConfig } from "@/lib/site-config";

export default function Footer({ config }: { config: SiteConfig }) {
  return (
    <footer style={{ background: "var(--navy)", color: "#e2e8f0" }}>
      {/* Emergency bar */}
      <div style={{ background: "var(--red)", padding: "1.25rem 1rem", textAlign: "center" }}>
        <p style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "1rem", color: "#fff", margin: 0 }}>
          24/7 Emergency Response — Call Now:&nbsp;
          <a href={config.phoneHref} style={{ color: "#fff", textDecoration: "underline", fontSize: "1.2rem" }}>{config.phone}</a>
        </p>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "3rem 1.5rem 2rem", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "2rem" }}>
        {/* Brand */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
            <Image src="/logo-icon-transparent.png" alt="Mitigation Restoration Services" width={52} height={62} style={{ filter: "drop-shadow(0 1px 4px rgba(0,0,0,0.4))" }} />
            <span style={{ color: "#fff", fontFamily: "Montserrat, sans-serif", fontWeight: 800, fontSize: "0.95rem", lineHeight: 1.3, textTransform: "uppercase", letterSpacing: "0.04em" }}>
              Mitigation<br />Restoration Services
            </span>
          </div>
          <p style={{ fontSize: "0.875rem", lineHeight: 1.6, color: "#a0aec0", marginBottom: "0.75rem" }}>
            {config.siteName} — {config.footerTagline}
          </p>
          <div style={{ display: "inline-block", background: "var(--red)", color: "#fff", padding: "0.3rem 0.75rem", borderRadius: 4, fontSize: "0.8rem", fontWeight: 700, fontFamily: "Montserrat, sans-serif" }}>
            Se Habla Español
          </div>
        </div>

        {/* Services */}
        <div>
          <h4 style={{ color: "#fff", fontSize: "0.95rem", marginBottom: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Services</h4>
          {["Water Damage", "Fire & Smoke", "Mold Remediation", "Storm Damage", "Biohazard Cleanup", "Reconstruction"].map(s => (
            <Link key={s} href="/services" className="footer-link">
              {s}
            </Link>
          ))}
        </div>

        {/* Quick Links */}
        <div>
          <h4 style={{ color: "#fff", fontSize: "0.95rem", marginBottom: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Company</h4>
          {([["About Us", "/about"], ["FAQ", "/faq"], ["Contact", "/contact"], ["Emergency Help", "/contact"]] as [string, string][]).map(([label, href]) => (
            <Link key={label} href={href} className="footer-link">
              {label}
            </Link>
          ))}
        </div>

        {/* Contact */}
        <div>
          <h4 style={{ color: "#fff", fontSize: "0.95rem", marginBottom: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Contact</h4>
          <a href={config.phoneHref} style={{ display: "block", color: "var(--red)", fontWeight: 800, fontSize: "1.2rem", fontFamily: "Montserrat, sans-serif", textDecoration: "none", marginBottom: "0.5rem" }}>{config.phone}</a>
          <a href={`mailto:${config.email}`} style={{ display: "block", color: "#a0aec0", fontSize: "0.8rem", textDecoration: "none", marginBottom: "0.5rem" }}>{config.email}</a>
          {config.addressOneLiner && (
            <p style={{ fontSize: "0.875rem", color: "#a0aec0", marginBottom: "0.25rem" }}>{config.addressOneLiner}</p>
          )}
          <p style={{ fontSize: "0.875rem", color: "#a0aec0", marginBottom: "0.25rem" }}>Hours: 24/7 — Always Open</p>
          <p style={{ fontSize: "0.8rem", color: "#718096" }}>
            {config.licenseNumbers ? `${config.licenseNumbers.join(' | ')} | ` : ''}IICRC Certified
          </p>
        </div>
      </div>

      <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", maxWidth: 1200, margin: "0 auto", padding: "1.25rem 1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
        <p style={{ fontSize: "0.8rem", color: "#718096", margin: 0 }}>
          © {new Date().getFullYear()} {config.siteName}. All rights reserved. Licensed &amp; Insured.
        </p>
        <p style={{ fontSize: "0.8rem", color: "#718096", margin: 0 }}>
          {config.footerServiceAreaLine}
        </p>
      </div>
    </footer>
  );
}
