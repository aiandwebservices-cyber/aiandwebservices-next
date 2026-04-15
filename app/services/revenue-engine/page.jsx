import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import FAQAccordion from '@/components/FAQAccordion';

export const metadata = {
  title: 'Revenue Engine — Full Sales Funnel + Automation + Paid Ads | AIandWEBservices',
  description: 'Automate your entire sales process with a full funnel, workflow automation, CRM integration, and paid ads. Monthly strategy calls with David. $997/mo + $3,997 setup.',
  alternates: { canonical: 'https://www.aiandwebservices.com/services/revenue-engine' },
  openGraph: {
    title: 'Revenue Engine — Automate Your Sales Process | AIandWEBservices',
    description: 'Automate your entire sales process with a full funnel, workflow automation, CRM integration, and paid ads.',
    url: 'https://www.aiandwebservices.com/services/revenue-engine',
    type: 'website',
  },
};

const faqItems = [
  {
    question: 'How much should I budget for ads?',
    answer: "I typically recommend $500-1,500/month to start, depending on your industry. We optimize from there based on performance. Ad spend goes directly to Google or Meta — it's not part of my fee.",
  },
  {
    question: 'Which is better — Google Ads or Meta Ads?',
    answer: "Depends on your business. Google is better for high-intent searches. Meta is better for awareness and retargeting. We discuss the best fit during the deep dive.",
  },
  {
    question: 'What CRM do you recommend?',
    answer: "HubSpot (free tier is excellent for most businesses), Pipedrive (great for sales-focused teams), or Salesforce (if you're already invested). I work with whatever you have or help you pick the right one.",
  },
  {
    question: 'Can I see a funnel example before committing?',
    answer: "The free audit includes a high-level funnel map for your specific business. You'll see exactly how the system would work before spending a dollar.",
  },
  {
    question: 'How long until I see ROI?',
    answer: "Most Revenue Engine clients see positive ROI within 60-90 days. Paid ads can generate leads within days. SEO and email marketing compound over months.",
  },
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Service',
      name: 'Revenue Engine',
      description: 'Full sales funnel, workflow automation, CRM integration, paid ads setup, and monthly strategy calls. Automate your entire sales process.',
      provider: { '@type': 'Organization', name: 'AIandWEBservices', url: 'https://www.aiandwebservices.com' },
      areaServed: { '@type': 'Country', name: 'United States' },
      offers: { '@type': 'AggregateOffer', lowPrice: '997', highPrice: '3997', priceCurrency: 'USD', offerCount: '2' },
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
        { '@type': 'ListItem', position: 3, name: 'Revenue Engine', item: 'https://www.aiandwebservices.com/services/revenue-engine' },
      ],
    },
  ],
};

const WHO_BULLETS = [
  "You're generating revenue but your sales process is manual and inconsistent",
  "You've outgrown spreadsheets and informal follow-up",
  "You want to run paid ads but don't want to burn budget figuring it out",
  'You need CRM visibility into your entire pipeline',
  "You're ready to invest in a system that pays for itself",
];

const INCLUDED = [
  {
    title: 'Everything in Growth',
    desc: 'Website, SEO, AI automation, email marketing, landing pages, 2 articles/month. The complete Growth stack as your foundation.',
  },
  {
    title: 'Full sales funnel design and build',
    desc: "I map your complete buyer journey from first touchpoint to closed deal. Then I build it: landing pages, lead magnets, email sequences, retargeting touchpoints, and conversion events. Custom to your sales process, not a template.",
  },
  {
    title: 'Workflow automation (Zapier/Make)',
    desc: "Repetitive tasks get automated: lead routing, follow-up reminders, invoice triggers, onboarding sequences, status updates, reporting. If you do it every day and it doesn't require human judgment, I automate it.",
  },
  {
    title: 'Paid ads setup (Google or Meta)',
    desc: "I set up one paid channel, including campaign structure, targeting, ad copy, conversion tracking, and initial budget allocation. You fund the ad spend directly — I manage the setup and optimization.",
  },
  {
    title: 'AI-powered CRM integration',
    desc: "Your CRM becomes the single source of truth. Every conversation, every email, every form submission feeds into your pipeline automatically. Custom fields, pipeline stages, and automated status updates so you see exactly where every deal stands.",
  },
  {
    title: 'Monthly strategy calls with David',
    desc: "60-minute monthly call. We review performance, discuss what's working, identify bottlenecks, and plan next month's priorities. Direct access for strategic decisions.",
  },
];

const STEPS = [
  {
    title: 'Deep Dive + Funnel Mapping', time: 'Week 1',
    desc: "2-hour session. I audit your current sales process, map every step from lead capture to close, and identify automation opportunities. We agree on funnel architecture, ad channel, and CRM setup.",
  },
  {
    title: 'System Build', time: 'Weeks 2–3',
    desc: "I build the funnel, set up the CRM pipeline, configure workflow automations, deploy ad campaigns in test mode, and integrate everything with your existing tools.",
  },
  {
    title: 'Testing + Calibration', time: 'Weeks 3–4',
    desc: "Funnel goes through test traffic. Ad campaigns run at low budget to validate targeting. CRM workflows are tested end-to-end. I refine based on real data.",
  },
  {
    title: 'Launch + High-Touch Monitoring', time: 'Month 1',
    desc: "Everything goes live. I monitor daily for the first month, making real-time adjustments to ads, funnels, and automations.",
  },
  {
    title: 'Ongoing', time: 'Monthly',
    desc: 'Monthly optimization, strategy calls, 2 SEO articles, email campaigns, AI updates, and performance reporting.',
  },
];

export default function RevenueEnginePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="svc-page-wrap">


        <section className="svc-page-hero">
          <div className="svc-page-eyebrow">Revenue Engine</div>
          <h1 className="svc-page-h1">Automate Your<br />Entire Sales Process</h1>
          <p className="svc-page-lead">Full sales funnel, workflow automation, CRM integration, and paid ads. Stop trading time for revenue.</p>
          <div className="svc-price-badge">$997/month + $3,997 one-time setup</div>
          <div className="svc-page-hero-cta">
            <Link href="/#contact" className="svc-btn-primary">Get Your Free Audit →</Link>
            <Link href="#pricing-section" className="svc-btn-ghost">See Pricing Details</Link>
          </div>
        </section>

        <section className="svc-page-section">
          <h2>What This Is</h2>
          <p>Revenue Engine is the full system. Everything in Growth — website, AI automation, email marketing, SEO content, landing pages — plus a complete sales funnel, workflow automation, CRM-powered pipeline management, paid advertising, and monthly strategy calls with me.</p>
          <p>This is where you stop trading time for revenue. The funnel captures leads, the AI qualifies them, the email sequences nurture them, and the CRM tracks every touchpoint. Paid ads drive targeted traffic. The whole thing runs whether you&apos;re working or sleeping.</p>
          <p>This tier is for businesses that are done with &ldquo;pretty good&rdquo; lead flow and want a machine that produces revenue predictably.</p>
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
              <p>Service businesses doing $20K+/month, B2B companies with a sales team (even a team of one), professional services scaling beyond word-of-mouth, and any business where a broken follow-up process costs real money.</p>
            </div>
            <div className="svc-callout svc-callout--neutral">
              <div className="svc-callout-label">Not right for</div>
              <p>Businesses still figuring out product-market fit (fix the offer first, then automate it), or businesses under $10K/month revenue (Growth is a better starting point).</p>
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
            <div className="svc-pricing-name">Revenue Engine</div>
            <div className="svc-pricing-amount">$997 <span>/month</span></div>
            <div className="svc-pricing-mo">+ $3,997 one-time setup</div>
            <div className="svc-pricing-includes">
              <div className="svc-pricing-col">
                <div className="svc-pricing-col-title">Setup includes</div>
                <ul>
                  <li>Everything in Growth setup</li>
                  <li>Full sales funnel build</li>
                  <li>Workflow automation config</li>
                  <li>CRM setup & integration</li>
                  <li>Paid ads campaign setup</li>
                  <li>Conversion tracking</li>
                  <li>30 days high-touch monitoring</li>
                </ul>
              </div>
              <div className="svc-pricing-col">
                <div className="svc-pricing-col-title">Monthly includes</div>
                <ul>
                  <li>Everything in Growth monthly</li>
                  <li>Monthly strategy call (60 min)</li>
                  <li>Funnel optimization</li>
                  <li>Ad campaign management</li>
                  <li>CRM pipeline management</li>
                  <li>Performance reporting</li>
                </ul>
              </div>
            </div>
            <div className="svc-pricing-nocontract">
              <CheckCircle size={16} color="#2AA5A0" strokeWidth={2} aria-hidden="true" />
              <strong>No contracts.</strong> Cancel anytime with 30 days written notice. Ad spend is separate and paid directly to Google/Meta.
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
              <p>I&apos;ll map your sales process, identify automation opportunities, and show you exactly what Revenue Engine would produce for your business.</p>
              <Link href="/#contact" className="svc-btn-primary">Get Your Free Audit →</Link>
            </div>
            <div className="svc-next-card">
              <div className="svc-next-label">Option 2</div>
              <h3>Book a call</h3>
              <p>Let&apos;s walk through your current sales process and design your revenue machine together. 30 minutes, no pressure.</p>
              <Link href="/#contact" className="svc-btn-ghost">Book a 30-Minute Call</Link>
            </div>
          </div>
          <div className="svc-tier-nav">
            <p>Not sure if this is the right tier for you?</p>
            <ul>
              <li>Want lead gen without ads? → <Link href="/services/growth">Growth</Link></li>
              <li>Ready for maximum AI automation? → <Link href="/services/ai-first">AI-First</Link></li>
              <li>Want to see all options? → <Link href="/#services">View All Services</Link></li>
            </ul>
          </div>
        </section>

      </div>
    </>
  );
}
