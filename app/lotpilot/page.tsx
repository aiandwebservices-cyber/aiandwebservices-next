import type { Metadata } from 'next';
import AnimatedSection from './components/AnimatedSection';
import StatsCounter from './components/StatsCounter';
import AgentCard from './components/AgentCard';
import PricingCard, { type PricingTier } from './components/PricingCard';
import HeadToHeadBars from './components/HeadToHeadBars';
import FAQAccordion from './components/FAQAccordion';
import CTASection from './components/CTASection';
import Button from './components/Button';
import {
  SalesIcon,
  DescriptionIcon,
  ScorerIcon,
  PriceIcon,
  FollowUpIcon,
  ReviewIcon,
} from './components/AgentIcons';

export const metadata: Metadata = {
  title: 'LotPilot.ai — Your entire dealership. On autopilot.',
  description:
    'Six AI agents replace your website, CRM, F&I tools, and 5+ subscriptions. Live in 5 business days. No contracts.',
};

const DEMO_URL = 'https://cal.com/david-aiandweb/lotpilot-demo';
const LIVE_URL = 'https://lotpilot.ai/dealers/lotcrm?demo=true';

const AGENTS = [
  {
    icon: <SalesIcon />,
    name: 'Sales Agent',
    desc: 'Answers every customer instantly with real inventory knowledge. 24/7.',
    cost: '~$0.02 / conversation',
  },
  {
    icon: <DescriptionIcon />,
    name: 'Description Writer',
    desc: 'Compelling VDP listings generated in seconds, not hours.',
    cost: '~$0.001 / vehicle',
  },
  {
    icon: <ScorerIcon />,
    name: 'Lead Scorer',
    desc: 'Ranks every lead by purchase intent. Call the hot ones first.',
    cost: 'Free — pure math',
  },
  {
    icon: <PriceIcon />,
    name: 'Price Optimizer',
    desc: 'Days-on-lot, comps, and margin analyzed. Right price, right time.',
    cost: 'Free — pure math',
  },
  {
    icon: <FollowUpIcon />,
    name: 'Follow-Up Writer',
    desc: '4-stage personalized sequences for every lead. Not templates.',
    cost: '~$0.004 / sequence',
  },
  {
    icon: <ReviewIcon />,
    name: 'Review Responder',
    desc: 'Professional Google review responses in your dealership’s voice.',
    cost: '~$0.001 / response',
  },
];

const HEAD_TO_HEAD = [
  { label: 'DealerOn + vAuto + VinSolutions', price: '$2,799/mo', numeric: 2799 },
  { label: 'Dealer.com + DealerAI',           price: '$2,150/mo', numeric: 2150 },
  { label: 'LotPilot.ai Professional',        price: '$1,199/mo', numeric: 1199, brand: true },
];

const TIERS: PricingTier[] = [
  {
    name: 'Growth',
    price: '$699',
    setup: '$499',
    meta: 'Up to 50 vehicles',
    includes: [
      'Custom dealership website',
      'Full admin panel + CRM',
      'AI sales agent (chat + SMS)',
      'AI description writer',
      'AI review responder',
    ],
    excludes: [
      'AI lead scoring',
      'AI price intelligence',
      'AI follow-up sequences',
      'Stripe deposits + payments',
      'n8n automation workflows',
    ],
    ctaLabel: 'Start with Growth',
    ctaHref: DEMO_URL,
    ctaVariant: 'outline',
  },
  {
    name: 'Professional',
    price: '$1,199',
    setup: '$999',
    meta: 'Unlimited vehicles',
    includes: [
      'Everything in Growth',
      'All 6 AI agents (full suite)',
      'AI lead scoring + price intelligence',
      'AI follow-up sequences',
      'SMS + Twilio integration',
      'Stripe deposits + payments',
      'n8n automation workflows',
      'Listing syndication feeds',
    ],
    excludes: ['Multi-location support', 'Dedicated account manager', 'SLA guarantee'],
    ctaLabel: 'Get Professional',
    ctaHref: DEMO_URL,
    ctaVariant: 'filled',
    featured: true,
    badge: 'Most Popular',
  },
  {
    name: 'Enterprise',
    price: '$1,799',
    setup: '$1,999',
    meta: 'Unlimited · Multi-location',
    includes: [
      'Everything in Professional',
      'Multi-location support',
      'Dedicated CRM instance',
      'Custom integrations + API',
      'Dedicated account manager',
      'Priority support + SLA',
    ],
    ctaLabel: 'Contact us',
    ctaHref: '/lotpilot/contact',
    ctaVariant: 'outline',
  },
];

const FAQ = [
  {
    q: 'Can I keep my existing website?',
    a: 'Yes. With Overlay Mode, you keep the site you already love and we add LotPilot AI Chat, CRM, and automation on top. Same agents. Same dashboard. $200/mo less than the all-in plan.',
  },
  {
    q: 'How long does setup take?',
    a: '5 business days from contract signing. Often sooner. We import your inventory, configure branding, train the agents on your dealership’s voice, and push live.',
  },
  {
    q: 'What if I want to cancel?',
    a: 'Month-to-month, cancel anytime with 30 days notice. Full data export in CSV before anything turns off. No clawbacks. No surprise fees.',
  },
  {
    q: 'Do I own my data?',
    a: 'Yes. Always. Export everything anytime in CSV. We never sell, share, or train external models on your dealership data.',
  },
  {
    q: 'Is there a contract?',
    a: 'No annual contracts. Month-to-month only. We earn the relationship every month — that keeps us honest.',
  },
  {
    q: 'What happens to my leads if I switch?',
    a: 'Full export of leads, conversations, and inventory before anything turns off. You leave with everything you came with, plus everything you built while here.',
  },
];

export default function HomePage() {
  return (
    <main>
      {/* HERO */}
      <section className="lp-hero">
        <div className="lp-container lp-hero__inner">
          <span className="lp-pill">6 AI agents. One platform. Zero headaches.</span>
          <h1>
            Your entire dealership. On <span className="accent">autopilot.</span>
          </h1>
          <p className="lp-hero__sub">
            The all-in-one AI command center that replaces your website, CRM, F&amp;I tools,
            inventory system, and 5 other subscriptions you&apos;re overpaying for.
          </p>
          <div className="lp-hero__cta-row">
            <Button href={DEMO_URL} variant="filled" size="lg" external>
              Book a demo →
            </Button>
            <Button href={LIVE_URL} variant="ghost" size="lg" external>
              See it live
            </Button>
          </div>
          <p className="lp-hero__proof">
            Live in 5 days · No contracts · Cancel anytime
          </p>
        </div>
      </section>

      {/* STATS BAR */}
      <StatsCounter />

      {/* 6 AGENTS */}
      <section className="lp-section">
        <div className="lp-container">
          <AnimatedSection animation="fade">
            <span className="lp-eyebrow">The 6 Agents</span>
            <h2>AI that actually works the lot</h2>
            <p className="lp-lead" style={{ marginTop: 16 }}>
              Each agent is purpose-built for dealers. Together they replace $30k+/yr in staffing.
            </p>
          </AnimatedSection>

          <div className="lp-agents__grid">
            {AGENTS.map((a, i) => (
              <AnimatedSection key={a.name} animation="fade" delay={i * 80}>
                <AgentCard {...a} />
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection animation="fade" delay={300}>
            <p
              style={{
                marginTop: 40,
                textAlign: 'center',
                color: 'var(--lp-muted)',
                fontSize: 15,
                fontWeight: 600,
              }}
            >
              Total AI cost per dealer: <strong style={{ color: 'var(--lp-navy)' }}>~$20–30/month</strong>.
              Less than one newspaper ad.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* COMPARISON — head-to-head bars */}
      <section className="lp-section lp-section--off">
        <div className="lp-container">
          <AnimatedSection animation="fade">
            <span className="lp-eyebrow">The Math</span>
            <h2>Stop overpaying for underpowered tools</h2>
            <p className="lp-lead" style={{ marginTop: 16 }}>
              Most dealers stitch together five products that were never built to work together —
              and pay $1,500–$3,000/mo for the privilege.
            </p>
          </AnimatedSection>

          <HeadToHeadBars
            rows={HEAD_TO_HEAD}
            saveBig="Save $950–1,600/mo"
            saveSmall="That’s $11,400–19,200 per year switching to LotPilot.ai Professional."
          />
        </div>
      </section>

      {/* PRICING */}
      <section className="lp-section">
        <div className="lp-container">
          <AnimatedSection animation="fade">
            <span className="lp-eyebrow">Pricing</span>
            <h2>Simple, honest pricing</h2>
            <p className="lp-lead" style={{ marginTop: 16 }}>
              No hidden fees. No per-lead charges. No gotchas.
            </p>
          </AnimatedSection>

          <div className="lp-pricing__grid">
            {TIERS.map((t, i) => (
              <AnimatedSection animation="scale" delay={i * 100} key={t.name}>
                <PricingCard tier={t} />
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection animation="fade" className="lp-overlay-callout">
            <div>
              <h3>Already have a website you love?</h3>
              <p>
                Add LotPilot AI Chat, CRM, and automation to your existing site with{' '}
                <strong>Overlay Mode</strong> — same AI agents, same CRM, $200/mo less.
              </p>
            </div>
            <Button href="/lotpilot/contact" variant="outline">
              Ask about Overlay Mode
            </Button>
          </AnimatedSection>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="lp-section lp-section--blue">
        <div className="lp-container">
          <AnimatedSection animation="fade">
            <span className="lp-eyebrow">How It Works</span>
            <h2>Up and running in 5 business days</h2>
          </AnimatedSection>

          <div className="lp-steps">
            {[
              { n: 1, h: 'Book a 15-min call', p: 'We learn about your dealership, show a live demo, confirm fit.' },
              { n: 2, h: 'We build your platform', p: 'Import inventory, configure branding, set up AI agents, push live.' },
              { n: 3, h: 'AI starts working immediately', p: 'Leads answered in seconds. Descriptions written. Follow-ups going. You just sell.' },
            ].map((s, i) => (
              <AnimatedSection animation="fade" delay={i * 120} key={s.n}>
                <div className="lp-step">
                  <div className="lp-step__num">{s.n}</div>
                  <h3>{s.h}</h3>
                  <p>{s.p}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="lp-section">
        <div className="lp-container">
          <AnimatedSection animation="fade">
            <span className="lp-eyebrow">FAQ</span>
            <h2>Common questions, straight answers</h2>
          </AnimatedSection>
          <FAQAccordion items={FAQ} />
        </div>
      </section>

      <CTASection />
    </main>
  );
}
