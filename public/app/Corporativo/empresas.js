/* eslint-disable no-new */
/* eslint-disable no-undef */
/**
 * Módulo para gestión de Empresas
 */

class EmpresasManager {
    constructor() {
        this.table = null
        this.modal = $('#modalEmpresa')
        this.form = $('#formEmpresa')
        this.init()
    }

    init() {
        this.initDataTable()
        this.bindEvents()
    }

    initDataTable() {
        this.table = $('#tbEmpresas').DataTable({
            ajax: {
                url: '/corporativo/api/empresas',
                dataSrc: ''
            },
            columns: [
                { data: 'id' },
                { data: 'nombre_comercial' },
                { data: 'razon_social' },
                { data: 'rfc' },
                {
                    data: 'status',
                    render: (data) => {
                        return data === 1 || data === true
                            ? '<span class="badge badge-success">Activo</span>'
                            : '<span class="badge badge-danger">Inactivo</span>'
                    }
                },
                {
                    data: null,
                    render: (data, type, row) => {
                        return `
                            <button class="btn btn-sm btn-info btn-editar" title="Editar">
                                <i class="mdi mdi-pencil"></i>
                            </button>
                            <button class="btn btn-sm btn-danger btn-eliminar" title="Eliminar">
                                <i class="mdi mdi-delete"></i>
                            </button>
                        `
                    }
                }
            ],
            language: {
                sProcessing: 'Procesando...',
                sLengthMenu: 'Mostrar _MENU_ registros',
                sZeroRecords: 'No se encontraron resultados',
                sEmptyTable: 'Ningún dato disponible en esta tabla',
                sInfo: 'Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros',
                sInfoEmpty: 'Mostrando registros del 0 al 0 de un total de 0 registros',
                sInfoFiltered: '(filtrado de un total de _MAX_ registros)',
                sInfoPostFix: '',
                sSearch: 'Buscar:',
                sUrl: '',
                sInfoThousands: ',',
                sLoadingRecords: 'Cargando...',
                oPaginate: {
                    sFirst: 'Primero',
                    sLast: 'Último',
                    sNext: 'Siguiente',
                    sPrevious: 'Anterior'
                },
                oAria: {
                    sSortAscending: ': Activar para ordenar la columna de manera ascendente',
                    sSortDescending: ': Activar para ordenar la columna de manera descendente'
                }
            },
            responsive: true,
            order: [[0, 'desc']]
        })
    }

    bindEvents() {
        // Botón crear
        $('#btnCrear').on('click', () => {
            this.form[0].reset()
            $('#id_empresa').val('')
            $('#modalEmpresaLabel').text('Nueva Empresa')
            this.modal.modal('show')
        })

        // Guardar (Create/Update)
        this.form.on('submit', async (e) => {
            e.preventDefault()
            const id = $('#id_empresa').val()
            const isEdit = !!id
            const url = isEdit ? `/corporativo/api/empresas/${id}` : '/corporativo/api/empresas'
            const method = isEdit ? 'PUT' : 'POST'

            const formData = {
                nombre_comercial: $('#nombre_comercial').val(),
                razon_social: $('#razon_social').val(),
                rfc: $('#rfc').val(),
                status: 1 // Default active
            }

            try {
                const response = await $.ajax({
                    url,
                    method,
                    contentType: 'application/json',
                    data: JSON.stringify(formData)
                })

                if (response.success) {
                    Swal.fire('Éxito', response.message, 'success')
                    this.modal.modal('hide')
                    this.refresh()
                }
            } catch (error) {
                console.error(error)
                Swal.fire('Error', 'Ocurrió un error al guardar', 'error')
            }
        })

        // Botón editar
        $('#tbEmpresas tbody').on('click', '.btn-editar', (e) => {
            const data = this.table.row($(e.currentTarget).parents('tr')).data()
            $('#id_empresa').val(data.id)
            $('#nombre_comercial').val(data.nombre_comercial)
            $('#razon_social').val(data.razon_social)
            $('#rfc').val(data.rfc)

            $('#modalEmpresaLabel').text('Editar Empresa')
            this.modal.modal('show')
        })

        // Botón eliminar
        $('#tbEmpresas tbody').on('click', '.btn-eliminar', async (e) => {
            const data = this.table.row($(e.currentTarget).parents('tr')).data()

            const result = await Swal.fire({
                title: '¿Estás seguro?',
                text: 'Se dará de baja esta empresa',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, eliminar'
            })

            if (result.isConfirmed) {
                try {
                    const response = await $.ajax({
                        url: `/corporativo/api/empresas/${data.id}`,
                        method: 'DELETE'
                    })

                    if (response.success) {
                        Swal.fire('Eliminado', response.message, 'success')
                        this.refresh()
                    }
                } catch (error) {
                    console.error(error)
                    Swal.fire('Error', 'No se pudo eliminar la empresa', 'error')
                }
            }
        })
    }

    refresh() {
        this.table.ajax.reload()
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new EmpresasManager()
})
