// GET /api/dealer/{dealerId}/vehicle-history?make=&model=&year=&vin=
//
// Aggregates NHTSA Complaints + NHTSA Recalls into a single trust signal
// payload for the admin VehicleForm. Both upstream APIs are public/free.
//
// Returns: { ok, complaints, recalls, riskLevel }
// Failure mode: returns 200 with ok:false + best-effort partial data so
// the UI can still render gracefully.

const TIMEOUT_MS = 6000;

async function fetchWithTimeout(url, ms = TIMEOUT_MS) {
  const ctl = new AbortController();
  const id = setTimeout(() => ctl.abort(), ms);
  try {
    const res = await fetch(url, { signal: ctl.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(id);
  }
}

const COMPLAINT_CATEGORIES = [
  { key: 'engine',        match: /engine|powertrain|motor/i },
  { key: 'brakes',        match: /brake/i },
  { key: 'electrical',    match: /electrical|electronic|wiring|battery/i },
  { key: 'transmission',  match: /transmission|drivetrain|axle/i },
  { key: 'steering',      match: /steering|suspension|wheel/i },
  { key: 'airbag',        match: /air ?bag|seat ?belt|restraint/i },
  { key: 'fuel',          match: /fuel|gas tank/i },
  { key: 'visibility',    match: /window|wiper|mirror|lighting|lamp/i },
  { key: 'structure',     match: /structure|body|frame|exterior/i },
];

function categorize(component) {
  const c = String(component || '');
  for (const cat of COMPLAINT_CATEGORIES) {
    if (cat.match.test(c)) return cat.key;
  }
  return 'other';
}

function riskOf(total) {
  if (total < 5) return 'low';
  if (total < 15) return 'medium';
  return 'high';
}

export async function GET(req, { params }) {
  const { dealerId } = await params;
  const { searchParams } = new URL(req.url);
  const year  = searchParams.get('year');
  const make  = searchParams.get('make');
  const model = searchParams.get('model');

  if (!year || !make || !model) {
    return Response.json(
      { ok: false, error: 'year, make, and model are required' },
      { status: 400 }
    );
  }

  const cmpUrl = `https://api.nhtsa.gov/complaints/complaintsByVehicle?make=${encodeURIComponent(make)}&model=${encodeURIComponent(model)}&modelYear=${encodeURIComponent(year)}`;
  const recUrl = `https://api.nhtsa.gov/recalls/recallsByVehicle?make=${encodeURIComponent(make)}&model=${encodeURIComponent(model)}&modelYear=${encodeURIComponent(year)}`;

  const [cmpRes, recRes] = await Promise.allSettled([
    fetchWithTimeout(cmpUrl),
    fetchWithTimeout(recUrl),
  ]);

  const complaintItems = cmpRes.status === 'fulfilled' && Array.isArray(cmpRes.value?.results)
    ? cmpRes.value.results
    : [];
  const recallItems = recRes.status === 'fulfilled' && Array.isArray(recRes.value?.results)
    ? recRes.value.results
    : [];

  const categories = {};
  for (const c of complaintItems) {
    const cat = categorize(c.components || c.component || '');
    categories[cat] = (categories[cat] || 0) + 1;
  }

  const total = complaintItems.length;
  return Response.json({
    ok: true,
    dealerId,
    vehicle: { year: Number(year), make, model },
    complaints: { total, categories },
    recalls: {
      total: recallItems.length,
      items: recallItems.slice(0, 10).map(r => ({
        campaign: r.NHTSACampaignNumber || r.CampaignNumber || '—',
        component: r.Component || '',
        summary: (r.Summary || '').slice(0, 240),
      })),
    },
    riskLevel: riskOf(total),
    fetchedAt: new Date().toISOString(),
    upstreamErrors: {
      complaints: cmpRes.status === 'rejected' ? String(cmpRes.reason?.message || cmpRes.reason) : null,
      recalls:    recRes.status === 'rejected' ? String(recRes.reason?.message || recRes.reason) : null,
    },
  });
}
