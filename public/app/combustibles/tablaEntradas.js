/* eslint-disable no-undef */
// Funciones de fetch con mejor manejo de errores
async function fechTbSolicitadas () {
  try {
    const response = await fetch('/api/entrada')
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
const iniciarEntrada = async () => {
  try {
    const data = await obtenerTickets()
    const table = $('#tbEntrada').DataTable()
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
const verEntrada = async () => {
  $('#tbEntrada').DataTable({
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
        data: 'almacen'
      },
      {
        targets: 2,
        data: 'centro_coste'
      },
      {
        targets: 3,
        data: 'combustible'
      },
      {
        targets: 4,
        data: 'cantidad'
      },
      {
        targets: 5,
        data: 'fecha'
      },
      {
        targets: 6,
        data: 'factura'
      },
      {
        targets: 7,
        data: 'proveedor'
      },
      {
        targets: 8,
        data: 'traslada'
      },
      {
        targets: 9,
        data: 'recibe'
      },
      {
        targets: 10,
        data: 'comentario'
      },
      {
        targets: 11,
        data: 'pedido'
      }
    ]
  })
}

// Exportar funciones
export { iniciarEntrada, verEntrada }
