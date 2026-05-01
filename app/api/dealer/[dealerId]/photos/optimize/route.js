import { createHash } from 'node:crypto';
import sharp from 'sharp';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getDealerConfig } from '../../../../_lib/espocrm.js';
import { getR2Client, R2_BUCKET, isR2Configured, publicUrlForKey } from '../../../../_lib/r2.js';
import { withErrorHandling } from '../../../../../../lib/dealer-platform/utils/error-handler.js';
import { rateLimit } from '../../../../../../lib/dealer-platform/middleware/rate-limit.js';

const SIZES = [
  { name: 'full',   width: 1600 },
  { name: 'medium', width: 800 },
  { name: 'thumb',  width: 400 },
];

export async function optimizeAndUpload(imageBuffer, dealerId, vehicleId) {
  const client = getR2Client();
  const hash = createHash('sha256').update(imageBuffer).digest('hex').slice(0, 16);
  const results = {};

  for (const { name, width } of SIZES) {
    const { data, info } = await sharp(imageBuffer)
      .rotate()
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer({ resolveWithObject: true });

    const key = `dealers/${encodeURIComponent(dealerId)}/vehicles/${encodeURIComponent(vehicleId)}/${name}-${hash}.webp`;
    await client.send(new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: key,
      Body: data,
      ContentType: 'image/webp',
      CacheControl: 'public, max-age=31536000, immutable',
    }));
    results[name] = { url: publicUrlForKey(key), width: info.width, height: info.height, size: info.size };
  }

  // JPEG fallback for the full size (legacy browser support)
  const { data: jpegData, info: jpegInfo } = await sharp(imageBuffer)
    .rotate()
    .resize({ width: 1600, withoutEnlargement: true })
    .jpeg({ quality: 85 })
    .toBuffer({ resolveWithObject: true });

  const jpegKey = `dealers/${encodeURIComponent(dealerId)}/vehicles/${encodeURIComponent(vehicleId)}/full-${hash}.jpg`;
  await client.send(new PutObjectCommand({
    Bucket: R2_BUCKET,
    Key: jpegKey,
    Body: jpegData,
    ContentType: 'image/jpeg',
    CacheControl: 'public, max-age=31536000, immutable',
  }));
  results.fullJpeg = { url: publicUrlForKey(jpegKey), width: jpegInfo.width, height: jpegInfo.height, size: jpegInfo.size };

  return results;
}

export const POST = withErrorHandling(async (req, { params }) => {
  const limited = rateLimit(req, { limit: 20, window: 60 });
  if (limited) return limited;

  const { dealerId } = await params;
  const dealerConfig = getDealerConfig(dealerId);
  if (!dealerConfig) return Response.json({ ok: false, error: `Unknown dealer: ${dealerId}` }, { status: 404 });

  if (!isR2Configured()) {
    return Response.json({ ok: false, error: 'R2 storage is not configured' }, { status: 500 });
  }

  const contentType = req.headers.get('content-type') || '';
  let imageBuffer, vehicleId;

  if (contentType.includes('multipart/form-data')) {
    const form = await req.formData();
    vehicleId = form.get('vehicleId');
    const file = form.get('image');
    if (!file || typeof file === 'string') {
      return Response.json({ ok: false, error: 'image file is required' }, { status: 400 });
    }
    imageBuffer = Buffer.from(await file.arrayBuffer());
  } else {
    const body = await req.json().catch(() => null);
    vehicleId = body?.vehicleId;
    const imageData = body?.imageData;
    if (!imageData) return Response.json({ ok: false, error: 'imageData (base64) or multipart image required' }, { status: 400 });
    imageBuffer = Buffer.from(imageData.replace(/^data:image\/[a-z+]+;base64,/, ''), 'base64');
  }

  if (!vehicleId || typeof vehicleId !== 'string') {
    return Response.json({ ok: false, error: 'vehicleId is required' }, { status: 400 });
  }

  const versions = await optimizeAndUpload(imageBuffer, dealerId, vehicleId);
  return Response.json({ ok: true, ...versions });
});
