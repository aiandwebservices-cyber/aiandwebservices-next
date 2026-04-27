import Link from "next/link";
import Image from "next/image";
import EmergencyForm from "@/components/EmergencyForm";
import TrustBar from "@/components/TrustBar";
import ReviewsSchema from "@/components/ReviewsSchema";
import type { SiteConfig } from "@/lib/site-config";

export default function HomePage({ config }: { config: SiteConfig }) {
  const basePath = config.location === 'newYork' ? '/ny' : '';

  return (
    <>
      {/* HERO */}
      <section style={{
        background: "linear-gradient(135deg, var(--navy) 0%, #243a5e 60%, #1a1a2e 100%)",
        minHeight: "85vh", display: "flex", alignItems: "center", position: "relative", overflow: "hidden"
      }}>
        <Image src="/photos/damage-ceiling.jpeg" alt="Storm damage restoration in progress" fill style={{ objectFit: "cover", opacity: 0.22 }} priority />

        <div className="home-hero-content" style={{ maxWidth: 1200, margin: "0 auto", padding: "4rem 1.5rem 3rem", position: "relative", zIndex: 1, width: "100%", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "1.75rem" }}>
            <Image
              src="/logo-icon-transparent.png"
              alt="Mitigation Restoration Services Logo"
              width={160}
              height={192}
              style={{ filter: "drop-shadow(0 4px 16px rgba(0,0,0,0.5))" }}
              priority
            />
            <p style={{ color: "#fff", fontFamily: "Montserrat, sans-serif", fontWeight: 800, fontSize: "clamp(0.85rem, 2vw, 1.1rem)", letterSpacing: "0.08em", textTransform: "uppercase", marginTop: "0.75rem", textAlign: "center", textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}>
              {config.siteName}
            </p>
          </div>
          <div style={{ display: "inline-block", background: "var(--red)", color: "#fff", padding: "0.3rem 0.85rem", borderRadius: 4, fontSize: "0.8rem", fontWeight: 700, fontFamily: "Montserrat, sans-serif", marginBottom: "1rem", letterSpacing: "0.06em", textTransform: "uppercase" }}>
            🚨 24/7 Emergency Response
          </div>
          <h1 style={{ color: "#fff", fontSize: "clamp(2rem, 5vw, 3.5rem)", lineHeight: 1.15, marginBottom: "1rem", maxWidth: 700 }}>
            {config.heroHeadline.replace(', We Respond.', ',')}
            <br /><span style={{ color: "var(--red)" }}>We Respond.</span>
          </h1>
          <p style={{ color: "#c8d4e8", fontSize: "1.1rem", lineHeight: 1.7, marginBottom: "2rem", maxWidth: 560 }}>
            {config.heroSubheadline}
          </p>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
            <a href={config.phoneHref} className="btn-red" style={{ fontSize: "1.05rem", padding: "0.875rem 1.75rem" }}>
              {config.heroCtaPhone}
            </a>
            <a href="#form" className="btn-outline" style={{ fontSize: "1.05rem", padding: "0.875rem 1.75rem" }}>
              Request Help Online
            </a>
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <section style={{ background: "var(--navy)", padding: "1rem 1.5rem" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "0.5rem 2.5rem" }}>
          {["✅ 24/7 Emergency Response", "🏅 Licensed & Insured", "📜 IICRC Certified", "🤝 Insurance Claims Accepted"].map(item => (
            <span key={item} style={{ color: "#e2e8f0", fontFamily: "Montserrat, sans-serif", fontWeight: 600, fontSize: "0.875rem" }}>{item}</span>
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <section className="section-pad" style={{ background: "var(--off-white)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <h2 className="section-title">Our Restoration Services</h2>
            <p style={{ color: "var(--gray-mid)", fontSize: "1rem" }}>{config.servicesSectionSubhead}</p>
          </div>
          <div className="services-grid">
            {config.services.map(s => (
              <div key={s.id} className="card service-card">
                <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>{s.icon}</div>
                <h3 style={{ color: "var(--navy)", fontSize: "1.1rem", marginBottom: "0.4rem" }}>{s.title}</h3>
                <p style={{ color: "var(--gray-mid)", fontSize: "0.9rem", marginBottom: "0.75rem" }}>{s.cardDesc}</p>
                <Link href={s.href} style={{ color: "var(--red)", fontWeight: 700, fontSize: "0.875rem", textDecoration: "none" }}>Learn More →</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EMERGENCY FORM */}
      <section id="form" className="section-pad" style={{ background: "#fff" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <div style={{ background: "var(--navy)", borderRadius: "10px 10px 0 0", padding: "1.5rem 2rem", textAlign: "center" }}>
            <h2 style={{ color: "#fff", fontSize: "1.75rem", margin: 0 }}>🚨 Get Emergency Help Now</h2>
            <p style={{ color: "#a0c4ff", margin: "0.5rem 0 0" }}>Fill out this form and we&apos;ll contact you within 60 minutes — or call us now at <a href={config.phoneHref} style={{ color: "#fff", fontWeight: 700 }}>{config.phone}</a></p>
          </div>
          <div className="card" style={{ borderRadius: "0 0 10px 10px", boxShadow: "0 8px 32px rgba(0,0,0,0.12)" }}>
            <EmergencyForm location={config.location} addressPlaceholder={config.addressPlaceholder} formContext="home" />
          </div>
        </div>
      </section>

      {/* WHY CHOOSE MRS */}
      <section className="section-pad" style={{ background: "var(--off-white)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <h2 className="section-title">{config.whyTrustHeadline}</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.25rem" }}>
            {config.whyItems.map(w => (
              <div key={w.title} className="card" style={{ textAlign: "center" }}>
                <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>{w.icon}</div>
                <h3 style={{ color: "var(--navy)", fontSize: "1rem", marginBottom: "0.5rem" }}>{w.title}</h3>
                <p style={{ color: "var(--gray-mid)", fontSize: "0.875rem", lineHeight: 1.6 }}>{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST BAR (Google reviews / BBB / license / experience) */}
      <TrustBar config={config} />

      {/* TESTIMONIALS */}
      <ReviewsSchema config={config} />
      <section className="section-pad" style={{ background: "var(--navy)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <h2 style={{ color: "#fff", fontSize: "2rem" }}>What Our Customers Say</h2>
            <p style={{ color: "#a0aec0" }}>{config.testimonialSubhead}</p>
          </div>
          <div className="testimonial-grid">
            {config.testimonials.map(t => (
              <div key={t.name} style={{ background: "rgba(255,255,255,0.07)", borderRadius: 10, padding: "1.5rem", border: "1px solid rgba(255,255,255,0.1)" }}>
                <div style={{ color: "#fbbf24", fontSize: "1.1rem", marginBottom: "0.75rem" }}>{"★".repeat(t.stars)}</div>
                <p style={{ color: "#e2e8f0", fontSize: "0.9rem", lineHeight: 1.7, marginBottom: "1rem", fontStyle: "italic" }}>&ldquo;{t.quote}&rdquo;</p>
                <p style={{ color: "#ff8aa0", fontWeight: 700, fontSize: "0.875rem", fontFamily: "Montserrat, sans-serif" }}>{t.name} — {t.city}</p>
              </div>
            ))}
          </div>
        </div>
        <style>{`
          .testimonial-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 16px;
          }
          @media (min-width: 768px) {
            .testimonial-grid {
              grid-template-columns: repeat(3, minmax(0, 1fr));
              gap: 20px;
            }
          }
        `}</style>
      </section>

      {/* SERVICE AREA */}
      <section className="section-pad" style={{ background: "#fff" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", alignItems: "center" }}>
          <div>
            <h2 className="section-title">{config.serviceAreaHeadline}</h2>
            <p style={{ color: "var(--gray-mid)", marginBottom: "1.5rem", lineHeight: 1.7 }}>
              {config.serviceAreaDetail}
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1.5rem" }}>
              {config.serviceAreaCities.map(city => (
                <span key={city} style={{ background: "var(--off-white)", border: "1px solid var(--gray-light)", borderRadius: 20, padding: "0.3rem 0.75rem", fontSize: "0.8rem", fontWeight: 600, color: "var(--navy)" }}>{city}</span>
              ))}
            </div>
            <Link href={`${basePath}/contact`} className="btn-red">{config.serviceAreaGetHelpCta}</Link>
          </div>
          {config.mapsEmbedUrl && (
            <div style={{ borderRadius: 10, overflow: "hidden", height: 320, boxShadow: "0 4px 16px rgba(0,0,0,0.1)" }}>
              <iframe
                src={config.mapsEmbedUrl}
                width="100%"
                height="320"
                style={{ border: 0, display: "block" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`MRS ${config.serviceAreaLabel} Service Area`}
              />
            </div>
          )}
        </div>
        <style>{`
          @media (max-width: 768px) {
            section > div[style*="grid-template-columns: 1fr 1fr"] {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>
      </section>

      {/* BOTTOM CTA */}
      <section style={{ background: "var(--red)", padding: "3rem 1.5rem", textAlign: "center" }}>
        <h2 style={{ color: "#fff", fontSize: "1.75rem", marginBottom: "0.75rem" }}>Dealing with an Emergency Right Now?</h2>
        <p style={{ color: "rgba(255,255,255,0.85)", marginBottom: "1.5rem", fontSize: "1rem" }}>Don&apos;t wait — every minute counts with water and fire damage.</p>
        <a href={config.phoneHref} style={{ background: "#fff", color: "var(--red)", padding: "1rem 2rem", borderRadius: 6, fontWeight: 800, fontSize: "1.25rem", textDecoration: "none", fontFamily: "Montserrat, sans-serif", display: "inline-block" }}>
          Call {config.phone} Now
        </a>
      </section>
    </>
  );
}
