import Image from "next/image";
import Link from "next/link";
import type { SiteConfig } from "@/lib/site-config";

export default function AboutPage({ config }: { config: SiteConfig }) {
  const basePath = config.location === 'newYork' ? '/ny' : '';

  return (
    <>
      <section style={{ background: "var(--navy)", padding: "3.5rem 1.5rem", textAlign: "center" }}>
        <h1 style={{ color: "#fff", fontSize: "clamp(1.75rem, 4vw, 2.75rem)", marginBottom: "0.75rem" }}>About {config.siteName}</h1>
        <p style={{ color: "#a0c4ff", maxWidth: 560, margin: "0 auto" }}>
          {config.aboutHeroSubhead}
        </p>
      </section>

      {/* Stats */}
      <section style={{ background: "var(--red)", padding: "2rem 1.5rem" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "1rem", textAlign: "center" }}>
          {config.stats.map(s => (
            <div key={s.label}>
              <div style={{ color: "#fff", fontFamily: "Montserrat, sans-serif", fontWeight: 800, fontSize: "2rem" }}>{s.num}</div>
              <div style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.875rem", fontWeight: 600 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "3.5rem 1.5rem" }}>
        {/* Story */}
        <section style={{ marginBottom: "3rem" }}>
          <h2 style={{ color: "var(--navy)", fontSize: "1.75rem", marginBottom: "1rem" }}>Our Story</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", alignItems: "start" }}>
            <div>
              {config.aboutStoryParagraphs.map((p, i) => (
                <p key={i} style={{ color: "var(--gray-mid)", lineHeight: 1.8, marginBottom: "1rem" }}>{p}</p>
              ))}
            </div>
            <div style={{ borderRadius: 10, overflow: "hidden" }}>
              <Image
                src="/photos/thermal-imaging.jpeg"
                alt="MRS technician using thermal imaging camera to detect hidden moisture"
                width={4032}
                height={3024}
                style={{ width: "100%", height: "auto", display: "block" }}
                sizes="(max-width: 768px) 100vw, 480px"
              />
            </div>
          </div>
          <style>{`
            @media(max-width:768px){
              section div[style*="grid-template-columns: 1fr 1fr"]{grid-template-columns:1fr!important}
              .certs-grid{grid-template-columns:1fr!important}
            }
          `}</style>
        </section>

        {/* Certifications */}
        <section style={{ marginBottom: "3rem" }}>
          <h2 style={{ color: "var(--navy)", fontSize: "1.75rem", marginBottom: "1.5rem" }}>Certifications &amp; Credentials</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1.25rem" }} className="certs-grid">
            {config.certs.map(c => (
              <div key={c.name} className="card" style={{ borderLeft: "5px solid var(--red)", padding: "1.75rem" }}>
                <h3 style={{ color: "var(--navy)", fontSize: "1.15rem", marginBottom: "0.6rem" }}>{c.name}</h3>
                <p style={{ color: "var(--gray-mid)", fontSize: "0.95rem", margin: 0, lineHeight: 1.6 }}>{c.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Mission */}
        <section style={{ background: "var(--navy)", borderRadius: 10, padding: "2rem", marginBottom: "2rem", textAlign: "center" }}>
          <h2 style={{ color: "#fff", fontSize: "1.5rem", marginBottom: "0.75rem" }}>Our Mission</h2>
          <p style={{ color: "#a0c4ff", fontSize: "1.05rem", lineHeight: 1.7, maxWidth: 600, margin: "0 auto" }}>
            &ldquo;{config.missionStatement}&rdquo;
          </p>
        </section>

        <div style={{ textAlign: "center" }}>
          <Link href={`${basePath}/contact`} className="btn-red" style={{ fontSize: "1rem" }}>Request Help Now →</Link>
        </div>
      </div>
    </>
  );
}
