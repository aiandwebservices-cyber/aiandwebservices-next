'use client';
import { useState, useEffect, useRef } from 'react';

export default function ChatWidget({ accent = '#2AA5A0', agentName = 'AI Assistant', greeting = "Hi! How can I help you today?", quickReplies = ['Learn more', 'Get a quote', 'Contact us'], autoReplies = {} }) {
  const [open, setOpen]       = useState(false);
  const [bubbleVis, setBubbleVis] = useState(false);
  const [msgs, setMsgs]       = useState([{ from: 'bot', text: greeting }]);
  const [typing, setTyping]   = useState(false);
  const [input, setInput]     = useState('');
  const [isPreview, setIsPreview] = useState(false);
  const endRef                = useRef(null);

  // Auto-open the full chat at 3.5s — skip the plain bubble
  useEffect(() => {
    setIsPreview(window.self !== window.top);
    const t = setTimeout(() => setOpen(true), 3500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [msgs, typing]);

  function sendReply(text) {
    setMsgs(m => [...m, { from: 'user', text }]);
    setTyping(true);
    const response = autoReplies[text] || "Thanks! A member of our team will follow up shortly. Is there anything else I can help with?";
    setTimeout(() => {
      setTyping(false);
      setMsgs(m => [...m, { from: 'bot', text: response }]);
    }, 1200);
  }

  function handleSend() {
    if (!input.trim()) return;
    sendReply(input.trim());
    setInput('');
  }

  const bg = '#0f172a';
  const lighter = '#1e293b';

  // Compact dims for preview (iframe), full dims for direct page view
  const w          = isPreview ? 214  : 320;
  const msgH       = isPreview ? 110  : 200;
  const headerPad  = isPreview ? '8px 12px'  : '12px 16px';
  const avatarSz   = isPreview ? 26   : 36;
  const avatarFont = isPreview ? 13   : 18;
  const nameFnt    = isPreview ? 11   : 14;
  const statusFnt  = isPreview ? 9    : 11;
  const dotSz      = isPreview ? 5    : 6;
  const closeSz    = isPreview ? 22   : 28;
  const msgFnt     = isPreview ? 11   : 13;
  const msgPad     = isPreview ? '7px 10px' : '10px 14px';
  const msgGap     = isPreview ? 5    : 8;
  const msgAreaPad = isPreview ? '8px 10px' : '12px 14px';
  const qrPad      = isPreview ? '0 8px 6px'  : '0 12px 10px';
  const qrGap      = isPreview ? 4    : 6;
  const qrFnt      = isPreview ? 10   : 12;
  const qrBtnPad   = isPreview ? '3px 8px'    : '5px 12px';
  const inputPad   = isPreview ? '6px 8px'    : '10px 12px';
  const inputFnt   = isPreview ? 11   : 13;
  const inputIPad  = isPreview ? '6px 10px'   : '9px 14px';
  const sendSz     = isPreview ? 28   : 36;
  const sendIcon   = isPreview ? 11   : 14;
  const toggleSz   = isPreview ? 56   : 64;

  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, fontFamily: "'Inter',sans-serif" }}>

      {/* Chat window */}
      {open && (
        <div style={{
          position: 'absolute', bottom: toggleSz + 14, right: 0,
          width: w, borderRadius: 14,
          background: bg, border: `1px solid ${accent}30`,
          boxShadow: `0 24px 64px rgba(0,0,0,.45), 0 0 0 1px ${accent}20`,
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
          animation: 'cwSlideIn .35s cubic-bezier(.16,1,.3,1)',
        }}>
          {/* Header */}
          <div style={{ background: accent, padding: headerPad, display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: avatarSz, height: avatarSz, borderRadius: '50%', background: 'rgba(255,255,255,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: avatarFont }}>🤖</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: nameFnt, fontWeight: 700, color: '#fff' }}>{agentName}</div>
              <div style={{ fontSize: statusFnt, color: 'rgba(255,255,255,.75)', display: 'flex', alignItems: 'center', gap: 3 }}>
                <span style={{ width: dotSz, height: dotSz, borderRadius: '50%', background: '#4ade80', display: 'inline-block' }} />
                Online · Replies instantly
              </div>
            </div>
            <button onClick={() => setOpen(false)} style={{ background: 'rgba(255,255,255,.2)', border: 'none', borderRadius: '50%', width: closeSz, height: closeSz, cursor: 'pointer', color: '#fff', fontSize: nameFnt, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: msgAreaPad, display: 'flex', flexDirection: 'column', gap: msgGap, maxHeight: msgH }}>
            {msgs.map((m, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: m.from === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: '82%', padding: msgPad, borderRadius: m.from === 'user' ? '10px 10px 3px 10px' : '10px 10px 10px 3px',
                  background: m.from === 'user' ? accent : lighter,
                  color: m.from === 'user' ? '#fff' : 'rgba(255,255,255,.85)',
                  fontSize: msgFnt, lineHeight: 1.5, fontWeight: 400,
                }}>
                  {m.text}
                </div>
              </div>
            ))}
            {typing && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{ background: lighter, borderRadius: '14px 14px 14px 4px', padding: '10px 14px', display: 'flex', gap: 4 }}>
                  {[0,1,2].map(i => (
                    <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: accent, animation: `cwDot 1.2s ease-in-out ${i * .2}s infinite` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Quick replies */}
          {msgs.length < 3 && (
            <div style={{ padding: qrPad, display: 'flex', flexWrap: 'wrap', gap: qrGap }}>
              {quickReplies.map(q => (
                <button
                  key={q}
                  onClick={() => sendReply(q)}
                  style={{ fontSize: qrFnt, fontWeight: 600, padding: qrBtnPad, borderRadius: 50, border: `1px solid ${accent}50`, background: `${accent}12`, color: accent, cursor: 'pointer', fontFamily: "'Inter',sans-serif", transition: 'all .2s' }}
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div style={{ padding: inputPad, borderTop: `1px solid rgba(255,255,255,.07)`, display: 'flex', gap: 6 }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Type a message..."
              style={{ flex: 1, background: lighter, border: 'none', borderRadius: 50, padding: inputIPad, fontSize: inputFnt, color: '#fff', outline: 'none', fontFamily: "'Inter',sans-serif" }}
            />
            <button
              onClick={handleSend}
              style={{ width: sendSz, height: sendSz, borderRadius: '50%', background: accent, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
            >
              <svg width={sendIcon} height={sendIcon} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            </button>
          </div>
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: toggleSz, height: toggleSz, borderRadius: '50%',
          background: `linear-gradient(135deg, ${accent}, ${accent}cc)`,
          border: 'none', cursor: 'pointer',
          boxShadow: `0 8px 28px ${accent}55`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 24, transition: 'transform .2s, box-shadow .2s',
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        {open ? '✕' : '💬'}
      </button>

      <style>{`
        @keyframes cwSlideIn { from { opacity:0; transform:translateY(16px) scale(.96) } to { opacity:1; transform:none } }
        @keyframes cwDot { 0%,80%,100%{transform:scale(0.6);opacity:.4} 40%{transform:scale(1);opacity:1} }
        @keyframes cwPulse { 0%,100%{box-shadow:0 8px 28px ${accent}55} 50%{box-shadow:0 8px 40px ${accent}99,0 0 0 8px ${accent}22} }
      `}</style>
    </div>
  );
}
