/* eslint-disable no-undef */
import { fetchApi, showMessage, mostrarMensaje, swalWithBootstrapButtons } from '../funciones.js'
import { validarContraseña } from './funcionesFormulario.js'

// Funciones para eliminar, editar y agregar registros
const eliminarRegistro = async (id) => {
  try {
    const response = await fetchApi(`/api/usuario/${id}`, 'DELETE')
    await showMessage(response)
    if (response.status === 200) {
      // Destruir tabla y recargar registros
      $('#tbUsuarios').DataTable().destroy()
      setTimeout(async () => {
        iniciarRegistros()
        verRegistro()
      }, 1000)
    }
  } catch (error) {
    console.error('Error al eliminar registro:', error)
  }
}
const editarRegistro = async (id, data) => {
  try {
    const response = await fetchApi(`/api/usuario/${id}`, 'PATCH', data)
    await showMessage(response)
    if (response.status === 200) {
      // Destruir tabla y recargar registros
      $('#tbUsuarios').DataTable().destroy()
      setTimeout(async () => {
        iniciarRegistros()
        verRegistro()
      }, 1000)
      return true
    }
  } catch (error) {
    console.error('Error al editar registro:', error)
  }
}
const cambiarContrasena = async (id, data) => {
  try {
    const response = await fetchApi(`/api/usuario/${id}`, 'PUT', data)
    await showMessage(response)
    const modal = $('#exampleModal')
    modal.modal('hide')
  } catch (error) {
    console.error('Error al editar registro:', error)
  }
}
// const agregarRegistro = async (data) => {
//   try {
//     const response = await fetchApi('/api/usuario/', 'POST', data)
//     await showMessage(response)
//     if (response.status === 200) {
//       // Destruir tabla y recargar registros
//       $('#tbUsuarios').DataTable().destroy()
//       setTimeout(async () => {
//         iniciarRegistros()
//         verRegistro()
//       }, 1000)
//       return true
//     }
//   } catch (error) {
//     console.error('Error al agregar registro:', error)
//   }
// }

// Funciones para inicializar tabla
const iniciarRegistros = async () => {
  try {
    const data = await obtenerRegistro()
    const table = $('#tbUsuarios').DataTable()
    table.clear().rows.add(data)
    table.columns.adjust().draw()
  } catch (error) {
    console.error('Error al inicializar registros:', error)
  }
}
/* obtener datos para la tabla */
const obtenerRegistro = async () => {
  try {
    const response = await fetchApi('/api/usuario/', 'GET') // cambiar a GET
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}
/* mostrar tabla */
const verRegistro = async () => {
  try {
    if (!$.fn.dataTable.isDataTable('#tbUsuarios')) {
      $('#tbUsuarios').DataTable({
        order: [[0, 'desc']],
        dom: '<"d-flex justify-content-between"fl>t<"d-xl-flex justify-content-between align-items-center"ip><"clear">',
        pageLength: 5,
        lengthMenu: [[5, 10, 20, -1], [5, 10, 20, 'Todos']],
        language: {
          lengthMenu: 'Mostrar _MENU_ registros',
          zeroRecords: 'No se encontraron resultados',
          info: 'Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros',
          infoEmpty: 'Mostrando registros del 0 al 0 de un total de 0 registros',
          infoFiltered: '(filtrado de un total de _MAX_ registros)',
          sSearch: 'Buscar:',
          oPaginate: {
            sFirst: 'Primero',
            sLast: 'Último',
            sNext: 'Siguiente',
            sPrevious: 'Anterior'
          },
          sProcessing: 'Procesando...'
        },
        columnDefs: [
          // Define el orden de las columnas
          { targets: 0, data: 'id' },
          { targets: 1, data: 'email' },
          { targets: 2, data: 'nombre' },
          { targets: 3, data: 'rol' },
          { targets: 4, data: 'empresa' },
          { targets: 5, data: 'ranchos' },
          {
            targets: 6,
            data: 'id',
            render: function (data, type, row) {
              // al boton le pasaremos data para obtenerlo con el evento del botton
              return `
                    <button type="button" data-id="${data}" id="btnEdit" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#staticBackdrop")"><i class="mdi mdi-border-color"></i></button>
                    <button type="button" data-id="${data}" id="btnDelete" class="btn btn-danger")"><i class="mdi mdi-delete"></i></button>
                    <button type="button" data-id="${data}" id="restablecerPass" class="btn btn-outline-warning btn-icon-text"><i class="mdi mdi-reload btn-icon-prepend"></i>Restabl. Contraseña</button>
                  `
            }
          }
        ]
      })
    }

    agregar()
    editar()
    eliminar()
    actualizarPass()
  } catch (error) {
    console.error('Error al mostrar registros:', error)
  }
}

// Exportaciones
export { iniciarRegistros, verRegistro }
// Abrir modal para agregar usuario
const agregar = async () => {
  $(document).on('click', '#btnCrear', async function () {
    const modal = $('#exampleModal')
    document.getElementById('exampleModalLabel').textContent = 'Agregar Usuario'
    modal.modal('show')
    // Limpiamos campos
    document.getElementById('nombre').value = ''
    document.getElementById('correo').value = ''
    document.getElementById('contrasena').value = ''
    document.getElementById('contrasenaRep').value = ''
    document.getElementById('rol').value = ''
  })
}

// Abrir modal para editar asistencia
const editar = async () => {
  $(document).on('click', '#btnEdit', async function () {
    const modal = $('#exampleModal')
    document.getElementById('exampleModalLabel').textContent = 'Editar Usuario'
    modal.modal('show')

    const id = $(this).data('id') // id del elemento a editar
    const rol = $(this).parents('tr').find('td:nth-child(4)').text() // obtenemos el rol

    // Pasamos datos a los campos del formulario
    document.getElementById('nombre').value = $(this).parents('tr').find('td:nth-child(2)').text()
    document.getElementById('correo').value = $(this).parents('tr').find('td:nth-child(3)').text()
    document.getElementById('rol').value = rol
    // funcion del boton
    $(document).on('click', '#editar', async function () {
      const nombre = document.getElementById('nombre').value
      const email = document.getElementById('correo').value
      const rol = document.getElementById('rol').value
      const asignacion = document.getElementById('vivienda').value
      // validamos campos vacios
      if (nombre === '' || email === '' || rol === '' || asignacion === '') {
        mostrarMensaje('Favor de completar todos los campos', 'info')
      }
      const data = {
        nombre,
        email,
        rol,
        empresa: asignacion
      }
      const res = await editarRegistro(id, data)
      if (res === true) {
        modal.modal('hide')
      }
    })
  })
}

// Eliminar Asistencia
const eliminar = async () => {
  $(document).on('click', '#btnDelete', async function () {
    const id = $(this).data('id')
    swalWithBootstrapButtons.fire({
      title: 'Esta seguro de eliminar registro?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, elimínar!',
      cancelButtonText: 'No, cancelar!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        eliminarRegistro(id)
      } else if (
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire({
          title: 'Cancelado',
          text: 'Tu archivo está seguro:)',
          icon: 'error'
        })
      }
    })
  })
}

// actulizar contraseña
const actualizarPass = async () => {
  $(document).on('click', '#restablecerPass', async function () {
    const id = $(this).data('id')

    const modal = $('#ModalResetPass')
    modal.modal('show')
    // obtenemos datos del formulario
    $(document).on('submit', '#formResetPass', async function (a) {
      a.preventDefault()
      const contrasena = document.getElementById('contrasenaRes').value
      const contrasenaRep = document.getElementById('contrasenaRepRes').value
      // valiodamos campos vacios
      if (contrasena === '' || contrasenaRep === '') {
        mostrarMensaje('Favor de completar todos los campos', 'info')
      }
      const res = await validarContraseña(contrasena, contrasenaRep)
      if (res === true) {
        const data = {
          newPassword: contrasena
        }
        cambiarContrasena(id, data)
        modal.modal('hide')
      }
    })
  })
}
