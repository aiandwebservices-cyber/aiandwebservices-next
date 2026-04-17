import Link from 'next/link';
import { SERVICES } from '@/lib/services-data';
import { ServicePageSchema, BreadcrumbListSchema } from '@/components/Schema';
import V1Hero from '@/components/v1-components/V1Hero';
import V1FeatureGrid from '@/components/v1-components/V1FeatureGrid';
import V1FitCheck from '@/components/v1-components/V1FitCheck';
import V1Timeline from '@/components/v1-components/V1Timeline';
import V1PriceCard from '@/components/v1-components/V1PriceCard';
import V1Comparison from '@/components/v1-components/V1Comparison';
import { Check, X, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Presence — Professional Website + Local SEO + AI Assistant | AIandWEBservices',
  description: 'Get found online: website, local SEO, AI assistant. $99/mo + $39 setup.',
  alternates: { canonical: 'https://www.aiandwebservices.com/services/presence' },
};

const service = SERVICES['presence'];

export default function PresencePage() {
  if (!service) return <div style={{ padding: '3rem', textAlign: 'center' }}>Service not found.</div>;

  return (
    <>
      <ServicePageSchema service={service} />
      <BreadcrumbListSchema serviceName={service.tier} serviceSlug={service.slug} />
      <V1Hero service={service} />
      <V1FeatureGrid features={service.features} />

      {/* ── THE PROBLEM ── */}
      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: 'clamp(60px, 10vw, 100px) 20px' }}>
        <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, marginBottom: '12px' }}>
          You're Invisible Online
        </h2>
        <p style={{ fontSize: '18px', color: '#2AA5A0', fontWeight: 600, marginBottom: '32px' }}>
          ...and losing customers to businesses that aren't.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          <div style={{ padding: '24px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(42, 165, 160, 0.3)', borderRadius: '8px' }}>
            <p style={{ fontSize: '15px', lineHeight: 1.8, margin: 0 }}>
              <strong>No website</strong> or a website from 2015. Prospects Google you → see outdated design → assume you're out of business.
            </p>
          </div>
          <div style={{ padding: '24px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(42, 165, 160, 0.3)', borderRadius: '8px' }}>
            <p style={{ fontSize: '15px', lineHeight: 1.8, margin: 0 }}>
              <strong>Not in Google Maps</strong> or your profile is incomplete. Local searches show competitors instead. You lose walk-in traffic and phone calls.
            </p>
          </div>
          <div style={{ padding: '24px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(42, 165, 160, 0.3)', borderRadius: '8px' }}>
            <p style={{ fontSize: '15px', lineHeight: 1.8, margin: 0 }}>
              <strong>You're answering the same questions</strong> over and over. "What are your hours?" "Do you serve my area?" "How much does it cost?" Takes 20 hours/month just handling basic FAQs.
            </p>
          </div>
        </div>

        <p style={{ fontSize: '16px', lineHeight: 1.8, marginTop: '32px', color: 'rgba(255,255,255,0.85)' }}>
          <strong>Bottom line:</strong> You're leaving money on the table. For every competitor showing up in Google Maps, you lose 3–5 local inquiries per month. That's $2K–$10K in lost revenue. <Link href="/services/consulting" style={{ color: '#2AA5A0', textDecoration: 'underline' }}>Not sure if Presence is the right fit for your business?</Link> Start with a free audit.
        </p>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: 'clamp(60px, 10vw, 100px) 20px' }}>
        <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, marginBottom: '40px' }}>
          How Presence Fixes It (Week 1–3)
        </h2>

        <div style={{ display: 'grid', gap: '28px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '60px 1fr', gap: '20px', alignItems: 'start' }}>
            <div style={{ width: '60px', height: '60px', backgroundColor: '#2AA5A0', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '24px', color: '#111827', flexShrink: 0 }}>1</div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>Week 1: Discovery & Website Build</h3>
              <p style={{ fontSize: '15px', lineHeight: 1.8, color: 'rgba(255,255,255,0.8)', margin: 0 }}>
                David interviews you (1 hour) to understand your business, services, pricing, target customers. He builds a fast, mobile-friendly website (5 pages) that converts visitors into inquiries. Professional design. Clear CTAs. Your business story—not a template.
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '60px 1fr', gap: '20px', alignItems: 'start' }}>
            <div style={{ width: '60px', height: '60px', backgroundColor: '#2AA5A0', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '24px', color: '#111827', flexShrink: 0 }}>2</div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>Week 2: Google Business Profile Setup</h3>
              <p style={{ fontSize: '15px', lineHeight: 1.8, color: 'rgba(255,255,255,0.8)', margin: 0 }}>
                David fully optimizes your Google Business Profile (formerly Google My Business). Photos, hours, service areas, description—everything Google needs to rank you locally. Result: You show up in Google Maps searches. Phone calls increase 30–50% in first month.
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '60px 1fr', gap: '20px', alignItems: 'start' }}>
            <div style={{ width: '60px', height: '60px', backgroundColor: '#2AA5A0', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '24px', color: '#111827', flexShrink: 0 }}>3</div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>Week 3: AI Assistant Launch</h3>
              <p style={{ fontSize: '15px', lineHeight: 1.8, color: 'rgba(255,255,255,0.8)', margin: 0 }}>
                Your website gets a basic AI assistant that answers FAQs instantly. "What are your hours?" "Do you serve my area?" The AI responds 24/7. You save 10+ hours/month on repeat questions. Prospects get instant answers instead of waiting for you.
              </p>
            </div>
          </div>
        </div>

        <p style={{ fontSize: '15px', lineHeight: 1.8, marginTop: '32px', padding: '20px', backgroundColor: 'rgba(42, 165, 160, 0.1)', borderRadius: '6px', color: 'rgba(255,255,255,0.85)' }}>
          <strong>Ongoing:</strong> Every month, David sends a performance report. How many visitors? Where did they come from? How many inquiries? What's trending? He monitors your Google profile and website—you just focus on serving customers.
        </p>
      </section>

      {/* ── COMPARISON ── */}
      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: 'clamp(60px, 10vw, 100px) 20px' }}>
        <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, marginBottom: '16px' }}>
          Presence vs the DIY Path
        </h2>
        <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.6)', marginBottom: '32px' }}>
          You could try building this yourself. Here's what that costs:
        </p>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid rgba(42, 165, 160, 0.5)' }}>
                <th style={{ padding: '16px', textAlign: 'left', fontWeight: 700, color: '#2AA5A0' }}>What You Need</th>
                <th style={{ padding: '16px', textAlign: 'center', fontWeight: 700, color: '#2AA5A0' }}>Presence</th>
                <th style={{ padding: '16px', textAlign: 'center', fontWeight: 700, color: '#2AA5A0' }}>DIY (Wix/Squarespace)</th>
                <th style={{ padding: '16px', textAlign: 'right', fontWeight: 700, color: '#2AA5A0' }}>DIY Time Cost</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <td style={{ padding: '16px' }}>Website design & build</td>
                <td style={{ padding: '16px', textAlign: 'center' }}><Check size={20} color="#10b981" /></td>
                <td style={{ padding: '16px', textAlign: 'center' }}>DIY template</td>
                <td style={{ padding: '16px', textAlign: 'right', fontSize: '13px' }}>20+ hours</td>
              </tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <td style={{ padding: '16px' }}>Google Business optimization</td>
                <td style={{ padding: '16px', textAlign: 'center' }}><Check size={20} color="#10b981" /></td>
                <td style={{ padding: '16px', textAlign: 'center' }}>You figure it out</td>
                <td style={{ padding: '16px', textAlign: 'right', fontSize: '13px' }}>5+ hours</td>
              </tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <td style={{ padding: '16px' }}>AI assistant setup</td>
                <td style={{ padding: '16px', textAlign: 'center' }}><Check size={20} color="#10b981" /></td>
                <td style={{ padding: '16px', textAlign: 'center' }}>Zapier + ChatGPT</td>
                <td style={{ padding: '16px', textAlign: 'right', fontSize: '13px' }}>10+ hours</td>
              </tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <td style={{ padding: '16px' }}>Monthly monitoring & updates</td>
                <td style={{ padding: '16px', textAlign: 'center' }}><Check size={20} color="#10b981" /></td>
                <td style={{ padding: '16px', textAlign: 'center' }}><X size={20} color="#ef4444" /></td>
                <td style={{ padding: '16px', textAlign: 'right', fontSize: '13px' }}>2 hrs/mo = $24/yr</td>
              </tr>
              <tr style={{ backgroundColor: 'rgba(42, 165, 160, 0.1)', borderTop: '2px solid rgba(42, 165, 160, 0.5)' }}>
                <td style={{ padding: '16px', fontWeight: 700 }}>Total 1-Year Cost</td>
                <td style={{ padding: '16px', textAlign: 'center', fontWeight: 700, color: '#2AA5A0' }}>$1,227</td>
                <td style={{ padding: '16px', textAlign: 'center', fontWeight: 700 }}>$200–500 software + 35+ hours DIY</td>
                <td style={{ padding: '16px', textAlign: 'right', fontWeight: 700, color: '#10b981' }}>$3,500+</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p style={{ fontSize: '15px', lineHeight: 1.8, marginTop: '24px', color: 'rgba(255,255,255,0.75)' }}>
          DIY sites look amateur. Google ranks them lower. Your AI assistant is buggy or non-existent. You're guessing if anything works. For $1,227, Presence eliminates the guessing and gets you results. <Link href="/#pricing" style={{ color: '#2AA5A0', textDecoration: 'underline' }}>See all pricing tiers and compare</Link> to find the right fit for your business.
        </p>
      </section>

      {/* ── REAL EXAMPLE ── */}
      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: 'clamp(60px, 10vw, 100px) 20px' }}>
        <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, marginBottom: '32px' }}>
          Real Example: Local Plumbing Business
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          <div style={{ padding: '24px', backgroundColor: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px', color: '#fca5a5' }}>Before Presence</h3>
            <ul style={{ fontSize: '14px', lineHeight: 1.7, color: 'rgba(255,255,255,0.75)', listStyle: 'none', paddingLeft: 0 }}>
              <li style={{ marginBottom: '8px' }}>✗ Old website from 2018 (looks unprofessional)</li>
              <li style={{ marginBottom: '8px' }}>✗ Google Maps not fully set up</li>
              <li style={{ marginBottom: '8px' }}>✗ Phone rings constantly (all repeat questions)</li>
              <li style={{ marginBottom: '8px' }}>✗ Missing calls during jobs</li>
              <li>✗ ~5–8 inquiries/month, losing 2–3 to competitors showing up first</li>
            </ul>
          </div>

          <div style={{ padding: '24px', backgroundColor: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '8px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px', color: '#86efac' }}>After Presence (Month 1)</h3>
            <ul style={{ fontSize: '14px', lineHeight: 1.7, color: 'rgba(255,255,255,0.75)', listStyle: 'none', paddingLeft: 0 }}>
              <li style={{ marginBottom: '8px' }}>✓ Professional website ranks locally</li>
              <li style={{ marginBottom: '8px' }}>✓ Google Maps shows up in local searches</li>
              <li style={{ marginBottom: '8px' }}>✓ AI answers "Are you available Saturday?" (saves 10 calls/week)</li>
              <li style={{ marginBottom: '8px' }}>✓ Prospects see professional first impression</li>
              <li>✓ 12–15 inquiries/month (50% increase from Google Maps visibility)</li>
            </ul>
          </div>
        </div>

        <p style={{ fontSize: '15px', lineHeight: 1.8, marginTop: '24px', padding: '20px', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '6px' }}>
          <strong>Revenue impact:</strong> Plumber closes 30% of inquiries. 5 extra inquiries/month × 30% = 1.5 new jobs/month = $3K–$6K in new monthly revenue. Pays for Presence in less than 1 month. Want to add accessibility compliance? <Link href="/services/add-ons" style={{ color: '#2AA5A0', textDecoration: 'underline' }}>Learn about the WCAG Accessibility Audit add-on</Link>.
        </p>
      </section>

      {/* ── FAQ ── */}
      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: 'clamp(60px, 10vw, 100px) 20px' }}>
        <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, marginBottom: '32px' }}>
          Common Questions
        </h2>

        <div style={{ display: 'grid', gap: '20px' }}>
          {[
            { q: "Will the website look like a template?", a: "No. David builds a custom site for your business. It's not a template where you fill in blanks. It looks professional, matches your brand, and converts visitors into inquiries." },
            { q: "How long until I see results in Google Maps?", a: "Google takes 1–2 weeks to index your optimized profile. Most clients see 30–50% more local calls within 30 days. It keeps improving as the profile gets more reviews." },
            { q: "What if I don't want an AI assistant?", a: "Most clients love it. But you can keep it basic. The AI just answers FAQs—it doesn't replace you. If someone needs real help, they can click to book a call." },
            { q: "Can I update the website myself?", a: "Yes. David trains you and sets up a simple editor. You can update text, photos, hours. For major changes, you can email David—included in the monthly fee." },
            { q: "What if the website underperforms?", a: "David monitors it monthly and adjusts. If something isn't working, he optimizes it. If the homepage isn't converting, he tests a different design. You're not paying for a website that sits there—you're paying for results." },
            { q: "Do I need to worry about accessibility compliance?", a: "WCAG accessibility is important. If you need a full accessibility audit and remediation, we offer that as an add-on service. Most clients bundle it with Presence to ensure their site is usable by everyone." },
          ].map((item, i) => (
            <div key={i} style={{ paddingBottom: '20px', borderBottom: i < 5 ? '1px solid rgba(255,255,255,0.1)' : 'none' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '8px', color: '#fff' }}>{item.q}</h3>
              <p style={{ fontSize: '15px', lineHeight: 1.7, color: 'rgba(255,255,255,0.75)', margin: 0 }}>{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── EXISTING COMPONENTS ── */}
      <V1FitCheck bullets={service.fitBullets} />
      <V1Timeline timeline={service.timeline} />

      {/* ── RIGHT FOR YOU ── */}
      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: 'clamp(60px, 10vw, 100px) 20px' }}>
        <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, marginBottom: '32px' }}>
          Is Presence Right for You?
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '40px' }}>
          <div style={{ padding: '24px', backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '8px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px', color: '#86efac' }}>Yes, if:</h3>
            <ul style={{ fontSize: '14px', lineHeight: 1.8, color: 'rgba(255,255,255,0.8)', listStyle: 'none', paddingLeft: 0 }}>
              <li>✓ You have no website or an outdated one</li>
              <li>✓ You're a local business (plumber, cleaner, contractor, salon, etc.)</li>
              <li>✓ You get some inquiries but want more</li>
              <li>✓ You're tired of answering the same questions</li>
            </ul>
          </div>

          <div style={{ padding: '24px', backgroundColor: 'rgba(168, 85, 247, 0.1)', border: '1px solid rgba(168, 85, 247, 0.3)', borderRadius: '8px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px', color: '#d8b4fe' }}>Consider Growth if:</h3>
            <ul style={{ fontSize: '14px', lineHeight: 1.8, color: 'rgba(255,255,255,0.8)', listStyle: 'none', paddingLeft: 0 }}>
              <li>You already have a good website</li>
              <li>You want email marketing too</li>
              <li>You want SEO content strategy</li>
              <li>You're getting 20+ inquiries/month</li>
            </ul>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
          <Link href="/#contact" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '16px', backgroundColor: '#2AA5A0', color: '#111827', borderRadius: '6px', fontWeight: 700, textDecoration: 'none', cursor: 'pointer' }}>
            Start with Presence <ArrowRight size={18} />
          </Link>
          <Link href="/services/growth" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '16px', backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff', borderRadius: '6px', fontWeight: 700, textDecoration: 'none', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.2)' }}>
            See Growth Tier →
          </Link>
        </div>
      </section>

      {/* ── PRICING ── */}
      <V1PriceCard service={service} />

      {/* ── TIER NAV ── */}
      <V1Comparison service={service} />
    </>
  );
}
