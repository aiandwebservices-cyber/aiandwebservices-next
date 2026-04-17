import Link from 'next/link';
import { ServicePageSchema, BreadcrumbListSchema } from '@/components/Schema';
import { SERVICES } from '@/lib/services-data';
import V1Hero from '@/components/v1-components/V1Hero';
import V1FeatureGrid from '@/components/v1-components/V1FeatureGrid';
import V1FitCheck from '@/components/v1-components/V1FitCheck';
import V1Timeline from '@/components/v1-components/V1Timeline';
import V1PriceCard from '@/components/v1-components/V1PriceCard';
import V1Comparison from '@/components/v1-components/V1Comparison';
import { ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'AI Consulting & Strategy — Roadmap, Training, and Fractional Advisory | AIandWEBservices',
  description: 'Get expert guidance on where AI fits in your business. AI readiness audit, digital transformation roadmap, tool recommendations, and staff training. $99 one-time or $99/mo.',
  alternates: { canonical: 'https://www.aiandwebservices.com/services/consulting' },
  openGraph: {
    title: 'AI Consulting & Strategy — Roadmap, Training, and Fractional Advisory',
    description: 'Get expert guidance on where AI fits in your business. AI audit, roadmap, and staff training.',
    images: [{ url: 'https://www.aiandwebservices.com/api/og?title=AI%20Consulting&description=Roadmap%2C%20Training%2C%20Fractional%20Advisory', width: 1200, height: 630, alt: 'Consulting service' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Consulting & Strategy — Roadmap, Training, and Fractional Advisory',
    description: 'Get expert guidance on where AI fits in your business. AI audit, roadmap, and staff training.',
    images: ['https://www.aiandwebservices.com/api/og?title=AI%20Consulting&description=Roadmap%2C%20Training%2C%20Fractional%20Advisory'],
  },
};

const service = SERVICES['consulting'];

export default function ConsultingPage() {
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
          AI is Everywhere. But Where Does It Actually Fit in Your Business?
        </h2>
        <p style={{ fontSize: '18px', color: '#2AA5A0', fontWeight: 600, marginBottom: '32px' }}>
          You've heard the hype. But you have real questions. And spending thousands on the wrong solution would be a disaster.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          <div style={{ padding: '24px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(42, 165, 160, 0.3)', borderRadius: '8px' }}>
            <p style={{ fontSize: '15px', lineHeight: 1.8, margin: 0 }}>
              <strong>You don't know where to start.</strong> Everyone talks about AI, but nobody explains what actually matters for YOUR business. Voice AI? Chatbots? Automation? Content generation? You could spend months researching and still get it wrong.
            </p>
          </div>
          <div style={{ padding: '24px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(42, 165, 160, 0.3)', borderRadius: '8px' }}>
            <p style={{ fontSize: '15px', lineHeight: 1.8, margin: 0 }}>
              <strong>You want unbiased recommendations.</strong> Every AI vendor claims their tool solves everything. But they're selling their product, not solving your problem. You need someone who isn't making a commission.
            </p>
          </div>
          <div style={{ padding: '24px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(42, 165, 160, 0.3)', borderRadius: '8px' }}>
            <p style={{ fontSize: '15px', lineHeight: 1.8, margin: 0 }}>
              <strong>You want a roadmap, not a sales pitch.</strong> If you decide to move forward, you need a clear implementation plan. What gets built first? In what order? Who does what? And how do you measure success?
            </p>
          </div>
        </div>

        <p style={{ fontSize: '16px', lineHeight: 1.8, marginTop: '32px', color: 'rgba(255,255,255,0.85)' }}>
          <strong>Bottom line:</strong> Consulting gets you unstuck. David audits your business, identifies your biggest AI opportunities, recommends the right tools (no affiliate bias), builds a step-by-step roadmap, and trains your team. Then you decide what to build—with full confidence.
        </p>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: 'clamp(60px, 10vw, 100px) 20px' }}>
        <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, marginBottom: '40px' }}>
          The Audit Process (Days 1–5)
        </h2>

        <p style={{ fontSize: '15px', lineHeight: 1.8, color: 'rgba(255,255,255,0.8)', marginBottom: '32px' }}>
          You're not committing to a full build. You're getting clarity. David runs a 5-day audit to understand your business, identify your opportunities, and give you a roadmap. Then you decide if you're ready to move forward—or you've got a plan to do it yourself.
        </p>

        <div style={{ display: 'grid', gap: '28px' }}>
          {[
            { n: '1', title: 'Day 1: Discovery Call', desc: 'You explain your business, your goals, your constraints. David listens. What\'s working? What\'s broken? Where are you losing money? Where is manual work eating up your time?' },
            { n: '2', title: 'Days 1–4: Deep Audit', desc: 'David researches your business, your competitors, your current tech stack. He looks for AI opportunities: Where could automation save you time? Where could AI generate revenue? What quick wins exist?' },
            { n: '3', title: 'Day 5: Strategy Call', desc: 'David presents his findings. What he recommends. What he doesn\'t. Why. A clear roadmap: Phase 1 (Weeks 1–4), Phase 2 (Months 2–3), Phase 3 (Future). Tool recommendations—no affiliate links.' },
            { n: '4', title: 'Optional: Training + Advisory', desc: 'If you want ongoing help: staff training ($99 workshop), or monthly advisory ($99/mo for 60-minute calls, Slack access, implementation guidance).' },
          ].map((item, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '60px 1fr', gap: '20px', alignItems: 'start' }}>
              <div style={{ width: '60px', height: '60px', backgroundColor: '#2AA5A0', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '24px', color: '#111827', flexShrink: 0 }}>{item.n}</div>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>{item.title}</h3>
                <p style={{ fontSize: '15px', lineHeight: 1.8, color: 'rgba(255,255,255,0.8)', margin: 0 }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <p style={{ fontSize: '15px', lineHeight: 1.8, marginTop: '32px', padding: '20px', backgroundColor: 'rgba(42, 165, 160, 0.1)', borderRadius: '6px', color: 'rgba(255,255,255,0.85)' }}>
          <strong>Key difference:</strong> This is NOT a sales pitch. David doesn't make money if you buy one of his full-service packages. He makes money on the audit itself. That means his recommendations are honest. If you don't need anything beyond basic SEO and a website, he'll tell you.
        </p>
      </section>

      {/* ── COMPARISON ── */}
      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: 'clamp(60px, 10vw, 100px) 20px' }}>
        <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, marginBottom: '32px' }}>
          Consulting vs DIY vs Hiring a Consultant
        </h2>

        <div style={{ overflowX: 'auto', marginTop: '24px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid rgba(255,255,255,0.1)' }}>
                <th style={{ textAlign: 'left', padding: '16px', fontWeight: 700, color: '#fff' }}>Approach</th>
                <th style={{ textAlign: 'left', padding: '16px', fontWeight: 700, color: '#fff' }}>Time</th>
                <th style={{ textAlign: 'left', padding: '16px', fontWeight: 700, color: '#fff' }}>Cost</th>
                <th style={{ textAlign: 'left', padding: '16px', fontWeight: 700, color: '#fff' }}>Quality</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '16px', color: 'rgba(255,255,255,0.8)' }}>
                  <strong>DIY Research</strong>
                </td>
                <td style={{ padding: '16px', color: 'rgba(255,255,255,0.7)' }}>4–12 weeks</td>
                <td style={{ padding: '16px', color: 'rgba(255,255,255,0.7)' }}>$0</td>
                <td style={{ padding: '16px', color: 'rgba(255,255,255,0.7)' }}>Hit or miss. You might pick tools that don't fit.</td>
              </tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '16px', color: 'rgba(255,255,255,0.8)' }}>
                  <strong>Generic Consultant</strong>
                </td>
                <td style={{ padding: '16px', color: 'rgba(255,255,255,0.7)' }}>2–3 weeks (for audit)</td>
                <td style={{ padding: '16px', color: 'rgba(255,255,255,0.7)' }}>$2,000–5,000</td>
                <td style={{ padding: '16px', color: 'rgba(255,255,255,0.7)' }}>Generic advice. May recommend expensive tools or unnecessary changes.</td>
              </tr>
              <tr style={{ backgroundColor: 'rgba(16, 185, 129, 0.08)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '16px', color: '#86efac', fontWeight: 700 }}>
                  David's Consulting
                </td>
                <td style={{ padding: '16px', color: '#86efac', fontWeight: 700 }}>5 days</td>
                <td style={{ padding: '16px', color: '#86efac', fontWeight: 700 }}>$99 (or $99/mo)</td>
                <td style={{ padding: '16px', color: '#86efac', fontWeight: 700 }}>Honest, tailored roadmap. No affiliate bias. Can implement if you want.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ── REAL EXAMPLE ── */}
      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: 'clamp(60px, 10vw, 100px) 20px' }}>
        <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, marginBottom: '32px' }}>
          Real Example: Service Founder Confused About AI
        </h2>

        <p style={{ fontSize: '15px', lineHeight: 1.8, color: 'rgba(255,255,255,0.75)', marginBottom: '24px', padding: '20px', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '6px' }}>
          <strong>Before Consulting:</strong> A personal trainer runs a 1-on-1 coaching business. Makes $80K/year. Hears about AI and wonders: Should I build an AI coaching app? Should I use AI to write content? Should I hire someone to manage ChatGPT for client communication? He spends a month researching and gets nowhere. Doesn't know if any of this is worth the effort.
        </p>

        <p style={{ fontSize: '15px', lineHeight: 1.8, color: 'rgba(255,255,255,0.75)', padding: '20px', backgroundColor: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '6px' }}>
          <strong>After Consulting (Day 5):</strong> David audits his business and recommends: "Forget the AI coaching app—that won't scale your business. Instead: (1) Build a simple website with your philosophy (2 weeks). (2) Add a voice AI that answers common questions and books calls (3 weeks). (3) Use AI to write SEO content about training methods (ongoing). Start with the website, then add the AI." The trainer now has a roadmap. He doesn't have to guess. He knows Phase 1 costs $99/month, Phase 2 costs $249/month. He makes the decision with confidence.
        </p>
      </section>

      {/* ── FAQ ── */}
      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: 'clamp(60px, 10vw, 100px) 20px' }}>
        <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, marginBottom: '32px' }}>
          Common Questions
        </h2>

        <div style={{ display: 'grid', gap: '20px' }}>
          {[
            { q: "What if I decide NOT to hire you after the audit?", a: "That's fine. You get the roadmap regardless. You can hire someone else, or implement it yourself. David's job is to point you in the right direction, not to pressure you into a full-service package." },
            { q: "How detailed is the roadmap?", a: "Very detailed. It includes: what gets built first, why, what tools to use, what it costs, how long it takes, and how you'll measure success. You'll have everything you need to make a decision." },
            { q: "Can I add the staff training workshop to the audit?", a: "Yes. It's $99 extra. David runs a 2-hour workshop for your team on AI tools, where to start, how to use them safely. Great for getting everyone on the same page." },
            { q: "What if I want ongoing help after the audit?", a: "You can hire David as a fractional advisor ($99/month). Monthly strategy calls, Slack access for questions, guidance as you implement. Not a commitment—you can cancel anytime." },
            { q: "Is this for my business or for large enterprises only?", a: "Either. David works with solo entrepreneurs, small teams, and bigger businesses. The audit is tailored to your size and stage." },
          ].map((item, i) => (
            <div key={i} style={{ paddingBottom: '20px', borderBottom: i < 4 ? '1px solid rgba(255,255,255,0.1)' : 'none' }}>
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
          Is Consulting Right for You?
        </h2>

        <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.6)', marginBottom: '32px' }}>
          This is perfect if you're unsure where to start with AI. No commitment. Just clarity.
        </p>

        <div style={{ padding: '24px', backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '8px', marginBottom: '32px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px', color: '#86efac' }}>Yes, if:</h3>
          <ul style={{ fontSize: '14px', lineHeight: 1.8, color: 'rgba(255,255,255,0.8)', listStyle: 'none', paddingLeft: 0 }}>
            <li>✓ You're curious about AI but don't know where to start</li>
            <li>✓ You don't want to waste months researching</li>
            <li>✓ You want an honest assessment before spending thousands</li>
            <li>✓ You want a clear roadmap, not a sales pitch</li>
          </ul>
        </div>

        <Link href="/#contact" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '16px', backgroundColor: '#2AA5A0', color: '#111827', borderRadius: '6px', fontWeight: 700, textDecoration: 'none', cursor: 'pointer' }}>
          Start with a Consulting Audit <ArrowRight size={18} />
        </Link>
      </section>

      {/* ── PRICING ── */}
      <V1PriceCard service={service} />

      {/* ── TIER NAV ── */}
      <V1Comparison service={service} />
    </>
  );
}
