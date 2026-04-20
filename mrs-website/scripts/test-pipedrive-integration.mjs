import { readFileSync } from 'fs';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const envFile = readFileSync('/home/lina/aiandwebservices-next/mrs-website/.env.local', 'utf8');
const TOKEN = envFile.match(/PIPEDRIVE_API_TOKEN=(.+)/)?.[1]?.trim();
if (!TOKEN) throw new Error('PIPEDRIVE_API_TOKEN not found in .env.local');

const DOMAIN = 'mitigationrestorationservice';
const BASE = `https://${DOMAIN}.pipedrive.com/v1`;
const fields = require('../lib/pipedrive-fields.json');
const f = fields.fields;
const o = fields.options;

function url(path) { return `${BASE}${path}?api_token=${TOKEN}`; }
function redact(u) { return u.replace(TOKEN, 'REDACTED'); }

async function call(method, path, body) {
  const opts = { method, headers: { 'Content-Type': 'application/json' } };
  if (body) opts.body = JSON.stringify(body);
  console.log(`\n→ ${method} ${redact(url(path))}`);
  if (body) console.log('  body:', JSON.stringify(body, null, 2));
  const res = await fetch(url(path), opts);
  const json = await res.json();
  console.log(`  HTTP ${res.status} — success:${json.success}${json.error ? ' error:' + json.error : ''}`);
  return { ok: json.success, data: json.data, raw: json };
}

let pass = 0; let fail = 0;
function report(label, ok, note = '') {
  if (ok) { console.log(`✅ PASS: ${label}${note ? ' — ' + note : ''}`); pass++; }
  else     { console.log(`❌ FAIL: ${label}${note ? ' — ' + note : ''}`); fail++; }
}

// ─── PHASE 0: Field key verification ────────────────────────────────────────
console.log('\n════ PHASE 0: Live field key verification ════');
const dfRes = await fetch(url('/dealFields'));
const dfJson = await dfRes.json();
const liveKeys = new Set(dfJson.data.map(f => f.key));
for (const [name, key] of Object.entries(f.deal)) {
  report(`deal field "${name}"`, liveKeys.has(key), key.slice(0,8) + '...');
}
const pfRes = await fetch(url('/personFields'));
const pfJson = await pfRes.json();
const livePKeys = new Set(pfJson.data.map(f => f.key));
for (const [name, key] of Object.entries(f.person)) {
  report(`person field "${name}"`, livePKeys.has(key), key.slice(0,8) + '...');
}

// ─── PHASE 1: POST /persons ──────────────────────────────────────────────────
console.log('\n════ PHASE 1: POST /persons ════');
const s1 = await call('POST', '/persons', {
  name: 'TEST LEAD - full diagnostic',
  phone: [{ value: '3055550001', primary: true, label: 'mobile' }],
  email: [{ value: 'test@diagnostic.local', primary: true, label: 'work' }],
});
report('POST /persons', s1.ok, s1.ok ? `id=${s1.data?.id}` : s1.raw.error);
const personId = s1.data?.id;

// ─── PHASE 2: PUT /persons/:id (all person custom fields) ───────────────────
console.log('\n════ PHASE 2: PUT /persons/:id (all custom fields) ════');
const personCustom = {
  [f.person.preferredContactMethod]: o.preferredContactMethod.phone,      // 52
  [f.person.bestTimeToContact]:      o.bestTimeToContact.anytime,          // 58
  [f.person.leadSourceDetail]:       'https://mitigationrestorationservice.com/test',
};
const s2 = await call('PUT', `/persons/${personId}`, personCustom);
report('PUT /persons/:id', s2.ok, s2.ok ? 'custom fields set' : s2.raw.error);

// Verify person custom fields were saved
if (s2.ok) {
  const pData = s2.data;
  report('person.preferredContactMethod saved', String(pData[f.person.preferredContactMethod]) === String(o.preferredContactMethod.phone));
  report('person.bestTimeToContact saved',      String(pData[f.person.bestTimeToContact])      === String(o.bestTimeToContact.anytime));
  report('person.leadSourceDetail saved',       pData[f.person.leadSourceDetail] !== null);
}

// ─── PHASE 3: POST /deals (full payload, all custom fields) ─────────────────
console.log('\n════ PHASE 3: POST /deals (full payload) ════');
const fullDeal = {
  title: 'Water Damage - 123 Test St, Miami FL',
  person_id: personId,
  stage_id: fields.stages.newLead,
  pipeline_id: fields.pipeline.id,
  [f.deal.serviceType]:     o.serviceType.waterDamage,               // 28
  [f.deal.emergencyLevel]:  o.emergencyLevel.emergencyImmediateResponse, // 34
  [f.deal.propertyType]:    o.propertyType.residential,              // 40
  [f.deal.propertyAddress]: '123 Test St, Miami FL 33101',
  [f.deal.insuranceClaim]:  o.insuranceClaim.yes,                    // 37
  [f.deal.insuranceCarrier]:'Citizens Insurance',
  [f.deal.leadSource]:      o.leadSource.websiteForm,                // 44
  [f.deal.location]:        o.location.florida,                      // 50
  [f.deal.utmSource]:       'google',
  [f.deal.utmMedium]:       'cpc',
  [f.deal.utmCampaign]:     'water-damage-miami',
};
const s3 = await call('POST', '/deals', fullDeal);
report('POST /deals', s3.ok, s3.ok ? `id=${s3.data?.id}` : s3.raw.error);
const dealId = s3.data?.id;

// Verify deal custom fields were saved
if (s3.ok) {
  const d = s3.data;
  report('deal.serviceType saved',     d[f.deal.serviceType]     !== null);
  report('deal.emergencyLevel saved',  d[f.deal.emergencyLevel]  !== null);
  report('deal.propertyType saved',    d[f.deal.propertyType]    !== null);
  report('deal.propertyAddress saved', d[f.deal.propertyAddress] !== null);
  report('deal.insuranceClaim saved',  d[f.deal.insuranceClaim]  !== null);
  report('deal.insuranceCarrier saved',d[f.deal.insuranceCarrier]!== null);
  report('deal.leadSource saved',      d[f.deal.leadSource]      !== null);
  report('deal.location saved',        d[f.deal.location]        !== null);
  report('deal.utmSource saved',       d[f.deal.utmSource]       !== null);
  report('deal.utmMedium saved',       d[f.deal.utmMedium]       !== null);
  report('deal.utmCampaign saved',     d[f.deal.utmCampaign]     !== null);
}

// ─── PHASE 4: POST /notes (comprehensive note) ──────────────────────────────
console.log('\n════ PHASE 4: POST /notes (comprehensive note) ════');
const noteContent = [
  'MRS Lead Submission', '---',
  'Name: TEST LEAD - full diagnostic',
  'Phone: (305) 555-0001',
  'Email: test@diagnostic.local',
  'Property Address: 123 Test St, Miami FL 33101',
  'Property Type: Residential',
  'Damage Types: Water Damage, Mold',
  'Urgency: emergency',
  'Insurance Claim: Yes',
  'Insurance Company: Citizens Insurance',
  'Damage Time: Today',
  'Area Size: Medium (multiple rooms)',
  'Description: Pipe burst in kitchen, water spreading to living room.',
  'Preferred Contact: Phone Call',
  'Best Time to Contact: ASAP',
  'Location: florida',
  '---',
  'UTM Source: google',
  'UTM Medium: cpc',
  'UTM Campaign: water-damage-miami',
  'Source URL: https://mitigationrestorationservice.com/emergency',
  '---',
].join('\n');

const s4 = await call('POST', '/notes', { content: noteContent, deal_id: dealId });
report('POST /notes', s4.ok, s4.ok ? `note id=${s4.data?.id}` : s4.raw.error);

// Verify note is attached to correct deal
if (s4.ok) {
  report('note attached to deal', s4.data?.deal_id === dealId);
  report('note has full content', s4.data?.content?.includes('Damage Time:') && s4.data?.content?.includes('UTM Source:'));
}

// ─── SUMMARY ─────────────────────────────────────────────────────────────────
console.log(`\n════ SUMMARY: ${pass} passed, ${fail} failed ════`);
if (dealId) console.log(`🔗 Deal: https://${DOMAIN}.pipedrive.com/deal/${dealId}`);
if (fail > 0) process.exit(1);
