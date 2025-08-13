import { fetchApi, mostrarMensaje } from '../mensajes.js'
import { hideSpinner, showSpinner } from '../spinner.js'
import { verEntrada, iniciarEntrada } from './tablaEntradas.js'
import { iniciarSalida, verSalida } from './tablaSalidas.js'
import { iniciarCarga, verCarga } from './tablaCargas.js'
import { iniciarInventario, verInventario } from './tablaInventario.js'

document.addEventListener('DOMContentLoaded', () => {
  // Cachear referencias DOM
  const elementos = {
    tablaEntrada: document.getElementById('tbEntrada'),
    tablaSalida: document.getElementById('tbSalidas'),
    tablaCarga: document.getElementById('tbCargas'),
    tablaInventario: document.getElementById('tbInventario'),
    formAgregarInv: document.getElementById('formAgregarInv'),
    formAgregarSalida: document.getElementById('formSalidaCombustible'),
    formCargaCombustible: document.getElementById('formCargaCombustible'),
    btnRegresar: document.getElementById('regresarInicio'),
    btnRegistrar: document.getElementById('btnRegistrar'),
    optionEconomico: document.getElementById('no_economico'),
    optionCentroCoste: document.getElementById('centro_coste'),
    inptuKilometraje: document.getElementById('km')
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
    if (respuesta.ok) {
      await actualizarUI(async () => {
        if (formularios) formularios.reset()
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
    async handleSubmitAgregarCombustible (e) {
      e.preventDefault()
      showSpinner()

      await actualizarUI(() => {
        elementos.btnRegistrar.disabled = true
      })

      const formData = new FormData(e.target)
      const datos = Object.fromEntries(formData.entries())

      // Validación de campos requeridos
      const camposRequeridos = [
        'factura', 'fecha', 'almacen', 'centro_coste', 'combustible',
        'cantidad', 'proveedor', 'traslada', 'recibe'
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
        const respuesta = await fetchApi('/api/entrada', 'POST', datos)
        await respuestaFetch({ respuesta, formularios: elementos.formAgregarInv })
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
    async handleSubmitAgregarSalidaCombustible (e) {
      e.preventDefault()
      showSpinner()

      await actualizarUI(() => {
        elementos.btnRegistrar.disabled = true
      })

      const formData = new FormData(e.target)
      const datos = Object.fromEntries(formData.entries())

      // Validación de campos requeridos
      const camposRequeridos = [
        'fecha', 'almacen', 'centro_coste', 'temporada', 'no_economico', 'combustible',
        'cantidad', 'responsable', 'actividad'
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
        const respuesta = await fetchApi('/api/salida', 'POST', datos)
        await respuestaFetch({ respuesta, formularios: elementos.formAgregarSalida })
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
    async handleSubmitCargaCombustible (e) {
      e.preventDefault()
      showSpinner()

      await actualizarUI(() => {
        elementos.btnRegistrar.disabled = true
      })

      const formData = new FormData(e.target)
      const datos = Object.fromEntries(formData.entries())

      // Validación de campos requeridos
      const camposRequeridos = [
        'fecha', 'no_economico', 'centro_coste', 'combustible',
        'cantidad', 'responsable', 'precio', 'km', 'km_recorridos'
      ]

      // Validar que todos los campos requeridos existen y tienen valor no vacío
      const camposVacios = camposRequeridos.filter(campo => {
        const valor = datos[campo]
        // Para selects, si el valor es "0" (opción por defecto), también se considera vacío
        if (campo === 'combustible' && valor === '0') return true
        return !valor || valor.toString().trim() === ''
      })

      if (camposVacios.length > 0) {
        await actualizarUI(() => {
          mostrarMensaje({ msg: 'Debe llenar todos los campos obligatorios', type: 'error' })
          elementos.btnRegistrar.disabled = false
          hideSpinner()
        })
        return
      }

      try {
        const respuesta = await fetchApi('/api/cargas', 'POST', datos)
        await respuestaFetch({ respuesta, formularios: elementos.formCargaCombustible })
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
    // Otros manejadores optimizados para cargar datos en la pagina
    async handleInicairDivsCentroCoste () {
      elementos.optionCentroCoste.innerHTML = ''
      const urlCentroCoste = '/api/centroCostess'
      try {
        const [respCentroCoste] = await Promise.all([fetch(urlCentroCoste)])
        if (!respCentroCoste.ok) {
          throw new Error('No se pudo obtener LOS DATOS. Respuesta inesperada del servidor.')
        }

        // eslint-disable-next-line no-undef
        elementos.optionCentroCoste.append(new Option('Selecciona un centro de coste', 0))

        const centroCoste = await respCentroCoste.json()
        console.log(centroCoste)
        if (elementos.formAgregarSalida || elementos.formAgregarInv) {
          centroCoste.forEach(centroCoste => {
          // eslint-disable-next-line no-undef
            elementos.optionCentroCoste.append(new Option(centroCoste.cc, centroCoste.cc))
          })
        } else if (elementos.formCargaCombustible) {
          centroCoste.forEach(centroCoste => {
          // eslint-disable-next-line no-undef
            elementos.optionCentroCoste.append(new Option(centroCoste.CustomCentrocoste, centroCoste.CustomCentrocoste))
          })
        }
      } catch (error) {
        console.log(error)
      }
    },

    // aqui se estan cargando los nuemors econiicos de la tabla  catalogo_unidad_combustible
    async handleInicairDivsUnidades () {
      elementos.optionEconomico.innerHTML = ''
      const urlEconomico = '/api/unidadesCombustibles'
      try {
        const [respUnidades] = await Promise.all([fetch(urlEconomico)])
        if (!respUnidades.ok) {
          throw new Error('No se pudo obtener LOS DATOS. Respuesta inesperada del servidor.')
        }

        // eslint-disable-next-line no-undef
        elementos.optionEconomico.append(new Option('Selecciona una unidad', 0))

        const unidades = await respUnidades.json()
        unidades.forEach(unidades => {
          // eslint-disable-next-line no-undef
          elementos.optionEconomico.append(new Option(unidades.no_economico, unidades.id))
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
    async handleUltimoKm (e) {
      e.preventDefault()
      showSpinner()
      const id = e.target.value
      const ultimoKilometraje = document.getElementById('kilometraje')
      ultimoKilometraje.value = ''
      const url = `/api/cargas/${id}`
      const respuesta = await fetchApi(url, 'GET')
      const res = await respuestaFetch({ respuesta })
      console.log(res)

      if (res && res.ultimoKilometraje && typeof res !== 'undefined' && res.ultimoKilometraje.km !== null) {
        ultimoKilometraje.value = res.ultimoKilometraje.km
      } else {
        ultimoKilometraje.value = 0
      }
    },
    async handleRendimineto (e) {
      e.preventDefault()
      showSpinner()
      const ultimoKilometrajeInput = document.getElementById('kilometraje')
      const kmRecorridoInput = document.getElementById('km_recorridos')
      if (!ultimoKilometrajeInput || !kmRecorridoInput) {
        hideSpinner()
        return mostrarMensaje({ msg: 'No se encontró el campo de kilometraje o km recorridos', type: 'error' })
      }
      const kilometraje = Number(e.target.value)
      const ultimoKilometraje = Number(ultimoKilometrajeInput.value)
      if (isNaN(kilometraje) || isNaN(ultimoKilometraje)) {
        hideSpinner()
        return mostrarMensaje({ msg: 'Debe ingresar valores numéricos válidos para el kilometraje', type: 'error' })
      }
      const kmRecorridos = kilometraje - ultimoKilometraje
      if (kilometraje < ultimoKilometraje) {
        kmRecorridoInput.value = ''
        mostrarMensaje({ msg: 'El kilometraje no puede ser menor que el ultimo registrado', type: 'error' })
        return hideSpinner()
      } else if (kmRecorridos < 0) {
        kmRecorridoInput.value = ''
        mostrarMensaje({ msg: 'No puede agregar kilometros recorridos, verificar la información', type: 'error' })
        return hideSpinner()
      }
      kmRecorridoInput.value = kmRecorridos
      hideSpinner()
    }
  }

  if (elementos.formAgregarInv) {
    actualizarUI(async () => {
      handlers.handleInicairDivsCentroCoste()
    })
    elementos.formAgregarInv.addEventListener('submit', handlers.handleSubmitAgregarCombustible)
  }
  if (elementos.formAgregarSalida) {
    actualizarUI(async () => {
      handlers.handleInicairDivsCentroCoste()
    })
    elementos.formAgregarSalida.addEventListener('submit', handlers.handleSubmitAgregarSalidaCombustible)
  }
  if (elementos.formCargaCombustible) {
    actualizarUI(async () => {
      handlers.handleInicairDivsCentroCoste()
      handlers.handleInicairDivsUnidades()
      elementos.formCargaCombustible.addEventListener('submit', handlers.handleSubmitCargaCombustible)
    })
  }

  // botones
  if (elementos.btnRegresar) {
    elementos.btnRegresar.addEventListener('click', handlers.handleRegresar)
  }

  // Inicialización de tablas optimizada
  if (elementos.tablaEntrada) {
    actualizarUI(async () => {
      iniciarEntrada()
      await verEntrada()
    })
  }
  if (elementos.tablaSalida) {
    actualizarUI(async () => {
      iniciarSalida()
      await verSalida()
    })
  }
  if (elementos.tablaCarga) {
    actualizarUI(async () => {
      iniciarCarga()
      await verCarga()
    })
  }
  if (elementos.tablaInventario) {
    actualizarUI(async () => {
      iniciarInventario()
      await verInventario()
    })
  }

  // // funciones para selects
  if (elementos.optionEconomico) {
    elementos.optionEconomico.addEventListener('change', handlers.handleUltimoKm)
  }

  // funciones input
  if (elementos.inptuKilometraje) {
    elementos.inptuKilometraje.addEventListener('blur', handlers.handleRendimineto)
  }
})
