//hacemos peticion fecht
async function fechTbSolicitadas(status) {
    const response = await fetch(`/mezclasEmpresas/${status}`);
    const data = await response.json();
    return data;
}

/*funciones para inicializar tabla  de mezclas solicitadas*/
/*inicializar tabla solicitada*/
const iniciarMesclasV= async (status) => {
    try {
        const data = await obtenerMesclaz(status);
        var table = $('#tbSolicitadas').DataTable();
        table.clear().rows.add(data).draw();
        // Aquí puedes realizar acciones adicionales con los datos obtenidos
    } catch (error) {
        // Aquí puedes manejar el error
    }
};
/* mostrar tala de mezclas Solicitada */
const verMesclazV = () => {
    const tabla = $('#tbSolicitadas').DataTable({
        paging: true,
        order: [[0, "desc"]],
        dom: '<"contenedor"<"row"<"col-2"lf><"col-2"B>>t<"row"i<"row"p>>>',
        buttons: [
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
        ],
        responsive: true,
        pageLength: 5,
        lengthMenu: [[5, 10, 20, -1], [5, 10, 20, 'Todos']],
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
        columnDefs: [
            // Define el orden de las columnas
            { "targets": 0, "data": "id" },
            { "targets": 1, "data": "Solicita" },
            { "targets": 2, "data": "fechaSolicitud" },
            { "targets": 3, "data": "ranchoDestino" },
            { "targets": 4, "data": "empresa" },
            { "targets": 5, "data": "centroCoste" },
            { "targets": 6, "data": "variedad" },
            { "targets": 7, "data": "FolioReceta" },
            { "targets": 8, "data": "temporada" },
            { "targets": 9, "data": "cantidad" },
            { "targets": 10, "data": "prensetacion" },
            { "targets": 11, "data": "metodoAplicacion" },
            {
                "targets": 12,
                "data": "imagen",
                "render": function (data, type, row) {
                    return` <button type="button" class="btn btn-primary" onclick="Receta('${data}')"><i class="fa-solid fa-eye"></i></button>`;
                }
            },
            { "targets": 13, "data": "descripcion" },
            { "targets": 14, "data": "status" },
        ],
    });
}



/*funciones para inicializar tabla  de mezclas solicitadas*/
/*inicializar tabla solicitada*/
const iniciarMesclasVP= async (status) => {
    try {
        const data = await obtenerMesclaz(status);
        var table = $('#tbPreparadas').DataTable();
        table.clear().rows.add(data).draw();
        // Aquí puedes realizar acciones adicionales con los datos obtenidos
    } catch (error) {
        // Aquí puedes manejar el error
    }
}
/* mostrar tala de mezclas Solicitada */
const verMesclazVP = () => {
    const tabla = $('#tbPreparadas').DataTable({
        paging: true,
        order: [[0, "desc"]],
        dom: '<"contenedor"<"row"<"col-2"lf><"col-2"B>>t<"row"i<"row"p>>>',
        buttons: [
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
        ],
        responsive: true,
        pageLength: 5,
        lengthMenu: [[5, 10, 20, -1], [5, 10, 20, 'Todos']],
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
        columnDefs: [
            // Define el orden de las columnas
            { "targets": 0, "data": "id" },
            { "targets": 1, "data": "Solicita" },
            { "targets": 2, "data": "notaMezcla" },
            { "targets": 3, "data": "fechaSolicitud" },
            { "targets": 4, "data": "ranchoDestino" },
            { "targets": 5, "data": "empresa" },
            { "targets": 6, "data": "centroCoste" },
            { "targets": 7, "data": "variedad" },
            { "targets": 8, "data": "FolioReceta" },
            { "targets": 9, "data": "temporada" },
            { "targets": 10, "data": "cantidad" },
            { "targets": 11, "data": "prensetacion" },
            { "targets": 12, "data": "metodoAplicacion" },
            {
                "targets": 13,
                "data": "imagen",
                "render": function (data, type, row) {
                    return` <button type="button" class="btn btn-primary" onclick="Receta('${data}')"><i class="fa-solid fa-eye"></i></button>`;
                }
            },
            { "targets": 14, "data": "descripcion" },
            { "targets": 15, "data": "status" },
        ],
    });
}


/*funciones para inicializar tabla  de mezclas entregadas*/
/*inicializar tabla solicitada*/
const iniciarMesclasVPE= async (status) => {
    try {
        const data = await obtenerMesclaz(status);
        var table = $('#tbCerradas').DataTable();
        table.clear().rows.add(data).draw();
        // Aquí puedes realizar acciones adicionales con los datos obtenidos
    } catch (error) {
        // Aquí puedes manejar el error
    }
}
/* mostrar tala de mezclas Solicitada */
const verMesclazVPE = () => {
    const tabla = $('#tbCerradas').DataTable({
        paging: true,
        order: [[0, "desc"]],
        dom: '<"contenedor"<"row"<"col-2"lf><"col-2"B>>t<"row"i<"row"p>>>',
        buttons: [

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
        ],
        responsive: true,
        pageLength: 5,
        lengthMenu: [[5, 10, 20, -1], [5, 10, 20, 'Todos']],
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
        columnDefs: [
            // Define el orden de las columnas
            { "targets": 0, "data": "id" },
            { "targets": 1, "data": "Solicita" },
            { "targets": 2, "data": "fechaSolicitud" },
            { "targets": 3, "data": "ranchoDestino" },
            { "targets": 4, "data": "empresa" },
            { "targets": 5, "data": "centroCoste" },
            { "targets": 6, "data": "FolioReceta" },
            { "targets": 7, "data": "temporada" },
            { "targets": 8, "data": "cantidad" },
            { "targets": 9, "data": "prensetacion" },
            { "targets": 10, "data": "metodoAplicacion" },
            { "targets": 11, "data": "descripcion" },
            { "targets": 12, "data": "variedad" },
            {
                "targets": 13,
                "data": "imagen",
                "render": function (data, type, row) {
                    return` <button type="button" class="btn btn-primary" onclick="Receta('${data}')"><i class="fa-solid fa-eye"></i></button>`;
                }
            },
            { "targets": 14, "data": "notaMezcla" },
            {
                "targets": 15,
                "data": "imagenEntrega",
                "render": function (data, type, row) {
                    return` <button type="button" class="btn btn-primary" onclick="Receta('${data}')"><i class="fa-solid fa-eye"></i></button>`;
                }
            },
            { "targets": 16, "data": "fechaEntrega" },
        ],
    });
}

/* obtener mezclas */
const obtenerMesclaz = async (status) => {
    try {
        const response = await fechTbSolicitadas(status)
        return response;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

/*funciones para inicializar tabla  de mezclas preparacion*/
export {iniciarMesclasV,verMesclazV,iniciarMesclasVP,verMesclazVP,iniciarMesclasVPE,verMesclazVPE};


