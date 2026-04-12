import { notFound } from 'next/navigation';

// ─────────────────────────────────────────────────────────────
// ADD YOUR CLIENTS HERE
// key   = what goes in the URL  →  /preview/mrs
// value = where their site is hosted (local dev port or deployed URL)
// ─────────────────────────────────────────────────────────────
const CLIENTS = {
  mrs: {
    name: 'Mitigation Restoration Services',
    url: 'http://localhost:3000',   // swap for deployed URL when ready
  },
  // Add more clients like:
  // 'next-client': { name: 'Next Client Name', url: 'http://localhost:3001' },
};

export const metadata = {
  robots: 'noindex, nofollow',   // never show in search results
};

export default async function PreviewPage({ params }) {
  const { client } = await params;
  const config = CLIENTS[client.toLowerCase()];

  if (!config) notFound();

  return (
    <div style={{ fontFamily: 'sans-serif' }}>
      {/* Thin banner so you can tell the client this is a preview */}
      <div style={{
        background: '#1B2A4A',
        color: '#fff',
        padding: '0.5rem 1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '0.85rem',
        position: 'sticky',
        top: 0,
        zIndex: 9999,
      }}>
        <span>
          <strong>AIandWEBservices</strong> — Preview:{' '}
          <span style={{ color: '#90cdf4' }}>{config.name}</span>
        </span>
        <span style={{ color: '#a0aec0' }}>This is a private preview link — not publicly listed</span>
      </div>

      <iframe
        src={config.url}
        style={{ width: '100%', height: 'calc(100vh - 36px)', border: 'none', display: 'block' }}
        title={`Preview — ${config.name}`}
      />
    </div>
  );
}
