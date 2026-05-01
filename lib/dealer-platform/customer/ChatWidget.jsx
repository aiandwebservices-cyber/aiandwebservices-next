'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { MessageCircle, X, Minus, Send } from 'lucide-react';
import { useCustomerConfig } from './CustomerConfigContext';

const MAX_MESSAGES = 50;
const SS_PREFIX = 'dealer-chat';

const KEYFRAMES = `
@keyframes chat-bubble-bounce {
  0%, 100% { transform: translateY(0); }
  25% { transform: translateY(-14px); }
  50% { transform: translateY(0); }
  75% { transform: translateY(-7px); }
}
@keyframes chat-typing-dot {
  0%, 60%, 100% { transform: translateY(0); opacity: 0.35; }
  30% { transform: translateY(-4px); opacity: 1; }
}
@keyframes chat-online-pulse {
  0% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7); }
  70% { box-shadow: 0 0 0 8px rgba(34, 197, 94, 0); }
  100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
}
@keyframes chat-panel-slide-up {
  from { opacity: 0; transform: translateY(20px) scale(0.96); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
`;

function genId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function nowIso() { return new Date().toISOString(); }

function relTime(iso) {
  if (!iso) return '';
  const sec = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 1000));
  if (sec < 60) return 'Just now';
  if (sec < 3600) return `${Math.floor(sec / 60)}m ago`;
  if (sec < 86400) return `${Math.floor(sec / 3600)}h ago`;
  return `${Math.floor(sec / 86400)}d ago`;
}

export function AIChatWidget({ open, onToggle }) {
  const cfg = useCustomerConfig();
  const dealerName = cfg.dealerName || 'Dealer';
  const dealerSlug = cfg.dealerSlug || 'demo';
  const phone = cfg.phone || '';
  const primary = cfg.colors?.primary || '#D4AF37';
  const dealerInitial = dealerName.charAt(0).toUpperCase();
  const sessionKey = `${SS_PREFIX}-session-${dealerSlug}`;
  const historyKey = `${SS_PREFIX}-history-${dealerSlug}`;

  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [bounce, setBounce] = useState(false);
  const [unread, setUnread] = useState(0);
  const [leadCaptured, setLeadCaptured] = useState(false);
  const [openedOnce, setOpenedOnce] = useState(false);

  const listRef = useRef(null);
  const inputRef = useRef(null);
  const wasOpen = useRef(false);

  // Initialize session and load persisted history once
  useEffect(() => {
    if (typeof window === 'undefined') return;
    let sid = window.sessionStorage.getItem(sessionKey);
    if (!sid) {
      sid = genId();
      window.sessionStorage.setItem(sessionKey, sid);
    }
    setSessionId(sid);

    const raw = window.sessionStorage.getItem(historyKey);
    if (raw) {
      try {
        const arr = JSON.parse(raw);
        if (Array.isArray(arr) && arr.length > 0) setMessages(arr);
      } catch {
        /* ignore corrupt history */
      }
    }
  }, [sessionKey, historyKey]);

  // First-load bounce after 3 seconds, only if widget hasn't been opened yet
  useEffect(() => {
    if (openedOnce) return undefined;
    const start = setTimeout(() => setBounce(true), 3000);
    const stop = setTimeout(() => setBounce(false), 5000);
    return () => { clearTimeout(start); clearTimeout(stop); };
  }, [openedOnce]);

  // Persist history (capped) on every change
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.sessionStorage.setItem(historyKey, JSON.stringify(messages.slice(-MAX_MESSAGES)));
    } catch {
      /* sessionStorage may be full or blocked */
    }
  }, [messages, historyKey]);

  // Open lifecycle: reset unread count, focus input, send greeting if empty
  useEffect(() => {
    if (!open) {
      wasOpen.current = false;
      return;
    }
    wasOpen.current = true;
    setOpenedOnce(true);
    setUnread(0);
    if (messages.length === 0) {
      setMessages([{
        id: genId(),
        role: 'assistant',
        content: 'Hi! 👋 I can help you find the right vehicle, answer questions about financing, or schedule a test drive. What are you looking for?',
        timestamp: nowIso(),
      }]);
    }
    requestAnimationFrame(() => inputRef.current?.focus());
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-scroll to bottom when new messages arrive or typing indicator toggles
  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, sending]);

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || sending || !sessionId) return;

    const userMsg = { id: genId(), role: 'user', content: text, timestamp: nowIso() };
    const next = [...messages, userMsg].slice(-MAX_MESSAGES);
    setMessages(next);
    setInput('');
    setSending(true);

    try {
      const conversationHistory = next.map((m) => ({ role: m.role, content: m.content }));
      const res = await fetch(`/api/dealer/${encodeURIComponent(dealerSlug)}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, conversationHistory, sessionId }),
      });
      const data = await res.json().catch(() => ({}));
      const reply = data && typeof data.reply === 'string' && data.reply
        ? data.reply
        : `I'm having trouble right now. Please call us at ${phone} for immediate help!`;

      setMessages((m) => [...m, {
        id: genId(), role: 'assistant', content: reply, timestamp: nowIso(),
      }].slice(-MAX_MESSAGES));
      if (data && data.leadCaptured) setLeadCaptured(true);
      if (!open) setUnread((n) => n + 1);
    } catch {
      setMessages((m) => [...m, {
        id: genId(),
        role: 'assistant',
        content: `I'm having trouble right now. Please call us at ${phone} for immediate help!`,
        timestamp: nowIso(),
      }].slice(-MAX_MESSAGES));
    } finally {
      setSending(false);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [input, sending, sessionId, messages, dealerSlug, phone, open]);

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!sending) sendMessage();
    }
  };

  const isMobile = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(max-width: 640px)').matches;

  const panelStyle = {
    position: 'fixed',
    right: isMobile ? 0 : 24,
    bottom: isMobile ? 0 : 92,
    left: isMobile ? 0 : 'auto',
    width: isMobile ? '100vw' : 380,
    maxWidth: isMobile ? '100vw' : 'calc(100vw - 24px)',
    height: isMobile ? '90vh' : 500,
    maxHeight: isMobile ? '90vh' : 'min(80vh, calc(100vh - 110px))',
    background: 'white',
    borderRadius: isMobile ? '16px 16px 0 0' : 16,
    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.35)',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    animation: 'chat-panel-slide-up 220ms cubic-bezier(0.2,0.8,0.2,1)',
    zIndex: 50,
    color: '#111827',
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: KEYFRAMES }} />

      {/* Floating chat bubble */}
      <button
        onClick={onToggle}
        aria-label={open ? 'Close chat' : 'Open chat'}
        style={{
          position: 'fixed',
          right: 24,
          bottom: 24,
          zIndex: 50,
          width: 48,
          height: 48,
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${primary} 0%, ${primary}cc 100%)`,
          color: '#0a0a0a',
          boxShadow: `0 8px 24px ${primary}66, 0 4px 12px rgba(0,0,0,0.2)`,
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: bounce && !open ? 'chat-bubble-bounce 1.2s ease-out' : 'none',
          transition: 'transform 200ms',
        }}
      >
        {open ? <X size={20} strokeWidth={2.5} /> : <MessageCircle size={22} strokeWidth={2} />}
        {!open && (
          <span aria-hidden style={{
            position: 'absolute',
            top: 2, right: 2,
            width: 12, height: 12, borderRadius: '50%',
            background: '#22C55E', border: '2px solid white',
            animation: 'chat-online-pulse 2s infinite',
          }} />
        )}
        {!open && unread > 0 && (
          <span aria-label={`${unread} unread messages`} style={{
            position: 'absolute',
            top: -4, left: -4,
            minWidth: 20, height: 20, borderRadius: 10,
            padding: '0 6px',
            background: '#DC2626', color: 'white',
            fontSize: 11, fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '2px solid white',
          }}>{unread > 9 ? '9+' : unread}</span>
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div role="dialog" aria-label={`Chat with ${dealerName}`} style={panelStyle}>
          {/* Header */}
          <div style={{
            background: '#0a0a0a',
            color: 'white',
            padding: '14px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            flexShrink: 0,
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: primary, color: '#0a0a0a',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 800, fontSize: 16,
              fontFamily: '"Plus Jakarta Sans", "Inter", system-ui, sans-serif',
            }}>{dealerInitial}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.2, color: 'white' }}>
                {dealerName} AI
              </div>
              <div style={{
                fontSize: 11, color: '#9CA3AF',
                display: 'flex', alignItems: 'center', gap: 6, marginTop: 2,
              }}>
                <span aria-hidden style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: '#22C55E', boxShadow: '0 0 6px #22C55E',
                }} />
                Online — typically responds instantly
              </div>
            </div>
            <button
              onClick={onToggle}
              aria-label="Minimize chat"
              style={{
                background: 'transparent', border: 'none', color: '#9CA3AF',
                cursor: 'pointer', padding: 6, borderRadius: 6,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <Minus size={18} />
            </button>
            <button
              onClick={onToggle}
              aria-label="Close chat"
              style={{
                background: 'transparent', border: 'none', color: '#9CA3AF',
                cursor: 'pointer', padding: 6, borderRadius: 6,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Lead-captured confirmation */}
          {leadCaptured && (
            <div role="status" style={{
              background: '#ECFDF5', color: '#065F46',
              padding: '8px 14px', fontSize: 12, fontWeight: 500,
              borderBottom: '1px solid #A7F3D0',
              display: 'flex', alignItems: 'center', gap: 6,
              flexShrink: 0,
            }}>
              <span aria-hidden>✓</span>
              A team member will follow up with you
            </div>
          )}

          {/* Message list */}
          <div
            ref={listRef}
            role="log"
            aria-live="polite"
            aria-label="Conversation"
            style={{
              flex: 1, overflowY: 'auto', padding: 16, background: '#FAFAFA',
              display: 'flex', flexDirection: 'column', gap: 10,
            }}
          >
            {messages.map((m) => {
              const isUser = m.role === 'user';
              return (
                <div key={m.id} style={{
                  display: 'flex',
                  justifyContent: isUser ? 'flex-end' : 'flex-start',
                }}>
                  <div style={{
                    maxWidth: '85%',
                    padding: '10px 14px',
                    borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                    background: isUser ? primary : '#F3F4F6',
                    color: isUser ? '#FFFFFF' : '#111827',
                    fontSize: 14, lineHeight: 1.45,
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    boxShadow: isUser ? 'none' : '0 1px 2px rgba(0,0,0,0.04)',
                  }}>
                    <div>{m.content}</div>
                    <div style={{
                      fontSize: 10, marginTop: 4,
                      color: isUser ? 'rgba(255,255,255,0.85)' : '#6B7280',
                    }}>{relTime(m.timestamp)}</div>
                  </div>
                </div>
              );
            })}
            {sending && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{
                  background: '#F3F4F6',
                  borderRadius: '16px 16px 16px 4px',
                  padding: '10px 14px',
                  color: '#6B7280', fontSize: 12,
                }}>
                  <div style={{ display: 'flex', gap: 4, alignItems: 'center', marginBottom: 4 }}>
                    {[0, 1, 2].map((i) => (
                      <span key={i} aria-hidden style={{
                        width: 6, height: 6, borderRadius: '50%',
                        background: '#9CA3AF', display: 'inline-block',
                        animation: `chat-typing-dot 1.2s infinite ${i * 0.15}s`,
                      }} />
                    ))}
                  </div>
                  AI is thinking...
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div style={{
            borderTop: '1px solid #E5E7EB', padding: 12,
            background: 'white', flexShrink: 0,
          }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                disabled={sending}
                rows={1}
                placeholder="Ask about our vehicles..."
                aria-label="Type your message"
                style={{
                  flex: 1, resize: 'none',
                  border: '1px solid #E5E7EB', borderRadius: 10,
                  padding: '8px 12px', fontSize: 14,
                  fontFamily: 'inherit', outline: 'none',
                  maxHeight: 100, lineHeight: 1.4,
                  opacity: sending ? 0.6 : 1,
                  color: '#111827',
                  background: 'white',
                }}
              />
              <button
                onClick={sendMessage}
                disabled={sending || !input.trim()}
                aria-label="Send message"
                style={{
                  background: primary, color: '#0a0a0a',
                  border: 'none', borderRadius: 10,
                  width: 40, height: 40,
                  cursor: input.trim() && !sending ? 'pointer' : 'not-allowed',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  opacity: input.trim() && !sending ? 1 : 0.5,
                  transition: 'opacity 150ms, transform 150ms',
                  flexShrink: 0,
                }}
              >
                <Send size={16} strokeWidth={2.25} />
              </button>
            </div>
            <div style={{
              fontSize: 10, color: '#9CA3AF',
              textAlign: 'center', marginTop: 8,
            }}>
              Powered by LotPilot AI
            </div>
          </div>
        </div>
      )}
    </>
  );
}
