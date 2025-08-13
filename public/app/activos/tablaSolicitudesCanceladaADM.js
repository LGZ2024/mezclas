/* eslint-disable no-undef */
// Funciones de fetch con mejor manejo de errores
async function fechTbSolicitadas () {
  try {
    const response = await fetch('/api/mezclasCancelada/')
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
const iniciarSolicitudesCanceladasADM = async () => {
  try {
    const data = await obtenerTickets()
    const table = $('#tbSolicitudesCanceladas').DataTable()
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
const verSolicitudesCanceladasADM = async () => {
  if ($.fn.DataTable.isDataTable('#tbSolicitudesCanceladas')) {
    $('#tbSolicitudesCanceladas').DataTable().destroy()
  }
  $('#tbSolicitudesCanceladas').DataTable({
    paging: true,
    order: [[0, 'desc']],
    responsive: true,
    buttons: [
      {
        extend: 'copyHtml5',
        text: '<a class="mdi mdi-content-copy icon"></a>',
        titleAttr: 'Copiar'
      },
      {
        extend: 'excelHtml5',
        text: '<a class="mdi mdi-file-excel icon"></a>',
        titleAttr: 'Excel'
      },
      {
        extend: 'csvHtml5',
        text: '<a class="mdi mdi-file-excel-box icon"></a>',
        titleAttr: 'CSV'
      }
    ],
    dom: '<"d-flex justify-content-between m-4"fBl>t<"d-xl-flex justify-content-between align-items-center"ip><"clear">',
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
      { targets: 0, data: 'id' },
      {
        targets: 1,
        data: 'FolioReceta',
        render: function (data, type, row) {
          if (!data) return 'No Aplica'
          return data
        }
      },
      { targets: 2, data: 'Solicita' },
      {
        targets: 3,
        data: 'motivoCancelacion',
        render: function (data, type, row) {
          if (!data) return 'Sin Comentario'
          return data
        }
      },
      { targets: 4, data: 'fechaSolicitud' },
      { targets: 5, data: 'empresa' },
      { targets: 6, data: 'ranchoDestino' },
      { targets: 7, data: 'centroCoste' },
      { targets: 8, data: 'temporada' }
    ]
  })
  configurarEditarSolicitud()
}

// Configurar edición de solicitud con delegación de eventos
const configurarEditarSolicitud = () => {
  $(document).on('click', '.mostrar-solicitud', async function (event) {
    event.preventDefault()

    const rowData = JSON.parse($(this).attr('data-row'))
    // Usar función para establecer valores
    establecerValoresSolicitud({ data: rowData })
    console.log(rowData)
    // Ocultar/mostrar secciones
    $('#tablaFuciones').hide()
    $('#formPreparadas').show()
  })
}

// Función para establecer valores en el formulario
const establecerValoresSolicitud = ({ data }) => {
  document.getElementById('idSolicitud').value = data.id
  document.getElementById('solicitai').value = data.Solicita
  document.getElementById('fechai').value = data.fechaSolicitud
  document.getElementById('ranchoi').value = data.ranchoDestino
  document.getElementById('empresai').value = data.empresa
  document.getElementById('centroCostei').value = data.centroCoste
  document.getElementById('variedadi').value = data.variedad
  document.getElementById('folioi').value = data.FolioReceta
  document.getElementById('temporadai').value = data.temporada
  document.getElementById('cantidadi').value = data.cantidad
  document.getElementById('presentacioni').value = data.prensetacion
  document.getElementById('metodoi').value = data.metodoAplicacion
  document.getElementById('descripcioni').value = data.descripcion
  document.getElementById('notaMezcla').value = data.notaMezcla
}

// Exportar funciones
export { iniciarSolicitudesCanceladasADM, verSolicitudesCanceladasADM }
