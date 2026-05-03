// Service Worker for offline support and PWA functionality
const CACHE_NAME = 'lexure-ai-v1';
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/chat.html',
    '/privacy.html',
    '/manifest.json',
    '/assets/css/style.css',
    '/assets/js/db.js',
    '/assets/js/memory.js',
    '/assets/js/ui.js',
    '/assets/js/llm.js',
    '/assets/js/app.js',
    '/assets/icons/logo.svg',
];

// Install event
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(STATIC_ASSETS).catch((error) => {
                console.log('Cache addAll error:', error);
                // Don't fail on cache errors - some assets might not be available during installation
            });
        })
    );
    self.skipWaiting();
});

// Activate event
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Fetch event - Network first, fall back to cache
self.addEventListener('fetch', (event) => {
    // Skip non-GET requests and CDN resources
    if (event.request.method !== 'GET' || event.request.url.includes('esm.run')) {
        return;
    }

    event.respondWith(
        fetch(event.request)
            .then((response) => {
                // Cache successful responses
                if (response && response.status === 200) {
                    const responseToCache = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseToCache);
                    });
                }
                return response;
            })
            .catch(() => {
                // Fall back to cache on network error
                return caches.match(event.request).then((response) => {
                    if (response) {
                        return response;
                    }
                    // Return offline page or default response
                    if (event.request.destination === 'document') {
                        return caches.match('/index.html');
                    }
                });
            })
    );
});

// Message handling for push notifications
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});
