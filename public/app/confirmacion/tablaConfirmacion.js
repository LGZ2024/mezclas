/* eslint-disable no-undef */
import { iniciarProductosReceta, verProductosReceta } from '../productosReceta/productos.js'

// Funciones de fetch con mejor manejo de errores
async function fechTbSolicitadas (status) {
  try {
    const response = await fetch('/api/mezclasConfirmar')
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
const iniciarSolicitudes = async () => {
  try {
    // Obtener datos primero
    const data = await obtenerSolicitudes()

    // Validar que tenemos datos
    if (!Array.isArray(data)) {
      console.error('Los datos no son un array:', data)
      return
    }

    // Destruir tabla existente si existe
    if ($.fn.DataTable.isDataTable('#tbSolicitadas')) {
      $('#tbSolicitadas').DataTable().destroy()
      $('#tbSolicitadas tbody').empty()
    }

    // Inicializar nueva tabla con los datos
    const table = $('#tbSolicitadas').DataTable({
      data, // Pasar datos directamente
      destroy: true,
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
      columns: [
        { data: 'id', title: 'Solicitud' },
        {
          data: 'Solicita',
          title: 'Solicitante',
          render: function (data, type, row) {
            return `
              <p>${data}</p>
              <hr>
              <button 
                type="button" 
                class="btn btn-primary mostrar-solicitud" 
                data-row='${JSON.stringify(row)}'>
                Mostrar Solicitud
              </button>`
          }
        },
        { data: 'fechaSolicitud', title: 'Fecha' },
        { data: 'ranchoDestino', title: 'Rancho' },
        { data: 'empresa', title: 'Empresa' },
        {
          data: 'id',
          title: 'Confirmación',
          render: function (data, type, row) {
            return `
              <div class="form-check form-switch m-3 align-items-center">
                <input class="form-check-input" 
                     type="checkbox" 
                     role="switch"
                     name="producto_${data}" 
                     id="check_${data}"
                     style="cursor: pointer; transform: scale(1.2);">
                <label class="form-check-label ms-2 text-primary" 
                     for="check_${data}">
                  <i class="bi bi-check-circle"></i> Confirmar
                </label>
              </div>`
          }
        }
      ]
    })

    // Verificar inicialización
    console.log('Tabla inicializada con datos:', {
      filas: table.rows().count(),
      datos: data.length
    })
    configurarFomulario()
  } catch (error) {
    console.error('Error al iniciar solicitudes:', error)
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

// Configurar edición de solicitud con delegación de eventos
const configurarFomulario = () => {
  $(document).on('click', '.mostrar-solicitud', async function (event) {
    event.preventDefault()

    const rowData = JSON.parse($(this).attr('data-row'))
    // Usar función para establecer valores
    establecerValoresSolicitud({ data: rowData })
    // Ocultar/mostrar secciones
    // $('#tablaFuciones').hide()
    // mostrarModal()
    $('#modalInformacion').modal('show')

    // $('#formPreparadas').show()
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
    eliminarUltimaColumna: true,
    columnaAEliminar: -1, // Última columna
    depuracion: true
  })
  // await verProductosReceta({
  //   eliminarUltimaColumna: false,
  //   depuracion: true
  // })
}

// Exportar funciones
export { iniciarSolicitudes }
