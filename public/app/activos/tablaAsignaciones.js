/* eslint-disable no-undef */
import { obtenerDocumento } from '../funciones.js'
// Funciones de fetch con mejor manejo de errores
async function fechTbSolicitadas () {
  try {
    const response = await fetch('/api/asignacion_activos')
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const { data, success } = await response.json()
    if (!success || !data) {
      throw new Error('Formato de datos incorrecto')
    }

    return data
  } catch (error) {
    console.error('Error fetching asignaciones:', error)
    throw error
  }
}

// Iniciar solicitudes con mejor manejo de errores
const iniciarAsignaciones = async () => {
  try {
    const data = await obtenerTickets()
    console.log('Datos obtenidos:', data)

    if (!Array.isArray(data)) {
      throw new Error('Los datos recibidos no son un array')
    }

    const table = $('#tbAsignaciones').DataTable()
    // Usar directamente el primer elemento del array que contiene los datos
    table.clear().rows.add(data).draw()
  } catch (error) {
    console.error('Error al iniciar asignaciones:', error)
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
const verAsignaciones = async () => {
  if ($.fn.DataTable.isDataTable('#tbAsignaciones')) {
    $('#tbAsignaciones').DataTable().destroy()
  }
  $('#tbAsignaciones').DataTable({
    paging: true,
    order: [[0, 'desc']],
    responsive: true,
    dom: '<"d-flex justify-content-between m-4"fl>t<"d-xl-flex justify-content-between align-items-center"ip><"clear">',
    pageLength: 10,
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
      { targets: 0, data: 'empleado_id' },
      {
        targets: 1,
        data: 'marca',
        render: function (data, type, row) {
          // Validar si data es null o undefined
          if (!data) return 'No disponible'

          return data.trim().toUpperCase()
        }
      },
      {
        targets: 2,
        data: 'modelo',
        render: function (data, type, row) {
          // Validar si data es null o undefined
          if (!data) return 'No disponible'

          return data.trim().toUpperCase()
        }
      },
      { targets: 3, data: 'ns' },
      { targets: 4, data: 'tag' },
      {
        targets: 5,
        data: 'equipo',
        render: function (data, type, row) {
          // Validar si data es null o undefined
          if (!data) return 'No disponible'

          return data.trim().toUpperCase()
        }
      },
      {
        targets: 6,
        data: 'status',
        render: function (data, type, row) {
          // Validar si data es null o undefined
          if (!data) return 'No disponible'

          return data.trim().toUpperCase()
        },
        createdCell: function (cell, cellData, rowData, rowIndex, colIndex) {
          // Asignar color solo si cellData existe
          if (!cellData) return

          const estado = cellData.toLowerCase()

          const colores = {
            inactivo: 'red',
            reparacion: 'orange',
            mantenimiento: 'blue',
            asignado: 'green'
          }

          if (colores[estado]) {
            $(cell).css('color', colores[estado])
          }
        }
      },
      {
        targets: 7,
        data: 'nombre',
        render: function (data, type, row) {
          // Validar si data es null o undefined
          if (!data) return 'No disponible'

          return data.trim().toUpperCase()
        }
      },
      {
        targets: 8,
        data: 'apellido_paterno',
        render: function (data, type, row) {
          // Validar si data es null o undefined
          if (!data) return 'No disponible'

          return data.trim().toUpperCase()
        }
      },
      {
        targets: 9,
        data: 'apellido_materno',
        render: function (data, type, row) {
          // Validar si data es null o undefined
          if (!data) return 'No disponible'

          return data.trim().toUpperCase()
        }
      },
      {
        targets: 10,
        data: 'responsiva',
        render: function (data, type, row) {
          // Utiliza la ruta de enlace como valor del botón y muestra el enlace
          return `<button class="btn btn-primary mdi mdi-eye abrirEnlace" type="button"  data-url="${data}"></button>`
        }
      },
      {
        targets: 11,
        data: 'ubicacion',
        render: function (data, type, row) {
          // Validar si data es null o undefined
          if (!data) return 'No disponible'

          return data.trim().toUpperCase()
        }
      },
      {
        targets: -1,
        data: 'asignacion_id',
        render: function (data, type, row) {
          return `<button class="btn btn-inverse-warning mdi mdi-file-document editarAsignacion" data-id="${data}" data-equipo="${row.equipo_id}" data-usuario="${row.usuario_id}" >Editar</button>`
        }
      }
    ]
  })
  abrirModaleditarAsignacion()
  abrirEnlace()
}
const abrirModaleditarAsignacion = () => {
  $(document).on('click', '.editarAsignacion', function (e) {
    e.preventDefault()

    const id = $(this).data('id')

    // agrgamos id_asigancion y numero de serie
    document.getElementById('asignacion_id').value = id

    // Abrimos el modal
    const modal = $('#editarAsignacion')
    modal.modal('show')
  })
}

const abrirEnlace = async () => {
  $(document).on('click', '.abrirEnlace', async function (e) {
    e.preventDefault()
    const url = $(this).attr('data-url')
    const docUrl = `/api/${url.replace(/^\//, '')}`
    await obtenerDocumento(docUrl)
  })
}
// Exportar funciones
export { iniciarAsignaciones, verAsignaciones }
