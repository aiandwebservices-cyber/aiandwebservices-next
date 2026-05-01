'use client';
import { ChevronDown } from 'lucide-react';

/**
 * Themed select dropdown with chevron icon.
 */
export function Select({ children, className = '', style, ...props }) {
  return (
    <div className="relative">
      <select
        {...props}
        style={{
          backgroundColor: 'var(--bg-input)',
          borderColor: 'var(--border-strong)',
          color: 'var(--text-primary)',
          ...style,
        }}
        className={`w-full pl-3 pr-9 py-2 border rounded-md text-sm appearance-none ring-gold ${className}`}
      >
        {children}
      </select>
      <ChevronDown
        className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
        style={{ color: 'var(--text-muted)' }}
      />
    </div>
  );
}

/**
 * Themed textarea.
 */
export function Textarea({ className = '', style, ...props }) {
  return (
    <textarea
      {...props}
      style={{
        backgroundColor: 'var(--bg-input)',
        borderColor: 'var(--border-strong)',
        color: 'var(--text-primary)',
        ...style,
      }}
      className={`w-full px-3 py-2 border rounded-md text-sm placeholder:text-stone-400 ring-gold resize-y ${className}`}
    />
  );
}

export default Select;
