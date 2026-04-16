export default function V1FitCheck({ bullets }) {
  return (
    <section style={{
      padding: '3rem 2rem',
      background: 'rgba(42,165,160,0.03)',
      borderTop: '1px solid var(--border)',
      borderBottom: '1px solid var(--border)',
      maxWidth: 1100,
      margin: '0 auto',
    }}>
      <h3 style={{
        fontSize: '0.9rem',
        fontWeight: 700,
        color: 'var(--text)',
        marginBottom: '1.5rem',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
      }}>
        Built for you if…
      </h3>
      <ul style={{
        listStyle: 'none',
        padding: 0,
        margin: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
      }}>
        {bullets.map(b => (
          <li key={b} style={{
            fontSize: '0.9rem',
            color: 'var(--text)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.75rem',
          }}>
            <span style={{ color: 'var(--blue)', fontWeight: 700, flexShrink: 0 }}>✓</span>
            {b}
          </li>
        ))}
      </ul>
    </section>
  );
}
