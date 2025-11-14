/* eslint-disable no-undef */
// Funciones de fetch con mejor manejo de errores
async function fechTbSolicitadas () {
  try {
    const response = await fetch('/api/empleados/tabla')
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

// Iniciar solicitudes con mejor manejo de errores
const iniciarEmpleados = async () => {
  try {
    const data = await obtenerTickets()

    const table = $('#tbEmpleados').DataTable()
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
    return await fechTbSolicitadas()
  } catch (error) {
    console.error('Error al obtener solicitudes:', error)
    throw error
  }
}

// Configuración de tabla de solicitudes
const verEmpleados = async () => {
  if ($.fn.DataTable.isDataTable('#tbEmpleados')) {
    $('#tbEmpleados').DataTable().destroy()
  }
  $('#tbEmpleados').DataTable({
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
    dom: '<"d-flex justify-content-between m-4"fBl>t<"d-xl-flex justify-content-between align-items-center"ip><"clear">',
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
        data: 'nombre',
        render: function (data, type, row) {
          // Validar que data no sea null/undefined
          if (!data) return 'No disponible'
          return data.toString().trim().toUpperCase()
        }
      },
      {
        targets: 2,
        data: 'apellido_paterno',
        render: function (data, type, row) {
          if (!data) return 'No disponible'
          return data.toString().trim().toUpperCase()
        }
      },
      {
        targets: 3,
        data: 'apellido_materno',
        render: function (data, type, row) {
          if (!data) return 'No disponible'
          return data.toString().trim().toUpperCase()
        }
      },
      {
        targets: 4,
        data: 'departamento',
        render: function (data, type, row) {
          if (!data) return 'No disponible'
          return data.toString().trim().toUpperCase()
        }
      },
      {
        targets: 5,
        data: 'estado',
        render: function (data, type, row) {
          if (!data) return 'No disponible'
          return data.toString().trim().toUpperCase()
        },
        createdCell: function (cell, cellData, rowData, rowIndex, colIndex) {
          const estado = cellData?.toLowerCase()
          if (estado === 'disponible') {
            $(cell).css('color', 'green')
          } else if (estado === 'asignado') {
            $(cell).css('color', 'blue')
          } else if (estado === 'inactivo') {
            $(cell).css('color', 'red')
          }
        }
      },
      {
        targets: -1,
        data: 'id',
        render: function (data, type, row) {
          return `
                  <button class="btn btn-inverse-warning mdi mdi-file-document editarEmpleado" 
                    data-row='${JSON.stringify(row).replace(/'/g, '&apos;')}'>
                    Editar
                  </button>
                    <button class="btn btn-inverse-secondary mdi mdi-file-document actualizarEmpleado" 
                    data-id='${row.empleado_id}'>
                    Editar Estado
                  </button>
                    `
        }
      }
    ]
  })
  editarEmpleado()
  actualizarEmpleado()
}
// funciones para los botones de la tabla
const editarEmpleado = () => {
  // Delegación de eventos sobre el documento (o sobre el contenedor de la tabla)
  $(document).on('click', '.editarEmpleado', function (e) {
    e.preventDefault()
    // El atributo data-row llega como string, debes parsearlo si es JSON
    let data
    try {
      data = JSON.parse($(this).attr('data-row').replace(/&apos;/g, "'"))
    } catch (err) {
      data = $(this).attr('data-row')
    }
    const modal = $('#miModalEditar')
    modal.modal('show')
    document.getElementById('empleado_idE').value = data.empleado_id
    document.getElementById('nombreE').value = data.nombre
    document.getElementById('apellido_paternoE').value = data.apellido_paterno
    document.getElementById('apellido_maternoE').value = data.apellido_materno
    document.getElementById('departamentoE').value = data.departamento
  })
}

const actualizarEmpleado = () => {
  $(document).on('click', '.actualizarEmpleado', function (e) {
    e.preventDefault()
    const id = $(this).attr('data-id')
    const modal = $('#miModalActualizar')
    modal.modal('show')
    document.getElementById('empleado_idA').value = id
  })
}

export {
  iniciarEmpleados,
  verEmpleados
}
