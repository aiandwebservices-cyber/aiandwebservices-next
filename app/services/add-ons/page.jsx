'use client';
import { useRef, useState } from 'react';
import Link from 'next/link';
import { motion, useInView, useScroll, useTransform, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Wallet, ShoppingCart, Eye, Check, ChevronDown, ArrowRight, Zap } from 'lucide-react';
import { addOnsContent as c } from '@/content/tiers/add-ons';

const ICON_MAP = { Wallet, ShoppingCart, Eye };
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
  return <motion.div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: '3px', zIndex: 300, background: 'linear-gradient(90deg,#2AA5A0,#33BDB8)', scaleX: scrollYProgress, transformOrigin: '0%' }} />;
}

function AddOnCard({ addon, index }) {
  const [openFaq, setOpenFaq] = useState(null);
  const Icon = ICON_MAP[addon.iconName] || Wallet;
  const colors = ['#2AA5A0','#7C3AED','#059669'];
  const color = colors[index % colors.length];

  return (
    <FadeUp delay={index * 0.12}>
      <div style={{ borderRadius: '24px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{ padding: '32px 28px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: `${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
            <Icon size={24} color={color} strokeWidth={1.5} />
          </div>
          <div style={{ fontSize: '11px', fontWeight: 700, color: color, letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '8px' }}>{addon.tagline}</div>
          <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#fff', lineHeight: 1.2, marginBottom: '12px' }}>{addon.name}</h2>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, margin: 0 }}>{addon.description}</p>
        </div>

        {/* Pricing */}
        <div style={{ padding: '20px 28px', background: `${color}0a`, borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: '20px', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginBottom: '4px' }}>Setup</div>
            <div style={{ fontSize: '26px', fontWeight: 900, color: '#fff' }}>${addon.setupFee}</div>
          </div>
          <div style={{ width: '1px', height: '36px', background: 'rgba(255,255,255,0.1)' }} />
          <div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginBottom: '4px' }}>Monthly</div>
            <div style={{ fontSize: '26px', fontWeight: 900, color }}>+${addon.monthlyFee}/mo</div>
          </div>
        </div>

        {/* Includes */}
        <div style={{ padding: '20px 28px', flex: 1 }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.3)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '12px' }}>What's Included</div>
          {addon.includes.map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: '9px', alignItems: 'flex-start', marginBottom: '9px' }}>
              <Check size={13} color={color} strokeWidth={2.5} style={{ marginTop: '3px', flexShrink: 0 }} />
              <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.65)', lineHeight: 1.5 }}>{item}</span>
            </div>
          ))}
        </div>

        {/* Built for */}
        <div style={{ padding: '16px 28px', background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.3)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '10px' }}>Good Fit If</div>
          {addon.builtForYouIf.map((item, i) => (
            <div key={i} style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, marginBottom: '5px', paddingLeft: '14px', position: 'relative' }}>
              <span style={{ position: 'absolute', left: 0, color }}>›</span> {item}
            </div>
          ))}
        </div>

        {/* Mini FAQ */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          {addon.faq.map((item, i) => (
            <div key={i} style={{ borderBottom: i < addon.faq.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 28px', background: 'none', border: 'none', color: '#fff', fontSize: '13px', fontWeight: 600, cursor: 'pointer', textAlign: 'left', gap: '12px' }}
              >
                <span>{item.q}</span>
                <motion.div animate={{ rotate: openFaq === i ? 180 : 0 }} transition={{ duration: 0.2 }} style={{ flexShrink: 0 }}>
                  <ChevronDown size={15} color="rgba(255,255,255,0.35)" />
                </motion.div>
              </button>
              <AnimatePresence initial={false}>
                {openFaq === i && (
                  <motion.div key="a" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }} style={{ overflow: 'hidden' }}>
                    <div style={{ padding: '0 28px 16px', fontSize: '13px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.7 }}>{item.a}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ padding: '20px 28px' }}>
          <Link href="/#contact" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '14px', background: color, color: '#fff', borderRadius: '12px', fontWeight: 700, fontSize: '14px', textDecoration: 'none', boxShadow: `0 8px 24px ${color}40`, transition: 'all .2s' }}>
            Add to My Plan <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </FadeUp>
  );
}

export default function AddOnsPage() {
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <>
      <ProgressBar />
      <style>{`
        .ao-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
        @media (max-width: 1024px) { .ao-grid { grid-template-columns: 1fr; } }
        @media (max-width: 640px) { .ao-grid { grid-template-columns: 1fr; } }
      `}</style>

      {/* HERO */}
      <section style={{ position: 'relative', minHeight: '60vh', display: 'flex', alignItems: 'center', overflow: 'hidden', background: '#080d18' }}>
        <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', top: '-20%', right: '-5%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(42,165,160,0.18) 0%,transparent 70%)', filter: 'blur(60px)' }} />
          <div style={{ position: 'absolute', bottom: 0, left: '-5%', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(124,58,237,0.12) 0%,transparent 70%)', filter: 'blur(50px)' }} />
        </div>
        <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: 'linear-gradient(rgba(42,165,160,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(42,165,160,0.03) 1px,transparent 1px)', backgroundSize: '60px 60px' }} />

        <motion.div style={{ opacity: heroOpacity, width: '100%' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto', padding: 'clamp(80px,12vw,120px) 20px 60px', textAlign: 'center' }}>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '6px 14px', borderRadius: '50px', background: 'rgba(42,165,160,0.1)', border: '1px solid rgba(42,165,160,0.4)', fontSize: '11px', fontWeight: 700, color: ACCENT, letterSpacing: '1.2px', textTransform: 'uppercase', marginBottom: '24px' }}
            >
              <Zap size={11} /> {c.hero.eyebrow}
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
              style={{ fontSize: 'clamp(34px,5vw,60px)', fontWeight: 900, lineHeight: 1.05, color: '#fff', marginBottom: '20px', letterSpacing: '-1.5px' }}
            >
              {c.hero.headline}<br />
              <span style={{ background: 'linear-gradient(135deg,#2AA5A0,#33BDB8,#7dd3c8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                {c.hero.headlineAccent}
              </span>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
              style={{ fontSize: '18px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, maxWidth: '520px', margin: '0 auto 36px' }}
            >
              {c.hero.subheadline}
            </motion.p>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
              <Link href="/#contact" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '14px 28px', background: ACCENT, color: '#fff', borderRadius: '50px', fontWeight: 700, fontSize: '15px', textDecoration: 'none', boxShadow: '0 8px 28px rgba(42,165,160,0.4)' }}>
                Get a Free Audit <ArrowRight size={16} />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ADD-ON CARDS */}
      <section style={{ padding: 'clamp(72px,10vw,110px) 20px', background: '#111827' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <FadeUp>
            <div style={{ textAlign: 'center', marginBottom: '56px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: ACCENT, marginBottom: '14px' }}>Three Add-Ons</div>
              <h2 style={{ fontSize: 'clamp(26px,4vw,44px)', fontWeight: 900, color: '#fff', lineHeight: 1.1, letterSpacing: '-0.5px' }}>
                Pick the Capability You Need
              </h2>
              <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.5)', marginTop: '14px', maxWidth: '500px', margin: '14px auto 0', lineHeight: 1.7 }}>
                Each add-on layers onto any existing tier — or stands alone if that&apos;s all you need.
              </p>
            </div>
          </FadeUp>
          <div className="ao-grid">
            {c.addOns.map((addon, i) => (
              <AddOnCard key={addon.slug} addon={addon} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: 'clamp(72px,10vw,110px) 20px', background: '#080d18', position: 'relative', overflow: 'hidden' }}>
        <div aria-hidden style={{ position: 'absolute', top: '-30%', left: '50%', transform: 'translateX(-50%)', width: '700px', height: '700px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(42,165,160,0.14) 0%,transparent 60%)', filter: 'blur(80px)', pointerEvents: 'none' }} />
        <FadeUp>
          <div style={{ maxWidth: '580px', margin: '0 auto', textAlign: 'center', position: 'relative' }}>
            <h2 style={{ fontSize: 'clamp(28px,4.5vw,48px)', fontWeight: 900, color: '#fff', lineHeight: 1.05, letterSpacing: '-1px', marginBottom: '16px' }}>
              Not Sure Which Add-On?
            </h2>
            <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.5)', marginBottom: '36px', lineHeight: 1.7 }}>
              Book a free audit. I&apos;ll tell you which (if any) makes sense for your business right now.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/#contact" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '15px 32px', background: ACCENT, color: '#fff', borderRadius: '50px', fontWeight: 700, fontSize: '15px', textDecoration: 'none', boxShadow: '0 10px 36px rgba(42,165,160,0.45)' }}>
                Get My Free Audit <ArrowRight size={16} />
              </Link>
              <Link href="/services/compare" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '15px 24px', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.7)', borderRadius: '50px', fontWeight: 600, fontSize: '15px', textDecoration: 'none' }}>
                Compare All Plans
              </Link>
            </div>
          </div>
        </FadeUp>
      </section>

      {/* Tier nav */}
      <div style={{ background: '#080d18', borderTop: '1px solid rgba(255,255,255,0.05)', padding: '20px', display: 'flex', justifyContent: 'center' }}>
        <Link href="/services/compare" style={{ fontSize: '13px', color: ACCENT, textDecoration: 'none', padding: '9px 18px', borderRadius: '10px', border: '1px solid rgba(42,165,160,0.3)', fontWeight: 700 }}>
          ← Compare All Plans
        </Link>
      </div>
    </>
  );
}
