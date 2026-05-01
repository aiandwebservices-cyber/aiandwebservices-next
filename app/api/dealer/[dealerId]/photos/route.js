import {
  ListObjectsV2Command,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getDealerConfig } from '../../_lib/espocrm.js';
import {
  getR2Client,
  R2_BUCKET,
  isR2Configured,
  publicUrlForKey,
} from '../../_lib/r2.js';

function bad(error, status = 400) {
  return Response.json({ ok: false, error }, { status });
}

function fileNameFromKey(key) {
  const idx = key.lastIndexOf('/');
  const tail = idx >= 0 ? key.slice(idx + 1) : key;
  // Strip the leading {uuid}- prefix added at upload time.
  return tail.replace(
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}-/i,
    '',
  );
}

export async function GET(req, { params }) {
  const { dealerId } = await params;
  const dealerConfig = getDealerConfig(dealerId);
  if (!dealerConfig) return bad(`Unknown dealer: ${dealerId}`, 404);

  if (!isR2Configured()) {
    return bad('R2 storage is not configured on the server', 500);
  }

  const { searchParams } = new URL(req.url);
  const vehicleId = searchParams.get('vehicleId');
  if (!vehicleId) return bad('vehicleId query param is required');

  const prefix =
    `dealers/${encodeURIComponent(dealerId)}` +
    `/vehicles/${encodeURIComponent(vehicleId)}/`;

  try {
    const client = getR2Client();
    const command = new ListObjectsV2Command({
      Bucket: R2_BUCKET,
      Prefix: prefix,
      MaxKeys: 100,
    });
    const result = await client.send(command);

    const photos = (result.Contents || []).map((obj) => ({
      key: obj.Key,
      publicUrl: publicUrlForKey(obj.Key),
      fileName: fileNameFromKey(obj.Key || ''),
      size: obj.Size ?? 0,
      lastModified: obj.LastModified
        ? new Date(obj.LastModified).toISOString()
        : null,
    }));

    return Response.json({ ok: true, photos });
  } catch (err) {
    return bad(err?.message || 'Failed to list photos', 500);
  }
}

export async function DELETE(req, { params }) {
  const { dealerId } = await params;
  const dealerConfig = getDealerConfig(dealerId);
  if (!dealerConfig) return bad(`Unknown dealer: ${dealerId}`, 404);

  if (!isR2Configured()) {
    return bad('R2 storage is not configured on the server', 500);
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return bad('Invalid JSON body');
  }

  const { key } = body || {};
  if (!key || typeof key !== 'string') return bad('key is required');

  // Defense-in-depth: only allow deleting photos owned by this dealer.
  const expectedPrefix = `dealers/${encodeURIComponent(dealerId)}/vehicles/`;
  if (!key.startsWith(expectedPrefix)) {
    return bad('key does not belong to this dealer', 403);
  }

  try {
    const client = getR2Client();
    await client.send(
      new DeleteObjectCommand({ Bucket: R2_BUCKET, Key: key }),
    );
    return Response.json({ ok: true });
  } catch (err) {
    return bad(err?.message || 'Failed to delete photo', 500);
  }
}
