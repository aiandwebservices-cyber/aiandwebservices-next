import Link from 'next/link';
import { ServicePageSchema, BreadcrumbListSchema } from '@/components/Schema';
import { SERVICES } from '@/lib/services-data';
import V1Hero from '@/components/v1-components/V1Hero';
import V1FeatureGrid from '@/components/v1-components/V1FeatureGrid';
import V1FitCheck from '@/components/v1-components/V1FitCheck';
import V1Timeline from '@/components/v1-components/V1Timeline';
import V1PriceCard from '@/components/v1-components/V1PriceCard';
import V1Comparison from '@/components/v1-components/V1Comparison';
import { Check, X, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Revenue Engine — Full Sales Funnel + Automation + Paid Ads | AIandWEBservices',
  description: 'Automate your entire sales process with a full funnel, workflow automation, CRM integration, and paid ads. Monthly strategy calls with David. $299/mo + $99 setup.',
  alternates: { canonical: 'https://www.aiandwebservices.com/services/revenue-engine' },
};

const service = SERVICES['revenue-engine'];

export default function RevenueEnginePage() {
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
          You Have Leads But Your Sales Process Is Broken
        </h2>
        <p style={{ fontSize: '18px', color: '#2AA5A0', fontWeight: 600, marginBottom: '32px' }}>
          You're leaving money on the table because your team is handling everything manually.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          <div style={{ padding: '24px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(42, 165, 160, 0.3)', borderRadius: '8px' }}>
            <p style={{ fontSize: '15px', lineHeight: 1.8, margin: 0 }}>
              <strong>Your sales process is chaos.</strong> Prospects are scattered across emails, calls, spreadsheets. One person forgets to follow up. Deal stalls. Prospect buys from competitor.
            </p>
          </div>
          <div style={{ padding: '24px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(42, 165, 160, 0.3)', borderRadius: '8px' }}>
            <p style={{ fontSize: '15px', lineHeight: 1.8, margin: 0 }}>
              <strong>Your ads are wasting money.</strong> You're running Google/Meta ads but converting less than 2% of clicks. Nobody's optimizing. You're paying $200/lead when you should pay $50.
            </p>
          </div>
          <div style={{ padding: '24px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(42, 165, 160, 0.3)', borderRadius: '8px' }}>
            <p style={{ fontSize: '15px', lineHeight: 1.8, margin: 0 }}>
              <strong>You need to hire to scale.</strong> To handle more leads, you need another salesperson. That's $3K–$6K/month. But your close rate is still inconsistent. You're adding headcount, not margin.
            </p>
          </div>
        </div>

        <p style={{ fontSize: '16px', lineHeight: 1.8, marginTop: '32px', color: 'rgba(255,255,255,0.85)' }}>
          <strong>Bottom line:</strong> If you're getting 100 leads/month and closing 20%, you're closing 20 deals. If you optimized your funnel to 35%, that's 35 deals—75% more revenue without hiring. <Link href="/services/consulting" style={{ color: '#2AA5A0', textDecoration: 'underline' }}>Not sure if Revenue Engine is right for you?</Link> Start with a free audit.
        </p>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: 'clamp(60px, 10vw, 100px) 20px' }}>
        <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, marginBottom: '40px' }}>
          How Revenue Engine Scales Your Sales (Weeks 1–4)
        </h2>

        <div style={{ display: 'grid', gap: '28px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '60px 1fr', gap: '20px', alignItems: 'start' }}>
            <div style={{ width: '60px', height: '60px', backgroundColor: '#2AA5A0', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '24px', color: '#111827', flexShrink: 0 }}>1</div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>Week 1: Funnel Audit & Strategy</h3>
              <p style={{ fontSize: '15px', lineHeight: 1.8, color: 'rgba(255,255,255,0.8)', margin: 0 }}>
                David maps your current sales funnel. Where do prospects enter? Where do they get stuck? What's stopping conversions? He identifies 3–5 critical bottlenecks and designs a better funnel from awareness → decision → close.
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '60px 1fr', gap: '20px', alignItems: 'start' }}>
            <div style={{ width: '60px', height: '60px', backgroundColor: '#2AA5A0', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '24px', color: '#111827', flexShrink: 0 }}>2</div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>Week 2: Workflow Automation + Ads Setup</h3>
              <p style={{ fontSize: '15px', lineHeight: 1.8, color: 'rgba(255,255,255,0.8)', margin: 0 }}>
                David builds automated workflows: "If lead opens 3+ emails, send them an SMS reminder." "If they visit pricing page twice, book a call." Google and Meta ads are set up with proper tracking. Every click is tagged. Every conversion is measured.
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '60px 1fr', gap: '20px', alignItems: 'start' }}>
            <div style={{ width: '60px', height: '60px', backgroundColor: '#2AA5A0', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '24px', color: '#111827', flexShrink: 0 }}>3</div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>Week 3: CRM Integration + Ad Optimization</h3>
              <p style={{ fontSize: '15px', lineHeight: 1.8, color: 'rgba(255,255,255,0.8)', margin: 0 }}>
                Your CRM (HubSpot, Salesforce, Pipedrive) is fully integrated. Every touchpoint is tracked. First ads are running. David monitors cost per lead, click-through rates, and conversion rates. Weak ads are paused. Winning ads are scaled.
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '60px 1fr', gap: '20px', alignItems: 'start' }}>
            <div style={{ width: '60px', height: '60px', backgroundColor: '#2AA5A0', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '24px', color: '#111827', flexShrink: 0 }}>4</div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>Week 4+: Monthly Strategy Calls</h3>
              <p style={{ fontSize: '15px', lineHeight: 1.8, color: 'rgba(255,255,255,0.8)', margin: 0 }}>
                Every month, you and David review: Revenue from each channel. Cost per lead. Close rate by stage. What's working? What's broken? You make decisions. David optimizes based on data.
              </p>
            </div>
          </div>
        </div>

        <p style={{ fontSize: '15px', lineHeight: 1.8, marginTop: '32px', padding: '20px', backgroundColor: 'rgba(42, 165, 160, 0.1)', borderRadius: '6px', color: 'rgba(255,255,255,0.85)' }}>
          <strong>Ongoing:</strong> David monitors your ads daily. Underperforming campaigns are optimized or paused. Workflows are refined. A/B tests run on landing pages. The system compounds. Cost per lead drops. Close rate improves. Revenue grows without hiring.
        </p>
      </section>

      {/* ── COMPARISON ── */}
      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: 'clamp(60px, 10vw, 100px) 20px' }}>
        <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, marginBottom: '16px' }}>
          Revenue Engine vs Hiring a Sales Manager
        </h2>
        <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.6)', marginBottom: '32px' }}>
          You could hire a sales manager to build this funnel. Here's the real comparison:
        </p>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid rgba(42, 165, 160, 0.5)' }}>
                <th style={{ padding: '16px', textAlign: 'left', fontWeight: 700, color: '#2AA5A0' }}>Function</th>
                <th style={{ padding: '16px', textAlign: 'center', fontWeight: 700, color: '#2AA5A0' }}>Revenue Engine</th>
                <th style={{ padding: '16px', textAlign: 'center', fontWeight: 700, color: '#2AA5A0' }}>Hire Sales Manager</th>
                <th style={{ padding: '16px', textAlign: 'right', fontWeight: 700, color: '#2AA5A0' }}>Manager Cost</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <td style={{ padding: '16px' }}>Funnel design & build</td>
                <td style={{ padding: '16px', textAlign: 'center' }}><Check size={20} color="#10b981" /></td>
                <td style={{ padding: '16px', textAlign: 'center' }}><Check size={20} color="#10b981" /></td>
                <td style={{ padding: '16px', textAlign: 'right', fontSize: '13px' }}>3 months to build</td>
              </tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <td style={{ padding: '16px' }}>Automation setup</td>
                <td style={{ padding: '16px', textAlign: 'center' }}><Check size={20} color="#10b981" /></td>
                <td style={{ padding: '16px', textAlign: 'center' }}><X size={20} color="#ef4444" /></td>
                <td style={{ padding: '16px', textAlign: 'right', fontSize: '13px' }}>Usually skipped</td>
              </tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <td style={{ padding: '16px' }}>Paid ads management</td>
                <td style={{ padding: '16px', textAlign: 'center' }}><Check size={20} color="#10b981" /></td>
                <td style={{ padding: '16px', textAlign: 'center' }}><Check size={20} color="#10b981" /></td>
                <td style={{ padding: '16px', textAlign: 'right', fontSize: '13px' }}>May outsource</td>
              </tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <td style={{ padding: '16px' }}>Data-driven optimization</td>
                <td style={{ padding: '16px', textAlign: 'center' }}><Check size={20} color="#10b981" /></td>
                <td style={{ padding: '16px', textAlign: 'center' }}>Depends</td>
                <td style={{ padding: '16px', textAlign: 'right', fontSize: '13px' }}>Usually slow</td>
              </tr>
              <tr style={{ backgroundColor: 'rgba(42, 165, 160, 0.1)', borderTop: '2px solid rgba(42, 165, 160, 0.5)' }}>
                <td style={{ padding: '16px', fontWeight: 700 }}>Annual Cost + Benefits</td>
                <td style={{ padding: '16px', textAlign: 'center', fontWeight: 700, color: '#2AA5A0' }}>$3,888</td>
                <td style={{ padding: '16px', textAlign: 'center', fontWeight: 700 }}>$60K–80K salary + benefits</td>
                <td style={{ padding: '16px', textAlign: 'right', fontWeight: 700, color: '#10b981' }}>15–20× cheaper</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p style={{ fontSize: '15px', lineHeight: 1.8, marginTop: '24px', color: 'rgba(255,255,255,0.75)' }}>
          Hiring a sales manager takes 2–3 months to onboard. They might be great at sales but bad at systems/automation. Revenue Engine is immediate, automated, and optimized from day one. <Link href="/#pricing" style={{ color: '#2AA5A0', textDecoration: 'underline' }}>Compare all tiers</Link> to see which fits your growth stage.
        </p>
      </section>

      {/* ── REAL EXAMPLE ── */}
      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: 'clamp(60px, 10vw, 100px) 20px' }}>
        <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, marginBottom: '32px' }}>
          Real Example: B2B SaaS Company
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          <div style={{ padding: '24px', backgroundColor: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px', color: '#fca5a5' }}>Before Revenue Engine</h3>
            <ul style={{ fontSize: '14px', lineHeight: 1.7, color: 'rgba(255,255,255,0.75)', listStyle: 'none', paddingLeft: 0 }}>
              <li style={{ marginBottom: '8px' }}>✗ 200 leads/month from ads ($2K/month spend)</li>
              <li style={{ marginBottom: '8px' }}>✗ Closing 10% = 20 deals/month</li>
              <li style={{ marginBottom: '8px' }}>✗ Leads scatter across emails, sheets, sales guy's brain</li>
              <li style={{ marginBottom: '8px' }}>✗ Cost per lead: $100 (high waste)</li>
              <li>✗ Need another salesperson to handle volume</li>
            </ul>
          </div>

          <div style={{ padding: '24px', backgroundColor: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '8px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px', color: '#86efac' }}>After Revenue Engine (Month 3)</h3>
            <ul style={{ fontSize: '14px', lineHeight: 1.7, color: 'rgba(255,255,255,0.75)', listStyle: 'none', paddingLeft: 0 }}>
              <li style={{ marginBottom: '8px' }}>✓ 200 leads/month from same $2K spend</li>
              <li style={{ marginBottom: '8px' }}>✓ Closing 25% = 50 deals/month (2.5× more)</li>
              <li style={{ marginBottom: '8px' }}>✓ Automated workflows nurture cold leads</li>
              <li style={{ marginBottom: '8px' }}>✓ Cost per lead: $40 (60% improvement)</li>
              <li>✓ Your existing sales guy can handle it</li>
            </ul>
          </div>
        </div>

        <p style={{ fontSize: '15px', lineHeight: 1.8, marginTop: '24px', padding: '20px', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '6px' }}>
          <strong>Revenue impact:</strong> 30 extra deals/month × $5K avg contract = $150K additional monthly revenue. Total cost: $3,888/year. Pays for itself in less than 1 week. <Link href="/services/add-ons" style={{ color: '#2AA5A0', textDecoration: 'underline' }}>Interested in accepting crypto payments?</Link> We offer that as an add-on.
        </p>
      </section>

      {/* ── FAQ ── */}
      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: 'clamp(60px, 10vw, 100px) 20px' }}>
        <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, marginBottom: '32px' }}>
          Common Questions
        </h2>

        <div style={{ display: 'grid', gap: '20px' }}>
          {[
            { q: "Will you manage my Google/Meta ads directly?", a: "Yes. David sets up and manages your ad accounts. He monitors daily, pauses underperformers, and scales winners. You're not paying for ads management separately—it's included." },
            { q: "What if my ads are currently running well?", a: "David will audit them. He'll probably find optimizations—better targeting, better landing pages, better CTAs. Even a 10% improvement in conversion rate compounds to big revenue gains." },
            { q: "How long until I see results?", a: "Week 1: Funnel design. Week 2: Ads live. Week 3: First data. Most clients see 20–30% improvement in conversion rate within 30 days." },
            { q: "Do I need to hire more sales staff?", a: "Not necessarily. Revenue Engine automates low-value work. Your existing team can close 50% more deals without growing headcount." },
            { q: "What if my current CRM isn't compatible?", a: "David works with 50+ CRMs. If yours isn't, he finds a workaround. Most integration issues are solved with Zapier or custom connectors." },
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
          Is Revenue Engine Right for You?
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '40px' }}>
          <div style={{ padding: '24px', backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '8px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px', color: '#86efac' }}>Yes, if:</h3>
            <ul style={{ fontSize: '14px', lineHeight: 1.8, color: 'rgba(255,255,255,0.8)', listStyle: 'none', paddingLeft: 0 }}>
              <li>✓ You're getting 20+ inquiries/month</li>
              <li>✓ You have a product/service ready to scale</li>
              <li>✓ You want to automate your sales process</li>
              <li>✓ You're ready to scale without hiring</li>
            </ul>
          </div>

          <div style={{ padding: '24px', backgroundColor: 'rgba(168, 85, 247, 0.1)', border: '1px solid rgba(168, 85, 247, 0.3)', borderRadius: '8px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px', color: '#d8b4fe' }}>Consider AI-First if:</h3>
            <ul style={{ fontSize: '14px', lineHeight: 1.8, color: 'rgba(255,255,255,0.8)', listStyle: 'none', paddingLeft: 0 }}>
              <li>You want voice AI (answering calls)</li>
              <li>You need programmatic SEO</li>
              <li>You're doing $100K+ annual revenue</li>
              <li>You want AI to handle complex workflows</li>
            </ul>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
          <Link href="/#contact" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '16px', backgroundColor: '#2AA5A0', color: '#111827', borderRadius: '6px', fontWeight: 700, textDecoration: 'none', cursor: 'pointer' }}>
            Start with Revenue Engine <ArrowRight size={18} />
          </Link>
          <Link href="/services/ai-first" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '16px', backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff', borderRadius: '6px', fontWeight: 700, textDecoration: 'none', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.2)' }}>
            See AI-First →
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
