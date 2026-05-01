'use client';
import { useEffect, useRef, useState, useMemo } from 'react';
import {
  C, THEMES, I18N, FONT_DISPLAY, FONT_BODY, FONT_MONO,
  FLEET, monthlyPayment, fmt, fmtMi, useInView, VTag,
} from './_internals';
import { useCustomerConfig } from './CustomerConfigContext';

export function AIChatWidget({ open, onToggle }) {
  const cfg = useCustomerConfig();
  const dealerInitial = (cfg.dealerName || 'D').charAt(0).toUpperCase();
  const botName = `${(cfg.dealerName || 'DEALER').split(' ')[0].toUpperCase()} BOT`;
  const [msgs, setMsgs] = useState([
    { from: 'bot', text: 'Hi! I can help you find the right car, check financing, or schedule a test drive. What are you looking for?' },
  ]);
  const [input, setInput] = useState('');
  const listRef = useRef(null);

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [msgs]);

  const reply = (text) => {
    const lower = text.toLowerCase();
    if (lower.includes('suv') && (lower.includes('40') || lower.includes('under'))) {
      return "Yes! We have 3 SUVs under $40K — the 2021 Lexus RX at $31,995, the 2023 Tesla Model Y at $36,500, and the 2022 Mercedes GLE on sale at $38,750. Want to schedule a test drive?";
    }
    if (lower.includes('rate') || lower.includes('financ') || lower.includes('credit')) {
      return "Pre-approval is 60 seconds, soft pull only — no impact to your score. APRs start at 2.9% for top-tier credit, and we work with all credit situations down to rebuilding. Want me to start your application?";
    }
    if (lower.includes('test drive') || lower.includes('schedule') || lower.includes('appointment')) {
      return "Easy. Pick a slot Monday–Saturday 9–8 or Sunday 10–6. The car will be detailed and ready when you arrive. Which vehicle, and what time works?";
    }
    if (lower.includes('trade')) {
      return "Drop your year, make, model and mileage and I'll pull a live wholesale-auction range in 60 seconds. We honor most quotes for 7 days.";
    }
    return "I can help with inventory, financing, trade-in values, or test-drive scheduling. Want me to send you to a human in 60 seconds?";
  };

  const send = (text) => {
    if (!text.trim()) return;
    setMsgs(m => [...m, { from: 'user', text }]);
    setInput('');
    setTimeout(() => setMsgs(m => [...m, { from: 'bot', text: reply(text) }]), 700);
  };

  const quickReplies = ['Browse SUVs', 'Check My Rate', 'Schedule Test Drive'];

  return (
    <>
      {/* bubble */}
      <button onClick={onToggle} className="chat-bubble" style={{
        position: 'fixed', right: 24, bottom: 24, zIndex: 50,
        width: 60, height: 60,
        background: C.gold, color: '#08080A',
        border: `2px solid ${C.gold}`, cursor: 'pointer',
        clipPath: 'polygon(50% 0, 100% 30%, 100% 100%, 0 100%, 0 30%)',
        display: 'grid', placeItems: 'center',
        fontSize: 26, fontWeight: 800,
        boxShadow: `0 8px 30px ${C.gold}55, 0 0 24px ${C.gold}40`,
        transition: 'transform 200ms',
      }}>
        <span style={{ marginTop: 4 }}>{open ? '×' : '◴'}</span>
        {!open && (
          <span aria-hidden style={{
            position: 'absolute', inset: -3,
            clipPath: 'polygon(50% 0, 100% 30%, 100% 100%, 0 100%, 0 30%)',
            border: `2px solid ${C.gold}`,
            animation: 'chatPulse 2s ease-out infinite',
            pointerEvents: 'none',
          }} />
        )}
      </button>

      {/* panel */}
      {open && (
        <div className="chat-panel" style={{
          position: 'fixed', right: 24, bottom: 100, zIndex: 49,
          width: 360, maxWidth: 'calc(100vw - 48px)',
          height: 540, maxHeight: 'calc(100vh - 140px)',
          background: 'var(--c-glass)', backdropFilter: 'blur(20px) saturate(160%)',
          border: `1px solid ${C.gold}`,
          boxShadow: `0 20px 60px rgba(0,0,0,0.6), 0 0 30px ${C.gold}30`,
          display: 'flex', flexDirection: 'column',
          animation: 'chatSlide 240ms cubic-bezier(0.2,0.8,0.2,1)',
        }}>
          {/* header */}
          <div style={{
            padding: '14px 18px', borderBottom: `1px solid ${C.rule}`,
            display: 'flex', alignItems: 'center', gap: 10,
            background: C.bg2,
          }}>
            <div style={{
              width: 32, height: 32,
              background: C.red,
              clipPath: 'polygon(50% 0, 100% 30%, 100% 100%, 0 100%, 0 30%)',
              display: 'grid', placeItems: 'center',
              color: '#FFF', fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 16,
            }}>{dealerInitial}</div>
            <div style={{ flex: 1 }}>
              <div style={{
                fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 14,
                color: C.ink, letterSpacing: 0.3,
              }}>{botName}</div>
              <div style={{
                fontFamily: FONT_MONO, fontSize: 9, letterSpacing: 1.5, color: C.cyan,
                display: 'flex', alignItems: 'center', gap: 5,
              }}>
                <span style={{
                  width: 6, height: 6, borderRadius: '50%', background: C.cyan,
                  boxShadow: `0 0 6px ${C.cyan}`,
                }} />
                ONLINE · POWERED BY AI · 24/7
              </div>
            </div>
            <button onClick={onToggle} style={{
              width: 26, height: 26, background: 'transparent',
              border: `1px solid ${C.rule2}`, color: C.gold, cursor: 'pointer',
              fontSize: 12,
            }}>−</button>
          </div>

          {/* messages */}
          <div ref={listRef} style={{
            flex: 1, padding: 16, overflowY: 'auto',
            display: 'flex', flexDirection: 'column', gap: 10,
          }}>
            {msgs.map((m, i) => (
              <div key={i} style={{
                alignSelf: m.from === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '85%',
                padding: '10px 14px',
                background: m.from === 'user' ? C.gold : C.panel,
                color: m.from === 'user' ? '#08080A' : C.ink,
                border: m.from === 'user' ? 'none' : `1px solid ${C.rule}`,
                fontFamily: FONT_BODY, fontSize: 13, lineHeight: 1.5,
              }}>{m.text}</div>
            ))}
          </div>

          {/* quick replies */}
          {msgs.length < 3 && (
            <div style={{
              padding: '0 16px 12px', display: 'flex', gap: 6, flexWrap: 'wrap',
            }}>
              {quickReplies.map(q => (
                <button key={q} onClick={() => send(q)} style={{
                  background: 'transparent', border: `1px solid ${C.cyan}55`,
                  color: C.cyan, fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 1,
                  padding: '6px 10px', cursor: 'pointer', fontWeight: 600,
                }}>+ {q}</button>
              ))}
            </div>
          )}

          {/* input */}
          <form onSubmit={(e) => { e.preventDefault(); send(input); }} style={{
            padding: 14, borderTop: `1px solid ${C.rule}`,
            display: 'flex', gap: 8, background: C.bg2,
          }}>
            <input
              value={input} onChange={e => setInput(e.target.value)}
              placeholder="Ask anything..." style={{
                flex: 1, background: 'transparent', border: 'none',
                borderBottom: `1px solid ${C.rule2}`,
                color: C.ink, fontFamily: FONT_BODY, fontSize: 13,
                padding: '6px 4px',
              }}
            />
            <button type="submit" style={{
              background: C.gold, color: '#08080A', border: 'none', cursor: 'pointer',
              padding: '6px 14px', fontFamily: FONT_MONO, fontSize: 11,
              letterSpacing: 1.5, fontWeight: 700,
            }}>SEND ▸</button>
          </form>
        </div>
      )}
    </>
  );
}

/* ─── Compare Modal ────────────────────────────────── */
