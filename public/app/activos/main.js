/* eslint-disable no-undef */
import { fetchApi, fetchApiDoc, showMessage, mostrarMensaje } from '../funciones.js'
import { hideSpinner, showSpinner } from '../spinner.js'
import {
  iniciarActivos,
  verActivos,
  mostrarDetallesAsignacion,
  mostrarDetallesInactivo,
  mostrarDetallesMantenimiento,
  mostrarDetallesReparacion
} from './tablaActivos.js'
import { iniciarAsignaciones, verAsignaciones } from './tablaAsignaciones.js'
import { iniciarActivosBaja, verActivosBaja } from './tablaActivosBaja.js'
import { iniciarHistorialAsignacion, verHistorialAsignacion } from './tablaHistorialAsignaciones.js'
import { iniciarHistorialEquipos, verHistorialEquipos } from './tablaHistorialEquipos.js'
import { iniciarEmpleados, verEmpleados } from './tablaEmpleados.js'
import { iniciarUsuarios, verUsuarios } from './tablaUsuarios.js'
import { iniciarProductos, verProductos } from './tablaProductos.js'
import { iniciarCentroCoste, verCentroCoste } from './tablaCentroCoste.js'
import { iniciarSolicitudesCanceladasADM, verSolicitudesCanceladasADM } from './tablaSolicitudesCanceladaADM.js'
import { iniciarConfimaciones } from './tablaConfirmacion.js'
import { iniciarEntradaInventario, verEntradaInventario } from './tablaEntradaInventario.js'
import { iniciarSalidaInventario, verSalidaInventario } from './tablaSalidaInventario.js'
import { iniciarCargaCombustible, verCargasCombustible } from './tablaCargasCombustible.js'
import { iniciarInventario, verInventario } from './tablaInventario.js'
import { iniciarEmpresas, verEmpresas } from './tablaEmpresa.js'
import { iniciarDepartamentos, verDepartamentos } from './tablaDepartamentos.js'
import { iniciarRanchos, verRanchos } from './tablaRancho.js'

// Función para capitalizar la primera letra de cada palabra
const capitalizarPalabras = (str) => {
  return str.toLowerCase().replace(/\b\w/g, c => c.toUpperCase())
}

document.addEventListener('DOMContentLoaded', () => {
  // Función para aplicar capitalización a un formulario
  const aplicarCapitalizacion = (form) => {
    if (!form) return
    const inputsTexto = form.querySelectorAll('input[type="text"]')
    inputsTexto.forEach(input => {
      input.addEventListener('input', (e) => {
        const valor = e.target.value
        if (valor !== valor.toUpperCase()) { // No capitalizar si está en mayúsculas
          e.target.value = capitalizarPalabras(valor)
        }
      })
    })
  }

  // Cachear referencias DOM
  const elementos = {
    // TABLAS
    tablaActivos: document.getElementById('tbActivos'),
    tablaAsignaciones: document.getElementById('tbAsignaciones'),
    tablaActivosBaja: document.getElementById('tbActivosBaja'),
    tablaHistorialAsignacion: document.getElementById('tbHistorialAsignacion'),
    tablaHistorialEquipos: document.getElementById('tbHistorialEquipos'),
    tablaEmpleados: document.getElementById('tbEmpleados'),
    tablaUsuarios: document.getElementById('tbUsuarios'),
    tablaProductos: document.getElementById('tbProductos'),
    tablaCentroCoste: document.getElementById('tbCentroCoste'),
    tablaSolicitudesCanceladasADM: document.getElementById('tbSolicitudesCanceladas'),
    tablaConfirmacion: document.getElementById('tbConfirmacion'),
    tablaEntradaInventario: document.getElementById('tbEntrada'),
    tablaSalidaInventario: document.getElementById('tbSalidas'),
    tablaCargasCombustible: document.getElementById('tbCargas'),
    tablaInventario: document.getElementById('tbInventario'),
    tablaEmpresas: document.getElementById('tbEmpresas'),
    tablaDepartamentos: document.getElementById('tbDepartamentos'),
    tablaRanchos: document.getElementById('tbRanchos'),
    // FORMULARIOS
    formActivos: document.getElementById('formActivos'),
    formUsuarios: document.getElementById('formUsuarios'),
    formFoto: document.getElementById('formFoto'),
    formFactura: document.getElementById('formfacturas'),
    formEditarActivo: document.getElementById('formEditarActivo'),
    formEditarUsuarios: document.getElementById('formEditarUsuarios'),
    formActualizarUsuarios: document.getElementById('formActualizarUsuarios'),
    formBajaActivo: document.getElementById('formBajaActivo'),
    formAsignarActivo: document.getElementById('formAsignartbSalidasActivo'),
    formEditarAsignacion: document.getElementById('formEditarAsignacion'),
    formEditarResponsiva: document.getElementById('formEditarResponsiva'),
    formResetPass: document.getElementById('formResetPass'),
    formBajaActivoDoc: document.getElementById('formBajaActivoDoc'),
    formProducto: document.getElementById('formProducto'),
    formCentroCoste: document.getElementById('formCentroCostes'),
    formCancelacion: document.getElementById('formCancelacion'),
    formEmpresa: document.getElementById('formEmpresa'),
    formDepartamento: document.getElementById('formDepartamento'),
    formRancho: document.getElementById('formRancho'),
    // SELECT OPTION
    optionCentroCoste: document.getElementById('centro_coste'),
    optionEstado: document.getElementById('estadoE'),
    // BOTONES
    btnRegresar: document.getElementById('regresarInicio'),
    btnRegistrar: document.getElementById('btnRegistrar'),
    btnAgregarProducto: document.getElementById('agregarProducto'),
    btnConfirmacion: document.getElementById('btnConfirmacion'),
    btnCancelar: document.getElementById('btnCancelar'),
    btnValidacion: document.getElementById('btnValidacion'),
    // OTROS
    productosContainer: document.getElementById('productosContainer')
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

  // Helper para obtener el botón submit con fallbacks seguros.
  // Usa e.submitter si está disponible (botón que disparó el submit),
  // luego busca dentro del form, después por ID fallback y finalmente el botón global.
  const obtenerSubmitBtn = (e, fallbackId = null) => {
    try {
      if (e && e.submitter) return e.submitter
    } catch (err) {
      // some browsers may throw, sigue con fallbacks
    }
    if (e && e.target) {
      const btnDentro = e.target.querySelector('button[type="submit"]')
      if (btnDentro) return btnDentro
    }
    if (fallbackId) {
      const byId = document.getElementById(fallbackId)
      if (byId) return byId
    }
    return elementos.btnRegistrar || null
  }
  // Validar contraseña
  const validarContraseña = async (contrasena, contrasenaRep) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]{8,}$/

    if (!regex.test(contrasena)) {
      hideSpinner()
      await mostrarMensaje('La contraseña no cumple con los requisitos', 'info', true)
      return false
    }

    if (contrasena !== contrasenaRep) {
      hideSpinner()
      await mostrarMensaje('Las contraseñas no coinciden', 'info', true)
      return false
    }

    return true
  }
  // Validad Campos
  const validarFormulario = async (camposRequeridos) => {
    const camposInvalidos = camposRequeridos.filter(campo => {
      const elemento = document.getElementById(campo)
      // Si el elemento no existe, considerarlo inválido para forzar el mensaje
      if (!elemento) return true
      return !elemento.value.trim()
    })

    if (camposInvalidos.length > 0) {
      await actualizarUI(() => {
        mostrarMensaje(`Por favor complete los siguientes campos: ${camposInvalidos.join(', ')}`, 'error')
        // Reactivar botón global de registro si existe
        if (elementos.btnRegistrar) elementos.btnRegistrar.disabled = false
        hideSpinner()
      })
      return false
    }

    return true
  }
  // Función para validar variedades
  const validarVariedades = async () => {
    const variedades = document.querySelectorAll('input[name="variedad[]"]')
    const productosUnicos = new Set()
    const valoresIngresados = []

    // Recolectar todos los valores no vacíos
    variedades.forEach((input) => {
      const valor = input.value.trim()
      if (valor) {
        valoresIngresados.push(valor)
      }
    })

    // Verificar duplicados
    for (let i = 0; i < valoresIngresados.length; i++) {
      const valorActual = valoresIngresados[i].toLowerCase()

      if (productosUnicos.has(valorActual)) {
        // Si encontramos un duplicado, mostramos el mensaje
        hideSpinner()
        await mostrarMensaje(
          `La variedad "${valoresIngresados[i]}" está duplicada. Por favor, ingrese valores únicos.`,
          'error'
        )
        return false
      }

      productosUnicos.add(valorActual)
    }

    // Si no hay al menos una variedad
    if (valoresIngresados.length === 0) {
      await mostrarMensaje('Debe ingresar al menos una variedad', 'error')
      return false
    }

    return true
  }

  const recopilarVariedad = async () => {
    const variedades = []
    const porcentajes = []
    const variedadSeleccionados = document.querySelectorAll('input[name="variedad[]"]')

    variedadSeleccionados.forEach((producto, index) => {
      if (producto.value.trim()) { // Solo agrega valores no vacíos
        variedades.push(producto.value.trim())
        porcentajes.push(index)
      }
    })
    // agrgamos ultima variedad por default
    variedades.push('NSC')
    porcentajes.push(0)
    // Une todas las variedades con comas
    const variedadesString = variedades.join(',')
    const porcentajesString = porcentajes.join(',')

    return {
      variedad: variedadesString,
      porcentajes: porcentajesString
    }
  }
  // resolver respuestas fech y mostrar mensajes
  const respuestaFetch = async ({ respuesta, formularios, modal, button }) => {
    const resultado = await actualizarUI(async () => {
      const res = await showMessage(respuesta)
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
  // Función para alternar la visibilidad de la contraseña
  const togglePassword = (inputId, toggleId) => {
    const input = document.getElementById(inputId)
    const toggle = document.getElementById(toggleId)

    toggle.addEventListener('click', function (e) {
      e.preventDefault()

      // Cambiar el tipo de input
      const type = input.getAttribute('type') === 'password' ? 'text' : 'password'
      input.setAttribute('type', type)

      // Cambiar el texto del enlace
      this.textContent = type === 'password' ? 'Mostrar contraseña' : 'Ocultar contraseña'
    })
  }
  //
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
  // Delegación de eventos
  const handlers = {
    // Manejadores optimizados Submit para los formularios
    async handleSubmitAgregarEquipo (e) {
      e.preventDefault()
      showSpinner()

      // Obtener el botón submit del propio formulario (fallback al global)
      const submitBtn = obtenerSubmitBtn(e)
      await actualizarUI(() => {
        if (submitBtn) submitBtn.disabled = true
        else if (elementos.btnRegistrar) elementos.btnRegistrar.disabled = true
      })

      const formData = new FormData(e.target)
      const datos = Object.fromEntries(formData.entries())

      // Validación de campos requeridos
      const camposRequeridos = [
        'equipo', 'marca', 'modelo', 'ns', 'tag',
        'no_economico'
      ]
      const camposValidos = await validarFormulario(camposRequeridos)

      try {
        if (!camposValidos === false) {
          const respuesta = await fetchApi('/api/equipos', 'POST', datos)
          await respuestaFetch({ respuesta, formularios: elementos.formActivos, modal: 'miModal', button: submitBtn || elementos.btnRegistrar })
          if (elementos.tablaActivos) {
            actualizarUI(async () => {
              iniciarActivos()
              await verActivos()
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
          if (submitBtn) submitBtn.disabled = false
          else if (elementos.btnRegistrar) elementos.btnRegistrar.disabled = false
        })
      }
    },
    async handleSubmitCancelacion (e) {
      e.preventDefault()
      showSpinner()

      const submitBtn = obtenerSubmitBtn(e)
      await actualizarUI(() => {
        if (submitBtn) submitBtn.disabled = true
        else if (elementos.btnRegistrar) elementos.btnRegistrar.disabled = true
      })

      const formData = new FormData(e.target)
      const datos = Object.fromEntries(formData.entries())
      const id = document.getElementById('idSolicit').value
      // Validación de campos requeridos
      if (!datos.motivo || !id) {
        hideSpinner()
        elementos.btnRegistrar.disabled = false
        return mostrarMensaje('No puede haber campos vacios', 'info')
      }
      const data = {
        motivo: datos.motivo,
        validacion: false
      }
      try {
        const url = `/api/cancelarSolicitud/${id}`
        const metodo = 'PATCH'
        const respuesta = await fetchApi(url, metodo, data)
        await respuestaFetch({ respuesta, formularios: elementos.formCancelacion, modal: 'modalCancelacion', button: submitBtn || elementos.btnRegistrar })
        if (elementos.tablaConfirmacion) {
          actualizarUI(async () => {
            await iniciarConfimaciones()
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
          if (submitBtn) submitBtn.disabled = false
          else if (elementos.btnRegistrar) elementos.btnRegistrar.disabled = false
        })
      }
    },
    async handleSubmitConfirmacion (e) {
      e.preventDefault()
      showSpinner()

      await actualizarUI(() => {
        elementos.btnConfirmacion.disabled = true
      })

      const id = document.getElementById('idSolicit').value
      const datos = []
      datos.push({
        id_solicitud: id,
        validacion: true
      })

      try {
        const respuesta = await fetchApi('/api/validacion/', 'POST', datos)
        await respuestaFetch({ respuesta, modal: 'modalInformacion', button: elementos.btnConfirmacion })
        if (elementos.tablaConfirmacion) {
          actualizarUI(async () => {
            await iniciarConfimaciones()
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
          elementos.btnConfirmacion.disabled = false
        })
      }
    },
    async handleSubmitAgregarProducto (e) {
      e.preventDefault()
      showSpinner()

      const submitBtn = obtenerSubmitBtn(e)
      await actualizarUI(() => {
        if (submitBtn) submitBtn.disabled = true
        else if (elementos.btnRegistrar) elementos.btnRegistrar.disabled = true
      })

      const formData = new FormData(e.target)
      const datos = Object.fromEntries(formData.entries())

      // Validación de campos requeridos
      const camposRequeridos = [
        'nombre', 'id_sap', 'descripcion', 'unidad_medida'
      ]
      const camposValidos = await validarFormulario(camposRequeridos)

      // Verificar si es edición o creación
      let url, method
      if (document.getElementById('id').value) {
        url = `/api/productos/${document.getElementById('id').value}`
        method = 'PUT'
      } else {
        url = '/api/productos'
        method = 'POST'
      }

      try {
        if (!camposValidos === false) {
          const respuesta = await fetchApi(url, method, datos)
          await respuestaFetch({ respuesta, formularios: elementos.formProducto, modal: 'exampleModal', button: submitBtn || elementos.btnRegistrar })
          if (elementos.tablaProductos) {
            actualizarUI(async () => {
              iniciarProductos()
              await verProductos()
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
          if (submitBtn) submitBtn.disabled = false
          else if (elementos.btnRegistrar) elementos.btnRegistrar.disabled = false
        })
      }
    },
    async handleSubmitAgregarEmpresa (e) {
      e.preventDefault()
      showSpinner()

      const submitBtn = obtenerSubmitBtn(e)
      await actualizarUI(() => {
        if (submitBtn) submitBtn.disabled = true
        else if (elementos.btnRegistrar) elementos.btnRegistrar.disabled = true
      })

      const formData = new FormData(e.target)
      const datos = Object.fromEntries(formData.entries())

      // Validación de campos requeridos
      const camposRequeridos = [
        'razon_social', 'nombre_comercial', 'rfc'
      ]
      const camposValidos = await validarFormulario(camposRequeridos)

      // Verificar si es edición o creación
      let url, method
      if (document.getElementById('id').value) {
        url = `/api/catalogos/empresas/${document.getElementById('id').value}`
        method = 'PATCH'
      } else {
        url = '/api/catalogos/empresas'
        method = 'POST'
      }

      try {
        if (!camposValidos === false) {
          const respuesta = await fetchApi(url, method, datos)
          await respuestaFetch({ respuesta, formularios: elementos.formEmpresa, modal: 'modalEmpresa', button: submitBtn || elementos.btnRegistrar })
          if (elementos.tablaEmpresas) {
            actualizarUI(async () => {
              iniciarEmpresas()
              await verEmpresas()
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
          if (submitBtn) submitBtn.disabled = false
          else if (elementos.btnRegistrar) elementos.btnRegistrar.disabled = false
        })
      }
    },
    async handleSubmitAgregarDepartamento (e) {
      e.preventDefault()
      showSpinner()

      const submitBtn = obtenerSubmitBtn(e)
      await actualizarUI(() => {
        if (submitBtn) submitBtn.disabled = true
        else if (elementos.btnRegistrar) elementos.btnRegistrar.disabled = true
      })

      const formData = new FormData(e.target)
      const datos = Object.fromEntries(formData.entries())

      // Validación de campos requeridos
      const camposRequeridos = [
        'departamento'
      ]
      const camposValidos = await validarFormulario(camposRequeridos)

      // Verificar si es edición o creación
      let url, method
      if (document.getElementById('id').value) {
        url = `/api/catalogos/departamentos/${document.getElementById('id').value}`
        method = 'PATCH'
      } else {
        url = '/api/catalogos/departamentos'
        method = 'POST'
      }

      try {
        if (!camposValidos === false) {
          const respuesta = await fetchApi(url, method, datos)
          await respuestaFetch({ respuesta, formularios: elementos.formDepartamento, modal: 'modalDepartamento', button: submitBtn || elementos.btnRegistrar })
          if (elementos.tablaDepartamentos) {
            actualizarUI(async () => {
              iniciarDepartamentos()
              await verDepartamentos()
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
          if (submitBtn) submitBtn.disabled = false
          else if (elementos.btnRegistrar) elementos.btnRegistrar.disabled = false
        })
      }
    },
    async handleSubmitAgregarRancho (e) {
      e.preventDefault()
      showSpinner()

      const submitBtn = obtenerSubmitBtn(e)
      await actualizarUI(() => {
        if (submitBtn) submitBtn.disabled = true
        else if (elementos.btnRegistrar) elementos.btnRegistrar.disabled = true
      })

      const formData = new FormData(e.target)
      const datos = Object.fromEntries(formData.entries())

      // Validación de campos requeridos
      const camposRequeridos = [
        'rancho'
      ]
      const camposValidos = await validarFormulario(camposRequeridos)

      // Verificar si es edición o creación
      let url, method
      if (document.getElementById('id').value) {
        url = `/api/catalogos/ranchos/${document.getElementById('id').value}`
        method = 'PATCH'
      } else {
        url = '/api/catalogos/ranchos'
        method = 'POST'
      }

      try {
        if (!camposValidos === false) {
          const respuesta = await fetchApi(url, method, datos)
          await respuestaFetch({ respuesta, formularios: elementos.formRancho, modal: 'modalRancho', button: submitBtn || elementos.btnRegistrar })
          if (elementos.tablaRanchos) {
            actualizarUI(async () => {
              iniciarRanchos()
              await verRanchos()
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
          if (submitBtn) submitBtn.disabled = false
          else if (elementos.btnRegistrar) elementos.btnRegistrar.disabled = false
        })
      }
    },
    async handleSubmitAgregarUsuario (e) {
      e.preventDefault()
      showSpinner()

      // Deshabilitar el botón submit del formulario concreto (evita colisiones por ids duplicados)
      const submitBtnUsuario = e.target.querySelector('button[type="submit"]')
      await actualizarUI(() => {
        if (submitBtnUsuario) submitBtnUsuario.disabled = true
      })

      const formData = new FormData(e.target)
      const datos = Object.fromEntries(formData.entries())

      // Validación de campos requeridos
      const camposRequeridos = [
        'empleado_id', 'nombre', 'apellido_paterno', 'apellido_materno', 'departamento'
      ]

      const camposValidos = await validarFormulario(camposRequeridos)
      try {
        if (!camposValidos === false) {
          const respuesta = await fetchApi('/api/empleados', 'POST', datos)
          await respuestaFetch({ respuesta, formularios: elementos.formUsuarios, modal: 'miModal', button: submitBtnUsuario || elementos.btnRegistrar })
        }
      } catch (error) {
        hideSpinner()
        await actualizarUI(() => {
          mostrarMensaje({ msg: error.message, type: 'error' })
        })
      } finally {
        hideSpinner()
        await actualizarUI(() => {
          if (submitBtnUsuario) submitBtnUsuario.disabled = false
          else if (elementos.btnRegistrar) elementos.btnRegistrar.disabled = false
        })
      }
    },
    async handleSubmitAgregarCentroCoste (e) {
      e.preventDefault()
      showSpinner()
      const submitBtn = obtenerSubmitBtn(e)

      try {
        const formData = new FormData(e.target)
        const datos = Object.fromEntries(formData.entries())

        // Validación de campos requeridos
        const camposRequeridos = [
          'centroCoste', 'centroCosteTxt', 'empresa', 'rancho', 'cultivo'
        ]

        if (!(await validarFormulario(camposRequeridos))) {
          hideSpinner()
          return
        }

        // Validar variedades
        if (!(await validarVariedades())) {
          hideSpinner()
          return
        }

        // Recopilar variedades
        const { variedad, porcentajes } = await recopilarVariedad()

        // Preparar datos para enviar
        const data = {
          cc: datos.centroCoste,
          centroCoste: `${datos.centroCoste} ${datos.centroCosteTxt}`,
          CustomCentrocoste: `${datos.empresa} (${datos.centroCosteTxt})`,
          empresa: datos.empresa,
          rancho: datos.rancho,
          cultivo: datos.cultivo,
          variedad: variedad || 'General',
          porcentajes: porcentajes || '100'
        }

        console.log(data)
        // Enviar datos al servidor
        const respuesta = await fetchApi('/api/centroCoste', 'POST', data)

        // Manejar respuesta
        await respuestaFetch({
          respuesta,
          formularios: elementos.formCentroCoste,
          modal: 'staticBackdrop',
          button: submitBtn || elementos.btnRegistrar
        })

        // Actualizar tabla si existe
        if (elementos.tablaCentroCoste) {
          await actualizarUI(async () => {
            iniciarCentroCoste()
            await verCentroCoste()
          })
        }
      } catch (error) {
        console.error('Error:', error)
        mostrarMensaje('Error al guardar el centro de coste', 'error')
      } finally {
        hideSpinner()
        if (submitBtn) submitBtn.disabled = false
        else if (elementos.btnRegistrar) elementos.btnRegistrar.disabled = false
      }
    },
    async handleSubmitAgregarFoto (e) {
      e.preventDefault()
      showSpinner()

      // Obtener el botón submit del propio formulario (fallback al global)
      const submitBtn = obtenerSubmitBtn(e)
      await actualizarUI(() => {
        if (submitBtn) submitBtn.disabled = true
        else if (elementos.btnRegistrar) elementos.btnRegistrar.disabled = true
      })

      const formData = new FormData(e.target)
      const id = document.getElementById('id').value

      const archivoInput = e.target.querySelector('input[type="file"][name="foto"]') || document.getElementById('foto')
      let archivo = null
      if (archivoInput && archivoInput.files && archivoInput.files.length > 0) {
        archivo = archivoInput.files[0]
        // Asegurar que FormData contiene el archivo (puede faltar si el input fue manipulado)
        if (!formData.get('foto')) formData.append('foto', archivo)
      } else {
        archivo = formData.get('foto')
      }

      console.log('archivo direct:', archivo)

      // Validación de campos requeridos y archivo
      if (!id || !archivo) {
        await actualizarUI(() => {
          mostrarMensaje('Debe seleccionar un archivo y proporcionar el ID del equipo', 'error')
          if (submitBtn) submitBtn.disabled = false
          else if (elementos.btnRegistrar) elementos.btnRegistrar.disabled = false
          hideSpinner()
        })
        return
      }

      // Validar tamaño y tipo de archivo
      const tiposPermitidos = ['image/jpeg', 'image/png', 'image/gif']
      const tamañoMaximo = 5 * 1024 * 1024 // 5MB

      if (archivo.size === 0) {
        await actualizarUI(() => {
          mostrarMensaje('El archivo seleccionado está vacío', 'error')
          if (submitBtn) submitBtn.disabled = false
          else if (elementos.btnRegistrar) elementos.btnRegistrar.disabled = false
          hideSpinner()
        })
        return
      }

      if (archivo.size > tamañoMaximo) {
        await actualizarUI(() => {
          mostrarMensaje('El archivo es demasiado grande. El tamaño máximo permitido es 5MB', 'error')
          if (submitBtn) submitBtn.disabled = false
          else if (elementos.btnRegistrar) elementos.btnRegistrar.disabled = false
          hideSpinner()
        })
        return
      }

      if (!tiposPermitidos.includes(archivo.type)) {
        await actualizarUI(() => {
          mostrarMensaje('Formato de archivo no válido. Solo se permiten imágenes JPG, PNG y GIF', 'error')
          if (submitBtn) submitBtn.disabled = false
          else if (elementos.btnRegistrar) elementos.btnRegistrar.disabled = false
          hideSpinner()
        })
        return
      }
      // Asegurar que el ID esté en el FormData
      formData.append('id', id)

      console.log('formData final:', formData)
      try {
        const respuesta = await fetchApiDoc(`/api/equipo/${id}`, 'PUT', formData)
        await respuestaFetch({ respuesta, formularios: elementos.formFoto, modal: 'miModalEquipo', button: submitBtn || elementos.btnRegistrar })
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
          if (submitBtn) submitBtn.disabled = false
          else if (elementos.btnRegistrar) elementos.btnRegistrar.disabled = false
        })
      }
    },
    async handleSubmitAgregarBaja (e) {
      e.preventDefault()
      showSpinner()

      const submitBtn = obtenerSubmitBtn(e)
      await actualizarUI(() => {
        if (submitBtn) submitBtn.disabled = true
        else if (elementos.btnRegistrar) elementos.btnRegistrar.disabled = true
      })

      const formData = new FormData(e.target)
      const id = document.getElementById('id').value
      const archivo = formData.get('baja')

      // Validación de campos requeridos
      if (!id || !archivo || archivo.size === 0) {
        await actualizarUI(() => {
          mostrarMensaje('Debe llenar todos los campos obligatorios', 'error')
          if (submitBtn) submitBtn.disabled = false
          else if (elementos.btnRegistrar) elementos.btnRegistrar.disabled = false
          hideSpinner()
        })
        return
      }

      // Validar tamaño y tipo de archivo (permitir solo documentos pdf)
      const tiposPermitidos = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
      const tamañoMaximo = 5 * 1024 * 1024 // 5MB

      if (archivo.size > tamañoMaximo) {
        await actualizarUI(() => {
          mostrarMensaje('El archivo es demasiado grande. El tamaño máximo permitido es 5MB', 'error')
          if (submitBtn) submitBtn.disabled = false
          else if (elementos.btnRegistrar) elementos.btnRegistrar.disabled = false
          hideSpinner()
        })
        return
      }

      if (!tiposPermitidos.includes(archivo.type)) {
        await actualizarUI(() => {
          mostrarMensaje('Formato de archivo no válido. Solo se permiten documentos Word (.docx)', 'error')
          if (submitBtn) submitBtn.disabled = false
          else if (elementos.btnRegistrar) elementos.btnRegistrar.disabled = false
          hideSpinner()
        })
        return
      }

      try {
        const respuesta = await fetchApiDoc(`/api/equipo/baja/${id}`, 'PUT', formData)
        await respuestaFetch({ respuesta, formularios: elementos.formBajaActivoDoc, modal: 'miModalEquipo', button: submitBtn || elementos.btnRegistrar })
        if (elementos.tablaActivosBaja) {
          actualizarUI(async () => {
            iniciarActivosBaja()
            await verActivosBaja()
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
          if (submitBtn) submitBtn.disabled = false
          else if (elementos.btnRegistrar) elementos.btnRegistrar.disabled = false
        })
      }
    },
    async handleSubmitAgregarFactura (e) {
      e.preventDefault()
      showSpinner()

      const submitBtn = obtenerSubmitBtn(e)
      await actualizarUI(() => {
        if (submitBtn) submitBtn.disabled = true
        else if (elementos.btnRegistrar) elementos.btnRegistrar.disabled = true
      })

      const formData = new FormData(e.target)
      const id = document.getElementById('id').value

      // Intentar obtener el archivo desde el input directamente (fallback)
      const archivoInput = e.target.querySelector('input[type="file"][name="factura"]') || document.getElementById('factura')
      let archivo = null
      if (archivoInput && archivoInput.files && archivoInput.files.length > 0) {
        archivo = archivoInput.files[0]
        if (!formData.get('factura')) formData.append('factura', archivo)
      } else {
        archivo = formData.get('factura')
      }

      console.log('factura archivo directo:', archivo)

      // Validación de campos requeridos
      if (!id || !archivo) {
        await actualizarUI(() => {
          mostrarMensaje('Debe seleccionar un archivo y proporcionar el ID del equipo', 'error')
          if (submitBtn) submitBtn.disabled = false
          else if (elementos.btnRegistrar) elementos.btnRegistrar.disabled = false
          hideSpinner()
        })
        return
      }

      // Validar tamaño y tipo de archivo (permitir PDF e imágenes)
      const tiposPermitidos = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf']
      const tamañoMaximo = 10 * 1024 * 1024 // 10MB para facturas

      if (archivo.size === 0) {
        await actualizarUI(() => {
          mostrarMensaje('El archivo seleccionado está vacío', 'error')
          if (submitBtn) submitBtn.disabled = false
          else if (elementos.btnRegistrar) elementos.btnRegistrar.disabled = false
          hideSpinner()
        })
        return
      }

      if (archivo.size > tamañoMaximo) {
        await actualizarUI(() => {
          mostrarMensaje('El archivo es demasiado grande. El tamaño máximo permitido es 10MB', 'error')
          if (submitBtn) submitBtn.disabled = false
          else if (elementos.btnRegistrar) elementos.btnRegistrar.disabled = false
          hideSpinner()
        })
        return
      }

      if (!tiposPermitidos.includes(archivo.type)) {
        await actualizarUI(() => {
          mostrarMensaje('Formato de archivo no válido. Solo se permiten PDF o imágenes (JPG, PNG, GIF)', 'error')
          if (submitBtn) submitBtn.disabled = false
          else if (elementos.btnRegistrar) elementos.btnRegistrar.disabled = false
          hideSpinner()
        })
        return
      }

      // Asegurar que el ID esté en el FormData
      formData.append('id', id)

      console.log('formData factura final:', formData)
      try {
        const respuesta = await fetchApiDoc(`/api/equipo/factura/${id}`, 'PUT', formData)
        await respuestaFetch({ respuesta, formularios: elementos.formFactura, modal: 'miModalFactura', button: submitBtn || elementos.btnRegistrar })
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
          if (submitBtn) submitBtn.disabled = false
          else if (elementos.btnRegistrar) elementos.btnRegistrar.disabled = false
        })
      }
    },
    async handleSubmitEditarActivo (e) {
      e.preventDefault()
      showSpinner()
      const submitBtn = obtenerSubmitBtn(e)
      await actualizarUI(() => {
        if (submitBtn) submitBtn.disabled = true
        else if (elementos.btnRegistrar) elementos.btnRegistrar.disabled = true
      })
      const formData = new FormData(e.target)
      // Validación de campos requeridos para disponible
      const camposRequeridos = [
        'idEquipo', 'estadoE'
      ]
      // Validación de campos requeridos para baja y otro estado
      const camposRequeridosBaja = [
        'idEquipo', 'estadoE', 'motivoB'
      ]

      const camposRequeridosEditarActivo = [
        'idEquipo', 'equipoE', 'marcaE', 'noEconomicoE', 'modeloE', 'snE', 'tagE'
      ]

      try {
        if (formData.get('estadoE') === 'disponible') {
          await validarFormulario(camposRequeridos)
          const data = {
            estado: formData.get('estadoE')
          }
          const respuesta = await fetchApi(`/api/equipo/estado/${formData.get('idEquipo')}`, 'PUT', data)
          await respuestaFetch({ respuesta, formularios: elementos.formEditarActivo, modal: 'editarEquipo', button: submitBtn || elementos.btnRegistrar })
          if (elementos.tablaActivos) {
            actualizarUI(async () => {
              iniciarActivos()
              await verActivos()
            })
          }
        } else if (formData.get('estadoE') === 'baja') {
          // eslint-disable-next-line no-undef
          const modalbaja = $('#modalBaja')
          modalbaja.modal('show')
          // eslint-disable-next-line no-undef
          const modal = $('#editarEquipo')
          modal.modal('hide')
        } else if (formData.get('estadoE') === 'editar') {
          await validarFormulario(camposRequeridosEditarActivo)
          const data = {
            equipo: formData.get('equipoE'),
            marca: formData.get('marcaE'),
            no_economico: formData.get('noEconomicoE'),
            modelo: formData.get('modeloE'),
            ns: formData.get('snE'),
            tag: formData.get('tagE')
          }
          const respuesta = await fetchApi(`/api/equipos/editar/${formData.get('idEquipo')}`, 'PUT', data)
          await respuestaFetch({ respuesta, formularios: elementos.formEditarActivo, modal: 'editarEquipo', button: submitBtn || elementos.btnRegistrar })
          if (elementos.tablaActivos) {
            actualizarUI(async () => {
              iniciarActivos()
              await verActivos()
            })
          }
        } else {
          if (formData.get('estadoE') !== 'mantenimiento') {
            await validarFormulario(camposRequeridosBaja)
          }
          const data = {
            estado: formData.get('estadoE'),
            motivo: formData.get('motivoB') ? formData.get('motivoB') : 'Mantenimiento'
          }
          const respuesta = await fetchApi(`/api/equipo/estado/${formData.get('idEquipo')}`, 'PUT', data)
          await respuestaFetch({ respuesta, formularios: elementos.formEditarActivo, modal: 'editarEquipo', button: submitBtn || elementos.btnRegistrar })
          if (elementos.tablaActivos) {
            actualizarUI(async () => {
              iniciarActivos()
              await verActivos()
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
          if (submitBtn) submitBtn.disabled = false
          else if (elementos.btnRegistrar) elementos.btnRegistrar.disabled = false
        })
      }
    },
    async handleSubmitBajaActivo (e) {
      e.preventDefault()
      showSpinner()

      const submitBtn = obtenerSubmitBtn(e)
      await actualizarUI(() => {
        if (submitBtn) submitBtn.disabled = true
        else if (elementos.btnRegistrar) elementos.btnRegistrar.disabled = true
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
          if (submitBtn) submitBtn.disabled = false
          else if (elementos.btnRegistrar) elementos.btnRegistrar.disabled = false
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
        const res = await respuestaFetch({ respuesta, formularios: elementos.formBajaActivo, modal: 'modalBaja', button: submitBtn || elementos.btnRegistrar })
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
          if (submitBtn) submitBtn.disabled = false
          else if (elementos.btnRegistrar) elementos.btnRegistrar.disabled = false
        })
      }
    },
    async handleSubmitAsignarActivo (e) {
      e.preventDefault()
      showSpinner()

      // Deshabilitar el botón submit del formulario concreto (evita colisiones por ids duplicados)
      const submitBtnAsignar = e.target.querySelector('button[type="submit"]')
      await actualizarUI(() => {
        if (submitBtnAsignar) submitBtnAsignar.disabled = true
        else if (elementos.btnRegistrar) elementos.btnRegistrar.disabled = true
      })

      const fecha = document.getElementById('fecha').value

      const noEquipoInput = document.getElementById('noEquipo') // Fixed variable name here
      const noEquipoValue = noEquipoInput.value // Use the corrected variable name here

      const noUsuarioInput = document.getElementById('usuarioTab') // Fixed variable name here
      const noUsuarioValue = noUsuarioInput.value // Use the corrected variable name here

      // Buscar la opción que coincide con el valor del input
      const selectedOption = Array.from(document.getElementById('equipo').options).find(option => option.value === noEquipoValue)

      // Buscar la opción que coincide con el valor del input
      const selectedOptionUser = Array.from(document.getElementById('usuario').options).find(option => option.value === noUsuarioValue)

      // Obtener el data-id, si la opción fue encontrada (usar let para fallback)
      let noEquipoId = selectedOption ? selectedOption.dataset.id : null
      let noUsuarioId = selectedOptionUser ? selectedOptionUser.dataset.id : null

      // Fallbacks: si no se encontró dataset.id, intentar buscar por coincidencia en textContent
      if (!noEquipoId) {
        const opcionesEquipo = Array.from(document.getElementById('equipo').options || [])
        const encontrado = opcionesEquipo.find(opt => opt.value === noEquipoValue || (opt.textContent && opt.textContent.includes(noEquipoValue)))
        noEquipoId = encontrado ? encontrado.dataset.id : null
      }
      if (!noUsuarioId) {
        const opcionesUsuario = Array.from(document.getElementById('usuario').options || [])
        const encontradoU = opcionesUsuario.find(opt => opt.value === noUsuarioValue || (opt.textContent && opt.textContent.includes(noUsuarioValue)))
        noUsuarioId = encontradoU ? encontradoU.dataset.id : null
      }

      const ubicacion = document.getElementById('ubicacion').value
      // Log para depurar por qué no se registra la asignación o no se refresca la tabla
      console.log('Asignar - valores => fecha:', fecha, 'noEquipoValue:', noEquipoValue, 'noEquipoId:', noEquipoId, 'noUsuarioValue:', noUsuarioValue, 'noUsuarioId:', noUsuarioId, 'ubicacion:', ubicacion)
      const archivoRespon = document.getElementById('archivoRespon')

      // Validación de campos requeridos
      if (ubicacion === '' || noUsuarioValue === '0' || noEquipoValue === '0' || !archivoRespon.files[0] || !fecha) {
        await actualizarUI(() => {
          mostrarMensaje('Debe llenar todos los campos obligatorios', 'error')
          if (submitBtnAsignar) submitBtnAsignar.disabled = false
          else if (elementos.btnRegistrar) elementos.btnRegistrar.disabled = false
          hideSpinner()
        })
        return
      }
      const formData = new FormData()
      formData.append('fecha_asignacion', fecha)
      formData.append('id_equipo', noEquipoId)
      formData.append('id_empleado', noUsuarioId)
      formData.append('ubicacion', ubicacion)
      formData.append('responsiva', archivoRespon.files[0])

      try {
        const respuesta = await fetchApiDoc('/api/asignaciones/', 'POST', formData)
        // Capturar resultado de respuestaFetch para decidir acciones posteriores
        const res = await respuestaFetch({ respuesta, formularios: elementos.formAsignarActivo, modal: 'asignarEquipo', button: submitBtnAsignar || elementos.btnRegistrar })

        // Si la operación fue exitosa, refrescar tablas relacionadas
        if (res === true) {
          if (elementos.tablaAsignaciones) {
            actualizarUI(async () => {
              iniciarAsignaciones()
              await verAsignaciones()
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
          if (submitBtnAsignar) submitBtnAsignar.disabled = false
          else if (elementos.btnRegistrar) elementos.btnRegistrar.disabled = false
        })
      }
    },
    async handleSubmitEditarAsignacion (e) {
      e.preventDefault()
      showSpinner()

      const submitBtn = obtenerSubmitBtn(e)
      await actualizarUI(() => {
        if (submitBtn) submitBtn.disabled = true
        else if (elementos.btnRegistrar) elementos.btnRegistrar.disabled = true
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
        await respuestaFetch({ respuesta, formularios: elementos.formEditarAsignacion, modal: 'editarAsignacion', button: submitBtn || elementos.btnRegistrar })
        if (elementos.tablaAsignaciones) {
          actualizarUI(async () => {
            iniciarAsignaciones()
            await verAsignaciones()
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
          if (submitBtn) submitBtn.disabled = false
          else if (elementos.btnRegistrar) elementos.btnRegistrar.disabled = false
        })
      }
    },
    async handleSubmitEditarUsuario (e) {
      e.preventDefault()
      showSpinner()

      const submitBtn = obtenerSubmitBtn(e)
      await actualizarUI(() => {
        if (submitBtn) submitBtn.disabled = true
        else if (elementos.btnRegistrar) elementos.btnRegistrar.disabled = true
      })

      const formData = new FormData(e.target)
      const datos = Object.fromEntries(formData.entries())

      // Validación de campos requeridos
      const camposRequeridos = [
        'empleado_idE', 'nombreE', 'apellido_paternoE', 'apellido_maternoE', 'departamentoE']
      await validarFormulario(camposRequeridos)

      try {
        const respuesta = await fetchApi(`/api/empleados/${datos.empleado_idE}`, 'PATCH', datos)
        await respuestaFetch({ respuesta, formularios: elementos.formEditarUsuarios, modal: 'miModalEditar', button: submitBtn || elementos.btnRegistrar })
        if (elementos.tablaUsuarios) {
          actualizarUI(async () => {
            iniciarUsuarios()
            await verUsuarios()
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
          if (submitBtn) submitBtn.disabled = false
          else if (elementos.btnRegistrar) elementos.btnRegistrar.disabled = false
        })
      }
    },
    async handleSubmitActualizarUsuario (e) {
      e.preventDefault()
      showSpinner()

      const submitBtn = obtenerSubmitBtn(e)
      await actualizarUI(() => {
        if (submitBtn) submitBtn.disabled = true
        else if (elementos.btnRegistrar) elementos.btnRegistrar.disabled = true
      })

      const formData = new FormData(e.target)
      const datos = Object.fromEntries(formData.entries())

      // Validación de campos requeridos
      const camposRequeridos = [
        'empleado_idA', 'estado']
      await validarFormulario(camposRequeridos)

      try {
        const respuesta = await fetchApi(`/api/empleados/${datos.empleado_idA}`, 'PATCH', datos)
        await respuestaFetch({ respuesta, formularios: elementos.formActualizarUsuarios, modal: 'miModalActualizar', button: submitBtn || elementos.btnRegistrar })
        if (elementos.tablaEmpleados) {
          actualizarUI(async () => {
            iniciarEmpleados()
            await verEmpleados()
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
          if (submitBtn) submitBtn.disabled = false
          else if (elementos.btnRegistrar) elementos.btnRegistrar.disabled = false
        })
      }
    },
    async handleSubmitEditarResponsiva (e) {
      e.preventDefault()
      showSpinner()
      const submitBtn = obtenerSubmitBtn(e)
      await actualizarUI(() => {
        if (submitBtn) submitBtn.disabled = true
        else if (elementos.btnRegistrar) elementos.btnRegistrar.disabled = true
      })
      const asignacion = document.getElementById('asignacion_id').value
      const formData = new FormData(e.target)
      const archivo = formData.get('responsiva')
      const fecha = formData.get('fecha_asignacion')

      // Validación de campos requeridos
      if (!asignacion || !fecha || !archivo || archivo.size === 0) {
        await actualizarUI(() => {
          mostrarMensaje('Debe llenar todos los campos obligatorios', 'error')
          if (submitBtn) submitBtn.disabled = false
          else if (elementos.btnRegistrar) elementos.btnRegistrar.disabled = false
          hideSpinner()
        })
        return
      }

      try {
        const respuesta = await fetchApiDoc(`/api/asignaciones/responsiva/${asignacion}`, 'PUT', formData)
        await respuestaFetch({ respuesta, formularios: elementos.formEditarResponsiva, button: submitBtn || elementos.btnRegistrar })
        if (elementos.tablaAsignaciones) {
          actualizarUI(async () => {
            iniciarAsignaciones()
            await verAsignaciones()
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
          if (submitBtn) submitBtn.disabled = false
          else if (elementos.btnRegistrar) elementos.btnRegistrar.disabled = false
        })
      }
    },
    async handleSubmitActualizarContraseña (e) {
      e.preventDefault()
      showSpinner()
      const submitBtn = obtenerSubmitBtn(e)
      await actualizarUI(() => {
        if (submitBtn) submitBtn.disabled = true
        else if (elementos.btnRegistrar) elementos.btnRegistrar.disabled = true
      })
      const idUsuario = document.getElementById('idUsuario').value
      const formData = new FormData(e.target)
      const datos = Object.fromEntries(formData.entries())
      const contrasena = datos.contrasenaRes
      const contrasenaRep = datos.contrasenaRepRes

      // Validación de campos requeridos
      if (!contrasena || !contrasenaRep || !idUsuario) {
        await actualizarUI(() => {
          mostrarMensaje('Debe llenar todos los campos obligatorios', 'error')
          if (submitBtn) submitBtn.disabled = false
          else if (elementos.btnRegistrar) elementos.btnRegistrar.disabled = false
          hideSpinner()
        })
        return
      }

      const isValid = await validarContraseña(contrasena, contrasenaRep)
      if (isValid === false) {
        await actualizarUI(() => {
          elementos.btnRegistrar.disabled = false
          hideSpinner()
        })
        return
      }

      try {
        const respuesta = await fetchApi(`/api/usuario/${idUsuario}`, 'PUT', datos)
        await respuestaFetch({ respuesta, formularios: elementos.formResetPass, modal: 'ModalResetPass', button: submitBtn || elementos.btnRegistrar })
        if (elementos.tablaUsuarios) {
          actualizarUI(async () => {
            iniciarUsuarios()
            await verUsuarios()
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
          if (submitBtn) submitBtn.disabled = false
          else if (elementos.btnRegistrar) elementos.btnRegistrar.disabled = false
        })
      }
    },
    async handleBtnValidacion (e) {
      e.preventDefault()
      showSpinner()
      await actualizarUI(() => {
        elementos.btnValidacion.disabled = true
      })
      const estados = []
      // Obtener todos los checkboxes marcados
      $('#tbConfirmacion input[type="checkbox"]:checked').each(function () {
        const id = $(this).attr('name').split('_')[1] // Obtiene el ID de "producto_X"

        estados.push({
          id_solicitud: parseInt(id), // Convertir a número
          validacion: true // Si está checked, significa que está validado
        })
      })
      // Validación de campos requeridos
      if (estados.length === 0) {
        await actualizarUI(() => {
          mostrarMensaje('Por favor, selecciona al menos una solicitud para confirmar.', 'warning')
          elementos.btnValidacion.disabled = false
          hideSpinner()
        })
        return
      }

      try {
        const url = '/api/validacion'
        const metodo = 'POST'
        const respuesta = await fetchApi(url, metodo, estados)
        await respuestaFetch({ respuesta, button: elementos.btnValidacion })
        if (elementos.tablaConfirmacion) {
          actualizarUI(async () => {
            await iniciarConfimaciones()
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
          elementos.btnValidacion.disabled = false
        })
      }
    },
    // manejador para estado
    async handleEstadoChange (e) {
      const estado = e.target.value
      const campoMotivo = document.getElementById('campoEstado')
      if (estado === 'inactivo' || estado === 'reparacion') {
        campoMotivo.style.display = 'block'
        document.getElementById('motivoB').disabled = false
        //
        document.getElementById('equipoE').disabled = true
        document.getElementById('marcaE').disabled = true
        document.getElementById('modeloE').disabled = true
        document.getElementById('snE').disabled = true
        document.getElementById('tagE').disabled = true
        document.getElementById('noEconomicoE').disabled = true
      } else if (estado === 'editar') {
        document.getElementById('equipoE').disabled = false
        document.getElementById('marcaE').disabled = false
        document.getElementById('modeloE').disabled = false
        document.getElementById('snE').disabled = false
        document.getElementById('tagE').disabled = false
        document.getElementById('noEconomicoE').disabled = false
        //
        campoMotivo.style.display = 'none'
        document.getElementById('motivoB').disabled = true
      } else {
        campoMotivo.style.display = 'none'
        document.getElementById('motivoB').disabled = true
        // Habilitar campos de equipo
        document.getElementById('equipoE').disabled = true
        document.getElementById('marcaE').disabled = true
        document.getElementById('modeloE').disabled = true
        document.getElementById('snE').disabled = true
        document.getElementById('tagE').disabled = true
        document.getElementById('noEconomicoE').disabled = true
      }
    },
    // Manejador optimizado para regresar a la página anterior
    handleRegresar () {
      // eslint-disable-next-line no-undef
      requestAnimationFrame(() => {
        window.history.back()
      })
    },
    handleCancelar () {
      // eslint-disable-next-line no-undef
      $('#modalInformacion').modal('hide')
      // eslint-disable-next-line no-undef
      $('#modalCancelacion').modal('show')
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
            // value contiene el texto visible (para que el datalist coincida con lo que escribe el usuario)
            option.value = nombre
            option.textContent = nombre
            // dataset mantiene el id real para envíos
            option.dataset.id = usuario.id
            usuarioTab.appendChild(option)
          })
        }
        if (Array.isArray(equiposData) && equiposData.length > 0) {
          equiposData.forEach(equip => {
            const option = document.createElement('option')
            // value usa el número de serie (visible), dataset.id contiene el id del equipo
            option.value = equip.ns
            option.textContent = `${equip.ns} - ${equip.equipo}`
            option.dataset.id = equip.id
            equipo.appendChild(option)
          })
        }
      } catch (error) {
        console.log(error)
      }
    }
  }

  // Función para inicializar un formulario con eventos
  const inicializarFormulario = (form, submitHandler) => {
    if (form) {
      form.addEventListener('submit', submitHandler)
      aplicarCapitalizacion(form)
    }
  }

  // Inicializar todos los formularios con capitalización
  inicializarFormulario(elementos.formActivos, handlers.handleSubmitAgregarEquipo)
  inicializarFormulario(elementos.formUsuarios, handlers.handleSubmitAgregarUsuario)
  inicializarFormulario(elementos.formFoto, handlers.handleSubmitAgregarFoto)
  inicializarFormulario(elementos.formFactura, handlers.handleSubmitAgregarFactura)
  inicializarFormulario(elementos.formEditarActivo, handlers.handleSubmitEditarActivo)
  inicializarFormulario(elementos.formBajaActivo, handlers.handleSubmitBajaActivo)
  inicializarFormulario(elementos.formAsignarActivo, handlers.handleSubmitAsignarActivo)
  inicializarFormulario(elementos.formEditarAsignacion, handlers.handleSubmitEditarAsignacion)
  inicializarFormulario(elementos.formEditarResponsiva, handlers.handleSubmitEditarResponsiva)
  inicializarFormulario(elementos.formBajaActivoDoc, handlers.handleSubmitAgregarBaja)
  inicializarFormulario(elementos.formProducto, handlers.handleSubmitAgregarProducto)
  inicializarFormulario(elementos.formCentroCoste, handlers.handleSubmitAgregarCentroCoste)
  inicializarFormulario(elementos.formCancelacion, handlers.handleSubmitCancelacion)
  inicializarFormulario(elementos.formEditarUsuarios, handlers.handleSubmitEditarUsuario)
  inicializarFormulario(elementos.formActualizarUsuarios, handlers.handleSubmitActualizarUsuario)
  inicializarFormulario(elementos.formDepartamento, handlers.handleSubmitAgregarDepartamento)
  inicializarFormulario(elementos.formEmpresa, handlers.handleSubmitAgregarEmpresa)
  inicializarFormulario(elementos.formRancho, handlers.handleSubmitAgregarRancho)
  // Inicializaciones especiales
  if (elementos.formFactura) {
    handlers.handleInicairDivsCentroCoste()
  }

  if (elementos.formResetPass) {
    elementos.formResetPass.addEventListener('submit', handlers.handleSubmitActualizarContraseña)
    togglePassword('contrasenaRes', 'mostrarPassRes')
    togglePassword('contrasenaRepRes', 'mostrarPassRRes')
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
  if (elementos.btnConfirmacion) {
    elementos.btnConfirmacion.addEventListener('click', handlers.handleSubmitConfirmacion)
  }
  if (elementos.btnCancelar) {
    elementos.btnCancelar.addEventListener('click', handlers.handleCancelar)
  }
  if (elementos.btnValidacion) {
    elementos.btnValidacion.addEventListener('click', handlers.handleBtnValidacion)
  }

  // Inicialización de tablas optimizada
  if (elementos.tablaActivos) {
    // Hacer las funciones disponibles globalmente
    window.mostrarDetallesInactivo = mostrarDetallesInactivo
    window.mostrarDetallesReparacion = mostrarDetallesReparacion
    window.mostrarDetallesMantenimiento = mostrarDetallesMantenimiento
    window.mostrarDetallesAsignacion = mostrarDetallesAsignacion
    actualizarUI(async () => {
      iniciarActivos()
      await verActivos()
    })
  }
  if (elementos.tablaAsignaciones) {
    actualizarUI(async () => {
      handlers.handleInicairDivsformAsignacion()
      iniciarAsignaciones()
      await verAsignaciones()
    })
  }
  if (elementos.tablaActivosBaja) {
    actualizarUI(async () => {
      iniciarActivosBaja()
      await verActivosBaja()
    })
  }
  if (elementos.tablaHistorialAsignacion) {
    actualizarUI(async () => {
      iniciarHistorialAsignacion()
      await verHistorialAsignacion()
    })
  }
  if (elementos.tablaHistorialEquipos) {
    actualizarUI(async () => {
      iniciarHistorialEquipos()
      await verHistorialEquipos()
    })
  }
  if (elementos.tablaEmpleados) {
    actualizarUI(async () => {
      iniciarEmpleados()
      await verEmpleados()
    })
  }
  if (elementos.tablaUsuarios) {
    actualizarUI(async () => {
      iniciarUsuarios()
      await verUsuarios()
    })
  }
  if (elementos.tablaProductos) {
    actualizarUI(async () => {
      iniciarProductos()
      await verProductos()
    })
  }
  if (elementos.tablaCentroCoste) {
    actualizarUI(async () => {
      iniciarCentroCoste()
      await verCentroCoste()
    })
  }
  if (elementos.tablaSolicitudesCanceladasADM) {
    actualizarUI(async () => {
      iniciarSolicitudesCanceladasADM()
      await verSolicitudesCanceladasADM()
    })
  }
  if (elementos.tablaConfirmacion) {
    actualizarUI(async () => {
      await iniciarConfimaciones()
    })
  }
  if (elementos.tablaEntradaInventario) {
    actualizarUI(async () => {
      iniciarEntradaInventario()
      await verEntradaInventario()
    })
  }
  if (elementos.tablaSalidaInventario) {
    actualizarUI(async () => {
      iniciarSalidaInventario()
      await verSalidaInventario()
    })
  }
  if (elementos.tablaCargasCombustible) {
    actualizarUI(async () => {
      iniciarCargaCombustible()
      await verCargasCombustible()
    })
  }
  if (elementos.tablaInventario) {
    actualizarUI(async () => {
      iniciarInventario()
      await verInventario()
    })
  }
  if (elementos.tablaEmpresas) {
    actualizarUI(async () => {
      iniciarEmpresas()
      await verEmpresas()
    })
  }
  if (elementos.tablaDepartamentos) {
    actualizarUI(async () => {
      iniciarDepartamentos()
      await verDepartamentos()
    })
  }
  if (elementos.tablaRanchos) {
    actualizarUI(async () => {
      iniciarRanchos()
      await verRanchos()
    })
  }
})
