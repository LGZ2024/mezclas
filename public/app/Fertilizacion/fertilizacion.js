/* eslint-disable no-undef */
import { mostrarMensaje } from '../funciones.js'
let fertilizacionActual = null
let tanquesAgregados = []
let sectoresCargados = [] // Para guardar hectáreas
let tanquesPreparadosCargados = [] // Para guardar tasas de inyección
let datosEvento = {
    sectores: [], // Ahora es un array
    temporada: null,
    observaciones: null
}

document.addEventListener('DOMContentLoaded', async () => {
    document.getElementById('fecha_fertilizacion').valueAsDate = new Date()
    await cargarCatalogos()
})

async function cargarCatalogos() {
    try {
        // Hacer todas las peticiones en paralelo
        const [resRanchoDsa, resTemporadas] = await Promise.all([
            fetch('/corporativo/api/rancho-dsa'),
            fetch('/corporativo/api/temporadas')
        ])

        const dataRanchoDsa = await resRanchoDsa.json()
        const dataTemporadasResp = await resTemporadas.json()

        if (dataRanchoDsa) {
            const selectRanchoDsa = document.getElementById('id_rancho_dsa')
            selectRanchoDsa.innerHTML = '<option value="">Seleccionar rancho DSA...</option>'
            dataRanchoDsa.forEach(s => {
                selectRanchoDsa.innerHTML += `<option data-id="${s.id_rancho}" value="${s.id}">${s.nombre_rancho_dsa}</option>`
            })

            if (dataTemporadasResp.temporadas) {
                const selectTemporada = document.getElementById('temporada')
                selectTemporada.innerHTML = '<option value="">Seleccionar temporada...</option>'
                dataTemporadasResp.temporadas.forEach(t => {
                    selectTemporada.innerHTML += `<option value="${t.temporada}">${t.temporada}</option>`
                })
            }
        }

        // Inicializar Select2 para los campos cargados
        if (window.jQuery && window.jQuery.fn.select2) {
            window.jQuery('.js-example-basic-single').select2({ width: '100%' })
        }

        if (window.jQuery) {
            window.jQuery('#id_rancho_dsa').on('change', async function () {
                const $selected = window.jQuery(this).find('option:selected')
                const idRanchoDsa = window.jQuery(this).val()
                const idRancho = $selected.data('id')

                if (!idRanchoDsa || !idRancho) return

                console.log('Cargando sectores para Rancho DSA:', idRanchoDsa, 'Rancho ID:', idRancho)

                const [mezclas, sectores] = await Promise.all([
                    fetch(`/api/fertilizacion/tanques-preparados/rancho/${idRancho}`),
                    fetch(`/corporativo/api/sectores/${idRanchoDsa}`)
                ])
                const data = await mezclas.json()
                const dataSectores = await sectores.json()

                sectoresCargados = dataSectores
                tanquesPreparadosCargados = data.data || []

                const $selectSector = window.jQuery ? window.jQuery('#id_sector') : null

                if ($selectSector) {
                    $selectSector.empty()
                    dataSectores.forEach(s => {
                        const option = new Option(`Sector: ${s.sector_interno} (${s.hectareas} Ha) - Variedad: ${s.variedad}`, s.id, false, false)
                        option.dataset.ha = s.hectareas
                        $selectSector.append(option)
                    })

                    if (window.jQuery.fn.select2) {
                        $selectSector.select2({
                            width: '100%',
                            placeholder: 'Seleccionar sector(es)...'
                        }).trigger('change')
                    }
                } else {
                    const selectSector = document.getElementById('id_sector')
                    selectSector.innerHTML = ''
                    dataSectores.forEach(s => {
                        selectSector.innerHTML += `<option value="${s.id}" data-ha="${s.hectareas}">Sector: ${s.sector_interno} (${s.hectareas} Ha) - Variedad: ${s.variedad}</option>`
                    })
                }

                const selectTanque = document.getElementById('id_tanque_preparado')
                selectTanque.innerHTML = '<option value="">Seleccionar tanque...</option>'
                if (tanquesPreparadosCargados.length === 0) {
                    mostrarError('Atención: No se encontraron tanques preparados para este rancho.')
                }

                tanquesPreparadosCargados.forEach(t => {
                    const codeDisplay = t.codigo_tanque_preparado ? `[${t.codigo_tanque_preparado}-${t.Tanque?.etapa || 'Etapa'}] ` : ''
                    const nombreMezcla = t.MezclasTanques && t.MezclasTanques[0] ? (t.MezclasTanques[0].MezclaCatalogo?.nombre || 'Mezcla') : 'Mezcla'
                    selectTanque.innerHTML += `<option value="${t.id}">${codeDisplay}${nombreMezcla} - Tasa: ${t.tasa_inyeccion} L/h - Disp: ${t.litros_disponibles}L</option>`
                })
            })
        }
    } catch (error) {
        console.error('Error al cargar catálogos:', error)
        mostrarError('Error al cargar datos')
    }
}
// PASO 1: Crear evento
document.getElementById('formPaso1').addEventListener('submit', async (e) => {
    e.preventDefault()

    const sectoresSeleccionados = Array.from(document.getElementById('id_sector').selectedOptions).map(opt => ({
        id: opt.value,
        nombre: opt.text,
        hectareas: parseFloat(opt.dataset.ha || 0)
    }))

    if (sectoresSeleccionados.length === 0) {
        mostrarError('Selecciona al menos un sector')
        return
    }

    const temporada = document.getElementById('temporada').value
    if (!temporada) {
        mostrarError('Selecciona una temporada')
        return
    }

    if (tanquesPreparadosCargados.length === 0) {
        mostrarError('No hay tanques preparados disponibles para este rancho. Debes preparar un tanque primero.')
        return
    }

    datosEvento = {
        sectores: sectoresSeleccionados,
        temporada,
        observaciones: document.getElementById('observaciones').value || null
    }

    fertilizacionActual = null
    tanquesAgregados = []

    // Mostrar info del evento
    const infoDiv = document.getElementById('infoEvento')
    const detalles = document.getElementById('eventoDetalles')
    const sectoresTexto = sectoresSeleccionados.map(s => s.nombre).join('<br>')
    const temporadaTexto = document.getElementById('temporada').selectedOptions[0].text

    detalles.innerHTML = `
                <div><strong>Sectores:</strong><br>${sectoresTexto}</div>
                <div><strong>Temporada:</strong> ${temporadaTexto}</div>
                <div><strong>Observaciones:</strong> ${datosEvento.observaciones || 'N/A'}</div>
            `
    infoDiv.style.display = 'block'

    irAlPaso(2)
    mostrarExito('Datos del evento listos. Agrega el primer tanque para crear la fertilización.')
})

// PASO 2: Agregar tanques
document.getElementById('btnAgregarTanque').addEventListener('click', async () => {
    const idTanque = document.getElementById('id_tanque_preparado').value
    const horasAplicadas = parseFloat(document.getElementById('horas_aplicadas').value)

    if (!idTanque || isNaN(horasAplicadas) || horasAplicadas <= 0) {
        mostrarError('Completa todos los campos correctamente')
        return
    }

    if (datosEvento.sectores.length === 0) {
        mostrarError('Primero selecciona los sectores en el Paso 1')
        irAlPaso(1)
        return
    }

    const tanque = tanquesPreparadosCargados.find(t => t.id == idTanque)
    if (!tanque) {
        mostrarError('Tanque no encontrado')
        return
    }

    const litrosTotales = horasAplicadas * (parseFloat(tanque.tasa_inyeccion) || 0)

    if (litrosTotales > (parseFloat(tanque.litros_disponibles) + 0.1)) {
        mostrarError(`La cantidad calculada (${litrosTotales.toFixed(2)} L) excede los litros disponibles en el tanque (${tanque.litros_disponibles} L)`)
        return
    }

    try {
        document.getElementById('loadingTanque').style.display = 'block'

        const payload = {
            sectores: datosEvento.sectores.map(s => s.id),
            id_tanque_preparado: parseInt(idTanque),
            horas_aplicadas: horasAplicadas,
            litros_totales_calculados: litrosTotales,
            observaciones: datosEvento.observaciones,
            temporada: datosEvento.temporada
        }

        // Llamar al endpoint que maneja múltiples sectores
        const resCreate = await fetchApi('/api/fertilizacion/fertilizaciones/bulk', 'POST', payload)
        const resultCreate = await resCreate.json()

        if (!resultCreate.success) {
            mostrarError(resultCreate.message || 'Error al registrar fertilización')
            return
        }

        // Guardamos referencia de los IDs creados si es necesario
        fertilizacionActual = { ids: resultCreate.data.ids, observaciones: datosEvento.observaciones }

        // Agregar el tanque al arreglo local para el resumen
        const tanqueTexto = document.getElementById('id_tanque_preparado').selectedOptions[0].text
        tanquesAgregados.push({
            id_tanque: idTanque,
            horas: horasAplicadas,
            litros: litrosTotales,
            nombre_tanque: tanqueTexto
        })

        actualizarTablaTanques()
        document.getElementById('id_tanque_preparado').value = ''
        document.getElementById('horas_aplicadas').value = ''
        document.getElementById('btnFinalizarTanques').disabled = false

        mostrarExito('Fertilización registrada correctamente para todos los sectores')
    } catch (error) {
        console.error(error)
        mostrarError('Error de sistema: ' + error.message)
    } finally {
        document.getElementById('loadingTanque').style.display = 'none'
    }
})

function actualizarTablaTanques() {
    const container = document.getElementById('containerTanques')
    const tabla = document.getElementById('tablaTanques')

    if (tanquesAgregados.length === 0) {
        container.style.display = 'none'
        return
    }

    container.style.display = 'block'
    tabla.innerHTML = tanquesAgregados.map((t, idx) => `
                <tr>
                    <td>${t.nombre_tanque}</td>
                    <td>-</td>
                    <td>${t.horas} h</td>
                    <td>${t.litros.toFixed(2)} L</td>
                    <td><span class="badge badge-active">Registrado</span></td>
                    <td>
                        <span class="text-muted" title="Ya registrado"><i class="mdi mdi-check"></i></span>
                    </td>
                </tr>
            `).join('')
}

document.getElementById('btnFinalizarTanques').addEventListener('click', () => {
    irAlPaso(3)
    mostrarResumen()
})

function mostrarResumen() {
    // Info del evento
    const tablaEvento = document.getElementById('tablaEventoResumen')
    const sectoresTexto = datosEvento.sectores.map(s => s.nombre).join('<br>')
    const temporadaTexto = document.getElementById('temporada').selectedOptions[0].text

    tablaEvento.innerHTML = `
                <tr>
                    <td><strong>ID(s):</strong></td>
                    <td>${fertilizacionActual.ids ? fertilizacionActual.ids.join(', ') : 'N/A'}</td>
                </tr>
                <tr>
                    <td><strong>Sector(es):</strong></td>
                    <td>${sectoresTexto}</td>
                </tr>
                <tr>
                    <td><strong>Temporada:</strong></td>
                    <td>${temporadaTexto}</td>
                </tr>
                <tr>
                    <td><strong>Fecha Registro:</strong></td>
                    <td>${new Date().toLocaleDateString()}</td>
                </tr>
                <tr>
                    <td><strong>Observaciones:</strong></td>
                    <td>${datosEvento.observaciones || 'N/A'}</td>
                </tr>
            `

    // Tanques
    if (tanquesAgregados.length > 0) {
        document.getElementById('infoTanquesResumen').style.display = 'block'
        const tablaTanques = document.getElementById('tablaTanquesResumen')
        tablaTanques.innerHTML = tanquesAgregados.map(t => `
                    <tr>
                        <td>${t.nombre_tanque}</td>
                        <td>-</td>
                        <td>${t.horas} h</td>
                        <td>${t.litros.toFixed(2)} L</td>
                    </tr>
                `).join('')

        const totalHoras = tanquesAgregados.reduce((sum, t) => sum + t.horas, 0)
        const totalLitros = tanquesAgregados.reduce((sum, t) => sum + t.litros, 0)
        document.getElementById('totalTanques').textContent = tanquesAgregados.length
        document.getElementById('totalHoras').textContent = totalHoras.toFixed(2) + ' h'
        document.getElementById('totalLitros').textContent = totalLitros.toFixed(2) + ' L'
    } else {
        document.getElementById('infoTanquesResumen').style.display = 'none'
    }

    document.getElementById('alertExito').style.display = 'block'
}

function irAlPaso(paso) {
    document.querySelectorAll('.form-section').forEach(s => s.classList.remove('active'))
    document.getElementById(`step-${paso}`).classList.add('active')

    document.querySelectorAll('.step').forEach(s => {
        s.classList.remove('active', 'completed')
        if (parseInt(s.dataset.step) === paso) {
            s.classList.add('active')
        } else if (parseInt(s.dataset.step) < paso) {
            s.classList.add('completed')
        }
    })
}
document.getElementById('btnNuevoRegistro').addEventListener('click', resetearFormulario)

function resetearFormulario() {
    fertilizacionActual = null
    tanquesAgregados = []
    datosEvento = { id_sector: null, observaciones: null }

    document.getElementById('formPaso1').reset()
    document.getElementById('formPaso2').reset()

    // Reiniciar Select2
    if (window.jQuery && window.jQuery.fn.select2) {
        window.jQuery('.js-example-basic-single, .js-example-basic-multiple').val(null).trigger('change')
    }
    document.getElementById('fecha_fertilizacion').valueAsDate = new Date()

    document.getElementById('containerTanques').style.display = 'none'
    document.getElementById('btnFinalizarTanques').disabled = true
    document.getElementById('alertExito').style.display = 'none'
    document.getElementById('infoEvento').style.display = 'none'

    irAlPaso(1)
}

function mostrarError(msg) {
    // Assuming Swal is available or simple alert
    if (typeof Swal !== 'undefined') {
        Swal.fire('Error', msg, 'error')
    } else {
        alert('❌ ' + msg)
    }
}

function mostrarExito(msg) {
    if (typeof Swal !== 'undefined') {
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true
        })
        Toast.fire({
            icon: 'success',
            title: msg
        })
    } else {
        // Éxito
    }
}

// Helper wrapper if fetchApi is not global
async function fetchApi(url, method = 'GET', body = null) {
    const options = {
        method,
        headers: { 'Content-Type': 'application/json' }
    }
    if (body) options.body = JSON.stringify(body)
    return fetch(url, options)
}
