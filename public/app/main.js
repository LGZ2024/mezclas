// Configuración
const CONFIG = {
  MOBILE_BREAKPOINT: 768,
  SWIPE_THRESHOLD: 50,
  ANIMATION_DURATION: 300
}
// Elementos DOM
const elements = {
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
    }
  }

  // eslint-disable-next-line no-unused-vars
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
  // initializeMobileEvents()

  // Modificar initializeEventListeners para usar los handlers globales
  const initializeEventListeners = () => {
    // Cambiar 'handlers' por 'eventHandlers'
    const eventHandlers = {
      userProfileBtnClick: (e) => {
        e.stopPropagation()
        handlers.toggle(elements.userDropdown)
      }
    }

    // Asignar event listeners usando los handlers correctos
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

      const isUserProfileClick = e.target.closest('.user-profile')
      const isBackdropClick = e.target.closest('.dropdown-backdrop')

      if (!isUserProfileClick && !isBackdropClick) {
        handlers.closeAll()
      }
    })

    // Eventos de ventana
    window.addEventListener('resize', utils.debounce(handlers.closeAll, 150))
    window.addEventListener('orientationchange', handlers.closeAll)

    return eventHandlers
  }

  // Inicializar
  // eslint-disable-next-line no-unused-vars
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
    elements.userProfileBtn?.removeEventListener('click', handlers.userProfileBtnClick)
    elements.backdrop?.removeEventListener('click', handlers.closeAll)
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
    }
  }

  // funcion para notificacion igresar pagina y actulizar estado
  // eslint-disable-next-line no-unused-vars
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
  const btnSolicitudes = document.getElementById('solicitudes')
  const btnSolicitud = document.getElementById('solicitud')
  const btnPreparadas = document.getElementById('preparadas')
  const btnEntregadas = document.getElementById('entregadas')
  const canceladas = document.getElementById('canceladas')

  if (btnSolicitar) {
    btnSolicitar.addEventListener('click', () => {
      window.location.href = '/protected/solicitud/registrar'
    })
  } else {
    console.log('No se encontró el botón')
  }

  if (btnSolicitudes) {
    btnSolicitudes.addEventListener('click', () => {
      window.location.href = '/protected/solicitud/validacion'
    })
  } else {
    console.log('No se encontró el botón')
  }

  if (canceladas) {
    canceladas.addEventListener('click', () => {
      window.location.href = '/protected/solicitud/canceladas'
    })
  } else {
    console.log('No se encontró el botón')
  }

  if (btnSolicitud) {
    btnSolicitud.addEventListener('click', () => {
      window.location.href = '/protected/solicitud/pendientes'
    })
  } else {
    console.log('No se encontró el botón')
  }

  if (btnPreparadas) {
    btnPreparadas.addEventListener('click', () => {
      window.location.href = '/protected/solicitud/proceso'
    })
  } else {
    console.log('No se encontró el botón')
  }

  if (btnEntregadas) {
    btnEntregadas.addEventListener('click', () => {
      window.location.href = '/protected/solicitud/completadas'
    })
  } else {
    console.log('No se encontró el botón')
  }
})
