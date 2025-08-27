/* eslint-disable no-undef */
import { fetchApi } from '../funciones.js'

/* funciones para inicializar tabla  de mezclas solicitadas */
/* inicializar tabla solicitada */
const iniciarReporteMezcla = async () => {
  try {
    const data = await obtenerRegistro()
    const table = $('#tbReporteMezcla').DataTable()
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
const verReporteMezcla = async () => {
  let minDate, maxDate
  try {
    // Creacion de imput para el rango de fechas
    minDate = new DateTime('#min', {
      format: 'YYYY-MM-DD', // Cambiado para coincidir con el formato de los datos
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
      format: 'YYYY-MM-DD', // Cambiado para coincidir con el formato de los datos
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
    if (!$.fn.dataTable.isDataTable('#tbReporteMezcla')) {
      // Custom filtering function which will search data in column four between two values
      DataTable.ext.search.push(function (settings, data, dataIndex) {
        try {
          // Obtener valores de fecha de los inputs
          const minVal = minDate.val()
          const maxVal = maxDate.val()

          // Obtener la fecha de la columna 9 (fechaSolicitud)
          const dateValue = data[9]

          // Si no hay fecha en los datos, no filtrar
          if (!dateValue) {
            return true
          }

          // Si no hay filtros aplicados, mostrar todos
          if (!minVal && !maxVal) {
            return true
          }

          // Parsear la fecha de los datos (formato YYYY-MM-DD)
          const date = moment.utc(dateValue, 'YYYY-MM-DD')
          if (!date.isValid()) {
            console.warn('Fecha inválida en datos:', dateValue)
            return true
          }

          // Parsear fechas de filtro
          let min = null
          let max = null

          if (minVal) {
            min = moment(minVal, 'YYYY-MM-DD')
            if (!min.isValid()) {
              console.warn('Fecha mínima inválida:', minVal)
              min = null
            }
          }

          if (maxVal) {
            max = moment(maxVal, 'YYYY-MM-DD')
            if (!max.isValid()) {
              console.warn('Fecha máxima inválida:', maxVal)
              max = null
            }
          }

          // Aplicar filtros
          if (min && max) {
            return date.isBetween(min, max, 'day', '[]') // Incluir fechas límite
          } else if (min) {
            return date.isSameOrAfter(min, 'day')
          } else if (max) {
            return date.isSameOrBefore(max, 'day')
          }

          return true
        } catch (error) {
          console.error('Error en filtro de fechas:', error)
          return true // En caso de error, mostrar la fila
        }
      })

      const tabla = $('#tbReporteMezcla').DataTable({
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
      $('#tbReporteMezcla tfoot tr').clone(true).appendTo('#tbReporteMezcla tfoot')
      $('#tbReporteMezcla tfoot tr:eq(1) th').each(function (i) {
        const title = $(this).text() // es el nombre de la columna

        // Verifica si la columna actual es la última
        if (i < $('#tbReporteMezcla tfoot tr:eq(0) th').length) {
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

export { iniciarReporteMezcla, verReporteMezcla }
// Función para obtener los precios de la columna 'precio_cantidad' de los datos filtrados
