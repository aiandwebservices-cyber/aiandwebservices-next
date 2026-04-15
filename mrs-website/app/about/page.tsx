import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us | Mitigation Restoration Services | South Florida",
  description: "Licensed, IICRC-certified South Florida restoration experts serving Boca Raton, Fort Lauderdale, Miami and surrounding areas.",
};

const STATS = [
  { num: "10+", label: "Years of Experience" },
  { num: "24/7", label: "Emergency Availability" },
  { num: "< 60min", label: "Average Response Time" },
  { num: "3", label: "Counties Served" },
];

const CERTS = [
  { name: "IICRC Certified", desc: "Institute of Inspection, Cleaning and Restoration Certification — the gold standard in restoration." },
  { name: "FL Mold Lic. #MRSR5155", desc: "Florida state licensed for Mold Remediation — verified and compliant." },
  { name: "Residential & Commercial", desc: "We serve both homeowners and commercial property owners across South Florida." },
  { name: "Fully Insured", desc: "General liability and workers compensation coverage for your peace of mind." },
];

export default function AboutPage() {
  return (
    <>
      <section style={{ background: "var(--navy)", padding: "3.5rem 1.5rem", textAlign: "center" }}>
        <h1 style={{ color: "#fff", fontSize: "clamp(1.75rem, 4vw, 2.75rem)", marginBottom: "0.75rem" }}>About Mitigation Restoration Services</h1>
        <p style={{ color: "#a0c4ff", maxWidth: 560, margin: "0 auto" }}>
          South Florida&apos;s trusted property damage restoration team — available 24/7, hurricane season and beyond.
        </p>
      </section>

      {/* Stats */}
      <section style={{ background: "var(--red)", padding: "2rem 1.5rem" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "1rem", textAlign: "center" }}>
          {STATS.map(s => (
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
          {/* TODO: Replace with real company story from client */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", alignItems: "start" }}>
            <div>
              <p style={{ color: "var(--gray-mid)", lineHeight: 1.8, marginBottom: "1rem" }}>
                Mitigation Restoration Services was founded right here in South Florida by professionals who&apos;ve spent their careers responding to the unique challenges this region throws at property owners — hurricanes that reshape coastlines overnight, humidity that never lets up, flooding that can turn a routine afternoon storm into a serious problem, and aging infrastructure that makes even minor water events worse than they should be.
              </p>
              <p style={{ color: "var(--gray-mid)", lineHeight: 1.8, marginBottom: "1rem" }}>
                We started this company because we&apos;ve seen too many homeowners and business owners get the runaround after a disaster — waiting days for someone to show up, getting passed between contractors who don&apos;t communicate, and fighting with insurance companies while the damage gets worse by the hour. MRS was built to be the opposite of that. One team that shows up fast, does the work right, and stays with you from the first phone call through the final insurance settlement.
              </p>
              <p style={{ color: "var(--gray-mid)", lineHeight: 1.8 }}>
                Our crews handle water extraction, mold remediation, structural drying, storm damage repair, and full-scale reconstruction. We document everything for your insurance claim, we communicate with your adjuster directly, and from Boca Raton to Homestead — whether it&apos;s a single-family home or a high-rise condo tower — we treat every job like it&apos;s our own home on the line.
              </p>
            </div>
            {/* Thermal imaging — shows professional diagnostic equipment */}
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
          <h2 style={{ color: "var(--navy)", fontSize: "1.75rem", marginBottom: "1.5rem" }}>Certifications & Credentials</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1.25rem" }} className="certs-grid">
            {CERTS.map(c => (
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
            &ldquo;To restore South Florida properties and the peace of mind of the families and businesses we serve — with speed, integrity, and expertise, every time.&rdquo;
          </p>
        </section>

        <div style={{ textAlign: "center" }}>
          <Link href="/contact" className="btn-red" style={{ fontSize: "1rem" }}>Request Help Now →</Link>
        </div>
      </div>
    </>
  );
}
