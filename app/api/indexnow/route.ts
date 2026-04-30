import { NextResponse } from 'next/server';
import sitemap from '@/app/sitemap';

const KEY = 'ad9e3c4520a64be7a94147515aedfe32';
const HOST = 'www.aiandwebservices.com';

export async function GET() {
  const entries = sitemap();
  const urlList = entries.map((e) => String(e.url));

  const res = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({
      host: HOST,
      key: KEY,
      keyLocation: `https://${HOST}/${KEY}.txt`,
      urlList,
    }),
  });

  return NextResponse.json({
    submitted: urlList.length,
    indexnowStatus: res.status,
    indexnowStatusText: res.statusText,
  });
}
