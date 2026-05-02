import type { Metadata } from 'next';
import Link from 'next/link';
import AnimatedSection from '../components/AnimatedSection';
import PricingCard, { type PricingTier } from '../components/PricingCard';
import HeadToHeadBars from '../components/HeadToHeadBars';
import FAQAccordion from '../components/FAQAccordion';
import CTASection from '../components/CTASection';
import Button from '../components/Button';

export const metadata: Metadata = {
  title: 'Pricing — LotPilot.ai',
  description:
    'One monthly fee. No per-seat charges. No hidden add-ons. Three tiers from $699/mo. Cancel anytime.',
};

const DEMO_URL = 'https://cal.com/david-aiandweb/lotpilot-demo';

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
      'VIN decoder + NHTSA data',
      'Photo management',
      'Service scheduling',
      '150-point inspection',
      'Google reviews integration',
      'CARFAX / AutoCheck badges',
      'PWA installable dashboard',
      'Email support',
    ],
    excludes: [
      'AI lead scoring',
      'AI price intelligence',
      'AI follow-up sequences',
      'Stripe payments + deposits',
      'n8n automation workflows',
      'Listing syndication feeds',
      'Salesperson + commission tracking',
      'Mobile photo capture app',
      'Multi-location · Lender submission',
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
      'Advanced desking (profit matrix)',
      'Documents + forms + credit pre-qual',
      'Listing syndication feeds',
      'F&I tracking + deal builder',
      'Salesperson assignment + commissions',
      'Recon pipeline',
      'Mobile photo capture app',
      'Push notifications + owner dashboard',
      'QuickBooks integration',
      'Priority phone support',
    ],
    excludes: [
      'Multi-location support',
      'Dedicated CRM instance',
      'Lender submission (RouteOne)',
      '700Credit bureau pulls',
      'Custom integrations + API',
      'Dedicated account manager',
      'SLA guarantee',
    ],
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
      'Dedicated EspoCRM instance',
      'Lender submission (RouteOne)',
      '700Credit bureau pulls',
      'Custom integrations + API access',
      'White-label option',
      'Custom AI voice & branding',
      'Dedicated account manager',
      'Priority support + onboarding',
      'SLA guarantee',
    ],
    ctaLabel: 'Contact us',
    ctaHref: '/lotpilot/contact',
    ctaVariant: 'outline',
  },
];

const HEAD_TO_HEAD = [
  { label: 'DealerOn + vAuto + VinSolutions', price: '$2,799/mo', numeric: 2799 },
  { label: 'Dealer.com + DealerAI',           price: '$2,150/mo', numeric: 2150 },
  { label: 'LotPilot.ai Professional',        price: '$1,199/mo', numeric: 1199, brand: true },
];

const PRICING_FAQ = [
  {
    q: 'Are there any hidden fees?',
    a: 'No. The setup fee and the monthly fee are all you pay. No per-seat charges. No per-message AI fees. No per-lead fees. No transaction surcharges.',
  },
  {
    q: 'What does the setup fee cover?',
    a: 'Inventory import, branding configuration, AI agent training on your dealership’s voice, website setup, domain configuration, and a 30-minute walkthrough with your team.',
  },
  {
    q: 'Can I switch tiers later?',
    a: 'Yes. Upgrade or downgrade any time. Prorated. No penalty fees.',
  },
  {
    q: 'How does Overlay Mode pricing work?',
    a: 'Overlay Mode is $200/mo less than the equivalent all-in tier. You keep your existing website; we add the AI agents, CRM, and automation behind it.',
  },
  {
    q: 'Do you offer annual discounts?',
    a: 'We don’t lock you into annual contracts — that’s the point. But if you prepay 12 months upfront, we’ll take 10% off.',
  },
  {
    q: 'What if I exceed my Growth vehicle limit?',
    a: 'We’ll let you know before anything breaks. You can stay over for one billing cycle, then upgrade to Professional (which is unlimited) or trim inventory. No overage fees.',
  },
  {
    q: 'Do I own my data?',
    a: 'Always. Export everything anytime in CSV. We never sell, share, or train external models on your dealership data.',
  },
  {
    q: 'Is there a contract?',
    a: 'No annual contracts. Month-to-month only. We earn the relationship every month — that keeps us honest.',
  },
];

export default function PricingPage() {
  return (
    <main>
      <section
        className="lp-section"
        style={{ paddingTop: 'clamp(120px, 14vw, 180px)' }}
        id="pricing-tiers"
      >
        <div className="lp-container">
          <AnimatedSection animation="fade">
            <span className="lp-eyebrow">Pricing</span>
            <h1>Simple, all-inclusive pricing</h1>
            <p className="lp-lead" style={{ marginTop: 20 }}>
              One monthly fee. No per-seat charges. No hidden add-ons. Cancel anytime with 30 days
              notice.
            </p>
          </AnimatedSection>

          <div className="lp-pricing__grid">
            {TIERS.map((t, i) => (
              <AnimatedSection animation="scale" delay={i * 100} key={t.name}>
                <PricingCard tier={t} />
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection animation="fade" delay={300}>
            <p
              style={{
                marginTop: 36,
                textAlign: 'center',
                fontSize: 14,
                color: 'var(--lp-muted)',
              }}
            >
              All tiers include unlimited support · No annual contracts · Cancel anytime ·{' '}
              <Link href="/lotpilot/features" style={{ color: 'var(--lp-red)', fontWeight: 700 }}>
                Compare every feature →
              </Link>
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* HEAD-TO-HEAD */}
      <section className="lp-section lp-section--off">
        <div className="lp-container">
          <AnimatedSection animation="fade">
            <span className="lp-eyebrow">The Math</span>
            <h2>Total monthly software cost — head-to-head</h2>
            <p className="lp-lead" style={{ marginTop: 16 }}>
              Same features. Same outcomes. A fraction of the bill.
            </p>
          </AnimatedSection>

          <HeadToHeadBars
            rows={HEAD_TO_HEAD}
            saveBig="Save $950–1,600/mo"
            saveSmall="That’s $11,400–19,200 per year switching to LotPilot.ai Professional."
          />
        </div>
      </section>

      {/* OVERLAY MODE */}
      <section className="lp-section">
        <div className="lp-container">
          <AnimatedSection animation="fade">
            <span className="lp-eyebrow">Overlay Mode</span>
            <h2>Keep your website. Get the agents.</h2>
            <p className="lp-lead" style={{ marginTop: 16 }}>
              Already love your dealership site? Add LotPilot AI Chat, CRM, and automation on top
              of what you have. Same agents, same dashboard — $200/mo less than the equivalent
              all-in tier.
            </p>
          </AnimatedSection>

          <div className="lp-pricing__grid" style={{ marginTop: 40 }}>
            <AnimatedSection animation="scale">
              <article className="lp-price-card">
                <div className="lp-price-card__tier">Overlay · Growth</div>
                <div className="lp-price-card__price">$499 <small>/ mo</small></div>
                <div className="lp-price-card__meta">+ $499 setup · Up to 50 vehicles</div>
                <ul className="lp-price-card__list">
                  <li className="in">AI Sales Agent on your existing site</li>
                  <li className="in">Full admin panel + CRM</li>
                  <li className="in">AI description writer</li>
                  <li className="in">AI review responder</li>
                  <li className="in">Lead inbox + service scheduling</li>
                </ul>
                <Button href={DEMO_URL} variant="outline" external>Start with Overlay</Button>
              </article>
            </AnimatedSection>

            <AnimatedSection animation="scale" delay={80}>
              <article className="lp-price-card lp-price-card--featured">
                <span className="lp-price-card__badge">Best Value</span>
                <div className="lp-price-card__tier">Overlay · Professional</div>
                <div className="lp-price-card__price">$999 <small>/ mo</small></div>
                <div className="lp-price-card__meta">+ $999 setup · Unlimited vehicles</div>
                <ul className="lp-price-card__list">
                  <li className="in">Everything in Overlay Growth</li>
                  <li className="in">All 6 AI agents</li>
                  <li className="in">AI lead scoring + price intelligence</li>
                  <li className="in">AI follow-up sequences</li>
                  <li className="in">SMS + Twilio integration</li>
                  <li className="in">Stripe deposits + payments</li>
                  <li className="in">n8n automation workflows</li>
                </ul>
                <Button href={DEMO_URL} variant="filled" external>Get Overlay Pro</Button>
              </article>
            </AnimatedSection>

            <AnimatedSection animation="scale" delay={160}>
              <article className="lp-price-card">
                <div className="lp-price-card__tier">Overlay · Enterprise</div>
                <div className="lp-price-card__price">$1,599 <small>/ mo</small></div>
                <div className="lp-price-card__meta">+ $1,999 setup · Multi-location</div>
                <ul className="lp-price-card__list">
                  <li className="in">Everything in Overlay Pro</li>
                  <li className="in">Multi-location support</li>
                  <li className="in">Dedicated CRM instance</li>
                  <li className="in">Custom integrations + API</li>
                  <li className="in">Dedicated account manager</li>
                  <li className="in">SLA guarantee</li>
                </ul>
                <Button href="/lotpilot/contact" variant="outline">Contact us</Button>
              </article>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* PRICING FAQ */}
      <section className="lp-section lp-section--off">
        <div className="lp-container">
          <AnimatedSection animation="fade">
            <span className="lp-eyebrow">Pricing FAQ</span>
            <h2>The fine print, without the fine print</h2>
          </AnimatedSection>
          <FAQAccordion items={PRICING_FAQ} />
        </div>
      </section>

      <CTASection
        heading="Pick a tier or talk to a human"
        sub="15 minutes, no slides, no pressure. Just a working demo on your inventory."
      />
    </main>
  );
}
