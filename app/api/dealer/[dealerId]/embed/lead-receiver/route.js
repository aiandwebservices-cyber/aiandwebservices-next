import {
  espoFetch,
  getDealerConfig,
  isValidEmail,
  normalizePhone,
  phoneNumberData,
} from '../../../_lib/espocrm.js';
import { notifyDealer } from '../../../_lib/notify.js';

// Accept-anything lead webhook for dealers' existing contact forms.
// The dealer drops their <form action="…/embed/lead-receiver"> onto a third-
// party site; we accept either application/json or
// application/x-www-form-urlencoded, normalize the input, and create a Lead
// in EspoCRM.

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function bad(error, status = 400) {
  return Response.json({ ok: false, error }, { status, headers: CORS });
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS });
}

// Pull a value from the body using a list of possible keys (case-insensitive).
function pick(body, ...keys) {
  for (const k of keys) {
    const direct = body[k];
    if (direct != null && String(direct).trim() !== '') return String(direct).trim();
  }
  // Try case-insensitive fallback.
  const lower = {};
  for (const k of Object.keys(body)) lower[k.toLowerCase()] = body[k];
  for (const k of keys) {
    const v = lower[k.toLowerCase()];
    if (v != null && String(v).trim() !== '') return String(v).trim();
  }
  return '';
}

function splitName(full) {
  const parts = String(full || '').trim().split(/\s+/);
  if (parts.length === 0) return { firstName: '', lastName: '' };
  if (parts.length === 1) return { firstName: parts[0], lastName: '' };
  return { firstName: parts[0], lastName: parts.slice(1).join(' ') };
}

async function readBody(req) {
  const ct = (req.headers.get('content-type') || '').toLowerCase();
  if (ct.includes('application/json')) {
    try { return await req.json(); } catch { return null; }
  }
  if (ct.includes('application/x-www-form-urlencoded') || ct.includes('multipart/form-data')) {
    try {
      const fd = await req.formData();
      const out = {};
      for (const [k, v] of fd.entries()) out[k] = typeof v === 'string' ? v : '';
      return out;
    } catch { return null; }
  }
  // Last-ditch: try JSON, then URL-encoded text.
  try {
    const text = await req.text();
    if (!text) return {};
    if (text.trim().startsWith('{')) {
      try { return JSON.parse(text); } catch { /* fall through */ }
    }
    const out = {};
    new URLSearchParams(text).forEach((v, k) => { out[k] = v; });
    return out;
  } catch {
    return null;
  }
}

export async function POST(req, { params }) {
  const { dealerId } = await params;
  const dealerConfig = getDealerConfig(dealerId);
  if (!dealerConfig) return bad(`Unknown dealer: ${dealerId}`, 404);

  const body = await readBody(req);
  if (!body || typeof body !== 'object') return bad('Could not parse request body');

  // Honeypot: if a hidden field commonly used by spam bots is filled, drop silently.
  if (pick(body, 'website', '_gotcha', 'honeypot')) {
    return Response.json({ ok: true, leadId: null, message: 'Received' }, { headers: CORS });
  }

  // Normalize identity fields.
  let firstName = pick(body, 'firstName', 'first_name', 'fname');
  let lastName  = pick(body, 'lastName',  'last_name',  'lname');
  if (!firstName) {
    const full = pick(body, 'name', 'fullName', 'full_name', 'customerName');
    if (full) ({ firstName, lastName } = splitName(full));
  }

  const email = pick(body, 'email', 'emailAddress', 'email_address');
  const phoneRaw = pick(body, 'phone', 'phoneNumber', 'phone_number', 'tel', 'mobile');
  const message = pick(body, 'message', 'comments', 'notes', 'inquiry', 'description');
  const vehicleOfInterest = pick(body, 'vehicle', 'vehicleOfInterest', 'vehicle_of_interest', 'interest', 'stockNumber');
  const sourceHint = pick(body, 'source', 'leadSource', 'origin') || 'website_form';

  if (!firstName) return bad('Name is required');
  if (!email && !phoneRaw) return bad('Email or phone is required');
  if (email && !isValidEmail(email)) return bad('Email is not valid');
  if (phoneRaw && !normalizePhone(phoneRaw)) return bad('Phone must contain at least 10 digits');

  // Build EspoCRM Lead payload.
  const payload = {
    firstName,
    lastName: lastName || '',
    cLeadSource: 'Contact', // EspoCRM lead-source enum value
    status: 'New',
  };
  if (email) payload.emailAddress = email;
  if (phoneRaw) {
    const phoneData = phoneNumberData(phoneRaw);
    if (phoneData) payload.phoneNumberData = phoneData;
  }
  if (vehicleOfInterest) payload.cVehicleOfInterest = vehicleOfInterest;
  if (message) payload.description = message;

  const result = await espoFetch('POST', '/api/v1/Lead', payload, dealerConfig);
  if (!result.ok) {
    return Response.json(
      { ok: false, error: result.error || 'EspoCRM rejected the lead' },
      { status: 502, headers: CORS },
    );
  }

  const leadId = result.data?.id || null;

  // Fire-and-forget n8n notification — never blocks the response.
  notifyDealer({
    type: 'new_lead',
    dealerId,
    leadId,
    source: sourceHint,
    customerName: `${firstName} ${lastName || ''}`.trim(),
    customerEmail: email,
    customerPhone: phoneRaw,
    vehicleOfInterest,
    message,
    capturedAt: new Date().toISOString(),
  });

  return Response.json(
    {
      ok: true,
      leadId,
      message: 'Lead received — LotPilot AI will follow up',
    },
    { headers: CORS },
  );
}
