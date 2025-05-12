/* eslint-disable no-undef */
import { iniciarProceso, verProceso } from './canceladas2.js'
import { mostrarMensaje } from '../mensajes.js'
import { iniciarProductosReceta, verProductosReceta } from '../productosReceta/productos.js'
import { showSpinner, hideSpinner } from '../spinner.js'
import { inicializarFormulario } from '../pendientes/listaProductos.js'
import { fetchApi } from '../funciones.js'
document.addEventListener('DOMContentLoaded', () => {
  const nuevoProducto = document.getElementById('agregarProductoReceta')
  const confirmacion = document.getElementById('confirmacion')
  const regresar = document.getElementById('regresarInicio')
  iniciarProceso()
  verProceso()

  // evento para regresar a la pagina de inicio
  regresar.addEventListener('click', async (e) => {
    e.preventDefault()
    window.location.href = '/protected/admin'
  })
  // metodo para mandar los datos del nuevo producto
  document.getElementById('productoForm').addEventListener('submit', async (e) => {
    e.preventDefault()
    showSpinner()
    const sololitud = document.getElementById('idSolicitud') || document.getElementById('idSolicit')
    const idSolicitud = sololitud.value
    console.log(idSolicitud)
    const producto = document.getElementById('producto').value
    const cantidad = document.getElementById('cantidadP').value
    const unidadMedida = document.getElementById('unidad_medida').value

    if (!producto) {
      mostrarMensaje({
        msg: 'Por favor, selecciona un producto.',
        type: 'error'
      })
      return // Salir de la función si hay un error
    }
    if (!unidadMedida) {
      mostrarMensaje({
        msg: 'Por favor, selecciona una unidad de medida.',
        type: 'error'
      })
      return // Salir de la función si hay un error
    }
    if (!cantidad || cantidad <= 0) {
      mostrarMensaje({
        msg: 'Por favor, ingresa una cantidad válida.',
        type: 'error'
      })
      return // Salir de la función si hay un error
    }

    // creamos array para mandar datos
    const data = {
      idSolicitud,
      producto,
      cantidad,
      unidadMedida
    }
    const url = '/api/productoSoli'
    try {
      const response = await fetchApi(url, 'POST', data)
      const res = await response.json()
      console.log(res)
      if (!response.ok) {
        hideSpinner()
        return mostrarMensaje({
          msg: res.message,
          type: 'error'
        })
      }

      mostrarMensaje({
        msg: res.message,
        type: 'success'
      })
      $('#exampleModal').modal('hide')
      $('#staticBackdrop').modal('show')
      iniciarProductosReceta(idSolicitud)
      verProductosReceta({
        eliminarUltimaColumna: false,
        depuracion: true
      })
    } catch (error) {
      console.log(error)
      hideSpinner()
    } finally {
      hideSpinner()
    }
  })
  if (nuevoProducto) {
    nuevoProducto.addEventListener('click', async () => {
      try {
        // Cerrar el primer modal de forma segura
        const staticBackdropModal = bootstrap.Modal.getInstance(document.getElementById('staticBackdrop'))
        if (staticBackdropModal) {
          staticBackdropModal.hide()
        }

        // Esperar un momento antes de mostrar el segundo modal
        setTimeout(() => {
          // Mostrar el segundo modal
          const exampleModal = new bootstrap.Modal(document.getElementById('exampleModal'))
          exampleModal.show()

          // Inicializar formulario después de que el modal esté visible
          inicializarFormulario()
        }, 150)
      } catch (error) {
        console.error('Error al manejar modales:', error)
        mostrarMensaje({
          msg: 'Error al abrir el formulario',
          type: 'error'
        })
      }
    })
  } else {
    console.warn('Button with ID "nuevoProducto" not found.')
  }
  if (confirmacion) {
    confirmacion.addEventListener('click', async (e) => {
      e.preventDefault()
      const idSolicitud = document.getElementById('idSolicit').value
      const url = '/api/mezclasConfirmar/' + idSolicitud
      try {
        const response = await fetchApi(url, 'PATCH')
        console.log(response)
        if (!response.ok) {
          return mostrarMensaje({
            msg: response.message,
            type: 'error'
          })
        }
        mostrarMensaje({
          msg: response.message,
          type: 'success',
          redirectUrl: '/protected/admin'
        })
      } catch (error) {
        console.error('Error:', error)
        mostrarMensaje({
          msg: 'Error al cancelar la solicitud',
          type: 'error'
        })
      }

      $('#staticBackdrop').modal('show')
    })
  } else {
    console.warn('Button with ID "confirmacion" not found.')
  }
})
