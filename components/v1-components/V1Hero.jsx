export default function V1Hero({ service }) {
  return (
    <section style={{
      background: 'var(--navy)',
      color: '#fff',
      padding: 'clamp(3rem, 8vw, 6rem) 2rem',
      textAlign: 'center',
    }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <div style={{
          fontSize: '0.75rem',
          fontWeight: 600,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'var(--blue)',
          marginBottom: '1rem',
        }}>
          {service.tier}
        </div>
        <h1 style={{
          fontSize: 'clamp(2rem, 5vw, 3.5rem)',
          fontWeight: 800,
          lineHeight: 1.1,
          marginBottom: '1.5rem',
          letterSpacing: '-0.01em',
        }}>
          {service.oneLiner}
        </h1>
        <div style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'center',
          gap: '0.5rem',
          marginBottom: '2rem',
          flexWrap: 'wrap',
        }}>
          <span style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', fontWeight: 700 }}>
            ${service.priceMonthly}
          </span>
          <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)' }}>
            /mo + ${service.setupFee} setup
          </span>
        </div>
        <a href="/#contact" className="btn-primary" style={{ display: 'inline-block' }}>
          Get Your Free Audit →
        </a>
      </div>
    </section>
  );
}
