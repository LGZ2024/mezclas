/* eslint-disable no-undef */
// Funciones de fetch con mejor manejo de errores
async function fechTbSolicitadas () {
  try {
    const response = await fetch('/api/equipo_historial')
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
const iniciarHistorialEquipos = async () => {
  try {
    const data = await obtenerTickets()
    const table = $('#tbHistorialEquipos').DataTable()
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
const verHistorialEquipos = async () => {
  if ($.fn.DataTable.isDataTable('#tbHistorialEquipos')) {
    $('#tbHistorialEquipos').DataTable().destroy()
  }
  $('#tbHistorialEquipos').DataTable({
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
      {
        targets: 0,
        data: 'no_economico',
        render: function (data, type, row) {
          // Validar si data es null o undefined
          if (!data) return 'No especificado'

          // Si el dato existe, aplicar la transformación
          return data.trim().toUpperCase()
        }
      },
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
      {
        targets: 3,
        data: 'ns',
        render: function (data, type, row) {
          // Validar si data es null o undefined
          if (!data) return 'No especificado'

          // Si el dato existe, aplicar la transformación
          return data.trim().toUpperCase()
        }
      },
      {
        targets: 4,
        data: 'tag',
        render: function (data, type, row) {
          // Validar si data es null o undefined
          if (!data) return 'No especificado'

          // Si el dato existe, aplicar la transformación
          return data.trim().toUpperCase()
        }
      },
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
          return data.toUpperCase()
        },
        createdCell: function (cell, cellData, rowData, rowIndex, colIndex) {
          // Asigna el color dependiendo del valor de la celda
          if (cellData === 'inactivo') {
            $(cell).css('color', '#b80b0bff')
          } else if (cellData === 'reparacion') {
            $(cell).css('color', 'orange')
          } else if (cellData === 'mantenimiento') {
            $(cell).css('color', 'blue')
          } else if (cellData === 'Registro Equipo') {
            $(cell).css('color', '#32CD32')
          } else if (cellData === 'baja') {
            $(cell).css('color', 'red')
          } else if (cellData === 'disponible') {
            $(cell).css('color', 'green')
          }
        }
      },
      {
        targets: 7,
        data: 'motivo',
        render: function (data, type, row) {
          // Validar si data es null o undefined
          if (!data) return 'No especificado'

          // Si el dato existe, aplicar la transformación
          return data.trim().toUpperCase()
        }
      },
      { targets: 8, data: 'fecha_registro' }
    ]
  })
}

// Exportar funciones
export { iniciarHistorialEquipos, verHistorialEquipos }
