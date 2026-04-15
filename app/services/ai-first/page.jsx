import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import FAQAccordion from '@/components/FAQAccordion';

export const metadata = {
  title: 'AI-First — Advanced AI Automation + Voice AI + Programmatic SEO | AIandWEBservices',
  description: 'Run a bigger business with the same team. Voice AI, programmatic SEO, social media AI scheduling, and full analytics. $1,497/mo + $5,497 setup.',
  alternates: { canonical: 'https://www.aiandwebservices.com/services/ai-first' },
  openGraph: {
    title: 'AI-First — Run a Bigger Business With the Same Team | AIandWEBservices',
    description: 'Voice AI, programmatic SEO, social media automation, and a full analytics dashboard — on top of everything in Revenue Engine.',
    url: 'https://www.aiandwebservices.com/services/ai-first',
    type: 'website',
  },
};

const faqItems = [
  {
    question: 'Is the voice AI realistic?',
    answer: "Modern voice AI is remarkably natural. Most callers can't tell the difference. I configure it with your preferred greeting, tone, and escalation rules.",
  },
  {
    question: 'How does programmatic SEO work?',
    answer: "I create a template and data source (your service areas, service types, etc.), then the system generates unique pages at scale. Each page is optimized for a specific keyword and location combination.",
  },
  {
    question: "What if I only want some of these features?",
    answer: "We can discuss custom scope during the deep dive. The AI-First tier is designed as a complete system, but I'm flexible on priorities.",
  },
  {
    question: 'How much time will this save me?',
    answer: "Typical AI-First clients save 15-30 hours per week. The voice AI alone saves most businesses 5-10 hours/week of phone time.",
  },
  {
    question: 'Can I start with Revenue Engine and upgrade later?',
    answer: "Absolutely. Revenue Engine builds the foundation. Adding AI-First components on top is a natural upgrade path.",
  },
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Service',
      name: 'AI-First',
      description: 'Advanced AI automation pipelines, voice AI, programmatic SEO, social media AI scheduling, and full analytics dashboard. Maximum automation tier.',
      provider: { '@type': 'Organization', name: 'AIandWEBservices', url: 'https://www.aiandwebservices.com' },
      areaServed: { '@type': 'Country', name: 'United States' },
      offers: { '@type': 'AggregateOffer', lowPrice: '1497', highPrice: '5497', priceCurrency: 'USD', offerCount: '2' },
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
        { '@type': 'ListItem', position: 3, name: 'AI-First', item: 'https://www.aiandwebservices.com/services/ai-first' },
      ],
    },
  ],
};

const WHO_BULLETS = [
  "You're spending hours on repetitive tasks that don't generate revenue",
  "You want to answer every call but can't justify a receptionist",
  'You serve multiple locations or offer many service variations',
  "You know social media matters but don't have time for it",
  'You want a single dashboard that shows you everything',
];

const INCLUDED = [
  {
    title: 'Everything in Revenue Engine',
    desc: 'Website, funnel, CRM, ads, AI chatbot, email marketing, SEO content, workflow automation, monthly strategy calls. The complete Revenue Engine stack as your foundation.',
  },
  {
    title: 'Advanced AI automation pipelines',
    desc: 'Custom AI workflows beyond basic automation: AI that reads incoming emails and drafts responses for your approval, AI that summarizes client calls and updates CRM notes, AI that generates reports from your data. Specific pipelines scoped during the deep dive.',
  },
  {
    title: 'Voice AI (answering + booking)',
    desc: 'An AI phone agent that answers calls in a natural voice, handles common inquiries, books appointments, and transfers to you when needed. Works 24/7, handles multiple simultaneous calls, integrates with your calendar and CRM.',
  },
  {
    title: 'Programmatic SEO at scale',
    desc: 'Templated page systems that auto-generate hundreds of SEO-optimized pages. Example: if you\'re a plumber serving 50 towns, I create unique pages for "plumber in [town name]" for all 50 — each with unique content, local schema, and proper internal linking.',
  },
  {
    title: 'Social media AI scheduling',
    desc: 'AI generates and schedules social posts across your platforms (Facebook, Instagram, LinkedIn, X). You approve a weekly content plan and the system handles the rest. Includes image suggestions and hashtag optimization.',
  },
  {
    title: 'Full analytics dashboard',
    desc: 'A custom dashboard pulling data from Google Analytics, your CRM, email platform, ad accounts, and AI systems. One screen showing leads, revenue, traffic, conversion rates, ad performance, and AI system metrics.',
  },
];

const STEPS = [
  {
    title: 'Executive Deep Dive', time: 'Week 1',
    desc: '3-hour strategy session. We audit every system in your business, identify the highest-impact AI opportunities, and design the implementation roadmap.',
  },
  {
    title: 'Phased Build', time: 'Weeks 2–4',
    desc: 'AI-First is too complex to launch all at once. We deploy in phases: Revenue Engine components first, then voice AI, then programmatic SEO, then social AI, then the dashboard. Each phase tested before the next.',
  },
  {
    title: 'Full System Live', time: 'Month 2',
    desc: 'Everything connected and running. Close monitoring with daily adjustments as AI systems learn from real data.',
  },
  {
    title: 'Ongoing', time: 'Monthly',
    desc: 'Weekly check-ins for the first 3 months, then monthly strategy calls. Continuous AI optimization, content generation, and system expansion.',
  },
];

export default function AIFirstPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="svc-page-wrap">


        <section className="svc-page-hero">
          <div className="svc-page-eyebrow">AI-First</div>
          <h1 className="svc-page-h1">Run a Bigger Business<br />With the Same Team</h1>
          <p className="svc-page-lead">Voice AI, programmatic SEO, social media automation, and a full analytics dashboard — on top of everything in Revenue Engine.</p>
          <div className="svc-price-badge">$1,497/month + $5,497 one-time setup</div>
        </section>

        <section className="svc-page-section">
          <h2>What This Is</h2>
          <p>AI-First is the maximum automation tier. Everything in Revenue Engine — website, funnel, CRM, ads, AI chatbot, email, SEO, strategy calls — plus advanced AI systems that replace manual work at scale.</p>
          <p>Voice AI answers your phone and books appointments. Programmatic SEO creates hundreds of location or service pages that rank without you writing each one. Social media AI scheduling maintains your presence across platforms without you touching a phone. A full analytics dashboard gives you real-time visibility into every metric that matters.</p>
          <p>This tier is for owners who want to do more with less. More revenue, more customers, more reach — without hiring more people.</p>
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
              <p>Multi-location businesses, franchise operators, high-volume service companies, businesses with 5+ service lines, and owners who want to scale output without scaling payroll.</p>
            </div>
            <div className="svc-callout svc-callout--neutral">
              <div className="svc-callout-label">Not right for</div>
              <p>Businesses that haven&apos;t nailed their core offer yet (fix the fundamentals first with Growth or Revenue Engine), or businesses in industries where every interaction truly requires a human touch.</p>
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
            {STEPS.map((step, i) => (
              <div key={i} className="svc-timeline-step">
                <div className="svc-timeline-left">
                  <div className="svc-timeline-num">{i + 1}</div>
                  {i < STEPS.length - 1 && <div className="svc-timeline-line" />}
                </div>
                <div className="svc-timeline-body">
                  <div className="svc-timeline-title">{step.title} <span className="svc-timeline-time">{step.time}</span></div>
                  <p className="svc-timeline-desc">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="svc-page-section" id="pricing-section" style={{scrollMarginTop:'100px'}}>
          <h2>Pricing</h2>
          <div className="svc-pricing-card">
            <div className="svc-pricing-name">AI-First</div>
            <div className="svc-pricing-amount">$1,497 <span>/month</span></div>
            <div className="svc-pricing-mo">+ $5,497 one-time setup</div>
            <div className="svc-pricing-includes">
              <div className="svc-pricing-col">
                <div className="svc-pricing-col-title">Setup includes</div>
                <ul>
                  <li>Everything in Revenue Engine setup</li>
                  <li>Advanced AI pipeline build</li>
                  <li>Voice AI configuration</li>
                  <li>Programmatic SEO system</li>
                  <li>Social media AI setup</li>
                  <li>Analytics dashboard build</li>
                  <li>Phased launch & monitoring</li>
                </ul>
              </div>
              <div className="svc-pricing-col">
                <div className="svc-pricing-col-title">Monthly includes</div>
                <ul>
                  <li>Everything in Revenue Engine monthly</li>
                  <li>AI pipeline optimization</li>
                  <li>Voice AI management</li>
                  <li>Programmatic SEO expansion</li>
                  <li>Social content & scheduling</li>
                  <li>Dashboard maintenance</li>
                </ul>
              </div>
            </div>
            <div className="svc-pricing-nocontract">
              <CheckCircle size={16} color="#2AA5A0" strokeWidth={2} aria-hidden="true" />
              <strong>No contracts.</strong> Cancel anytime with 30 days written notice. Ad spend, phone costs, and third-party AI tool subscriptions are separate.
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
          <h2>Ready to Get Started?</h2>
          <div className="svc-next-grid">
            <div className="svc-next-card svc-next-card--primary">
              <div className="svc-next-label">Option 1</div>
              <h3>Get a free audit</h3>
              <p>I&apos;ll audit your current systems and map out your AI-First implementation plan. See exactly what gets built, in what order, and what ROI to expect.</p>
              <Link href="/#contact" className="svc-btn-primary">Get Your Free Audit →</Link>
            </div>
            <div className="svc-next-card">
              <div className="svc-next-label">Option 2</div>
              <h3>Book a call</h3>
              <p>Let&apos;s talk through your automation goals and design your AI-First roadmap together. 30 minutes, no pressure.</p>
              <Link href="/#contact" className="svc-btn-ghost">Book a 30-Minute Call</Link>
            </div>
          </div>
          <div className="svc-tier-nav">
            <p>Not sure if this is the right tier for you?</p>
            <ul>
              <li>Not ready for the full stack? → <Link href="/services/revenue-engine">Revenue Engine</Link></li>
              <li>Need guidance first? → <Link href="/services/consulting">Consulting</Link></li>
              <li>Want to see all options? → <Link href="/#services">View All Services</Link></li>
            </ul>
          </div>
        </section>

      </div>
    </>
  );
}
