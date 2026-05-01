/**
 * VehicleSchema — emits a Schema.org Vehicle/Car JSON-LD block.
 * Safe to render in both Server and Client component trees (no hooks).
 */
export function VehicleSchema({ vehicle: v, dealerConfig, vehicleUrl }) {
  if (!v) return null;

  const name = [v.y || v.year, v.mk || v.make, v.md || v.model, v.trim]
    .filter(Boolean)
    .join(' ');

  const bodyLower = (v.body || v.bodyStyle || '').toLowerCase();
  const isCar = /car|sedan|coupe|convertible|hatchback|wagon/.test(bodyLower);

  const schema = {
    '@context': 'https://schema.org',
    '@type': isCar ? 'Car' : 'Vehicle',
    name,
    brand: { '@type': 'Brand', name: v.mk || v.make || '' },
    model: v.md || v.model || '',
    vehicleModelDate: String(v.y || v.year || ''),
    mileageFromOdometer: {
      '@type': 'QuantitativeValue',
      value: v.mi ?? v.mileage ?? 0,
      unitCode: 'SMI',
    },
    color: v.ext || v.exteriorColor || '',
    vehicleTransmission: v.tx || v.transmission || '',
    fuelType: v.fuelType || '',
    offers: {
      '@type': 'Offer',
      price: v.price ?? 0,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'AutoDealer',
        name: dealerConfig?.dealerName || '',
        ...(dealerConfig?.address?.street
          ? {
              address: {
                '@type': 'PostalAddress',
                streetAddress: dealerConfig.address.street,
                addressLocality: dealerConfig.address.city || '',
                addressRegion: dealerConfig.address.state || '',
                postalCode: dealerConfig.address.zip || '',
                addressCountry: 'US',
              },
            }
          : {}),
      },
    },
  };

  if (v.img || (v.imgs && v.imgs[0])) schema.image = v.img || v.imgs[0];
  if (vehicleUrl) schema.url = vehicleUrl;
  if (v.description) schema.description = v.description;

  // Only include VIN if dealer config does not explicitly disable public VIN display.
  if (v.vin && dealerConfig?.features?.publicVin !== false) {
    schema.vehicleIdentificationNumber = v.vin;
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
