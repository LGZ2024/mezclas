/* eslint-disable no-undef */
import { fetchApi } from '../funciones.js'

/* funciones para inicializar tabla  de mezclas solicitadas */
/* inicializar tabla solicitada */
const iniciarRegistros = async () => {
  try {
    const data = await obtenerRegistro()
    const table = $('#solicitudes').DataTable()
    table.clear().rows.add(data)
    table.columns.adjust().draw()
  } catch (error) {
    console.error('Error al inicializar registros:', error)
  }
}
/* obtener mezclas */
const obtenerRegistro = async () => {
  try {
    const response = await fetchApi('/api/solicitudReporte', 'GET') // cambiar a GET
    const data = await response.json()

    return data[0]
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}
/* mostrar tala de mezclas Solicitada */
const verRegistro = async () => {
  let minDate, maxDate
  try {
    // Creacion de imput para el rango de fechas
    minDate = new DateTime('#min', {
      format: 'DD/MM/YYYY',
      locale: 'es-MX', // Set locale to Spanish (Mexico)
      i18n: {
        previous: 'Anterior',
        next: 'Siguiente',
        months: [
          'Enero',
          'Febrero',
          'Marzo',
          'Abril',
          'Mayo',
          'Junio',
          'Julio',
          'Agosto',
          'Septiembre',
          'Octubre',
          'Noviembre',
          'Diciembre'
        ],
        weekdays: ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab']
      }
    })
    maxDate = new DateTime('#max', {
      format: 'DD/MM/YYYY',
      locale: 'es-MX', // Set locale to Spanish (Mexico)
      i18n: {
        previous: 'Anterior',
        next: 'Siguiente',
        months: [
          'Enero',
          'Febrero',
          'Marzo',
          'Abril',
          'Mayo',
          'Junio',
          'Julio',
          'Agosto',
          'Septiembre',
          'Octubre',
          'Noviembre',
          'Diciembre'
        ],
        weekdays: ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab']
      }
    })
    if (!$.fn.dataTable.isDataTable('#solicitudes')) {
      // Custom filtering function which will search data in column four between two values
      DataTable.ext.search.push(function (settings, data, dataIndex) {
        const min = minDate.val() ? moment(minDate.val(), 'YYYY-MM-DD').toDate() : null
        const max = maxDate.val() ? moment(maxDate.val(), 'YYYY-MM-DD').toDate() : null
        const date = moment(data[8], 'YYYY-MM-DD').toDate()
        if (
          (min === null && max === null) ||
          (min === null && date <= max) ||
          (min <= date && max === null) ||
          (min <= date && date <= max)
        ) {
          return true
        }
        return false
      })

      const tabla = $('#solicitudes').DataTable({
        paging: true,
        orderCellsTop: true,
        fixedHeader: true,
        order: [[0, 'desc']],
        searching: true,
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
          { targets: 0, data: 'id_solicitud' },
          { targets: 1, data: 'usuario' },
          { targets: 2, data: 'empresa' },
          { targets: 3, data: 'rancho' },
          { targets: 4, data: 'temporada' },
          { targets: 5, data: 'descripcion' },
          { targets: 6, data: 'folio' },
          { targets: 7, data: 'centroCoste' },
          { targets: 8, data: 'variedad' },
          { targets: 9, data: 'fechaSolicitud' },
          { targets: 10, data: 'fechaEntrega' }
        ]
      })

      // selecciona inputs para el filtrado de fechas
      document.querySelectorAll('#min, #max').forEach((el) => {
        el.addEventListener('change', () => tabla.draw())
      })

      // Creamos una fila en el head de la tabla y lo clonamos para cada columna
      $('#solicitudes tfoot tr').clone(true).appendTo('#solicitudes tfoot')
      $('#solicitudes tfoot tr:eq(1) th').each(function (i) {
        const title = $(this).text() // es el nombre de la columna

        // Verifica si la columna actual es la última
        if (i < $('#solicitudes tfoot tr:eq(0) th').length) {
          $(this).html('<input type="text" placeholder="Search...' + title + '" />')

          $('input', this).on('keyup change', function () {
            if (tabla.column(i).search() !== this.value) {
              tabla
                .column(i)
                .search(this.value)
                .draw()
            }
          })
        } else {
          // Si es la última columna, no se agrega el input
          $(this).html('') // O puedes dejarlo vacío
        }
      })
    }
  } catch (error) {
    console.error('Error al mostrar registros:', error)
  }
}

export { iniciarRegistros, verRegistro }
// Función para obtener los precios de la columna 'precio_cantidad' de los datos filtrados
