export default function CTAButton({
  href,
  onClick,
  children,
  variant = 'primary',
  showArrow = false,
  className = '',
}) {
  const base = 'inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full font-bold text-base transition-all duration-150 cursor-pointer';

  const variants = {
    primary:   'bg-[#2AA5A0] text-white hover:bg-[#248F8B]',
    secondary: 'bg-transparent border-2 border-[#2AA5A0] text-[#2AA5A0] hover:bg-[#2AA5A0]/10',
    outline:   'bg-transparent border border-current text-current hover:bg-black/5',
  };

  const Tag = href ? 'a' : 'button';

  return (
    <Tag
      href={href}
      onClick={onClick}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {children}
      {showArrow && (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M5 12h14m-7-7l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )}
    </Tag>
  );
}
