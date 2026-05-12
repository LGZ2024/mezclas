/* eslint-disable no-new */
/* eslint-disable no-undef */
/**
 * Módulo para gestión de Activos de Mezcla
 */

class ActivosMezclaManager {
    constructor() {
        this.table = null
        this.modal = $('#modalActivoMezcla')
        this.form = $('#formActivoMezcla')
        this.init()
    }

    init() {
        this.initDataTable()
        this.bindEvents()
    }

    initDataTable() {
        this.table = $('#tbActivosMezcla').DataTable({
            ajax: {
                url: '/corporativo/api/activos-mezcla',
                dataSrc: ''
            },
            columns: [
                { data: 'id' },
                { data: 'nombre' },
                { data: 'codigo' },
                {
                    data: 'tipo',
                    render: (data) => data || 'N/A'
                },
                {
                    data: 'es_principal',
                    render: (data) => {
                        return data === 1 || data === true
                            ? '<span class="badge badge-info">Principal</span>'
                            : '<span class="badge badge-secondary">Secundario</span>'
                    }
                },
                { data: 'unidad' },
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
            $('#id_activo').val('')
            $('#es_principal').prop('checked', false)
            $('#modalActivoMezclaLabel').text('Nuevo Activo')
            this.modal.modal('show')
        })

        // Guardar (Create/Update)
        this.form.on('submit', async (e) => {
            e.preventDefault()
            const id = $('#id_activo').val()
            const isEdit = !!id
            const url = isEdit ? `/corporativo/api/activos-mezcla/${id}` : '/corporativo/api/activos-mezcla'
            const method = isEdit ? 'PUT' : 'POST'

            const formData = {
                nombre: $('#nombre').val(),
                codigo: $('#codigo').val(),
                tipo: $('#tipo').val() || null,
                unidad: $('#unidad').val(),
                es_principal: $('#es_principal').is(':checked') ? 1 : 0
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
        $('#tbActivosMezcla tbody').on('click', '.btn-editar', (e) => {
            const data = this.table.row($(e.currentTarget).parents('tr')).data()
            $('#id_activo').val(data.id)
            $('#nombre').val(data.nombre)
            $('#codigo').val(data.codigo)
            $('#tipo').val(data.tipo || '')
            $('#unidad').val(data.unidad)
            $('#es_principal').prop('checked', data.es_principal === 1 || data.es_principal === true)

            $('#modalActivoMezclaLabel').text('Editar Activo')
            this.modal.modal('show')
        })

        // Botón eliminar
        $('#tbActivosMezcla tbody').on('click', '.btn-eliminar', async (e) => {
            const data = this.table.row($(e.currentTarget).parents('tr')).data()

            const result = await Swal.fire({
                title: '¿Estás seguro?',
                text: 'Se eliminará este activo de mezcla',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, eliminar'
            })

            if (result.isConfirmed) {
                try {
                    const response = await $.ajax({
                        url: `/corporativo/api/activos-mezcla/${data.id}`,
                        method: 'DELETE'
                    })

                    if (response.success) {
                        Swal.fire('Eliminado', response.message, 'success')
                        this.refresh()
                    }
                } catch (error) {
                    console.error(error)
                    Swal.fire('Error', 'No se pudo eliminar el activo', 'error')
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
    new ActivosMezclaManager()
})
