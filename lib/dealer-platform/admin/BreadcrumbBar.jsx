'use client';
import { ChevronRight } from 'lucide-react';

/**
 * Breadcrumb navigation row — used at the top of detail screens (e.g.,
 * VehicleForm) to indicate hierarchy and let the user navigate back to a
 * parent screen with a click.
 *
 * Props:
 *   items — array of { label, onClick }
 *           the LAST item is rendered as the active page (no onClick needed)
 *
 * Example:
 *   <BreadcrumbBar items={[
 *     { label: 'Inventory', onClick: () => onCancel() },
 *     { label: 'Edit: 2023 BMW X5' },
 *   ]} />
 */
export function BreadcrumbBar({ items = [] }) {
  if (!items.length) return null;
  return (
    <nav className="flex items-center gap-1.5 text-xs mb-2 flex-wrap" style={{ color: 'var(--text-muted)' }}>
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <span key={i} className="flex items-center gap-1.5">
            {isLast ? (
              <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{item.label}</span>
            ) : (
              <button onClick={item.onClick} className="hover:underline" style={{ color: 'var(--text-secondary)' }}>
                {item.label}
              </button>
            )}
            {!isLast && <ChevronRight className="w-3 h-3" />}
          </span>
        );
      })}
    </nav>
  );
}

export default BreadcrumbBar;
