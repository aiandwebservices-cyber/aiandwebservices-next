'use client';
import { motion } from 'framer-motion';
import { Mail, TrendingUp, FileText } from 'lucide-react';
import { getTier } from '@/lib/pricing';
import { growthContent as c } from '@/content/tiers/growth';
import ServicePageTemplate from '@/components/ServicePageTemplate';

const STATS = [
  { icon: FileText,   val: 2,   suf: '/mo',    label: 'SEO articles published every month' },
  { icon: Mail,       val: 7,   pre: 'Up to ',  suf: ' emails', label: 'Welcome sequence to nurture every lead' },
  { icon: TrendingUp, val: 24,  suf: '/7',      label: 'AI automation qualifying leads around the clock' },
];

function LeadFunnelMockup() {
  const steps = [
    { label: 'Visitor lands', color: '#2AA5A0', w: '100%' },
    { label: 'AI qualifies', color: '#33BDB8', w: '75%' },
    { label: 'Email nurture', color: '#3dd0ca', w: '55%' },
    { label: 'Books call', color: '#10b981', w: '38%' },
    { label: 'Becomes client', color: '#059669', w: '26%' },
  ];
  return (
    <div style={{ borderRadius: '20px', background: '#111827', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 24px 72px rgba(0,0,0,0.45)', padding: '28px', maxWidth: '400px', margin: '0 auto' }}>
      <div style={{ fontSize: '13px', fontWeight: 700, color: 'rgba(255,255,255,0.5)', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '1px' }}>Lead Funnel</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {steps.map((step, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 + i * 0.15, duration: 0.4 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
              <div style={{ fontSize: '12px', color: step.color, fontWeight: 600, width: '90px', flexShrink: 0 }}>{step.label}</div>
              <div style={{ flex: 1, height: '28px', borderRadius: '6px', background: 'rgba(255,255,255,0.04)', overflow: 'hidden' }}>
                <motion.div
                  initial={{ width: 0 }} animate={{ width: step.w }}
                  transition={{ delay: 0.8 + i * 0.15, duration: 0.6, ease: 'easeOut' }}
                  style={{ height: '100%', background: `linear-gradient(90deg,${step.color}22,${step.color}44)`, borderRadius: '6px', border: `1px solid ${step.color}44` }}
                />
              </div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', width: '32px', textAlign: 'right', flexShrink: 0 }}>{step.w}</div>
            </div>
          </motion.div>
        ))}
      </div>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2, duration: 0.5 }}
        style={{ marginTop: '20px', padding: '12px 14px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: '10px', fontSize: '13px', color: '#86efac', fontWeight: 600 }}
      >
        ✓ 2 new qualified leads booked this week
      </motion.div>
    </div>
  );
}

export default function GrowthPage() {
  const tier = getTier('growth');
  return (
    <ServicePageTemplate
      content={c}
      tier={tier}
      theme="dark"
      stats={STATS}
      heroVisual={<LeadFunnelMockup />}
      prevTier={{ slug: 'presence', name: 'Presence' }}
      nextTier={{ slug: 'revenue-engine', name: 'Revenue Engine' }}
    />
  );
}
