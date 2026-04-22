'use client';
import { DollarSign, LayoutGrid, Ban } from 'lucide-react';
import { getTier } from '@/lib/pricing';
import { consultingContent as c } from '@/content/tiers/consulting';
import ServicePageTemplate from '@/components/ServicePageTemplate';

const STATS = [
  { icon: DollarSign, val: 99, pre: '$', suf: '',  label: 'Starting price — no plan or contract required' },
  { icon: LayoutGrid, val: 5,  pre: '',  suf: '+', label: 'Services available individually, more on request' },
  { icon: Ban,        val: 0,  pre: '',  suf: '',  label: 'Lock-in contracts or minimums' },
];

export default function ConsultingPage() {
  const tier = getTier('consulting');
  return (
    <ServicePageTemplate
      content={c}
      tier={tier}
      theme="light"
      stats={STATS}
    />
  );
}
