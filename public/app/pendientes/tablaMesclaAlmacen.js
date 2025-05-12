/* eslint-disable no-undef */
import { mostrarNotificacion } from '../notificacion.js'
// Funciones de fetch con mejor manejo de errores
async function fechTbSolicitadas (status) {
  try {
    const response = await fetch(`/api/mezclasSolicitadas/${status}`)
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

async function fechProductosSolicitud (data) {
  try {
    const response = await fetch('/api/productoSoli', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return response
  } catch (error) {
    console.error('Error posting productos solicitud:', error)
    throw error
  }
}

async function fechSolicitudProceso ({ data, id }) {
  try {
    const response = await fetch(`/api/solicitudProceso/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    // Convertir la respuesta a JSON una sola vez
    const responseData = await response.json()

    // Para debugging (opcional)
    console.log('Respuesta del servidor:', responseData)

    return responseData
  } catch (error) {
    console.error('Error updating solicitud proceso:', error)
    throw error
  }
}

// Iniciar solicitudes con mejor manejo de errores
const iniciarSolicitudes = async () => {
  try {
    const data = await obtenerSolicitudes()
    const table = $('#tbSolicitadas').DataTable()
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
    return await fechTbSolicitadas('Pendiente')
  } catch (error) {
    console.error('Error al obtener solicitudes:', error)
    throw error
  }
}

// Configuración de tabla de solicitudes
const verSolicitud = () => {
  $('#tbSolicitadas').DataTable({
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

  configurarFomulario()
}

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

  const rol = document.getElementById('rol').value
  if (rol === 'mezclador') {
    const mensaje = data.respuestaSolicitud
    if (mensaje) mostrarNotificacion(mensaje, new Date(), data.id)
  } else if (rol === 'solicita') {
    const mensaje = data.respuestaMezclador
    if (mensaje) mostrarNotificacion(mensaje, new Date())
  }
}

// Exportar funciones
export { iniciarSolicitudes, verSolicitud, fechProductosSolicitud, fechSolicitudProceso }
