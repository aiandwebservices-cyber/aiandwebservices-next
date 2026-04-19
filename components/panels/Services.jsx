'use client';
import { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import { Bot, Sprout, TrendingUp, Zap, Brain, Settings, Wallet, ShoppingCart, Eye } from 'lucide-react';

const PLANS = [
  {
    icon:Sprout, color:'#34d399', name:'Presence', price:'99', setup:'49', tag:'Foundation', tagC:'#34d399', href:'/services/presence',
    desc:'Get found, look professional, and capture leads after hours.',
    bullets:[
      'Professional 5-page website',
      'Local SEO + Google Business Profile setup',
      'Monthly SEO + site health report (traffic, rankings, speed, uptime)',
      '1 blog post per month',
    ],
  },
  {
    icon:TrendingUp, color:'#60a5fa', name:'Growth', price:'179', setup:'79', tag:'Most Popular', tagC:'#60a5fa', href:'/services/growth',
    desc:'Everything in Presence, plus automation that keeps your pipeline full.',
    bullets:[
      'Everything in Presence',
      'CRM-integrated AI — qualifies & books leads',
      '5–7 email welcome sequence',
      '2 SEO articles/mo (24+ pages/yr)',
      'Conversion-optimised landing pages',
    ],
  },
  {
    icon:Zap, color:'#a78bfa', name:'Revenue Engine', price:'249', setup:'149', tag:'Best Value', tagC:'#a78bfa', href:'/services/revenue-engine',
    desc:'A complete sales machine — funnel, ads, CRM, and automation all connected.',
    bullets:[
      'Everything in Growth',
      'Custom sales funnel — click to contract',
      'Workflow automation (no more manual tasks)',
      'Google or Meta ads setup & management',
      'CRM integration across every touchpoint',
      'Monthly 60-min strategy call with David',
    ],
    popular:true,
  },
  {
    icon:Brain, color:'#f59e0b', name:'AI-First', price:'499', setup:'299', tag:'Full Power', tagC:'#f59e0b', href:'/services/ai-first',
    desc:'Advanced AI across your entire operation — voice, content, social, and data.',
    bullets:[
      'Everything in Revenue Engine',
      'Voice AI — answers calls, books appointments',
      'Programmatic SEO (100s of pages auto-generated)',
      'AI social media — 365 posts/yr scheduled',
      'Custom business dashboard (leads, revenue, ads)',
    ],
  },
  {
    icon:Settings, color:'#2AA5A0', name:'Consulting', tag:'Flexible', tagC:'#9ca3af', href:'/contact',
    desc:'Not every problem fits a tier. Pick what you need, combined however you want.',
    bullets:[
      'AI readiness audit',
      'One-time chatbot build',
      'Tech stack consultation',
      'Custom integration',
      'Hourly strategy calls',
    ],
    consulting:true,
  },
];

function PlanCard({ plan, delay, isMobile }) {
  const { icon:Icon, color, name, price, setup, tag, tagC, href, desc, bullets, popular, once, consulting } = plan;
  const reduced = useReducedMotion();
  const skip = isMobile || reduced;
  return (
    <motion.div
      initial={{ opacity: skip ? 1 : 0, y: skip ? 0 : 32 }}
      whileInView={skip ? undefined : { opacity:1, y:0, transition:{ duration:.65, ease:[0.22,1,0.36,1], delay } }}
      viewport={{ once:true, amount:.05 }}
      className={`svc-plan-card${popular ? ' svc-plan-popular' : ''}`}
    >
      {popular && <div className="svc-pop-glow" />}
      <div style={{ position:'relative', zIndex:1, display:'flex', flexDirection:'column', flex:1 }}>
        {/* Tag row with icon top-right */}
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:12 }}>
          <div className="svc-tag" style={{ color:tagC, margin:0 }}>{tag}</div>
          <div className="svc-plan-icon" style={{ background:`${color}18`, margin:0, flexShrink:0 }}>
            <Icon size={22} color={color} strokeWidth={1.75} />
          </div>
        </div>

        <div className="svc-plan-name" style={{ color }}>{name}</div>
        <div className="svc-plan-desc">{desc}</div>

        {/* Bullets */}
        {bullets && (
          <ul className="svc-plan-bullets">
            {bullets.map(b => <li key={b}>{b}</li>)}
          </ul>
        )}

        {/* Price + CTA pinned to bottom */}
        <div style={{ marginTop:'auto' }}>
          {consulting ? (
            <>
              <div className="svc-plan-price-row">
                <span className="svc-plan-price" style={{ fontSize:16, color:'#374151' }}>Pick what you need</span>
              </div>
              <div className="svc-plan-setup">Fair pricing based on scope</div>
            </>
          ) : (
            <>
              <div className="svc-plan-price-row">
                <span className="svc-plan-price">
                  <span style={{ fontSize:14, verticalAlign:'top', marginTop:4, display:'inline-block', color:'rgba(255,255,255,.6)' }}>$</span>
                  {price}
                </span>
                <span className="svc-plan-per">{once ? ' one-time' : '/mo'}</span>
              </div>
              {setup ? (
                <div className="svc-plan-setup">+ ${setup} one-time setup</div>
              ) : (
                <div className="svc-plan-setup">or $99/month ongoing</div>
              )}
            </>
          )}

          <Link
            href={href}
            className="svc-plan-btn"
            style={popular
              ? { background:'linear-gradient(135deg,#a78bfa,#8b5cf6)', color:'#fff', border:'none', '--tier-color':'#a78bfa' }
              : { borderColor: color, color, '--tier-color': color }}
          >
            {consulting ? 'Start a Custom Project →' : 'Learn More'}
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default function Services() {
  const reduced = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => { setIsMobile(window.matchMedia('(max-width:768px)').matches); }, []);
  const skip = isMobile || reduced;
  const f = (d = 0) => ({
    initial:     { opacity: skip ? 1 : 0, y: skip ? 0 : 24 },
    whileInView: skip ? undefined : { opacity:1, y:0, transition:{ duration:.6, ease:[0.22,1,0.36,1], delay:d } },
    viewport:    { once:true, amount:.05 },
  });

  return (
    <section className="panel" id="services" aria-label="AIandWEBservices pricing and packages — AI automation, web development, SEO for small business">
      {/* Light blue background */}
      <div style={{ position:'absolute', inset:0, background:'linear-gradient(160deg,#eff6ff 0%,#f0fafa 50%,#eff6ff 100%)', zIndex:0 }}>
        <div style={{ position:'absolute', inset:0, backgroundImage:'radial-gradient(rgba(59,130,246,.07) 1px,transparent 1px)', backgroundSize:'28px 28px' }} />
        <div style={{ position:'absolute', top:0, right:0, width:500, height:400, background:'radial-gradient(circle,rgba(42,165,160,.1) 0%,transparent 70%)', filter:'blur(80px)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:0, left:0, width:400, height:400, background:'radial-gradient(circle,rgba(59,130,246,.08) 0%,transparent 70%)', filter:'blur(80px)', pointerEvents:'none' }} />
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
          <div className="svc-starter-grid">

            {/* Col 1 — identity */}
            <div className="svc-starter-left">
              <div className="svc-starter-eyebrow">
                <Bot size={11} color="#3b82f6" strokeWidth={2} />
                Standalone · AI Chatbot
              </div>
              <div className="svc-starter-name">AI Automation Starter</div>
              <div className="svc-starter-desc">A custom AI trained on your business — captures leads, answers FAQs, and books calls 24/7.</div>
            </div>

            {/* Col 2 — setup bullets */}
            <div className="svc-starter-col svc-starter-bullets-col">
              <div className="svc-starter-col-label">Setup includes</div>
              {['Discovery call (60 min)', 'Custom AI training on your business', 'Calendar integration (Google, Calendly, Acuity)', 'CRM integration (HubSpot, Pipedrive, Zoho, any CRM)'].map(b => (
                <div key={b} className="svc-starter-bullet">
                  <span className="svc-starter-check">✓</span>{b}
                </div>
              ))}
            </div>

            {/* Col 3 — monthly bullets */}
            <div className="svc-starter-col svc-starter-bullets-col">
              <div className="svc-starter-col-label">Monthly includes</div>
              {['Monthly performance report (conversations, leads, bookings)'].map(b => (
                <div key={b} className="svc-starter-bullet">
                  <span className="svc-starter-check">✓</span>{b}
                </div>
              ))}
            </div>

            {/* Mobile-only: 3-bullet summary (hidden on desktop) */}
            <ul className="svc-starter-bullets-mobile">
              <li><span className="svc-starter-check">✓</span>AI Automation System (qualifies leads 24/7)</li>
              <li><span className="svc-starter-check">✓</span>Calendar + CRM Integration</li>
              <li><span className="svc-starter-check">✓</span>30-day launch monitoring &amp; training</li>
            </ul>

            {/* Col 4 — price + CTA */}
            <div className="svc-starter-price-col">
              <div className="svc-starter-price"><sup>$</sup>99</div>
              <div className="svc-starter-per">one-time setup</div>
              <div className="svc-starter-per">then $99/mo</div>
              <Link href="/services/ai-automation-starter" className="svc-starter-btn">Get More Info →</Link>
            </div>

          </div>
        </motion.div>

        {/* Plans grid */}
        <div className="svc-plans-grid">
          {PLANS.map((p, i) => <PlanCard key={p.name} plan={p} delay={0.1 + i * 0.07} isMobile={isMobile} />)}
        </div>

        {/* Add-ons divider */}
        <motion.div {...f(0.45)} className="svc-addons-label">
          <span>ADD-ONS</span>
        </motion.div>

        {/* Add-ons cards */}
        <motion.div {...f(0.5)} className="svc-addons-grid">
          {[
            {
              icon: Wallet, color: '#a78bfa', label: 'Crypto Payments', price: '$299 setup',
              desc: 'Accept Bitcoin, ETH, and stablecoins without the technical headache.',
              bullets: ['Multi-chain wallet support', 'Stablecoin checkout flows', 'Payment analytics'],
            },
            {
              icon: ShoppingCart, color: '#34d399', label: 'E-commerce Store', price: '$499 setup',
              desc: 'Shopify or WooCommerce — fast, converting, built to scale.',
              bullets: ['Shopify or WooCommerce', 'Speed & conversion optimised', 'Order management'],
            },
            {
              icon: Eye, color: '#60a5fa', label: 'WCAG Accessibility', price: '$199 setup',
              desc: 'Full WCAG 2.1 AA compliance. Protect your business, reach more customers.',
              bullets: ['WCAG 2.1 AA compliance', 'Screen reader & keyboard audit', 'Compliance report'],
            },
          ].map(({ icon: Icon, color, label, price, desc, bullets }, i) => (
            <motion.div
              key={label}
              className="svc-addon-card"
              initial={{ opacity:0, y: 20 }}
              whileInView={{ opacity:1, y:0, transition:{ duration:.5, ease:[0.22,1,0.36,1], delay: 0.5 + i * 0.08 } }}
              viewport={{ once:true, amount:.05 }}
              style={{ borderColor: `${color}25` }}
            >
              {/* Header row: name + icon top-right */}
              <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:4 }}>
                <div>
                  <div className="svc-addon-card-name" style={{ color }}>{label}</div>
                  <div className="svc-addon-card-price">{price}</div>
                </div>
                <div className="svc-addon-card-icon" style={{ background: `${color}18`, flexShrink:0 }}>
                  <Icon size={18} color={color} strokeWidth={1.75} />
                </div>
              </div>
              <div className="svc-addon-card-desc">{desc}</div>
              <ul className="svc-addon-card-bullets">
                {bullets.map(b => <li key={b}>{b}</li>)}
              </ul>
              <Link href="/services/add-ons" className="svc-addon-card-btn" style={{ borderColor: `${color}99`, color }}>
                Learn More
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA card */}
        <motion.div {...f(0.55)} className="panel-cta-wrap svc-cta-wrap">
          <div className="panel-cta-card">
            <p className="panel-cta-title">Not sure which plan fits your business?</p>
            <p className="panel-cta-sub">Tell me your goals — I&apos;ll recommend the right tier.</p>
            <a className="panel-cta-btn" href="/contact">Get a free audit →</a>
          </div>
        </motion.div>

      </div>

      <style>{`
        .svc-eyebrow { display:block;font-size:11px;font-weight:800;letter-spacing:3px;text-transform:uppercase;color:#2AA5A0;margin-bottom:10px; }
        .svc-h2 { font-family:'Plus Jakarta Sans',sans-serif;font-size:clamp(26px,3.5vw,46px);font-weight:800;letter-spacing:-1px;line-height:1.15;color:#111827;margin-bottom:8px; }
        .svc-h2-accent { color:#2AA5A0; }
        .svc-sub { font-size:14px;color:#6b7280;max-width:500px;margin:0 auto; }

        /* Starter card */
        .svc-starter-card {
          position:relative;overflow:hidden;
          background:#fff;
          border:1px solid rgba(59,130,246,.25);
          border-left:4px solid #3b82f6;
          border-radius:16px;padding:18px 24px;min-height:0;
          margin-bottom:20px;
          box-shadow:0 4px 24px rgba(59,130,246,.12);
        }
        .svc-starter-glow { position:absolute;top:-60px;right:-40px;width:220px;height:220px;border-radius:50%;background:rgba(59,130,246,.08);filter:blur(60px);pointer-events:none; }

        .svc-starter-left { display:flex;flex-direction:column; }
        .svc-starter-eyebrow { display:flex;align-items:center;gap:5px;font-size:9px;font-weight:800;letter-spacing:2px;text-transform:uppercase;color:#3b82f6;margin-bottom:8px; }
        .svc-starter-name { font-family:'Plus Jakarta Sans',sans-serif;font-size:18px;font-weight:900;color:#111827;line-height:1.15;letter-spacing:-0.5px;margin-bottom:8px; }
        .svc-starter-desc { font-size:11px;color:#6b7280;line-height:1.6; }

        .svc-starter-col { display:flex;flex-direction:column;justify-content:flex-start;align-self:flex-start;margin-top:-12px; }
        .svc-starter-col-label { font-size:9px;font-weight:800;letter-spacing:1.5px;text-transform:uppercase;color:#9ca3af;margin-bottom:8px;padding-bottom:6px;border-bottom:1px solid #f3f4f6; }
        .svc-starter-bullet { display:flex;align-items:flex-start;gap:6px;font-size:11px;color:#374151;line-height:1.4;margin-bottom:5px; }
        .svc-starter-check { color:#3b82f6;font-size:10px;font-weight:800;flex-shrink:0;margin-top:1px; }

        .svc-starter-grid { position:relative;z-index:1;display:grid;grid-template-columns:1fr 1fr 1fr auto;gap:24px;align-items:start; }
        .svc-starter-price-col { display:flex;flex-direction:column;align-items:flex-end;text-align:right;flex-shrink:0; }
        .svc-starter-price { font-family:'Plus Jakarta Sans',sans-serif;font-size:36px;font-weight:900;color:#111827;line-height:1;margin-bottom:2px; }
        .svc-starter-price sup { font-size:14px;vertical-align:top;margin-top:6px;display:inline-block;color:#6b7280; }
        .svc-starter-per { font-size:10px;color:#9ca3af;line-height:1.7;font-weight:600; }
        .svc-starter-btn { display:inline-flex;align-items:center;background:linear-gradient(135deg,#3b82f6,#2563eb);color:#fff;border:none;border-radius:50px;padding:9px 18px;font-size:11px;font-weight:700;text-decoration:none;transition:all .2s;box-shadow:0 4px 14px rgba(59,130,246,.35);margin-top:8px;white-space:nowrap; }
        .svc-starter-btn:hover { transform:translateY(-2px);box-shadow:0 8px 22px rgba(59,130,246,.5); }

        /* Plans */
        .svc-plans-grid { display:grid;grid-template-columns:repeat(5,1fr);gap:12px;margin-bottom:26px; }
        .svc-plan-card {
          position:relative;overflow:hidden;
          background:#fff;
          border:1px solid #e5e7eb;
          border-radius:16px;padding:8px 16px;
          transition:all .3s;
          display:flex;flex-direction:column;
          height:100%;box-sizing:border-box;
          box-shadow:0 2px 12px rgba(0,0,0,.04);
        }
        .svc-plan-card:hover {
          border-color:#d1d5db;transform:translateY(-5px);
          box-shadow:0 20px 48px rgba(0,0,0,.1);
        }
        .svc-plan-popular {
          border-color:rgba(167,139,250,.5) !important;
          background:rgba(167,139,250,.04) !important;
        }
        .svc-plan-popular:hover { border-color:rgba(167,139,250,.7) !important; }
        .svc-pop-glow { position:absolute;top:-40px;left:50%;transform:translateX(-50%);width:160px;height:120px;border-radius:50%;background:rgba(167,139,250,.12);filter:blur(40px);pointer-events:none; }
        .svc-tag { display:inline-block;font-size:9px;font-weight:800;letter-spacing:.5px;text-transform:uppercase;margin-bottom:3px; }
        .svc-plan-icon { width:40px;height:40px;border-radius:10px;display:flex;align-items:center;justify-content:center; }
        .svc-plan-name { font-family:'Plus Jakarta Sans',sans-serif;font-size:14px;font-weight:800;color:#111827;margin-bottom:2px; }
        .svc-plan-desc { font-size:11px;color:#6b7280;line-height:1.6;margin-bottom:5px; }
        .svc-plan-bullets { margin:0 0 6px;padding:0;list-style:none;display:flex;flex-direction:column;gap:2px; }
        .svc-plan-bullets li { font-size:11px;color:#374151;padding-left:14px;position:relative;line-height:1.4; }
        .svc-plan-bullets li::before { content:'✓';position:absolute;left:0;color:#2AA5A0;font-size:10px;font-weight:700; }
        .svc-plan-price-row { display:flex;align-items:baseline;gap:2px;margin-bottom:2px; }
        .svc-plan-price { font-family:'Plus Jakarta Sans',sans-serif;font-size:30px;font-weight:800;color:#111827;line-height:1; }
        .svc-plan-per { font-size:12px;color:#9ca3af;font-weight:600; }
        .svc-plan-setup { font-size:10px;color:#9ca3af;margin-bottom:12px; }
        .svc-plan-btn {
          display:flex;align-items:center;justify-content:center;gap:5px;
          background:#fff;color:#2AA5A0;text-decoration:none;
          border:1.5px solid #2AA5A0;
          border-radius:50px;padding:8px 14px;font-size:11px;font-weight:700;
          transition:all .2s;margin-top:auto;
        }
        .svc-plan-btn:hover { background:var(--tier-color,#2AA5A0);border-color:var(--tier-color,#2AA5A0);color:#fff;transform:translateY(-1px);box-shadow:0 6px 16px rgba(0,0,0,.15); }

        /* Add-ons label */
        .svc-addons-label { display:flex;align-items:center;gap:12px;margin-bottom:10px; }
        .svc-addons-label span { font-size:9px;font-weight:800;letter-spacing:2.5px;text-transform:uppercase;color:#9ca3af; }
        .svc-addons-label::before,.svc-addons-label::after { content:'';flex:1;height:1px;background:#e5e7eb; }

        /* Add-on cards */
        .svc-addons-grid { display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:16px; }
        .svc-addon-card {
          background:#fff;border:1px solid #d1d5db;
          border-radius:14px;padding:14px 14px;
          display:flex;flex-direction:column;
          transition:all .3s;
          box-shadow:0 2px 8px rgba(0,0,0,.04);
        }
        .svc-addon-card:hover { border-color:#d1d5db;transform:translateY(-3px);box-shadow:0 12px 32px rgba(0,0,0,.08); }
        .svc-addon-card-icon { width:34px;height:34px;border-radius:9px;display:flex;align-items:center;justify-content:center; }
        .svc-addon-card-name { font-family:'Plus Jakarta Sans',sans-serif;font-size:12px;font-weight:800;color:#111827;margin-bottom:2px; }
        .svc-addon-card-price { font-size:10px;color:#9ca3af;font-weight:600;margin-bottom:6px; }
        .svc-addon-card-desc { font-size:10px;color:#6b7280;line-height:1.5;margin-bottom:8px; }
        .svc-addon-card-bullets { margin:0 0 10px;padding:0;list-style:none;display:flex;flex-direction:column;gap:3px; }
        .svc-addon-card-bullets li { font-size:10px;color:#374151;padding-left:12px;position:relative;line-height:1.35; }
        .svc-addon-card-bullets li::before { content:'–';position:absolute;left:0;color:#9ca3af; }
        .svc-addon-card-btn { display:inline-flex;align-items:center;justify-content:center;border:2px solid;border-radius:50px;padding:5px 12px;font-size:10px;font-weight:700;text-decoration:none;transition:all .2s;margin-top:auto; }
        .svc-addon-card-btn:hover { opacity:.8;transform:translateY(-1px); }

        .svc-cta-wrap { padding-top:14px;padding-bottom:clamp(16px,2.5vh,28px); }

        .pricing-inner { height:100%;overflow-y:auto;padding:90px 5vw 0; }

        @media (max-width:1200px) {
          .svc-cta-wrap { margin-top:2px; }
        }
        @media (max-width:1300px) {
          .svc-plans-grid { grid-template-columns:repeat(3,1fr); }
        }
        @media (max-width:1100px) {
          .svc-plans-grid { grid-template-columns:repeat(2,1fr); }
          .svc-cta-wrap { margin-top:0px; }
        }
        @media (max-width:1000px) {
          .svc-starter-grid { grid-template-columns:1fr auto;grid-template-rows:auto auto; }
          .svc-starter-left { grid-column:1;grid-row:1; }
          .svc-starter-price-col { grid-column:2;grid-row:1; }
          .svc-starter-bullets-col { grid-column:1 / -1;grid-row:2;display:grid;grid-template-columns:1fr 1fr;gap:0 24px;margin-top:12px; }
          .svc-starter-col { margin-top:0; }
        }
        @media (max-width:900px) {
          .svc-plans-grid { grid-template-columns:repeat(2,1fr); }
          .svc-addons-grid { grid-template-columns:1fr; }
          .svc-cta-wrap { margin-top:0px; }
        }
        /* Mobile-only 3-bullet summary — hidden by default, shown ≤768px */
        .svc-starter-bullets-mobile { display:none;list-style:none;padding:0;margin:0;grid-column:1 / -1; }
        .svc-starter-bullets-mobile li { display:flex;align-items:flex-start;gap:6px;font-size:12px;color:#374151;line-height:1.5;margin-bottom:5px; }
        @media (max-width:768px) {
          .svc-starter-bullets-mobile { display:flex;flex-direction:column; }
          .svc-starter-bullets-col { display:none; }
          .svc-starter-col-label { display:none; }
        }

        @media (max-width:640px) {
          .svc-starter-grid { grid-template-columns:1fr; }
          .svc-starter-price-col { grid-column:1;grid-row:2;align-items:flex-start;text-align:left; }
          .svc-starter-bullets-col { grid-column:1;grid-row:3;grid-template-columns:1fr; }
          .pricing-inner { padding:80px 4vw 24px; }
          .svc-plans-grid { grid-template-columns:1fr;gap:6px;margin-bottom:8px; }
          .svc-plan-card { padding:12px 12px; }

          .svc-addons-grid { gap:6px;margin-bottom:4px; }
          .svc-addon-card { padding:10px 12px; }
          .svc-addons-label { margin-bottom:6px; }
          .svc-starter-card { padding:16px 16px;margin-bottom:12px; }
          .svc-starter-name { font-size:15px; }
          .svc-starter-price { font-size:26px; }
          .svc-h2 { font-size:22px; }
        }
      `}</style>
    </section>
  );
}
