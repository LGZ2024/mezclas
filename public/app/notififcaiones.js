export class BrowserNotificationService {
  constructor () {
    this.config = {
      icon: '/img/LogoTransp.png',
      badge: '/img/badge.png',
      vibrate: [200, 100, 200],
      requireInteraction: true,
      silent: false
    }
  }

  async init () {
    try {
      if (!('Notification' in window)) {
        console.warn('Este navegador no soporta notificaciones')
        return false
      }

      if (Notification.permission === 'granted') {
        return true
      }

      if (Notification.permission !== 'denied') {
        const permission = await Notification.requestPermission()
        return permission === 'granted'
      }

      return false
    } catch (error) {
      console.error('Error al inicializar notificaciones:', error)
      return false
    }
  }

  async show (title, options = {}) {
    try {
      if (Notification.permission !== 'granted') {
        return
      }

      const notification = new Notification(title, {
        ...this.config,
        ...options,
        timestamp: Date.now()
      })

      notification.onclick = () => {
        window.focus()
        if (options.url) {
          window.location.href = options.url
        }
        notification.close()
      }

      return notification
    } catch (error) {
      console.error('Error al mostrar notificación:', error)
    }
  }
}
