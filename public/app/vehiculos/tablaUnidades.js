/* eslint-disable no-undef */
// Funciones de fetch con mejor manejo de errores
async function fechTbSolicitadas () {
  try {
    const response = await fetch('/api/unidadesC/')
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
const iniciarUnidades = async () => {
  try {
    const data = await obtenerSolicitudes()
    const table = $('#tbUnidades').DataTable()
    table.clear().rows.add(data).draw()
  } catch (error) {
    console.error('Error al iniciar solicitudes:', error)
    // Opcional: Mostrar mensaje de error al usuario
    // mostrarMensajeError('No se pudieron cargar las solicitudes')
  }
}

// Obtener solicitudes
const obtenerSolicitudes = async () => {
  try {
    return await fechTbSolicitadas()
  } catch (error) {
    console.error('Error al obtener solicitudes:', error)
    throw error
  }
}

// Configuración de tabla de solicitudes
const verUnidades = async () => {
  $('#tbUnidades').DataTable({
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
        data: 'marca'
      },
      {
        targets: 3,
        data: 'tipo'
      },
      {
        targets: 4,
        data: 'modelo'
      },
      {
        targets: 5,
        data: 'ano'
      },
      {
        targets: 6,
        data: 'numero_motor'
      },
      {
        targets: 7,
        data: 'no_serie'
      },
      {
        targets: 8,
        data: 'placas'
      },
      {
        targets: 9,
        data: 'tipoCombustible'
      },
      {
        targets: 10,
        data: 'medida_llanta'
      },
      {
        targets: 11,
        data: 'cia_seguro'
      },
      {
        targets: 12,
        data: 'no_poliza'
      }
    ]
  })
}

// Exportar funciones
export { iniciarUnidades, verUnidades }
