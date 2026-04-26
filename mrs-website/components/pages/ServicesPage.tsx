import Link from "next/link";
import HashScroller from "@/components/HashScroller";
import type { SiteConfig } from "@/lib/site-config";

// Map FL_CONFIG.services / NY_CONFIG.services id → detail-page slug.
// Both routes have all six dedicated detail pages; URLs differ only
// by basePath ("" for FL, "/ny" for NY), so the same map serves both.
const SERVICE_ID_TO_SLUG: Record<string, string> = {
  water: "water-damage-restoration",
  fire: "fire-damage-restoration",
  mold: "mold-remediation",
  storm: "storm-damage-repair",
  biohazard: "biohazard-cleanup",
  reconstruction: "reconstruction-rebuild",
};

export default function ServicesPage({ config }: { config: SiteConfig }) {
  const basePath = config.location === 'newYork' ? '/ny' : '';

  return (
    <>
      <HashScroller />
      {/* Hero */}
      <section style={{ background: "var(--navy)", padding: "3.5rem 1.5rem", textAlign: "center" }}>
        <h1 style={{ color: "#fff", fontSize: "clamp(1.75rem, 4vw, 2.75rem)", marginBottom: "0.75rem" }}>Restoration Services</h1>
        <p style={{ color: "#a0c4ff", fontSize: "1rem", maxWidth: 560, margin: "0 auto 1.5rem" }}>
          {config.servicesSectionSubhead} — 24/7.
        </p>
        <a href={config.phoneHref} className="btn-red" style={{ fontSize: "1rem" }}>📞 {config.phone} — Call Now</a>
      </section>

      {/* Service list */}
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "3rem 1.5rem" }}>
        {config.services.map((s, i) => (
          <section key={s.id} id={s.id} style={{ marginBottom: "3.5rem", paddingBottom: "3.5rem", borderBottom: i < config.services.length - 1 ? "1px solid var(--gray-light)" : "none", scrollMarginTop: "100px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
              <span style={{ fontSize: "2rem" }}>{s.icon}</span>
              <h2 style={{ color: "var(--navy)", fontSize: "1.6rem", margin: 0 }}>{s.title}</h2>
            </div>
            <p style={{ color: "var(--gray-mid)", lineHeight: 1.7, marginBottom: "1.5rem", fontSize: "0.95rem" }}>{s.desc}</p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.25rem" }}>
              <div>
                <h3 style={{ color: "var(--navy)", fontSize: "0.95rem", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.04em" }}>Common Causes</h3>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {s.causes.map(c => (
                    <li key={c} style={{ fontSize: "0.875rem", color: "var(--gray-dark)", padding: "0.2rem 0", paddingLeft: "1rem", position: "relative" }}>
                      <span style={{ position: "absolute", left: 0, color: "var(--red)" }}>›</span>{c}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 style={{ color: "var(--navy)", fontSize: "0.95rem", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.04em" }}>Our Process</h3>
                <ol style={{ paddingLeft: "1.25rem", margin: 0 }}>
                  {s.process.map(p => (
                    <li key={p} style={{ fontSize: "0.875rem", color: "var(--gray-dark)", padding: "0.2rem 0" }}>{p}</li>
                  ))}
                </ol>
              </div>
              <div style={{ background: "#fff8f8", border: "1px solid #fdd", borderRadius: 8, padding: "1rem" }}>
                <h3 style={{ color: "var(--red)", fontSize: "0.875rem", marginBottom: "0.4rem", textTransform: "uppercase", letterSpacing: "0.04em" }}>⏰ When to Call</h3>
                <p style={{ fontSize: "0.875rem", color: "var(--gray-dark)", lineHeight: 1.6, margin: 0 }}>{s.callWhen}</p>
              </div>
            </div>

            {SERVICE_ID_TO_SLUG[s.id] && (
              <p className="svc-learn-more">
                <Link href={`${basePath}/services/${SERVICE_ID_TO_SLUG[s.id]}`} className="svc-learn-more-link">
                  Learn More →
                </Link>
              </p>
            )}
          </section>
        ))}
      </div>

      {/* CTA */}
      <section style={{ background: "var(--red)", padding: "3rem 1.5rem", textAlign: "center" }}>
        <h2 style={{ color: "#fff", marginBottom: "1rem" }}>Need Immediate Help?</h2>
        <a href={config.phoneHref} style={{ background: "#fff", color: "var(--red)", padding: "1rem 2rem", borderRadius: 6, fontWeight: 800, fontSize: "1.2rem", textDecoration: "none", fontFamily: "Montserrat, sans-serif", display: "inline-block", marginRight: "1rem" }}>
          Call {config.phone}
        </a>
        <Link href={`${basePath}/contact`} className="btn-outline" style={{ borderColor: "#fff", color: "#fff" }}>Request Help Online</Link>
      </section>

      <style>{`
        .svc-learn-more { margin-top: 1.25rem; margin-bottom: 0; }
        .svc-learn-more-link {
          display: block;
          color: var(--red);
          font-weight: 700;
          font-size: 16px;
          text-decoration: none;
          padding: 12px 0;
          -webkit-tap-highlight-color: transparent;
        }
        .svc-learn-more-link:active { opacity: 0.7; }
        @media (min-width: 768px) {
          .svc-learn-more-link {
            display: inline-block;
            font-size: 15px;
            padding: 0;
            transition: color 0.15s ease;
          }
          .svc-learn-more-link:hover { color: var(--navy); }
        }
      `}</style>
    </>
  );
}
