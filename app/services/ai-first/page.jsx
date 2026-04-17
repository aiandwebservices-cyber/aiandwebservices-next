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
  title: 'AI-First — Advanced AI Automation + Voice AI + Programmatic SEO | AIandWEBservices',
  description: 'Run a bigger business with the same team. Voice AI, programmatic SEO, social media AI scheduling, and full analytics. \$349/mo + \$199 setup.',
  alternates: { canonical: 'https://www.aiandwebservices.com/services/ai-first' },
  openGraph: {
    title: 'AI-First — Advanced AI Automation + Voice AI + Programmatic SEO',
    description: 'Run a bigger business with the same team. Voice AI, programmatic SEO, and full analytics.',
    images: [{ url: 'https://www.aiandwebservices.com/api/og?title=AI-First&description=Advanced%20AI%20Automation%20%2B%20Voice%20AI%20%2B%20Programmatic%20SEO', width: 1200, height: 630, alt: 'AI-First service' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI-First — Advanced AI Automation + Voice AI + Programmatic SEO',
    description: 'Run a bigger business with the same team. Voice AI, programmatic SEO, and full analytics.',
    images: ['https://www.aiandwebservices.com/api/og?title=AI-First&description=Advanced%20AI%20Automation%20%2B%20Voice%20AI%20%2B%20Programmatic%20SEO'],
  },
};

const service = SERVICES['ai-first'];

export default function AIFirstPage() {
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
          You've Hit Your Ceiling
        </h2>
        <p style={{ fontSize: '18px', color: '#2AA5A0', fontWeight: 600, marginBottom: '32px' }}>
          You're profitable. But scaling means hiring. And hiring means complexity, cost, and coordination hell.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          <div style={{ padding: '24px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(42, 165, 160, 0.3)', borderRadius: '8px' }}>
            <p style={{ fontSize: '15px', lineHeight: 1.8, margin: 0 }}>
              <strong>You need another salesperson.</strong> But hiring costs $60K–80K/year. Training takes 3 months. Turnover kills your process. And they still miss calls, forget follow-ups, or sell inconsistently.
            </p>
          </div>
          <div style={{ padding: '24px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(42, 165, 160, 0.3)', borderRadius: '8px' }}>
            <p style={{ fontSize: '15px', lineHeight: 1.8, margin: 0 }}>
              <strong>You need content marketing.</strong> But hiring a content writer or agency is $2K–5K/month. They don't understand your business. You spend hours editing. And you're still not ranking for enough keywords.
            </p>
          </div>
          <div style={{ padding: '24px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(42, 165, 160, 0.3)', borderRadius: '8px' }}>
            <p style={{ fontSize: '15px', lineHeight: 1.8, margin: 0 }}>
              <strong>You can't answer calls.</strong> Calls go to voicemail. Prospects call competitors. Your sales guy is glued to the phone. He can't do actual selling. He's just answering "What's your availability?"
            </p>
          </div>
        </div>

        <p style={{ fontSize: '16px', lineHeight: 1.8, marginTop: '32px', color: 'rgba(255,255,255,0.85)' }}>
          <strong>Bottom line:</strong> AI-First solves all three without hiring. Voice AI answers calls. Programmatic SEO generates 100+ ranked pages automatically. Advanced automation handles everything else. <Link href="/services/consulting" style={{ color: '#2AA5A0', textDecoration: 'underline' }}>Not sure if AI-First is right for you?</Link> Get a free audit.
        </p>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: 'clamp(60px, 10vw, 100px) 20px' }}>
        <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, marginBottom: '40px' }}>
          The Full AI-First System (Weeks 1–8)
        </h2>

        <p style={{ fontSize: '15px', lineHeight: 1.8, color: 'rgba(255,255,255,0.8)', marginBottom: '32px' }}>
          This is the top tier. David builds a complete, automated system: voice AI that answers calls intelligently, advanced workflows that qualify and nurture leads automatically, programmatic SEO that generates ranked pages daily, and AI that creates social content. Your team just closes deals.
        </p>

        <div style={{ display: 'grid', gap: '28px' }}>
          {[
            { n: '1', title: 'Week 1-2: Voice AI & Phone Setup', desc: 'David provisions a phone number. Voice AI answers calls 24/7, handles common questions, routes to you when needed. Meanwhile, everything from Revenue Engine (funnel, automation, ads) is ready.' },
            { n: '2', title: 'Week 3-4: Programmatic SEO Launch', desc: 'David builds a system that generates 100+ SEO-optimized pages automatically. These pages rank for long-tail keywords you never would have written manually. Traffic compounds daily.' },
            { n: '3', title: 'Week 5-6: Advanced Automation', desc: 'Custom workflows: "If prospect calls 3 times, send VIP offer." "If email unopened after 5 days, try SMS." "If web visitor comes back 5x, book a call auto." Everything is automatic. Your team just closes.' },
            { n: '4', title: 'Week 7-8: Social Media AI + Analytics', desc: 'Social media content is generated and scheduled daily. Full analytics dashboard shows: leads by source, conversion rate by stage, call outcomes, ROI by channel. You see everything.' },
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
          <strong>Ongoing:</strong> David monitors everything. If voice AI is missing calls, he retrains it. If SEO pages aren't ranking, he adjusts. If social content isn't engaging, he changes the prompts. You're not managing a system—you're scaling it.
        </p>
      </section>

      {/* ── WHY NOT HIRE ── */}
      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: 'clamp(60px, 10vw, 100px) 20px' }}>
        <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, marginBottom: '32px' }}>
          Why AI-First Beats Hiring
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          <div style={{ padding: '24px', backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '8px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px', color: '#86efac' }}>AI-First</h3>
            <ul style={{ fontSize: '14px', lineHeight: 1.7, color: 'rgba(255,255,255,0.8)', listStyle: 'none', paddingLeft: 0 }}>
              <li style={{ marginBottom: '8px' }}>✓ $6K/month total cost</li>
              <li style={{ marginBottom: '8px' }}>✓ Immediate (no 3-month ramp)</li>
              <li style={{ marginBottom: '8px' }}>✓ Works 24/7 (no sick days)</li>
              <li style={{ marginBottom: '8px' }}>✓ Perfect consistency</li>
              <li style={{ marginBottom: '8px' }}>✓ Scales infinitely</li>
              <li>✓ No turnover, no training</li>
            </ul>
          </div>

          <div style={{ padding: '24px', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px', color: '#fca5a5' }}>Hiring</h3>
            <ul style={{ fontSize: '14px', lineHeight: 1.7, color: 'rgba(255,255,255,0.8)', listStyle: 'none', paddingLeft: 0 }}>
              <li style={{ marginBottom: '8px' }}>✗ $60K–80K + benefits/year</li>
              <li style={{ marginBottom: '8px' }}>✗ 3 months to ramp up</li>
              <li style={{ marginBottom: '8px' }}>✗ Works 9–5 only</li>
              <li style={{ marginBottom: '8px' }}>✗ Inconsistent quality</li>
              <li style={{ marginBottom: '8px' }}>✗ Can't scale without more hires</li>
              <li>✗ High turnover, constant training</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ── REAL EXAMPLE ── */}
      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: 'clamp(60px, 10vw, 100px) 20px' }}>
        <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, marginBottom: '32px' }}>
          Real Example: Coaching Business Growing 3x
        </h2>

        <p style={{ fontSize: '15px', lineHeight: 1.8, color: 'rgba(255,255,255,0.75)', marginBottom: '24px', padding: '20px', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '6px' }}>
          <strong>Before AI-First:</strong> Coach does $400K/year. Gets 100+ calls/month (many missed). Manually writes 2–3 blog posts/month. His sales guy is buried in call answering. Revenue is capped at what they can manually handle. To scale to $600K, he'd need to hire another salesperson ($70K salary) and a content writer ($4K/month).
        </p>

        <p style={{ fontSize: '15px', lineHeight: 1.8, color: 'rgba(255,255,255,0.75)', padding: '20px', backgroundColor: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '6px' }}>
          <strong>After AI-First (Month 2):</strong> Voice AI answers 80% of calls (the commodity ones). Programmatic SEO generates 20 ranked pages/month. Social media content scheduled daily. His sales guy closes 50% more deals because he's not answering phones. Revenue jumps to $600K+. Total cost: $6K/month. No new hires. No headcount.
        </p>
      </section>

      {/* ── FAQ ── */}
      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: 'clamp(60px, 10vw, 100px) 20px' }}>
        <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, marginBottom: '32px' }}>
          Common Questions
        </h2>

        <div style={{ display: 'grid', gap: '20px' }}>
          {[
            { q: "Will voice AI sound like a robot?", a: "No. It sounds like a helpful person answering common questions. It's polite, conversational, and natural. If someone needs you, the AI says 'Let me connect you with my team.'" },
            { q: "What if the voice AI makes a mistake?", a: "David monitors calls. If there's a pattern, he retrains the AI. Mistakes are rare and they're fixed quickly. Plus, voicemail still exists—if the AI doesn't understand, it captures the message." },
            { q: "Will programmatic SEO pages hurt my ranking?", a: "Not if done right. David builds them as supporting content that links back to your main site. They add authority and backlinks—actually improving your main ranking." },
            { q: "Can my team still close deals if AI is doing all the legwork?", a: "Yes—that's the point. AI does the repetitive work (answering phones, qualifying, scheduling, nurturing). Your team focuses on closing and strategy. Higher close rates, less busywork." },
            { q: "What if I want to scale differently in 2 years?", a: "You can. If you hire later, the AI doesn't go away—it just works alongside your team. You're not locked in. AI-First is a way to scale now without hiring. You can still hire later." },
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
          Is AI-First Right for You?
        </h2>

        <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.6)', marginBottom: '32px' }}>
          This is the top tier. You should have at least $100K+ annual revenue and be ready to scale without hiring.
        </p>

        <div style={{ padding: '24px', backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '8px', marginBottom: '32px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px', color: '#86efac' }}>Yes, if:</h3>
          <ul style={{ fontSize: '14px', lineHeight: 1.8, color: 'rgba(255,255,255,0.8)', listStyle: 'none', paddingLeft: 0 }}>
            <li>✓ You're doing $100K+ annual revenue</li>
            <li>✓ You're thinking about hiring but want to avoid it</li>
            <li>✓ You want to scale 2–3× this year</li>
            <li>✓ You're serious about automating everything</li>
          </ul>
        </div>

        <Link href="/#contact" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '16px', backgroundColor: '#2AA5A0', color: '#111827', borderRadius: '6px', fontWeight: 700, textDecoration: 'none', cursor: 'pointer' }}>
          Start with AI-First <ArrowRight size={18} />
        </Link>
      </section>

      {/* ── PRICING ── */}
      <V1PriceCard service={service} />

      {/* ── TIER NAV ── */}
      <V1Comparison service={service} />
    </>
  );
}
