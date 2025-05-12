/* eslint-disable no-undef */
import { iniciarProductosReceta, verProductosReceta } from '../productosReceta/productos.js'

// Función para obtener mezclas solicitadas
async function fetchTbSolicitadas () {
  try {
    const response = await fetch('/api/mezclasCancelada/')
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
    console.log(data)
    const table = $('#tablaCanceladas').DataTable()
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
    return await fetchTbSolicitadas()
  } catch (error) {
    console.error('Error al obtener proceso:', error)
    throw error
  }
}

// Configuración de tabla de solicitudes
const verProceso = () => {
  $('#tablaCanceladas').DataTable({
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
        data: 'Solicita',
        render: function (data, type, row) {
          return `
            <button 
              type="button" 
              class="btn btn-primary mostrar-solicitud"
              data-row='${JSON.stringify(row)}'
            >
              Ver Solicitud
            </button>`
        }
      },
      { targets: 2, data: 'FolioReceta' },
      { targets: 3, data: 'motivoCancelacion' },
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
    $('#modalInformacion').modal('show')
  })
}

// Función para establecer valores en el formulario
const establecerValoresSolicitud = async ({ data }) => {
  console.log('Estableciendo valores en el formulario:', data)
  document.getElementById('idSolicit').value = data.id
  document.getElementById('solicita').value = data.Solicita
  document.getElementById('fechaSolicitud').value = data.fechaSolicitud
  document.getElementById('ranchoDestino').value = data.ranchoDestino
  document.getElementById('empresa').value = data.empresa
  document.getElementById('centroCoste').value = data.centroCoste
  document.getElementById('variedad').value = data.variedad
  document.getElementById('FolioReceta').value = data.FolioReceta
  document.getElementById('temporada').value = data.temporada
  document.getElementById('cantidad').value = data.cantidad
  document.getElementById('presentacion').value = data.prensetacion
  document.getElementById('metodoAplicacion').value = data.metodoAplicacion
  document.getElementById('descripcion').value = data.descripcion

  // Mostrar productos de la receta

  iniciarProductosReceta(data.id)
  await verProductosReceta({
    eliminarUltimaColumna: false,
    depuracion: true
  })
}

export { iniciarProceso, verProceso }
