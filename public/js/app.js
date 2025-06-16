async function registrarSWsYObtenerToken () {
  try {
    // 1. Registrar el SW general
    const swRegistration = await navigator.serviceWorker.register('/service-worker.js')
    console.log('✅ Service Worker registrado:', swRegistration.scope)
    swRegistration.onupdatefound = () => {
      const installingWorker = swRegistration.installing
      installingWorker.onstatechange = () => {
        if (installingWorker.state === 'installed') {
          if (navigator.serviceWorker.controller) {
            // Nueva actualización disponible
            console.log('🔄 Nuevo contenido está disponible. Actualiza la página.')
            // Aquí podrías mostrar un banner/botón para recargar.
          } else {
            console.log('✅ Contenido precargado para uso offline.')
          }
        }
      }
    }

    // Verifica actualizaciones del SW cada hora
    setInterval(() => {
      swRegistration.update()
    }, 3600000)
  } catch (err) {
    console.error('❌ Error al configurar Firebase Messaging:', err)
  }
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', registrarSWsYObtenerToken)
}

// Variables para el prompt de instalación
let deferredPrompt
const installButton = document.getElementById('installPwa')

// Ocultar el botón de instalación por defecto
if (installButton) {
  installButton.style.display = 'none'
}

// Escuchar el evento beforeinstallprompt
window.addEventListener('beforeinstallprompt', (e) => {
  // Prevenir que Chrome muestre el prompt automáticamente
  e.preventDefault()
  // Guardar el evento para usarlo después
  deferredPrompt = e
  // Mostrar el botón de instalación
  if (installButton) {
    installButton.style.display = 'block'
  }
})

// Manejar el clic en el botón de instalación
if (installButton) {
  installButton.addEventListener('click', async () => {
    if (!deferredPrompt) {
      return
    }
    // Mostrar el prompt de instalación
    deferredPrompt.prompt()
    // Esperar la respuesta del usuario
    const { outcome } = await deferredPrompt.userChoice
    console.log(`Usuario ${outcome === 'accepted' ? 'aceptó' : 'rechazó'} la instalación`)
    // Limpiar el prompt guardado
    deferredPrompt = null
    // Ocultar el botón
    installButton.style.display = 'none'
  })
}

// Detectar si la app está instalada
window.addEventListener('appinstalled', () => {
  console.log('PWA instalada exitosamente')
  // Ocultar el botón de instalación
  if (installButton) {
    installButton.style.display = 'none'
  }
})

// Manejar el estado de la conexión
function updateOnlineStatus () {
  const status = navigator.onLine
  document.body.classList.toggle('offline', !status)

  // Mostrar notificación de estado de conexión
  const toast = document.getElementById('connectionToast')
  if (toast) {
    toast.textContent = status ? '✅ Conexión restaurada' : '⚠️ Sin conexión a internet'
    toast.classList.remove('hide')
    toast.classList.add('show')
    setTimeout(() => {
      toast.classList.remove('show')
      toast.classList.add('hide')
    }, 3000)
  }
}

window.addEventListener('online', updateOnlineStatus)
window.addEventListener('offline', updateOnlineStatus)

// Función para compartir la aplicación
async function sharePwa () {
  if (navigator.share) {
    try {
      await navigator.share({
        title: 'Solicitudes Almacen',
        text: 'Aplicación para gestión de solicitudes de mezclas y productos',
        url: window.location.origin
      })
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Error al compartir:', error)
      }
    }
  }
}

// Ejecutar una vez al inicio
updateOnlineStatus()
// Exponer función de compartir globalmente
window.sharePwa = sharePwa
