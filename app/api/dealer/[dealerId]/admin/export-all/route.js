import { getDealerConfig, espoFetch } from '../../../_lib/espocrm.js';

// ── CSV helpers ────────────────────────────────────────────────────────────────

function csvEscape(v) {
  if (v === null || v === undefined) return '';
  const s = String(v);
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function toCsv(rows) {
  if (!rows || rows.length === 0) return '';
  const keys = Object.keys(rows[0]);
  const header = keys.map(csvEscape).join(',');
  const lines = rows.map((r) => keys.map((k) => csvEscape(r[k])).join(','));
  return [header, ...lines].join('\n');
}

// ── Pure-JS ZIP builder (uncompressed / stored) ────────────────────────────────

let _crcTable = null;
function makeCrcTable() {
  if (_crcTable) return _crcTable;
  _crcTable = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    _crcTable[n] = c;
  }
  return _crcTable;
}

function crc32(buf) {
  const table = makeCrcTable();
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xff];
  return (crc ^ 0xffffffff) >>> 0;
}

function dosDate(d) {
  return (((d.getFullYear() - 1980) & 0x7f) << 9) | (((d.getMonth() + 1) & 0x0f) << 5) | (d.getDate() & 0x1f);
}
function dosTime(d) {
  return ((d.getHours() & 0x1f) << 11) | ((d.getMinutes() & 0x3f) << 5) | ((d.getSeconds() >> 1) & 0x1f);
}

function buildZip(files) {
  // files: Array<{ name: string, data: Buffer }>
  const now = new Date();
  const mdate = dosDate(now);
  const mtime = dosTime(now);

  const localParts = [];
  const cdEntries = [];
  let localOffset = 0;

  for (const file of files) {
    const nameBuf = Buffer.from(file.name, 'utf8');
    const data = Buffer.isBuffer(file.data) ? file.data : Buffer.from(file.data, 'utf8');
    const crc = crc32(data);
    const sz = data.length;

    // Local file header (30 bytes + name)
    const lh = Buffer.alloc(30 + nameBuf.length);
    lh.writeUInt32LE(0x04034b50, 0);
    lh.writeUInt16LE(20, 4);
    lh.writeUInt16LE(0, 6);
    lh.writeUInt16LE(0, 8);         // stored
    lh.writeUInt16LE(mtime, 10);
    lh.writeUInt16LE(mdate, 12);
    lh.writeUInt32LE(crc, 14);
    lh.writeUInt32LE(sz, 18);
    lh.writeUInt32LE(sz, 22);
    lh.writeUInt16LE(nameBuf.length, 26);
    lh.writeUInt16LE(0, 28);
    nameBuf.copy(lh, 30);

    // Central directory entry (46 bytes + name)
    const cd = Buffer.alloc(46 + nameBuf.length);
    cd.writeUInt32LE(0x02014b50, 0);
    cd.writeUInt16LE(20, 4);
    cd.writeUInt16LE(20, 6);
    cd.writeUInt16LE(0, 8);
    cd.writeUInt16LE(0, 10);
    cd.writeUInt16LE(mtime, 12);
    cd.writeUInt16LE(mdate, 14);
    cd.writeUInt32LE(crc, 16);
    cd.writeUInt32LE(sz, 20);
    cd.writeUInt32LE(sz, 24);
    cd.writeUInt16LE(nameBuf.length, 28);
    cd.writeUInt16LE(0, 30);
    cd.writeUInt16LE(0, 32);
    cd.writeUInt16LE(0, 34);
    cd.writeUInt16LE(0, 36);
    cd.writeUInt32LE(0, 38);
    cd.writeUInt32LE(localOffset, 42);
    nameBuf.copy(cd, 46);

    localParts.push(lh, data);
    cdEntries.push(cd);
    localOffset += lh.length + sz;
  }

  const cdBuf = Buffer.concat(cdEntries);
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0);
  eocd.writeUInt16LE(0, 4);
  eocd.writeUInt16LE(0, 6);
  eocd.writeUInt16LE(files.length, 8);
  eocd.writeUInt16LE(files.length, 10);
  eocd.writeUInt32LE(cdBuf.length, 12);
  eocd.writeUInt32LE(localOffset, 16);
  eocd.writeUInt16LE(0, 20);

  return Buffer.concat([...localParts, cdBuf, eocd]);
}

// ── Fetch all pages from EspoCRM ───────────────────────────────────────────────

async function fetchAll(entityType, dealerConfig) {
  const pageSize = 200;
  let offset = 0;
  const all = [];
  while (true) {
    const r = await espoFetch(
      'GET',
      `/api/v1/${entityType}?maxSize=${pageSize}&offset=${offset}&orderBy=createdAt&order=desc`,
      null,
      dealerConfig,
    );
    if (!r.ok) break;
    const list = Array.isArray(r.data?.list) ? r.data.list : [];
    all.push(...list);
    if (list.length < pageSize) break;
    offset += pageSize;
  }
  return all;
}

// ── Route handler ──────────────────────────────────────────────────────────────

export async function GET(request, { params }) {
  const { dealerId } = await params;

  const config = getDealerConfig(dealerId);
  if (!config) {
    return Response.json({ error: `Unknown dealer: ${dealerId}` }, { status: 404 });
  }

  const format = request.nextUrl.searchParams.get('format') === 'csv' ? 'csv' : 'json';

  const [vehicles, leads, appointments, reservations] = await Promise.all([
    fetchAll('CVehicle', config),
    fetchAll('Lead', config),
    fetchAll('CServiceAppointment', config),
    fetchAll('CVehicleReservation', config),
  ]);

  const settings = {
    dealerName: config.dealerName || null,
    dealerSlug: dealerId,
    espoUrl: config.url || null,
  };

  const dateStr = new Date().toISOString().slice(0, 10);

  if (format === 'json') {
    const payload = JSON.stringify(
      { exportDate: new Date().toISOString(), dealerId, vehicles, leads, appointments, reservations, settings },
      null,
      2,
    );
    return new Response(payload, {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Disposition': `attachment; filename="lotpilot-export-${dealerId}-${dateStr}.json"`,
      },
    });
  }

  // CSV format — ZIP with one file per entity type
  const zipFiles = [
    { name: 'vehicles.csv', data: Buffer.from(toCsv(vehicles), 'utf8') },
    { name: 'leads.csv', data: Buffer.from(toCsv(leads), 'utf8') },
    { name: 'appointments.csv', data: Buffer.from(toCsv(appointments), 'utf8') },
    { name: 'reservations.csv', data: Buffer.from(toCsv(reservations), 'utf8') },
    { name: 'settings.json', data: Buffer.from(JSON.stringify(settings, null, 2), 'utf8') },
  ];

  const zipBuf = buildZip(zipFiles);
  return new Response(zipBuf, {
    status: 200,
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="lotpilot-export-${dealerId}-${dateStr}.zip"`,
    },
  });
}
