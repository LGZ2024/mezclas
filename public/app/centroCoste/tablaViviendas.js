/* eslint-disable no-new */
/* eslint-disable no-undef */
import { fetchApi, showMessage, mostrarMensaje, swalWithBootstrapButtons } from '../funciones.js'
import { SolicitudFormulario } from './solicitarMezcla.js'

// Funciones para eliminar, editar y agregar registros
async function eliminarRegistro (id) {
  try {
    const response = await fetchApi(`/api/vivienda/${id}`, 'DELETE')
    await showMessage(response)
    // Destruir tabla y recargar registros
    $('#tbProductos').DataTable().destroy()
    setTimeout(async () => {
      iniciarRegistros()
      verRegistro()
    }, 1000)
  } catch (error) {
    console.error('Error al eliminar registro:', error)
  }
}

async function editarRegistro (id, data) {
  try {
    const response = await fetchApi(`/api/vivienda/${id}`, 'PATCH', data)
    await showMessage(response)
    if (response.status === 200) {
      // Destruir tabla y recargar registros
      $('#tbProductos').DataTable().destroy()
      setTimeout(async () => {
        iniciarRegistros()
        verRegistro()
      }, 1000)
    }
  } catch (error) {
    console.error('Error al editar registro:', error)
  }
}
async function agregarRegistro (data) {
  try {
    const response = await fetchApi('/api/vivienda/', 'POST', data)
    await showMessage(response)
    if (response.status === 200) {
      // Destruir tabla y recargar registros
      $('#tbProductos').DataTable().destroy()
      setTimeout(async () => {
        iniciarRegistros()
        verRegistro()
      }, 1000)
      return true
    }
  } catch (error) {
    console.error('Error al agregar registro:', error)
  }
}

/* funciones para inicializar tabla  de mezclas solicitadas */
/* inicializar tabla solicitada */
const iniciarRegistros = async () => {
  try {
    const data = await obtenerRegistro()
    const table = $('#tbProductos').DataTable()
    table.clear().rows.add(data)
    table.columns.adjust().draw()
  } catch (error) {
    console.error('Error al inicializar registros:', error)
  }
}
/* obtener mezclas */
const obtenerRegistro = async () => {
  try {
    const response = await fetchApi('/api/centroCoste', 'GET') // cambiar a GET
    const data = await response.json()
    console.log(data)
    return data
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}
/* mostrar tala de mezclas Solicitada */
const verRegistro = async () => {
  try {
    if (!$.fn.dataTable.isDataTable('#tbProductos')) {
      $('#tbProductos').DataTable({
        paging: true,
        order: [[0, 'desc']],
        dom: '<"d-flex justify-content-between"fl>t<"d-xl-flex justify-content-between align-items-center"ip><"clear">',
        responsive: false,
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
          { targets: 1, data: 'centroCoste' },
          { targets: 2, data: 'rancho' },
          { targets: 3, data: 'cultivo' },
          { targets: 4, data: 'variedad' },
          { targets: 5, data: 'empresa' },
          {
            targets: 6,
            data: 'id',
            render: function (data, type, row) {
              // al boton le pasaremos data para obtenerlo con el evento del botton
              return `
                    <button type="button" data-id="${data}" id="btnEdit" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#staticBackdrop")"><i class="mdi mdi-border-color"></i></button>
                    <button type="button" data-id="${data}" id="btnDelete" class="btn btn-danger")"><i class="mdi mdi-delete"></i></button>
                  `
            }
          }
        ]
      })
    }
    agregar()
    editar()
    eliminar()
    cerrarModal()
  } catch (error) {
    console.error('Error al mostrar registros:', error)
  }
}

export { iniciarRegistros, verRegistro }

// Abrir modal para agregar asistencia
const agregar = async () => {
  $(document).on('click', '#btnCrear', async function () {
    const modal = $('#exampleModal')
    document.getElementById('exampleModalLabel').textContent = 'Agregar Centro de Coste'
    modal.modal('show')
  })
  new SolicitudFormulario()
}
// Agregar evento para guardar cambios
$(document).on('click', '#guardar', async function () {
  const nombre = document.getElementById('nombre').value
  const descripcion = document.getElementById('descripcion').value
  const ubicacion = document.getElementById('ubicacion').value
  // validamos campos vacios
  if (nombre === '' || descripcion === '' || ubicacion === '') {
    return mostrarMensaje('Favor de completar todos los campos', 'info')
  }
  const data = {
    nombre,
    descripcion,
    ubicacion
  }
  try {
    const res = await agregarRegistro(data)
    if (res === true) {
      const modal = $('#exampleModal')
      modal.modal('hide')
    }
  } catch (error) {
    console.log('error  al agregar registro:', error)
  }
})

// Abrir modal para editar asistencia
const editar = async () => {
  $(document).on('click', '#btnEdit', async function () {
    const modal = $('#exampleModal')
    document.getElementById('exampleModalLabel').textContent = 'Editar vivienda'
    modal.modal('show')
    const id = $(this).data('id')
    let nombre = $(this).parents('tr').find('td:nth-child(2)').text()
    let descripcion = $(this).parents('tr').find('td:nth-child(3)').text()
    let ubicacion = $(this).parents('tr').find('td:nth-child(4)').text()

    document.getElementById('nombre').value = nombre
    document.getElementById('descripcion').value = descripcion
    document.getElementById('ubicacion').value = ubicacion
    // Agregar evento para guardar cambios
    $(document).on('click', '#editar', async function () {
      nombre = document.getElementById('nombre').value
      descripcion = document.getElementById('descripcion').value
      ubicacion = document.getElementById('ubicacion').value
      // validamos campos vacios
      if (nombre === '' || descripcion === '' || ubicacion === '') {
        mostrarMensaje('Por favor complete todos los campos', 'info')
      }

      const data = {
        nombre,
        descripcion,
        ubicacion
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

// cerrar modal
const cerrarModal = async () => {
  $(document).on('click', '#cerrarModal', function () {
    const modal = $('#exampleModal')
    modal.modal('hide')
  })
}
