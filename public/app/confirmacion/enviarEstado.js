/* eslint-disable no-undef */
import { mostrarMensaje } from '../mensajes.js'
import { iniciarSolicitudes } from './tablaConfirmacion.js'
import { showSpinner, hideSpinner } from '../spinner.js'
// Función para enviar el estado de los productos
export const enviarEstados = async () => {
  const estados = []

  // Obtener todos los checkboxes marcados
  $('#tbSolicitadas input[type="checkbox"]:checked').each(function () {
    const id = $(this).attr('name').split('_')[1] // Obtiene el ID de "producto_X"

    estados.push({
      id_solicitud: parseInt(id), // Convertir a número
      validacion: true // Si está checked, significa que está validado
    })
  })

  // Validación de selección
  if (estados.length === 0) {
    mostrarMensaje({
      msg: 'Por favor, selecciona al menos una solicitud para confirmar.',
      type: 'warning'
    })
    return
  }

  // Mostrar spinner mientras se procesa la solicitud
  showSpinner()
  try {
    const response = await fetch('/api/validacion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(estados)
    })

    if (response.ok) {
      const result = await response.json()

      // Verificar si la tabla existe y destruirla correctamente
      let table
      try {
        table = $('#tbSolicitadas').DataTable()
        if ($.fn.DataTable.isDataTable('#tbSolicitadas')) {
          table.clear().destroy()
          $('#tbSolicitadas tbody').empty()
        }
      } catch (error) {
        console.log('La tabla no existe aún:', error)
      }

      // Esperar a que se complete la inicialización
      await new Promise(resolve => setTimeout(resolve, 100))

      // Reinicializar la tabla
      try {
        await iniciarSolicitudes()
      } catch (error) {
        console.error('Error al reinicializar tabla:', error)
      }

      mostrarMensaje({
        msg: result.message || 'Solicitudes confirmadas exitosamente',
        type: 'success'
      })
      hideSpinner()
    }
  } catch (error) {
    hideSpinner()
    console.error('Error al procesar solicitudes:', error)
    mostrarMensaje({
      msg: 'Error al procesar las solicitudes',
      type: 'error'
    })
  } finally {
    hideSpinner()
  }
}
