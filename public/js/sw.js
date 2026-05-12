// =============================================================================
// SERVICE WORKER - PWA Avanzado con estrategias de caché inteligentes
// Manteniendo tu diseño pero con rendimiento superior
// =============================================================================

/* global self, caches, clients */

const STATIC_CACHE = 'static-v1.0.0'
const DYNAMIC_CACHE = 'dynamic-v1.0.0'
const API_CACHE = 'api-v1.0.0'

// ARCHIVOS ESENCIALES PARA PRECACHE
const STATIC_ASSETS = [
  '/',
  '/protected/admin',
  '/css/main.css',
  '/js/bundle.js',
  '/manifest.json',
  '/images/LogoTransp.webp',
  '/images/logotransp.svg',
  '/css/pwa.css'
]

// ARCHIVOS DE BOOTSTRAP (críticos)
const BOOTSTRAP_ASSETS = [
  '/vendors/bootstrap/css/bootstrap.min.css',
  '/vendors/bootstrap/js/bootstrap.bundle.min.js',
  '/vendors/datatables/css/dataTables.bootstrap4.min.css',
  '/vendors/datatables/js/dataTables.bootstrap4.min.js'
]

// API ENDPOINTS PARA CACHE
const API_CACHE_ROUTES = [
  '/corporativo/api/empresas',
  '/corporativo/api/ranchos',
  '/corporativo/api/rancho-dsa',
  '/corporativo/api/sectores'
]

// INSTALACIÓN - Precache crítico
self.addEventListener('install', (event) => {
  // SW Instalando Service Worker v1.0.0

  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        // SW Cacheando archivos estáticos
        return cache.addAll([...STATIC_ASSETS, ...BOOTSTRAP_ASSETS])
      })
      .then(() => self.skipWaiting())
  )
})

// ACTIVACIÓN - Limpieza de cachés antiguos
self.addEventListener('activate', (event) => {
  // SW Activando Service Worker v1.0.0

  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE &&
                cacheName !== DYNAMIC_CACHE &&
                cacheName !== API_CACHE) {
              // SW Eliminando caché antiguo
              return caches.delete(cacheName)
            }
            return Promise.resolve()
          })
        )
      })
      .then(() => self.clients.claim())
  )
})

// ESTRATEGIAS DE CACHE
const cacheStrategies = {
  // CACHE FIRST - Assets estáticos
  cacheFirst: (request) => {
    return caches.match(request)
      .then((response) => {
        if (response) {
          return response
        }
        return fetch(request)
      })
  },

  // STALE-WHILE-REVALIDATE - API públicas
  staleWhileRevalidate: (request) => {
    return caches.match(request)
      .then((response) => {
        const fetchPromise = fetch(request)
          .then((networkResponse) => {
            if (networkResponse.ok) {
              caches.open(API_CACHE)
                .then((cache) => cache.put(request, networkResponse.clone()))
            }
            return networkResponse
          })
          .catch(() => response)

        return response || fetchPromise
      })
  },

  // NETWORK FIRST - Datos críticos/autenticados
  networkFirst: (request) => {
    return fetch(request)
      .then((networkResponse) => {
        if (networkResponse.ok) {
          caches.open(DYNAMIC_CACHE)
            .then((cache) => cache.put(request, networkResponse.clone()))
        }
        return networkResponse
      })
      .catch(() => {
        return caches.match(request)
      })
  }
}

// INTERCEPTACIÓN DE PETICIONES
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // SKIP: Chrome extensions, dev tools, etc.
  if (!url.protocol.startsWith('http')) {
    return
  }

  // ESTRATEGIA PARA ARCHIVOS ESTÁTICOS
  if (request.destination === 'script' ||
      request.destination === 'style' ||
      request.destination === 'image') {
    event.respondWith(cacheStrategies.cacheFirst(request))
    return
  }

  // ESTRATEGIA PARA API PÚBLICAS
  if (API_CACHE_ROUTES.some(route => url.pathname.includes(route))) {
    event.respondWith(cacheStrategies.staleWhileRevalidate(request))
    return
  }

  // ESTRATEGIA PARA NAVEGACIÓN (HTML)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache de páginas HTML
          if (response.ok) {
            caches.open(DYNAMIC_CACHE)
              .then((cache) => cache.put(request, response.clone()))
          }
          return response
        })
        .catch(() => {
          // Offline fallback
          return caches.match('/') ||
                 caches.match('/protected/admin') ||
                 new Response('Offline - Sin conexión', {
                   status: 503,
                   statusText: 'Service Unavailable',
                   headers: { 'Content-Type': 'text/html' }
                 })
        })
    )
    return
  }

  // ESTRATEGIA PARA API AUTENTICADAS
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(cacheStrategies.networkFirst(request))
    return
  }

  // DEFAULT: Network First
  event.respondWith(cacheStrategies.networkFirst(request))
})

// BACKGROUND SYNC - Para acciones offline
self.addEventListener('sync', (event) => {
  // SW Background Sync

  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync())
  }
})

async function doBackgroundSync() {
  try {
    // Obtener acciones pendientes de IndexedDB
    const pendingActions = await getPendingActions()

    for (const action of pendingActions) {
      try {
        await fetch(action.url, action.options)
        await removePendingAction(action.id)
        // SW Acción sincronizada
      } catch (error) {
        // SW Error sincronizando acción
      }
    }

    // Notificar a los clientes
    const allClients = await self.clients.matchAll()
    allClients.forEach((client) => {
      client.postMessage({
        type: 'SYNC_COMPLETED',
        data: { success: true }
      })
    })
  } catch (error) {
    console.error('[SW] Error en Background Sync:', error)
  }
}

// UTILIDADES PARA BACKGROUND SYNC
async function getPendingActions() {
  // Implementar con IndexedDB
  return []
}

async function removePendingAction(id) {
  // Implementar con IndexedDB
}

// PUSH NOTIFICATIONS
self.addEventListener('push', (event) => {
  // SW Push recibido

  const options = {
    body: event.data?.text() || 'Nueva notificación',
    icon: '/images/LogoTransp.webp',
    badge: '/images/LogoTransp.webp',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Ver',
        icon: '/images/checkmark.png'
      },
      {
        action: 'close',
        title: 'Cerrar',
        icon: '/images/xmark.png'
      }
    ]
  }

  event.waitUntil(
    self.registration.showNotification('Fertilizaciones', options)
  )
})

// NOTIFICATION CLICK
self.addEventListener('notificationclick', (event) => {
  // SW Notificación clickeada

  event.notification.close()

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/protected/admin')
    )
  }
})

// CACHE CLEANUP - Mantenimiento periódico
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CACHE_CLEANUP') {
    event.waitUntil(cleanupCache())
  }
})

async function cleanupCache() {
  try {
    const cacheNames = await caches.keys()
    const oldCaches = cacheNames.filter(name =>
      name.includes('old-') ||
      (name !== STATIC_CACHE && name !== DYNAMIC_CACHE && name !== API_CACHE)
    )

    await Promise.all(oldCaches.map(name => caches.delete(name)))
    // SW Cleanup completado
  } catch (error) {
    // SW Error en cleanup:
  }
}
