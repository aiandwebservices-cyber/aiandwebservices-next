// This is a template and should be reviewed by a lawyer before use in production.

import Link from 'next/link';

const TEAL = '#2AA5A0';

export const metadata = {
  title: 'Terms of Service — LotPilot.ai',
  description: 'Terms of Service for LotPilot.ai, the AI-powered dealer management platform.',
};

export default function TermsPage() {
  return (
    <>
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, height: 60, display: 'flex', alignItems: 'center', padding: '0 32px', background: 'rgba(9,9,11,0.92)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.06)', gap: 24 }}>
        <Link href="/lotpilot" style={{ fontSize: 20, fontWeight: 800, color: TEAL, textDecoration: 'none' }}>LotPilot.ai</Link>
        <div style={{ flex: 1 }} />
        <Link href="/lotpilot/privacy" style={{ fontSize: 13, color: '#a1a1aa', textDecoration: 'none' }}>Privacy Policy</Link>
      </nav>

      <main style={{ maxWidth: 768, margin: '0 auto', padding: '64px 24px 96px' }}>
        <div style={{ marginBottom: 48 }}>
          <p style={{ fontSize: 12, color: '#71717a', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>Last updated: May 2026</p>
          <h1 style={{ fontSize: 'clamp(28px, 5vw, 40px)', fontWeight: 800, lineHeight: 1.2, marginBottom: 16 }}>Terms of Service</h1>
          <p style={{ fontSize: 16, color: '#a1a1aa', lineHeight: 1.7 }}>
            These Terms of Service (&ldquo;Terms&rdquo;) govern your use of LotPilot.ai and the services provided by AIandWEBservices (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;LotPilot&rdquo;). By using LotPilot you agree to these Terms. Please read them carefully.
          </p>
        </div>

        <Section num="1" title="Service Description">
          <p>LotPilot is an AI-powered dealer management platform that provides independent automotive dealers with a suite of tools including: an AI-assisted sales agent, CRM and lead management, dealer website hosting, inventory management, listing syndication, review response automation, and related services. The platform is built and operated by AIandWEBservices, Miami, FL.</p>
        </Section>

        <Section num="2" title="Account Terms">
          <p>One LotPilot account is permitted per dealership location. The dealer entity that registers the account (&ldquo;Dealer&rdquo;) is solely responsible for all activity that occurs under that account, including activity by any staff members, managers, or agents who are granted access. You must provide accurate registration information and keep it up to date. You are responsible for maintaining the confidentiality of your login credentials.</p>
        </Section>

        <Section num="3" title="Payment Terms">
          <p>LotPilot subscriptions are billed monthly via Stripe. All subscriptions auto-renew unless cancelled. Prices are as specified at the time of signup and are subject to change with 30 days&rsquo; advance notice. A one-time setup fee is charged at the start of service to cover platform build and onboarding.</p>
          <p style={{ marginTop: 12 }}>To cancel your subscription, provide written notice at least 30 days before your next billing date by emailing <a href="mailto:david@aiandwebservices.com" style={{ color: TEAL }}>david@aiandwebservices.com</a>. No refunds are issued for partial billing periods. Setup fees are non-refundable.</p>
        </Section>

        <Section num="4" title="Data Ownership">
          <p>Dealer owns all data it inputs into or generates through LotPilot, including inventory records, leads, customer information, and deal data. LotPilot does not claim ownership of your business data.</p>
          <p style={{ marginTop: 12 }}>By using LotPilot, Dealer grants LotPilot a limited, non-exclusive license to store, process, and display that data solely for the purpose of providing the service. LotPilot does not sell or share Dealer&rsquo;s customer data with third parties for their own commercial use.</p>
          <p style={{ marginTop: 12 }}>Upon cancellation, Dealer&rsquo;s data will remain available for export for 30 days following the end of the subscription period, after which it may be deleted in accordance with our data retention policy.</p>
        </Section>

        <Section num="5" title="AI Disclosure">
          <p>The LotPilot platform uses artificial intelligence, including the Claude language model by Anthropic, to power features such as AI chat, vehicle description generation, lead scoring, follow-up drafting, and review response. AI-generated outputs are provided as suggestions and starting points only — they are not guarantees of accuracy, suitability, or legal compliance.</p>
          <p style={{ marginTop: 12 }}>Dealer is solely responsible for reviewing all AI-generated content before publishing it, sending it to customers, or acting on it. LotPilot is not responsible for errors, inaccuracies, or outcomes arising from AI-generated content that the Dealer publishes or acts upon without review.</p>
        </Section>

        <Section num="6" title="Uptime and Availability">
          <p>LotPilot will make commercially reasonable efforts to maintain platform availability. We do not guarantee any specific uptime percentage or service level at this time. Scheduled maintenance will be communicated in advance when possible. LotPilot is not responsible for downtime caused by third-party services, internet outages, or circumstances outside our control.</p>
        </Section>

        <Section num="7" title="Limitation of Liability">
          <p>To the maximum extent permitted by applicable law, LotPilot and its affiliates, officers, employees, and agents are not liable for any indirect, incidental, special, consequential, or punitive damages — including lost profits, lost data, lost leads, or business interruption — arising out of or relating to your use of LotPilot, even if we have been advised of the possibility of such damages.</p>
          <p style={{ marginTop: 12 }}>LotPilot&rsquo;s total aggregate liability to you for any claims arising out of or relating to these Terms or the services shall not exceed the total fees paid by Dealer to LotPilot in the 12 months immediately preceding the event giving rise to the claim.</p>
        </Section>

        <Section num="8" title="Termination">
          <p>Either party may terminate this agreement with 30 days&rsquo; written notice. LotPilot may terminate or suspend service immediately for cause, including non-payment, violation of these Terms, or use of the platform for unlawful purposes.</p>
          <p style={{ marginTop: 12 }}>Following termination, Dealer&rsquo;s data will remain available for export for 30 days, after which LotPilot may permanently delete it. Dealer is responsible for exporting any needed data during that window.</p>
        </Section>

        <Section num="9" title="Modifications to Terms">
          <p>LotPilot may modify these Terms at any time. We will provide at least 30 days&rsquo; advance notice of material changes via email to the registered account address. Continued use of LotPilot after the effective date of revised Terms constitutes acceptance of those changes. If you do not agree to the revised Terms, you may cancel your account before the effective date.</p>
        </Section>

        <Section num="10" title="Governing Law">
          <p>These Terms are governed by and construed in accordance with the laws of the State of Florida, without regard to its conflict of law principles. Any disputes arising out of or relating to these Terms shall be resolved in the state or federal courts located in Miami-Dade County, Florida.</p>
        </Section>

        <Section num="11" title="Contact">
          <p>For questions about these Terms, contact us at:</p>
          <div style={{ marginTop: 16, padding: '20px 24px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12 }}>
            <p style={{ fontWeight: 700, marginBottom: 4 }}>AIandWEBservices</p>
            <p style={{ color: '#a1a1aa', marginBottom: 4 }}>Miami, FL</p>
            <a href="mailto:david@aiandwebservices.com" style={{ color: TEAL }}>david@aiandwebservices.com</a>
          </div>
        </Section>

        <div style={{ marginTop: 56, paddingTop: 32, borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <Link href="/lotpilot" style={{ color: '#71717a', fontSize: 13, textDecoration: 'none' }}>← Back to LotPilot.ai</Link>
          <Link href="/lotpilot/privacy" style={{ color: TEAL, fontSize: 13, textDecoration: 'none' }}>Privacy Policy →</Link>
        </div>
      </main>
    </>
  );
}

function Section({ num, title, children }) {
  return (
    <section style={{ marginBottom: 40 }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12, display: 'flex', alignItems: 'baseline', gap: 10 }}>
        <span style={{ color: TEAL, fontWeight: 800, fontSize: 14, minWidth: 24 }}>{num}.</span>
        {title}
      </h2>
      <div style={{ fontSize: 15, color: '#a1a1aa', lineHeight: 1.8 }}>
        {children}
      </div>
    </section>
  );
}
