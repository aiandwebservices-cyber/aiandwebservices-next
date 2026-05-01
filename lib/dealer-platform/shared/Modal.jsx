'use client';
import { X } from 'lucide-react';

/**
 * Reusable modal wrapper with backdrop + close button.
 *
 * Props:
 *   isOpen, onClose, title, children, footer, size ('sm'|'md'|'lg'|'xl')
 */
const SIZE_CLASSES = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
};

export function Modal({ isOpen, onClose, title, children, footer, size = 'md' }) {
  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 anim-fade no-print"
      onClick={onClose}
    >
      <div
        className={`rounded-lg shadow-xl w-full max-h-[90vh] overflow-y-auto ${SIZE_CLASSES[size] || SIZE_CLASSES.md}`}
        style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div
            className="px-5 py-4 flex items-center justify-between"
            style={{ borderBottom: '1px solid var(--border)' }}
          >
            <h3 className="font-display text-lg font-semibold">{title}</h3>
            <button onClick={onClose} className="p-1.5 rounded hover:bg-stone-100">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
        <div className="p-5">{children}</div>
        {footer && (
          <div
            className="px-5 py-3 flex justify-end gap-2"
            style={{ backgroundColor: 'var(--bg-elevated)', borderTop: '1px solid var(--border)' }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

export default Modal;
