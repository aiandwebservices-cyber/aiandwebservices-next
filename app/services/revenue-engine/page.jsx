'use client';
import { motion } from 'framer-motion';
import { GitBranch, Brain, DollarSign } from 'lucide-react';
import { getTier } from '@/lib/pricing';
import { revenueEngineContent as c } from '@/content/tiers/revenue-engine';
import ServicePageTemplate from '@/components/ServicePageTemplate';

const STATS = [
  { icon: GitBranch,  val: '∞',  pre: '',  suf: '',      label: 'Automation runs — no human hours spent' },
  { icon: Brain,      val: 24,   pre: '',  suf: '/7',    label: 'Advanced AI assistant trained on your knowledge base' },
  { icon: DollarSign, val: 20,   pre: '$', suf: 'K+',    label: 'Monthly revenue before this tier makes sense' },
];

function FunnelMockup() {
  const stages = [
    { label: 'Ad Click', icon: '📢', count: '248', color: '#2AA5A0' },
    { label: 'Landing Page', icon: '🎯', count: '186', color: '#33BDB8' },
    { label: 'Lead Captured', icon: '✉️', count: '94', color: '#10b981' },
    { label: 'Call Booked', icon: '📅', count: '41', color: '#059669' },
    { label: 'Closed', icon: '🤝', count: '18', color: '#047857' },
  ];
  return (
    <div style={{ borderRadius: '20px', background: '#ffffff', border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 20px 60px rgba(0,0,0,0.1)', padding: '28px', maxWidth: '400px', margin: '0 auto' }}>
      <div style={{ fontSize: '12px', fontWeight: 700, color: '#9ca3af', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '1px' }}>Sales Pipeline — This Month</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {stages.map((stage, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + i * 0.12, duration: 0.4 }}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 14px', borderRadius: '10px', background: '#f8fafc', border: '1px solid rgba(0,0,0,0.05)' }}
          >
            <span style={{ fontSize: '16px' }}>{stage.icon}</span>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#374151', flex: 1 }}>{stage.label}</span>
            <span style={{ fontSize: '16px', fontWeight: 800, color: stage.color }}>{stage.count}</span>
          </motion.div>
        ))}
      </div>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6, duration: 0.5 }}
        style={{ marginTop: '16px', padding: '12px 14px', background: 'rgba(42,165,160,0.08)', borderRadius: '10px', border: '1px solid rgba(42,165,160,0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
      >
        <span style={{ fontSize: '13px', color: '#374151', fontWeight: 600 }}>Avg. deal value</span>
        <span style={{ fontSize: '18px', fontWeight: 900, color: '#2AA5A0' }}>$3,200</span>
      </motion.div>
    </div>
  );
}

export default function RevenueEnginePage() {
  const tier = getTier('revenue-engine');
  return (
    <ServicePageTemplate
      content={c}
      tier={tier}
      theme="light"
      stats={STATS}
      heroVisual={<FunnelMockup />}
      prevTier={{ slug: 'growth', name: 'Growth' }}
      nextTier={{ slug: 'ai-first', name: 'AI-First' }}
    />
  );
}
