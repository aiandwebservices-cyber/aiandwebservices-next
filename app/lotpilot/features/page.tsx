import type { Metadata } from 'next';
import { Fragment } from 'react';
import Link from 'next/link';
import AnimatedSection from '../components/AnimatedSection';
import CTASection from '../components/CTASection';
import HeadToHeadBars from '../components/HeadToHeadBars';
import CostStack from '../components/CostStack';
import {
  SalesIcon,
  DescriptionIcon,
  ScorerIcon,
  PriceIcon,
  FollowUpIcon,
  ReviewIcon,
  CrmIcon,
  FniIcon,
  InventoryIcon,
  SiteIcon,
  DashIcon,
  AutomationIcon,
  SyndicationIcon,
  AnalyticsIcon,
} from '../components/AgentIcons';

export const metadata: Metadata = {
  title: 'Features — LotPilot.ai',
  description:
    '6 AI agents, full dealer website, complete CRM — one platform replacing $2,800/mo of dealer software stacks.',
};

const AGENTS = [
  {
    Icon: SalesIcon,
    name: '24/7 AI Sales Agent',
    bullets: [
      'Answers every customer in under 3 seconds — chat or SMS',
      'Knows your full inventory, financing, hours, and policies',
      'Captures every lead with qualifying questions tuned to your dealership',
      'Hands off to a human the second a customer asks',
    ],
  },
  {
    Icon: DescriptionIcon,
    name: 'AI Vehicle Descriptions',
    bullets: [
      'Generates SEO-rich VDP copy from VIN + a few photos',
      'Bulk-rewrites your entire lot in one click',
      'Highlights the actual selling points — not generic specs',
      'Keeps a consistent voice across every listing',
    ],
    reverse: true,
  },
  {
    Icon: ScorerIcon,
    name: 'AI Lead Scoring',
    bullets: [
      'Ranks every lead 0–100 by purchase intent',
      'Pulls signals from chat content, urgency words, response patterns',
      'Surfaces hot leads at the top of your queue automatically',
      'No fluffy "AI magic" — math you can audit',
    ],
  },
  {
    Icon: PriceIcon,
    name: 'AI Pricing Intelligence',
    bullets: [
      'Days-on-lot, regional comps, and your margin floor — together',
      'Suggests price drops before a unit goes stale',
      'Flags vehicles leaving money on the table',
      'You stay in control — every change is a recommendation, not a default',
    ],
    reverse: true,
  },
  {
    Icon: FollowUpIcon,
    name: 'AI Follow-Up Sequences',
    bullets: [
      '4-stage sequences personalized to the actual conversation',
      'Day 1, Day 3, Day 7, Day 14 — with vehicle context, not templates',
      'Drafts in your dealership’s voice — approve or send instantly',
      'Stops the moment the customer responds',
    ],
  },
  {
    Icon: ReviewIcon,
    name: 'AI Review Response',
    bullets: [
      'Drafts professional Google review responses in your voice',
      'Handles 5-stars and 1-stars with appropriate tone',
      'Flags reviews that need a manager — never auto-posts those',
      'Works across multiple locations from one dashboard',
    ],
    reverse: true,
  },
];

const PLATFORM = [
  { Icon: SiteIcon,        name: 'Custom Dealership Website',   desc: 'A fast, modern dealer site that updates the second you change inventory. SEO baked in, mobile-first, dark/light mode.' },
  { Icon: CrmIcon,         name: 'Admin Panel + CRM',           desc: 'Contacts, leads, conversations, deals — built for vehicle sales, not retrofitted from generic CRM.' },
  { Icon: InventoryIcon,   name: 'Inventory Management',        desc: 'VIN decoder, NHTSA data, photo gallery, bulk imports, status workflows. Cars in. Cars out. Clean.' },
  { Icon: FniIcon,         name: 'Deal Builder + F&I',          desc: 'Deal jacket, profit-matrix desking, payment calculator, lender forms. Stripe deposits and document generation.' },
  { Icon: AutomationIcon,  name: 'n8n Automation Workflows',    desc: 'Route leads, trigger texts, sync inventory. No-code workflows, no consultants, no per-zap fees.' },
  { Icon: SyndicationIcon, name: 'Listing Syndication',         desc: 'Push inventory to AutoTrader, Cars.com, CarGurus, Facebook. One source of truth, automatic feeds.' },
  { Icon: DashIcon,        name: 'Reputation Management',       desc: 'Google reviews monitoring + AI response drafts. CARFAX and AutoCheck badges built into your VDPs.' },
  { Icon: AnalyticsIcon,   name: 'Analytics + Reporting',       desc: 'Source attribution, agent performance, lead-to-sold funnel — clear, exportable, honest.' },
];

const HEAD_TO_HEAD = [
  { label: 'DealerOn + vAuto + VinSolutions', price: '$2,799/mo', numeric: 2799 },
  { label: 'Dealer.com + DealerAI',           price: '$2,150/mo', numeric: 2150 },
  { label: 'LotPilot.ai Professional',        price: '$1,199/mo', numeric: 1199, brand: true },
];

const STACK_BAD = [
  { label: 'DMS / Inventory Software',          cost: '$499–$799/mo' },
  { label: 'Dealership Website',                cost: '$300–$600/mo' },
  { label: 'Lead Management CRM',               cost: '$299–$500/mo' },
  { label: 'Reputation Management',             cost: '$199–$300/mo' },
  { label: 'AutoTrader / Cars.com listings',    cost: '$300–$800/mo' },
];

const STACK_GOOD = [
  'Custom dealership website',
  'Full dealer admin panel + CRM',
  'Lead management + F&I tracking',
  'Reputation management',
  '6 AI agents (chat, scoring, pricing, follow-up, descriptions, reviews)',
  'SMS + automation workflows',
  'Service appointment scheduling',
  'Listing syndication included',
];

type Cell = '✓' | '×' | string;

const TABLE_GROUPS: { title: string; rows: { feature: string; growth: Cell; pro: Cell; ent: Cell }[] }[] = [
  {
    title: 'Website + CRM',
    rows: [
      { feature: 'Custom dealer website',     growth: '✓', pro: '✓', ent: '✓' },
      { feature: 'Admin panel + CRM',          growth: '✓', pro: '✓', ent: '✓' },
      { feature: 'VIN decoder + NHTSA data',   growth: '✓', pro: '✓', ent: '✓' },
      { feature: 'Photo management',           growth: '✓', pro: '✓', ent: '✓' },
      { feature: 'Dark / light mode',          growth: '✓', pro: '✓', ent: '✓' },
      { feature: 'Vehicle inventory limit',    growth: '50', pro: 'Unlimited', ent: 'Unlimited' },
    ],
  },
  {
    title: 'AI Features',
    rows: [
      { feature: 'AI chat agent (website)',    growth: '✓', pro: '✓', ent: '✓' },
      { feature: 'AI description writer',      growth: '✓', pro: '✓', ent: '✓' },
      { feature: 'AI review responder',        growth: '✓', pro: '✓', ent: '✓' },
      { feature: 'AI SMS agent',               growth: 'Pro+', pro: '✓', ent: '✓' },
      { feature: 'AI lead scoring',            growth: 'Pro+', pro: '✓', ent: '✓' },
      { feature: 'AI price intelligence',      growth: 'Pro+', pro: '✓', ent: '✓' },
      { feature: 'AI follow-up sequences',     growth: 'Pro+', pro: '✓', ent: '✓' },
      { feature: 'Auto-pricing rules',         growth: 'Pro+', pro: '✓', ent: '✓' },
    ],
  },
  {
    title: 'Deal Flow + Payments',
    rows: [
      { feature: 'Basic deal builder',                 growth: '✓', pro: '✓', ent: '✓' },
      { feature: 'Advanced desking (profit matrix)',   growth: 'Pro+', pro: '✓', ent: '✓' },
      { feature: 'Stripe deposits + payments',         growth: 'Pro+', pro: '✓', ent: '✓' },
      { feature: 'Documents + forms',                  growth: 'Pro+', pro: '✓', ent: '✓' },
      { feature: 'Credit pre-qualification',           growth: 'Pro+', pro: '✓', ent: '✓' },
      { feature: 'Lender submission (RouteOne)',       growth: 'Ent', pro: 'Ent', ent: '✓' },
    ],
  },
  {
    title: 'Operations',
    rows: [
      { feature: 'Service scheduling',           growth: '✓',    pro: '✓', ent: '✓' },
      { feature: 'Salesperson assignment',       growth: 'Pro+', pro: '✓', ent: '✓' },
      { feature: 'Commission tracking',          growth: 'Pro+', pro: '✓', ent: '✓' },
      { feature: 'Recon pipeline',               growth: 'Pro+', pro: '✓', ent: '✓' },
      { feature: '150-point inspection',         growth: '✓',    pro: '✓', ent: '✓' },
      { feature: 'Listing syndication feeds',    growth: 'Pro+', pro: '✓', ent: '✓' },
      { feature: 'n8n automation workflows',     growth: 'Pro+', pro: '✓', ent: '✓' },
    ],
  },
  {
    title: 'Integrations',
    rows: [
      { feature: 'Google reviews',           growth: '✓',    pro: '✓',    ent: '✓' },
      { feature: 'CARFAX / AutoCheck badges', growth: '✓',    pro: '✓',    ent: '✓' },
      { feature: 'QuickBooks integration',   growth: 'Pro+', pro: '✓',    ent: '✓' },
      { feature: '700Credit bureau pulls',   growth: 'Ent',  pro: 'Ent',  ent: '✓' },
      { feature: 'Multi-location support',   growth: 'Ent',  pro: 'Ent',  ent: '✓' },
      { feature: 'Dedicated CRM instance',   growth: 'Ent',  pro: 'Ent',  ent: '✓' },
      { feature: 'Custom integrations + API', growth: 'Ent', pro: 'Ent',  ent: '✓' },
    ],
  },
  {
    title: 'Mobile + Apps',
    rows: [
      { feature: 'PWA installable dashboard',  growth: '✓',    pro: '✓', ent: '✓' },
      { feature: 'Mobile photo capture app',   growth: 'Pro+', pro: '✓', ent: '✓' },
      { feature: 'Push notifications',         growth: 'Pro+', pro: '✓', ent: '✓' },
      { feature: 'Owner dashboard (mobile)',   growth: 'Pro+', pro: '✓', ent: '✓' },
    ],
  },
  {
    title: 'Support',
    rows: [
      { feature: 'Email support',              growth: '✓',    pro: '✓',    ent: '✓' },
      { feature: 'Priority phone support',     growth: 'Pro+', pro: '✓',    ent: '✓' },
      { feature: 'Dedicated account manager',  growth: 'Ent',  pro: 'Ent',  ent: '✓' },
      { feature: 'SLA guarantee',              growth: 'Ent',  pro: 'Ent',  ent: '✓' },
    ],
  },
];

function renderCell(v: Cell) {
  if (v === '✓') return <td className="cell-ok">✓</td>;
  if (v === '×' || v === '—') return <td className="cell-no">—</td>;
  if (v === 'Pro+' || v === 'Ent') return <td className="cell-meta">{v}</td>;
  return <td>{v}</td>;
}

function VisualFor({ Icon }: { Icon: React.ComponentType }) {
  return (
    <div className="lp-feature-visual">
      <div style={{ color: 'var(--lp-navy)' }}>
        <Icon />
      </div>
    </div>
  );
}

export default function FeaturesPage() {
  return (
    <main>
      <section className="lp-section" style={{ paddingTop: 'clamp(120px, 14vw, 180px)' }}>
        <div className="lp-container">
          <AnimatedSection animation="fade">
            <span className="lp-eyebrow">Features</span>
            <h1>What are you actually paying for?</h1>
            <p className="lp-lead" style={{ marginTop: 20 }}>
              Most dealers spend $1,500–$3,000 a month duct-taping five vendors together.
              LotPilot replaces all of it with one platform — six AI agents included.
            </p>
          </AnimatedSection>

          <CostStack
            badTitle="Typical dealer software stack"
            badItems={STACK_BAD}
            badTotal="$1,597–$3,000/mo"
            goodTitle="LotPilot.ai Professional"
            goodPrice="$1,199"
            goodMeta="Everything below — included"
            goodItems={STACK_GOOD}
          />
        </div>
      </section>

      {/* HEAD-TO-HEAD BARS */}
      <section className="lp-section lp-section--off">
        <div className="lp-container">
          <AnimatedSection animation="fade">
            <span className="lp-eyebrow">Why dealers switch</span>
            <h2>Total monthly software cost — head-to-head</h2>
            <p className="lp-lead" style={{ marginTop: 16 }}>
              Same features. Same outcomes. A fraction of the bill.
            </p>
          </AnimatedSection>

          <HeadToHeadBars
            rows={HEAD_TO_HEAD}
            saveBig="Save $950–1,600/mo"
            saveSmall="That’s $11,400–19,200 per year switching to LotPilot.ai Professional."
          />
        </div>
      </section>

      {/* AGENT DEEP DIVES */}
      <section className="lp-section">
        <div className="lp-container">
          <AnimatedSection animation="fade">
            <span className="lp-eyebrow">AI Built In</span>
            <h2>6 AI Agents. Zero Extra Cost.</h2>
            <p className="lp-lead" style={{ marginTop: 16 }}>
              Each agent is purpose-built for dealers. No per-message fees. No add-on subscriptions.
              They&apos;re part of the platform — not bolted on.
            </p>
          </AnimatedSection>

          {AGENTS.map((a, i) => (
            <AnimatedSection
              animation="fade"
              key={a.name}
              className={`lp-feature-block ${a.reverse ? 'reverse' : ''}`}
            >
              <div>
                <span className="lp-eyebrow">Agent 0{i + 1}</span>
                <h2>{a.name}</h2>
                <ul>
                  {a.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </div>
              <VisualFor Icon={a.Icon} />
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* PLATFORM */}
      <section className="lp-section lp-section--off">
        <div className="lp-container">
          <AnimatedSection animation="fade">
            <span className="lp-eyebrow">Platform</span>
            <h2>The complete platform</h2>
            <p className="lp-lead" style={{ marginTop: 16 }}>
              Everything you need. Nothing you don&apos;t. Built from the ground up for independent
              dealers — not retrofitted from a 20-year-old CRM.
            </p>
          </AnimatedSection>

          <div className="lp-platform-grid">
            {PLATFORM.map((p, i) => (
              <AnimatedSection animation="fade" delay={i * 60} key={p.name}>
                <div className="lp-platform-card">
                  <div className="icon"><p.Icon /></div>
                  <h3>{p.name}</h3>
                  <p>{p.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* FULL FEATURE COMPARISON */}
      <section className="lp-section">
        <div className="lp-container">
          <AnimatedSection animation="fade">
            <span className="lp-eyebrow">Full Comparison</span>
            <h2>Compare every feature, side by side</h2>
            <p className="lp-lead" style={{ marginTop: 16 }}>
              Every feature, every tier. No asterisks.
            </p>
          </AnimatedSection>

          <AnimatedSection animation="fade" className="lp-table-wrap">
            <table className="lp-table-v2">
              <thead>
                <tr>
                  <th>Feature</th>
                  <th>Growth<span className="tier-price">$699/mo</span></th>
                  <th className="featured">Professional<span className="tier-price">$1,199/mo</span></th>
                  <th>Enterprise<span className="tier-price">$1,799/mo</span></th>
                </tr>
              </thead>
              <tbody>
                {TABLE_GROUPS.map((g) => (
                  <Fragment key={g.title}>
                    <tr className="group-row">
                      <td colSpan={4}>{g.title}</td>
                    </tr>
                    {g.rows.map((r) => (
                      <tr key={r.feature}>
                        <td>{r.feature}</td>
                        {renderCell(r.growth)}
                        {renderCell(r.pro)}
                        {renderCell(r.ent)}
                      </tr>
                    ))}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </AnimatedSection>

          <AnimatedSection animation="fade" delay={150}>
            <p
              style={{
                marginTop: 32,
                textAlign: 'center',
                fontSize: 14,
                color: 'var(--lp-muted)',
              }}
            >
              <strong style={{ color: 'var(--lp-red)' }}>Pro+</strong> = available on Professional and Enterprise.
              {' '}
              <strong style={{ color: 'var(--lp-red)' }}>Ent</strong> = Enterprise only.
              {' '}
              <Link href="/lotpilot/pricing" style={{ color: 'var(--lp-red)', fontWeight: 700 }}>
                See full pricing →
              </Link>
            </p>
          </AnimatedSection>
        </div>
      </section>

      <CTASection
        heading="See it for yourself"
        sub="Book a 15-minute walkthrough. We'll show you every agent, live, on real inventory."
      />
    </main>
  );
}
