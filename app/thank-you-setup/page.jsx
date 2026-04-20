import ChecklistForm from '@/components/ChecklistForm';

export const metadata = {
  title: 'Thank You — AIandWEBservices',
  description: 'Your setup payment was received.',
  robots: { index: false, follow: false },
};

export default function ThankYouSetupPage() {
  return (
    <main className="standalone-page" style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>

      {/* Payment confirmation hero with logo */}
      <section style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #111827 100%)',
        color: '#fff',
        padding: 'clamp(32px, 5vw, 56px) 20px 28px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Subtle glow */}
        <div style={{ position: 'absolute', top: '-80px', left: '50%', transform: 'translateX(-50%)', width: '600px', height: '400px', background: 'radial-gradient(circle, rgba(42,165,160,0.15) 0%, transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          {/* Logo */}
          <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-gradient-test.svg" alt="AIandWEBservices" width={420} height={84} style={{ display: 'block', maxWidth: '90%', marginLeft: '-16px' }} />
          </div>

          {/* Payment badge */}
          <div style={{
            display: 'inline-block',
            padding: '8px 20px',
            background: 'rgba(42,165,160,0.15)',
            border: '1px solid rgba(42,165,160,0.4)',
            color: '#2AA5A0',
            borderRadius: '999px',
            fontSize: '12px',
            fontWeight: 700,
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
            marginBottom: '16px',
          }}>
            ✓ Payment Received
          </div>

          <h1 style={{
            fontSize: 'clamp(30px, 5vw, 48px)',
            fontWeight: 800,
            marginBottom: '12px',
            lineHeight: '1.15',
            letterSpacing: '-1.5px',
          }}>
            Thank you — let&apos;s get started.
          </h1>

          <p style={{
            fontSize: '18px',
            color: 'rgba(255,255,255,0.85)',
            lineHeight: '1.6',
            maxWidth: '640px',
            margin: '0 auto 8px',
          }}>
            Your setup payment was received. A confirmation email is on the way with your monthly subscription link.
          </p>

          <p style={{
            fontSize: '16px',
            color: 'rgba(255,255,255,0.85)',
            lineHeight: '1.6',
            maxWidth: '640px',
            margin: '0 auto',
          }}>
            While you&apos;re here — please complete the onboarding assessment below. Takes 5 minutes. The more context David has before kickoff, the faster your first wins arrive.
          </p>
        </div>
      </section>

      {/* Embedded checklist — hero hidden, source=customer auto-set */}
      <section style={{ padding: '0 0 80px' }}>
        <ChecklistForm hideHero={true} defaultSource="customer" />
      </section>

    </main>
  );
}
