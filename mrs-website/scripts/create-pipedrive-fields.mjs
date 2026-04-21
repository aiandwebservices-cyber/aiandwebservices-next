import { readFileSync } from 'fs';

const envFile = readFileSync('/home/lina/aiandwebservices-next/mrs-website/.env.local', 'utf8');
const TOKEN = envFile.match(/PIPEDRIVE_API_TOKEN=(.+)/)?.[1]?.trim();
if (!TOKEN) throw new Error('PIPEDRIVE_API_TOKEN not found in .env.local');

const BASE = 'https://mitigationrestorationservices.pipedrive.com/v1';

async function createField(endpoint, body) {
  const res = await fetch(`${BASE}${endpoint}?api_token=${TOKEN}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (!json.success) throw new Error(`Failed to create field "${body.name}": ${JSON.stringify(json)}`);
  return json.data;
}

function enumOptions(labels) {
  return labels.map(label => ({ label }));
}

// --- Deal fields ---
const dealFieldDefs = [
  { name: 'Service Type',      field_type: 'enum', options: enumOptions(['Water Damage','Fire Damage','Mold Remediation','Storm Damage','Biohazard Cleanup','Other']) },
  { name: 'Emergency Level',   field_type: 'enum', options: enumOptions(['Emergency - Immediate Response','Urgent - Within 24hrs','Standard - Within 48hrs']) },
  { name: 'Insurance Claim',   field_type: 'enum', options: enumOptions(['Yes','No','Unknown']) },
  { name: 'Insurance Carrier', field_type: 'varchar' },
  { name: 'Claim Number',      field_type: 'varchar' },
  { name: 'Property Type',     field_type: 'enum', options: enumOptions(['Residential','Commercial','Multi-Family','Industrial']) },
  { name: 'Property Address',  field_type: 'varchar' },
  { name: 'Lead Source',       field_type: 'enum', options: enumOptions(['Website Form','Phone Call','Referral','Google','Facebook','Other']) },
  { name: 'Location',          field_type: 'enum', options: enumOptions(['Florida','New York']) },
  { name: 'UTM Source',        field_type: 'varchar' },
  { name: 'UTM Medium',        field_type: 'varchar' },
  { name: 'UTM Campaign',      field_type: 'varchar' },
];

// --- Person fields ---
const personFieldDefs = [
  { name: 'Preferred Contact Method', field_type: 'enum', options: enumOptions(['Phone','Text','Email']) },
  { name: 'Best Time to Contact',     field_type: 'enum', options: enumOptions(['Morning 8am-12pm','Afternoon 12pm-5pm','Evening 5pm-8pm','Anytime']) },
  { name: 'Lead Source Detail',       field_type: 'varchar' },
];

// Logical key map (name → camelCase key for our JSON)
const dealKeyMap = {
  'Service Type':      'serviceType',
  'Emergency Level':   'emergencyLevel',
  'Insurance Claim':   'insuranceClaim',
  'Insurance Carrier': 'insuranceCarrier',
  'Claim Number':      'claimNumber',
  'Property Type':     'propertyType',
  'Property Address':  'propertyAddress',
  'Lead Source':       'leadSource',
  'Location':          'location',
  'UTM Source':        'utmSource',
  'UTM Medium':        'utmMedium',
  'UTM Campaign':      'utmCampaign',
};
const personKeyMap = {
  'Preferred Contact Method': 'preferredContactMethod',
  'Best Time to Contact':     'bestTimeToContact',
  'Lead Source Detail':       'leadSourceDetail',
};

// Option label → camelCase key helpers
function toCamel(label) {
  return label
    .replace(/[^a-zA-Z0-9 ]/g, '')
    .split(' ')
    .filter(Boolean)
    .map((w, i) => i === 0 ? w.toLowerCase() : w[0].toUpperCase() + w.slice(1).toLowerCase())
    .join('');
}

console.error('Creating deal fields...');
const dealResults = {};
for (const def of dealFieldDefs) {
  process.stderr.write(`  POST dealFields: ${def.name} ... `);
  const data = await createField('/dealFields', def);
  dealResults[def.name] = data;
  process.stderr.write(`key=${data.key}\n`);
}

console.error('Creating person fields...');
const personResults = {};
for (const def of personFieldDefs) {
  process.stderr.write(`  POST personFields: ${def.name} ... `);
  const data = await createField('/personFields', def);
  personResults[def.name] = data;
  process.stderr.write(`key=${data.key}\n`);
}

// Build output JSON
const fieldsObj = { deal: {}, person: {} };
const optionsObj = {};

for (const [name, logicalKey] of Object.entries(dealKeyMap)) {
  const data = dealResults[name];
  fieldsObj.deal[logicalKey] = data.key;
  if (data.options?.length) {
    optionsObj[logicalKey] = {};
    for (const opt of data.options) {
      optionsObj[logicalKey][toCamel(opt.label)] = opt.id;
    }
  }
}

for (const [name, logicalKey] of Object.entries(personKeyMap)) {
  const data = personResults[name];
  fieldsObj.person[logicalKey] = data.key;
  if (data.options?.length) {
    optionsObj[logicalKey] = {};
    for (const opt of data.options) {
      optionsObj[logicalKey][toCamel(opt.label)] = opt.id;
    }
  }
}

const output = {
  apiToken: 'REDACTED',
  domain: 'mitigationrestorationservices',
  baseUrlV1: 'https://mitigationrestorationservices.pipedrive.com/v1',
  baseUrlV2: 'https://mitigationrestorationservices.pipedrive.com/api/v2',
  fields: fieldsObj,
  options: optionsObj,
  stages: {
    newLead:            6,
    contactedQualified: 5,
    onSiteScheduled:    7,
    assessmentComplete: 8,
    proposalSent:       11,
    insuranceFiled:     10,
    contractSigned:     9,
    jobInProgress:      12,
    jobComplete:        13,
    lost:               14,
  },
  pipeline: { id: 1 },
};

console.log(JSON.stringify(output, null, 2));
