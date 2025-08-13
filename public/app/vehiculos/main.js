import { iniciarSolicitudes, verSolicitud } from './tablaTalleres.js'
import { iniciarUnidades, verUnidades } from './tablaUnidades.js'
import { iniciarTickets, verTickets } from './tablaTikets.js'
import { iniciarTicketsCerrados, verTicketsCerrados } from './tablaTiketsCerrados.js'
import { iniciarServicios, verServicio } from './tablaServicios.js'
import { iniciarPreventivo, verPreventivo } from './tablaPreventivos.js'
import { iniciarCorrectivo, verCorrectivo } from './tablaCorrectivos.js'
import { fetchApi, mostrarMensaje } from '../mensajes.js'
import { hideSpinner, showSpinner } from '../spinner.js'
import { iniciarManteniminetos, verMantenimientos } from './tablaManteniminetos.js'

document.addEventListener('DOMContentLoaded', () => {
  // Cachear referencias DOM
  const elementos = {
    tablaTaller: document.getElementById('tbTalleres'),
    tablaUnidades: document.getElementById('tbUnidades'),
    tablaTickets: document.getElementById('tbTickets'),
    tablaTicketsCerrados: document.getElementById('tbTicketsCerrados'),
    tablaServicios: document.getElementById('tbServicios'),
    tablaMantenimiento: document.getElementById('tbMantenimientos'),
    tablaCorrectivo: document.getElementById('tbCorrectivo'),
    tablaPreventivo: document.getElementById('tbPreventivo'),
    btnTalleres: document.getElementById('registrarTaller'),
    btnUnidad: document.getElementById('registrarUnidad'),
    formTaller: document.getElementById('formTaller'),
    formUnidad: document.getElementById('formUnidad'),
    formCerrarTicket: document.getElementById('formCerrarTicket'),
    formAbrirTicket: document.getElementById('formNuevoTicket'),
    formServicios: document.getElementById('formServicios'),
    btnRegresar: document.getElementById('regresarInicio'),
    btnAbrirTicket: document.getElementById('abrirTicket'),
    btnRegistrar: document.getElementById('btnRegistrar'),
    btnPendiente: document.getElementById('btnPendiete'),
    btnCerrarTicket: document.getElementById('cerrarTicket'),
    modal: document.getElementById('modalTaller'),
    optionTaller: document.getElementById('taller_asignado'),
    optionEconomico: document.getElementById('no_economico'),
    optionCentroCoste: document.getElementById('centro_coste'),
    optionServicio: document.getElementById('id_servicio'),
    optionTipoServicio: document.getElementById('tipo_Servm'),
    selectsCentroCoste: document.querySelectorAll('.centroCoste')
  }
  // Función para actualizar UI de forma optimizada
  const actualizarUI = (callback) => {
    return new Promise(resolve => {
      // eslint-disable-next-line no-undef
      requestAnimationFrame(() => {
        callback()
        resolve()
      })
    })
  }
  // resolver respuestas fech y mostrar mensajes
  const respuestaFetch = async ({ respuesta, formularios }) => {
    const res = await respuesta.json()
    console.log(res)
    if (respuesta.ok) {
      await actualizarUI(async () => {
        formularios.reset()
        hideSpinner()
        mostrarMensaje({ msg: res.message, type: 'success' })
        elementos.btnRegistrar.disabled = false
      })
      return res
    } else {
      return await actualizarUI(async () => {
        hideSpinner()
        mostrarMensaje({ msg: res.message, type: 'error' })
        elementos.btnRegistrar.disabled = false
      })
    }
  }
  // pasar datos a formlario cierre ticket
  const mostarDatosCierre = async ({ ticket }) => {
    document.getElementById('centro_coste').value = ticket.centro_coste
    document.getElementById('responsable').value = ticket.responsable
    document.getElementById('kilometraje').value = ticket.kilometraje
    document.getElementById('fecha').value = ticket.fecha
    document.getElementById('prioridad').value = ticket.prioridad
    document.getElementById('mantenimiento').value = ticket.mantenimiento
    document.getElementById('reparacion_solicitada').value = ticket.reparacion_solicitada
    document.getElementById('taller_asignado').value = ticket.taller_asignado
    document.getElementById('fecha_salida').value = ticket.fecha_salida
    document.getElementById('observaciones').value = ticket.observaciones
    document.getElementById('no_economico').value = ticket.no_economico
    document.getElementById('id_servicio').value = ticket.id
  }
  // Delegación de eventos
  const handlers = {
    // Manejadores optimizados Submit para los formularios
    async handleSubmitUnidades (e) {
      e.preventDefault()
      showSpinner()

      await actualizarUI(() => {
        elementos.btnRegistrar.disabled = true
      })

      const formData = new FormData(e.target)
      const datos = Object.fromEntries(formData.entries())

      // Validación de campos requeridos
      const camposRequeridos = [
        'no_economico', 'marca', 'tipo', 'modelo',
        'numero_motor', 'no_serie', 'ano', 'placas',
        'tipoCombustible', 'medida_llanta', 'cia_seguro', 'no_poliza'
      ]
      const camposVacios = camposRequeridos.filter(campo => !datos[campo] || !datos[campo].trim())

      if (camposVacios.length > 0) {
        await actualizarUI(() => {
          mostrarMensaje({ msg: 'Debe llenar todos los campos obligatorios', type: 'error' })
          elementos.btnRegistrar.disabled = false
          hideSpinner()
        })
        return
      }

      try {
        const respuesta = await fetchApi('/api/unidadesC', 'POST', datos)
        await respuestaFetch({ respuesta, formularios: elementos.formAbrirTicket })
        if (elementos.tablaUnidades) await iniciarUnidades()
      } catch (error) {
        hideSpinner()
        await actualizarUI(() => {
          mostrarMensaje({ msg: error.message, type: 'error' })
        })
      } finally {
        hideSpinner()
        await actualizarUI(() => {
          elementos.btnRegistrar.disabled = false
        })
      }
    },
    async handleSubmitTaller (e) {
      e.preventDefault()
      showSpinner()

      await actualizarUI(() => {
        elementos.btnRegistrar.disabled = true
      })

      const formData = new FormData(e.target)
      const datos = Object.fromEntries(formData.entries())

      // Validación
      const camposRequeridos = ['razon_social', 'domicilio', 'contacto', 'tipo_pago']
      const camposVacios = camposRequeridos.some(campo => !datos[campo]?.trim())

      if (camposVacios) {
        await actualizarUI(() => {
          mostrarMensaje({ msg: 'Debe llenar todos los campos', type: 'error' })
          elementos.btnRegistrar.disabled = false
          hideSpinner()
        })
        return
      }

      try {
        const respuesta = await fetchApi('/api/taller', 'POST', datos)
        await respuestaFetch({ respuesta, formularios: elementos.formTaller })
        if (elementos.tablaTaller) await iniciarSolicitudes()
      } catch (error) {
        hideSpinner()
        await actualizarUI(() => {
          mostrarMensaje({ msg: error.message, type: 'error' })
        })
      } finally {
        hideSpinner()
        await actualizarUI(() => {
          elementos.btnRegistrar.disabled = false
        })
      }
    },
    async handleSubmitTicket (e) {
      e.preventDefault()
      showSpinner()
      const url = '/api/solicitudServicio'
      const zona = document.getElementsByName('zonaServicio')
      const noRanchos = document.getElementsByName('noRanchos')
      const inputMich1 = document.getElementById('idMichOPcion1').value
      const inputMich2 = document.getElementById('idMichOPcion2').value
      const inputMich3 = document.getElementById('idMichOPcion3').value

      const inputJal1 = document.getElementById('idJaliscoOpcion1').value
      const inputJal2 = document.getElementById('idJaliscoOpcion2').value
      const inputJal3 = document.getElementById('idJaliscoOpcion3').value

      let valorRadioZona = ''
      let valorRadioRancho = ''
      let ranchosSeleccionados = []

      await actualizarUI(() => {
        elementos.btnRegistrar.disabled = true
      })

      const formData = new FormData(e.target)
      const datos = Object.fromEntries(formData.entries())

      // Validación
      const camposRequeridos = ['fecha', 'no_economico', 'centro_coste', 'prioridad', 'mantenimiento', 'taller_asignado', 'reparacion_solicitada', 'responsable', 'kilometraje', 'fecha_salida']
      const camposVacios = camposRequeridos.some(campo => !datos[campo]?.trim())

      /* validacion de zona y ranchos */
      if (!zona[0].checked && !zona[1].checked) {
        await actualizarUI(() => {
          elementos.btnRegistrar.disabled = false
          hideSpinner()
        })
        return mostrarMensaje({ msg: 'selecciona una zona de servicio', type: 'error' })
      }
      if (!noRanchos[0].checked && !noRanchos[1].checked && !noRanchos[2].checked) {
        await actualizarUI(() => {
          elementos.btnRegistrar.disabled = false
          hideSpinner()
        })
        return mostrarMensaje({ msg: 'selecciona un numero de rancho', type: 'error' })
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

      if (valorRadioZona === 'Mich') {
        if (valorRadioRancho === '1') {
          ranchosSeleccionados = [inputMich1]
        } else if (valorRadioRancho === '2') {
          ranchosSeleccionados = [inputMich1, inputMich2]
        } else if (valorRadioRancho === '3') {
          ranchosSeleccionados = [inputMich1, inputMich2, inputMich3]
        }
      } else if (valorRadioZona === 'Jal') {
        if (valorRadioRancho === '1') {
          ranchosSeleccionados = [inputJal1]
        } else if (valorRadioRancho === '2') {
          ranchosSeleccionados = [inputJal1, inputJal2]
        } else if (valorRadioRancho === '3') {
          ranchosSeleccionados = [inputJal1, inputJal2, inputJal3]
        }
      }

      // Filtra vacíos por si acaso
      ranchosSeleccionados = ranchosSeleccionados.filter(r => r !== '')

      // Convierte a string separado por comas
      const ranchosString = ranchosSeleccionados.join(',')

      console.log(ranchosString)

      if (camposVacios && ranchosString === '') {
        await actualizarUI(() => {
          mostrarMensaje({ msg: 'Debe llenar todos los campos', type: 'error' })
          elementos.btnRegistrar.disabled = false
          hideSpinner()
        })
        return
      }
      // creamos data para mandar los datos
      const data = {
        fecha: document.getElementById('fecha').value.trim(),
        no_economico: document.getElementById('no_economico').value.trim(),
        centro_coste: document.getElementById('centro_coste').value.trim(),
        prioridad: document.getElementById('prioridad').value.trim(),
        mantenimiento: document.getElementById('mantenimiento').value.trim(),
        taller_asignado: document.getElementById('taller_asignado').value.trim(),
        reparacion_solicitada: document.getElementById('reparacion_solicitada').value.trim(),
        responsable: document.getElementById('responsable').value.trim(),
        kilometraje: document.getElementById('kilometraje').value.trim(),
        fecha_salida: document.getElementById('fecha_salida').value.trim(),
        zona: valorRadioZona === 'Mich' ? 'Michioacan' : 'Jalisco',
        ranchos: ranchosString
      }

      try {
        const respuesta = await fetchApi(url, 'POST', data)
        await respuestaFetch({ respuesta, formularios: elementos.formAbrirTicket })
        if (elementos.tablaTaller) await iniciarSolicitudes()
      } catch (error) {
        hideSpinner()
        await actualizarUI(() => {
          mostrarMensaje({ msg: error.message, type: 'error' })
        })
      } finally {
        hideSpinner()
        await actualizarUI(() => {
          elementos.btnRegistrar.disabled = false
        })
      }
    },
    async handleSubmitSevicios (e) {
      e.preventDefault()
      showSpinner()

      let camposRequeridos = []
      let data = {}
      let url = ''

      await actualizarUI(() => {
        elementos.btnRegistrar.disabled = true
      })

      // Obtener valores de zona y ranchos
      const zonaRadios = document.getElementsByName('noCentroCoste')
      let valorRadioZona = ''
      zonaRadios.forEach(radio => {
        if (radio.checked) valorRadioZona = radio.value
      })

      // Obtener ranchos seleccionados según la cantidad de centros de coste seleccionados
      const ranchosSeleccionados = []
      for (let i = 1; i <= 5; i++) {
        const rancho = document.getElementById(`rancho${i}`)
        if (rancho && rancho.parentElement.style.display !== 'none' && rancho.value) {
          ranchosSeleccionados.push(rancho.value.trim())
        }
      }
      const ranchosString = ranchosSeleccionados.filter(r => r !== '').join(',')

      // Obtener datos del formulario
      const formData = new FormData(e.target)
      const datos = Object.fromEntries(formData.entries())

      if (elementos.optionTipoServicio.value === 'servicio') {
        camposRequeridos = [
          'fecha_solicitud', 'no_economico', 'tipo_servicio', 'prioridad',
          'taller_asignado', 'fechaSalida', 'responsable', 'tipo_pago',
          'kilometrajeR', 'proximoServ', 'monto', 'noFactura', 'estado'
        ]
      } else if (elementos.optionTipoServicio.value === 'mantenimiento') {
        camposRequeridos = [
          'fecha_solicitud', 'no_economico', 'tipo_servicio', 'prioridad',
          'detalle', 'taller_asignado', 'fechaSalida', 'responsable', 'tipo_pago',
          'kilometrajeR', 'monto', 'noFactura', 'estado'
        ]
      }

      const camposVacios = camposRequeridos.some(campo => !datos[campo] || !datos[campo].trim())

      if (!valorRadioZona) {
        await actualizarUI(() => {
          elementos.btnRegistrar.disabled = false
          hideSpinner()
        })
        return mostrarMensaje({ msg: 'Selecciona un centro de coste', type: 'error' })
      }

      if (ranchosSeleccionados.length === 0) {
        await actualizarUI(() => {
          elementos.btnRegistrar.disabled = false
          hideSpinner()
        })
        return mostrarMensaje({ msg: 'Selecciona al menos un rancho o centro de coste', type: 'error' })
      }

      if (camposVacios) {
        await actualizarUI(() => {
          mostrarMensaje({ msg: 'Debe llenar todos los campos obligatorios', type: 'error' })
          elementos.btnRegistrar.disabled = false
          hideSpinner()
        })
        return
      }

      if (elementos.optionTipoServicio.value === 'mantenimiento') { // typo corregido
        url = '/api/mantenimiento'
        data = {
          fecha: datos.fecha_solicitud,
          no_economico: datos.no_economico,
          centro_coste: valorRadioZona,
          prioridad: datos.prioridad,
          detalles: datos.detalle,
          tipo_servicio: datos.tipo_servicio,
          taller_asignado: datos.taller_asignado,
          responsable: datos.responsable,
          tipo_vehiculo: document.getElementById('tipo_vehiculo').value.trim() || '',
          kilometraje: datos.kilometrajeR || '',
          fecha_salida: datos.fechaSalida,
          zona: datos.estado,
          centros_coste: ranchosString,
          tipo_pago: datos.tipo_pago,
          precio: datos.monto || '',
          comentario: datos.comentario || '',
          factura: datos.noFactura || '',
          estado: datos.estado || ''
        }
      } else if (elementos.optionTipoServicio.value === 'servicio') {
        url = '/api/servicio'
        data = {
          fecha: datos.fecha_solicitud,
          no_economico: datos.no_economico,
          centro_coste: valorRadioZona,
          prioridad: datos.prioridad,
          tipo_servicio: datos.tipo_servicio,
          taller_asignado: datos.taller_asignado,
          reparacion_solicitada: datos.detalle,
          responsable: datos.responsable,
          tipo_vehiculo: document.getElementById('tipo_vehiculo').value.trim() || '',
          kilometraje: datos.kilometrajeR || '',
          proximo_servicio: datos.proximoServ,
          fecha_salida: datos.fechaSalida,
          estado: datos.estado,
          centros_coste: ranchosString,
          tipo_pago: datos.tipo_pago,
          precio: datos.monto || '',
          comentario: datos.comentario || '',
          factura: datos.noFactura || ''
        }
      }

      try {
        const respuesta = await fetchApi(url, 'POST', data)
        await respuestaFetch({ respuesta, formularios: elementos.formServicios })
        if (elementos.tablaServicios) await iniciarSolicitudes()
      } catch (error) {
        hideSpinner()
        await actualizarUI(() => {
          mostrarMensaje({ msg: error.message, type: 'error' })
        })
      } finally {
        hideSpinner()
        await actualizarUI(() => {
          elementos.btnRegistrar.disabled = false
        })
      }
    },
    async handleSubmitCerrarTicket (e) {
      e.preventDefault()
      showSpinner()
      const id = document.getElementById('id_servicio').value
      const url = `/api/solicitudServicio/${id}`
      await actualizarUI(() => {
        elementos.btnRegistrar.disabled = true
      })

      const formData = new FormData(e.target)
      const datos = Object.fromEntries(formData.entries())

      // Validación
      const camposRequeridos = ['temporada', 'no_factura', 'fecha_factura', 'reparacion_efectuada', 'importe_reparacion']
      const camposVacios = camposRequeridos.some(campo => !datos[campo]?.trim())

      if (camposVacios) {
        await actualizarUI(() => {
          mostrarMensaje({ msg: 'Debe llenar todos los campos', type: 'error' })
          elementos.btnRegistrar.disabled = false
          hideSpinner()
        })
        return
      }
      // creamos data para mandar los datos
      const data = {
        temporada: document.getElementById('temporada').value.trim(),
        factura: document.getElementById('no_factura').value.trim(),
        fecha_factura: document.getElementById('fecha_factura').value.trim(),
        reparacion_efectuada: document.getElementById('reparacion_efectuada').value.trim(),
        precio: document.getElementById('importe_reparacion').value.trim()
      }

      try {
        const respuesta = await fetchApi(url, 'PUT', data)
        await respuestaFetch({ respuesta, formularios: elementos.formCerrarTicket })
        handlers.handleIniciarDivsCerrarTicket()
        if (elementos.tablaTaller) await iniciarSolicitudes()
      } catch (error) {
        hideSpinner()
        await actualizarUI(() => {
          mostrarMensaje({ msg: error.message, type: 'error' })
        })
      } finally {
        hideSpinner()
        await actualizarUI(() => {
          elementos.btnRegistrar.disabled = false
        })
      }
    },
    async handleSubmitPendienteTicket (e) {
      e.preventDefault()
      showSpinner()
      const id = document.getElementById('id_servicio').value
      const url = `/api/solicitudServicio/pendiente/${id}`
      await actualizarUI(() => {
        elementos.btnRegistrar.disabled = true
      })

      try {
        const respuesta = await fetchApi(url, 'PUT')
        await respuestaFetch({ respuesta, formularios: elementos.formCerrarTicket })
        handlers.handleIniciarDivsCerrarTicket()
        if (elementos.tablaTaller) await iniciarSolicitudes()
      } catch (error) {
        hideSpinner()
        await actualizarUI(() => {
          mostrarMensaje({ msg: error.message, type: 'error' })
        })
      } finally {
        hideSpinner()
        await actualizarUI(() => {
          elementos.btnRegistrar.disabled = false
        })
      }
    },
    // funciones para regresar
    handleRegresar () {
      // eslint-disable-next-line no-undef
      requestAnimationFrame(() => {
        window.history.back()
      })
    },
    // funciones para mostrear modales
    async handleMostrarModalTaller () {
      await actualizarUI(async () => {
        // eslint-disable-next-line no-undef
        await $('#modalTaller').modal('show')
      })
    },
    async handleMostrarModalUnidad () {
      await actualizarUI(async () => {
        // eslint-disable-next-line no-undef
        await $('#modalUnidad').modal('show')
      })
    },
    async handleMostrarModalAbrirTicket () {
      await actualizarUI(async () => {
        // eslint-disable-next-line no-undef
        await $('#modalTicket').modal('show')
      })
    },
    async handleMostrarModalCerrarTicket () {
      await actualizarUI(async () => {
        // eslint-disable-next-line no-undef
        await $('#modalCerrarTicket').modal('show')
      })
    },
    // Otros manejadores optimizados para cargar datos en la pagina
    async handleIniciarDivsServicios () {
      elementos.optionTaller.innerHTML = ''
      elementos.optionEconomico.innerHTML = ''
      elementos.selectsCentroCoste.forEach(select => {
        select.innerHTML = ''
      })
      const urlTaller = '/api/taller'
      const urlEconomico = '/api/unidadesC'
      const urlCentroCoste = '/api/centroCostess'
      try {
        const [respTaller, respEconomico, respCentroCoste] = await Promise.all([fetch(urlTaller), fetch(urlEconomico), fetch(urlCentroCoste)])
        if (!respTaller.ok || !respEconomico.ok || !respCentroCoste.ok) {
          throw new Error('No se pudo obtener LOS DATOS. Respuesta inesperada del servidor.')
        }
        // eslint-disable-next-line no-undef
        elementos.optionTaller.append(new Option('Selecciona un taller', 0))
        // eslint-disable-next-line no-undef
        elementos.optionEconomico.append(new Option('Selecciona un numero economico', 0))
        // eslint-disable-next-line no-undef
        elementos.selectsCentroCoste.forEach(select => {
          // eslint-disable-next-line no-undef
          select.append(new Option('Selecciona un centro de coste', 0))
        })

        const economicos = await respEconomico.json()
        economicos.forEach(economicos => {
          // eslint-disable-next-line no-undef
          elementos.optionEconomico.append(new Option(economicos.no_economico, economicos.id))
        })
        const talleres = await respTaller.json()
        talleres.forEach(talleres => {
          // eslint-disable-next-line no-undef
          elementos.optionTaller.append(new Option(talleres.razon_social, talleres.id))
        })
        const centroCoste = await respCentroCoste.json()
        centroCoste.forEach(centroCoste => {
          // eslint-disable-next-line no-undef
          elementos.selectsCentroCoste.forEach(select => {
            // eslint-disable-next-line no-undef
            select.append(new Option(centroCoste.centroCoste, centroCoste.centroCoste))
          })
        })
      } catch (error) {
        console.log(error)
      }
    },
    async handleIniciarDivs () {
      elementos.optionTaller.innerHTML = ''
      elementos.optionEconomico.innerHTML = ''
      elementos.optionCentroCoste.innerHTML = ''
      const urlTaller = '/api/taller'
      const urlEconomico = '/api/unidadesC'
      const urlCentroCoste = '/api/centroCostess'
      try {
        const [respTaller, respEconomico, respCentroCoste] = await Promise.all([fetch(urlTaller), fetch(urlEconomico), fetch(urlCentroCoste)])
        if (!respTaller.ok || !respEconomico.ok || !respCentroCoste.ok) {
          throw new Error('No se pudo obtener LOS DATOS. Respuesta inesperada del servidor.')
        }
        // eslint-disable-next-line no-undef
        elementos.optionTaller.append(new Option('Selecciona un taller', 0))
        // eslint-disable-next-line no-undef
        elementos.optionEconomico.append(new Option('Selecciona un numero economico', 0))
        // eslint-disable-next-line no-undef
        elementos.optionCentroCoste.append(new Option('Selecciona un centro de coste', 0))

        const economicos = await respEconomico.json()
        economicos.forEach(economicos => {
          // eslint-disable-next-line no-undef
          elementos.optionEconomico.append(new Option(economicos.no_economico, economicos.no_economico))
        })
        const talleres = await respTaller.json()
        talleres.forEach(talleres => {
          // eslint-disable-next-line no-undef
          elementos.optionTaller.append(new Option(talleres.razon_social, talleres.id))
        })
        const centroCoste = await respCentroCoste.json()
        centroCoste.forEach(centroCoste => {
          // eslint-disable-next-line no-undef
          elementos.optionCentroCoste.append(new Option(centroCoste.centroCoste, centroCoste.centroCoste))
        })
      } catch (error) {
        console.log(error)
      }
    },
    async handleIniciarDivsCerrarTicket () {
      elementos.optionServicio.innerHTML = ''
      const urlTikets = '/api/servicios'
      try {
        const [resServicio] = await Promise.all([fetch(urlTikets)])
        if (!resServicio.ok) {
          throw new Error('No se pudo obtener LOS DATOS. Respuesta inesperada del servidor.')
        }
        // eslint-disable-next-line no-undef
        elementos.optionServicio.append(new Option('Selecciona un Ticket', 0))

        const tickets = await resServicio.json()
        tickets.forEach(tickets => {
          // eslint-disable-next-line no-undef
          elementos.optionServicio.append(new Option(tickets.id + '----' + tickets.estado, tickets.id))
        })
      } catch (error) {
        console.log(error)
      }
    },
    // funciones para los selects
    async handleSelect (e) {
      e.preventDefault()
      showSpinner()
      elementos.btnRegistrar.style.display = 'none'
      elementos.btnPendiente.style.display = 'none'
      if (e.target.value === '0') {
        hideSpinner()
        return elementos.formCerrarTicket.reset()
      }
      try {
        const url = `/api/solicitudServicio/${e.target.value}`
        const response = await fetchApi(url, 'GET')
        const res = await respuestaFetch({ respuesta: response, formularios: elementos.formCerrarTicket })
        if (res.unidades.estado === 'pendiente') {
          elementos.btnRegistrar.style.display = 'block'
          elementos.btnPendiente.style.display = 'none'
          hideSpinner()
        } else if (res.unidades.estado === 'abierto') {
          elementos.btnPendiente.style.display = 'block'
          elementos.btnRegistrar.style.display = 'block'
          hideSpinner()
        } else {
          elementos.btnRegistrar.style.display = 'none'
          elementos.btnPendiente.style.display = 'none'
          elementos.formCerrarTicket.reset()
          hideSpinner()
        }
        await mostarDatosCierre({ ticket: res.unidades })
        hideSpinner()
      } catch (error) {
        elementos.btnRegistrar.style.display = 'none'
        elementos.btnPendiente.style.display = 'none'
        elementos.formCerrarTicket.reset()
        hideSpinner()
      }
    },
    async handleSelectTipoServico (e) {
      e.preventDefault()
      showSpinner()
      const caposQuitar = document.querySelectorAll('.Quitar')
      const caposMostrar = document.querySelectorAll('.Mostrar')

      if (e.target.value === '0') {
        hideSpinner()
        return elementos.formServicios.reset()
      }

      if (e.target.value === 'servicio') {
        caposQuitar.forEach(campo => {
          campo.style.display = 'none'
        })
        caposMostrar.forEach(campo => {
          campo.style.display = 'block'
        })
        hideSpinner()
      } else if (e.target.value === 'mantenimiento') {
        caposQuitar.forEach(campo => {
          campo.style.display = 'block'
        })
        caposMostrar.forEach(campo => {
          campo.style.display = 'none'
        })
        hideSpinner()
      }
      hideSpinner()
    },
    async handleSelectNumeroEconomico (e) {
      e.preventDefault()
      const url = `/api/unidadesC/${e.target.value}`
      try {
        const response = await fetchApi(url, 'GET')
        const res = await response.json()
        mostrarMensaje({ msg: 'Datos Obtenidos Correctamente', type: 'success' })
        document.getElementById('tipo_vehiculo').value = res[0].tipo
      } catch (error) {
        mostrarMensaje({ msg: error.message, type: 'error' })
        console.log(error)
      }
    }
  }

  // Event Listeners optimizados
  if (elementos.formTaller) {
    elementos.formTaller.addEventListener('submit', handlers.handleSubmitTaller)
  }
  if (elementos.formUnidad) {
    elementos.formUnidad.addEventListener('submit', handlers.handleSubmitUnidades)
  }
  if (elementos.formAbrirTicket) {
    handlers.handleIniciarDivs()
    elementos.formAbrirTicket.addEventListener('submit', handlers.handleSubmitTicket)
  }
  if (elementos.formCerrarTicket) {
    handlers.handleIniciarDivsCerrarTicket()
    elementos.formCerrarTicket.addEventListener('submit', handlers.handleSubmitCerrarTicket)
  }
  if (elementos.formServicios) {
    handlers.handleIniciarDivsServicios()
    elementos.formServicios.addEventListener('submit', handlers.handleSubmitSevicios)
  }

  // botones
  if (elementos.btnRegresar) {
    elementos.btnRegresar.addEventListener('click', handlers.handleRegresar)
  }

  if (elementos.btnTalleres) {
    elementos.btnTalleres.addEventListener('click', handlers.handleMostrarModalTaller)
  }

  if (elementos.btnUnidad) {
    elementos.btnUnidad.addEventListener('click', handlers.handleMostrarModalUnidad)
  }

  if (elementos.btnAbrirTicket) {
    elementos.btnAbrirTicket.addEventListener('click', handlers.handleMostrarModalAbrirTicket)
  }

  if (elementos.btnPendiente) {
    elementos.btnPendiente.addEventListener('click', handlers.handleSubmitPendienteTicket)
  }

  // Inicialización de tablas optimizada
  if (elementos.tablaTaller) {
    actualizarUI(async () => {
      iniciarSolicitudes()
      await verSolicitud()
    })
  }
  if (elementos.tablaUnidades) {
    actualizarUI(async () => {
      iniciarUnidades()
      await verUnidades()
    })
  }
  if (elementos.tablaTickets) {
    actualizarUI(async () => {
      iniciarTickets()
      await verTickets()
    })
  }
  if (elementos.tablaTicketsCerrados) {
    actualizarUI(async () => {
      iniciarTicketsCerrados()
      await verTicketsCerrados()
    })
  }
  if (elementos.tablaServicios) {
    actualizarUI(async () => {
      iniciarServicios()
      await verServicio()
    })
  }
  if (elementos.tablaMantenimiento) {
    actualizarUI(async () => {
      iniciarManteniminetos()
      await verMantenimientos()
    })
  }
  if (elementos.tablaCorrectivo) {
    actualizarUI(async () => {
      iniciarCorrectivo()
      await verCorrectivo()
    })
  }
  if (elementos.tablaPreventivo) {
    actualizarUI(async () => {
      iniciarPreventivo()
      await verPreventivo()
    })
  }

  // funciones para los select
  if (elementos.optionServicio) {
    elementos.optionServicio.addEventListener('change', handlers.handleSelect)
  }
  if (elementos.optionTipoServicio) {
    elementos.optionTipoServicio.addEventListener('change', handlers.handleSelectTipoServico)
  }
  if (elementos.optionEconomico) {
    elementos.optionEconomico.addEventListener('change', handlers.handleSelectNumeroEconomico)
  }
})
