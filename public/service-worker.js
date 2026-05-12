/* eslint-disable no-undef */

const CACHE_NAME = 'ferilizacion-v3'
const VERSION = '1.1.3' // Añadir control de versión

const STATIC_ASSETS = [
  '/',
  '/css/app.css',
  '/css/mobile-fixes.css',
  '/css/spinner.css',
  '/js/app.js',
  '/js/select2.js',
  '/images/favicon.ico',
  '/images/favicon.svg',
  '/images/favicon-96x96.png',
  '/images/apple-touch-icon.png',
  '/images/web-app-manifest-192x192.png',
  '/images/web-app-manifest-512x512.png',
  '/images/logoTransp-2.PNG',
  '/images/moras.webp',
  '/images/paisaje.webp',
  '/images/paise2.webp',
  '/manifest.json',
  '/offline.html'
]

self.addEventListener('install', (event) => {
  // SW Instalado
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        // SW Precargando archivos estáticos
        return cache.addAll(STATIC_ASSETS)
      })
      .then(() => self.skipWaiting())
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      // Limpieza de cachés antiguos
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(cacheName => cacheName !== CACHE_NAME)
            .map(cacheName => caches.delete(cacheName))
        )
      }),
      // Notificar a todos los clientes sobre la actualización
      clients.claim(),
      notifyClientsOfUpdate()
    ])
  )
})

self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => caches.match('/offline.html'))
    )
    return
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response
        }

        return fetch(event.request).then(fetchResponse => {
          // No cachear respuestas de la API y URLs de extensiones
          if (event.request.url.includes('/api/') || event.request.url.startsWith('chrome-extension://')) {
            return fetchResponse
          }

          // Verificar si la respuesta es válida antes de almacenarla
          if (!fetchResponse || fetchResponse.status !== 200 || fetchResponse.type !== 'basic') {
            return fetchResponse
          }

          return caches.open(CACHE_NAME).then(cache => {
            // SW Intentando almacenar en caché
            // Clona la respuesta para guardarla en caché.
            // Es importante devolver la respuesta original (fetchResponse) a la página.
            cache.put(event.request, fetchResponse.clone()).catch(error => {
              console.error('Error al almacenar en caché:', event.request.url, error)
            })
            return fetchResponse // Devuelve la respuesta original obtenida de la red.
          })
        })
      })

      .catch(() => {
        // Retornar un fallback para imágenes
        if (event.request.url.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
          return caches.match('/images/logoTransp-2.PNG')
        }
        return new Response('Error de conexión', {
          status: 503,
          statusText: 'Service Unavailable',
          headers: new Headers({
            'Content-Type': 'text/plain'
          })
        })
      })
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    clients.matchAll().then(clients => {
      clients.forEach(client => {
        client.postMessage({
          type: 'UPDATE_AVAILABLE',
          version: CACHE_NAME
        })
      })
    })
  )
})

// Función para notificar actualización
const notifyClientsOfUpdate = async () => {
  const clients = await self.clients.matchAll()
  clients.forEach(client => {
    client.postMessage({
      type: 'UPDATE_AVAILABLE',
      version: VERSION,
      cacheName: CACHE_NAME
    })
  })
}
