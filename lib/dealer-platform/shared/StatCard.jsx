'use client';

/**
 * Compact stat card — labeled metric with optional icon, accent, and sub line.
 */
export function StatCard({ label, value, sub, accent, icon: Icon }) {
  return (
    <div
      className="rounded-lg p-4 relative"
      style={{
        backgroundColor: 'var(--bg-card)',
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: 'var(--border)',
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-[10px] font-semibold smallcaps" style={{ color: 'var(--text-muted)' }}>
          {label}
        </span>
        {Icon && (
          <Icon className="w-4 h-4" style={{ color: accent || 'var(--text-muted)' }} strokeWidth={1.75} />
        )}
      </div>
      <div
        className="font-display text-2xl font-medium tracking-tight tabular leading-none"
        style={{ color: 'var(--text-primary)' }}
      >
        {value}
      </div>
      {sub && (
        <div className="text-[11px] mt-2" style={{ color: 'var(--text-muted)' }}>
          {sub}
        </div>
      )}
    </div>
  );
}

export default StatCard;
