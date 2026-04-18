'use client';
import { motion } from 'framer-motion';
import { Search, Map, MessageSquare } from 'lucide-react';
import { getTier } from '@/lib/pricing';
import { consultingContent as c } from '@/content/tiers/consulting';
import ServicePageTemplate from '@/components/ServicePageTemplate';

const STATS = [
  { icon: Search,       val: 5,  suf: ' days',  label: 'Full AI readiness audit delivered' },
  { icon: Map,          val: 60, suf: ' min',   label: 'Discovery call to understand your business' },
  { icon: MessageSquare,val: 0,  pre: 'Zero',   suf: '', label: 'Affiliate bias — pure, honest advice' },
];

function RoadmapMockup() {
  const items = [
    { label: 'AI Readiness Audit', status: 'done', desc: 'Where you are now' },
    { label: 'Quick Wins Identified', status: 'done', desc: '3 automations = 6hrs/wk saved' },
    { label: 'Tool Stack Selected', status: 'active', desc: 'HubSpot + n8n + ChatGPT' },
    { label: 'Phase 1 Implementation', status: 'next', desc: 'Starting next month' },
    { label: 'Staff Training', status: 'next', desc: 'Workshop for 4 team members' },
  ];
  return (
    <div style={{ borderRadius: '20px', background: '#ffffff', border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 20px 60px rgba(0,0,0,0.1)', padding: '28px', maxWidth: '400px', margin: '0 auto' }}>
      <div style={{ fontSize: '12px', fontWeight: 700, color: '#9ca3af', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '1px' }}>Your AI Roadmap</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
        {items.map((item, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i * 0.15, duration: 0.4 }}
            style={{ display: 'flex', gap: '14px', paddingBottom: i < items.length - 1 ? '16px' : 0, position: 'relative' }}
          >
            {i < items.length - 1 && <div style={{ position: 'absolute', left: '10px', top: '22px', bottom: 0, width: '2px', background: item.status === 'done' ? '#2AA5A0' : 'rgba(0,0,0,0.08)' }} />}
            <div style={{ width: '22px', height: '22px', borderRadius: '50%', flexShrink: 0, border: `2px solid ${item.status === 'done' ? '#2AA5A0' : item.status === 'active' ? '#f59e0b' : 'rgba(0,0,0,0.12)'}`, background: item.status === 'done' ? '#2AA5A0' : 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: 'white', zIndex: 1 }}>
              {item.status === 'done' ? '✓' : ''}
            </div>
            <div style={{ paddingTop: '1px' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: item.status === 'next' ? '#9ca3af' : '#111827', marginBottom: '2px' }}>{item.label}</div>
              <div style={{ fontSize: '12px', color: '#9ca3af' }}>{item.desc}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default function ConsultingPage() {
  const tier = getTier('consulting');
  return (
    <ServicePageTemplate
      content={c}
      tier={tier}
      theme="light"
      stats={STATS}
      heroVisual={<RoadmapMockup />}
    />
  );
}
