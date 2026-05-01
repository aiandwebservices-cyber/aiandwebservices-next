# Dealer Platform — Refactor Notes

This directory is the white-label dealer-platform extracted from the two
monolithic samples (`app/samples/example005/page.jsx` ≈ 5,300 lines and
`app/samples/primo-admin/page.jsx` ≈ 7,000 lines) so it can be reused for
multiple dealer clients.

---

## Status (Phase 1 complete)

| Layer | Status |
|---|---|
| Directory structure | ✅ |
| Config system (`defaultConfig` + per-dealer overrides) | ✅ |
| Theme tokens + `ThemeProvider` | ✅ |
| Hooks: `useStorage`, `useTheme`, `usePaymentCalc`, `useScrollAnimation`, `useVinDecoder`, `useMakesModels`, `useFuelEconomy`, `useRecalls`, `useEspoCRM` | ✅ |
| Seed data (8 files) | ✅ |
| Shared atoms (17 files) | ✅ |
| `CustomerSite.jsx` composer (parametrized by config) | ✅ (with caveats — see below) |
| `AdminPanel.jsx` composer (parametrized by config) | ✅ (with caveats — see below) |
| Two working dealer routes (`primo`, `sunshine-motors`) | ✅ |
| Old `/samples/*` routes redirect to new `/dealers/*` | ✅ |

---

## What's still inline (planned for follow-up sessions)

### `CustomerSite.jsx` (5,300+ lines, single file)

The customer site composer holds all 35+ named per-section components inline:
`Hero`, `Fleet`, `FleetCard`, `BodyTypePicker`, `DetailDrawer`, `TradeIn`,
`Finance`, `Charter`, `Process`, `Voices`, `Alerts`, `Notebook`, `Contact`,
`Footer`, `QRBlock`, `TextUsButton`, `BeatPriceBadge`, `BeatPriceModal`,
`AIChatWidget`, `CompareModal`, `SavedPanel`, `DealWizard`, `CountersBlock`,
`Counter`, `WhyPreOwned`, `RecentlyViewed`, `ServiceSchedule`, `Warranty`,
`MeetTheTeam`, `ReserveModal`, `AccessibilityWidget`, `MobileCallButton`,
`SideRail`, `Ticker`, `Notebook`.

**Future work:** Extract each into its own file under `customer/`. The
`CustomerConfigContext` already wired at the top of `CustomerSite.jsx`
means each per-section file can drop in `const cfg = useCustomerConfig()`
without prop-drilling work.

### `AdminPanel.jsx` (7,000+ lines, single file)

Holds all 22+ admin tab components inline:
`DashboardTab`, `InventoryTab`, `VehicleFormTab`, `LeadsTab`, `DealsTab`,
`SoldTab`, `MarketingTab`, `SettingsTab`, `AppointmentsTab`, `PerformanceTab`,
`TasksTab`, `CustomersTab`, `ReportingTab`, plus modals (`ConfirmDialog`,
`HelpPanel`, `SearchPalette`, `NotificationDropdown`, `LicenseScannerModal`,
`CreditPreQualModal`, `MessagingPanel`).

**Future work:** Extract each into its own file under `admin/`. The
`AdminConfigContext` is already provided at the top of `AdminPanel.jsx` so
extracted tabs can use `useAdminConfig()` for dealer-specific values.

---

## What IS extracted and reusable today

### Atoms (`shared/`)

`Card`, `Button`, `IconButton`, `Field` (+ `Input`), `Select` (+ `Textarea`),
`Toggle`, `StatusBadge`, `SourceBadge`, `Toast` (+ `ToastProvider` +
`useToast`), `ConfirmDialog`, `Skeleton`, `EmptyState`, `Pagination`,
`BulkActionBar`, `VehiclePhoto`, `StatCard`, `Modal`.

These are real, working components that any future per-section extraction
can import. `CustomerSite.jsx` and `AdminPanel.jsx` themselves do **not**
yet consume these atoms — they still use inline implementations from when
they lived as monoliths. Migrating to the shared atoms is part of the
incremental extraction work.

### Hooks (`hooks/`)

All 9 hooks are real, full implementations:
- `useStorage(key, seed)` — `[value, setValue, { loaded }]` with auto-save
- `useTheme()` — re-exports from `ThemeProvider`
- `usePaymentCalc(creditTiers)` — auto-loan amortization
- `useScrollAnimation()` — IntersectionObserver fade-in
- `useVinDecoder()` — NHTSA vPIC decoder + 30-day cache
- `useAllMakes()`, `useModelsForMake(make)` — NHTSA makes/models + cache
- `useFuelEconomy({ year, make, model })` — fueleconomy.gov API
- `useRecalls({ year, make, model })` — NHTSA recalls API
- `useEspoCRM(config)` — EspoCRM REST client (typed CRUD per entity)

The composers (`CustomerSite.jsx`, `AdminPanel.jsx`) currently still embed
their own copies of the VIN/recalls/MPG fetch logic. Per-section extraction
should replace those embedded copies with imports from `hooks/`.

### Seed data (`data/`)

Pure data exports, no hardcoded `const TODAY` collisions:
- `seed-vehicles.js` — 8 vehicles
- `seed-leads.js` — 6 leads with timelines
- `seed-deals.js` — 1 active deal + `SEED_FNI_HISTORY`
- `seed-sold.js` — 2 sold vehicles
- `seed-appointments.js` — 4 active + 11 historical
- `seed-tasks.js` — 4 tasks + `SEED_RESERVATIONS` + `SEED_MESSAGES`
- `seed-reviews.js` — 3 Google reviews
- `seed-activity.js` — 10 activity log entries

Composers still use inline `const SEED_*` arrays (copies of the same data).
Replacing those inline arrays with imports from `data/` is mechanical and
risk-free — left for follow-up sessions.

---

## Per-dealer parametrization status

### Customer site (`CustomerSite.jsx`)

Parametrized via `CustomerConfigContext`:
- ✅ Hero giant background type — uses `dealerName.split(' ')[0]`
- ✅ SideRail logo letter + "PRIMO//MIA" slug → `dealerInitial//cityShort`
- ✅ SideRail bottom phone (tel: + display)
- ✅ Contact section: street address, city/state, hotline tel/display
- ✅ Contact section: Google Maps URL (uses configured address)
- ✅ Footer: giant dealer-name type, eyebrow city, copyright, tagline
- ✅ TextUsButton: sms link uses dealer phone + dealer name in body
- ✅ MobileCallButton: tel + display
- ✅ AIChatWidget: bot avatar letter + bot name (e.g. "SUNSHINE BOT")
- ✅ MeetTheTeam: tel + email links

**Still hardcoded "Primo" in inline helpers** (will be fixed in per-section
extraction):
- VTag labels ("THE PRIMO CHARTER", etc.)
- Charter section copy and testimonials
- Voices testimonial author names + body text
- I18N body copy mentioning "Miami"
- Various stylized eyebrow labels in deeper sections
- Trade-in form placeholder text

### Admin panel (`AdminPanel.jsx`)

Parametrized via `AdminConfigContext`:
- ✅ Storage keys: `${slug}-inventory`, `${slug}-leads`, etc. (12 keys)
- ✅ CSV download filenames: `${slug}-inventory.csv`, etc. (7 filenames)
- ✅ Topbar dealer-name display (3 locations, with `config.dealerName` fallback)
- ✅ SettingsTab "Locations" card uses live config
- ✅ `buildSeedSettings(config)` produces dealer-specific defaults on first load
  (overlays config.dealerName/address/phone/email/branding onto base)

**Still hardcoded "Primo" in inline helpers**:
- Deep tab content (e.g., specific lead notes mentioning Miami)
- Pre-populated message thread for Carlos Mendez (`SEED_MESSAGES.l5`)
- Service appointment customer names
- TEAM_MEMBERS const (inline in AdminPanel, should derive from `config.team`)
- Pre-populated tasks reference Carlos Rivera et al.

These are demo/seed values, not structural — per-section extraction can
simply replace the inline arrays with the correct seed-data imports.

---

## How to add a new dealer in 5 minutes

1. Create `app/dealers/<slug>/config.js`:

   ```js
   import { defaultConfig } from '@/lib/dealer-platform/config/default-config';

   export const config = {
     ...defaultConfig,
     dealerName: 'My Auto Group',
     dealerSlug: 'my-auto',
     phone: '(555) 555-0123',
     address: { street: '...', city: '...', state: '..', zip: '....' },
     colors: { ...defaultConfig.colors, primary: '#YOURBRAND' },
     espocrm: { url: 'https://my-crm.example', apiKey: '...' },
   };
   ```

2. Create `app/dealers/<slug>/page.jsx`:

   ```jsx
   'use client';
   import { config } from './config';
   import { CustomerSite } from '@/lib/dealer-platform/customer/CustomerSite';

   export default function MyDealerPage() {
     return <CustomerSite config={config} />;
   }
   ```

3. Create `app/dealers/<slug>/admin/page.jsx`:

   ```jsx
   'use client';
   import { config } from '../config';
   import { AdminPanel } from '@/lib/dealer-platform/admin/AdminPanel';

   export default function MyAdminPage() {
     return <AdminPanel config={config} />;
   }
   ```

4. Create `app/dealers/<slug>/layout.jsx` — copy from `primo/layout.jsx` and
   change the `import { config } from './config';` reference if needed.

That's it. Visit `/dealers/<slug>` and `/dealers/<slug>/admin`.

---

## Verified working (this session)

- `/dealers/primo` → 200 (Primo customer site, gold/red Primo branding)
- `/dealers/primo/admin` → 200 (admin panel, "Primo Auto Group" in topbar)
- `/dealers/sunshine-motors` → 200 (renders "SUNSHINE", "Tampa", "813.555.0299")
- `/dealers/sunshine-motors/admin` → 200 ("Sunshine Motors" in topbar, separate
  storage keys so its data is isolated from Primo's)
- `/samples/example005` → 307 redirect to `/dealers/primo`
- `/samples/primo-admin` → 307 redirect to `/dealers/primo/admin`

---

## Original monoliths

Preserved at:
- `app/samples/example005/page.original.jsx.txt` (5,253 lines)
- `app/samples/primo-admin/page.original.jsx.txt` (7,023 lines)

Renamed `.txt` so Next.js doesn't try to compile them as routes. They are
the canonical reference for what features must exist post-extraction.
