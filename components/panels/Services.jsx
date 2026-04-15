'use client';
import { Bot, Globe, TrendingUp, Zap, Brain, Target } from 'lucide-react';

const CARDS = [
  {
    id: 'service-ai-starter',
    Icon: Bot,
    name: 'AI Automation Starter',
    outcome: 'Your first AI system — handling leads while you sleep',
    highlights: [
      'Custom AI chatbot trained on your business',
      'Calendar booking + CRM integration',
      'FAQ handling + lead qualification',
      'Monthly updates & monitoring',
    ],
    perfectFor: 'Service businesses losing leads to voicemail and email delays',
    price: '$997 setup + $97/mo',
    pricingAnchor: '#pricing-ai-starter',
  },
  {
    id: 'service-presence',
    Icon: Globe,
    name: 'Presence',
    outcome: 'Get found online — the foundation every business needs',
    highlights: [
      'Professional 5-page website',
      'Local SEO + Google Business Profile',
      'Basic AI inquiry assistant',
      'Monthly performance reports',
    ],
    perfectFor: 'New businesses that need a professional online foundation',
    price: '$297/mo + $997 setup',
    pricingAnchor: '#pricing-presence',
  },
  {
    id: 'service-growth',
    Icon: TrendingUp,
    name: 'Growth',
    outcome: 'Turn visitors into leads automatically',
    highlights: [
      'Everything in Presence, plus:',
      'Full AI automation + email marketing',
      'SEO content (2 articles/month)',
      'Conversion-optimized landing pages',
    ],
    perfectFor: 'Established businesses ready for consistent lead generation',
    price: '$597/mo + $2,497 setup',
    pricingAnchor: '#pricing-growth',
  },
  {
    id: 'service-revenue-engine',
    Icon: Zap,
    name: 'Revenue Engine',
    outcome: 'Automate your entire sales process',
    highlights: [
      'Everything in Growth, plus:',
      'Full sales funnel + workflow automation',
      'Paid ads setup (Google or Meta)',
      'Monthly strategy calls with David',
    ],
    perfectFor: 'Businesses scaling revenue without scaling headcount',
    price: '$997/mo + $3,997 setup',
    pricingAnchor: '#pricing-revenue-engine',
  },
  {
    id: 'service-ai-first',
    Icon: Brain,
    name: 'AI-First',
    outcome: 'Run a bigger business with the same team',
    highlights: [
      'Everything in Revenue Engine, plus:',
      'Voice AI (answering + booking)',
      'Programmatic SEO at scale',
      'Social media AI scheduling + full analytics dashboard',
    ],
    perfectFor: 'Owners replacing manual work with advanced AI systems',
    price: '$1,497/mo + $5,497 setup',
    pricingAnchor: '#pricing-ai-first',
  },
  {
    id: 'service-consulting',
    Icon: Target,
    name: 'Consulting & Strategy',
    outcome: 'Know exactly where to start before you spend',
    highlights: [
      'AI readiness audit + transformation roadmap',
      'Tool stack recommendations',
      'Staff AI training & workshops',
      'Optional fractional AI advisor (ongoing)',
    ],
    perfectFor: 'Businesses wanting expert guidance before committing to a build',
    price: '$497 once or $1,497/mo fractional',
    pricingAnchor: '#pricing-consulting',
  },
];

export default function Services() {
  return (
    <section className="panel" id="services" style={{background:'var(--navy2)'}}>
      <div className="svc-panel">
        <div className="panel-eyebrow">Services</div>
        <h2 className="panel-h2" style={{ marginBottom: '8px' }}>
          Everything you need to get found, get leads, and get paid.
        </h2>
        <p className="panel-sub" style={{ marginBottom: '40px' }}>
          Each tier is a complete system — not a menu of disconnected services. Start where it makes sense and scale when you&apos;re ready.
        </p>

        <div className="svc-tier-grid">
          {CARDS.map(({ id, Icon, name, outcome, highlights, perfectFor, price, pricingAnchor }) => (
            <div key={id} id={id} className="svc-tier-card" style={{ scrollMarginTop: '100px' }}>
              <div className="svc-tier-top">
                <div className="svc-tier-icon">
                  <Icon size={30} color="#00D9FF" strokeWidth={1.75} />
                </div>
                <h3 className="svc-tier-name">{name}</h3>
                <p className="svc-tier-outcome">{outcome}</p>
                <ul className="svc-tier-list">
                  {highlights.map((h, i) => <li key={i}>{h}</li>)}
                </ul>
                <p className="svc-tier-perfect"><em>Perfect for: {perfectFor}</em></p>
                <p className="svc-tier-price">{price}</p>
              </div>
              <div className="svc-tier-ctas">
                <a href={pricingAnchor} className="btn-ghost-w svc-tier-btn-ghost">See Pricing ↓</a>
                <a href="#contact" className="btn-primary svc-tier-btn-solid">Get Started</a>
              </div>
            </div>
          ))}
        </div>

        <div className="svc-tier-bottom-cta">
          <p><strong>Not sure which tier fits?</strong> The free audit is the easiest way to get a personalized recommendation.</p>
          <a href="#contact" className="btn-primary" style={{ marginTop: '16px', display: 'inline-flex' }}>Get a Free Audit →</a>
        </div>
      </div>
    </section>
  );
}
