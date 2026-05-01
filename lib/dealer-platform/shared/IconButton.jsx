'use client';

const TONES = {
  default: 'text-stone-500 hover:text-stone-900 hover:bg-stone-100',
  gold:    'hover:bg-amber-50',
  danger:  'text-stone-500 hover:text-red-700 hover:bg-red-50',
  blue:    'text-stone-500 hover:text-blue-700 hover:bg-blue-50',
  emerald: 'text-stone-500 hover:text-emerald-700 hover:bg-emerald-50',
};

/**
 * Small square icon button — used for row actions in tables and inline edit
 * buttons next to inputs.
 */
export function IconButton({ icon: Icon, title, onClick, tone = 'default', size = 'md' }) {
  const sizeClass = size === 'sm' ? 'w-6 h-6' : 'w-7 h-7';
  const iconSize  = size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5';
  const goldStyle = tone === 'gold' ? { color: '#7A5A0F' } : undefined;
  return (
    <button
      onClick={onClick}
      title={title}
      aria-label={title}
      style={goldStyle}
      className={`inline-flex items-center justify-center rounded-md transition ${sizeClass} ${TONES[tone] || TONES.default}`}
    >
      <Icon className={iconSize} strokeWidth={2} />
    </button>
  );
}

export default IconButton;
