/* finciones de agregar unidad de mantenimiento */
const agergarUnid = () => {
  document.getElementById('btnAgregar').disabled = true
  const no_economicoU = document.getElementById('no_economicoU').value
  const marca = document.getElementById('marca').value
  const tipoV = document.getElementById('tipoV').value
  const modelo = document.getElementById('modelo').value
  const ano = document.getElementById('ano').value
  const numero_serie = document.getElementById('numero_serie').value
  const numero_motor = document.getElementById('numero_motor').value
  const placas = document.getElementById('placas').value
  const tipoC = document.getElementById('tipoC').value
  const medida_llanta = document.getElementById('medida_llanta').value
  const cia_seguro = document.getElementById('cia_seguro').value
  const no_poliza = document.getElementById('no_poliza').value

  if (no_economicoU === '') {
    Swal.fire({
      icon: 'info',
      title: 'Verificar',
      text: 'Verifica que todos los campos esten completos',
      timer: 6500
    })
    document.getElementById('btnAgregar').disabled = false
  } else {
    const formdata = new FormData()
    formdata.append('no_economico', no_economicoU)
    formdata.append('marca', marca)
    formdata.append('tipoV', tipoV)
    formdata.append('modelo', modelo)
    formdata.append('ano', ano)
    formdata.append('numero_serie', numero_serie)
    formdata.append('numero_motor', numero_motor)
    formdata.append('placas', placas)
    formdata.append('tipoC', tipoC)
    formdata.append('medida_llanta', medida_llanta)
    formdata.append('cia_seguro', cia_seguro)
    formdata.append('no_poliza', no_poliza)
    guardarUnidad(formdata)
  }
}

const guardarUnidad = async (formdata) => {
  console.log(formdata)
  const respuesta = await fetch('../../view/crud/numEcoVeiculos.php', {
    method: 'POST',
    headers: {
      Accept: 'application/json'
    },
    body: formdata
  })
  const data = await respuesta.json()
  console.log(data)
  if (data.respuesta === 'success') {
    Swal.fire({
      icon: 'success',
      title: 'Agregada',
      text: data.msg,
      timer: 6500
    })
    // abillitamos boton
    document.getElementById('btnAgregar').disabled = false
    // limpiamos campos
    document.getElementById('formCatalogoU').reset()
  } else {
    Swal.fire({
      icon: 'error',
      title: 'error',
      text: data.msg,
      timer: 6500
    })
    document.getElementById('btnAgregar').disabled = false
  }
}

/* finciones para agregar taller */
const agergarTaller = () => {
  document.getElementById('btnAgegart').disabled = true
  const razon_social = document.getElementById('razon_social').value
  const domicilio = document.getElementById('domicilio').value
  const contacto = document.getElementById('contacto').value
  const forma_pago = document.getElementById('forma_pago').value

  if (razon_social === '') {
    Swal.fire({
      icon: 'info',
      title: 'Verificar',
      text: 'Verifica que todos los campos esten completos',
      timer: 6500
    })
    document.getElementById('btnAgegart').disabled = false
  } else {
    const formdata = new FormData()
    formdata.append('razon_social', razon_social)
    formdata.append('domicilio', domicilio)
    formdata.append('contacto', contacto)
    formdata.append('forma_pago', forma_pago)
    guardarTaller(formdata)
  }
}

const guardarTaller = async (formdata) => {
  console.log(formdata)
  const respuesta = await fetch('../../view/crud/talleres.php', {
    method: 'POST',
    headers: {
      Accept: 'application/json'
    },
    body: formdata
  })
  const data = await respuesta.json()
  console.log(data)
  if (data.respuesta === 'success') {
    Swal.fire({
      icon: 'success',
      title: 'Agregada',
      text: data.msg,
      timer: 6500
    })
    // abillitamos boton
    document.getElementById('btnAgegart').disabled = false
    // limpiamos campos
    document.getElementById('formTalleres').reset()
  } else {
    Swal.fire({
      icon: 'error',
      title: 'error',
      text: data.msg,
      timer: 6500
    })
    document.getElementById('btnAgegart').disabled = false
  }
}

/* funciones para abrir un tiket */
const nuevoTiket = () => {
  document.getElementById('btnNuevoTiket').disabled = true
  const nom_conductor = document.getElementById('nom_conductorA').value
  const noeconomico = document.getElementById('numEconomico').value
  const cc = document.getElementById('cc').value
  const km_registrado = document.getElementById('km_registradoA').value
  const fecha_solicitud = document.getElementById('fecha_solicitudA').value
  const talleres_asignados = document.getElementById('talleres_asignadoA').value
  const prioridad = document.getElementById('prioridadA').value
  const mantenimiento = document.getElementById('mantenimientoA').value
  const reparacion_soli = document.getElementById('reparacion_soliA').value
  const termino_reparacion = document.getElementById('termino_reparacionA').value
  const observacion = document.getElementById('observacionA').value

  /*  */
  const zona = document.getElementsByName('zonaServicio')
  const noRanchos = document.getElementsByName('noRanchos')
  const inputMich1 = document.getElementById('idMichOPcion1').value
  const inputMich2 = document.getElementById('idMichOPcion2').value
  const inputMich3 = document.getElementById('idMichOPcion3').value

  const inputJal1 = document.getElementById('idJaliscoOpcion1').value
  const inputJal2 = document.getElementById('idJaliscoOpcion2').value
  const inputJal3 = document.getElementById('idJaliscoOpcion3').value
  /* validacion de zona y ranchos */
  if (!zona[0].checked && !zona[1].checked) {
    document.getElementById('btnNuevoTiket').disabled = false
    return alert('selecciona una zona de servicio')
  }
  if (!noRanchos[0].checked && !noRanchos[1].checked && !noRanchos[2].checked) {
    document.getElementById('btnNuevoTiket').disabled = false
    return alert('selecciona un numero de rancho')
  }

  zona.forEach(radioButton => {
    if (radioButton.checked) {
      valorRadioZona = radioButton.value
    }
  })
  noRanchos.forEach(radioButton => {
    if (radioButton.checked) {
      valorRadioRancho = radioButton.value
    }
  })
  /* mich  */
  if (valorRadioZona === 'Mich' && valorRadioRancho === '1') {
    if (inputMich1 === '') {
      document.getElementById('btnNuevoTiket').disabled = false
      return alert('seleccione una opciÃ³n')
    }
  }
  if (valorRadioZona === 'Mich' && valorRadioRancho === '2') {
    if (inputMich2 === '' || inputMich2 === '') {
      document.getElementById('btnNuevoTiket').disabled = false
      return alert('seleccione dos opciÃ³nes')
    }
  }
  if (valorRadioZona === 'Mich' && valorRadioRancho === '3') {
    if (inputMich3 === '' || inputMich3 === '' || inputMich3 === '') {
      document.getElementById('btnNuevoTiket').disabled = false
      return alert('seleccione tres opciÃ³nes')
    }
  }

  /* jalisco */
  if (valorRadioZona === 'Jal' && valorRadioRancho === '1') {
    if (inputJal1 === '') {
      document.getElementById('btnNuevoTiket').disabled = false
      return alert('seleccione una opciÃ³n')
    }
  }
  if (valorRadioZona === 'Jal' && valorRadioRancho === '2') {
    if (inputJal2 === '' || inputJal2 === '') {
      document.getElementById('btnNuevoTiket').disabled = false
      return alert('seleccione dos opciÃ³nes')
    }
  }
  if (valorRadioZona === 'Jal' && valorRadioRancho === '3') {
    if (inputJal3 === '' || inputJal2 === '' || inputJal3 === '') {
      document.getElementById('btnNuevoTiket').disabled = false
      return alert('seleccione tres opciÃ³nes')
    }
  }
  /* varianble de ranchos */
  const variablesinput = (inputMich1 + ',' + inputMich2 + ',' + inputMich3 + ',' + inputJal1 + ',' + inputJal2 + ',' + inputJal3)

  if (nom_conductor === '' || noeconomico === '' || cc === '' || km_registrado === '' || fecha_solicitud == '' || talleres_asignados === '' || prioridad == '' || mantenimiento === '' || reparacion_soli === '' || termino_reparacion === '' || variablesinput == '') {
    document.getElementById('btnNuevoTiket').disabled = false
    return Swal.fire({
      icon: 'info',
      title: 'Verificar',
      text: 'Verifica que todos los campos esten completos',
      timer: 6500
    })
  } else {
    const formdata = new FormData()
    formdata.append('nom_conductor', nom_conductor)
    formdata.append('noeconomico', noeconomico)
    formdata.append('cc', cc)
    formdata.append('km_registrado', km_registrado)
    formdata.append('fecha_solicitud', fecha_solicitud)
    formdata.append('talleres_asignado', talleres_asignados)
    formdata.append('prioridad', prioridad)
    formdata.append('mantenimiento', mantenimiento)
    formdata.append('reparacion_soli', reparacion_soli)
    formdata.append('termino_reparacion', termino_reparacion)
    formdata.append('observacion', observacion)
    formdata.append('ranchos', variablesinput)
    formdata.append('zona', valorRadioZona)
    agregarticket(formdata)
  }
}

const agregarticket = async (formdata) => {
  const response = await fetch('../../view/crud/nuevoTicket.php', {
    method: 'POST',
    headers: {
      Accept: 'application/json'
    },
    body: formdata
  })
  const data = await response.json()
  console.log(data)
  if (data.respuesta === 'success') {
    Swal.fire({
      icon: 'success',
      title: 'Agregada',
      text: data.msg,
      timer: 6500
    })
    // abillitamos boton
    document.getElementById('btnNuevoTiket').disabled = false
    // limpiamos campos
    document.getElementById('formAbrir').reset()
  }
}
const iniciarDivs = async () => {
  const taller = document.getElementById('talleres_asignadoA')
  const numEconomico = document.getElementById('numEconomico')
  taller.innerHTML = ''
  numEconomico.innerHTML = ''

  numEconomico.append(new Option('Selecciona un numero economico', 0))
  taller.append(new Option('Selecciona un taller', 0))

  const urlTaller = '../../view/crud/datosTalleres.php'
  const urlNumeconomico = '../../view/crud/datosUnidadesMant.php'
  try {
    const [respTaller, respEconomico] = await Promise.all([fetch(urlTaller), fetch(urlNumeconomico)])
    if (!respEconomico.ok || !respTaller.ok) {
      throw new Error('No se pudo obtener LOS DATOS. Respuesta inesperada del servidor.')
    }
    const economico = await respEconomico.json()
    economico.forEach(economicos => {
      console.log(economicos)
      console.log(economicos.no_economico)
      numEconomico.append(new Option(economicos.no_economico, economicos.no_economico))
    })
    const talleres = await respTaller.json()
    talleres.forEach(talleres => {
      console.log(talleres)
      console.log(talleres.razon_social)
      taller.append(new Option(talleres.razon_social, talleres.razon_social))
    })
  } catch (error) {
    console.log(error)
  }
}

/* funciones de cerrar tickets */
async function EstadoTiket () {
  const selectElement = document.querySelector('.selectId')
  $('#btnPendieteT').hide()
  $('#btnCierreT').hide()
  selectElement.addEventListener('change', async (event) => {
    if (event.target.value === '') {
      $('#formCierre').trigger('reset')
    } else {
      try {
        const response = await $.ajax({
          url: '../../view/crud/obtenerDatosTicket.php',
          type: 'GET',
          data: { id_servicio: parseInt(event.target.value) }
        })
        const datos = response[0]
        console.log(datos)
        if (datos.estado === 'pendiente') {
          $('#btnCierreT').show()
          $('#btnPendieteT').hide()
        } else if (datos.estado === 'abierto') {
          $('#btnPendieteT').show()
          $('#btnCierreT').show()
        } else {
          $('#btnPendieteT').hide()
          $('#btnCierreT').hide()
          document.getElementById('formCierre').reset()
        }
        document.getElementById('cc').value = datos.cc
        document.getElementById('nom_conductor').value = datos.nom_conductor
        document.getElementById('km_registrado').value = datos.km_registrado
        document.getElementById('fecha_solicitud').value = datos.fecha_solicitud
        document.getElementById('prioridad').value = datos.prioridad
        document.getElementById('mantenimiento').value = datos.mantenimiento
        document.getElementById('reparacion_soli').value = datos.reparacion_soli
        document.getElementById('talleres_asignado').value = datos.talleres_asignado
        document.getElementById('termino_reparacion').value = datos.termino_reparacion
        document.getElementById('observacion').value = datos.observacion
        document.getElementById('noeconomico').value = datos.noeconomico
        document.getElementById('id_servicio').value = datos.id_servicio
        document.getElementById('temporada').value = datos.temporada
        document.getElementById('no_factura').value = datos.no_factura
        document.getElementById('fecha_factura').value = datos.fecha_factura
        document.getElementById('reparacion_efect').value = datos.reparacion_efect
        document.getElementById('inporte_repara').value = datos.inporte_repara
      } catch (error) {
        $('#btnPendieteT').hide()
        $('#btnCierreT').hide()
        document.getElementById('formCierre').reset()
      }
    }
  })
}

const cerrar_tikect = () => {
  document.getElementById('btnCierreT').disabled = true
  document.getElementById('btnPendieteT').disabled = true
  const id_servicio = document.getElementById('id_servicio').value
  const temporada = document.getElementById('temporada').value
  const factura = document.getElementById('no_factura').value
  const fecha_factura = document.getElementById('fecha_factura').value
  const reparacion_efectuada = document.getElementById('reparacion_efect').value
  const importe_mantenimiento = document.getElementById('inporte_repara').value
  if (id_servicio === '' || temporada === '' || factura === '' || fecha_factura === '' || reparacion_efectuada === '' || importe_mantenimiento === '') {
    document.getElementById('btnCierreT').disabled = false
    document.getElementById('btnPendieteT').disabled = false
    return Swal.fire({
      icon: 'info',
      title: 'Verificar',
      text: 'Verifica que todos los campos esten completos',
      timer: 6500
    })
  } else {
    const formdata = new FormData()
    formdata.append('id_servicio', id_servicio)
    formdata.append('temporada', temporada)
    formdata.append('factura', factura)
    formdata.append('fecha_factura', fecha_factura)
    formdata.append('reparacion_efectuada', reparacion_efectuada)
    formdata.append('importe_mantenimiento', importe_mantenimiento)
    cerrarticket(formdata)
  }
}

const cerrarticket = async (formdata) => {
  const response = await fetch('../../view/crud/cerrarTicket.php', {
    method: 'POST',
    headers: {
      Accept: 'application/json'
    },
    body: formdata
  })
  const data = await response.json()
  console.log(data)
  if (data.respuesta === 'success') {
    Swal.fire({
      icon: 'success',
      title: 'Cerrada',
      text: data.msg,
      timer: 6500
    })
    // abillitamos boton
    document.getElementById('btnCierreT').disabled = false
    document.getElementById('btnPendieteT').disabled = false
    // limpiamos campos
    document.getElementById('formCierre').reset()
    // cargamos lista de tickets
    iniciarTickets()
  } else {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: data.msg,
      timer: 6500
    })
    // abillitamos boton
    document.getElementById('btnCierreT').disabled = false
    document.getElementById('btnPendieteT').disabled = false
  }
}

const pendiente_tikect = () => {
  document.getElementById('btnCierreT').disabled = true
  document.getElementById('btnPendieteT').disabled = true
  const id_servicio = document.getElementById('id_servicio').value
  const temporada = document.getElementById('temporada').value
  const factura = document.getElementById('no_factura').value
  const fecha_factura = document.getElementById('fecha_factura').value
  const reparacion_efectuada = document.getElementById('reparacion_efect').value
  const importe_mantenimiento = document.getElementById('inporte_repara').value
  if (id_servicio === '') {
    document.getElementById('btnCierreT').disabled = false
    document.getElementById('btnPendieteT').disabled = false
    return Swal.fire({
      icon: 'info',
      title: 'Verificar',
      text: 'Verifica que este selecionado un servicio',
      timer: 6500
    })
  } else {
    const formdata = new FormData()
    formdata.append('id_servicio', id_servicio)
    formdata.append('temporada', temporada)
    formdata.append('factura', factura)
    formdata.append('fecha_factura', fecha_factura)
    formdata.append('reparacion_efectuada', reparacion_efectuada)
    formdata.append('importe_mantenimiento', importe_mantenimiento)
    pendienteticket(formdata)
  }
}

const pendienteticket = async (formdata) => {
  const response = await fetch('../../view/crud/pendienteTicket.php', {
    method: 'POST',
    headers: {
      Accept: 'application/json'
    },
    body: formdata
  })
  const data = await response.json()
  if (data.respuesta === 'success') {
    Swal.fire({
      icon: 'success',
      title: 'Pendiente',
      text: data.msg,
      timer: 6500
    })
    // abillitamos boton
    document.getElementById('btnCierreT').disabled = false
    document.getElementById('btnPendieteT').disabled = false
    // limpiamos campos
    document.getElementById('formCierre').reset()
    // inicialisar lista de ticket
    iniciarTickets()
  } else {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: data.msg,
      timer: 6500
    })
    // abillitamos boton
    document.getElementById('btnCierreT').disabled = false
    document.getElementById('btnPendieteT').disabled = false
  }
}

// inicializamos los tikets en nuestro select option
const iniciarTickets = async () => {
  const ticket = document.getElementById('id_servicio')
  ticket.innerHTML = ''

  ticket.append(new Option('Selecciona un ticket', 0))
  const respTicket = await fetch('../../view/crud/datosTicket.php', {
    method: 'GET'
  })
  try {
    if (!respTicket.ok) {
      throw new Error('No se pudo obtener LOS DATOS. Respuesta inesperada del servidor.')
    }
    const tickets = await respTicket.json()
    tickets.forEach(tickets => {
      ticket.append(new Option(tickets.id_servicio + '----' + tickets.estado, tickets.id_servicio))
    })
  } catch (error) {
    console.log(error)
  }
}

/* funciones de mantenimientos o reparaciones Y SERVICIOS */
const iniciarMantenimientos = async () => {
  const tipo_proceso = document.getElementById('tipo_Servm').value
  // desabilitar boton asta respuesta
  document.getElementById('btnServicio').disabled = true

  /* condicional registrar servicio */
  if (tipo_proceso === 'servicio') {
    const fecha_solicitud = document.getElementById('fecha_solicitud').value
    const numEconomico = document.getElementById('numEconomico').value
    const tipo_servicio = document.getElementById('tipo_servicio').value
    const prioridad = document.getElementById('prioridad').value
    const talleres_asignado = document.getElementById('talleres_asignado').value
    const fechaSalida = document.getElementById('fechaSalida').value
    const responsable = document.getElementById('responsable').value
    const tipo_vehiculo = document.getElementById('tipo_vehiculo').value
    const kilometrajeR = document.getElementById('kilometrajeR').value
    const proximoServ = document.getElementById('proximoServ').value
    const monto = document.getElementById('monto').value
    const tipo_pago = document.getElementById('tipo_pago').value
    const noFactura = document.getElementById('noFactura1').value
    const estado = document.getElementById('estado').value
    const comentario = document.getElementById('comentario').value
    const noCentroCoste = document.getElementsByName('noCentroCoste')
    const inputCentroCoste1 = document.getElementById('rancho1').value
    const inputCentroCoste2 = document.getElementById('rancho2').value
    const inputCentroCoste3 = document.getElementById('rancho3').value
    const inputCentroCoste4 = document.getElementById('rancho4').value
    const inputCentroCoste5 = document.getElementById('rancho5').value
    /* validacion de zona y ranchos */
    if (!noCentroCoste[0].checked && !noCentroCoste[1].checked && !noCentroCoste[2].checked && !noCentroCoste[3].checked && !noCentroCoste[4].checked) {
      document.getElementById('btnServicio').disabled = false
      return alert('selecciona un numero de rancho')
    }

    noCentroCoste.forEach(radioButton => {
      if (radioButton.checked) {
        valorRadioRancho = radioButton.value
      }
    })
    if (valorRadioRancho === '1') {
      if (inputCentroCoste1 === '') {
        document.getElementById('btnServicio').disabled = false
        return alert('seleccione una opciÃ³n')
      }
    }
    if (valorRadioRancho === '2') {
      if (inputCentroCoste1 === '' || inputCentroCoste2 === '') {
        document.getElementById('btnServicio').disabled = false
        return alert('seleccione dos opciÃ³nes')
      }
    }
    if (valorRadioRancho === '3') {
      if (inputCentroCoste1 === '' || inputCentroCoste2 === '' || inputCentroCoste3 === '') {
        document.getElementById('btnServicio').disabled = false
        return alert('seleccione tres opciÃ³nes')
      }
    }
    if (valorRadioRancho === '4') {
      if (inputCentroCoste1 === '' || inputCentroCoste2 === '' || inputCentroCoste3 === '' || inputCentroCoste4 === '') {
        document.getElementById('btnServicio').disabled = false
        return alert('seleccione tres opciÃ³nes')
      }
    }
    if (valorRadioRancho === '5') {
      if (inputCentroCoste1 === '' || inputCentroCoste2 === '' || inputCentroCoste3 === '' || inputCentroCoste4 === '' || inputCentroCoste5 === '') {
        document.getElementById('btnServicio').disabled = false
        return alert('seleccione tres opciÃ³nes')
      }
    }

    /* varianble de ranchos */
    const variablesinput = (inputCentroCoste1 + ',' + inputCentroCoste2 + ',' + inputCentroCoste3 + ',' + inputCentroCoste4 + ',' + inputCentroCoste5)
    alert(variablesinput)

    if (fecha_solicitud === '' || numEconomico === '' || tipo_servicio === '' || prioridad === '' || talleres_asignado === '' || fechaSalida === '' || responsable === '' || variablesinput === '' || kilometrajeR === '' || proximoServ === '' || monto === '' || tipo_pago === '' || noFactura === '' || estado === '') {
      document.getElementById('btnServicio').disabled = false
      return Swal.fire({
        icon: 'info',
        title: 'Verificar',
        text: 'Verifica que todos los campos esten completos',
        timer: 6500
      })
    } else {
      const formdata = new FormData()
      formdata.append('fecha_solicitud', fecha_solicitud)
      formdata.append('numEconomico', numEconomico)
      formdata.append('tipo_servicio', tipo_servicio)
      formdata.append('prioridad', prioridad)
      formdata.append('talleres_asignado', talleres_asignado)
      formdata.append('fechaSalida', fechaSalida)
      formdata.append('responsable', responsable)
      formdata.append('rancho', variablesinput)
      formdata.append('tipo_vehiculo', tipo_vehiculo)
      formdata.append('kilometrajeR', kilometrajeR)
      formdata.append('proximoServ', proximoServ)
      formdata.append('monto', monto)
      formdata.append('tipo_pago', tipo_pago)
      formdata.append('noFactura', noFactura)
      formdata.append('estado', estado)
      formdata.append('comentario', comentario)
      registrarServicio(formdata)
    }
  } else if (tipo_proceso === 'mantenimiento') {
    const fecha_solicitud = document.getElementById('fecha_solicitud').value
    const numEconomico = document.getElementById('numEconomico').value
    const tipo_servicio = document.getElementById('tipo_servicio').value
    const detalle = document.getElementById('detalle').value
    const prioridad = document.getElementById('prioridad').value
    const talleres_asignado = document.getElementById('talleres_asignado').value
    const fechaSalida = document.getElementById('fechaSalida').value
    const responsable = document.getElementById('responsable').value
    const tipo_vehiculo = document.getElementById('tipo_vehiculo').value
    const kilometrajeR = document.getElementById('kilometrajeR').value
    const monto = document.getElementById('monto').value
    const tipo_pago = document.getElementById('tipo_pago').value
    const noFactura = document.getElementById('noFactura1').value
    const estado = document.getElementById('estado').value
    const comentario = document.getElementById('comentario').value

    /* value input ranchos */
    const noCentroCoste = document.getElementsByName('noCentroCoste')
    const inputCentroCoste1 = document.getElementById('rancho1').value
    const inputCentroCoste2 = document.getElementById('rancho2').value
    const inputCentroCoste3 = document.getElementById('rancho3').value
    const inputCentroCoste4 = document.getElementById('rancho4').value
    const inputCentroCoste5 = document.getElementById('rancho5').value
    /* validacion de zona y ranchos */
    if (!noCentroCoste[0].checked && !noCentroCoste[1].checked && !noCentroCoste[2].checked && !noCentroCoste[3].checked && !noCentroCoste[4].checked) {
      document.getElementById('btnServicio').disabled = false
      return alert('selecciona un numero de rancho')
    }

    noCentroCoste.forEach(radioButton => {
      if (radioButton.checked) {
        valorRadioRancho = radioButton.value
      }
    })
    if (valorRadioRancho === '1') {
      if (inputCentroCoste1 === '') {
        document.getElementById('btnServicio').disabled = false
        return alert('seleccione una opciÃ³n')
      }
    }
    if (valorRadioRancho === '2') {
      if (inputCentroCoste1 === '' || inputCentroCoste2 === '') {
        document.getElementById('btnServicio').disabled = false
        return alert('seleccione dos opciÃ³nes')
      }
    }
    if (valorRadioRancho === '3') {
      if (inputCentroCoste1 === '' || inputCentroCoste2 === '' || inputCentroCoste3 === '') {
        document.getElementById('btnServicio').disabled = false
        return alert('seleccione tres opciÃ³nes')
      }
    }
    if (valorRadioRancho === '4') {
      if (inputCentroCoste1 === '' || inputCentroCoste2 === '' || inputCentroCoste3 === '' || inputCentroCoste4 === '') {
        document.getElementById('btnServicio').disabled = false
        return alert('seleccione tres opciÃ³nes')
      }
    }
    if (valorRadioRancho === '5') {
      if (inputCentroCoste1 === '' || inputCentroCoste2 === '' || inputCentroCoste3 === '' || inputCentroCoste4 === '' || inputCentroCoste5 === '') {
        document.getElementById('btnServicio').disabled = false
        return alert('seleccione tres opciÃ³nes')
      }
    }

    /* varianble de ranchos */
    const variablesinput = (inputCentroCoste1 + ',' + inputCentroCoste2 + ',' + inputCentroCoste3 + ',' + inputCentroCoste4 + ',' + inputCentroCoste5)
    alert(variablesinput)

    if (fecha_solicitud === '' || numEconomico === '' || tipo_servicio === '' || detalle === '' || prioridad === '' || talleres_asignado === '' || fechaSalida === '' || responsable === '' || kilometrajeR === '' || monto === '' || tipo_pago === '' || noFactura === '' || estado === '' || variablesinput === '') {
      document.getElementById('btnServicio').disabled = false
      return Swal.fire({
        icon: 'info',
        title: 'Verificar',
        text: 'Verifica que todos los campos esten completos',
        timer: 6500
      })
    } else {
      const formdata = new FormData()
      formdata.append('fecha_solicitud', fecha_solicitud)
      formdata.append('numEconomico', numEconomico)
      formdata.append('tipo_servicio', tipo_servicio)
      formdata.append('detalle', detalle)
      formdata.append('prioridad', prioridad)
      formdata.append('talleres_asignado', talleres_asignado)
      formdata.append('fechaSalida', fechaSalida)
      formdata.append('responsable', responsable)
      formdata.append('rancho', variablesinput)
      formdata.append('tipo_vehiculo', tipo_vehiculo)
      formdata.append('kilometrajeR', kilometrajeR)
      formdata.append('monto', monto)
      formdata.append('tipo_pago', tipo_pago)
      formdata.append('noFactura', noFactura)
      formdata.append('estado', estado)
      formdata.append('comentario', comentario)
      registrarMantenimiento(formdata)
    }
  } else {
    document.getElementById('btnServicio').disabled = false
    return Swal.fire({
      icon: 'info',
      title: 'Verificar',
      text: 'Debe selecionar un tipo de servicio',
      timer: 6500
    })
  }
}

const registrarServicio = async (formdata) => {
  const response = await fetch('../../view/crud/registarServicio.php', {
    method: 'POST',
    headers: {
      Accept: 'application/json'
    },
    body: formdata
  })
  const data = await response.json()
  console.log(data)
  if (data.respuesta === 'success') {
    Swal.fire({
      icon: 'success',
      title: 'Servicio',
      text: data.msg,
      timer: 6500
    })
    document.getElementById('btnServicio').disabled = false
    document.getElementById('formMantenimiento').reset()
  } else {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: data.msg,
      timer: 6500
    })
    document.getElementById('btnServicio').disabled = false
  }
}
const registrarMantenimiento = async (formdata) => {
  const response = await fetch('../../view/crud/registarMantenimiento.php', {
    method: 'POST',
    headers: {
      Accept: 'application/json'
    },
    body: formdata
  })
  const data = await response.json()
  console.log(data)
  if (data.respuesta === 'success') {
    Swal.fire({
      icon: 'success',
      title: 'Mantenimiento',
      text: data.msg,
      timer: 6500
    })
    document.getElementById('btnServicio').disabled = false
    document.getElementById('formMantenimiento').reset()
  } else {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: data.msg,
      timer: 6500
    })
    document.getElementById('btnServicio').disabled = false
  }
}

const iniciarUnidades = async () => {
  const unidad = document.getElementById('numEconomico')
  unidad.innerHTML = ''

  unidad.append(new Option('Selecciona un numero economico', 0))
  const respUnidad = await fetch('../../view/crud/datosUnidadesMant.php', {
    method: 'GET'
  })
  try {
    if (!respUnidad.ok) {
      throw new Error('No se pudo obtener LOS DATOS. Respuesta inesperada del servidor.')
    }
    const unidades = await respUnidad.json()
    unidades.forEach(unidades => {
      unidad.append(new Option(unidades.no_economico, unidades.no_economico))
    })
  } catch (error) {
    console.log(error)
  }
}

function obtenerDatosUnidad () {
  const selectElemento = document.querySelector('.num_Economico') /* selecion de numero economico */
  selectElemento.addEventListener('change', async (event) => {
    try {
      const response = await $.ajax({
        url: '../../view/crud/datosUnidadesMntInfo.php',
        type: 'GET',
        headers: {
          Accept: 'application/json'
        },
        data: { num_economico: event.target.value }
      })
      const data = response[0]
      document.getElementById('tipo_vehiculo').value = data.tipo
    } catch (error) {
      console.error(error)
    }
  })
}

function tiposervicio () {
  const selectElemento1 = document.querySelector('.Tipo_servicio') /* selecion de tipo de servicio */
  $('.Quitar').hide()
  selectElemento1.addEventListener('change', (event) => {
    const tipo_servicio = event.target.value
    if (tipo_servicio === 'servicio') {
      $('.Quitar').hide() //
      $('.Mostrar').show() //
    } else if (tipo_servicio === 'mantenimiento') {
      $('.Quitar').show()
      $('.Mostrar').hide()
    }
  })
}

const iniciarTalleres = async () => {
  const taller = document.getElementById('talleres_asignado')
  taller.innerHTML = ''

  taller.append(new Option('Selecciona taller', 0))
  const respTaller = await fetch('../../view/crud/datosTalleres.php', {
    method: 'GET'
  })
  try {
    if (!respTaller.ok) {
      throw new Error('No se pudo obtener los datos. Respuesta inesperada del servidor.')
    }
    const talleres = await respTaller.json()
    talleres.forEach(talleres => {
      taller.append(new Option(talleres.razon_social, talleres.razon_social))
    })
  } catch (error) {
    console.log(error)
  }
}
