import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Restoration Services | Mitigation Restoration Services | South Florida",
  description: "Water damage, fire & smoke, mold remediation, storm damage, biohazard cleanup & reconstruction services in South Florida. 24/7 response.",
};

const SERVICES = [
  {
    id: "water",
    icon: "💧",
    title: "Water Damage Restoration",
    desc: "Flooding, burst pipes, appliance leaks, roof leaks — water damage gets worse every hour. Our IICRC-certified technicians extract standing water, deploy industrial drying equipment, and monitor moisture levels until your property is fully dry.",
    causes: ["Burst or leaking pipes", "Hurricane flooding & storm surge", "Appliance malfunctions", "Roof leaks & heavy rain", "Sewer backups", "King tide & flash flooding (South Florida specific)"],
    process: ["Emergency water extraction", "Industrial dehumidification & drying", "Moisture mapping & monitoring", "Mold prevention treatment", "Structural drying & documentation", "Full restoration & rebuild"],
    callWhen: "Immediately — water damage compounds rapidly. Mold can begin growing within 24–48 hours in South Florida's humid climate.",
    photos: [
      { src: "/photos/water-air-movers.jpeg", alt: "Industrial air movers deployed during water damage drying" },
      { src: "/photos/wall-demo-drying.jpeg", alt: "Opened wall with air mover running during water damage restoration" },
      { src: "/photos/job-site-thumb.jpeg", alt: "Commercial hallway with full drying equipment deployed" },
    ],
  },
  {
    id: "fire",
    icon: "🔥",
    title: "Fire & Smoke Damage Restoration",
    desc: "Fire destroys structure; smoke and soot destroy everything else. We handle emergency board-up, complete smoke odor elimination, soot removal, and full structural restoration.",
    causes: ["Kitchen fires", "Electrical fires", "Grease fires", "Lightning strikes", "Wildfires (South Florida brush)"],
    process: ["Emergency board-up & tarping", "Smoke & soot removal", "Deodorization & air purification", "Content pack-out & cleaning", "Structural repairs", "Full reconstruction"],
    callWhen: "Immediately after fire department clears the property. Don't touch soot — it sets into surfaces quickly.",
    photos: [
      { src: "/photos/services/fire-burning.jpg", alt: "House fully engulfed in flames" },
      { src: "/photos/services/fire-aftermath.jpg", alt: "Fire-damaged house exterior after blaze" },
      { src: "/photos/services/fire-charred.jpg", alt: "Completely charred house structure after fire" },
    ],
  },
  {
    id: "mold",
    icon: "🧫",
    title: "Mold Remediation & Testing",
    desc: "South Florida's humidity makes mold a year-round threat — not just after disasters. We test, identify, contain, and eliminate mold following EPA and IICRC protocols, then address the moisture source to prevent recurrence.",
    causes: ["High humidity (South Florida year-round)", "Water damage not fully dried", "Roof leaks", "Poor ventilation in bathrooms & AC systems", "Flooding & storm damage"],
    process: ["Mold inspection & air quality testing", "Containment to prevent spread", "HEPA filtration & negative air pressure", "Mold removal & antimicrobial treatment", "Moisture source correction", "Clearance testing"],
    callWhen: "As soon as you see or smell mold. It spreads quickly and affects indoor air quality — especially dangerous for children, elderly, and those with respiratory issues.",
    photos: [
      { src: "/photos/mold-testing.jpeg", alt: "MRS technician swab-testing mold growth on wall" },
      { src: "/photos/services/mold-ceiling.jpg", alt: "Dark mold staining spreading across ceiling tile" },
      { src: "/photos/services/mold-flood-ceiling.jpg", alt: "Ceiling collapse and mold damage from flood" },
    ],
  },
  {
    id: "storm",
    icon: "🌀",
    title: "Storm & Wind Damage Repair",
    desc: "Hurricane season runs June through November — but South Florida storms can strike any time. We respond immediately after storm events with emergency tarping, board-up, water extraction, and full structural repairs.",
    causes: ["Hurricanes & tropical storms", "Tornadoes & microbursts", "High winds (roof & window damage)", "Heavy rain & flooding", "Hail damage"],
    process: ["Emergency board-up & roof tarping", "Water extraction & drying", "Debris removal", "Structural assessment", "Insurance documentation support", "Roof, window & structural repairs"],
    callWhen: "As soon as it's safe to do so after a storm. Quick action prevents water intrusion from causing mold and structural damage.",
    photos: [
      { src: "/photos/services/storm-lightning.jpg", alt: "Lightning storm over South Florida neighborhood" },
      { src: "/photos/services/storm-trees.jpg", alt: "Hurricane-downed trees blocking house entrance" },
      { src: "/photos/services/storm-flood.jpg", alt: "Neighborhood flooding after hurricane storm surge" },
    ],
  },
  {
    id: "biohazard",
    icon: "⚠️",
    title: "Sewage & Biohazard Cleanup",
    desc: "Sewage backups and biohazard situations require specialized protective equipment and disposal protocols. We handle it safely, discreetly, and thoroughly.",
    causes: ["Sewage backups & overflows", "Toilet & drain backups", "Category 3 (black water) flooding", "Trauma & crime scenes", "Hoarding situations"],
    process: ["Hazard assessment & PPE deployment", "Safe removal & disposal", "Disinfection & decontamination", "Odor elimination", "Air quality testing", "Restoration"],
    callWhen: "Immediately — sewage contains dangerous pathogens. Do not attempt cleanup yourself.",
    photos: [
      { src: "/photos/services/bio-spray.jpg", alt: "Technician in full protective suit disinfecting surface" },
      { src: "/photos/services/bio-kitchen.jpg", alt: "Hazmat-suited worker decontaminating kitchen" },
      { src: "/photos/services/bio-suit.jpg", alt: "Technician suiting up in protective gear before cleanup" },
    ],
  },
  {
    id: "reconstruction",
    icon: "🔨",
    title: "Reconstruction & Rebuild",
    desc: "After mitigation is complete, we handle the full rebuild — from drywall and flooring to complete structural reconstruction. One contractor for the entire job.",
    causes: ["Post-water damage rebuild", "Post-fire structural repair", "Storm damage reconstruction", "Mold remediation follow-up repairs"],
    process: ["Damage assessment & scope of work", "Insurance estimate coordination", "Framing & structural repairs", "Drywall, flooring & finishes", "Painting & trim", "Final inspection & walkthrough"],
    callWhen: "After mitigation is complete. We coordinate directly with your insurance adjuster.",
    photos: [
      { src: "/photos/kitchen-after.jpeg", alt: "Fully restored and rebuilt kitchen after water damage reconstruction" },
      { src: "/photos/services/recon-framing.jpg", alt: "Exposed wood framing during home reconstruction" },
      { src: "/photos/services/recon-interior.jpg", alt: "Interior rebuild in progress with ladders and new drywall" },
    ],
  },
];

export default function ServicesPage() {
  return (
    <>
      {/* Hero */}
      <section style={{ background: "var(--navy)", padding: "3.5rem 1.5rem", textAlign: "center" }}>
        <h1 style={{ color: "#fff", fontSize: "clamp(1.75rem, 4vw, 2.75rem)", marginBottom: "0.75rem" }}>Restoration Services</h1>
        <p style={{ color: "#a0c4ff", fontSize: "1rem", maxWidth: 560, margin: "0 auto 1.5rem" }}>
          Full-service property damage restoration for South Florida homes, condos, and businesses — 24/7.
        </p>
        <a href="tel:+17547778956" className="btn-red" style={{ fontSize: "1rem" }}>📞 (754) 777-8956 — Call Now</a>
      </section>

      {/* Service list */}
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "3rem 1.5rem" }}>
        {SERVICES.map((s, i) => (
          <section key={s.id} id={s.id} style={{ marginBottom: "3.5rem", paddingBottom: "3.5rem", borderBottom: i < SERVICES.length - 1 ? "1px solid var(--gray-light)" : "none", scrollMarginTop: "100px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
              <span style={{ fontSize: "2rem" }}>{s.icon}</span>
              <h2 style={{ color: "var(--navy)", fontSize: "1.6rem", margin: 0 }}>{s.title}</h2>
            </div>
            <p style={{ color: "var(--gray-mid)", lineHeight: 1.7, marginBottom: "1.5rem", fontSize: "0.95rem" }}>{s.desc}</p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.25rem" }}>
              <div>
                <h3 style={{ color: "var(--navy)", fontSize: "0.95rem", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.04em" }}>Common Causes</h3>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {s.causes.map(c => <li key={c} style={{ fontSize: "0.875rem", color: "var(--gray-dark)", padding: "0.2rem 0", paddingLeft: "1rem", position: "relative" }}>
                    <span style={{ position: "absolute", left: 0, color: "var(--red)" }}>›</span>{c}
                  </li>)}
                </ul>
              </div>
              <div>
                <h3 style={{ color: "var(--navy)", fontSize: "0.95rem", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.04em" }}>Our Process</h3>
                <ol style={{ paddingLeft: "1.25rem", margin: 0 }}>
                  {s.process.map(p => <li key={p} style={{ fontSize: "0.875rem", color: "var(--gray-dark)", padding: "0.2rem 0" }}>{p}</li>)}
                </ol>
              </div>
              <div style={{ background: "#fff8f8", border: "1px solid #fdd", borderRadius: 8, padding: "1rem" }}>
                <h3 style={{ color: "var(--red)", fontSize: "0.875rem", marginBottom: "0.4rem", textTransform: "uppercase", letterSpacing: "0.04em" }}>⏰ When to Call</h3>
                <p style={{ fontSize: "0.875rem", color: "var(--gray-dark)", lineHeight: 1.6, margin: 0 }}>{s.callWhen}</p>
              </div>
            </div>

            {"photos" in s && Array.isArray(s.photos) && s.photos.length > 0 && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.75rem", marginTop: "1.5rem" }}>
                {(s.photos as { src: string; alt: string }[]).map(({ src, alt }) => (
                  <div key={src} style={{ position: "relative", borderRadius: 8, overflow: "hidden", aspectRatio: "4/3" }}>
                    <Image src={src} alt={alt} fill style={{ objectFit: "cover" }} sizes="(max-width: 640px) 100vw, (max-width: 960px) 33vw, 300px" />
                  </div>
                ))}
              </div>
            )}
          </section>
        ))}
      </div>

      {/* CTA */}
      <section style={{ background: "var(--red)", padding: "3rem 1.5rem", textAlign: "center" }}>
        <h2 style={{ color: "#fff", marginBottom: "1rem" }}>Need Immediate Help?</h2>
        <a href="tel:+17547778956" style={{ background: "#fff", color: "var(--red)", padding: "1rem 2rem", borderRadius: 6, fontWeight: 800, fontSize: "1.2rem", textDecoration: "none", fontFamily: "Montserrat, sans-serif", display: "inline-block", marginRight: "1rem" }}>
          Call (754) 777-8956
        </a>
        <Link href="/contact" className="btn-outline" style={{ borderColor: "#fff", color: "#fff" }}>Request Help Online</Link>
      </section>
    </>
  );
}
