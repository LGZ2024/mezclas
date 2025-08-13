/* eslint-disable no-undef */
import { obtenerDocumento } from '../funciones.js'
// Funciones de fetch con mejor manejo de errores
async function fechTbSolicitadas () {
  try {
    const response = await fetch('/api/asignacion_historial')
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
const iniciarHistorialAsignacion = async () => {
  try {
    const data = await obtenerTickets()
    const table = $('#tbHistorialAsignacion').DataTable()
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
const verHistorialAsignacion = async () => {
  if ($.fn.DataTable.isDataTable('#tbHistorialAsignacion')) {
    $('#tbHistorialAsignacion').DataTable().destroy()
  }
  $('#tbHistorialAsignacion').DataTable({
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
        data: 'marca',
        render: function (data, type, row) {
          // Validar si data es null o undefined
          if (!data) return 'No especificado'

          // Si el dato existe, aplicar la transformación
          return data.trim().toUpperCase()
        }
      },
      {
        targets: 2,
        data: 'modelo',
        render: function (data, type, row) {
          // Validar si data es null o undefined
          if (!data) return 'No especificado'

          // Si el dato existe, aplicar la transformación
          return data.trim().toUpperCase()
        }
      },
      { targets: 3, data: 'ns' },
      { targets: 4, data: 'tag' },
      {
        targets: 5,
        data: 'equipo',
        render: function (data, type, row) {
          // Validar si data es null o undefined
          if (!data) return 'No especificado'

          // Si el dato existe, aplicar la transformación
          return data.trim().toUpperCase()
        }
      },
      {
        targets: 6,
        data: 'estado',
        render: function (data, type, row) {
          return data.trim().toUpperCase()
        },
        createdCell: function (cell, cellData, rowData, rowIndex, colIndex) {
          // Asigna el color dependiendo del valor de la celda
          if (cellData === 'Inactivo') {
            $(cell).css('color', 'red')
          } else if (cellData === 'recepcion') {
            $(cell).css('color', 'orange')
          } else if (cellData === 'cambio') {
            $(cell).css('color', 'blue')
          } else if (cellData === 'asignado') {
            $(cell).css('color', 'green')
          }
        }
      },
      { targets: 7, data: 'empleado_id' },
      { targets: 8, data: 'nombre' },
      { targets: 9, data: 'fecha_asignacion' },
      {
        targets: 10,
        data: 'fecha_devolucion',
        render: function (data, type, row) {
          return data || 'No especificado'
        }
      },
      {
        targets: 11,
        data: 'responsiva',
        render: function (data, type, row) {
          // Utiliza la ruta de enlace como valor del botón y muestra el enlace
          return '<button class="btn btn-primary mdi mdi-eye abrirEnlace" type="button"  data-url="' + data + '"></button>'
        }
      },
      {
        targets: 12,
        data: 'ubicacion',
        render: function (data, type, row) {
          // Verifica si la ubicación es un objeto y muestra su nombre
          return data.trim().toUpperCase()
        }
      }
    ]
  })
  abrirEnlace()
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
export { iniciarHistorialAsignacion, verHistorialAsignacion }
