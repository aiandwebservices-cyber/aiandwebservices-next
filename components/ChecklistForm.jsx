'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Download, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

const TEAL = '#2AA5A0';

const CATEGORIES = [
  {
    label: 'Current Operations',
    questions: [
      { id: 'q1',  text: 'Do you currently have a way to capture and track customer inquiries?' },
      { id: 'q2',  text: 'Are there repetitive tasks that your team does manually more than once per day?' },
      { id: 'q3',  text: 'Do you struggle to follow up with leads in a timely manner?' },
      { id: 'q4',  text: 'Is your team spending more than 10 hours/week on admin work (data entry, scheduling, emails)?' },
    ],
  },
  {
    label: 'Customer Communication',
    questions: [
      { id: 'q5',  text: 'Do you answer customer calls or emails outside of business hours?' },
      { id: 'q6',  text: 'Do some customer questions go unanswered because your team is busy?' },
      { id: 'q7',  text: 'Would you like to offer 24/7 support without hiring someone?' },
      { id: 'q8',  text: 'Do you have a consistent process for onboarding new customers?' },
    ],
  },
  {
    label: 'Marketing & Content',
    questions: [
      { id: 'q9',  text: 'Are you publishing blog content or social media regularly?' },
      { id: 'q10', text: 'Do you struggle to keep up with content creation?' },
      { id: 'q11', text: 'Would ranking for more search terms help your business grow?' },
      { id: 'q12', text: 'Are you currently doing any email marketing to your list?' },
    ],
  },
  {
    label: 'Sales & Revenue',
    questions: [
      { id: 'q13', text: 'Do leads sometimes get lost between initial contact and follow-up?' },
      { id: 'q14', text: 'Would you like to automatically nurture leads while you focus on closing?' },
      { id: 'q15', text: "Are there pricing or plan decisions you want customers to self-serve?" },
      { id: 'q16', text: "Would increasing your team's closing rate by 20-30% impact your revenue significantly?" },
    ],
  },
  {
    label: 'Technology & Data',
    questions: [
      { id: 'q17', text: 'Do you have a CRM or customer database?' },
      { id: 'q18', text: 'Do your different tools talk to each other, or are they siloed?' },
      { id: 'q19', text: 'Would you benefit from seeing which customers/prospects are most engaged?' },
      { id: 'q20', text: 'Are you tracking which marketing channels actually convert customers?' },
    ],
  },
];

function scoreColor(score) {
  if (score >= 15) return '#16a34a';
  if (score >= 8)  return '#ca8a04';
  return '#dc2626';
}

function scoreTier(score) {
  if (score >= 15) return { label: 'High Readiness', range: '15–20', desc: "You're ready for AI automation. David will map your implementation plan." };
  if (score >= 8)  return { label: 'Medium Readiness', range: '8–14', desc: 'Quick wins available. The assessment helps David prioritize what to tackle first.' };
  return { label: 'Low Readiness', range: '0–7', desc: "You're in the right place to start. Presence and foundational AI are your fastest path." };
}

export default function ChecklistForm({ hideHero = false, defaultSource = 'site' }) {
  const [step, setStep] = useState('email'); // 'email' | 'questions' | 'submitted'
  const [formData, setFormData] = useState({ firstName: '', email: '', phone: '', companyName: '' });
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [leadStartedFired, setLeadStartedFired] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  const score = Object.values(answers).filter(Boolean).length;

  // ── Email step handlers ──

  function handleField(e) {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleStartAssessment(e) {
    e.preventDefault();
    if (!formData.firstName.trim() || !formData.email.trim()) return;
    if (leadStartedFired) { setStep('questions'); return; }

    // Fire-and-forget — never block UX on this call
    fetch('/api/checklist-lead-started', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: formData.firstName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        companyName: formData.companyName.trim(),
        source: defaultSource,
      }),
    })
      .then(r => { if (!r.ok) console.error('[checklist-lead-started] non-OK response', r.status); })
      .catch(err => console.error('[checklist-lead-started] fetch failed:', err.message));

    setLeadStartedFired(true);
    setStep('questions');
  }

  // ── Questions step handlers ──

  function toggleAnswer(id) {
    setAnswers(prev => ({ ...prev, [id]: !prev[id] }));
  }

  async function handleSubmitAssessment() {
    setSubmitting(true);
    setError(null);

    // Only include truthy answers
    const answersPayload = {};
    Object.entries(answers).forEach(([k, v]) => { if (v) answersPayload[k] = true; });

    try {
      const res = await fetch('/api/checklist-submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName.trim(),
          email: formData.email.trim(),
          companyName: formData.companyName.trim(),
          source: defaultSource,
          answers: answersPayload,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again or email david@aiandwebservices.com.');
        setSubmitting(false);
        return;
      }

      setFinalScore(data.score ?? score);
      setStep('submitted');
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
      setSubmitting(false);
    }
  }

  function handlePrint() {
    window.print();
  }

  // ── Render: Email step ──

  if (step === 'email') {
    return (
      <div>
        {!hideHero && (
          <section style={{ backgroundColor: '#111827', color: '#fff', padding: 'clamp(40px, 8vw, 80px) 20px', textAlign: 'center' }}>
            <div style={{ maxWidth: '720px', margin: '0 auto' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: TEAL, marginBottom: '14px' }}>
                Free Resource · 5 minutes
              </div>
              <h1 style={{ fontSize: 'clamp(28px, 5vw, 46px)', fontWeight: 800, marginBottom: '14px', lineHeight: 1.2 }}>
                AI Readiness Assessment
              </h1>
              <p style={{ fontSize: '17px', color: 'rgba(255,255,255,0.78)', lineHeight: 1.65, marginBottom: '10px' }}>
                20 questions across 5 categories. Get a personalised score and see exactly where AI automation would have the biggest impact on your business.
              </p>
              <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.45)', marginBottom: 0 }}>
                David reviews every submission personally — no bots, no spam.
              </p>
            </div>
          </section>
        )}

        <section style={{ maxWidth: '560px', margin: '0 auto', padding: 'clamp(40px, 6vw, 72px) 20px' }}>
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '16px', padding: 'clamp(28px, 5vw, 44px)', boxShadow: '0 4px 24px rgba(0,0,0,0.07)' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#111827', marginBottom: '6px' }}>
              Start your free assessment
            </h2>
            <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '28px', lineHeight: 1.5 }}>
              Takes 2 minutes. No credit card. David personally reviews every result.
            </p>

            <form onSubmit={handleStartAssessment} noValidate>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                <div>
                  <label htmlFor="cl-firstName" style={labelStyle}>First Name <span style={{ color: '#ef4444' }}>*</span></label>
                  <input id="cl-firstName" name="firstName" type="text" required autoComplete="given-name"
                    placeholder="Jane" value={formData.firstName} onChange={handleField} style={inputStyle} />
                </div>
                <div>
                  <label htmlFor="cl-companyName" style={labelStyle}>Company <span style={{ color: '#9ca3af', fontWeight: 400 }}>(optional)</span></label>
                  <input id="cl-companyName" name="companyName" type="text" autoComplete="organization"
                    placeholder="Acme Inc." value={formData.companyName} onChange={handleField} style={inputStyle} />
                </div>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label htmlFor="cl-email" style={labelStyle}>Business Email <span style={{ color: '#ef4444' }}>*</span></label>
                <input id="cl-email" name="email" type="email" required autoComplete="email"
                  placeholder="jane@company.com" value={formData.email} onChange={handleField} style={inputStyle} />
              </div>

              <div style={{ marginBottom: '28px' }}>
                <label htmlFor="cl-phone" style={labelStyle}>Phone <span style={{ color: '#9ca3af', fontWeight: 400 }}>(optional)</span></label>
                <input id="cl-phone" name="phone" type="tel" autoComplete="tel"
                  placeholder="(555) 000-0000" value={formData.phone} onChange={handleField} style={inputStyle} />
              </div>

              <button type="submit" style={primaryBtnStyle}>
                Start Assessment →
              </button>

              <p style={{ fontSize: '12px', color: '#9ca3af', textAlign: 'center', marginTop: '14px', lineHeight: 1.5 }}>
                Your info is never shared or sold.
              </p>
            </form>
          </div>
        </section>

        <style>{printStyles}</style>
      </div>
    );
  }

  // ── Render: Questions step ──

  if (step === 'questions') {
    const tier = scoreTier(score);
    return (
      <div>
        {/* Sticky score bar */}
        <div style={{ position: 'sticky', top: 0, zIndex: 30, background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '14px', fontWeight: 700, color: '#374151' }}>Score:</span>
            <span style={{ fontSize: '22px', fontWeight: 800, color: scoreColor(score), lineHeight: 1 }}>{score}</span>
            <span style={{ fontSize: '14px', color: '#9ca3af' }}>/ 20</span>
            {score > 0 && (
              <span style={{ fontSize: '12px', fontWeight: 600, color: scoreColor(score), background: `${scoreColor(score)}15`, borderRadius: '20px', padding: '2px 10px' }}>
                {tier.label}
              </span>
            )}
          </div>
          <button
            onClick={handleSubmitAssessment}
            disabled={submitting}
            style={{ ...primaryBtnStyle, padding: '10px 22px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px', opacity: submitting ? 0.7 : 1 }}
          >
            {submitting ? <><Loader2 size={14} className="spin" /> Submitting…</> : 'Submit Assessment'}
          </button>
        </div>

        <section style={{ maxWidth: '860px', margin: '0 auto', padding: 'clamp(28px, 5vw, 56px) 20px' }}>
          {score === 0 && (
            <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '14px 18px', marginBottom: '32px', fontSize: '14px', color: '#6b7280', lineHeight: 1.6 }}>
              Answer as many or as few as you like — you can submit at any point and David will still receive your details and reach out personally.
            </div>
          )}

          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '10px', padding: '14px 18px', marginBottom: '24px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <AlertCircle size={18} color="#ef4444" style={{ flexShrink: 0, marginTop: '1px' }} />
              <p style={{ fontSize: '14px', color: '#b91c1c', margin: 0, lineHeight: 1.6 }}>{error}</p>
            </div>
          )}

          {CATEGORIES.map((cat, cIdx) => (
            <div key={cat.label} style={{ marginBottom: '44px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', paddingBottom: '12px', borderBottom: '2px solid #e5e7eb' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, background: TEAL, color: '#fff', borderRadius: '20px', padding: '2px 10px', letterSpacing: '0.5px' }}>
                  {cIdx + 1}/5
                </span>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', margin: 0 }}>{cat.label}</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {cat.questions.map(({ id, text }) => {
                  const checked = !!answers[id];
                  return (
                    <label key={id} style={{ display: 'flex', gap: '14px', cursor: 'pointer', alignItems: 'flex-start', padding: '14px 16px', borderRadius: '10px', border: `1.5px solid ${checked ? TEAL : '#e5e7eb'}`, background: checked ? 'rgba(42,165,160,0.05)' : '#fafafa', transition: 'border-color 0.15s, background 0.15s' }}>
                      <div style={{ position: 'relative', flexShrink: 0, marginTop: '2px' }}>
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleAnswer(id)}
                          style={{ position: 'absolute', opacity: 0, width: '20px', height: '20px', cursor: 'pointer' }}
                        />
                        <div style={{ width: '20px', height: '20px', borderRadius: '5px', border: `2px solid ${checked ? TEAL : '#d1d5db'}`, background: checked ? TEAL : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' }}>
                          {checked && <svg width="11" height="8" viewBox="0 0 11 8" fill="none"><path d="M1 4l3 3 6-6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                        </div>
                      </div>
                      <span style={{ fontSize: '15px', color: '#374151', lineHeight: 1.6, flex: 1 }}>{text}</span>
                      {checked && <span style={{ fontSize: '11px', fontWeight: 700, color: TEAL, flexShrink: 0, marginTop: '4px', letterSpacing: '0.5px' }}>YES</span>}
                    </label>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Bottom submit */}
          <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '28px', textAlign: 'center', marginTop: '16px' }}>
            <div style={{ fontSize: '22px', fontWeight: 800, color: scoreColor(score), marginBottom: '6px' }}>{score}/20 — {tier.label}</div>
            <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '20px', lineHeight: 1.6 }}>{tier.desc}</p>
            {error && (
              <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '8px', padding: '12px 16px', marginBottom: '16px', fontSize: '14px', color: '#b91c1c' }}>
                {error}
              </div>
            )}
            <button
              onClick={handleSubmitAssessment}
              disabled={submitting}
              style={{ ...primaryBtnStyle, display: 'inline-flex', alignItems: 'center', gap: '8px', opacity: submitting ? 0.7 : 1 }}
            >
              {submitting ? <><Loader2 size={16} className="spin" /> Submitting…</> : 'Submit & Get My Results'}
            </button>
            {score === 0 && (
              <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '12px' }}>
                You can submit with partial answers — David will still receive your details.
              </p>
            )}
          </div>
        </section>

        <style>{`${printStyles}
          @keyframes spin { to { transform: rotate(360deg); } }
          .spin { animation: spin 0.8s linear infinite; }
        `}</style>
      </div>
    );
  }

  // ── Render: Submitted step ──

  const tier = scoreTier(finalScore);
  return (
    <div>
      {!hideHero && (
        <section style={{ backgroundColor: '#111827', color: '#fff', padding: 'clamp(30px, 6vw, 60px) 20px', textAlign: 'center' }}>
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <CheckCircle2 size={48} color="#10b981" strokeWidth={1.5} style={{ marginBottom: '16px' }} />
            <h1 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 800, marginBottom: '10px', lineHeight: 1.2 }}>
              Assessment submitted!
            </h1>
            <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.75)', lineHeight: 1.65 }}>
              David has your results and will be in touch personally — usually within a few hours.
            </p>
          </div>
        </section>
      )}

      <section style={{ maxWidth: '640px', margin: '0 auto', padding: 'clamp(36px, 6vw, 64px) 20px' }}>
        {/* Score card */}
        <div style={{ background: '#fff', border: `2px solid ${scoreColor(finalScore)}30`, borderRadius: '16px', padding: '28px', marginBottom: '24px', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.07)' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#6b7280', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>Your Score</div>
          <div style={{ fontSize: '64px', fontWeight: 900, color: scoreColor(finalScore), lineHeight: 1 }}>{finalScore}</div>
          <div style={{ fontSize: '18px', color: '#9ca3af', marginBottom: '14px' }}>out of 20</div>
          <div style={{ display: 'inline-block', background: `${scoreColor(finalScore)}15`, border: `1px solid ${scoreColor(finalScore)}40`, borderRadius: '20px', padding: '5px 16px', fontSize: '14px', fontWeight: 700, color: scoreColor(finalScore), marginBottom: '14px' }}>
            {tier.label}
          </div>
          <p style={{ fontSize: '15px', color: '#374151', lineHeight: 1.65, margin: 0 }}>{tier.desc}</p>
        </div>

        {/* Next step */}
        <div style={{ background: 'rgba(42,165,160,0.06)', border: '1px solid rgba(42,165,160,0.2)', borderRadius: '12px', padding: '24px', marginBottom: '20px', textAlign: 'center' }}>
          <div style={{ fontSize: '16px', fontWeight: 700, color: '#111827', marginBottom: '8px' }}>Check your email</div>
          <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: 1.65, marginBottom: '18px' }}>
            Your results and a booking link are on their way to <strong style={{ color: '#374151' }}>{formData.email}</strong>. David will review your submission and reach out personally.
          </p>
          <Link href="/contact" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: 700, color: TEAL, textDecoration: 'none' }}>
            Prefer to reach out directly? Contact David →
          </Link>
        </div>

        {/* Print */}
        <div style={{ textAlign: 'center' }}>
          <button onClick={handlePrint} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '11px 22px', background: '#f3f4f6', border: '1px solid #e5e7eb', borderRadius: '8px', fontWeight: 600, fontSize: '14px', color: '#374151', cursor: 'pointer' }}>
            <Download size={16} />
            Save as PDF
          </button>
        </div>
      </section>

      <style>{printStyles}</style>
    </div>
  );
}

// ── Shared micro-styles ──

const labelStyle = {
  display: 'block',
  fontSize: '13px',
  fontWeight: 600,
  color: '#374151',
  marginBottom: '6px',
};

const inputStyle = {
  width: '100%',
  padding: '10px 13px',
  border: '1.5px solid #d1d5db',
  borderRadius: '8px',
  fontSize: '15px',
  color: '#111827',
  background: '#fff',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.15s',
};

const primaryBtnStyle = {
  width: '100%',
  padding: '13px 24px',
  background: '#2AA5A0',
  color: '#fff',
  border: 'none',
  borderRadius: '8px',
  fontWeight: 700,
  fontSize: '16px',
  cursor: 'pointer',
  textAlign: 'center',
  transition: 'opacity 0.15s',
};

const printStyles = `
  @media print {
    body { background: white; }
    section:first-of-type { display: none !important; }
    nav, footer, button, .floating-cta-wrap { display: none !important; }
    input[type="checkbox"] { accent-color: #2AA5A0; }
    * { box-shadow: none !important; }
  }
`;
