"use client";
import { useState } from "react";
import Link from "next/link";
import type { SiteConfig } from "@/lib/site-config";

function FAQItem({ q, a, idx }: { q: string; a: string; idx: number }) {
  const [open, setOpen] = useState(false);
  const qId = `faq-q-${idx}`;
  const aId = `faq-a-${idx}`;
  return (
    <div style={{ borderBottom: "1px solid var(--gray-light)" }}>
      <button
        id={qId}
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        aria-controls={aId}
        className="faq-row"
        style={{ width: "100%", background: "none", border: "none", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", textAlign: "left", gap: "1rem" }}
      >
        <span className="faq-q" style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, color: "var(--navy)" }}>{q}</span>
        <span aria-hidden="true" style={{ color: "var(--red)", fontSize: "1.5rem", flexShrink: 0, transition: "transform 0.2s ease", transform: open ? "rotate(45deg)" : "rotate(0deg)", lineHeight: 1, fontWeight: 400 }}>+</span>
      </button>
      <div
        id={aId}
        role="region"
        aria-labelledby={qId}
        className={`faq-answer${open ? " is-open" : ""}`}
      >
        <div className="faq-answer-inner">
          <p className="faq-a">{a}</p>
        </div>
      </div>
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
        {config.faqItems.map((f, i) => <FAQItem key={f.q} q={f.q} a={f.a} idx={i} />)}

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

      <style>{`
        .faq-row { min-height: 56px; padding: 12px 16px; border-radius: 6px; transition: background-color 0.15s ease; }
        .faq-row:focus-visible { outline: 2px solid var(--red); outline-offset: 2px; }
        .faq-q { font-size: 1rem; line-height: 1.4; }
        .faq-answer { max-height: 0; opacity: 0; overflow: hidden; transition: max-height 200ms ease, opacity 200ms ease; }
        .faq-answer.is-open { max-height: 800px; opacity: 1; }
        .faq-answer-inner { padding: 0 16px 16px 16px; }
        .faq-a { color: var(--gray-mid); line-height: 1.6; margin: 0; font-size: 16px; }
        @media (min-width: 769px) {
          .faq-row { min-height: 48px; padding: 10px 24px; }
          .faq-row:hover { background-color: rgba(0, 0, 0, 0.025); }
          .faq-q { font-size: 1.05rem; }
          .faq-answer-inner { padding: 0 24px 18px 24px; }
          .faq-a { font-size: 17px; max-width: 70ch; }
        }
      `}</style>
    </>
  );
}
