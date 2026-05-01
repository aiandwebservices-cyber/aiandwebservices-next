'use client';
import React from 'react';

/**
 * Form field wrapper — label + child input + optional hint/error.
 */
export function Field({ label, hint, required, children, className = '' }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label
          className="text-[11px] font-semibold smallcaps"
          style={{ color: 'var(--text-secondary)' }}
        >
          {label}
          {required && <span className="text-red-700 ml-0.5">*</span>}
        </label>
      )}
      {children}
      {hint && (
        <div className="text-[11px] leading-snug" style={{ color: 'var(--text-muted)' }}>
          {hint}
        </div>
      )}
    </div>
  );
}

/**
 * Themed text input. Reads --bg-input / --border-strong / --text-primary
 * so it inverts in dark mode.
 */
export const Input = React.forwardRef(({ className = '', style, ...props }, ref) => (
  <input
    ref={ref}
    {...props}
    style={{
      backgroundColor: 'var(--bg-input)',
      borderColor: 'var(--border-strong)',
      color: 'var(--text-primary)',
      ...style,
    }}
    className={`w-full px-3 py-2 border rounded-md text-sm placeholder:text-stone-400 ring-gold transition ${className}`}
  />
));
Input.displayName = 'Input';

export default Field;
