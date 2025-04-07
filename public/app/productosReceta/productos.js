/* eslint-disable no-undef */
async function fetchApi (url, method, data) {
  try {
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    return response
  } catch (error) {
    console.error('Error:', error.message)
  }
}
async function fechTbrecetas (idSolicitud) {
  try {
    const response = await fetch(`/api/productoSolicitud/${idSolicitud}`)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    console.log(data)
    return data
  } catch (error) {
    console.error('Error fetching recetas:', error)
    throw error
  }
}
// Iniciar productos de solicitud
const iniciarProductosReceta = async (idSolicitud) => {
  try {
    const data = await obtenerProductosReceta(idSolicitud)
    const table = $('#tbReceta').DataTable()
    table.clear().rows.add(data).draw()
  } catch (error) {
    console.error('Error al iniciar productos de solicitud:', error)
    // Opcional: Mostrar mensaje de error al usuario
  }
}

// Obtener productos de solicitud
const obtenerProductosReceta = async (idSolicitud) => {
  try {
    return await fechTbrecetas(idSolicitud)
  } catch (error) {
    console.error('Error al obtener productos de solicitud:', error)
    throw error
  }
}

// Configurar y mostrar la tabla de productos
const verProductosReceta = async (configuracion = {}) => {
  // Configuración por defecto
  const configuracionDefecto = {
    eliminarUltimaColumna: false, // Controla si se elimina la última columna
    depuracion: false, // Modo de depuración
    columnaAEliminar: -1 // Índice de la columna a eliminar (-1 es la última)
  }

  // Combinar configuraciones
  const config = { ...configuracionDefecto, ...configuracion }

  const tableReceta = $('#tbReceta')

  // Función de registro de depuración
  const log = (mensaje) => {
    if (config.depuracion) {
      console.log(`[Productos Solicitud] ${mensaje}`)
    }
  }

  // Preparar definición de columnas
  const columnDefs = [
    { targets: 0, data: 'id_receta' },
    { targets: 1, data: 'id_sap' },
    { targets: 2, data: 'nombre_producto' },
    { targets: 3, data: 'unidad_medida' },
    { targets: 4, data: 'cantidad' },
    {
      targets: 5,
      data: 'id_receta',
      render: function (data, type, row) {
        return `
          <div>
            <label>
              <input type="radio" name="producto_${data}" value="1">Hay existencia
            </label>
            <label>
              <input type="radio" name="producto_${data}" value="0">No hay existencia
            </label>
            <button type="button" data-id="${data}" id="btnDelete" class="btn btn-danger")"><i class="mdi mdi-delete"></i></button>
          </div>
        `
      }
    }
  ]

  // Modificar definición de columnas si se va a eliminar
  if (config.eliminarUltimaColumna) {
    log(`Preparando para eliminar columna en índice: ${config.columnaAEliminar}`)

    // Añadir configuración para eliminar columna
    columnDefs.push({
      targets: config.columnaAEliminar,
      visible: false,
      searchable: false,
      render: function () {
        return null
      }
    })
  }

  // Destruir tabla existente de manera segura
  if ($.fn.dataTable.isDataTable('#tbReceta')) {
    tableReceta.DataTable().destroy()
  }

  const tabla = tableReceta.DataTable({
    paging: false,
    order: [[0, 'desc']],
    dom: '<"d-flex justify-content-between">t<"d-xl-flex justify-content-between align-items-center"ip><"clear">',
    buttons: [
      {
        extend: 'excelHtml5',
        text: '<i class="mdi mdi-file-excel"></i>',
        titleAttr: 'Exportar a Excel',
        className: 'btn btn-inverse-dark btn-icon'
      },
      {
        extend: 'pdfHtml5',
        text: '<i class="mdi mdi-file-pdf"></i>',
        titleAttr: 'Exportar a PDF',
        className: 'btn btn-primary'
      },
      {
        extend: 'print',
        text: '<i class="mdi mdi-cloud-print-outline"></i>',
        titleAttr: 'Imprimir',
        className: 'btn btn-primary'
      }
    ],
    responsive: true,
    pageLength: -1,
    searching: false,
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
    columnDefs,
    initComplete: function (settings, json) {
      log('Tabla inicializada')

      // Control adicional de columna
      if (config.eliminarUltimaColumna) {
        const api = this.api()

        // Ocultar columna
        api.column(config.columnaAEliminar).visible(false)

        log(`Columna ${config.columnaAEliminar} eliminada/ocultada`)
      }
    },
    drawCallback: function (settings) {
      log('Tabla dibujada')

      // Control adicional en el dibujo
      if (config.eliminarUltimaColumna) {
        const api = this.api()
        api.column(config.columnaAEliminar).visible(false)
      }
    }
  })

  // Método para controlar dinámicamente la eliminación de columna
  tabla.controlarColumna = function (opciones = {}) {
    const configActual = { ...config, ...opciones }

    log('Controlando columna manualmente')

    if (configActual.eliminarUltimaColumna) {
      // Ocultar columna
      this.column(configActual.columnaAEliminar).visible(false)

      // Eliminar físicamente (opcional)
      $(`#tbReceta thead tr th:eq(${configActual.columnaAEliminar})`).remove()
      $('#tbReceta tbody tr').each(function () {
        $(this).find(`td:eq(${configActual.columnaAEliminar})`).remove()
      })
    } else {
      // Restaurar visibilidad
      this.column(configActual.columnaAEliminar).visible(true)
    }

    // Redibujar tabla
    this.draw()
    // Ajustar columnas
    this.columns.adjust()
    // Ajuste de ancho
    this.style.width = '100%'
    // Responsive
    if (tabla.responsive) {
      tabla.responsive.recalc()
    }

    return this
  }

  // Método para verificar estado de la columna
  tabla.estadoColumna = function (indice = -1) {
    return {
      visible: this.column(indice).visible(),
      existe: this.column(indice).nodes().length > 0
    }
  }
  eliminar()
  return tabla
}

export { iniciarProductosReceta, verProductosReceta }
// Eliminar Asistencia
const eliminar = async () => {
  $(document).on('click', '#btnDelete', async function () {
    const id = $(this).data('id')
    console.log(id)
    Swal.fire({
      title: 'Estas seguro que deseas eliminar este prodcuto?',
      showDenyButton: true,
      confirmButtonText: 'Eliminar',
      denyButtonText: 'Cancelar'
    }).then(async (result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        $('#staticBackdrop').modal('hide')
        const response = await fetchApi(`/api/eliminarProducto/${id}`, 'delete')
        const res = await response.json()
        if (response.status === 200) {
          $('#staticBackdrop').modal('show')
          Swal.fire(res.message, '', 'success')
          const idSolicitud = document.getElementById('idSolicitud').value
          iniciarProductosReceta(idSolicitud)
          verProductosReceta({
            eliminarUltimaColumna: false,
            depuracion: true
          })
        } else {
          Swal.fire(res.error, '', 'error')
        }
      } else if (result.isDenied) {
        Swal.fire('Eliminacion Cancelada', '', 'info')
      }
    })
  })
}

// Ejemplos de uso:

// Ejemplo 1: Inicializar tabla sin eliminar columna
// const tabla1 = await verProductosSolicitud({
//   eliminarUltimaColumna: false,
//   depuracion: true
// })

// Ejemplo 2: Inicializar tabla eliminando última columna
// const tabla2 = await verProductosSolicitud({
//   eliminarUltimaColumna: true,
//   columnaAEliminar: -1, // Última columna
//   depuracion: true
// })

// Ejemplo 3: Control manual de columna después de inicializar
// tabla2.controlarColumna({
//   eliminarUltimaColumna: false // Mostrar columna
// })

// Ejemplo 4: Verificar estado de columna
// const estadoColumna = tabla2.estadoColumna()
// console.log('Estado de la última columna:', estadoColumna)

// Mostrar/ocultar columna dinámicamente
// tabla.controlarColumna({
//   eliminarUltimaColumna: false  // Mostrar columna
// })

// // Volver a ocultar
// tabla.controlarColumna({
//   eliminarUltimaColumna: true
// })

// // Eliminar columna específica
// tabla.controlarColumna({
//   eliminarUltimaColumna: true,
//   columnaAEliminar: 2  // Eliminar tercera columna
// })
