import { mostrarMensaje } from '../mensajes.js'
// obtenemos las notificaciones del usuario
const obtenerNotificaciones = async () => {
  try {
    const response = await fetch('/api/notificaciones')
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching notificaciones:', error)
    throw error
  }
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
    }

    return data
  } catch (error) {
    mostrarMensaje({
      msg: 'Error al actualizar la notificación',
      type: 'error'
    })
    throw error
  }
}

// mostramos las notificaciones en el navbar
export const mostrarNotificaciones = async () => {
  const notificaciones = await obtenerNotificaciones()
  const container = document.getElementById('container-notificaciones')
  const notifCount = document.getElementById('notifCount')
  notifCount.textContent = notificaciones.length
  container.innerHTML = ''
  notificaciones.forEach((notificacion) => {
    const notificacionElement = document.createElement('a')
    notificacionElement.classList.add('dropdown-item', 'py-1', 'd-flex', 'align-items-center', 'justify-content-between')
    notificacionElement.href = `/protected/notificacion/${notificacion.id_solicitud}`
    notificacionElement.dataset.id = notificacion.id
    notificacionElement.innerHTML = `
        <span>${notificacion.mensaje}</span>
      `
    container.appendChild(notificacionElement)
    const divider = document.createElement('div')
    divider.classList.add('dropdown-divider')
    container.appendChild(divider)
  })

  // Agregar evento para actualizar estado de notificación
  container.addEventListener('click', async (event) => {
    const notifItem = event.target.closest('.dropdown-item')
    if (notifItem) {
      const idSolicitud = notifItem.dataset.id
      await actualizarEstadoNotificacion(idSolicitud)
    }
  })
}
