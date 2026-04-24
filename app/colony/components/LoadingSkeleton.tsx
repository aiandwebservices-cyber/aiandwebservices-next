'use client'

interface SkeletonProps {
  variant: 'feed-row' | 'card' | 'list-row' | 'hero'
  count?: number
}

function SkeletonBlock({ w, h, rounded }: { w: string; h: number; rounded?: boolean }) {
  return (
    <div
      className="colony-skeleton"
      style={{ width: w, height: h, borderRadius: rounded ? 999 : 6 }}
    />
  )
}

function FeedRowSkeleton() {
  return (
    <div className="flex items-start gap-3 px-4 py-3">
      <SkeletonBlock w="32px" h={32} rounded />
      <div className="flex-1 space-y-2">
        <SkeletonBlock w="60%" h={13} />
        <SkeletonBlock w="40%" h={11} />
      </div>
      <SkeletonBlock w="48px" h={11} />
    </div>
  )
}

function CardSkeleton() {
  return (
    <div
      className="rounded-xl p-4 space-y-3"
      style={{ border: '1px solid var(--colony-border)', background: 'var(--colony-bg-elevated)' }}
    >
      <div className="flex items-center gap-2">
        <SkeletonBlock w="48px" h={18} rounded />
        <SkeletonBlock w="55%" h={14} />
      </div>
      <SkeletonBlock w="80%" h={12} />
      <SkeletonBlock w="40%" h={12} />
    </div>
  )
}

function ListRowSkeleton() {
  return (
    <div
      className="flex items-center gap-3 px-4 py-3"
      style={{ borderBottom: '1px solid var(--colony-border)' }}
    >
      <SkeletonBlock w="38px" h={18} rounded />
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <SkeletonBlock w="45%" h={13} />
          <SkeletonBlock w="18%" h={11} />
        </div>
        <SkeletonBlock w="22%" h={11} rounded />
      </div>
      <SkeletonBlock w="44px" h={11} />
    </div>
  )
}

function HeroSkeleton() {
  return (
    <div className="p-6 space-y-4">
      <SkeletonBlock w="35%" h={24} />
      <SkeletonBlock w="55%" h={14} />
      <SkeletonBlock w="100%" h={120} />
    </div>
  )
}

export function LoadingSkeleton({ variant, count = 3 }: SkeletonProps) {
  const items = Array.from({ length: count }, (_, i) => i)

  if (variant === 'hero') return <HeroSkeleton />

  return (
    <div>
      {items.map((i) => (
        <div key={i}>
          {variant === 'feed-row' && <FeedRowSkeleton />}
          {variant === 'card' && (
            <div className="px-0 py-1">
              <CardSkeleton />
            </div>
          )}
          {variant === 'list-row' && <ListRowSkeleton />}
        </div>
      ))}
    </div>
  )
}
