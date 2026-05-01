'use client';
import { useState, useEffect } from 'react';

const COLOR_MAP = {
  red:  'bg-red-600 hover:bg-red-700 text-white',
  blue: 'bg-blue-600 hover:bg-blue-700 text-white',
  gold: 'text-stone-900 hover:brightness-95',
  dark: 'bg-stone-900 hover:bg-stone-800 text-white',
};

/**
 * Reusable confirmation dialog with optional inline input fields.
 *
 * Used for destructive actions (Delete, Mark Sold) and for capturing
 * extra info inline (buyer name, sale price, view name, etc.).
 *
 * Props:
 *   isOpen, title, message, confirmLabel, cancelLabel, confirmColor
 *   inputs        — array of { name, label, type, placeholder, defaultValue, hint }
 *   onConfirm     — receives `values` object keyed by input names
 *   onCancel
 *   primaryColor  — overrides the gold backgroundColor for confirmColor='gold'
 */
export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  confirmColor = 'red',
  onConfirm,
  onCancel,
  inputs = [],
  primaryColor = '#D4AF37',
}) {
  const [values, setValues] = useState({});

  useEffect(() => {
    if (isOpen) {
      const init = {};
      inputs.forEach((i) => { init[i.name] = i.defaultValue ?? ''; });
      setValues(init);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  if (!isOpen) return null;

  const goldStyle = confirmColor === 'gold' ? { backgroundColor: primaryColor } : undefined;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 anim-fade no-print"
      onClick={onCancel}
    >
      <div
        className="rounded-lg shadow-xl max-w-md w-full max-h-[85vh] overflow-y-auto"
        style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5">
          <h3 className="font-display text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>{title}</h3>
          {message && (
            <p className="text-sm mb-4 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {message}
            </p>
          )}
          {inputs.map((i, idx) => (
            <div key={i.name} className="mb-3">
              <label
                className="block text-[11px] font-semibold mb-1 smallcaps"
                style={{ color: 'var(--text-secondary)' }}
              >
                {i.label}
              </label>
              <input
                type={i.type || 'text'}
                value={values[i.name] ?? ''}
                onChange={(e) => setValues((v) => ({ ...v, [i.name]: e.target.value }))}
                placeholder={i.placeholder || ''}
                autoFocus={idx === 0}
                style={{
                  backgroundColor: 'var(--bg-input)',
                  borderColor: 'var(--border-strong)',
                  color: 'var(--text-primary)',
                }}
                className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
              />
              {i.hint && (
                <div className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>
                  {i.hint}
                </div>
              )}
            </div>
          ))}
        </div>
        <div
          className="px-5 py-3 flex justify-end gap-2"
          style={{ backgroundColor: 'var(--bg-elevated)', borderTop: '1px solid var(--border)' }}
        >
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-semibold rounded-md transition hover:bg-stone-200/40"
            style={{ color: 'var(--text-secondary)' }}
          >
            {cancelLabel}
          </button>
          <button
            onClick={() => onConfirm(values)}
            style={goldStyle}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition ${COLOR_MAP[confirmColor] || COLOR_MAP.red}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
