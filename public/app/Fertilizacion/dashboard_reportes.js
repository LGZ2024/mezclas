/* eslint-disable no-undef */
import { mostrarMensaje } from '../funciones.js'
// eslint-disable-next-line no-unused-vars

document.addEventListener('DOMContentLoaded', () => {
    initDashboard()
})

const BASE_URL = '/api/fertilizacion'
let dataTable = null
let currentData = [] // Datos actuales del dashboard para el reporte

function initDashboard() {
    loadCatalogos()
    initDataTables()
    setupEventListeners()
}

// Cargar catálogos para filtros
async function loadCatalogos() {
    try {
        const [resRanchoDsa, resTemporadas, resSectores, resAnios] = await Promise.all([
            fetch('/corporativo/api/rancho-dsa'),
            fetch('/corporativo/api/temporadas'),
            fetch('/corporativo/api/sectores/'),
            fetch('/corporativo/api/anios/')
        ])

        const dataRanchoDsa = await resRanchoDsa.json()
        const dataTemporadas = await resTemporadas.json()
        const dataSectores = await resSectores.json()
        const dataAnios = await resAnios.json()

        if (dataRanchoDsa) {
            cargarRanchos(dataRanchoDsa)
        }
        if (dataTemporadas) {
            cargarTemporadas(dataTemporadas.temporadas)
        }
        if (resSectores) {
            cargarSectores(dataSectores)
        }
        if (dataAnios) {
            cargarAnios(dataAnios)
        }
    } catch (error) {
        console.error('Error:', error)
        mostrarMensaje('Error cargando filtros', 'error')
    }
}

const cargarAnios = async (data) => {
    try {
        const selectAnio = document.getElementById('filtro_anio')
        selectAnio.innerHTML = '<option value="">Todos</option>'
        data.anios.forEach(ano => {
            const option = document.createElement('option')
            option.value = ano.anio
            option.textContent = ano.anio
            selectAnio.appendChild(option)
        })
    } catch (error) {
        console.error('Error cargando años:', error)
    }
}

const cargarRanchos = async (data) => {
    try {
        const selectRancho = document.getElementById('filtro_rancho_dsa')
        selectRancho.innerHTML = '<option value="">Todos</option>'
        data.forEach(rancho => {
            const option = document.createElement('option')
            option.value = rancho.id
            option.textContent = `${rancho.nombre_rancho_dsa}`
            selectRancho.appendChild(option)
        })
    } catch (error) {
        console.error('Error cargando ranchos:', error)
    }
}

const cargarSectores = async (data) => {
    try {
        const selectSector = document.getElementById('filtro_sector')

        selectSector.innerHTML = '<option value="">Todos</option>'
        data.forEach(sector => {
            const option = document.createElement('option')
            option.value = sector.id
            option.textContent = `${sector.sector_interno} - ${sector.sector_agrian}`
            selectSector.appendChild(option)
        })
    } catch (error) {
        console.error('Error cargando sectores:', error)
    }
}

const cargarTemporadas = async (data) => {
    try {
        const selectTemporada = document.getElementById('filtro_temporada')

        selectTemporada.innerHTML = '<option value="">Todos</option>'
        data.forEach(temporada => {
            const option = document.createElement('option')
            option.value = temporada.temporada
            option.textContent = `${temporada.temporada}`
            selectTemporada.appendChild(option)
        })
    } catch (error) {
        console.error('Error cargando temporadas:', error)
    }
}

// Inicializar DataTables con idioma embebido para evitar CORS
function initDataTables() {
    if (dataTable) {
        dataTable.destroy()
    }

    dataTable = $('#tbFertilizacionNPK').DataTable({
        responsive: true,
        language: {
            processing: 'Procesando...',
            lengthMenu: 'Mostrar _MENU_ registros',
            zeroRecords: 'No se encontraron resultados',
            emptyTable: 'Ningún dato disponible en esta tabla',
            info: 'Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros',
            infoEmpty: 'Mostrando registros del 0 al 0 de un total de 0 registros',
            infoFiltered: '(filtrado de un total de _MAX_ registros)',
            search: 'Buscar:',
            infoThousands: ',',
            loadingRecords: 'Cargando...',
            paginate: {
                first: 'Primero',
                last: 'Último',
                next: 'Siguiente',
                previous: 'Anterior'
            },
            aria: {
                sortAscending: ': Activar para ordenar la columna de manera ascendente',
                sortDescending: ': Activar para ordenar la columna de manera descendente'
            }
        },
        dom: 'lfrtip',
        columns: [
            { data: 'fertilizacion_id' },
            { data: 'fecha' },
            { data: 'razon_social' },
            { data: 'nombre_rancho_dsa' },
            { data: 'sector_interno' },
            { data: 'variedad' },
            { data: 'hectareas' },
            { data: 'codigo_tanque_preparado' },
            { data: 'litros_aplicados' },
            { data: 'N_kg' },
            { data: 'P_kg' },
            { data: 'K_kg' },
            { data: 'N_kg_ha' },
            { data: 'P_kg_ha' },
            { data: 'K_kg_ha' }
        ]
    })
}

// Event Listeners
function setupEventListeners() {
    // Procesar filtros
    const formFiltros = document.getElementById('formFiltros')
    if (formFiltros) {
        formFiltros.addEventListener('submit', async (e) => {
            e.preventDefault()
            await procesarFertilizacion()
        })
    }

    // Exportar Excel
    const btnExportar = document.getElementById('btnExportar')
    if (btnExportar) {
        btnExportar.addEventListener('click', () => {
            const params = new URLSearchParams(new FormData(document.getElementById('formFiltros')))
            window.location.href = `${BASE_URL}/reportes/exportar?${params.toString()}`
        })
    }

    // Limpiar Filtros
    const btnLimpiar = document.getElementById('btnLimpiar')
    if (btnLimpiar) {
        btnLimpiar.addEventListener('click', () => {
            window.location.reload()
        })
    }

    // Generar Reporte
    const btnReporte = document.getElementById('btnReporte')
    if (btnReporte) {
        btnReporte.addEventListener('click', () => generarReporte())
    }

    // SELECTORES
    const selectRancho = document.getElementById('filtro_rancho_dsa')

    // EVENT LISTENERS
    selectRancho.addEventListener('change', (e) => {
        const selectedValue = e.target.value
        // Valor seleccionado
        procesarSelect(`/corporativo/api/sectores/${selectedValue}`)
    })
}

// Procesar conciliación
async function procesarFertilizacion() {
    const btn = document.getElementById('btnFiltrar')
    const originalText = btn.innerHTML
    btn.disabled = true
    btn.innerHTML = '<i class="mdi mdi-loading mdi-spin"></i> Procesando...'

    try {
        const formData = new FormData(document.getElementById('formFiltros'))
        const params = new URLSearchParams(formData)
        const response = await fetch(`${BASE_URL}/reportes/fertilizacion?${params.toString()}`)
        const result = await response.json()
        if (!response.ok) throw new Error(result.error)

        const data = result.data

        if (!data.length || data.length === 0) {
            const mensaje = result.advertencia || 'No se encontraron datos para los filtros seleccionados. Por favor, asegúrese de haber importado los archivos de Destajo y Cosecha.'
            mostrarMensaje(mensaje, 'info')
            document.getElementById('btnExportar').disabled = true
            document.getElementById('btnReporte').disabled = true
            document.getElementById('estadisticasRow').style.display = 'none'
            document.getElementById('graficas_tablas').style.display = 'none'
            dataTable.clear().draw()
            return
        }

        // Actualizar Tabla
        dataTable.clear()
        dataTable.rows.add(data)
        dataTable.draw()

        // Actualizar KPIs
        updateKPIs(data)
        currentData = data // Guardar para el reporte

        document.getElementById('estadisticasRow').style.display = 'flex'
        document.getElementById('graficas_tablas').style.display = 'flex'

        mostrarMensaje('Datos procesados correctamente', 'success')
        document.getElementById('btnExportar').disabled = false
        document.getElementById('btnReporte').disabled = false
    } catch (error) {
        mostrarMensaje(error, 'info', true)
    } finally {
        btn.disabled = false
        btn.innerHTML = originalText
    }
}

function updateKPIs(data) {
    if (!data || data.length === 0) {
        document.getElementById('totalEventos').textContent = '0'
        document.getElementById('totalLitros').textContent = '0'
        document.getElementById('totalTanques').textContent = '0'
        document.getElementById('totalHectareas').textContent = '0'
        document.getElementById('totalN').textContent = '0'
        document.getElementById('totalP').textContent = '0'
        document.getElementById('totalK').textContent = '0'
        document.getElementById('bodyNpkRancho').innerHTML = ''
        document.getElementById('bodyNpkVariedad').innerHTML = ''
        document.getElementById('bodyNpkSector').innerHTML = ''
        return
    }

    const fmt = new Intl.NumberFormat('es-MX', { maximumFractionDigits: 2 })

    // 1. Totales Generales
    const totalEventos = data.length
    const totalLitros = data.reduce((acc, curr) => acc + (parseFloat(curr.litros_aplicados) || 0), 0)
    const tanquesUnicos = new Set(data.map(d => d.codigo_tanque_preparado)).size
    const totalHectareas = data.reduce((acc, curr) => acc + (parseFloat(curr.hectareas) || 0), 0)

    const totalN = data.reduce((acc, curr) => acc + (parseFloat(curr.N_kg) || 0), 0)
    const totalP = data.reduce((acc, curr) => acc + (parseFloat(curr.P_kg) || 0), 0)
    const totalK = data.reduce((acc, curr) => acc + (parseFloat(curr.K_kg) || 0), 0)

    document.getElementById('totalEventos').textContent = fmt.format(totalEventos)
    document.getElementById('totalLitros').textContent = fmt.format(totalLitros)
    document.getElementById('totalTanques').textContent = fmt.format(tanquesUnicos)
    document.getElementById('totalHectareas').textContent = fmt.format(totalHectareas)
    document.getElementById('totalN').textContent = fmt.format(totalN)
    document.getElementById('totalP').textContent = fmt.format(totalP)
    document.getElementById('totalK').textContent = fmt.format(totalK)

    // Helper para agrupar y sumar
    const agruparYSumar = (campo) => {
        return data.reduce((acc, curr) => {
            const key = curr[campo] || 'Sin definir'
            if (!acc[key]) acc[key] = { N: 0, P: 0, K: 0, ha: 0 }
            acc[key].N += parseFloat(curr.N_kg) || 0
            acc[key].P += parseFloat(curr.P_kg) || 0
            acc[key].K += parseFloat(curr.K_kg) || 0
            acc[key].ha += parseFloat(curr.hectareas) || 0
            return acc
        }, {})
    }

    // Helper para renderizar tabla
    const renderTabla = (idBody, datosAgrupados, limit = null, mostrarNha = false) => {
        const tbody = document.getElementById(idBody)
        tbody.innerHTML = ''

        // Convertir a array y ordenar por N descendente
        let sorted = Object.entries(datosAgrupados).sort(([, a], [, b]) => b.N - a.N)

        // Limitar si se especifica
        if (limit) sorted = sorted.slice(0, limit)

        sorted.forEach(([nombre, npk]) => {
            const row = document.createElement('tr')
            const ha = npk.ha || 1
            const nhaCols = mostrarNha
                ? `
                <td class="text-right font-weight-bold text-info">${fmt.format(npk.N / ha)}</td>
                <td class="text-right font-weight-bold text-info">${fmt.format(npk.P / ha)}</td>
                <td class="text-right font-weight-bold text-info">${fmt.format(npk.K / ha)}</td>`
                : ''

            row.innerHTML = `
                <td>${nombre}</td>
                <td class="text-right">${fmt.format(npk.N)}</td>
                <td class="text-right">${fmt.format(npk.P)}</td>
                <td class="text-right">${fmt.format(npk.K)}</td>
                ${nhaCols}
            `
            tbody.appendChild(row)
        })

        return sorted
    }

    // Helper para crear gráfica de barras horizontales
    const crearGraficaBarras = (canvasId, labels, dataN, dataP, dataK) => {
        const ctx = document.getElementById(canvasId)
        if (!ctx) return

        // Destruir gráfica anterior si existe
        if (window[`chart_${canvasId}`]) {
            window[`chart_${canvasId}`].destroy()
        }

        window[`chart_${canvasId}`] = new Chart(ctx, {
            type: 'bar',
            data: {
                labels,
                datasets: [
                    {
                        label: 'N (kg)',
                        data: dataN,
                        backgroundColor: 'rgba(52, 152, 219, 0.7)',
                        borderColor: 'rgba(52, 152, 219, 1)',
                        borderWidth: 1
                    },
                    {
                        label: 'P (kg)',
                        data: dataP,
                        backgroundColor: 'rgba(46, 204, 113, 0.7)',
                        borderColor: 'rgba(46, 204, 113, 1)',
                        borderWidth: 1
                    },
                    {
                        label: 'K (kg)',
                        data: dataK,
                        backgroundColor: 'rgba(241, 196, 15, 0.7)',
                        borderColor: 'rgba(241, 196, 15, 1)',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: 'y',
                plugins: {
                    legend: {
                        display: true,
                        position: 'bottom',
                        labels: { boxWidth: 12, font: { size: 10 } }
                    }
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        ticks: { font: { size: 10 } }
                    },
                    y: {
                        ticks: { font: { size: 10 } }
                    }
                }
            }
        })
    }

    // 2. Renderizar Tablas y Gráficas de Desglose
    const npkPorRancho = agruparYSumar('nombre_rancho_dsa')
    const sortedRancho = renderTabla('bodyNpkRancho', npkPorRancho)
    crearGraficaBarras(
        'chartRancho',
        sortedRancho.map(([nombre]) => nombre),
        sortedRancho.map(([, npk]) => npk.N),
        sortedRancho.map(([, npk]) => npk.P),
        sortedRancho.map(([, npk]) => npk.K)
    )

    const npkPorVariedad = agruparYSumar('variedad')
    const sortedVariedad = renderTabla('bodyNpkVariedad', npkPorVariedad)
    crearGraficaBarras(
        'chartVariedad',
        sortedVariedad.map(([nombre]) => nombre),
        sortedVariedad.map(([, npk]) => npk.N),
        sortedVariedad.map(([, npk]) => npk.P),
        sortedVariedad.map(([, npk]) => npk.K)
    )

    // Para sectores: tabla con TODOS los sectores, gráfica con Top 10
    const npkPorSector = agruparYSumar('sector_interno')
    renderTabla('bodyNpkSector', npkPorSector, null, true) // con NPK/ha

    // Para la gráfica, tomamos solo los Top 10 por N
    const top10Sector = Object.entries(npkPorSector)
        .sort(([, a], [, b]) => b.N - a.N)
        .slice(0, 10)
    crearGraficaBarras(
        'chartSector',
        top10Sector.map(([nombre]) => nombre),
        top10Sector.map(([, npk]) => npk.N),
        top10Sector.map(([, npk]) => npk.P),
        top10Sector.map(([, npk]) => npk.K)
    )
}

//
async function procesarSelect(url) {
    try {
        const response = await fetch(url)
        const data = await response.json()
        if (data.length === 0) {
            mostrarMensaje('No se encontraron sectores para el rancho seleccionado', 'info')
            return
        }
        cargarSectores(data)
    } catch (error) {
        mostrarMensaje('Error cargando sectores', 'error')
    }
}
// =============================================
// GENERACIÓN DE REPORTE IMPRIMIBLE
// =============================================
const MESES_NOMBRE = ['', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

async function generarReporte() {
    if (!currentData || currentData.length === 0) {
        mostrarMensaje('No hay datos para generar el reporte. Realice una consulta primero.', 'info')
        return
    }

    const btn = document.getElementById('btnReporte')
    const originalText = btn.innerHTML
    btn.disabled = true
    btn.innerHTML = '<i class="mdi mdi-loading mdi-spin"></i> Generando...'

    try {
        // Obtener filtros aplicados para el encabezado
        const formData = new FormData(document.getElementById('formFiltros'))
        const filtros = {
            anio: formData.get('anio') || 'Todos',
            mes: formData.get('mes') ? MESES_NOMBRE[parseInt(formData.get('mes'))] : 'Todos',
            rancho: document.getElementById('filtro_rancho_dsa')?.selectedOptions[0]?.text || 'Todos',
            sector: document.getElementById('filtro_sector')?.selectedOptions[0]?.text || 'Todos',
            temporada: formData.get('temporada') || 'Todos'
        }

        // Obtener códigos únicos de tanques
        const codigosTanques = [...new Set(
            currentData.map(d => d.codigo_tanque_preparado).filter(Boolean)
        )]

        // Pedir detalle de tanques al backend
        let detalleTanques = []
        if (codigosTanques.length > 0) {
            const resp = await fetch(`${BASE_URL}/reportes/detalle-tanques?codigos=${codigosTanques.join(',')}`)
            const result = await resp.json()
            detalleTanques = result.data || []
        }

        // Agrupar datos por año+mes
        const porMes = {}
        currentData.forEach(row => {
            const key = `${row.anio}-${String(row.mes).padStart(2, '0')}`
            if (!porMes[key]) porMes[key] = { anio: row.anio, mes: row.mes, filas: [] }
            porMes[key].filas.push(row)
        })

        // Ordenar meses cronológicamente
        const mesesOrdenados = Object.entries(porMes).sort(([a], [b]) => a.localeCompare(b))

        // Construir HTML del reporte
        const html = construirHTMLReporte(mesesOrdenados, detalleTanques, filtros)

        // Abrir ventana de impresión
        const ventana = window.open('', '_blank', 'width=1100,height=800')
        ventana.document.write(html)
        ventana.document.close()
        ventana.focus()
    } catch (error) {
        mostrarMensaje('Error generando el reporte: ' + error.message, 'error')
    } finally {
        btn.disabled = false
        btn.innerHTML = originalText
    }
}

function construirHTMLReporte(mesesOrdenados, detalleTanques, filtros) {
    const fmt = new Intl.NumberFormat('es-MX', { maximumFractionDigits: 2 })
    const hoy = new Date().toLocaleDateString('es-MX', { day: '2-digit', month: 'long', year: 'numeric' })

    // Mapa de tanques por código para acceso rápido
    const tanqueMap = {}
    detalleTanques.forEach(t => { tanqueMap[t.codigo] = t })

    const seccionesMes = mesesOrdenados.map(([key, { anio, mes, filas }], idx) => {
        const nombreMes = MESES_NOMBRE[mes] || mes
        const pageBreak = idx > 0 ? 'page-break-before: always;' : ''

        // KPIs del mes
        const totalEventos = filas.length
        const totalLitros = filas.reduce((a, r) => a + (parseFloat(r.litros_aplicados) || 0), 0)
        const tanquesUnicos = new Set(filas.map(r => r.codigo_tanque_preparado)).size
        const totalHa = filas.reduce((a, r) => a + (parseFloat(r.hectareas) || 0), 0)
        const totalN = filas.reduce((a, r) => a + (parseFloat(r.N_kg) || 0), 0)
        const totalP = filas.reduce((a, r) => a + (parseFloat(r.P_kg) || 0), 0)
        const totalK = filas.reduce((a, r) => a + (parseFloat(r.K_kg) || 0), 0)

        // Agrupaciones NPK
        const agrupar = (campo) => filas.reduce((acc, r) => {
            const k = r[campo] || 'Sin definir'
            if (!acc[k]) acc[k] = { N: 0, P: 0, K: 0, ha: 0 }
            acc[k].N += parseFloat(r.N_kg) || 0
            acc[k].P += parseFloat(r.P_kg) || 0
            acc[k].K += parseFloat(r.K_kg) || 0
            acc[k].ha += parseFloat(r.hectareas) || 0
            return acc
        }, {})

        const tablaHTML = (datos, titulo, mostrarNha = false) => {
            const filasSorted = Object.entries(datos).sort(([, a], [, b]) => b.N - a.N)
            const headers = mostrarNha
                ? '<th>Nombre</th><th>N (kg)</th><th>P (kg)</th><th>K (kg)</th><th>N/ha</th><th>P/ha</th><th>K/ha</th>'
                : '<th>Nombre</th><th>N (kg)</th><th>P (kg)</th><th>K (kg)</th>'

            return `
                <h4 style="color:#2c3e50;border-bottom:2px solid #3498db;padding-bottom:4px;margin-top:16px">${titulo}</h4>
                <table class="rpt-table">
                    <thead><tr>${headers}</tr></thead>
                    <tbody>
                        ${filasSorted.map(([nombre, npk]) => {
                const ha = npk.ha || 1
                const dataCols = mostrarNha
                    ? `
                                <td class="num highlight-ha">${fmt.format(npk.N)}</td>
                                <td class="num highlight-ha">${fmt.format(npk.P)}</td>
                                <td class="num highlight-ha">${fmt.format(npk.K)}</td>
                                <td class="num highlight-ha">${fmt.format(npk.N / ha)}</td>
                                <td class="num highlight-ha">${fmt.format(npk.P / ha)}</td>
                                <td class="num highlight-ha">${fmt.format(npk.K / ha)}</td>`
                    : `
                                <td class="num highlight-ha">${fmt.format(npk.N)}</td>
                                <td class="num highlight-ha">${fmt.format(npk.P)}</td>
                                <td class="num highlight-ha">${fmt.format(npk.K)}</td>`

                return `
                            <tr>
                                <td style="text-align:left;padding-left:10px">${nombre}</td>
                                ${dataCols}
                            </tr>`
            }).join('')}
                    </tbody>
                </table>`
        }

        // Tanques usados en este mes
        const codigosMes = [...new Set(filas.map(r => r.codigo_tanque_preparado).filter(Boolean))]
        const tanquesMes = codigosMes.map(cod => tanqueMap[cod]).filter(Boolean)

        const tanquesHTML = tanquesMes.length === 0
            ? '<p style="color:#888">Sin detalle de tanques disponible.</p>'
            : tanquesMes.map(t => `
                <div class="tanque-card">
                    <div class="tanque-header">
                        <span>🧪 Tanque: <strong>${t.codigo}</strong></span>
                        <span>Rancho: ${t.rancho || '—'}</span>
                        <span>Litros totales: <strong>${fmt.format(t.litros_totales)}</strong></span>
                    </div>
                    ${t.mezclas.length === 0
                    ? '<p style="padding:8px;color:#888">Sin mezclas registradas.</p>'
                    : t.mezclas.map(m => `
                            <div class="mezcla-block">
                                <div class="mezcla-nombre">📦 ${m.nombre} <span style="color:#888;font-weight:normal">(${m.fabricante || '—'})</span> — ${fmt.format(m.litros)} L</div>
                                ${m.activos.length === 0
                            ? ''
                            : `
                                <table class="rpt-table" style="margin-top:4px">
                                    <thead><tr><th>Activo</th><th>Código</th><th>Porcentaje</th><th>Unidad</th></tr></thead>
                                    <tbody>
                                        ${m.activos.map(a => `
                                            <tr>
                                                <td>${a.nombre}</td>
                                                <td>${a.codigo || '—'}</td>
                                                <td class="num">${fmt.format(a.porcentaje)}%</td>
                                                <td>${a.unidad || '—'}</td>
                                            </tr>`).join('')}
                                    </tbody>
                                </table>`}
                            </div>`).join('')}
                </div>`).join('')

        return `
        <div style="${pageBreak}padding-top:${idx > 0 ? '20px' : '0'}">
            <div class="mes-header">
                <h2>${nombreMes} ${anio}</h2>
            </div>

            <!-- KPIs -->
            <div class="kpi-grid">
                <div class="kpi-box"><div class="kpi-val">${fmt.format(totalEventos)}</div><div class="kpi-lbl">Fertilizaciones</div></div>
                <div class="kpi-box"><div class="kpi-val">${fmt.format(totalLitros)}</div><div class="kpi-lbl">Litros</div></div>
                <div class="kpi-box"><div class="kpi-val">${tanquesUnicos}</div><div class="kpi-lbl">Tanques</div></div>
                <div class="kpi-box"><div class="kpi-val">${fmt.format(totalHa)}</div><div class="kpi-lbl">Hectáreas</div></div>
                <div class="kpi-box npk"><div class="kpi-val">N: ${fmt.format(totalN)}</div><div class="kpi-lbl">kg Nitrógeno</div></div>
                <div class="kpi-box npk"><div class="kpi-val">P: ${fmt.format(totalP)}</div><div class="kpi-lbl">kg Fósforo</div></div>
                <div class="kpi-box npk"><div class="kpi-val">K: ${fmt.format(totalK)}</div><div class="kpi-lbl">kg Potasio</div></div>
            </div>

            <!-- NPK por Rancho, Variedad, Sector -->
            <div style="margin-top:8px">
                ${tablaHTML(agrupar('nombre_rancho_dsa'), 'NPK por Rancho', false)}
                ${tablaHTML(agrupar('variedad'), 'NPK por Variedad', false)}
                ${tablaHTML(agrupar('sector_interno'), 'NPK por Sector', true)}
            </div>

            <!-- Detalle de Fertilizaciones -->
            <h4 style="color:#2c3e50;border-bottom:2px solid #34495e;padding-bottom:4px;margin-top:20px">📋 Detalle de Fertilizaciones</h4>
            <table class="rpt-table detallada">
                <thead>
                    <tr>
                        <th class="detallada-col-fecha">Fecha</th>
                        <th class="detallada-col-sector">Sector</th>
                        <th class="detallada-col-variedad">Variedad</th>
                        <th class="detallada-col-ha">Ha</th>
                        <th class="detallada-col-tanque">Tanque</th>
                        <th class="detallada-col-litros">Litros</th>
                        <th class="detallada-col-npk ">N (kg)</th>
                        <th class="detallada-col-npk">P (kg)</th>
                        <th class="detallada-col-npk">K (kg)</th>
                        <th class="detallada-col-npk ">N/ha</th>
                        <th class="detallada-col-npk ">P/ha</th>
                        <th class="detallada-col-npk ">K/ha</th>
                    </tr>
                </thead>
                <tbody>
                    ${filas.map(r => `
                        <tr>
                            <td>${r.fecha}</td>
                            <td>${r.sector_interno}</td>
                            <td>${r.variedad}</td>
                            <td class="num">${fmt.format(r.hectareas)}</td>
                            <td>${r.codigo_tanque_preparado || '—'}</td>
                            <td class="num">${fmt.format(r.litros_aplicados)}</td>
                            <td class="num highlight-ha">${fmt.format(r.N_kg)}</td>
                            <td class="num highlight-ha">${fmt.format(r.P_kg)}</td>
                            <td class="num highlight-ha">${fmt.format(r.K_kg)}</td>
                            <td class="num highlight-ha">${fmt.format(r.N_kg_ha)}</td>
                            <td class="num highlight-ha">${fmt.format(r.P_kg_ha)}</td>
                            <td class="num highlight-ha">${fmt.format(r.K_kg_ha)}</td>
                        </tr>`).join('')}
                </tbody>
            </table>

            <!-- Tanques -->
            <h4 style="color:#2c3e50;border-bottom:2px solid #27ae60;padding-bottom:4px;margin-top:20px">🧪 Tanques Utilizados y Composición de Mezclas</h4>
            ${tanquesHTML}
        </div>`
    }).join('')

    return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>Reporte de Fertilización</title>
<style>
    * { box-sizing: border-box; margin: 0; padding: 0; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    body { font-family: Arial, sans-serif; font-size: 11px; color: #222; padding: 20px; }
    .rpt-header { text-align: center; margin-bottom: 20px; border-bottom: 3px solid #2c3e50; padding-bottom: 12px; }
    .rpt-header h1 { font-size: 18px; color: #2c3e50; }
    .rpt-header p { color: #666; font-size: 11px; margin-top: 4px; }
    .filtros-row { display: flex; gap: 20px; justify-content: center; margin-top: 8px; font-size: 11px; color: #444; }
    .filtros-row span { background: #f0f4f8; padding: 2px 8px; border-radius: 4px; }
    .mes-header { background: linear-gradient(135deg, #2c3e50, #3498db) !important; color: #fff !important; padding: 10px 16px; border-radius: 6px; margin-bottom: 12px; }
    .mes-header h2 { font-size: 15px; }
    .kpi-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 8px; margin-bottom: 12px; }
    .kpi-box { background: #f8f9fa !important; border: 1px solid #dee2e6; border-radius: 6px; padding: 8px; text-align: center; }
    .kpi-box.npk { background: #eaf4fb !important; border-color: #aed6f1; }
    .kpi-val { font-size: 13px; font-weight: bold; color: #2c3e50; }
    .kpi-lbl { font-size: 9px; color: #888; margin-top: 2px; }
    .rpt-table { width: 100%; border-collapse: collapse; font-size: 10px; margin-bottom: 12px; border: 1.5px solid #2c3e50; }
    .rpt-table th { background: #34495e !important; color: #fff !important; padding: 8px 4px; text-align: center; border: 1px solid #2c3e50; }
    .rpt-table td { padding: 6px 4px; border: 1px solid #dee2e6; text-align: center; }
    .rpt-table tr:nth-child(even) td { background: #fdfdfd !important; }
    .rpt-table td.num { text-align: right; font-family: 'Courier New', monospace; font-weight: bold; padding-right: 8px; }
    .rpt-table .highlight-ha { background: #f1f8ff !important; border-left: 2px solid #3498db; }
    .rpt-table.detallada { font-size: 9px; }
    
    /* Anchos específicos para tabla detallada para evitar desorganización */
    .detallada-col-fecha { width: 75px; }
    .detallada-col-sector { width: 50px; }
    .detallada-col-variedad { width: 80px; }
    .detallada-col-ha { width: 45px; }
    .detallada-col-tanque { width: 110px; }
    .detallada-col-litros { width: 55px; }
    .detallada-col-npk { width: 45px; }
    
    .tanque-card { border: 2px solid #2c3e50; border-radius: 6px; margin-bottom: 20px; overflow: hidden; page-break-inside: avoid; }
    .tanque-header { background: #2c3e50 !important; color: #fff !important; padding: 10px 15px; display: flex; justify-content: space-between; font-size: 12px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .mezcla-block { padding: 12px 15px; border-top: 1px solid #eee; background: #fff !important; }
    .mezcla-nombre { font-weight: bold; color: #2980b9; margin-bottom: 8px; border-left: 5px solid #2980b9; padding-left: 10px; font-size: 11px; }
    h4 { margin-top: 25px; margin-bottom: 10px; font-weight: bold; }
    @media print {
        body { padding: 10px; }
        .no-print { display: none; }
        @page { margin: 1.5cm; }
    }

</style>
</head>
<body>
<div class="rpt-header">
    <h1>Reporte de Fertilización</h1>
    <p>Generado el ${hoy}</p>
    <div class="filtros-row">
        <span>Año: ${filtros.anio}</span>
        <span>Mes: ${filtros.mes}</span>
        <span>Rancho: ${filtros.rancho}</span>
        <span>Sector: ${filtros.sector}</span>
        <span>Temporada: ${filtros.temporada}</span>
    </div>
</div>
<div class="no-print" style="text-align:center;margin-bottom:16px">
    <button onclick="window.print()" style="background:#2c3e50;color:#fff;border:none;padding:8px 20px;border-radius:6px;cursor:pointer;font-size:13px">🖨️ Imprimir / Guardar PDF</button>
</div>
${seccionesMes}
</body>
</html>`
}
