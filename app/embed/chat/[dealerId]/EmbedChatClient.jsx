'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';

const MAX_MESSAGES = 50;
const nowIso = () => new Date().toISOString();
const genId = () => Math.random().toString(36).slice(2, 11);

function postToParent(data) {
  if (typeof window === 'undefined' || window.parent === window) return;
  try {
    window.parent.postMessage(data, '*');
  } catch {
    /* parent may not accept — non-fatal */
  }
}

export default function EmbedChatClient({ dealerId }) {
  const sp = useSearchParams();
  const color = sp.get('color') || '#D4AF37';
  const nameOverride = sp.get('name') || '';
  const greetingOverride = sp.get('greeting') || '';

  const [config, setConfig] = useState(null);
  const [configLoaded, setConfigLoaded] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [sessionId] = useState(() => genId() + '-' + Date.now());
  const [leadCaptured, setLeadCaptured] = useState(false);

  const listRef = useRef(null);
  const inputRef = useRef(null);

  // Load dealer config (for fallback greeting / name / phone).
  useEffect(() => {
    let cancelled = false;
    fetch(`/api/dealer/${encodeURIComponent(dealerId)}/embed/config`, { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => {
        if (cancelled) return;
        setConfig(d?.ok ? d.config : null);
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setConfigLoaded(true); });
    return () => { cancelled = true; };
  }, [dealerId]);

  const dealerName = nameOverride || config?.dealerName || 'our team';
  const phone = config?.phone || '';
  const greeting = greetingOverride
    || config?.greeting
    || `Hi! How can I help you find the right vehicle at ${dealerName}?`;

  // Seed greeting once config has resolved (or after a short fallback timeout).
  useEffect(() => {
    if (!configLoaded || messages.length > 0) return;
    setMessages([{ id: genId(), role: 'assistant', content: greeting, timestamp: nowIso() }]);
  }, [configLoaded, greeting, messages.length]);

  // Autoscroll on new messages.
  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, sending]);

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || sending) return;

    const userMsg = { id: genId(), role: 'user', content: text, timestamp: nowIso() };
    const next = [...messages, userMsg].slice(-MAX_MESSAGES);
    setMessages(next);
    setInput('');
    setSending(true);

    try {
      const conversationHistory = next.map((m) => ({ role: m.role, content: m.content }));
      const res = await fetch(`/api/dealer/${encodeURIComponent(dealerId)}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, conversationHistory, sessionId }),
      });
      const data = await res.json().catch(() => ({}));
      const reply = data && typeof data.reply === 'string' && data.reply
        ? data.reply
        : `I'm having trouble right now.${phone ? ' Please call us at ' + phone : ''}`;

      setMessages((m) => [
        ...m,
        { id: genId(), role: 'assistant', content: reply, timestamp: nowIso() },
      ].slice(-MAX_MESSAGES));

      if (data && data.leadCaptured && !leadCaptured) {
        setLeadCaptured(true);
        postToParent({
          type: 'lotpilot:lead',
          dealer: dealerId,
          email: data.lead?.email,
          phone: data.lead?.phone,
          name: data.lead?.name,
        });
      }
    } catch {
      setMessages((m) => [
        ...m,
        {
          id: genId(),
          role: 'assistant',
          content: `I'm having trouble right now.${phone ? ' Please call us at ' + phone : ''}`,
          timestamp: nowIso(),
        },
      ].slice(-MAX_MESSAGES));
    } finally {
      setSending(false);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [input, sending, messages, dealerId, sessionId, phone, leadCaptured]);

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!sending) sendMessage();
    }
  };

  const headerStyle = useMemo(
    () => ({
      background: color,
      color: '#08080A',
    }),
    [color],
  );

  return (
    <div className="lp-root">
      <header className="lp-head" style={headerStyle}>
        <div className="lp-head-inner">
          <div className="lp-title">{dealerName}</div>
          <div className="lp-sub">AI Sales Assistant{phone ? ` · ${phone}` : ''}</div>
        </div>
        <button
          type="button"
          aria-label="Close chat"
          className="lp-close"
          onClick={() => postToParent('lotpilot:close')}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </header>

      <div ref={listRef} className="lp-list">
        {messages.map((m) => (
          <div key={m.id} className={`lp-row lp-row-${m.role}`}>
            <div
              className="lp-bubble"
              style={m.role === 'user' ? { background: color, color: '#08080A' } : undefined}
            >
              {m.content}
            </div>
          </div>
        ))}
        {sending && (
          <div className="lp-row lp-row-assistant">
            <div className="lp-bubble lp-typing">
              <span /><span /><span />
            </div>
          </div>
        )}
      </div>

      <div className="lp-foot">
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Type your message…"
          rows={1}
          disabled={sending}
        />
        <button
          type="button"
          onClick={sendMessage}
          disabled={sending || !input.trim()}
          className="lp-send"
          style={{ background: color }}
          aria-label="Send message"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#08080A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>

      <style jsx>{`
        :global(html, body) { margin: 0; padding: 0; height: 100%; background: #fff; }
        .lp-root {
          position: fixed; inset: 0;
          display: flex; flex-direction: column;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          font-size: 14px; color: #1c1917; background: #fff;
        }
        .lp-head {
          display: flex; align-items: center; justify-content: space-between;
          padding: 14px 16px;
        }
        .lp-head-inner { min-width: 0; }
        .lp-title { font-weight: 700; font-size: 15px; line-height: 1.1; }
        .lp-sub   { font-size: 11px; opacity: 0.75; margin-top: 2px; }
        .lp-close {
          background: rgba(0,0,0,0.08); border: none; cursor: pointer;
          width: 28px; height: 28px; border-radius: 50%;
          display: inline-flex; align-items: center; justify-content: center;
          color: #08080A;
        }
        .lp-close:hover { background: rgba(0,0,0,0.16); }
        .lp-list {
          flex: 1; overflow-y: auto;
          padding: 14px; background: #fafaf7;
          display: flex; flex-direction: column; gap: 8px;
        }
        .lp-row { display: flex; }
        .lp-row-assistant { justify-content: flex-start; }
        .lp-row-user { justify-content: flex-end; }
        .lp-bubble {
          max-width: 80%; padding: 9px 12px; border-radius: 14px;
          background: #fff; border: 1px solid #e7e5e4;
          line-height: 1.4; white-space: pre-wrap; word-wrap: break-word;
        }
        .lp-typing { display: inline-flex; gap: 4px; padding: 12px; }
        .lp-typing span {
          width: 6px; height: 6px; border-radius: 50%; background: #a8a29e;
          animation: lp-bounce 1.2s infinite ease-in-out both;
        }
        .lp-typing span:nth-child(2) { animation-delay: 0.15s; }
        .lp-typing span:nth-child(3) { animation-delay: 0.3s; }
        @keyframes lp-bounce {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.5; }
          40% { transform: scale(1); opacity: 1; }
        }
        .lp-foot {
          display: flex; gap: 8px; padding: 10px;
          border-top: 1px solid #e7e5e4; background: #fff;
        }
        .lp-foot textarea {
          flex: 1; resize: none; border: 1px solid #d6d3d1;
          border-radius: 10px; padding: 9px 12px; font: inherit; outline: none;
          max-height: 100px;
        }
        .lp-foot textarea:focus { border-color: #a8a29e; }
        .lp-send {
          width: 40px; height: 40px; border-radius: 10px; border: none;
          cursor: pointer; display: inline-flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .lp-send:disabled { opacity: 0.5; cursor: not-allowed; }
      `}</style>
    </div>
  );
}
