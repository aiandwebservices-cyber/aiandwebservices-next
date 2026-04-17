export default function V1Hero({ service }) {
  return (
    <section style={{
      background: 'var(--navy)',
      color: '#fff',
      padding: 'clamp(1.5rem, 5vw, 3rem) 2rem',
      textAlign: 'center',
    }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <div className="panel-eyebrow">
          {service.slug}
        </div>
        <h1 className="panel-h2" style={{
          color: '#fff',
          marginTop: '1rem',
          marginBottom: '1rem',
        }}>
          {service.oneLiner}
        </h1>
        <div style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'center',
          gap: '0.5rem',
          marginBottom: '1.2rem',
          flexWrap: 'wrap',
        }}>
          <span style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', fontWeight: 700 }}>
            ${service.priceMonthly}
          </span>
          <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)' }}>
            /mo + ${service.setupFee} setup
          </span>
        </div>
      </div>
    </section>
  );
}
