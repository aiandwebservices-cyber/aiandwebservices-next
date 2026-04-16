export default function V1PriceCard({ service }) {
  return (
    <section style={{
      padding: '3rem 2rem',
      background: 'rgba(42,165,160,0.05)',
      borderTop: '1px solid var(--border)',
      maxWidth: 1100,
      margin: '0 auto',
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '3rem',
      }}>
        <div>
          <h3 style={{
            fontSize: '0.9rem',
            fontWeight: 700,
            color: 'var(--text)',
            marginBottom: '1.5rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}>
            Setup Includes
          </h3>
          <ul style={{
            listStyle: 'none',
            padding: 0,
            margin: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
          }}>
            {service.setupIncludes.map(item => (
              <li key={item} style={{
                fontSize: '0.875rem',
                color: 'var(--text)',
                display: 'flex',
                gap: '0.5rem',
              }}>
                <span style={{ color: 'var(--blue)', fontWeight: 700 }}>→</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 style={{
            fontSize: '0.9rem',
            fontWeight: 700,
            color: 'var(--text)',
            marginBottom: '1.5rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}>
            Monthly Includes
          </h3>
          <ul style={{
            listStyle: 'none',
            padding: 0,
            margin: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
          }}>
            {service.monthlyIncludes.map(item => (
              <li key={item} style={{
                fontSize: '0.875rem',
                color: 'var(--text)',
                display: 'flex',
                gap: '0.5rem',
              }}>
                <span style={{ color: 'var(--blue)', fontWeight: 700 }}>→</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
