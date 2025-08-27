/* eslint-disable no-undef */

// Funciones de fetch con mejor manejo de errores
async function fechTbSolicitadas () {
  try {
    const status = 'Proceso'
    const url = `/api/mezclasSolicitadas/${status}`
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    // console.log('Datos obtenidos:', data)
    return data
  } catch (error) {
    console.error('Error fetching solicitudes:', error)
    throw error
  }
}

// Iniciar solicitudes con mejor manejo de errores
const iniciarProceso = async () => {
  try {
    const data = await obtenerTickets()
    console.log(data)
    const table = $('#tbProceso').DataTable()
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
const verProceso = async () => {
  if ($.fn.DataTable.isDataTable('#tbProceso')) {
    $('#tbProceso').DataTable().destroy()
  }
  $('#tbProceso').DataTable({
    paging: true,
    order: [[0, 'desc']],
    responsive: true,
    autoWidth: false,
    scrollCollapse: true,
    fixedHeader: false,
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
    dom: '<"d-flex flex-column flex-md-row justify-content-between align-items-center mb-3"fBl>t<"d-flex flex-column flex-sm-row justify-content-between align-items-center mt-3"ip>',
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
        data: 'id',
        render: function (data) {
          return `<span data-label="Solicitud">${data}</span>`
        }
      },
      {
        targets: 1,
        data: 'id',
        render: function (data, type, row) {
          return `
            <div data-label="Solicita">
              <p>${row.Solicita}</p>
              <hr>
              <button 
                type="button" 
                class="btn btn-primary mostrar-solicitud touch-target" 
                data-row='${JSON.stringify(row)}'>
                Mostrar Solicitud
              </button>
            </div>`
        }
      },
      {
        targets: 2,
        data: 'fechaSolicitud',
        render: function (data) {
          return `<span data-label="Fecha de Solicitud">${data}</span>`
        }
      },
      {
        targets: 3,
        data: 'ranchoDestino',
        render: function (data) {
          return `<span data-label="Rancho destino">${data}</span>`
        }
      },
      {
        targets: 4,
        data: 'empresa',
        render: function (data) {
          return `<span data-label="Empresa">${data}</span>`
        }
      }
    ]
  })

  configurarFomulario()
}

export { iniciarProceso, verProceso }
// Configurar edición de solicitud con delegación de eventos
const configurarFomulario = () => {
  $(document).on('click', '.mostrar-solicitud', async function (event) {
    event.preventDefault()

    const rowData = JSON.parse($(this).attr('data-row'))
    // Usar función para establecer valores
    establecerValoresSolicitud({ data: rowData })
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
}
