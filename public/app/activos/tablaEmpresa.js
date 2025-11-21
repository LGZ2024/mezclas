/* eslint-disable no-undef */
import { fetchApi, MensajeCambiarEstado } from '../funciones.js'

/* funciones para inicializar tabla de empresas */
/* obtener empresas */
const obtenerRegistro = async () => {
  try {
    const response = await fetchApi('/api/catalogos/empresas', 'GET')
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error al obtener empresas:', error)
    throw error
  }
}

/* mostrar tabla de empresas */
const verEmpresas = async () => {
  try {
    // Verificar si DataTable ya existe
    if (!$.fn.dataTable.isDataTable('#tbEmpresas')) {
      $('#tbEmpresas').DataTable({
        paging: true,
        order: [[0, 'desc']],
        dom: '<"d-flex justify-content-between"fl>t<"d-xl-flex justify-content-between align-items-center"ip><"clear">',
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
          { targets: 0, data: 'id' },
          { targets: 1, data: 'razon_social' },
          { targets: 2, data: 'nombre_comercial' },
          { targets: 3, data: 'rfc' },
          {
            targets: 4,
            data: 'status',
            render: function (data, type, row) {
              return `
              <button type="button" data-id="${row.id}" data-status="${row.status}" id="btnCambiarEstado" class="btn btn-sm ${row.status === true ? 'btn-success' : 'btn-danger'}">
              <span class="badge bg-${row.status === true ? 'success' : 'danger'}">${row.status === true ? 'Activo' : 'Inactivo'}</span>
              </button>
            `
            }
          },
          {
            targets: 5,
            data: 'id',
            render: function (data, type, row) {
              const rol = document.getElementById('rol').value
              if (rol === 'master') {
                return `
                    <button type="button" data-id="${data}" id="btnEdit" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modalEmpresa"><i class="mdi mdi-pencil"></i></button>
                  `
              }
              return 'No autorizado'
            }
          }
        ]
      })
    }
    // Inicializar eventos solo una vez
    inicializarEventos()
  } catch (error) {
    console.error('Error al mostrar registros:', error)
  }
}

/* inicializar tabla con datos */
const iniciarEmpresas = async () => {
  try {
    const data = await obtenerRegistro()

    // Verificar que DataTable está inicializada
    if ($.fn.dataTable.isDataTable('#tbEmpresas')) {
      const table = $('#tbEmpresas').DataTable()
      table.clear().rows.add(data).draw()
      console.log('Tabla actualizada correctamente')
    } else {
      console.warn('DataTable no está inicializada')
    }
  } catch (error) {
    console.error('Error al inicializar registros:', error)
  }
}

// Inicializar todos los eventos (registrarse una sola vez)
const inicializarEventos = () => {
  // Remover listeners anteriores para evitar duplicados
  $(document).off('click', '#btnCrear')
  $(document).off('click', '#btnEdit')
  $(document).off('click', '#btnCambiarEstado')

  // Abrir modal para agregar empresa
  $(document).on('click', '#btnCrear', async function () {
    document.getElementById('formEmpresa').reset()
    document.getElementById('id').value = ''
    const modal = $('#modalEmpresa')
    document.getElementById('modalEmpresaLabel').textContent = 'Agregar Empresa'
    modal.modal('show')
  })

  // Editar empresa
  $(document).on('click', '#btnEdit', async function () {
    const modal = $('#modalEmpresa')
    document.getElementById('modalEmpresaLabel').textContent = 'Editar Empresa'
    modal.modal('show')
    const id = $(this).data('id')
    const razonSocial = $(this).parents('tr').find('td:nth-child(2)').text()
    const nombreComercial = $(this).parents('tr').find('td:nth-child(3)').text()
    const rfc = $(this).parents('tr').find('td:nth-child(4)').text()

    document.getElementById('razon_social').value = razonSocial
    document.getElementById('nombre_comercial').value = nombreComercial
    document.getElementById('rfc').value = rfc
    document.getElementById('id').value = id
  })

  // Cambiar estado
  $(document).on('click', '#btnCambiarEstado', async function (e) {
    e.preventDefault()
    const id = $(this).data('id')
    const status = $(this).data('status')
    try {
      const url = `/api/catalogos/empresas/${id}`
      const method = 'PATCH'
      const data = {
        status: status !== true
      }
      const respuesta = await MensajeCambiarEstado(url, method, data)
      if (respuesta === true) {
        iniciarEmpresas()
        await verEmpresas()
      }
    } catch (error) {
      console.error('Error al cambiar el estado:', error)
    }
  })
}
export { iniciarEmpresas, verEmpresas }
