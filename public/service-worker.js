/* eslint-disable no-undef */

const CACHE_NAME = 'solicitudes-v24'
const STATIC_ASSETS = [
  '/',
  '/app/solicitud/cerrarMezcla.js',
  '/app/proceso/proceso.js',
  '/app/productosReceta/productos.js',
  '/css/app.css',
  '/css/solicitudProductos.css',
  '/css/mobile-fixes.css',
  '/css/spinner.css',
  '/js/app.js',
  '/js/select2.js',
  '/images/LogoTransp.webp',
  '/images/LogoTransp.png',
  '/images/moras.webp',
  '/images/paisaje.webp',
  '/images/paise2.webp',
  '/manifest.json',
  '/offline.html'
]

self.addEventListener('install', (event) => {
  console.log('[SW] Instalado')
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Precargando archivos estáticos')
        return cache.addAll(STATIC_ASSETS)
      })
      .then(() => self.skipWaiting())
  )
})

self.addEventListener('activate', (event) => {
  console.log('[SW] Activado')
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(cacheName => cacheName !== CACHE_NAME)
          .map(cacheName => caches.delete(cacheName))
      )
    })
      .then(() => self.clients.claim())
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
            console.log('Intentando almacenar en caché:', event.request.url)
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
          return caches.match('/images/LogoTransp.webp')
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
