class ServiceWorkerUpdater {
  constructor () {
    this.notificationTimeout = 5000 // 5 segundos para auto-ocultar
    this.registerMessageListener()
    this.checkForUpdates() // Verificar actualizaciones al iniciar
  }

  // Método para verificar actualizaciones periódicamente
  async checkForUpdates () {
    try {
      const registration = await navigator.serviceWorker.getRegistration()
      if (registration) {
        await registration.update()
      }
    } catch (error) {
      console.error('Error al verificar actualizaciones:', error)
    }

    // Verificar cada 60 minutos
    setTimeout(() => this.checkForUpdates(), 60 * 60 * 1000)
  }

  registerMessageListener () {
    if (!navigator.serviceWorker) {
      console.warn('Service Worker no soportado')
      return
    }

    navigator.serviceWorker.addEventListener('message', (event) => {
      if (event.data.type === 'UPDATE_AVAILABLE') {
        this.showUpdateNotification(event.data.version)
      }
    })
  }

  showUpdateNotification (version) {
    const existingNotification = document.querySelector('.update-notification')
    if (existingNotification) {
      existingNotification.remove()
    }

    const notification = this.createNotificationElement(version)
    document.body.appendChild(notification)

    this.setupNotificationListeners(notification)

    // Auto-ocultar después del tiempo especificado
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove()
      }
    }, this.notificationTimeout)
  }

  createNotificationElement (version) {
    const notification = document.createElement('div')
    notification.className = 'update-notification'
    notification.innerHTML = `
      <div class="update-content">
        <p>¡Nueva versión disponible! (${version})</p>
        <div class="update-buttons">
          <button id="updateNow" class="btn-primary">Actualizar ahora</button>
          <button id="updateLater" class="btn-secondary">Más tarde</button>
        </div>
      </div>
    `
    return notification
  }

  setupNotificationListeners (notification) {
    const updateNowBtn = notification.querySelector('#updateNow')
    const updateLaterBtn = notification.querySelector('#updateLater')

    updateNowBtn?.addEventListener('click', () => {
      this.performUpdate()
      notification.remove()
    })

    updateLaterBtn?.addEventListener('click', () => {
      notification.remove()
    })
  }

  async performUpdate () {
    try {
      const registration = await navigator.serviceWorker.getRegistration()
      if (registration?.waiting) {
        // Mostrar mensaje de carga
        this.showLoadingState()

        registration.waiting.postMessage({ type: 'SKIP_WAITING' })

        // Esperar un momento antes de recargar
        await new Promise(resolve => setTimeout(resolve, 1000))
        window.location.reload()
      }
    } catch (error) {
      console.error('Error durante la actualización:', error)
      this.showErrorMessage()
    }
  }

  showLoadingState () {
    const loader = document.createElement('div')
    loader.className = 'update-loader'
    loader.innerHTML = '<p>Actualizando...</p>'
    document.body.appendChild(loader)
  }

  showErrorMessage () {
    const errorMsg = document.createElement('div')
    errorMsg.className = 'update-error'
    errorMsg.innerHTML = '<p>Error al actualizar. Por favor, recarga la página.</p>'
    document.body.appendChild(errorMsg)

    setTimeout(() => errorMsg.remove(), 3000)
  }
}
