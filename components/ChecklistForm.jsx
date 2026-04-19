'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Download } from 'lucide-react';

const TEAL = '#2AA5A0';

const questions = [
  { category: 'Current Operations', items: [
    'Do you have a system (CRM, spreadsheet, or tool) to track customer inquiries?',
    'Do leads or customer messages sometimes get missed or forgotten?',
    'Does it ever take you more than 24 hours to respond to a new lead?',
    'Are there tasks in your business you do the same way every day or week?',
  ]},
  { category: 'Customer Communication', items: [
    'Do customer questions come in outside your working hours?',
    "Have you ever lost a potential customer because you couldn't respond fast enough?",
    'Would offering instant 24/7 answers to common questions help you close more business?',
    'Do you have a clear process customers follow when they become new clients?',
  ]},
  { category: 'Marketing & Content', items: [
    'Do you currently publish content (blog, social, newsletter) consistently?',
    'Is creating marketing content a bottleneck because of time or ideas?',
    'Does your business show up on Google when someone searches for what you do?',
    'Do you send regular emails to your customer list?',
  ]},
  { category: 'Sales & Revenue', items: [
    'Do you know what happens to every lead after first contact?',
    'Could you close more deals if leads were nurtured automatically while you focused on selling?',
    'Are there decisions customers could make themselves (pricing, scheduling) that you currently handle manually?',
    'Would a 20% increase in your conversion rate significantly change your revenue?',
  ]},
  { category: 'Technology & Data', items: [
    'Do the tools you use (email, payments, calendar, CRM) connect to each other automatically?',
    'Do you know which of your marketing channels actually bring paying customers?',
    'Can you see at a glance which prospects are most likely to buy soon?',
    'Is your customer data organized in one place where you can access it quickly?',
  ]},
];

// Flat list with stable numeric IDs q0…q19
const FLAT = questions.flatMap((section, si) =>
  section.items.map((text, qi) => ({ id: `q${si * 4 + qi}`, text, category: section.category }))
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

export default function ChecklistForm({ hideHero = false, defaultSource = null }) {
  const [step, setStep]             = useState('email'); // 'email' | 'questions' | 'submitted'
  const [email, setEmail]           = useState('');
  const [firstName, setFirstName]   = useState('');
  const [company, setCompany]       = useState('');
  const [source, setSource]         = useState('site');
  const [answers, setAnswers]       = useState({}); // { q0: 'yes'|'no'|null, … }
  const [emailErr, setEmailErr]     = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitErr, setSubmitErr]   = useState('');

  useEffect(() => {
    if (defaultSource) {
      setSource(defaultSource);
    } else {
      const p = new URLSearchParams(window.location.search);
      const s = p.get('source');
      if (s) setSource(s);
    }
  }, [defaultSource]);

  const handlePrint = () => {
    const originalTitle = document.title;
    const dateStr = new Date().toISOString().split('T')[0];
    document.title = `AI-Readiness-Checklist-${dateStr}`;
    setTimeout(() => {
      window.print();
      setTimeout(() => { document.title = originalTitle; }, 1000);
    }, 100);
  };

  const setAnswer = (id, value) => {
    setAnswers(prev => ({ ...prev, [id]: prev[id] === value ? null : value }));
  };

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
        {!hideHero && (
          <section style={{ backgroundColor: '#111827', color: '#fff', padding: 'clamp(40px,8vw,80px) 20px', textAlign: 'center' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
              <div style={{ marginBottom: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo-gradient-test.svg" alt="AIandWEBservices" width={420} height={84} style={{ display: 'block', maxWidth: '90%' }} />
              </div>
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
        )}

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

        <style>{`@media print { .checklist-print-btn { display:none !important; } }`}</style>
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
  const answeredCount = Object.values(answers).filter(v => v === 'yes' || v === 'no').length;
  const yesCount      = Object.values(answers).filter(v => v === 'yes').length;

  return (
    <div>
      {!hideHero && (
        <section style={{ backgroundColor: '#111827', color: '#fff', padding: 'clamp(40px,8vw,80px) 20px', textAlign: 'center' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ marginBottom: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo-gradient-test.svg" alt="AIandWEBservices" width={420} height={84} style={{ display: 'block', maxWidth: '90%' }} />
            </div>
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
              onClick={handlePrint}
              className="checklist-print-btn"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', backgroundColor: 'transparent', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', fontSize: '14px' }}
            >
              <Download size={16} />
              Print / Save as PDF
            </button>
          </div>
        </section>
      )}

      <section style={{ maxWidth: '900px', margin: '0 auto', padding: '60px 20px', backgroundColor: '#fff' }}>
        {/* Progress */}
        <div style={{ marginBottom: '40px', padding: '16px 24px', backgroundColor: '#f0fdf4', border: '1px solid #86efac', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
          <span style={{ fontSize: '15px', color: '#374151', fontWeight: '600' }}>
            {answeredCount} of 20 answered
          </span>
          <div style={{ height: '8px', flex: '1', minWidth: '120px', maxWidth: '260px', backgroundColor: '#d1d5db', borderRadius: '99px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${(answeredCount / 20) * 100}%`, backgroundColor: TEAL, borderRadius: '99px', transition: 'width .3s' }} />
          </div>
        </div>

        {/* Questions grouped by category */}
        {questions.map((section, sIdx) => (
          <div key={sIdx} style={{ marginBottom: '48px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#111827', marginBottom: '24px', paddingBottom: '12px', borderBottom: '2px solid #e5e7eb' }}>
              {section.category}
            </h3>
            <div style={{ display: 'grid', gap: '10px' }}>
              {section.items.map((text, qIdx) => {
                const id = `q${sIdx * 4 + qIdx}`;
                const val = answers[id] ?? null;
                return (
                  <div
                    key={qIdx}
                    style={{ padding: '16px 20px', borderRadius: '12px', border: `1px solid ${val ? (val === 'yes' ? TEAL + '40' : '#d1d5db') : '#e5e7eb'}`, background: val === 'yes' ? TEAL + '08' : '#fff' }}
                  >
                    <p style={{ margin: '0 0 12px', fontSize: '15px', color: '#1f2937', lineHeight: '1.5' }}>
                      {text}
                    </p>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        type="button"
                        onClick={() => setAnswer(id, 'yes')}
                        style={{
                          flex: '1',
                          padding: '10px 16px',
                          borderRadius: '8px',
                          border: `1.5px solid ${TEAL}`,
                          background: val === 'yes' ? TEAL : 'transparent',
                          color: val === 'yes' ? '#ffffff' : TEAL,
                          fontWeight: 700,
                          fontSize: '14px',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        Yes
                      </button>
                      <button
                        type="button"
                        onClick={() => setAnswer(id, 'no')}
                        style={{
                          flex: '1',
                          padding: '10px 16px',
                          borderRadius: '8px',
                          border: '1.5px solid #e5e7eb',
                          background: val === 'no' ? '#6b7280' : 'transparent',
                          color: val === 'no' ? '#ffffff' : '#6b7280',
                          fontWeight: 700,
                          fontSize: '14px',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        No
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Live Yes/No/Unanswered counter */}
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', padding: '24px 20px', background: 'linear-gradient(135deg, rgba(42,165,160,0.08), rgba(42,165,160,0.02))', borderTop: '1px solid rgba(42,165,160,0.2)', borderBottom: '1px solid rgba(42,165,160,0.2)', marginTop: '32px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '32px', fontWeight: 800, color: TEAL, lineHeight: 1 }}>{yesCount}</div>
            <div style={{ fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '4px', fontWeight: 700 }}>Yes</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '32px', fontWeight: 800, color: '#6b7280', lineHeight: 1 }}>{Object.values(answers).filter(v => v === 'no').length}</div>
            <div style={{ fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '4px', fontWeight: 700 }}>No</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '32px', fontWeight: 800, color: '#d1d5db', lineHeight: 1 }}>{20 - answeredCount}</div>
            <div style={{ fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '4px', fontWeight: 700 }}>Unanswered</div>
          </div>
        </div>

        {/* Scoring Guide */}
        <div style={{ marginTop: '64px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', paddingTop: '32px', borderTop: '2px solid #e5e7eb', marginBottom: '24px' }}>
            <h3 style={{ fontSize: 'clamp(22px,3vw,28px)', fontWeight: 800, color: '#111827', margin: 0 }}>Score Your Readiness</h3>
            <div style={{ fontSize: 'clamp(22px,3vw,28px)', fontWeight: 800 }}>
              <span style={{ color: '#111827' }}>Yes Total = </span>
              <span style={{ color: yesCount <= 7 ? '#dc2626' : yesCount <= 14 ? '#ca8a04' : '#16a34a' }}>{yesCount}</span>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '20px' }}>
            <div style={{ padding: '20px', backgroundColor: '#fee2e2', borderRadius: '8px', border: '1px solid #fca5a5' }}>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#991b1b', marginBottom: '8px' }}>0–7 Yes answers</div>
              <div style={{ fontSize: '18px', fontWeight: '800', color: '#dc2626', marginBottom: '8px' }}>Low Readiness</div>
              <p style={{ fontSize: '14px', color: '#7f1d1d', lineHeight: '1.5', margin: 0 }}>
                Start with our Presence or Growth tier to build fundamentals.
              </p>
            </div>
            <div style={{ padding: '20px', backgroundColor: '#fef3c7', borderRadius: '8px', border: '1px solid #fcd34d' }}>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#92400e', marginBottom: '8px' }}>8–14 Yes answers</div>
              <div style={{ fontSize: '18px', fontWeight: '800', color: '#f59e0b', marginBottom: '8px' }}>Medium Readiness</div>
              <p style={{ fontSize: '14px', color: '#451a03', lineHeight: '1.5', margin: 0 }}>
                You have quick wins available. Book a call to identify them.
              </p>
            </div>
            <div style={{ padding: '20px', backgroundColor: '#dcfce7', borderRadius: '8px', border: '1px solid #86efac' }}>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#166534', marginBottom: '8px' }}>15–20 Yes answers</div>
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
          <p style={{ fontSize: '15px', color: '#374151', marginBottom: '16px', lineHeight: '1.6', maxWidth: '640px', margin: '0 auto 16px' }}>
            Submit your assessment and David will personally review your responses and send recommendations within 6 hours.
          </p>
          {answeredCount < 20 && answeredCount > 0 && (
            <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '16px' }}>
              You've answered {answeredCount} of 20 questions — you can still submit with partial answers.
            </p>
          )}
          {submitErr && (
            <p style={{ color: '#dc2626', fontSize: '14px', marginBottom: '16px' }}>{submitErr}</p>
          )}
          <button
            onClick={handleSubmit}
            disabled={submitting || answeredCount === 0}
            style={{ padding: '14px 36px', backgroundColor: TEAL, color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '700', fontSize: '16px', cursor: (submitting || answeredCount === 0) ? 'not-allowed' : 'pointer', opacity: (submitting || answeredCount === 0) ? 0.6 : 1 }}
          >
            {submitting ? 'Submitting…' : 'Submit Assessment →'}
          </button>
          <button
            onClick={handlePrint}
            className="checklist-print-btn"
            style={{ background: 'none', border: 'none', padding: 0, margin: '24px auto 0', display: 'block', color: '#2563eb', textDecoration: 'underline', fontSize: 'clamp(18px,2.5vw,22px)', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
          >
            Print / Save as PDF
          </button>
        </div>
      </section>

      <style>{`@media print { .checklist-print-btn { display:none !important; } * { box-shadow:none !important; } }`}</style>
    </div>
  );
}
