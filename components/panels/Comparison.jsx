import { Check, X } from 'lucide-react';

const rows = [
  { feature: 'Who does the work',     us: 'David — directly, every time',         agency: 'Junior staff, rotating team',            freelancer: 'Random freelancers, no continuity' },
  { feature: 'AI expertise',          us: 'Built-in — it\'s the core offering',    agency: 'Outsourced or surface-level',             freelancer: 'Hit or miss, no vetting' },
  { feature: 'System integration',    us: 'Everything connected by design',        agency: 'Separate teams, separate tools',          freelancer: 'You manage the integrations' },
  { feature: 'Communication',         us: 'Direct access, 6hr response',           agency: 'Account manager middleman',               freelancer: 'Platform messaging, slow' },
  { feature: 'Contracts',             us: 'None — cancel anytime',                 agency: '6–12 month lock-ins typical',             freelancer: 'Per-project, rebid every time' },
  { feature: 'Pricing transparency',  us: 'Published on the website',              agency: '"Let\'s schedule a call"',                freelancer: 'Race to the bottom' },
  { feature: 'Ongoing support',       us: 'Monthly retainer with updates',         agency: 'Billable hours for everything',           freelancer: 'Hire again for each change' },
  { feature: 'Accountability',        us: 'One person, full ownership',            agency: 'Finger-pointing between teams',           freelancer: 'Disappears after delivery' },
];

const Tick = () => <Check size={18} color="#2AA5A0" strokeWidth={2.5} aria-label="Yes" />;
const Cross = () => <X size={18} color="rgba(255,255,255,.3)" strokeWidth={2} aria-label="No" />;

export default function Comparison() {
  return (
    <section className="panel" id="comparison" aria-label="How AIandWEBservices compares" style={{ background: 'var(--navy)' }}>
      <div className="comparison-inner">
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px', width: '100%' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div className="panel-eyebrow">Why Us</div>
          <h2 className="panel-h2" style={{ color: '#fff' }}>How AIandWEBservices Compares</h2>
          <p className="panel-sub" style={{ color: 'rgba(255,255,255,.55)' }}>One person. One connected system. No runaround.</p>
        </div>

        {/* ── MOBILE: stacked cards (hidden on desktop) ── */}
        <div className="cmp-mobile">
          {/* AIandWEBservices card */}
          <div style={{
            background: 'rgba(42,165,160,.08)',
            border: '1.5px solid rgba(42,165,160,.4)',
            borderTop: '3px solid #2AA5A0',
            borderRadius: '14px',
            padding: '20px',
            marginBottom: '16px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <span style={{ fontWeight: 800, color: '#fff', fontSize: '1rem' }}>AIandWEBservices</span>
              <span style={{
                background: '#2AA5A0', color: '#fff', fontSize: '10px', fontWeight: 700,
                padding: '2px 8px', borderRadius: '20px', letterSpacing: '0.5px', textTransform: 'uppercase',
              }}>Recommended</span>
            </div>
            {rows.map((r) => (
              <div key={r.feature} style={{ display: 'flex', gap: '10px', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,.06)' }}>
                <Tick />
                <div>
                  <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,.4)', marginBottom: '2px' }}>{r.feature}</div>
                  <div style={{ fontSize: '0.88rem', color: '#fff' }}>{r.us}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Agency card */}
          <div style={{
            background: 'rgba(255,255,255,.03)',
            border: '1px solid rgba(255,255,255,.08)',
            borderRadius: '14px',
            padding: '20px',
            marginBottom: '16px',
          }}>
            <div style={{ fontWeight: 700, color: 'rgba(255,255,255,.6)', fontSize: '0.95rem', marginBottom: '16px' }}>Traditional Agency</div>
            {rows.map((r) => (
              <div key={r.feature} style={{ display: 'flex', gap: '10px', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,.06)' }}>
                <Cross />
                <div>
                  <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,.35)', marginBottom: '2px' }}>{r.feature}</div>
                  <div style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,.5)' }}>{r.agency}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Freelancer card */}
          <div style={{
            background: 'rgba(255,255,255,.03)',
            border: '1px solid rgba(255,255,255,.08)',
            borderRadius: '14px',
            padding: '20px',
          }}>
            <div style={{ fontWeight: 700, color: 'rgba(255,255,255,.6)', fontSize: '0.95rem', marginBottom: '16px' }}>Freelancer Platforms</div>
            {rows.map((r) => (
              <div key={r.feature} style={{ display: 'flex', gap: '10px', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,.06)' }}>
                <Cross />
                <div>
                  <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,.35)', marginBottom: '2px' }}>{r.feature}</div>
                  <div style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,.5)' }}>{r.freelancer}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── DESKTOP: full 3-column table (hidden on mobile) ── */}
        <div className="cmp-desktop" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
            <colgroup>
              <col style={{ width: '22%' }} />
              <col style={{ width: '26%' }} />
              <col style={{ width: '26%' }} />
              <col style={{ width: '26%' }} />
            </colgroup>
            <thead>
              <tr>
                <th style={{ padding: '0 16px 20px 0', textAlign: 'left' }}></th>

                {/* AIandWEBservices header */}
                <th style={{ padding: '0 12px 0', textAlign: 'left' }}>
                  <div style={{
                    background: 'rgba(42,165,160,.08)',
                    border: '1.5px solid rgba(42,165,160,.4)',
                    borderTop: '3px solid #2AA5A0',
                    borderRadius: '12px 12px 0 0',
                    padding: '14px 16px 12px',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: 800, color: '#fff', fontSize: '0.95rem' }}>AIandWEBservices</span>
                      <span style={{
                        background: '#2AA5A0', color: '#fff', fontSize: '10px', fontWeight: 700,
                        padding: '2px 7px', borderRadius: '20px', letterSpacing: '0.5px', textTransform: 'uppercase',
                      }}>Recommended</span>
                    </div>
                  </div>
                </th>

                {/* Agency header */}
                <th style={{ padding: '0 12px 0', textAlign: 'left' }}>
                  <div style={{
                    background: 'rgba(255,255,255,.03)',
                    border: '1px solid rgba(255,255,255,.08)',
                    borderBottom: 'none',
                    borderRadius: '12px 12px 0 0',
                    padding: '14px 16px 12px',
                  }}>
                    <span style={{ fontWeight: 700, color: 'rgba(255,255,255,.55)', fontSize: '0.9rem' }}>Traditional Agency</span>
                  </div>
                </th>

                {/* Freelancer header */}
                <th style={{ padding: '0 0 0 12px', textAlign: 'left' }}>
                  <div style={{
                    background: 'rgba(255,255,255,.03)',
                    border: '1px solid rgba(255,255,255,.08)',
                    borderBottom: 'none',
                    borderRadius: '12px 12px 0 0',
                    padding: '14px 16px 12px',
                  }}>
                    <span style={{ fontWeight: 700, color: 'rgba(255,255,255,.55)', fontSize: '0.9rem' }}>Freelancer Platforms</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => {
                const isLast = i === rows.length - 1;
                const rowBg = i % 2 === 0 ? 'rgba(255,255,255,.015)' : 'transparent';
                const cellBase = { padding: '13px 16px', fontSize: '0.875rem', verticalAlign: 'middle' };
                return (
                  <tr key={r.feature} style={{ background: rowBg }}>
                    {/* Feature label */}
                    <td style={{ ...cellBase, fontWeight: 700, color: 'rgba(255,255,255,.75)', paddingLeft: 0 }}>
                      {r.feature}
                    </td>

                    {/* AIandWEBservices cell */}
                    <td style={{
                      ...cellBase,
                      background: 'rgba(42,165,160,.06)',
                      borderLeft: '1.5px solid rgba(42,165,160,.35)',
                      borderRight: '1.5px solid rgba(42,165,160,.35)',
                      borderBottom: isLast ? '1.5px solid rgba(42,165,160,.35)' : '1px solid rgba(42,165,160,.15)',
                      borderRadius: isLast ? '0 0 12px 12px' : '0',
                      margin: '0 12px',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                        <span style={{ flexShrink: 0, marginTop: '1px' }}><Tick /></span>
                        <span style={{ color: '#fff' }}>{r.us}</span>
                      </div>
                    </td>

                    {/* Agency cell */}
                    <td style={{
                      ...cellBase,
                      borderLeft: '1px solid rgba(255,255,255,.07)',
                      borderRight: '1px solid rgba(255,255,255,.07)',
                      borderBottom: isLast ? '1px solid rgba(255,255,255,.08)' : '1px solid rgba(255,255,255,.05)',
                      borderRadius: isLast ? '0 0 12px 12px' : '0',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                        <span style={{ flexShrink: 0, marginTop: '1px' }}><Cross /></span>
                        <span style={{ color: 'rgba(255,255,255,.5)' }}>{r.agency}</span>
                      </div>
                    </td>

                    {/* Freelancer cell */}
                    <td style={{
                      ...cellBase,
                      borderLeft: '1px solid rgba(255,255,255,.07)',
                      borderRight: '1px solid rgba(255,255,255,.07)',
                      borderBottom: isLast ? '1px solid rgba(255,255,255,.08)' : '1px solid rgba(255,255,255,.05)',
                      borderRadius: isLast ? '0 0 12px 12px' : '0',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                        <span style={{ flexShrink: 0, marginTop: '1px' }}><Cross /></span>
                        <span style={{ color: 'rgba(255,255,255,.5)' }}>{r.freelancer}</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Bottom CTA */}
        <div style={{
          marginTop: 'clamp(40px, 7vh, 85px)',
          padding: '20px 28px',
          background: 'rgba(42,165,160,.08)',
          border: '1px solid rgba(42,165,160,.3)',
          borderRadius: '14px',
          maxWidth: '960px',
          width: '100%',
          marginLeft: 'auto',
          marginRight: 'auto',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '14px',
        }}>
          <p style={{ color: 'rgba(255,255,255,.7)', fontSize: '15px', margin: 0, lineHeight: '1.6' }}>
            <strong style={{ color: '#fff' }}>Ready to work with someone who actually builds and maintains your systems?</strong>
          </p>
          <button
            className="btn-primary"
            onClick={() => window.go && window.go(8)}
            style={{ display: 'inline-flex' }}
          >
            Get Your Free Audit →
          </button>
        </div>

      </div>
      </div>
    </section>
  );
}
