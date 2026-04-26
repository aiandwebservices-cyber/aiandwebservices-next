import Link from "next/link";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import type { SiteConfig } from "@/lib/site-config";
import type { ServiceArea } from "@/lib/service-areas";

const BASE = "https://mitigationrestorationservice.com";

const FL_AREA_SERVED_COUNTIES = ["Palm Beach County", "Broward County", "Miami-Dade County"];
const NY_AREA_SERVED_COUNTIES = [
  "New York County",
  "Kings County",
  "Queens County",
  "Bronx County",
  "Richmond County",
];

type Props = {
  config: SiteConfig;
  title: string;       // H1
  heroIntro: string;   // hero paragraph
  areas: ServiceArea[];
};

export default function ServiceAreasPage({ config, title, heroIntro, areas }: Props) {
  const isNY = config.location === "newYork";
  const basePath = isNY ? "/ny" : "";
  const pageUrl = `${BASE}${basePath}/service-areas`;
  const businessId = isNY ? `${BASE}/ny/#business` : `${BASE}/#business`;
  const counties = isNY ? NY_AREA_SERVED_COUNTIES : FL_AREA_SERVED_COUNTIES;

  const serviceAreaSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Property Damage Restoration",
    name: title,
    url: pageUrl,
    provider: { "@type": "LocalBusiness", "@id": businessId },
    areaServed: [
      ...counties.map(name => ({ "@type": "AdministrativeArea", name })),
      ...areas.map(a => ({ "@type": "AdministrativeArea", name: a.name })),
    ],
  };

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", item: `${BASE}${basePath}` },
          { name: "Service Areas", item: pageUrl },
        ]}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceAreaSchema) }} />

      {/* HERO */}
      <section style={{ background: "var(--navy)", padding: "3.5rem 1.5rem", textAlign: "center" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <h1 style={{ color: "#fff", fontSize: "clamp(1.75rem, 4vw, 2.5rem)", lineHeight: 1.2, marginBottom: "1rem" }}>{title}</h1>
          <p style={{ color: "#c8d4e8", fontSize: "1.05rem", lineHeight: 1.7, marginBottom: "1.5rem" }}>{heroIntro}</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", justifyContent: "center" }}>
            <a href={config.phoneHref} className="btn-red" style={{ fontSize: "1rem" }}>📞 Call {config.phone}</a>
            <Link href={`${basePath}/contact`} className="btn-outline" style={{ borderColor: "#fff", color: "#fff" }}>Request Help Online</Link>
          </div>
        </div>
      </section>

      {/* AREAS */}
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "3rem 1.5rem" }}>
        {areas.map((area, i) => (
          <section
            key={area.name}
            style={{
              paddingTop: i === 0 ? 0 : "1.75rem",
              paddingBottom: "1.75rem",
              borderBottom: i < areas.length - 1 ? "1px solid var(--gray-light)" : "none",
            }}
          >
            <h2 style={{ color: "var(--navy)", fontSize: "1.4rem", marginBottom: "0.6rem" }}>{area.name}</h2>
            <p style={{ color: "var(--gray-dark)", fontSize: "1rem", lineHeight: 1.7, margin: 0 }}>{area.description}</p>
          </section>
        ))}
      </div>

      {/* BOTTOM CTA */}
      <section style={{ background: "var(--red)", padding: "3rem 1.5rem", textAlign: "center" }}>
        <h2 style={{ color: "#fff", fontSize: "1.6rem", marginBottom: "0.75rem" }}>Need Help in Your Area?</h2>
        <p style={{ color: "rgba(255,255,255,0.9)", marginBottom: "1.25rem" }}>24/7 emergency response across our entire service area.</p>
        <a href={config.phoneHref} style={{ background: "#fff", color: "var(--red)", padding: "1rem 2rem", borderRadius: 6, fontWeight: 800, fontSize: "1.15rem", textDecoration: "none", fontFamily: "Montserrat, sans-serif", display: "inline-block", marginRight: "0.75rem" }}>
          Call {config.phone}
        </a>
        <Link href={`${basePath}/contact`} className="btn-outline" style={{ borderColor: "#fff", color: "#fff" }}>Request Help</Link>
      </section>
    </>
  );
}
