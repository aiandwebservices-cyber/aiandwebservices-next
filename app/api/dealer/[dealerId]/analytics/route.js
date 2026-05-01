// GET /api/dealer/{dealerId}/analytics
//
// TODO: Wire to Vercel Analytics API when @vercel/analytics is configured.
// For now, returns realistic demo data so the Performance tab renders meaningfully.
//
// The Vercel Analytics dashboard is project-bound (no public REST API per
// dealerId), so this endpoint stays in `source: "demo"` mode until the
// project is connected. Numbers are deterministic per dealerId so the chart
// doesn't reshuffle on every request.

function dailyViewsFor(seedStr) {
  // Deterministic PRNG seeded by dealerId so the chart is stable per dealer.
  let s = 0;
  for (let i = 0; i < seedStr.length; i++) s = (s * 31 + seedStr.charCodeAt(i)) >>> 0;
  const rand = () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };

  const out = [];
  const today = new Date('2026-05-01T12:00:00Z');
  for (let d = 29; d >= 0; d--) {
    const date = new Date(today.getTime() - d * 86400000);
    const day = date.getUTCDay(); // 0=Sun, 6=Sat
    const isWeekend = day === 0 || day === 6;
    // Linear upward trend across the 30-day window: +0% to +25%.
    const trend = 1 + ((29 - d) / 29) * 0.25;
    const base = isWeekend
      ? 80 + Math.floor(rand() * 70)        // 80-150
      : 150 + Math.floor(rand() * 150);     // 150-300
    out.push({
      date: date.toISOString().slice(0, 10),
      views: Math.round(base * trend),
    });
  }
  return out;
}

export async function GET(req, { params }) {
  const { dealerId } = await params;
  const daily = dailyViewsFor(dealerId || 'demo');
  const totalViews = daily.reduce((sum, d) => sum + d.views, 0);
  const uniqueVisitors = Math.round(totalViews * 0.46);

  return Response.json({
    ok: true,
    source: 'demo',
    dealerId,
    period: 'last_30_days',
    pageViews: totalViews,
    uniqueVisitors,
    bounceRate: 34.2,
    avgSessionDuration: '2m 48s',
    topPages: [
      { path: '/',           views: Math.round(totalViews * 0.37), title: 'Home' },
      { path: '/inventory',  views: Math.round(totalViews * 0.30), title: 'Inventory' },
      { path: '/finance',    views: Math.round(totalViews * 0.09), title: 'Finance' },
      { path: '/trade-in',   views: Math.round(totalViews * 0.07), title: 'Trade-In' },
      { path: '/service',    views: Math.round(totalViews * 0.05), title: 'Service' },
    ],
    dailyViews: daily,
    deviceBreakdown: { desktop: 42, mobile: 51, tablet: 7 },
    topReferrers: [
      { source: 'Google',    visits: Math.round(uniqueVisitors * 0.43) },
      { source: 'Direct',    visits: Math.round(uniqueVisitors * 0.31) },
      { source: 'Facebook',  visits: Math.round(uniqueVisitors * 0.15) },
      { source: 'Cars.com',  visits: Math.round(uniqueVisitors * 0.08) },
      { source: 'CarGurus',  visits: Math.round(uniqueVisitors * 0.06) },
    ],
    coreWebVitals: {
      lcp: 1.8,
      fid: 45,
      cls: 0.05,
      rating: 'Good',
    },
    fetchedAt: new Date().toISOString(),
  });
}
