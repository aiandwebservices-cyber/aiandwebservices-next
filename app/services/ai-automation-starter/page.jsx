import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import FAQAccordion from '@/components/FAQAccordion';

export const metadata = {
  title: 'AI Automation Starter — Custom AI Chatbot for Your Business | AIandWEBservices',
  description: 'Deploy a custom AI chatbot trained on your business in 7-14 days. Handles inquiries, qualifies leads, books calls 24/7. $997 setup + $97/mo. No contracts.',
  alternates: { canonical: 'https://www.aiandwebservices.com/services/ai-automation-starter' },
  openGraph: {
    title: 'AI Automation Starter — Custom AI Chatbot | AIandWEBservices',
    description: 'Deploy a custom AI chatbot trained on your business in 7-14 days. Handles inquiries, qualifies leads, books calls 24/7.',
    url: 'https://www.aiandwebservices.com/services/ai-automation-starter',
    type: 'website',
  },
};

const faqItems = [
  {
    question: 'How long does it take to build the chatbot?',
    answer: 'Most AI automation systems are live within 7-14 days. Simple inquiry bots can launch in a week; more complex systems with CRM integrations, advanced qualification logic, and multi-step workflows take closer to two weeks. Timelines depend on how quickly you can provide source content and feedback during the testing phase.',
  },
  {
    question: 'Can it integrate with my existing CRM?',
    answer: 'Yes. I integrate with HubSpot, Salesforce, Zoho, Pipedrive, Monday.com, and any CRM with an API or webhook support. If you don\'t have a CRM, I can recommend one based on your budget and needs, or set up a simple lead tracking system using Google Sheets or Airtable.',
  },
  {
    question: 'What happens if the AI can\'t answer a question?',
    answer: 'The AI is trained to recognize when it doesn\'t know something. It collects the prospect\'s name, email, phone number, and question, then escalates to you via email, Slack, or SMS. You\'re never left in the dark.',
  },
  {
    question: 'Can I update the AI\'s knowledge myself?',
    answer: 'You can request updates anytime, and I implement them within 24-48 hours. If you prefer hands-on control, I can give you access to the knowledge base editor with training on how to use it. Most clients prefer the "send me a note and I\'ll handle it" approach.',
  },
  {
    question: 'Will it sound robotic?',
    answer: 'No. Modern AI produces responses that are indistinguishable from human writing. I train your AI to match your tone — whether that\'s professional, casual, technical, or friendly. Most prospects don\'t realize they\'re talking to AI unless you tell them.',
  },
  {
    question: 'What if I want to cancel?',
    answer: 'No lock-in, no penalties. Just give 30 days written notice and you\'re done. You keep all the deliverables including chatbot code and integrations.',
  },
  {
    question: 'Do you offer a trial or demo?',
    answer: 'I don\'t offer free trials (building custom AI systems takes significant time), but the free audit gives you a detailed breakdown of what your specific AI system would do, how it would integrate with your existing tools, what ROI to expect, and a timeline. Most clients feel confident enough to commit after seeing the audit.',
  },
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Service',
      name: 'AI Automation Starter',
      description: 'Custom AI chatbot system trained on your business to handle inquiries, qualify leads, and book calls 24/7.',
      provider: {
        '@type': 'Organization',
        name: 'AIandWEBservices',
        url: 'https://www.aiandwebservices.com',
      },
      areaServed: { '@type': 'Country', name: 'United States' },
      offers: {
        '@type': 'AggregateOffer',
        lowPrice: '97',
        highPrice: '997',
        priceCurrency: 'USD',
        offerCount: '2',
      },
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
        { '@type': 'ListItem', position: 3, name: 'AI Automation Starter', item: 'https://www.aiandwebservices.com/services/ai-automation-starter' },
      ],
    },
  ],
};

const WHO_BULLETS = [
  'Get 10+ inquiries per week via phone, email, or website',
  'Lose leads to voicemail, slow email responses, or off-hours inquiries',
  'Want to qualify leads before getting on sales calls',
  'Need 24/7 availability without hiring full-time staff',
  'Spend too much time answering the same questions repeatedly',
];

const INCLUDED = [
  {
    title: 'Custom AI chatbot trained on your business',
    desc: 'I feed your AI assistant your website content, FAQs, service descriptions, pricing information, and any other documents you provide. It learns your tone, your terminology, and your approach. The result: responses that sound like you wrote them.',
  },
  {
    title: 'Calendar booking integration',
    desc: 'Connects directly to Google Calendar, Calendly, Acuity, or any booking system you use. When a prospect is ready to talk, the AI checks your availability and books the call on the spot — no back-and-forth emails, no scheduling friction.',
  },
  {
    title: 'CRM connection',
    desc: 'Every conversation is automatically logged in your CRM (HubSpot, Salesforce, Zoho, Pipedrive, or any CRM with an API). You see the full chat transcript, contact details, and qualification notes. If you don\'t have a CRM, I can set up a simple system using Google Sheets or Airtable.',
  },
  {
    title: 'Lead qualification',
    desc: 'The AI asks the questions you care about: budget, timeline, project scope, decision-making authority, urgency. You only talk to prospects who are ready to buy, not tire-kickers.',
  },
  {
    title: 'FAQ handling',
    desc: 'Answers common questions instantly — pricing, process, availability, service areas, payment terms, turnaround times. Reduces your support load by 40-60% based on client data.',
  },
  {
    title: 'Monthly updates',
    desc: 'I update your AI\'s knowledge base every month based on new content, customer feedback, or changes to your services. As your business evolves, your AI stays current.',
  },
  {
    title: 'Performance monitoring',
    desc: 'I track conversation quality, identify gaps in the AI\'s knowledge, and refine responses to improve conversion rates. You get a monthly report showing inquiries handled, leads qualified, calls booked, and top questions asked.',
  },
];

const STEPS = [
  {
    title: 'Discovery Call',
    time: 'Day 1',
    desc: 'We spend 60 minutes digging into your business — what you sell, who you sell to, what questions prospects ask most, where leads currently fall through the cracks, and what a qualified lead looks like for you. I also review your existing content (website, FAQs, brochures) to understand your voice.',
  },
  {
    title: 'Build Phase',
    time: 'Week 1–2',
    desc: 'I build your custom AI assistant, train it on your FAQs and service information, integrate it with your calendar and CRM, and deploy it to your website. You get a staging link to test it before it goes live.',
  },
  {
    title: 'Testing & Refinement',
    time: 'Week 2',
    desc: 'You test the system with real scenarios. I refine the AI\'s responses, adjust tone, add missing information, and handle edge cases. We go back and forth until you\'re confident it represents your business accurately.',
  },
  {
    title: 'Launch',
    time: 'Week 2–3',
    desc: 'Your AI assistant goes live on your site. I monitor every conversation for the first 30 days and make real-time adjustments. If the AI doesn\'t know something, I add it. If a response feels off, I fix it.',
  },
  {
    title: 'Ongoing Management',
    time: 'Monthly',
    desc: 'Monthly updates to keep your AI current, performance reports showing what\'s working, and continuous optimization based on real conversation data. You focus on closing deals, I make sure the AI keeps improving.',
  },
];

export default function AIAutomationStarterPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="svc-page-wrap">


        {/* ── 2. Hero ── */}
        <section className="svc-page-hero">
          <div className="svc-page-eyebrow">AI Automation Starter</div>
          <h1 className="svc-page-h1">Your First AI System —<br />Working While You Sleep</h1>
          <p className="svc-page-lead">
            A custom AI chatbot trained on your business. Handles inquiries, qualifies leads, books calls — 24/7, without you.
          </p>
          <div className="svc-price-badge">$997 one-time setup + $97/month</div>
          <div className="svc-page-hero-cta">
            <Link href="/#contact" className="svc-btn-primary">Get Your Free Audit →</Link>
            <Link href="#pricing-section" className="svc-btn-ghost">See Pricing Details</Link>
          </div>
        </section>

        {/* ── 3. What This Is ── */}
        <section className="svc-page-section">
          <h2>What This Is</h2>
          <p>
            AI Automation Starter is a custom AI chatbot system trained specifically on your business. It deploys to your website, handles customer inquiries, qualifies leads, books calls to your calendar, and answers FAQs — all without you lifting a finger.
          </p>
          <p>
            Unlike generic chatbots that give canned responses, your AI assistant understands your services, your pricing, your process, and your tone. It&apos;s like hiring a 24/7 receptionist who never sleeps, never takes a day off, and never forgets to follow up.
          </p>
          <p>
            This is the fastest, most affordable way to deploy AI in your business and see immediate ROI. Most clients recoup their setup cost within the first month from recovered leads that would have otherwise gone to voicemail or been lost to slow email responses.
          </p>
        </section>

        {/* ── 4. Who This Is For ── */}
        <section className="svc-page-section">
          <h2>Who This Is For</h2>
          <p>AI Automation Starter is built for service-based businesses that:</p>
          <ul className="svc-check-list">
            {WHO_BULLETS.map((b, i) => (
              <li key={i}>
                <CheckCircle size={18} color="#2AA5A0" strokeWidth={2} aria-hidden="true" />
                <span>{b}</span>
              </li>
            ))}
          </ul>

          <div className="svc-callout-grid">
            <div className="svc-callout svc-callout--good">
              <div className="svc-callout-label">Perfect for</div>
              <p>Plumbers, HVAC contractors, lawyers, consultants, coaches, real estate agents, home service providers, accountants, insurance agents, and local B2B services.</p>
            </div>
            <div className="svc-callout svc-callout--neutral">
              <div className="svc-callout-label">Not right for</div>
              <p>E-commerce stores looking for product recommendations, businesses with fewer than 5 inquiries per week, or companies that need human touch for every single interaction.</p>
            </div>
          </div>
        </section>

        {/* ── 5. What's Included ── */}
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

        {/* ── 6. How It Works ── */}
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

        {/* ── 7. Pricing ── */}
        <section className="svc-page-section" id="pricing-section" style={{scrollMarginTop:'100px'}}>
          <h2>Pricing</h2>
          <div className="svc-pricing-card">
            <div className="svc-pricing-name">AI Automation Starter</div>
            <div className="svc-pricing-amount">$997 <span>one-time setup</span></div>
            <div className="svc-pricing-mo">+ $97/month ongoing</div>

            <div className="svc-pricing-includes">
              <div className="svc-pricing-col">
                <div className="svc-pricing-col-title">Setup includes</div>
                <ul>
                  <li>Discovery call</li>
                  <li>Custom AI build</li>
                  <li>CRM & calendar integration</li>
                  <li>Knowledge base training</li>
                  <li>Website deployment</li>
                  <li>Testing & refinement</li>
                  <li>Launch support</li>
                  <li>30 days post-launch monitoring</li>
                </ul>
              </div>
              <div className="svc-pricing-col">
                <div className="svc-pricing-col-title">Monthly retainer includes</div>
                <ul>
                  <li>Performance monitoring</li>
                  <li>Monthly knowledge base updates</li>
                  <li>Conversation logging</li>
                  <li>Ongoing optimization</li>
                  <li>Email support (6hr response)</li>
                </ul>
              </div>
            </div>

            <div className="svc-pricing-nocontract">
              <CheckCircle size={16} color="#2AA5A0" strokeWidth={2} aria-hidden="true" />
              <strong>No contracts.</strong> Cancel anytime with 30 days written notice. You own all deliverables.
            </div>
          </div>

          <div className="svc-cta-btns" style={{marginTop:'28px'}}>
            <Link href="/#contact" className="svc-btn-primary">Get Your Free Audit →</Link>
            <Link href="/#pricing" className="svc-btn-ghost">View All Pricing Options</Link>
          </div>
        </section>

        {/* ── 8. FAQ ── */}
        <section className="svc-page-section svc-faq-section">
          <h2>Frequently Asked Questions</h2>
          <FAQAccordion items={faqItems} />
        </section>

        {/* ── 9. Next Steps ── */}
        <section className="svc-page-section">
          <h2>Ready to Get Started?</h2>
          <div className="svc-next-grid">
            <div className="svc-next-card svc-next-card--primary">
              <div className="svc-next-label">Option 1</div>
              <h3>Get a free audit</h3>
              <p>I&apos;ll analyze your business, map out your AI system architecture, identify integration requirements, and show you exactly what to expect. No pitch, no obligation.</p>
              <Link href="/#contact" className="svc-btn-primary">Get Your Free Audit →</Link>
            </div>
            <div className="svc-next-card">
              <div className="svc-next-label">Option 2</div>
              <h3>Book a call</h3>
              <p>Let&apos;s discuss your specific needs, walk through examples, and answer your questions. 30 minutes, no pressure.</p>
              <Link href="/#contact" className="svc-btn-ghost">Book a 30-Minute Call</Link>
            </div>
          </div>

          <div className="svc-tier-nav">
            <p>Not sure if this is the right tier for you?</p>
            <ul>
              <li>Need a full website + SEO too? → <Link href="/services/presence">Check out Presence</Link></li>
              <li>Already have a website and want lead gen? → <Link href="/services/growth">Check out Growth</Link></li>
              <li>Want to see all options? → <Link href="/#services">View All Services</Link></li>
            </ul>
          </div>
        </section>

      </div>
    </>
  );
}
