import EmergencyForm from "@/components/EmergencyForm";
import type { SiteConfig } from "@/lib/site-config";

export default function ContactPage({ config }: { config: SiteConfig }) {
  const serviceAreaLines = config.contactServiceAreaDetail.split('\n');

  return (
    <>
      {/* Hero */}
      <section style={{ background: "var(--navy)", padding: "3.5rem 1.5rem", textAlign: "center" }}>
        <h1 style={{ color: "#fff", fontSize: "clamp(1.75rem, 4vw, 2.75rem)", marginBottom: "0.75rem" }}>
          🚨 Emergency Help — Available 24/7
        </h1>
        <p style={{ color: "#a0c4ff", marginBottom: "1.5rem" }}>Don&apos;t wait — call us now or submit the form below.</p>
        <a href={config.phoneHref} className="btn-red" style={{ fontSize: "1.25rem", padding: "1rem 2rem" }}>{config.phone}</a>
        <div style={{ marginTop: "1rem", display: "inline-block", background: "rgba(255,255,255,0.1)", color: "#fff", padding: "0.35rem 1rem", borderRadius: 4, fontSize: "0.875rem", fontWeight: 600 }}>
          Se Habla Español
        </div>
      </section>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "3rem 1.5rem", display: "grid", gridTemplateColumns: "280px 1fr", gap: "3rem", alignItems: "start" }} className="contact-layout">
        {/* Left: Contact info */}
        <aside style={{ order: 2 }} className="contact-aside">
          <div className="card" style={{ marginBottom: "1.25rem" }}>
            <h2 style={{ color: "var(--navy)", fontSize: "1.1rem", marginBottom: "1rem" }}>📞 Call or Text</h2>
            <a href={config.phoneHref} className="phone-link" style={{ fontSize: "1.4rem", display: "block", marginBottom: "0.4rem" }}>{config.phone}</a>
            <a href={`mailto:${config.email}`} style={{ display: "block", color: "var(--gray-mid)", fontSize: "0.875rem", marginBottom: "0.4rem", textDecoration: "none" }}>{config.email}</a>
            <p style={{ color: "var(--gray-mid)", fontSize: "0.875rem", margin: 0 }}>Available 24 hours a day, 7 days a week — including holidays.</p>
          </div>

          <div className="card" style={{ marginBottom: "1.25rem" }}>
            <h2 style={{ color: "var(--navy)", fontSize: "1.1rem", marginBottom: "0.75rem" }}>📍 Service Area</h2>
            <p style={{ color: "var(--gray-mid)", fontSize: "0.875rem", lineHeight: 1.6, margin: 0 }}>
              {serviceAreaLines.map((line, i) => {
                if (line.startsWith('<strong>')) {
                  const match = line.match(/^<strong>(.+?)<\/strong>(.*)$/);
                  if (match) {
                    return <span key={i}><strong>{match[1]}</strong>{match[2]}<br /></span>;
                  }
                }
                return <span key={i}>{line}<br /></span>;
              })}
            </p>
          </div>

          {config.address && (
            <div className="card" style={{ marginBottom: "1.25rem" }}>
              <h2 style={{ color: "var(--navy)", fontSize: "1.1rem", marginBottom: "0.5rem" }}>📍 Address</h2>
              <p style={{ color: "var(--gray-mid)", fontSize: "0.875rem", margin: 0 }}>
                {config.address.split(', ').slice(0, -2).join(', ')}<br />
                {config.address.split(', ').slice(-2).join(', ')}
              </p>
            </div>
          )}

          <div className="card" style={{ marginBottom: "1.25rem" }}>
            <h2 style={{ color: "var(--navy)", fontSize: "1.1rem", marginBottom: "0.5rem" }}>🕐 Hours</h2>
            <p style={{ color: "var(--gray-mid)", fontSize: "0.875rem", margin: 0 }}>24/7 — Always Open<br />Emergency response available every day of the year.</p>
          </div>

          <div className="card" style={{ marginBottom: "1.25rem" }}>
            <h2 style={{ color: "var(--navy)", fontSize: "1.1rem", marginBottom: "0.5rem" }}>🏅 Credentials</h2>
            <p style={{ color: "var(--gray-mid)", fontSize: "0.875rem", margin: 0 }}>
              {config.licenseNumbers && config.licenseNumbers.length > 0 && (
                <>{config.licenseNumbers.join(' | ')}<br /></>
              )}
              IICRC Certified<br />
              10+ Years Experience<br />
              Residential &amp; Commercial
            </p>
          </div>

          <div style={{ background: "var(--red)", color: "#fff", borderRadius: 8, padding: "1rem", textAlign: "center" }}>
            <p style={{ fontWeight: 700, margin: "0 0 0.25rem", fontFamily: "Montserrat, sans-serif" }}>Se Habla Español</p>
            <p style={{ fontSize: "0.8rem", margin: 0, opacity: 0.9 }}>Bilingual staff available</p>
          </div>

          {config.mapsEmbedUrl && (
            <div style={{ borderRadius: 10, overflow: "hidden", marginTop: "1.25rem", boxShadow: "0 4px 16px rgba(0,0,0,0.1)" }}>
              <iframe
                src={config.mapsEmbedUrl}
                width="100%"
                height="200"
                style={{ border: 0, display: "block" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`MRS ${config.serviceAreaLabel} Service Area`}
              />
            </div>
          )}
        </aside>

        {/* Right: Form */}
        <div style={{ order: 1 }} className="contact-form">
          <div style={{ background: "var(--navy)", borderRadius: "10px 10px 0 0", padding: "1.25rem 1.75rem" }}>
            <h2 style={{ color: "#fff", fontSize: "1.4rem", margin: 0 }}>Submit Emergency Request</h2>
          </div>
          <div className="card" style={{ borderRadius: "0 0 10px 10px" }}>
            <EmergencyForm location={config.location} addressPlaceholder={config.addressPlaceholder} />
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
