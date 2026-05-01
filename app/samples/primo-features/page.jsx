'use client';
import { useEffect, useRef, useState } from 'react';
import { Cormorant_Garamond, DM_Sans } from 'next/font/google';
import {
  Check, Star, Phone, Mail, ArrowRight, ChevronDown,
  Car, Users, Shield, Cpu, LayoutDashboard, Globe,
  MessageSquare, FileText, Target, TrendingUp,
} from 'lucide-react';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-dm-sans',
  display: 'swap',
});

/* ── Design tokens ─────────────────────────────────────────── */
const GOLD  = '#D4AF37';
const GOLD2 = '#F0CC5A';
const BG    = '#080808';
const BG2   = '#0f0f0f';
const PANEL = 'rgba(255,255,255,0.04)';
const TEXT  = '#F5F0E8';
const MUTED = '#8a8070';

/* ── Feature categories ───────────────────────────────────── */
const FEATURE_GROUPS = [
  {
    key: 'inventory',
    label: 'Inventory Management',
    icon: Car,
    color: '#4A9EFF',
    features: [
      'Multi-photo upload with gallery viewer',
      'VIN decoder auto-fills year / make / model / trim',
      'Live market pricing intelligence',
      'RESERVED / HOLD badge system',
      'Sold vehicle archive with profit history',
      'Custom status badges (New Arrival, Hot Deal, etc.)',
      'CSV import & bulk export',
      'Odometer, color, drivetrain tracking',
      'Asking price vs. market comparison alerts',
      'Feature highlights per vehicle listing',
    ],
  },
  {
    key: 'leads',
    label: 'Lead Generation & CRM',
    icon: Users,
    color: '#4ADE80',
    features: [
      'Lead capture forms on every inventory page',
      'Trade-in estimator widget',
      'Live payment calculator on listings',
      'Online appointment booking system',
      'Email & SMS alert notifications',
      'Lead source tracking (organic, paid, referral)',
      'Hot / warm / cold lead scoring',
      'Deal pipeline management',
      'Automated follow-up sequences',
      'Full lead history & notes CRM',
    ],
  },
  {
    key: 'trust',
    label: 'Trust & Conversion',
    icon: Shield,
    color: '#A78BFA',
    features: [
      'Google Reviews integration & display',
      'Facebook Reviews sync',
      'Star rating display on vehicle listings',
      'Review request automation by email',
      'Testimonial management dashboard',
      'Financing pre-approval widget',
      'Trust badge system',
      'Dealer response tools for reviews',
      'Review analytics & trend charts',
      'Social proof embedded where it converts',
    ],
  },
  {
    key: 'tech',
    label: 'Technology & Performance',
    icon: Cpu,
    color: '#FB923C',
    features: [
      'Mobile-first responsive design',
      'PageSpeed score 90+ guaranteed',
      'SEO-optimized vehicle detail pages',
      'SSL included — always secure',
      'Custom domain support',
      'Global CDN delivery',
      'ADA / WCAG 2.1 accessibility compliance',
      'Google Analytics integration',
      '99.9% uptime SLA',
      'Automatic daily backups',
    ],
  },
  {
    key: 'admin',
    label: 'Dealer Admin Panel',
    icon: LayoutDashboard,
    color: GOLD,
    features: [
      'Full inventory CRUD dashboard',
      'Lead CRM with integrated deal builder',
      'F&I product tracking per deal',
      'Service appointment scheduling',
      'Reservation & deposit management',
      'Marketing tools & CSV export',
      'Website performance analytics',
      'Reputation management center',
      'Market pricing intelligence',
      'Multi-user staff access controls',
    ],
  },
];

const TESTIMONIALS = [
  {
    quote: "We cut our software spend by $14,000 last year switching to AutoRival.ai. The admin panel alone is worth it — I manage everything from my phone.",
    name: 'Marcus Reid',
    title: 'Owner',
    dealership: 'Reid Family Auto Sales',
  },
  {
    quote: "I was skeptical at $249/mo — I thought there'd be a catch. There isn't. It does everything DealerSocket does at a fraction of the price, and the website looks better.",
    name: 'Carmen Vega',
    title: 'General Manager',
    dealership: 'Vega Auto Group',
  },
  {
    quote: "The reservation system and F&I tracking changed how I work deals. Customers hold a car online, and I see exactly what I'm making on each deal before I finalize.",
    name: 'Troy Hensley',
    title: 'Dealer Principal',
    dealership: 'Hensley Motors',
  },
];

const STEPS = [
  {
    num: '01',
    title: 'We build your custom dealership website',
    desc: 'Our team designs and builds a fully custom, SEO-optimized website for your dealership — no templates, no cookie-cutter themes. Typically delivered in 5–7 business days.',
  },
  {
    num: '02',
    title: 'Your inventory goes live with dealer panel access',
    desc: 'We connect your inventory feed (or you add vehicles manually) and activate your private dealer admin panel. Manage leads, appointments, deals, and reputation from day one.',
  },
  {
    num: '03',
    title: 'More leads. More deals. Less overhead.',
    desc: 'Your site works 24/7 — capturing leads, showing reviews, calculating payments for buyers. You handle the relationships; the platform handles everything else.',
  },
];

/* ── Fade-in hook ─────────────────────────────────────────── */
function useFadeIn(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

function FadeSection({ children, delay = 0 }) {
  const [ref, visible] = useFadeIn();
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(28px)',
        transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

/* ── Shared atoms ─────────────────────────────────────────── */
function FontStyles() {
  return (
    <style>{`
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      html { scroll-behavior: smooth; }
      ::selection { background: ${GOLD}33; color: ${TEXT}; }
      ::-webkit-scrollbar { width: 4px; }
      ::-webkit-scrollbar-track { background: ${BG2}; }
      ::-webkit-scrollbar-thumb { background: ${GOLD}44; border-radius: 4px; }
    `}</style>
  );
}

function SectionWrap({ children, id, bg }) {
  return (
    <section id={id} style={{ padding: '96px 0', background: bg || BG }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>
        {children}
      </div>
    </section>
  );
}

function Label({ children }) {
  return (
    <p style={{
      fontSize: 11, fontWeight: 600, letterSpacing: '0.22em',
      textTransform: 'uppercase', color: GOLD, marginBottom: 16,
      fontFamily: "var(--font-dm-sans), sans-serif",
    }}>{children}</p>
  );
}

function Heading({ children, sub }) {
  return (
    <div style={{ marginBottom: 48 }}>
      <h2 style={{
        fontFamily: "var(--font-cormorant), serif",
        fontSize: 'clamp(36px, 5vw, 56px)',
        fontWeight: 700, lineHeight: 1.05, color: TEXT,
        marginBottom: sub ? 16 : 0,
      }}>{children}</h2>
      {sub && <p style={{ fontSize: 18, color: MUTED, lineHeight: 1.65, maxWidth: 600 }}>{sub}</p>}
    </div>
  );
}

function Stars() {
  return (
    <div style={{ display: 'flex', gap: 3, marginBottom: 16 }}>
      {[0,1,2,3,4].map(i => <Star key={i} size={13} fill={GOLD} color={GOLD} />)}
    </div>
  );
}

/* ── AI feature data ──────────────────────────────────────── */
const AI_FEATURES = [
  {
    key: 'agent',
    IconComp: MessageSquare,
    color: '#4A9EFF',
    title: '24/7 AI Sales Agent',
    subtitle: 'Never miss a lead again — even at 2am',
    desc: 'When a customer asks "Do you have any SUVs under $40K?" at 11pm, your AI agent responds in seconds with real vehicles from your inventory, accurate monthly payments, and books a test drive — all while your team sleeps. Handles chat on your website AND incoming text messages.',
    stats: ['Responds in <5 seconds', 'Knows your entire inventory', 'Captures leads automatically'],
    demo: '/samples/example005',
    competitor: 'DriveCentric charges $500+/mo for their auto-responder. Ours is included.',
  },
  {
    key: 'descriptions',
    IconComp: FileText,
    color: '#A78BFA',
    title: 'AI Vehicle Descriptions',
    subtitle: 'Professional listing copy in 2 seconds',
    desc: 'Stop writing "well-maintained, runs great" on every listing. Enter a VIN and the AI writes a compelling, unique description that makes buyers want to schedule a test drive. Bulk-generate descriptions for your entire lot in minutes.',
    stats: ['Unique copy per vehicle', '~$0.001 per description', 'Bulk generate for entire lot'],
    beforeAfter: true,
  },
  {
    key: 'scoring',
    IconComp: Target,
    color: '#4ADE80',
    title: 'AI Lead Scoring',
    subtitle: 'Know who to call first — every time',
    desc: 'Not every lead is equal. The AI analyzes what each customer did on your site — which vehicles they viewed, whether they used the payment calculator, if they started Build Your Deal — and scores them 0–100. Your hottest leads surface to the top automatically.',
    scoreboard: true,
    competitor: 'VinSolutions charges $300+/mo for lead scoring. Ours is built in.',
  },
  {
    key: 'pricing',
    IconComp: TrendingUp,
    color: '#FB923C',
    title: 'AI Pricing Intelligence',
    subtitle: 'Stop guessing — know when to drop the price',
    desc: "The AI monitors every vehicle's days on lot, margin, and market position. When your 2021 Lexus RX hits 52 days, you get a specific recommendation: \"Drop to $29,995 — estimated to sell within 2 weeks at $4,195 gross.\" Set auto-pricing rules and let the AI manage aging inventory for you.",
    stats: ['Daily lot health score', 'Auto-price rules', 'Margin-aware recommendations'],
    competitor: 'vAuto charges $500+/mo for pricing intelligence. Ours is included.',
  },
  {
    key: 'followup',
    IconComp: Mail,
    color: '#F472B6',
    title: 'AI Follow-Up Sequences',
    subtitle: 'Personalized messages — not templates',
    desc: 'When Maria inquires about the BMW X5, the AI writes a personalized 4-step follow-up sequence — not a generic template. Hour 4: warm confirmation. Hour 24: the vehicle is still available. Day 3: here are 2 similar options. Day 7: graceful close. Each message references her specific vehicle and sounds like your salesperson wrote it.',
    followupStages: true,
  },
  {
    key: 'reviews',
    IconComp: Star,
    color: '#D4AF37',
    title: 'AI Review Response',
    subtitle: 'Respond to every Google review in your voice',
    desc: 'Customer leaves a 5-star review? AI drafts a warm, personalized response in seconds. 3-star review? AI acknowledges the concern and offers to make it right. You approve with one tap. Dealers who respond to every review convert 88% more leads — now you can do it without spending 30 minutes a day.',
    stats: ['Auto-drafts responses', 'Matches your voice', 'One-tap approve'],
  },
];

function AiCard({ feat }) {
  const { IconComp, color, title, subtitle, desc, stats, competitor, demo, beforeAfter, scoreboard, followupStages } = feat;
  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.025)', border: `1px solid ${color}28`,
        borderRadius: 16, padding: 36, display: 'flex', flexDirection: 'column',
        transition: 'border-color 0.2s, background 0.2s', height: '100%',
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = `${color}55`; e.currentTarget.style.background = `${color}08`; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = `${color}28`; e.currentTarget.style.background = 'rgba(255,255,255,0.025)'; }}
    >
      {/* header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 20 }}>
        <div style={{
          width: 48, height: 48, borderRadius: 12, flexShrink: 0,
          background: `${color}18`, border: `1px solid ${color}33`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <IconComp size={22} color={color} />
        </div>
        <div>
          <h3 style={{
            fontFamily: "var(--font-cormorant), serif",
            fontSize: 26, fontWeight: 700, color: TEXT, lineHeight: 1.1, marginBottom: 5,
          }}>{title}</h3>
          <p style={{ fontSize: 13, color, fontWeight: 600, letterSpacing: '0.02em' }}>{subtitle}</p>
        </div>
      </div>

      {/* description */}
      <p style={{ fontSize: 14.5, color: '#b0a890', lineHeight: 1.72, marginBottom: 20 }}>{desc}</p>

      {/* stats row */}
      {stats && (
        <div style={{
          display: 'flex', marginBottom: 20,
          background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 10, overflow: 'hidden',
        }}>
          {stats.map((s, i) => (
            <div key={s} style={{
              flex: 1, padding: '12px 10px', textAlign: 'center',
              borderRight: i < stats.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
            }}>
              <span style={{ fontSize: 12, color: GOLD, fontWeight: 700, display: 'block', lineHeight: 1.45 }}>{s}</span>
            </div>
          ))}
        </div>
      )}

      {/* demo link */}
      {demo && (
        <div style={{ marginBottom: 16 }}>
          <a href={demo} style={{
            fontSize: 13, color, fontWeight: 700, textDecoration: 'none',
            display: 'inline-flex', alignItems: 'center', gap: 6,
            transition: 'opacity 0.2s',
          }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.75'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            Try it on the demo site <ArrowRight size={13} />
          </a>
        </div>
      )}

      {/* before / after */}
      {beforeAfter && (
        <div style={{ marginBottom: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ background: '#160808', border: '1px solid #FF444420', borderRadius: 8, padding: '14px 16px' }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#FF7070', marginBottom: 6 }}>Before</div>
            <p style={{ fontSize: 13, color: '#7a6860', lineHeight: 1.55 }}>2023 BMW X5. Well maintained. Low miles. Must see.</p>
          </div>
          <div style={{ background: '#071310', border: '1px solid #4ADE8020', borderRadius: 8, padding: '14px 16px' }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#4ADE80', marginBottom: 6 }}>After (AI Generated)</div>
            <p style={{ fontSize: 13, color: '#90b07a', lineHeight: 1.55 }}>One-owner 2023 BMW X5 with the M Sport package, panoramic roof, and just 28K highway miles. Finished in Alpine White over Black leather. Passed our 150-point inspection — this spec doesn&rsquo;t come up often.</p>
          </div>
        </div>
      )}

      {/* lead scoreboard */}
      {scoreboard && (
        <div style={{
          marginBottom: 16, background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, overflow: 'hidden',
        }}>
          {[
            { emoji: '🔥', name: 'Maria R.', score: 92, detail: 'Completed Build Your Deal, pre-approved', scoreColor: '#FF5B5B' },
            { emoji: '🟡', name: 'James T.', score: 65, detail: 'Viewed 3 SUVs, used calculator', scoreColor: '#FBBF24' },
            { emoji: '⚪', name: 'Sarah K.', score: 35, detail: 'Browsed inventory, bounced quickly', scoreColor: '#6b7280' },
          ].map((l, i) => (
            <div key={l.name} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '13px 16px',
              borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.04)' : 'none',
            }}>
              <span style={{ fontSize: 16 }}>{l.emoji}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: TEXT }}>{l.name}</div>
                <div style={{ fontSize: 11.5, color: MUTED, marginTop: 2 }}>{l.detail}</div>
              </div>
              <div style={{
                fontFamily: "var(--font-cormorant), serif",
                fontSize: 22, fontWeight: 700, color: l.scoreColor, flexShrink: 0,
              }}>{l.score}<span style={{ fontSize: 12, color: MUTED }}>/100</span></div>
            </div>
          ))}
        </div>
      )}

      {/* follow-up stage previews */}
      {followupStages && (
        <div style={{ marginBottom: 16, display: 'flex', flexDirection: 'column', gap: 7 }}>
          {[
            ['4h',    "Hi Maria, it's Carlos from Primo. Got your inquiry on the X5 — it's a great pick..."],
            ['24h',   'Quick update — the BMW X5 is still available. Happy to hold it with a deposit...'],
            ['Day 3', "Hey Maria, we just got a 2024 Audi Q5 that's similar to the X5 you liked..."],
            ['Day 7', "Maria, just wanted to follow up one last time. If timing isn't right, no worries..."],
          ].map(([stage, text]) => (
            <div key={stage} style={{
              background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 8, padding: '10px 14px', display: 'flex', gap: 12, alignItems: 'flex-start',
            }}>
              <span style={{
                fontSize: 10, fontWeight: 700, letterSpacing: '0.1em',
                textTransform: 'uppercase', color: '#F472B6',
                background: '#F472B614', border: '1px solid #F472B630',
                borderRadius: 4, padding: '3px 8px', flexShrink: 0, marginTop: 1,
              }}>{stage}</span>
              <span style={{ fontSize: 12.5, color: '#9a8878', lineHeight: 1.5 }}>{text}</span>
            </div>
          ))}
          <div style={{ fontSize: 12, color: GOLD, fontWeight: 700, marginTop: 4 }}>
            ~$0.004 per full sequence — pennies, not dollars
          </div>
        </div>
      )}

      {/* competitor note */}
      {competitor && (
        <div style={{
          marginTop: 'auto', paddingTop: 16,
          borderTop: '1px solid rgba(255,255,255,0.06)',
          fontSize: 12.5, color: '#7a7060', fontStyle: 'italic', lineHeight: 1.55,
        }}>
          <span style={{ color: GOLD, fontWeight: 700, fontStyle: 'normal' }}>💰 </span>
          {competitor}
        </div>
      )}
    </div>
  );
}

function AiSavingsTable() {
  const rows = [
    ['DriveCentric AI Responder',         '$500/mo'],
    ['VinSolutions Lead Scoring',          '$300/mo'],
    ['vAuto Price Intelligence',           '$500/mo'],
    ['BDC Staff (replaced by AI Agent)',   '$3,000–5,000/mo'],
  ];
  return (
    <div style={{
      marginTop: 64, padding: '48px 40px',
      background: `${GOLD}06`, border: `1px solid ${GOLD}28`,
      borderRadius: 16, textAlign: 'center',
    }}>
      <h3 style={{
        fontFamily: "var(--font-cormorant), serif",
        fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 700,
        color: TEXT, marginBottom: 12,
      }}>6 AI Agents. Zero Extra Cost.</h3>
      <p style={{
        fontSize: 16, color: MUTED, lineHeight: 1.65,
        marginBottom: 40, maxWidth: 580, marginLeft: 'auto', marginRight: 'auto',
      }}>
        DriveCentric, VinSolutions, and vAuto charge $500–1,500/mo <em>each</em> for individual AI features.
        AutoRival.ai includes all 6 in every plan.
      </p>

      <div style={{ maxWidth: 660, margin: '0 auto' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr auto auto',
          gap: 16, padding: '8px 20px', marginBottom: 6,
          fontSize: 10, fontWeight: 700, letterSpacing: '0.18em',
          textTransform: 'uppercase', color: MUTED,
        }}>
          <span style={{ textAlign: 'left' }}>Competitor Feature</span>
          <span style={{ textAlign: 'right' }}>Their Price</span>
          <span style={{ textAlign: 'right' }}>AutoRival.ai</span>
        </div>

        {rows.map(([label, price], i) => (
          <div key={label} style={{
            display: 'grid', gridTemplateColumns: '1fr auto auto',
            gap: 16, padding: '13px 20px', alignItems: 'center',
            background: i % 2 === 0 ? 'rgba(255,255,255,0.025)' : 'transparent',
            borderRadius: 8,
          }}>
            <span style={{ fontSize: 14, color: '#c0b8a0', textAlign: 'left' }}>{label}</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#FF8080', textAlign: 'right', whiteSpace: 'nowrap' }}>{price}</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#4ADE80', textAlign: 'right', whiteSpace: 'nowrap' }}>✅ Included</span>
          </div>
        ))}

        <div style={{
          display: 'grid', gridTemplateColumns: '1fr auto auto',
          gap: 16, padding: '16px 20px', marginTop: 10,
          borderTop: `2px solid ${GOLD}30`, alignItems: 'center',
        }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: TEXT, textAlign: 'left' }}>Total savings</span>
          <span style={{
            fontFamily: "var(--font-cormorant), serif",
            fontSize: 22, fontWeight: 700, color: '#FF8080', textAlign: 'right', whiteSpace: 'nowrap',
          }}>$4,300–6,300/mo</span>
          <span style={{
            fontFamily: "var(--font-cormorant), serif",
            fontSize: 22, fontWeight: 700, color: GOLD, textAlign: 'right', whiteSpace: 'nowrap',
          }}>$0/mo</span>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Page
═══════════════════════════════════════════════════════════ */
export default function PrimoFeaturesPage() {
  const [activeGroup, setActiveGroup] = useState('inventory');

  return (
    <div className={`${cormorant.variable} ${dmSans.variable}`} style={{ background: BG, minHeight: '100vh', overflowX: 'hidden', fontFamily: "var(--font-dm-sans), sans-serif", color: TEXT }}>
      <FontStyles />

      {/* ─── HERO ──────────────────────────────────────────── */}
      <section style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        justifyContent: 'center', position: 'relative', overflow: 'hidden', padding: '80px 0',
      }}>
        {/* grid texture */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: `linear-gradient(${GOLD}09 1px, transparent 1px), linear-gradient(90deg, ${GOLD}09 1px, transparent 1px)`,
          backgroundSize: '64px 64px',
        }} />
        {/* radial glow */}
        <div style={{
          position: 'absolute', top: '35%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 900, height: 900, pointerEvents: 'none',
          background: `radial-gradient(circle, ${GOLD}16 0%, transparent 68%)`,
        }} />

        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
          <FadeSection>
            <div style={{
              display: 'inline-block', padding: '6px 18px',
              border: `1px solid ${GOLD}44`, borderRadius: 100,
              fontSize: 11, fontWeight: 700, letterSpacing: '0.18em',
              textTransform: 'uppercase', color: GOLD, marginBottom: 36,
            }}>
              Full-Platform Dealership Software · $249/mo
            </div>
          </FadeSection>

          <FadeSection delay={0.1}>
            <h1 style={{
              fontFamily: "var(--font-cormorant), serif",
              fontSize: 'clamp(54px, 9vw, 100px)',
              fontWeight: 700, lineHeight: 0.97, color: TEXT,
              marginBottom: 36, maxWidth: 820,
            }}>
              Stop paying{' '}
              <span style={{ color: GOLD }}>$1,800/mo</span>
              {' '}for&nbsp;less
            </h1>
          </FadeSection>

          <FadeSection delay={0.2}>
            <p style={{ fontSize: 19, color: MUTED, lineHeight: 1.65, maxWidth: 560, marginBottom: 52 }}>
              AutoRival.ai gives independent car dealers a complete digital platform — custom website, dealer admin panel, CRM, F&I tracking, reputation management, and more — at a price that finally makes sense.
            </p>
          </FadeSection>

          <FadeSection delay={0.3}>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center' }}>
              <a href="/samples/primo-admin"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 10,
                  padding: '15px 30px', background: GOLD, color: '#080808',
                  fontWeight: 700, fontSize: 15, borderRadius: 6, textDecoration: 'none',
                  letterSpacing: '0.03em', transition: 'background 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = GOLD2}
                onMouseLeave={e => e.currentTarget.style.background = GOLD}
              >
                See Live Admin Demo <ArrowRight size={16} />
              </a>
              <a href="#features"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 10,
                  padding: '15px 30px', border: `1px solid ${GOLD}44`, color: TEXT,
                  fontWeight: 500, fontSize: 15, borderRadius: 6, textDecoration: 'none',
                  background: 'transparent', transition: 'border-color 0.2s, color 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = GOLD; e.currentTarget.style.color = GOLD; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = `${GOLD}44`; e.currentTarget.style.color = TEXT; }}
              >
                View All Features <ChevronDown size={16} />
              </a>
            </div>
          </FadeSection>

          {/* stat strip */}
          <FadeSection delay={0.45}>
            <div style={{
              display: 'flex', gap: 48, marginTop: 76, paddingTop: 52,
              borderTop: `1px solid ${GOLD}20`, flexWrap: 'wrap',
            }}>
              {[
                { val: '$249', label: 'per month, all-in' },
                { val: '40+', label: 'features included' },
                { val: '5–7', label: 'days to go live' },
                { val: '90+', label: 'PageSpeed score' },
              ].map(s => (
                <div key={s.val}>
                  <div style={{
                    fontFamily: "var(--font-cormorant), serif",
                    fontSize: 46, fontWeight: 700, color: GOLD, lineHeight: 1, marginBottom: 6,
                  }}>{s.val}</div>
                  <div style={{ fontSize: 13, color: MUTED, fontWeight: 500 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </FadeSection>
        </div>
      </section>

      {/* ─── COST COMPARISON ──────────────────────────────── */}
      <SectionWrap id="pricing" bg={BG2}>
        <FadeSection>
          <Label>The Real Cost of Doing Nothing</Label>
          <Heading sub="Most independent dealers spend $1,299–$1,800/month on software that does less — and still need a separate website on top of that.">
            What are you actually paying for?
          </Heading>
        </FadeSection>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
          {/* Traditional */}
          <FadeSection delay={0.1}>
            <div style={{
              background: '#180a0a', border: '1px solid #FF444428',
              borderRadius: 12, padding: 32,
            }}>
              <p style={{
                fontSize: 11, fontWeight: 700, letterSpacing: '0.2em',
                textTransform: 'uppercase', color: '#FF7070', marginBottom: 24,
              }}>Typical Independent Dealer Setup</p>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {[
                  ['DMS / Inventory Software',    '$499–$799/mo'],
                  ['Dealership Website',           '$300–$600/mo'],
                  ['Lead Management CRM',          '$299–$500/mo'],
                  ['Reputation Management',        '$199–$300/mo'],
                  ['AutoTrader / Cars.com listings','$300–$800/mo'],
                ].map(([item, price]) => (
                  <div key={item} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '13px 0', borderBottom: '1px solid #ffffff08',
                  }}>
                    <span style={{ fontSize: 14, color: '#b8a898' }}>{item}</span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: '#FF8080' }}>{price}</span>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: 20, marginTop: 8 }}>
                  <span style={{ fontSize: 16, fontWeight: 700 }}>Total</span>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{
                      fontFamily: "var(--font-cormorant), serif",
                      fontSize: 32, fontWeight: 700, color: '#FF7070',
                    }}>$1,597–$3,000</span>
                    <span style={{ fontSize: 14, color: '#FF7070' }}>/mo</span>
                  </div>
                </div>
              </div>
            </div>
          </FadeSection>

          {/* AIandWEBservices */}
          <FadeSection delay={0.2}>
            <div style={{
              background: '#080f07', border: `1px solid ${GOLD}55`,
              borderRadius: 12, padding: 32, position: 'relative', overflow: 'hidden',
              boxShadow: `0 0 48px ${GOLD}18, 0 0 96px ${GOLD}0a`,
            }}>
              <div style={{
                position: 'absolute', top: 0, right: 0,
                background: GOLD, color: '#080808',
                fontSize: 10, fontWeight: 800, letterSpacing: '0.12em',
                textTransform: 'uppercase', padding: '6px 16px',
                borderRadius: '0 12px 0 12px',
              }}>Best Value</div>

              <p style={{
                fontSize: 11, fontWeight: 700, letterSpacing: '0.2em',
                textTransform: 'uppercase', color: GOLD, marginBottom: 24,
              }}>AutoRival.ai — Everything Included</p>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {[
                  'Custom dealership website',
                  'Full dealer admin panel',
                  'CRM & lead management',
                  'Reputation management',
                  'F&I tracking & deal builder',
                  'Service appointment scheduling',
                  'Market pricing intelligence',
                  'Reservation / deposit system',
                ].map(item => (
                  <div key={item} style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '11px 0', borderBottom: '1px solid #ffffff08',
                  }}>
                    <div style={{
                      width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                      background: `${GOLD}22`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Check size={11} color={GOLD} strokeWidth={3} />
                    </div>
                    <span style={{ fontSize: 14, color: '#ccc4a8' }}>{item}</span>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: 20, marginTop: 8 }}>
                  <span style={{ fontSize: 16, fontWeight: 700 }}>All-In Total</span>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{
                      fontFamily: "var(--font-cormorant), serif",
                      fontSize: 44, fontWeight: 700, color: GOLD, lineHeight: 1,
                    }}>$249<span style={{ fontSize: 20, fontWeight: 500 }}>/mo</span></div>
                    <div style={{ fontSize: 12, color: '#4ADE80', fontWeight: 700, marginTop: 5 }}>
                      Save $12,000–$32,000 per year
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </FadeSection>
        </div>
      </SectionWrap>

      {/* ─── AI FEATURES ─────────────────────────────────── */}
      <section id="ai-features" style={{
        padding: '96px 0',
        background: 'linear-gradient(180deg, #0a0a0a 0%, #111111 100%)',
        borderTop: `1px solid ${GOLD}18`,
        borderBottom: `1px solid ${GOLD}18`,
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>
          <FadeSection>
            <Label>6 AI Agents Included</Label>
            <div style={{ marginBottom: 52 }}>
              <h2 style={{
                fontFamily: "var(--font-cormorant), serif",
                fontSize: 'clamp(36px, 5vw, 58px)',
                fontWeight: 700, lineHeight: 1.05, color: TEXT, marginBottom: 18,
              }}>🤖 AI Built Into Every Feature</h2>
              <p style={{ fontSize: 18, color: MUTED, lineHeight: 1.65, maxWidth: 640 }}>
                Your competitors are paying $500+/mo for basic automation.{' '}
                <span style={{ color: GOLD, fontWeight: 700 }}>AutoRival.ai</span> includes{' '}
                <span style={{ color: GOLD, fontWeight: 700 }}>6 AI agents</span> at no extra cost.
              </p>
            </div>
          </FadeSection>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))',
            gap: 28,
          }}>
            {AI_FEATURES.map((feat, i) => (
              <FadeSection key={feat.key} delay={i * 0.07}>
                <AiCard feat={feat} />
              </FadeSection>
            ))}
          </div>

          <FadeSection delay={0.35}>
            <AiSavingsTable />
          </FadeSection>
        </div>
      </section>

      {/* ─── FEATURE GRID ─────────────────────────────────── */}
      <SectionWrap id="features">
        <FadeSection>
          <Label>40+ Features</Label>
          <Heading sub="Everything your dealership needs — built into one platform, not bolted together from five vendors.">
            The complete platform
          </Heading>
        </FadeSection>

        {/* Category tabs */}
        <FadeSection delay={0.1}>
          <div style={{
            display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 36,
            padding: 4, background: '#ffffff06', borderRadius: 10, border: '1px solid #ffffff0a',
          }}>
            {FEATURE_GROUPS.map(g => {
              const Icon = g.icon;
              const on = activeGroup === g.key;
              return (
                <button key={g.key} onClick={() => setActiveGroup(g.key)} style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '10px 18px', borderRadius: 8, cursor: 'pointer',
                  fontSize: 13, fontWeight: 600,
                  fontFamily: "var(--font-dm-sans), sans-serif",
                  transition: 'all 0.2s',
                  background: on ? `${g.color}22` : 'transparent',
                  color: on ? g.color : MUTED,
                  border: `1px solid ${on ? g.color + '44' : 'transparent'}`,
                }}>
                  <Icon size={14} />
                  {g.label}
                </button>
              );
            })}
          </div>
        </FadeSection>

        {/* Feature cards */}
        {FEATURE_GROUPS.filter(g => g.key === activeGroup).map(g => (
          <div key={g.key} style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 14,
          }}>
            {g.features.map((feat, i) => (
              <FadeSection key={feat} delay={i * 0.04}>
                <div style={{
                  display: 'flex', alignItems: 'flex-start', gap: 14,
                  padding: '18px 20px',
                  background: PANEL, border: `1px solid ${g.color}22`,
                  borderRadius: 10, transition: 'border-color 0.2s, background 0.2s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = `${g.color}55`; e.currentTarget.style.background = `${g.color}0a`; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = `${g.color}22`; e.currentTarget.style.background = PANEL; }}
                >
                  <div style={{
                    width: 22, height: 22, borderRadius: 6, flexShrink: 0,
                    background: `${g.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 1,
                  }}>
                    <Check size={11} color={g.color} strokeWidth={3} />
                  </div>
                  <span style={{ fontSize: 14, color: '#ccc4a8', lineHeight: 1.55 }}>{feat}</span>
                </div>
              </FadeSection>
            ))}
          </div>
        ))}

        <FadeSection delay={0.25}>
          <div style={{
            marginTop: 36, padding: '18px 24px',
            background: `${GOLD}0a`, border: `1px solid ${GOLD}22`,
            borderRadius: 10, display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', flexWrap: 'wrap', gap: 14,
          }}>
            <span style={{ fontSize: 14, color: MUTED }}>
              Showing 10 of 40+ features · Select a category above to explore more
            </span>
            <a href="/samples/primo-admin" style={{
              fontSize: 13, fontWeight: 700, color: GOLD, textDecoration: 'none',
              display: 'inline-flex', alignItems: 'center', gap: 7,
            }}>
              Try the live admin demo <ArrowRight size={14} />
            </a>
          </div>
        </FadeSection>
      </SectionWrap>

      {/* ─── TESTIMONIALS ─────────────────────────────────── */}
      <SectionWrap id="testimonials" bg={BG2}>
        <FadeSection>
          <Label>What Dealers Are Saying</Label>
          <Heading>Real dealers. Real results.</Heading>
        </FadeSection>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 22 }}>
          {TESTIMONIALS.map((t, i) => (
            <FadeSection key={t.name} delay={i * 0.12}>
              <div style={{
                padding: 32, background: PANEL, border: `1px solid ${GOLD}22`,
                borderRadius: 12, height: '100%', display: 'flex', flexDirection: 'column',
                transition: 'border-color 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor = `${GOLD}55`}
                onMouseLeave={e => e.currentTarget.style.borderColor = `${GOLD}22`}
              >
                <Stars />
                <p style={{
                  fontSize: 15, color: '#c0b8a0', lineHeight: 1.75,
                  fontStyle: 'italic', flex: 1, marginBottom: 24,
                }}>
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15, color: TEXT }}>{t.name}</div>
                  <div style={{ fontSize: 12, color: MUTED, marginTop: 3 }}>{t.title} · {t.dealership}</div>
                </div>
              </div>
            </FadeSection>
          ))}
        </div>
      </SectionWrap>

      {/* ─── HOW IT WORKS ─────────────────────────────────── */}
      <SectionWrap id="how-it-works">
        <FadeSection>
          <Label>Simple Onboarding</Label>
          <Heading sub="We handle the heavy lifting. You're live and closing deals in under a week.">
            How it works
          </Heading>
        </FadeSection>

        <div>
          {STEPS.map((step, i) => (
            <FadeSection key={step.num} delay={i * 0.15}>
              <div style={{
                display: 'grid', gridTemplateColumns: '120px 1fr', gap: 32,
                padding: '44px 0',
                borderBottom: i < STEPS.length - 1 ? '1px solid #ffffff0a' : 'none',
                alignItems: 'start',
              }}>
                <div style={{
                  fontFamily: "var(--font-cormorant), serif",
                  fontSize: 76, fontWeight: 700, color: `${GOLD}30`,
                  lineHeight: 1, userSelect: 'none',
                }}>{step.num}</div>
                <div>
                  <h3 style={{
                    fontFamily: "var(--font-cormorant), serif",
                    fontSize: 28, fontWeight: 700, color: TEXT,
                    marginBottom: 12, lineHeight: 1.2,
                  }}>{step.title}</h3>
                  <p style={{ fontSize: 15, color: MUTED, lineHeight: 1.7, maxWidth: 580 }}>{step.desc}</p>
                </div>
              </div>
            </FadeSection>
          ))}
        </div>
      </SectionWrap>

      {/* ─── CTA ──────────────────────────────────────────── */}
      <section style={{
        padding: '120px 0',
        background: `linear-gradient(150deg, ${BG2} 0%, #0e0b04 50%, ${BG2} 100%)`,
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 700, height: 700, pointerEvents: 'none',
          background: `radial-gradient(circle, ${GOLD}15 0%, transparent 68%)`,
        }} />
        <div style={{ maxWidth: 680, margin: '0 auto', padding: '0 24px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <FadeSection>
            <Label>Ready to modernize?</Label>
            <h2 style={{
              fontFamily: "var(--font-cormorant), serif",
              fontSize: 'clamp(40px, 6vw, 68px)',
              fontWeight: 700, lineHeight: 1.08, color: TEXT, marginBottom: 24,
            }}>
              Let&rsquo;s build your dealership&rsquo;s digital edge
            </h2>
            <p style={{ fontSize: 17, color: MUTED, lineHeight: 1.65, marginBottom: 52 }}>
              Talk to David about getting your dealership website and admin panel live in under a week. No long-term contracts. No setup fees. Cancel anytime.
            </p>
          </FadeSection>

          <FadeSection delay={0.15}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center' }}>
                <a href="tel:3155720710" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 10,
                  padding: '16px 32px', background: GOLD,
                  color: '#080808', fontWeight: 800, fontSize: 16,
                  borderRadius: 6, textDecoration: 'none', letterSpacing: '0.02em',
                  transition: 'background 0.2s',
                }}
                  onMouseEnter={e => e.currentTarget.style.background = GOLD2}
                  onMouseLeave={e => e.currentTarget.style.background = GOLD}
                >
                  <Phone size={18} />
                  (315) 572-0710
                </a>
                <a href="mailto:david@aiandwebservices.com" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 10,
                  padding: '16px 32px', border: `1px solid ${GOLD}55`,
                  color: TEXT, fontWeight: 500, fontSize: 15,
                  borderRadius: 6, textDecoration: 'none', background: 'transparent',
                  transition: 'border-color 0.2s',
                }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = GOLD}
                  onMouseLeave={e => e.currentTarget.style.borderColor = `${GOLD}55`}
                >
                  <Mail size={16} />
                  david@aiandwebservices.com
                </a>
              </div>

              <div style={{ display: 'flex', gap: 28, marginTop: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
                {[
                  { href: '/samples/primo-admin', icon: LayoutDashboard, label: 'View Admin Panel Demo' },
                  { href: '/samples/example005', icon: Globe, label: 'See Sample Website' },
                ].map(({ href, icon: Icon, label }) => (
                  <a key={href} href={href} style={{
                    fontSize: 13, color: MUTED, textDecoration: 'none',
                    display: 'inline-flex', alignItems: 'center', gap: 7,
                    transition: 'color 0.2s',
                  }}
                    onMouseEnter={e => e.currentTarget.style.color = GOLD}
                    onMouseLeave={e => e.currentTarget.style.color = MUTED}
                  >
                    <Icon size={14} /> {label}
                  </a>
                ))}
              </div>
            </div>
          </FadeSection>
        </div>
      </section>

      {/* ─── FOOTER ───────────────────────────────────────── */}
      <footer style={{ padding: '28px 24px', borderTop: `1px solid ${GOLD}14`, textAlign: 'center' }}>
        <p style={{ fontSize: 13, color: MUTED }}>
          © 2025 AIandWEBservices &nbsp;·&nbsp;
          <a href="tel:3155720710" style={{ color: MUTED, textDecoration: 'none' }}>(315) 572-0710</a>
          &nbsp;·&nbsp;
          <a href="mailto:david@aiandwebservices.com" style={{ color: MUTED, textDecoration: 'none' }}>david@aiandwebservices.com</a>
        </p>
      </footer>

      {/* ─── FLOATING CTA ─────────────────────────────────── */}
      {/*
        To add a "Dealer? See All Features" button on /samples/example005,
        paste this block at the bottom of that page's JSX (before closing </div>):

        <a href="/samples/primo-features" style={{
          position: 'fixed', bottom: 32, right: 32, zIndex: 50,
          display: 'inline-flex', alignItems: 'center', gap: 10,
          padding: '13px 22px', background: '#D4AF37', color: '#080808',
          fontWeight: 700, fontSize: 14, borderRadius: 100,
          textDecoration: 'none', whiteSpace: 'nowrap',
          boxShadow: '0 8px 32px #D4AF3744',
        }}>
          Dealer? See All Features →
        </a>
      */}
      <a href="/samples/primo-features"
        style={{
          position: 'fixed', bottom: 32, right: 32, zIndex: 50,
          display: 'inline-flex', alignItems: 'center', gap: 10,
          padding: '13px 22px', background: GOLD, color: '#080808',
          fontWeight: 800, fontSize: 13, borderRadius: 100,
          textDecoration: 'none', whiteSpace: 'nowrap',
          letterSpacing: '0.02em',
          boxShadow: `0 8px 32px ${GOLD}44`,
          transition: 'transform 0.2s, box-shadow 0.2s',
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = `0 12px 40px ${GOLD}66`; }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = `0 8px 32px ${GOLD}44`; }}
      >
        <LayoutDashboard size={15} />
        View Admin Demo
      </a>
    </div>
  );
}
