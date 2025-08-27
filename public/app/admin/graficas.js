/* eslint-disable no-undef */

// Variable global para almacenar el conjunto de datos original sin filtrar
let datosOriginales = []

// Variables globales para los gráficos
let combustibleChart, almacenChart, centroCosteChart, temporadaChart, empresaChart, unidadChart, rendimientoChart

// Colores predefinidos para las gráficas
const chartColors = {
  primary: ['#4CAF50', '#2196F3', '#FF9800', '#9C27B0', '#F44336', '#00BCD4', '#795548', '#607D8B'],
  secondary: ['#81C784', '#64B5F6', '#FFB74D', '#BA68C8', '#E57373', '#4DD0E1', '#A1887F', '#90A4AE']
}
const getColor = (index) => {
  return chartColors.primary[index % chartColors.primary.length]
}
// configuracion para entradas o salidas de combustible
const CONFIGURACION = {
  salidas: {
    titulos: {
      pageTitle: 'Dashboard - Salidas de Combustible',
      totalRegistros: 'Total Salidas',
      totalCombustible: 'Total Combustible (L)',
      promedioRegistros: 'Promedio por Salida',
      almacenesActivos: 'Almacenes Activos'
    },
    graficas: {
      combustible: 'Consumo por Tipo de Combustible',
      almacen: 'Consumo por Almacén',
      centroCoste: 'Consumo por Centro de Coste',
      temporada: 'Consumo por Temporada',
      empresa: 'Consumo por Empresa'
    },
    filtros: ['fechaInicio', 'fechaFin', 'rancho', 'temporada', 'combustible', 'centroCoste', 'empresa'],
    campos: {
      fecha: 'fecha',
      combustible: ['combustible'],
      cantidad: ['existencia', 'cantidad'],
      almacen: ['almacen', 'ubicacion'],
      centroCoste: ['centro_coste', 'centro_costos'],
      empresa: ['empresa'],
      temporada: ['temporada', 'estacion', 'periodo']
    }
  },
  entradas: {
    titulos: {
      pageTitle: 'Dashboard - Entradas de Combustible',
      totalRegistros: 'Total Entradas',
      totalCombustible: 'Total Combustible (L)',
      promedioRegistros: 'Promedio por Entrada',
      almacenesActivos: 'Almacenes Activos'
    },
    graficas: {
      combustible: 'Entrada por Tipo de Combustible',
      almacen: 'Entrada por Almacén',
      centroCoste: 'Entrada por Centro de Coste',
      empresa: 'Entrada por Empresa'
    },
    filtros: ['fechaInicio', 'fechaFin', 'rancho', 'combustible', 'centroCoste', 'empresa'],
    campos: {
      fecha: 'fecha',
      combustible: ['tipo_combustible', 'combustible'],
      cantidad: ['volumen', 'existencia', 'cantidad'],
      almacen: ['almacen', 'ubicacion'],
      centroCoste: ['centro_coste', 'centro_costos'],
      empresa: ['empresa']
    }
  },
  cargas: {
    titulos: {
      pageTitle: 'Dashboard - Cargas de Combustible',
      totalRegistros: 'Total Cargas',
      totalCombustible: 'Total Combustible (L)',
      promedioRegistros: 'Promedio por Carga',
      almacenesActivos: 'Unidades Activas'
    },
    graficas: {
      combustible: 'Cargas por Tipo de Combustible',
      centroCoste: 'Cargas por Centro de Coste',
      empresa: 'Cargas por Empresa',
      unidad: 'Cargas por Unidad',
      rendimiento: 'Rendimiento por Unidad'
    },
    filtros: ['fechaInicio', 'fechaFin', 'combustible', 'centroCoste', 'empresa', 'unidad'],
    campos: {
      fecha: 'fecha',
      combustible: ['combustible'],
      cantidad: ['cantidad'],
      centroCoste: ['centro_coste'],
      empresa: ['empresa'],
      unidad: ['no_economico'],
      rendimiento: ['rendimineto'],
      kmRecorridos: ['km_recorridos']
    }
  },
  solicitudes: {
    titulos: {
      pageTitle: 'Dashboard - Solicitudes de Mezcla',
      totalRegistros: 'Total Solicitudes',
      totalCantidadPresentacion: 'Total Cantidad Por Presentación',
      promedioRegistros: 'Promedio por Solicitud',
      almacenesActivos: 'Almacenes Activos'
    },
    graficas: {
      combustible: 'Solicitudes por Tipo de Combustible',
      almacen: 'Solicitudes por Almacén',
      centroCoste: 'Solicitudes por Centro de Coste',
      empresa: 'Solicitudes por Empresa'
    },
    filtros: ['fechaInicio', 'fechaFin', 'rancho', 'combustible', 'centroCoste', 'empresa'],
    campos: {
      fecha: 'fecha',
      combustible: ['tipo_combustible', 'combustible'],
      cantidad: ['volumen', 'existencia', 'cantidad'],
      almacen: ['almacen', 'ubicacion'],
      centroCoste: ['centro_coste', 'centro_costos'],
      empresa: ['empresa']
    }
  }
}
// Función para obtener la configuración según el tipo
const getConfig = (tipo) => CONFIGURACION[tipo] || CONFIGURACION.salidas
// Función para generar colores consistentes

// Función para formatear números
const formatearNumero = (numero) => {
  return new Intl.NumberFormat('es-MX').format(numero)
}

// Función para actualizar títulos del dashboard según el tipo de datos
const actualizarTitulosDashboard = (config) => {
  const tipoDatos = window.dashboardTipo

  console.log('Tipo de datos:', config)
  // Actualizar título de la página
  document.title = config.titulos.pageTitle

  // Actualizar títulos de las estadísticas
  const totalRegistrosLabel = document.querySelector('h6.text-muted.font-weight-normal')
  if (totalRegistrosLabel) {
    totalRegistrosLabel.textContent = config.titulos.totalRegistros
  }

  // Actualizar títulos de las gráficas
  const combustibleTitle = document.querySelector('#combustibleChart').closest('.card').querySelector('.card-title')
  if (combustibleTitle) {
    combustibleTitle.textContent = config.graficas.combustible
  }

  if (tipoDatos === 'salidas' || tipoDatos === 'entradas') {
    const almacenTitle = document.querySelector('#almacenChart').closest('.card').querySelector('.card-title')
    if (almacenTitle) {
      almacenTitle.textContent = config.graficas.almacen
    }
  }

  const centroCosteTitle = document.querySelector('#centroCosteChart').closest('.card').querySelector('.card-title')
  if (centroCosteTitle) {
    centroCosteTitle.textContent = config.graficas.centroCoste
  }

  if (tipoDatos === 'salidas') {
    const temporadaTitle = document.querySelector('#temporadaChart').closest('.card').querySelector('.card-title')
    if (temporadaTitle) {
      temporadaTitle.textContent = config.graficas.temporada
    }
  }
}

// Función para limpiar strings (eliminar espacios y tabulaciones)
const limpiarString = (texto) => {
  if (!texto) return 'Sin especificar'
  return texto.trim().replace(/\t/g, '')
}

// --- LÓGICA DE FILTROS ---

// Función para poblar los menús desplegables de los filtros
const poblarFiltros = (datos, config) => {
  try {
    const tipoDatos = window.dashboardTipo

    if (!config || !config.campos) {
      console.error('Configuración no válida:', config)
      return
    }

    // Sets para valores únicos
    const conjuntos = {
      almacen: new Set(),
      combustible: new Set(),
      centroCoste: new Set(),
      empresa: new Set()
    }

    // Si es salidas, agregar temporada
    if (tipoDatos === 'salidas') {
      conjuntos.temporada = new Set()
    }

    datos.forEach(item => {
      // Procesar cada campo según la configuración
      Object.entries(config.campos).forEach(([campo, nombresCampo]) => {
        if (!conjuntos[campo]) return

        let valor
        if (Array.isArray(nombresCampo)) {
          valor = nombresCampo.map(n => item[n]).find(v => v !== undefined)
        } else {
          valor = item[nombresCampo]
        }

        if (valor) {
          conjuntos[campo].add(limpiarString(valor))
        }
      })
    })

    // Poblar los selectores
    Object.entries(conjuntos).forEach(([campo, valores]) => {
      const selectId = `filtro${campo.charAt(0).toUpperCase() + campo.slice(1)}`
      const select = document.getElementById(selectId)
      if (select) {
        poblarSelect(selectId, valores)
        console.log(`${campo} poblado:`, [...valores])
      }
    })
  } catch (error) {
    console.error('Error al poblar filtros:', error)
  }
}
// Función auxiliar para poblar un select
const poblarSelect = (selectId, valores) => {
  const select = document.getElementById(selectId)
  if (!select) return

  select.innerHTML = '<option value="">Todos</option>';
  [...valores].sort().forEach(valor => {
    const option = document.createElement('option')
    option.value = valor
    option.textContent = valor
    select.appendChild(option)
  })
}

// Función para aplicar los filtros seleccionados al conjunto de datos
const aplicarFiltros = () => {
  const tipoDatos = window.dashboardTipo
  // 1. Obtenemos los valores actuales de cada filtro
  const fechaInicio = document.getElementById('filtroFechaInicio').value
  const fechaFin = document.getElementById('filtroFechaFin').value
  const rancho = tipoDatos === 'entradas' || tipoDatos === 'salidas' ? document.getElementById('filtroRancho').value : ''
  const temporada = tipoDatos === 'salidas' ? document.getElementById('filtroTemporada').value : ''
  const combustible = document.getElementById('filtroCombustible').value
  const empresa = document.getElementById('filtroEmpresa').value
  const centroCoste = document.getElementById('filtroCentroCoste').value
  // IMPORTANTE: Ajusta 'fecha_salida' al nombre real del campo de fecha en tus datos.
  const campoFecha = 'fecha'

  // 2. Usamos .filter() sobre los datos originales
  return datosOriginales.filter(item => {
    // Filtro por Fecha
    const fechaItem = item[campoFecha] ? new Date(item[campoFecha] + 'T00:00:00') : null
    if (fechaInicio && (!fechaItem || fechaItem < new Date(fechaInicio + 'T00:00:00'))) return false
    if (fechaFin && (!fechaItem || fechaItem > new Date(fechaFin + 'T00:00:00'))) return false

    // Filtro por Rancho (si hay un valor seleccionado)
    if ((tipoDatos === 'salidas' || tipoDatos === 'entradas') && rancho && limpiarString(item.almacen || '') !== rancho) return false

    // Filtro por Temporada solo para salidas
    if (tipoDatos === 'salidas' && temporada && limpiarString(item.temporada || '') !== temporada) return false

    // Filtro por Combustible
    const tipoCombustible = limpiarString(item.combustible || item.tipo_combustible || '')
    if (combustible && tipoCombustible !== combustible) return false

    // Filtro por Empresa
    if (empresa && limpiarString(item.empresa || '') !== empresa) return false

    // Filtro por Centro de Coste
    if (centroCoste && limpiarString(item.centro_coste || '') !== centroCoste) return false

    // Si el item pasó todos los filtros, lo incluimos
    return true
  })
}

// funcion pára destruir graficas
const destruirGraficas = () => {
  [combustibleChart, almacenChart, centroCosteChart, temporadaChart,
    empresaChart, unidadChart, rendimientoChart].forEach(chart => {
    if (chart) {
      chart.destroy()
    }
  })
}
// Función que actualiza todas las visualizaciones con los datos proporcionados
const actualizarVistas = (datos) => {
  const tipoDatos = window.dashboardTipo
  const config = getConfig(tipoDatos)

  // Destruir gráficas existentes
  destruirGraficas()

  // Actualizar estadísticas
  actualizarEstadisticas(datos, config)

  // Crear gráficas según el tipo
  switch (tipoDatos) {
    case 'cargas':
      crearGraficaCombustible(datos)
      crearGraficaCentroCoste(datos)
      crearGraficaEmpresa(datos)
      crearGraficaUnidad(datos)
      crearGraficaRendimiento(datos)
      break
    case 'salidas':
      crearGraficaCombustible(datos)
      crearGraficaAlmacen(datos)
      crearGraficaCentroCoste(datos)
      crearGraficaTemporada(datos)
      crearGraficaEmpresa(datos)
      break
    case 'entradas':
      crearGraficaCombustible(datos)
      crearGraficaAlmacen(datos)
      crearGraficaCentroCoste(datos)
      crearGraficaEmpresa(datos)
      break
  }
}

// --- FIN LÓGICA DE FILTROS ---

// Función genérica para procesar y agrupar datos
const procesarDatosAgrupados = (datos, { keyFields, valueFields, topN = null }) => {
  const agrupacion = {}
  datos.forEach(item => {
    // Encontrar el primer campo de clave válido o usar 'Sin especificar'
    const key = keyFields.map(k => item[k]).find(val => val) || 'Sin especificar'
    const label = limpiarString(key.trim())

    // Encontrar el primer campo de valor válido o usar 0
    const value = valueFields.map(v => item[v]).find(val => val !== undefined) || 0
    const cantidad = parseFloat(value)

    if (agrupacion[label]) {
      agrupacion[label] += cantidad
    } else {
      agrupacion[label] = cantidad
    }
  })

  let sorted = Object.entries(agrupacion)

  // Ordenar y cortar si se especifica topN
  if (topN) {
    sorted = sorted.sort(([, a], [, b]) => b - a).slice(0, topN)
  }

  return {
    labels: sorted.map(([label]) => label),
    data: sorted.map(([, value]) => value),
    colors: sorted.map((_, index) => getColor(index))
  }
}

// Campos comunes para el valor a sumar
const camposDeValor = ['cantidad', 'existencia', 'volumen']

const procesarDatosCombustible = (datos) => {
  return procesarDatosAgrupados(datos, { keyFields: ['combustible', 'tipo_combustible'], valueFields: camposDeValor })
}

const procesarDatosAlmacen = (datos) => {
  return procesarDatosAgrupados(datos, { keyFields: ['almacen', 'ubicacion'], valueFields: camposDeValor, topN: 8 })
}

const procesarDatosCentroCoste = (datos) => {
  return procesarDatosAgrupados(datos, { keyFields: ['centro_coste', 'centro_costos'], valueFields: camposDeValor, topN: 10 })
}

const procesarDatosUnidad = (datos) => {
  return procesarDatosAgrupados(datos, {
    keyFields: ['no_economico'],
    valueFields: ['cantidad'],
    topN: 10
  })
}

const procesarDatosRendimiento = (datos) => {
  const agrupacion = {}
  datos.forEach(item => {
    const unidad = item.no_economico || 'Sin especificar'
    const rendimiento = parseFloat(item.rendimineto) || 0
    const kmRecorridos = parseFloat(item.km_recorridos) || 0

    if (!agrupacion[unidad]) {
      agrupacion[unidad] = {
        totalKm: kmRecorridos,
        totalConsumo: item.cantidad || 0,
        rendimientos: rendimiento > 0 ? [rendimiento] : []
      }
    } else {
      agrupacion[unidad].totalKm += kmRecorridos
      agrupacion[unidad].totalConsumo += (item.cantidad || 0)
      if (rendimiento > 0) agrupacion[unidad].rendimientos.push(rendimiento)
    }
  })

  const resultados = Object.entries(agrupacion)
    .map(([unidad, datos]) => ({
      unidad,
      rendimientoPromedio: datos.rendimientos.length > 0
        ? datos.rendimientos.reduce((a, b) => a + b) / datos.rendimientos.length
        : 0
    }))
    .filter(item => item.rendimientoPromedio > 0)
    .sort((a, b) => b.rendimientoPromedio - a.rendimientoPromedio)
    .slice(0, 10)

  return {
    labels: resultados.map(r => r.unidad),
    data: resultados.map(r => r.rendimientoPromedio),
    colors: resultados.map((_, index) => getColor(index))
  }
}
const procesarDatosTemporada = (datos) => {
  return procesarDatosAgrupados(datos, { keyFields: ['temporada', 'estacion', 'periodo'], valueFields: camposDeValor })
}
const procesarDatosEmpresa = (datos) => {
  return procesarDatosAgrupados(datos, {
    keyFields: ['empresa'],
    valueFields: camposDeValor,
    topN: 8
  })
}
// Función para actualizar estadísticas
const actualizarEstadisticas = (datos) => {
  const tipoDatos = window.dashboardTipo
  // Calcular totales y promedios
  const totalRegistros = datos.length
  let almacenesUnicos = 0

  if (tipoDatos === 'salidas' || tipoDatos === 'entradas') {
    almacenesUnicos = new Set(datos.map(item => limpiarString(item.almacen || item.ubicacion)).filter(almacen => almacen !== 'Sin especificar')).size
  }

  if (tipoDatos === 'cargas') {
    almacenesUnicos = new Set(datos.map(item => limpiarString(item.no_economico || item.unidad)).filter(unidad => unidad !== 'Sin especificar')).size
  }

  // Objeto para almacenar los totales por tipo de combustible
  const totalesCombustible = {}
  let totalCombustibleGeneral = 0

  datos.forEach(item => {
    const tipo = limpiarString(item.combustible || item.tipo_combustible)
    const cantidad = parseFloat(item.cantidad || item.existencia || item.volumen) || 0

    if (tipo !== 'Sin especificar') {
      if (totalesCombustible[tipo]) {
        totalesCombustible[tipo] += cantidad
      } else {
        totalesCombustible[tipo] = cantidad
      }
    }
    totalCombustibleGeneral += cantidad
  })

  // Calcular Total de precio
  const totalPrecio = datos.reduce((acc, item) => {
    const precio = parseFloat(item.precio) || 0
    return acc + (precio)
  }, 0)

  // Calcular promedio de registros
  const promedioRegistros = totalRegistros > 0 ? totalCombustibleGeneral / totalRegistros : 0

  // Actualizar estadísticas generales
  document.getElementById('totalSalidas').textContent = formatearNumero(totalRegistros)
  if (tipoDatos === 'cargas' || tipoDatos === 'salidas' || tipoDatos === 'entradas') {
    document.getElementById('promedioSalidas').textContent = formatearNumero(promedioRegistros.toFixed(2))
    document.getElementById('almacenesActivos').textContent = formatearNumero(almacenesUnicos)
  }
  if (tipoDatos === 'cargas') {
    document.getElementById('gastoTotales').textContent = formatearNumero(totalPrecio)
  }
  // Actualizar el desglose de combustible en su card
  const contenedorTotales = document.getElementById('combustibleTotales')
  contenedorTotales.innerHTML = '' // Limpiar contenido previo

  const combustiblesOrdenados = Object.entries(totalesCombustible).sort((a, b) => b[1] - a[1])

  combustiblesOrdenados.forEach(([tipo, valor]) => {
    const elemento = document.createElement('div')
    elemento.className = 'mb-2'
    elemento.innerHTML = `<h4 class="mb-0">${formatearNumero(valor.toFixed(2))}</h4><p class="text-muted font-weight-normal small text-capitalize">${tipo.toLowerCase()}</p>`
    contenedorTotales.appendChild(elemento)
  })
}

// Función para crear gráfica de unidades
const crearGraficaUnidad = (datos) => {
  const ctx = document.getElementById('unidadChart')
  if (!ctx) return

  const procesado = procesarDatosUnidad(datos)

  // Destruir gráfico existente si existe
  if (unidadChart) {
    unidadChart.destroy()
  }

  unidadChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: procesado.labels,
      datasets: [{
        label: 'Cargas (L)',
        data: procesado.data,
        backgroundColor: procesado.colors,
        borderColor: procesado.colors.map(color => color.replace('0.8', '1')),
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: 'y',
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              return `${context.label}: ${formatearNumero(context.parsed.x)} L`
            }
          }
        }
      },
      scales: {
        x: {
          beginAtZero: true,
          ticks: {
            callback: function (value) {
              return formatearNumero(value) + ' L'
            }
          }
        }
      }
    }
  })
}

// Función para crear gráfica de rendimiento
const crearGraficaRendimiento = (datos) => {
  const ctx = document.getElementById('rendimientoChart')
  if (!ctx) return

  const procesado = procesarDatosRendimiento(datos)

  // Destruir gráfico existente si existe
  if (rendimientoChart) {
    rendimientoChart.destroy()
  }

  rendimientoChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: procesado.labels,
      datasets: [{
        label: 'Rendimiento (km/L)',
        data: procesado.data,
        backgroundColor: procesado.colors,
        borderColor: procesado.colors.map(color => color.replace('0.8', '1')),
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              return `${context.label}: ${context.parsed.y.toFixed(2)} km/L`
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function (value) {
              return value.toFixed(2) + ' km/L'
            }
          }
        }
      }
    }
  })
}

// Función para crear gráfica de combustible
const crearGraficaCombustible = (datos) => {
  const ctx = document.getElementById('combustibleChart')
  if (!ctx) return

  const procesado = procesarDatosCombustible(datos)

  if (combustibleChart) {
    combustibleChart.destroy()
  }

  combustibleChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: procesado.labels,
      datasets: [{
        data: procesado.data,
        backgroundColor: procesado.colors,
        borderWidth: 2,
        borderColor: '#fff'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            padding: 20,
            usePointStyle: true
          }
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              const total = context.dataset.data.reduce((a, b) => a + b, 0)
              const percentage = ((context.parsed / total) * 100).toFixed(1)
              return `${context.label}: ${formatearNumero(context.parsed)} L (${percentage}%)`
            }
          }
        }
      }
    }
  })
}

// Función para crear gráfica de almacén
const crearGraficaAlmacen = (datos) => {
  const ctx = document.getElementById('almacenChart')
  if (!ctx) return

  const procesado = procesarDatosAlmacen(datos)

  if (almacenChart) {
    almacenChart.destroy()
  }

  almacenChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: procesado.labels,
      datasets: [{
        label: 'Consumo (L)',
        data: procesado.data,
        backgroundColor: procesado.colors,
        borderColor: procesado.colors.map(color => color.replace('0.8', '1')),
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              return `${context.label}: ${formatearNumero(context.parsed.y)} L`
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function (value) {
              return formatearNumero(value) + ' L'
            }
          }
        }
      }
    }
  })
}

// Función para crear gráfica de centro de coste
const crearGraficaCentroCoste = (datos) => {
  const ctx = document.getElementById('centroCosteChart')
  if (!ctx) return

  const procesado = procesarDatosCentroCoste(datos)
  if (centroCosteChart) {
    centroCosteChart.destroy()
  }

  centroCosteChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: procesado.labels,
      datasets: [{
        label: 'Consumo (L)',
        data: procesado.data,
        backgroundColor: procesado.colors,
        borderColor: procesado.colors.map(color => color.replace('0.8', '1')),
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: 'y',
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              return `${context.label}: ${formatearNumero(context.parsed.x)} L`
            }
          }
        }
      },
      scales: {
        x: {
          beginAtZero: true,
          ticks: {
            callback: function (value) {
              return formatearNumero(value) + ' L'
            }
          }
        }
      }
    }
  })
}

// Función para crear gráfica de temporada
const crearGraficaTemporada = (datos) => {
  const ctx = document.getElementById('temporadaChart')
  if (!ctx) return

  const procesado = procesarDatosTemporada(datos)
  console.log(procesado)
  if (temporadaChart) {
    temporadaChart.destroy()
  }

  temporadaChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: procesado.labels,
      datasets: [{
        data: procesado.data,
        backgroundColor: procesado.colors,
        borderWidth: 2,
        borderColor: '#fff'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            padding: 15,
            usePointStyle: true
          }
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              const total = context.dataset.data.reduce((a, b) => a + b, 0)
              const percentage = ((context.parsed / total) * 100).toFixed(1)
              return `${context.label}: ${formatearNumero(context.parsed)} L (${percentage}%)`
            }
          }
        }
      }
    }
  })
}

// Agregar función para crear gráfica de empresa
const crearGraficaEmpresa = (datos) => {
  const ctx = document.getElementById('empresaChart')
  if (!ctx) return

  const procesado = procesarDatosEmpresa(datos)

  if (empresaChart) {
    empresaChart.destroy()
  }

  empresaChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: procesado.labels,
      datasets: [{
        label: 'Consumo (L)',
        data: procesado.data,
        backgroundColor: procesado.colors,
        borderColor: procesado.colors.map(color => color.replace('0.8', '1')),
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: 'y',
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              return `${context.label}: ${formatearNumero(context.parsed.x)} L`
            }
          }
        }
      },
      scales: {
        x: {
          beginAtZero: true,
          ticks: {
            callback: function (value) {
              return formatearNumero(value) + ' L'
            }
          }
        }
      }
    }
  })
}
// Función principal para inicializar el dashboard
const inicializarDashboard = async () => {
  try {
    console.log('Inicializando dashboard...')
    // Guardamos los datos originales en nuestra variable global
    datosOriginales = window.dashboardData || []
    const tipoDatos = window.dashboardTipo
    const config = getConfig(tipoDatos)
    // Actualizar títulos según configuración
    actualizarTitulosDashboard(config)

    console.log('Datos obtenidos:', datosOriginales)

    if (datosOriginales.length === 0) {
      console.warn('No se encontraron datos para mostrar')
      return
    }

    // 1. Llenar los filtros con las opciones disponibles
    poblarFiltros(datosOriginales, config)

    // 2. Mostrar el estado inicial del dashboard con todos los datos
    actualizarVistas(datosOriginales, config)

    // 3. Configurar los eventos para que los filtros funcionen
    configurarEventListenersFiltros(config)

    console.log('Dashboard inicializado correctamente')
  } catch (error) {
    console.error('Error al inicializar dashboard:', error)
  }
}

// Función para actualizar el dashboard
const configurarEventListenersFiltros = () => {
  const tipoDatos = window.dashboardTipo
  const idsFiltros = [
    'filtroFechaInicio',
    'filtroFechaFin',
    'filtroCombustible',
    'filtroEmpresa',
    'filtroCentroCoste'
  ]
  // Agregar temporada y rancho solo si es salidas
  if (tipoDatos === 'salidas') {
    idsFiltros.push('filtroRancho')
    idsFiltros.push('filtroTemporada')
  }
  // Agregar rancho solo si es entradas
  if (tipoDatos === 'entradas') {
    idsFiltros.push('filtroRancho')
  }

  idsFiltros.forEach(id => {
    const elemento = document.getElementById(id)
    if (elemento) {
      elemento.addEventListener('change', () => {
        const datosFiltrados = aplicarFiltros()
        actualizarVistas(datosFiltrados)
      })
    }
  })

  const btnReset = document.getElementById('btnResetFiltros')
  if (btnReset) {
    btnReset.addEventListener('click', () => {
      idsFiltros.forEach(id => {
        document.getElementById(id).value = ''
      })
      actualizarVistas(datosOriginales)
    })
  }
}

export const actualizarDashboard = async () => {
  await inicializarDashboard()
}

// Exportar función para uso externo
export { inicializarDashboard }
inicializarDashboard()
