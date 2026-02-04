const VERSION = '2.7';
console.log(`SW 2nd CFGS: Cargando versión ${VERSION} (BORRANDO CACHÉS ANTIGUOS)`);
const CACHE_NAME = `edutrack-2cfgs-cache-v${VERSION}`;
const ASSETS = [
    './',
    './Planificacion-Docente.html',
    './Planificacion-Alumnado.html',
    './data/master-plan.js',
    './css/ra-tracker.css',
    './css/fichas.css',
    './css/dashboard.css',
    './css/gantt.css',
    './js/ra-tracker.js',
    './js/fichas-renderer.js',
    './js/progress-tracker.js',
    './js/progress-manager.js',
    './js/dashboard-renderer.js',
    './js/gantt-renderer.js',
    './js/settings-manager.js',
    './js/settings-ui.js',
    './manifest-docente.json',
    './manifest-alumnado.json',
    'https://cdn.jsdelivr.net/npm/chart.js'
];

// Instalar Service Worker y cachear activos
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('SW 2nd CFGS: Cacheando activos estáticos');
                return cache.addAll(ASSETS);
            })
    );
    self.skipWaiting();
});

// Activar y limpiar caches antiguos
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            );
        }).then(() => self.clients.claim())
    );
});

// Estrategia: Stale While Revalidate
self.addEventListener('fetch', event => {
    // Solo cachear peticiones GET
    if (event.request.method !== 'GET') return;

    // Filtrar esquemas no soportados
    if (!event.request.url.startsWith('http')) return;

    event.respondWith(
        caches.match(event.request).then(cachedResponse => {
            const fetchPromise = fetch(event.request)
                .then(networkResponse => {
                    if (!networkResponse || networkResponse.status !== 200) {
                        return networkResponse;
                    }

                    const responseToCache = networkResponse.clone();
                    caches.open(CACHE_NAME).then(cache => {
                        // Usar catch para evitar rejections no capturados
                        cache.put(event.request, responseToCache).catch(err => {
                            console.warn('SW 2nd CFGS: Error al guardar en cache:', event.request.url);
                        });
                    });

                    return networkResponse;
                })
                .catch(() => {
                    return cachedResponse;
                });

            return cachedResponse || fetchPromise;
        })
    );
});


