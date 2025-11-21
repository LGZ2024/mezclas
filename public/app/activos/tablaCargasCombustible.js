/* eslint-disable no-undef */
import { fetchApi } from '../funciones.js'

/* funciones para inicializar tabla  de mezclas solicitadas */
/* inicializar tabla solicitada */
const iniciarCargaCombustible = async () => {
  try {
    const data = await obtenerRegistro()
    console.log('Datos obtenidos para la tabla de entradas de inventario:', data)
    const table = $('#tbCargas').DataTable()
    table.clear().rows.add(data)
    table.columns.adjust().draw()
  } catch (error) {
    console.error('Error al inicializar registros:', error)
  }
}
/* obtener mezclas */
const obtenerRegistro = async () => {
  try {
    const response = await fetchApi('/api/cargas', 'GET') // cambiar a GET
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}
/* mostrar tala de mezclas Solicitada */
const verCargasCombustible = async () => {
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
    if (!$.fn.dataTable.isDataTable('#tbCargas')) {
      // Custom filtering function which will search data in column four between two values
      DataTable.ext.search.push(function (settings, data, dataIndex) {
        try {
          // Obtener valores de fecha de los inputs
          const minVal = minDate.val()
          const maxVal = maxDate.val()

          // Obtener la fecha de la columna 9 (fechaSolicitud)
          const dateValue = data[5]

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

      const tabla = $('#tbCargas').DataTable({
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
            data: 'fecha'
          },
          {
            targets: 2,
            data: 'no_economico'
          },
          {
            targets: 3,
            data: 'cantidad'
          },
          {
            targets: 4,
            data: 'precio'
          },
          {
            targets: 5,
            data: 'combustible'
          },
          {
            targets: 6,
            data: 'responsable'
          },
          {
            targets: 7,
            data: 'km'
          },
          {
            targets: 8,
            data: 'km_recorridos'
          },
          {
            targets: 9,
            data: 'rendimineto'
          },
          {
            targets: 10,
            data: 'comentario'
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

export { iniciarCargaCombustible, verCargasCombustible }
// Función para obtener los precios de la columna 'precio_cantidad' de los datos filtrados
