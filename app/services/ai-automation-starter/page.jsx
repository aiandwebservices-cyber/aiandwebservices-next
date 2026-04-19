'use client';
import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import {
  motion, useInView, useScroll, useTransform,
  AnimatePresence, useReducedMotion,
} from 'framer-motion';
import {
  Bot, Calendar, Target, Network, BarChart3,
  Check, X, ChevronDown, ArrowRight, Zap, Clock, TrendingUp,
} from 'lucide-react';
import { getTier } from '@/lib/pricing';
import { starterContent as c } from '@/content/tiers/ai-automation-starter';

/* ─── Icon map ─────────────────────────────────────────────────────────── */
const ICONS = { Bot, Calendar, Target, Network, BarChart3 };

/* ─── Scroll-triggered fade-up wrapper ─────────────────────────────────── */
function FadeUp({ children, delay = 0, style, className }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const reduce = useReducedMotion();
  return (
    <motion.div
      ref={ref}
      initial={reduce ? false : { opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      style={style}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── Animated number counter ───────────────────────────────────────────── */
function Counter({ to, prefix = '', suffix = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const dur = 1400;
    const step = to / (dur / 16);
    let cur = 0;
    const t = setInterval(() => {
      cur += step;
      if (cur >= to) { setVal(to); clearInterval(t); }
      else setVal(Math.floor(cur));
    }, 16);
    return () => clearInterval(t);
  }, [inView, to]);
  return <span ref={ref}>{prefix}{val}{suffix}</span>;
}

/* ─── Sticky scroll-progress bar ───────────────────────────────────────── */
function ProgressBar() {
  const { scrollYProgress } = useScroll();
  return (
    <motion.div
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: '3px', zIndex: 300,
        background: 'linear-gradient(90deg,#2AA5A0,#33BDB8,#7dd3c8)',
        scaleX: scrollYProgress, transformOrigin: '0%',
      }}
    />
  );
}

/* ─── Chat UI mockup (hero right column) ───────────────────────────────── */
function ChatMockup() {
  return (
    <div style={{
      borderRadius: '24px', maxWidth: '420px', margin: '0 auto',
      background: 'linear-gradient(135deg,rgba(255,255,255,.06) 0%,rgba(255,255,255,.02) 100%)',
      border: '1px solid rgba(255,255,255,.1)',
      padding: '24px',
      boxShadow: '0 24px 80px rgba(0,0,0,.55)',
      backdropFilter: 'blur(20px)',
    }}>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', gap:'12px', paddingBottom:'16px', marginBottom:'16px', borderBottom:'1px solid rgba(255,255,255,.08)' }}>
        <div style={{ width:'40px', height:'40px', borderRadius:'50%', background:'linear-gradient(135deg,#2AA5A0,#1B2A4A)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
          <Bot size={20} color="#fff" strokeWidth={1.5} />
        </div>
        <div>
          <div style={{ fontSize:'14px', fontWeight:700, color:'#fff' }}>Your AI Assistant</div>
          <div style={{ display:'flex', alignItems:'center', gap:'5px', fontSize:'12px', color:'#2AA5A0' }}>
            <span style={{ width:'6px', height:'6px', borderRadius:'50%', background:'#2AA5A0', display:'inline-block' }} />
            Online 24 / 7
          </div>
        </div>
      </div>

      {/* Conversation */}
      <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
        {[
          { side:'bot', text:"Hi! I'm here to help. What brings you in today? 👋", delay:0.7 },
          { side:'user', text:"How much does a kitchen remodel cost?", delay:1.2 },
          { side:'bot', text:"Most kitchens run $12K–$45K depending on size and finishes. I can book you a free estimate — want to grab a time? 📅", delay:1.8 },
          { side:'user', text:"Yes please!", delay:2.3 },
        ].map(({ side, text, delay }) => (
          <motion.div key={delay}
            initial={{ opacity:0, x: side==='bot' ? -10 : 10 }}
            animate={{ opacity:1, x:0 }}
            transition={{ delay, duration:0.4 }}
            style={{ display:'flex', justifyContent: side==='user' ? 'flex-end' : 'flex-start', alignItems:'flex-end', gap:'8px' }}
          >
            {side === 'bot' && (
              <div style={{ width:'26px', height:'26px', borderRadius:'50%', background:'rgba(42,165,160,.2)', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
                <Bot size={13} color="#2AA5A0" />
              </div>
            )}
            <div style={{
              borderRadius: side==='bot' ? '16px 16px 16px 4px' : '16px 16px 4px 16px',
              background: side==='bot' ? 'rgba(42,165,160,.15)' : 'rgba(255,255,255,.1)',
              padding:'10px 14px', fontSize:'13px', lineHeight:1.5,
              color:'rgba(255,255,255,.9)', maxWidth:'260px',
            }}>{text}</div>
          </motion.div>
        ))}

        {/* Booking confirmation */}
        <motion.div
          initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:2.7, duration:0.4 }}
          style={{ borderRadius:'12px', padding:'12px 14px', fontSize:'13px', lineHeight:1.5, color:'#86efac', background:'rgba(16,185,129,.1)', border:'1px solid rgba(16,185,129,.2)' }}
        >
          ✓ Booked! Thursday at 2pm. Confirmation sent to your email.
        </motion.div>
      </div>

      <div style={{ marginTop:'16px', paddingTop:'16px', borderTop:'1px solid rgba(255,255,255,.07)', display:'flex', alignItems:'center', justifyContent:'center', gap:'6px', fontSize:'12px', color:'rgba(255,255,255,.3)' }}>
        <Zap size={11} color="#2AA5A0" /> Responded in 2 seconds · 2:47 AM
      </div>
    </div>
  );
}

/* ─── PAGE ──────────────────────────────────────────────────────────────── */
export default function AIAutomationStarterPage() {
  const tier = getTier('ai-automation-starter');
  const [openFaq, setOpenFaq] = useState(null);
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const heroY = useTransform(scrollY, [0, 400], [0, -50]);

  if (!tier) return null;

  const yearTotal = tier.setupFee + tier.monthlyFee * 12;

  return (
    <>
      <ProgressBar />

      <style>{`
        .ais-hero-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
        }
        .ais-stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          text-align: center;
        }
        .ais-problem-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }
        .ais-features-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 16px;
        }
        .ais-pricing-includes {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 32px;
          margin-bottom: 40px;
        }
        .ais-cta-btns {
          display: flex;
          gap: 12px;
          justify-content: center;
          flex-wrap: wrap;
        }
        .ais-tier-nav {
          display: flex;
          justify-content: center;
          gap: 16px;
          flex-wrap: wrap;
        }
        @media (max-width: 900px) {
          .ais-hero-grid { grid-template-columns: 1fr; }
          .ais-problem-grid { grid-template-columns: 1fr; }
          .ais-features-grid { grid-template-columns: repeat(2, 1fr); }
          .ais-stats-grid { grid-template-columns: 1fr; gap: 32px; }
          .ais-pricing-includes { grid-template-columns: 1fr; }
        }
        @media (max-width: 600px) {
          .ais-features-grid { grid-template-columns: 1fr; }
        }
        .ais-hero-chat { display: block; }
        @media (max-width: 900px) { .ais-hero-chat { display: none; } }
        .ais-cmp-row { display: grid; grid-template-columns: 1fr 120px 120px; gap: 16px; padding: 16px 24px; }
        @media (max-width: 600px) { .ais-cmp-row { grid-template-columns: 1fr 80px 80px; gap: 8px; padding: 12px 16px; } }
        .ais-hover-card { transition: border-color .2s, transform .2s; }
        .ais-hover-card:hover { border-color: rgba(42,165,160,.4) !important; transform: translateY(-2px); }
        .ais-faq-btn:hover { background: rgba(42,165,160,.04); }
        .ais-link-btn:hover { background: rgba(255,255,255,.05) !important; color: #fff !important; }
      `}</style>

      {/* ══════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════ */}
      <section style={{ position:'relative', minHeight:'100vh', display:'flex', alignItems:'center', overflow:'hidden', background:'#080d18' }}>
        {/* Orbs */}
        <div aria-hidden style={{ position:'absolute', inset:0, pointerEvents:'none' }}>
          <div style={{ position:'absolute', top:'-15%', right:'-5%', width:'700px', height:'700px', borderRadius:'50%', background:'radial-gradient(circle,rgba(42,165,160,.2) 0%,transparent 70%)', filter:'blur(50px)' }} />
          <div style={{ position:'absolute', bottom:'-15%', left:'-8%', width:'600px', height:'600px', borderRadius:'50%', background:'radial-gradient(circle,rgba(27,42,74,.9) 0%,transparent 70%)', filter:'blur(60px)' }} />
          <div style={{ position:'absolute', top:'45%', left:'35%', width:'400px', height:'400px', borderRadius:'50%', background:'radial-gradient(circle,rgba(42,165,160,.07) 0%,transparent 70%)', filter:'blur(40px)' }} />
        </div>
        {/* Grid */}
        <div aria-hidden style={{ position:'absolute', inset:0, pointerEvents:'none', backgroundImage:'linear-gradient(rgba(42,165,160,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(42,165,160,.03) 1px,transparent 1px)', backgroundSize:'60px 60px' }} />

        <motion.div style={{ opacity:heroOpacity, y:heroY, width:'100%' }}>
          <div style={{ maxWidth:'1200px', margin:'0 auto', padding:'clamp(90px,12vw,130px) 24px 80px' }}>
            <div className="ais-hero-grid">
              {/* Left */}
              <div>
                <motion.div
                  initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.45 }}
                  style={{ display:'inline-flex', alignItems:'center', gap:'7px', padding:'6px 14px', borderRadius:'50px', border:'1px solid rgba(42,165,160,.4)', background:'rgba(42,165,160,.1)', fontSize:'11px', fontWeight:700, color:'#2AA5A0', letterSpacing:'1.2px', textTransform:'uppercase', marginBottom:'28px' }}
                >
                  <Zap size={11} /> AI Automation Starter
                </motion.div>

                <motion.h1
                  initial={{ opacity:0, y:28 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6, delay:0.1 }}
                  style={{ fontSize:'clamp(38px,5.5vw,66px)', fontWeight:900, lineHeight:1.04, color:'#fff', marginBottom:'24px', letterSpacing:'-1.5px' }}
                >
                  {c.hero.headline}<br />
                  <span style={{ background:'linear-gradient(135deg,#2AA5A0 0%,#33BDB8 50%,#7dd3c8 100%)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
                    {c.hero.headlineAccent}
                  </span>
                </motion.h1>

                <motion.p
                  initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6, delay:0.2 }}
                  style={{ fontSize:'18px', color:'rgba(255,255,255,.6)', lineHeight:1.7, marginBottom:'40px', maxWidth:'480px' }}
                >
                  {c.hero.subheadline}
                </motion.p>

                <motion.div
                  initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6, delay:0.3 }}
                  style={{ display:'flex', gap:'12px', flexWrap:'wrap', marginBottom:'32px' }}
                >
                  <Link
                    href="/contact"
                    style={{ display:'inline-flex', alignItems:'center', gap:'8px', padding:'14px 28px', background:'#2AA5A0', color:'#fff', borderRadius:'50px', fontWeight:700, fontSize:'15px', textDecoration:'none', boxShadow:'0 8px 32px rgba(42,165,160,.45)', transition:'all .2s' }}
                  >
                    Get My Free Audit <ArrowRight size={16} />
                  </Link>
                  <a
                    href="#how-it-works"
                    style={{ display:'inline-flex', alignItems:'center', gap:'8px', padding:'14px 24px', border:'1px solid rgba(255,255,255,.18)', color:'rgba(255,255,255,.7)', borderRadius:'50px', fontWeight:600, fontSize:'15px', textDecoration:'none', transition:'all .2s' }}
                  >
                    See how it works
                  </a>
                </motion.div>

                <motion.div
                  initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ duration:0.6, delay:0.5 }}
                  style={{ display:'flex', gap:'20px', flexWrap:'wrap' }}
                >
                  {[`$${tier.setupFee} one-time setup`, `$${tier.monthlyFee}/mo after`, c.deliveryTime+' delivery', 'No contracts'].map(t => (
                    <div key={t} style={{ display:'flex', alignItems:'center', gap:'6px', fontSize:'13px', color:'rgba(255,255,255,.4)' }}>
                      <Check size={13} color="#2AA5A0" strokeWidth={2.5} /> {t}
                    </div>
                  ))}
                </motion.div>
              </div>

              {/* Right — chat UI */}
              <motion.div
                className="ais-hero-chat"
                initial={{ opacity:0, x:40, scale:0.96 }} animate={{ opacity:1, x:0, scale:1 }}
                transition={{ duration:0.8, delay:0.35, ease:[0.21,0.47,0.32,0.98] }}
              >
                <ChatMockup />
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════════
          STATS STRIP
      ══════════════════════════════════════════════════════ */}
      <section style={{ background:'rgba(42,165,160,.07)', borderTop:'1px solid rgba(42,165,160,.15)', borderBottom:'1px solid rgba(42,165,160,.15)', padding:'40px 24px' }}>
        <div style={{ maxWidth:'800px', margin:'0 auto' }}>
          <div className="ais-stats-grid">
            {[
              { Icon:Clock,      val:5,  pre:'<', suf:' sec', label:'Average AI response time' },
              { Icon:TrendingUp, val:80, pre:'',  suf:'%',    label:'Of inquiries handled automatically' },
              { Icon:Zap,        val:24, pre:'',  suf:'/7',   label:'Always on — nights, weekends, holidays' },
            ].map(({ Icon, val, pre, suf, label }) => (
              <FadeUp key={label}>
                <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'8px' }}>
                  <Icon size={22} color="#2AA5A0" strokeWidth={1.5} />
                  <div style={{ fontSize:'clamp(32px,4.5vw,52px)', fontWeight:900, color:'#fff', lineHeight:1 }}>
                    <Counter to={val} prefix={pre} suffix={suf} />
                  </div>
                  <div style={{ fontSize:'13px', color:'rgba(255,255,255,.45)', maxWidth:'160px', textAlign:'center', lineHeight:1.5 }}>{label}</div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          PROBLEM
      ══════════════════════════════════════════════════════ */}
      <section style={{ padding:'clamp(80px,10vw,120px) 24px', background:'#111827' }}>
        <div style={{ maxWidth:'1100px', margin:'0 auto' }}>
          <FadeUp>
            <div style={{ textAlign:'center', marginBottom:'64px' }}>
              <div style={{ fontSize:'11px', fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', color:'#2AA5A0', marginBottom:'16px' }}>The Problem</div>
              <h2 style={{ fontSize:'clamp(28px,4vw,48px)', fontWeight:900, color:'#fff', lineHeight:1.08, letterSpacing:'-0.5px', marginBottom:'20px' }}>
                {c.problem.heading}
              </h2>
              <p style={{ fontSize:'16px', color:'rgba(255,255,255,.5)', maxWidth:'580px', margin:'0 auto', lineHeight:1.7 }}>
                {c.problem.body}
              </p>
            </div>
          </FadeUp>

          <div className="ais-problem-grid">
            {c.problem.cards.map((card, i) => (
              <FadeUp key={i} delay={i * 0.12}>
                <div className="ais-hover-card" style={{ position:'relative', borderRadius:'18px', padding:'32px', background:'linear-gradient(135deg,rgba(255,255,255,.04) 0%,rgba(255,255,255,.02) 100%)', border:'1px solid rgba(255,255,255,.08)', overflow:'hidden', height:'100%' }}>
                  <div style={{ position:'absolute', top:'16px', right:'20px', fontSize:'48px', fontWeight:900, color:'rgba(239,68,68,.1)', lineHeight:1, userSelect:'none' }}>0{i+1}</div>
                  <div style={{ width:'40px', height:'3px', background:'#ef4444', borderRadius:'2px', marginBottom:'20px' }} />
                  <h3 style={{ fontSize:'20px', fontWeight:800, color:'#fff', marginBottom:'12px', lineHeight:1.2 }}>{card.title}</h3>
                  <p style={{ fontSize:'14px', color:'rgba(255,255,255,.55)', lineHeight:1.75, margin:0 }}>{card.body}</p>
                </div>
              </FadeUp>
            ))}
          </div>

          <FadeUp delay={0.35}>
            <div style={{ marginTop:'48px', textAlign:'center', padding:'24px 32px', borderRadius:'14px', background:'rgba(42,165,160,.1)', border:'1px solid rgba(42,165,160,.22)' }}>
              <p style={{ fontSize:'18px', fontWeight:700, color:'#2AA5A0', margin:0 }}>{c.problem.closingLine}</p>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          FEATURES
      ══════════════════════════════════════════════════════ */}
      <section style={{ padding:'clamp(80px,10vw,120px) 24px', background:'#0d1117' }}>
        <div style={{ maxWidth:'1200px', margin:'0 auto' }}>
          <FadeUp>
            <div style={{ textAlign:'center', marginBottom:'56px' }}>
              <div style={{ fontSize:'11px', fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', color:'#2AA5A0', marginBottom:'16px' }}>What's Included</div>
              <h2 style={{ fontSize:'clamp(28px,4vw,48px)', fontWeight:900, color:'#fff', lineHeight:1.08, letterSpacing:'-0.5px' }}>
                Built & Managed for You
              </h2>
            </div>
          </FadeUp>

          <div className="ais-features-grid">
            {c.features.map((f, i) => {
              const Icon = ICONS[f.iconName] || Bot;
              return (
                <FadeUp key={i} delay={i * 0.07}>
                  <div className="ais-hover-card" style={{ borderRadius:'18px', padding:'28px 22px', background:'linear-gradient(135deg,rgba(42,165,160,.08) 0%,rgba(255,255,255,.02) 100%)', border:'1px solid rgba(42,165,160,.14)', height:'100%' }}>
                    <div style={{ width:'46px', height:'46px', borderRadius:'13px', background:'rgba(42,165,160,.15)', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'16px' }}>
                      <Icon size={22} color="#2AA5A0" strokeWidth={1.5} />
                    </div>
                    <h3 style={{ fontSize:'14px', fontWeight:700, color:'#fff', marginBottom:'8px', lineHeight:1.3 }}>{f.name}</h3>
                    <p style={{ fontSize:'13px', color:'rgba(255,255,255,.45)', lineHeight:1.6, margin:0 }}>{f.description}</p>
                  </div>
                </FadeUp>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          TIMELINE
      ══════════════════════════════════════════════════════ */}
      <section id="how-it-works" style={{ padding:'clamp(80px,10vw,120px) 24px', background:'#111827' }}>
        <div style={{ maxWidth:'860px', margin:'0 auto' }}>
          <FadeUp>
            <div style={{ textAlign:'center', marginBottom:'80px' }}>
              <div style={{ fontSize:'11px', fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', color:'#2AA5A0', marginBottom:'16px' }}>How It Works</div>
              <h2 style={{ fontSize:'clamp(28px,4vw,48px)', fontWeight:900, color:'#fff', lineHeight:1.08, letterSpacing:'-0.5px' }}>
                Live in {c.deliveryTime}
              </h2>
            </div>
          </FadeUp>

          <div style={{ position:'relative' }}>
            {/* Connecting line */}
            <div aria-hidden style={{ position:'absolute', left:'23px', top:'28px', bottom:'28px', width:'2px', background:'linear-gradient(to bottom,#2AA5A0,rgba(42,165,160,.08))', borderRadius:'2px' }} />

            <div style={{ display:'flex', flexDirection:'column', gap:'32px', paddingLeft:'76px' }}>
              {c.timeline.map((step, i) => (
                <FadeUp key={i} delay={i * 0.14}>
                  <div style={{ position:'relative' }}>
                    {/* Step dot */}
                    <div style={{ position:'absolute', left:'-76px', top:'8px', width:'48px', height:'48px', borderRadius:'50%', background:'#111827', border:'2px solid #2AA5A0', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'15px', fontWeight:800, color:'#2AA5A0', boxShadow:'0 0 0 6px rgba(42,165,160,.08)' }}>{i + 1}</div>
                    <div className="ais-hover-card" style={{ padding:'28px 32px', borderRadius:'18px', background:'rgba(255,255,255,.025)', border:'1px solid rgba(255,255,255,.07)' }}>
                      <div style={{ fontSize:'11px', fontWeight:700, letterSpacing:'1.2px', textTransform:'uppercase', color:'#2AA5A0', marginBottom:'8px' }}>{step.label}</div>
                      <h3 style={{ fontSize:'20px', fontWeight:800, color:'#fff', marginBottom:'10px' }}>{step.heading}</h3>
                      <p style={{ fontSize:'14px', color:'rgba(255,255,255,.55)', lineHeight:1.75, margin:0 }}>{step.description}</p>
                    </div>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          PRICING
      ══════════════════════════════════════════════════════ */}
      <section style={{ padding:'clamp(80px,10vw,120px) 24px', background:'#080d18', position:'relative', overflow:'hidden' }}>
        <div aria-hidden style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:'700px', height:'700px', borderRadius:'50%', background:'radial-gradient(circle,rgba(42,165,160,.14) 0%,transparent 65%)', filter:'blur(70px)', pointerEvents:'none' }} />

        <div style={{ maxWidth:'700px', margin:'0 auto', position:'relative' }}>
          <FadeUp>
            <div style={{ textAlign:'center', marginBottom:'48px' }}>
              <div style={{ fontSize:'11px', fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', color:'#2AA5A0', marginBottom:'16px' }}>Pricing</div>
              <h2 style={{ fontSize:'clamp(28px,4vw,48px)', fontWeight:900, color:'#fff', lineHeight:1.08, letterSpacing:'-0.5px' }}>
                Simple, Transparent Pricing
              </h2>
            </div>
          </FadeUp>

          <FadeUp delay={0.12}>
            <div style={{ borderRadius:'26px', background:'linear-gradient(135deg,rgba(42,165,160,.13) 0%,rgba(27,42,74,.6) 100%)', border:'1px solid rgba(42,165,160,.3)', padding:'clamp(32px,5vw,52px)', boxShadow:'0 0 100px rgba(42,165,160,.18)', backdropFilter:'blur(24px)' }}>

              {/* Price boxes */}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px', marginBottom:'40px' }}>
                <div style={{ textAlign:'center', padding:'28px 20px', borderRadius:'18px', background:'rgba(255,255,255,.05)', border:'1px solid rgba(255,255,255,.1)' }}>
                  <div style={{ fontSize:'12px', color:'rgba(255,255,255,.4)', marginBottom:'10px', fontWeight:600, letterSpacing:'0.5px' }}>One-Time Setup</div>
                  <div style={{ fontSize:'clamp(40px,6vw,56px)', fontWeight:900, color:'#fff', lineHeight:1 }}>${tier.setupFee}</div>
                  <div style={{ fontSize:'12px', color:'rgba(255,255,255,.3)', marginTop:'6px' }}>paid once</div>
                </div>
                <div style={{ textAlign:'center', padding:'28px 20px', borderRadius:'18px', background:'rgba(42,165,160,.18)', border:'1px solid rgba(42,165,160,.35)' }}>
                  <div style={{ fontSize:'12px', color:'rgba(42,165,160,.8)', marginBottom:'10px', fontWeight:600, letterSpacing:'0.5px' }}>Monthly</div>
                  <div style={{ fontSize:'clamp(40px,6vw,56px)', fontWeight:900, color:'#2AA5A0', lineHeight:1 }}>${tier.monthlyFee}</div>
                  <div style={{ fontSize:'12px', color:'rgba(42,165,160,.55)', marginTop:'6px' }}>cancel anytime</div>
                </div>
              </div>

              {/* Includes */}
              <div className="ais-pricing-includes">
                <div>
                  <div style={{ fontSize:'11px', fontWeight:700, letterSpacing:'1.2px', textTransform:'uppercase', color:'rgba(255,255,255,.35)', marginBottom:'16px' }}>Setup Includes</div>
                  {c.setupIncludes.map((item, i) => (
                    <div key={i} style={{ display:'flex', gap:'10px', alignItems:'flex-start', marginBottom:'10px' }}>
                      <Check size={13} color="#2AA5A0" strokeWidth={2.5} style={{ marginTop:'3px', flexShrink:0 }} />
                      <span style={{ fontSize:'13px', color:'rgba(255,255,255,.65)', lineHeight:1.5 }}>{item}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <div style={{ fontSize:'11px', fontWeight:700, letterSpacing:'1.2px', textTransform:'uppercase', color:'rgba(255,255,255,.35)', marginBottom:'16px' }}>Monthly Includes</div>
                  {c.monthlyIncludes.map((item, i) => (
                    <div key={i} style={{ display:'flex', gap:'10px', alignItems:'flex-start', marginBottom:'10px' }}>
                      <Check size={13} color="#2AA5A0" strokeWidth={2.5} style={{ marginTop:'3px', flexShrink:0 }} />
                      <span style={{ fontSize:'13px', color:'rgba(255,255,255,.65)', lineHeight:1.5 }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTAs */}
              <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
                <Link
                  href={tier.setupLinkLong}
                  style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'8px', padding:'16px', background:'#2AA5A0', color:'#fff', borderRadius:'14px', fontWeight:700, fontSize:'15px', textDecoration:'none', boxShadow:'0 10px 30px rgba(42,165,160,.45)', transition:'all .2s' }}
                >
                  {c.pricingCta} <ArrowRight size={16} />
                </Link>
                <Link
                  href="/contact"
                  style={{ display:'flex', alignItems:'center', justifyContent:'center', padding:'14px', border:'1px solid rgba(255,255,255,.12)', color:'rgba(255,255,255,.6)', borderRadius:'14px', fontWeight:600, fontSize:'14px', textDecoration:'none', transition:'all .2s' }}
                >
                  Get a free audit first — no obligation
                </Link>
              </div>

              <div style={{ marginTop:'20px', textAlign:'center', fontSize:'12px', color:'rgba(255,255,255,.28)' }}>
                1-year total: ${yearTotal} · {c.deliveryTime} delivery · no contracts
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          BUILT FOR YOU IF
      ══════════════════════════════════════════════════════ */}
      <section style={{ padding:'clamp(80px,10vw,120px) 24px', background:'#111827' }}>
        <div style={{ maxWidth:'900px', margin:'0 auto' }}>
          <FadeUp>
            <div style={{ textAlign:'center', marginBottom:'56px' }}>
              <div style={{ fontSize:'11px', fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', color:'#2AA5A0', marginBottom:'16px' }}>Built For You If</div>
              <h2 style={{ fontSize:'clamp(28px,4vw,48px)', fontWeight:900, color:'#fff', lineHeight:1.08, letterSpacing:'-0.5px' }}>
                Is This the Right Fit?
              </h2>
            </div>
          </FadeUp>

          <div style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
            {c.builtForYouIf.map((item, i) => (
              <FadeUp key={i} delay={i * 0.1}>
                <div style={{ display:'flex', gap:'18px', alignItems:'center', padding:'22px 28px', borderRadius:'16px', background:'rgba(42,165,160,.06)', border:'1px solid rgba(42,165,160,.14)' }}>
                  <div style={{ width:'36px', height:'36px', borderRadius:'50%', background:'rgba(42,165,160,.2)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <Check size={17} color="#2AA5A0" strokeWidth={2.5} />
                  </div>
                  <p style={{ fontSize:'16px', color:'rgba(255,255,255,.8)', lineHeight:1.5, margin:0, fontWeight:500 }}>{item}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          COMPARISON TABLE
      ══════════════════════════════════════════════════════ */}
      <section style={{ padding:'clamp(80px,10vw,120px) 24px', background:'#0d1117' }}>
        <div style={{ maxWidth:'860px', margin:'0 auto' }}>
          <FadeUp>
            <div style={{ textAlign:'center', marginBottom:'56px' }}>
              <div style={{ fontSize:'11px', fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', color:'#2AA5A0', marginBottom:'16px' }}>Why Not DIY?</div>
              <h2 style={{ fontSize:'clamp(28px,4vw,48px)', fontWeight:900, color:'#fff', lineHeight:1.08, letterSpacing:'-0.5px' }}>
                Us vs. {c.comparisons.vsLabel}
              </h2>
            </div>
          </FadeUp>

          <FadeUp delay={0.1}>
            <div style={{ borderRadius:'20px', overflow:'hidden', border:'1px solid rgba(255,255,255,.08)' }}>
              {/* Header */}
              <div className="ais-cmp-row" style={{ background:'rgba(42,165,160,.15)', padding:'16px 24px' }}>
                <div style={{ fontSize:'11px', fontWeight:700, color:'rgba(255,255,255,.35)', textTransform:'uppercase', letterSpacing:'1px' }}>Feature</div>
                <div style={{ fontSize:'11px', fontWeight:700, color:'#2AA5A0', textTransform:'uppercase', letterSpacing:'1px', textAlign:'center' }}>Us</div>
                <div style={{ fontSize:'11px', fontWeight:700, color:'rgba(255,255,255,.35)', textTransform:'uppercase', letterSpacing:'1px', textAlign:'center' }}>{c.comparisons.vsLabel}</div>
              </div>

              {c.comparisons.rows.map((row, i) => {
                const isTotal = row.feature === '1-Year Total';
                return (
                  <div key={i} className="ais-cmp-row" style={{
                    background: isTotal ? 'rgba(42,165,160,.08)' : i % 2 === 0 ? 'rgba(255,255,255,.015)' : 'transparent',
                    borderTop: isTotal ? '1px solid rgba(42,165,160,.2)' : 'none',
                    borderBottom: i < c.comparisons.rows.length - 1 && !isTotal ? '1px solid rgba(255,255,255,.05)' : 'none',
                  }}>
                    <div style={{ fontSize:'14px', color:'rgba(255,255,255,.78)', fontWeight: isTotal ? 700 : 400, lineHeight:1.4 }}>{row.feature}</div>
                    <div style={{ textAlign:'center', display:'flex', alignItems:'center', justifyContent:'center' }}>
                      {row.us === true  ? <Check size={18} color="#10b981" strokeWidth={2.5} /> :
                       row.us === false ? <X size={18} color="#ef4444" strokeWidth={2.5} /> :
                       <span style={{ fontSize:'14px', fontWeight:800, color:'#2AA5A0' }}>${yearTotal}</span>}
                    </div>
                    <div style={{ textAlign:'center', display:'flex', alignItems:'center', justifyContent:'center' }}>
                      {row.them === true  ? <Check size={18} color="#10b981" strokeWidth={2.5} /> :
                       row.them === false ? <X size={18} color="#ef4444" strokeWidth={2.5} /> :
                       <span style={{ fontSize:'13px', fontWeight:700, color:'#f87171' }}>{row.them}</span>}
                    </div>
                  </div>
                );
              })}
            </div>
            <p style={{ fontSize:'13px', color:'rgba(255,255,255,.35)', textAlign:'center', marginTop:'16px' }}>
              {c.comparisons.rows[c.comparisons.rows.length - 1].themCost}
            </p>
          </FadeUp>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          FAQ
      ══════════════════════════════════════════════════════ */}
      <section style={{ padding:'clamp(80px,10vw,120px) 24px', background:'#111827' }}>
        <div style={{ maxWidth:'760px', margin:'0 auto' }}>
          <FadeUp>
            <div style={{ textAlign:'center', marginBottom:'60px' }}>
              <div style={{ fontSize:'11px', fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', color:'#2AA5A0', marginBottom:'16px' }}>FAQ</div>
              <h2 style={{ fontSize:'clamp(28px,4vw,48px)', fontWeight:900, color:'#fff', lineHeight:1.08, letterSpacing:'-0.5px' }}>Questions? Good.</h2>
            </div>
          </FadeUp>

          <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
            {c.faq.map((item, i) => (
              <FadeUp key={i} delay={i * 0.04}>
                <div style={{ borderRadius:'14px', border:'1px solid rgba(255,255,255,.07)', overflow:'hidden', background: openFaq === i ? 'rgba(42,165,160,.06)' : 'rgba(255,255,255,.02)', transition:'background .2s' }}>
                  <button
                    className="ais-faq-btn"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'20px 24px', background:'none', border:'none', color:'#fff', fontSize:'15px', fontWeight:600, cursor:'pointer', textAlign:'left', gap:'16px', transition:'background .2s' }}
                  >
                    <span>{item.q}</span>
                    <motion.div animate={{ rotate: openFaq === i ? 180 : 0 }} transition={{ duration:0.22 }} style={{ flexShrink:0 }}>
                      <ChevronDown size={18} color="rgba(255,255,255,.35)" />
                    </motion.div>
                  </button>
                  <AnimatePresence initial={false}>
                    {openFaq === i && (
                      <motion.div
                        key="body"
                        initial={{ height:0, opacity:0 }} animate={{ height:'auto', opacity:1 }} exit={{ height:0, opacity:0 }}
                        transition={{ duration:0.26 }}
                        style={{ overflow:'hidden' }}
                      >
                        <div style={{ padding:'0 24px 22px', fontSize:'14px', color:'rgba(255,255,255,.55)', lineHeight:1.75 }}>
                          {item.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          FINAL CTA
      ══════════════════════════════════════════════════════ */}
      <section style={{ padding:'clamp(100px,12vw,140px) 24px', background:'linear-gradient(135deg,#080d18 0%,#111827 50%,#080d18 100%)', position:'relative', overflow:'hidden' }}>
        <div aria-hidden style={{ position:'absolute', top:'-40%', left:'50%', transform:'translateX(-50%)', width:'900px', height:'900px', borderRadius:'50%', background:'radial-gradient(circle,rgba(42,165,160,.16) 0%,transparent 60%)', filter:'blur(80px)', pointerEvents:'none' }} />
        <FadeUp>
          <div style={{ maxWidth:'660px', margin:'0 auto', textAlign:'center', position:'relative' }}>
            <div style={{ fontSize:'11px', fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', color:'#2AA5A0', marginBottom:'20px' }}>Ready?</div>
            <h2 style={{ fontSize:'clamp(36px,6vw,64px)', fontWeight:900, color:'#fff', lineHeight:1.02, letterSpacing:'-1.5px', marginBottom:'20px' }}>
              Stop Losing Leads<br />
              <span style={{ background:'linear-gradient(135deg,#2AA5A0,#33BDB8)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
                While You Sleep
              </span>
            </h2>
            <p style={{ fontSize:'17px', color:'rgba(255,255,255,.5)', marginBottom:'44px', lineHeight:1.7 }}>
              Get a free audit first. I'll tell you exactly where AI can help — no pitch, no obligation, within 6 hours.
            </p>
            <div className="ais-cta-btns">
              <Link
                href="/contact"
                style={{ display:'inline-flex', alignItems:'center', gap:'8px', padding:'17px 38px', background:'#2AA5A0', color:'#fff', borderRadius:'50px', fontWeight:700, fontSize:'16px', textDecoration:'none', boxShadow:'0 14px 48px rgba(42,165,160,.55)', transition:'all .2s' }}
              >
                Get My Free Audit <ArrowRight size={18} />
              </Link>
              <Link
                href={tier.setupLinkLong}
                style={{ display:'inline-flex', alignItems:'center', gap:'8px', padding:'17px 30px', border:'1px solid rgba(255,255,255,.18)', color:'rgba(255,255,255,.75)', borderRadius:'50px', fontWeight:600, fontSize:'15px', textDecoration:'none', transition:'all .2s' }}
              >
                Pay Setup — ${tier.setupFee}
              </Link>
            </div>
            <p style={{ fontSize:'13px', color:'rgba(255,255,255,.28)', marginTop:'22px' }}>
              Delivered in {c.deliveryTime} · ${tier.monthlyFee}/mo · No contracts · Cancel anytime
            </p>
          </div>
        </FadeUp>
      </section>

      {/* ══════════════════════════════════════════════════════
          TIER NAV
      ══════════════════════════════════════════════════════ */}
      <div style={{ background:'#080d18', borderTop:'1px solid rgba(255,255,255,.05)', padding:'24px' }}>
        <div className="ais-tier-nav">
          <Link href="/services/presence" className="ais-link-btn" style={{ fontSize:'13px', color:'rgba(255,255,255,.38)', textDecoration:'none', padding:'9px 18px', borderRadius:'10px', border:'1px solid rgba(255,255,255,.07)', transition:'all .2s' }}>← Presence</Link>
          <Link href="/services/compare" style={{ fontSize:'13px', color:'#2AA5A0', textDecoration:'none', padding:'9px 18px', borderRadius:'10px', border:'1px solid rgba(42,165,160,.3)', fontWeight:700 }}>Compare All Plans</Link>
          <Link href="/services/growth" className="ais-link-btn" style={{ fontSize:'13px', color:'rgba(255,255,255,.38)', textDecoration:'none', padding:'9px 18px', borderRadius:'10px', border:'1px solid rgba(255,255,255,.07)', transition:'all .2s' }}>Growth →</Link>
        </div>
      </div>
    </>
  );
}
