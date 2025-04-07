/* eslint-disable no-undef */
// Versión con más opciones de configuración
export function mostrarMensaje (config) {
  const {
    msg,
    type,
    redirectUrl = null,
    onClose = null
  } = config

  Toastify({
    text: msg,
    newWindow: true,
    close: true,
    gravity: 'top',
    position: 'left',
    stopOnFocus: true,
    style: {
      background: type === 'success'
        ? 'linear-gradient(to right, #00b09b, #96c93d)'
        : 'red'
    },
    callback: function () {
      // Callback personalizado opcional
      if (onClose && typeof onClose === 'function') {
        onClose()
      }

      // Redirección
      if (redirectUrl) {
        try {
          window.location.href = redirectUrl
        } catch (error) {
          console.error('Error de redirección:', error)
        }
      }
    }
  }).showToast()
}
export async function fetchApi (url, method, data) {
  console.log('fetchApi', url, method, data)
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
// Ejemplos de uso
// mostrarMensaje({
//   msg: 'Operación exitosa',
//   type: 'success',
//   redirectUrl: '/protected/admin'
// })

// mostrarMensaje({
//   msg: 'Registro completado',
//   redirectUrl: '/perfil',
//   redirectDelay: 3000,
//   onClose: () => {
//     console.log('Toast cerrado')
//     // Realizar acciones adicionales si es necesario
//   }
// })
// export function mostrarMensaje (config) {
//   const {
//     msg,
//     type,
//     redirectUrl = null,
//     redirectDelay = 0,
//     onClose = null
//   } = config

//   Toastify({
//     text: msg,
//     newWindow: true,
//     close: true,
//     gravity: 'top',
//     position: 'left',
//     stopOnFocus: true,
//     style: {
//       background: type === 'success'
//         ? 'linear-gradient(to right, #00b09b, #96c93d)'
//         : 'red'
//     },
//     callback: function () {
//       // Callback personalizado opcional
//       if (onClose && typeof onClose === 'function') {
//         onClose()
//       }

//       // Redirección
//       if (redirectUrl) {
//         setTimeout(() => {
//           try {
//             window.location.href = redirectUrl
//           } catch (error) {
//             console.error('Error de redirección:', error)
//           }
//         }, redirectDelay)
//       }
//     }
//   }).showToast()
// }
