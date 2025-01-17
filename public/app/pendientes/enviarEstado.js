/* eslint-disable no-undef */
import { mostrarMensaje } from '../mensajes.js'

// Función para enviar el estado de los productos
export const enviarEstadoProductos = async () => {
  const idSolicitud = document.getElementById('idSolicitud').value
  const estados = {
    id_solicitud: idSolicitud,
    estados: [] // Inicializa el array de estados
  }
  let todosSeleccionados = true // Variable para verificar si todos los radios están seleccionados

  // Recorre todos los grupos de radio buttons en la tabla
  $('#tbReceta input[type="radio"]:checked').each(function () {
    const name = $(this).attr('name') // Obtener el atributo name
    if (name) {
      const id = name.split('_')[1] // Obtener el id del producto
      const valorSeleccionado = $(this).val() // Obtener el valor del radio button seleccionado

      // Solo agregar el producto si el estado es "existe" o "no_existe"
      if (valorSeleccionado === '1' || valorSeleccionado === '0') {
        // aqui agregamos al objeto estados los valores de la receta
        estados.estados.push({
          id_receta: id,
          existe: valorSeleccionado === '1' // true si "existe", false si "no existe"
        })
        if (valorSeleccionado === '0') {
          document.getElementById('notaMezcla').setAttribute('required', 'required')
        }
      } else {
        console.warn(`El estado para el producto con ID ${id} no es válido: ${valorSeleccionado}`)
      }
    } else {
      console.error('El atributo name no está definido para el radio button')
    }
  })

  // Validar que todos los grupos de radio buttons tengan una opción seleccionada
  $('#tbReceta input[type="radio"]').each(function () {
    const name = $(this).attr('name')
    if (name && !$(`input[name="${name}"]:checked`).length) {
      todosSeleccionados = false // Si hay un grupo sin selección, cambiar a false
    }
  })

  // Si no todos los radios están seleccionados, mostrar un mensaje y salir
  if (!todosSeleccionados) {
    mostrarMensaje({
      msg: 'Por favor, selecciona una opción para cada producto.',
      type: 'error'
    })
    return // Salir de la función
  }

  // Validar que hay estados para enviar
  if (estados.length === 0) {
    mostrarMensaje({
      msg: 'No hay estados para enviar.',
      type: 'error'
    })
    return // Salir de la función
  }

  // Continuar con la lógica de envío...
  try {
    const response = await fetch('/api/actualizarEstadoProductos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json' // Asegúrate de que el servidor sepa que esperas JSON
      },
      body: JSON.stringify(estados) // Enviar el objeto como JSON
    })

    if (response.ok) {
      const result = await response.json()
      mostrarMensaje({
        msg: result.message,
        type: 'success'
      })

      $('#exampleModal').modal('hide')
      $('#staticBackdrop').modal('hide')
      const opciones = estados.estados
      const todosExisten = opciones.every(estado => estado.existe === true)

      if (todosExisten === true) {
        document.getElementById('btnGuardarMescla').style.display = 'block'
      }
    } else {
      const result = await response.json() // Asegúrate de obtener el resultado en caso de error
      mostrarMensaje({
        msg: result.error,
        type: 'error'
      })
      console.error('Error al actualizar el estado de los productos')
    }
  } catch (error) {
    console.error('Error en la conexión:', error)
    mostrarMensaje({
      msg: error.message || 'Error desconocido',
      type: 'error'
    })
  }
}
