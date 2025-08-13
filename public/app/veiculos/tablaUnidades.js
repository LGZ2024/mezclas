$(document).ready(function () {
    const tabla = $('#catUnidades').DataTable({
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
            { "targets": 0, "data": "id" },
            { "targets": 1, "data": "no_economico", },
            { "targets": 2, "data": "marca", },
            { "targets": 3, "data": "tipo", },
            { "targets": 4, "data": "modelo", },
            { "targets": 5, "data": "ano", },
            { "targets": 6, "data": "numero_motor", },
            { "targets": 7, "data": "placas", },
            { "targets": 8, "data": "tipo_combus" },
            { "targets": 9, "data": "medida_llanta" },
            { "targets": 10, "data": "cia_seguro" },
            { "targets": 11, "data": "no_poliza" },
        ],

    });
    iniciarDivs()
});

const iniciarDivs = async () => {
    try {
        const data = await obtenerDatos();
        var table = $('#catUnidades').DataTable();
        table.clear().rows.add(data).draw();
        // Aquí puedes realizar acciones adicionales con los datos obtenidos
    } catch (error) {
        // Aquí puedes manejar el error
    }
};

const obtenerDatos = async () => {
    try {
        const response = await fetch(`../../view/crud/DatosTabla.php?op=11`);
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



