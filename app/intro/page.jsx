import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import CalInlineEmbed from '@/components/CalInlineEmbed';

export const metadata = {
  title: '30-Min AI Automation Intro Call | AIandWEBservices',
  description: 'Free 30-minute intro call with David Pulis. I\'ll review your business, identify your biggest AI automation opportunities, and show you the fastest path to implementation.',
  alternates: { canonical: 'https://www.aiandwebservices.com/intro' },
  robots: { index: false, follow: false },
  openGraph: {
    title: '30-Min AI Automation Intro Call',
    description: 'Free 30-minute intro call. Review your business, identify quick wins, and map your implementation.',
    images: [{ url: 'https://www.aiandwebservices.com/api/og?title=Free%2030-Minute%20Intro%20Call&description=AI%20Automation%20Opportunity%20Review', width: 1200, height: 630, alt: '30-Min AI Automation Intro Call' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: '30-Min AI Automation Intro Call',
    description: 'Free 30-minute intro call with David Pulis to review your AI automation readiness.',
    images: ['https://www.aiandwebservices.com/api/og?title=Free%2030-Minute%20Intro%20Call&description=AI%20Automation%20Opportunity%20Review'],
  },
};

export default function IntroPage() {
  const benefits = [
    "Honest assessment — are you ready for AI automation or should you start with the basics?",
    "Identify your biggest opportunity — we'll spot which department will benefit most",
    "Quick wins — specific actions you can take this week to start capturing value",
    "Implementation roadmap — clear path forward, no surprises, no fluff",
    "No sales pitch — just expert guidance tailored to your business",
  ];

  return (
    <main className="standalone-page" style={{ minHeight: '100vh', height: 'auto', overflow: 'visible', overflowY: 'auto', backgroundColor: '#f8fafc' }}>
      {/* Hero */}
      <section style={{ backgroundColor: '#111827', color: '#fff', padding: 'clamp(40px, 8vw, 80px) 20px', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '3px', textTransform: 'uppercase', color: '#2AA5A0', marginBottom: '10px' }}>
            Free Strategy Call
          </div>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: '800', marginBottom: '8px', lineHeight: '1.15', letterSpacing: '-1px' }}>
            30-Minute Intro Call
          </h1>
          <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.8)', lineHeight: '1.6', marginBottom: '32px' }}>
            A free, no-pressure conversation to review your business, identify your biggest AI automation opportunities, and show you exactly where to start.
          </p>
        </div>
      </section>

      {/* Content */}
      <section style={{ maxWidth: '900px', margin: '0 auto', padding: '60px 20px', backgroundColor: '#fff' }}>
        {/* What You'll Get */}
        <div style={{ marginBottom: '64px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#111827', marginBottom: '32px', textAlign: 'center' }}>
            What Happens on This Call
          </h2>
          <div style={{ display: 'grid', gap: '20px' }}>
            {benefits.map((benefit, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <CheckCircle size={24} color="#2AA5A0" strokeWidth={2} style={{ flexShrink: 0, marginTop: '2px' }} />
                <p style={{ fontSize: '16px', color: '#374151', lineHeight: '1.6', margin: 0 }}>
                  {benefit}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Calendar Embed */}
        <div style={{ marginBottom: '64px', padding: '40px', backgroundColor: '#f0fdf4', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#111827', marginBottom: '32px', textAlign: 'center' }}>
            Pick Your Time
          </h2>
          <div style={{ overflow: 'hidden', borderRadius: '6px' }}>
            <CalInlineEmbed />
          </div>
        </div>

        {/* FAQ */}
        <div style={{ marginBottom: '64px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#111827', marginBottom: '32px', textAlign: 'center' }}>
            Common Questions
          </h2>
          <div style={{ display: 'grid', gap: '24px' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#111827', marginBottom: '8px' }}>
                How long is the call?
              </h3>
              <p style={{ fontSize: '15px', color: '#374151', lineHeight: '1.6', margin: 0 }}>
                A full 30 minutes. Enough time to actually understand your business and give you specific, useful advice — not a rushed overview.
              </p>
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#111827', marginBottom: '8px' }}>
                What do I need to prepare?
              </h3>
              <p style={{ fontSize: '15px', color: '#374151', lineHeight: '1.6', margin: 0 }}>
                Nothing formal. Just be ready to tell me about your business, what's taking up your team's time, and where you'd like to grow. If you haven't already, you can also take the <Link href="/checklist" style={{ color: '#2AA5A0', fontWeight: '600', textDecoration: 'none' }}>AI Readiness Checklist</Link> beforehand to clarify your situation.
              </p>
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#111827', marginBottom: '8px' }}>
                Will you try to sell me something?
              </h3>
              <p style={{ fontSize: '15px', color: '#374151', lineHeight: '1.6', margin: 0 }}>
                No. This call is about understanding your business and giving you honest advice. If you're a good fit for a paid engagement, we'll talk about options. But only if it makes sense for you.
              </p>
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#111827', marginBottom: '8px' }}>
                What if I'm not ready yet?
              </h3>
              <p style={{ fontSize: '15px', color: '#374151', lineHeight: '1.6', margin: 0 }}>
                That's fine too. We'll tell you exactly what to do first and when to come back. Some businesses need to get their fundamentals in place before AI automation makes sense.
              </p>
            </div>
          </div>
        </div>

        {/* Alternative CTA */}
        <div style={{ marginTop: '64px', padding: '40px', backgroundColor: '#fef3c7', borderRadius: '8px', textAlign: 'center', border: '1px solid #fcd34d' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#111827', marginBottom: '12px' }}>
            Not sure if you're ready yet?
          </h3>
          <p style={{ fontSize: '15px', color: '#374151', marginBottom: '24px', lineHeight: '1.6' }}>
            Take the 5-minute <Link href="/checklist" style={{ color: '#f59e0b', fontWeight: '600', textDecoration: 'underline' }}>AI Readiness Checklist</Link> first to get a clear picture of your situation and what you should focus on.
          </p>
        </div>
      </section>

      {/* Print Styles */}
      <style>{`
        @media print {
          body { background: white; }
          section:first-of-type { display: none; }
          #cal-inline-embed { display: none; }
          * { box-shadow: none !important; }
        }
      `}</style>
    </main>
  );
}
