import { randomUUID } from 'node:crypto';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { getDealerConfig } from '../../../_lib/espocrm.js';
import {
  getR2Client,
  R2_BUCKET,
  isR2Configured,
  publicUrlForKey,
} from '../../../_lib/r2.js';

function bad(error, status = 400) {
  return Response.json({ ok: false, error }, { status });
}

const SAFE_NAME_RE = /[^a-zA-Z0-9._-]+/g;

function sanitizeFileName(name) {
  if (!name || typeof name !== 'string') return 'photo.jpg';
  const trimmed = name.trim().slice(0, 200);
  return trimmed.replace(SAFE_NAME_RE, '-').replace(/^-+|-+$/g, '') || 'photo.jpg';
}

export async function POST(req, { params }) {
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

  const { vehicleId, fileName, contentType } = body || {};
  if (!vehicleId || typeof vehicleId !== 'string') {
    return bad('vehicleId is required');
  }
  if (!contentType || typeof contentType !== 'string') {
    return bad('contentType is required');
  }
  if (!contentType.startsWith('image/')) {
    return bad('contentType must be an image/* type');
  }

  const safeName = sanitizeFileName(fileName);
  const key =
    `dealers/${encodeURIComponent(dealerId)}` +
    `/vehicles/${encodeURIComponent(vehicleId)}` +
    `/${randomUUID()}-${safeName}`;

  try {
    const client = getR2Client();
    const command = new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: key,
      ContentType: contentType,
    });
    const uploadUrl = await getSignedUrl(client, command, { expiresIn: 300 });

    return Response.json({
      ok: true,
      uploadUrl,
      publicUrl: publicUrlForKey(key),
      key,
    });
  } catch (err) {
    return bad(err?.message || 'Failed to create presigned URL', 500);
  }
}
