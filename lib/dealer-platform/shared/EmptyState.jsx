'use client';

/**
 * Standardized empty-state for tables and lists.
 *
 * Props:
 *   icon       — Lucide component
 *   title      — bold heading line
 *   description — supporting copy
 *   action     — optional ReactNode (typically a Btn) for a CTA
 *   colSpan    — when used inside a table, set this to span all columns
 */
export function EmptyState({ icon: Icon, title, description, action, colSpan }) {
  const content = (
    <div className="text-center py-16 px-4">
      {Icon && <Icon className="w-10 h-10 mx-auto mb-3 text-stone-300" strokeWidth={1.5} />}
      <div className="font-display text-lg font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
        {title}
      </div>
      {description && (
        <div className="text-sm max-w-xs mx-auto" style={{ color: 'var(--text-muted)' }}>
          {description}
        </div>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
  if (colSpan) {
    return (
      <tr>
        <td colSpan={colSpan}>{content}</td>
      </tr>
    );
  }
  return content;
}

export default EmptyState;
