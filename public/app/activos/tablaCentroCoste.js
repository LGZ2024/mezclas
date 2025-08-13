/* eslint-disable no-new */
/* eslint-disable no-undef */
import { fetchApi, MensajeEliminacion } from '../funciones.js'

/* funciones para inicializar tabla  de mezclas solicitadas */
/* inicializar tabla solicitada */
const iniciarCentroCoste = async () => {
  try {
    const data = await obtenerRegistro()
    const table = $('#tbCentroCoste').DataTable()
    table.clear().rows.add(data)
    table.columns.adjust().draw()
  } catch (error) {
    console.error('Error al inicializar registros:', error)
  }
}
/* obtener mezclas */
const obtenerRegistro = async () => {
  try {
    const response = await fetchApi('/api/centroCoste', 'GET') // cambiar a GET
    const data = await response.json()
    console.log(data)
    return data
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}
/* mostrar tala de mezclas Solicitada */
const verCentroCoste = async () => {
  const rol = document.getElementById('rol').value
  if ($.fn.DataTable.isDataTable('#tbCentroCoste')) {
    $('#tbCentroCoste').DataTable().destroy()
  }
  $('#tbCentroCoste').DataTable({
    paging: true,
    order: [[0, 'desc']],
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
    dom: '<"d-flex justify-content-between"fBl>t<"d-xl-flex justify-content-between align-items-center"ip><"clear">',
    responsive: false,
    pageLength: 5,
    lengthMenu: [[5, 10, 20, -1], [5, 10, 20, 'Todos']],
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
      { targets: 1, data: 'cc' },
      { targets: 2, data: 'CustomCentrocoste' },
      { targets: 3, data: 'centroCoste' },
      { targets: 4, data: 'rancho' },
      { targets: 5, data: 'cultivo' },
      { targets: 6, data: 'variedad' },
      { targets: 7, data: 'empresa' },
      {
        targets: 8,
        data: 'id',
        render: function (data, type, row) {
          // al boton le pasaremos data para obtenerlo con el evento del botton

          if (rol === 'master') {
            return `
                    <button type="button" data-id="${data}"  class="btn btn-danger btnDelete"><i class="mdi mdi-delete"></i></button>
                  `
          }
          return 'No autorizado'
        }
      }
    ]
  })
  agregar()
  eliminar()
}

export { iniciarCentroCoste, verCentroCoste }

const agregar = async () => {
  $(document).on('click', '#btnCrear', async function () {
    const modal = $('#staticBackdrop')
    document.getElementById('exampleModalLabel').textContent = 'Agregar Centro de Coste'
    modal.modal('show')
  })
}

const eliminar = () => {
  $(document).on('click', '.btnDelete', async function (e) {
    e.preventDefault()
    const id = $(this).data('id')
    const url = `/api/centroCoste/${id}`
    const method = 'DELETE'

    const respuesta = await MensajeEliminacion(url, method)
    if (respuesta === true) {
      iniciarProductos()
      await verProductos()
    }
  })
}
