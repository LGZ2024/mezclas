/* eslint-disable no-undef */
import { mostrarMensaje, fetchApi } from '../mensajes.js'
import { closeNotification, mostrarNotificacion } from '../notificacion.js'

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('formMensaje')
  const regresar = document.getElementById('regresar')
  const idSolicitud = document.getElementById('idSolicitud').value
  const idMezclador = document.getElementById('idMezclador').value
  const mensaje = document.getElementById('mensajes')

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault()
      const mensajes = document.getElementById('mensaje').value
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
  } else {
    console.warn('Form with ID "formMensaje" not found.')
  }

  regresar.addEventListener('click', () => {
    window.location.href = '/protected/admin'
  })

  document.getElementById('closeNotification').addEventListener('click', closeNotification)

  if (mensaje) mostrarNotificacion(mensaje.value, new Date())
})
