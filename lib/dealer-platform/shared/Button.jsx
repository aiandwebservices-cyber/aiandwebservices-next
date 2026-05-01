'use client';

const SIZES = {
  sm: 'px-2.5 py-1.5 text-xs gap-1.5',
  md: 'px-3.5 py-2 text-sm gap-2',
  lg: 'px-5 py-2.5 text-sm gap-2',
};

const VARIANTS = {
  default:     'bg-white border border-stone-300 text-stone-800 hover:bg-stone-50',
  gold:        'text-stone-900 border border-transparent hover:brightness-95',
  outlineGold: 'border-2 hover:bg-amber-50',
  ghost:       'text-stone-600 hover:bg-stone-100',
  dark:        'bg-stone-900 text-white hover:bg-stone-800',
  danger:      'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100',
};

/**
 * Universal button atom.
 *
 * Variants:
 *   default       — neutral white button
 *   gold          — primary CTA (uses config.colors.primary as bg)
 *   outlineGold   — bordered version of gold for secondary CTAs
 *   ghost         — borderless text button
 *   dark          — inverse for darker surfaces
 *   danger        — destructive
 *
 * Pass `primaryColor` if you want gold/outlineGold to use a dealer-specific hue
 * instead of the default (#D4AF37). Otherwise reads --primary CSS var if set.
 */
export function Button({
  variant = 'default',
  size = 'md',
  icon: Icon,
  children,
  className = '',
  primaryColor,
  ...props
}) {
  const variantClass = VARIANTS[variant] || VARIANTS.default;
  const goldStyle =
    variant === 'gold'        ? { backgroundColor: primaryColor || 'var(--brand-primary, #D4AF37)' } :
    variant === 'outlineGold' ? { borderColor: primaryColor || 'var(--brand-primary, #D4AF37)', color: '#7A5A0F' } :
    undefined;
  return (
    <button
      {...props}
      style={{ ...goldStyle, ...(props.style || {}) }}
      className={`inline-flex items-center justify-center font-semibold rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed ${SIZES[size]} ${variantClass} ${className}`}
    >
      {Icon && <Icon className="w-3.5 h-3.5" strokeWidth={2} />}
      {children}
    </button>
  );
}

export default Button;
