'use client';
import { motion, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import { ClipboardCheck, ArrowRight } from 'lucide-react';

const TEAL = '#2AA5A0';

export default function ChecklistTeaser() {
  const reduced = useReducedMotion();

  const fade = (delay = 0) => ({
    initial:     reduced ? false : { opacity: 0, y: 28 },
    whileInView: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay } },
    viewport:    { once: true, amount: 0.15 },
  });

  return (
    <section className="panel" id="checklist-teaser" aria-label="AI Readiness Assessment">
      <div className="ct-bg" aria-hidden="true" />

      <div className="ct-inner">
        <motion.div {...fade(0)} className="ct-icon-wrap">
          <ClipboardCheck size={40} color={TEAL} strokeWidth={1.5} />
        </motion.div>

        <motion.div {...fade(0.08)} className="ct-eyebrow">
          Free Resource · 2 minutes
        </motion.div>

        <motion.h2 {...fade(0.14)} className="ct-h2">
          Not sure where you stand with AI?
        </motion.h2>

        <motion.p {...fade(0.2)} className="ct-sub">
          Take the free AI Readiness Assessment. Get a personalised score and tier recommendation — no email required until you&apos;re ready to see your results.
        </motion.p>

        <motion.div {...fade(0.26)} className="ct-pillars">
          {[
            { n: '5', label: 'categories' },
            { n: '20', label: 'questions' },
            { n: '<2 min', label: 'to complete' },
          ].map(({ n, label }) => (
            <div key={label} className="ct-pillar">
              <span className="ct-pillar-n">{n}</span>
              <span className="ct-pillar-label">{label}</span>
            </div>
          ))}
        </motion.div>

        <motion.p {...fade(0.3)} className="ct-note">
          David reviews every submission personally — no auto-replies, no pitch decks.
        </motion.p>

        <motion.div {...fade(0.36)} className="ct-ctas">
          <Link href="/checklist" className="ct-btn-primary">
            Start the Free Assessment <ArrowRight size={16} style={{ display: 'inline', verticalAlign: 'middle', marginLeft: '4px' }} />
          </Link>
        </motion.div>
      </div>

      <style>{`
        .ct-bg {
          position: absolute; inset: 0; pointer-events: none;
          background: radial-gradient(ellipse 70% 60% at 50% 100%, rgba(42,165,160,.10) 0%, transparent 70%),
                      radial-gradient(ellipse 40% 40% at 20% 20%, rgba(96,165,250,.06) 0%, transparent 60%);
        }
        .ct-inner {
          position: relative; height: 100%; display: flex; flex-direction: column;
          align-items: center; justify-content: center; text-align: center;
          padding: 90px 6vw 60px; overflow-y: auto;
        }
        .ct-icon-wrap { margin-bottom: 18px; }
        .ct-eyebrow {
          font-size: 12px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase;
          color: ${TEAL}; margin-bottom: 14px;
        }
        .ct-h2 {
          font-family: var(--font-plus-jakarta, sans-serif);
          font-size: clamp(28px, 4.5vw, 46px); font-weight: 800; line-height: 1.18;
          color: #111827; margin: 0 0 16px; max-width: 640px;
        }
        .ct-sub {
          font-size: clamp(15px, 1.8vw, 18px); color: #4b5563; line-height: 1.7;
          max-width: 560px; margin: 0 0 28px;
        }
        .ct-pillars {
          display: flex; gap: 32px; margin-bottom: 20px; flex-wrap: wrap; justify-content: center;
        }
        .ct-pillar {
          display: flex; flex-direction: column; align-items: center; gap: 3px;
        }
        .ct-pillar-n {
          font-family: var(--font-plus-jakarta, sans-serif);
          font-size: 26px; font-weight: 900; color: ${TEAL}; line-height: 1;
        }
        .ct-pillar-label {
          font-size: 12px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.5px;
        }
        .ct-note {
          font-size: 13px; color: #9ca3af; margin: 0 0 32px; line-height: 1.5;
        }
        .ct-ctas { display: flex; flex-direction: column; align-items: center; gap: 12px; }
        .ct-btn-primary {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 15px 32px; background: ${TEAL}; color: #fff;
          border-radius: 50px; font-weight: 700; font-size: 16px;
          text-decoration: none; box-shadow: 0 10px 36px rgba(42,165,160,0.38);
          transition: opacity 0.2s, transform 0.2s;
        }
        .ct-btn-primary:hover { opacity: 0.9; transform: translateY(-1px); }

        @media (max-width: 768px) {
          .ct-inner { padding: 80px 5vw 50px; justify-content: flex-start; }
          .ct-pillars { gap: 20px; }
        }
      `}</style>
    </section>
  );
}
