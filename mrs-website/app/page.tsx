import Link from "next/link";
import Image from "next/image";
import EmergencyForm from "@/components/EmergencyForm";

const PHONE = "(754) 777-8956";
const PHONE_HREF = "tel:+17547778956";

const SERVICES = [
  { icon: "💧", title: "Water Damage", desc: "Rapid extraction, drying & dehumidification 24/7.", href: "/services#water" },
  { icon: "🔥", title: "Fire & Smoke", desc: "Full fire & smoke damage cleanup and deodorization.", href: "/services#fire" },
  { icon: "🧫", title: "Mold Remediation", desc: "Year-round mold testing, removal & prevention.", href: "/services#mold" },
  { icon: "🌀", title: "Storm Damage", desc: "Hurricane, wind & flood damage response.", href: "/services#storm" },
  { icon: "⚠️", title: "Biohazard Cleanup", desc: "Safe sewage & biohazard remediation.", href: "/services#biohazard" },
  { icon: "🔨", title: "Reconstruction", desc: "Full rebuild and restoration after damage.", href: "/services#reconstruction" },
];

const WHY = [
  { icon: "🕐", title: "24/7 Emergency Response", desc: "We answer every call, day or night, including holidays and hurricane season." },
  { icon: "🏅", title: "Licensed & IICRC Certified", desc: "Fully licensed, insured, and certified to industry standards." },
  { icon: "📋", title: "Insurance Claim Specialist", desc: "We navigate Florida's complex insurance market — Citizens, AOB, claim denials." },
  { icon: "📍", title: "Local South Florida Team", desc: "We live and work here. Fast response from Boca Raton to Miami." },
];

const TESTIMONIALS = [
  { name: "Maria G.", city: "Fort Lauderdale", stars: 5, quote: "After a pipe burst at 2am, MRS was at my door within 45 minutes. They saved my floors and handled everything with my insurance. Incredible service." },
  { name: "Robert T.", city: "Miami Beach", stars: 5, quote: "Hurricane Ian left serious water damage in our condo. MRS was professional, fast, and made the whole claim process painless. Highly recommend." },
  { name: "Sandra L.", city: "Boca Raton", stars: 5, quote: "Found mold behind our bathroom wall. The MRS team was thorough, explained everything, and the remediation was perfect. They even speak Spanish — huge plus!" },
];

const CITIES = ["Boca Raton", "Deerfield Beach", "Pompano Beach", "Fort Lauderdale", "Hollywood", "Hallandale Beach", "Aventura", "North Miami", "Miami Beach", "Miami", "Coral Gables", "Homestead"];

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section style={{
        background: "linear-gradient(135deg, var(--navy) 0%, #243a5e 60%, #1a1a2e 100%)",
        minHeight: "85vh", display: "flex", alignItems: "center", position: "relative", overflow: "hidden"
      }}>
        {/* Hero background photo */}
        <Image src="/photos/damage-ceiling.jpeg" alt="Storm damage restoration in progress" fill style={{ objectFit: "cover", opacity: 0.22 }} priority />

        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "4rem 1.5rem 3rem", position: "relative", zIndex: 1, width: "100%", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
          {/* Logo — icon + white text */}
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
              Mitigation Restoration Services
            </p>
          </div>
          <div style={{ display: "inline-block", background: "var(--red)", color: "#fff", padding: "0.3rem 0.85rem", borderRadius: 4, fontSize: "0.8rem", fontWeight: 700, fontFamily: "Montserrat, sans-serif", marginBottom: "1rem", letterSpacing: "0.06em", textTransform: "uppercase" }}>
            🚨 24/7 Emergency Response
          </div>
          <h1 style={{ color: "#fff", fontSize: "clamp(2rem, 5vw, 3.5rem)", lineHeight: 1.15, marginBottom: "1rem", maxWidth: 700 }}>
            When Disaster Strikes,<br /><span style={{ color: "var(--red)" }}>We Respond.</span>
          </h1>
          <p style={{ color: "#c8d4e8", fontSize: "1.1rem", lineHeight: 1.7, marginBottom: "2rem", maxWidth: 560 }}>
            24/7 emergency water, fire, mold &amp; storm damage restoration for South Florida — Boca Raton to Miami. Fast response. Licensed &amp; insured.
          </p>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
            <a href={PHONE_HREF} className="btn-red" style={{ fontSize: "1.05rem", padding: "0.875rem 1.75rem" }}>
              📞 Call Now: {PHONE}
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
            <p style={{ color: "var(--gray-mid)", fontSize: "1rem" }}>Full-service property damage restoration for South Florida homes &amp; businesses</p>
          </div>
          <div className="services-grid">
            {SERVICES.map(s => (
              <div key={s.title} className="card service-card">
                <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>{s.icon}</div>
                <h3 style={{ color: "var(--navy)", fontSize: "1.1rem", marginBottom: "0.4rem" }}>{s.title}</h3>
                <p style={{ color: "var(--gray-mid)", fontSize: "0.9rem", marginBottom: "0.75rem" }}>{s.desc}</p>
                <Link href={s.href} style={{ color: "var(--red)", fontWeight: 700, fontSize: "0.875rem", textDecoration: "none" }}>Learn More →</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PHOTO STRIP — See Our Work */}
      <section className="section-pad" style={{ background: "#fff" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <h2 className="section-title">See Our Work</h2>
            <p style={{ color: "var(--gray-mid)", fontSize: "1rem" }}>Real South Florida jobs — water damage, mold, and full restoration</p>
          </div>
          <div className="work-grid">
            {[
              { src: "/photos/hallway-drying.jpeg", alt: "Industrial air movers deployed in water-damaged hallway" },
              { src: "/photos/water-air-movers.jpeg", alt: "Three air movers running during water damage drying process" },
              { src: "/photos/dehumidifier-kitchen.jpeg", alt: "Commercial dehumidifier and air mover operating in kitchen" },
              { src: "/photos/kitchen-after.jpeg", alt: "Beautiful kitchen after full restoration and reconstruction" },
              { src: "/photos/job-site-thumb.jpeg", alt: "Commercial hallway with full drying equipment deployed" },
              { src: "/photos/thermal-imaging.jpeg", alt: "Thermal imaging camera detecting hidden moisture" },
            ].map(({ src, alt }) => (
              <div key={src} style={{ position: "relative", borderRadius: 8, overflow: "hidden", aspectRatio: "4/3" }}>
                <Image src={src} alt={alt} fill style={{ objectFit: "cover" }} sizes="(max-width: 560px) 100vw, (max-width: 900px) 50vw, 33vw" />
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
            <p style={{ color: "#a0c4ff", margin: "0.5rem 0 0" }}>Fill out this form and we&apos;ll contact you within 60 minutes — or call us now at <a href={PHONE_HREF} style={{ color: "#fff", fontWeight: 700 }}>{PHONE}</a></p>
          </div>
          <div className="card" style={{ borderRadius: "0 0 10px 10px", boxShadow: "0 8px 32px rgba(0,0,0,0.12)" }}>
            <EmergencyForm />
          </div>
        </div>
      </section>

      {/* WHY CHOOSE MRS */}
      <section className="section-pad" style={{ background: "var(--off-white)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <h2 className="section-title">Why South Florida Trusts MRS</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.25rem" }}>
            {WHY.map(w => (
              <div key={w.title} className="card" style={{ textAlign: "center" }}>
                <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>{w.icon}</div>
                <h3 style={{ color: "var(--navy)", fontSize: "1rem", marginBottom: "0.5rem" }}>{w.title}</h3>
                <p style={{ color: "var(--gray-mid)", fontSize: "0.875rem", lineHeight: 1.6 }}>{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section-pad" style={{ background: "var(--navy)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <h2 style={{ color: "#fff", fontSize: "2rem" }}>What Our Customers Say</h2>
            <p style={{ color: "#a0aec0" }}>Real South Florida homeowners and property managers</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.25rem" }}>
            {TESTIMONIALS.map(t => (
              <div key={t.name} style={{ background: "rgba(255,255,255,0.07)", borderRadius: 10, padding: "1.5rem", border: "1px solid rgba(255,255,255,0.1)" }}>
                <div style={{ color: "#fbbf24", fontSize: "1.1rem", marginBottom: "0.75rem" }}>{"★".repeat(t.stars)}</div>
                <p style={{ color: "#e2e8f0", fontSize: "0.9rem", lineHeight: 1.7, marginBottom: "1rem", fontStyle: "italic" }}>&ldquo;{t.quote}&rdquo;</p>
                <p style={{ color: "var(--red)", fontWeight: 700, fontSize: "0.875rem", fontFamily: "Montserrat, sans-serif" }}>{t.name} — {t.city}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICE AREA */}
      <section className="section-pad" style={{ background: "#fff" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", alignItems: "center" }}>
          <div>
            <h2 className="section-title">Proudly Serving All of South Florida</h2>
            <p style={{ color: "var(--gray-mid)", marginBottom: "1.5rem", lineHeight: 1.7 }}>
              From Boca Raton south through Fort Lauderdale and Broward County down to Miami and Miami-Dade — we cover all of South Florida with fast, local response times.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1.5rem" }}>
              {CITIES.map(city => (
                <span key={city} style={{ background: "var(--off-white)", border: "1px solid var(--gray-light)", borderRadius: 20, padding: "0.3rem 0.75rem", fontSize: "0.8rem", fontWeight: 600, color: "var(--navy)" }}>{city}</span>
              ))}
            </div>
            <Link href="/contact" className="btn-red">Get Help in Your Area →</Link>
          </div>
          {/* Google Maps embed — South Florida service area */}
          <div style={{ borderRadius: 10, overflow: "hidden", height: 320, boxShadow: "0 4px 16px rgba(0,0,0,0.1)" }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d462248.8319642613!2d-80.24932!3d25.9!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sus!4v1713200000000!5m2!1sen!2sus"
              width="100%"
              height="320"
              style={{ border: 0, display: "block" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="MRS South Florida Service Area"
            />
          </div>
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
        <a href={PHONE_HREF} style={{ background: "#fff", color: "var(--red)", padding: "1rem 2rem", borderRadius: 6, fontWeight: 800, fontSize: "1.25rem", textDecoration: "none", fontFamily: "Montserrat, sans-serif", display: "inline-block" }}>
          Call {PHONE} Now
        </a>
      </section>
    </>
  );
}
