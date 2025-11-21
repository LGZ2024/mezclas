/* eslint-disable no-undef */
// Funciones para manejar peticiones HTTP
export async function fetchApi (url, method, data) {
  try {
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    return response
  } catch (error) {
    console.error('Error:', error.message)
  }
}
export async function fetchApiDoc (url, method, data) {
  try {
    const response = await fetch(url, {
      method,
      body: data
    })
    return response
  } catch (error) {
    console.error('Error:', error.message)
  }
}

// Función para mostrar mensajes de éxito o error del fech
export async function showMessage (response) {
  const data = await response.json()
  if (response.ok) {
    Swal.fire({
      title: 'Existo',
      text: data.message,
      icon: 'success',
      showConfirmButton: false,
      timer: 3000
    })
    return true
  } else {
    Swal.fire({
      title: 'Error',
      text: data.message,
      icon: 'error',
      showConfirmButton: false,
      timer: 3000
    })
    return false
  }
}

export const swalWithBootstrapButtons = Swal.mixin({
  customClass: {
    confirmButton: 'btn btn-success',
    cancelButton: 'btn btn-danger'
  },
  buttonsStyling: false
})

// mensaje de sucess
export async function mostrarMensaje (msg, type, buton) {
  return Swal.fire({
    position: 'center',
    icon: type,
    title: msg,
    showConfirmButton: buton || false,
    timer: 1500
  })
}

export async function MensajeEliminacion (url, method, data) {
  try {
    // Mostrar diálogo de confirmación
    const result = await Swal.fire({
      title: 'Esta seguro de eliminar registro?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6'
    })

    // Si el usuario confirma
    if (result.isConfirmed) {
      // Realizar la petición de eliminación
      const res = await fetchApi(url, method, data)

      if (!res) {
        throw new Error('Error en la petición')
      }

      // Mostrar mensaje de respuesta
      await showMessage(res)
      return true
    } else {
      // Si el usuario cancela
      await mostrarMensaje('Operación cancelada', 'info')
      return false
    }
  } catch (error) {
    console.error('Error en eliminación:', error)
    await mostrarMensaje('Error al eliminar elemento', 'error')
    return false
  }
}
export async function MensajeCambiarEstado (url, method, data) {
  try {
    // Mostrar diálogo de confirmación
    const result = await Swal.fire({
      title: 'Esta seguro de cambiar el estado?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Cambiar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6'
    })

    // Si el usuario confirma
    if (result.isConfirmed) {
      // Realizar la petición de eliminación
      const res = await fetchApi(url, method, data)

      if (!res) {
        throw new Error('Error en la petición')
      }

      // Mostrar mensaje de respuesta
      await showMessage(res)
      return true
    } else {
      // Si el usuario cancela
      await mostrarMensaje('Operación cancelada', 'info')
      return false
    }
  } catch (error) {
    console.error('Error en cambio de estado:', error)
    await mostrarMensaje('Error al cambiar el estado', 'error')
    return false
  }
}
// Funciones para convertir fechas y horas
export async function convertHourTo24Format (hour) {
  const parts = hour.split(' ')
  const time = parts[0].split(':')
  let hours = parseInt(time[0])
  const minutes = time[1]

  if (parts[1] === 'PM' && hours < 12) {
    hours += 12
  }
  return `${hours.toString().padStart(2, '0')}:${minutes}`
}
export async function convertHourTo12Format (hour) {
  const parts = hour.split(':')
  let hours = parseInt(parts[0])
  const minutes = parts[1]

  let ampm = 'AM'
  if (hours >= 12) {
    ampm = 'PM'
  }
  if (hours > 12) {
    hours -= 12
  }
  return `${hours.toString().padStart(2, '0')}:${minutes} ${ampm}`
}
export async function convertFechFormat (fecha) {
  const partes = fecha.split('-')
  if (partes.length !== 3) {
    throw new Error('Fecha inválida')
  }
  const dia = partes[2]
  const mes = partes[1]
  const ano = partes[0]

  const fechaFormateada = `${dia}/${mes}/${ano}`
  return fechaFormateada
}
export async function convertFechFormatDate (fecha) {
  const partes = fecha.split('-')
  if (partes.length !== 3) {
    throw new Error('Fecha inválida')
  }
  const dia = partes[2]
  const mes = partes[1]
  const ano = partes[0]

  const fechaFormateada = `${ano}-${mes}-${dia}`
  return fechaFormateada
}

// funcion para obtener documento e imagenes
export async function obtenerDocumento (url) {
  fetch(url, { method: 'HEAD' })
    .then(response => {
      if (response.ok) {
        // Determinar el tipo de archivo por su extensión
        const extension = url.split('.').pop().toLowerCase()
        const isImage = ['jpg', 'jpeg', 'png', 'gif'].includes(extension)
        const container = document.getElementById('pdfEmbed')

        if (isImage) {
          // Para imágenes, reemplazar el contenido con una imagen
          container.innerHTML = `
            <div style="display: flex; justify-content: center; align-items: center; height: 500px; padding: 20px;">
              <img src="${url}" style="max-width: 100%; max-height: 100%; object-fit: contain; border-radius: 5px; box-shadow: 0 0 10px rgba(0,0,0,0.1);" alt="Imagen">
            </div>
          `
          $('#pdfModalLabel').text('Visualizar Imagen')
        } else {
          // Para PDFs, usar el embed
          container.innerHTML = `<embed src="${url}" type="application/pdf" width="100%" height="500px" />`
          $('#pdfModalLabel').text('Visualizar PDF')
        }

        $('#pdfModal').modal('show')
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'El archivo no existe.'
        })
      }
    })
    .catch(error => {
      console.error('Error:', error)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al cargar el archivo.'
      })
    })
}
