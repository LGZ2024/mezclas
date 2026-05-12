/* eslint-disable no-undef */
import { fetchApi, mostrarMensaje, MensajeEliminacion } from '../funciones.js'
import { showSpinner, hideSpinner } from '../spinner.js'

// Variables globales
let ingredientesTemporales = []
let idMezclaActual = null
let submitButton = null
let catalogosGlobal = {}

// Cachear referencias DOM
const elementos = {
    formMezcla: document.getElementById('formMezcla'),
    btnAgregarIngrediente: document.getElementById('btnAgregarIngredienteMezcla'),
    modalMezcla: document.getElementById('modalMezcla'),
    cantidadInput: document.getElementById('cantidad_activo_mezcla'),
    btnNuevaMezcla: document.getElementById('btnNuevaMezcla')
}

// Función para mostrar error
const mostrarError = (mensaje) => {
    mostrarMensaje(mensaje, 'error')
}

const mostrarExito = (mensaje) => {
    mostrarMensaje(mensaje, 'success')
}

// Función para capitalizar palabras
const capitalizarPalabras = (str) => {
    return str.toLowerCase().replace(/\b\w/g, c => c.toUpperCase())
}

const aplicarCapitalizacion = (form) => {
    if (!form) return
    const inputsTexto = form.querySelectorAll('input[type="text"]')
    inputsTexto.forEach(input => {
        input.addEventListener('input', (e) => {
            const valor = e.target.value
            if (valor !== valor.toUpperCase()) {
                requestAnimationFrame(() => {
                    e.target.value = capitalizarPalabras(valor)
                })
            }
        })
    })
}

// Helper para obtener botón submit
const obtenerSubmitBtn = (e) => {
    try {
        if (e && e.submitter) return e.submitter
    } catch (err) { }
    if (e && e.target) {
        const btn = e.target.querySelector('button[type="submit"]')
        if (btn) return btn
    }
    return null
}

// Validar formulario
const validarFormulario = (camposRequeridos) => {
    const camposInvalidos = camposRequeridos.filter(campo => {
        const el = document.getElementById(campo)
        return !el || !el.value.trim()
    })

    if (camposInvalidos.length > 0) {
        mostrarError('Por favor complete todos los campos obligatorios')
        hideSpinner()
        return false
    }
    return true
}

const handlers = {
    // Cargar catálogos
    async handleCargarCatalogos() {
        try {
            const respuesta = await fetchApi('/api/fertilizacion/catalogos', 'GET')
            const data = await respuesta.json()
            if (data.success) {
                catalogosGlobal = data.data
                return data.data
            } else {
                mostrarError('Error al cargar catálogos')
                return null
            }
        } catch (error) {
            mostrarError('Error: ' + error.message)
            return null
        }
    },

    // Obtener mezclas
    async handleObtenerMezclas() {
        try {
            const respuesta = await fetchApi('/api/fertilizacion/catalogo/mezclas', 'GET')
            const data = await respuesta.json()
            if (data.success) {
                return data.data
            } else {
                mostrarError(data.message)
                return []
            }
        } catch (error) {
            console.error('Error:', error)
            mostrarError('Error al obtener mezclas: ' + error.message)
            return []
        }
    },

    // Crear/Editar mezcla
    async handleCrearMezcla(e) {
        e.preventDefault()
        showSpinner()

        submitButton = obtenerSubmitBtn(e)
        if (submitButton) submitButton.disabled = true

        const esEdicion = idMezclaActual !== null

        const formData = {
            nombre: document.getElementById('nombre_mezcla')?.value,
            fabricante: document.getElementById('fabricante_mezcla')?.value,
            descripcion: document.getElementById('descripcion_mezcla')?.value
        }

        const camposRequeridos = ['nombre_mezcla', 'fabricante_mezcla']
        if (!validarFormulario(camposRequeridos)) {
            if (submitButton) submitButton.disabled = false
            return
        }

        try {
            const metodo = esEdicion ? 'PUT' : 'POST'
            const endpoint = esEdicion
                ? `/api/fertilizacion/mezclas/${idMezclaActual}`
                : '/api/fertilizacion/mezclas'

            const respuesta = await fetchApi(endpoint, metodo, formData)
            const dataResp = await respuesta.json()

            if (!respuesta.ok || !dataResp.success) {
                throw new Error(dataResp.message || `Error al ${esEdicion ? 'actualizar' : 'crear'} mezcla`)
            }

            const idMezcla = esEdicion ? idMezclaActual : dataResp.data.id

            // Guardar ingredientes
            if (ingredientesTemporales.length > 0) {
                const ingredientesPayload = ingredientesTemporales.map(ing => ({
                    id_activo: ing.id,
                    porcentaje: ing.porcentaje // Enviar porcentaje
                }))

                const respIng = await fetchApi(
                    `/api/fertilizacion/mezclas/${idMezcla}/ingredientes`,
                    'PUT',
                    { activos: ingredientesPayload }
                )

                if (!respIng.ok) {
                    const errorIng = await respIng.json()
                    throw new Error('Error al guardar ingredientes: ' + (errorIng.message || 'Error desconocido'))
                }
            }

            mostrarExito(esEdicion ? 'Mezcla actualizada' : 'Mezcla creada')
            hideSpinner()

            if (e.target) e.target.reset()
            $('#modalMezcla').modal('hide')

            // Recargar lista
            await cargarMezclas()

            // Reset
            ingredientesTemporales = []
            idMezclaActual = null
        } catch (error) {
            mostrarError(error.message)
            hideSpinner()
        } finally {
            if (submitButton) submitButton.disabled = false
        }
    },

    // Obtener datos para editar
    async handleEditarMezcla(id) {
        try {
            showSpinner()
            idMezclaActual = id
            const respuesta = await fetchApi(`/api/fertilizacion/mezclas/${id}`, 'GET')
            const data = await respuesta.json()

            hideSpinner()
            if (data.success) {
                const mezcla = data.data
                document.getElementById('id_mezcla_edit').value = id
                document.getElementById('nombre_mezcla').value = mezcla.nombre || ''
                document.getElementById('fabricante_mezcla').value = mezcla.fabricante || ''
                document.getElementById('descripcion_mezcla').value = mezcla.descripcion || ''

                idMezclaActual = id // Asegurar asignación

                // Cargar ingredientes
                ingredientesTemporales = []
                if (mezcla.MezclaActivos && mezcla.MezclaActivos.length > 0) {
                    ingredientesTemporales = mezcla.MezclaActivos.map(ma => ({
                        id: ma.id_activo,
                        nombre: ma.ActivoMezcla?.nombre || 'Desconocido',
                        porcentaje: parseFloat(ma.porcentaje || ma.cantidad), // Adaptar a lo que venga
                        tipo: ma.ActivoMezcla?.tipo || ''
                    }))
                }
                renderizarIngredientes()
                actualizarTrackerPorcentaje()

                const select = document.getElementById('select_activo_mezcla')
                // Cargar catálogo si select está vacío
                if (select && select.options.length <= 1) {
                    await handlers.handleCargarCatalogos()
                    if (catalogosGlobal.activos) {
                        select.innerHTML = '<option value="">-- Elige un ingrediente --</option>'
                        catalogosGlobal.activos.forEach(activo => {
                            select.append(new Option(`${activo.nombre} (${activo.codigo})`, activo.id))
                        })
                    }
                }

                $('#modalMezcla').modal('show')
                document.getElementById('modalMezclaTitle').textContent = 'Editar Mezcla'
            } else {
                mostrarError(data.message)
            }
        } catch (error) {
            hideSpinner()
            mostrarError('Error al cargar datos: ' + error.message)
        }
    },

    // Eliminar mezcla
    async handleEliminarMezcla(id) {
        try {
            const exito = await MensajeEliminacion(`/api/fertilizacion/mezclas/${id}`, 'DELETE')
            if (exito) {
                await cargarMezclas()
            }
        } catch (error) {
            mostrarError('Error al eliminar: ' + error.message)
        }
    },

    // Ver activos (solo lectura)
    async handleObtenerActivosMezcla(id) {
        try {
            const respuesta = await fetchApi(`/api/fertilizacion/mezclas/${id}/ingredientes`, 'GET')
            const data = await respuesta.json()
            if (data.success) {
                return data.data.MezclaActivos || []
            }
            return []
        } catch (error) {
            mostrarError(error.message)
            return []
        }
    },

    // Agregar ingrediente a la lista temporal
    handleAgregarIngrediente() {
        const select = document.getElementById('select_activo_mezcla')
        const cantidad = document.getElementById('cantidad_activo_mezcla')

        if (!select) {
            mostrarError('Error interno: No se encuentra el selector de ingredientes')
            return
        }

        // Verificar si hay opciones cargadas (más allá del placeholder)
        if (select.options.length <= 1) {
            mostrarError('No hay ingredientes cargados en el sistema. Intente recargar la página.')
            // Selector de activos vacío o solo con placeholder
            return
        }

        if (!select.value) {
            console.error('Valor del select vacío. Options:', select.options.length, 'SelectedIndex:', select.selectedIndex)
            mostrarError('Debe seleccionar un ingrediente de la lista')
            return
        }

        if (!cantidad || !cantidad.value.trim()) {
            mostrarError('Debe ingresar un porcentaje')
            return
        }

        const activoId = Number(select.value)
        const activo = catalogosGlobal.activos?.find(a => a.id === activoId)
        const PorcentajeVal = parseFloat(cantidad.value)

        if (PorcentajeVal <= 0 || PorcentajeVal > 100) {
            mostrarError('El porcentaje debe estar entre 0 y 100')
            return
        }

        // Validar duplicados
        if (ingredientesTemporales.some(i => i.id === activoId)) {
            mostrarError('El ingrediente ya está en la lista')
            return
        }

        // Validar suma total <= 100
        const sumaActual = ingredientesTemporales.reduce((acc, curr) => acc + curr.porcentaje, 0)
        if (sumaActual + PorcentajeVal > 100) {
            mostrarError(`El total supera el 100%. Actual: ${sumaActual}%`)
            return
        }

        ingredientesTemporales.push({
            id: activoId,
            nombre: activo ? activo.nombre : 'Desconocido',
            porcentaje: PorcentajeVal,
            tipo: activo ? activo.tipo : ''
        })

        renderizarIngredientes()
        actualizarTrackerPorcentaje()
        select.value = ''
        cantidad.value = ''
    }
}

// Funciones de renderizado
const renderizarIngredientes = () => {
    const container = document.getElementById('listaIngredientes')
    if (!container) return

    if (ingredientesTemporales.length === 0) {
        container.innerHTML = `
            <div class="text-center py-4">
                <i class="mdi mdi-flask-empty-outline mb-2 text-muted" style="font-size: 2rem; display: block;"></i>
                <p class="text-muted mb-0">Sin ingredientes en la receta</p>
            </div>
        `
        return
    }

    container.innerHTML = ingredientesTemporales.map((ing, idx) => {
        const tipoClase = `type-${(ing.tipo || 'macro').toLowerCase()}`
        return `
            <div class="ingrediente-item d-flex justify-content-between align-items-center">
                <div class="flex-grow-1">
                    <div class="d-flex align-items-center mb-1">
                         <span class="macro-badge ${tipoClase} mr-2">${ing.tipo || 'MACRO'}</span>
                         <strong class="text-dark">${ing.nombre}</strong>
                    </div>
                    <div class="d-flex align-items-center">
                        <div class="input-group input-group-sm" style="width: 120px">
                            <input type="number" class="form-control" 
                                   value="${ing.porcentaje}" step="0.0001" min="0" max="100"
                                   onchange="window.mezclasHandlers.actualizarCantidad(${idx}, this.value)">
                            <div class="input-group-append">
                                <span class="input-group-text bg-white border-left-0 text-muted">%</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="ml-3">
                    <button type="button" class="btn btn-link text-danger p-0" 
                            onclick="window.mezclasHandlers.eliminarIngrediente(${idx})"
                            title="Eliminar ingrediente">
                        <i class="mdi mdi-delete-variant font-weight-bold" style="font-size: 1.2rem;"></i>
                    </button>
                </div>
            </div>
        `
    }).join('')
}

const actualizarTrackerPorcentaje = () => {
    const total = ingredientesTemporales.reduce((acc, curr) => acc + curr.porcentaje, 0)
    const progressBar = document.getElementById('totalPorcentajeBar')
    const progressText = document.getElementById('totalPorcentajeText')
    const feedbackText = document.getElementById('porcentajeFeedback')

    if (!progressBar || !progressText) return

    const displayTotal = total.toFixed(4)
    progressText.innerText = `${displayTotal}%`
    progressBar.style.width = `${Math.min(total, 100)}%`

    // Reset clases
    progressBar.classList.remove('full', 'warning', 'danger')
    progressText.classList.remove('text-success', 'text-warning', 'text-danger')

    if (total === 100) {
        progressBar.classList.add('full')
        progressText.classList.add('text-success')
        feedbackText.innerHTML = '<span class="text-success font-weight-bold"><i class="mdi mdi-check-circle"></i> Receta completa al 100%</span>'
    } else if (total > 100) {
        progressBar.classList.add('danger')
        progressText.classList.add('text-danger')
        feedbackText.innerHTML = '<span class="text-danger font-weight-bold"><i class="mdi mdi-alert"></i> El total supera el 100%!</span>'
    } else if (total > 80) {
        progressBar.classList.add('warning')
        feedbackText.innerText = 'Casi lista, falta poco para el 100%.'
    } else {
        feedbackText.innerText = 'Sigue agregando ingredientes hasta completar el 100%.'
    }
}

const renderizarMezclas = (mezclas) => {
    const container = document.getElementById('mezclasContainer')
    if (!container) return

    if (!mezclas.length) {
        container.innerHTML = '<div class="col-12"><div class="alert alert-info">No hay mezclas registradas.</div></div>'
        return
    }

    container.innerHTML = mezclas.map(m => `
    <div class="col-lg-4 col-md-6 grid-margin stretch-card">
      <div class="card mezcla-card h-100 shadow-sm border-0">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-start mb-2">
            <div>
              <h5 class="card-title mb-1">${m.nombre}</h5>
              <span class="badge badge-outline-primary badge-pill">${m.fabricante}</span>
            </div>
          </div>
          
          <p class="text-muted small mb-3">${m.descripcion || 'Sin descripción'}</p>
          
          <div class="ingredientes-preview mb-3">
            <small class="text-uppercase text-muted font-weight-bold" style="font-size: 10px;">Composición:</small>
            <div class="d-flex flex-wrap gap-1 mt-1">
              ${renderIngredientesPreview(m.MezclaActivos)}
            </div>
          </div>

          <div class="mt-auto border-top pt-3 d-flex justify-content-between">
            <button class="btn btn-sm btn-inverse-info" onclick="window.mezclasHandlers.ver(${m.id})">
              <i class="mdi mdi-eye"></i> Detalle
            </button>
            <div>
           <button class="btn btn-sm btn-inverse-primary" onclick="window.mezclasHandlers.activar(${m.id})">
              <i class="mdi mdi-power"></i>
            </button>
              <button class="btn btn-sm btn-inverse-primary" onclick="window.mezclasHandlers.editar(${m.id})">
                <i class="mdi mdi-pencil"></i>
              </button>
              <button class="btn btn-sm btn-inverse-danger" onclick="window.mezclasHandlers.eliminar(${m.id})">
                <i class="mdi mdi-delete"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `).join('')
}

const renderIngredientesPreview = (activos) => {
    if (!activos || !activos.length) return '<span class="text-muted small">N/A</span>'

    // Convertir a porcentaje los activos
    const activosView = activos.map(a => ({
        codigo: a.ActivoMezcla?.codigo || 'N/A',
        valor: parseFloat(a.porcentaje || a.cantidad)
    }))

    // Mostrar solo los primeros 3
    const preview = activosView.slice(0, 3).map(a =>
        `<span class="badge badge-light border text-dark" style="font-size: 10px;">${a.codigo}: ${a.valor}%</span>`
    ).join(' ')

    if (activos.length > 3) return preview + `<span class="badge badge-light border text-dark" style="font-size: 10px;">+${activos.length - 3}</span>`
    return preview
}

const cargarMezclas = async () => {
    const mezclas = await handlers.handleObtenerMezclas()
    renderizarMezclas(mezclas)
}

// Exponer handlers globalmente para onclicks
window.mezclasHandlers = {
    eliminarIngrediente: (idx) => {
        ingredientesTemporales.splice(idx, 1)
        renderizarIngredientes()
        actualizarTrackerPorcentaje()
    },
    actualizarCantidad: (idx, val) => {
        if (ingredientesTemporales[idx]) {
            ingredientesTemporales[idx].porcentaje = parseFloat(val) || 0
            actualizarTrackerPorcentaje()
        }
    },
    editar: (id) => handlers.handleEditarMezcla(id),
    eliminar: (id) => handlers.handleEliminarMezcla(id),
    ver: async (id) => {
        const listado = document.getElementById('listadoActivos')
        const modal = document.getElementById('modalActivos')

        listado.innerHTML = '<div class="text-center"><div class="spinner-border text-primary"></div></div>'
        $(modal).modal('show')

        const activos = await handlers.handleObtenerActivosMezcla(id)
        if (activos.length) {
            listado.innerHTML = `<div class="table-responsive">
        <table class="table table-sm">
          <thead>
            <tr>
              <th>Ingrediente</th>
              <th>Tipo</th>
              <th class="text-right">Porcentaje</th>
            </tr>
          </thead>
          <tbody>
            ${activos.map(a => `
              <tr>
                <td>${a.ActivoMezcla?.nombre} <small class="text-muted">(${a.ActivoMezcla?.codigo})</small></td>
                <td><span class="badge badge-outline-secondary">${a.ActivoMezcla?.tipo || 'N/A'}</span></td>
                <td class="text-right fw-bold">${a.porcentaje || a.cantidad}%</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>`
        } else {
            listado.innerHTML = '<div class="alert alert-warning text-center">Esta mezcla no tiene ingredientes asignados.</div>'
        }
    }
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar formulario
    aplicarCapitalizacion(elementos.formMezcla)

    if (elementos.formMezcla) {
        elementos.formMezcla.addEventListener('submit', handlers.handleCrearMezcla)
    }

    // Botón nueva mezcla
    if (elementos.btnNuevaMezcla) {
        elementos.btnNuevaMezcla.addEventListener('click', async () => {
            idMezclaActual = null
            ingredientesTemporales = []
            elementos.formMezcla.reset()
            renderizarIngredientes()
            actualizarTrackerPorcentaje()
            document.getElementById('modalMezclaTitle').textContent = 'Nueva Mezcla'
            document.getElementById('id_mezcla_edit').value = ''

            // Asegurar catálogos
            const select = document.getElementById('select_activo_mezcla')
            if (select && select.options.length <= 1) {
                const cats = await handlers.handleCargarCatalogos()
                if (cats?.activos) {
                    select.innerHTML = '<option value="">-- Elige un ingrediente --</option>'
                    cats.activos.forEach(activo => {
                        select.append(new Option(`${activo.nombre} (${activo.codigo})`, activo.id))
                    })
                }
            }

            $('#modalMezcla').modal('show')
        })
    }

    // Inputs de ingredientes
    if (elementos.btnAgregarIngrediente) {
        elementos.btnAgregarIngrediente.addEventListener('click', handlers.handleAgregarIngrediente)
    }

    if (elementos.cantidadInput) {
        elementos.cantidadInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault()
                handlers.handleAgregarIngrediente()
            }
        })
    }

    // Cargar lista inicial
    cargarMezclas()
})
