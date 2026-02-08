const VERSION = '12.0';
console.log(`SW 2º CFGM: Cargando versión ${VERSION} (BORRANDO CACHÉS ANTIGUOS)`);
const CACHE_NAME = `edutrack-2cfgm-cache-v${VERSION}`;
const ASSETS = [
    './',
    './Planificacion-Docente.html',
    './Planificacion-Alumnado.html',
    './data/master-plan.js',
    './css/ra-tracker.css',
    './css/fichas.css',
    './css/dashboard.css',
    './css/gantt.css',
    './css/academic-year-selector.css',
    './js/ra-tracker.js',
    './js/fichas-renderer.js',
    './js/progress-tracker.js',
    './js/progress-manager.js',
    './js/dashboard-renderer.js',
    './js/gantt-renderer.js',
    './js/settings-manager.js',
    './js/settings-ui.js',
    './js/academic-year-manager.js',
    './js/academic-year-selector-ui.js',
    './js/academic-year-generator.js',
    './js/notification-manager.js',
    './js/rubric-manager.js',
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


