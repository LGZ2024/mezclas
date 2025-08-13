/* eslint-disable no-undef */
import { mostrarMensaje, MensajeEliminacion } from '../funciones.js'
// import FormularioUsuario from './funcionesFormulario.js'

async function fechTbSolicitadas () {
  try {
    const response = await fetch('/api/usuario/')
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching solicitudes:', error)
    throw error
  }
}
const iniciarUsuarios = async () => {
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
    return await fechTbSolicitadas()
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}
/* mostrar tabla */
const verUsuarios = async () => {
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
          { targets: 1, data: 'usuario' },
          {
            targets: 2,
            data: 'email',
            render: function (data, type, row) {
              if (!data) return 'No Aplica'
              return data
            }
          },
          { targets: 3, data: 'nombre' },
          { targets: 4, data: 'rol' },
          { targets: 5, data: 'empresa' },
          {
            targets: 6,
            data: 'ranchos',
            render: function (data, type, row) {
              if (!data) return 'General'
              return data.trim()
                .toLowerCase()
                .split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ')
            }
          },
          {
            targets: 7,
            data: 'variedad',
            render: function (data, type, row) {
              if (!data) return 'General'
              return data.trim()
                .toLowerCase()
                .split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ')
            }
          },
          {
            targets: 8,
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
    eliminarEquipo()
    actualizarPass()
  } catch (error) {
    console.error('Error al mostrar registros:', error)
  }
}

// Exportaciones
export { iniciarUsuarios, verUsuarios }

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

const eliminarEquipo = () => {
  $(document).on('click', '#btnDelete', async function (e) {
    e.preventDefault()
    const id = $(this).data('id')
    const url = `/api/usuario/${id}`
    const method = 'DELETE'
    const respuesta = await MensajeEliminacion(url, method)
    if (respuesta === true) {
      iniciarUsuarios()
      await verUsuarios()
    }
  })
}
// actulizar contraseña
const actualizarPass = async () => {
  $(document).on('click', '#restablecerPass', async function () {
    const id = $(this).data('id')

    const modal = $('#ModalResetPass')
    modal.modal('show')
    document.getElementById('idUsuario').value = id
  })
}
