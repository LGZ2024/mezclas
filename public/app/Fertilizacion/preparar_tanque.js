/* eslint-disable camelcase */
/* eslint-disable eqeqeq */
/* eslint-disable no-undef */
import { fetchApi, mostrarMensaje } from '../funciones.js'
import { showSpinner, hideSpinner } from '../spinner.js'

let mezclasAgregadas = []
let catalogosGlobal = {}

const elementos = {
    formTanque: document.getElementById('formTanque'),
    selectRancho: document.getElementById('id_rancho_prepa'),
    selectTanque: document.getElementById('id_tanque'),
    selectMezcla: document.getElementById('select_mezcla_agregar'),
    inputLitrosMezcla: document.getElementById('litros_mezcla_agregar'),
    inputLitrosAgua: document.getElementById('litros_agua'),
    btnAgregarMezcla: document.getElementById('btnAgregarMezcla'),
    tablaMezclasBody: document.getElementById('cuerpoTablaMezclas'),
    totalMezclasDisplay: document.getElementById('totalMezclasDisplay'),
    totalVolumenDisplay: document.getElementById('totalVolumenDisplay'),
    etapaTanqueDisplay: document.getElementById('etapaTanqueDisplay'),
    capacidadTanqueDisplay: document.getElementById('capacidadTanqueDisplay'),
    barraCapacidad: document.getElementById('barraCapacidad'),
    mensajeCapacidad: document.getElementById('mensajeCapacidad'),
    alertaCapacidad: document.getElementById('alertaCapacidad'),
    textoAlertaCapacidad: document.getElementById('textoAlertaCapacidad'),
    inputLitrosTotales: document.getElementById('litros_totales'), // Hidden or readonly
    fechaInput: document.getElementById('fecha_preparacion'),
    codigoTanqueInput: document.getElementById('codigo_tanque_preparado'),
    tasaInyeccionInput: document.getElementById('tasa_inyeccion'),
    tablaTanques: document.getElementById('tbTanquesPreparados')
}

let tanqueSeleccionado = null

// Inicialización
document.addEventListener('DOMContentLoaded', async () => {
    // Establecer fecha hoy
    if (elementos.fechaInput) {
        elementos.fechaInput.valueAsDate = new Date()
    }

    // Cargar catálogos
    await cargarCatalogos()

    // Event Listeners
    if (elementos.btnAgregarMezcla) {
        elementos.btnAgregarMezcla.addEventListener('click', agregarMezclaALista)
    }

    if (elementos.formTanque) {
        elementos.formTanque.addEventListener('submit', handleFormSubmit)
    }

    if (elementos.selectRancho) {
        elementos.selectRancho.addEventListener('change', cargarTanquesPorRancho)
    }

    if (elementos.selectTanque) {
        elementos.selectTanque.addEventListener('change', onTanqueSeleccionado)
    }

    if (elementos.inputLitrosAgua) {
        elementos.inputLitrosAgua.addEventListener('input', actualizarCapacidad)
    }

    // Cargar tabla inicial
    cargarTanquesPreparados()
})

async function cargarCatalogos() {
    try {
        showSpinner()
        const respuesta = await fetchApi('/api/fertilizacion/catalogos', 'GET')
        const data = await respuesta.json()

        if (data.success && data.data) {
            catalogosGlobal = data.data
            llenarSelects(data.data)
        } else {
            mostrarMensaje('Error al cargar catálogos', 'error')
        }
    } catch (error) {
        console.error(error)
        mostrarMensaje('Error de conexión', 'error')
    } finally {
        hideSpinner()
    }
}

function llenarSelects(data) {
    // Llenar Ranchos
    if (elementos.selectRancho && data.ranchos) {
        elementos.selectRancho.innerHTML = '<option value="">-- Seleccionar Rancho --</option>'
        data.ranchos.forEach(r => {
            elementos.selectRancho.add(new Option(r.rancho, r.id))
        })
    }

    // Llenar Mezclas (para el selector de agregar)
    if (elementos.selectMezcla && data.mezclas) {
        elementos.selectMezcla.innerHTML = '<option value="">-- Seleccionar Mezcla --</option>'
        data.mezclas.forEach(m => {
            elementos.selectMezcla.add(new Option(m.nombre, m.id))
        })
    }
}

function agregarMezclaALista() {
    const idMezcla = elementos.selectMezcla.value
    const litros = parseFloat(elementos.inputLitrosMezcla.value)

    if (!idMezcla) {
        mostrarMensaje('Seleccione una mezcla', 'error')
        return
    }
    if (!litros || litros <= 0) {
        mostrarMensaje('Ingrese una cantidad válida de litros', 'error')
        return
    }

    const mezclaObj = catalogosGlobal.mezclas.find(m => m.id == idMezcla)

    // Validar capacidad antes de agregar
    if (tanqueSeleccionado) {
        const totalMezclasActual = mezclasAgregadas.reduce((sum, m) => sum + m.cantidad_litros, 0)
        const litrosAgua = parseFloat(elementos.inputLitrosAgua?.value || 0)
        const nuevoTotal = totalMezclasActual + litros + litrosAgua

        if (nuevoTotal > tanqueSeleccionado.capacidad) {
            mostrarMensaje(`No se puede agregar esta mezcla. El volumen total (${nuevoTotal.toFixed(2)} L) excedería la capacidad del tanque (${tanqueSeleccionado.capacidad.toFixed(2)} L)`, 'error')
            return
        }
    }

    // Verificar si ya existe (opcional, se puede permitir repetir o sumar)
    const existente = mezclasAgregadas.find(m => m.id_mezcla == idMezcla)
    if (existente) {
        existente.cantidad_litros += litros
    } else {
        mezclasAgregadas.push({
            id_mezcla: idMezcla,
            nombre: mezclaObj ? mezclaObj.nombre : 'Desconocida',
            cantidad_litros: litros
        })
    }

    renderizarMezclasAgregadas()

    // Reset inputs
    elementos.selectMezcla.value = ''
    elementos.inputLitrosMezcla.value = ''
}

function renderizarMezclasAgregadas() {
    if (!elementos.tablaMezclasBody) return

    elementos.tablaMezclasBody.innerHTML = ''
    let total = 0

    mezclasAgregadas.forEach((m, index) => {
        total += m.cantidad_litros
        const tr = document.createElement('tr')
        tr.innerHTML = `
            <td>${m.nombre}</td>
            <td>${m.cantidad_litros.toFixed(2)} L</td>
            <td>
                <button type="button" class="btn btn-sm btn-outline-danger" onclick="window.eliminarMezclaDeLista(${index})">
                    <i class="mdi mdi-delete"></i>
                </button>
            </td>
        `
        elementos.tablaMezclasBody.appendChild(tr)
    })

    // Actualizar total visual y hidden input
    if (elementos.totalMezclasDisplay) elementos.totalMezclasDisplay.innerText = `${total.toFixed(2)} L`
    if (elementos.inputLitrosTotales) elementos.inputLitrosTotales.value = total

    // Actualizar capacidad total
    actualizarCapacidad()
}

// Exponer funcion global para eliminar
window.eliminarMezclaDeLista = (index) => {
    mezclasAgregadas.splice(index, 1)
    renderizarMezclasAgregadas()
}

function onTanqueSeleccionado() {
    const tanqueId = elementos.selectTanque.value
    if (!tanqueId) {
        tanqueSeleccionado = null
        actualizarCapacidad()
        return
    }

    // Buscar el tanque seleccionado en los catálogos
    const tanque = catalogosGlobal.tanques.find(t => t.id == tanqueId)
    if (tanque) {
        tanqueSeleccionado = tanque
        actualizarCapacidad()
    }
}

function actualizarCapacidad() {
    if (!tanqueSeleccionado) {
        // Resetear displays si no hay tanque seleccionado
        if (elementos.etapaTanqueDisplay) elementos.etapaTanqueDisplay.textContent = '-'
        if (elementos.capacidadTanqueDisplay) elementos.capacidadTanqueDisplay.textContent = '0.00 L'
        if (elementos.totalVolumenDisplay) elementos.totalVolumenDisplay.textContent = '0.00 L'
        if (elementos.barraCapacidad) {
            elementos.barraCapacidad.style.width = '0%'
            elementos.barraCapacidad.textContent = '0%'
        }
        if (elementos.mensajeCapacidad) elementos.mensajeCapacidad.textContent = '0.00 L utilizados de 0.00 L'
        if (elementos.alertaCapacidad) elementos.alertaCapacidad.classList.add('d-none')
        return
    }

    // Calcular totales
    const totalMezclas = mezclasAgregadas.reduce((sum, m) => sum + m.cantidad_litros, 0)
    const litrosAgua = parseFloat(elementos.inputLitrosAgua?.value || 0)
    const totalVolumen = totalMezclas + litrosAgua
    const capacidadTanque = tanqueSeleccionado.capacidad

    // Actualizar displays
    if (elementos.etapaTanqueDisplay) {
        elementos.etapaTanqueDisplay.textContent = tanqueSeleccionado.etapa || '-'
    }
    if (elementos.capacidadTanqueDisplay) {
        elementos.capacidadTanqueDisplay.textContent = `${capacidadTanque.toFixed(2)} L`
    }
    if (elementos.totalVolumenDisplay) {
        elementos.totalVolumenDisplay.textContent = `${totalVolumen.toFixed(2)} L`
    }

    // Calcular porcentaje y actualizar barra
    const porcentaje = Math.min((totalVolumen / capacidadTanque) * 100, 100)
    if (elementos.barraCapacidad) {
        elementos.barraCapacidad.style.width = `${porcentaje}%`
        elementos.barraCapacidad.textContent = `${porcentaje.toFixed(1)}%`

        // Cambiar color según porcentaje
        elementos.barraCapacidad.className = 'progress-bar'
        if (porcentaje > 100) {
            elementos.barraCapacidad.classList.add('bg-danger')
        } else if (porcentaje > 90) {
            elementos.barraCapacidad.classList.add('bg-warning')
        } else {
            elementos.barraCapacidad.classList.add('bg-success')
        }
    }

    // Actualizar mensaje
    if (elementos.mensajeCapacidad) {
        elementos.mensajeCapacidad.textContent = `${totalVolumen.toFixed(2)} L utilizados de ${capacidadTanque.toFixed(2)} L`
    }

    // Mostrar/ocultar alerta
    if (elementos.alertaCapacidad) {
        if (totalVolumen > capacidadTanque) {
            const excedente = totalVolumen - capacidadTanque
            elementos.textoAlertaCapacidad.textContent =
                `¡Capacidad excedida! El volumen total excede la capacidad del tanque en ${excedente.toFixed(2)} L.`
            elementos.alertaCapacidad.classList.remove('d-none')
            elementos.alertaCapacidad.className = 'alert alert-danger'
        } else if (porcentaje > 90) {
            elementos.textoAlertaCapacidad.textContent =
                '¡Atención! El tanque está casi lleno. Considere reducir el volumen.'
            elementos.alertaCapacidad.classList.remove('d-none')
            elementos.alertaCapacidad.className = 'alert alert-warning'
        } else {
            elementos.alertaCapacidad.classList.add('d-none')
        }
    }

    // Actualizar input hidden con el total real (mezclas + agua)
    if (elementos.inputLitrosTotales) {
        elementos.inputLitrosTotales.value = totalVolumen
    }
}

async function handleFormSubmit(e) {
    e.preventDefault()

    const payload = {
        id_tanque: elementos.selectTanque.value,
        id_rancho: elementos.selectRancho.value,
        fecha_preparacion: elementos.fechaInput.value,
        codigo_tanque_preparado: elementos.codigoTanqueInput.value,
        tasa_inyeccion: parseFloat(elementos.tasaInyeccionInput.value || 0),
        litros_totales: parseFloat(elementos.inputLitrosTotales.value),
        mezclas: mezclasAgregadas
    }

    if (!payload.id_tanque || !payload.id_rancho || !payload.fecha_preparacion) {
        mostrarMensaje('Complete los campos obligatorios (Rancho, Fecha, Tanque)', 'error')
        return
    }

    if (mezclasAgregadas.length === 0) {
        mostrarMensaje('Debe agregar al menos una mezcla al tanque', 'error')
        return
    }

    // Validar capacidad del tanque
    if (tanqueSeleccionado) {
        const totalVolumen = parseFloat(elementos.inputLitrosTotales.value)
        if (totalVolumen > tanqueSeleccionado.capacidad) {
            mostrarMensaje(`El volumen total (${totalVolumen.toFixed(2)} L) excede la capacidad del tanque (${tanqueSeleccionado.capacidad.toFixed(2)} L)`, 'error')
            return
        }
    }

    try {
        showSpinner()
        const resp = await fetchApi('/api/fertilizacion/preparar-tanque', 'POST', payload)
        const data = await resp.json()

        if (resp.ok && data.success) {
            mostrarMensaje('Tanque preparado correctamente', 'success')
            // Reset form
            elementos.formTanque.reset()
            mezclasAgregadas = []
            renderizarMezclasAgregadas()
            elementos.fechaInput.valueAsDate = new Date()

            // Recargar tabla
            cargarTanquesPreparados()
        } else {
            throw new Error(data.message || 'Error desconocido')
        }
    } catch (error) {
        mostrarMensaje('Error: ' + error.message, 'error')
    } finally {
        hideSpinner()
    }
}

async function cargarTanquesPreparados() {
    try {
        const resp = await fetchApi('/api/fertilizacion/tanques-preparados', 'GET')
        const data = await resp.json()

        if (data.success && data.data) {
            // Si existe el handler global de main.js, lo usamos para no romper DataTables
            if (window.fertilizacionHandlers && window.fertilizacionHandlers.renderizarTablaTanques) {
                window.fertilizacionHandlers.renderizarTablaTanques(data.data)
            } else {
                renderizarTablaHistorial(data.data)
            }
        }
    } catch (error) {
        console.error('Error cargando historial', error)
    }
}

async function cargarTanquesPorRancho(e) {
    try {
        const id_rancho = e.target.value
        const resp = await fetchApi(`/corporativo/api/tanques/${id_rancho}`, 'GET')
        const data = await resp.json()
        elementos.selectTanque.innerHTML = '<option value="">Cargando...</option>'
        if (data.length == 0) {
            mostrarMensaje('No hay tanques disponibles para este rancho', 'warning')
            return
        }
        if (elementos.selectTanque) {
            elementos.selectTanque.innerHTML = '<option value="">-- Seleccionar Tanque --</option>'
            data.forEach(t => {
                elementos.selectTanque.add(new Option(`${t.codigo} (${t.capacidad}L)`, t.id))
            })
        }
        tanquesPreparadosLitros = data
    } catch (error) {
        console.error('Error cargando tanques', error)
    }
}
window.verDetalleTanque = async (id) => {
    try {
        showSpinner()
        const resp = await fetchApi(`/api/fertilizacion/tanques-preparados/${id}`, 'GET')
        const data = await resp.json()

        if (data.success && data.data) {
            const t = data.data

            // Llenar cabecera
            const ranchoEl = document.getElementById('detalleRancho')
            const tanqueEl = document.getElementById('detalleTanqueFisico')
            const fechaEl = document.getElementById('detalleFecha')
            const volumenEl = document.getElementById('detalleVolumen')
            const tasaEl = document.getElementById('detalleTasa')

            if (ranchoEl) ranchoEl.textContent = t.rancho?.rancho || 'N/A'
            if (tanqueEl) tanqueEl.textContent = t.Tanque?.codigo || 'N/A'
            if (fechaEl) fechaEl.textContent = t.fecha_preparacion
            if (volumenEl) volumenEl.textContent = t.litros_totales + ' L'
            if (tasaEl) tasaEl.textContent = (t.tasa_inyeccion || '0.00') + ' L/h'

            // Calcular activos consolidados
            const activosMap = new Map()

            if (t.MezclasTanques) {
                t.MezclasTanques.forEach(mt => {
                    const litrosMezcla = parseFloat(mt.cantidad_litros)
                    if (mt.MezclaCatalogo && mt.MezclaCatalogo.MezclaActivos) {
                        mt.MezclaCatalogo.MezclaActivos.forEach(ma => {
                            const activo = ma.ActivoMezcla
                            if (!activo) return

                            // porcentaje es DECIMAL(5,2) (ej. 3.57) en base de datos
                            const porcentaje = parseFloat(ma.porcentaje || 0)

                            // Cantidad de activo = Litros de Mezcla * (Porcentaje / 100)
                            // Si el activo es sólido (KG) y la mezcla líquida (L), asumimos densidad o conversión directa porcentaje p/v
                            const cantidadActivo = litrosMezcla * (porcentaje / 100)

                            if (activosMap.has(activo.id)) {
                                const activeData = activosMap.get(activo.id)
                                activeData.cantidad += cantidadActivo
                            } else {
                                activosMap.set(activo.id, {
                                    nombre: activo.nombre,
                                    tipo: activo.tipo,
                                    unidad: activo.unidad || 'KG',
                                    cantidad: cantidadActivo
                                })
                            }
                        })
                    }
                })
            }

            // Renderizar tabla
            const tbody = document.getElementById('tablaDetalleActivos')
            if (tbody) {
                tbody.innerHTML = ''

                if (activosMap.size === 0) {
                    tbody.innerHTML = '<tr><td colspan="4" class="text-center">No hay información de activos disponible</td></tr>'
                } else {
                    activosMap.forEach(act => {
                        const tr = document.createElement('tr')
                        tr.innerHTML = `
                            <td>${act.nombre}</td>
                            <td><span class="badge badge-outline-secondary">${act.tipo || 'N/A'}</span></td>
                            <td class="text-right font-weight-bold">${act.cantidad.toFixed(3)}</td>
                            <td>${act.unidad}</td>
                        `
                        tbody.appendChild(tr)
                    })
                }
            }

            // Mostrar modal con jQuery por bootstrap
            // eslint-disable-next-line no-undef
            $('#modalDetalleTanque').modal('show')
        } else {
            mostrarMensaje('No se pudo cargar el detalle', 'error')
        }
    } catch (error) {
        console.error(error)
        mostrarMensaje('Error al obtener detalles', 'error')
    } finally {
        hideSpinner()
    }
}

window.duplicarTanque = async(id) => {
    try {
        showSpinner()

        // Confirmar duplicación
        const confirmacion = confirm('¿Está seguro de duplicar este tanque? Se creará un nuevo tanque con las mismas mezclas y características.')
        if (!confirmacion) {
            hideSpinner()
            return
        }

        const resp = await fetchApi(`/api/fertilizacion/tanques-preparados/${id}/duplicar`, 'POST')
        const result = await resp.json()

        if (result.success && result.data) {
            mostrarMensaje('Tanque duplicado exitosamente', 'success')

            // Recargar el historial para mostrar el nuevo tanque
            await cargarTanquesPreparados()

            // Opcional: Preguntar si quiere ver el detalle del nuevo tanque
            const verDetalle = confirm('¿Desea ver el detalle del tanque duplicado?')
            if (verDetalle) {
                await verDetalleTanque(result.data.id)
            }
        } else {
            mostrarMensaje(result.error || 'Error al duplicar el tanque', 'error')
        }
    } catch (error) {
        console.error('Error al duplicar tanque:', error)
        mostrarMensaje('Error al duplicar el tanque', 'error')
    } finally {
        hideSpinner()
    }
}

function renderizarTablaHistorial(tanques) {
    const tbody = document.getElementById('tablaTanquesPreparados')
    if (!tbody) return

    tbody.innerHTML = tanques.map(t => {
        // Renderizar lista de mezclas
        let mezclasHtml = ''
        if (t.MezclasTanques && t.MezclasTanques.length > 0) {
            mezclasHtml = t.MezclasTanques.map(mt =>
                `<div class="mb-1"><span class="badge badge-light border"><i class="mdi mdi-flask-outline mr-1"></i><strong>${mt.MezclaCatalogo?.nombre}:</strong> ${mt.cantidad_litros}L</span></div>`
            ).join('')
        } else {
            mezclasHtml = t.MezclaCatalogo ? `<span class="badge badge-light border">${t.MezclaCatalogo.nombre}</span>` : '<span class="text-muted">N/A</span>'
        }

        return `
        <tr>
            <td>${t.codigo_tanque_preparado || 'N/A'}</td>
            <td>${t.fecha_preparacion}</td>
            <td>${t.rancho?.rancho || 'N/A'}</td>
            <td>${t.Tanque?.codigo || 'N/A'}</td>
            <td>${t.Tanque?.etapa || 'N/A'}</td>
            <td>${mezclasHtml}</td>
            <td class="text-center"><strong>${t.tasa_inyeccion || '0.00'}</strong> <small>L/h</small></td>
            <td><strong>${t.litros_disponibles}</strong> / ${t.litros_totales} L</td>
            <td>
                <button type="button" class="btn btn-sm btn-outline-primary" onclick="verDetalleTanque(${t.id})">
                    <i class="mdi mdi-eye"></i> Detalle
                </button>
                <button type="button" class="btn btn-sm btn-outline-primary" onclick="duplicarTanque(${t.id})">
                    <i class="mdi mdi-content-duplicate"></i> Duplicar
                </button>
            </td>
        </tr>
    `
    }).join('')
}
