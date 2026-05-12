/* eslint-disable no-undef */
/* Reportes de Fertilización */

document.addEventListener('DOMContentLoaded', () => {
    let chartTendencia = null

    // ========== INICIALIZACIÓN ==========
    const init = async () => {
        await cargarAnios()
        await cargarRanchos()
        cargarReporteNPKRancho()
    }

    // ========== CARGAR AÑOS ==========
    const cargarAnios = async () => {
        try {
            const response = await fetch('/api/fertilizacion/api/reportes/resumen-anual')
            const data = await response.json()

            const selectAnio = document.getElementById('filtro_anio')
            const anos = [...new Set(data.data.map(r => r.anio))].sort((a, b) => b - a)

            selectAnio.innerHTML = '<option value="">Todos</option>'
            anos.forEach(ano => {
                const option = document.createElement('option')
                option.value = ano
                option.textContent = ano
                selectAnio.appendChild(option)
            })

            if (anos.length > 0) {
                selectAnio.value = anos[0]
            }
        } catch (error) {
            console.error('Error cargando años:', error)
        }
    }

    // ========== CARGAR RANCHOS ==========
    const cargarRanchos = async () => {
        try {
            const response = await fetch('/api/fertilizacion/catalogos')
            const data = await response.json()

            const selectRancho = document.getElementById('filtro_rancho')
            selectRancho.innerHTML = '<option value="">Todos</option>'

            if (data.data.ranchos && data.data.ranchos.length > 0) {
                data.data.ranchos.forEach(rancho => {
                    const option = document.createElement('option')
                    option.value = rancho.id
                    option.textContent = rancho.nombre_rancho
                    selectRancho.appendChild(option)
                })
            }
        } catch (error) {
            console.error('Error cargando ranchos:', error)
        }
    }

    // ========== REPORTE: NPK POR RANCHO ==========
    const cargarReporteNPKRancho = async () => {
        try {
            showSpinner()
            const params = new URLSearchParams()

            const anio = document.getElementById('filtro_anio').value
            const mes = document.getElementById('filtro_mes').value
            const rancho = document.getElementById('filtro_rancho').value

            if (anio) params.append('anio', anio)
            if (mes) params.append('mes', mes)
            if (rancho) params.append('id_rancho', rancho)

            const response = await fetch(`/api/fertilizacion/api/reportes/npk-rancho?${params}`)
            const data = await response.json()

            const tbody = document.getElementById('tbody-npk-rancho')
            tbody.innerHTML = ''

            if (data.data && data.data.length > 0) {
                data.data.forEach(row => {
                    const tr = document.createElement('tr')
                    tr.innerHTML = `
                        <td>${row.empresa || '-'}</td>
                        <td>${row.nombre_rancho || '-'}</td>
                        <td>${row.periodo || '-'}</td>
                        <td>${formatNumber(row.hectareas_regadas)}</td>
                        <td>${formatNumber(row.nitrogeno_kg)}</td>
                        <td>${formatNumber(row.n_por_hectarea)}</td>
                        <td>${formatNumber(row.fosforo_kg)}</td>
                        <td>${formatNumber(row.p_por_hectarea)}</td>
                        <td>${formatNumber(row.potasio_kg)}</td>
                        <td>${formatNumber(row.k_por_hectarea)}</td>
                    `
                    tbody.appendChild(tr)
                })
            } else {
                tbody.innerHTML = '<tr><td colspan="10" class="text-center">Sin datos</td></tr>'
            }
            hideSpinner()
        } catch (error) {
            console.error('Error:', error)
            mostrarError('Error cargando reporte NPK')
            hideSpinner()
        }
    }

    // ========== REPORTE: RESUMEN MENSUAL ==========
    const cargarResumenMensual = async () => {
        try {
            showSpinner()
            const params = new URLSearchParams()

            const anio = document.getElementById('filtro_anio').value
            const mes = document.getElementById('filtro_mes').value
            const rancho = document.getElementById('filtro_rancho').value

            if (anio) params.append('anio', anio)
            if (mes) params.append('mes', mes)
            if (rancho) params.append('id_rancho', rancho)

            const response = await fetch(`/api/fertilizacion/api/reportes/rancho-mensual?${params}`)
            const data = await response.json()

            const tbody = document.getElementById('tbody-rancho-mensual')
            tbody.innerHTML = ''

            if (data.data && data.data.length > 0) {
                data.data.forEach(row => {
                    const tr = document.createElement('tr')
                    tr.innerHTML = `
                        <td>${row.empresa || '-'}</td>
                        <td>${row.nombre_rancho || '-'}</td>
                        <td>${row.periodo || '-'}</td>
                        <td>${row.sectores_fertilizados || 0}</td>
                        <td>${row.total_aplicaciones || 0}</td>
                        <td>${formatNumber(row.hectareas_regadas)}</td>
                        <td>${formatNumber(row.litros_totales_aplicados)}</td>
                        <td>${row.tanques_usados || 0}</td>
                    `
                    tbody.appendChild(tr)
                })
            } else {
                tbody.innerHTML = '<tr><td colspan="8" class="text-center">Sin datos</td></tr>'
            }
            hideSpinner()
        } catch (error) {
            console.error('Error:', error)
            mostrarError('Error cargando resumen mensual')
            hideSpinner()
        }
    }

    // ========== REPORTE: NUTRIENTES ==========
    const cargarReporteNutrientes = async () => {
        try {
            showSpinner()
            const params = new URLSearchParams()

            const anio = document.getElementById('filtro_anio').value
            const mes = document.getElementById('filtro_mes').value

            if (anio) params.append('anio', anio)
            if (mes) params.append('mes', mes)

            const response = await fetch(`/api/fertilizacion/api/reportes/nutrientes-por-mes?${params}`)
            const data = await response.json()

            const tbody = document.getElementById('tbody-nutrientes')
            tbody.innerHTML = ''

            if (data.data && data.data.length > 0) {
                data.data.forEach(row => {
                    const tr = document.createElement('tr')
                    const badge = row.es_principal ? '<span class="badge bg-success">Principal</span>' : '<span class="badge bg-secondary">Secundario</span>'
                    tr.innerHTML = `
                        <td>${row.empresa || '-'}</td>
                        <td>${row.nombre_rancho || '-'}</td>
                        <td>${row.nombre_activo || '-'}</td>
                        <td>${badge}</td>
                        <td>${formatNumber(row.cantidad_aplicada)}</td>
                        <td>${formatNumber(row.hectareas_regadas)}</td>
                        <td>${formatNumber(row.cantidad_por_hectarea)}</td>
                    `
                    tbody.appendChild(tr)
                })
            } else {
                tbody.innerHTML = '<tr><td colspan="7" class="text-center">Sin datos</td></tr>'
            }
            hideSpinner()
        } catch (error) {
            console.error('Error:', error)
            mostrarError('Error cargando reporte de nutrientes')
            hideSpinner()
        }
    }

    // ========== REPORTE: DETALLE SECTORES ==========
    const cargarDetalleSetores = async () => {
        try {
            showSpinner()
            const params = new URLSearchParams()

            const anio = document.getElementById('filtro_anio').value
            const mes = document.getElementById('filtro_mes').value
            const rancho = document.getElementById('filtro_rancho').value

            if (anio) params.append('anio', anio)
            if (mes) params.append('mes', mes)
            if (rancho) params.append('id_rancho', rancho)

            const response = await fetch(`/api/fertilizacion/api/reportes/detalle-sectores?${params}`)
            const data = await response.json()

            const tbody = document.getElementById('tbody-sectores')
            tbody.innerHTML = ''

            if (data.data && data.data.length > 0) {
                data.data.forEach(row => {
                    const tr = document.createElement('tr')
                    tr.innerHTML = `
                        <td>${row.empresa || '-'}</td>
                        <td>${row.nombre_rancho || '-'}</td>
                        <td>${row.sector_interno || '-'}</td>
                        <td>${row.variedad || '-'}</td>
                        <td>${formatNumber(row.hectareas)}</td>
                        <td>${row.num_aplicaciones || 0}</td>
                        <td>${formatNumber(row.nitrogeno_kg)}</td>
                        <td>${formatNumber(row.fosforo_kg)}</td>
                        <td>${formatNumber(row.potasio_kg)}</td>
                    `
                    tbody.appendChild(tr)
                })
            } else {
                tbody.innerHTML = '<tr><td colspan="9" class="text-center">Sin datos</td></tr>'
            }
            hideSpinner()
        } catch (error) {
            console.error('Error:', error)
            mostrarError('Error cargando detalle de sectores')
            hideSpinner()
        }
    }

    // ========== REPORTE: HECTÁREAS MENSUALES ==========
    const cargarHectareasMensuales = async () => {
        try {
            showSpinner()
            const params = new URLSearchParams()
            const anio = document.getElementById('filtro_anio').value

            if (anio) params.append('anio', anio)

            const response = await fetch(`/api/fertilizacion/api/reportes/hectareas-mensuales?${params}`)
            const data = await response.json()

            const tbody = document.getElementById('tbody-hectareas')
            tbody.innerHTML = ''

            if (data.data && data.data.length > 0) {
                data.data.forEach(row => {
                    const tr = document.createElement('tr')
                    const mes = `${row.anio}-${row.mes_txt}`
                    tr.innerHTML = `
                        <td>${mes}</td>
                        <td>${row.sectores_regados || 0}</td>
                        <td>${row.total_aplicaciones || 0}</td>
                        <td>${formatNumber(row.hectareas_totales_sectores)}</td>
                        <td>${formatNumber(row.hectareas_totales_regadas)}</td>
                        <td>${formatNumber(row.total_litros_aplicados)}</td>
                    `
                    tbody.appendChild(tr)
                })
            } else {
                tbody.innerHTML = '<tr><td colspan="6" class="text-center">Sin datos</td></tr>'
            }
            hideSpinner()
        } catch (error) {
            console.error('Error:', error)
            mostrarError('Error cargando hectáreas mensuales')
            hideSpinner()
        }
    }

    // ========== REPORTE: TENDENCIA NPK ==========
    const cargarTendenciaNPK = async () => {
        try {
            showSpinner()
            const params = new URLSearchParams()
            const anio = document.getElementById('filtro_anio').value

            if (anio) params.append('anio', anio)

            const response = await fetch(`/api/fertilizacion/api/reportes/tendencia-npk?${params}`)
            const data = await response.json()

            const tbody = document.getElementById('tbody-tendencia')
            tbody.innerHTML = ''

            if (data.data && data.data.length > 0) {
                data.data.forEach(row => {
                    const tr = document.createElement('tr')
                    const mes = `${row.anio}-${row.mes_txt}`
                    tr.innerHTML = `
                        <td>${mes}</td>
                        <td>${formatNumber(row.nitrogeno_total_kg)}</td>
                        <td>${formatNumber(row.fosforo_total_kg)}</td>
                        <td>${formatNumber(row.potasio_total_kg)}</td>
                        <td>${row.total_aplicaciones || 0}</td>
                        <td>${formatNumber(row.hectareas_regadas)}</td>
                    `
                    tbody.appendChild(tr)
                })

                // Crear gráfico
                crearGraficoTendencia(data.data)
            } else {
                tbody.innerHTML = '<tr><td colspan="6" class="text-center">Sin datos</td></tr>'
            }
            hideSpinner()
        } catch (error) {
            console.error('Error:', error)
            mostrarError('Error cargando tendencia NPK')
            hideSpinner()
        }
    }

    // ========== REPORTE: INVENTARIO ==========
    const cargarInventario = async () => {
        try {
            showSpinner()
            const response = await fetch('/api/fertilizacion/api/reportes/inventario')
            const data = await response.json()

            const tbody = document.getElementById('tbody-inventario')
            tbody.innerHTML = ''

            if (data.data && data.data.length > 0) {
                data.data.forEach(row => {
                    const tr = document.createElement('tr')
                    let badgeClass = 'bg-success'
                    if (row.estado === 'BAJO') badgeClass = 'bg-warning'
                    if (row.estado === 'CRÍTICO') badgeClass = 'bg-danger'
                    if (row.estado === 'VACÍO') badgeClass = 'bg-dark'

                    tr.innerHTML = `
                        <td>${row.mezcla || '-'}</td>
                        <td>${row.fabricante || '-'}</td>
                        <td>${row.codigo_tanque || '-'}</td>
                        <td>${formatNumber(row.litros_totales)}</td>
                        <td>${formatNumber(row.litros_disponibles)}</td>
                        <td>${formatNumber(row.porcentaje_disponible)}%</td>
                        <td><span class="badge ${badgeClass}">${row.estado}</span></td>
                        <td>${row.dias_desde_preparacion || 0}</td>
                    `
                    tbody.appendChild(tr)
                })
            } else {
                tbody.innerHTML = '<tr><td colspan="8" class="text-center">Sin datos</td></tr>'
            }
            hideSpinner()
        } catch (error) {
            console.error('Error:', error)
            mostrarError('Error cargando inventario')
            hideSpinner()
        }
    }

    // ========== REPORTE: RESUMEN ANUAL ==========
    const cargarResumenAnual = async () => {
        try {
            showSpinner()
            const params = new URLSearchParams()
            const anio = document.getElementById('filtro_anio').value

            if (anio) params.append('anio', anio)

            const response = await fetch(`/api/fertilizacion/api/reportes/resumen-anual?${params}`)
            const data = await response.json()

            const tbody = document.getElementById('tbody-anual')
            tbody.innerHTML = ''

            if (data.data && data.data.length > 0) {
                data.data.forEach(row => {
                    const tr = document.createElement('tr')
                    tr.innerHTML = `
                        <td>${row.anio || '-'}</td>
                        <td>${row.empresa || '-'}</td>
                        <td>${row.nombre_rancho || '-'}</td>
                        <td>${row.sectores_atendidos || 0}</td>
                        <td>${row.total_aplicaciones || 0}</td>
                        <td>${formatNumber(row.hectareas_regadas)}</td>
                        <td>${formatNumber(row.litros_totales_aplicados)}</td>
                        <td>${row.tanques_diferentes || 0}</td>
                    `
                    tbody.appendChild(tr)
                })
            } else {
                tbody.innerHTML = '<tr><td colspan="8" class="text-center">Sin datos</td></tr>'
            }
            hideSpinner()
        } catch (error) {
            console.error('Error:', error)
            mostrarError('Error cargando resumen anual')
            hideSpinner()
        }
    }

    // ========== GRÁFICO: TENDENCIA NPK ==========
    const crearGraficoTendencia = (data) => {
        const meses = data.map(r => `${r.anio}-${r.mes_txt}`)
        const nitrogeno = data.map(r => r.nitrogeno_total_kg || 0)
        const fosforo = data.map(r => r.fosforo_total_kg || 0)
        const potasio = data.map(r => r.potasio_total_kg || 0)

        const ctx = document.getElementById('chartTendenciaNPK').getContext('2d')

        if (chartTendencia) {
            chartTendencia.destroy()
        }

        chartTendencia = new Chart(ctx, {
            type: 'line',
            data: {
                labels: meses,
                datasets: [
                    {
                        label: 'Nitrógeno (KG)',
                        data: nitrogeno,
                        borderColor: 'rgb(75, 192, 192)',
                        backgroundColor: 'rgba(75, 192, 192, 0.1)',
                        tension: 0.1
                    },
                    {
                        label: 'Fósforo (KG)',
                        data: fosforo,
                        borderColor: 'rgb(255, 206, 86)',
                        backgroundColor: 'rgba(255, 206, 86, 0.1)',
                        tension: 0.1
                    },
                    {
                        label: 'Potasio (KG)',
                        data: potasio,
                        borderColor: 'rgb(153, 102, 255)',
                        backgroundColor: 'rgba(153, 102, 255, 0.1)',
                        tension: 0.1
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Tendencia de Nutrientes (NPK) por Mes'
                    },
                    legend: {
                        display: true,
                        position: 'top'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        })
    }

    // ========== UTILIDADES ==========
    const formatNumber = (num) => {
        if (!num) return '0'
        return parseFloat(num).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    }

    // ========== EVENT LISTENERS ==========
    document.getElementById('btnAplicarFiltros').addEventListener('click', () => {
        const activeTab = document.querySelector('.nav-link.active')
        if (activeTab) {
            const tabId = activeTab.id
            cargarReporteActivo(tabId)
        }
    })

    document.getElementById('tab-npk-rancho').addEventListener('click', () => cargarReporteNPKRancho())
    document.getElementById('tab-rancho-mensual').addEventListener('click', () => cargarResumenMensual())
    document.getElementById('tab-nutrientes').addEventListener('click', () => cargarReporteNutrientes())
    document.getElementById('tab-sectores').addEventListener('click', () => cargarDetalleSetores())
    document.getElementById('tab-hectareas').addEventListener('click', () => cargarHectareasMensuales())
    document.getElementById('tab-tendencia').addEventListener('click', () => cargarTendenciaNPK())
    document.getElementById('tab-inventario').addEventListener('click', () => cargarInventario())
    document.getElementById('tab-anual').addEventListener('click', () => cargarResumenAnual())

    document.getElementById('btnRefrescar').addEventListener('click', () => {
        const activeTab = document.querySelector('.nav-link.active')
        if (activeTab) {
            const tabId = activeTab.id
            cargarReporteActivo(tabId)
        }
    })

    // ========== EXPORTAR ==========
    document.getElementById('btnExportarExcel').addEventListener('click', () => {
        mostrarInfo('Función de exportación en desarrollo')
    })

    document.getElementById('btnExportarPDF').addEventListener('click', () => {
        mostrarInfo('Función de exportación en desarrollo')
    })

    // ========== CARGAR REPORTE ACTIVO ==========
    const cargarReporteActivo = (tabId) => {
        switch (tabId) {
            case 'tab-npk-rancho':
                cargarReporteNPKRancho()
                break
            case 'tab-rancho-mensual':
                cargarResumenMensual()
                break
            case 'tab-nutrientes':
                cargarReporteNutrientes()
                break
            case 'tab-sectores':
                cargarDetalleSetores()
                break
            case 'tab-hectareas':
                cargarHectareasMensuales()
                break
            case 'tab-tendencia':
                cargarTendenciaNPK()
                break
            case 'tab-inventario':
                cargarInventario()
                break
            case 'tab-anual':
                cargarResumenAnual()
                break
        }
    }

    // Inicializar
    init()
})
