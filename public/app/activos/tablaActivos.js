/* eslint-disable no-undef */
import { obtenerDocumento, MensajeEliminacion, mostrarMensaje } from '../funciones.js'
// Funciones de fetch con mejor manejo de errores
async function fechTbSolicitadas () {
  try {
    const response = await fetch('/api/activos_fijos')
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
const iniciarActivos = async () => {
  try {
    const data = await obtenerTickets()
    const table = $('#tbActivos').DataTable()
    console.log('Datos obtenidos:', data)
    table.clear().rows.add(data[0]).draw()
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
const verActivos = async () => {
  let rol = ''
  if (!document.getElementById('rol')) {
    console.error('Elemento tbActivos no encontrado')
  } else {
    rol = document.getElementById('rol').value.trim()
  }
  if ($.fn.DataTable.isDataTable('#tbActivos')) {
    $('#tbActivos').DataTable().destroy()
  }
  $('#tbActivos').DataTable({
    paging: true,
    order: [[0, 'desc']],
    responsive: true,
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
    dom: '<"d-flex justify-content-between m-4"fBl>t<"d-flex justify-content-between "ip>',
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
      { targets: 0, data: 'id' },
      {
        targets: 1,
        data: 'no_economico',
        render: function (data, type, row) {
          // validar que no sea null/undefined o cadena vacía
          if (data.trim() === '') {
            return 'Sin Asignar'
          }
          // Capitalizar la primera letra de cada palabra
          return data.trim().toUpperCase()
        }
      },
      {
        targets: 2,
        data: 'equipo',
        render: function (data, type, row) {
          // validar que no sea null/undefined o cadena vacÃ­a
          if (data.trim() === '') {
            return 'No disponible'
          }
          // Capitalizar la primera letra de cada palabra
          return data.trim().toUpperCase()
        }
      },
      {
        targets: 3,
        data: 'empresa_pertenece',
        render: function (data, type, row) {
          // Capitalizar primera letra
          if (typeof data !== 'string') {
            console.warn('El valor de empresa_pertenece no es una cadena:', data)
            data = String(data || '') // Convertir a string o cadena vacÃ­a si es null/undefined
          }
          //   validar que no sea null/undefined o cadena vacÃ­a
          if (data.trim() === '') {
            return 'No disponible'
          }
          // Capitalizar la primera letra de cada palabra
          return data.trim().toUpperCase()
        }
      },
      {
        targets: 4,
        data: 'centro_coste',
        render: function (data, type, row) {
          // Validar que data sea string y no sea null/undefined
          if (typeof data !== 'string') {
            console.warn('El valor de centro_coste no es una cadena:', data)
            data = String(data || '') // Convertir a string o cadena vacía si es null/undefined
          }
          if (data.trim() === '') {
            return 'No disponible'
          }
          // Capitalizar la primera letra de cada palabra
          return data
        }
      },
      {
        targets: 5,
        data: 'marca',
        render: function (data, type, row) {
          // validar que no sea null/undefined o cadena vacÃ­a
          if (data.trim() === '') {
            return 'No disponible'
          }
          // Capitalizar la primera letra de cada palabra
          return data.trim().toUpperCase()
        }
      },
      {
        targets: 6,
        data: 'modelo',
        render: function (data, type, row) {
          // validar que no sea null/undefined o cadena vacía
          if (data.trim() === '') {
            return 'No disponible'
          }
          // Capitalizar la primera letra de cada palabra
          return data.trim().toUpperCase()
        }
      },
      {
        targets: 7,
        data: 'ns',
        render: function (data, type, row) {
          // validar que no sea null/undefined o cadena vacía
          if (data.trim() === '') {
            return 'No disponible'
          }
          // Capitalizar la primera letra de cada palabra
          return data.trim().toUpperCase()
        }
      },
      {
        targets: 8,
        data: 'tag',
        render: function (data, type, row) {
          // validar que no sea null/undefined o cadena vacía
          if (data.trim() === '') {
            return 'No disponible'
          }
          // Capitalizar la primera letra de cada palabra
          return data.trim().toUpperCase()
        }
      },
      {
        targets: 9,
        data: 'status',
        render: function (data, type, row) {
          // Capitalizar primera letra
          if (typeof data !== 'string') {
            console.warn('El valor de status no es una cadena:', data)
            data = String(data || '') // Convertir a string o cadena vacía si es null/undefined
          }

          const status = data.trim().toUpperCase()

          // Agregar tooltip con información según estado
          let tooltip = ''
          switch (data.trim().toLowerCase()) {
            case 'inactivo':
              tooltip = `Equipo inactivo desde: ${row.fecha_registro || 'No disponible'}`
              break
            case 'reparacion':
              tooltip = `En reparación desde: ${row.fecha_registro || 'No disponible'}\nMotivo: ${row.motivo || 'No especificado'}`
              break
            case 'mantenimiento':
              tooltip = `En mantenimiento desde: ${row.fecha_registro || 'No disponible'}`
              break
            case 'disponible':
              tooltip = 'Equipo disponible para asignación'
              break
            case 'asignado':
              tooltip = `ID de Empleado: ${row.empleado_id || 'No especificado'}\nAsignado a: ${row.nombre || 'No especificado'}\nDepartamento: ${row.departamento || 'No especificado'}`
              break
          }

          return `<span data-toggle="tooltip" title="${tooltip}">${status}</span>`
        },
        createdCell: function (cell, cellData, rowData, rowIndex, colIndex) {
          // Asignar color y evento click según estado
          let color = ''
          let clickHandler = ''

          switch (cellData) {
            case 'inactivo':
              color = 'red'
              clickHandler = `mostrarDetallesInactivo(${JSON.stringify(rowData)})`
              break
            case 'reparacion':
              color = 'orange'
              clickHandler = `mostrarDetallesReparacion(${JSON.stringify(rowData)})`
              break
            case 'mantenimiento':
              color = 'blue'
              clickHandler = `mostrarDetallesMantenimiento(${JSON.stringify(rowData)})`
              break
            case 'disponible':
              color = 'green'
              break
            case 'asignado':
              color = '#32CD32'
              clickHandler = `mostrarDetallesAsignacion(${JSON.stringify(rowData)})`
              break
          }

          $(cell).css('color', color)
          if (clickHandler) {
            $(cell).css('cursor', 'pointer')
            $(cell).attr('onclick', clickHandler)
          }

          // Inicializar tooltips
          $(cell).find('[data-toggle="tooltip"]').tooltip()
        }
      },
      {
        targets: 10,
        render: function (data, type, row) {
          // Función helper para verificar si un campo tiene datos válidos
          const tieneDatos = (campo) => campo && campo !== '' && campo !== null

          // Verificar cada campo
          const tieneFactura = tieneDatos(row.url_factura)
          const tieneFoto = tieneDatos(row.foto)

          // Construir los botones según los datos disponibles
          let botones = ''

          if (tieneFactura) {
            botones += `
        <button class="btn btn-inverse-primary mdi mdi-file-document abrirEnlace" 
          data-url="${row.url_factura}" 
          title="Ver factura">
        </button>
      `
          }

          if (tieneFoto) {
            botones += `
        <button class="btn btn-inverse-success mdi mdi-file-image abrirEnlace" 
          data-url="${row.foto}" 
          title="Ver imagen">
        </button>
      `
          }
          // Retornar los botones o mensaje según el caso
          return botones || '<span class="text-muted">Sin documentos</span>'
        }
      },
      {
        targets: -1,
        data: 'id',
        render: function (data, type, row) {
          if (rol === 'master' || rol === 'Activos Fijos') {
            return `
                  <button class="btn btn-inverse-warning mdi mdi-file-document editarActivo" 
                    data-row='${JSON.stringify(row).replace(/'/g, '&apos;')}'>
                    Editar
                  </button>
                  <button class="btn btn-inverse-info mdi mdi-file-document agregarFoto" data-id='${data}'>foto</button>
                  <button class="btn btn-inverse-secondary mdi mdi-file-document agregarFactura" data-id='${data}' >Factura</button>
                  <button class="btn btn-inverse-danger mdi mdi-delete eliminarEquipo" data-id="${data}" data-estado="${row.status}">Eliminar</button>
                    `
          }
          return `
                  <button class="btn btn-inverse-warning mdi mdi-file-document editarActivo" 
                    data-row='${JSON.stringify(row).replace(/'/g, '&apos;')}'>
                    Editar
                  </button>
                  <button class="btn btn-inverse-info mdi mdi-file-document agregarFoto" data-id='${data}'>foto</button>
                  <button class="btn btn-inverse-secondary mdi mdi-file-document agregarFactura" data-id='${data}' >Factura</button>
                    `
        }
      }
    ]
  })
  editarActivo()
  agregarFoto()
  agregarFactura()
  abrirEnlace()
  eliminarEquipo()
}
// funciones para los botones de la tabla
const editarActivo = () => {
  // Delegación de eventos sobre el documento (o sobre el contenedor de la tabla)
  $(document).on('click', '.editarActivo', function (e) {
    e.preventDefault()
    // El atributo data-row llega como string, debes parsearlo si es JSON
    let data
    try {
      data = JSON.parse($(this).attr('data-row').replace(/&apos;/g, "'"))
    } catch (err) {
      data = $(this).attr('data-row')
    }
    const modal = $('#editarEquipo')
    modal.modal('show')
    document.getElementById('equipoE').value = data.equipo
    document.getElementById('marcaE').value = data.marca
    document.getElementById('modeloE').value = data.modelo
    document.getElementById('snE').value = data.ns
    document.getElementById('tagE').value = data.tag
    document.getElementById('idEquipo').value = data.id
    document.getElementById('noEconomicoE').value = data.no_economico
    document.getElementById('campoEstado').style.display = 'none'
    document.getElementById('motivoB').disabled = true
  })
}
const agregarFoto = () => {
  $(document).on('click', '.agregarFoto', function (e) {
    e.preventDefault()
    const id = $(this).attr('data-id')
    document.getElementById('id').value = id
    const modal = $('#miModalEquipo')
    modal.modal('show')
  })
}
const agregarFactura = (id) => {
  $(document).on('click', '.agregarFactura', function (e) {
    e.preventDefault()
    const id = $(this).attr('data-id')
    document.getElementById('idF').value = id
    const modal = $('#miModalFactura')
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
const eliminarEquipo = () => {
  $(document).on('click', '.eliminarEquipo', async function (e) {
    e.preventDefault()
    const id = $(this).attr('data-id')
    const estado = $(this).attr('data-estado')
    const url = `/api/equipos/${id}`
    const method = 'DELETE'
    console.log('Estado del equipo:', estado)
    if (estado !== 'disponible') {
      mostrarMensaje('No se puede eliminar un equipo que no está disponible.', 'error', true)
      return
    }

    const respuesta = await MensajeEliminacion(url, method, { estado })
    if (respuesta === true) {
      iniciarActivos()
      await verActivos()
    }
  })
}
// Funciones para mostrar detalles de estados
const mostrarDetallesInactivo = (data) => {
  // eslint-disable-next-line no-undef
  Swal.fire({
    title: 'Detalles del Equipo Inactivo',
    html: `
      <div class="text-left">
        <p><strong>Equipo:</strong> ${data.equipo}</p>
        <p><strong>Fecha inactividad:</strong> ${data.fecha_registro || 'No disponible'}</p>
        <p><strong>Motivo:</strong> ${data.motivo || 'No especificado'}</p>
      </div>
    `,
    icon: 'info'
  })
}

const mostrarDetallesReparacion = (data) => {
  // eslint-disable-next-line no-undef
  Swal.fire({
    title: 'Detalles de Reparación',
    html: `
      <div class="text-left">
        <p><strong>Equipo:</strong> ${data.equipo}</p>
        <p><strong>Fecha entrada:</strong> ${data.fecha_registro || 'No disponible'}</p>
        <p><strong>Motivo:</strong> ${data.motivo || 'No especificado'}</p>
        <p><strong>Diagnóstico:</strong> ${'Pendiente'}</p>
      </div>
    `,
    icon: 'info'
  })
}

const mostrarDetallesMantenimiento = (data) => {
  // eslint-disable-next-line no-undef
  Swal.fire({
    title: 'Detalles de Mantenimiento',
    html: `
      <div class="text-left">
        <p><strong>Equipo:</strong> ${data.equipo}</p>
        <p><strong>Fecha inicio:</strong> ${data.fecha_registro || 'No disponible'}</p>
        <p><strong>Tipo:</strong> ${data.tipo_mantenimiento || 'No especificado'}</p>
      </div>
    `,
    icon: 'info'
  })
}

const mostrarDetallesAsignacion = (data) => {
  // eslint-disable-next-line no-undef
  Swal.fire({
    title: 'Detalles de Asignación',
    html: `
      <div class="text-left">
        <p><strong>Equipo:</strong> ${data.equipo}</p>
        <p><strong>Asignado a:</strong> ${data.nombre || 'No especificado'}</p>
        <p><strong>Departamento:</strong> ${data.departamento || 'No especificado'}</p>
        <p><strong>Fecha asignación:</strong> ${data.fecha_asignacion || 'No disponible'}</p>
      </div>
    `,
    icon: 'info'
  })
}
export {
  iniciarActivos,
  verActivos,
  mostrarDetallesInactivo,
  mostrarDetallesReparacion,
  mostrarDetallesMantenimiento,
  mostrarDetallesAsignacion
}
