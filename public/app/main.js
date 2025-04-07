import { BrowserNotificationService } from './notififcaiones.js'
// Configuración
const CONFIG = {
  MOBILE_BREAKPOINT: 768,
  SWIPE_THRESHOLD: 50,
  ANIMATION_DURATION: 300
}
// Elementos DOM
const elements = {
  notifBtn: document.getElementById('notifBtn'),
  notifDropdown: document.getElementById('notifDropdown'),
  userProfileBtn: document.querySelector('.user-profile__btn'),
  userDropdown: document.getElementById('userDropdown'),
  notifCount: document.getElementById('notifCount'),
  notifList: document.getElementById('notifList'),
  clearNotifBtn: document.querySelector('.notifications__clear'),
  backdrop: document.getElementById('dropdownBackdrop'),
  body: document.body
}
document.addEventListener('DOMContentLoaded', async () => {
  // Inicializar servicio de notificaciones
  const notificationService = new BrowserNotificationService()
  await notificationService.init()
  // Agregar después de la inicialización del notificationService
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('message', async (event) => {
      const { type, data } = event.data

      switch (type) {
        case 'NUEVA_SOLICITUD':
          await notificationTypes.nuevaSolicitud(data)
          break
        case 'SOLICITUD_ACTUALIZADA':
          await notificationTypes.solicitudActualizada(data)
          break
        case 'SOLICITUD_COMPLETADA':
          await notificationTypes.solicitudCompletada(data)
          break
        default:
          console.log('Tipo de notificación no manejado:', type)
      }
    })
  }
  // Definir handlers globalmente primero
  const handlers = {
    closeAll: () => {
      elements.notifDropdown?.classList.remove('show')
      elements.userDropdown?.classList.remove('show')
      elements.backdrop?.classList.remove('show')
      elements.body.style.overflow = ''
    },

    toggle: (dropdown) => {
      if (!dropdown) return
      const isOpen = dropdown.classList.contains('show')

      handlers.closeAll()

      if (!isOpen) {
        dropdown.classList.add('show')
        elements.backdrop.classList.add('show')
        preventBodyScroll(true)
      } else {
        preventBodyScroll(false)
      }
    },

    clearNotifications: () => {
      if (elements.notifList) {
        elements.notifList.innerHTML = ''
        elements.notifCount.textContent = '0'
      }
    }
  }

  const touchUtils = {
    startY: 0,
    startX: 0,
    moved: false,
    startTime: 0,

    handleTouchStart: (e) => {
      touchUtils.startY = e.touches[0].clientY
      touchUtils.startX = e.touches[0].clientX
      touchUtils.moved = false
      touchUtils.startTime = Date.now()
    },
    handleTouchMove: (e) => {
      if (!touchUtils.startTime) return

      const currentY = e.touches[0].clientY
      const currentX = e.touches[0].clientX

      const deltaY = currentY - touchUtils.startY
      const deltaX = Math.abs(currentX - touchUtils.startX)

      // Verificar si el usuario ha movido lo suficiente
      if (Math.abs(deltaY) > 10 || deltaX > 10) {
        touchUtils.moved = true
      }

      // Solo permitir swipe down si estamos en la parte superior
      const notifList = elements.notifList
      const isAtTop = notifList ? notifList.scrollTop <= 0 : false

      if (deltaY > 0 && isAtTop) { // Swipe hacia abajo
        e.preventDefault() // Prevenir scroll

        // Aplicar transformación visual
        const translateY = Math.min(deltaY * 0.5, 200) // Limitar el deslizamiento
        elements.notifDropdown.style.transform = `translateY(${translateY}px)`

        // Si el swipe es suficientemente largo, cerrar
        if (deltaY > CONFIG.SWIPE_THRESHOLD * 2) {
          handlers.closeAll()
        }
      }
    },

    handleTouchEnd: (e) => {
      if (!touchUtils.startTime) return

      const target = e.target.closest('a')
      const timeDiff = Date.now() - touchUtils.startTime

      // Resetear la transformación
      elements.notifDropdown.style.transform = ''
      elements.notifDropdown.classList.remove('swiping')

      // Si fue un tap (no un swipe)
      if (!touchUtils.moved && timeDiff < 300 && target) {
        e.preventDefault()
        e.stopPropagation()

        const notifItem = target.closest('.notification__item')
        if (notifItem) {
          const id = notifItem.dataset.id

          actualizarEstadoNotificacion(id).then(() => {
            window.location.href = target.href
          }).catch(error => {
            console.error('Error:', error)
            showError('Error al actualizar la notificación')
          })
        }
      }

      // Resetear valores
      touchUtils.startY = 0
      touchUtils.startX = 0
      touchUtils.moved = false
      touchUtils.startTime = 0
    }
  }
  // Utilidades
  const utils = {
    isMobile: () => window.innerWidth <= CONFIG.MOBILE_BREAKPOINT,

    debounce: (func, wait) => {
      let timeout
      return (...args) => {
        clearTimeout(timeout)
        timeout = setTimeout(() => func(...args), wait)
      }
    },

    // Corregir la sintaxis aquí - eliminar utils.
    createNotification: (message, idSolicitud, id, time = new Date()) => {
      const notifId = `notif-${id}`
      const formattedTime = new Date(time).toLocaleString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })

      return `
        <div class="notification__item" data-id="${id}">
            <div class="notification__content">
                <a href="/protected/notificacion/${idSolicitud}" 
                   id="${notifId}"
                   rel="noopener noreferrer"
                   role="button"
                   class="notification-link">
                    <div class="notification__inner">
                        <i class="fas fa-bell"></i>
                        <div class="notification__details">
                            <p class="notification__text">${message}</p>
                            <span class="notification__time">${formattedTime}</span>
                        </div>
                    </div>
                </a>
            </div>
        </div>
    `
    },
    addNotificationListener: (id) => {
      const notifLink = document.getElementById(`notif-${id}`)
      if (notifLink) {
        notifLink.addEventListener('click', async (e) => {
          e.preventDefault()
          try {
            await actualizarEstadoNotificacion(id)
            window.location.href = notifLink.href
          } catch (error) {
            console.error('Error al actualizar notificación:', error)
          }
        })
      }
    }
  }

  // Agregar después de la declaración de utils
  const notificationTypes = {
    nuevaSolicitud: async (data) => {
      return notificationService.show('Nueva Solicitud', {
        body: `Se ha creado una nueva solicitud: ${data.mensaje}`,
        url: `/protected/notificacion/${data.id_solicitud}`,
        tag: `solicitud-${data.id}`,
        requireInteraction: true
      })
    },

    solicitudActualizada: async (data) => {
      return notificationService.show('Solicitud Actualizada', {
        body: `La solicitud ${data.id_solicitud} ha sido actualizada`,
        url: `/protected/notificacion/${data.id_solicitud}`,
        tag: `update-${data.id}`
      })
    },

    solicitudCompletada: async (data) => {
      return notificationService.show('Solicitud Completada', {
        body: `La solicitud ${data.id_solicitud} ha sido completada`,
        url: '/protected/completadas',
        tag: `complete-${data.id}`
      })
    }
  }

  const initializeMobileEvents = () => {
    if (utils.isMobile() && elements.notifList) {
      // Cambiamos passive: true por false para permitir preventDefault()
      elements.notifList.addEventListener('touchstart', touchUtils.handleTouchStart, { passive: false })
      elements.notifList.addEventListener('touchmove', touchUtils.handleTouchMove, { passive: false })
      elements.notifList.addEventListener('touchend', touchUtils.handleTouchEnd, { passive: false })

      // Agregar manejador para el gesto de deslizar
      elements.notifDropdown.addEventListener('touchmove', (e) => {
        if (elements.notifList.scrollTop <= 0) {
          e.preventDefault()
        }
      }, { passive: false })
    }
  }
  // Llamar después de initializeEventListeners
  initializeMobileEvents()

  // Modificar initializeEventListeners para usar los handlers globales
  const initializeEventListeners = () => {
    // Cambiar 'handlers' por 'eventHandlers'
    const eventHandlers = {
      notifBtnClick: (e) => {
        e.stopPropagation()
        handlers.toggle(elements.notifDropdown)
      },
      userProfileBtnClick: (e) => {
        e.stopPropagation()
        handlers.toggle(elements.userDropdown)
      }
    }

    // Asignar event listeners usando los handlers correctos
    elements.notifBtn?.addEventListener('click', eventHandlers.notifBtnClick)
    elements.userProfileBtn?.addEventListener('click', eventHandlers.userProfileBtnClick)
    elements.backdrop?.addEventListener('click', (e) => {
      if (e.target === elements.backdrop) {
        e.preventDefault()
        e.stopPropagation()
        handlers.closeAll()
      }
    })

    document.addEventListener('click', (e) => {
      if (utils.isMobile()) return

      const isNotificationClick = e.target.closest('.notifications')
      const isUserProfileClick = e.target.closest('.user-profile')
      const isBackdropClick = e.target.closest('.dropdown-backdrop')

      if (!isNotificationClick && !isUserProfileClick && !isBackdropClick) {
        handlers.closeAll()
      }
    })

    // Eventos de ventana
    window.addEventListener('resize', utils.debounce(handlers.closeAll, 150))
    window.addEventListener('orientationchange', handlers.closeAll)

    return eventHandlers
  }
  // Inicializar
  const eventHandlers = initializeEventListeners()
  // Cleanup de eventos cuando el componente se desmonta
  const cleanup = () => {
    // Remover eventos móviles
    if (utils.isMobile()) {
      const notifList = elements.notifList
      if (notifList) {
        // Remover todos los event listeners
        const eventListeners = [
          { event: 'touchmove', handler: touchUtils.handleTouchMove },
          { event: 'touchstart', handler: touchUtils.handleTouchStart },
          { event: 'touchend', handler: touchUtils.handleTouchEnd },
          { event: 'click', handler: handlers.clearNotifications }
        ]

        eventListeners.forEach(({ event, handler }) => {
          notifList.removeEventListener(event, handler)
        })
      }
    }

    // Remover eventos globales con referencia guardada
    const debouncedResize = utils.debounce(handlers.closeAll, 150)
    window.removeEventListener('resize', debouncedResize)
    window.removeEventListener('orientationchange', handlers.closeAll)

    // Remover eventos de click
    elements.notifBtn?.removeEventListener('click', handlers.notifBtnClick)
    elements.userProfileBtn?.removeEventListener('click', handlers.userProfileBtnClick)
    elements.backdrop?.removeEventListener('click', handlers.closeAll)
    elements.clearNotifBtn?.removeEventListener('click', handlers.clearNotifications)
  }
  // Agregar el cleanup al window para poder llamarlo cuando sea necesario
  window.addEventListener('unload', cleanup)

  // Ejemplo de uso
  window.addNotification = async (message, idSolicitud, id) => {
    if (elements.notifList) {
      // Agregar al DOM
      elements.notifList.insertAdjacentHTML('afterbegin',
        utils.createNotification(message, idSolicitud, id)
      )
      utils.addNotificationListener(id)

      try {
        // Mostrar notificación del navegador con opciones mejoradas
        await notificationService.show('Nueva Notificación', {
          body: message,
          url: `/protected/notificacion/${idSolicitud}`,
          tag: `notif-${id}`, // Evita duplicados
          renotify: true, // Notifica aunque exista una con el mismo tag
          requireInteraction: true, // La notificación permanece hasta que el usuario interactúe
          data: {
            idSolicitud,
            id,
            timestamp: new Date().getTime()
          }
        })
      } catch (error) {
        console.error('Error al mostrar notificación:', error)
      }
    }
  }

  // obtenemos las notificaciones del usuario
  const obtenerNotificaciones = async () => {
    try {
      const response = await fetch('/api/notificaciones')
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()

      // Mostrar notificaciones no leídas
      // data.filter(notif => !notif.leida).forEach(async (element) => {
      //   await window.addNotification(element.mensaje, element.id_solicitud, element.id)
      // })

      return data
    } catch (error) {
      console.error('Error fetching notificaciones:', error)
      throw error
    }
  }

  obtenerNotificaciones().then((data) => {
    // Mostrar notificaciones no leídas
    data.filter(notif => !notif.leida).forEach(async (element) => {
      await window.addNotification(element.mensaje, element.id_solicitud, element.id)
    })
  }).catch(error => {
    console.error('Error al cargar notificaciones:', { error })
    showError('Error al cargar las notificaciones')
  })

  const showError = (message) => {
    console.error(message)
    // Implementar toast o notificación visual
    const toast = document.createElement('div')
    toast.className = 'error-toast'
    toast.textContent = message
    document.body.appendChild(toast)

    setTimeout(() => {
      toast.remove()
    }, 3000)
  }
  // funcion para notificacion igresar pagina y actulizar estado
  async function actualizarEstadoNotificacion (idSolicitud) {
    try {
      const response = await fetch(`/api/notificaciones/${idSolicitud}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`Error al actualizar: ${response.status}`)
      }

      const data = await response.json()

      // Actualizar UI
      const notifItem = document.querySelector(`[data-id="${idSolicitud}"]`)
      if (notifItem) {
        notifItem.classList.add('notification--read')
        updateNotificationCount(false)
      }

      return data
    } catch (error) {
      showError('Error al actualizar la notificación')
      throw error
    }
  }
  const debouncedScroll = utils.debounce(() => {
    const notifList = elements.notifList
    if (notifList) {
      const isAtTop = notifList.scrollTop === 0
      const isAtBottom = notifList.scrollHeight - notifList.scrollTop === notifList.clientHeight

      if (isAtTop || isAtBottom) {
        notifList.style.overscrollBehavior = 'auto'
      } else {
        notifList.style.overscrollBehavior = 'contain'
      }
    }
  }, 100)

  const updateNotificationCount = (increment = true) => {
    const count = parseInt(elements.notifCount.textContent) || 0
    const newCount = increment ? count + 1 : count - 1
    elements.notifCount.textContent = Math.max(0, newCount).toString()
    elements.notifCount.style.display = newCount === 0 ? 'none' : 'block'
  }
  const preventBodyScroll = (prevent) => {
    if (prevent) {
      const scrollY = window.scrollY
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollY}px`
      document.body.style.width = '100%'
    } else {
      const scrollY = document.body.style.top
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
      window.scrollTo(0, parseInt(scrollY || '0') * -1)
    }
  }

  const btnSolicitar = document.getElementById('solicitar')
  if (btnSolicitar) {
    btnSolicitar.addEventListener('click', () => {
      window.location.href = '/protected/solicitud'
    })
  } else {
    console.log('No se encontró el botón')
  }

  document.getElementById('solicitud').addEventListener('click', () => {
    window.location.href = '/protected/solicitudes'
  })
  document.getElementById('preparadas').addEventListener('click', () => {
    window.location.href = '/protected/proceso'
  })
  document.getElementById('entregadas').addEventListener('click', () => {
    window.location.href = '/protected/completadas'
  })
})
