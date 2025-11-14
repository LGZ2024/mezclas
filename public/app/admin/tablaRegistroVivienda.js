/* eslint-disable no-undef */
import { fetchApi, showMessage, convertFechFormat, convertHourTo24Format, convertHourTo12Format, swalWithBootstrapButtons, mostrarMensaje } from '../funciones.js'
// Funciones para eliminar, editar y agregar registros
async function eliminarRegistro (id) {
  const response = await fetchApi(`/api/asistencia/${id}`, 'DELETE')
  await showMessage(response)
  if (response.status === 200) {
    // Destruir tabla y recargar registros
    $('#RegistroVivienda').DataTable().destroy()
    setTimeout(async () => {
      iniciarRegistros()
      verRegistro()
    }, 1000)
  }
}
async function editarRegistro (id, data) {
  const response = await fetchApi(`/api/asistencia/${id}`, 'PATCH', data)
  await showMessage(response)
  if (response.status === 200) {
    // Destruir tabla y recargar registros
    $('#RegistroVivienda').DataTable().destroy()
    setTimeout(async () => {
      iniciarRegistros()
      verRegistro()
    }, 1000)
    return true
  }
}
async function agregarRegistro (data) {
  const response = await fetchApi('/api/asistencia/', 'POST', data)
  await showMessage(response)
  if (response.status === 200) {
    // Destruir tabla y recargar registros
    $('#RegistroVivienda').DataTable().destroy()
    setTimeout(async () => {
      iniciarRegistros()
      verRegistro()
    }, 1000)
    return true
  }
}

/* inicializar tabla de asistencia en viviendas */
const iniciarRegistros = async () => {
  try {
    const data = await obtenerRegistro()
    // eslint-disable-next-line no-undef
    const table = $('#RegistroVivienda').DataTable()
    table.clear().rows.add(data)
    table.columns.adjust().draw()
    // Aquí puedes realizar acciones adicionales con los datos obtenidos
  } catch (error) {
    // Aquí puedes manejar el error
  }
}

/* obtener registro */
const obtenerRegistro = async () => {
  try {
    const response = await fetchApi('/api/asistencia', 'GET') // cambiar a GET
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}
/* mostrar tala de registro casas */
const verRegistro = async () => {
  let minDate, maxDate
  try {
    // Creacion de imput para el rango de fechas
    minDate = new DateTime('#min', {
      format: 'DD/MM/YYYY',
      locale: 'es-MX', // Set locale to Spanish (Mexico)
      i18n: {
        previous: 'Anterior',
        next: 'Siguiente',
        months: [
          'Enero',
          'Febrero',
          'Marzo',
          'Abril',
          'Mayo',
          'Junio',
          'Julio',
          'Agosto',
          'Septiembre',
          'Octubre',
          'Noviembre',
          'Diciembre'
        ],
        weekdays: ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab']
      }
    })
    maxDate = new DateTime('#max', {
      format: 'DD/MM/YYYY',
      locale: 'es-MX', // Set locale to Spanish (Mexico)
      i18n: {
        previous: 'Anterior',
        next: 'Siguiente',
        months: [
          'Enero',
          'Febrero',
          'Marzo',
          'Abril',
          'Mayo',
          'Junio',
          'Julio',
          'Agosto',
          'Septiembre',
          'Octubre',
          'Noviembre',
          'Diciembre'
        ],
        weekdays: ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab']
      }
    })
    if (!$.fn.dataTable.isDataTable('#RegistroVivienda')) {
      // Custom filtering function which will search data in column four between two values
      DataTable.ext.search.push(function (settings, data, dataIndex) {
        const min = minDate.val() ? moment(minDate.val(), 'DD/MM/YYYY').toDate() : null
        const max = maxDate.val() ? moment(maxDate.val(), 'DD/MM/YYYY').toDate() : null
        const date = moment(data[2], 'DD/MM/YYYY').toDate()
        if (
          (min === null && max === null) ||
          (min === null && date <= max) ||
          (min <= date && max === null) ||
          (min <= date && date <= max)
        ) {
          return true
        }
        return false
      })

      const tabla = $('#RegistroVivienda').DataTable({
        paging: true,
        order: [[0, 'desc']],
        dom: '<"d-flex justify-content-between"fBl>t<"d-xl-flex justify-content-between align-items-center"ip><"clear">',
        buttons: [
          {
            extend: 'excelHtml5',
            text: '<i class="mdi mdi-file-excel"></i>',
            titleAttr: 'Exportar a Excel',
            className: 'btn btn-primary'
          },
          {
            extend: 'csvHtml5',
            text: '<i class="mdi mdi-file-excel-box"></i>',
            titleAttr: 'Exportar archivo CSV',
            className: 'btn btn-info'
          },
          {
            extend: 'pdfHtml5',
            text: '<i class="mdi mdi-file-pdf"></i>',
            titleAttr: 'Exportar a PDF',
            className: 'btn btn-primary'
          }
        ],
        responsive: true,
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
          { targets: 1, data: 'idUsuario' },
          { targets: 2, data: 'fecha' },
          { targets: 3, data: 'horaEntrada' },
          { targets: 4, data: 'vivienda' },
          {
            targets: 5,
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
      // selecciona inputs para el filtrado de fechas
      document.querySelectorAll('#min, #max').forEach((el) => {
        el.addEventListener('change', () => tabla.draw())
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
    document.getElementById('exampleModalLabel').textContent = 'Agregar Entrada'
    modal.modal('show')
    document.getElementById('noEmpleado').disabled = false // abilitamos campo de noEmpleado
    document.getElementById('editar').style.display = 'none' // ocultamos boton editar
    document.getElementById('guardar').style.display = 'block' // ocultamos boton editar
    document.getElementById('noEmpleado').value = ''
    document.getElementById('fecha').value = ''
    document.getElementById('hora').value = ''
    document.getElementById('vivienda').value = ''
  })
}
// Agregar evento para guardar cambios
$(document).on('click', '#guardar', async function (event) {
  event.preventDefault()
  const noEmpleado = document.getElementById('noEmpleado').value
  const fecha = document.getElementById('fecha').value
  const hora = document.getElementById('hora').value
  const vivienda = document.getElementById('vivienda').value
  // validar datos vacios
  if (noEmpleado === '' || fecha === '' || hora === '' || vivienda === '') {
    mostrarMensaje('Favor de completar todos los campos', 'info')
  }
  // convertimos la hora y la fecha en los formatos requeridos
  const fechaFormat = await convertFechFormat(fecha)
  const hora12 = await convertHourTo12Format(hora)
  // creamos data
  const data = {
    idUsuario: noEmpleado,
    fecha: fechaFormat,
    horaEntrada: hora12,
    vivienda
  }
  const res = await agregarRegistro(data)
  if (res === true) {
    const modal = $('#exampleModal')
    modal.modal('hide')
  }
})
// Abrir modal para editar asistencia
const editar = async () => {
  $(document).on('click', '#btnEdit', async function () {
    const modal = $('#exampleModal')
    document.getElementById('exampleModalLabel').textContent = 'Editar Entrada'
    modal.modal('show')
    const id = $(this).data('id') // este es el id que corresponde a dato a editar
    document.getElementById('noEmpleado').disabled = true // desabilitamos el campo de numero de empleado
    document.getElementById('editar').style.display = 'block' // ocultamos boton editar
    document.getElementById('guardar').style.display = 'none' // ocultamos boton editar

    const noEmpleado = $(this).parents('tr').find('td:nth-child(2)').text()
    const fecha = $(this).parents('tr').find('td:nth-child(3)').text()
    const horaEntrada = $(this).parents('tr').find('td:nth-child(4)').text()
    const horaEntrada24 = await convertHourTo24Format(horaEntrada)
    const vivienda = $(this).parents('tr').find('td:nth-child(5)').text()

    document.getElementById('noEmpleado').value = noEmpleado
    document.getElementById('fecha').value = fecha
    document.getElementById('hora').value = horaEntrada24
    document.getElementById('vivienda').value = vivienda

    // Agregar evento para guardar cambios
    $(document).on('click', '#editar', async function () {
      const fecha = document.getElementById('fecha').value
      const hora = document.getElementById('hora').value
      const vivienda = document.getElementById('vivienda').value
      // validar datos vacios
      if (noEmpleado === '' || fecha === '' || hora === '' || vivienda === '') {
        mostrarMensaje('Favor de completar todos los campos', 'info')
      }
      // convertimos la hora y la fecha en los formatos requeridos
      const fechaFormat = await convertFechFormat(fecha)
      const hora12 = await convertHourTo12Format(hora)
      const data = {
        fecha: fechaFormat,
        hora: hora12,
        vivienda
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
