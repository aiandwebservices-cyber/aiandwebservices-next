import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import FAQAccordion from '@/components/FAQAccordion';

export const metadata = {
  title: 'AI Consulting & Strategy — Roadmap, Training, and Fractional Advisory | AIandWEBservices',
  description: 'Get expert guidance on where AI fits in your business. AI readiness audit, digital transformation roadmap, tool recommendations, and staff training. $497 one-time or $1,497/mo.',
  alternates: { canonical: 'https://www.aiandwebservices.com/services/consulting' },
  openGraph: {
    title: 'Consulting & Strategy — Know Where to Start | AIandWEBservices',
    description: 'A clear, honest assessment of where AI fits in your business — what will save you money, what\'s hype, and what order to tackle things in.',
    url: 'https://www.aiandwebservices.com/services/consulting',
    type: 'website',
  },
};

const faqItems = [
  {
    question: 'What do I actually receive?',
    answer: 'A written AI readiness audit (PDF), a prioritized transformation roadmap with cost estimates, specific tool recommendations with pros/cons, and a 30-minute debrief call. If you add the workshop, your team gets a hands-on training session.',
  },
  {
    question: 'Is this a sales pitch for your other tiers?',
    answer: "No. If you don't need my services, I'll tell you. If a competitor is a better fit for a specific need, I'll say so. My reputation depends on giving useful advice, not upselling.",
  },
  {
    question: 'Can I apply the $497 toward a build tier?',
    answer: 'Yes. If you move forward with any build tier within 60 days, the $497 consulting fee is credited toward your setup cost.',
  },
  {
    question: 'How is fractional advisory different from the strategy calls in Revenue Engine?',
    answer: 'Revenue Engine calls focus on optimizing your existing systems. Fractional advisory is broader — strategic AI decisions, vendor evaluations, new tool assessments, team training, and implementation oversight across your entire business.',
  },
  {
    question: 'Do I need to prepare anything?',
    answer: "Just a list of your current tools and your biggest operational pain points. I handle the rest during the discovery call.",
  },
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Service',
      name: 'Consulting & Strategy',
      description: 'AI readiness audit, digital transformation roadmap, tool recommendations, staff training, and optional fractional AI advisory.',
      provider: { '@type': 'Organization', name: 'AIandWEBservices', url: 'https://www.aiandwebservices.com' },
      areaServed: { '@type': 'Country', name: 'United States' },
      offers: { '@type': 'AggregateOffer', lowPrice: '497', highPrice: '1497', priceCurrency: 'USD', offerCount: '2' },
    },
    {
      '@type': 'FAQPage',
      mainEntity: faqItems.map((f) => ({
        '@type': 'Question',
        name: f.question,
        acceptedAnswer: { '@type': 'Answer', text: f.answer },
      })),
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.aiandwebservices.com' },
        { '@type': 'ListItem', position: 2, name: 'Services', item: 'https://www.aiandwebservices.com/#services' },
        { '@type': 'ListItem', position: 3, name: 'Consulting & Strategy', item: 'https://www.aiandwebservices.com/services/consulting' },
      ],
    },
  ],
};

const WHO_BULLETS = [
  "You've heard AI can help but don't know where to start",
  "You're overwhelmed by AI tools and don't know which ones matter",
  'Your team is resistant to AI and needs training and context',
  'You have budget for a build but want a plan first',
  "You're evaluating multiple vendors and want an independent perspective",
];

const INCLUDED = [
  {
    title: 'AI readiness audit',
    desc: 'I assess your current operations, tools, workflows, and pain points. Where is manual work costing you money? Where would automation have the highest ROI? What\'s your team\'s comfort level with AI? You get a written report, not just a conversation.',
  },
  {
    title: 'Digital transformation roadmap',
    desc: 'A prioritized, phased plan for implementing AI in your business. Not a generic "adopt AI" slide deck — a specific list of what to build, in what order, with estimated costs and timelines.',
  },
  {
    title: 'Tool stack recommendations',
    desc: "I recommend specific tools based on your needs, budget, and existing systems. I don't have affiliate deals with any platform, so my recommendations are genuinely unbiased.",
  },
  {
    title: 'Staff AI training and workshops',
    desc: 'I run a 2-4 hour workshop (virtual or in-person) covering what AI can and can\'t do, hands-on demos with tools relevant to your industry, prompt engineering basics, and how to evaluate AI tools. Your team leaves with practical skills, not fear.',
  },
  {
    title: 'Optional: Fractional AI advisor',
    desc: 'For $1,497/month, I serve as your ongoing AI advisor. Monthly strategy calls, tool evaluations, vendor assessments, implementation oversight, and first-call access when AI questions come up. A CTO-level AI brain on retainer without the CTO salary.',
  },
];

export default function ConsultingPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="svc-page-wrap">


        <section className="svc-page-hero">
          <div className="svc-page-eyebrow">Consulting &amp; Strategy</div>
          <h1 className="svc-page-h1">Know Exactly Where to Start<br />Before You Spend</h1>
          <p className="svc-page-lead">A clear, honest assessment of where AI fits in your business — what will save you money, what&apos;s hype, and what order to tackle things in.</p>
          <div className="svc-price-badge">$497 one-time or $1,497/mo fractional advisory</div>
        </section>

        <section className="svc-page-section">
          <h2>What This Is</h2>
          <p><strong>The problem:</strong> AI feels important but you don&apos;t know where to start. You don&apos;t want to waste $10K on the wrong solution. You want expert guidance but not a sales pitch.</p>
          <p><strong>The solution:</strong> A 5-day audit of your business, honest assessment of where AI actually helps (and where it doesn&apos;t), a prioritized roadmap, tool recommendations, team training, and ongoing strategy calls.</p>
          <p><strong>The result:</strong> Clarity. You know exactly what to build, in what order, and why. No wasted spending. No analysis paralysis.</p>
        </section>

        <section className="svc-page-section">
          <h2>Who This Is For</h2>
          <ul className="svc-check-list">
            {WHO_BULLETS.map((b, i) => (
              <li key={i}><CheckCircle size={18} color="#2AA5A0" strokeWidth={2} aria-hidden="true" /><span>{b}</span></li>
            ))}
          </ul>
          <div className="svc-callout-grid">
            <div className="svc-callout svc-callout--good">
              <div className="svc-callout-label">Perfect for</div>
              <p>Businesses with 5-50 employees going through digital transformation, executive teams evaluating AI strategy, companies with an existing tech stack that needs AI integration, and anyone who&apos;d rather spend $497 on a roadmap than $5,000 on the wrong tool.</p>
            </div>
            <div className="svc-callout svc-callout--neutral">
              <div className="svc-callout-label">Not right for</div>
              <p>Businesses that already know exactly what they need (just pick the right tier and go), or businesses looking for implementation — Consulting is advice, not build work.</p>
            </div>
          </div>
        </section>

        <section className="svc-page-section">
          <h2>What&apos;s Included</h2>
          <div className="svc-included-grid">
            {INCLUDED.map((item, i) => (
              <div key={i} className="svc-included-card">
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="svc-page-section">
          <h2>How It Works</h2>
          <div className="svc-timeline">
            <div className="svc-timeline-step">
              <div className="svc-timeline-left">
                <div className="svc-timeline-num" style={{fontSize:'11px',width:'40px',height:'40px'}}>$497</div>
                <div className="svc-timeline-line" />
              </div>
              <div className="svc-timeline-body">
                <div className="svc-timeline-title">One-Time Engagement <span className="svc-timeline-time">$497</span></div>
                <p className="svc-timeline-desc">Discovery call (60 min) → I audit and research (3-5 business days) → Deliver written audit, roadmap, and tool recommendations → 30-minute debrief call to walk through findings → Optional: staff training workshop (additional $497).</p>
              </div>
            </div>
            <div className="svc-timeline-step">
              <div className="svc-timeline-left">
                <div className="svc-timeline-num" style={{fontSize:'11px',width:'40px',height:'40px'}}>$1.5k</div>
              </div>
              <div className="svc-timeline-body">
                <div className="svc-timeline-title">Fractional Advisory <span className="svc-timeline-time">$1,497/mo</span></div>
                <p className="svc-timeline-desc">Everything above as the kickoff, then monthly strategy calls, ongoing tool evaluations, Slack/email access for ad hoc questions, and implementation oversight as you execute the roadmap.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="svc-page-section" id="pricing-section" style={{scrollMarginTop:'100px'}}>
          <h2>Pricing</h2>
          <div className="svc-pricing-card">
            <div className="svc-pricing-name">Consulting &amp; Strategy</div>
            <div className="svc-pricing-amount">$497 <span>one-time</span></div>
            <div className="svc-pricing-mo">or $1,497/month fractional advisory</div>
            <div className="svc-pricing-includes">
              <div className="svc-pricing-col">
                <div className="svc-pricing-col-title">One-time ($497) includes</div>
                <ul>
                  <li>Discovery call (60 min)</li>
                  <li>Written AI readiness audit</li>
                  <li>Transformation roadmap</li>
                  <li>Tool stack recommendations</li>
                  <li>30-min debrief call</li>
                </ul>
              </div>
              <div className="svc-pricing-col">
                <div className="svc-pricing-col-title">Fractional ($1,497/mo) adds</div>
                <ul>
                  <li>Monthly strategy calls</li>
                  <li>Tool evaluations</li>
                  <li>Vendor assessments</li>
                  <li>Implementation oversight</li>
                  <li>Slack/email access</li>
                </ul>
              </div>
            </div>
            <div className="svc-pricing-nocontract">
              <CheckCircle size={16} color="#2AA5A0" strokeWidth={2} aria-hidden="true" />
              <strong>No contracts on fractional advisory.</strong> Cancel with 30 days notice. $497 fee credited toward any build tier if you proceed within 60 days.
            </div>
          </div>
          <div className="svc-cta-btns" style={{marginTop:'28px'}}>
            <Link href="/#contact" className="svc-btn-primary">Get Your Free Audit →</Link>
            <Link href="/#pricing" className="svc-btn-ghost">View All Pricing Options</Link>
          </div>
        </section>

        <section className="svc-page-section svc-faq-section">
          <h2>Frequently Asked Questions</h2>
          <FAQAccordion items={faqItems} />
        </section>

        <section className="svc-page-section">
          <h2>Ready to Get Clarity?</h2>
          <div className="svc-next-grid">
            <div className="svc-next-card svc-next-card--primary">
              <div className="svc-next-label">Option 1</div>
              <h3>Start with the free audit</h3>
              <p>Even before the paid consulting engagement, the free audit gives you a directional read on where AI can help. No obligation.</p>
              <Link href="/#contact" className="svc-btn-primary">Get Your Free Audit →</Link>
            </div>
            <div className="svc-next-card">
              <div className="svc-next-label">Option 2</div>
              <h3>Book a call</h3>
              <p>Let&apos;s talk through your situation and figure out whether the one-time engagement or fractional advisory makes more sense.</p>
              <Link href="/#contact" className="svc-btn-ghost">Book a 30-Minute Call</Link>
            </div>
          </div>
          <div className="svc-tier-nav">
            <p>Ready to build instead of plan?</p>
            <ul>
              <li>Ready to build? → <Link href="/services/ai-automation-starter">AI Automation Starter</Link></li>
              <li>Want the full system? → <Link href="/services/growth">Growth</Link></li>
              <li>Want to see all options? → <Link href="/#services">View All Services</Link></li>
            </ul>
          </div>
        </section>

      </div>
    </>
  );
}
