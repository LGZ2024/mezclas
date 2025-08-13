class PWAManager {
  constructor () {
    this.deferredPrompt = null
    this.installButton = document.getElementById('installPwa')
    this.setupEventListeners()
    this.initializeServiceWorker()
  }

  async initializeServiceWorker () {
    if (!('serviceWorker' in navigator)) return

    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js')
      console.log('✅ Service Worker registrado:', registration.scope)
      this.handleServiceWorkerUpdates(registration)
      this.setupPeriodicUpdates(registration)
    } catch (error) {
      console.error('❌ Error al registrar Service Worker:', error)
    }
  }

  handleServiceWorkerUpdates (registration) {
    registration.onupdatefound = () => {
      const installingWorker = registration.installing
      installingWorker.onstatechange = () => {
        if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
          this.showUpdateNotification()
        }
      }
    }
  }

  setupPeriodicUpdates (registration) {
    // Verificar actualizaciones cada hora
    setInterval(() => registration.update(), 3600000)
  }

  setupEventListeners () {
    // Eventos de instalación
    window.addEventListener('beforeinstallprompt', this.handleBeforeInstallPrompt.bind(this))
    window.addEventListener('appinstalled', this.handleAppInstalled.bind(this))

    // Eventos de conexión
    window.addEventListener('online', () => this.updateOnlineStatus(true))
    window.addEventListener('offline', () => this.updateOnlineStatus(false))

    // Evento del botón de instalación
    if (this.installButton) {
      this.installButton.addEventListener('click', () => this.installPWA())
      this.installButton.style.display = 'none'
    }
  }

  handleBeforeInstallPrompt (event) {
    event.preventDefault()
    this.deferredPrompt = event
    if (this.installButton) {
      this.installButton.style.display = 'block'
    }
  }

  async installPWA () {
    if (!this.deferredPrompt) return

    try {
      this.deferredPrompt.prompt()
      const { outcome } = await this.deferredPrompt.userChoice
      console.log(`Usuario ${outcome === 'accepted' ? 'aceptó' : 'rechazó'} la instalación`)
    } catch (error) {
      console.error('Error durante la instalación:', error)
    } finally {
      this.deferredPrompt = null
      if (this.installButton) {
        this.installButton.style.display = 'none'
      }
    }
  }

  handleAppInstalled () {
    console.log('✅ PWA instalada exitosamente')
    if (this.installButton) {
      this.installButton.style.display = 'none'
    }
  }

  updateOnlineStatus (isOnline) {
    document.body.classList.toggle('offline', !isOnline)
    this.showConnectionToast(isOnline)
  }

  showConnectionToast (isOnline) {
    const toast = document.getElementById('connectionToast')
    if (!toast) return

    const message = isOnline ? '✅ Conexión restaurada' : '⚠️ Sin conexión a internet'
    toast.textContent = message
    toast.classList.remove('hide')
    toast.classList.add('show')

    setTimeout(() => {
      toast.classList.remove('show')
      toast.classList.add('hide')
    }, 3000)
  }

  showUpdateNotification () {
    // Implementar lógica de notificación de actualización
    console.log('🔄 Nueva actualización disponible')
  }

  async sharePwa () {
    if (!navigator.share) return

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

// Inicializar la aplicación
const pwaManager = new PWAManager()
window.sharePwa = () => pwaManager.sharePwa()
