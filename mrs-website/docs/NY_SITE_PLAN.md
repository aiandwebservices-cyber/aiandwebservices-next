# NY Site Build Plan
**Target:** `mitigationrestorationservice.com/ny`  
**Pipedrive:** Same account as FL — differentiated by `location` field (florida=50, newYork=51)  
**Status:** Plan only — no code yet

---

## 1. Files Containing FL/Miami/South Florida References

Every file below contains location-specific content that requires a NY variant.

### Pages

| File | FL References |
|---|---|
| `app/layout.tsx` | Page title, meta description, OG tags, Schema.org LocalBusiness (address: Miramar FL 33025), areaServed list (all South FL counties/cities), phone (754) 777-8956, keywords |
| `app/page.tsx` | PHONE constant (754), "South Florida" in hero/sections, CITIES array (12 FL cities), testimonials citing Fort Lauderdale + Miami Beach, insurance language ("Florida's complex insurance market", "Citizens Insurance", "AOB"), Google Maps embed |
| `app/about/page.tsx` | "South Florida" throughout, "FL Mold Lic. #MRSR5155", "South Florida professionals", hurricane/humidity framing |
| `app/services/page.tsx` | "South Florida" in meta + copy, hurricane season framing, "King tide & flash flooding (South Florida specific)", lightning/brush fires, all tel: links use (754) |
| `app/faq/page.tsx` | "South Florida" in 8+ answers, FL insurance specifics (Citizens, AOB, HO-A), hurricane FAQ, Spanish-speaker note for Miami-Dade/Broward, city coverage list, (754) phone |
| `app/contact/page.tsx` | "South Florida" meta, service area listing (Palm Beach/Broward/Miami-Dade), Google Maps embed, (754) phone |

### Components

| File | FL References |
|---|---|
| `components/Header.tsx` | PHONE constant (754) 777-8956 |
| `components/Footer.tsx` | PHONE constant (754), address "11322 Miramar Pkwy, Miramar, FL 33025", "South Florida's trusted...", "Serving Palm Beach, Broward & Miami-Dade Counties", email Sam@mitigationrestorationservice.co.site, "FL Mold Lic. #MRSR5155" |
| `components/EmergencyForm.tsx` | Placeholder address "Fort Lauderdale, FL 33301" |

### API / Config

| File | FL References |
|---|---|
| `app/api/contact/route.ts` | `TO_EMAIL` hardcoded (Sam's email — same for NY), location defaults to `florida` unless `isNY` |
| `lib/pipedrive.ts` | `location` field defaults to `o.location.florida` (50) |

---

## 2. Location-Specific Phone Numbers, Addresses, Service Language

| Item | Current FL Value | NY Replacement Needed |
|---|---|---|
| Primary phone | (754) 777-8956 | NY phone number (TBD) |
| tel: href | `tel:+17547778956` | NY tel: href |
| Physical address | 11322 Miramar Pkwy, Miramar, FL 33025 | NY office address (TBD) |
| Service area description | Palm Beach / Broward / Miami-Dade | NYC boroughs / counties (TBD) |
| City list | Boca Raton, Fort Lauderdale, Miami... | NYC/NJ area cities |
| Insurance language | Citizens Insurance, AOB, HO-A, FL adjuster | NY-specific carriers, NY Insurance Law |
| License number | FL Mold Lic. #MRSR5155 | NY license (TBD) |
| Google Maps embed | South Florida map | NYC area map |
| Hurricane language | Hurricane season June–Nov, storm surge | Nor'easter, snowmelt, frozen pipes |
| "Se Habla Español" badge | Present | Keep or adjust for NY demographics |
| Schema.org address | Miramar, FL | NY address |

---

## 3. Proposed Route Structure for /ny

```
app/
  ny/
    layout.tsx          ← NY-specific metadata, Schema.org, wraps NY Header/Footer
    page.tsx            ← NY homepage (same sections, NYC content)
    contact/
      page.tsx          ← NY contact page with EmergencyForm (location=newYork)
    services/
      page.tsx          ← NY services page (nor'easter/frozen pipe framing)
    about/
      page.tsx          ← NY about page (NY team, NY license)
    faq/
      page.tsx          ← NY FAQ (NY insurance, NYC-specific questions)
```

All NY routes share the same Pipedrive pipeline. The form at `/ny/contact` sends
`location=newYork` so deals are tagged `Location: New York` (option ID 51).

---

## 4. Architecture: Shared Components vs Duplicated Pages

### Option A — Shared components + location prop (Recommended)

Extract all location-specific values into a `SiteConfig` object per location.
Components accept config as props or read from context.

```ts
// lib/site-config.ts
export type SiteConfig = {
  location: 'florida' | 'newYork';
  phone: string;
  phoneHref: string;
  address: string;
  serviceArea: string;
  cities: string[];
  mapsEmbedUrl: string;
  licenseLine: string;
  heroHeadline: string;
  heroSubhead: string;
  testimonials: { name: string; city: string; quote: string }[];
  faqItems: { q: string; a: string }[];
  insuranceLanguage: string;
};

export const FL_CONFIG: SiteConfig = { location: 'florida', phone: '(754) 777-8956', ... };
export const NY_CONFIG: SiteConfig = { location: 'newYork',  phone: '(XXX) XXX-XXXX', ... };
```

Pages become thin wrappers:
```tsx
// app/ny/page.tsx
import { NY_CONFIG } from '@/lib/site-config';
import HomePage from '@/components/pages/HomePage';
export default function NYPage() { return <HomePage config={NY_CONFIG} />; }
```

**Pros:**
- Single source of truth for all layout/component logic
- Bug fixes and design changes automatically apply to both sites
- Easy to add a third market later
- TypeScript enforces all config fields are provided

**Cons:**
- Upfront refactor of existing FL pages required (~1–2 days)
- Slightly more complex prop-drilling or context setup

### Option B — Fully duplicated page files

Copy all `app/*.tsx` files into `app/ny/`, find-and-replace FL content with NY content.

**Pros:**
- Zero refactor of existing code — FL site stays untouched
- Fast to ship first version of NY site

**Cons:**
- Every design/layout fix must be applied twice
- Will diverge over time — bugs fixed in FL won't be fixed in NY
- Doubles maintenance burden permanently

**Verdict: Option A is strongly preferred.** The FL pages are clean enough that extracting a `SiteConfig` is straightforward. The long-term maintenance cost of Option B is too high.

---

## 5. How /ny Form Sends location=newYork to the API

### Method: HTTP header on fetch (no query param leak into URLs)

In `EmergencyForm.tsx`, the `fetch('/api/contact', ...)` call needs to send the header
`x-site-location: ny` when rendered under the `/ny` route.

Recommended approach — pass a `location` prop to `EmergencyForm`:

```tsx
// components/EmergencyForm.tsx
export default function EmergencyForm({ location = 'florida' }: { location?: 'florida' | 'newYork' }) {
  // ...
  const res = await fetch("/api/contact", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(location === 'newYork' ? { "x-site-location": "ny" } : {}),
    },
    body: JSON.stringify(jsonPayload),
  });
```

Then in the NY contact page:
```tsx
// app/ny/contact/page.tsx
import EmergencyForm from '@/components/EmergencyForm';
export default function NYContactPage() {
  return <EmergencyForm location="newYork" />;
}
```

The existing `app/api/contact/route.ts` already reads `x-site-location` and maps it:
```ts
const isNY = locationHeader === 'ny' || locationParam === 'ny';
fields.location = isNY ? 'newYork' : 'florida';
```

No API changes needed. Pipedrive will tag the deal with `Location: New York` (option 51).

---

## 6. Build Order (when ready to implement)

1. Create `lib/site-config.ts` with `FL_CONFIG` (extract from existing pages)
2. Refactor FL pages to accept config — verify FL site still works
3. Fill in `NY_CONFIG` once NY phone/address/license details are confirmed
4. Create `app/ny/` route tree using NY config
5. Add `location` prop to `EmergencyForm`
6. Test end-to-end: submit NY form → verify Pipedrive deal has Location = New York

---

## 7. Outstanding Items Sam Needs to Confirm

- [ ] NY phone number
- [ ] NY office address
- [ ] NY service area (boroughs? counties? specific cities?)
- [ ] NY license number(s)
- [ ] NY-specific insurance carriers to mention in copy
- [ ] Sam's email address for NY leads (same or different inbox?)
- [ ] NY-specific testimonials
