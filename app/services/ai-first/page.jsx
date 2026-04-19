'use client';
import { motion } from 'framer-motion';
import { Phone, Brain, Share2 } from 'lucide-react';
import { getTier } from '@/lib/pricing';
import { aiFirstContent as c } from '@/content/tiers/ai-first';
import ServicePageTemplate from '@/components/ServicePageTemplate';

const STATS = [
  { icon: Phone,    val: '24', pre: '', suf: '/7', label: 'Voice AI answering every inbound call' },
  { icon: Brain,    val: 'Deep', pre: '', suf: '',  label: 'Advanced AI trained on your knowledge base' },
  { icon: Share2,   val: 365, pre: '', suf: '',    label: 'Social posts scheduled per year by AI' },
];

function TerminalMockup() {
  const lines = [
    { delay: 0.5,  text: '> voice_ai.deploy(number="+1-555-xxx")', color: '#2AA5A0' },
    { delay: 1.0,  text: '  ✓ Voice AI online — answering calls', color: '#10b981' },
    { delay: 1.5,  text: '> ai_assistant.train(kb="your_business")', color: '#2AA5A0' },
    { delay: 2.0,  text: '  ✓ Advanced AI online — handling complex queries', color: '#10b981' },
    { delay: 2.5,  text: '> social.schedule(posts_per_day=1)', color: '#2AA5A0' },
    { delay: 3.0,  text: '  ✓ 365 posts queued and ready', color: '#10b981' },
    { delay: 3.5,  text: '> automation.deploy(workflows="all")', color: '#2AA5A0' },
    { delay: 4.0,  text: '  ✓ All systems live. Running at full power.', color: '#10b981' },
  ];
  return (
    <div style={{ borderRadius: '20px', background: '#0d1117', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 24px 72px rgba(0,0,0,0.6)', overflow: 'hidden', maxWidth: '420px', margin: '0 auto', fontFamily: 'monospace' }}>
      <div style={{ background: '#161b22', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        {['#ef4444','#f59e0b','#22c55e'].map(col => <div key={col} style={{ width: '10px', height: '10px', borderRadius: '50%', background: col }} />)}
        <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginLeft: '6px' }}>ai-first — system deployment</span>
      </div>
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '6px', minHeight: '240px' }}>
        {lines.map(({ delay, text, color }) => (
          <motion.div key={text}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay, duration: 0.3 }}
            style={{ fontSize: '12px', color, lineHeight: 1.5 }}
          >{text}</motion.div>
        ))}
        <motion.span
          initial={{ opacity: 1 }} animate={{ opacity: [1, 0, 1] }} transition={{ delay: 4.2, duration: 0.8, repeat: Infinity }}
          style={{ fontSize: '14px', color: '#2AA5A0', marginTop: '4px' }}
        >▋</motion.span>
      </div>
    </div>
  );
}

export default function AiFirstPage() {
  const tier = getTier('ai-first');
  return (
    <ServicePageTemplate
      content={c}
      tier={tier}
      theme="dark"
      stats={STATS}
      heroVisual={<TerminalMockup />}
      prevTier={{ slug: 'revenue-engine', name: 'Revenue Engine' }}
    />
  );
}
