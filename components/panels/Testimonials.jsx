'use client';
import { motion, useReducedMotion } from 'framer-motion';
import { Quote, Star } from 'lucide-react';

// ── FLIP TO true WHEN YOU HAVE REAL TESTIMONIALS ──
const SHOW_TESTIMONIALS = false;

const TEAL = '#2AA5A0';

const testimonials = [
  {
    quote: "David built our AI chatbot in under two weeks. We went from losing after-hours leads to booking calls at 3am. Setup was painless and the system paid for itself in the first month.",
    name:  'Alex R.',
    role:  'Home Services Company',
    stars: 5,
  },
  {
    quote: "I was skeptical about AI for my law firm. David gave me an honest assessment, built exactly what I needed, and didn't try to oversell me. The chatbot handles 60% of our intake inquiries now.",
    name:  'Maria T.',
    role:  'Legal Practice',
    stars: 5,
  },
  {
    quote: "The Growth package transformed our online presence. We went from zero organic leads to 30+ per month within six months. David's SEO and automation work together seamlessly.",
    name:  'James K.',
    role:  'B2B Consulting Firm',
    stars: 5,
  },
];

export default function Testimonials() {
  const reduced = useReducedMotion();

  if (!SHOW_TESTIMONIALS) return null;

  const fade = (delay = 0) => ({
    initial:     { opacity: 0, y: reduced ? 0 : 28 },
    whileInView: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22,1,0.36,1], delay } },
    viewport:    { once: true, amount: 0.05 },
  });

  return (
    <section
      className="panel"
      id="testimonials"
      aria-label="Client testimonials — AIandWEBservices results"
    >
      <div style={{ position:'absolute', inset:0, background:'#111827', zIndex:0 }}>
        <div style={{ position:'absolute', top:'20%', left:'5%', width:400, height:400, borderRadius:'50%', background:'radial-gradient(circle,rgba(42,165,160,.07) 0%,transparent 70%)', filter:'blur(60px)', pointerEvents:'none' }} />
      </div>

      <div className="testi-inner" style={{ position:'relative', zIndex:1 }}>

        <motion.div {...fade(0)} style={{ textAlign:'center', marginBottom:40 }}>
          <div className="panel-eyebrow" style={{ color:TEAL }}>Testimonials</div>
          <h2 className="panel-h2" style={{ color:'#fff', marginTop:0 }}>What clients say</h2>
          <p className="panel-sub" style={{ color:'rgba(255,255,255,.5)' }}>Real results from real businesses.</p>
        </motion.div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:24, flex:1 }}>
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              {...fade(0.1 + i * 0.1)}
              style={{
                background:'rgba(255,255,255,.04)',
                border:'1px solid rgba(42,165,160,.2)',
                borderRadius:18,
                padding:'28px 24px',
                display:'flex', flexDirection:'column', gap:16,
                transition:'all .3s',
              }}
              whileHover={{ y: -4, transition: { duration: 0.25 } }}
            >
              <Quote size={28} color={TEAL} style={{ opacity:0.7, flexShrink:0 }} />
              <p style={{ color:'#fff', fontSize:'1.05rem', lineHeight:1.7, flex:1, margin:0, fontStyle:'italic' }}>
                &ldquo;{t.quote}&rdquo;
              </p>
              <div style={{ display:'flex', gap:3 }}>
                {Array.from({ length: t.stars }).map((_, si) => (
                  <Star key={si} size={14} fill={TEAL} color={TEAL} />
                ))}
              </div>
              <div>
                <div style={{ fontWeight:700, color:'#fff', fontSize:'0.95rem' }}>{t.name}</div>
                <div style={{ color:'rgba(255,255,255,.4)', fontSize:'0.82rem', marginTop:2 }}>{t.role}</div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
