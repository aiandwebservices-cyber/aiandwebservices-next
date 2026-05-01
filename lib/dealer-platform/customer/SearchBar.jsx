'use client';
import { Search } from 'lucide-react';
import { C, FONT_BODY } from './_internals';

/**
 * SearchBar — generic search input for vehicle filtering.
 *
 * Currently the live implementation is inline inside InventoryGrid.jsx
 * (the filter row at the top of the fleet section). This file exposes a
 * reusable version so future sections (e.g., a dedicated /search route)
 * can use the same input pattern.
 */
export function SearchBar({ value, onChange, placeholder = 'Search make, model, VIN…', className = '', ...rest }) {
  return (
    <div className={`relative ${className}`}>
      <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2"
        style={{ color: C.inkLow }} strokeWidth={2} />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          background: C.bg2, border: `1px solid ${C.rule2}`, color: C.ink,
          fontFamily: FONT_BODY, fontSize: 14,
        }}
        className="w-full pl-9 pr-3 py-2 rounded-md outline-none focus:border-stone-400 transition"
        {...rest}
      />
    </div>
  );
}

export default SearchBar;
