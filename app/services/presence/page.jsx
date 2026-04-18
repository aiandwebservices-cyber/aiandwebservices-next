'use client';
import { motion } from 'framer-motion';
import { Globe, Search, MapPin, Star } from 'lucide-react';
import { getTier } from '@/lib/pricing';
import { presenceContent as c } from '@/content/tiers/presence';
import ServicePageTemplate from '@/components/ServicePageTemplate';

const STATS = [
  { icon: Globe,  val: 5,  pre: '',   suf: ' pages', label: 'Professional website pages, built to convert' },
  { icon: Search, val: 30, pre: '',   suf: ' days',  label: 'To first-page local Google presence' },
  { icon: Star,   val: 24, pre: '',   suf: '/7',     label: 'AI assistant capturing leads after hours' },
];

function WebsiteMockup() {
  return (
    <div style={{ borderRadius: '20px', background: '#ffffff', border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 20px 60px rgba(0,0,0,0.12)', overflow: 'hidden', maxWidth: '400px', margin: '0 auto' }}>
      <div style={{ background: '#f1f5f9', borderBottom: '1px solid rgba(0,0,0,0.07)', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ display: 'flex', gap: '5px' }}>
          {['#ef4444','#f59e0b','#22c55e'].map(col => <div key={col} style={{ width: '10px', height: '10px', borderRadius: '50%', background: col }} />)}
        </div>
        <div style={{ flex: 1, background: 'white', borderRadius: '6px', padding: '4px 10px', fontSize: '11px', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '5px' }}>
          <Search size={10} /> yoursite.com
        </div>
      </div>
      <div style={{ padding: '20px', background: '#111827' }}>
        <div style={{ height: '8px', width: '60%', background: 'rgba(42,165,160,0.6)', borderRadius: '4px', marginBottom: '8px' }} />
        <div style={{ height: '5px', width: '90%', background: 'rgba(255,255,255,0.15)', borderRadius: '3px', marginBottom: '5px' }} />
        <div style={{ height: '5px', width: '75%', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', marginBottom: '16px' }} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '16px' }}>
          {[0,1,2].map(i => <div key={i} style={{ height: '48px', background: 'rgba(42,165,160,0.12)', borderRadius: '8px', border: '1px solid rgba(42,165,160,0.2)' }} />)}
        </div>
        <div style={{ background: '#2AA5A0', borderRadius: '6px', padding: '8px', textAlign: 'center', fontSize: '11px', fontWeight: 700, color: '#fff' }}>Contact Us</div>
      </div>
      <div style={{ padding: '14px 16px', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
        <div style={{ fontSize: '11px', fontWeight: 700, color: '#374151', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '5px' }}>
          <MapPin size={12} color="#2AA5A0" /> Google Business Profile
        </div>
        <div style={{ display: 'flex', gap: '4px', marginBottom: '6px' }}>
          {[1,2,3,4,5].map(s => <Star key={s} size={12} color="#f59e0b" fill="#f59e0b" />)}
          <span style={{ fontSize: '11px', color: '#6b7280', marginLeft: '3px' }}>4.9 · 47 reviews</span>
        </div>
        {['Mon–Fri 9am–6pm','yoursite.com','(555) 000-0000'].map(line => (
          <div key={line} style={{ fontSize: '11px', color: '#6b7280', marginBottom: '3px' }}>{line}</div>
        ))}
      </div>
      <motion.div
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1, duration: 0.4 }}
        style={{ margin: '0 16px 14px', padding: '10px 12px', background: 'rgba(42,165,160,0.08)', borderRadius: '10px', border: '1px solid rgba(42,165,160,0.2)', fontSize: '12px', color: '#2AA5A0', fontWeight: 600 }}
      >
        🤖 AI: &ldquo;Hi! How can I help you today?&rdquo;
      </motion.div>
    </div>
  );
}

export default function PresencePage() {
  const tier = getTier('presence');
  return (
    <ServicePageTemplate
      content={c}
      tier={tier}
      theme="light"
      stats={STATS}
      heroVisual={<WebsiteMockup />}
      nextTier={{ slug: 'growth', name: 'Growth' }}
    />
  );
}
