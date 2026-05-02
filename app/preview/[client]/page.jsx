import { notFound, redirect } from 'next/navigation';

// ─────────────────────────────────────────────────────────────
// ADD YOUR CLIENTS HERE
// key   = what goes in the URL  →  /preview/mrs
// value = where their site is hosted
// ─────────────────────────────────────────────────────────────
const CLIENTS = {
  lotcrm: {
    name: 'LotCRM — Car Dealership Demo',
    url: 'https://lotpilot.ai/dealers/lotcrm',
  },
  example005: {
    name: 'LotCRM — Car Dealership Demo',
    url: 'https://lotpilot.ai/dealers/lotcrm',
  },
  primo: {
    name: 'Primo Auto — Dealership Demo',
    url: 'https://lotpilot.ai/dealers/primo',
  },
};

export const metadata = {
  robots: 'noindex, nofollow',
};

export default async function PreviewPage({ params }) {
  const { client } = await params;
  const config = CLIENTS[client.toLowerCase()];

  if (!config) notFound();

  // Redirect straight to the client site — works perfectly on all devices
  redirect(config.url);
}
