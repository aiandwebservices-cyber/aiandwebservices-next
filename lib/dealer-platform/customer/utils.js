function slugify(s) {
  return String(s || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * generateVehicleSlug(vehicle) → "2023-bmw-x5-abc123"
 * Works with both FLEET-shape (v.y/v.mk/v.md) and raw EspoCRM shape (v.year/v.make/v.model).
 * Uses the EspoCRM entity id as the tail so the detail page can fetch directly.
 */
export function generateVehicleSlug(vehicle) {
  const year  = vehicle.y  || vehicle.year;
  const make  = vehicle.mk || vehicle.make;
  const model = vehicle.md || vehicle.model;
  const parts = [year, make, model].map(slugify).filter(Boolean).join('-');
  const id    = slugify(vehicle.id || vehicle.stockNumber || '');
  return id ? `${parts}-${id}` : parts;
}

/**
 * parseVehicleSlug(slug) → { vehicleId }
 * Extracts the vehicle ID from the last hyphen-separated segment.
 * E.g. "2023-bmw-x5-abc123" → { vehicleId: "abc123" }
 */
export function parseVehicleSlug(slug) {
  if (!slug) return { vehicleId: '' };
  const lastDash = slug.lastIndexOf('-');
  if (lastDash === -1) return { vehicleId: slug };
  return { vehicleId: slug.slice(lastDash + 1) };
}
