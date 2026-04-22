'use client';
import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import {
  motion, useInView, useScroll, useTransform,
  AnimatePresence, useReducedMotion,
} from 'framer-motion';
import {
  Check, X, ChevronDown, ArrowRight, Zap,
  Globe, Search, Bot, BarChart3, Mail, FileText, Target,
  GitBranch, Database, TrendingUp, Phone, Share2, LayoutDashboard,
  Map, Wrench, Users, MessageSquare, Wallet, ShoppingCart, Eye,
  Network, Calendar,
} from 'lucide-react';

/* ─── Icon map ─────────────────────────────────────────────────────────── */
const ICONS = {
  Globe, Search, Bot, BarChart3, Mail, FileText, Target,
  GitBranch, Database, TrendingUp, Phone, Share2, LayoutDashboard,
  Map, Tool: Wrench, Users, MessageSquare, Wallet, ShoppingCart, Eye,
  Network, Calendar, Zap, Wrench,
};

/* ─── Theme tokens ──────────────────────────────────────────────────────── */
export function getTheme(mode) {
  if (mode === 'light') return {
    pageBg:      '#f8fafc',
    sectionAlt:  '#ffffff',
    sectionB:    '#f1f5f9',
    cardBg:      'rgba(255,255,255,0.9)',
    cardBorder:  'rgba(0,0,0,0.07)',
    cardShadow:  '0 2px 16px rgba(0,0,0,0.06)',
    heading:     '#111827',
    body:        '#374151',
    muted:       '#6b7280',
    accent:      '#2AA5A0',
    accentBg:    'rgba(42,165,160,0.08)',
    accentBorder:'rgba(42,165,160,0.2)',
    eyebrow:     '#2AA5A0',
    stripBg:     'rgba(42,165,160,0.06)',
    stripBorder: 'rgba(42,165,160,0.15)',
    problemCard: 'rgba(255,255,255,0.8)',
    problemBorder:'rgba(0,0,0,0.06)',
    faqBg:       'rgba(255,255,255,0.9)',
    faqBorder:   'rgba(0,0,0,0.07)',
    faqOpenBg:   'rgba(42,165,160,0.05)',
    cmpHeader:   'rgba(42,165,160,0.08)',
    cmpRow:      'rgba(0,0,0,0.015)',
    cmpTotal:    'rgba(42,165,160,0.06)',
    ctaBg:       'linear-gradient(135deg,#f0fdfc 0%,#e6fffe 100%)',
    navBg:       '#f8fafc',
    navBorder:   'rgba(0,0,0,0.06)',
    orb1:        'rgba(42,165,160,0.12)',
    orb2:        'rgba(42,165,160,0.06)',
    heroBg:      'linear-gradient(135deg,#f0fdfc 0%,#f8fafc 60%,#e6f7f6 100%)',
    heroText:    '#111827',
    heroSub:     '#4b5563',
    heroMeta:    '#9ca3af',
    gridLine:    'rgba(42,165,160,0.04)',
    timelineLine:'#2AA5A0',
    timelineDot: '#ffffff',
    pricingBg:   'linear-gradient(135deg,rgba(42,165,160,0.1) 0%,rgba(255,255,255,0.8) 100%)',
    pricingBorder:'rgba(42,165,160,0.25)',
    badge1Bg:    'rgba(0,0,0,0.04)',
    badge1Border:'rgba(0,0,0,0.08)',
    badge2Bg:    'rgba(42,165,160,0.12)',
    badge2Border:'rgba(42,165,160,0.3)',
    badge1Text:  '#374151',
    badge2Text:  '#2AA5A0',
    checkBg:     'rgba(42,165,160,0.12)',
    gradText:    'linear-gradient(135deg,#1B8F8A,#2AA5A0)',
    tagBg:       'rgba(42,165,160,0.1)',
    tagBorder:   'rgba(42,165,160,0.3)',
    tagText:     '#2AA5A0',
  };
  // dark
  return {
    pageBg:      '#080d18',
    sectionAlt:  '#111827',
    sectionB:    '#0d1117',
    cardBg:      'rgba(255,255,255,0.025)',
    cardBorder:  'rgba(255,255,255,0.07)',
    cardShadow:  'none',
    heading:     '#ffffff',
    body:        'rgba(255,255,255,0.6)',
    muted:       'rgba(255,255,255,0.35)',
    accent:      '#2AA5A0',
    accentBg:    'rgba(42,165,160,0.1)',
    accentBorder:'rgba(42,165,160,0.2)',
    eyebrow:     '#2AA5A0',
    stripBg:     'rgba(42,165,160,0.07)',
    stripBorder: 'rgba(42,165,160,0.15)',
    problemCard: 'rgba(255,255,255,0.025)',
    problemBorder:'rgba(255,255,255,0.07)',
    faqBg:       'rgba(255,255,255,0.02)',
    faqBorder:   'rgba(255,255,255,0.07)',
    faqOpenBg:   'rgba(42,165,160,0.06)',
    cmpHeader:   'rgba(42,165,160,0.15)',
    cmpRow:      'rgba(255,255,255,0.015)',
    cmpTotal:    'rgba(42,165,160,0.08)',
    ctaBg:       'linear-gradient(135deg,#080d18 0%,#111827 50%,#080d18 100%)',
    navBg:       '#080d18',
    navBorder:   'rgba(255,255,255,0.05)',
    orb1:        'rgba(42,165,160,0.18)',
    orb2:        'rgba(42,165,160,0.07)',
    heroBg:      '#080d18',
    heroText:    '#ffffff',
    heroSub:     'rgba(255,255,255,0.6)',
    heroMeta:    'rgba(255,255,255,0.35)',
    gridLine:    'rgba(42,165,160,0.03)',
    timelineLine:'#2AA5A0',
    timelineDot: '#111827',
    pricingBg:   'linear-gradient(135deg,rgba(42,165,160,0.13) 0%,rgba(27,42,74,0.6) 100%)',
    pricingBorder:'rgba(42,165,160,0.3)',
    badge1Bg:    'rgba(255,255,255,0.05)',
    badge1Border:'rgba(255,255,255,0.1)',
    badge2Bg:    'rgba(42,165,160,0.18)',
    badge2Border:'rgba(42,165,160,0.35)',
    badge1Text:  '#ffffff',
    badge2Text:  '#2AA5A0',
    checkBg:     'rgba(42,165,160,0.2)',
    gradText:    'linear-gradient(135deg,#2AA5A0,#33BDB8,#7dd3c8)',
    tagBg:       'rgba(42,165,160,0.1)',
    tagBorder:   'rgba(42,165,160,0.4)',
    tagText:     '#2AA5A0',
  };
}

/* ─── Shared animation helpers ──────────────────────────────────────────── */
function FadeUp({ children, delay = 0, style }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const reduce = useReducedMotion();
  return (
    <motion.div ref={ref}
      initial={reduce ? false : { opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      style={style}
    >{children}</motion.div>
  );
}

function Counter({ to, prefix = '', suffix = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const dur = 1400; const step = to / (dur / 16); let cur = 0;
    const t = setInterval(() => { cur += step; if (cur >= to) { setVal(to); clearInterval(t); } else setVal(Math.floor(cur)); }, 16);
    return () => clearInterval(t);
  }, [inView, to]);
  return <span ref={ref}>{prefix}{val}{suffix}</span>;
}

function ProgressBar() {
  const { scrollYProgress } = useScroll();
  return (
    <motion.div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: '3px', zIndex: 300, background: 'linear-gradient(90deg,#2AA5A0,#33BDB8,#7dd3c8)', scaleX: scrollYProgress, transformOrigin: '0%' }} />
  );
}

/* ─── MAIN TEMPLATE ─────────────────────────────────────────────────────── */
export default function ServicePageTemplate({ content: c, tier, theme: themeMode = 'dark', stats = [], heroVisual = null, prevTier = null, nextTier = null }) {
  const t = getTheme(themeMode);
  const [openFaq, setOpenFaq] = useState(null);
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 350], [1, 0]);
  const heroY = useTransform(scrollY, [0, 350], [0, -40]);
  const yearTotal = tier ? tier.setupFee + tier.monthlyFee * 12 : null;

  return (
    <>
      <ProgressBar />
      <style>{`
        .spt-hero-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 56px; align-items: center; }
        .spt-stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; text-align: center; }
        .spt-problem-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        .spt-features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px; }
        .spt-pricing-split { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 36px; }
        .spt-includes-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 28px; margin-bottom: 36px; }
        .spt-cmp-row { display: grid; grid-template-columns: 1fr 110px 110px; gap: 12px; padding: 14px 20px; align-items: center; }
        .spt-tier-nav { display: flex; justify-content: center; gap: 12px; flex-wrap: wrap; padding: 20px 24px; }
        @media (max-width: 860px) {
          .spt-hero-grid { grid-template-columns: 1fr; }
          .spt-problem-grid { grid-template-columns: 1fr; }
          .spt-stats-grid { grid-template-columns: 1fr; gap: 28px; }
          .spt-features-grid { grid-template-columns: repeat(2, 1fr); }
          .spt-pricing-split { grid-template-columns: 1fr; }
          .spt-includes-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 560px) {
          .spt-features-grid { grid-template-columns: 1fr; }
          .spt-cmp-row { grid-template-columns: 1fr 70px 70px; gap: 8px; padding: 12px 14px; font-size: 13px; }
        }
        .spt-hero-visual { display: block; }
        @media (max-width: 860px) { .spt-hero-visual { display: none; } }
        .spt-card-hover { transition: border-color .2s, box-shadow .2s, transform .2s; }
        .spt-card-hover:hover { border-color: rgba(42,165,160,.35) !important; transform: translateY(-2px); }
        .spt-faq-btn { transition: background .2s; }
        .spt-link-soft { transition: color .2s, background .2s; }
        .spt-link-soft:hover { background: rgba(42,165,160,.08) !important; color: ${t.accent} !important; }
      `}</style>

      {/* ══ HERO ══════════════════════════════════════════════════════ */}
      <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', overflow: 'hidden', background: t.heroBg }}>
        {/* Orbs */}
        <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', top: '-15%', right: '-5%', width: '600px', height: '600px', borderRadius: '50%', background: `radial-gradient(circle,${t.orb1} 0%,transparent 70%)`, filter: 'blur(60px)' }} />
          <div style={{ position: 'absolute', bottom: '-10%', left: '-8%', width: '500px', height: '500px', borderRadius: '50%', background: `radial-gradient(circle,${t.orb2} 0%,transparent 70%)`, filter: 'blur(50px)' }} />
        </div>
        <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: `linear-gradient(${t.gridLine} 1px,transparent 1px),linear-gradient(90deg,${t.gridLine} 1px,transparent 1px)`, backgroundSize: '60px 60px' }} />

        <motion.div style={{ opacity: heroOpacity, y: heroY, width: '100%' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: 'clamp(88px,12vw,130px) 20px 72px' }}>
            <div className="spt-hero-grid">
              <div>
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '6px 14px', borderRadius: '50px', background: t.tagBg, border: `1px solid ${t.tagBorder}`, fontSize: '11px', fontWeight: 700, color: t.tagText, letterSpacing: '1.2px', textTransform: 'uppercase', marginBottom: '24px' }}
                >
                  <Zap size={11} /> {c.hero.eyebrow}
                </motion.div>

                <motion.h1 initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
                  style={{ fontSize: 'clamp(34px,5.5vw,62px)', fontWeight: 900, lineHeight: 1.05, color: t.heroText, marginBottom: '20px', letterSpacing: '-1.5px' }}
                >
                  {c.hero.headline}<br />
                  <span style={{ background: t.gradText, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                    {c.hero.headlineAccent}
                  </span>
                </motion.h1>

                <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
                  style={{ fontSize: 'clamp(15px,2vw,18px)', color: t.heroSub, lineHeight: 1.7, marginBottom: '36px', maxWidth: '480px' }}
                >
                  {c.hero.subheadline}
                </motion.p>

                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
                  style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '28px' }}
                >
                  <Link href="/contact" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '14px 26px', background: '#2AA5A0', color: '#fff', borderRadius: '50px', fontWeight: 700, fontSize: '15px', textDecoration: 'none', boxShadow: '0 8px 28px rgba(42,165,160,.4)', transition: 'all .2s' }}>
                    Get My Free Audit <ArrowRight size={16} />
                  </Link>
                  <a href="#pricing" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '14px 22px', border: `1px solid ${themeMode === 'light' ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.18)'}`, color: t.heroSub, borderRadius: '50px', fontWeight: 600, fontSize: '15px', textDecoration: 'none', transition: 'all .2s' }}>
                    {c.hero.scrollCta || 'See pricing'}
                  </a>
                </motion.div>

                {tier && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.5 }}
                    style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}
                  >
                    {[`$${tier.setupFee} one-time setup`, `$${tier.monthlyFee}/mo after`, c.deliveryTime + ' delivery', 'No contracts'].map(txt => (
                      <div key={txt} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: t.heroMeta }}>
                        <Check size={13} color="#2AA5A0" strokeWidth={2.5} /> {txt}
                      </div>
                    ))}
                  </motion.div>
                )}
              </div>

              {/* Hero visual */}
              {heroVisual && (
                <motion.div className="spt-hero-visual"
                  initial={{ opacity: 0, x: 36, scale: 0.96 }} animate={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.35, ease: [0.21, 0.47, 0.32, 0.98] }}
                >
                  {heroVisual}
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </section>

      {/* ══ STATS STRIP ═══════════════════════════════════════════════ */}
      {stats.length > 0 && (
        <section style={{ background: t.stripBg, borderTop: `1px solid ${t.stripBorder}`, borderBottom: `1px solid ${t.stripBorder}`, padding: '36px 20px' }}>
          <div style={{ maxWidth: '760px', margin: '0 auto' }}>
            <div className="spt-stats-grid">
              {stats.map(({ icon: Icon, val, pre = '', suf = '', label }) => (
                <FadeUp key={label}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    {Icon && <Icon size={22} color="#2AA5A0" strokeWidth={1.5} />}
                    <div style={{ fontSize: 'clamp(28px,4vw,48px)', fontWeight: 900, color: t.heading, lineHeight: 1 }}>
                      {typeof val === 'number' ? <Counter to={val} prefix={pre} suffix={suf} /> : <span>{pre}{val}{suf}</span>}
                    </div>
                    <div style={{ fontSize: '13px', color: t.muted, maxWidth: '160px', textAlign: 'center', lineHeight: 1.5 }}>{label}</div>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══ PROBLEM ═══════════════════════════════════════════════════ */}
      <section style={{ padding: 'clamp(72px,10vw,110px) 20px', background: t.sectionAlt }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <FadeUp>
            <div style={{ textAlign: 'center', marginBottom: '56px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: t.eyebrow, marginBottom: '14px' }}>The Problem</div>
              <h2 style={{ fontSize: 'clamp(26px,4vw,44px)', fontWeight: 900, color: t.heading, lineHeight: 1.1, letterSpacing: '-0.5px', marginBottom: '18px' }}>{c.problem.heading}</h2>
              <p style={{ fontSize: '16px', color: t.body, maxWidth: '580px', margin: '0 auto', lineHeight: 1.75 }}>{c.problem.body}</p>
            </div>
          </FadeUp>
          <div className="spt-problem-grid">
            {c.problem.cards.map((card, i) => (
              <FadeUp key={i} delay={i * 0.1}>
                <div className="spt-card-hover" style={{ position: 'relative', borderRadius: '18px', padding: '28px', background: t.problemCard, border: `1px solid ${t.problemBorder}`, boxShadow: t.cardShadow, overflow: 'hidden', height: '100%' }}>
                  <div aria-hidden style={{ position: 'absolute', top: '14px', right: '18px', fontSize: '44px', fontWeight: 900, color: themeMode === 'light' ? 'rgba(239,68,68,0.07)' : 'rgba(239,68,68,0.1)', lineHeight: 1, userSelect: 'none' }}>0{i + 1}</div>
                  <div style={{ width: '38px', height: '3px', background: '#ef4444', borderRadius: '2px', marginBottom: '18px' }} />
                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: t.heading, marginBottom: '10px', lineHeight: 1.25 }}>{card.title}</h3>
                  <p style={{ fontSize: '14px', color: t.body, lineHeight: 1.75, margin: 0 }}>{card.body}</p>
                </div>
              </FadeUp>
            ))}
          </div>
          <FadeUp delay={0.3}>
            <div style={{ marginTop: '40px', textAlign: 'center', padding: '22px 28px', borderRadius: '14px', background: t.accentBg, border: `1px solid ${t.accentBorder}` }}>
              <p style={{ fontSize: '17px', fontWeight: 700, color: t.accent, margin: 0 }}>{c.problem.closingLine}</p>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ══ FEATURES ══════════════════════════════════════════════════ */}
      <section style={{ padding: 'clamp(72px,10vw,110px) 20px', background: t.sectionB }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <FadeUp>
            <div style={{ textAlign: 'center', marginBottom: '52px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: t.eyebrow, marginBottom: '14px' }}>What's Included</div>
              <h2 style={{ fontSize: 'clamp(26px,4vw,44px)', fontWeight: 900, color: t.heading, lineHeight: 1.1, letterSpacing: '-0.5px' }}>Built & Managed for You</h2>
            </div>
          </FadeUp>
          <div className="spt-features-grid">
            {c.features.map((f, i) => {
              const Icon = ICONS[f.iconName] || Bot;
              return (
                <FadeUp key={i} delay={i * 0.07}>
                  <div className="spt-card-hover" style={{ borderRadius: '18px', padding: '26px 22px', background: t.cardBg, border: `1px solid ${t.cardBorder}`, boxShadow: t.cardShadow, height: '100%' }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(42,165,160,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
                      <Icon size={21} color="#2AA5A0" strokeWidth={1.5} />
                    </div>
                    <h3 style={{ fontSize: '14px', fontWeight: 700, color: t.heading, marginBottom: '7px', lineHeight: 1.3 }}>{f.name}</h3>
                    <p style={{ fontSize: '13px', color: t.body, lineHeight: 1.6, margin: 0 }}>{f.description}</p>
                  </div>
                </FadeUp>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══ TIMELINE ══════════════════════════════════════════════════ */}
      {c.timeline && (
        <section id="how-it-works" style={{ padding: 'clamp(72px,10vw,110px) 20px', background: t.sectionAlt }}>
          <div style={{ maxWidth: '820px', margin: '0 auto' }}>
            <FadeUp>
              <div style={{ textAlign: 'center', marginBottom: '72px' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: t.eyebrow, marginBottom: '14px' }}>How It Works</div>
                <h2 style={{ fontSize: 'clamp(26px,4vw,44px)', fontWeight: 900, color: t.heading, lineHeight: 1.1, letterSpacing: '-0.5px' }}>
                  {c.deliveryTime ? `Live in ${c.deliveryTime}` : 'The Process'}
                </h2>
              </div>
            </FadeUp>
            <div style={{ position: 'relative' }}>
              <div aria-hidden style={{ position: 'absolute', left: '23px', top: '28px', bottom: '28px', width: '2px', background: `linear-gradient(to bottom,${t.timelineLine},${themeMode === 'light' ? 'rgba(42,165,160,0.1)' : 'rgba(42,165,160,0.08)'})`, borderRadius: '2px' }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', paddingLeft: '72px' }}>
                {c.timeline.map((step, i) => (
                  <FadeUp key={i} delay={i * 0.13}>
                    <div style={{ position: 'relative' }}>
                      <div style={{ position: 'absolute', left: '-72px', top: '8px', width: '48px', height: '48px', borderRadius: '50%', background: t.timelineDot, border: '2px solid #2AA5A0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', fontWeight: 800, color: '#2AA5A0', boxShadow: '0 0 0 5px rgba(42,165,160,0.08)' }}>{i + 1}</div>
                      <div className="spt-card-hover" style={{ padding: '26px 28px', borderRadius: '16px', background: t.cardBg, border: `1px solid ${t.cardBorder}`, boxShadow: t.cardShadow }}>
                        <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '1.2px', textTransform: 'uppercase', color: t.accent, marginBottom: '6px' }}>{step.label}</div>
                        <h3 style={{ fontSize: '18px', fontWeight: 800, color: t.heading, marginBottom: '8px' }}>{step.heading}</h3>
                        <p style={{ fontSize: '14px', color: t.body, lineHeight: 1.75, margin: 0 }}>{step.description}</p>
                      </div>
                    </div>
                  </FadeUp>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ══ PRICING ═══════════════════════════════════════════════════ */}
      {tier && (
        <section id="pricing" style={{ padding: 'clamp(72px,10vw,110px) 20px', background: t.sectionB, position: 'relative', overflow: 'hidden' }}>
          <div aria-hidden style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '600px', height: '600px', borderRadius: '50%', background: `radial-gradient(circle,${t.orb1} 0%,transparent 65%)`, filter: 'blur(70px)', pointerEvents: 'none' }} />
          <div style={{ maxWidth: '680px', margin: '0 auto', position: 'relative' }}>
            <FadeUp>
              <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: t.eyebrow, marginBottom: '14px' }}>Pricing</div>
                <h2 style={{ fontSize: 'clamp(26px,4vw,44px)', fontWeight: 900, color: t.heading, lineHeight: 1.1, letterSpacing: '-0.5px' }}>Simple, Transparent Pricing</h2>
              </div>
            </FadeUp>
            <FadeUp delay={0.1}>
              <div style={{ borderRadius: '24px', background: t.pricingBg, border: `1px solid ${t.pricingBorder}`, padding: 'clamp(28px,5vw,48px)', boxShadow: themeMode === 'dark' ? '0 0 80px rgba(42,165,160,0.15)' : '0 8px 40px rgba(42,165,160,0.12)', backdropFilter: 'blur(20px)' }}>
                <div className="spt-pricing-split">
                  <div style={{ textAlign: 'center', padding: '24px 18px', borderRadius: '16px', background: t.badge1Bg, border: `1px solid ${t.badge1Border}` }}>
                    <div style={{ fontSize: '12px', color: t.muted, marginBottom: '8px', fontWeight: 600, letterSpacing: '0.5px' }}>One-Time Setup</div>
                    <div style={{ fontSize: 'clamp(36px,6vw,52px)', fontWeight: 900, color: t.badge1Text, lineHeight: 1 }}>${tier.setupFee}</div>
                    <div style={{ fontSize: '12px', color: t.muted, marginTop: '5px' }}>paid once</div>
                  </div>
                  <div style={{ textAlign: 'center', padding: '24px 18px', borderRadius: '16px', background: t.badge2Bg, border: `1px solid ${t.badge2Border}` }}>
                    <div style={{ fontSize: '12px', color: t.badge2Text, marginBottom: '8px', fontWeight: 600, letterSpacing: '0.5px', opacity: 0.85 }}>Monthly</div>
                    <div style={{ fontSize: 'clamp(36px,6vw,52px)', fontWeight: 900, color: t.badge2Text, lineHeight: 1 }}>${tier.monthlyFee}</div>
                    <div style={{ fontSize: '12px', color: t.badge2Text, marginTop: '5px', opacity: 0.6 }}>cancel anytime</div>
                  </div>
                </div>
                <div className="spt-includes-grid">
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '1.2px', textTransform: 'uppercase', color: t.muted, marginBottom: '14px' }}>Setup Includes</div>
                    {c.setupIncludes.map((item, i) => (
                      <div key={i} style={{ display: 'flex', gap: '9px', alignItems: 'flex-start', marginBottom: '9px' }}>
                        <Check size={13} color="#2AA5A0" strokeWidth={2.5} style={{ marginTop: '3px', flexShrink: 0 }} />
                        <span style={{ fontSize: '13px', color: t.body, lineHeight: 1.5 }}>{item}</span>
                      </div>
                    ))}
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '1.2px', textTransform: 'uppercase', color: t.muted, marginBottom: '14px' }}>Monthly Includes</div>
                    {c.monthlyIncludes.map((item, i) => (
                      <div key={i} style={{ display: 'flex', gap: '9px', alignItems: 'flex-start', marginBottom: '9px' }}>
                        <Check size={13} color="#2AA5A0" strokeWidth={2.5} style={{ marginTop: '3px', flexShrink: 0 }} />
                        <span style={{ fontSize: '13px', color: t.body, lineHeight: 1.5 }}>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <Link href={tier.setupLinkLong} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '15px', background: '#2AA5A0', color: '#fff', borderRadius: '12px', fontWeight: 700, fontSize: '15px', textDecoration: 'none', boxShadow: '0 8px 24px rgba(42,165,160,0.4)', transition: 'all .2s' }}>
                    {c.pricingCta} <ArrowRight size={16} />
                  </Link>
                  <Link href="/contact" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '13px', border: `1px solid ${themeMode === 'light' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.12)'}`, color: t.body, borderRadius: '12px', fontWeight: 600, fontSize: '14px', textDecoration: 'none', transition: 'all .2s' }}>
                    Get a free audit first — no obligation
                  </Link>
                </div>
                <div style={{ marginTop: '18px', textAlign: 'center', fontSize: '12px', color: t.muted }}>
                  1-year total: ${yearTotal} · {c.deliveryTime} · no contracts
                </div>
              </div>
            </FadeUp>
          </div>
        </section>
      )}

      {/* ══ BUILT FOR YOU ═════════════════════════════════════════════ */}
      <section style={{ padding: 'clamp(72px,10vw,110px) 20px', background: t.sectionAlt }}>
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          <FadeUp>
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: t.eyebrow, marginBottom: '14px' }}>Built For You If</div>
              <h2 style={{ fontSize: 'clamp(26px,4vw,44px)', fontWeight: 900, color: t.heading, lineHeight: 1.1, letterSpacing: '-0.5px' }}>Is This the Right Fit?</h2>
            </div>
          </FadeUp>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {c.builtForYouIf.map((item, i) => (
              <FadeUp key={i} delay={i * 0.09}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center', padding: '20px 24px', borderRadius: '14px', background: t.accentBg, border: `1px solid ${t.accentBorder}` }}>
                  <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: t.checkBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Check size={16} color="#2AA5A0" strokeWidth={2.5} />
                  </div>
                  <p style={{ fontSize: '15px', color: t.heading, lineHeight: 1.5, margin: 0, fontWeight: 500 }}>{item}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ══ COMPARISON ════════════════════════════════════════════════ */}
      {c.comparisons && (
        <section style={{ padding: 'clamp(72px,10vw,110px) 20px', background: t.sectionB }}>
          <div style={{ maxWidth: '820px', margin: '0 auto' }}>
            <FadeUp>
              <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: t.eyebrow, marginBottom: '14px' }}>Why Not DIY?</div>
                <h2 style={{ fontSize: 'clamp(26px,4vw,44px)', fontWeight: 900, color: t.heading, lineHeight: 1.1, letterSpacing: '-0.5px' }}>{c.comparisons.usLabel || 'Us'} vs. {c.comparisons.vsLabel}</h2>
              </div>
            </FadeUp>
            <FadeUp delay={0.1}>
              <div style={{ borderRadius: '18px', overflow: 'hidden', border: `1px solid ${t.cardBorder}`, boxShadow: t.cardShadow }}>
                <div className="spt-cmp-row" style={{ background: t.cmpHeader }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: t.muted, textTransform: 'uppercase', letterSpacing: '1px' }}>Feature</div>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#2AA5A0', textTransform: 'uppercase', letterSpacing: '1px', textAlign: 'center' }}>{c.comparisons.usLabel || 'Us'}</div>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: t.muted, textTransform: 'uppercase', letterSpacing: '1px', textAlign: 'center' }}>{c.comparisons.vsLabel}</div>
                </div>
                {c.comparisons.rows.map((row, i) => {
                  const isTotal = row.feature === '1-Year Total';
                  return (
                    <div key={i} className="spt-cmp-row" style={{ background: isTotal ? t.cmpTotal : i % 2 === 0 ? t.cmpRow : 'transparent', borderTop: isTotal ? `1px solid ${t.accentBorder}` : 'none', borderBottom: i < c.comparisons.rows.length - 1 && !isTotal ? `1px solid ${t.cardBorder}` : 'none' }}>
                      <div style={{ fontSize: '14px', color: t.body, fontWeight: isTotal ? 700 : 400, lineHeight: 1.4 }}>{row.feature}</div>
                      <div style={{ textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {row.us === true ? <Check size={18} color="#10b981" strokeWidth={2.5} /> :
                         row.us === false ? <X size={18} color="#ef4444" strokeWidth={2.5} /> :
                         <span style={{ fontSize: '14px', fontWeight: 800, color: '#2AA5A0' }}>${yearTotal}</span>}
                      </div>
                      <div style={{ textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {row.them === true ? <Check size={18} color="#10b981" strokeWidth={2.5} /> :
                         row.them === false ? <X size={18} color="#ef4444" strokeWidth={2.5} /> :
                         <span style={{ fontSize: '13px', fontWeight: 700, color: themeMode === 'light' ? '#dc2626' : '#f87171' }}>{row.them}</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
              {c.comparisons.rows.at(-1)?.themCost && (
                <p style={{ fontSize: '13px', color: t.muted, textAlign: 'center', marginTop: '14px' }}>{c.comparisons.rows.at(-1).themCost}</p>
              )}
            </FadeUp>
          </div>
        </section>
      )}

      {/* ══ FAQ ═══════════════════════════════════════════════════════ */}
      {c.faq && (
        <section style={{ padding: 'clamp(72px,10vw,110px) 20px', background: t.sectionAlt }}>
          <div style={{ maxWidth: '720px', margin: '0 auto' }}>
            <FadeUp>
              <div style={{ textAlign: 'center', marginBottom: '52px' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: t.eyebrow, marginBottom: '14px' }}>FAQ</div>
                <h2 style={{ fontSize: 'clamp(26px,4vw,44px)', fontWeight: 900, color: t.heading, lineHeight: 1.1, letterSpacing: '-0.5px' }}>Questions? Good.</h2>
              </div>
            </FadeUp>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {c.faq.map((item, i) => (
                <FadeUp key={i} delay={i * 0.04}>
                  <div style={{ borderRadius: '12px', border: `1px solid ${openFaq === i ? t.accentBorder : t.faqBorder}`, overflow: 'hidden', background: openFaq === i ? t.faqOpenBg : t.faqBg, transition: 'background .2s, border-color .2s' }}>
                    <button className="spt-faq-btn" onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 22px', background: 'none', border: 'none', color: t.heading, fontSize: '15px', fontWeight: 600, cursor: 'pointer', textAlign: 'left', gap: '14px' }}
                    >
                      <span>{item.q}</span>
                      <motion.div animate={{ rotate: openFaq === i ? 180 : 0 }} transition={{ duration: 0.22 }} style={{ flexShrink: 0 }}>
                        <ChevronDown size={17} color={t.muted} />
                      </motion.div>
                    </button>
                    <AnimatePresence initial={false}>
                      {openFaq === i && (
                        <motion.div key="body" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} style={{ overflow: 'hidden' }}>
                          <div style={{ padding: '0 22px 18px', fontSize: '14px', color: t.body, lineHeight: 1.75 }}>{item.a}</div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══ FINAL CTA ═════════════════════════════════════════════════ */}
      <section style={{ padding: 'clamp(90px,12vw,130px) 20px', background: t.ctaBg, position: 'relative', overflow: 'hidden' }}>
        <div aria-hidden style={{ position: 'absolute', top: '-40%', left: '50%', transform: 'translateX(-50%)', width: '800px', height: '800px', borderRadius: '50%', background: `radial-gradient(circle,${t.orb1} 0%,transparent 60%)`, filter: 'blur(80px)', pointerEvents: 'none' }} />
        <FadeUp>
          <div style={{ maxWidth: '620px', margin: '0 auto', textAlign: 'center', position: 'relative' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: t.eyebrow, marginBottom: '18px' }}>Ready?</div>
            <h2 style={{ fontSize: 'clamp(32px,5.5vw,58px)', fontWeight: 900, color: t.heading, lineHeight: 1.03, letterSpacing: '-1.5px', marginBottom: '18px' }}>
              Let&apos;s Build Something<br />
              <span style={{ background: t.gradText, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                Worth Showing Off
              </span>
            </h2>
            <p style={{ fontSize: '17px', color: t.body, marginBottom: '40px', lineHeight: 1.7 }}>
              Get a free audit first. I&apos;ll tell you exactly where AI can help — no pitch, no obligation, within 6 hours.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/contact" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '16px 36px', background: '#2AA5A0', color: '#fff', borderRadius: '50px', fontWeight: 700, fontSize: '16px', textDecoration: 'none', boxShadow: '0 12px 40px rgba(42,165,160,0.45)', transition: 'all .2s' }}>
                Get My Free Audit <ArrowRight size={18} />
              </Link>
              {tier && (
                <Link href={tier.setupLinkLong} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '16px 26px', border: `1px solid ${themeMode === 'light' ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.2)'}`, color: t.body, borderRadius: '50px', fontWeight: 600, fontSize: '15px', textDecoration: 'none', transition: 'all .2s' }}>
                  Pay Setup — ${tier.setupFee}
                </Link>
              )}
            </div>
            {tier && (
              <p style={{ fontSize: '13px', color: t.muted, marginTop: '20px' }}>
                Delivered in {c.deliveryTime} · ${tier.monthlyFee}/mo · No contracts · Cancel anytime
              </p>
            )}
          </div>
        </FadeUp>
      </section>

      {/* ══ TIER NAV ══════════════════════════════════════════════════ */}
      <div style={{ background: t.navBg, borderTop: `1px solid ${t.navBorder}` }}>
        <div className="spt-tier-nav">
          {prevTier && (
            <Link href={`/services/${prevTier.slug}`} className="spt-link-soft" style={{ fontSize: '13px', color: t.muted, textDecoration: 'none', padding: '9px 18px', borderRadius: '10px', border: `1px solid ${t.cardBorder}` }}>
              ← {prevTier.name}
            </Link>
          )}
          <Link href="/services/compare" style={{ fontSize: '13px', color: '#2AA5A0', textDecoration: 'none', padding: '9px 18px', borderRadius: '10px', border: '1px solid rgba(42,165,160,0.3)', fontWeight: 700 }}>
            Compare All Plans
          </Link>
          {nextTier && (
            <Link href={`/services/${nextTier.slug}`} className="spt-link-soft" style={{ fontSize: '13px', color: t.muted, textDecoration: 'none', padding: '9px 18px', borderRadius: '10px', border: `1px solid ${t.cardBorder}` }}>
              {nextTier.name} →
            </Link>
          )}
        </div>
      </div>
    </>
  );
}
