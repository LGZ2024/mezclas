$(document).ready(function () {
  let minDate, maxDate

  // Custom filtering function which will search data in column four between two values
  DataTable.ext.search.push(function (settings, data, dataIndex) {
    const min = minDate.val()
    const max = maxDate.val()
    const date = new Date(data[4])

    if (
      (min === null && max === null) ||
            (min === null && date <= max) ||
            (min <= date && max === null) ||
            (min <= date && date <= max)
    ) {
      return true
    }
    return false
  })

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
  })
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
  })

  const tabla = $('#tablaTikect').DataTable({
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
      }
    ],
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
    responsive: true,
    order: [[0, 'desc']],
    columnDefs: [
      // Define el orden de las columnas
      { targets: 0, data: 'id_servicio' },
      { targets: 1, data: 'cc' },
      { targets: 2, data: 'noeconomico' },
      { targets: 3, data: 'prioridad' },
      { targets: 4, data: 'fecha_solicitud' },
      { targets: 5, data: 'mantenimiento' },
      { targets: 6, data: 'reparacion_soli' },
      { targets: 7, data: 'talleres_asignado' },
      { targets: 8, data: 'estado' },
      { targets: 9, data: 'temporada' },
      { targets: 10, data: 'km_registrado' },
      { targets: 11, data: 'nom_conductor' },
      { targets: 12, data: 'termino_reparacion' },
      { targets: 13, data: 'observacion' },
      {
        targets: -1,
        data: 'id_servicio',
        render: function (data, type, row) {
          /* <button type="button" class="btn btn-primary" onclick="EditarTiket(${row.id_servicio})"><i class="fa-solid fa-pen-to-square"></i></button> */
          return `
                    <button type="button" class="btn btn-danger" onclick="EliminarKm(${row.id_servicio})"><i class="fa-solid fa-trash"></i></button>
                    `
        }
      }
    ],
    createdRow: function (row, data, index) {
      if (data.prioridad === 'Baja') {
        $('td', row).eq(3).css({
          'background-color': '#3ce74c',
          color: 'black'
        })
      } else if (data.prioridad === 'Media') {
        $('td', row).eq(3).css({
          'background-color': '#FCFF33',
          color: 'black'
        })
      } else if (data.prioridad == 'Alta') {
        $('td', row).eq(3).css({
          'background-color': '#FFA233',
          color: 'black'
        })
      } else if (data.prioridad == 'Urguente') {
        $('td', row).eq(3).css({
          'background-color': '#FF4233',
          color: 'black'
        })
      }
      if (data.mantenimiento == 'Preventivo') {
        $('td', row).eq(5).css({
          'background-color': '#3ce74c',
          color: 'black'
        })
      } else if (data.mantenimiento === 'Correctivo') {
        $('td', row).eq(5).css({
          'background-color': '#FF4233',
          color: 'black'
        })
      }
    }

  })
  iniciarDivs()
  // selecciona inputs para el filtrado de fechas
  document.querySelectorAll('#min, #max').forEach((el) => {
    el.addEventListener('change', () => tabla.draw())
  })
})

const iniciarDivs = async () => {
  try {
    const data = await obtenerDatos()
    const table = $('#tablaTikect').DataTable()
    table.clear().rows.add(data).draw()
    // Aquí puedes realizar acciones adicionales con los datos obtenidos
  } catch (error) {
    // Aquí puedes manejar el error
  }
}

const obtenerDatos = async () => {
  try {
    const response = await fetch('../../view/crud/DatosTabla.php?op=10')
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }
    const data = await response.json()
    console.log(data)
    return data
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}

/* funcion de Eliminar */
const EliminarKm = async (id) => {
  const response = await fetch('../../view/crud/eliminarTicket.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: `id=${id}`
  })
  const data = await response.json()
  console.log(data)
  if (data.respuesta === 'success') {
    iniciarDivs()
    return Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'Registro eliminado',
      text: data.msg,
      timer: 1500
    })
  } else {
    return Swal.fire({
      position: 'center',
      icon: 'error',
      title: 'No se pudo eliminar el registro',
      text: data.msg,
      timer: 1500
    })
  }
}

const EditarTiket = (id) => {
  document.getElementById('idServ').value = id
  const modal = $('#ModalEditar')
  modal.modal('show')
}
