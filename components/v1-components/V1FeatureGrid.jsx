export default function V1FeatureGrid({ features }) {
  return (
    <section style={{
      padding: 'clamp(3rem, 8vw, 5rem) 2rem',
      background: '#fff',
      maxWidth: 1100,
      margin: '0 auto',
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '1.25rem',
      }}>
        {features.map(f => (
          <div key={f.label} style={{ padding: '0.85rem 0' }}>
            <div style={{ fontSize: '1.25rem', marginBottom: '0.35rem' }}>
              {f.icon}
            </div>
            <h3 style={{
              fontSize: '0.8rem',
              fontWeight: 700,
              color: 'var(--text)',
              marginBottom: '0.35rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}>
              {f.label}
            </h3>
            <p style={{
              fontSize: '0.8rem',
              color: 'var(--muted)',
              lineHeight: 1.5,
              margin: 0,
            }}>
              {f.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
