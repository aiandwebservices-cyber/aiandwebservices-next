// Shared Cloudflare R2 / S3-compatible client for dealer photo storage.
//
// Required env vars:
//   R2_ENDPOINT             https://{accountId}.r2.cloudflarestorage.com
//   R2_ACCESS_KEY_ID
//   R2_SECRET_ACCESS_KEY
//   R2_BUCKET_NAME          dealer-photos
//   R2_PUBLIC_DOMAIN        photos.yourdomain.com  (no protocol)
//
// Required packages (run manually):
//   npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner

import { S3Client } from '@aws-sdk/client-s3';

const endpoint = process.env.R2_ENDPOINT;
const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

let _client = null;

export function getR2Client() {
  if (_client) return _client;
  if (!endpoint || !accessKeyId || !secretAccessKey) {
    throw new Error(
      'R2 client not configured: set R2_ENDPOINT, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY',
    );
  }
  _client = new S3Client({
    region: 'auto',
    endpoint,
    credentials: { accessKeyId, secretAccessKey },
  });
  return _client;
}

export const R2_BUCKET = process.env.R2_BUCKET_NAME || '';
export const R2_PUBLIC_DOMAIN = process.env.R2_PUBLIC_DOMAIN || '';

export function publicUrlForKey(key) {
  if (!R2_PUBLIC_DOMAIN) return '';
  const domain = R2_PUBLIC_DOMAIN.replace(/^https?:\/\//, '').replace(/\/$/, '');
  return `https://${domain}/${key}`;
}

export function isR2Configured() {
  return Boolean(endpoint && accessKeyId && secretAccessKey && R2_BUCKET);
}
