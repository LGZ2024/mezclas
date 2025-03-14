/* eslint-disable no-undef */
import { mostrarMensaje, fetchApi } from '../mensajes.js'

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('formMensaje')
  // alert(idSolicitud)
  // alert(idMezclador)
  // alert(mensaje)
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
      mostrarMensaje({
        msg: respuesta,
        type: 'success'
      })
    } catch (error) {
      console.error(error)
    }
  })

  function closeNotification () {
    const container = document.getElementById('notificationContainer')
    container.classList.remove('notification-show')
  }

  mostrarNotificacion(mensaje, new Date())
})
