import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import FAQAccordion from '@/components/FAQAccordion';

export const metadata = {
  title: 'Presence — Professional Website + Local SEO + AI Assistant | AIandWEBservices',
  description: 'Get a professional website, local SEO, Google Business Profile, and basic AI assistant. Everything a new business needs to get found online. $297/mo + $997 setup.',
  alternates: { canonical: 'https://www.aiandwebservices.com/services/presence' },
  openGraph: {
    title: 'Presence — Get Found Online | AIandWEBservices',
    description: 'Get a professional website, local SEO, Google Business Profile, and basic AI assistant. Everything a new business needs to get found online.',
    url: 'https://www.aiandwebservices.com/services/presence',
    type: 'website',
  },
};

const faqItems = [
  {
    question: 'How long until my site is live?',
    answer: 'Most Presence builds launch within 2-3 weeks. The biggest variable is how quickly you can provide feedback during the review phase.',
  },
  {
    question: 'Do I own the website?',
    answer: "Yes. You own all code, content, and design. If you cancel, I'll help you migrate to another host or hand over the files.",
  },
  {
    question: 'Can I upgrade to Growth later?',
    answer: "Absolutely. Growth adds AI automation, email marketing, and SEO content on top of your Presence foundation. The transition is seamless since I built both tiers.",
  },
  {
    question: 'What if I already have a website?',
    answer: "If your current site just needs optimization (speed, SEO, mobile), I can work with it. If it needs a full rebuild, Presence covers that. We figure out the right approach during the discovery call.",
  },
  {
    question: 'Will I rank on Google immediately?',
    answer: 'SEO takes time — typically 3-6 months for meaningful rankings. But the Google Business Profile and on-page optimization give you a head start, and some clients see local traffic within weeks.',
  },
  {
    question: "What's the difference between the AI assistant here and AI Automation Starter?",
    answer: "Presence includes a basic AI assistant (answers FAQs, captures leads). AI Automation Starter is a full system with CRM integration, calendar booking, lead qualification, and advanced conversation handling. If the chatbot is your main priority, start with AI Automation Starter.",
  },
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Service',
      name: 'Presence',
      description: 'Professional website, local SEO, Google Business Profile optimization, and basic AI assistant. The digital foundation every business needs.',
      provider: { '@type': 'Organization', name: 'AIandWEBservices', url: 'https://www.aiandwebservices.com' },
      areaServed: { '@type': 'Country', name: 'United States' },
      offers: { '@type': 'AggregateOffer', lowPrice: '297', highPrice: '997', priceCurrency: 'USD', offerCount: '2' },
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
        { '@type': 'ListItem', position: 3, name: 'Presence', item: 'https://www.aiandwebservices.com/services/presence' },
      ],
    },
  ],
};

const WHO_BULLETS = [
  "You either don't have a website or your current one is slow, outdated, or not mobile-friendly",
  "You're not showing up in local Google searches for your services",
  "You don't have a Google Business Profile (or it's incomplete)",
  "You want a professional online presence without spending $5,000+ on a web agency",
  'You need something live within 2-3 weeks, not 3 months',
];

const INCLUDED = [
  {
    title: 'Professional 5-page website',
    desc: 'Home, About, Services, FAQ, and Contact pages built on a modern framework. Fast load times, mobile-responsive, designed to convert visitors into leads. I write the copy with you during the discovery call.',
  },
  {
    title: 'Local SEO + Google Business Profile',
    desc: "I set up and optimize your GBP listing with accurate business info, service descriptions, business hours, photos, and categories. I also handle basic on-page SEO (title tags, meta descriptions, header structure, schema markup) so Google understands what you do and where you do it.",
  },
  {
    title: 'Basic AI inquiry assistant',
    desc: "A lightweight chatbot that answers FAQs, captures visitor details, and sends you an email or SMS when someone reaches out. Think of it as a smart contact form that can hold a basic conversation.",
  },
  {
    title: 'Monthly performance reports',
    desc: "Every month I send you a plain-English report: how many visitors, where they came from, which pages they viewed, and how many inquiries you received. No jargon, just numbers that matter.",
  },
];

const STEPS = [
  {
    title: 'Discovery Call', time: 'Day 1',
    desc: '60 minutes. I learn about your business, your customers, and your competition. We outline the 5-page structure, discuss your brand voice, and I gather any existing content (logos, photos, bios).',
  },
  {
    title: 'Build Phase', time: 'Week 1',
    desc: 'I design and build your website, set up your Google Business Profile, and configure the basic AI assistant. You get a staging link to review before anything goes live.',
  },
  {
    title: 'Review & Refinement', time: 'Week 2',
    desc: "You review the site and AI assistant. I make adjustments based on your feedback — copy changes, layout tweaks, AI response tuning. We iterate until you're happy.",
  },
  {
    title: 'Launch', time: 'Week 2–3',
    desc: "Your site goes live. I monitor performance for the first 30 days and make fixes as needed. I submit your sitemap to Google and verify your GBP listing.",
  },
  {
    title: 'Ongoing Management', time: 'Monthly',
    desc: 'Performance reports, minor content updates (up to 2 per month), and GBP maintenance. You focus on running your business.',
  },
];

export default function PresencePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="svc-page-wrap">


        <section className="svc-page-hero">
          <div className="svc-page-eyebrow">Presence</div>
          <h1 className="svc-page-h1">Get Found Online —<br />The Foundation Every Business Needs</h1>
          <p className="svc-page-lead">A professional website, local SEO, and basic AI assistant to make sure customers can find you, trust you, and reach you.</p>
          <div className="svc-price-badge">$297/month + $997 one-time setup</div>
        </section>

        <section className="svc-page-section">
          <h2>What This Is</h2>
          <p>Presence is your digital foundation — a professional website, local search visibility, and a basic AI assistant that makes sure customers can find you, trust you, and reach you.</p>
          <p>Most businesses lose customers before they ever get a chance to compete because their website is outdated, slow, or invisible on Google. Presence fixes that. You get a fast, mobile-friendly website built to convert visitors into inquiries, a fully optimized Google Business Profile so you show up in local searches, and a basic AI assistant that handles simple questions when you&apos;re busy.</p>
          <p>This isn&apos;t a template site. I build it around your business, your services, and your customers — then optimize it to actually show up when people search for what you do.</p>
        </section>

        <section className="svc-page-section">
          <h2>Who This Is For</h2>
          <p>Presence is built for businesses that are just getting started online or have an outdated website that&apos;s doing more harm than good:</p>
          <ul className="svc-check-list">
            {WHO_BULLETS.map((b, i) => (
              <li key={i}><CheckCircle size={18} color="#2AA5A0" strokeWidth={2} aria-hidden="true" /><span>{b}</span></li>
            ))}
          </ul>
          <div className="svc-callout-grid">
            <div className="svc-callout svc-callout--good">
              <div className="svc-callout-label">Perfect for</div>
              <p>New businesses, solo practitioners, local service providers, consultants, tradespeople, and anyone who needs a credible online presence fast.</p>
            </div>
            <div className="svc-callout svc-callout--neutral">
              <div className="svc-callout-label">Not right for</div>
              <p>Businesses that already have a modern website and strong local SEO (you probably need Growth or Revenue Engine), or e-commerce businesses that need a full storefront.</p>
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
            <div className="svc-pricing-name">Presence</div>
            <div className="svc-pricing-amount">$297 <span>/month</span></div>
            <div className="svc-pricing-mo">+ $997 one-time setup</div>
            <div className="svc-pricing-includes">
              <div className="svc-pricing-col">
                <div className="svc-pricing-col-title">Setup includes</div>
                <ul>
                  <li>Discovery call</li>
                  <li>Website design & build</li>
                  <li>Content writing</li>
                  <li>Google Business Profile setup</li>
                  <li>Basic AI assistant configuration</li>
                  <li>On-page SEO</li>
                  <li>Launch support</li>
                  <li>30 days post-launch monitoring</li>
                </ul>
              </div>
              <div className="svc-pricing-col">
                <div className="svc-pricing-col-title">Monthly includes</div>
                <ul>
                  <li>Hosting & maintenance</li>
                  <li>Performance monitoring</li>
                  <li>Monthly report</li>
                  <li>Up to 2 content updates</li>
                  <li>GBP maintenance</li>
                  <li>AI assistant monitoring</li>
                  <li>Email support (6hr response)</li>
                </ul>
              </div>
            </div>
            <div className="svc-pricing-nocontract">
              <CheckCircle size={16} color="#2AA5A0" strokeWidth={2} aria-hidden="true" />
              <strong>No contracts.</strong> Cancel anytime with 30 days written notice. You own the website and all content.
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
              <p>I&apos;ll analyze your current online presence and show you exactly what needs to be built or fixed. No pitch, no obligation.</p>
              <Link href="/#contact" className="svc-btn-primary">Get Your Free Audit →</Link>
            </div>
            <div className="svc-next-card">
              <div className="svc-next-label">Option 2</div>
              <h3>Book a call</h3>
              <p>Let&apos;s talk through your situation, walk through examples, and figure out the best starting point. 30 minutes, no pressure.</p>
              <Link href="/#contact" className="svc-btn-ghost">Book a 30-Minute Call</Link>
            </div>
          </div>
          <div className="svc-tier-nav">
            <p>Not sure if this is the right tier for you?</p>
            <ul>
              <li>Just need a chatbot? → <Link href="/services/ai-automation-starter">AI Automation Starter</Link></li>
              <li>Ready for lead gen? → <Link href="/services/growth">Growth</Link></li>
              <li>Want to see all options? → <Link href="/#services">View All Services</Link></li>
            </ul>
          </div>
        </section>

      </div>
    </>
  );
}
