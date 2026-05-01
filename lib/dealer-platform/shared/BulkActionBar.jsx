'use client';
import Button from './Button';

/**
 * Inline bulk action bar that appears above a table when one or more rows
 * are selected. Hidden when count === 0.
 *
 * Props:
 *   count    — number of selected rows
 *   actions  — array of { label, icon, onClick, variant, danger }
 *   onClear  — callback to clear the selection
 */
export function BulkActionBar({ count, actions = [], onClear }) {
  if (!count) return null;
  return (
    <div
      className="mb-3 p-3 rounded-lg flex items-center gap-2 flex-wrap"
      style={{ backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border)' }}
    >
      <span className="text-sm font-semibold mr-2" style={{ color: 'var(--text-primary)' }}>
        {count} selected
      </span>
      {actions.map((a, i) => (
        <Button
          key={i}
          size="sm"
          variant={a.variant || 'default'}
          icon={a.icon}
          onClick={a.onClick}
          className={a.danger ? 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100' : ''}
        >
          {a.label}
        </Button>
      ))}
      <Button size="sm" variant="ghost" onClick={onClear}>Clear</Button>
    </div>
  );
}

export default BulkActionBar;
