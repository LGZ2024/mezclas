/* eslint-disable no-undef */
import { mostrarMensaje, fetchApi } from '../mensajes.js'
import { closeNotification, mostrarNotificacion, cambiarEstado } from '../notificacion.js'
import { showSpinner, hideSpinner } from '../spinner.js'

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('formMensaje')
  const regresar = document.getElementById('regresar')
  const idSolicitud = Number(document.getElementById('idSolicitud').value)
  const idMezclador = document.getElementById('idMezclador').value
  const idNotificacion = document.getElementById('idNotificacion').value
  const mensaje = document.getElementById('mensajes')

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault()
      showSpinner()
      const mensajes = document.getElementById('mensaje').value

      try {
        const response = await fetchApi(`/api/notificacion/${idSolicitud}`, 'PATCH', { mensajes, idMesclador: idMezclador })
        const respuesta = await response.json()

        if (idNotificacion) {
          await cambiarEstado(idNotificacion)
        }

        if (response.ok) {
          hideSpinner()
          mostrarMensaje({
            msg: respuesta.message,
            type: 'success',
            redirectUrl: '/protected/admin'
          })
        } else {
          hideSpinner()
          mostrarMensaje({
            msg: respuesta.message,
            type: 'error'
          })
        }
      } catch (error) {
        hideSpinner()
        console.error(error)
      } finally {
        hideSpinner()
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
