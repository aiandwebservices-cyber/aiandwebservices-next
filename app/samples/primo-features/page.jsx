'use client';
import { Fragment, useEffect, useRef, useState } from 'react';
import { Cormorant_Garamond, DM_Sans } from 'next/font/google';
import {
  Check, Star, Phone, Mail, ArrowRight, ChevronDown, Lock,
  Car, Users, Shield, Cpu, LayoutDashboard, Globe,
  MessageSquare, FileText, Target, TrendingUp,
} from 'lucide-react';
import { getPlan } from '@/lib/dealer-platform/config/pricing';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-dm-sans',
  display: 'swap',
});

/* ── Design tokens ─────────────────────────────────────────── */
const GOLD  = '#D4AF37';
const GOLD2 = '#F0CC5A';
const BG    = '#080808';
const BG2   = '#0f0f0f';
const PANEL = 'rgba(255,255,255,0.04)';
const TEXT  = '#F5F0E8';
const MUTED = '#8a8070';

/* ── Feature categories ───────────────────────────────────── */
const FEATURE_GROUPS = [
  {
    key: 'inventory',
    label: 'Inventory Management',
    icon: Car,
    color: '#4A9EFF',
    features: [
      'Multi-photo upload with gallery viewer',
      'VIN decoder auto-fills year / make / model / trim',
      'Live market pricing intelligence',
      'RESERVED / HOLD badge system',
      'Sold vehicle archive with profit history',
      'Custom status badges (New Arrival, Hot Deal, etc.)',
      'CSV import & bulk export',
      'Odometer, color, drivetrain tracking',
      'Asking price vs. market comparison alerts',
      'Feature highlights per vehicle listing',
    ],
  },
  {
    key: 'leads',
    label: 'Lead Generation & CRM',
    icon: Users,
    color: '#4ADE80',
    features: [
      'Lead capture forms on every inventory page',
      'Trade-in estimator widget',
      'Live payment calculator on listings',
      'Online appointment booking system',
      'Email & SMS alert notifications',
      'Lead source tracking (organic, paid, referral)',
      'Hot / warm / cold lead scoring',
      'Deal pipeline management',
      'Automated follow-up sequences',
      'Full lead history & notes CRM',
    ],
  },
  {
    key: 'trust',
    label: 'Trust & Conversion',
    icon: Shield,
    color: '#A78BFA',
    features: [
      'Google Reviews integration & display',
      'Facebook Reviews sync',
      'Star rating display on vehicle listings',
      'Review request automation by email',
      'Testimonial management dashboard',
      'Financing pre-approval widget',
      'Trust badge system',
      'Dealer response tools for reviews',
      'Review analytics & trend charts',
      'Social proof embedded where it converts',
    ],
  },
  {
    key: 'tech',
    label: 'Technology & Performance',
    icon: Cpu,
    color: '#FB923C',
    features: [
      'Mobile-first responsive design',
      'PageSpeed score 90+ guaranteed',
      'SEO-optimized vehicle detail pages',
      'SSL included — always secure',
      'Custom domain support',
      'Global CDN delivery',
      'ADA / WCAG 2.1 accessibility compliance',
      'Google Analytics integration',
      '99.9% uptime SLA',
      'Automatic daily backups',
    ],
  },
  {
    key: 'admin',
    label: 'Dealer Admin Panel',
    icon: LayoutDashboard,
    color: GOLD,
    features: [
      'Full inventory CRUD dashboard',
      'Lead CRM with integrated deal builder',
      'F&I product tracking per deal',
      'Service appointment scheduling',
      'Reservation & deposit management',
      'Marketing tools & CSV export',
      'Website performance analytics',
      'Reputation management center',
      'Market pricing intelligence',
      'Multi-user staff access controls',
    ],
  },
];

const TESTIMONIALS = [
  {
    quote: "We cut our software spend by $14,000 last year switching to LotPilot.ai. The admin panel alone is worth it — I manage everything from my phone.",
    name: 'Marcus Reid',
    title: 'Owner',
    dealership: 'Reid Family Auto Sales',
  },
  {
    quote: "I was skeptical at first — I thought there'd be a catch. There isn't. It does everything DealerSocket does at a fraction of the price, and the website looks better.",
    name: 'Carmen Vega',
    title: 'General Manager',
    dealership: 'Vega Auto Group',
  },
  {
    quote: "The reservation system and F&I tracking changed how I work deals. Customers hold a car online, and I see exactly what I'm making on each deal before I finalize.",
    name: 'Troy Hensley',
    title: 'Dealer Principal',
    dealership: 'Hensley Motors',
  },
];

const STEPS = [
  {
    num: '01',
    title: 'We build your custom dealership website',
    desc: 'Our team designs and builds a fully custom, SEO-optimized website for your dealership — no templates, no cookie-cutter themes. Typically delivered in 5–7 business days.',
  },
  {
    num: '02',
    title: 'Your inventory goes live with dealer panel access',
    desc: 'We connect your inventory feed (or you add vehicles manually) and activate your private dealer admin panel. Manage leads, appointments, deals, and reputation from day one.',
  },
  {
    num: '03',
    title: 'More leads. More deals. Less overhead.',
    desc: 'Your site works 24/7 — capturing leads, showing reviews, calculating payments for buyers. You handle the relationships; the platform handles everything else.',
  },
];

/* ── Comparison table data ────────────────────────────────── */
const COMP_ROWS = [
  { feature: 'Dealer website',              dealeron: 'check', dealercom: 'check', dealerai: 'cross', lotpilot: 'check' },
  { feature: 'Admin panel / CRM',           dealeron: 'addon', dealercom: 'addon', dealerai: 'cross', lotpilot: 'check' },
  { feature: 'AI sales agent (chat + SMS)', dealeron: 'cross', dealercom: 'cross', dealerai: 'check', lotpilot: 'check' },
  { feature: 'AI description writer',       dealeron: 'cross', dealercom: 'cross', dealerai: 'cross', lotpilot: 'check' },
  { feature: 'AI lead scoring',             dealeron: 'cross', dealercom: 'addon', dealerai: 'cross', lotpilot: 'check' },
  { feature: 'AI price intelligence',       dealeron: 'cross', dealercom: 'cross', dealerai: 'cross', lotpilot: 'check' },
  { feature: 'AI follow-up sequences',      dealeron: 'cross', dealercom: 'cross', dealerai: 'addon', lotpilot: 'check' },
  { feature: 'AI review responder',         dealeron: 'cross', dealercom: 'cross', dealerai: 'cross', lotpilot: 'check' },
  { feature: 'Stripe payments + deposits',  dealeron: 'addon', dealercom: 'addon', dealerai: 'cross', lotpilot: 'check' },
  { feature: 'Service scheduling',          dealeron: 'addon', dealercom: 'check', dealerai: 'cross', lotpilot: 'check' },
  { feature: 'VIN decoder + NHTSA data',   dealeron: 'check', dealercom: 'check', dealerai: 'cross', lotpilot: 'check' },
  { feature: 'Photo management',            dealeron: 'check', dealercom: 'check', dealerai: 'cross', lotpilot: 'check' },
  { feature: 'n8n automation workflows',   dealeron: 'cross', dealercom: 'cross', dealerai: 'cross', lotpilot: 'check' },
];

const SAVINGS_BARS = [
  { label: 'DealerOn + vAuto + VinSolutions', price: 2799, pct: 100, color: '#FF5555' },
  { label: 'Dealer.com + DealerAI',           price: 2150, pct: 77,  color: '#FF7777' },
  { label: `LotPilot.ai ${getPlan('professional').name}`, price: getPlan('professional').monthlyPrice, pct: 43, color: GOLD },
];

const PRICING_TIERS = [
  {
    name: getPlan('growth').name,
    price: getPlan('growth').monthlyPrice,
    setup: getPlan('growth').setupFee,
    featured: false,
    features: [
      { label: 'Custom dealership website',       locked: false },
      { label: 'Full admin panel + CRM',           locked: false },
      { label: 'AI sales agent (chat + SMS)',       locked: false },
      { label: 'AI description writer',            locked: false },
      { label: 'AI review responder',              locked: false },
      { label: 'AI lead scoring',                  locked: true  },
      { label: 'AI price intelligence',            locked: true  },
      { label: 'AI follow-up sequences',           locked: true  },
      { label: 'Stripe payments + deposits',       locked: true  },
      { label: 'n8n automation workflows',        locked: true  },
    ],
  },
  {
    name: getPlan('professional').name,
    price: getPlan('professional').monthlyPrice,
    setup: getPlan('professional').setupFee,
    featured: true,
    badge: 'Most Popular',
    features: [
      { label: 'Everything in Growth',             locked: false },
      { label: 'All 6 AI agents',                 locked: false },
      { label: 'SMS + Twilio integration',         locked: false },
      { label: 'Stripe payments + deposits',       locked: false },
      { label: 'n8n automation workflows',        locked: false },
      { label: 'Service appointment scheduling',   locked: false },
      { label: 'F&I tracking + deal builder',      locked: false },
      { label: 'Market pricing intelligence',      locked: false },
      { label: 'Reputation management center',     locked: false },
      { label: 'Multi-user staff access',          locked: false },
    ],
  },
  {
    name: getPlan('enterprise').name,
    price: getPlan('enterprise').monthlyPrice,
    setup: getPlan('enterprise').setupFee,
    featured: false,
    features: [
      { label: 'Everything in Professional',       locked: false },
      { label: 'Multi-location support',           locked: false },
      { label: 'Dedicated EspoCRM instance',       locked: false },
      { label: 'Custom integrations',              locked: false },
      { label: 'Priority support + onboarding',    locked: false },
      { label: 'Custom AI voice & branding',       locked: false },
      { label: 'White-label option',               locked: false },
      { label: 'API access',                       locked: false },
      { label: 'Dedicated success manager',        locked: false },
      { label: 'SLA guarantee',                    locked: false },
    ],
  },
];

/* ── Fade-in hook ─────────────────────────────────────────── */
function useFadeIn(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

function FadeSection({ children, delay = 0 }) {
  const [ref, visible] = useFadeIn();
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(28px)',
        transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

/* ── Shared atoms ─────────────────────────────────────────── */
function FontStyles() {
  return (
    <style>{`
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      html { scroll-behavior: smooth; }
      ::selection { background: ${GOLD}33; color: ${TEXT}; }
      ::-webkit-scrollbar { width: 4px; }
      ::-webkit-scrollbar-track { background: ${BG2}; }
      ::-webkit-scrollbar-thumb { background: ${GOLD}44; border-radius: 4px; }
      @media (max-width: 700px) {
        .comp-table-scroll { overflow-x: auto; -webkit-overflow-scrolling: touch; }
        .tier-grid { grid-template-columns: 1fr !important; }
        .ai-showcase-grid { grid-template-columns: 1fr !important; }
      }
    `}</style>
  );
}

function SectionWrap({ children, id, bg }) {
  return (
    <section id={id} style={{ padding: '96px 0', background: bg || BG }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>
        {children}
      </div>
    </section>
  );
}

function Label({ children }) {
  return (
    <p style={{
      fontSize: 11, fontWeight: 600, letterSpacing: '0.22em',
      textTransform: 'uppercase', color: GOLD, marginBottom: 16,
      fontFamily: "var(--font-dm-sans), sans-serif",
    }}>{children}</p>
  );
}

function Heading({ children, sub }) {
  return (
    <div style={{ marginBottom: 48 }}>
      <h2 style={{
        fontFamily: "var(--font-cormorant), serif",
        fontSize: 'clamp(36px, 5vw, 56px)',
        fontWeight: 700, lineHeight: 1.05, color: TEXT,
        marginBottom: sub ? 16 : 0,
      }}>{children}</h2>
      {sub && <p style={{ fontSize: 18, color: MUTED, lineHeight: 1.65, maxWidth: 600 }}>{sub}</p>}
    </div>
  );
}

function Stars() {
  return (
    <div style={{ display: 'flex', gap: 3, marginBottom: 16 }}>
      {[0,1,2,3,4].map(i => <Star key={i} size={13} fill={GOLD} color={GOLD} />)}
    </div>
  );
}

/* ── Comparison cell atom ─────────────────────────────────── */
function CompCell({ val, highlight }) {
  if (val === 'check') return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <span style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        width: 24, height: 24, borderRadius: '50%',
        background: '#4ADE8020', border: '1px solid #4ADE8040',
      }}>
        <Check size={13} color="#4ADE80" strokeWidth={3} />
      </span>
    </div>
  );
  if (val === 'cross') return (
    <div style={{ textAlign: 'center', fontSize: 16, color: highlight ? '#FF6060' : '#4a4038', lineHeight: 1 }}>✕</div>
  );
  if (val === 'addon') return (
    <div style={{ textAlign: 'center' }}>
      <span style={{
        fontSize: 10, fontWeight: 700, letterSpacing: '0.08em',
        color: '#FBBF24', background: '#FBBF2412', border: '1px solid #FBBF2430',
        borderRadius: 4, padding: '2px 7px', whiteSpace: 'nowrap',
      }}>Add-on</span>
    </div>
  );
  return null;
}

/* ── Competitive Comparison Section ──────────────────────── */
function CompetitiveSection() {
  const colStyle = (isAuto) => ({
    minWidth: 110, textAlign: 'center', padding: '0 8px',
    background: isAuto ? `${GOLD}0a` : 'transparent',
  });
  const headerCell = (label, isAuto) => (
    <th key={label} style={{
      padding: '14px 10px', textAlign: 'center',
      fontSize: 12, fontWeight: 700, color: isAuto ? GOLD : MUTED,
      letterSpacing: '0.04em', borderBottom: `2px solid ${isAuto ? GOLD + '55' : '#ffffff0a'}`,
      background: isAuto ? `${GOLD}12` : 'transparent', whiteSpace: 'nowrap',
    }}>{label}</th>
  );

  return (
    <section style={{ padding: '96px 0', background: '#0a0a0a', borderTop: `1px solid ${GOLD}18`, borderBottom: `1px solid ${GOLD}18` }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>

        {/* Header */}
        <FadeSection>
          <Label>Competitive Comparison</Label>
          <div style={{ marginBottom: 52 }}>
            <h2 style={{
              fontFamily: "var(--font-cormorant), serif",
              fontSize: 'clamp(36px, 5vw, 56px)',
              fontWeight: 700, lineHeight: 1.05, color: TEXT, marginBottom: 16,
            }}>Why dealers switch to LotPilot.ai</h2>
            <p style={{ fontSize: 18, color: MUTED, lineHeight: 1.65, maxWidth: 640 }}>
              DealerOn and Dealer.com charge $1,499–$1,650/mo — and you still pay extra for CRM, AI, and automation. LotPilot.ai includes it all.
            </p>
          </div>
        </FadeSection>

        {/* A. Comparison table */}
        <FadeSection delay={0.1}>
          <div className="comp-table-scroll" style={{ marginBottom: 64, borderRadius: 14, border: `1px solid ${GOLD}22`, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 620 }}>
              <thead>
                <tr style={{ background: '#111' }}>
                  <th style={{
                    padding: '16px 20px', textAlign: 'left',
                    fontSize: 11, fontWeight: 700, color: MUTED,
                    letterSpacing: '0.15em', textTransform: 'uppercase',
                    borderBottom: '2px solid #ffffff0a', minWidth: 200,
                  }}>Feature</th>
                  {headerCell('DealerOn', false)}
                  {headerCell('Dealer.com', false)}
                  {headerCell('DealerAI', false)}
                  {headerCell('LotPilot.ai ✦', true)}
                </tr>
              </thead>
              <tbody>
                {COMP_ROWS.map((row, i) => (
                  <tr key={row.feature} style={{
                    background: i % 2 === 0 ? 'rgba(255,255,255,0.015)' : 'transparent',
                    borderBottom: '1px solid #ffffff06',
                  }}>
                    <td style={{ padding: '13px 20px', fontSize: 13.5, color: '#c8c0a8', lineHeight: 1.4 }}>
                      {row.feature}
                    </td>
                    <td style={{ ...colStyle(false), padding: '13px 10px' }}><CompCell val={row.dealeron} /></td>
                    <td style={{ ...colStyle(false), padding: '13px 10px' }}><CompCell val={row.dealercom} /></td>
                    <td style={{ ...colStyle(false), padding: '13px 10px' }}><CompCell val={row.dealerai} /></td>
                    <td style={{ ...colStyle(true), padding: '13px 10px' }}><CompCell val={row.lotpilot} highlight /></td>
                  </tr>
                ))}
                {/* Price row */}
                <tr style={{ background: '#0e0c08', borderTop: `2px solid ${GOLD}22` }}>
                  <td style={{ padding: '16px 20px', fontSize: 13, fontWeight: 700, color: TEXT }}>Monthly price</td>
                  {[
                    { label: '$1,499/mo', gold: false },
                    { label: '$1,650/mo', gold: false },
                    { label: '$500/mo',   gold: false },
                    { label: `from $${getPlan('growth').monthlyPrice}/mo`, gold: true },
                  ].map(({ label, gold }) => (
                    <td key={label} style={{
                      ...colStyle(gold), padding: '16px 10px',
                      textAlign: 'center',
                    }}>
                      <span style={{
                        fontFamily: "var(--font-cormorant), serif",
                        fontSize: 18, fontWeight: 700,
                        color: gold ? GOLD : '#FF7070',
                      }}>{label}</span>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
            <div style={{
              padding: '10px 20px', background: '#0c0c0c',
              borderTop: '1px solid #ffffff06',
              display: 'flex', gap: 20, flexWrap: 'wrap',
            }}>
              <span style={{ fontSize: 12, color: '#4ADE80', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Check size={11} strokeWidth={3} color="#4ADE80" /> Included
              </span>
              <span style={{ fontSize: 12, color: '#FBBF24' }}>Add-on = extra cost</span>
              <span style={{ fontSize: 12, color: '#FF7070' }}>✕ = not available</span>
            </div>
          </div>
        </FadeSection>

        {/* B. Savings comparison bars */}
        <FadeSection delay={0.15}>
          <div style={{ marginBottom: 64 }}>
            <h3 style={{
              fontFamily: "var(--font-cormorant), serif",
              fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 700,
              color: TEXT, marginBottom: 36,
            }}>Total monthly software cost — head-to-head</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {SAVINGS_BARS.map((bar) => (
                <div key={bar.label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, alignItems: 'baseline', gap: 12 }}>
                    <span style={{ fontSize: 13.5, color: '#b8b0a0' }}>{bar.label}</span>
                    <span style={{
                      fontFamily: "var(--font-cormorant), serif",
                      fontSize: 22, fontWeight: 700, color: bar.color, flexShrink: 0,
                    }}>${bar.price.toLocaleString()}/mo</span>
                  </div>
                  <div style={{ height: 10, background: '#ffffff08', borderRadius: 100, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', width: `${bar.pct}%`,
                      background: bar.color === GOLD
                        ? `linear-gradient(90deg, ${GOLD}, ${GOLD2})`
                        : `linear-gradient(90deg, ${bar.color}cc, ${bar.color}66)`,
                      borderRadius: 100,
                      transition: 'width 1s ease',
                    }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Gold callout */}
            <div style={{
              marginTop: 40, padding: '24px 32px',
              background: `${GOLD}0c`, border: `1px solid ${GOLD}44`,
              borderRadius: 12,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              flexWrap: 'wrap', gap: 16,
            }}>
              <div>
                <div style={{
                  fontFamily: "var(--font-cormorant), serif",
                  fontSize: 'clamp(26px, 4vw, 38px)', fontWeight: 700, color: GOLD, lineHeight: 1.1,
                }}>Save $950–1,600/mo</div>
                <div style={{ fontSize: 15, color: '#c8c0a8', marginTop: 6 }}>
                  That&rsquo;s <strong style={{ color: TEXT }}>$11,400–19,200 per year</strong> switching to LotPilot.ai Professional
                </div>
              </div>
              <a href="#pricing-tiers" style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '13px 26px', background: GOLD, color: '#080808',
                fontWeight: 800, fontSize: 14, borderRadius: 6, textDecoration: 'none',
                whiteSpace: 'nowrap', transition: 'background 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.background = GOLD2}
                onMouseLeave={e => e.currentTarget.style.background = GOLD}
              >
                See pricing <ArrowRight size={15} />
              </a>
            </div>
          </div>
        </FadeSection>

        {/* C. Pricing tier cards */}
        <FadeSection delay={0.2}>
          <div id="pricing-tiers" style={{ scrollMarginTop: 80 }}>
            <h3 style={{
              fontFamily: "var(--font-cormorant), serif",
              fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 700,
              color: TEXT, marginBottom: 8,
            }}>Simple, all-inclusive pricing</h3>
            <p style={{ fontSize: 16, color: MUTED, marginBottom: 40, lineHeight: 1.6 }}>
              One monthly fee. No per-seat charges. No hidden add-ons.
            </p>
            <div
              className="tier-grid"
              style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 22 }}
            >
              {PRICING_TIERS.map((tier) => (
                <div
                  key={tier.name}
                  style={{
                    borderRadius: 16, padding: 32,
                    display: 'flex', flexDirection: 'column',
                    position: 'relative', overflow: 'hidden',
                    background: tier.featured ? '#0b0e08' : 'rgba(255,255,255,0.025)',
                    border: tier.featured ? `2px solid ${GOLD}` : '1px solid rgba(255,255,255,0.08)',
                    boxShadow: tier.featured ? `0 0 64px ${GOLD}18` : 'none',
                    transition: 'border-color 0.2s',
                  }}
                  onMouseEnter={e => { if (!tier.featured) e.currentTarget.style.borderColor = `${GOLD}33`; }}
                  onMouseLeave={e => { if (!tier.featured) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
                >
                  {tier.badge && (
                    <div style={{
                      position: 'absolute', top: 0, right: 0,
                      background: GOLD, color: '#080808',
                      fontSize: 10, fontWeight: 800, letterSpacing: '0.1em',
                      textTransform: 'uppercase', padding: '6px 16px',
                      borderRadius: '0 14px 0 10px',
                    }}>{tier.badge}</div>
                  )}

                  <div style={{ marginBottom: 24 }}>
                    <div style={{
                      fontSize: 11, fontWeight: 700, letterSpacing: '0.2em',
                      textTransform: 'uppercase',
                      color: tier.featured ? GOLD : MUTED,
                      marginBottom: 12,
                    }}>{tier.name}</div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 6 }}>
                      <span style={{
                        fontFamily: "var(--font-cormorant), serif",
                        fontSize: 48, fontWeight: 700,
                        color: tier.featured ? GOLD : TEXT, lineHeight: 1,
                      }}>${tier.price.toLocaleString()}</span>
                      <span style={{ fontSize: 15, color: MUTED }}>/mo</span>
                    </div>
                    <div style={{ fontSize: 12, color: MUTED }}>
                      ${tier.setup.toLocaleString()} one-time setup
                    </div>
                  </div>

                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 9, marginBottom: 28 }}>
                    {tier.features.map((f) => (
                      <div key={f.label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        {f.locked ? (
                          <Lock size={13} color="#4a4038" strokeWidth={2} />
                        ) : (
                          <div style={{
                            width: 18, height: 18, borderRadius: '50%', flexShrink: 0,
                            background: tier.featured ? `${GOLD}22` : 'rgba(74,222,128,0.15)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}>
                            <Check size={10} color={tier.featured ? GOLD : '#4ADE80'} strokeWidth={3} />
                          </div>
                        )}
                        <span style={{
                          fontSize: 13, lineHeight: 1.45,
                          color: f.locked ? '#4a4038' : '#c8c0a8',
                        }}>{f.label}</span>
                      </div>
                    ))}
                  </div>

                  <a href="mailto:david@aiandwebservices.com" style={{
                    display: 'block', textAlign: 'center',
                    padding: '13px 0',
                    background: tier.featured ? GOLD : 'transparent',
                    border: `1px solid ${tier.featured ? GOLD : GOLD + '44'}`,
                    color: tier.featured ? '#080808' : TEXT,
                    fontWeight: 700, fontSize: 14, borderRadius: 8,
                    textDecoration: 'none', transition: 'all 0.2s',
                    letterSpacing: '0.02em',
                  }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = tier.featured ? GOLD2 : `${GOLD}18`;
                      e.currentTarget.style.borderColor = GOLD;
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = tier.featured ? GOLD : 'transparent';
                      e.currentTarget.style.borderColor = tier.featured ? GOLD : `${GOLD}44`;
                    }}
                  >
                    Get started
                  </a>
                </div>
              ))}
            </div>
          </div>
        </FadeSection>
      </div>
    </section>
  );
}

/* ── AI features data ──────────────────────────────────────── */
const AI_FEATURES = [
  {
    key: 'agent',
    IconComp: MessageSquare,
    color: '#4A9EFF',
    title: '24/7 AI Sales Agent',
    subtitle: 'Never miss a lead again — even at 2am',
    desc: 'When a customer asks "Do you have any SUVs under $40K?" at 11pm, your AI agent responds in seconds with real vehicles from your inventory, accurate monthly payments, and books a test drive — all while your team sleeps. Handles chat on your website AND incoming text messages.',
    stats: ['<5 sec response', 'Knows entire inventory', 'Auto-captures leads'],
    demo: '/samples/example005',
    competitor: 'Replaces: BDC staff ($3,000–5,000/mo)',
  },
  {
    key: 'descriptions',
    IconComp: FileText,
    color: '#A78BFA',
    title: 'AI Vehicle Descriptions',
    subtitle: 'Professional listing copy in 2 seconds',
    desc: 'Stop writing "well-maintained, runs great" on every listing. Enter a VIN and the AI writes a compelling, unique description that makes buyers want to schedule a test drive. Bulk-generate descriptions for your entire lot in minutes.',
    stats: ['Unique copy per vehicle', '~$0.001 per description', 'Bulk generate for entire lot'],
    beforeAfter: true,
  },
  {
    key: 'scoring',
    IconComp: Target,
    color: '#4ADE80',
    title: 'AI Lead Scoring',
    subtitle: 'Know who to call first — every time',
    desc: 'Not every lead is equal. The AI analyzes what each customer did on your site — which vehicles they viewed, whether they used the payment calculator, if they started Build Your Deal — and scores them 0–100. Your hottest leads surface to the top automatically.',
    scoreboard: true,
    competitor: 'Replaces: VinSolutions ($300/mo)',
  },
  {
    key: 'pricing',
    IconComp: TrendingUp,
    color: '#FB923C',
    title: 'AI Pricing Intelligence',
    subtitle: 'Monitors days on lot, margin, and market position.',
    desc: "Set auto-pricing rules and let the AI manage aging inventory for you. When a vehicle hits 45+ days on lot or drifts above market, you get a specific, margin-aware recommendation — not a generic alert.",
    pricingRec: true,
    stats: ['Daily lot health score', 'Auto-price rules', 'Margin-aware recommendations'],
    competitor: 'Replaces: vAuto ($500/mo)',
  },
  {
    key: 'followup',
    IconComp: Mail,
    color: '#F472B6',
    title: 'AI Follow-Up Sequences',
    subtitle: 'Personalized messages — not templates',
    desc: 'When Maria inquires about the BMW X5, the AI writes a personalized 4-step follow-up sequence — not a generic template. Hour 4: warm confirmation. Hour 24: the vehicle is still available. Day 3: here are 2 similar options. Day 7: graceful close. Each message references her specific vehicle and sounds like your salesperson wrote it.',
    followupStages: true,
  },
  {
    key: 'reviews',
    IconComp: Star,
    color: '#D4AF37',
    title: 'AI Review Response',
    subtitle: 'Respond to every Google review in your voice',
    desc: 'Customer leaves a 5-star review? AI drafts a warm, personalized response in seconds. 3-star review? AI acknowledges the concern and offers to make it right. You approve with one tap. Dealers who respond to every review convert 88% more leads — now you can do it without spending 30 minutes a day.',
    stats: ['Auto-drafts responses', 'Matches your voice', 'One-tap approve'],
  },
];

function AiCard({ feat }) {
  const { IconComp, color, title, subtitle, desc, stats, competitor, demo, beforeAfter, scoreboard, pricingRec, followupStages } = feat;
  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.025)', border: `1px solid ${color}28`,
        borderRadius: 16, padding: 36, display: 'flex', flexDirection: 'column',
        transition: 'border-color 0.2s, background 0.2s', height: '100%',
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = `${color}55`; e.currentTarget.style.background = `${color}08`; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = `${color}28`; e.currentTarget.style.background = 'rgba(255,255,255,0.025)'; }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 20 }}>
        <div style={{
          width: 48, height: 48, borderRadius: 12, flexShrink: 0,
          background: `${color}18`, border: `1px solid ${color}33`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <IconComp size={22} color={color} />
        </div>
        <div>
          <h3 style={{
            fontFamily: "var(--font-cormorant), serif",
            fontSize: 26, fontWeight: 700, color: TEXT, lineHeight: 1.1, marginBottom: 5,
          }}>{title}</h3>
          <p style={{ fontSize: 13, color, fontWeight: 600, letterSpacing: '0.02em' }}>{subtitle}</p>
        </div>
      </div>

      <p style={{ fontSize: 14.5, color: '#b0a890', lineHeight: 1.72, marginBottom: 20 }}>{desc}</p>

      {stats && (
        <div style={{
          display: 'flex', marginBottom: 20,
          background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 10, overflow: 'hidden',
        }}>
          {stats.map((s, i) => (
            <div key={s} style={{
              flex: 1, padding: '12px 10px', textAlign: 'center',
              borderRight: i < stats.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
            }}>
              <span style={{ fontSize: 12, color: GOLD, fontWeight: 700, display: 'block', lineHeight: 1.45 }}>{s}</span>
            </div>
          ))}
        </div>
      )}

      {demo && (
        <div style={{ marginBottom: 16 }}>
          <a href={demo} style={{
            fontSize: 13, color, fontWeight: 700, textDecoration: 'none',
            display: 'inline-flex', alignItems: 'center', gap: 6,
            transition: 'opacity 0.2s',
          }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.75'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            Try it on the demo site <ArrowRight size={13} />
          </a>
        </div>
      )}

      {beforeAfter && (
        <div style={{ marginBottom: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ background: '#160808', border: '1px solid #FF444420', borderRadius: 8, padding: '14px 16px' }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#FF7070', marginBottom: 6 }}>Before</div>
            <p style={{ fontSize: 13, color: '#7a6860', lineHeight: 1.55 }}>2023 BMW X5. Well maintained. Low miles. Must see.</p>
          </div>
          <div style={{ background: '#071310', border: '1px solid #4ADE8020', borderRadius: 8, padding: '14px 16px' }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#4ADE80', marginBottom: 6 }}>After (AI Generated)</div>
            <p style={{ fontSize: 13, color: '#90b07a', lineHeight: 1.55 }}>One-owner 2023 BMW X5 with the M Sport package, panoramic roof, and just 28K highway miles. Finished in Alpine White over Black leather. Passed our 150-point inspection — this spec doesn&rsquo;t come up often.</p>
          </div>
        </div>
      )}

      {pricingRec && (
        <div style={{
          marginBottom: 16, background: '#0d0906',
          border: '1px solid #FB923C28', borderRadius: 10,
          overflow: 'hidden', fontFamily: 'monospace',
        }}>
          <div style={{
            padding: '8px 14px', borderBottom: '1px solid #FB923C18',
            background: '#FB923C0a',
            fontSize: 10, fontWeight: 700, letterSpacing: '0.12em',
            textTransform: 'uppercase', color: '#FB923C99',
          }}>AI RECOMMENDATION · 2021 LEXUS RX 350</div>
          <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {[
                ['52 days on lot', '#FF7070'],
                ['$3,800 above market', '#FBBF24'],
              ].map(([label, c]) => (
                <span key={label} style={{
                  fontSize: 11, fontWeight: 700, padding: '3px 10px',
                  borderRadius: 4, background: `${c}14`, border: `1px solid ${c}30`, color: c,
                }}>{label}</span>
              ))}
            </div>
            <div style={{ fontSize: 13, color: '#FB923C', lineHeight: 1.5 }}>
              → Drop to $29,995 — sell in 2 weeks at $4,195 gross
            </div>
          </div>
        </div>
      )}

      {scoreboard && (
        <div style={{
          marginBottom: 16, background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, overflow: 'hidden',
        }}>
          {[
            { emoji: '🔥', name: 'Maria R.', score: 92, detail: 'Completed Build Your Deal, pre-approved', scoreColor: '#FF5B5B' },
            { emoji: '🟡', name: 'James T.', score: 65, detail: 'Viewed 3 SUVs, used calculator', scoreColor: '#FBBF24' },
            { emoji: '⚪', name: 'Sarah K.', score: 35, detail: 'Browsed inventory, bounced quickly', scoreColor: '#6b7280' },
          ].map((l, i) => (
            <div key={l.name} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '13px 16px',
              borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.04)' : 'none',
            }}>
              <span style={{ fontSize: 16 }}>{l.emoji}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: TEXT }}>{l.name}</div>
                <div style={{ fontSize: 11.5, color: MUTED, marginTop: 2 }}>{l.detail}</div>
              </div>
              <div style={{
                fontFamily: "var(--font-cormorant), serif",
                fontSize: 22, fontWeight: 700, color: l.scoreColor, flexShrink: 0,
              }}>{l.score}<span style={{ fontSize: 12, color: MUTED }}>/100</span></div>
            </div>
          ))}
        </div>
      )}

      {followupStages && (
        <div style={{ marginBottom: 16, display: 'flex', flexDirection: 'column', gap: 7 }}>
          {[
            ['4h',    "Hi Maria, it's Carlos from Primo. Got your inquiry on the X5 — it's a great pick..."],
            ['24h',   'Quick update — the BMW X5 is still available. Happy to hold it with a deposit...'],
            ['Day 3', "Hey Maria, we just got a 2024 Audi Q5 that's similar to the X5 you liked..."],
            ['Day 7', "Maria, just wanted to follow up one last time. If timing isn't right, no worries..."],
          ].map(([stage, text]) => (
            <div key={stage} style={{
              background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 8, padding: '10px 14px', display: 'flex', gap: 12, alignItems: 'flex-start',
            }}>
              <span style={{
                fontSize: 10, fontWeight: 700, letterSpacing: '0.1em',
                textTransform: 'uppercase', color: '#F472B6',
                background: '#F472B614', border: '1px solid #F472B630',
                borderRadius: 4, padding: '3px 8px', flexShrink: 0, marginTop: 1,
              }}>{stage}</span>
              <span style={{ fontSize: 12.5, color: '#9a8878', lineHeight: 1.5 }}>{text}</span>
            </div>
          ))}
          <div style={{ fontSize: 12, color: GOLD, fontWeight: 700, marginTop: 4 }}>
            ~$0.004 per full sequence — pennies, not dollars
          </div>
        </div>
      )}

      {competitor && (
        <div style={{
          marginTop: 'auto', paddingTop: 16,
          borderTop: '1px solid rgba(255,255,255,0.06)',
          fontSize: 12.5, color: '#7a7060', fontStyle: 'italic', lineHeight: 1.55,
        }}>
          <span style={{ color: GOLD, fontWeight: 700, fontStyle: 'normal' }}>💰 </span>
          {competitor}
        </div>
      )}
    </div>
  );
}

function AiSavingsTable() {
  const rows = [
    ['DriveCentric AI Responder',         '$500/mo'],
    ['VinSolutions Lead Scoring',          '$300/mo'],
    ['vAuto Price Intelligence',           '$500/mo'],
    ['BDC Staff (replaced by AI Agent)',   '$3,000–5,000/mo'],
  ];
  return (
    <div style={{
      marginTop: 64, padding: '48px 40px',
      background: `${GOLD}06`, border: `1px solid ${GOLD}28`,
      borderRadius: 16, textAlign: 'center',
    }}>
      <h3 style={{
        fontFamily: "var(--font-cormorant), serif",
        fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 700,
        color: TEXT, marginBottom: 12,
      }}>6 AI Agents. Zero Extra Cost.</h3>
      <p style={{
        fontSize: 16, color: MUTED, lineHeight: 1.65,
        marginBottom: 40, maxWidth: 580, marginLeft: 'auto', marginRight: 'auto',
      }}>
        DriveCentric, VinSolutions, and vAuto charge $500–1,500/mo <em>each</em> for individual AI features.
        LotPilot.ai includes all 6 in every plan.
      </p>

      <div style={{ maxWidth: 660, margin: '0 auto' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr auto auto',
          gap: 16, padding: '8px 20px', marginBottom: 6,
          fontSize: 10, fontWeight: 700, letterSpacing: '0.18em',
          textTransform: 'uppercase', color: MUTED,
        }}>
          <span style={{ textAlign: 'left' }}>Competitor Feature</span>
          <span style={{ textAlign: 'right' }}>Their Price</span>
          <span style={{ textAlign: 'right' }}>LotPilot.ai</span>
        </div>

        {rows.map(([label, price], i) => (
          <div key={label} style={{
            display: 'grid', gridTemplateColumns: '1fr auto auto',
            gap: 16, padding: '13px 20px', alignItems: 'center',
            background: i % 2 === 0 ? 'rgba(255,255,255,0.025)' : 'transparent',
            borderRadius: 8,
          }}>
            <span style={{ fontSize: 14, color: '#c0b8a0', textAlign: 'left' }}>{label}</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#FF8080', textAlign: 'right', whiteSpace: 'nowrap' }}>{price}</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#4ADE80', textAlign: 'right', whiteSpace: 'nowrap' }}>✅ Included</span>
          </div>
        ))}

        <div style={{
          display: 'grid', gridTemplateColumns: '1fr auto auto',
          gap: 16, padding: '16px 20px', marginTop: 10,
          borderTop: `2px solid ${GOLD}30`, alignItems: 'center',
        }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: TEXT, textAlign: 'left' }}>Total savings</span>
          <span style={{
            fontFamily: "var(--font-cormorant), serif",
            fontSize: 22, fontWeight: 700, color: '#FF8080', textAlign: 'right', whiteSpace: 'nowrap',
          }}>$4,300–6,300/mo</span>
          <span style={{
            fontFamily: "var(--font-cormorant), serif",
            fontSize: 22, fontWeight: 700, color: GOLD, textAlign: 'right', whiteSpace: 'nowrap',
          }}>$0/mo</span>
        </div>
      </div>
    </div>
  );
}

/* ── Choose Your Plan: tier data + feature matrix ───────────── */

const PLAN_TIERS = [
  {
    key: 'growth',
    name: getPlan('growth').name,
    price: getPlan('growth').monthlyPrice,
    setup: getPlan('growth').setupFee,
    target: '5–30 vehicles, 1 location, getting started',
    featured: false,
    intro: null,
    features: [
      'Custom dealer website',
      'Admin panel + CRM',
      'VIN decoder + NHTSA data',
      'Photo management',
      'Dark / light mode',
      'AI chat agent (website)',
      'AI description writer',
      'AI review responder',
      'Service scheduling',
      '150-point inspection',
      'Google reviews',
      'CARFAX / AutoCheck badges',
      'PWA installable dashboard',
      'Email support',
      'Vehicle limit: 50',
    ],
    locked: [
      'AI SMS agent', 'AI lead scoring', 'AI price intelligence',
      'AI follow-up sequences', 'Auto-pricing rules',
      'Advanced desking', 'Stripe payments', 'Documents + forms',
      'Credit pre-qualification', 'Salesperson assignment',
      'Commission tracking', 'Recon pipeline', 'Listing syndication',
      'n8n automation', 'QuickBooks', 'Mobile photo app',
      'Push notifications', 'Owner dashboard mobile',
      'Priority phone support',
    ],
  },
  {
    key: 'professional',
    name: getPlan('professional').name,
    price: getPlan('professional').monthlyPrice,
    setup: getPlan('professional').setupFee,
    target: '20–100 vehicles, full AI power, serious growth',
    featured: true,
    badge: 'Most dealers pick this',
    intro: 'Everything in Growth plus:',
    features: [
      'AI SMS agent',
      'AI lead scoring',
      'AI price intelligence',
      'AI follow-up sequences',
      'Auto-pricing rules',
      'Advanced desking (profit matrix)',
      'Stripe deposits + payments',
      'Documents + forms',
      'Credit pre-qualification',
      'Salesperson assignment + round-robin',
      'Commission tracking',
      'Recon pipeline (Kanban)',
      'Listing syndication (Cars.com, AutoTrader, CarGurus, Facebook)',
      'n8n automation workflows',
      'QuickBooks integration',
      'Mobile photo capture app',
      'Push notifications',
      'Owner dashboard (mobile)',
      'Priority phone support',
      'Unlimited vehicles',
    ],
    locked: [],
  },
  {
    key: 'enterprise',
    name: getPlan('enterprise').name,
    price: getPlan('enterprise').monthlyPrice,
    setup: getPlan('enterprise').setupFee,
    target: 'Multi-location, custom work, white glove',
    featured: false,
    intro: 'Everything in Professional plus:',
    features: [
      'Lender submission (RouteOne / DealerTrack)',
      '700Credit bureau pulls',
      'Multi-location support',
      'Dedicated CRM instance',
      'Custom integrations + API access',
      'Dedicated account manager',
      'SLA guarantee',
      'Quarterly strategy review',
      'Custom AI training',
    ],
    locked: [],
  },
];

const MATRIX_GROUPS = [
  {
    label: 'Website + CRM',
    rows: [
      ['Custom dealer website',          'check', 'check', 'check'],
      ['Admin panel + CRM',              'check', 'check', 'check'],
      ['VIN decoder + NHTSA data',       'check', 'check', 'check'],
      ['Photo management',               'check', 'check', 'check'],
      ['Dark / light mode',              'check', 'check', 'check'],
      ['Vehicle inventory limit',        '50',    'Unlimited', 'Unlimited'],
    ],
  },
  {
    label: 'AI Features',
    rows: [
      ['AI chat agent (website)',        'check', 'check', 'check'],
      ['AI description writer',          'check', 'check', 'check'],
      ['AI review responder',            'check', 'check', 'check'],
      ['AI SMS agent',                   'pro',   'check', 'check'],
      ['AI lead scoring',                'pro',   'check', 'check'],
      ['AI price intelligence',          'pro',   'check', 'check'],
      ['AI follow-up sequences',         'pro',   'check', 'check'],
      ['Auto-pricing rules',             'pro',   'check', 'check'],
    ],
  },
  {
    label: 'Deal Flow + Payments',
    rows: [
      ['Basic deal builder',             'check', 'check', 'check'],
      ['Advanced desking (profit matrix)', 'pro', 'check', 'check'],
      ['Stripe deposits + payments',     'pro',   'check', 'check'],
      ['Documents + forms',              'pro',   'check', 'check'],
      ['Credit pre-qualification',       'pro',   'check', 'check'],
      ['Lender submission (RouteOne)',   'ent',   'ent',   'check'],
    ],
  },
  {
    label: 'Operations',
    rows: [
      ['Service scheduling',             'check', 'check', 'check'],
      ['Salesperson assignment',         'pro',   'check', 'check'],
      ['Commission tracking',            'pro',   'check', 'check'],
      ['Recon pipeline',                 'pro',   'check', 'check'],
      ['150-point inspection',           'check', 'check', 'check'],
      ['Listing syndication feeds',      'pro',   'check', 'check'],
      ['n8n automation workflows',       'pro',   'check', 'check'],
    ],
  },
  {
    label: 'Integrations',
    rows: [
      ['Google reviews',                 'check', 'check', 'check'],
      ['CARFAX / AutoCheck badges',      'check', 'check', 'check'],
      ['QuickBooks integration',         'pro',   'check', 'check'],
      ['700Credit bureau pulls',         'ent',   'ent',   'check'],
      ['Multi-location support',         'ent',   'ent',   'check'],
      ['Dedicated CRM instance',         'ent',   'ent',   'check'],
      ['Custom integrations + API',      'ent',   'ent',   'check'],
    ],
  },
  {
    label: 'Mobile + Apps',
    rows: [
      ['PWA installable dashboard',      'check', 'check', 'check'],
      ['Mobile photo capture app',       'pro',   'check', 'check'],
      ['Push notifications',             'pro',   'check', 'check'],
      ['Owner dashboard (mobile)',       'pro',   'check', 'check'],
    ],
  },
  {
    label: 'Support',
    rows: [
      ['Email support',                  'check', 'check', 'check'],
      ['Priority phone support',         'pro',   'check', 'check'],
      ['Dedicated account manager',      'ent',   'ent',   'check'],
      ['SLA guarantee',                  'ent',   'ent',   'check'],
    ],
  },
];

function MatrixCell({ val, highlight }) {
  if (val === 'check') {
    return (
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <span style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: 22, height: 22, borderRadius: '50%',
          background: highlight ? `${GOLD}22` : '#4ADE8020',
          border: `1px solid ${highlight ? `${GOLD}55` : '#4ADE8040'}`,
        }}>
          <Check size={12} color={highlight ? GOLD : '#4ADE80'} strokeWidth={3} />
        </span>
      </div>
    );
  }
  if (val === 'pro') {
    return (
      <div style={{ textAlign: 'center' }}>
        <span style={{
          fontSize: 10, fontWeight: 700, letterSpacing: '0.08em',
          color: '#6f6555', whiteSpace: 'nowrap',
        }}>Pro+</span>
      </div>
    );
  }
  if (val === 'ent') {
    return (
      <div style={{ textAlign: 'center' }}>
        <span style={{
          fontSize: 10, fontWeight: 700, letterSpacing: '0.08em',
          color: '#6f6555', whiteSpace: 'nowrap',
        }}>Ent</span>
      </div>
    );
  }
  // arbitrary string (e.g., "50", "Unlimited")
  return (
    <div style={{
      textAlign: 'center', fontSize: 12, fontWeight: 600,
      color: highlight ? GOLD : '#c8c0a8', whiteSpace: 'nowrap',
    }}>{val}</div>
  );
}

function ChooseYourPlanSection() {
  const tierColStyle = (isFeatured) => ({
    padding: '14px 12px', textAlign: 'center',
    fontSize: 12, fontWeight: 700, letterSpacing: '0.04em',
    color: isFeatured ? GOLD : MUTED,
    background: isFeatured ? `${GOLD}12` : 'transparent',
    borderBottom: `2px solid ${isFeatured ? `${GOLD}55` : '#ffffff0a'}`,
    whiteSpace: 'nowrap',
  });

  return (
    <section id="choose-your-plan" style={{
      padding: '96px 0',
      background: '#0a0a0a',
      borderBottom: `1px solid ${GOLD}18`,
      scrollMarginTop: 80,
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>

        {/* Header */}
        <FadeSection>
          <Label>Choose Your Plan</Label>
          <div style={{ marginBottom: 52 }}>
            <h2 style={{
              fontFamily: "var(--font-cormorant), serif",
              fontSize: 'clamp(36px, 5vw, 56px)',
              fontWeight: 700, lineHeight: 1.05, color: TEXT, marginBottom: 16,
            }}>Everything you need. One platform.</h2>
            <p style={{ fontSize: 18, color: MUTED, lineHeight: 1.65, maxWidth: 680 }}>
              Three plans, zero hidden fees. Every plan includes a custom dealer website,
              full admin panel, and core AI features.
            </p>
          </div>
        </FadeSection>

        {/* Tier cards */}
        <FadeSection delay={0.1}>
          <div className="tier-grid"
            style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 22, marginBottom: 64 }}>
            {PLAN_TIERS.map((tier) => (
              <div key={tier.key}
                style={{
                  borderRadius: 16, padding: 32,
                  display: 'flex', flexDirection: 'column',
                  position: 'relative', overflow: 'hidden',
                  background: tier.featured ? '#0b0e08' : 'rgba(255,255,255,0.025)',
                  border: tier.featured ? `2px solid ${GOLD}` : '1px solid rgba(255,255,255,0.08)',
                  boxShadow: tier.featured ? `0 0 64px ${GOLD}18` : 'none',
                }}>
                {tier.badge && (
                  <div style={{
                    position: 'absolute', top: 0, right: 0,
                    background: GOLD, color: '#080808',
                    fontSize: 10, fontWeight: 800, letterSpacing: '0.1em',
                    textTransform: 'uppercase', padding: '6px 14px',
                    borderRadius: '0 14px 0 10px',
                  }}>{tier.badge}</div>
                )}

                <div style={{ marginBottom: 18 }}>
                  <div style={{
                    fontSize: 11, fontWeight: 700, letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: tier.featured ? GOLD : MUTED, marginBottom: 12,
                  }}>{tier.name}</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 6 }}>
                    <span style={{
                      fontFamily: "var(--font-cormorant), serif",
                      fontSize: 48, fontWeight: 700,
                      color: tier.featured ? GOLD : TEXT, lineHeight: 1,
                    }}>${tier.price.toLocaleString()}</span>
                    <span style={{ fontSize: 15, color: MUTED }}>/mo</span>
                  </div>
                  <div style={{ fontSize: 12, color: MUTED, marginBottom: 14 }}>
                    ${tier.setup.toLocaleString()} one-time setup
                  </div>
                  <div style={{
                    fontSize: 12, color: '#a09680', fontStyle: 'italic',
                    lineHeight: 1.45, paddingBottom: 16,
                    borderBottom: `1px solid ${tier.featured ? `${GOLD}22` : '#ffffff0c'}`,
                  }}>{tier.target}</div>
                </div>

                {tier.intro && (
                  <div style={{
                    fontSize: 12, fontWeight: 700, color: tier.featured ? GOLD : '#a8a08c',
                    letterSpacing: '0.04em', marginBottom: 12, textTransform: 'uppercase',
                  }}>{tier.intro}</div>
                )}

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 22 }}>
                  {tier.features.map((label) => (
                    <div key={label} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                      <div style={{
                        width: 18, height: 18, borderRadius: '50%', flexShrink: 0, marginTop: 1,
                        background: tier.featured ? `${GOLD}22` : 'rgba(74,222,128,0.15)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <Check size={10} color={tier.featured ? GOLD : '#4ADE80'} strokeWidth={3} />
                      </div>
                      <span style={{ fontSize: 13, lineHeight: 1.45, color: '#c8c0a8' }}>{label}</span>
                    </div>
                  ))}
                  {tier.locked && tier.locked.length > 0 && (
                    <>
                      <div style={{
                        fontSize: 10, fontWeight: 700, color: '#5a5145',
                        letterSpacing: '0.1em', marginTop: 14, marginBottom: 4, textTransform: 'uppercase',
                      }}>Not included — upgrade to unlock</div>
                      {tier.locked.map((label) => (
                        <div key={label} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                          <Lock size={13} color="#4a4038" strokeWidth={2} style={{ marginTop: 2, flexShrink: 0 }} />
                          <span style={{ fontSize: 12, lineHeight: 1.45, color: '#5a5145' }}>{label}</span>
                          <span style={{
                            fontSize: 9, fontWeight: 700, letterSpacing: '0.08em',
                            color: '#6f6555', marginLeft: 'auto',
                          }}>Pro+</span>
                        </div>
                      ))}
                    </>
                  )}
                </div>

                <a href="#" style={{
                  display: 'block', textAlign: 'center',
                  padding: '13px 0',
                  background: tier.featured ? GOLD : 'transparent',
                  border: `1px solid ${tier.featured ? GOLD : `${GOLD}44`}`,
                  color: tier.featured ? '#080808' : TEXT,
                  fontWeight: 700, fontSize: 14, borderRadius: 8,
                  textDecoration: 'none', letterSpacing: '0.02em',
                }}>
                  {tier.featured ? 'Start with Professional' : `Choose ${tier.name}`}
                </a>
              </div>
            ))}
          </div>
        </FadeSection>

        {/* Feature matrix table */}
        <FadeSection delay={0.15}>
          <h3 style={{
            fontFamily: "var(--font-cormorant), serif",
            fontSize: 'clamp(24px, 3vw, 32px)', fontWeight: 700,
            color: TEXT, marginBottom: 8,
          }}>Compare every feature, side by side</h3>
          <p style={{ fontSize: 14, color: MUTED, marginBottom: 28, lineHeight: 1.6 }}>
            <span style={{ color: '#4ADE80', fontWeight: 700 }}>✓</span> = included ·
            <span style={{ color: '#6f6555', fontWeight: 700, marginLeft: 6 }}>Pro+</span> = Professional or Enterprise ·
            <span style={{ color: '#6f6555', fontWeight: 700, marginLeft: 6 }}>Ent</span> = Enterprise only
          </p>
          <div className="comp-table-scroll" style={{
            border: '1px solid #ffffff0a', borderRadius: 12, overflow: 'hidden',
            background: '#0d0d0d',
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 640 }}>
              <thead>
                <tr>
                  <th style={{
                    padding: '14px 16px', textAlign: 'left',
                    fontSize: 12, fontWeight: 700, color: MUTED,
                    borderBottom: '2px solid #ffffff0a',
                    letterSpacing: '0.04em',
                  }}>Feature</th>
                  <th style={tierColStyle(false)}>{getPlan('growth').name}<br /><span style={{ fontSize: 10, color: MUTED, fontWeight: 600 }}>${getPlan('growth').monthlyPrice}/mo</span></th>
                  <th style={tierColStyle(true)}>{getPlan('professional').name}<br /><span style={{ fontSize: 10, color: GOLD, fontWeight: 600 }}>${getPlan('professional').monthlyPrice}/mo · most popular</span></th>
                  <th style={tierColStyle(false)}>{getPlan('enterprise').name}<br /><span style={{ fontSize: 10, color: MUTED, fontWeight: 600 }}>${getPlan('enterprise').monthlyPrice}/mo</span></th>
                </tr>
              </thead>
              <tbody>
                {MATRIX_GROUPS.map((group) => (
                  <Fragment key={group.label}>
                    <tr>
                      <td colSpan={4} style={{
                        padding: '14px 16px 8px',
                        background: '#000000',
                        fontSize: 10, fontWeight: 800, letterSpacing: '0.18em',
                        textTransform: 'uppercase', color: GOLD,
                        borderTop: `1px solid ${GOLD}22`,
                        borderBottom: `1px solid ${GOLD}22`,
                      }}>{group.label}</td>
                    </tr>
                    {group.rows.map(([feature, g, p, e], idx) => (
                      <tr key={feature}
                        style={{
                          background: idx % 2 === 1 ? '#ffffff03' : 'transparent',
                        }}>
                        <td style={{
                          padding: '12px 16px', fontSize: 13, color: '#c8c0a8',
                          borderBottom: '1px solid #ffffff05',
                        }}>{feature}</td>
                        <td style={{
                          padding: '12px 8px', borderBottom: '1px solid #ffffff05',
                        }}><MatrixCell val={g} /></td>
                        <td style={{
                          padding: '12px 8px', borderBottom: '1px solid #ffffff05',
                          background: `${GOLD}08`,
                        }}><MatrixCell val={p} highlight /></td>
                        <td style={{
                          padding: '12px 8px', borderBottom: '1px solid #ffffff05',
                        }}><MatrixCell val={e} /></td>
                      </tr>
                    ))}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </FadeSection>

        {/* Callouts */}
        <FadeSection delay={0.2}>
          <div className="tier-grid"
            style={{
              display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 18, marginTop: 56,
            }}>
            <div style={{
              padding: 26, borderRadius: 14,
              background: `linear-gradient(135deg, ${GOLD}10 0%, transparent 70%)`,
              border: `1px solid ${GOLD}33`,
            }}>
              <div style={{
                fontSize: 11, fontWeight: 700, letterSpacing: '0.18em',
                textTransform: 'uppercase', color: GOLD, marginBottom: 12,
              }}>Not sure which plan?</div>
              <p style={{ fontSize: 14, color: '#c8c0a8', lineHeight: 1.6, marginBottom: 18 }}>
                Start with Growth — upgrade anytime with zero downtime. Your data,
                settings, and AI configurations carry over automatically.
              </p>
              <a href="#" style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '11px 20px',
                background: GOLD, color: '#080808',
                fontSize: 13, fontWeight: 700, borderRadius: 8,
                textDecoration: 'none', letterSpacing: '0.02em',
              }}>
                Schedule a Demo <ArrowRight size={14} strokeWidth={2.5} />
              </a>
            </div>

            <div style={{
              padding: 26, borderRadius: 14,
              background: 'rgba(255,255,255,0.025)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}>
              <div style={{
                fontSize: 11, fontWeight: 700, letterSpacing: '0.18em',
                textTransform: 'uppercase', color: '#a8a08c', marginBottom: 12,
              }}>Already have a website?</div>
              <p style={{ fontSize: 14, color: '#c8c0a8', lineHeight: 1.6, marginBottom: 14 }}>
                LotPilot.ai can plug into your existing dealer website. Add our AI
                chat agent, CRM, and admin panel without replacing your current site.
              </p>
              <p style={{ fontSize: 13, color: GOLD, fontWeight: 700 }}>
                Ask us about our Overlay plan →
              </p>
            </div>
          </div>
        </FadeSection>

      </div>
    </section>
  );
}

/* ── AI Showcase Section ──────────────────────────────────── */
function AiShowcaseSection() {
  return (
    <section style={{
      padding: '96px 0',
      background: 'linear-gradient(180deg, #0d0d0d 0%, #111111 100%)',
      borderBottom: `1px solid ${GOLD}18`,
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>

        {/* Header */}
        <FadeSection>
          <div style={{
            display: 'inline-block', padding: '5px 16px',
            border: `1px solid ${GOLD}44`, borderRadius: 100,
            fontSize: 11, fontWeight: 700, letterSpacing: '0.18em',
            textTransform: 'uppercase', color: GOLD, marginBottom: 20,
          }}>AI-Powered</div>
          <div style={{ marginBottom: 52 }}>
            <h2 style={{
              fontFamily: "var(--font-cormorant), serif",
              fontSize: 'clamp(36px, 5vw, 56px)',
              fontWeight: 700, lineHeight: 1.05, color: TEXT, marginBottom: 16,
            }}>6 AI Agents. Zero Extra Cost.</h2>
            <p style={{ fontSize: 18, color: MUTED, lineHeight: 1.65, maxWidth: 620 }}>
              Your competitors charge{' '}
              <span style={{ color: '#FF8080', fontWeight: 700 }}>$500+/mo for ONE AI feature.</span>{' '}
              <span style={{ color: GOLD, fontWeight: 700 }}>LotPilot.ai</span> includes all six.
            </p>
          </div>
        </FadeSection>

        {/* 2×3 grid */}
        <div
          className="ai-showcase-grid"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))', gap: 28 }}
        >
          {AI_FEATURES.map((feat, i) => (
            <FadeSection key={feat.key} delay={i * 0.07}>
              <AiCard feat={feat} />
            </FadeSection>
          ))}
        </div>

        {/* Summary bar */}
        <FadeSection delay={0.4}>
          <div style={{
            marginTop: 52, padding: '20px 28px',
            background: '#0a0908', border: `1px solid ${GOLD}22`,
            borderRadius: 12,
            display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
            justifyContent: 'center',
          }}>
            {[
              { label: 'DriveCentric AI', price: '$500/mo' },
              { label: 'VinSolutions',    price: '$300/mo' },
              { label: 'vAuto',           price: '$500/mo' },
              { label: 'BDC staff',       price: '$3,000–5,000/mo' },
            ].map((item, i, arr) => (
              <span key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', justifyContent: 'center' }}>
                <span style={{ fontSize: 13, color: MUTED }}>{item.label}:</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#FF8080' }}>{item.price}</span>
                {i < arr.length - 1 && <span style={{ color: '#3a3028', marginLeft: 4, marginRight: 4 }}>|</span>}
              </span>
            ))}
            <span style={{ color: '#3a3028', margin: '0 8px' }}>→</span>
            <span style={{ fontSize: 14, fontWeight: 800, color: GOLD }}>All included with LotPilot.ai</span>
          </div>
        </FadeSection>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   Page
═══════════════════════════════════════════════════════════ */
export default function PrimoFeaturesPage() {
  const [activeGroup, setActiveGroup] = useState('inventory');

  return (
    <div className={`${cormorant.variable} ${dmSans.variable}`} style={{ background: BG, minHeight: '100vh', overflowX: 'hidden', fontFamily: "var(--font-dm-sans), sans-serif", color: TEXT }}>
      <FontStyles />

      {/* ─── HERO ──────────────────────────────────────────── */}
      <section style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        justifyContent: 'center', position: 'relative', overflow: 'hidden', padding: '80px 0',
      }}>
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: `linear-gradient(${GOLD}09 1px, transparent 1px), linear-gradient(90deg, ${GOLD}09 1px, transparent 1px)`,
          backgroundSize: '64px 64px',
        }} />
        <div style={{
          position: 'absolute', top: '35%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 900, height: 900, pointerEvents: 'none',
          background: `radial-gradient(circle, ${GOLD}16 0%, transparent 68%)`,
        }} />

        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
          <FadeSection>
            <div style={{
              display: 'inline-block', padding: '6px 18px',
              border: `1px solid ${GOLD}44`, borderRadius: 100,
              fontSize: 11, fontWeight: 700, letterSpacing: '0.18em',
              textTransform: 'uppercase', color: GOLD, marginBottom: 36,
            }}>
              LotPilot.ai — AI-Powered Dealer Platform · from ${getPlan('growth').monthlyPrice}/mo
            </div>
          </FadeSection>

          <FadeSection delay={0.1}>
            <h1 style={{
              fontFamily: "var(--font-cormorant), serif",
              fontSize: 'clamp(54px, 9vw, 100px)',
              fontWeight: 700, lineHeight: 0.97, color: TEXT,
              marginBottom: 36, maxWidth: 820,
            }}>
              Stop paying{' '}
              <span style={{ color: GOLD }}>$1,800/mo</span>
              {' '}for&nbsp;less
            </h1>
          </FadeSection>

          <FadeSection delay={0.2}>
            <p style={{ fontSize: 19, color: MUTED, lineHeight: 1.65, maxWidth: 560, marginBottom: 52 }}>
              LotPilot.ai gives independent car dealers a complete digital platform — custom website, dealer admin panel, CRM, 6 AI agents, and automation — at a price that finally makes sense.
            </p>
          </FadeSection>

          <FadeSection delay={0.3}>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center' }}>
              <a href="/samples/primo-admin"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 10,
                  padding: '15px 30px', background: GOLD, color: '#080808',
                  fontWeight: 700, fontSize: 15, borderRadius: 6, textDecoration: 'none',
                  letterSpacing: '0.03em', transition: 'background 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = GOLD2}
                onMouseLeave={e => e.currentTarget.style.background = GOLD}
              >
                See Live Admin Demo <ArrowRight size={16} />
              </a>
              <a href="#features"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 10,
                  padding: '15px 30px', border: `1px solid ${GOLD}44`, color: TEXT,
                  fontWeight: 500, fontSize: 15, borderRadius: 6, textDecoration: 'none',
                  background: 'transparent', transition: 'border-color 0.2s, color 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = GOLD; e.currentTarget.style.color = GOLD; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = `${GOLD}44`; e.currentTarget.style.color = TEXT; }}
              >
                View All Features <ChevronDown size={16} />
              </a>
            </div>
          </FadeSection>

          <FadeSection delay={0.45}>
            <div style={{
              display: 'flex', gap: 48, marginTop: 76, paddingTop: 52,
              borderTop: `1px solid ${GOLD}20`, flexWrap: 'wrap',
            }}>
              {[
                { val: `from $${getPlan('growth').monthlyPrice}`, label: 'per month' },
                { val: '6',         label: 'AI agents included' },
                { val: '5–7',       label: 'days to go live' },
                { val: '90+',       label: 'PageSpeed score' },
              ].map(s => (
                <div key={s.val}>
                  <div style={{
                    fontFamily: "var(--font-cormorant), serif",
                    fontSize: 46, fontWeight: 700, color: GOLD, lineHeight: 1, marginBottom: 6,
                  }}>{s.val}</div>
                  <div style={{ fontSize: 13, color: MUTED, fontWeight: 500 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </FadeSection>
        </div>
      </section>

      {/* ─── COST COMPARISON ──────────────────────────────── */}
      <SectionWrap id="pricing" bg={BG2}>
        <FadeSection>
          <Label>The Real Cost of Doing Nothing</Label>
          <Heading sub="Most independent dealers spend $1,499–$2,800/month on software that does less — and still need AI features on top of that.">
            What are you actually paying for?
          </Heading>
        </FadeSection>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
          {/* Traditional */}
          <FadeSection delay={0.1}>
            <div style={{
              background: '#180a0a', border: '1px solid #FF444428',
              borderRadius: 12, padding: 32,
            }}>
              <p style={{
                fontSize: 11, fontWeight: 700, letterSpacing: '0.2em',
                textTransform: 'uppercase', color: '#FF7070', marginBottom: 24,
              }}>Typical Independent Dealer Setup</p>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {[
                  ['DMS / Inventory Software',    '$499–$799/mo'],
                  ['Dealership Website',           '$300–$600/mo'],
                  ['Lead Management CRM',          '$299–$500/mo'],
                  ['Reputation Management',        '$199–$300/mo'],
                  ['AutoTrader / Cars.com listings','$300–$800/mo'],
                ].map(([item, price]) => (
                  <div key={item} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '13px 0', borderBottom: '1px solid #ffffff08',
                  }}>
                    <span style={{ fontSize: 14, color: '#b8a898' }}>{item}</span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: '#FF8080' }}>{price}</span>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: 20, marginTop: 8 }}>
                  <span style={{ fontSize: 16, fontWeight: 700 }}>Total</span>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{
                      fontFamily: "var(--font-cormorant), serif",
                      fontSize: 32, fontWeight: 700, color: '#FF7070',
                    }}>$1,597–$3,000</span>
                    <span style={{ fontSize: 14, color: '#FF7070' }}>/mo</span>
                  </div>
                </div>
              </div>
            </div>
          </FadeSection>

          {/* LotPilot.ai */}
          <FadeSection delay={0.2}>
            <div style={{
              background: '#080f07', border: `1px solid ${GOLD}55`,
              borderRadius: 12, padding: 32, position: 'relative', overflow: 'hidden',
              boxShadow: `0 0 48px ${GOLD}18, 0 0 96px ${GOLD}0a`,
            }}>
              <div style={{
                position: 'absolute', top: 0, right: 0,
                background: GOLD, color: '#080808',
                fontSize: 10, fontWeight: 800, letterSpacing: '0.12em',
                textTransform: 'uppercase', padding: '6px 16px',
                borderRadius: '0 12px 0 12px',
              }}>Best Value</div>

              <p style={{
                fontSize: 11, fontWeight: 700, letterSpacing: '0.2em',
                textTransform: 'uppercase', color: GOLD, marginBottom: 24,
              }}>LotPilot.ai — Everything Included</p>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {[
                  'Custom dealership website',
                  'Full dealer admin panel + CRM',
                  'Lead management + F&I tracking',
                  'Reputation management',
                  '6 AI agents (chat, scoring, pricing…)',
                  'SMS + automation workflows',
                  'Service appointment scheduling',
                  'Reservation / deposit system',
                ].map(item => (
                  <div key={item} style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '11px 0', borderBottom: '1px solid #ffffff08',
                  }}>
                    <div style={{
                      width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                      background: `${GOLD}22`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Check size={11} color={GOLD} strokeWidth={3} />
                    </div>
                    <span style={{ fontSize: 14, color: '#ccc4a8' }}>{item}</span>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: 20, marginTop: 8 }}>
                  <span style={{ fontSize: 16, fontWeight: 700 }}>All-In Total</span>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{
                      fontFamily: "var(--font-cormorant), serif",
                      fontSize: 44, fontWeight: 700, color: GOLD, lineHeight: 1,
                    }}>from ${getPlan('growth').monthlyPrice}<span style={{ fontSize: 18, fontWeight: 500 }}>/mo</span></div>
                    <div style={{ fontSize: 12, color: '#4ADE80', fontWeight: 700, marginTop: 5 }}>
                      Save $11,400–$19,200 per year
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </FadeSection>
        </div>
      </SectionWrap>

      {/* ─── AI FEATURES (detailed) ──────────────────────── */}
      <section id="ai-features" style={{
        padding: '96px 0',
        background: 'linear-gradient(180deg, #0a0a0a 0%, #111111 100%)',
        borderTop: `1px solid ${GOLD}18`,
        borderBottom: `1px solid ${GOLD}18`,
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>
          <FadeSection>
            <Label>6 AI Agents Included</Label>
            <div style={{ marginBottom: 52 }}>
              <h2 style={{
                fontFamily: "var(--font-cormorant), serif",
                fontSize: 'clamp(36px, 5vw, 58px)',
                fontWeight: 700, lineHeight: 1.05, color: TEXT, marginBottom: 18,
              }}>🤖 AI Built Into Every Feature</h2>
              <p style={{ fontSize: 18, color: MUTED, lineHeight: 1.65, maxWidth: 640 }}>
                Your competitors are paying $500+/mo for basic automation.{' '}
                <span style={{ color: GOLD, fontWeight: 700 }}>LotPilot.ai</span> includes{' '}
                <span style={{ color: GOLD, fontWeight: 700 }}>6 AI agents</span> at no extra cost.
              </p>
            </div>
          </FadeSection>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))',
            gap: 28,
          }}>
            {AI_FEATURES.map((feat, i) => (
              <FadeSection key={feat.key} delay={i * 0.07}>
                <AiCard feat={feat} />
              </FadeSection>
            ))}
          </div>

          <FadeSection delay={0.35}>
            <AiSavingsTable />
          </FadeSection>
        </div>
      </section>

      {/* ─── COMPETITIVE COMPARISON (Section 1) ──────────── */}
      <CompetitiveSection />

      {/* ─── CHOOSE YOUR PLAN (Section 1.5) ──────────────── */}
      <ChooseYourPlanSection />

      {/* ─── AI SHOWCASE (Section 2) ─────────────────────── */}
      <AiShowcaseSection />

      {/* ─── FEATURE GRID ─────────────────────────────────── */}
      <SectionWrap id="features">
        <FadeSection>
          <Label>40+ Features</Label>
          <Heading sub="Everything your dealership needs — built into one platform, not bolted together from five vendors.">
            The complete platform
          </Heading>
        </FadeSection>

        <FadeSection delay={0.1}>
          <div style={{
            display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 36,
            padding: 4, background: '#ffffff06', borderRadius: 10, border: '1px solid #ffffff0a',
          }}>
            {FEATURE_GROUPS.map(g => {
              const Icon = g.icon;
              const on = activeGroup === g.key;
              return (
                <button key={g.key} onClick={() => setActiveGroup(g.key)} style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '10px 18px', borderRadius: 8, cursor: 'pointer',
                  fontSize: 13, fontWeight: 600,
                  fontFamily: "var(--font-dm-sans), sans-serif",
                  transition: 'all 0.2s',
                  background: on ? `${g.color}22` : 'transparent',
                  color: on ? g.color : MUTED,
                  border: `1px solid ${on ? g.color + '44' : 'transparent'}`,
                }}>
                  <Icon size={14} />
                  {g.label}
                </button>
              );
            })}
          </div>
        </FadeSection>

        {FEATURE_GROUPS.filter(g => g.key === activeGroup).map(g => (
          <div key={g.key} style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 14,
          }}>
            {g.features.map((feat, i) => (
              <FadeSection key={feat} delay={i * 0.04}>
                <div style={{
                  display: 'flex', alignItems: 'flex-start', gap: 14,
                  padding: '18px 20px',
                  background: PANEL, border: `1px solid ${g.color}22`,
                  borderRadius: 10, transition: 'border-color 0.2s, background 0.2s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = `${g.color}55`; e.currentTarget.style.background = `${g.color}0a`; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = `${g.color}22`; e.currentTarget.style.background = PANEL; }}
                >
                  <div style={{
                    width: 22, height: 22, borderRadius: 6, flexShrink: 0,
                    background: `${g.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 1,
                  }}>
                    <Check size={11} color={g.color} strokeWidth={3} />
                  </div>
                  <span style={{ fontSize: 14, color: '#ccc4a8', lineHeight: 1.55 }}>{feat}</span>
                </div>
              </FadeSection>
            ))}
          </div>
        ))}

        <FadeSection delay={0.25}>
          <div style={{
            marginTop: 36, padding: '18px 24px',
            background: `${GOLD}0a`, border: `1px solid ${GOLD}22`,
            borderRadius: 10, display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', flexWrap: 'wrap', gap: 14,
          }}>
            <span style={{ fontSize: 14, color: MUTED }}>
              Showing 10 of 40+ features · Select a category above to explore more
            </span>
            <a href="/samples/primo-admin" style={{
              fontSize: 13, fontWeight: 700, color: GOLD, textDecoration: 'none',
              display: 'inline-flex', alignItems: 'center', gap: 7,
            }}>
              Try the live admin demo <ArrowRight size={14} />
            </a>
          </div>
        </FadeSection>
      </SectionWrap>

      {/* ─── TESTIMONIALS ─────────────────────────────────── */}
      <SectionWrap id="testimonials" bg={BG2}>
        <FadeSection>
          <Label>What Dealers Are Saying</Label>
          <Heading>Real dealers. Real results.</Heading>
        </FadeSection>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 22 }}>
          {TESTIMONIALS.map((t, i) => (
            <FadeSection key={t.name} delay={i * 0.12}>
              <div style={{
                padding: 32, background: PANEL, border: `1px solid ${GOLD}22`,
                borderRadius: 12, height: '100%', display: 'flex', flexDirection: 'column',
                transition: 'border-color 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor = `${GOLD}55`}
                onMouseLeave={e => e.currentTarget.style.borderColor = `${GOLD}22`}
              >
                <Stars />
                <p style={{
                  fontSize: 15, color: '#c0b8a0', lineHeight: 1.75,
                  fontStyle: 'italic', flex: 1, marginBottom: 24,
                }}>
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15, color: TEXT }}>{t.name}</div>
                  <div style={{ fontSize: 12, color: MUTED, marginTop: 3 }}>{t.title} · {t.dealership}</div>
                </div>
              </div>
            </FadeSection>
          ))}
        </div>
      </SectionWrap>

      {/* ─── HOW IT WORKS ─────────────────────────────────── */}
      <SectionWrap id="how-it-works">
        <FadeSection>
          <Label>Simple Onboarding</Label>
          <Heading sub="We handle the heavy lifting. You're live and closing deals in under a week.">
            How it works
          </Heading>
        </FadeSection>

        <div>
          {STEPS.map((step, i) => (
            <FadeSection key={step.num} delay={i * 0.15}>
              <div style={{
                display: 'grid', gridTemplateColumns: '120px 1fr', gap: 32,
                padding: '44px 0',
                borderBottom: i < STEPS.length - 1 ? '1px solid #ffffff0a' : 'none',
                alignItems: 'start',
              }}>
                <div style={{
                  fontFamily: "var(--font-cormorant), serif",
                  fontSize: 76, fontWeight: 700, color: `${GOLD}30`,
                  lineHeight: 1, userSelect: 'none',
                }}>{step.num}</div>
                <div>
                  <h3 style={{
                    fontFamily: "var(--font-cormorant), serif",
                    fontSize: 28, fontWeight: 700, color: TEXT,
                    marginBottom: 12, lineHeight: 1.2,
                  }}>{step.title}</h3>
                  <p style={{ fontSize: 15, color: MUTED, lineHeight: 1.7, maxWidth: 580 }}>{step.desc}</p>
                </div>
              </div>
            </FadeSection>
          ))}
        </div>
      </SectionWrap>

      {/* ─── CTA ──────────────────────────────────────────── */}
      <section style={{
        padding: '120px 0',
        background: `linear-gradient(150deg, ${BG2} 0%, #0e0b04 50%, ${BG2} 100%)`,
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 700, height: 700, pointerEvents: 'none',
          background: `radial-gradient(circle, ${GOLD}15 0%, transparent 68%)`,
        }} />
        <div style={{ maxWidth: 680, margin: '0 auto', padding: '0 24px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <FadeSection>
            <Label>Ready to modernize?</Label>
            <h2 style={{
              fontFamily: "var(--font-cormorant), serif",
              fontSize: 'clamp(40px, 6vw, 68px)',
              fontWeight: 700, lineHeight: 1.08, color: TEXT, marginBottom: 24,
            }}>
              Let&rsquo;s build your dealership&rsquo;s digital edge
            </h2>
            <p style={{ fontSize: 17, color: MUTED, lineHeight: 1.65, marginBottom: 52 }}>
              Talk to David about getting your dealership website and admin panel live in under a week. No long-term contracts. Cancel anytime.
            </p>
          </FadeSection>

          <FadeSection delay={0.15}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center' }}>
                <a href="tel:3155720710" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 10,
                  padding: '16px 32px', background: GOLD,
                  color: '#080808', fontWeight: 800, fontSize: 16,
                  borderRadius: 6, textDecoration: 'none', letterSpacing: '0.02em',
                  transition: 'background 0.2s',
                }}
                  onMouseEnter={e => e.currentTarget.style.background = GOLD2}
                  onMouseLeave={e => e.currentTarget.style.background = GOLD}
                >
                  <Phone size={18} />
                  (315) 572-0710
                </a>
                <a href="mailto:david@aiandwebservices.com" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 10,
                  padding: '16px 32px', border: `1px solid ${GOLD}55`,
                  color: TEXT, fontWeight: 500, fontSize: 15,
                  borderRadius: 6, textDecoration: 'none', background: 'transparent',
                  transition: 'border-color 0.2s',
                }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = GOLD}
                  onMouseLeave={e => e.currentTarget.style.borderColor = `${GOLD}55`}
                >
                  <Mail size={16} />
                  david@aiandwebservices.com
                </a>
              </div>

              <div style={{ display: 'flex', gap: 28, marginTop: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
                {[
                  { href: '/samples/primo-admin', icon: LayoutDashboard, label: 'View Admin Panel Demo' },
                  { href: '/samples/example005', icon: Globe, label: 'See Sample Website' },
                ].map(({ href, icon: Icon, label }) => (
                  <a key={href} href={href} style={{
                    fontSize: 13, color: MUTED, textDecoration: 'none',
                    display: 'inline-flex', alignItems: 'center', gap: 7,
                    transition: 'color 0.2s',
                  }}
                    onMouseEnter={e => e.currentTarget.style.color = GOLD}
                    onMouseLeave={e => e.currentTarget.style.color = MUTED}
                  >
                    <Icon size={14} /> {label}
                  </a>
                ))}
              </div>
            </div>
          </FadeSection>
        </div>
      </section>

      {/* ─── FOOTER ───────────────────────────────────────── */}
      <footer style={{ padding: '28px 24px', borderTop: `1px solid ${GOLD}14`, textAlign: 'center' }}>
        <p style={{ fontSize: 13, color: MUTED }}>
          Powered by AIandWEBservices &nbsp;·&nbsp;
          <a href="tel:3155720710" style={{ color: MUTED, textDecoration: 'none' }}>(315) 572-0710</a>
          &nbsp;·&nbsp;
          <a href="mailto:david@aiandwebservices.com" style={{ color: MUTED, textDecoration: 'none' }}>david@aiandwebservices.com</a>
        </p>
      </footer>

      {/* ─── FLOATING CTA ─────────────────────────────────── */}
      <a href="/samples/primo-features"
        style={{
          position: 'fixed', bottom: 32, right: 32, zIndex: 50,
          display: 'inline-flex', alignItems: 'center', gap: 10,
          padding: '13px 22px', background: GOLD, color: '#080808',
          fontWeight: 800, fontSize: 13, borderRadius: 100,
          textDecoration: 'none', whiteSpace: 'nowrap',
          letterSpacing: '0.02em',
          boxShadow: `0 8px 32px ${GOLD}44`,
          transition: 'transform 0.2s, box-shadow 0.2s',
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = `0 12px 40px ${GOLD}66`; }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = `0 8px 32px ${GOLD}44`; }}
      >
        <LayoutDashboard size={15} />
        View Admin Demo
      </a>
    </div>
  );
}
