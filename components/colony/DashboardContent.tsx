'use client';
import { motion, type Variants } from 'framer-motion';

const EASE: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

const SLIDE_UP: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } },
};

const STAGGER: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const METRICS = [
  { label: 'Active Automations', value: '—', sub: 'Coming soon' },
  { label: 'Leads This Month', value: '—', sub: 'Coming soon' },
  { label: 'Hours Saved', value: '—', sub: 'Coming soon' },
  { label: 'Revenue Impact', value: '—', sub: 'Coming soon' },
];

export function DashboardContent({ plan }: { plan?: string }) {
  return (
    <main className="px-6 py-10 max-w-6xl mx-auto">
      <motion.div variants={STAGGER} initial="hidden" animate="show">
        <motion.div variants={SLIDE_UP} className="mb-8">
          <p
            style={{ color: 'var(--col-accent)', fontSize: '0.75rem' }}
            className="font-bold tracking-widest uppercase mb-1"
          >
            Colony Dashboard
          </p>
          <h1 style={{ color: 'var(--col-text)' }} className="text-3xl font-bold">
            Welcome back
          </h1>
          {plan && (
            <p style={{ color: 'var(--col-muted)', fontSize: '0.875rem' }} className="mt-1">
              Plan:{' '}
              <span style={{ color: 'var(--col-accent)' }} className="font-medium">
                {plan}
              </span>
            </p>
          )}
        </motion.div>

        <motion.div
          variants={SLIDE_UP}
          className="grid grid-cols-2 gap-4 mb-8 lg:grid-cols-4"
        >
          {METRICS.map(({ label, value, sub }) => (
            <div
              key={label}
              style={{
                background: 'var(--col-surface)',
                border: '1px solid var(--col-border)',
                borderRadius: '12px',
                padding: '1.25rem 1.5rem',
              }}
            >
              <p style={{ color: 'var(--col-muted)', fontSize: '0.75rem' }} className="mb-2 font-medium">
                {label}
              </p>
              <p style={{ color: 'var(--col-text)' }} className="text-2xl font-bold mb-1">
                {value}
              </p>
              <p style={{ color: 'var(--col-muted)', fontSize: '0.75rem' }}>{sub}</p>
            </div>
          ))}
        </motion.div>

        <motion.div
          variants={SLIDE_UP}
          style={{
            background: 'var(--col-surface)',
            border: '1px solid var(--col-border)',
            borderRadius: '12px',
            padding: '2rem',
          }}
        >
          <p
            style={{ color: 'var(--col-accent)', fontSize: '0.75rem' }}
            className="font-bold tracking-widest uppercase mb-2"
          >
            Phase 0 · Foundation
          </p>
          <p style={{ color: 'var(--col-muted)', fontSize: '0.875rem' }} className="leading-relaxed">
            Colony is being built. Your AI business dashboard is coming — automations, lead
            tracking, content performance, and more.
          </p>
        </motion.div>
      </motion.div>
    </main>
  );
}
