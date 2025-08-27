/* eslint-disable no-undef */
import { mostrarMensaje, fetchApi, showMessage } from '../funciones.js'
import { hideSpinner, showSpinner } from '../spinner.js'
// Tablas
import { iniciarReporteMezcla, verReporteMezcla } from './tablaReporteMesclas.js'

document.addEventListener('DOMContentLoaded', () => {
  // if (typeof datosParaLaTabla !== 'undefined' && Array.isArray(datosParaLaTabla)) {
  //   console.log('Datos para la tabla:', datosParaLaTabla)
  // } else {
  //   console.error('Los datos para la tabla (datosParaLaTabla) no están disponibles o no son un array.')
  // }
  // Cachear referencias DOM
  const elementos = {
    // TABLAS
    tbReporteMezcla: document.getElementById('tbReporteMezcla'),

    // FORMULARIOS
    formEmpresa: document.getElementById('formEmpresa'),
    // SELECT OPTION
    optionCentroCoste: document.getElementById('centro_coste'),

    // BOTONES
    btnRegresar: document.getElementById('regresarInicio'),
    btnRegistrar: document.getElementById('btnRegistrar'),
    btnSalidaCombus: document.getElementById('btnSalidaCombus'),
    btnEntradaCombus: document.getElementById('btnEntradaCombus'),
    // OTROS
    btnDescargar: document.getElementById('descargarReporte'),
    btnDescargarV2: document.getElementById('descargarReporteV2')
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
    // Manejador optimizado para regresar a la página anterior
    handleRegresar () {
      requestAnimationFrame(() => {
        window.history.back()
      })
    },

    async handleBtnReporte (e) {
      e.preventDefault()
      showSpinner()
      const data = $('#tbReporteMezcla').DataTable().rows({ filter: 'applied' }).data().toArray()
      const url = '/api/descargarReporte'
      const metod = 'POST'
      console.log(data)
      try {
        await descargarReporte({ url, metod, data })
      } catch (error) {
        console.log(error)
      }
    },
    async handleBtnReporteV2 (e) {
      e.preventDefault()
      showSpinner()
      const data = $('#tbReporteMezcla').DataTable().rows({ filter: 'applied' }).data().toArray()
      const url = '/api/descargarReporte-v2'
      const metod = 'POST'
      console.log(data)
      try {
        await descargarReporte({ url, metod, data })
      } catch (error) {
        console.log(error)
      }
    }
  }

  if (elementos.btnDescargar) {
    elementos.btnDescargar.addEventListener('click', handlers.handleBtnReporte)
  }
  if (elementos.btnDescargarV2) {
    elementos.btnDescargarV2.addEventListener('click', handlers.handleBtnReporteV2)
  }
  // Inicialización de tablas optimizada

  if (elementos.tbReporteMezcla) {
    actualizarUI(async () => {
      iniciarReporteMezcla()
      await verReporteMezcla()
    })
  }

  // inicialñizamos graficas una ves cargada la pagina de graficas
  // if (document.getElementById('almacenChart') && document.getElementById('centroCosteChart')) {
  //   inicializarDashboard()
  // }
})
