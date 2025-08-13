/* eslint-disable no-undef */
import { obtenerDocumento } from '../funciones.js'
// Funciones de fetch con mejor manejo de errores
async function fechTbSolicitadas () {
  try {
    const response = await fetch('/api/activos_baja')
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

// Iniciar solicitudes con mejor manejo de errores
const iniciarActivosBaja = async () => {
  try {
    const data = await obtenerTickets()
    const table = $('#tbActivosBaja').DataTable()
    console.log(data)
    table.clear().rows.add(data[0]).draw()
  } catch (error) {
    console.error('Error al iniciar solicitudes:', error)
    // Opcional: Mostrar mensaje de error al usuario
    // mostrarMensajeError('No se pudieron cargar las solicitudes')
  }
}

// Obtener solicitudes
const obtenerTickets = async () => {
  try {
    return await fechTbSolicitadas()
  } catch (error) {
    console.error('Error al obtener solicitudes:', error)
    throw error
  }
}

// Configuración de tabla de solicitudes
const verActivosBaja = async () => {
  if ($.fn.DataTable.isDataTable('#tbActivosBaja')) {
    $('#tbActivosBaja').DataTable().destroy()
  }
  $('#tbActivosBaja').DataTable({
    paging: true,
    order: [[0, 'desc']],
    responsive: true,
    dom: '<"d-flex justify-content-between m-4"fl>t<"d-xl-flex justify-content-between align-items-center"ip><"clear">',
    pageLength: 10,
    lengthMenu: [10, 25, 50, 100],
    searching: true,
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
      { targets: 0, data: 'no_economico' },
      {
        targets: 1,
        data: 'equipo',
        render: function (data, type, row) {
          return data.charAt(0).toUpperCase() + data.slice(1).toUpperCase()
        }
      },
      {
        targets: 2,
        data: 'empresa_pertenece',
        render: function (data, type, row) {
          // Verifica si la empresa pertenece a un grupo y muestra el nombre del grupo
          return data || 'No especificado'
        }
      },
      {
        targets: 3,
        data: 'centro_coste',
        render: function (data, type, row) {
          // Verifica si el centro de coste es un objeto y muestra su nombre
          return data || 'No especificado'
        }
      },
      { targets: 4, data: 'marca' },
      { targets: 5, data: 'modelo' },
      { targets: 6, data: 'ns' },
      { targets: 7, data: 'tag' },
      {
        targets: 8,
        data: 'status',
        render: function (data, type, row) {
          return data.charAt(0).toUpperCase() + data.slice(1).toUpperCase()
        },
        createdCell: function (cell, cellData, rowData, rowIndex, colIndex) {
          // Asigna el color dependiendo del valor de la celda
          if (cellData === 'baja') {
            $(cell).css('color', 'red')
          } else if (cellData === 'Reparacion') {
            $(cell).css('color', 'orange')
          } else if (cellData === 'Cambio') {
            $(cell).css('color', 'blue')
          } else if (cellData === 'Activo') {
            $(cell).css('color', 'green')
          }
        }
      },
      { targets: 9, data: 'fecha_baja' },
      {
        targets: 10,
        data: '', // <button class="btn btn-primary mdi mdi-eye" type="button"  onclick="abrirEnlace(${row.urlFactura})"></button>
        render: function (data, type, row) {
          if (row.url_factura != null && row.foto != null && row.documento_baja != null) {
            return `
                        <button class="btn btn-inverse-primary mdi mdi-file-document abrirEnlace" data-url="${row.url_factura}"></button>
                        <button class="btn btn-inverse-success mdi mdi-file-image abrirEnlace" data-url="${row.foto}"></button>
                        <button class="btn btn-inverse-danger mdi mdi-file-word abrirEnlace" data-url="${row.documento_baja}"></button>
                    `
          } else if (row.url_factura != null && row.foto === null) {
            return `
                        <button class="btn btn-inverse-primary mdi mdi-file-document abrirEnlace" data-url="${row.url_factura}"></button>
                    `
          } else if (row.url_factura === null && row.foto != null) {
            return `
                        <button class="btn btn-inverse-warning mdi mdi-file-image abrirEnlace" data-url="${row.foto}"></button>
                    `
          } else if (row.url_factura != null && row.foto != null) {
            return `
                        <button class="btn btn-inverse-primary mdi mdi-file-document abrirEnlace" data-url="${row.urlFactura}"></button>
                        <button class="btn btn-inverse-success mdi mdi-file-image abrirEnlace" data-url="${row.foto}"></button>
                    `
          } else if (row.documento_baja != null) {
            return `
                        <button class="btn btn-inverse-danger mdi mdi-file-word abrirEnlace" data-url="${row.documento_baja}"></button>
                    `
          } else {
            return 'Faltan'
          }
        }
      },
      {
        targets: -1,
        data: 'id',
        render: function (data, type, row) {
          if (row.documento_baja === null) {
            return `
                        <button class="btn btn-inverse-info mdi mdi-file-document Modalbaja" data-id="${data}">Cargar baja</button>
                    `
          } else {
            return 'Cargado exitosamente'
          }
        }
      }
    ]
  })
  abrirModalBaja()
  abrirEnlace()
}

const abrirModalBaja = () => {
  $(document).on('click', '.Modalbaja', function () {
    const id = $(this).data('id')
    document.getElementById('id').value = id
    const modal = $('#miModalEquipo')
    modal.modal('show')
  })
}

const abrirEnlace = async () => {
  $(document).on('click', '.abrirEnlace', async function (e) {
    e.preventDefault()
    const url = $(this).attr('data-url')
    const docUrl = `/api/${url.replace(/^\//, '')}`
    await obtenerDocumento(docUrl)
  })
}
// Exportar funciones
export { iniciarActivosBaja, verActivosBaja }
