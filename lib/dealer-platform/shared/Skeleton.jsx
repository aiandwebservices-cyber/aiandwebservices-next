'use client';

/**
 * Loading skeleton — gray-shimmer rows used during initial data load.
 */
export function Skeleton({ rows = 4, className = '' }) {
  return (
    <div className={`animate-pulse space-y-3 ${className}`}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-10 bg-stone-200/70 rounded-md" />
      ))}
    </div>
  );
}

export default Skeleton;
