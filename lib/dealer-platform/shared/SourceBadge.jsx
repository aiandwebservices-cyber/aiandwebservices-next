'use client';
import { LEAD_SOURCE_BORDERS } from '../theme/colors';

/**
 * Lead-source badge — colored left border instead of a filled background.
 * Visually distinct from StatusBadge so dealers don't confuse "lead source"
 * with "lead status" in dense tables.
 */
export function SourceBadge({ source }) {
  const border = LEAD_SOURCE_BORDERS[source] || '#78716C';
  return (
    <span
      className="inline-block pl-2 pr-2.5 py-0.5 text-[11px] font-medium bg-stone-100 text-stone-700 rounded-r-md"
      style={{ borderLeft: `3px solid ${border}` }}
    >
      {source}
    </span>
  );
}

export default SourceBadge;
