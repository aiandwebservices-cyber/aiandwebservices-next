import { notFound } from 'next/navigation';
import { espoFetch, getDealerConfig } from '@/app/api/dealer/_lib/espocrm';
import { getFullDealerConfig } from '@/lib/dealer-platform/config/server-registry';
import { mapEspoVehicle, ALLOWED_STATUSES } from '@/lib/dealer-platform/customer/InventoryGrid';
import { VehicleSchema } from '@/lib/dealer-platform/customer/VehicleSchema';
import { generateVehicleSlug, parseVehicleSlug } from '@/lib/dealer-platform/customer/utils';
import { VehicleDetailPageContent } from '@/lib/dealer-platform/customer/VehicleDetailPageContent';

const BASE_URL = 'https://lotpilot.ai';

async function fetchVehicle(dealerId, vehicleId) {
  const apiCfg = getDealerConfig(dealerId);
  if (!apiCfg) return null;
  const result = await espoFetch(
    'GET',
    `/api/v1/CVehicle/${encodeURIComponent(vehicleId)}`,
    null,
    apiCfg,
  );
  return result.ok ? result.data : null;
}

async function fetchInventoryList(dealerId) {
  const apiCfg = getDealerConfig(dealerId);
  if (!apiCfg) return [];
  const result = await espoFetch(
    'GET',
    '/api/v1/CVehicle?orderBy=dateAdded&order=desc',
    null,
    apiCfg,
  );
  if (!result.ok) return [];
  const list = Array.isArray(result.data?.list) ? result.data.list : [];
  return list.map(mapEspoVehicle).filter((v) => v && ALLOWED_STATUSES.has(v.status));
}

export async function generateMetadata({ params }) {
  const { dealerId, vehicleSlug } = await params;
  const { vehicleId } = parseVehicleSlug(vehicleSlug);
  const dealerConfig = getFullDealerConfig(dealerId);
  const raw = await fetchVehicle(dealerId, vehicleId);
  if (!raw) return { title: 'Vehicle Not Found' };

  const v = mapEspoVehicle(raw);
  const year  = v.y  || v.year;
  const make  = v.mk || v.make;
  const model = v.md || v.model;
  const title = `${year} ${make} ${model}${v.trim ? ' ' + v.trim : ''}${dealerConfig ? ' — ' + dealerConfig.dealerName : ''}`;
  const description =
    v.description ||
    `${v.mi ? v.mi.toLocaleString() + ' miles · ' : ''}${v.ext ? v.ext + ' · ' : ''}${v.tx || ''}${v.price ? ' · $' + v.price.toLocaleString() : ''}`.replace(/^·\s*/, '').trim();

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
