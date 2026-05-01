import { notFound } from 'next/navigation';
import { espoFetch, getDealerConfig } from '@/app/api/dealer/_lib/espocrm';
import { getFullDealerConfig } from '@/lib/dealer-platform/config/server-registry';
import { mapEspoVehicle, ALLOWED_STATUSES } from '@/lib/dealer-platform/customer/InventoryGrid';
import { SEED_VEHICLES } from '@/lib/dealer-platform/data/seed-vehicles';
import { VehicleSchema } from '@/lib/dealer-platform/customer/VehicleSchema';
import { generateVehicleSlug, parseVehicleSlug } from '@/lib/dealer-platform/customer/utils';
import { VehicleDetailPageContent } from '@/lib/dealer-platform/customer/VehicleDetailPageContent';

const BASE_URL = 'https://lotpilot.ai';

// Maps the seed-vehicle shape (uses `photos`, camelCase fields) to the same
// raw format that mapEspoVehicle expects, so one code path handles both.
function normalizeSeedVehicle(s) {
  return {
    ...s,
    photoUrls: Array.isArray(s.photos) ? s.photos.join(',') : '',
  };
}

async function fetchVehicle(dealerId, vehicleId) {
  // Try live EspoCRM first.
  const apiCfg = getDealerConfig(dealerId);
  if (apiCfg) {
    const result = await espoFetch(
      'GET',
      `/api/v1/CVehicle/${encodeURIComponent(vehicleId)}`,
      null,
      apiCfg,
    );
    if (result.ok) return result.data;
  }
  // Fall back to seed data so direct-URL access works in demo / offline mode.
  const seed = SEED_VEHICLES.find((s) => s.id === vehicleId || s.stockNumber === vehicleId);
  return seed ? normalizeSeedVehicle(seed) : null;
}

async function fetchInventoryList(dealerId) {
  const apiCfg = getDealerConfig(dealerId);
  if (apiCfg) {
    const result = await espoFetch(
      'GET',
      '/api/v1/CVehicle?orderBy=dateAdded&order=desc',
      null,
      apiCfg,
    );
    if (result.ok) {
      const list = Array.isArray(result.data?.list) ? result.data.list : [];
      const mapped = list.map(mapEspoVehicle).filter((v) => v && ALLOWED_STATUSES.has(v.status));
      if (mapped.length) return mapped;
    }
  }
  // Fall back to seed inventory.
  return SEED_VEHICLES.map((s) => mapEspoVehicle(normalizeSeedVehicle(s)))
    .filter((v) => v && ALLOWED_STATUSES.has(v.status));
}

export async function generateMetadata({ params }) {
  const { dealerId, vehicleSlug } = await params;
  const { vehicleId } = parseVehicleSlug(vehicleSlug);
  const dealerConfig = getFullDealerConfig(dealerId);
  const raw = await fetchVehicle(dealerId, vehicleId);
  if (!raw) return { title: 'Vehicle Not Found' };

  const v = mapEspoVehicle(raw);
  const title = `${v.y} ${v.mk} ${v.md}${v.trim ? ' ' + v.trim : ''}${dealerConfig ? ' — ' + dealerConfig.dealerName : ''}`;
  const description =
    v.description ||
    [v.mi ? `${v.mi.toLocaleString()} miles` : '', v.ext, v.tx, v.price ? `$${v.price.toLocaleString()}` : '']
      .filter(Boolean).join(' · ');

  const vehicleUrl = `${BASE_URL}/dealers/${dealerId}/inventory/${vehicleSlug}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: vehicleUrl,
      type: 'website',
      ...(v.img ? { images: [{ url: v.img, width: 1200, height: 630, alt: title }] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(v.img ? { images: [v.img] } : {}),
    },
  };
}

export default async function VehicleDetailPage({ params }) {
  const { dealerId, vehicleSlug } = await params;
  const { vehicleId } = parseVehicleSlug(vehicleSlug);
  const dealerConfig = getFullDealerConfig(dealerId);

  const [raw, inventory] = await Promise.all([
    fetchVehicle(dealerId, vehicleId),
    fetchInventoryList(dealerId),
  ]);

  if (!raw) notFound();

  const vehicle = mapEspoVehicle(raw);
  const vehicleUrl = `${BASE_URL}/dealers/${dealerId}/inventory/${vehicleSlug}`;

  const idx = inventory.findIndex((v) => v.id === vehicle.id);
  const prevSlug = idx > 0                    ? generateVehicleSlug(inventory[idx - 1]) : null;
  const nextSlug = idx < inventory.length - 1 ? generateVehicleSlug(inventory[idx + 1]) : null;

  return (
    <>
      <VehicleSchema vehicle={vehicle} dealerConfig={dealerConfig} vehicleUrl={vehicleUrl} />
      <VehicleDetailPageContent
        vehicle={vehicle}
        dealerConfig={dealerConfig}
        prevSlug={prevSlug}
        nextSlug={nextSlug}
        dealerId={dealerId}
      />
    </>
  );
}
