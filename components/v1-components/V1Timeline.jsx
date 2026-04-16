export default function V1Timeline({ timeline }) {
  return (
    <section style={{
      padding: '3rem 2rem',
      background: '#fff',
      maxWidth: 1100,
      margin: '0 auto',
    }}>
      <h3 style={{
        fontSize: '0.9rem',
        fontWeight: 700,
        color: 'var(--text)',
        marginBottom: '2rem',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
      }}>
        Timeline
      </h3>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '1.5rem',
      }}>
        {timeline.map((step, i) => (
          <div key={step.when} style={{
            borderLeft: '2px solid var(--blue)',
            paddingLeft: '1.25rem',
          }}>
            <div style={{
              fontSize: '0.8rem',
              fontWeight: 700,
              color: 'var(--blue)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '0.5rem',
            }}>
              {step.when}
            </div>
            <p style={{
              fontSize: '0.875rem',
              color: 'var(--text)',
              lineHeight: 1.6,
              margin: 0,
            }}>
              {step.action}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
