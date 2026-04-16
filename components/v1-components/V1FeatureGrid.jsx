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
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '2rem',
      }}>
        {features.map(f => (
          <div key={f.label} style={{ padding: '1.5rem 0' }}>
            <div style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>
              {f.icon}
            </div>
            <h3 style={{
              fontSize: '0.95rem',
              fontWeight: 700,
              color: 'var(--text)',
              marginBottom: '0.5rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}>
              {f.label}
            </h3>
            <p style={{
              fontSize: '0.875rem',
              color: 'var(--muted)',
              lineHeight: 1.6,
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
