const TOKEN = 'ea44d38d3bebd0715e620dc62fd2709eb895c5bc';
const BASE  = 'https://mitigationrestorationservices.pipedrive.com/v1';

async function get(path) {
  const res = await fetch(`${BASE}${path}?api_token=${TOKEN}`);
  const json = await res.json();
  if (!json.success) throw new Error(`API error on ${path}: ${JSON.stringify(json)}`);
  return json.data;
}

const SYSTEM_FIELD_TYPES = new Set(['varchar', 'text', 'double', 'monetary', 'date', 'int']);

function isCustom(field) {
  return field.edit_flag === true || !SYSTEM_FIELD_TYPES.has(field.field_type);
}

function fmtOptions(field) {
  if (!field.options || field.options.length === 0) return '';
  return '\n    options: ' + field.options.map(o => `${o.id}="${o.label}"`).join(', ');
}

const [pipelines, stages, dealFields, personFields] = await Promise.all([
  get('/pipelines'),
  get('/stages'),
  get('/dealFields'),
  get('/personFields'),
]);

console.log('\n--- PIPELINES ---');
for (const p of pipelines) {
  console.log(`  ${p.id} | ${p.name}`);
}

console.log('\n--- STAGES ---');
for (const s of stages) {
  console.log(`  ${s.id} | pipeline:${s.pipeline_id} | ${s.name}`);
}

console.log('\n--- DEAL FIELDS (custom only) ---');
for (const f of dealFields.filter(isCustom)) {
  console.log(`  key: ${f.key}`);
  console.log(`  name: ${f.name}`);
  console.log(`  type: ${f.field_type}${fmtOptions(f)}`);
  console.log('');
}

console.log('--- PERSON FIELDS (custom only) ---');
for (const f of personFields.filter(isCustom)) {
  console.log(`  key: ${f.key}`);
  console.log(`  name: ${f.name}`);
  console.log(`  type: ${f.field_type}${fmtOptions(f)}`);
  console.log('');
}
