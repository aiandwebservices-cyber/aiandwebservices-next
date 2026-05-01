'use client';

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      backgroundColor: '#0a0a0a', color: '#e4e4e7', fontFamily: 'system-ui',
    }}>
      <h1 style={{ fontSize: '4rem', fontWeight: 800, color: '#2AA5A0', margin: 0 }}>404</h1>
      <p style={{ fontSize: '1.25rem', marginTop: '0.5rem', color: '#a1a1aa' }}>
        Page not found
      </p>
      <button
        onClick={() => window.history.back()}
        style={{
          marginTop: '2rem', padding: '0.75rem 2rem', borderRadius: '8px',
          backgroundColor: '#2AA5A0', color: 'white', border: 'none',
          fontWeight: 600, fontSize: '1rem', cursor: 'pointer',
        }}
      >
        ← Go Back
      </button>
      <a
        href="/"
        style={{
          marginTop: '1rem', color: '#2AA5A0', textDecoration: 'none', fontSize: '0.875rem',
        }}
      >
        or go to homepage
      </a>
    </div>
  );
}
