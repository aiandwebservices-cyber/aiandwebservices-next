'use client';
import { Car } from 'lucide-react';

const SIZES = {
  xs: 'w-12 h-9',
  sm: 'w-16 h-12',
  md: 'w-24 h-16',
  lg: 'w-full aspect-[4/3]',
};

const PALETTE = (gold) => ({
  black:  'linear-gradient(135deg,#2c2a26 0%,#1a1815 100%)',
  white:  'linear-gradient(135deg,#fafaf7 0%,#e8e5dd 100%)',
  silver: 'linear-gradient(135deg,#e0ddd5 0%,#b8b3a8 100%)',
  gray:   'linear-gradient(135deg,#9a958a 0%,#6b655b 100%)',
  red:    'linear-gradient(135deg,#a12b2b 0%,#6b1a1a 100%)',
  blue:   'linear-gradient(135deg,#2a4a7a 0%,#1a2e4a 100%)',
  green:  'linear-gradient(135deg,#3a6b4a 0%,#234430 100%)',
  brown:  'linear-gradient(135deg,#7a5a3a 0%,#4a3a25 100%)',
  beige:  'linear-gradient(135deg,#d8cdb8 0%,#b3a48a 100%)',
  gold:   `linear-gradient(135deg,${gold} 0%,#9a7d28 100%)`,
});

/**
 * Vehicle photo with gradient fallback.
 * - If vehicle.photos[0] exists, renders the image.
 * - Otherwise renders a colored gradient based on exteriorColor + the vehicle's
 *   make initials in the bottom-right corner.
 */
export function VehiclePhoto({ vehicle, size = 'md', primaryColor = '#D4AF37' }) {
  const initials = (vehicle?.make || '?').slice(0, 2).toUpperCase();
  const color = vehicle?.exteriorColor?.toLowerCase() || 'gray';
  const palette = PALETTE(primaryColor);
  const bg = palette[color] || palette.gray;
  const isLight = ['white', 'silver', 'beige', 'gold'].includes(color);
  if (vehicle?.photos?.[0]) {
    return (
      <div className={`${SIZES[size]} rounded-md overflow-hidden bg-stone-100 shrink-0`}>
        <img
          src={vehicle.photos[0]}
          alt=""
          className="w-full h-full object-cover"
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
        />
      </div>
    );
  }
  return (
    <div
      className={`${SIZES[size]} rounded-md overflow-hidden shrink-0 relative flex items-center justify-center`}
      style={{ background: bg }}
    >
      <Car
        className={size === 'lg' ? 'w-10 h-10' : size === 'md' ? 'w-6 h-6' : 'w-4 h-4'}
        style={{ color: isLight ? '#6b655b' : 'rgba(255,255,255,0.6)' }}
        strokeWidth={1.5}
      />
      <span
        className={`absolute right-1 bottom-0.5 font-display font-medium ${size === 'lg' ? 'text-sm' : 'text-[11px]'}`}
        style={{ color: isLight ? '#6b655b' : 'rgba(255,255,255,0.7)' }}
      >
        {initials}
      </span>
    </div>
  );
}

export default VehiclePhoto;
