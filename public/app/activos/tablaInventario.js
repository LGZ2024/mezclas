/* eslint-disable no-undef */
import { fetchApi } from '../funciones.js'

/* funciones para inicializar tabla  de mezclas solicitadas */
/* inicializar tabla solicitada */
const iniciarInventario = async () => {
  try {
    const data = await obtenerRegistro()
    console.log('Datos obtenidos para la tabla de entradas de inventario:', data)
    const table = $('#tbInventario').DataTable()
    table.clear().rows.add(data)
    table.columns.adjust().draw()
  } catch (error) {
    console.error('Error al inicializar registros:', error)
  }
}
/* obtener mezclas */
const obtenerRegistro = async () => {
  try {
    const response = await fetchApi('/api/inventarios', 'GET') // cambiar a GET
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}
/* mostrar tala de mezclas Solicitada */
const verInventario = async () => {
  try {
    if (!$.fn.dataTable.isDataTable('#tbInventario')) {
      const tabla = $('#tbInventario').DataTable({
        paging: true,
        orderCellsTop: true,
        fixedHeader: true,
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
        searchaing: true,
        dom: '<"d-flex justify-content-between"l>t<"d-xl-flex justify-content-between align-items-center"ip><"clear">',
        responsive: true,
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
          {
            targets: 0,
            data: 'id'
          },
          {
            targets: 1,
            data: 'almacen'
          },
          {
            targets: 2,
            data: 'combustible'
          },
          {
            targets: 3,
            data: 'existencia'
          }
        ]
      })

      // selecciona inputs para el filtrado de fechas
      document.querySelectorAll('#min, #max').forEach((el) => {
        el.addEventListener('change', () => tabla.draw())
      })
    }
  } catch (error) {
    console.error('Error al mostrar registros:', error)
  }
}

export { iniciarInventario, verInventario }
// Función para obtener los precios de la columna 'precio_cantidad' de los datos filtrados
