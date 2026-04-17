import Link from 'next/link';
import { SERVICES } from '@/lib/services-data';
import V1Hero from '@/components/v1-components/V1Hero';
import V1FeatureGrid from '@/components/v1-components/V1FeatureGrid';
import V1FitCheck from '@/components/v1-components/V1FitCheck';
import V1Timeline from '@/components/v1-components/V1Timeline';
import V1PriceCard from '@/components/v1-components/V1PriceCard';
import V1Comparison from '@/components/v1-components/V1Comparison';
import { Check, X, ChevronRight } from 'lucide-react';

export const metadata = {
  title: 'AI Automation Starter — Custom AI Chatbot for Your Business | AIandWEBservices',
  description: 'Deploy a custom AI chatbot trained on your business in 7-14 days. Handles inquiries, qualifies leads, books calls 24/7. $199 setup + $25/mo. No contracts.',
  alternates: { canonical: 'https://www.aiandwebservices.com/services/ai-automation-starter' },
};

const service = SERVICES['ai-automation-starter'];

export default function AIAutomationStarterPage() {
  if (!service) return <div style={{ padding: '3rem', textAlign: 'center' }}>Service not found.</div>;

  return (
    <>
      <V1Hero service={service} />
      <V1FeatureGrid features={service.features} />

      {/* ── THE PROBLEM THIS SOLVES ── */}
      <section style={{ padding: 'clamp(60px, 10vw, 100px) 20px', maxWidth: '1000px', margin: '0 auto' }}>
        <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, marginBottom: '32px', textAlign: 'center' }}>
          The Cost of Lost Leads (And Slow Replies)
        </h2>

        <p style={{ fontSize: '16px', lineHeight: 1.8, color: 'rgba(255,255,255,0.85)', marginBottom: '32px', maxWidth: '800px', margin: '0 auto 32px' }}>
          Businesses getting 10+ inquiries weekly are losing money silently. Phone rings and goes to voicemail → lead moves to competitor. Email inquiry sits for 24 hours → prospect buys elsewhere. Weekend inquiry never answered → $5K–$50K deal lost.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginTop: '40px' }}>
          {/* Problem 1 */}
          <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px' }}>You're Losing Leads to Speed</h3>
            <p style={{ fontSize: '14px', lineHeight: 1.7, color: 'rgba(255,255,255,0.75)' }}>
              60% of buyers choose vendors who respond first. You're sleeping, in a meeting, or handling other clients when inquiries come in. If you get 20 inquiries/month and lose 5 to slow response, that's $10K–$100K in lost revenue.
            </p>
          </div>

          {/* Problem 2 */}
          <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px' }}>Qualifying Takes Forever</h3>
            <p style={{ fontSize: '14px', lineHeight: 1.7, color: 'rgba(255,255,255,0.75)' }}>
              Each inquiry needs 3–5 emails to figure out if they're a real fit. "How much?" "What areas?" "Are you available?" Meanwhile, 30% of leads give up waiting and hire someone else.
            </p>
          </div>

          {/* Problem 3 */}
          <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px' }}>You Can't Scale Without Hiring</h3>
            <p style={{ fontSize: '14px', lineHeight: 1.7, color: 'rgba(255,255,255,0.75)' }}>
              One person can handle ~30–40 inquiries/month manually. After that, you either hire ($2K–$4K/month) or lose leads. Hiring means payroll, training, turnover—and they can't work 24/7.
            </p>
          </div>
        </div>

        <p style={{ fontSize: '16px', fontWeight: 700, textAlign: 'center', marginTop: '40px', color: '#2AA5A0' }}>
          AI Automation Starter solves all three problems without hiring anyone.
        </p>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ padding: 'clamp(60px, 10vw, 100px) 20px', maxWidth: '1000px', margin: '0 auto', backgroundColor: 'rgba(42, 165, 160, 0.05)', borderRadius: '8px' }}>
        <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, marginBottom: '40px', textAlign: 'center' }}>
          How It Works, Step by Step (7–14 Days)
        </h2>

        <p style={{ fontSize: '16px', lineHeight: 1.8, color: 'rgba(255,255,255,0.85)', marginBottom: '48px', maxWidth: '900px', margin: '0 auto 48px' }}>
          This isn't just a chatbot—it's a complete system. David builds it personally, trains it on your specific business, and integrates it with your existing tools. The process is transparent and you're involved at each step.
        </p>

        <div style={{ display: 'grid', gap: '32px' }}>
          {/* Phase 1 */}
          <div style={{ borderLeft: '4px solid #2AA5A0', paddingLeft: '24px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '12px' }}>Phase 1: Discovery & Training (Days 1–3)</h3>
            <ul style={{ fontSize: '15px', lineHeight: 1.8, color: 'rgba(255,255,255,0.8)', listStyle: 'none', paddingLeft: 0, marginBottom: '16px' }}>
              <li style={{ marginBottom: '8px' }}>→ <strong>60-minute discovery call</strong>: David learns your business, services, ideal customers, pricing, booking process</li>
              <li style={{ marginBottom: '8px' }}>→ <strong>Build knowledge base</strong>: Feed the AI your website, FAQs, proposals, email templates—everything it needs to know</li>
              <li style={{ marginBottom: '8px' }}>→ <strong>You approve</strong>: Review what we fed the AI; flag anything missing or wrong</li>
              <li>→ <strong>Outcome</strong>: The AI now "knows" your business as well as you do</li>
            </ul>
          </div>

          {/* Phase 2 */}
          <div style={{ borderLeft: '4px solid #2AA5A0', paddingLeft: '24px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '12px' }}>Phase 2: Calendar & CRM Integration (Days 4–6)</h3>
            <ul style={{ fontSize: '15px', lineHeight: 1.8, color: 'rgba(255,255,255,0.8)', listStyle: 'none', paddingLeft: 0, marginBottom: '16px' }}>
              <li style={{ marginBottom: '8px' }}>→ <strong>Connect your calendar</strong>: Google Calendar, Calendly, Acuity—whatever you use</li>
              <li style={{ marginBottom: '8px' }}>→ <strong>Connect your CRM</strong>: HubSpot, Salesforce, Pipedrive, Zoho—AI logs every conversation automatically</li>
              <li style={{ marginBottom: '8px' }}>→ <strong>Set availability rules</strong>: AI only books during your preferred hours (or 24/7)</li>
              <li>→ <strong>Outcome</strong>: Calendar updates instantly; lead data goes into your CRM</li>
            </ul>
          </div>

          {/* Phase 3 */}
          <div style={{ borderLeft: '4px solid #2AA5A0', paddingLeft: '24px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '12px' }}>Phase 3: Testing & Refinement (Days 7–10)</h3>
            <ul style={{ fontSize: '15px', lineHeight: 1.8, color: 'rgba(255,255,255,0.8)', listStyle: 'none', paddingLeft: 0, marginBottom: '16px' }}>
              <li style={{ marginBottom: '8px' }}>→ <strong>David tests</strong> with realistic inquiries to find weak spots</li>
              <li style={{ marginBottom: '8px' }}>→ <strong>You test</strong> and ask the questions your actual customers would ask</li>
              <li style={{ marginBottom: '8px' }}>→ <strong>Refine together</strong>: If answers are wrong, David retrains the AI</li>
              <li>→ <strong>Outcome</strong>: The AI is bulletproof before launch</li>
            </ul>
          </div>

          {/* Phase 4 */}
          <div style={{ borderLeft: '4px solid #2AA5A0', paddingLeft: '24px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '12px' }}>Phase 4: Launch & 30-Day Monitoring (Days 11–14)</h3>
            <ul style={{ fontSize: '15px', lineHeight: 1.8, color: 'rgba(255,255,255,0.8)', listStyle: 'none', paddingLeft: 0 }}>
              <li style={{ marginBottom: '8px' }}>→ <strong>AI goes live</strong> on your website, handling inquiries 24/7</li>
              <li style={{ marginBottom: '8px' }}>→ <strong>David monitors</strong> the first 30 days; any issues fixed immediately</li>
              <li style={{ marginBottom: '8px' }}>→ <strong>Weekly summaries</strong>: How many inquiries? What patterns? Any improvements needed?</li>
              <li>→ <strong>Outcome</strong>: The AI is live and performing smoothly</li>
            </ul>
          </div>
        </div>

        <p style={{ fontSize: '15px', lineHeight: 1.8, color: 'rgba(255,255,255,0.75)', marginTop: '40px', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <strong>After launch:</strong> David continues optimizing monthly. New services? New pricing? New objections? David retrains the AI (1–2 days turnaround). This is included in the $25/month fee—no surprise costs.
        </p>
      </section>

      {/* ── COMPARISON TABLE ── */}
      <section style={{ padding: 'clamp(60px, 10vw, 100px) 20px', maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, marginBottom: '16px', textAlign: 'center' }}>
          What You Get vs DIY ChatGPT
        </h2>
        <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', textAlign: 'center', marginBottom: '40px' }}>
          Why not just use free ChatGPT or a cheap bot builder?
        </p>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid rgba(42, 165, 160, 0.5)' }}>
                <th style={{ padding: '16px', textAlign: 'left', fontWeight: 700, color: '#2AA5A0' }}>Feature</th>
                <th style={{ padding: '16px', textAlign: 'center', fontWeight: 700, color: '#2AA5A0' }}>AI Automation Starter</th>
                <th style={{ padding: '16px', textAlign: 'center', fontWeight: 700, color: '#2AA5A0' }}>DIY ChatGPT / Bot</th>
                <th style={{ padding: '16px', textAlign: 'right', fontWeight: 700, color: '#2AA5A0' }}>Cost of DIY</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <td style={{ padding: '16px', color: 'rgba(255,255,255,0.85)' }}>Custom training on YOUR business</td>
                <td style={{ padding: '16px', textAlign: 'center' }}><Check size={20} color="#10b981" /></td>
                <td style={{ padding: '16px', textAlign: 'center' }}><X size={20} color="#ef4444" /></td>
                <td style={{ padding: '16px', textAlign: 'right', fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>20+ hrs @ $100/hr</td>
              </tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <td style={{ padding: '16px', color: 'rgba(255,255,255,0.85)' }}>Calendar integration (instant booking)</td>
                <td style={{ padding: '16px', textAlign: 'center' }}><Check size={20} color="#10b981" /></td>
                <td style={{ padding: '16px', textAlign: 'center' }}><X size={20} color="#ef4444" /></td>
                <td style={{ padding: '16px', textAlign: 'right', fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>$600–1,800/yr</td>
              </tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <td style={{ padding: '16px', color: 'rgba(255,255,255,0.85)' }}>CRM logging (no data loss)</td>
                <td style={{ padding: '16px', textAlign: 'center' }}><Check size={20} color="#10b981" /></td>
                <td style={{ padding: '16px', textAlign: 'center' }}><X size={20} color="#ef4444" /></td>
                <td style={{ padding: '16px', textAlign: 'right', fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>$1,800–2,400/yr</td>
              </tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <td style={{ padding: '16px', color: 'rgba(255,255,255,0.85)' }}>Ongoing updates & optimization</td>
                <td style={{ padding: '16px', textAlign: 'center' }}><Check size={20} color="#10b981" /></td>
                <td style={{ padding: '16px', textAlign: 'center' }}><X size={20} color="#ef4444" /></td>
                <td style={{ padding: '16px', textAlign: 'right', fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>$1,200–2,400/yr</td>
              </tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <td style={{ padding: '16px', color: 'rgba(255,255,255,0.85)' }}>Real human handoff (no lost customers)</td>
                <td style={{ padding: '16px', textAlign: 'center' }}><Check size={20} color="#10b981" /></td>
                <td style={{ padding: '16px', textAlign: 'center' }}><X size={20} color="#ef4444" /></td>
                <td style={{ padding: '16px', textAlign: 'right', fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>$5K–50K lost</td>
              </tr>
              <tr style={{ backgroundColor: 'rgba(42, 165, 160, 0.1)', borderTop: '2px solid rgba(42, 165, 160, 0.5)' }}>
                <td style={{ padding: '16px', fontWeight: 700, color: '#fff' }}>1-Year Total</td>
                <td style={{ padding: '16px', textAlign: 'center', fontWeight: 700, color: '#2AA5A0' }}>$499</td>
                <td style={{ padding: '16px', textAlign: 'center', fontWeight: 700, color: '#ef4444' }}>$2,200–4,400</td>
                <td style={{ padding: '16px', textAlign: 'right', fontWeight: 700, color: '#10b981' }}>8–9× cheaper</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p style={{ fontSize: '15px', lineHeight: 1.8, color: 'rgba(255,255,255,0.75)', marginTop: '32px', padding: '20px', backgroundColor: 'rgba(42, 165, 160, 0.1)', borderRadius: '6px' }}>
          Trying to save $500 by DIY'ing costs you $2,000–$4,000 in wasted time. Plus, a half-built chatbot loses customers. This tier is designed to give you a professional, working system at 1/8th the cost of building it yourself.
        </p>
      </section>

      {/* ── REAL EXAMPLE ── */}
      <section style={{ padding: 'clamp(60px, 10vw, 100px) 20px', maxWidth: '1000px', margin: '0 auto' }}>
        <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, marginBottom: '40px', textAlign: 'center' }}>
          Real Example: How It Works for a Home Service Business
        </h2>

        <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '32px', marginBottom: '32px' }}>
          <p style={{ fontSize: '16px', lineHeight: 1.8, color: 'rgba(255,255,255,0.85)', marginBottom: '24px' }}>
            <strong>The Scenario:</strong> Sarah runs a painting contractor business in Boston. She gets 20–30 inquiries per month, mostly through her website and Google. She's tired of missing calls and spending a week emailing back-and-forth before prospects book.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            {/* Before */}
            <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '6px', padding: '20px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px', color: '#fca5a5' }}>The Before: Sarah Loses Leads</h3>
              <ul style={{ fontSize: '14px', lineHeight: 1.7, color: 'rgba(255,255,255,0.75)', listStyle: 'none', paddingLeft: 0 }}>
                <li style={{ marginBottom: '8px' }}>✗ Answers calls when she can (often can't during jobs)</li>
                <li style={{ marginBottom: '8px' }}>✗ Voicemail piles up; returns calls hours later</li>
                <li style={{ marginBottom: '8px' }}>✗ Email: Takes 3–5 messages to scope a job</li>
                <li style={{ marginBottom: '8px' }}>✗ Half the time, they've hired someone else by then</li>
                <li>✗ Considering hiring an office manager ($3K+/mo)</li>
              </ul>
            </div>

            {/* After */}
            <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '6px', padding: '20px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px', color: '#86efac' }}>The After: Sarah's AI Takes Over</h3>
              <ul style={{ fontSize: '14px', lineHeight: 1.7, color: 'rgba(255,255,255,0.75)', listStyle: 'none', paddingLeft: 0 }}>
                <li style={{ marginBottom: '8px' }}>✓ Prospect inquires → AI responds in 5 seconds</li>
                <li style={{ marginBottom: '8px' }}>✓ "How much?" → AI: "$3–8K depending on scope"</li>
                <li style={{ marginBottom: '8px' }}>✓ AI asks qualifying questions (size, condition, timeline)</li>
                <li style={{ marginBottom: '8px' }}>✓ Shows Sarah's calendar → prospect books immediately</li>
                <li>✓ Lead data goes into CRM automatically</li>
              </ul>
            </div>
          </div>

          <p style={{ fontSize: '16px', lineHeight: 1.8, color: 'rgba(255,255,255,0.85)', marginTop: '24px', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <strong>The Results:</strong> Response time drops from 6–24 hours to 5 seconds. Booking rate jumps from 40% → 70% (no email friction). Sarah gains 3–4 hours/month back. Bottom line: 10 more qualified leads/month = 3 new jobs/month = $12K–$24K in new annual revenue.
          </p>
        </div>
      </section>

      {/* ── EXISTING COMPONENTS ── */}
      <V1FitCheck bullets={service.fitBullets} />
      <V1Timeline timeline={service.timeline} />

      {/* ── PAGE-SPECIFIC FAQ ── */}
      <section style={{ padding: 'clamp(60px, 10vw, 100px) 20px', maxWidth: '1000px', margin: '0 auto' }}>
        <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, marginBottom: '40px', textAlign: 'center' }}>
          Questions About AI Automation Starter
        </h2>

        <div style={{ display: 'grid', gap: '24px' }}>
          {[
            {
              q: "Won't prospects be annoyed talking to a bot?",
              a: "Not if it's polite and actually answers their questions. The AI is trained to be helpful, not robotic. Most prospects don't mind—they get an instant answer instead of waiting 6 hours. The AI's job is to answer FAQs and qualify. For real conversations, it hands off to you."
            },
            {
              q: "What if the AI gives a wrong answer?",
              a: "That's why David monitors it for 30 days after launch and continues monthly optimization. If an answer is wrong, he retrains the AI. Plus, every conversation is logged, so you can see what the AI said and correct it. We also set up an escalation button so prospects can request you directly."
            },
            {
              q: "Can the AI handle complex questions?",
              a: "It handles 60–80% of inquiries (FAQs, basic qualifying). For complex questions, the AI detects it doesn't know and offers to connect the prospect with you. No fake answers. No friction. The goal is to speed up 80% of conversations and hand off the weird 20%."
            },
            {
              q: "How is this different from hiring a part-time admin?",
              a: "A part-time admin costs $1,500–$2,500/month and works 9–5. The AI costs $25/month and works 24/7. An admin will get sick or leave. The AI doesn't. An admin handles ~30 inquiries/month; the AI handles unlimited. Start with the AI; hire people later when you need strategy, not inquiry handling."
            },
            {
              q: "What if I need to change how the AI answers?",
              a: "Tell David what needs updating in your monthly check-in. He retrains the AI in 1–2 days. New service? New pricing? New availability? David updates it. This is included in the $25/month fee."
            },
            {
              q: "Can the AI work with my specific CRM/calendar?",
              a: "Probably. We integrate with 50+ CRMs and calendars (HubSpot, Salesforce, Pipedrive, Zoho, Google Calendar, Calendly, Acuity, etc.). During discovery, tell David what you use and we'll set it up. If something isn't supported, we find a workaround."
            },
            {
              q: "What happens if I want to upgrade to a bigger system?",
              a: "You move to Presence, Growth, or Revenue Engine. All your training, integrations, and conversation data move with you. You're not starting over—you're adding capabilities (website, email marketing, paid ads, etc.). The AI stays and gets smarter."
            }
          ].map((item, i) => (
            <div key={i} style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px', color: '#fff' }}>{item.q}</h3>
              <p style={{ fontSize: '15px', lineHeight: 1.7, color: 'rgba(255,255,255,0.75)', margin: 0 }}>{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── PRICING & INCLUDES ── */}
      <V1PriceCard service={service} />

      {/* ── IS THIS THE RIGHT TIER ── */}
      <section style={{ padding: 'clamp(60px, 10vw, 100px) 20px', maxWidth: '1000px', margin: '0 auto' }}>
        <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, marginBottom: '40px', textAlign: 'center' }}>
          Is This the Right Tier for You?
        </h2>

        <p style={{ fontSize: '16px', lineHeight: 1.8, color: 'rgba(255,255,255,0.85)', marginBottom: '40px', textAlign: 'center', maxWidth: '800px', margin: '0 auto 40px' }}>
          This tier is for service businesses getting 10+ inquiries weekly. It's not for businesses with fewer inquiries or those needing full-funnel automation.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '40px' }}>
          {/* Good fit */}
          <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '8px', padding: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', color: '#86efac' }}>You're a Good Fit If</h3>
            <ul style={{ fontSize: '14px', lineHeight: 1.8, color: 'rgba(255,255,255,0.8)', listStyle: 'none', paddingLeft: 0 }}>
              <li style={{ marginBottom: '10px' }}>✓ You get 10+ inquiries/week</li>
              <li style={{ marginBottom: '10px' }}>✓ 50%+ of inquiries are similar (FAQs)</li>
              <li style={{ marginBottom: '10px' }}>✓ You're losing leads to slow response</li>
              <li style={{ marginBottom: '10px' }}>✓ You don't have an admin yet</li>
              <li>✓ You want to test AI before bigger commitment</li>
            </ul>
          </div>

          {/* Skip to Growth */}
          <div style={{ backgroundColor: 'rgba(96, 165, 250, 0.1)', border: '1px solid rgba(96, 165, 250, 0.3)', borderRadius: '8px', padding: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', color: '#93c5fd' }}>Consider Presence If</h3>
            <ul style={{ fontSize: '14px', lineHeight: 1.8, color: 'rgba(255,255,255,0.8)', listStyle: 'none', paddingLeft: 0 }}>
              <li style={{ marginBottom: '10px' }}>You're just getting started online</li>
              <li style={{ marginBottom: '10px' }}>You need a website + basic AI first</li>
              <li style={{ marginBottom: '10px' }}>You want local SEO setup included</li>
              <li style={{ marginBottom: '10px' }}>You have fewer than 10 inquiries/week</li>
              <li>Total solution: Website + AI + SEO</li>
            </ul>
          </div>

          {/* Upgrade to Growth */}
          <div style={{ backgroundColor: 'rgba(168, 85, 247, 0.1)', border: '1px solid rgba(168, 85, 247, 0.3)', borderRadius: '8px', padding: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', color: '#d8b4fe' }}>Consider Growth If</h3>
            <ul style={{ fontSize: '14px', lineHeight: 1.8, color: 'rgba(255,255,255,0.8)', listStyle: 'none', paddingLeft: 0 }}>
              <li style={{ marginBottom: '10px' }}>You're at 30+ inquiries/week</li>
              <li style={{ marginBottom: '10px' }}>You want email marketing too</li>
              <li style={{ marginBottom: '10px' }}>You need SEO content (2 articles/month)</li>
              <li style={{ marginBottom: '10px' }}>You want conversion-optimized pages</li>
              <li>Total: Full lead funnel, not just chat</li>
            </ul>
          </div>
        </div>

        <p style={{ fontSize: '15px', lineHeight: 1.8, color: 'rgba(255,255,255,0.75)', backgroundColor: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '6px', marginBottom: '32px' }}>
          <strong>Not sure?</strong> Book a free consultation. David will look at your actual inquiry volume and patterns, and help you confirm this is the right fit. Or go straight to the contact form—you'll hear back within 6 hours.
        </p>

        {/* Tier navigation */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
          <Link href="/services/presence" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', textDecoration: 'none', color: 'inherit', transition: 'all 0.2s' }}>
            <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.85)' }}>← Start with <strong>Presence</strong> (website + basic AI)</span>
          </Link>
          <Link href="/services/growth" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', textDecoration: 'none', color: 'inherit', transition: 'all 0.2s', justifyContent: 'flex-end' }}>
            <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.85)' }}>Upgrade to <strong>Growth</strong> (+ email, content) →</span>
          </Link>
        </div>
      </section>

      {/* ── TIER NAVIGATION (BOTTOM) ── */}
      <V1Comparison service={service} />
    </>
  );
}
