/* eslint-disable no-undef */
// import { fetchApi, showMessage, mostrarMensaje } from '../funciones.js'
import { mostrarMensaje, fetchApi, showMessage } from '../mensajes.js'
import { hideSpinner, showSpinner } from '../spinner.js'
import { inicializarFormulario } from './listaProductos.js'
import { SolicitudFormulario } from '../solicitud/cerrarMezcla.js'

import { iniciarPendiente, verPendiente } from './tablaSolicitudPendiente.js'
import { iniciarProductosReceta, verProductosReceta } from '../productosReceta/productos.js'
import { iniciarProceso, verProceso } from './tablaSolicitudProceso.js'
document.addEventListener('DOMContentLoaded', () => {
  // Cachear referencias DOM
  const elementos = {
    // TABLAS
    tablaPendiente: document.getElementById('tbPendientes'),
    tablaProceso: document.getElementById('tbProceso'),
    tablaReceta: document.getElementById('tbReceta'),

    // FORMULARIOS
    formEmpresa: document.getElementById('formEmpresa'),
    formProducto: document.getElementById('formProducto'),

    // SELECT OPTION
    optionCentroCoste: document.getElementById('centro_coste'),
    optionEstado: document.getElementById('estadoE'),

    // BOTONES
    btnRegresar: document.getElementById('regresarInicio'),
    btnRegistrar: document.getElementById('btnRegistrar'),
    btnReceta: document.getElementById('btnReceta'),
    btnRegresartabla: document.getElementById('regresatabla'),
    btnReporte: document.getElementById('btnReporte'),
    btnDescargar: document.getElementById('btnDescargar'),
    btnNuevoProducto: document.getElementById('btnNuevoProducto'),
    btnEnviarEstado: document.getElementById('btnEnviarEstado'),
    btnGuardarMescla: document.getElementById('btnGuardarMescla'),
    btnCerrarMescla: document.getElementById('btnCerrarMescla'),
    // OTROS
    productosContainer: document.getElementById('productosContainer'),
    regresarCerrar: document.getElementById('regresarCerrar')
  }
  // Función para actualizar UI de forma optimizada
  const actualizarUI = (callback) => {
    return new Promise(resolve => {
      // eslint-disable-next-line no-undef
      requestAnimationFrame(async () => {
        const resultado = await callback() // 🟢 ahora sí lo esperas
        resolve(resultado) // 🟢 y lo devuelves
      })
    })
  }
  // Validad Campos
  const validarFormulario = async (camposRequeridos) => {
    const camposInvalidos = camposRequeridos.filter(campo => {
      const elemento = document.getElementById(campo)
      return !elemento.value.trim()
    })

    if (camposInvalidos.length > 0) {
      await actualizarUI(() => {
        mostrarMensaje(`Por favor complete los siguientes campos: ${camposInvalidos.join(', ')}`, 'error')
        elementos.btnRegistrar.disabled = false
        hideSpinner()
      })
      return false
    }

    return true
  }
  // resolver respuestas fech y mostrar mensajes
  const respuestaFetch = async ({ respuesta, formularios, modal, button }) => {
    const resultado = await actualizarUI(async () => {
      const res = await showMessage(respuesta)
      console.log(res)
      if (res === true) {
        hideSpinner()
        if (formularios) formularios.reset()
        // eslint-disable-next-line no-undef
        const modalReset = $(`#${modal}`)
        modalReset.modal('hide')
        button.disabled = false
      } else {
        hideSpinner()
        button.disabled = false
      }
      return res // Importante: retornar el resultado
    })
    return resultado // Importante: retornar el resultado final
  }
  const descargarReporte = async ({ url, metod, data }) => {
    try {
      // Esperar la respuesta del fetch
      const response = await fetchApi(url, metod, data)

      // Validar la respuesta
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al descargar el archivo')
      }

      // Obtener el blob de la respuesta
      const blob = await response.blob()

      // Crear URL del blob
      const blobUrl = window.URL.createObjectURL(blob)

      // Crear y configurar el elemento <a>
      const downloadLink = document.createElement('a')
      downloadLink.href = blobUrl
      downloadLink.download = `solicitudes_${new Date().toISOString().split('T')[0]}.xlsx`

      // Simular click y limpiar
      document.body.appendChild(downloadLink)
      downloadLink.click()
      document.body.removeChild(downloadLink)

      // Liberar el objeto URL
      window.URL.revokeObjectURL(blobUrl)

      return true
    } catch (error) {
      hideSpinner()
      console.error('Error al descargar Excel:', error)
      await mostrarMensaje({
        msg: `Error al descargar el archivo: ${error.message}`,
        type: 'error'
      })
      return false
    } finally {
      hideSpinner()
    }
  }
  // crear campo nuevo
  const crearCampoProducto = () => {
    const nuevoItem = document.createElement('div')
    nuevoItem.classList.add('producto-item')

    const template = `
        <div class="form-group d-flex align-items-center">
            <input
                class="form-control me-2" 
                type="text" 
                name="variedad[]" 
                placeholder="Variedad" 
                title="Si no agrega una variedad se agregará como General"
                required
            >
            <button type="button" class="btn btn-danger btn-eliminar">
                 Eliminar
            </button>
        </div>
    `

    nuevoItem.innerHTML = template

    // Agregar el evento de capitalización
    const input = nuevoItem.querySelector('input')
    input.addEventListener('input', (e) => {
      e.target.value = e.target.value
        .toLowerCase()
        .replace(/\b\w/g, c => c.toUpperCase())
    })

    // Agregar el evento de eliminación
    const btnEliminar = nuevoItem.querySelector('.btn-eliminar')
    btnEliminar.addEventListener('click', () => {
      const productosActuales = document.querySelectorAll('.producto-item')
      if (productosActuales.length > 1) {
        nuevoItem.remove()
      } else {
        mostrarMensaje('Debe agregar al menos una variedad', 'info')
      }
    })

    return nuevoItem
  }
  // obtenert datos solicitud inidvidual
  const obtenerDatosSolicitud = async () => {
    const data = {
      id_solicitud: document.getElementById('idSolicitud').value,
      folio: document.getElementById('folioi').value,
      solicita: document.getElementById('solicitai').value,
      fecha_solicitud: document.getElementById('fechai').value,
      rancho_destino: document.getElementById('ranchoi').value,
      centro_coste: document.getElementById('centroCostei').value,
      variedad: document.getElementById('variedadi').value,
      empresa: document.getElementById('empresai').value,
      temporada: document.getElementById('temporadai').value,
      cantidad: document.getElementById('cantidadi').value,
      presentacion: document.getElementById('presentacioni').value,
      metodo_aplicacion: document.getElementById('metodoi').value,
      descripcion: document.getElementById('descripcioni').value
    }
    return data
  }
  // Delegación de eventos
  const handlers = {
    // Manejadores optimizados Submit para los formularios
    async handleSubmitAgregarEquipo (e) {
      e.preventDefault()
      showSpinner()

      await actualizarUI(() => {
        elementos.btnRegistrar.disabled = true
      })

      const formData = new FormData(e.target)
      const datos = Object.fromEntries(formData.entries())

      // Validación de campos requeridos
      const camposRequeridos = [
        'equipo', 'marca', 'modelo', 'ns', 'tag',
        'no_economico'
      ]
      await validarFormulario(camposRequeridos)

      try {
        const respuesta = await fetchApi('/api/equipos', 'POST', datos)
        await respuestaFetch({ respuesta, formularios: elementos.formActivos, modal: 'exampleModal', button: elementos.btnRegistrar })
        if (elementos.tablaActivos) {
          actualizarUI(async () => {
            iniciarActivos()
            await verActivos()
          })
        }
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
    async handleSubmitAgregarProducto (e) {
      e.preventDefault()
      showSpinner()

      await actualizarUI(() => {
        elementos.btnRegistrar.disabled = true
      })

      const formData = new FormData(e.target)
      const producto = formData.getAll('producto[]')
      const unidadesMedida = formData.getAll('unidad_medida[]')
      const cantidades = formData.getAll('cantidad[]')
      const idSolicitud = document.getElementById('idSolicitud').value

      if (!producto || !unidadesMedida) {
        mostrarMensaje({
          msg: 'Por favor, ingrese todos los datos',
          type: 'error'
        })
        return
      }
      if (!cantidades || cantidades <= 0) {
        mostrarMensaje({
          msg: 'Por favor, ingresa una cantidad válida.',
          type: 'error'
        })
        return
      }
      if (!document.getElementById('idSolicitud').value) {
        mostrarMensaje({
          msg: 'Por favor, El id de la solicitud no a sido selecionado.',
          type: 'error'
        })
        return
      }

      const datos = {
        idSolicitud,
        producto: producto[0],
        unidadMedida: unidadesMedida[0],
        cantidad: cantidades[0]
      }
      try {
        const url = '/api/productoSoli'
        const metod = 'POST'
        const respuesta = await fetchApi(url, metod, datos)
        const resp = await respuestaFetch({ respuesta, formularios: elementos.formProducto, modal: 'exampleModal', button: elementos.btnRegistrar })
        console.log(resp)
        if (resp === true) {
          if (elementos.tablaReceta) {
            const rol = document.getElementById('rol').value
            $('#staticBackdrop').modal('show')
            actualizarUI(async () => {
              iniciarProductosReceta(idSolicitud)
              if (rol === 'mezclador' || rol === 'administrativo' || rol === 'master') {
                await verProductosReceta({
                  eliminarUltimaColumna: false,
                  depuracion: true
                })
              } else {
                await verProductosReceta({
                  eliminarUltimaColumna: true,
                  columnaAEliminar: -1, // Última columna
                  depuracion: true
                })
              }
            })
          }
        }
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
    async handleSubmitBajaActivo (e) {
      e.preventDefault()
      showSpinner()

      await actualizarUI(() => {
        elementos.btnRegistrar.disabled = true
      })

      const equipo = document.getElementById('equipoE').value
      const marca = document.getElementById('marcaE').value
      const modelo = document.getElementById('modeloE').value
      const noSeria = document.getElementById('snE').value
      const tag = document.getElementById('tagE').value ? document.getElementById('tagE').value : 'NA'
      //
      const motivo = document.getElementById('motivo').value
      const fechaBaja = document.getElementById('fechaBaja').value
      const lugarBaja = document.getElementById('lugarBaja').value
      const funcionBaja = document.getElementById('funcionBaja').value

      // estos datos son necesarios para cambiar el estado de la equipo
      const idEquipo = document.getElementById('idEquipo').value
      const estado = document.getElementById('estadoE').value
      // const motivoB = document.getElementById('motivoB').value
      if (!idEquipo || !estado || !motivo || !fechaBaja || !lugarBaja || !funcionBaja || !equipo || !marca || !modelo || !noSeria || !tag) {
        await actualizarUI(() => {
          mostrarMensaje('Debe llenar todos los campos son obligatorios', 'error')
          elementos.btnRegistrar.disabled = false
          hideSpinner()
        })
        return
      }
      const datos = {
        estado,
        motivo
      }
      try {
        const respuesta = await fetchApi(`/api/equipo/estado/${idEquipo}`, 'PUT', datos)
        const res = await respuestaFetch({ respuesta, formularios: elementos.formBajaActivo, modal: 'modalBaja', button: elementos.btnRegistrar })
        if (elementos.tablaActivos) {
          actualizarUI(async () => {
            iniciarActivos()
            await verActivos()
          })
        }
        if (res === true) {
          const url = `/pdf/acta-baja?idEquipo=${idEquipo}&equipo=${equipo}&marca=${marca}&modelo=${modelo}&noSerie=${noSeria}&tag=${tag}&motivo=${motivo}&fechaBaja=${fechaBaja}&lugarBaja=${lugarBaja}&funcionBaja=${funcionBaja}`
          setTimeout(() => {
            window.open(url, 'Baja de equipos', 'width=920,height=600,scrollbars=NO')
          }, 1500)
        }
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
    async handleSubmitEditarAsignacion (e) {
      e.preventDefault()
      showSpinner()

      await actualizarUI(() => {
        elementos.btnRegistrar.disabled = true
      })

      const formData = new FormData(e.target)
      const datos = Object.fromEntries(formData.entries())

      // Validación de campos requeridos
      const camposRequeridos = [
        'asignacion_id', 'estadoTabEdit']
      await validarFormulario(camposRequeridos)

      if (formData.get('estadoTabEdit') === 'actulizar') {
        // eslint-disable-next-line no-undef
        const modal = $('#actulizarResponsiva')
        modal.modal('show')
        // eslint-disable-next-line no-undef
        const modal2 = $('#editarAsignacion')
        modal2.modal('hide')
        hideSpinner()

        return
      }

      try {
        const respuesta = await fetchApi(`/api/asignaciones/${datos.asignacion_id}`, 'PUT', datos)
        await respuestaFetch({ respuesta, formularios: elementos.formEditarAsignacion, modal: 'editarAsignacion', button: elementos.btnRegistrar })
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
    async handleSubmitFormEmpresaReporte (e) {
      e.preventDefault()
      showSpinner()

      await actualizarUI(() => {
        elementos.btnRegistrar.disabled = true
      })
      const radioSeleccionado = document.querySelector('input[name="inlineRadioOptions"]:checked')

      if (!radioSeleccionado) {
        mostrarMensaje({
          msg: 'Por favor, selecciona una empresa',
          type: 'error'
        })
        return
      }
      const empresa = radioSeleccionado.value
      const url = `/api/reporte-pendientes/${empresa}`
      const metod = 'GET'
      try {
        await descargarReporte({ url, metod })
        $('#empresasModal').modal('hide') // Cerrar modal después de descargar
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
    // Manejador optimizado para regresar a la página anterior
    handleRegresar () {
      requestAnimationFrame(() => {
        window.history.back()
      })
    },
    handleRegresarTabla () {
      document.getElementById('formPreparadas').style.display = 'none'
      document.getElementById('tablaFuciones').style.display = 'block'
    },
    handleRegresarformCerrar () {
      document.getElementById('formCerrar').style.display = 'none'
      document.getElementById('formPreparadas').style.display = 'block'
    },
    async handleBtnReporte (e) {
      e.preventDefault()
      showSpinner()

      const rol = document.getElementById('rol').value
      if (rol === 'mezclador') {
        const url = '/api/reporte-pendientes'
        try {
          await descargarReporte(url)
        } catch (error) {
          hideSpinner()
          mostrarMensaje({
            msg: 'Error al descargar el reporte',
            type: 'error'
          })
        } finally {
          hideSpinner()
        }
      } else if (rol === 'administrativo' || rol === 'master') {
        hideSpinner()
        $('#empresasModal').modal('show')
      }
    },
    async handleBtnNuevoProducto (e) {
      e.preventDefault()

      $('#staticBackdrop').modal('hide')
      $('#exampleModal').modal('show')
      try {
        setTimeout(() => {
          inicializarFormulario()
        }, 150)
      } catch (error) {
        console.log(error)
      }
    },
    async handleBtnReporteIndividual (e) {
      e.preventDefault()
      showSpinner()
      const url = '/api/descargar-solicitud'
      const metod = 'POST'
      const data = await obtenerDatosSolicitud()
      try {
        await descargarReporte({ url, metod, data })
      } catch (error) {
        console.log(error)
      }
    },
    async handlebtnMostarReceta (e) {
      e.preventDefault()
      const idSolicitud = document.getElementById('idSolicitud').value
      const rol = document.getElementById('rol').value
      $('#staticBackdrop').modal('show')
      iniciarProductosReceta(idSolicitud)
      if (rol === 'mezclador' || rol === 'administrativo' || rol === 'master') {
        await verProductosReceta({
          eliminarUltimaColumna: false,
          depuracion: true
        })
      } else {
        await verProductosReceta({
          eliminarUltimaColumna: true,
          columnaAEliminar: -1, // Última columna
          depuracion: true
        })
      }
    },
    async handleBtnEnviaEstadoProductos (e) {
      e.preventDefault()
      showSpinner()
      const idSolicitud = document.getElementById('idSolicitud').value
      const estados = {
        id_solicitud: idSolicitud,
        estados: [], // Inicializa el array de estados
        mensaje: '' // Inicializamos el campo mensaje
      }
      let todosSeleccionados = true // Variable para verificar si todos los radios están seleccionados
      // Recorre todos los grupos de radio buttons en la tabla
      $('#tbReceta input[type="radio"]:checked').each(function (e) {
        const name = $(this).attr('name') // Obtener el atributo name
        if (name) {
          const id = name.split('_')[1] // Obtener el id del producto
          const valorSeleccionado = $(this).val() // Obtener el valor del radio button seleccionado

          // Solo agregar el producto si el estado es "existe" o "no_existe"
          if (valorSeleccionado === '1' || valorSeleccionado === '0') {
            // aqui agregamos al objeto estados los valores de la receta
            estados.estados.push({
              id_receta: id,
              existe: valorSeleccionado === '1' // true si "existe", false si "no existe"
            })
            if (valorSeleccionado === '0') {
              document.getElementById('notaMezcla').setAttribute('required', 'required')
            }
          } else {
            hideSpinner()
            console.warn(`El estado para el producto con ID ${id} no es válido: ${valorSeleccionado}`)
          }
        } else {
          hideSpinner()
          console.error('El atributo name no está definido para el radio button')
        }
      })

      // Validar que todos los grupos de radio buttons tengan una opción seleccionada
      $('#tbReceta input[type="radio"]').each(function (e) {
        const name = $(this).attr('name')
        if (name && !$(`input[name="${name}"]:checked`).length) {
          todosSeleccionados = false // Si hay un grupo sin selección, cambiar a false
        }
      })
      if (!todosSeleccionados) {
        hideSpinner()
        mostrarMensaje({
          msg: 'Por favor, selecciona una opción para cada producto.',
          type: 'error'
        })
        return
      }
      // Validar que hay estados para enviar
      if (estados.length === 0) {
        hideSpinner()
        mostrarMensaje({
          msg: 'No hay estados para enviar.',
          type: 'error'
        })
        return
      }
      console.log(estados)
      // Continuar con la lógica de envío...
      try {
        const url = '/api/actualizarEstadoProductos'
        const metod = 'POST'
        const response = await fetchApi(url, metod, estados)
        if (response.ok) {
          hideSpinner()
          const result = await response.json()
          mostrarMensaje({
            msg: result.message,
            type: 'success'
          })

          $('#exampleModal').modal('hide')
          $('#staticBackdrop').modal('hide')
          const opciones = estados.estados
          const todosExisten = opciones.every(estado => estado.existe === true)

          if (todosExisten === true) {
            document.getElementById('btnGuardarMescla').style.display = 'block'
          }
        } else {
          hideSpinner()
          const result = await response.json() // Asegúrate de obtener el resultado en caso de error
          mostrarMensaje({
            msg: result.error,
            type: 'error'
          })
        }
      } catch (error) {
        hideSpinner()
        console.error('Error en la conexión:', error)
        mostrarMensaje({
          msg: error.message || 'Error desconocido',
          type: 'error'
        })
      }
    },
    async handleBtnGuardarMescla (e) {
      e.preventDefault()
      showSpinner()

      await actualizarUI(() => {
        elementos.btnGuardarMescla.disabled = true
      })
      const idSolicitud = document.getElementById('idSolicitud').value
      const notaMezcla = document.getElementById('notaMezcla').value
      if (!idSolicitud) {
        mostrarMensaje({ msg: 'No se encontro el id de solicitud volver a realizar el proceso', type: 'error' })
        return
      }
      const data = {
        notaMezcla,
        status: 'Proceso'
      }
      const url = `/api/solicitudProceso/${idSolicitud}`
      const metod = 'PATCH'
      try {
        const respuesta = await fetchApi(url, metod, data)
        const res = await respuestaFetch({ respuesta, button: elementos.btnGuardarMescla })
        console.log(res)
        if (res === true) {
          document.getElementById('formPreparadas').style.display = 'none'
          document.getElementById('tablaFuciones').style.display = 'block'
          if (elementos.tablaPendiente) {
            actualizarUI(async () => {
              iniciarPendiente()
              await verPendiente()
            })
          }
        }
      } catch (error) {
        hideSpinner()
        await actualizarUI(() => {
          mostrarMensaje({ msg: error.message, type: 'error' })
        })
      } finally {
        hideSpinner()
        await actualizarUI(() => {
          elementos.btnGuardarMescla.disabled = false
        })
      }
    },
    async handleBtnCerrarMescla (e) {
      e.preventDefault()
      document.getElementById('formCerrar').style.display = 'block'
      document.getElementById('formPreparadas').style.display = 'none'
      document.getElementById('idMesclas').value = document.getElementById('folioi').value
      document.addEventListener('DOMContentLoaded', () => new SolicitudFormulario())
    },
    // agregar campo para variedades
    async handleAgregarVariedad () {
      // Crear nuevo campo de producto
      const nuevoCampo = await crearCampoProducto()

      // Agregar al contenedor
      elementos.productosContainer.appendChild(nuevoCampo)
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
        centroCoste.forEach(centroCoste => {
          // eslint-disable-next-line no-undef
          elementos.optionCentroCoste.append(new Option(centroCoste.centroCoste, centroCoste.centroCoste))
        })
      } catch (error) {
        console.log(error)
      }
    },
    async handleInicairDivsformAsignacion () {
      const usuarioTab = document.getElementById('usuario')
      const equipo = document.getElementById('equipo')
      usuarioTab.innerHTML = ''
      equipo.innerHTML = ''

      // eslint-disable-next-line no-undef
      equipo.append(new Option('Selecciona un equipo'))
      // eslint-disable-next-line no-undef
      usuarioTab.append(new Option('Selecciona un usuario'))

      const urlUsuario = '/api/empleados'
      const urlEquipo = '/api/equipos'
      try {
        const [respEquipo, respUsuario] = await Promise.all([fetch(urlEquipo), fetch(urlUsuario)])
        if (!respUsuario.ok || !respEquipo.ok) {
          throw new Error('No se pudo obtener LOS DATOS. Respuesta inesperada del servidor.')
        }

        const usuariosData = await respUsuario.json()
        const equiposData = await respEquipo.json()

        // Verificar que los datos sean arrays y tengan la propiedad data
        if (Array.isArray(usuariosData) && usuariosData.length > 0) {
          let nombre = ''
          usuariosData.forEach(usuario => {
            nombre = `${usuario.nombre} ${usuario.apellido_paterno}`
            const option = document.createElement('option')
            option.value = usuario.id
            option.textContent = nombre
            option.dataset.id = usuario.id
            usuarioTab.appendChild(option)
          })
        }
        if (Array.isArray(equiposData) && equiposData.length > 0) {
          equiposData.forEach(equip => {
            const option = document.createElement('option')
            option.value = equip.ns
            option.textContent = equip.equipo
            option.dataset.id = equip.id
            equipo.appendChild(option)
          })
        }
      } catch (error) {
        console.log(error)
      }
    }
  }

  if (elementos.formEmpresa) {
    elementos.formEmpresa.addEventListener('submit', handlers.handleSubmitFormEmpresaReporte)
  }
  if (elementos.formProducto) {
    elementos.formProducto.addEventListener('submit', handlers.handleSubmitAgregarProducto)
  }
  // Manejador para el cambio de estado
  if (elementos.optionEstado) {
    elementos.optionEstado.addEventListener('change', handlers.handleEstadoChange)
  }
  // botones
  if (elementos.btnRegresar) {
    elementos.btnRegresar.addEventListener('click', handlers.handleRegresar)
  }
  if (elementos.btnAgregarProducto) {
    elementos.btnAgregarProducto.addEventListener('click', handlers.handleAgregarVariedad)
  }
  if (elementos.btnReceta) {
    elementos.btnReceta.addEventListener('click', handlers.handlebtnMostarReceta)
  }
  if (elementos.btnRegresartabla) {
    elementos.btnRegresartabla.addEventListener('click', handlers.handleRegresarTabla)
  }
  if (elementos.btnReporte) {
    elementos.btnReporte.addEventListener('click', handlers.handleBtnReporte)
  }
  if (elementos.btnDescargar) {
    elementos.btnDescargar.addEventListener('click', handlers.handleBtnReporteIndividual)
  }
  if (elementos.btnNuevoProducto) {
    elementos.btnNuevoProducto.addEventListener('click', handlers.handleBtnNuevoProducto)
  }
  if (elementos.btnEnviarEstado) {
    elementos.btnEnviarEstado.addEventListener('click', handlers.handleBtnEnviaEstadoProductos)
  }
  if (elementos.regresarCerrar) {
    elementos.regresarCerrar.addEventListener('click', handlers.handleRegresarformCerrar)
  }

  if (elementos.btnGuardarMescla) {
    elementos.btnGuardarMescla.addEventListener('click', handlers.handleBtnGuardarMescla)
  }
  if (elementos.btnCerrarMescla) {
    elementos.btnCerrarMescla.addEventListener('click', handlers.handleBtnCerrarMescla)
  }

  // Inicialización de tablas optimizada
  if (elementos.tablaPendiente) {
    actualizarUI(async () => {
      iniciarPendiente()
      await verPendiente()
    })
  }
  if (elementos.tablaProceso) {
    actualizarUI(async () => {
      iniciarProceso()
      await verProceso()
    })
  }
})
