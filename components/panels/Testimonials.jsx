import { Star, Quote } from 'lucide-react';

// TESTIMONIALS: Set to true when you have real client testimonials.
// The section is fully built and styled — just flip this to true.
// Then replace the placeholder content below with real quotes.
const SHOW_TESTIMONIALS = false;

const testimonials = [
  {
    quote: "David built our AI chatbot in under two weeks. We went from losing after-hours leads to booking calls at 3am. Setup was painless and the system paid for itself in the first month.",
    name: "Alex R.",
    business: "Home Services Company",
    stars: 5,
  },
  {
    quote: "I was skeptical about AI for my law firm. David gave me an honest assessment, built exactly what I needed, and didn't try to oversell me. The chatbot handles 60% of our intake inquiries now.",
    name: "Maria T.",
    business: "Legal Practice",
    stars: 5,
  },
  {
    quote: "The Growth package transformed our online presence. We went from zero organic leads to 30+ per month within six months. David's SEO content and automation work together seamlessly.",
    name: "James K.",
    business: "B2B Consulting Firm",
    stars: 5,
  },
];

export default function Testimonials() {
  if (!SHOW_TESTIMONIALS) return null;

  return (
    <section className="panel" id="testimonials" aria-label="Client testimonials" style={{ background: 'var(--navy2)' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px', width: '100%' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div className="panel-eyebrow">Testimonials</div>
          <h2 className="panel-h2" style={{ color: '#fff' }}>What Clients Say</h2>
          <p className="panel-sub" style={{ color: 'rgba(255,255,255,.55)' }}>Real results from real businesses.</p>
        </div>

        {/* Cards grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
        }}>
          {testimonials.map((t, i) => (
            <div
              key={i}
              style={{
                background: 'rgba(255,255,255,.04)',
                border: '1px solid rgba(42,165,160,.2)',
                borderRadius: '16px',
                padding: '28px 24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
              }}
            >
              {/* Decorative quote icon */}
              <Quote size={28} color="#2AA5A0" style={{ opacity: 0.7, flexShrink: 0 }} />

              {/* Quote text */}
              <p style={{
                color: '#fff',
                fontSize: '1.05rem',
                lineHeight: '1.65',
                flex: 1,
                margin: 0,
              }}>
                &ldquo;{t.quote}&rdquo;
              </p>

              {/* Stars */}
              <div style={{ display: 'flex', gap: '3px' }}>
                {Array.from({ length: t.stars }).map((_, si) => (
                  <Star key={si} size={15} fill="#2AA5A0" color="#2AA5A0" />
                ))}
              </div>

              {/* Attribution */}
              <div>
                <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.95rem' }}>{t.name}</div>
                <div style={{ color: 'rgba(255,255,255,.45)', fontSize: '0.82rem', marginTop: '2px' }}>{t.business}</div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
