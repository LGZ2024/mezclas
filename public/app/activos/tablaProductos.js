/* eslint-disable no-undef */
import { fetchApi, MensajeEliminacion } from '../funciones.js'

/* inicializar tabla solicitada */
const iniciarProductos = async () => {
  try {
    const data = await obtenerRegistro()
    const table = $('#tbProductos').DataTable()
    console.log('Datos obtenidos:', data)
    table.clear().rows.add(data.productos)
    table.columns.adjust().draw()
  } catch (error) {
    console.error('Error al inicializar registros:', error)
  }
}
/* obtener mezclas */
const obtenerRegistro = async () => {
  try {
    const response = await fetchApi('/api/productos', 'GET') // cambiar a GET
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}
/* mostrar tala de mezclas Solicitada */
const verProductos = async () => {
  try {
    if (!$.fn.dataTable.isDataTable('#tbProductos')) {
      $('#tbProductos').DataTable({
        paging: true,
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
        dom: '<"d-flex justify-content-between"fBl>t<"d-xl-flex justify-content-between align-items-center"ip><"clear">',
        responsive: false,
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
          // Define el orden de las columnas
          { targets: 0, data: 'id_producto' },
          { targets: 1, data: 'id_sap' },
          { targets: 2, data: 'nombre' },
          { targets: 3, data: 'descripcion' },
          { targets: 4, data: 'unidad_medida' },
          {
            targets: 5,
            data: 'id_producto',
            render: function (data, type, row) {
              const rol = document.getElementById('rol').value
              // al boton le pasaremos data para obtenerlo con el evento del botton
              if (rol === 'master') {
                return `
                    <button type="button" data-id="${data}" class="btn btn-primary btnEdit" data-bs-toggle="modal"><i class="mdi mdi-border-color"></i></button>
                    <button type="button" data-id="${data}" class="btn btn-danger btn-delete"><i class="mdi mdi-delete"></i></button>
                  `
              }
              return 'No autorizado'
            }
          }
        ]
      })
    }
    agregar()
    editar()
    eliminar()
  } catch (error) {
    console.error('Error al mostrar registros:', error)
  }
}

export { iniciarProductos, verProductos }

// Abrir modal para agregar asistencia
const agregar = async () => {
  $(document).on('click', '#btnCrear', async function () {
    const modal = $('#exampleModal')
    document.getElementById('exampleModalLabel').textContent = 'Agregar Producto'
    modal.modal('show')
  })
}

// Abrir modal para editar asistencia
const editar = async () => {
  $(document).on('click', '.btnEdit', async function () {
    const modal = $('#exampleModal')
    document.getElementById('exampleModalLabel').textContent = 'Editar vivienda'
    modal.modal('show')
    const id = $(this).data('id')
    const idSap = $(this).parents('tr').find('td:nth-child(2)').text()
    const nombre = $(this).parents('tr').find('td:nth-child(3)').text()
    const descripcion = $(this).parents('tr').find('td:nth-child(4)').text()
    const unidadMedida = $(this).parents('tr').find('td:nth-child(5)').text()

    document.getElementById('id').value = id
    document.getElementById('nombre').value = nombre
    document.getElementById('id_sap').value = idSap
    document.getElementById('descripcion').value = descripcion
    document.getElementById('unidad_medida').value = unidadMedida
  })
}

// Eliminar Asistencia
const eliminar = () => {
  $(document).on('click', '.btn-delete', async function (e) {
    e.preventDefault()
    const id = $(this).data('id')
    console.log('ID a eliminar:', id)
    const url = `/api/productos/${id}`
    const method = 'DELETE'

    const respuesta = await MensajeEliminacion(url, method)
    if (respuesta === true) {
      iniciarProductos()
      await verProductos()
    }
  })
}
