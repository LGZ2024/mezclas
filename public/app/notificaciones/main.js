/* eslint-disable no-undef */
import { mostrarMensaje, fetchApi } from '../mensajes.js'

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('formMensaje')
  const regresar = document.getElementById('regresar')

  function mostrarNotificacion (mensaje, fecha) {
    const container = document.getElementById('notificationContainer')
    const mensajeEl = document.getElementById('mensajeNotificacion')
    const fechaEl = document.getElementById('fechaNotificacion')

    mensajeEl.textContent = mensaje
    fechaEl.textContent = new Date(fecha).toLocaleString()

    container.classList.add('notification-show')
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault()
    const mensajes = document.getElementById('mensaje').value
    console.log(idSolicitud)
    try {
      const response = await fetchApi(`/api/notificacion/${idSolicitud}`, 'PATCH', { mensajes, idMesclador: idMezclador })
      const respuesta = response.json()
      console.log(respuesta)
      mostrarMensaje({
        msg: respuesta,
        type: 'success',
        redirectUrl: '/protected/admin'
      })
    } catch (error) {
      console.error(error)
    }
  })

  function closeNotification () {
    const container = document.getElementById('notificationContainer')
    container.classList.remove('notification-show')
  }

  regresar.addEventListener('click', () => {
    window.location.href = '/protected/admin'
  })

  document.getElementById('closeNotification').addEventListener('click', closeNotification)

  if (mensaje) mostrarNotificacion(mensaje, new Date())
})
