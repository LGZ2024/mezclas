/* eslint-disable no-undef */
import { iniciarSolicitudes } from './tablaConfirmacion.js'
// import { iniciarProductosReceta, verProductosReceta } from '../productosReceta/productos.js'
import { enviarEstados } from './enviarEstado.js'
import { showSpinner, hideSpinner } from '../spinner.js'
import { mostrarMensaje, fetchApi } from '../mensajes.js'
import { descargarReporte } from '../pendientes/reporte.js'

document.addEventListener('DOMContentLoaded', () => {
  const tabla = document.getElementById('tbSolicitadas')
  const validacion = document.getElementById('validacion')
  const reporte = document.getElementById('reporte')
  const confirmacion = document.getElementById('confirmacion')
  const cancelacion = document.getElementById('cancelacion')
  const formCancelacion = document.getElementById('formCancelacion')

  // metodos de regreso o retorceso
  $(document).on('click', '#regresarInicio', () => {
    window.location.href = '/protected/admin'
  })

  if (tabla) {
    iniciarSolicitudes()
  } else {
    console.warn('Tabla with ID "tbSolicitadas" not found.')
  }

  if (validacion) {
    validacion.addEventListener('click', enviarEstados)
  } else {
    console.warn('Button with ID "validacion" not found.')
  }

  if (reporte) {
    reporte.addEventListener('click', async (e) => {
      showSpinner()
      const url = '/api/reporte-pendientes'
      try {
        await descargarReporte(url)
      } catch (error) {
        hideSpinner()
        mostrarMensaje({
          msg: 'Error al descargar el reporte',
          type: 'error'
        })
      } finally {
        hideSpinner()
      }
    })
  } else {
    console.warn('Button with ID "reporte" not found.')
  }

  if (confirmacion) {
    confirmacion.addEventListener('click', async (e) => {
      e.preventDefault()
      const idSolicitud = document.getElementById('idSolicit').value

      const estados = []
      estados.push({
        id_solicitud: idSolicitud,
        validacion: true
      })

      const url = '/api/validacion/'
      showSpinner()
      try {
        const response = await fetchApi(url, 'POST', estados)
        const res = await response.json()
        if (response.ok) {
          // Destruir DataTable existente antes de reinicializar
          const table = $('#tbSolicitadas').DataTable()
          if (table) {
            table.destroy()
          }
          // Limpiar contenido de la tabla
          $('#tbSolicitadas').empty()
          // Reinicializar tabla y actualizar datos
          iniciarSolicitudes()

          // ocultar modal
          $('#modalInformacion').modal('hide')

          mostrarMensaje({
            msg: res.message,
            type: 'success'
          })

          return
        }
        return mostrarMensaje({
          msg: res.message,
          type: 'error'
        })
      } catch (error) {
        hideSpinner()
        mostrarMensaje({
          msg: error.message,
          type: 'error'
        })
      } finally {
        hideSpinner()
      }
    })
  } else {
    console.warn('Button with ID "confirmacion" not found.')
  }

  if (cancelacion) {
    cancelacion.addEventListener('click', () => {
      $('#modalInformacion').modal('hide')
      $('#modalCancelacion').modal('show')
    })
  } else {
    console.warn('Button with ID "cancelacion" not found.')
  }

  if (formCancelacion) {
    formCancelacion.addEventListener('submit', async (e) => {
      e.preventDefault()
      const motivo = document.getElementById('motivo').value
      const idSolicitud = document.getElementById('idSolicit').value
      if (!motivo || !idSolicitud) {
        mostrarMensaje({
          msg: 'Por favor, ingresa un motivo y una solicitud',
          type: 'error'
        })
        return
      }
      showSpinner()
      const url = `/api/cancelarSolicitud/${idSolicitud}`
      try {
        const response = await fetchApi(url, 'PATCH', {
          motivo, validacion: false
        })
        // console.log(response)
        const res = await response.json()
        if (response.ok) {
          $('#modalCancelacion').modal('hide')
          mostrarMensaje({
            msg: res.message,
            type: 'success'
          })
          iniciarSolicitudes()
        }
      } catch (error) {
        hideSpinner()
        mostrarMensaje({
          msg: error.message,
          type: 'error'
        })
      } finally {
        hideSpinner()
      }
    })
  }
})
