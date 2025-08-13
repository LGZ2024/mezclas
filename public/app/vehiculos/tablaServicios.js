/* eslint-disable no-undef */
// Funciones de fetch con mejor manejo de errores
async function fechTbSolicitadas () {
  try {
    const response = await fetch('/api/servicio/')
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
const iniciarServicios = async () => {
  try {
    const data = await obtenerTickets()
    const table = $('#tbServicios').DataTable()
    console.log(data)
    table.clear().rows.add(data).draw()
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
const verServicio = async () => {
  $('#tbServicios').DataTable({
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
      {
        targets: 0,
        data: 'id'
      },
      {
        targets: 1,
        data: 'no_economico'
      },
      {
        targets: 2,
        data: 'centros_coste'
      },
      {
        targets: 3,
        data: 'tipo_vehiculo'
      },
      {
        targets: 4,
        data: 'tipo_servicio',
        createdCell: function (cell, cellData) {
          if (cellData === 'Preventivo') {
            $(cell).css({
              'background-color': '#FFA233',
              color: 'black'
            })
          } else if (cellData === 'Correctivo') {
            $(cell).css({
              'background-color': '#FF4233',
              color: 'black'
            })
          }
        }
      },
      {
        targets: 5,
        data: 'fecha'
      },
      {
        targets: 6,
        data: 'prioridad',
        createdCell: function (cell, cellData) {
          if (cellData === 'Baja') {
            $(cell).css({
              'background-color': '#3ce74c',
              color: 'black'
            })
          } else if (cellData === 'Media') {
            $(cell).css({
              'background-color': '#FCFF33',
              color: 'black'
            })
          } else if (cellData === 'Alta') {
            $(cell).css({
              'background-color': '#FFA233',
              color: 'black'
            })
          } else {
            $(cell).css({
              'background-color': '#FF4233',
              color: 'black'
            })
          }
        }
      },
      {
        targets: 7,
        data: 'taller_asignado'
      },
      {
        targets: 8,
        data: 'kilometraje'
      },
      {
        targets: 9,
        data: 'proximo_servicio'
      },
      {
        targets: 10,
        data: 'fecha_salida'
      },
      {
        targets: 11,
        data: 'tipo_pago'
      },
      {
        targets: 12,
        data: 'precio'
      },
      {
        targets: 13,
        data: 'factura'
      },
      {
        targets: 14,
        data: 'responsable'
      },
      {
        targets: 15,
        data: 'comentario',
        render: function (data) {
          if (data) return data
          return 'Sin Comentario'
        }
      }
    ]
  })
}

// Exportar funciones
export { iniciarServicios, verServicio }
