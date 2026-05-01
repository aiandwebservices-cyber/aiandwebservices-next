'use client';
import { useState, useEffect, useRef } from 'react';
import { PLANS, FEATURE_LABELS, OVERLAY_DISCOUNT } from '@/lib/dealer-platform/config/pricing.js';

const TEAL = '#2AA5A0';
const CAL_URL = 'https://cal.com/david-aiandweb/lotpilot-demo';

// ── Scroll-fade hook ──────────────────────────────────────────────────────────
function useFadeIn(threshold = 0.15) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('is-visible'); obs.unobserve(el); } },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return ref;
}

// ── Tiny sub-components ───────────────────────────────────────────────────────
function Check() { return <span className="lp-check">✓</span>; }
function Cross() { return <span className="lp-cross">✕</span>; }

function BrowserMockup() {
  return (
    <div className="lp-browser">
      <div className="lp-browser-bar">
        <div className="lp-browser-dot" style={{ background: '#ef4444' }} />
        <div className="lp-browser-dot" style={{ background: '#f59e0b' }} />
        <div className="lp-browser-dot" style={{ background: '#22c55e' }} />
        <div className="lp-browser-url">app.lotpilot.ai/dealers/primo/admin</div>
      </div>
      <div className="lp-browser-content">
        {/* Simulated admin panel UI */}
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 8 }}>
          <div style={{ width: 120, height: 32, background: 'rgba(42,165,160,0.15)', borderRadius: 8, border: '1px solid rgba(42,165,160,0.3)' }} />
          <div style={{ flex: 1, height: 32, background: 'rgba(255,255,255,0.04)', borderRadius: 8 }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 8 }}>
          {[['24', 'New Leads'], ['$187K', 'Pipeline'], ['3.2s', 'AI Response'], ['94%', 'Replied']].map(([val, label]) => (
            <div key={label} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '12px 10px', textAlign: 'center' }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: TEAL }}>{val}</div>
              <div style={{ fontSize: 11, color: '#71717a', marginTop: 2 }}>{label}</div>
            </div>
          ))}
        </div>
        <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: 14, flex: 1 }}>
          {[
            { name: 'Carlos M.', time: '2m ago', status: '🔥 Hot', vehicle: '2023 Camry XSE' },
            { name: 'Jennifer R.', time: '14m ago', status: '⚡ Warm', vehicle: '2022 CR-V Sport' },
            { name: 'Mike D.', time: '1h ago', status: '📋 New', vehicle: '2021 F-150 XLT' },
          ].map((lead) => (
            <div key={lead.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: 12 }}>
              <span style={{ fontWeight: 600 }}>{lead.name}</span>
              <span style={{ color: '#71717a' }}>{lead.vehicle}</span>
              <span>{lead.status}</span>
              <span style={{ color: '#52525b' }}>{lead.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Pain points data ──────────────────────────────────────────────────────────
const PAIN_POINTS = [
  {
    icon: '💸',
    pain: 'You\'re paying $2,800/mo across 5 different tools that barely talk to each other.',
    fix: 'LotPilot replaces all of them. One bill, one login, zero integration headaches.',
  },
  {
    icon: '⏰',
    pain: 'Leads come in at 9pm and nobody follows up until morning — by then they bought from the dealer down the street.',
    fix: 'Your AI agent responds in 3 seconds, 24/7. Every lead, every time.',
  },
  {
    icon: '😬',
    pain: 'Your website looks like it was built in 2015 and you\'re embarrassed to send customers there.',
    fix: 'We build you a conversion-focused dealer site in 24 hours.',
  },
  {
    icon: '🤯',
    pain: 'You spend more time fighting software than selling cars.',
    fix: 'LotPilot runs in the background. Your job is closing deals, not IT support.',
  },
];

// ── Product showcase data ─────────────────────────────────────────────────────
const SHOWCASE_TABS = [
  {
    label: 'AI Sales Agent',
    headline: 'Never lose a lead to timing again.',
    bullets: [
      'Knows every vehicle, price, and payment option in your inventory',
      'Responds to customer questions in under 3 seconds, 24/7',
      'Automatically captures contact info and fires a lead into your CRM',
    ],
    stat: '~$0.02/conversation',
  },
  {
    label: 'Smart CRM',
    headline: 'Every lead organized, scored, and prioritized for you.',
    bullets: [
      'Auto-syncs leads from your website, chat, and phone calls',
      'AI Lead Scorer ranks every lead by purchase intent — call the hot ones first',
      'Built-in follow-up reminders so nothing slips through',
    ],
    stat: '~100% follow-up rate',
  },
  {
    label: 'Dealer Website',
    headline: 'A website that actually converts visitors into buyers.',
    bullets: [
      'Mobile-first, fast-loading inventory grid with live search and filters',
      'Trade-in estimator, payment calculator, service scheduling — built in',
      'Real-time inventory sync — new vehicles show up the moment you add them',
    ],
    stat: 'Live in 24 hours',
  },
  {
    label: 'Automation',
    headline: 'Set it once, let it run forever.',
    bullets: [
      '4-stage personalized follow-up sequences — not templates, truly personalized',
      'Automatic review requests after every completed sale or service',
      'Inventory alerts emailed to prospects when matching vehicles arrive',
    ],
    stat: 'n8n-powered workflows',
  },
  {
    label: 'Analytics',
    headline: 'See exactly what\'s working and what isn\'t.',
    bullets: [
      'Lead source breakdown: website, chat, referral, ad, phone',
      'Conversion rate tracking from first touch to closed deal',
      'AI cost dashboard — see exactly what each agent is spending',
    ],
    stat: 'Real-time data',
  },
  {
    label: 'Inventory',
    headline: 'Your inventory, everywhere, always accurate.',
    bullets: [
      'AI writes compelling descriptions for every vehicle in seconds',
      'One-click syndication to AutoTrader, Cars.com, CarGurus, Facebook',
      'Price optimization recommendations based on days-on-lot and market comps',
    ],
    stat: '1-click syndication',
  },
];

// ── AI agents data ────────────────────────────────────────────────────────────
const AI_AGENTS = [
  {
    emoji: '💬',
    name: 'AI Sales Agent',
    desc: 'Answers every customer question with real inventory knowledge. Knows every vehicle, price, and payment option.',
    stat: '~$0.02/conversation',
  },
  {
    emoji: '✍️',
    name: 'AI Description Writer',
    desc: 'Generates compelling listing descriptions in seconds, not hours. Consistent, professional, every time.',
    stat: '~$0.001/vehicle',
  },
  {
    emoji: '🎯',
    name: 'AI Lead Scorer',
    desc: 'Instantly ranks leads by purchase intent using behavioral signals. Call the hot ones first.',
    stat: 'Free — pure math',
  },
  {
    emoji: '📈',
    name: 'AI Price Optimizer',
    desc: 'Analyzes days-on-lot, market comps, and margin to recommend the right price change at the right time.',
    stat: 'Free — pure math',
  },
  {
    emoji: '📧',
    name: 'AI Follow-Up Writer',
    desc: '4-stage personalized follow-up sequences for every lead. Not templates — truly personalized to each customer.',
    stat: '~$0.004/sequence',
  },
  {
    emoji: '⭐',
    name: 'AI Review Responder',
    desc: 'Drafts professional Google review responses in your dealership\'s voice. Positive, negative, every review.',
    stat: '~$0.001/response',
  },
];

// ── Competitor comparison data ────────────────────────────────────────────────
const COMPETITORS = [
  { name: 'DealerOn (Website)', price: 1499 },
  { name: 'DealerAI (Chatbot)', price: 500 },
  { name: 'vAuto (Pricing)', price: 500 },
  { name: 'VinSolutions (CRM)', price: 300 },
];
const COMPETITOR_TOTAL = COMPETITORS.reduce((s, c) => s + c.price, 0);

// ── FAQ data ──────────────────────────────────────────────────────────────────
const FAQS = [
  {
    q: 'Can I keep my existing website?',
    a: 'Yes. LotPilot offers an Overlay Mode that adds AI chat, CRM, and automation to your existing website — at $200/mo less than the full plan. You get the AI agents and CRM without a website rebuild.',
  },
  {
    q: 'How long does setup take?',
    a: 'We build your full platform within 24 hours of onboarding. We import your inventory from your current DMS or CSV, configure your branding, and have you live — typically by the next business day.',
  },
  {
    q: 'What if I want to cancel?',
    a: 'No long-term contracts. LotPilot is month-to-month. Cancel anytime with 30 days notice. We\'ll send you a full data export before your last billing cycle.',
  },
  {
    q: 'Do I own my data?',
    a: 'Absolutely. Your leads, your inventory, your customer data — all yours. You can export everything at any time in CSV format. We never sell or share your data.',
  },
  {
    q: 'What happens to my leads if I switch platforms?',
    a: 'You keep everything. Before we turn anything off, you receive a complete export of all your leads, deals, notes, and customer records.',
  },
  {
    q: 'Is there a contract?',
    a: 'No annual contracts. Month-to-month only. The setup fee covers the build work — after that, you pay monthly and can cancel anytime.',
  },
];

// ── Plan feature list for display ─────────────────────────────────────────────
const PLAN_KEY_FEATURES = [
  'website',
  'adminPanel',
  'aiChat',
  'aiDescriptions',
  'aiLeadScorer',
  'aiPriceOptimizer',
  'aiFollowUp',
  'smsAgent',
  'syndication',
  'automation',
  'multiLocation',
  'prioritySupport',
];

// ─────────────────────────────────────────────────────────────────────────────
export default function LotPilotPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [openFaq, setOpenFaq] = useState(null);

  const painRef = useFadeIn();
  const showcaseRef = useFadeIn();
  const agentsRef = useFadeIn();
  const compareRef = useFadeIn();
  const pricingRef = useFadeIn();
  const stepsRef = useFadeIn();
  const socialRef = useFadeIn();
  const ctaRef = useFadeIn();

  return (
    <>
      {/* ── Nav ──────────────────────────────────────────── */}
      <nav className="lp-nav">
        <a href="#hero" className="lp-nav-logo">LotPilot.ai</a>
        <ul className="lp-nav-links">
          <li><a href="#features">Features</a></li>
          <li><a href="#pricing">Pricing</a></li>
          <li><a href="#how-it-works">How It Works</a></li>
        </ul>
        <a href={CAL_URL} target="_blank" rel="noopener noreferrer" className="lp-btn-primary" style={{ padding: '9px 18px', fontSize: 13 }}>
          Book a Demo
        </a>
      </nav>

      {/* ── SECTION 1: HERO ──────────────────────────────── */}
      <section id="hero" className="lp-hero">
        <div className="lp-hero-bg" />
        <div className="lp-hero-content">
          <div style={{ display: 'inline-block', background: 'rgba(42,165,160,0.12)', border: '1px solid rgba(42,165,160,0.3)', borderRadius: 20, padding: '6px 16px', fontSize: 13, color: TEAL, fontWeight: 600, marginBottom: 24 }}>
            🚀 6 AI Agents · Full Website · Complete CRM
          </div>
          <h1 className="lp-hero-title">
            Your Dealership<br />
            <span className="lp-teal">on Autopilot</span>
          </h1>
          <p className="lp-hero-sub">
            6 AI agents. Full website. Complete CRM. One platform that replaces $2,800/mo in dealer tools — starting at $699/mo.
          </p>
          <div className="lp-hero-ctas">
            <a href="/dealers/primo?demo=true" className="lp-btn-primary">
              ▶ See Live Demo
            </a>
            <a href={CAL_URL} target="_blank" rel="noopener noreferrer" className="lp-btn-outline">
              📅 Book a Call
            </a>
          </div>
          <div className="lp-trust">
            <span>No credit card required</span>
            <span className="lp-trust-dot">Setup in 24 hours</span>
            <span className="lp-trust-dot">Cancel anytime</span>
          </div>
        </div>
      </section>

      <div className="lp-divider" />

      {/* ── SECTION 2: PAIN POINTS ───────────────────────── */}
      <section id="pain" style={{ padding: '96px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div ref={painRef} className="lp-fade" style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 className="lp-section-title">Sound familiar?</h2>
            <p className="lp-muted" style={{ fontSize: 18 }}>If any of these keep you up at night, you're not alone.</p>
          </div>
          <div className="lp-grid-4">
            {PAIN_POINTS.map((p, i) => (
              <div key={i} className="lp-glass lp-pain-card" style={{ transitionDelay: `${i * 80}ms` }}>
                <div className="lp-pain-icon">{p.icon}</div>
                <p className="lp-pain-text">&ldquo;{p.pain}&rdquo;</p>
                <p className="lp-pain-fix">✓ {p.fix}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="lp-divider" />

      {/* ── SECTION 3: PRODUCT SHOWCASE ──────────────────── */}
      <section id="features" style={{ padding: '96px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div ref={showcaseRef} className="lp-fade" style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 className="lp-section-title">Everything you need.<br />Nothing you don&apos;t.</h2>
            <p className="lp-muted" style={{ fontSize: 18, maxWidth: 560, margin: '16px auto 0' }}>
              One platform. Every tool your dealership needs to compete in the modern market.
            </p>
          </div>
          <div className="lp-grid-2">
            <BrowserMockup />
            <div>
              <div className="lp-tabs">
                {SHOWCASE_TABS.map((tab, i) => (
                  <button key={i} className={`lp-tab${activeTab === i ? ' active' : ''}`} onClick={() => setActiveTab(i)}>
                    {tab.label}
                  </button>
                ))}
              </div>
              <div style={{ padding: '4px 0' }}>
                <h3 style={{ fontSize: 22, fontWeight: 800, marginBottom: 14, lineHeight: 1.3 }}>
                  {SHOWCASE_TABS[activeTab].headline}
                </h3>
                <ul style={{ listStyle: 'none', marginBottom: 24 }}>
                  {SHOWCASE_TABS[activeTab].bullets.map((b, i) => (
                    <li key={i} style={{ display: 'flex', gap: 10, marginBottom: 12, fontSize: 14, color: '#d4d4d8', lineHeight: 1.6 }}>
                      <span style={{ color: TEAL, flexShrink: 0, marginTop: 2 }}>✓</span>
                      {b}
                    </li>
                  ))}
                </ul>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(42,165,160,0.1)', border: '1px solid rgba(42,165,160,0.25)', borderRadius: 8, padding: '8px 14px', fontSize: 13, color: TEAL, fontWeight: 600 }}>
                  <span>⚡</span>
                  {SHOWCASE_TABS[activeTab].stat}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="lp-divider" />

      {/* ── SECTION 4: AI SHOWCASE ───────────────────────── */}
      <section id="ai-agents" style={{ padding: '96px 24px', background: 'rgba(0,0,0,0.3)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div ref={agentsRef} className="lp-fade" style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 className="lp-section-title">6 AI Agents Working<br />While You Sleep</h2>
            <p className="lp-muted" style={{ fontSize: 18, maxWidth: 560, margin: '16px auto 0' }}>
              Each agent is purpose-built for auto dealers. Together they handle what would cost $30,000+/year in staff.
            </p>
          </div>
          <div className="lp-agent-grid">
            {AI_AGENTS.map((agent, i) => (
              <div key={i} className="lp-glass lp-agent-card">
                <div className="lp-agent-emoji">{agent.emoji}</div>
                <div className="lp-agent-name">{agent.name}</div>
                <p className="lp-agent-desc">{agent.desc}</p>
                <span className="lp-agent-stat">{agent.stat}</span>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 48, padding: '24px 28px', background: 'rgba(42,165,160,0.06)', border: '1px solid rgba(42,165,160,0.2)', borderRadius: 14, maxWidth: 640, margin: '48px auto 0' }}>
            <p style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>Total AI cost per dealer: <span className="lp-teal">~$20–30/month</span></p>
            <p className="lp-muted" style={{ fontSize: 14 }}>That&apos;s less than one newspaper ad — and it runs 24 hours a day.</p>
          </div>
        </div>
      </section>

      <div className="lp-divider" />

      {/* ── SECTION 5: COST COMPARISON ───────────────────── */}
      <section id="compare" style={{ padding: '96px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div ref={compareRef} className="lp-fade" style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 className="lp-section-title">Stop Overpaying for<br />Underpowered Tools</h2>
            <p className="lp-muted" style={{ fontSize: 18, maxWidth: 560, margin: '16px auto 0' }}>
              Most dealers are stitching together 4–5 products that were never built to work together.
            </p>
          </div>
          <div className="lp-compare-grid">
            {/* Before */}
            <div className="lp-compare-card" style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 16 }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#f87171', marginBottom: 20, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                ⚠ What most dealers pay today
              </p>
              {COMPETITORS.map((c) => (
                <div key={c.name} className="lp-compare-item">
                  <span className="lp-muted">{c.name}</span>
                  <span style={{ fontWeight: 600 }}>${c.price.toLocaleString()}/mo</span>
                </div>
              ))}
              <div className="lp-compare-total">
                <span>Total</span>
                <span style={{ color: '#f87171' }}>${COMPETITOR_TOTAL.toLocaleString()}/mo</span>
              </div>
              <p style={{ fontSize: 12, color: '#52525b', marginTop: 12 }}>Plus setup fees, support contracts, and integration headaches.</p>
            </div>
            {/* LotPilot */}
            <div className="lp-compare-card" style={{ background: 'rgba(42,165,160,0.07)', border: '2px solid rgba(42,165,160,0.4)', borderRadius: 16 }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: TEAL, marginBottom: 20, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                ✓ LotPilot Professional — replaces all of it
              </p>
              {[
                'Dealer Website (built & hosted)',
                'AI Sales Agent (24/7 chat)',
                'CRM + Lead Management',
                'AI Descriptions + Price Optimizer',
                'AI Follow-Up + Review Responder',
                'Listing Syndication',
              ].map((item) => (
                <div key={item} className="lp-compare-item" style={{ color: '#d4d4d8' }}>
                  <span style={{ display: 'flex', gap: 8 }}><span className="lp-teal">✓</span>{item}</span>
                  <span style={{ color: '#71717a', fontSize: 12 }}>included</span>
                </div>
              ))}
              <div className="lp-compare-total">
                <span>Total</span>
                <span className="lp-teal">${PLANS.professional.monthlyPrice.toLocaleString()}/mo</span>
              </div>
              <div style={{ marginTop: 16, padding: '12px 16px', background: 'rgba(42,165,160,0.12)', borderRadius: 10, textAlign: 'center' }}>
                <p style={{ fontSize: 15, fontWeight: 800 }}>
                  Save <span className="lp-teal">${(COMPETITOR_TOTAL - PLANS.professional.monthlyPrice).toLocaleString()}/mo</span>
                </p>
                <p style={{ fontSize: 12, color: '#a1a1aa', marginTop: 4 }}>
                  That&apos;s ${((COMPETITOR_TOTAL - PLANS.professional.monthlyPrice) * 12).toLocaleString()}/year back in your pocket
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="lp-divider" />

      {/* ── SECTION 6: PRICING ───────────────────────────── */}
      <section id="pricing" style={{ padding: '96px 24px', background: 'rgba(0,0,0,0.3)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div ref={pricingRef} className="lp-fade" style={{ textAlign: 'center', marginBottom: 64 }}>
            <h2 className="lp-section-title">Simple, Honest Pricing</h2>
            <p className="lp-muted" style={{ fontSize: 18, maxWidth: 500, margin: '16px auto 0' }}>
              No hidden fees. No per-lead charges. No gotchas.
            </p>
          </div>
          <div className="lp-pricing-grid">
            {[
              { planId: 'growth', cta: 'Start Free Trial', ctaHref: CAL_URL },
              { planId: 'professional', cta: 'Get Started', ctaHref: CAL_URL, popular: true },
              { planId: 'enterprise', cta: 'Contact Us', ctaHref: 'mailto:david@aiandwebservices.com' },
            ].map(({ planId, cta, ctaHref, popular }) => {
              const plan = PLANS[planId];
              return (
                <div key={planId} className={`lp-glass lp-plan-card${popular ? ' popular' : ''}`}>
                  {popular && <div className="lp-popular-badge">Most Popular</div>}
                  <p style={{ fontSize: 13, fontWeight: 700, color: TEAL, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {plan.name}
                  </p>
                  <p style={{ fontSize: 13, color: '#71717a', marginBottom: 16 }}>{plan.tagline}</p>
                  <div className="lp-plan-price">
                    ${plan.monthlyPrice.toLocaleString()}<span>/mo</span>
                  </div>
                  <p className="lp-plan-setup">
                    +${plan.setupFee.toLocaleString()} one-time setup ·{' '}
                    {plan.vehicleLimit === -1 ? 'Unlimited vehicles' : `Up to ${plan.vehicleLimit} vehicles`}
                  </p>
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 20, marginBottom: 24 }}>
                    {PLAN_KEY_FEATURES.map((key) => {
                      const available = plan.features[key];
                      return (
                        <div key={key} className="lp-plan-feature">
                          {available ? <Check /> : <Cross />}
                          <span style={{ color: available ? '#d4d4d8' : '#52525b' }}>{FEATURE_LABELS[key]}</span>
                        </div>
                      );
                    })}
                  </div>
                  <a
                    href={ctaHref}
                    target={ctaHref.startsWith('http') ? '_blank' : undefined}
                    rel={ctaHref.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className={popular ? 'lp-btn-primary' : 'lp-btn-outline'}
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    {cta}
                  </a>
                </div>
              );
            })}
          </div>

          {/* Overlay callout */}
          <div className="lp-overlay-callout">
            <span style={{ fontSize: 24 }}>🌐</span>
            <div>
              <p style={{ fontWeight: 700, marginBottom: 4 }}>Already have a website you love?</p>
              <p style={{ fontSize: 14, color: '#a1a1aa', lineHeight: 1.6 }}>
                Add LotPilot AI Chat, CRM, and automation to your existing site with <strong style={{ color: '#d4d4d8' }}>Overlay Mode</strong> — same AI agents, same CRM, $200/mo less. No website rebuild required.
              </p>
            </div>
          </div>

          {/* FAQ */}
          <div className="lp-faq">
            <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8, textAlign: 'center' }}>Frequently Asked Questions</h3>
            {FAQS.map((faq, i) => (
              <div key={i} className="lp-faq-item">
                <button className="lp-faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  {faq.q}
                  <svg className={`lp-faq-chevron${openFaq === i ? ' open' : ''}`} width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <div className={`lp-faq-a${openFaq === i ? ' open' : ''}`}>{faq.a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="lp-divider" />

      {/* ── SECTION 7: HOW IT WORKS ───────────────────────── */}
      <section id="how-it-works" style={{ padding: '96px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div ref={stepsRef} className="lp-fade" style={{ marginBottom: 56 }}>
            <h2 className="lp-section-title">Up and Running in 24 Hours</h2>
            <p className="lp-muted" style={{ fontSize: 18, maxWidth: 500, margin: '16px auto 0' }}>
              No technical setup. No months of onboarding. Three steps and you&apos;re live.
            </p>
          </div>
          <div className="lp-steps">
            {[
              {
                num: '1',
                icon: '📅',
                title: 'Book a 15-min call',
                desc: 'We\'ll learn about your dealership, show you a live demo, and confirm it\'s the right fit.',
              },
              {
                num: '2',
                icon: '⚡',
                title: 'We build your platform in 24 hours',
                desc: 'We import your inventory, configure your branding, set up your AI agents, and push it live.',
              },
              {
                num: '3',
                icon: '🤖',
                title: 'AI starts working immediately',
                desc: 'Leads answered in seconds. Descriptions written. Follow-ups going out. You just sell.',
              },
            ].map((step, i) => (
              <div key={i} className="lp-glass lp-step">
                <div className="lp-step-num">{step.num}</div>
                <div style={{ fontSize: 28, marginBottom: 12 }}>{step.icon}</div>
                <div className="lp-step-title">{step.title}</div>
                <p className="lp-step-desc">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="lp-divider" />

      {/* ── SECTION 8: SOCIAL PROOF (waitlist) ───────────── */}
      <section ref={socialRef} className="lp-waitlist lp-fade">
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>🚀</div>
          <h2 style={{ fontSize: clampTitle(), fontWeight: 800, marginBottom: 12 }}>
            Join Dealers Already on the Waitlist
          </h2>
          <p className="lp-muted" style={{ fontSize: 16, marginBottom: 32, lineHeight: 1.6 }}>
            LotPilot is currently rolling out to independent dealers in Florida. Book a call to get access — setup slots are limited.
          </p>
          <div style={{ display: 'flex', gap: 32, justifyContent: 'center', marginBottom: 32 }}>
            {[['12+', 'Dealers on waitlist'], ['24h', 'Average setup time'], ['$0', 'Extra per lead']].map(([val, label]) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 32, fontWeight: 800, color: TEAL }}>{val}</div>
                <div style={{ fontSize: 12, color: '#71717a', marginTop: 4 }}>{label}</div>
              </div>
            ))}
          </div>
          <a href={CAL_URL} target="_blank" rel="noopener noreferrer" className="lp-btn-primary" style={{ justifyContent: 'center' }}>
            Reserve Your Spot
          </a>
        </div>
      </section>

      {/* ── SECTION 9: FINAL CTA ──────────────────────────── */}
      <section ref={ctaRef} className="lp-cta-section lp-fade">
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <h2 className="lp-section-title" style={{ marginBottom: 20 }}>
            Ready to put your<br /><span className="lp-teal">dealership on autopilot?</span>
          </h2>
          <p className="lp-muted" style={{ fontSize: 18, marginBottom: 40 }}>
            Book a 15-minute call. We&apos;ll show you a live demo built for a dealership just like yours.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 32 }}>
            <a href="/dealers/primo?demo=true" className="lp-btn-primary">
              ▶ See Live Demo
            </a>
            <a href={CAL_URL} target="_blank" rel="noopener noreferrer" className="lp-btn-outline">
              📅 Book a Call
            </a>
          </div>
          <p style={{ fontSize: 14, color: '#52525b' }}>
            Questions?{' '}
            <a href="mailto:david@aiandwebservices.com" style={{ color: '#71717a', textDecoration: 'underline' }}>
              david@aiandwebservices.com
            </a>
            {' '}· 315-572-0710
          </p>
        </div>
      </section>

      {/* ── SECTION 10: FOOTER ───────────────────────────── */}
      <footer className="lp-footer">
        <div className="lp-footer-inner">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
            <a href="#hero" style={{ fontSize: 20, fontWeight: 800, color: TEAL, textDecoration: 'none' }}>LotPilot.ai</a>
            <ul className="lp-footer-links">
              <li><a href="/dealers/primo?demo=true">Demo</a></li>
              <li><a href="#pricing">Pricing</a></li>
              <li><a href="#features">Features</a></li>
              <li><a href="mailto:david@aiandwebservices.com">Contact</a></li>
              <li><a href="/privacy">Privacy Policy</a></li>
              <li><a href="/terms">Terms of Service</a></li>
            </ul>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
            <p className="lp-footer-copy">© 2026 LotPilot.ai. All rights reserved.</p>
            <p className="lp-footer-copy">
              A product by{' '}
              <a href="https://www.aiandwebservices.com" style={{ color: '#71717a', textDecoration: 'underline' }} target="_blank" rel="noopener noreferrer">
                AIandWEBservices
              </a>
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}

// CSS clamp helper (client-safe)
function clampTitle() {
  return 'clamp(24px, 4vw, 36px)';
}
