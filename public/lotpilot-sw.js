const CACHE_VERSION = 'lotpilot-v1';
const APP_SHELL_CACHE = `${CACHE_VERSION}-shell`;
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const API_CACHE = `${CACHE_VERSION}-api`;

const APP_SHELL_ASSETS = [
  '/dealers/primo/admin',
];

const NEVER_CACHE = [
  /\/api\/dealer\/[^/]+\/chat/,
  /\/api\/dealer\/[^/]+\/admin\/validate-integration/,
];

function shouldNeverCache(url) {
  return NEVER_CACHE.some(pattern => pattern.test(url));
}

// --- Install ---
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(APP_SHELL_CACHE)
      .then(cache => cache.addAll(APP_SHELL_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// --- Activate ---
self.addEventListener('activate', event => {
  const validCaches = [APP_SHELL_CACHE, STATIC_CACHE, API_CACHE];
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys
          .filter(key => !validCaches.includes(key))
          .map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

// --- Fetch ---
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle same-origin requests
  if (url.origin !== self.location.origin) return;

  if (shouldNeverCache(url.pathname)) {
    return; // network-only, no interception
  }

  // POST and other mutations: network-only
  if (request.method !== 'GET') {
    return;
  }

  const isApiRequest = url.pathname.startsWith('/api/');
  const isStaticAsset = /\.(js|css|woff2?|ttf|otf|eot|png|jpg|jpeg|gif|svg|ico|webp)(\?|$)/.test(url.pathname);
  const isNavigation = request.mode === 'navigate';

  if (isStaticAsset) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
  } else if (isApiRequest) {
    event.respondWith(networkFirstWithTimeout(request, API_CACHE, 5000));
  } else if (isNavigation) {
    event.respondWith(navigationHandler(request));
  }
});

// Cache-first: serve from cache, fetch and update if missing
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response.ok) cache.put(request, response.clone());
    return response;
  } catch {
    return new Response('Offline', { status: 503 });
  }
}

// Network-first with timeout: try network, fall back to cache
async function networkFirstWithTimeout(request, cacheName, timeoutMs) {
  const cache = await caches.open(cacheName);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(request, { signal: controller.signal });
    clearTimeout(timer);
    if (response.ok) cache.put(request, response.clone());
    return response;
  } catch {
    clearTimeout(timer);
    const cached = await cache.match(request);
    if (cached) return cached;
    return new Response(JSON.stringify({ ok: false, offline: true }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// Navigation: network-first, fall back to app shell
async function navigationHandler(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(APP_SHELL_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cache = await caches.open(APP_SHELL_CACHE);
    const cached = await cache.match(request) || await cache.match('/dealers/primo/admin');
    if (cached) return cached;
    return new Response('Offline', { status: 503 });
  }
}

// --- Push notifications ---
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  const options = {
    body: data.body || 'New notification from LotPilot',
    icon: data.icon || '/icons/lotpilot-192.svg',
    badge: '/icons/lotpilot-192.svg',
    tag: data.tag || 'lotpilot-notification',
    data: { url: data.url || '/' },
    vibrate: [200, 100, 200],
    actions: [
      { action: 'open', title: 'View' },
      { action: 'dismiss', title: 'Dismiss' },
    ],
  };
  event.waitUntil(self.registration.showNotification(data.title || 'LotPilot', options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  if (event.action === 'dismiss') return;
  const url = event.notification.data?.url || '/';
  event.waitUntil(clients.openWindow(url));
});
