/* eslint-disable no-undef */

// Función para obtener mezclas solicitadas
async function fetchTbSolicitadas (status) {
  try {
    const response = await fetch(`/api/mezclasSolicitadas/${status}`)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    console.log(data)
    return data
  } catch (error) {
    console.error('Error fetching solicitudes:', error)
    throw error
  }
}

// Iniciar proceso de mezclas
const iniciarProceso = async () => {
  try {
    const data = await obtenerProceso()
    const table = $('#tbPreparadas').DataTable()
    table.clear().rows.add(data).draw()
  } catch (error) {
    console.error('Error al iniciar proceso:', error)
    // Opcional: mostrar mensaje de error al usuario
    // mostrarMensajeError('No se pudieron cargar las mezclas')
  }
}

// Obtener mezclas en proceso
const obtenerProceso = async () => {
  try {
    return await fetchTbSolicitadas('Proceso')
  } catch (error) {
    console.error('Error al obtener proceso:', error)
    throw error
  }
}

// Configuración de tabla de solicitudes
const verProceso = () => {
  $('#tbPreparadas').DataTable({
    paging: false,
    order: [[0, 'desc']],
    responsive: true,
    pageLength: -1,
    searching: false,
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
        data: 'id',
        render: function (data, type, row) {
          return `
            <p>${row.Solicita}</p>
            <hr>
            <button 
              type="button" 
              class="btn btn-primary mostrar-solicitud" 
              data-row='${JSON.stringify(row)}'>
              Mostrar Solicitud
            </button>`
        }
      },
      { targets: 2, data: 'fechaSolicitud' },
      { targets: 3, data: 'ranchoDestino' },
      { targets: 4, data: 'empresa' }
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

export { iniciarProceso, verProceso }
