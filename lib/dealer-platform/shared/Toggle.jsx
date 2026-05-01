'use client';

/**
 * On/off toggle switch with optional label and description.
 */
export function Toggle({ checked, onChange, label, description, disabled, primaryColor = '#D4AF37' }) {
  return (
    <label className={`flex items-start gap-3 cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className="relative shrink-0 mt-0.5 w-9 h-5 rounded-full transition-colors duration-200"
        style={{ backgroundColor: checked ? primaryColor : '#D6D2C8' }}
      >
        <span
          className="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all duration-200"
          style={{ left: checked ? '18px' : '2px' }}
        />
      </button>
      {(label || description) && (
        <div className="flex-1">
          {label && <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{label}</div>}
          {description && <div className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{description}</div>}
        </div>
      )}
    </label>
  );
}

export default Toggle;
