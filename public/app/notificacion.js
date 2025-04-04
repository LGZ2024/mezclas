// Funciones para manejar las notificaciones
export const mostrarNotificacion = async (mensaje, fecha, idSolicitud) => {
  const container = document.getElementById('notificationContainer')
  const mensajeEl = document.getElementById('mensajeNotificacion')
  const fechaEl = document.getElementById('fechaNotificacion')

  const mensajeString = String(mensaje || '')

  mensajeEl.textContent = mensajeString
  fechaEl.textContent = new Date(fecha).toLocaleString()

  container.classList.add('notification-show')
  // cabiar estatus de la notificacion
  await cambiarEstado(idSolicitud)
}

export const closeNotification = () => {
  const container = document.getElementById('notificationContainer')
  container.classList.remove('notification-show')
}

const cambiarEstado = async (idSolicitud) => {
  const url = `/api/notificaciones/${idSolicitud}`
  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const data = await response.json()
    return data
  } catch (error) {
    console.error(error)
  }
}
