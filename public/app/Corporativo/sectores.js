/* eslint-disable no-new */
/* eslint-disable no-undef */
/**
 * Módulo para gestión de Sectores
 */

class SectoresManager {
    constructor() {
        this.table = null
        this.modal = $('#modalSector')
        this.form = $('#formSector')
        this.init()
    }

    init() {
        this.initDataTable()
        this.bindEvents()
    }

    initDataTable() {
        this.table = $('#tbSectores').DataTable({
            ajax: {
                url: '/corporativo/api/sectores',
                dataSrc: ''
            },
            columns: [
                { data: 'id' },
                {
                    data: 'rancho_dsa',
                    render: (data, type, row) => {
                        if (!data) return 'Sin Asignar'
                        return `${data.nombre_rancho_dsa} - ${data.numero_rancho_dsa}${data.rancho ? ' (' + data.rancho.rancho + ')' : ''}`
                    }
                },
                { data: 'sector_interno' },
                { data: 'sector_agrian' },
                { data: 'variedad' },
                { data: 'hectareas' },
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
            $('#id_sector').val('')
            $('#modalSectorLabel').text('Nuevo Sector')
            this.modal.modal('show')
        })

        // Guardar
        this.form.on('submit', async (e) => {
            e.preventDefault()
            const id = $('#id_sector').val()
            const isEdit = !!id
            const url = isEdit ? `/corporativo/api/sectores/${id}` : '/corporativo/api/sectores'
            const method = isEdit ? 'PUT' : 'POST'

            const formData = {
                id_rancho_dsa: $('#id_rancho_dsa').val(),
                sector_interno: $('#sector_interno').val(),
                sector_agrian: $('#sector_agrian').val(),
                variedad: $('#variedad').val(),
                hectareas: $('#hectareas').val(),
                status: 1
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
        $('#tbSectores tbody').on('click', '.btn-editar', (e) => {
            const data = this.table.row($(e.currentTarget).parents('tr')).data()
            $('#id_sector').val(data.id)
            $('#id_rancho_dsa').val(data.id_rancho_dsa)
            $('#sector_interno').val(data.sector_interno)
            $('#sector_agrian').val(data.sector_agrian)
            $('#variedad').val(data.variedad)
            $('#hectareas').val(data.hectareas)

            $('#modalSectorLabel').text('Editar Sector')
            this.modal.modal('show')
        })

        // Botón eliminar
        $('#tbSectores tbody').on('click', '.btn-eliminar', async (e) => {
            const data = this.table.row($(e.currentTarget).parents('tr')).data()

            const result = await Swal.fire({
                title: '¿Estás seguro?',
                text: 'Se dará de baja este sector',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, eliminar'
            })

            if (result.isConfirmed) {
                try {
                    const response = await $.ajax({
                        url: `/corporativo/api/sectores/${data.id}`,
                        method: 'DELETE'
                    })

                    if (response.success) {
                        Swal.fire('Eliminado', response.message, 'success')
                        this.refresh()
                    }
                } catch (error) {
                    console.error(error)
                    Swal.fire('Error', 'No se pudo eliminar el sector', 'error')
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
    new SectoresManager()
})
