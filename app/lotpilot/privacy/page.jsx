// This is a template and should be reviewed by a lawyer before use in production.

import Link from 'next/link';

const TEAL = '#2AA5A0';

export const metadata = {
  title: 'Privacy Policy — LotPilot.ai',
  description: 'Privacy Policy for LotPilot.ai, the AI-powered dealer management platform.',
};

export default function PrivacyPage() {
  return (
    <>
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, height: 60, display: 'flex', alignItems: 'center', padding: '0 32px', background: 'rgba(9,9,11,0.92)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.06)', gap: 24 }}>
        <Link href="/lotpilot" style={{ fontSize: 20, fontWeight: 800, color: TEAL, textDecoration: 'none' }}>LotPilot.ai</Link>
        <div style={{ flex: 1 }} />
        <Link href="/lotpilot/terms" style={{ fontSize: 13, color: '#a1a1aa', textDecoration: 'none' }}>Terms of Service</Link>
      </nav>

      <main style={{ maxWidth: 768, margin: '0 auto', padding: '64px 24px 96px' }}>
        <div style={{ marginBottom: 48 }}>
          <p style={{ fontSize: 12, color: '#71717a', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>Last updated: May 2026</p>
          <h1 style={{ fontSize: 'clamp(28px, 5vw, 40px)', fontWeight: 800, lineHeight: 1.2, marginBottom: 16 }}>Privacy Policy</h1>
          <p style={{ fontSize: 16, color: '#a1a1aa', lineHeight: 1.7 }}>
            This Privacy Policy describes how AIandWEBservices (&ldquo;LotPilot,&rdquo; &ldquo;we,&rdquo; &ldquo;us&rdquo;) collects, uses, and protects information in connection with the LotPilot.ai platform. By using LotPilot you agree to this Policy.
          </p>
        </div>

        <Section num="1" title="Information We Collect">
          <p>We collect the following categories of information:</p>
          <ul style={{ marginTop: 12, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <li><strong style={{ color: '#d4d4d8' }}>Dealer account information</strong> — business name, contact name, email address, phone number, billing information.</li>
            <li><strong style={{ color: '#d4d4d8' }}>Customer and lead data processed on Dealer&rsquo;s behalf</strong> — names, contact details, vehicle interests, and communications submitted through Dealer&rsquo;s website or CRM. This data is provided by Dealer and processed on their behalf.</li>
            <li><strong style={{ color: '#d4d4d8' }}>Usage analytics</strong> — how Dealer staff interact with the admin panel, features used, and performance metrics. Used to improve the service.</li>
            <li><strong style={{ color: '#d4d4d8' }}>Cookies and session data</strong> — standard session cookies to keep users logged in. No third-party advertising cookies.</li>
          </ul>
        </Section>

        <Section num="2" title="How We Use Information">
          <p>We use information we collect to:</p>
          <ul style={{ marginTop: 12, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <li>Provide and operate the LotPilot platform and all its features</li>
            <li>Process AI-powered features including chat, lead scoring, and follow-up generation</li>
            <li>Send service communications, billing notifications, and product updates</li>
            <li>Improve the platform through aggregated, anonymized analytics</li>
            <li>Provide customer support</li>
          </ul>
          <p style={{ marginTop: 12 }}>We do not use your data for advertising or sell it to third parties for their own use.</p>
        </Section>

        <Section num="3" title="Data Processing on Behalf of Dealers">
          <p>LotPilot processes end-customer data (leads, contacts, deals) as a <strong style={{ color: '#d4d4d8' }}>data processor</strong> acting on behalf of the Dealer, who is the <strong style={{ color: '#d4d4d8' }}>data controller</strong>. This means Dealer determines the purpose and means of processing their customers&rsquo; data; LotPilot processes it only as instructed to provide the service.</p>
          <p style={{ marginTop: 12 }}>We do not sell, rent, or share Dealer customer data with third parties for their own commercial purposes.</p>
        </Section>

        <Section num="4" title="AI Data Usage">
          <p>Customer interactions processed through LotPilot&rsquo;s AI features — including AI sales chat, description generation, and follow-up drafting — are sent to the <strong style={{ color: '#d4d4d8' }}>Claude API by Anthropic</strong> for processing.</p>
          <p style={{ marginTop: 12 }}>Per Anthropic&rsquo;s API data use policy, conversations submitted via the API are <strong style={{ color: '#d4d4d8' }}>not used to train Anthropic&rsquo;s AI models</strong>. Please refer to <a href="https://www.anthropic.com/legal/privacy" target="_blank" rel="noopener noreferrer" style={{ color: TEAL }}>Anthropic&rsquo;s Privacy Policy</a> for the most current information.</p>
        </Section>

        <Section num="5" title="Third-Party Services">
          <p>LotPilot integrates with third-party services to provide core functionality. Each provider has its own privacy policy:</p>
          <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { name: 'Stripe', purpose: 'Payment processing and billing', url: 'https://stripe.com/privacy' },
              { name: 'Twilio', purpose: 'SMS communications', url: 'https://www.twilio.com/en-us/legal/privacy' },
              { name: 'Resend', purpose: 'Transactional email delivery', url: 'https://resend.com/legal/privacy-policy' },
              { name: 'Cloudflare', purpose: 'Hosting, CDN, and security', url: 'https://www.cloudflare.com/privacypolicy/' },
              { name: 'Anthropic (Claude)', purpose: 'AI processing', url: 'https://www.anthropic.com/legal/privacy' },
              { name: 'Google', purpose: 'Maps and Google Business review integration', url: 'https://policies.google.com/privacy' },
            ].map((svc) => (
              <div key={svc.name} style={{ padding: '12px 16px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                <div>
                  <span style={{ fontWeight: 600, color: '#d4d4d8' }}>{svc.name}</span>
                  <span style={{ color: '#71717a', fontSize: 13, marginLeft: 10 }}>{svc.purpose}</span>
                </div>
                <a href={svc.url} target="_blank" rel="noopener noreferrer" style={{ color: TEAL, fontSize: 12 }}>Privacy Policy →</a>
              </div>
            ))}
          </div>
        </Section>

        <Section num="6" title="Data Storage">
          <p>Dealer data is stored on secure servers hosted on <strong style={{ color: '#d4d4d8' }}>Hetzner</strong> (Germany and/or US) and served via <strong style={{ color: '#d4d4d8' }}>Vercel</strong> (US). Each dealer&rsquo;s EspoCRM instance is logically isolated — one dealer cannot access another&rsquo;s data. Backups are performed regularly.</p>
        </Section>

        <Section num="7" title="Data Retention">
          <p>Dealer account and business data is retained for the duration of the active subscription. Upon cancellation:</p>
          <ul style={{ marginTop: 12, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <li>Data remains accessible for export for <strong style={{ color: '#d4d4d8' }}>30 days</strong> following the subscription end date.</li>
            <li>After the 30-day window, data is scheduled for deletion and permanently removed within <strong style={{ color: '#d4d4d8' }}>60 days</strong>.</li>
          </ul>
          <p style={{ marginTop: 12 }}>Dealers are encouraged to use the Data Export feature in Settings before cancelling to retain a copy of their records.</p>
        </Section>

        <Section num="8" title="Dealer's Responsibilities">
          <p>Dealers using LotPilot to communicate with their own customers are responsible for:</p>
          <ul style={{ marginTop: 12, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <li>Maintaining their own privacy policy toward end customers that discloses use of the LotPilot platform</li>
            <li>Obtaining appropriate consent before sending SMS or email marketing communications, as required by TCPA, CAN-SPAM, and applicable state law</li>
            <li>Complying with all applicable laws regarding the collection and use of customer data</li>
          </ul>
        </Section>

        <Section num="9" title="Security">
          <p>We implement reasonable security measures including:</p>
          <ul style={{ marginTop: 12, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <li>TLS encryption for all data in transit</li>
            <li>Access controls limiting data access to authorized personnel</li>
            <li>Regular automated backups</li>
            <li>Isolated per-dealer data environments</li>
          </ul>
          <p style={{ marginTop: 12 }}>No method of transmission or storage is 100% secure. We cannot guarantee absolute security but are committed to protecting your data.</p>
        </Section>

        <Section num="10" title="Your Rights">
          <p>Dealers may request to access, correct, or delete their account and business data at any time by contacting us at <a href="mailto:david@aiandwebservices.com" style={{ color: TEAL }}>david@aiandwebservices.com</a>. Data export is also available directly from the admin panel under Settings → Data &amp; Privacy.</p>
        </Section>

        <Section num="11" title="Children's Privacy">
          <p>LotPilot is a B2B platform intended for use by automotive dealership businesses and their staff. It is not directed at children under 13, and we do not knowingly collect personal information from children.</p>
        </Section>

        <Section num="12" title="Changes to This Policy">
          <p>We may update this Privacy Policy from time to time. We will provide at least 30 days&rsquo; advance notice of material changes via email to the registered account address. Continued use of LotPilot after the effective date of changes constitutes acceptance.</p>
        </Section>

        <Section num="13" title="Contact">
          <p>For privacy questions or data requests, contact us at:</p>
          <div style={{ marginTop: 16, padding: '20px 24px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12 }}>
            <p style={{ fontWeight: 700, marginBottom: 4 }}>AIandWEBservices</p>
            <p style={{ color: '#a1a1aa', marginBottom: 4 }}>Miami, FL</p>
            <a href="mailto:david@aiandwebservices.com" style={{ color: TEAL }}>david@aiandwebservices.com</a>
          </div>
        </Section>

        <div style={{ marginTop: 56, paddingTop: 32, borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <Link href="/lotpilot" style={{ color: '#71717a', fontSize: 13, textDecoration: 'none' }}>← Back to LotPilot.ai</Link>
          <Link href="/lotpilot/terms" style={{ color: TEAL, fontSize: 13, textDecoration: 'none' }}>Terms of Service →</Link>
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
