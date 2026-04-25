'use client';
import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import Link from 'next/link';

const TEAL = '#2AA5A0';

const faqs = [
  { q:'How long does it take to go live?',                a:'Most AI systems and websites are live within 7–14 days. A basic AI chatbot can be live in 3–5 days. Complex CRM integrations or full funnels take 2–3 weeks. We set a realistic timeline on the free audit call — no surprises.' },
  { q:'Do I need any technical knowledge?',               a:'None at all. You explain your business, I build the tech. Most clients have zero technical background and are live in under 2 weeks. You never touch a line of code.' },
  { q:'What if I want to cancel?',                        a:"No lock-in, no penalties. Give 30 days written notice and you're done. No contracts, no cancellation fees, no awkward conversations. You own everything we built — it's yours." },
  { q:'Will the AI actually sound like a human?',         a:"Modern AI is indistinguishable in most conversations. Your chatbot is trained specifically on your business — your tone, your FAQs, your pricing, your service area. It's not a generic bot — it knows your business." },
  { q:'How long before SEO shows results?',               a:"SEO is a long-term investment — most clients see meaningful movement in 3–6 months. That said, technical fixes and Google Business Profile optimisation can show results much faster. I focus on sustainable rankings, not tricks that get penalised later." },
  { q:'Can you work with my existing website?',           a:"Yes — I can optimise what you have or build from scratch. The recommendation depends on what's holding you back. If your site is slow, outdated, or built on a platform I can't properly optimise, a rebuild is usually the faster and cheaper path long-term." },
  { q:"What's included in the free AI audit?",            a:"A plain-English breakdown of where AI, SEO, or a better website would have the biggest impact on your business. I look at your site, your competitors, your Google visibility, and your current lead process. No pitch, no pressure — just honest advice." },
  { q:'Do you accept crypto payment?',                    a:'Yes. I accept Bitcoin, USDC, and major stablecoins. I also build crypto payment infrastructure for businesses that want to accept crypto from their own customers.' },
];

const blogs = [
  { href:'https://blog.aiandwebservices.com/how-ai-works-while-you-sleep',                 tag:'AI Automation', title:'How AI Works While You Sleep',          desc:'Discover how automated AI systems handle leads, follow-ups, and customer queries around the clock — without you lifting a finger.' },
  { href:'https://blog.aiandwebservices.com/ai-saves-small-businesses-500-2000-per-month', tag:'AI ROI',         title:'66% of SMBs Save $500–$2,000/mo with AI', desc:'Real numbers from real businesses. See exactly where AI cuts costs and how quickly it pays for itself.' },
  { href:'https://blog.aiandwebservices.com/growing-businesses-use-ai-83-percent',         tag:'Growth',         title:'83% of Growing SMBs Now Use AI',          desc:'The gap between AI-adopters and holdouts is widening fast. Here\'s what the top-performing small businesses are doing differently.' },
  { href:'https://blog.aiandwebservices.com/ai-directly-boosts-revenue-91-percent-small-businesses', tag:'AI ROI',      title:'91% of SMBs Say AI Directly Boosts Revenue', desc:'New data shows the majority of small businesses using AI report a direct, measurable impact on their bottom line.' },
  { href:'https://blog.aiandwebservices.com/businesses-cut-costs-35-percent-first-year-ai',          tag:'Cost Savings', title:'Businesses Cut Costs 35% in Their First Year of AI', desc:'A 1-in-3 cost reduction in year one — here\'s where the savings actually come from and how to replicate them.' },
  { href:'https://blog.aiandwebservices.com/urgency-ai-adoption-8-in-10-companies',                  tag:'AI Trends',    title:'8 in 10 Companies Are Adopting AI Now',      desc:'The window to get ahead of your competitors is closing. Here\'s what the data says about the pace of AI adoption.' },
];


export default function FAQ() {
  const reduced = useReducedMotion();
  const [active, setActive] = useState(null);

  return (
    <section className="panel faq-panel" id="p7" aria-label="Frequently asked questions about AIandWEBservices">

      <div className="faq-bg">
        <div className="faq-orb faq-orb-1" />
        <div className="faq-orb faq-orb-2" />
      </div>

      <div className="faq-inner">

          {/* Header */}
          <div className="faq-header">
            <div className="fq-eyebrow">FAQ</div>
            <h2 className="fq-h2">Questions people<br/><span className="fq-h2-accent">always ask.</span></h2>
            <p className="fq-sub">Click any question. Honest answer, no sales spin.</p>
          </div>

          {/* FAQ list */}
          <div className="fq-list">
            {faqs.map((item, i) => {
              const isOpen = active === i;
              return (
                <motion.div
                  key={item.q}
                  animate={{ opacity:1, y:0 }}
                  initial={{ opacity:0, y: reduced ? 0 : 10 }}
                  transition={{ duration:.4, ease:[0.22,1,0.36,1], delay: i * 0.03 }}
                  className={`fq-card${isOpen ? ' fq-card-open' : ''}`}
                  onClick={() => setActive(isOpen ? null : i)}
                >
                  <div className="fq-card-row">
                    <div className="fq-num" style={{ color: isOpen ? TEAL : 'rgba(15,30,61,.2)' }}>
                      {String(i + 1).padStart(2, '0')}
                    </div>
                    <div className="fq-question" style={{ color: isOpen ? '#0f1e3d' : '#1e3a5f' }}>
                      {item.q}
                    </div>
                    <div className="fq-indicator" style={{
                      background: isOpen ? `${TEAL}22` : `${TEAL}12`,
                      borderColor: isOpen ? `${TEAL}70` : `${TEAL}40`,
                    }}>
                      <motion.span
                        animate={{ rotate: isOpen ? 45 : 0 }}
                        transition={{ duration:.25, ease:[0.22,1,0.36,1] }}
                        style={{ fontSize:16, color: TEAL, display:'block', lineHeight:1 }}
                      >+</motion.span>
                    </div>
                  </div>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height:0, opacity:0 }}
                        animate={{ height:'auto', opacity:1, transition:{ duration:.32, ease:[0.22,1,0.36,1] } }}
                        exit={{ height:0, opacity:0, transition:{ duration:.18 } }}
                        style={{ overflow:'hidden' }}
                      >
                        <p className="fq-answer">{item.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>

          {/* Blog section */}
          <div className="fq-blog-wrap">
            <div className="fq-blog-header">
              <div>
                <span className="fq-blog-eyebrow">DIVE DEEPER</span>
                <div className="fq-blog-heading">Detailed guides on these topics</div>
              </div>
              <a href="https://blog.aiandwebservices.com" target="_blank" rel="noopener noreferrer" className="fq-blog-link">See all ↗</a>
            </div>
            <div className="fq-blog-grid">
              {blogs.map((post) => (
                <a key={post.href} href={post.href} target="_blank" rel="noopener noreferrer" className="fq-blog-card">
                  <span className="fq-blog-tag">{post.tag}</span>
                  <div className="fq-blog-title">{post.title}</div>
                  <div className="fq-blog-desc">{post.desc}</div>
                  <span className="fq-blog-read">Read →</span>
                </a>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="panel-cta-wrap">
            <div className="panel-cta-card">
              <p className="panel-cta-title">Ready to level up? Dive deeper.</p>
              <p className="panel-cta-sub">Expert insights, case studies, and AI strategies you can implement today.</p>
              <a href="https://blog.aiandwebservices.com" target="_blank" rel="noopener noreferrer" className="panel-cta-btn">Explore the Blog</a>
            </div>
          </div>

      </div>

      <style>{`
        .faq-panel { overflow: hidden; }

        .faq-bg {
          position: absolute; inset: 0;
          background: #dde5ed;
          z-index: 0;
        }
        .faq-orb {
          position: absolute; border-radius: 50%; filter: blur(90px);
          pointer-events: none; opacity: 0;
          animation: faq-drift 12s ease-in-out infinite;
        }
        .faq-orb-1 {
          width: 420px; height: 420px; top: -80px; left: -60px;
          background: radial-gradient(circle, rgba(42,165,160,.22) 0%, transparent 70%);
          animation-delay: 0s; opacity: 1;
        }
        .faq-orb-2 {
          width: 500px; height: 500px; bottom: -100px; right: -80px;
          background: radial-gradient(circle, rgba(99,102,241,.18) 0%, transparent 70%);
          animation-delay: -6s; opacity: 1;
        }
        @keyframes faq-drift {
          0%, 100% { transform: translate(0,0) scale(1); }
          33%       { transform: translate(30px,-20px) scale(1.06); }
          66%       { transform: translate(-20px,24px) scale(.96); }
        }

        .faq-inner {
          position: relative; z-index: 1; height: 100%;
          overflow: hidden; display: flex; flex-direction: column;
          padding: 90px 5vw 0;
        }
        .faq-inner .panel-cta-wrap { margin-top:auto; padding-top:14px; padding-bottom:clamp(16px,2.5vh,28px); }

        .faq-header { margin-bottom: 16px; text-align: center; }
        .fq-eyebrow {
          display: block; font-size: 11px; font-weight: 800;
          letter-spacing: 3px; text-transform: uppercase;
          color: #2AA5A0; margin-bottom: 8px;
        }
        .fq-h2 {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: clamp(26px, 3.5vw, 46px); font-weight: 800;
          letter-spacing: -1px; line-height: 1.1; color: #0f1e3d; margin: 0 0 8px;
        }
        .fq-h2-accent { color: #2AA5A0; }
        .fq-sub { font-size: 13px; color: rgba(15,30,61,.7); margin-bottom: 10px; }

        .fq-list {
          display: grid; grid-template-columns: repeat(4, 1fr);
          gap: 7px; margin-bottom: 16px; align-content: start; align-items: start;
          max-width: 920px; margin-left: auto; margin-right: auto;
        }
        .fq-card {
          position: relative;
          align-self: start;
          background: rgba(255,255,255,.72);
          border: 1.5px solid rgba(15,30,61,.08);
          border-left: 3px solid transparent;
          border-radius: 14px; padding: 14px 16px; cursor: pointer;
          transition: background .22s, border-color .22s, border-left-color .22s, box-shadow .22s;
          backdrop-filter: blur(8px);
        }
        .fq-card:hover {
          background: rgba(255,255,255,.9);
          box-shadow: 0 4px 24px rgba(59,130,246,.1);
          border-color: rgba(15,30,61,.13);
        }
        .fq-card-open {
          background: rgba(255,255,255,.95) !important;
          border-left-color: #2AA5A0 !important;
          border-color: rgba(42,165,160,.25) !important;
          box-shadow: 0 6px 32px rgba(42,165,160,.12) !important;
        }
        .fq-card-row { display: flex; align-items: flex-start; gap: 10px; }
        .fq-num {
          font-family: 'Plus Jakarta Sans', sans-serif; font-size: 10px;
          font-weight: 800; letter-spacing: 1px; flex-shrink: 0;
          padding-top: 2px; min-width: 22px; transition: color .22s;
        }
        .fq-question {
          font-size: 14px; font-weight: 700; line-height: 1.45; flex: 1;
          transition: color .22s; font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .fq-indicator {
          flex-shrink: 0; width: 26px; height: 26px; border-radius: 8px;
          border: 1.5px solid; display: flex; align-items: center;
          justify-content: center; transition: background .22s, border-color .22s; margin-top: 1px;
        }
        .fq-answer {
          font-size: 13px; color: rgba(15,30,61,.65); line-height: 1.75;
          margin: 10px 0 2px 32px; padding-top: 10px;
          border-top: 1px solid rgba(42,165,160,.2);
        }

        /* ── Blog section ── */
        .fq-blog-wrap { margin-top: 40px; margin-bottom: 8px; max-width: 920px; margin-left: auto; margin-right: auto; }
        .fq-blog-header {
          display: flex; align-items: flex-end; justify-content: space-between;
          margin-bottom: 12px; gap: 12px;
        }
        .fq-blog-eyebrow {
          display: block; font-size: 10px; font-weight: 800; letter-spacing: 2.5px;
          text-transform: uppercase; color: #2AA5A0; margin-bottom: 4px;
        }
        .fq-blog-heading {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: clamp(16px, 2vw, 22px); font-weight: 800;
          color: #0f1e3d; letter-spacing: -0.3px; line-height: 1.2;
        }
        .fq-blog-link { font-size: 11px; font-weight: 700; color: #2AA5A0; text-decoration: none; white-space: nowrap; flex-shrink: 0; padding-bottom: 2px; }
        .fq-blog-link:hover { color: #1e8a85; }

        .fq-blog-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
        }
        .fq-blog-card {
          display: flex; flex-direction: column; gap: 6px;
          background: rgba(255,255,255,.78);
          border: 1.5px solid rgba(15,30,61,.08);
          border-radius: 14px; padding: 14px 16px;
          text-decoration: none; cursor: pointer;
          transition: background .2s, box-shadow .2s, border-color .2s;
          backdrop-filter: blur(8px);
        }
        .fq-blog-card:hover {
          background: rgba(255,255,255,.96);
          box-shadow: 0 6px 28px rgba(42,165,160,.13);
          border-color: rgba(42,165,160,.28);
        }
        .fq-blog-tag {
          display: inline-block; font-size: 9px; font-weight: 800;
          letter-spacing: 1.5px; text-transform: uppercase;
          border-radius: 50px; padding: 3px 9px; width: fit-content;
          color: rgba(0,0,0,.55); background: rgba(0,0,0,.06);
        }
        .fq-blog-title {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 13px; font-weight: 700; color: #0f1e3d; line-height: 1.35;
        }
        .fq-blog-desc {
          font-size: 11.5px; color: rgba(15,30,61,.55); line-height: 1.6; flex: 1;
        }
        .fq-blog-read {
          font-size: 11px; font-weight: 700; margin-top: 2px; color: #2AA5A0;
        }

        @media (min-width: 1920px) {
          .fq-blog-wrap { margin-top: 25px; }
        }
        @media (max-width: 900px) {
          .fq-blog-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (min-width: 769px) and (max-width: 1024px) {
          .fq-list { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 768px) {
          .fq-list { grid-template-columns: 1fr; }
          .fq-blog-grid { grid-template-columns: 1fr; }
          .faq-inner { padding: 80px 5vw 20px; }
          .fq-blog-wrap { padding-top: 64px; }
        }
      `}</style>
    </section>
  );
}
