// Funciones para manejar las notificaciones
export const mostrarNotificacion = (mensaje, fecha) => {
  const container = document.getElementById('notificationContainer')
  const mensajeEl = document.getElementById('mensajeNotificacion')
  const fechaEl = document.getElementById('fechaNotificacion')

  const mensajeString = String(mensaje || '')

  mensajeEl.textContent = mensajeString
  fechaEl.textContent = new Date(fecha).toLocaleString()

  container.classList.add('notification-show')
}

export const closeNotification = () => {
  const container = document.getElementById('notificationContainer')
  container.classList.remove('notification-show')
}
