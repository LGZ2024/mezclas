/* eslint-disable no-undef */
import { mostrarMensaje } from '../mensajes.js'
import { iniciarProductosReceta, verProductosReceta } from '../productosReceta/productos.js'

// Función para obtener mezclas solicitadas
async function fetchApi({ url, type }) {
  try {
    const response = await fetch(url, {
      method: type,
      headers: {
        'Content-Type': 'application/json'
      }
    })
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    return data
  } catch (error) {
    mostrarMensaje(error.message, 'error')
    console.error('Error fetching solicitudes:', error)
    throw error
  }
}

// Iniciar proceso de mezclas
const iniciarCanceladas = async () => {
  try {
    const data = await obtenerProceso()
    console.log(data)
    const table = $('#tbCanceladas').DataTable()
    table.clear().rows.add(data).draw()
  } catch (error) {
    console.error('Error al iniciar proceso:', error)
    // Opcional: mostrar mensaje de error al usuario
    // mostrarMensajeError('No se pudieron cargar las mezclas')
  }
}

// Obtener mezclas en proceso
const obtenerProceso = async () => {
  try {
    return await fetchApi({ url: '/api/mezclas/canceladas/', type: 'GET' })
  } catch (error) {
    console.error('Error al obtener proceso:', error)
    throw error
  }
}

// Configuración de tabla de solicitudes
const verCanceladas = () => {
  $('#tbCanceladas').DataTable({
    paging: false,
    order: [[0, 'desc']],
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
    columnDefs: [
      { targets: 0, data: 'id' },
      {
        targets: 1,
        data: 'Solicita',
        render: function (data, type, row) {
          return `
            <button 
              type="button" 
              class="btn btn-primary mostrar-solicitud"
              data-row='${JSON.stringify(row)}'
            >
              Ver Solicitud
            </button>`
        }
      },
      { targets: 2, data: 'FolioReceta' },
      { targets: 3, data: 'motivoCancelacion' },
      { targets: 4, data: 'fechaSolicitud' },
      { targets: 5, data: 'empresa' },
      { targets: 6, data: 'ranchoDestino' },
      { targets: 7, data: 'centroCoste' },
      { targets: 8, data: 'temporada' },
      {
        targets: 9,
        data: 'id',
        render: function (data, type, row) {
          const rol = document.getElementById('rol').value
          if (rol === 'solicita' || rol === 'admin' || rol === 'master') {
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
          return 'Sin Autorización'
        }
      }
    ]
  })

  configurarEditarSolicitud()
  eliminar()
  ocultalboton()
}

// Configurar edición de solicitud con delegación de eventos
const configurarEditarSolicitud = () => {
  $(document).on('click', '.mostrar-solicitud', async function (event) {
    event.preventDefault()

    const rowData = JSON.parse($(this).attr('data-row'))
    // Usar función para establecer valores
    establecerValoresSolicitud({ data: rowData })
    $('#modalInformacion').modal('show')
  })
}

const eliminar = async () => {
  $(document).on('click', '.btnDelete', async function () {
    try {
      const id = $(this).data('id')
      if (!id) throw new Error('ID del producto no encontrado')

      // Confirmación con SweetAlert2
      const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: '¿Deseas eliminar esta solicitud?',
        icon: 'warning',
        showDenyButton: true,
        confirmButtonText: 'Eliminar',
        denyButtonText: 'Cancelar',
        confirmButtonColor: '#d33',
        denyButtonColor: '#3085d6'
      })

      if (result.isConfirmed) {
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
        const response = await fetchApi({ url: `/api/mezclas/registro/${id}`, type: 'delete' })

        // Obtener datos actualizados
        const nuevaData = await obtenerProceso()

        console.log(response)
        // Actualizar tabla existente sin reinicializar
        const table = $('#tbCanceladas').DataTable()
        table
          .clear()
          .rows.add(nuevaData)
          .draw(false) // false para mantener la página actual

        // Mensaje de éxito
        await Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: response.message,
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
// Función para establecer valores en el formulario
const establecerValoresSolicitud = async ({ data }) => {
  document.getElementById('idSolicit').value = data.id
  document.getElementById('solicita').value = data.Solicita
  document.getElementById('fechaSolicitud').value = data.fechaSolicitud
  document.getElementById('ranchoDestino').value = data.ranchoDestino
  document.getElementById('empresa').value = data.empresa
  document.getElementById('centroCoste').value = data.centroCoste
  document.getElementById('variedad').value = data.variedad
  document.getElementById('FolioReceta').value = data.FolioReceta
  document.getElementById('temporada').value = data.temporada
  document.getElementById('cantidad').value = data.cantidad
  document.getElementById('presentacion').value = data.prensetacion
  document.getElementById('metodoAplicacion').value = data.metodoAplicacion
  document.getElementById('descripcion').value = data.descripcion

  // Mostrar productos de la receta

  iniciarProductosReceta(data.id)
  await verProductosReceta({
    eliminarUltimaColumna: true,
    depuracion: true
  })
}

const ocultalboton = () => {
  document.getElementById('btnCancelar').style.display = 'none'
  document.getElementById('btnConfirmacion').style.display = 'none'
  document.getElementById('btnEditar').style.display = 'none'
  document.getElementById('agregarProductoReceta').style.display = 'none'
}
export { iniciarCanceladas, verCanceladas }
