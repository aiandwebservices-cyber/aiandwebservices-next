import Link from "next/link";
import type { SiteConfig } from "@/lib/site-config";

function FAQItem({ q, a }: { q: string; a: string }) {
  return (
    <details className="faq-item">
      <summary className="faq-summary">
        <span className="faq-q">{q}</span>
        <span aria-hidden="true" className="faq-icon">+</span>
      </summary>
      <div className="faq-answer">
        <div className="faq-answer-inner">
          <p className="faq-a">{a}</p>
        </div>
      </div>
    </details>
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

      <style>{`
        .faq-item { border-bottom: 1px solid var(--gray-light); }
        .faq-summary {
          list-style: none;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
          min-height: 56px;
          padding: 12px 16px;
          border-radius: 6px;
          transition: background-color 0.15s ease;
          user-select: none;
          -webkit-tap-highlight-color: transparent;
        }
        .faq-summary::-webkit-details-marker { display: none; }
        .faq-summary::marker { content: ""; }
        .faq-summary:focus-visible { outline: 2px solid var(--red); outline-offset: 2px; }
        .faq-q {
          font-family: Montserrat, sans-serif;
          font-weight: 700;
          color: var(--navy);
          font-size: 1rem;
          line-height: 1.4;
          flex: 1 1 auto;
        }
        .faq-icon {
          color: var(--red);
          font-size: 1.5rem;
          flex-shrink: 0;
          transition: transform 0.2s ease;
          line-height: 1;
          font-weight: 400;
        }
        .faq-item[open] .faq-icon { transform: rotate(45deg); }

        .faq-answer-inner {
          padding: 0 16px 16px 16px;
        }
        .faq-a {
          color: var(--gray-mid);
          line-height: 1.6;
          margin: 0;
          font-size: 16px;
        }

        @media (min-width: 769px) {
          .faq-summary { min-height: 48px; padding: 10px 24px; }
          .faq-summary:hover { background-color: rgba(0, 0, 0, 0.025); }
          .faq-q { font-size: 1.05rem; }
          .faq-answer-inner { padding: 0 24px 18px 24px; }
          .faq-a { font-size: 17px; max-width: 70ch; }
        }
      `}</style>
    </>
  );
}
