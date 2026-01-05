/* eslint-disable no-undef */
import { iniciarProductosReceta, verProductosReceta } from '../productosReceta/productos.js'
import { mostrarMensaje } from '../mensajes.js'
import { showSpinner, hideSpinner } from '../spinner.js'

// Funciones de fetch con mejor manejo de errores
async function fechTbSolicitadas() {
  try {
    const status = 'Proceso'
    const url = `/api/mezclas/solicitadas/${status}`
    const response = await fetch(url)
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
const iniciarProceso = async () => {
  try {
    showSpinner()
    const data = await obtenerTickets()

    // Validar que tenemos datos
    if (!Array.isArray(data)) {
      console.error('Los datos no son un array:', data)
      hideSpinner()
      return
    }

    // Validar que los datos no esten vacios
    if (data.length === 0) {
      mostrarMensaje({
        msg: 'No hay solicitudes en proceso',
        type: 'info'
      })
      hideSpinner()
    }

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
  try {
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
    hideSpinner()
    configurarFomulario()
  } catch (error) {
    hideSpinner()
    mostrarMensaje({
      msg: 'Error al iniciar solicitudes',
      type: 'error'
    })
    console.error('Error al iniciar solicitudes:', error)
  }
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
    $('#modalInformacion').modal('show')
  })
}

// Función para establecer valores en el formulario
const establecerValoresSolicitud = async ({ data }) => {
  console.log(data)
  document.getElementById('idSolicit').value = data.id
  document.getElementById('id').value = data.id
  document.getElementById('solicita').value = data.Solicita
  document.getElementById('fechaSolicitud').value = data.fechaSolicitud
  document.getElementById('ranchoDestino').value = data.ranchoDestino
  document.getElementById('empresa').value = data.empresa
  document.getElementById('centroCoste').value = data.centroCoste
  document.getElementById('variedad').value = data.variedad
  document.getElementById('temporada').value = data.temporada
  document.getElementById('metodoAplicacion').value = data.metodoAplicacion
  document.getElementById('descripcion').value = data.descripcion
  // Ocultar/mostrar secciones
  if (!data.FolioReceta && !data.cantidad && !data.prensetacion) {
    document.getElementById('FolioReceta').hidden = true
    document.getElementById('cantidad').hidden = true
    document.getElementById('presentacion').hidden = true
    // Ocultar divs
    document.getElementById('divFolioReceta').style.display = 'none'
    document.getElementById('divCantidad').style.display = 'none'
    document.getElementById('divPresentacion').style.display = 'none'
  } else {
    // Mostrar divs
    document.getElementById('divFolioReceta').style.display = 'block'
    document.getElementById('divCantidad').style.display = 'block'
    document.getElementById('divPresentacion').style.display = 'block'
    // Mostrar valores
    document.getElementById('FolioReceta').value = data.FolioReceta
    document.getElementById('cantidad').value = data.cantidad
    document.getElementById('presentacion').value = data.prensetacion
    // mostrar inputs
    document.getElementById('FolioReceta').hidden = false
    document.getElementById('cantidad').hidden = false
    document.getElementById('presentacion').hidden = false
  }
  // validamos rol
  const rol = document.getElementById('rol').value
  if (rol === 'mezclador' || rol === 'administrativo' || rol === 'master') {
    document.getElementById('agregarProductoReceta').style.display = 'none'
    document.getElementById('btnEnviarEstado').style.display = 'none'
    document.getElementById('btnDescargar').style.display = 'none'
    iniciarProductosReceta(data.id)
    await verProductosReceta({
      eliminarUltimaColumna: true,
      columnaAEliminar: -1,
      depuracion: true
    })
  } else {
    document.getElementById('agregarProductoReceta').style.display = 'none'
    document.getElementById('btnCancelar').style.display = 'none'
    document.getElementById('btnEditar').style.display = 'none'
    document.getElementById('btnConfirmacion').style.display = 'none'
    iniciarProductosReceta(data.id)
    await verProductosReceta({
      eliminarUltimaColumna: true,
      columnaAEliminar: -1,
      depuracion: true
    })
  }
}
