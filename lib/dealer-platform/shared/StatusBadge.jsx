'use client';
import { Star, X, Check, Tag } from 'lucide-react';
import { STATUS_COLORS } from '../theme/colors';

const ICON_FOR_STATUS = {
  'Featured':   Star,
  'On Sale':    Tag,
  'Lost':       X,
  'No-Show':    X,
  'Cancelled':  X,
  'Expired':    X,
  'Completed':  Check,
};

/**
 * Universal status badge — renders a colored pill with dot/icon based on
 * the global STATUS_COLORS palette. Negative states (Lost / No-Show /
 * Cancelled / Expired) get an X icon and Lost gets strikethrough.
 */
export function StatusBadge({ status, size = 'sm' }) {
  const s = STATUS_COLORS[status] || { bg: '#E7E5E4', fg: '#57534E', dot: '#A8A29E' };
  const Icon = ICON_FOR_STATUS[status];
  const sizeClass = size === 'sm' ? 'text-[11px] px-2 py-0.5' : 'text-xs px-2.5 py-1';
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold smallcaps ${sizeClass} ${s.strike ? 'line-through' : ''}`}
      style={{
        backgroundColor: s.bg,
        color: s.fg,
        border: s.border ? `1px solid ${s.border}` : undefined,
      }}
    >
      {Icon ? (
        <Icon
          className="w-3 h-3"
          strokeWidth={2.5}
          style={{ color: s.dot }}
          fill={Icon === Star ? s.dot : 'none'}
        />
      ) : (
        <span
          className={`w-1.5 h-1.5 rounded-full ${s.pulse ? 'pulse-dot' : ''}`}
          style={{ backgroundColor: s.dot }}
        />
      )}
      {status}
    </span>
  );
}

export default StatusBadge;
