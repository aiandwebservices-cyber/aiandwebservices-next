'use client';
import Link from 'next/link';

export default function FinalCTA() {
  return (
    <section id="p8" className="panel final-cta-panel">
      <div className="final-cta-inner">
        <p className="eyebrow">GET IN TOUCH</p>
        <h2 className="final-cta-headline">
          Ready to see what AI can do for your business?
        </h2>
        <p className="final-cta-sub">
          30-minute audit. No pitch. Honest advice.
        </p>
        <Link href="/contact" className="final-cta-btn">
          Get Your Free Audit →
        </Link>
        <p className="final-cta-trust">
          No contracts · 6-hour response · Live in 14 days
        </p>
      </div>
    </section>
  );
}
