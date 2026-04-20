'use client';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { ArrowRight, CheckCircle2, Lock } from 'lucide-react';

const TEAL = '#2AA5A0';

const inputStyle = {
  width: '100%',
  padding: '10px 13px',
  background: 'rgba(255,255,255,.06)',
  border: '1px solid rgba(255,255,255,.1)',
  borderRadius: '10px',
  color: '#fff',
  fontSize: 14,
  fontFamily: "'Inter', sans-serif",
  transition: 'all .2s',
  outline: 'none',
};

const labelStyle = {
  display: 'block',
  fontSize: 'clamp(9px, 1.5vw, 11px)',
  fontWeight: 700,
  letterSpacing: '.6px',
  textTransform: 'uppercase',
  color: 'rgba(255,255,255,.85)',
  marginBottom: 4,
};

const fieldStyle = { marginBottom: 'clamp(12px, 2vw, 16px)' };

export default function ContactForm() {
  const [status, setStatus] = useState('idle');
  const [messageLength, setMessageLength] = useState(0);
  const searchParams = useSearchParams();

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('sending');
    const data = Object.fromEntries(new FormData(e.target));
    const utm_source   = searchParams.get('utm_source')   ?? '';
    const utm_campaign = searchParams.get('utm_campaign') ?? '';
    const utm_medium   = searchParams.get('utm_medium')   ?? '';
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, utm_source, utm_campaign, utm_medium }),
      });
      setStatus(res.ok ? 'success' : 'error');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div style={{
        padding: '38px 40px',
        background: 'rgba(255,255,255,.04)',
        border: '1px solid rgba(255,255,255,.08)',
        borderRadius: '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px',
        textAlign: 'center',
      }} role="alert" aria-live="polite">
        <CheckCircle2 size={52} color="#10b981" strokeWidth={1.5} />
        <div style={{ fontSize: 20, fontWeight: 700, color: '#fff', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Got it!</div>
        <div style={{ fontSize: 14, color: 'rgba(255,255,255,.7)', lineHeight: 1.8, maxWidth: '360px' }}>
          David personally reviews every request and will reach out within <strong style={{ color: '#fff' }}>6 hours</strong>.
        </div>
        <div style={{ padding: '12px 16px', background: 'rgba(42,165,160,.1)', borderRadius: '8px', fontSize: 12, color: TEAL }}>
          Check your email for confirmation
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{
      padding: 'clamp(10px, 2.5vw, 20px)',
      background: 'rgba(255,255,255,.04)',
      border: '1px solid rgba(255,255,255,.08)',
      borderRadius: '20px',
      backdropFilter: 'blur(12px)',
    }}>
      <style>{`@media(max-width:768px){input,textarea,select{font-size:16px!important}}`}</style>

      <div style={{ marginBottom: 'clamp(18px, 2.5vw, 24px)', textAlign: 'center' }}>
        <div style={{ fontSize: 'clamp(14px, 2.5vw, 16px)', fontWeight: 700, color: '#fff', marginBottom: 4, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Your Details</div>
        <div style={{ fontSize: 'clamp(11px, 1.8vw, 13px)', color: 'rgba(255,255,255,.55)' }}>
          All fields required. 2 minutes. <span style={{ color: 'rgba(255,255,255,.4)' }}>No credit card.</span>
        </div>
      </div>

      {/* Name row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(10px, 2vw, 14px)', marginBottom: 'clamp(12px, 2vw, 16px)' }}>
        {[['first_name', 'First Name', 'Jane', 'given-name'], ['last_name', 'Last Name', 'Smith', 'family-name']].map(([name, label, ph, auto]) => (
          <div key={name}>
            <label style={labelStyle}>{label} <span style={{ color: '#f87171' }}>*</span></label>
            <input type="text" name={name} placeholder={ph} required autoComplete={auto} style={inputStyle}
              onFocus={e => e.target.style.borderColor = 'rgba(37,99,235,.5)'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,.1)'} />
          </div>
        ))}
      </div>

      {/* Email */}
      <div style={fieldStyle}>
        <label style={labelStyle}>Email <span style={{ color: '#f87171' }}>*</span></label>
        <input type="email" name="email" placeholder="jane@company.com" required autoComplete="email" style={inputStyle}
          onFocus={e => e.target.style.borderColor = 'rgba(37,99,235,.5)'}
          onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,.1)'} />
      </div>

      {/* Phone */}
      <div style={fieldStyle}>
        <label style={labelStyle}>Phone <span style={{ color: '#f87171' }}>*</span></label>
        <input type="tel" name="phone" placeholder="(555) 000-0000" required autoComplete="tel" style={inputStyle}
          onFocus={e => e.target.style.borderColor = 'rgba(37,99,235,.5)'}
          onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,.1)'} />
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,.45)', marginTop: 4 }}>Best way to reach you</div>
      </div>

      {/* Service */}
      <div style={fieldStyle}>
        <label style={labelStyle}>What interests you most? <span style={{ color: '#f87171' }}>*</span></label>
        <select name="service" required style={{ ...inputStyle, cursor: 'pointer' }}
          onFocus={e => e.target.style.borderColor = 'rgba(37,99,235,.5)'}
          onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,.1)'}>
          <option value="">Select one...</option>
          <option>AI Automation (lead capture, chatbots, workflows)</option>
          <option>Website &amp; Design (redesign, conversion optimization)</option>
          <option>SEO (rankings, traffic, visibility)</option>
          <option>Full Package (AI + Website + SEO)</option>
          <option>Strategy Consulting (roadmap, audit)</option>
          <option>Not sure yet (let&apos;s explore)</option>
        </select>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,.45)', marginTop: 4 }}>Helps us prepare for the audit</div>
      </div>

      {/* Message */}
      <div style={{ marginBottom: 'clamp(16px, 2.5vw, 20px)' }}>
        <label style={labelStyle}>Your biggest challenge <span style={{ color: '#f87171' }}>*</span></label>
        <textarea name="message" placeholder="E.g. Lost leads to competitors, website is outdated, can't keep up with demand, need automation..."
          required onChange={e => setMessageLength(e.target.value.length)}
          style={{ ...inputStyle, resize: 'vertical', minHeight: '90px' }}
          onFocus={e => e.target.style.borderColor = 'rgba(37,99,235,.5)'}
          onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,.1)'} />
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,.45)', marginTop: 4, display: 'flex', justifyContent: 'space-between' }}>
          <span>Be specific — helps David prepare</span>
          <span>{messageLength} characters</span>
        </div>
      </div>

      <button type="submit" disabled={status === 'sending'} style={{
        width: '100%',
        padding: '12px 16px',
        background: status === 'sending' ? 'rgba(42,165,160,.6)' : TEAL,
        color: '#fff',
        fontSize: 14,
        fontWeight: 700,
        border: 'none',
        borderRadius: '50px',
        cursor: status === 'sending' ? 'not-allowed' : 'pointer',
        transition: 'all .25s',
        boxShadow: '0 4px 18px rgba(42,165,160,.4)',
        opacity: status === 'sending' ? 0.7 : 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
      }}>
        {status === 'sending' ? 'Sending...' : status === 'error' ? 'Error — email david@aiandwebservices.com' : <><span>Get My Free Audit</span> <ArrowRight size={16} /></>}
      </button>

      <p style={{ fontSize: 11, color: 'rgba(255,255,255,.35)', marginTop: 16, lineHeight: 1.5 }}>
        <Lock size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
        Your information is never shared or sold.
      </p>
    </form>
  );
}
