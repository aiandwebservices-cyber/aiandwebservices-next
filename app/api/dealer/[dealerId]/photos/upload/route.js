import { getDealerConfig } from '../../../_lib/espocrm.js';
import { isR2Configured } from '../../../_lib/r2.js';
import { withErrorHandling } from '../../../../../lib/dealer-platform/utils/error-handler.js';
import { rateLimit } from '../../../../../lib/dealer-platform/middleware/rate-limit.js';
import { optimizeAndUpload } from '../optimize/route.js';

const SAFE_NAME_RE = /[^a-zA-Z0-9._-]+/g;

function sanitizeFileName(name) {
  if (!name || typeof name !== 'string') return 'photo.jpg';
  const trimmed = name.trim().slice(0, 200);
  return trimmed.replace(SAFE_NAME_RE, '-').replace(/^-+|-+$/g, '') || 'photo.jpg';
}

export const POST = withErrorHandling(async (req, { params }) => {
  const limited = rateLimit(req, { limit: 30, window: 60 });
  if (limited) return limited;

  const { dealerId } = await params;
  const dealerConfig = getDealerConfig(dealerId);
  if (!dealerConfig) {
    return Response.json({ ok: false, error: `Unknown dealer: ${dealerId}` }, { status: 404 });
  }

  if (!isR2Configured()) {
    return Response.json({ ok: false, error: 'R2 storage is not configured on the server', degraded: 'r2_unavailable' }, { status: 500 });
  }

  const contentType = req.headers.get('content-type') || '';
  let imageBuffer, vehicleId, originalSize;

  if (contentType.includes('multipart/form-data')) {
    const form = await req.formData();
    vehicleId = form.get('vehicleId');
    const file = form.get('image');
    if (!file || typeof file === 'string') {
      return Response.json({ ok: false, error: 'image file is required' }, { status: 400 });
    }
    originalSize = file.size;
    imageBuffer = Buffer.from(await file.arrayBuffer());
    sanitizeFileName(file.name);
  } else {
    let body;
    try { body = await req.json(); } catch { return Response.json({ ok: false, error: 'Invalid request body' }, { status: 400 }); }
    vehicleId = body?.vehicleId;
    const imageData = body?.imageData;
    if (!imageData) return Response.json({ ok: false, error: 'multipart/form-data with image field required' }, { status: 400 });
    imageBuffer = Buffer.from(imageData.replace(/^data:image\/[a-z+]+;base64,/, ''), 'base64');
    originalSize = imageBuffer.length;
  }

  if (!vehicleId || typeof vehicleId !== 'string') {
    return Response.json({ ok: false, error: 'vehicleId is required' }, { status: 400 });
  }

  const versions = await optimizeAndUpload(imageBuffer, dealerId, vehicleId);

  return Response.json({
    ok: true,
    // Backward-compat fields (full WebP as primary URL)
    publicUrl: versions.full.url,
    key: versions.full.url,
    // Optimized variants
    full: versions.full,
    medium: versions.medium,
    thumb: versions.thumb,
    fullJpeg: versions.fullJpeg,
    // Size savings info
    originalSize: originalSize || imageBuffer.length,
    optimizedSize: versions.full.size,
  });
});
