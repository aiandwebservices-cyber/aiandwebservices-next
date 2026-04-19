'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Download } from 'lucide-react';

const TEAL = '#2AA5A0';

const questions = [
  { category: 'Current Operations', items: [
    'Do you currently have a way to capture and track customer inquiries?',
    'Are there repetitive tasks that your team does manually more than once per day?',
    'Do you struggle to follow up with leads in a timely manner?',
    'Is your team spending more than 10 hours/week on admin work (data entry, scheduling, emails)?',
  ]},
  { category: 'Customer Communication', items: [
    'Do you answer customer calls or emails outside of business hours?',
    'Do some customer questions go unanswered because your team is busy?',
    'Would you like to offer 24/7 support without hiring someone?',
    'Do you have a consistent process for onboarding new customers?',
  ]},
  { category: 'Marketing & Content', items: [
    'Are you publishing blog content or social media regularly?',
    'Do you struggle to keep up with content creation?',
    'Would ranking for more search terms help your business grow?',
    'Are you currently doing any email marketing to your list?',
  ]},
  { category: 'Sales & Revenue', items: [
    'Do leads sometimes get lost between initial contact and follow-up?',
    'Would you like to automatically nurture leads while you focus on closing?',
    'Are there pricing or plan decisions you want customers to self-serve?',
    "Would increasing your team's closing rate by 20-30% impact your revenue significantly?",
  ]},
  { category: 'Technology & Data', items: [
    'Do you have a CRM or customer database?',
    'Do your different tools talk to each other, or are they siloed?',
    'Would you benefit from seeing which customers/prospects are most engaged?',
    'Are you tracking which marketing channels actually convert customers?',
  ]},
];

// Flat list with stable IDs
const FLAT = questions.flatMap((section, si) =>
  section.items.map((text, qi) => ({ id: `q${si}_${qi}`, text, category: section.category }))
);

const inputStyle = {
  width: '100%',
  padding: '12px 16px',
  fontSize: '16px',
  border: '1px solid #d1d5db',
  borderRadius: '8px',
  outline: 'none',
  boxSizing: 'border-box',
  fontFamily: 'inherit',
};

export default function ChecklistForm() {
  const [step, setStep]           = useState('email'); // 'email' | 'questions' | 'submitted'
  const [email, setEmail]         = useState('');
  const [firstName, setFirstName] = useState('');
  const [company, setCompany]     = useState('');
  const [source, setSource]       = useState('site');
  const [answers, setAnswers]     = useState({});
  const [emailErr, setEmailErr]   = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitErr, setSubmitErr] = useState('');

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const s = p.get('source');
    if (s) setSource(s);
  }, []);

  function startAssessment(e) {
    e.preventDefault();
    if (!email.trim() || !firstName.trim()) {
      setEmailErr('Please enter your first name and email to continue.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setEmailErr('Please enter a valid email address.');
      return;
    }
    setEmailErr('');
    setStep('questions');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function toggle(id) {
    setAnswers(prev => ({ ...prev, [id]: !prev[id] }));
  }

  async function handleSubmit() {
    setSubmitting(true);
    setSubmitErr('');
    try {
      const res = await fetch('/api/checklist-submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, firstName, companyName: company, source, answers }),
      });
      const data = await res.json();
      if (data.success) {
        setStep('submitted');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setSubmitErr(data.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setSubmitErr('Network error. Please check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  }

  // ── Email step ───────────────────────────────────────────────
  if (step === 'email') {
    return (
      <div>
        <section style={{ backgroundColor: '#111827', color: '#fff', padding: 'clamp(40px,8vw,80px) 20px', textAlign: 'center' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ fontSize: '14px', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase', color: TEAL, marginBottom: '16px' }}>
              Free Resource
            </div>
            <h1 style={{ fontSize: 'clamp(32px,5vw,48px)', fontWeight: '800', marginBottom: '16px', lineHeight: '1.2' }}>
              AI Readiness Checklist
            </h1>
            <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.8)', lineHeight: '1.6' }}>
              20 questions to assess whether your small business is ready for AI automation.
            </p>
          </div>
        </section>

        <section style={{ maxWidth: '560px', margin: '0 auto', padding: '60px 20px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#111827', marginBottom: '8px' }}>Let's get started</h2>
          <p style={{ fontSize: '16px', color: '#6b7280', marginBottom: '32px', lineHeight: '1.6' }}>
            Enter your details to begin the 20-question assessment.
          </p>

          <form onSubmit={startAssessment} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                First name <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="text"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                placeholder="David"
                required
                style={inputStyle}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                Email address <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@yourbusiness.com"
                required
                style={inputStyle}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                Company name <span style={{ color: '#9ca3af', fontWeight: 400 }}>(optional)</span>
              </label>
              <input
                type="text"
                value={company}
                onChange={e => setCompany(e.target.value)}
                placeholder="Acme Inc."
                style={inputStyle}
              />
            </div>

            {emailErr && (
              <p style={{ color: '#dc2626', fontSize: '14px', margin: 0 }}>{emailErr}</p>
            )}

            <button
              type="submit"
              style={{ padding: '14px 28px', backgroundColor: TEAL, color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '700', fontSize: '16px', cursor: 'pointer', marginTop: '8px' }}
            >
              Start Assessment →
            </button>

            <p style={{ fontSize: '12px', color: '#9ca3af', textAlign: 'center', margin: 0 }}>
              Your info is safe. We'll never spam you.
            </p>
          </form>
        </section>

        <style>{`@media print { body { display:none; } }`}</style>
      </div>
    );
  }

  // ── Submitted step ───────────────────────────────────────────
  if (step === 'submitted') {
    return (
      <div>
        <section style={{ backgroundColor: '#111827', color: '#fff', padding: 'clamp(40px,8vw,80px) 20px', textAlign: 'center' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
            <h1 style={{ fontSize: 'clamp(28px,4vw,42px)', fontWeight: '800', marginBottom: '16px', lineHeight: '1.2' }}>
              Thanks for completing the assessment.
            </h1>
            <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.8)', lineHeight: '1.6', maxWidth: '600px', margin: '0 auto' }}>
              David will personally review your responses and reach out within 6 hours with custom recommendations.
            </p>
          </div>
        </section>

        <section style={{ maxWidth: '560px', margin: '0 auto', padding: '60px 20px', textAlign: 'center' }}>
          <p style={{ fontSize: '15px', color: '#6b7280', lineHeight: '1.7', marginBottom: '32px' }}>
            Questions in the meantime? Email{' '}
            <a href="mailto:david@aiandwebservices.com" style={{ color: TEAL, fontWeight: 600 }}>
              david@aiandwebservices.com
            </a>
          </p>
          <Link
            href="/"
            style={{ display: 'inline-block', padding: '12px 28px', backgroundColor: TEAL, color: '#fff', borderRadius: '8px', fontWeight: '700', textDecoration: 'none', fontSize: '15px' }}
          >
            ← Back to home
          </Link>
        </section>
      </div>
    );
  }

  // ── Questions step ───────────────────────────────────────────
  const checkedCount = Object.values(answers).filter(Boolean).length;

  return (
    <div>
      <section style={{ backgroundColor: '#111827', color: '#fff', padding: 'clamp(40px,8vw,80px) 20px', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ fontSize: '14px', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase', color: TEAL, marginBottom: '16px' }}>
            Free Resource
          </div>
          <h1 style={{ fontSize: 'clamp(32px,5vw,48px)', fontWeight: '800', marginBottom: '16px', lineHeight: '1.2' }}>
            AI Readiness Checklist
          </h1>
          <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.8)', lineHeight: '1.6', marginBottom: '24px' }}>
            20 questions to assess whether your small business is ready for AI automation.
          </p>
          <button
            onClick={() => window.print()}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', backgroundColor: 'transparent', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', fontSize: '14px' }}
          >
            <Download size={16} />
            Print / Save as PDF
          </button>
        </div>
      </section>

      <section style={{ maxWidth: '900px', margin: '0 auto', padding: '60px 20px', backgroundColor: '#fff' }}>
        {/* Progress */}
        <div style={{ marginBottom: '40px', padding: '16px 24px', backgroundColor: '#f0fdf4', border: '1px solid #86efac', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
          <span style={{ fontSize: '15px', color: '#374151', fontWeight: '600' }}>
            {checkedCount} of 20 checked
          </span>
          <div style={{ height: '8px', flex: '1', minWidth: '120px', maxWidth: '260px', backgroundColor: '#d1d5db', borderRadius: '99px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${(checkedCount / 20) * 100}%`, backgroundColor: TEAL, borderRadius: '99px', transition: 'width .3s' }} />
          </div>
        </div>

        {/* Questions grouped by category */}
        {questions.map((section, sIdx) => (
          <div key={sIdx} style={{ marginBottom: '48px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#111827', marginBottom: '24px', paddingBottom: '12px', borderBottom: '2px solid #e5e7eb' }}>
              {section.category}
            </h3>
            <div style={{ display: 'grid', gap: '20px' }}>
              {section.items.map((text, qIdx) => {
                const id = `q${sIdx}_${qIdx}`;
                const checked = !!answers[id];
                return (
                  <label
                    key={qIdx}
                    style={{ display: 'flex', gap: '12px', cursor: 'pointer', alignItems: 'flex-start', padding: '14px 16px', borderRadius: '8px', border: `1px solid ${checked ? TEAL + '40' : '#e5e7eb'}`, background: checked ? TEAL + '08' : '#fff', transition: 'all .2s' }}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggle(id)}
                      style={{ width: '20px', height: '20px', marginTop: '2px', cursor: 'pointer', flexShrink: 0, accentColor: TEAL }}
                    />
                    <span style={{ fontSize: '15px', color: '#374151', lineHeight: '1.6', flex: 1 }}>
                      {text}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        ))}

        {/* Scoring Guide */}
        <div style={{ marginTop: '64px', paddingTop: '32px', borderTop: '2px solid #e5e7eb' }}>
          <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#111827', marginBottom: '24px' }}>Score Your Readiness</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '20px' }}>
            <div style={{ padding: '20px', backgroundColor: '#fee2e2', borderRadius: '8px', border: '1px solid #fca5a5' }}>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#991b1b', marginBottom: '8px' }}>0–7 Checks</div>
              <div style={{ fontSize: '18px', fontWeight: '800', color: '#dc2626', marginBottom: '8px' }}>Low Readiness</div>
              <p style={{ fontSize: '14px', color: '#7f1d1d', lineHeight: '1.5', margin: 0 }}>
                Start with our Presence or Growth tier to build fundamentals.
              </p>
            </div>
            <div style={{ padding: '20px', backgroundColor: '#fef3c7', borderRadius: '8px', border: '1px solid #fcd34d' }}>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#92400e', marginBottom: '8px' }}>8–14 Checks</div>
              <div style={{ fontSize: '18px', fontWeight: '800', color: '#f59e0b', marginBottom: '8px' }}>Medium Readiness</div>
              <p style={{ fontSize: '14px', color: '#451a03', lineHeight: '1.5', margin: 0 }}>
                You have quick wins available. Book a call to identify them.
              </p>
            </div>
            <div style={{ padding: '20px', backgroundColor: '#dcfce7', borderRadius: '8px', border: '1px solid #86efac' }}>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#166534', marginBottom: '8px' }}>15–20 Checks</div>
              <div style={{ fontSize: '18px', fontWeight: '800', color: '#22c55e', marginBottom: '8px' }}>High Readiness</div>
              <p style={{ fontSize: '14px', color: '#15803d', lineHeight: '1.5', margin: 0 }}>
                You're ready for AI automation. Let's map your implementation.
              </p>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div style={{ marginTop: '48px', padding: '36px', backgroundColor: '#f0fdf4', borderRadius: '12px', textAlign: 'center', border: '1px solid #bbf7d0' }}>
          <h3 style={{ fontSize: '22px', fontWeight: '800', color: '#111827', marginBottom: '8px' }}>
            Ready to get your results?
          </h3>
          <p style={{ fontSize: '15px', color: '#374151', marginBottom: '24px', lineHeight: '1.6' }}>
            Submit your assessment and David will personally review your responses and send recommendations within 6 hours.
          </p>
          {submitErr && (
            <p style={{ color: '#dc2626', fontSize: '14px', marginBottom: '16px' }}>{submitErr}</p>
          )}
          <button
            onClick={handleSubmit}
            disabled={submitting}
            style={{ padding: '14px 36px', backgroundColor: TEAL, color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '700', fontSize: '16px', cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.7 : 1 }}
          >
            {submitting ? 'Submitting…' : 'Submit Assessment →'}
          </button>
          <div style={{ marginTop: '16px' }}>
            <button
              onClick={() => window.print()}
              style={{ background: 'none', border: 'none', color: '#9ca3af', fontSize: '13px', cursor: 'pointer', textDecoration: 'underline' }}
            >
              Print / Save as PDF instead
            </button>
          </div>
        </div>
      </section>

      <style>{`
        @media print {
          body { background: white; }
          section:first-of-type { display: none; }
          input[type="checkbox"] { accent-color: ${TEAL}; }
          * { box-shadow: none !important; }
        }
      `}</style>
    </div>
  );
}
