'use client';

/**
 * Theme-aware card surface. Wraps children with the platform's --bg-card +
 * --border CSS variables so it inverts cleanly in dark mode.
 */
export function Card({ children, className = '', style, ...props }) {
  return (
    <div
      {...props}
      className={`rounded-lg ${className}`}
      style={{
        backgroundColor: 'var(--bg-card)',
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: 'var(--border)',
        color: 'var(--text-primary)',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export default Card;
