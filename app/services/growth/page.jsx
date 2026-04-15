import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import FAQAccordion from '@/components/FAQAccordion';

export const metadata = {
  title: 'Growth — AI Automation + Email Marketing + SEO Content | AIandWEBservices',
  description: 'Turn website visitors into leads with AI automation, email marketing, SEO content, and conversion-optimized landing pages. $597/mo + $2,497 setup. No contracts.',
  alternates: { canonical: 'https://www.aiandwebservices.com/services/growth' },
  openGraph: {
    title: 'Growth — Turn Visitors Into Leads | AIandWEBservices',
    description: 'Turn website visitors into leads with AI automation, email marketing, SEO content, and conversion-optimized landing pages.',
    url: 'https://www.aiandwebservices.com/services/growth',
    type: 'website',
  },
};

const faqItems = [
  {
    question: 'How is this different from just getting the AI Automation Starter?',
    answer: 'AI Automation Starter gives you the chatbot system only. Growth includes the chatbot PLUS website, SEO, email marketing, and landing pages — a complete lead generation system.',
  },
  {
    question: 'Can I use my existing email platform?',
    answer: 'Yes. I work with ConvertKit, Mailchimp, ActiveCampaign, HubSpot, and most platforms with API access.',
  },
  {
    question: 'What kind of SEO results can I expect?',
    answer: 'Typically 20-50% traffic increase within 6 months. SEO compounds — each article keeps working indefinitely. Clients who stick with Growth for 12+ months often double their organic traffic.',
  },
  {
    question: 'Do I need to write any of the content?',
    answer: 'No. I handle all content creation. I may ask for your input on specific topics or technical details, but the writing is on me.',
  },
  {
    question: "What if I already have the Presence tier?",
    answer: "Great — you've already got the foundation. I upgrade your AI assistant to the full system, add email marketing and SEO content, and build your first landing page. The transition is seamless.",
  },
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Service',
      name: 'Growth',
      description: 'Full AI automation, email marketing, SEO content, and landing pages that turn visitors into qualified leads consistently.',
      provider: { '@type': 'Organization', name: 'AIandWEBservices', url: 'https://www.aiandwebservices.com' },
      areaServed: { '@type': 'Country', name: 'United States' },
      offers: { '@type': 'AggregateOffer', lowPrice: '597', highPrice: '2497', priceCurrency: 'USD', offerCount: '2' },
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
        { '@type': 'ListItem', position: 3, name: 'Growth', item: 'https://www.aiandwebservices.com/services/growth' },
      ],
    },
  ],
};

const WHO_BULLETS = [
  "You have a business that's working, but growth is inconsistent",
  "Your website gets some traffic but doesn't convert well",
  "You're not doing email marketing (or it's sporadic)",
  "You know SEO matters but don't have time to write content",
  'You want leads coming in while you focus on delivery',
];

const INCLUDED = [
  {
    title: 'Everything in Presence',
    desc: "Professional website, local SEO, GBP optimization, monthly reports. If you already have Presence, your monthly rate increases to $597/mo and the new components are added.",
  },
  {
    title: 'Full AI automation and smart assistant',
    desc: 'The complete AI Automation Starter system: custom chatbot trained on your business, CRM integration, calendar booking, lead qualification, FAQ handling. The full system, not the basic version in Presence.',
  },
  {
    title: 'Email marketing + welcome sequences',
    desc: "I set up your email platform (ConvertKit, Mailchimp, or ActiveCampaign), design a welcome sequence for new leads (typically 5-7 emails), and create a monthly newsletter template. You provide talking points, I write the emails.",
  },
  {
    title: 'SEO content (2 articles/month)',
    desc: "Research-backed blog articles targeting keywords your customers actually search for. Each article is 1,000-1,500 words, optimized for Google, and published to your blog. Over 12 months, that's 24 indexed pages working for you 24/7.",
  },
  {
    title: 'Conversion-optimized landing pages',
    desc: 'Dedicated landing pages for your top services or offers, designed specifically to convert. Tested layouts with clear CTAs, social proof, and objection handling.',
  },
];

const STEPS = [
  {
    title: 'Discovery & Strategy', time: 'Day 1',
    desc: '90 minutes. We audit your current lead flow, identify where leads drop off, map out your email strategy, and research keyword opportunities for your SEO content.',
  },
  {
    title: 'Build Phase', time: 'Weeks 1–2',
    desc: 'I build (or upgrade) your website, deploy the full AI automation system, set up your email platform and welcome sequence, and create your first landing page.',
  },
  {
    title: 'Content & Testing', time: 'Week 3',
    desc: 'First SEO article goes live. Email sequences are tested. AI chatbot is refined based on real conversations. Landing page is optimized.',
  },
  {
    title: 'Launch & Monitor', time: 'Week 4',
    desc: 'Everything is live and connected. I monitor performance across all channels for the first 30 days.',
  },
  {
    title: 'Ongoing: Monthly Content + Optimization', time: 'Monthly',
    desc: '2 new SEO articles, email campaign support, AI updates, performance reports, and monthly optimization recommendations. Quarterly strategy call to review what\'s working.',
  },
];

export default function GrowthPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="svc-page-wrap">


        <section className="svc-page-hero">
          <div className="svc-page-eyebrow">Growth</div>
          <h1 className="svc-page-h1">Turn Visitors Into<br />Leads Automatically</h1>
          <p className="svc-page-lead">Everything in Presence — plus AI automation, email marketing, SEO content, and landing pages that convert.</p>
          <div className="svc-price-badge">$597/month + $2,497 one-time setup</div>
        </section>

        <section className="svc-page-section">
          <h2>What This Is</h2>
          <p>Growth is where passive web traffic becomes active lead generation. You get everything in Presence — the website, local SEO, Google Business Profile, and AI assistant — plus the systems that turn visitors into qualified leads on autopilot.</p>
          <p>That means a full AI automation system (not just the basic assistant), email marketing sequences that nurture leads without you writing a single email, 2 SEO articles per month that bring consistent organic traffic, and conversion-optimized landing pages designed to capture and convert.</p>
          <p>This is the tier where most established businesses start. You already have customers and revenue — now you want a system that generates leads consistently without you manually chasing every one.</p>
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
              <p>Established service businesses, B2B companies, professional services (law, accounting, consulting), medical and dental practices, agencies, and any business with a proven offer that needs more leads.</p>
            </div>
            <div className="svc-callout svc-callout--neutral">
              <div className="svc-callout-label">Not right for</div>
              <p>Brand new businesses with no existing customers (start with Presence or AI Automation Starter), or businesses that need a full sales funnel with paid ads (that&apos;s Revenue Engine).</p>
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
            <div className="svc-pricing-name">Growth</div>
            <div className="svc-pricing-amount">$597 <span>/month</span></div>
            <div className="svc-pricing-mo">+ $2,497 one-time setup</div>
            <div className="svc-pricing-includes">
              <div className="svc-pricing-col">
                <div className="svc-pricing-col-title">Setup includes</div>
                <ul>
                  <li>Everything in Presence setup</li>
                  <li>Full AI automation build</li>
                  <li>Email platform setup</li>
                  <li>Welcome sequence (5-7 emails)</li>
                  <li>First landing page</li>
                  <li>SEO keyword research</li>
                  <li>First month&apos;s SEO content</li>
                </ul>
              </div>
              <div className="svc-pricing-col">
                <div className="svc-pricing-col-title">Monthly includes</div>
                <ul>
                  <li>Everything in Presence monthly</li>
                  <li>2 SEO articles/month</li>
                  <li>Email campaign support</li>
                  <li>AI optimization</li>
                  <li>Landing page maintenance</li>
                  <li>Quarterly strategy call</li>
                </ul>
              </div>
            </div>
            <div className="svc-pricing-nocontract">
              <CheckCircle size={16} color="#2AA5A0" strokeWidth={2} aria-hidden="true" />
              <strong>No contracts.</strong> Cancel anytime with 30 days written notice.
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
              <p>I&apos;ll map out your lead generation system and show you exactly what Growth would look like for your business. No pitch, no obligation.</p>
              <Link href="/#contact" className="svc-btn-primary">Get Your Free Audit →</Link>
            </div>
            <div className="svc-next-card">
              <div className="svc-next-label">Option 2</div>
              <h3>Book a call</h3>
              <p>Let&apos;s talk through your current lead flow and what a complete system would look like. 30 minutes, no pressure.</p>
              <Link href="/#contact" className="svc-btn-ghost">Book a 30-Minute Call</Link>
            </div>
          </div>
          <div className="svc-tier-nav">
            <p>Not sure if this is the right tier for you?</p>
            <ul>
              <li>Just need the basics? → <Link href="/services/presence">Presence</Link></li>
              <li>Ready for a full sales funnel? → <Link href="/services/revenue-engine">Revenue Engine</Link></li>
              <li>Want to see all options? → <Link href="/#services">View All Services</Link></li>
            </ul>
          </div>
        </section>

      </div>
    </>
  );
}
