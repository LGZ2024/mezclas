/* eslint-disable no-undef */
async function fetchApi(url, method, data) {
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
async function fechTbrecetas(idSolicitud) {
  try {
    const response = await fetch(`/api/productos/solicitud/${idSolicitud}`)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching recetas:', error)
    throw error
  }
}
// Iniciar productos de solicitud
const iniciarProductosReceta = async (idSolicitud) => {
  // Validar el parámetro de entrada
  if (!idSolicitud) {
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'ID de solicitud no válido'
    })
    return
  }

  // Mostrar estado de carga
  Swal.fire({
    title: 'Cargando productos...',
    text: 'Por favor espere',
    allowOutsideClick: false,
    didOpen: () => Swal.showLoading()
  })

  try {
    const data = await obtenerProductosReceta(idSolicitud)

    // Validar que se obtuvieron datos
    if (!data || data.length === 0) {
      await Swal.fire({
        icon: 'info',
        title: 'Sin datos',
        text: 'No se encontraron productos para esta solicitud'
      })
      return
    }

    // Actualizar tabla
    const table = $('#tbReceta').DataTable()
    table.clear().rows.add(data).draw()

    // Cerrar loading
    Swal.close()
  } catch (error) {
    console.error('Error al iniciar productos de solicitud:', error)
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Error al cargar los productos. Por favor intente nuevamente.'
    })
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
        const rol = document.getElementById('rol').value

        if (rol === 'mezclador' || rol === 'administrativo' || rol === 'master') {
          return `
          <div class="btn-group">
           <button class="btn btn-sm btn-danger btnDelete" 
        data-id="${data}" 
        title="Eliminar producto">
  <i class="fas fa-trash-alt"></i>
  <span class="d-none d-md-inline ms-1">Eliminar</span>
</button>
            <div class="btn-group ms-2">
              <input type="radio" class="btn-check" name="producto_${data}" 
                     id="existe_${data}" value="1">
              <label class="btn btn-sm btn-outline-success" for="existe_${data}">
                Disponible
              </label>
              <input type="radio" class="btn-check" name="producto_${data}" 
                     id="noexiste_${data}" value="0">
              <label class="btn btn-sm btn-outline-danger" for="noexiste_${data}">
                No disponible
              </label>
            </div>
          </div>
        `
        } else if (rol === 'solicita' || rol === 'solicita2') {
          return `
          <div class="btn-group">
           <button class="btn btn-sm btn-danger btnDelete" 
            data-id="${data}" 
            title="Eliminar producto">
              <i class="fas fa-trash-alt"></i>
              <span class="d-none d-md-inline ms-1">
               Eliminar
              </span>
           </button>
          </div>
        `
        }
        return 'Sin permisos' // Mensaje por defecto si no se cumple ninguna condición
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
    destroy: true,
    ordering: true,
    info: true,
    autoWidth: false,
    order: [[0, 'desc']],
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
  $(document).on('click', '.btnDelete', async function () {
    try {
      const id = $(this).data('id')
      if (!id) throw new Error('ID del producto no encontrado')

      // Confirmación con SweetAlert2
      const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: '¿Deseas eliminar este producto?',
        icon: 'warning',
        showDenyButton: true,
        confirmButtonText: 'Eliminar',
        denyButtonText: 'Cancelar',
        confirmButtonColor: '#d33',
        denyButtonColor: '#3085d6'
      })

      if (result.isConfirmed) {
        // Obtener ID de solicitud
        const idSolicitudElement = document.getElementById('idSolicitud') || document.getElementById('idSolicit') || document.getElementById('id')

        if (!idSolicitudElement) {
          throw new Error('No se encontró el ID de la solicitud')
        }

        const idSolicitud = idSolicitudElement.value

        // Loading state
        Swal.fire({
          title: 'Eliminando...',
          text: 'Por favor espere',
          allowOutsideClick: false,
          allowEscapeKey: false,
          showConfirmButton: false,
          didOpen: () => Swal.showLoading()
        })

        // Eliminar producto
        const response = await fetchApi(`/api/productos/eliminar/${id}`, 'delete')
        if (!response.ok) throw new Error('Error al eliminar el producto')

        // Obtener datos actualizados
        const nuevaData = await obtenerProductosReceta(idSolicitud)

        // Actualizar tabla existente sin reinicializar
        const table = $('#tbReceta').DataTable()
        table
          .clear()
          .rows.add(nuevaData)
          .draw(false) // false para mantener la página actual

        // Mensaje de éxito
        await Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'Producto eliminado correctamente',
          timer: 1500,
          showConfirmButton: false
        })
      } else if (result.isDenied) {
        Swal.fire({
          title: 'Eliminación Cancelada',
          icon: 'info',
          timer: 1500,
          showConfirmButton: false
        })
      }
    } catch (error) {
      console.error('Error en eliminación:', error)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Error al eliminar el producto',
        confirmButtonColor: '#d33'
      })
    }
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
