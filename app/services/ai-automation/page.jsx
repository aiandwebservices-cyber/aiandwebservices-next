import Link from 'next/link';
import { Bot, Phone, Clock, ClipboardList } from 'lucide-react';

export const metadata = {
  title: 'AI Automation & Chatbots for Small Business | AIandWEBservices',
  description: 'Custom AI chatbots, voice AI, workflow automation, and CRM integration built personally by David Pulis. Stop losing leads to businesses with better technology.',
  keywords: 'AI automation small business, custom AI chatbot, workflow automation, voice AI, AI CRM integration, chatbot development',
  alternates: { canonical: 'https://www.aiandwebservices.com/services/ai-automation' },
  openGraph: {
    title: 'AI Automation & Chatbots for Small Business | AIandWEBservices',
    description: 'Custom AI systems that handle inquiries, qualify leads, and follow up automatically — 24/7, without you.',
    url: 'https://www.aiandwebservices.com/services/ai-automation',
    type: 'website',
  },
};

const faqItems = [
  {
    question: 'Do I need technical knowledge to use an AI automation system?',
    answer: 'No. Everything is built to be managed through a simple dashboard, or David handles it directly. You never write code or manage APIs. If something needs adjusting, you send a message.',
  },
  {
    question: 'Will AI automation work with the tools I already use?',
    answer: 'In most cases, yes. Systems can connect to Google Workspace, HubSpot, Salesforce, Slack, Calendly, Shopify, GoHighLevel, and hundreds of other platforms via API or no-code connectors like Zapier and Make.',
  },
  {
    question: 'How long does setup take?',
    answer: 'A standalone AI chatbot is typically live in 5–7 business days. Full workflow automation systems with CRM integration take 2–4 weeks depending on complexity.',
  },
  {
    question: 'What does AI automation cost?',
    answer: 'The AI Automation Starter package starts at $997 one-time setup and $97/month for ongoing support and updates. More complex systems are scoped after the free audit. There are no surprise charges.',
  },
  {
    question: 'Can it replace my employees?',
    answer: 'AI automation is best used to handle the repetitive, predictable parts of a role — not to replace human judgment. Most clients use it to free their team from manual tasks so everyone can focus on higher-value work.',
  },
  {
    question: 'What happens if the AI gives a wrong answer?',
    answer: 'Every system includes a handoff protocol — if the AI is not confident, it routes the inquiry to you or captures contact details for follow-up. You review the knowledge base during setup so the AI only answers what it knows.',
  },
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Service',
      '@id': 'https://www.aiandwebservices.com/services/ai-automation#service',
      name: 'AI Automation & Chatbot Development',
      description: 'Custom AI chatbots, voice AI agents, workflow automation, and CRM integration for small businesses. Built personally by David Pulis at AIandWEBservices.',
      provider: {
        '@type': 'ProfessionalService',
        name: 'AIandWEBservices',
        url: 'https://www.aiandwebservices.com',
        founder: { '@type': 'Person', name: 'David Pulis' },
      },
      areaServed: { '@type': 'Country', name: 'United States' },
      offers: {
        '@type': 'Offer',
        price: '997',
        priceCurrency: 'USD',
        description: 'AI Automation Starter — one-time setup fee',
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
        { '@type': 'ListItem', position: 3, name: 'AI Automation', item: 'https://www.aiandwebservices.com/services/ai-automation' },
      ],
    },
  ],
};

export default function AIAutomationPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="svc-page-wrap">

        {/* ── Hero ── */}
        <section className="svc-page-hero">
          <div className="svc-page-eyebrow"><Bot size={14} style={{display:'inline',verticalAlign:'middle',marginRight:'6px'}} />AI &amp; Automation</div>
          <h1 className="svc-page-h1">Stop Doing Manually<br />What AI Can Do 24/7</h1>
          <p className="svc-page-lead">
            Every hour you spend answering the same questions, manually following up with leads, or jumping between disconnected tools is an hour your competitors are using to pull ahead. AI automation isn&apos;t just for enterprise companies anymore — it&apos;s the most efficient way for a small business to do more without hiring more.
          </p>
        </section>

        {/* ── What It Looks Like ── */}
        <section className="svc-page-section">
          <h2>What AI Automation Actually Looks Like for Your Business</h2>
          <p>
            AI automation means replacing repetitive, time-consuming tasks with intelligent software that handles them automatically — and improves over time. Here&apos;s what that looks like in practice:
          </p>
          <div className="svc-example-grid">
            <div className="svc-example">
              <div className="svc-example-icon"><Clock size={28} color="#2AA5A0" strokeWidth={1.75} /></div>
              <p>A customer asks about your pricing at 11 PM. Your AI assistant answers instantly, qualifies their budget, and books a discovery call for Tuesday morning — all without you lifting a finger.</p>
            </div>
            <div className="svc-example">
              <div className="svc-example-icon"><ClipboardList size={28} color="#2AA5A0" strokeWidth={1.75} /></div>
              <p>A new lead fills out your contact form. Within seconds they receive a personalized follow-up email, get added to your CRM, and are tagged for a specific nurture sequence based on what they selected.</p>
            </div>
            <div className="svc-example">
              <div className="svc-example-icon"><Phone size={28} color="#2AA5A0" strokeWidth={1.75} /></div>
              <p>You finish a client call. Your AI system transcribes it, extracts action items, creates follow-up tasks in your project tool, and drafts a summary email — ready to review in two minutes.</p>
            </div>
          </div>
          <p>None of this requires you to be at your desk. That&apos;s the point.</p>
        </section>

        {/* ── Services We Build ── */}
        <section className="svc-page-section">
          <h2>AI Systems We Build</h2>

          <h3>Custom AI Chatbots &amp; Intelligent Assistants</h3>
          <p>
            A chatbot trained specifically on your business — your services, pricing, FAQs, policies, and brand voice. Deployed on your website, it handles inquiries around the clock, qualifies leads before they reach you, and routes complex questions to your inbox. Built on GPT-4o or Claude 3.5 depending on your use case, with a knowledge base you review and approve before launch.
          </p>

          <h3>Voice AI — Answering, Booking, Qualifying</h3>
          <p>
            An AI voice agent that answers your phone, books appointments directly into your calendar, and captures caller information — even when you&apos;re unavailable. Ideal for service businesses like clinics, salons, contractors, and consultants where every missed call is a missed sale. Integrates with Calendly, Acuity, and most major scheduling platforms.
          </p>

          <h3>Workflow Automation (Zapier, Make, n8n)</h3>
          <p>
            Connect the tools you already use — CRM, email, calendar, project management, invoicing — so data moves automatically between them. A new contact in HubSpot triggers a welcome sequence in Mailchimp. A paid invoice in Stripe creates a project in Asana and sends a Slack message. Stop copy-pasting between platforms and start operating with a system that runs itself.
          </p>

          <h3>AI-Powered CRM Integration</h3>
          <p>
            Your CRM (HubSpot, Salesforce, GoHighLevel, or any other) enhanced with AI. Leads are automatically scored and routed. Deals are auto-updated based on email activity. Pipeline reports are generated without manual input. Sales reps spend their time selling, not updating records.
          </p>

          <h3>Content Generation Pipelines</h3>
          <p>
            An AI system that produces first drafts of blog posts, social media content, email newsletters, and product descriptions based on your brand guidelines and tone. You review and publish in minutes — not hours. Paired with our SEO service, this creates a compounding content engine that grows organic traffic month over month.
          </p>

          <h3>AI Data Dashboards &amp; Reporting</h3>
          <p>
            Connect your analytics, ad platforms, e-commerce, and sales data into a single AI-powered dashboard. Get weekly plain-English summaries of what&apos;s working, what isn&apos;t, and what to focus on next — without needing to be a data analyst.
          </p>
        </section>

        {/* ── Why Now ── */}
        <section className="svc-page-section">
          <h2>Why Small Businesses Are Adopting AI Now</h2>
          <p>
            The barrier to AI has dropped dramatically. What required a team of engineers two years ago can now be deployed in days. The businesses pulling ahead right now aren&apos;t doing it because they had more money — they did it because they made the decision sooner.
          </p>
          <p>
            The cost of <em>not</em> automating is growing. Your team&apos;s time is finite. AI automation creates leverage: the same input produces a larger output. One person with the right AI systems can outperform a team of three — and deliver a better customer experience doing it.
          </p>
        </section>

        {/* ── Process ── */}
        <section className="svc-page-section">
          <h2>How It Works: From Audit to Automation</h2>
          <ol className="svc-process-list">
            <li>
              <strong>Free AI Audit</strong> — David reviews your business, identifies the top three automations that would have the biggest revenue impact, and builds a clear implementation plan. No obligation, no pitch.
            </li>
            <li>
              <strong>Build Phase</strong> — Custom development of your AI system. Typically 1–2 weeks. You&apos;re involved only where your input actually matters — reviewing the knowledge base, approving flows, confirming integrations.
            </li>
            <li>
              <strong>Integration &amp; Testing</strong> — Your system is connected to your existing tools and thoroughly tested across real-world scenarios before going live.
            </li>
            <li>
              <strong>Launch &amp; Ongoing Support</strong> — 30 days of post-launch support included. Monthly maintenance and update packages available from $97/month.
            </li>
          </ol>
        </section>

        {/* ── FAQ ── */}
        <section className="svc-page-section svc-faq-section">
          <h2>Frequently Asked Questions</h2>
          <dl className="svc-faq-list">
            {faqItems.map((item) => (
              <div key={item.question} className="svc-faq-item">
                <dt>{item.question}</dt>
                <dd>{item.answer}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* ── Bottom CTA ── */}
        <section className="svc-page-cta-section">
          <div className="svc-cta-box">
            <h2>Ready to See Where AI Can Help Your Business?</h2>
            <p>David personally reviews every business and responds within 6 hours — with specific, actionable recommendations. No pitch. No obligation.</p>
            <div className="svc-cta-btns">
              <Link href="/#contact" className="svc-btn-primary">Get Your Free AI Audit →</Link>
              <Link href="/#pricing" className="svc-btn-ghost">See Pricing</Link>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}
