'use client';
import { useEffect, useRef, useState, useMemo } from 'react';
import {
  C, THEMES, I18N, FONT_DISPLAY, FONT_BODY, FONT_MONO,
  FLEET, monthlyPayment, fmt, fmtMi, useInView, VTag,
} from './_internals';
import { useCustomerConfig } from './CustomerConfigContext';

export function TradeIn() {
  const [ref, seen] = useInView();
  const [out, setOut] = useState(null);
  const [running, setRunning] = useState(false);

  const run = () => {
    setRunning(true);
    setOut(null);
    setTimeout(() => {
      setOut({ low: 12400, high: 14200 });
      setRunning(false);
    }, 1100);
  };

  return (
    <section ref={ref} id="trade" style={{
      position: 'relative', padding: '100px 0',
      background: C.bg2, borderTop: `1px solid ${C.rule}`,
    }}>
      <VTag num={3} label="TRADE-IN ESTIMATOR" color={C.cyan} />

      <div style={{
        paddingLeft: 96, paddingRight: 48,
        display: 'grid', gridTemplateColumns: '0.85fr 1.15fr', gap: 48,
        opacity: seen ? 1 : 0, transform: seen ? 'translateY(0)' : 'translateY(40px)',
        transition: 'opacity 700ms, transform 700ms',
      }} className="trade-grid">
        {/* left intro */}
        <div>
          <div style={{
            fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 3, color: C.cyan,
            marginBottom: 12,
          }}>03 / TRADE-IN ESTIMATOR</div>
          <h2 style={{
            fontFamily: FONT_DISPLAY, fontWeight: 700,
            fontSize: 'clamp(2.25rem, 4.5vw, 4rem)', lineHeight: 0.92,
            letterSpacing: '-1.8px', color: C.ink, margin: 0,
            textTransform: 'uppercase', marginBottom: 18,
          }}>What's it <span style={{ color: C.red }}>worth?</span></h2>
          <p style={{
            fontFamily: FONT_BODY, color: C.inkDim, fontSize: 15,
            lineHeight: 1.55, margin: 0, marginBottom: 24,
          }}>
            Drop your VIN — or pick year/make/model — and we'll bounce it against three live wholesale auctions in 60 seconds.
            Bring it in for the precise number.
          </p>

          <div style={{
            fontFamily: FONT_MONO, fontSize: 11, color: C.inkLow, lineHeight: 1.7,
            paddingLeft: 14, borderLeft: `1px solid ${C.rule2}`,
          }}>
            ▸ Manheim live data<br />
            ▸ ADESA wholesale<br />
            ▸ KBB instant offer<br />
            ▸ Honored 7 days
          </div>
        </div>

        {/* right: terminal + form */}
        <div style={{
          background: '#02030A', border: `1px solid ${C.rule2}`,
          fontFamily: FONT_MONO,
        }}>
          {/* terminal title bar */}
          <div style={{
            padding: '10px 14px', borderBottom: `1px solid ${C.rule2}`,
            display: 'flex', alignItems: 'center', gap: 6,
            background: '#06060E',
          }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#FF5F57' }} />
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#FFBD2E' }} />
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#28CA41' }} />
            <span style={{
              flex: 1, textAlign: 'center', fontSize: 10, color: C.inkLow, letterSpacing: 1,
            }}>primo://trade-est ~ session 0501</span>
          </div>

          {/* form rows */}
          <div style={{ padding: 24 }}>
            {[
              { lab: 'YEAR',     opts: ['2024', '2023', '2022', '2021', '2020', 'OLDER'] },
              { lab: 'MAKE',     opts: ['TOYOTA', 'HONDA', 'FORD', 'CHEVY', 'NISSAN', 'OTHER'] },
              { lab: 'MODEL',    opts: ['MODEL'] },
              { lab: 'MILEAGE',  opts: ['<30K', '30-60K', '60-100K', '>100K'] },
            ].map(d => (
              <div key={d.lab} style={{
                display: 'grid', gridTemplateColumns: '120px 1fr',
                alignItems: 'center', marginBottom: 12,
              }}>
                <span style={{ color: C.cyan, fontSize: 11, letterSpacing: 1.5 }}>$ {d.lab}</span>
                <select style={{
                  appearance: 'none', background: 'transparent',
                  border: 'none', borderBottom: `1px dashed ${C.rule2}`,
                  color: C.ink, fontFamily: FONT_MONO, fontSize: 13, padding: '6px 4px',
                  cursor: 'pointer',
                }}>
                  {d.opts.map(o => <option key={o} style={{ background: '#02030A' }}>{o}</option>)}
                </select>
              </div>
            ))}
            <div style={{
              display: 'grid', gridTemplateColumns: '120px 1fr',
              alignItems: 'center', marginBottom: 16,
            }}>
              <span style={{ color: C.cyan, fontSize: 11, letterSpacing: 1.5 }}>$ CONDITION</span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 4 }}>
                {['EXC', 'GOOD', 'FAIR', 'POOR'].map(c => (
                  <button key={c} style={{
                    background: 'transparent', border: `1px solid ${C.rule2}`,
                    color: C.inkDim, fontFamily: FONT_MONO, fontSize: 10,
                    padding: '6px 0', cursor: 'pointer', letterSpacing: 1,
                  }}>{c}</button>
                ))}
              </div>
            </div>

            <button onClick={run} disabled={running} style={{
              width: '100%', padding: '14px',
              background: running ? C.rule : C.cyan,
              color: C.bg, border: 'none', cursor: running ? 'wait' : 'pointer',
              fontFamily: FONT_MONO, fontSize: 12, fontWeight: 700, letterSpacing: 2,
            }}>{running ? 'RUNNING DIAGNOSTIC ⋯' : '▸ EXECUTE TRADE-EST'}</button>

            {/* terminal output */}
            <div style={{
              marginTop: 18, padding: 14, minHeight: 110,
              background: 'rgba(91,227,255,0.05)',
              border: `1px solid ${C.cyan}33`,
              fontSize: 11, color: C.cyan, lineHeight: 1.7,
            }}>
              {!out && !running && <div style={{ color: C.inkLow }}>{`> awaiting input ⋯`}</div>}
              {running && (
                <div>
                  <div>{`> querying manheim ............ OK`}</div>
                  <div>{`> querying adesa .............. OK`}</div>
                  <div>{`> querying kbb instant ........ ⋯`}</div>
                </div>
              )}
              {out && (
                <div>
                  <div>{`> querying manheim ............ OK`}</div>
                  <div>{`> querying adesa .............. OK`}</div>
                  <div>{`> querying kbb instant ........ OK`}</div>
                  <div style={{ color: C.gold, marginTop: 6 }}>{`> RANGE: $${out.low.toLocaleString()} – $${out.high.toLocaleString()}`}</div>
                  <div style={{ color: C.inkDim, marginTop: 4 }}>{`> bring it in for an exact appraisal`}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── 04 · FINANCE ─────────────────────────────────── */
