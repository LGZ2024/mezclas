/* eslint-disable no-undef */
import { iniciarProductosReceta, verProductosReceta } from '../productosReceta/productos.js'

// Funciones de fetch con mejor manejo de errores
async function fechTbSolicitadas(status) {
  try {
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
const iniciarCompletadas = async () => {
  try {
    const data = await obtenerTickets()
    console.log(data)
    const table = $('#tbCompletadas').DataTable()
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
    return await fechTbSolicitadas('Completada')
  } catch (error) {
    console.error('Error al obtener solicitudes:', error)
    throw error
  }
}

// Configuración de tabla de solicitudes
const verCompletadas = async () => {
  if ($.fn.DataTable.isDataTable('#tbCompletadas')) {
    $('#tbCompletadas').DataTable().destroy()
  }
  $('#tbCompletadas').DataTable({
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
    dom: '<"d-flex justify-content-between"fl>t<"d-xl-flex justify-content-between align-items-center"ip><"clear">',
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
      // Define el orden de las columnas
      { targets: 0, data: 'id' },
      { targets: 1, data: 'Solicita' },
      { targets: 2, data: 'fechaSolicitud' },
      { targets: 3, data: 'ranchoDestino' },
      { targets: 4, data: 'empresa' },
      { targets: 5, data: 'centroCoste' },
      { targets: 6, data: 'FolioReceta' },
      { targets: 7, data: 'temporada' },
      { targets: 8, data: 'cantidad' },
      { targets: 9, data: 'prensetacion' },
      { targets: 10, data: 'metodoAplicacion' },
      { targets: 11, data: 'descripcion' },
      { targets: 12, data: 'variedad' },
      {
        targets: 13,
        data: 'id',
        render: function (data, type, row) {
          return `
            <button 
              type="button" 
              class="btn btn-primary receta" 
              data-id='${data}'>
              Mostrar Solicitud
            </button>`
        }
      },
      { targets: 14, data: 'notaMezcla' },
      {
        targets: 15,
        data: 'imagenEntrega',
        render: function (data, type, row) {
          return `
            <button 
              type="button" 
              class="btn btn-primary mostrar-foto" 
              data-foto='${data}'>
              Mostrar entrega
            </button>`
        }
      },
      { targets: 16, data: 'fechaEntrega' }
    ]
  })
  receta()
  foto()
}

export { iniciarCompletadas, verCompletadas }
const receta = () => {
  $(document).on('click', '.receta', async function (event) {
    event.preventDefault()
    const idSolicitud = $(this).attr('data-id')
    // Usar función para establecer valores
    $('#staticBackdrop').modal('show')
    // iniciamos tabla
    iniciarProductosReceta(idSolicitud)
    await verProductosReceta({
      eliminarUltimaColumna: true,
      columnaAEliminar: -1, // Última columna
      depuracion: true
    })
  })
}
const foto = () => {
  $(document).on('click', '.mostrar-foto', async function (event) {
    event.preventDefault()
    const foto = $(this).attr('data-foto')
    // Corregir la ruta de la imagen
    const imageUrl = `/api/${foto.replace(/^\//, '')}`
    // const urlPrueba = '/api/uploads/images/image_1743804209875_mqn0hi2sx2s.png'
    mostrarImagen(imageUrl, 'Imagen de entrega')
  })
}

const mostrarImagen = (enlace, descripcion) => {
  // Mostrar loader
  const imageLoader = document.getElementById('imageLoader')
  if (imageLoader) imageLoader.style.display = 'block'

  fetch(enlace, { method: 'GET' })
    .then(response => {
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
      return response
    })
    .then(() => {
      const modalContent = `
        <div class="modal-dialog modal-fullscreen-sm-down modal-lg">
          <div class="modal-content">
            <div class="modal-header bg-primary text-white">
              <h5 class="modal-title">${descripcion}</h5>
              <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body p-0">
              <div class="image-container position-relative">
                <img src="${enlace}" 
                     class="img-fluid w-100" 
                     style="max-height: 80vh; object-fit: contain;"
                     alt="Imagen de entrega"
                     onerror="this.onerror=null; this.src='/img/no-image.png';">
              </div>
            </div>
          </div>
        </div>`

      $('#pdfModal').html(modalContent).modal('show')
    })
    .catch(error => {
      console.error('Error:', error)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo cargar la imagen'
      })
    })
    .finally(() => {
      if (imageLoader) imageLoader.style.display = 'none'
    })
}
