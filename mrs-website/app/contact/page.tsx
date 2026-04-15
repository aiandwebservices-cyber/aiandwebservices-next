import type { Metadata } from "next";
import EmergencyForm from "@/components/EmergencyForm";

export const metadata: Metadata = {
  title: "Contact & Emergency Help | Mitigation Restoration Services | South Florida",
  description: "24/7 emergency property damage restoration. Call (754) 777-8956 or submit our online form. Serving South Florida — Boca Raton to Miami.",
};

const PHONE = "(754) 777-8956";
const PHONE_HREF = "tel:+17547778956";

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section style={{ background: "var(--navy)", padding: "3.5rem 1.5rem", textAlign: "center" }}>
        <h1 style={{ color: "#fff", fontSize: "clamp(1.75rem, 4vw, 2.75rem)", marginBottom: "0.75rem" }}>
          🚨 Emergency Help — Available 24/7
        </h1>
        <p style={{ color: "#a0c4ff", marginBottom: "1.5rem" }}>Don&apos;t wait — call us now or submit the form below.</p>
        <a href={PHONE_HREF} className="btn-red" style={{ fontSize: "1.25rem", padding: "1rem 2rem" }}>{PHONE}</a>
        <div style={{ marginTop: "1rem", display: "inline-block", background: "rgba(255,255,255,0.1)", color: "#fff", padding: "0.35rem 1rem", borderRadius: 4, fontSize: "0.875rem", fontWeight: 600 }}>
          Se Habla Español
        </div>
      </section>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "3rem 1.5rem", display: "grid", gridTemplateColumns: "280px 1fr", gap: "3rem", alignItems: "start" }} className="contact-layout">
        {/* Left: Contact info */}
        <aside style={{ order: 2 }} className="contact-aside">
          <div className="card" style={{ marginBottom: "1.25rem" }}>
            <h2 style={{ color: "var(--navy)", fontSize: "1.1rem", marginBottom: "1rem" }}>📞 Call or Text</h2>
            <a href={PHONE_HREF} className="phone-link" style={{ fontSize: "1.4rem", display: "block", marginBottom: "0.4rem" }}>{PHONE}</a>
            <a href="mailto:Sam@mitigationrestorationservice.co.site" style={{ display: "block", color: "var(--gray-mid)", fontSize: "0.875rem", marginBottom: "0.4rem", textDecoration: "none" }}>Sam@mitigationrestorationservice.co.site</a>
            <p style={{ color: "var(--gray-mid)", fontSize: "0.875rem", margin: 0 }}>Available 24 hours a day, 7 days a week — including holidays and hurricane season.</p>
          </div>

          <div className="card" style={{ marginBottom: "1.25rem" }}>
            <h2 style={{ color: "var(--navy)", fontSize: "1.1rem", marginBottom: "0.75rem" }}>📍 Service Area</h2>
            <p style={{ color: "var(--gray-mid)", fontSize: "0.875rem", lineHeight: 1.6, margin: 0 }}>
              Serving all of South Florida:<br />
              <strong>Palm Beach County</strong> (southern) — Boca Raton, Deerfield Beach<br />
              <strong>Broward County</strong> — Pompano Beach, Fort Lauderdale, Hollywood, Hallandale Beach<br />
              <strong>Miami-Dade County</strong> — Aventura, Miami Beach, Miami, Coral Gables, Homestead
            </p>
          </div>

          <div className="card" style={{ marginBottom: "1.25rem" }}>
            <h2 style={{ color: "var(--navy)", fontSize: "1.1rem", marginBottom: "0.5rem" }}>📍 Address</h2>
            <p style={{ color: "var(--gray-mid)", fontSize: "0.875rem", margin: 0 }}>11322 Miramar Pkwy<br />Miramar, FL 33025</p>
          </div>

          <div className="card" style={{ marginBottom: "1.25rem" }}>
            <h2 style={{ color: "var(--navy)", fontSize: "1.1rem", marginBottom: "0.5rem" }}>🕐 Hours</h2>
            <p style={{ color: "var(--gray-mid)", fontSize: "0.875rem", margin: 0 }}>24/7 — Always Open<br />Emergency response available every day of the year.</p>
          </div>

          <div className="card" style={{ marginBottom: "1.25rem" }}>
            <h2 style={{ color: "var(--navy)", fontSize: "1.1rem", marginBottom: "0.5rem" }}>🏅 Credentials</h2>
            <p style={{ color: "var(--gray-mid)", fontSize: "0.875rem", margin: 0 }}>
              FL Mold Lic. #MRSR5155<br />
              IICRC Certified<br />
              10+ Years Experience<br />
              Residential &amp; Commercial
            </p>
          </div>

          <div style={{ background: "var(--red)", color: "#fff", borderRadius: 8, padding: "1rem", textAlign: "center" }}>
            <p style={{ fontWeight: 700, margin: "0 0 0.25rem", fontFamily: "Montserrat, sans-serif" }}>Se Habla Español</p>
            <p style={{ fontSize: "0.8rem", margin: 0, opacity: 0.9 }}>Bilingual staff available</p>
          </div>

          <div style={{ borderRadius: 10, overflow: "hidden", marginTop: "1.25rem", boxShadow: "0 4px 16px rgba(0,0,0,0.1)" }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d462248.8319642613!2d-80.24932!3d25.9!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sus!4v1713200000000!5m2!1sen!2sus"
              width="100%"
              height="200"
              style={{ border: 0, display: "block" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="MRS South Florida Service Area"
            />
          </div>
        </aside>

        {/* Right: Form */}
        <div style={{ order: 1 }} className="contact-form">
          <div style={{ background: "var(--navy)", borderRadius: "10px 10px 0 0", padding: "1.25rem 1.75rem" }}>
            <h2 style={{ color: "#fff", fontSize: "1.4rem", margin: 0 }}>Submit Emergency Request</h2>
          </div>
          <div className="card" style={{ borderRadius: "0 0 10px 10px" }}>
            <EmergencyForm />
          </div>
        </div>
      </div>

      <style>{`
        @media(max-width:768px){
          .contact-layout { grid-template-columns: 1fr !important; }
          .contact-aside { order: 2 !important; }
          .contact-form { order: 1 !important; }
        }
      `}</style>
    </>
  );
}
