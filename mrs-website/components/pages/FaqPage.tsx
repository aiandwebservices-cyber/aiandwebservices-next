"use client";
import { useState } from "react";
import Link from "next/link";
import type { SiteConfig } from "@/lib/site-config";

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid var(--gray-light)" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{ width: "100%", background: "none", border: "none", padding: "1.1rem 0", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", textAlign: "left", gap: "1rem" }}>
        <span style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "0.95rem", color: "var(--navy)" }}>{q}</span>
        <span style={{ color: "var(--red)", fontSize: "1.25rem", flexShrink: 0, transition: "transform 0.2s", transform: open ? "rotate(45deg)" : "none" }}>+</span>
      </button>
      {open && (
        <div style={{ paddingBottom: "1.1rem", paddingRight: "2rem" }}>
          <p style={{ color: "var(--gray-mid)", lineHeight: 1.7, margin: 0, fontSize: "0.9rem" }}>{a}</p>
        </div>
      )}
    </div>
  );
}

export default function FaqPage({ config }: { config: SiteConfig }) {
  const basePath = config.location === 'newYork' ? '/ny' : '';

  return (
    <>
      <section style={{ background: "var(--navy)", padding: "3.5rem 1.5rem", textAlign: "center" }}>
        <h1 style={{ color: "#fff", fontSize: "clamp(1.75rem, 4vw, 2.75rem)", marginBottom: "0.75rem" }}>Frequently Asked Questions</h1>
        <p style={{ color: "#a0c4ff", maxWidth: 520, margin: "0 auto" }}>
          {config.faqHeroSubhead}
        </p>
      </section>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "3rem 1.5rem" }}>
        {config.faqItems.map(f => <FAQItem key={f.q} q={f.q} a={f.a} />)}

        <div style={{ marginTop: "3rem", background: "var(--off-white)", borderRadius: 10, padding: "2rem", textAlign: "center" }}>
          <h2 style={{ color: "var(--navy)", fontSize: "1.3rem", marginBottom: "0.75rem" }}>Still Have Questions?</h2>
          <p style={{ color: "var(--gray-mid)", marginBottom: "1.25rem", fontSize: "0.9rem" }}>We&apos;re available 24/7 — call us or submit a request online.</p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <a href={config.phoneHref} className="btn-red">Call {config.phone}</a>
            <Link href={`${basePath}/contact`} style={{ background: "var(--navy)", color: "#fff", padding: "0.75rem 1.5rem", borderRadius: 6, fontWeight: 700, fontFamily: "Montserrat, sans-serif", textDecoration: "none" }}>
              Submit a Request
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
