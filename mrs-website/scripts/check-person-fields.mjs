import { readFileSync } from 'fs';

const envFile = readFileSync('/home/lina/aiandwebservices-next/mrs-website/.env.local', 'utf8');
const TOKEN = envFile.match(/PIPEDRIVE_API_TOKEN=(.+)/)?.[1]?.trim();
if (!TOKEN) throw new Error('PIPEDRIVE_API_TOKEN not found in .env.local');

const res = await fetch(`https://mitigationrestorationservice.pipedrive.com/v1/personFields?api_token=${TOKEN}`);
const json = await res.json();
if (!json.success) throw new Error(`API error: ${JSON.stringify(json)}`);

console.log('\n--- ALL PERSON FIELDS (key | edit_flag | name) ---');
for (const f of json.data) {
  console.log(`  ${f.key}  edit_flag=${f.edit_flag}  "${f.name}"`);
}

const targets = {
  '79e6dc6fd9b169281b8fb1b6641eae3dcc0cc16e': 'preferredContactMethod',
  '7469996a21100ac00a1dd4264e813a268a6a1861': 'bestTimeToContact',
  '89497beae938da1d35e1bdc587a3661207fc685e': 'leadSourceDetail',
};

console.log('\n--- TARGET KEY CHECK ---');
const allKeys = new Set(json.data.map(f => f.key));
for (const [key, label] of Object.entries(targets)) {
  const found = allKeys.has(key);
  console.log(`  ${found ? '✅ FOUND' : '❌ NOT FOUND'}  ${label}  (${key})`);
}

const custom = json.data.filter(f => f.edit_flag === true);
console.log('\n--- CUSTOM FIELDS THAT EXIST (edit_flag=true) ---');
for (const f of custom) {
  console.log(`  key: ${f.key}  name: "${f.name}"  type: ${f.field_type}`);
  if (f.options?.length) {
    for (const o of f.options) console.log(`    option: ${o.id} = "${o.label}"`);
  }
}
