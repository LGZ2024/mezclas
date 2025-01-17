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

// Función para mostrar mensajes de éxito o error del fech
export async function showMessage (response) {
  const data = await response.json()
  if (data.message) {
    Swal.fire({
      title: 'Existo',
      text: data.message,
      icon: 'success',
      showConfirmButton: false,
      timer: 3000
    })
  } else {
    return Swal.fire({
      title: 'Error',
      text: data.error,
      icon: 'error',
      showConfirmButton: false,
      timer: 3000
    })
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
export function mostrarMensaje (msg, type, buton) {
  return Swal.fire({
    position: 'center',
    icon: type,
    title: msg,
    showConfirmButton: buton || false,
    timer: 1500
  })
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
