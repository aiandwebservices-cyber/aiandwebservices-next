"use client";
import { useState } from "react";
import Link from "next/link";

const FAQS = [
  {
    q: "How fast do you respond in South Florida?",
    a: "Our average response time is under 60 minutes throughout our South Florida service area — from Boca Raton to Miami. We're available 24/7/365, including during and after hurricane events."
  },
  {
    q: "Do you work with insurance companies?",
    a: "Yes. We work directly with all major insurance carriers and specialize in Florida's complex insurance market, including Citizens Insurance, HO-A policies, and cases involving Assignment of Benefits (AOB) disputes or claim denials. We document everything thoroughly to support your claim and can communicate directly with your adjuster."
  },
  {
    q: "My claim was denied — can you still help?",
    a: "Yes. Florida's insurance market is notoriously difficult, and claim denials are common. We help property owners document damage thoroughly for appeals and work with public adjusters when needed. Call us — don't give up on your claim."
  },
  {
    q: "How much does restoration cost?",
    a: "Costs vary based on the type and extent of damage. For most insured losses, your insurance covers the work minus your deductible. We provide free estimates and work within your insurance scope. For uninsured work, we offer transparent pricing and can discuss payment options."
  },
  {
    q: "What should I do first after water damage?",
    a: "1) Ensure everyone is safe and the water source is stopped (turn off the water main if needed). 2) Call us immediately — (754) 777-8956. 3) Don't use electrical appliances in wet areas. 4) Remove valuables if safe to do so. 5) Document the damage with photos. Do NOT wait — in South Florida's humidity, mold can begin in 24 hours."
  },
  {
    q: "What should I do first after a fire?",
    a: "1) Wait for the fire department to clear the property. 2) Call us — we handle emergency board-up to secure the property. 3) Do not attempt to clean soot yourself — it sets into surfaces and can make remediation harder. 4) Call your insurance company to report the claim. We can assist with documentation."
  },
  {
    q: "Do I need to leave my home during restoration?",
    a: "It depends on the extent of the damage. Minor water or mold issues often allow you to remain at home. Significant damage, sewage backup, or extensive mold remediation typically requires temporary relocation. If needed, many homeowners' insurance policies include 'loss of use' coverage that pays for temporary housing — we'll help you navigate this."
  },
  {
    q: "Do you handle hurricane and storm damage?",
    a: "Absolutely — hurricane and storm damage response is one of our core services. South Florida is ground zero for hurricane season (June–November), and we're prepared for surge demand. We provide emergency tarping, board-up, water extraction, and full structural repairs. We recommend contacting us as soon as it's safe after a storm — restoration contractors fill up quickly after major events."
  },
  {
    q: "Do you serve my area?",
    a: "We serve all of South Florida: southern Palm Beach County (Boca Raton, Deerfield Beach, Boynton Beach), all of Broward County (Pompano Beach, Fort Lauderdale, Dania Beach, Hollywood, Hallandale Beach), and all of Miami-Dade County (Aventura, North Miami, Miami Beach, Miami, Coral Gables, Kendall, Homestead). If you're unsure, just call us at (754) 777-8956."
  },
  {
    q: "Do you offer Spanish-speaking services?",
    a: "Sí, hablamos español. We have Spanish-speaking staff available to assist Miami-Dade and Broward County customers throughout the restoration process — from initial assessment to insurance paperwork."
  },
  {
    q: "How does the mold remediation process work?",
    a: "We start with a thorough inspection and air quality testing to identify the type and extent of mold. We then set up containment barriers to prevent spread, use HEPA filtration and negative air pressure, physically remove affected materials, and apply EPA-registered antimicrobial treatments. Finally, we perform clearance testing to confirm the area is clean. In South Florida's humidity, addressing the moisture source (AC issues, leaks, ventilation) is critical to preventing recurrence."
  },
  {
    q: "Can you help with condo or HOA water damage disputes?",
    a: "Yes — this is very common in South Florida. Condo water damage often involves disputes between unit owners and associations over responsibility. We document damage thoroughly and can work with both parties and their respective insurance carriers. We understand the specific challenges of condo restoration in Florida."
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid var(--gray-light)" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{ width: "100%", background: "none", border: "none", padding: "1.1rem 0", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", textAlign: "left", gap: "1rem" }}>
        <span style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "0.95rem", color: "var(--navy)" }}>{q}</span>
        <span style={{ color: "var(--red)", fontSize: "1.25rem", flexShrink: 0, transition: "transform 0.2s", transform: open ? "rotate(45deg)" : "none" }}>+</span>
      </button>
      {open && (
        <div style={{ paddingBottom: "1.1rem", paddingRight: "2rem" }}>
          <p style={{ color: "var(--gray-mid)", lineHeight: 1.7, margin: 0, fontSize: "0.9rem" }}>{a}</p>
        </div>
      )}
    </div>
  );
}

export default function FAQPage() {
  return (
    <>
      <section style={{ background: "var(--navy)", padding: "3.5rem 1.5rem", textAlign: "center" }}>
        <h1 style={{ color: "#fff", fontSize: "clamp(1.75rem, 4vw, 2.75rem)", marginBottom: "0.75rem" }}>Frequently Asked Questions</h1>
        <p style={{ color: "#a0c4ff", maxWidth: 520, margin: "0 auto" }}>
          Answers to common questions about restoration services, insurance claims, and South Florida-specific concerns.
        </p>
      </section>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "3rem 1.5rem" }}>
        {FAQS.map(f => <FAQItem key={f.q} q={f.q} a={f.a} />)}

        <div style={{ marginTop: "3rem", background: "var(--off-white)", borderRadius: 10, padding: "2rem", textAlign: "center" }}>
          <h2 style={{ color: "var(--navy)", fontSize: "1.3rem", marginBottom: "0.75rem" }}>Still Have Questions?</h2>
          <p style={{ color: "var(--gray-mid)", marginBottom: "1.25rem", fontSize: "0.9rem" }}>We&apos;re available 24/7 — call us or submit a request online.</p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <a href="tel:+17547778956" className="btn-red">Call (754) 777-8956</a>
            <Link href="/contact" style={{ background: "var(--navy)", color: "#fff", padding: "0.75rem 1.5rem", borderRadius: 6, fontWeight: 700, fontFamily: "Montserrat, sans-serif", textDecoration: "none" }}>
              Submit a Request
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
