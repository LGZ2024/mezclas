$(document).ready(function () {
    let minDate, maxDate;

    // Custom filtering function which will search data in column four between two values
    DataTable.ext.search.push(function (settings, data, dataIndex) {
        const min = minDate.val();
        const max = maxDate.val();
        const date = new Date(data[4]);

        if (
            (min === null && max === null) ||
            (min === null && date <= max) ||
            (min <= date && max === null) ||
            (min <= date && date <= max)
        ) {
            return true;
        }
        return false;
    });
    // Creacion de imput para el rango de fechas
    minDate = new DateTime('#min', {
        format: 'MMMM Do YYYY',
        i18n: {
            previous: 'Anterior',
            next: 'Siguiente',
            months: [
                'Enero',
                'Febrero',
                'Marzo',
                'Abril',
                'Mayo',
                'Junio',
                'Julio',
                'Agosto',
                'Septiembre',
                'Octubre',
                'Noviembre',
                'Diciembre'
            ],
            weekdays: ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab']
        }
    });
    maxDate = new DateTime('#max', {
        format: 'MMMM Do YYYY',
        i18n: {
            previous: 'Anterior',
            next: 'Siguiente',
            months: [
                'Enero',
                'Febrero',
                'Marzo',
                'Abril',
                'Mayo',
                'Junio',
                'Julio',
                'Agosto',
                'Septiembre',
                'Octubre',
                'Noviembre',
                'Diciembre'
            ],
            weekdays: ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab']
        }
    });


    const tabla = $('#tablaPreven').DataTable({
        paging: true,
        dom: '<"row"<"col-md-3"<"filtro"f>><"col-md-5"<"boton"B>>tip',
        buttons: [
            {
                extend: 'copyHtml5',
                text: '<i class="fa-solid fa-copy"></i>',
                titleAttr: 'Copiar Tabla',
                className: 'btn btn-primary'
            },
            {
                extend: 'excelHtml5',
                text: '<i class="fa-solid fa-file-excel"></i>',
                titleAttr: 'Exportar a Excel',
                className: 'btn btn-success'
            },
            {
                extend: 'csvHtml5',
                text: '<i class="fa-solid fa-file-csv"></i>',
                titleAttr: 'Exportar archivo CSV',
                className: 'btn btn-info'
            },
            {
                extend: 'print',
                text: '<i class="fa-solid fa-print"></i>',
                titleAttr: 'Imprimir',
                className: 'btn-warning'
            },
        ],
        language: {
            "lengthMenu": "Mostrar _MENU_ registros",
            "zeroRecords": "No se encontraron resultados",
            "info": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
            "infoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
            "infoFiltered": "(filtrado de un total de _MAX_ registros)",
            "sSearch": "Buscar:",
            "oPaginate": {
                "sFirst": "Primero",
                "sLast": "Último",
                "sNext": "Siguiente",
                "sPrevious": "Anterior",
            },
            "sProcessing": "Procesando...",
        },
        responsive: true,
        order: [[0, "desc"]],
        columnDefs: [
            // Define el orden de las columnas
            { "targets": 0, "data": "no_economico" },
            { "targets": 1, "data": "rancho", },
            { "targets": 2, "data": "tipo_veiculo", },
            { "targets": 3, "data": "tipo_servicio", },
            { "targets": 4, "data": "fecha_solicitud", },
            { "targets": 5, "data": "prioridad", },
            { "targets": 6, "data": "taller_asignado", },
            { "targets": 7, "data": "detalles", },
            { "targets": 8, "data": "kilometrajeR" },
            { "targets": 9, "data": "fecha_salida" },
            { "targets": 10, "data": "tipo_pago" },
            { "targets": 11, "data": "monto" },
            { "targets": 12, "data": "noFactura" },
            { "targets": 13, "data": "responsable" },
            { "targets": 14, "data": "comentario" },
        ],
        "createdRow": function (row, data, index) {
            console.log(data.tipo_servicio);
            if (data.prioridad === 'Baja') {
                $('td', row).eq(5).css({
                    'background-color': '#3ce74c',
                    'color': 'black'
                })
            } else if (data.prioridad === 'Media') {
                $('td', row).eq(5).css({
                    'background-color': '#FCFF33',
                    'color': 'black'
                })

            } else if (data.prioridad == 'Alta') {
                $('td', row).eq(5).css({
                    'background-color': '#FFA233',
                    'color': 'black'
                })
            } else if (data.prioridad == 'Urguente') {
                $('td', row).eq(5).css({
                    'background-color': '#FF4233',
                    'color': 'black'
                })
            }
            if (data.tipo_servicio == 'Preventivo') {
                $('td', row).eq(3).css({
                    'background-color': '#3ce74c',
                    'color': 'black'
                })
            }
        },

    });
    iniciarDivs()
    // selecciona inputs para el filtrado de fechas
    document.querySelectorAll('#min, #max').forEach((el) => {
        el.addEventListener('change', () => tabla.draw());
    });
});

const iniciarDivs = async () => {
    try {
        const data = await obtenerDatos();
        var table = $('#tablaPreven').DataTable();
        table.clear().rows.add(data).draw();
        // Aquí puedes realizar acciones adicionales con los datos obtenidos
    } catch (error) {
        // Aquí puedes manejar el error
    }
};

const obtenerDatos = async () => {
    try {
        const response = await fetch(`../../view/crud/DatosTabla.php?op=7`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data)
        return data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

const EliminarKm = async (id) => {

}



