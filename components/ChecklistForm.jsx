'use client';
import Link from 'next/link';
import { Download } from 'lucide-react';

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
    'Would increasing your team\'s closing rate by 20-30% impact your revenue significantly?',
  ]},
  { category: 'Technology & Data', items: [
    'Do you have a CRM or customer database?',
    'Do your different tools talk to each other, or are they siloed?',
    'Would you benefit from seeing which customers/prospects are most engaged?',
    'Are you tracking which marketing channels actually convert customers?',
  ]},
];

export default function ChecklistForm() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      {/* Hero */}
      <section style={{ backgroundColor: '#111827', color: '#fff', padding: 'clamp(40px, 8vw, 80px) 20px', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ fontSize: '14px', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase', color: '#2AA5A0', marginBottom: '16px' }}>
            Free Resource
          </div>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: '800', marginBottom: '16px', lineHeight: '1.2' }}>
            AI Readiness Checklist
          </h1>
          <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.8)', lineHeight: '1.6', marginBottom: '32px' }}>
            20 questions to assess whether your small business is ready for AI automation. Take 5 minutes, get a score, and find your quick wins.
          </p>
          <button
            onClick={handlePrint}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '14px 24px',
              backgroundColor: '#2AA5A0',
              color: '#111827',
              border: 'none',
              borderRadius: '6px',
              fontWeight: '700',
              cursor: 'pointer',
              fontSize: '16px',
            }}
          >
            <Download size={20} />
            Print / Save as PDF
          </button>
        </div>
      </section>

      {/* Checklist Content */}
      <section style={{ maxWidth: '900px', margin: '0 auto', padding: '60px 20px', backgroundColor: '#fff' }}>
        <div style={{ backgroundColor: '#f0fdf4', border: '2px solid #22c55e', borderRadius: '8px', padding: '24px', marginBottom: '48px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#111827', marginBottom: '12px' }}>How to Use This Checklist</h2>
          <ol style={{ fontSize: '15px', color: '#374151', lineHeight: '1.7', margin: 0, paddingLeft: '20px' }}>
            <li>Read each question below</li>
            <li>Check off the ones that apply to your business (or print and circle them)</li>
            <li>Scroll to the bottom for your score and what it means</li>
            <li>If you scored "High" or "Medium": book a free 15-minute intro call for personalized recommendations</li>
          </ol>
        </div>

        {/* Questions */}
        {questions.map((section, sIdx) => (
          <div key={sIdx} style={{ marginBottom: '48px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#111827', marginBottom: '24px', paddingBottom: '12px', borderBottom: '2px solid #e5e7eb' }}>
              {section.category}
            </h3>
            <div style={{ display: 'grid', gap: '20px' }}>
              {section.items.map((item, qIdx) => (
                <label key={qIdx} style={{ display: 'flex', gap: '12px', cursor: 'pointer', alignItems: 'flex-start' }}>
                  <input
                    type="checkbox"
                    style={{ width: '20px', height: '20px', marginTop: '2px', cursor: 'pointer', flexShrink: 0 }}
                  />
                  <span style={{ fontSize: '15px', color: '#374151', lineHeight: '1.6', flex: 1 }}>
                    {item}
                  </span>
                </label>
              ))}
            </div>
          </div>
        ))}

        {/* Scoring Guide */}
        <div style={{ marginTop: '64px', paddingTop: '32px', borderTop: '2px solid #e5e7eb' }}>
          <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#111827', marginBottom: '24px' }}>
            Score Your Readiness
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
            <div style={{ padding: '20px', backgroundColor: '#fee2e2', borderRadius: '8px', border: '1px solid #fca5a5' }}>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#991b1b', marginBottom: '8px' }}>0-7 Checks</div>
              <div style={{ fontSize: '18px', fontWeight: '800', color: '#dc2626', marginBottom: '8px' }}>Low Readiness</div>
              <p style={{ fontSize: '14px', color: '#7f1d1d', lineHeight: '1.5', margin: 0 }}>
                You're in good hands. Start with our Presence or Growth tier to build fundamentals.
              </p>
            </div>
            <div style={{ padding: '20px', backgroundColor: '#fef3c7', borderRadius: '8px', border: '1px solid #fcd34d' }}>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#92400e', marginBottom: '8px' }}>8-14 Checks</div>
              <div style={{ fontSize: '18px', fontWeight: '800', color: '#f59e0b', marginBottom: '8px' }}>Medium Readiness</div>
              <p style={{ fontSize: '14px', color: '#451a03', lineHeight: '1.5', margin: 0 }}>
                You have quick wins available. Book a call to identify them and prioritize.
              </p>
            </div>
            <div style={{ padding: '20px', backgroundColor: '#dcfce7', borderRadius: '8px', border: '1px solid #86efac' }}>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#166534', marginBottom: '8px' }}>15-20 Checks</div>
              <div style={{ fontSize: '18px', fontWeight: '800', color: '#22c55e', marginBottom: '8px' }}>High Readiness</div>
              <p style={{ fontSize: '14px', color: '#15803d', lineHeight: '1.5', margin: 0 }}>
                You're ready for AI automation. Book an intro call to map your implementation.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div style={{ marginTop: '64px', padding: '40px', backgroundColor: '#f0fdf4', borderRadius: '8px', textAlign: 'center', border: '1px solid #bbf7d0' }}>
          <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#111827', marginBottom: '12px' }}>
            Ready for Your Next Step?
          </h3>
          <p style={{ fontSize: '16px', color: '#374151', marginBottom: '24px', lineHeight: '1.6' }}>
            Book a free 15-minute intro call. We'll review your score, identify your biggest opportunities, and recommend where to start.
          </p>
          <Link
            href="/intro"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '14px 28px',
              backgroundColor: '#2AA5A0',
              color: '#111827',
              borderRadius: '6px',
              fontWeight: '700',
              textDecoration: 'none',
              cursor: 'pointer',
              fontSize: '16px',
            }}
          >
            Book Your 15-Min Intro Call
          </Link>
        </div>
      </section>

      {/* Print Styles */}
      <style>{`
        @media print {
          body { background: white; }
          section:first-of-type { display: none; }
          input[type="checkbox"] { accent-color: #2AA5A0; }
          * { box-shadow: none !important; }
        }
      `}</style>
    </div>
  );
}
