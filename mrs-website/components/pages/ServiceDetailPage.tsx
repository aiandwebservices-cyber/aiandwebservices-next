import Image from "next/image";
import Link from "next/link";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import type { SiteConfig } from "@/lib/site-config";
import type { ServiceDetail } from "@/lib/services-fl-detail";

const BASE = "https://mitigationrestorationservice.com";

const FL_AREA_SERVED = ["Palm Beach County", "Broward County", "Miami-Dade County"];
const NY_AREA_SERVED = [
  "New York County",   // Manhattan
  "Kings County",      // Brooklyn
  "Queens County",     // Queens
  "Bronx County",      // The Bronx
  "Richmond County",   // Staten Island
];

// Shared layout for the FL and NY service detail pages.
// Each route under app/(fl)/services/[slug]/page.tsx and
// app/ny/services/[slug]/page.tsx renders this with its own
// ServiceDetail data block plus the matching SiteConfig.
//
// Schema:
//   - BreadcrumbSchema (Home → Services → [Service]) — paths route-aware
//   - Service JSON-LD (provider links to LocalBusiness @id from the
//     FL or NY layout, areaServed = FL counties or NYC boroughs-as-counties)
//   - FAQPage JSON-LD (page-specific FAQ block, NOT recycled from /faq)

export default function ServiceDetailPage({ detail, config }: { detail: ServiceDetail; config: SiteConfig }) {
  const isNY = config.location === "newYork";
  const basePath = isNY ? "/ny" : "";
  const fullUrl = `${BASE}${basePath}/services/${detail.slug}`;
  const businessId = isNY ? `${BASE}/ny/#business` : `${BASE}/#business`;
  const areaServed = isNY ? NY_AREA_SERVED : FL_AREA_SERVED;

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: detail.serviceType,
    name: detail.schemaName,
    description: detail.schemaDescription,
    url: fullUrl,
    provider: { "@type": "LocalBusiness", "@id": businessId },
    areaServed: areaServed.map(name => ({
      "@type": "AdministrativeArea",
      name,
    })),
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: detail.faq.map(f => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", item: `${BASE}${basePath}` },
          { name: "Services", item: `${BASE}${basePath}/services` },
          { name: detail.title, item: fullUrl },
        ]}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* HERO */}
      <section style={{ background: "var(--navy)", padding: "3rem 1.5rem" }}>
        <div className="svc-hero-grid">
          <div className="svc-hero-text">
            <h1 style={{ color: "#fff", fontSize: "clamp(1.75rem, 4vw, 2.5rem)", lineHeight: 1.2, marginBottom: "1rem" }}>
              {detail.title}
            </h1>
            <p style={{ color: "#c8d4e8", fontSize: "1.05rem", lineHeight: 1.7, marginBottom: "1.5rem" }}>
              {detail.heroIntro}
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
              <a href={config.phoneHref} className="btn-red" style={{ fontSize: "1rem" }}>📞 Call {config.phone}</a>
              <Link href={`${basePath}/contact`} className="btn-outline" style={{ borderColor: "#fff", color: "#fff" }}>Request Help Online</Link>
            </div>
          </div>
          <div className="svc-hero-image">
            <Image
              src={detail.heroPhoto.src}
              alt={detail.heroPhoto.alt}
              width={800}
              height={600}
              style={{ width: "100%", height: "auto", borderRadius: 10, objectFit: "cover" }}
              sizes="(max-width: 767px) 100vw, 480px"
              priority
            />
          </div>
        </div>
      </section>

      {/* CAUSES + PROCESS */}
      <section style={{ background: "var(--off-white)", padding: "3rem 1.5rem" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="svc-cp-grid">
            <div className="card" style={{ padding: "1.5rem" }}>
              <h2 style={{ color: "var(--navy)", fontSize: "1.25rem", marginBottom: "1rem" }}>{detail.causesHeading}</h2>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {detail.causes.map(c => (
                  <li key={c} style={{ color: "var(--gray-dark)", fontSize: "0.95rem", lineHeight: 1.5, padding: "0.4rem 0", paddingLeft: "1.25rem", position: "relative" }}>
                    <span style={{ position: "absolute", left: 0, color: "var(--red)" }}>›</span>{c}
                  </li>
                ))}
              </ul>
            </div>
            <div className="card" style={{ padding: "1.5rem" }}>
              <h2 style={{ color: "var(--navy)", fontSize: "1.25rem", marginBottom: "1rem" }}>{detail.processHeading}</h2>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {detail.process.map(p => (
                  <li key={p} style={{ color: "var(--gray-dark)", fontSize: "0.95rem", lineHeight: 1.5, padding: "0.4rem 0", paddingLeft: "1.25rem", position: "relative" }}>
                    <span style={{ position: "absolute", left: 0, color: "var(--red)" }}>›</span>{p}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* WHY SOUTH FLORIDA */}
      <section style={{ background: "#fff", padding: "3rem 1.5rem" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <h2 style={{ color: "var(--navy)", fontSize: "1.5rem", marginBottom: "1.25rem" }}>{detail.whyHeading}</h2>
          {detail.whySFlParagraphs.map((p, i) => (
            <p key={i} style={{ color: "var(--gray-dark)", fontSize: "1rem", lineHeight: 1.7, marginBottom: "1rem" }}>{p}</p>
          ))}
        </div>
      </section>

      {/* PHOTO STRIP */}
      <section style={{ background: "var(--off-white)", padding: "2rem 1.5rem" }}>
        <div className="svc-photo-strip" style={{ maxWidth: 1100, margin: "0 auto" }}>
          {detail.photos.slice(0, 3).map((p, i) => (
            <div key={p.src} style={{ position: "relative", borderRadius: 10, overflow: "hidden", aspectRatio: "4/3" }}>
              <Image
                src={p.src}
                alt={p.alt}
                fill
                style={{ objectFit: "cover" }}
                sizes="(max-width: 767px) 100vw, 33vw"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section style={{ background: "#fff", padding: "3rem 1.5rem" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <h2 style={{ color: "var(--navy)", fontSize: "1.5rem", marginBottom: "1rem", textAlign: "center" }}>Frequently Asked Questions</h2>
          {detail.faq.map(f => (
            <details key={f.q} className="svc-faq-item">
              <summary className="svc-faq-summary">
                <span className="svc-faq-q">{f.q}</span>
                <span aria-hidden="true" className="svc-faq-icon">+</span>
              </summary>
              <div className="svc-faq-answer">
                <p>{f.a}</p>
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* SERVICE AREAS */}
      <section style={{ background: "var(--off-white)", padding: "2rem 1.5rem", textAlign: "center" }}>
        <p style={{ color: "var(--gray-mid)", fontSize: "0.95rem", margin: "0 auto 0.75rem", maxWidth: 800, lineHeight: 1.6 }}>
          {config.serviceDetailAreaIntro} — including {config.serviceAreaCities.slice(0, 6).join(", ")}, and surrounding communities.
        </p>
        <Link href={`${basePath}/service-areas`} style={{ color: "var(--red)", fontWeight: 700, fontSize: "0.95rem" }}>
          See full Service Areas →
        </Link>
      </section>

      {/* BOTTOM CTA */}
      <section style={{ background: "var(--red)", padding: "3rem 1.5rem", textAlign: "center" }}>
        <h2 style={{ color: "#fff", fontSize: "1.6rem", marginBottom: "0.75rem" }}>Need Help Now?</h2>
        <p style={{ color: "rgba(255,255,255,0.9)", marginBottom: "1.25rem" }}>{config.serviceDetailCtaSubtitle}</p>
        <a href={config.phoneHref} style={{ background: "#fff", color: "var(--red)", padding: "1rem 2rem", borderRadius: 6, fontWeight: 800, fontSize: "1.15rem", textDecoration: "none", fontFamily: "Montserrat, sans-serif", display: "inline-block", marginRight: "0.75rem" }}>
          Call {config.phone}
        </a>
        <Link href={`${basePath}/contact`} className="btn-outline" style={{ borderColor: "#fff", color: "#fff" }}>Request Help</Link>
      </section>

      <style>{`
        .svc-hero-grid { max-width: 1200px; margin: 0 auto; display: flex; flex-direction: column; gap: 2rem; align-items: center; }
        .svc-hero-text { width: 100%; }
        .svc-hero-image { width: 100%; max-width: 480px; }
        @media (min-width: 768px) {
          .svc-hero-grid { flex-direction: row; gap: 3rem; align-items: center; }
          .svc-hero-text { flex: 0 0 60%; }
          .svc-hero-image { flex: 0 0 36%; max-width: none; }
        }
        .svc-cp-grid { display: grid; grid-template-columns: 1fr; gap: 1.5rem; }
        @media (min-width: 768px) {
          .svc-cp-grid { grid-template-columns: 1fr 1fr; gap: 2rem; }
        }
        .svc-photo-strip { display: grid; grid-template-columns: 1fr; gap: 1rem; }
        @media (min-width: 768px) {
          .svc-photo-strip { grid-template-columns: repeat(3, 1fr); }
        }
        .svc-faq-item { border-bottom: 1px solid var(--gray-light); }
        .svc-faq-summary { list-style: none; cursor: pointer; display: flex; justify-content: space-between; align-items: center; gap: 1rem; min-height: 56px; padding: 12px 16px; border-radius: 6px; transition: background-color 0.15s ease; user-select: none; -webkit-tap-highlight-color: transparent; }
        .svc-faq-summary::-webkit-details-marker { display: none; }
        .svc-faq-summary::marker { content: ""; }
        .svc-faq-summary:focus-visible { outline: 2px solid var(--red); outline-offset: 2px; }
        .svc-faq-q { font-family: Montserrat, sans-serif; font-weight: 700; color: var(--navy); font-size: 1rem; line-height: 1.4; flex: 1 1 auto; }
        .svc-faq-icon { color: var(--red); font-size: 1.5rem; flex-shrink: 0; transition: transform 0.2s ease; line-height: 1; font-weight: 400; }
        .svc-faq-item[open] .svc-faq-icon { transform: rotate(45deg); }
        .svc-faq-answer { padding: 0 16px 16px 16px; }
        .svc-faq-answer p { color: var(--gray-mid); line-height: 1.6; margin: 0; font-size: 16px; }
        @media (min-width: 768px) {
          .svc-faq-summary { min-height: 48px; padding: 10px 24px; }
          .svc-faq-summary:hover { background-color: rgba(0, 0, 0, 0.025); }
          .svc-faq-q { font-size: 1.05rem; }
          .svc-faq-answer { padding: 0 24px 18px 24px; }
          .svc-faq-answer p { font-size: 17px; max-width: 70ch; }
        }
      `}</style>
    </>
  );
}
