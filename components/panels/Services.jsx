'use client';
import { motion, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import { Bot, Sprout, TrendingUp, Zap, Brain, Target, Wallet, ShoppingCart, Eye } from 'lucide-react';

const PLANS = [
  { icon:Sprout,      color:'#34d399', name:'Presence',       price:'99',  setup:'39',  tag:'Foundation',    tagC:'#34d399', href:'/services/presence',         desc:'Professional website, local SEO, Google Business, basic AI assistant.' },
  { icon:TrendingUp,  color:'#60a5fa', name:'Growth',         price:'149', setup:'59',  tag:'Most Popular',  tagC:'#60a5fa', href:'/services/growth',           desc:'Everything in Presence + AI automation, email marketing, SEO content.' },
  { icon:Zap,         color:'#a78bfa', name:'Revenue Engine', price:'249', setup:'99',  tag:'Best Value',    tagC:'#a78bfa', href:'/services/revenue-engine',   desc:'Full sales funnel, workflow automation, paid ads, CRM, monthly strategy call.', popular:true },
  { icon:Brain,       color:'#f59e0b', name:'AI-First',       price:'349', setup:'199', tag:'Full Power',    tagC:'#f59e0b', href:'/services/ai-first',         desc:'Advanced AI pipelines, voice AI, programmatic SEO, social automation.' },
  { icon:Target,      color:'#f87171', name:'Consulting',     price:'99',  setup:null,  tag:'Strategy',      tagC:'#f87171', href:'/services/consulting',       desc:'AI readiness audit, roadmap, unbiased tool recommendations. One-time or monthly.', once:true },
];

function PlanCard({ plan, delay }) {
  const { icon:Icon, color, name, price, setup, tag, tagC, href, desc, popular, once } = plan;
  const reduced = useReducedMotion();
  return (
    <motion.div
      initial={{ opacity:0, y: reduced ? 0 : 32 }}
      whileInView={{ opacity:1, y:0, transition:{ duration:.65, ease:[0.22,1,0.36,1], delay } }}
      viewport={{ once:true, amount:.05 }}
      className={`svc-plan-card${popular ? ' svc-plan-popular' : ''}`}
    >
      {popular && <div className="svc-pop-glow" />}
      <div style={{ position:'relative', zIndex:1 }}>
        {/* Tag */}
        <div className="svc-tag" style={{ color:tagC, background:`${tagC}18`, border:`1px solid ${tagC}35` }}>{tag}</div>

        {/* Icon */}
        <div className="svc-plan-icon" style={{ background:`${color}18` }}>
          <Icon size={22} color={color} strokeWidth={1.75} />
        </div>

        <div className="svc-plan-name">{name}</div>
        <div className="svc-plan-desc">{desc}</div>

        {/* Price */}
        <div className="svc-plan-price-row">
          <span className="svc-plan-price">
            <span style={{ fontSize:14, verticalAlign:'top', marginTop:4, display:'inline-block', color:'rgba(255,255,255,.6)' }}>$</span>
            {price}
          </span>
          <span className="svc-plan-per">{once ? ' one-time' : '/mo'}</span>
        </div>
        {setup && (
          <div className="svc-plan-setup">+ ${setup} one-time setup</div>
        )}
        {!setup && (
          <div className="svc-plan-setup">or $99/month ongoing</div>
        )}

        <Link href={href} className="svc-plan-btn" style={{ background: popular ? `linear-gradient(135deg,${color},${color}cc)` : undefined }}>
          Learn More
        </Link>
      </div>
    </motion.div>
  );
}

export default function Services() {
  const reduced = useReducedMotion();
  const f = (d = 0) => ({
    initial:     { opacity:0, y: reduced ? 0 : 24 },
    whileInView: { opacity:1, y:0, transition:{ duration:.6, ease:[0.22,1,0.36,1], delay:d } },
    viewport:    { once:true, amount:.05 },
  });

  return (
    <section className="panel" id="services" aria-label="AIandWEBservices pricing and packages — AI automation, web development, SEO for small business">
      {/* Navy background */}
      <div style={{ position:'absolute', inset:0, background:'linear-gradient(160deg,#0f1e3d 0%,#162444 60%,#0d1a35 100%)', zIndex:0 }}>
        <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(42,165,160,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(42,165,160,.035) 1px,transparent 1px)', backgroundSize:'56px 56px' }} />
      </div>

      <div className="pricing-inner" style={{ background:'transparent', position:'relative', zIndex:1 }}>

        {/* Header */}
        <motion.div {...f(0)} style={{ textAlign:'center', marginBottom:28 }}>
          <div className="svc-eyebrow">SERVICES &amp; PRICING</div>
          <h2 className="svc-h2">
            Everything you need to grow.<br />
            <span className="svc-h2-accent">Nothing you don&apos;t.</span>
          </h2>
          <p className="svc-sub">Transparent pricing. No lock-in contracts. Cancel or pause anytime.</p>
        </motion.div>

        {/* AI Automation Starter — standalone hero card */}
        <motion.div {...f(0.08)} className="svc-starter-card" id="pricing-ai-starter">
          <div className="svc-starter-glow" />
          <div style={{ position:'relative', zIndex:1, display:'flex', alignItems:'center', gap:20, flexWrap:'wrap' }}>
            <div className="svc-starter-icon">
              <Bot size={28} color="#60a5fa" strokeWidth={1.75} />
            </div>
            <div style={{ flex:1, minWidth:200 }}>
              <div className="svc-starter-eyebrow">Standalone — just the AI, no website needed</div>
              <div className="svc-starter-name">AI Automation Starter</div>
              <div className="svc-starter-desc">A custom AI system trained on your business. Captures leads, answers FAQs, books calls — 24/7.</div>
            </div>
            <div style={{ textAlign:'right', flexShrink:0 }}>
              <div className="svc-starter-price"><sup>$</sup>99</div>
              <div className="svc-starter-per">setup · then $99/mo</div>
              <Link href="/services/ai-automation-starter" className="svc-starter-btn">Get More Info</Link>
            </div>
          </div>
        </motion.div>

        {/* Plans grid */}
        <div className="svc-plans-grid">
          {PLANS.map((p, i) => <PlanCard key={p.name} plan={p} delay={0.1 + i * 0.07} />)}
        </div>

        {/* Add-ons strip */}
        <motion.div {...f(0.5)} className="svc-addons-row">
          {[
            { icon:Wallet,       label:'Crypto Payments',   price:'$299 setup' },
            { icon:ShoppingCart, label:'E-commerce Store',  price:'$499 setup' },
            { icon:Eye,          label:'WCAG Accessibility',price:'$199 setup' },
          ].map(({ icon:Icon, label, price }) => (
            <div key={label} className="svc-addon-chip">
              <Icon size={14} color="#2AA5A0" strokeWidth={1.75} />
              <span className="svc-addon-label">{label}</span>
              <span className="svc-addon-price">{price}</span>
            </div>
          ))}
          <Link href="/services/add-ons" className="svc-addon-chip svc-addon-link">
            View Add-Ons
          </Link>
        </motion.div>

        {/* Bottom action chips */}
        <motion.div {...f(0.55)} style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:10, flexWrap:'wrap', marginTop:20 }}>
          <a href="#" onClick={e=>{e.preventDefault();window.go&&window.go(7)}} className="svc-chip svc-chip-primary">Get Your Free Audit</a>
          <a href="#" onClick={e=>{e.preventDefault();window.go&&window.go(8)}} className="svc-chip">Contact David Directly</a>
          <a href="/blog" className="svc-chip">Read the Blog</a>
        </motion.div>

      </div>

      <style>{`
        .svc-eyebrow { display:block;font-size:11px;font-weight:800;letter-spacing:3px;text-transform:uppercase;color:#2AA5A0;margin-bottom:10px; }
        .svc-h2 { font-family:'Plus Jakarta Sans',sans-serif;font-size:clamp(26px,3vw,40px);font-weight:800;letter-spacing:-1px;line-height:1.15;color:#fff;margin-bottom:8px; }
        .svc-h2-accent { color:#2AA5A0; }
        .svc-sub { font-size:14px;color:rgba(255,255,255,.45);max-width:500px;margin:0 auto; }

        /* Starter card */
        .svc-starter-card {
          position:relative;overflow:hidden;
          background:rgba(96,165,250,.07);
          border:1px solid rgba(96,165,250,.25);
          border-radius:16px;padding:20px 24px;
          margin-bottom:24px;
        }
        .svc-starter-glow { position:absolute;top:-60px;right:-60px;width:200px;height:200px;border-radius:50%;background:rgba(96,165,250,.12);filter:blur(50px);pointer-events:none; }
        .svc-starter-icon { width:52px;height:52px;border-radius:14px;background:rgba(96,165,250,.15);display:flex;align-items:center;justify-content:center;flex-shrink:0; }
        .svc-starter-eyebrow { font-size:9px;font-weight:800;letter-spacing:2px;text-transform:uppercase;color:#60a5fa;margin-bottom:4px; }
        .svc-starter-name { font-family:'Plus Jakarta Sans',sans-serif;font-size:17px;font-weight:800;color:#fff;margin-bottom:3px; }
        .svc-starter-desc { font-size:12px;color:rgba(255,255,255,.5);line-height:1.5; }
        .svc-starter-price { font-family:'Plus Jakarta Sans',sans-serif;font-size:32px;font-weight:800;color:#fff;line-height:1; }
        .svc-starter-price sup { font-size:14px;vertical-align:top;margin-top:5px;display:inline-block;color:rgba(255,255,255,.6); }
        .svc-starter-per { font-size:11px;color:rgba(255,255,255,.4);margin-bottom:8px; }
        .svc-starter-btn { display:inline-block;background:#60a5fa;color:#fff;border:none;border-radius:50px;padding:7px 16px;font-size:11px;font-weight:700;text-decoration:none;transition:all .2s; }
        .svc-starter-btn:hover { background:#93c5fd;transform:translateY(-1px); }

        /* Plans */
        .svc-plans-grid {
          display:grid;grid-template-columns:repeat(5,1fr);gap:12px;margin-bottom:20px;
        }
        .svc-plan-card {
          position:relative;overflow:hidden;
          background:rgba(255,255,255,.04);
          border:1px solid rgba(255,255,255,.08);
          border-radius:16px;padding:18px 16px;
          transition:all .3s;
          display:flex;flex-direction:column;
        }
        .svc-plan-card:hover {
          background:rgba(255,255,255,.07);border-color:rgba(255,255,255,.15);
          transform:translateY(-5px);box-shadow:0 20px 48px rgba(0,0,0,.4);
        }
        .svc-plan-popular {
          border-color:rgba(167,139,250,.4) !important;
          background:rgba(167,139,250,.07) !important;
        }
        .svc-plan-popular:hover { border-color:rgba(167,139,250,.6) !important; }
        .svc-pop-glow { position:absolute;top:-40px;left:50%;transform:translateX(-50%);width:160px;height:120px;border-radius:50%;background:rgba(167,139,250,.15);filter:blur(40px);pointer-events:none; }
        .svc-tag { display:inline-block;font-size:9px;font-weight:800;padding:2px 8px;border-radius:20px;letter-spacing:.5px;text-transform:uppercase;margin-bottom:12px; }
        .svc-plan-icon { width:40px;height:40px;border-radius:10px;display:flex;align-items:center;justify-content:center;margin-bottom:10px; }
        .svc-plan-name { font-family:'Plus Jakarta Sans',sans-serif;font-size:14px;font-weight:800;color:#fff;margin-bottom:6px; }
        .svc-plan-desc { font-size:11px;color:rgba(255,255,255,.45);line-height:1.6;margin-bottom:14px;flex:1; }
        .svc-plan-price-row { display:flex;align-items:baseline;gap:2px;margin-bottom:2px; }
        .svc-plan-price { font-family:'Plus Jakarta Sans',sans-serif;font-size:30px;font-weight:800;color:#fff;line-height:1; }
        .svc-plan-per { font-size:12px;color:rgba(255,255,255,.4);font-weight:600; }
        .svc-plan-setup { font-size:10px;color:rgba(255,255,255,.3);margin-bottom:14px; }
        .svc-plan-btn {
          display:flex;align-items:center;justify-content:center;gap:5px;
          background:rgba(255,255,255,.1);color:#fff;text-decoration:none;
          border-radius:50px;padding:8px 14px;font-size:11px;font-weight:700;
          transition:all .2s;margin-top:auto;
        }
        .svc-plan-btn:hover { background:rgba(255,255,255,.18);transform:translateY(-1px); }

        /* Add-ons */
        .svc-addons-row { display:flex;align-items:center;gap:10px;flex-wrap:wrap;justify-content:center; }
        .svc-addon-chip {
          display:inline-flex;align-items:center;gap:7px;
          background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);
          border-radius:50px;padding:7px 14px;font-size:11px;transition:all .2s;
        }
        .svc-addon-chip:hover { background:rgba(255,255,255,.09);border-color:rgba(255,255,255,.18); }
        .svc-addon-label { color:rgba(255,255,255,.7);font-weight:600; }
        .svc-addon-price { color:rgba(255,255,255,.35); }
        .svc-addon-link  { color:#2AA5A0;text-decoration:none;font-weight:700;border-color:rgba(42,165,160,.3); }
        .svc-addon-link:hover { border-color:rgba(42,165,160,.6) !important;background:rgba(42,165,160,.08) !important; }

        /* Action chips */
        .svc-chip { display:inline-flex;align-items:center;padding:8px 18px;border-radius:50px;font-size:12px;font-weight:700;font-family:'Inter',sans-serif;border:1px solid rgba(42,165,160,.3);color:rgba(42,165,160,.9);background:rgba(42,165,160,.08);cursor:pointer;text-decoration:none;transition:all .22s; }
        .svc-chip:hover { background:rgba(42,165,160,.16);border-color:rgba(42,165,160,.5);color:#2AA5A0; }
        .svc-chip-primary { background:linear-gradient(135deg,#2AA5A0,#33BDB8);color:#fff;border-color:transparent;box-shadow:0 4px 14px rgba(42,165,160,.35); }
        .svc-chip-primary:hover { transform:translateY(-1px);box-shadow:0 8px 22px rgba(42,165,160,.5);color:#fff; }

        @media (max-width:1100px) { .svc-plans-grid { grid-template-columns:repeat(3,1fr); } }
        @media (max-width:768px)  { .svc-plans-grid { grid-template-columns:1fr 1fr; } }
        @media (max-width:480px)  { .svc-plans-grid { grid-template-columns:1fr; } }
      `}</style>
    </section>
  );
}
