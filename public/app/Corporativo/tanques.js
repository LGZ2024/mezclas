/* eslint-disable no-undef */
/**
 * Módulo para gestión de Tanques
 */

class TanquesManager {
    constructor() {
        this.table = null
        this.modal = $('#modalTanque')
        this.form = $('#formTanque')
        this.init()
    }

    init() {
        this.initDataTable()
        this.bindEvents()
    }

    initDataTable() {
        this.table = $('#tbTanques').DataTable({
            ajax: {
                url: '/corporativo/api/tanques',
                dataSrc: ''
            },
            columns: [
                { data: 'id' },
                {
                    data: 'rancho',
                    render: (data, type, row) => {
                        return data.rancho
                    }
                },
                { data: 'codigo' },
                { data: 'etapa' },
                {
                    data: 'capacidad',
                    render: (data, type, row) => {
                        return `${data} ${row.unidad || 'L'}`
                    }
                },
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
            $('#id_tanque').val('')
            $('#modalTanqueLabel').text('Nuevo Tanque')
            this.modal.modal('show')
        })

        // Guardar
        this.form.on('submit', async (e) => {
            e.preventDefault()
            const id = $('#id_tanque').val()
            const isEdit = !!id
            const url = isEdit ? `/corporativo/api/tanques/${id}` : '/corporativo/api/tanques'
            const method = isEdit ? 'PUT' : 'POST'

            const formData = {
                codigo: $('#codigo').val(),
                etapa: $('#etapa').val(),
                capacidad: $('#capacidad').val(),
                unidad: $('#unidad').val(),
                status: 1,
                id_rancho: $('#id_rancho').val()
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
        $('#tbTanques tbody').on('click', '.btn-editar', (e) => {
            const data = this.table.row($(e.currentTarget).parents('tr')).data()
            $('#id_tanque').val(data.id)
            $('#codigo').val(data.codigo)
            $('#capacidad').val(data.capacidad)
            $('#unidad').val(data.unidad)

            $('#modalTanqueLabel').text('Editar Tanque')
            this.modal.modal('show')
        })

        // Botón eliminar
        $('#tbTanques tbody').on('click', '.btn-eliminar', async (e) => {
            const data = this.table.row($(e.currentTarget).parents('tr')).data()

            const result = await Swal.fire({
                title: '¿Estás seguro?',
                text: 'Se dará de baja este tanque',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, eliminar'
            })

            if (result.isConfirmed) {
                try {
                    const response = await $.ajax({
                        url: `/corporativo/api/tanques/${data.id}`,
                        method: 'DELETE'
                    })

                    if (response.success) {
                        Swal.fire('Eliminado', response.message, 'success')
                        this.refresh()
                    }
                } catch (error) {
                    console.error(error)
                    Swal.fire('Error', 'No se pudo eliminar el tanque', 'error')
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
    // eslint-disable-next-line no-new
    new TanquesManager()
})
