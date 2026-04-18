'use client';
import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

const TEAL = '#2AA5A0';

const faqs = [
  { q:'How long does it take to go live?',                a:'Most AI systems and websites are live within 7–14 days. A basic AI chatbot can be live in 3–5 days. Complex CRM integrations or full funnels take 2–3 weeks. We set a realistic timeline on the free audit call — no surprises.' },
  { q:'Do I need any technical knowledge?',               a:'None at all. You explain your business, I build the tech. Most clients have zero technical background and are live in under 2 weeks. You never touch a line of code.' },
  { q:'What if I want to cancel?',                        a:'No lock-in, no penalties. Give 30 days written notice and you\'re done. No contracts, no cancellation fees, no awkward conversations. You own everything we built — it\'s yours.' },
  { q:'Will the AI actually sound like a human?',         a:"Modern AI is indistinguishable in most conversations. Your chatbot is trained specifically on your business — your tone, your FAQs, your pricing, your service area. It's not a generic bot — it knows your business." },
  { q:'How long before SEO shows results?',               a:"SEO is a long-term investment — most clients see meaningful movement in 3–6 months. That said, technical fixes and Google Business Profile optimisation can show results much faster. I focus on sustainable rankings, not tricks that get penalised later." },
  { q:'Can you work with my existing website?',           a:"Yes — I can optimise what you have or build from scratch. The recommendation depends on what's holding you back. If your site is slow, outdated, or built on a platform I can't properly optimise, a rebuild is usually the faster and cheaper path long-term." },
  { q:"What's included in the free AI audit?",            a:"A plain-English breakdown of where AI, SEO, or a better website would have the biggest impact on your business. I look at your site, your competitors, your Google visibility, and your current lead process. No pitch, no pressure — just honest advice." },
  { q:'Do you accept crypto payment?',                    a:'Yes. I accept Bitcoin, USDC, and major stablecoins. I also build crypto payment infrastructure for businesses that want to accept crypto from their own customers.' },
];

export default function FAQ() {
  const reduced = useReducedMotion();
  const [active, setActive] = useState(null);

  return (
    <section className="panel" id="p7" aria-label="Frequently asked questions about AIandWEBservices">
      {/* Background */}
      <div style={{ position:'absolute', inset:0, background:'linear-gradient(160deg,#0c1526 0%,#0f1e3d 50%,#0a1628 100%)', zIndex:0 }}>
        <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(42,165,160,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(42,165,160,.04) 1px,transparent 1px)', backgroundSize:'56px 56px' }} />
        <div style={{ position:'absolute', bottom:0, right:0, width:600, height:500, background:'radial-gradient(circle,rgba(42,165,160,.08) 0%,transparent 70%)', filter:'blur(80px)', pointerEvents:'none' }} />
      </div>

      <div className="faq-inner">
        <div style={{ position:'relative', zIndex:1, display:'flex', flexDirection:'column', height:'100%' }}>

          {/* Header */}
          <motion.div
            initial={{ opacity:0, y: reduced ? 0 : 18 }}
            whileInView={{ opacity:1, y:0, transition:{ duration:.6, ease:[0.22,1,0.36,1] } }}
            viewport={{ once:true, amount:.05 }}
            style={{ marginBottom:28, display:'flex', alignItems:'flex-end', justifyContent:'space-between', flexWrap:'wrap', gap:16 }}
          >
            <div>
              <div className="fq-eyebrow">FAQ</div>

              <h2 className="fq-h2">Questions people<br/><span className="fq-h2-accent">always ask.</span></h2>
              <p className="fq-sub">Click any question. Honest answer, no sales spin.</p>
            </div>
            <div className="fq-cta-card">
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
                <div style={{ width:32, height:32, borderRadius:9, background:'rgba(42,165,160,.15)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <MessageCircle size={15} color={TEAL}/>
                </div>
                <div>
                  <div style={{ fontSize:13, fontWeight:700, color:'#fff' }}>Still have questions?</div>
                  <div style={{ fontSize:11, color:'rgba(255,255,255,.4)' }}>Get real answers on the free audit.</div>
                </div>
              </div>
              <button className="fq-cta" onClick={() => window.go && window.go(7)}>
                Get Your Free Audit
              </button>
            </div>
          </motion.div>

          {/* FAQ grid */}
          <div className="fq-grid">
            {faqs.map((item, i) => {
              const isOpen = active === i;
              return (
                <motion.div
                  key={item.q}
                  initial={{ opacity:0, y: reduced ? 0 : 14 }}
                  whileInView={{ opacity:1, y:0, transition:{ duration:.5, ease:[0.22,1,0.36,1], delay: i * 0.04 } }}
                  viewport={{ once:true, amount:.05 }}
                  className={`fq-card${isOpen ? ' fq-card-open' : ''}`}
                  onClick={() => setActive(isOpen ? null : i)}
                >
                  {/* Number */}
                  <div className="fq-num" style={{ color: isOpen ? TEAL : 'rgba(255,255,255,.15)' }}>
                    {String(i + 1).padStart(2, '0')}
                  </div>

                  {/* Question */}
                  <div className="fq-question" style={{ color: isOpen ? '#fff' : 'rgba(255,255,255,.75)' }}>
                    {item.q}
                  </div>

                  {/* Animated answer */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height:0, opacity:0 }}
                        animate={{ height:'auto', opacity:1, transition:{ duration:.35, ease:[0.22,1,0.36,1] } }}
                        exit={{ height:0, opacity:0, transition:{ duration:.2 } }}
                        style={{ overflow:'hidden' }}
                      >
                        <p className="fq-answer">{item.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Expand indicator */}
                  <div className="fq-indicator" style={{ background: isOpen ? `${TEAL}22` : 'rgba(255,255,255,.06)', borderColor: isOpen ? `${TEAL}50` : 'rgba(255,255,255,.1)' }}>
                    <motion.span
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration:.25, ease:[0.22,1,0.36,1] }}
                      style={{ fontSize:16, color: isOpen ? TEAL : 'rgba(255,255,255,.35)', display:'block', lineHeight:1 }}
                    >
                      +
                    </motion.span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Bottom action chips */}
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:10, flexWrap:'wrap', paddingTop:20, paddingBottom:8 }}>
            <a href="#" onClick={e=>{e.preventDefault();window.go&&window.go(7)}} className="fq-chip fq-chip-primary">Get Your Free Audit</a>
            <a href="#" onClick={e=>{e.preventDefault();window.go&&window.go(8)}} className="fq-chip">Contact David Directly</a>
            <a href="/blog" className="fq-chip">Read the Blog</a>
          </div>

        </div>
      </div>

      <style>{`
        .faq-inner { height:100%;display:flex;flex-direction:column;padding:80px 6vw 40px;overflow-y:auto; }

        .fq-eyebrow { display:block;font-size:11px;font-weight:800;letter-spacing:3px;text-transform:uppercase;color:#2AA5A0;margin-bottom:10px; }
        .fq-edot { width:5px;height:5px;border-radius:50%;background:#2AA5A0;display:inline-block;animation:fqPulse 2s ease-in-out infinite; }
        @keyframes fqPulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(.75)} }
        .fq-h2 { font-family:'Plus Jakarta Sans',sans-serif;font-size:clamp(26px,3vw,42px);font-weight:800;letter-spacing:-1px;line-height:1.1;color:#fff;margin-bottom:6px; }
        .fq-h2-accent { color:#2AA5A0; }
        .fq-sub { font-size:13px;color:rgba(255,255,255,.4); }

        .fq-cta-card { background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:14px;padding:16px 18px;min-width:240px; }
        .fq-cta { display:flex;align-items:center;justify-content:center;gap:7px;width:100%;background:linear-gradient(135deg,#2AA5A0,#33BDB8);color:#fff;border:none;border-radius:50px;padding:10px 18px;font-size:12px;font-weight:700;cursor:pointer;font-family:'Inter',sans-serif;box-shadow:0 4px 14px rgba(42,165,160,.3);transition:all .25s; }
        .fq-cta:hover { transform:translateY(-1px);box-shadow:0 8px 22px rgba(42,165,160,.45); }

        /* Grid of cards */
        .fq-grid { display:grid;grid-template-columns:1fr 1fr;gap:10px;flex:1;align-content:start; }

        .fq-card {
          position:relative;
          background:rgba(255,255,255,.03);
          border:1px solid rgba(255,255,255,.07);
          border-radius:14px;padding:18px 48px 18px 18px;
          cursor:pointer;transition:all .25s;
        }
        .fq-card:hover { background:rgba(255,255,255,.055);border-color:rgba(255,255,255,.13); }
        .fq-card-open { background:rgba(42,165,160,.07) !important;border-color:rgba(42,165,160,.25) !important; }

        .fq-num { font-family:'Plus Jakarta Sans',sans-serif;font-size:11px;font-weight:800;letter-spacing:1px;margin-bottom:6px;transition:color .25s; }
        .fq-question { font-size:13px;font-weight:700;line-height:1.4;transition:color .25s;font-family:'Plus Jakarta Sans',sans-serif; }
        .fq-answer { font-size:12px;color:rgba(255,255,255,.55);line-height:1.75;margin:10px 0 0;padding-top:10px;border-top:1px solid rgba(42,165,160,.2); }

        .fq-indicator {
          position:absolute;top:16px;right:16px;
          width:26px;height:26px;border-radius:8px;
          border:1px solid;
          display:flex;align-items:center;justify-content:center;
          transition:background .25s,border-color .25s;
          flex-shrink:0;
        }

        .fq-chip { display:inline-flex;align-items:center;padding:8px 18px;border-radius:50px;font-size:12px;font-weight:700;font-family:'Inter',sans-serif;border:1px solid rgba(42,165,160,.3);color:rgba(42,165,160,.9);background:rgba(42,165,160,.08);cursor:pointer;text-decoration:none;transition:all .22s; }
        .fq-chip:hover { background:rgba(42,165,160,.16);border-color:rgba(42,165,160,.5); }
        .fq-chip-primary { background:linear-gradient(135deg,#2AA5A0,#33BDB8);color:#fff;border-color:transparent;box-shadow:0 4px 14px rgba(42,165,160,.3); }
        .fq-chip-primary:hover { transform:translateY(-1px);box-shadow:0 8px 22px rgba(42,165,160,.45);color:#fff; }

        @media (max-width:768px) {
          .fq-grid { grid-template-columns:1fr; }
          .fq-cta-card { display:none; }
          .faq-inner { padding:80px 5vw 48px; }
        }
      `}</style>
    </section>
  );
}
