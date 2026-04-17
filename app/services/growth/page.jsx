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
  title: 'Growth — AI Automation + Email Marketing + SEO Content | AIandWEBservices',
  description: 'Turn website visitors into leads with AI automation, email marketing, SEO content, and conversion-optimized landing pages. \$149/mo + \$59 setup. No contracts.',
  alternates: { canonical: 'https://www.aiandwebservices.com/services/growth' },
  openGraph: {
    title: 'Growth — AI Automation + Email Marketing + SEO Content',
    description: 'Turn website visitors into leads with AI automation, email marketing, and SEO content.',
    images: [{ url: 'https://www.aiandwebservices.com/api/og?title=Growth&description=AI%20Automation%20%2B%20Email%20Marketing%20%2B%20SEO%20Content', width: 1200, height: 630, alt: 'Growth service' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Growth — AI Automation + Email Marketing + SEO Content',
    description: 'Turn website visitors into leads with AI automation, email marketing, and SEO content.',
    images: ['https://www.aiandwebservices.com/api/og?title=Growth&description=AI%20Automation%20%2B%20Email%20Marketing%20%2B%20SEO%20Content'],
  },
};

const service = SERVICES['growth'];

export default function GrowthPage() {
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
          You're Getting Visitors But Not Enough Leads
        </h2>
        <p style={{ fontSize: '18px', color: '#2AA5A0', fontWeight: 600, marginBottom: '32px' }}>
          Your website brings people to the door. You just can't get them to buy.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          <div style={{ padding: '24px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(42, 165, 160, 0.3)', borderRadius: '8px' }}>
            <p style={{ fontSize: '15px', lineHeight: 1.8, margin: 0 }}>
              <strong>Visitors don't convert.</strong> 100 people visit your website. 3 become inquiries. The other 97 disappear. You don't know who they are. Can't follow up. They hire a competitor.
            </p>
          </div>
          <div style={{ padding: '24px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(42, 165, 160, 0.3)', borderRadius: '8px' }}>
            <p style={{ fontSize: '15px', lineHeight: 1.8, margin: 0 }}>
              <strong>Your follow-up is chaotic.</strong> Someone downloads your guide. You send one email. They don't reply. You forget about them. Meanwhile, 5 competitors are emailing them with helpful content.
            </p>
          </div>
          <div style={{ padding: '24px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(42, 165, 160, 0.3)', borderRadius: '8px' }}>
            <p style={{ fontSize: '15px', lineHeight: 1.8, margin: 0 }}>
              <strong>You're not SEO-ranked for anything.</strong> You have a website but no blog, no helpful content. Competitors own the search results. You're invisible for the searches that matter.
            </p>
          </div>
        </div>

        <p style={{ fontSize: '16px', lineHeight: 1.8, marginTop: '32px', color: 'rgba(255,255,255,0.85)' }}>
          <strong>Bottom line:</strong> You're leaving 70–80% of your traffic on the table. If you got just 1 extra qualified lead per week, that's 50+ per year. At a $2K–$10K average deal, that's $100K–$500K in lost revenue annually. <Link href="/services/consulting" style={{ color: '#2AA5A0', textDecoration: 'underline' }}>Unsure which tier fits your business?</Link> Get a free AI audit.
        </p>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: 'clamp(60px, 10vw, 100px) 20px' }}>
        <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, marginBottom: '40px' }}>
          How Growth Converts Visitors (Weeks 1–4)
        </h2>

        <div style={{ display: 'grid', gap: '28px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '60px 1fr', gap: '20px', alignItems: 'start' }}>
            <div style={{ width: '60px', height: '60px', backgroundColor: '#2AA5A0', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '24px', color: '#111827', flexShrink: 0 }}>1</div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>Week 1: Email Marketing Setup + First Content</h3>
              <p style={{ fontSize: '15px', lineHeight: 1.8, color: 'rgba(255,255,255,0.8)', margin: 0 }}>
                David sets up email marketing (HubSpot, Mailchimp, etc.) and builds your first welcome sequence—5–7 emails that go out automatically when someone signs up. Meanwhile, he writes your first SEO article. This brings organic traffic and gives you content to share.
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '60px 1fr', gap: '20px', alignItems: 'start' }}>
            <div style={{ width: '60px', height: '60px', backgroundColor: '#2AA5A0', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '24px', color: '#111827', flexShrink: 0 }}>2</div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>Week 2: Landing Pages + AI Automation</h3>
              <p style={{ fontSize: '15px', lineHeight: 1.8, color: 'rgba(255,255,255,0.8)', margin: 0 }}>
                David builds 2–3 conversion-optimized landing pages (one for each service). Each page is designed to capture emails, not just tell your story. Plus, your AI assistant is upgraded to qualify leads and book calls.
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '60px 1fr', gap: '20px', alignItems: 'start' }}>
            <div style={{ width: '60px', height: '60px', backgroundColor: '#2AA5A0', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '24px', color: '#111827', flexShrink: 0 }}>3</div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>Week 3: Ongoing Content + CRM Integration</h3>
              <p style={{ fontSize: '15px', lineHeight: 1.8, color: 'rgba(255,255,255,0.8)', margin: 0 }}>
                David writes your second SEO article. He integrates your CRM so every lead and email interaction is tracked automatically. You never lose track of a prospect again.
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '60px 1fr', gap: '20px', alignItems: 'start' }}>
            <div style={{ width: '60px', height: '60px', backgroundColor: '#2AA5A0', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '24px', color: '#111827', flexShrink: 0 }}>4</div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>Week 4: Monthly Optimization + Strategy Call</h3>
              <p style={{ fontSize: '15px', lineHeight: 1.8, color: 'rgba(255,255,255,0.8)', margin: 0 }}>
                You have your first monthly call with David. He shows you: How many visitors converted to leads? Which landing page performed best? What's the email open rate? Based on data, he optimizes—tests new copy, adjusts CTAs, refines the funnel.
              </p>
            </div>
          </div>
        </div>

        <p style={{ fontSize: '15px', lineHeight: 1.8, marginTop: '32px', padding: '20px', backgroundColor: 'rgba(42, 165, 160, 0.1)', borderRadius: '6px', color: 'rgba(255,255,255,0.85)' }}>
          <strong>Ongoing:</strong> Every month, David writes 2 new SEO articles. Every quarter, he tests new landing page designs. The system gets smarter. Your email list grows. Organic traffic increases. Conversion rate improves.
        </p>
      </section>

      {/* ── COMPARISON ── */}
      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: 'clamp(60px, 10vw, 100px) 20px' }}>
        <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, marginBottom: '16px' }}>
          Growth vs Building This Yourself
        </h2>
        <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.6)', marginBottom: '32px' }}>
          You could hire a marketing freelancer or try DIY tools. Here's the real cost:
        </p>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid rgba(42, 165, 160, 0.5)' }}>
                <th style={{ padding: '16px', textAlign: 'left', fontWeight: 700, color: '#2AA5A0' }}>Component</th>
                <th style={{ padding: '16px', textAlign: 'center', fontWeight: 700, color: '#2AA5A0' }}>Growth</th>
                <th style={{ padding: '16px', textAlign: 'center', fontWeight: 700, color: '#2AA5A0' }}>Freelancer Route</th>
                <th style={{ padding: '16px', textAlign: 'right', fontWeight: 700, color: '#2AA5A0' }}>Freelancer Cost</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <td style={{ padding: '16px' }}>Email marketing setup</td>
                <td style={{ padding: '16px', textAlign: 'center' }}><Check size={20} color="#10b981" /></td>
                <td style={{ padding: '16px', textAlign: 'center' }}>+$500–1K</td>
                <td style={{ padding: '16px', textAlign: 'right', fontSize: '13px' }}>One-time</td>
              </tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <td style={{ padding: '16px' }}>SEO content (2 articles/month)</td>
                <td style={{ padding: '16px', textAlign: 'center' }}><Check size={20} color="#10b981" /></td>
                <td style={{ padding: '16px', textAlign: 'center' }}>+$2K–3K/mo</td>
                <td style={{ padding: '16px', textAlign: 'right', fontSize: '13px' }}>$24K–36K/yr</td>
              </tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <td style={{ padding: '16px' }}>Landing page design</td>
                <td style={{ padding: '16px', textAlign: 'center' }}><Check size={20} color="#10b981" /></td>
                <td style={{ padding: '16px', textAlign: 'center' }}>+$2K–5K ea</td>
                <td style={{ padding: '16px', textAlign: 'right', fontSize: '13px' }}>$6K–15K</td>
              </tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <td style={{ padding: '16px' }}>Strategy + optimization</td>
                <td style={{ padding: '16px', textAlign: 'center' }}><Check size={20} color="#10b981" /></td>
                <td style={{ padding: '16px', textAlign: 'center' }}>You guess</td>
                <td style={{ padding: '16px', textAlign: 'right', fontSize: '13px' }}>Lost revenue</td>
              </tr>
              <tr style={{ backgroundColor: 'rgba(42, 165, 160, 0.1)', borderTop: '2px solid rgba(42, 165, 160, 0.5)' }}>
                <td style={{ padding: '16px', fontWeight: 700 }}>Annual Cost</td>
                <td style={{ padding: '16px', textAlign: 'center', fontWeight: 700, color: '#2AA5A0' }}>$2,468</td>
                <td style={{ padding: '16px', textAlign: 'center', fontWeight: 700 }}>$36K–52K+</td>
                <td style={{ padding: '16px', textAlign: 'right', fontWeight: 700, color: '#10b981' }}>15–20× cheaper</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p style={{ fontSize: '15px', lineHeight: 1.8, marginTop: '24px', color: 'rgba(255,255,255,0.75)' }}>
          Most freelancers deliver content but no strategy. Landing pages that don't convert. No one's coordinating the whole funnel. With Growth, David is your marketing director. You get a working system, not scattered deliverables. <Link href="/#pricing" style={{ color: '#2AA5A0', textDecoration: 'underline' }}>See all tier options</Link> to find the right fit for your business.
        </p>
      </section>

      {/* ── REAL EXAMPLE ── */}
      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: 'clamp(60px, 10vw, 100px) 20px' }}>
        <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, marginBottom: '32px' }}>
          Real Example: Marketing Consultant
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          <div style={{ padding: '24px', backgroundColor: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px', color: '#fca5a5' }}>Before Growth</h3>
            <ul style={{ fontSize: '14px', lineHeight: 1.7, color: 'rgba(255,255,255,0.75)', listStyle: 'none', paddingLeft: 0 }}>
              <li style={{ marginBottom: '8px' }}>✗ Website gets ~200 visitors/month (from LinkedIn shares)</li>
              <li style={{ marginBottom: '8px' }}>✗ Maybe 2–3 inquiries from website</li>
              <li style={{ marginBottom: '8px' }}>✗ No email follow-up system</li>
              <li style={{ marginBottom: '8px' }}>✗ Lost leads because no follow-up</li>
              <li>✗ Spending $2K/month on Google Ads, only getting 2 new clients</li>
            </ul>
          </div>

          <div style={{ padding: '24px', backgroundColor: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '8px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px', color: '#86efac' }}>After Growth (Month 2)</h3>
            <ul style={{ fontSize: '14px', lineHeight: 1.7, color: 'rgba(255,255,255,0.75)', listStyle: 'none', paddingLeft: 0 }}>
              <li style={{ marginBottom: '8px' }}>✓ Website now gets ~400 visitors/month (organic + social)</li>
              <li style={{ marginBottom: '8px' }}>✓ 12–15 inquiries/month (email automation + landing pages)</li>
              <li style={{ marginBottom: '8px' }}>✓ Email welcome sequence nurtures cold leads</li>
              <li style={{ marginBottom: '8px' }}>✓ Closes 25% of leads = 3–4 new clients/month</li>
              <li>✓ Cuts Google Ad spend to $500 (better targeting, better landing pages)</li>
            </ul>
          </div>
        </div>

        <p style={{ fontSize: '15px', lineHeight: 1.8, marginTop: '24px', padding: '20px', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '6px' }}>
          <strong>Revenue impact:</strong> Consultant charges $5K per engagement. 2 extra clients/month = $10K additional monthly revenue. Pays for Growth in less than a month. Saves $1,500/month on paid ads (better efficiency). <Link href="/services/add-ons" style={{ color: '#2AA5A0', textDecoration: 'underline' }}>Add online sales with E-commerce integration</Link>.
        </p>
      </section>

      {/* ── FAQ ── */}
      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: 'clamp(60px, 10vw, 100px) 20px' }}>
        <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, marginBottom: '32px' }}>
          Common Questions
        </h2>

        <div style={{ display: 'grid', gap: '20px' }}>
          {[
            { q: "Will David's content reflect my voice?", a: "Yes. He interviews you about your approach, values, and style. He writes in your voice, not generic marketing speak. Every article gets your approval before publishing." },
            { q: "How long before SEO content starts ranking?", a: "3–6 months. Google doesn't rank new content instantly. But after 6 months, you'll have 12 articles ranking on page 1 for your target keywords. This brings passive organic traffic forever." },
            { q: "What if I don't want email marketing?", a: "Most clients love it—it's how you stay in front of prospects. But you can simplify it. The welcome sequence is the core piece. Advanced sequences can be added later." },
            { q: "Can I use this with my existing CRM?", a: "Yes. David integrates with HubSpot, Salesforce, Pipedrive, etc. Every lead goes into your CRM automatically. You're never chasing data again." },
            { q: "What if the landing pages don't convert?", a: "David tests and optimizes them. If a headline isn't working, he tests a new one. If the form is too long, he shortens it. Conversion optimization is ongoing, not a one-time build." },
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
          Is Growth Right for You?
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '40px' }}>
          <div style={{ padding: '24px', backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '8px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px', color: '#86efac' }}>Yes, if:</h3>
            <ul style={{ fontSize: '14px', lineHeight: 1.8, color: 'rgba(255,255,255,0.8)', listStyle: 'none', paddingLeft: 0 }}>
              <li>✓ You already have a good website</li>
              <li>✓ You get some inquiries but want consistent leads</li>
              <li>✓ You're not doing SEO content yet</li>
              <li>✓ You need follow-up automation</li>
            </ul>
          </div>

          <div style={{ padding: '24px', backgroundColor: 'rgba(168, 85, 247, 0.1)', border: '1px solid rgba(168, 85, 247, 0.3)', borderRadius: '8px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px', color: '#d8b4fe' }}>Consider Revenue Engine if:</h3>
            <ul style={{ fontSize: '14px', lineHeight: 1.8, color: 'rgba(255,255,255,0.8)', listStyle: 'none', paddingLeft: 0 }}>
              <li>You already have lots of leads</li>
              <li>You need to improve your sales close rate</li>
              <li>You want paid ads setup and managed</li>
              <li>You're ready to scale aggressively</li>
            </ul>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
          <Link href="/#contact" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '16px', backgroundColor: '#2AA5A0', color: '#111827', borderRadius: '6px', fontWeight: 700, textDecoration: 'none', cursor: 'pointer' }}>
            Start with Growth <ArrowRight size={18} />
          </Link>
          <Link href="/services/revenue-engine" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '16px', backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff', borderRadius: '6px', fontWeight: 700, textDecoration: 'none', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.2)' }}>
            See Revenue Engine →
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
