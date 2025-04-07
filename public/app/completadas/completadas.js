/* eslint-disable no-undef */
import { iniciarProductosReceta, verProductosReceta } from '../productosReceta/productos.js'
/* funciones para inicializar tabla de solicitudes */
async function fechTbSolicitadas (status) {
  const response = await fetch(`/api/mezclasSolicitadas/${status}`)
  const data = await response.json()
  console.log(data)
  return data
}
const iniciarSolicitudes = async () => {
  try {
    // pasamos parametros para obtener mezclas expecificas para cada almacenista
    const data = await obtenerSolicitudes()
    const table = $('#completadas').DataTable()
    table.clear().rows.add(data).draw()
    // Aquí puedes realizar acciones adicionales con los datos obtenidos
  } catch (error) {
    // Aquí puedes manejar el error
  }
}
/* obtener mezclas */
const obtenerSolicitudes = async () => {
  try {
    const data = await fechTbSolicitadas('Completada')
    return data
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}

/* mostrar tala de mezclas */
const verSolicitud = () => {
  $('#completadas').DataTable({
    paging: true,
    dom: '<"d-flex justify-content-between"fl>t<"d-xl-flex justify-content-between align-items-center"ip><"clear">',
    order: [[0, 'desc']],
    responsive: true,
    pageLength: 5,
    lengthMenu: [[5, 10, 20, -1], [5, 10, 20, 'Todos']],
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

export { iniciarSolicitudes, verSolicitud }
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
  fetch(enlace, { method: 'GET' })
    .then(response => {
      if (response.ok) {
        // Crear modal específico para imágenes
        const modalHtml = `
          <div class="modal-dialog modal-lg">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">${descripcion}</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
              </div>
              <div class="modal-body text-center">
                <img 
                  src="${enlace}" 
                  class="img-fluid" 
                  alt="Imagen de entrega"
                  onerror="this.onerror=null; this.src='/img/no-image.png';"
                >
              </div>
            </div>
          </div>`

        $('#pdfModal').html(modalHtml).modal('show')
      } else if (response.status === 401) {
        Swal.fire({
          icon: 'error',
          title: 'No autorizado',
          text: 'Por favor, inicie sesión nuevamente'
        })
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo cargar la imagen'
        })
      }
    })
    .catch(error => {
      console.error('Error al cargar imagen:', error)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al cargar la imagen'
      })
    })
}
