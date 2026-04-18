'use client';
import { useRef } from 'react';
import Link from 'next/link';
import { motion, useInView, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { Check, X, ArrowRight, Zap, Star } from 'lucide-react';
import { TIERS } from '@/lib/pricing';

const ACCENT = '#2AA5A0';

function FadeUp({ children, delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const reduce = useReducedMotion();
  return (
    <motion.div ref={ref}
      initial={reduce ? false : { opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
    >{children}</motion.div>
  );
}

function ProgressBar() {
  const { scrollYProgress } = useScroll();
  return <motion.div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: '3px', zIndex: 300, background: `linear-gradient(90deg,${ACCENT},#33BDB8)`, scaleX: scrollYProgress, transformOrigin: '0%' }} />;
}

const TIER_ORDER = ['ai-automation-starter','presence','growth','revenue-engine','ai-first','consulting'];
const TIERS_SORTED = TIER_ORDER.map(slug => TIERS.find(t => t.slug === slug)).filter(Boolean);

const FEATURE_ROWS = [
  { label: 'Professional website (5 pages)',         tiers: ['presence','growth','revenue-engine','ai-first'] },
  { label: 'Local SEO + Google Business Profile',    tiers: ['presence','growth','revenue-engine','ai-first'] },
  { label: 'Basic AI assistant',                     tiers: ['presence','growth','revenue-engine','ai-first'] },
  { label: 'AI automation system (lead qualify)',    tiers: ['ai-automation-starter','growth','revenue-engine','ai-first'] },
  { label: 'Calendar + CRM integration',             tiers: ['ai-automation-starter','growth','revenue-engine','ai-first'] },
  { label: 'Email marketing + welcome sequence',     tiers: ['growth','revenue-engine','ai-first'] },
  { label: 'SEO content (2 articles/month)',         tiers: ['growth','revenue-engine','ai-first'] },
  { label: 'Conversion landing pages',               tiers: ['growth','revenue-engine','ai-first'] },
  { label: 'Sales funnel design + build',            tiers: ['revenue-engine','ai-first'] },
  { label: 'Workflow automation',                    tiers: ['revenue-engine','ai-first'] },
  { label: 'Paid ads (Google or Meta)',              tiers: ['revenue-engine','ai-first'] },
  { label: 'Monthly strategy call',                  tiers: ['revenue-engine','ai-first','consulting'] },
  { label: 'Voice AI (answers calls)',               tiers: ['ai-first'] },
  { label: 'Programmatic SEO (100s of pages)',       tiers: ['ai-first'] },
  { label: 'Social media AI scheduling',             tiers: ['ai-first'] },
  { label: 'Custom analytics dashboard',             tiers: ['ai-first'] },
  { label: 'AI readiness audit + roadmap',           tiers: ['consulting'] },
  { label: 'Unbiased tool recommendations',          tiers: ['consulting'] },
];

const TIER_COLORS = {
  'ai-automation-starter': '#2AA5A0',
  'presence':              '#3b82f6',
  'growth':                '#8b5cf6',
  'revenue-engine':        '#f59e0b',
  'ai-first':              '#ef4444',
  'consulting':            '#10b981',
};

export default function CompareAllPlansPage() {
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <>
      <ProgressBar />
      <style>{`
        .cmp-table { width: 100%; border-collapse: collapse; }
        .cmp-table th, .cmp-table td { padding: 14px 16px; text-align: center; border-bottom: 1px solid rgba(0,0,0,0.06); }
        .cmp-table th:first-child, .cmp-table td:first-child { text-align: left; }
        .cmp-scroll { overflow-x: auto; -webkit-overflow-scrolling: touch; border-radius: 16px; border: 1px solid rgba(0,0,0,0.07); box-shadow: 0 4px 24px rgba(0,0,0,0.06); }
        .tier-card { border-radius: 20px; padding: 28px; border: 2px solid; transition: transform .2s, box-shadow .2s; }
        .tier-card:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(42,165,160,0.15) !important; }
        .tier-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        @media (max-width: 900px) { .tier-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 560px) { .tier-grid { grid-template-columns: 1fr; } .cmp-table th, .cmp-table td { padding: 10px 10px; font-size: 12px; } }
      `}</style>

      {/* HERO */}
      <section style={{ background: '#f8fafc', position: 'relative', overflow: 'hidden', minHeight: '55vh', display: 'flex', alignItems: 'center' }}>
        <div aria-hidden style={{ position: 'absolute', top: '-20%', right: '-5%', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(42,165,160,0.1) 0%,transparent 70%)', filter: 'blur(60px)' }} />
        <div aria-hidden style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(42,165,160,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(42,165,160,0.03) 1px,transparent 1px)', backgroundSize: '60px 60px' }} />
        <motion.div style={{ opacity: heroOpacity, width: '100%' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto', padding: 'clamp(88px,12vw,130px) 20px 64px', textAlign: 'center' }}>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '6px 14px', borderRadius: '50px', background: 'rgba(42,165,160,0.1)', border: '1px solid rgba(42,165,160,0.3)', fontSize: '11px', fontWeight: 700, color: ACCENT, letterSpacing: '1.2px', textTransform: 'uppercase', marginBottom: '24px' }}
            >
              <Zap size={11} /> Compare All Plans
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
              style={{ fontSize: 'clamp(34px,5vw,60px)', fontWeight: 900, color: '#111827', lineHeight: 1.05, letterSpacing: '-1.5px', marginBottom: '18px' }}
            >
              Find Your Perfect Plan
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
              style={{ fontSize: '18px', color: '#4b5563', lineHeight: 1.7, maxWidth: '520px', margin: '0 auto 32px' }}
            >
              Six plans designed for where you are today — and where you&apos;re going. Not sure? Get a free audit.
            </motion.p>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/#contact" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '14px 28px', background: ACCENT, color: '#fff', borderRadius: '50px', fontWeight: 700, fontSize: '15px', textDecoration: 'none', boxShadow: '0 8px 28px rgba(42,165,160,0.4)' }}>
                Get a Free Audit <ArrowRight size={16} />
              </Link>
              <a href="#compare" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '14px 22px', border: '1px solid rgba(0,0,0,0.12)', color: '#374151', borderRadius: '50px', fontWeight: 600, fontSize: '15px', textDecoration: 'none' }}>
                See full comparison ↓
              </a>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* TWO TRACKS */}
      <section style={{ padding: 'clamp(56px,8vw,88px) 20px', background: '#f8fafc', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <FadeUp>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: ACCENT, marginBottom: '14px' }}>Two Entry Points</div>
              <h2 style={{ fontSize: 'clamp(22px,3vw,36px)', fontWeight: 900, color: '#111827', lineHeight: 1.1, letterSpacing: '-0.5px', marginBottom: '14px' }}>Which starting point is right for you?</h2>
              <p style={{ fontSize: '15px', color: '#6b7280', maxWidth: '560px', margin: '0 auto', lineHeight: 1.7 }}>
                Two of the plans are designed as <strong style={{ color: '#111827' }}>parallel entry points</strong> — not steps on the same ladder. Both graduate into Growth.
              </p>
            </div>
          </FadeUp>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            {[
              {
                tag: 'No online presence yet',
                title: 'Start with Presence',
                desc: "You need a website, local SEO, and a basic AI assistant first. Once you're getting traffic and inquiries, upgrade to Growth to add the full AI automation system.",
                bullets: ['Just getting started online', 'Need to show up in local search', 'Want credibility before investing more'],
                href: '/services/presence',
                cta: 'See Presence →',
                color: '#3b82f6',
              },
              {
                tag: 'Already have a website',
                title: 'Start with AI Automation Starter',
                desc: "You already exist online and you're getting inquiries — but losing them to slow response. This adds the full AI automation system to whatever you already have.",
                bullets: ['Existing website you like', 'Getting 10+ inquiries per week', 'Losing leads to voicemail or slow replies'],
                href: '/services/ai-automation-starter',
                cta: 'See AI Automation Starter →',
                color: '#2AA5A0',
              },
            ].map((track, i) => (
              <FadeUp key={i} delay={i * 0.1}>
                <div style={{ borderRadius: '18px', padding: '28px', background: '#fff', border: `1px solid ${track.color}30`, boxShadow: `0 4px 20px ${track.color}10`, height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', padding: '4px 12px', borderRadius: '20px', background: `${track.color}12`, border: `1px solid ${track.color}30`, fontSize: '11px', fontWeight: 700, color: track.color, letterSpacing: '0.5px', marginBottom: '14px', width: 'fit-content' }}>
                    {track.tag}
                  </div>
                  <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#111827', marginBottom: '10px' }}>{track.title}</h3>
                  <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: 1.7, marginBottom: '16px', flex: 1 }}>{track.desc}</p>
                  {track.bullets.map((b, bi) => (
                    <div key={bi} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', marginBottom: '7px' }}>
                      <Check size={13} color={track.color} strokeWidth={2.5} style={{ marginTop: '3px', flexShrink: 0 }} />
                      <span style={{ fontSize: '13px', color: '#374151' }}>{b}</span>
                    </div>
                  ))}
                  <Link href={track.href} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '20px', padding: '12px', background: `${track.color}12`, color: track.color, border: `1px solid ${track.color}30`, borderRadius: '10px', fontWeight: 700, fontSize: '14px', textDecoration: 'none', transition: 'all .2s' }}>
                    {track.cta}
                  </Link>
                </div>
              </FadeUp>
            ))}
          </div>
          <FadeUp delay={0.2}>
            <div style={{ marginTop: '24px', padding: '18px 24px', borderRadius: '12px', background: 'rgba(42,165,160,0.06)', border: '1px solid rgba(42,165,160,0.15)', textAlign: 'center' }}>
              <p style={{ fontSize: '14px', color: '#374151', margin: 0 }}>
                Both tracks lead to <strong>Growth</strong> — the first tier that includes a great website <em>and</em> the full AI automation system together.
                {' '}<Link href="/services/growth" style={{ color: ACCENT, fontWeight: 700, textDecoration: 'none' }}>See Growth →</Link>
              </p>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* TIER CARDS */}
      <section style={{ padding: 'clamp(64px,8vw,100px) 20px', background: '#ffffff' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <FadeUp>
            <div style={{ textAlign: 'center', marginBottom: '52px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: ACCENT, marginBottom: '14px' }}>All Plans</div>
              <h2 style={{ fontSize: 'clamp(24px,3.5vw,40px)', fontWeight: 900, color: '#111827', lineHeight: 1.1, letterSpacing: '-0.5px' }}>Pick Your Starting Point</h2>
            </div>
          </FadeUp>
          <div className="tier-grid">
            {TIERS_SORTED.map((tier, i) => {
              const color = TIER_COLORS[tier.slug] || ACCENT;
              return (
                <FadeUp key={tier.slug} delay={i * 0.08}>
                  <div className="tier-card" style={{ background: tier.popular ? `${color}08` : '#f9fafb', borderColor: tier.popular ? color : 'rgba(0,0,0,0.08)', position: 'relative', boxShadow: tier.popular ? `0 4px 24px ${color}20` : 'none' }}>
                    {tier.popular && (
                      <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: color, color: '#fff', fontSize: '10px', fontWeight: 700, padding: '4px 12px', borderRadius: '20px', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap' }}>
                        <Star size={9} fill="currentColor" /> Most Popular
                      </div>
                    )}
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
                      <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: color }} />
                    </div>
                    <div style={{ fontSize: '11px', fontWeight: 700, color, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '6px' }}>{tier.name}</div>
                    <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '16px', lineHeight: 1.4 }}>{tier.tagline}</div>
                    <div style={{ marginBottom: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                        <span style={{ fontSize: '32px', fontWeight: 900, color: '#111827' }}>${tier.monthlyFee}</span>
                        <span style={{ fontSize: '13px', color: '#9ca3af' }}>/mo</span>
                      </div>
                      <div style={{ fontSize: '12px', color: '#9ca3af' }}>+ ${tier.setupFee} setup</div>
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                      {tier.features.slice(0, 3).map((f, fi) => (
                        <div key={fi} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', marginBottom: '7px' }}>
                          <Check size={13} color={color} strokeWidth={2.5} style={{ marginTop: '2px', flexShrink: 0 }} />
                          <span style={{ fontSize: '13px', color: '#374151', lineHeight: 1.4 }}>{f}</span>
                        </div>
                      ))}
                      {tier.features.length > 3 && (
                        <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '6px' }}>+ {tier.features.length - 3} more included</div>
                      )}
                    </div>
                    <Link href={`/services/${tier.slug}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '12px', background: tier.popular ? color : 'transparent', color: tier.popular ? '#fff' : color, border: `1px solid ${color}`, borderRadius: '10px', fontWeight: 700, fontSize: '14px', textDecoration: 'none', transition: 'all .2s' }}>
                      Learn More <ArrowRight size={14} />
                    </Link>
                  </div>
                </FadeUp>
              );
            })}
          </div>
        </div>
      </section>

      {/* FULL COMPARISON TABLE */}
      <section id="compare" style={{ padding: 'clamp(64px,8vw,100px) 20px', background: '#f8fafc' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <FadeUp>
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: ACCENT, marginBottom: '14px' }}>Side by Side</div>
              <h2 style={{ fontSize: 'clamp(24px,3.5vw,40px)', fontWeight: 900, color: '#111827', lineHeight: 1.1, letterSpacing: '-0.5px' }}>Full Feature Comparison</h2>
            </div>
          </FadeUp>
          <FadeUp delay={0.1}>
            <div className="cmp-scroll">
              <table className="cmp-table" style={{ background: '#fff', minWidth: '700px' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '2px solid rgba(0,0,0,0.08)' }}>
                    <th style={{ padding: '16px', fontWeight: 700, color: '#374151', fontSize: '13px', textAlign: 'left', minWidth: '200px' }}>Feature</th>
                    {TIERS_SORTED.map(tier => {
                      const color = TIER_COLORS[tier.slug] || ACCENT;
                      return (
                        <th key={tier.slug} style={{ padding: '16px 10px', fontSize: '12px', fontWeight: 700, color }}>
                          <div>{tier.name}</div>
                          <div style={{ fontSize: '11px', fontWeight: 500, color: '#9ca3af', marginTop: '2px' }}>${tier.monthlyFee}/mo</div>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {FEATURE_ROWS.map((row, i) => (
                    <tr key={i} style={{ background: i % 2 === 0 ? 'rgba(0,0,0,0.01)' : 'transparent' }}>
                      <td style={{ fontSize: '13px', color: '#374151', fontWeight: 500, padding: '12px 16px' }}>{row.label}</td>
                      {TIERS_SORTED.map(tier => (
                        <td key={tier.slug} style={{ textAlign: 'center' }}>
                          {row.tiers.includes(tier.slug)
                            ? <Check size={16} color="#10b981" strokeWidth={2.5} style={{ margin: '0 auto' }} />
                            : <X size={14} color="#e5e7eb" strokeWidth={2} style={{ margin: '0 auto' }} />}
                        </td>
                      ))}
                    </tr>
                  ))}
                  {/* Pricing row */}
                  <tr style={{ background: 'rgba(42,165,160,0.05)', borderTop: '2px solid rgba(42,165,160,0.15)' }}>
                    <td style={{ fontSize: '13px', fontWeight: 700, color: '#111827', padding: '16px' }}>Monthly</td>
                    {TIERS_SORTED.map(tier => (
                      <td key={tier.slug} style={{ textAlign: 'center', fontWeight: 800, fontSize: '15px', color: TIER_COLORS[tier.slug] || ACCENT }}>${tier.monthlyFee}</td>
                    ))}
                  </tr>
                  <tr style={{ background: 'rgba(42,165,160,0.03)' }}>
                    <td style={{ fontSize: '13px', fontWeight: 700, color: '#111827', padding: '16px' }}>Setup</td>
                    {TIERS_SORTED.map(tier => (
                      <td key={tier.slug} style={{ textAlign: 'center', fontSize: '13px', color: '#6b7280' }}>${tier.setupFee}</td>
                    ))}
                  </tr>
                  {/* CTA row */}
                  <tr>
                    <td style={{ padding: '16px' }} />
                    {TIERS_SORTED.map(tier => {
                      const color = TIER_COLORS[tier.slug] || ACCENT;
                      return (
                        <td key={tier.slug} style={{ padding: '12px 8px' }}>
                          <Link href={`/services/${tier.slug}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', padding: '9px 8px', background: color, color: '#fff', borderRadius: '8px', fontWeight: 700, fontSize: '12px', textDecoration: 'none' }}>
                            View <ArrowRight size={12} />
                          </Link>
                        </td>
                      );
                    })}
                  </tr>
                </tbody>
              </table>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: 'clamp(72px,10vw,110px) 20px', background: '#ffffff' }}>
        <FadeUp>
          <div style={{ maxWidth: '580px', margin: '0 auto', textAlign: 'center' }}>
            <h2 style={{ fontSize: 'clamp(26px,4vw,44px)', fontWeight: 900, color: '#111827', lineHeight: 1.08, letterSpacing: '-0.5px', marginBottom: '16px' }}>
              Not Sure Where to Start?
            </h2>
            <p style={{ fontSize: '16px', color: '#6b7280', marginBottom: '36px', lineHeight: 1.7 }}>
              Book a free audit. I&apos;ll look at your business and tell you exactly which plan makes sense — no upsell, no pressure.
            </p>
            <Link href="/#contact" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '16px 36px', background: ACCENT, color: '#fff', borderRadius: '50px', fontWeight: 700, fontSize: '16px', textDecoration: 'none', boxShadow: '0 10px 36px rgba(42,165,160,0.4)' }}>
              Get My Free Audit <ArrowRight size={18} />
            </Link>
          </div>
        </FadeUp>
      </section>

      {/* Add-ons note */}
      <div style={{ background: '#f8fafc', borderTop: '1px solid rgba(0,0,0,0.06)', padding: '20px', textAlign: 'center' }}>
        <p style={{ fontSize: '13px', color: '#9ca3af', margin: 0 }}>
          Need crypto payments, e-commerce, or accessibility compliance? See{' '}
          <Link href="/services/add-ons" style={{ color: ACCENT, fontWeight: 600, textDecoration: 'none' }}>Add-On Services →</Link>
        </p>
      </div>
    </>
  );
}
