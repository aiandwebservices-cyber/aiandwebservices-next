import { getDealerConfig } from '../../_lib/espocrm.js';

const PRIMO_GOOGLE = {
  placeIdEnv: 'GOOGLE_PLACE_ID_PRIMO',
  apiKeyEnv: 'GOOGLE_PLACES_API_KEY',
};

const DEALER_GOOGLE = {
  lotcrm: PRIMO_GOOGLE,
};

const SEED_REVIEWS = {
  lotcrm: {
    rating: 4.9,
    totalReviews: 847,
    reviews: [
      {
        author: 'Mike Johnson',
        rating: 5,
        text: 'Best car-buying experience I\'ve ever had. Carlos walked me through every option and got me a payment I could afford. Drove off in a clean Camry the same day.',
        timeAgo: '3 days ago',
        profilePhoto: '',
        platform: 'google',
      },
      {
        author: 'Sandra Reyes',
        rating: 5,
        text: 'Honest team, no pressure. They worked with my credit and found me something reliable for my commute. Highly recommend Primo Auto Group.',
        timeAgo: '1 week ago',
        profilePhoto: '',
        platform: 'google',
      },
      {
        author: 'Daryl P.',
        rating: 5,
        text: 'Got pre-approved online in 5 minutes and the truck I wanted was waiting when I arrived. Smooth from start to finish.',
        timeAgo: '2 weeks ago',
        profilePhoto: '',
        platform: 'google',
      },
      {
        author: 'Jenny Tran',
        rating: 4,
        text: 'Great selection and fair pricing. Took a little longer than I expected to finalize paperwork but the staff was friendly the whole time.',
        timeAgo: '3 weeks ago',
        profilePhoto: '',
        platform: 'google',
      },
      {
        author: 'Marcus Lee',
        rating: 5,
        text: 'Second car I\'ve bought from Primo. They remembered me, gave me a loyalty discount, and made the trade-in painless.',
        timeAgo: '1 month ago',
        profilePhoto: '',
        platform: 'google',
      },
    ],
  },
};

const CACHE_TTL_MS = 60 * 60 * 1000;
const cache = new Map();

function bad(error, status = 400) {
  return Response.json({ ok: false, error }, { status });
}

function googleTimeAgo(unixSeconds) {
  if (!unixSeconds || typeof unixSeconds !== 'number') return '';
  const diffMs = Date.now() - unixSeconds * 1000;
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 60) return `${Math.max(minutes, 1)} minute${minutes === 1 ? '' : 's'} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days === 1 ? '' : 's'} ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `${weeks} week${weeks === 1 ? '' : 's'} ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months === 1 ? '' : 's'} ago`;
  const years = Math.floor(days / 365);
  return `${years} year${years === 1 ? '' : 's'} ago`;
}

function seedPayload(dealerId) {
  const seed = SEED_REVIEWS[dealerId];
  if (!seed) {
    return { ok: true, source: 'seed', rating: 0, totalReviews: 0, reviews: [] };
  }
  return {
    ok: true,
    source: 'seed',
    rating: seed.rating,
    totalReviews: seed.totalReviews,
    reviews: seed.reviews,
  };
}

async function fetchFromGoogle(placeId, apiKey) {
  const url = new URL('https://maps.googleapis.com/maps/api/place/details/json');
  url.searchParams.set('place_id', placeId);
  url.searchParams.set('fields', 'name,rating,user_ratings_total,reviews');
  url.searchParams.set('key', apiKey);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 6000);
  try {
    const res = await fetch(url.toString(), { signal: controller.signal });
    if (!res.ok) {
      throw new Error(`Google Places ${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    if (data.status && data.status !== 'OK') {
      throw new Error(`Google Places status: ${data.status}${data.error_message ? ` — ${data.error_message}` : ''}`);
    }
    return data.result || {};
  } finally {
    clearTimeout(timer);
  }
}

function normalizeGoogleReview(r) {
  return {
    author: r.author_name || 'Anonymous',
    rating: typeof r.rating === 'number' ? r.rating : 0,
    text: r.text || '',
    timeAgo: r.relative_time_description || googleTimeAgo(r.time),
    profilePhoto: r.profile_photo_url || '',
    platform: 'google',
  };
}

export async function GET(req, { params }) {
  const { dealerId } = await params;
  const dealerConfig = getDealerConfig(dealerId);
  if (!dealerConfig) return bad(`Unknown dealer: ${dealerId}`, 404);

  const googleCfg = DEALER_GOOGLE[dealerId];
  const placeId = googleCfg ? process.env[googleCfg.placeIdEnv] : null;
  const apiKey = googleCfg ? process.env[googleCfg.apiKeyEnv] : null;

  if (!placeId || !apiKey) {
    return Response.json(seedPayload(dealerId));
  }

  const cacheKey = `${dealerId}:${placeId}`;
  const cached = cache.get(cacheKey);
  if (cached && cached.expires > Date.now()) {
    return Response.json(cached.payload);
  }

  try {
    const result = await fetchFromGoogle(placeId, apiKey);
    const payload = {
      ok: true,
      source: 'google',
      rating: typeof result.rating === 'number' ? result.rating : 0,
      totalReviews: typeof result.user_ratings_total === 'number' ? result.user_ratings_total : 0,
      reviews: Array.isArray(result.reviews) ? result.reviews.map(normalizeGoogleReview) : [],
    };
    cache.set(cacheKey, { expires: Date.now() + CACHE_TTL_MS, payload });
    return Response.json(payload);
  } catch (e) {
    console.error('[reviews] Google fetch failed:', e.message);
    return Response.json(seedPayload(dealerId));
  }
}
