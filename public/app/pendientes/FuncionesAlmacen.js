/* eslint-disable no-undef */
import { iniciarSolicitudes, verSolicitud, fechProductosSolicitud, fechSolicitudProceso } from './tablaMesclaAlmacen.js'
import { iniciarProductosReceta, verProductosReceta } from '../productosReceta/productos.js'
import { inicializarFormulario } from './listaProductos.js'
import { mostrarMensaje } from '../mensajes.js'
import { enviarEstadoProductos } from './enviarEstado.js'
import { descargarExcel } from './reporte.js'

document.addEventListener('DOMContentLoaded', () => {
  const btnGuardarMezcla = document.getElementById('btnGuardarMescla')
  const nuevoProducto = document.getElementById('nuevoProducto')
  const btnEnviarEstado = document.getElementById('btnEnviarEstado')
  const btnDescargarExcel = document.getElementById('descargar')
  // descargar solicitud

  // metodo boton receta
  document.getElementById('receta').addEventListener('click', async () => {
    const idSolicitud = document.getElementById('idSolicitud').value
    const rol = document.getElementById('rol').value
    $('#staticBackdrop').modal('show')
    // iniciamos tabla
    iniciarProductosReceta(idSolicitud)
    // iniciamos rol
    if (rol === 'mezclador') {
      await verProductosReceta({
        eliminarUltimaColumna: false,
        depuracion: true
      })
    } else {
      await verProductosReceta({
        eliminarUltimaColumna: true,
        columnaAEliminar: -1, // Última columna
        depuracion: true
      })
    }
  })

  // metodo para mandar los datos del nuevo producto
  document.getElementById('productoForm').addEventListener('submit', async (e) => {
    e.preventDefault()
    const idSolicitud = document.getElementById('idSolicitud').value
    const producto = document.getElementById('producto').value
    const cantidad = document.getElementById('cantidad').value
    const unidadMedida = document.getElementById('unidad_medida').value
    // convertimos entero
    const cantidadNum = parseFloat(cantidad)
    // Validar que todos los campos requeridos estén llenos
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
    // Validar cantidad según la unidad de medida
    if (unidadMedida === 'litro' || unidadMedida === 'kilogramo') {
      if (!Number.isInteger(cantidadNum) && (cantidadNum * 10) % 5 !== 0) {
        mostrarMensaje({
          msg: 'Por favor, ingresa un número entero o medio (ej. 1 o 1.5).',
          type: 'error'
        })
        return // Salir de la función si hay un error
      }
    } else {
      if (!Number.isInteger(cantidadNum)) {
        mostrarMensaje({
          msg: 'Por favor, ingresa un número enteros',
          type: 'error'
        })
        return // Salir de la función si hay un error
      }
    }

    // creamos array para mandar datos
    const data = {
      idSolicitud,
      producto,
      cantidad,
      unidadMedida
    }
    try {
      const response = await fechProductosSolicitud(data)
      if (response.error) {
        return mostrarMensaje({
          msg: response.error,
          type: 'error'
        })
      }

      mostrarMensaje({
        msg: response.message,
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
    }
  })

  // metodos de regreso o retorceso
  $(document).on('click', '#regresarInicio', () => {
    window.location.href = '/protected/admin'
  })

  $(document).on('click', '#regresatabla', () => {
    document.getElementById('tablaFuciones').style.display = 'block'
    document.getElementById('formPreparadas').style.display = 'none'
  })

  $(document).on('click', '#cerrarNuevoProducto', () => {
    $('#exampleModal').modal('hide')
    $('#staticBackdrop').modal('show')
  })

  // verificamos si el boton para guardar mezcla esta abilitado
  if (btnGuardarMezcla) {
    document.getElementById('formSolicutudes').addEventListener('submit', async () => {
      const idSolicitud = document.getElementById('idSolicitud').value
      const notaMezcla = document.getElementById('notaMezcla').value
      const data = {
        notaMezcla,
        status: 'Proceso'
      }
      try {
        const response = await fechSolicitudProceso({ data, id: idSolicitud })
        console.log(response)
        if (response.error) {
          return mostrarMensaje({
            msg: response.error,
            type: 'error'
          })
        }

        mostrarMensaje({
          msg: response.message,
          type: 'success',
          redirectUrl: '/protected/admin'
        })
      } catch (error) {
        console.log(error)
      }
    })
  } else {
    console.warn('Button with ID "btnGuardarMezcla" not found.')
  }

  if (nuevoProducto) {
    nuevoProducto.addEventListener('click', async () => {
      $('#exampleModal').modal('show')
      $('#staticBackdrop').modal('hide')
      inicializarFormulario()
    })
  } else {
    console.warn('Button with ID "nuevoProducto" not found.')
  }

  if (btnEnviarEstado) {
    btnEnviarEstado.addEventListener('click', enviarEstadoProductos)
  } else {
    console.warn('Button with ID "btnEnviarEstado" not found.')
  }
  if (btnDescargarExcel) {
    btnDescargarExcel.addEventListener('click', descargarExcel)
  } else {
    console.warn('Button with ID "btnEnviarEstado" not found.')
  }
  // metodo de eliminacion de productos de la tabla de producto

  iniciarSolicitudes()
  verSolicitud()
})
