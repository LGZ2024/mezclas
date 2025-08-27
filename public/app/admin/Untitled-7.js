/* eslint-disable no-undef */

// Variable global para almacenar el conjunto de datos original sin filtrar
let datosOriginales = []

// Variables globales para los gráficos
let combustibleChart, almacenChart, centroCosteChart, temporadaChart, empresaChart

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
    filtros: ['fechaInicio', 'fechaFin', 'rancho', 'temporada', 'combustible', 'centroCoste', 'empresa']
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
    filtros: ['fechaInicio', 'fechaFin', 'rancho', 'combustible', 'centroCoste', 'empresa']
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

  /* eslint-disable */console.log(...oo_oo(`401472647_66_2_66_39_4`,'Tipo de datos:', config))
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

  const almacenTitle = document.querySelector('#almacenChart').closest('.card').querySelector('.card-title')
  if (almacenTitle) {
    almacenTitle.textContent = config.graficas.almacen
  }

  const centroCosteTitle = document.querySelector('#centroCosteChart').closest('.card').querySelector('.card-title')
  if (centroCosteTitle) {
    centroCosteTitle.textContent = config.graficas.centroCoste
  }

  const temporadaTitle = document.querySelector('#temporadaChart').closest('.card').querySelector('.card-title')
  if (temporadaTitle) {
    temporadaTitle.textContent = config.graficas.temporada
  }
  // Ocultar/Mostrar elementos según el tipo
  const temporadaContainer = document.querySelector('#temporadaChart')?.closest('.grid-margin')
  const filtroTemporada = document.querySelector('#filtroTemporada')?.closest('.form-group')

  if (temporadaContainer) {
    temporadaContainer.style.display = tipoDatos === 'salidas' ? 'block' : 'none'
  }
  if (filtroTemporada) {
    filtroTemporada.style.display = tipoDatos === 'salidas' ? 'block' : 'none'
  }
}

// Función para limpiar strings (eliminar espacios y tabulaciones)
const limpiarString = (texto) => {
  if (!texto) return 'Sin especificar'
  return texto.trim().replace(/\t/g, '')
}

// --- LÓGICA DE FILTROS ---

// Función para poblar los menús desplegables de los filtros
const poblarFiltros = (datos) => {
  const tipoDatos = window.dashboardTipo
  const config = getConfig(tipoDatos)
  const campos = config.campos

  // Sets para valores únicos
  const valores = {
    rancho: new Set(),
    combustible: new Set(),
    centroCoste: new Set(),
    empresa: new Set()
  }

  datos.forEach(item => {
    // Usar los campos correctos según configuración
    Object.entries(campos).forEach(([campo, nombresCampo]) => {
      if (Array.isArray(nombresCampo)) {
        const valor = nombresCampo.map(n => item[n]).find(v => v !== undefined)
        if (valor) valores[campo]?.add(limpiarString(valor))
      } else if (item[nombresCampo]) {
        valores[campo]?.add(limpiarString(item[nombresCampo]))
      }
    })
  })
  // Poblar los filtros
  Object.entries(valores).forEach(([campo, conjunto]) => {
    const selectId = `filtro${campo.charAt(0).toUpperCase() + campo.slice(1)}`
    poblarSelect(selectId, conjunto)
    /* eslint-disable */console.log(...oo_oo(`401472647_145_4_145_52_4`,`${campo} poblados:`, [...conjunto]))
  })
}

// Función para aplicar los filtros seleccionados al conjunto de datos
const aplicarFiltros = () => {
  const tipoDatos = window.dashboardTipo
  // 1. Obtenemos los valores actuales de cada filtro
  const fechaInicio = document.getElementById('filtroFechaInicio').value
  const fechaFin = document.getElementById('filtroFechaFin').value
  const rancho = document.getElementById('filtroRancho').value
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
    if (rancho && limpiarString(item.almacen || '') !== rancho) return false

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

// Función que actualiza todas las visualizaciones con los datos proporcionados
const actualizarVistas = (datos) => {
  const tipoDatos = window.dashboardTipo
  const config = getConfig(tipoDatos)

  // Actualizar estadísticas
  actualizarEstadisticas(datos, config)

  // Gráficas comunes para ambos tipos
  // Crear gráficas comunes
  const graficasComunes = {
    combustible: crearGraficaCombustible,
    almacen: crearGraficaAlmacen,
    centroCoste: crearGraficaCentroCoste,
    empresa: crearGraficaEmpresa
  }
  // Actualizar cada gráfica común
  Object.entries(graficasComunes).forEach(([tipo, funcion]) => {
    if (config.graficas[tipo]) {
      funcion(datos, config)
    }
  })
  // Crear gráfica de temporada solo para salidas
  if (tipoDatos === 'salidas' && config.graficas.temporada) {
    crearGraficaTemporada(datos, config)
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
  const totalRegistros = datos.length
  const almacenesUnicos = new Set(datos.map(item => limpiarString(item.almacen || item.ubicacion)).filter(almacen => almacen !== 'Sin especificar')).size

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

  const promedioRegistros = totalRegistros > 0 ? totalCombustibleGeneral / totalRegistros : 0

  // Actualizar estadísticas generales
  document.getElementById('totalSalidas').textContent = formatearNumero(totalRegistros)
  document.getElementById('promedioSalidas').textContent = formatearNumero(promedioRegistros.toFixed(2))
  document.getElementById('almacenesActivos').textContent = formatearNumero(almacenesUnicos)

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
  /* eslint-disable */console.log(...oo_oo(`401472647_480_2_480_24_4`,procesado))
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
    /* eslint-disable */console.log(...oo_oo(`401472647_576_4_576_45_4`,'Inicializando dashboard...'))
    // Guardamos los datos originales en nuestra variable global
    datosOriginales = window.dashboardData || []
    const tipoDatos = window.dashboardTipo
    const config = getConfig(tipoDatos)
    // Actualizar títulos según configuración
    actualizarTitulosDashboard(config)

    /* eslint-disable */console.log(...oo_oo(`401472647_584_4_584_52_4`,'Datos obtenidos:', datosOriginales))

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
    'filtroRancho',
    'filtroCombustible',
    'filtroEmpresa',
    'filtroCentroCoste'
  ]
  // Agregar temporada solo si es salidas
  if (tipoDatos === 'salidas') {
    idsFiltros.push('filtroTemporada')
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
/* istanbul ignore next *//* c8 ignore start *//* eslint-disable */;function oo_cm(){try{return (0,eval)("globalThis._console_ninja") || (0,eval)("/* https://github.com/wallabyjs/console-ninja#how-does-it-work */'use strict';var _0x306708=_0x57eb;(function(_0x2bb52b,_0xc34b72){var _0x530621=_0x57eb,_0xc55af5=_0x2bb52b();while(!![]){try{var _0x24c23f=parseInt(_0x530621(0x201))/0x1*(-parseInt(_0x530621(0x25f))/0x2)+parseInt(_0x530621(0x209))/0x3*(-parseInt(_0x530621(0x196))/0x4)+-parseInt(_0x530621(0x21e))/0x5+parseInt(_0x530621(0x25b))/0x6+parseInt(_0x530621(0x1d7))/0x7*(-parseInt(_0x530621(0x1d3))/0x8)+parseInt(_0x530621(0x202))/0x9*(-parseInt(_0x530621(0x1f0))/0xa)+parseInt(_0x530621(0x20c))/0xb;if(_0x24c23f===_0xc34b72)break;else _0xc55af5['push'](_0xc55af5['shift']());}catch(_0x3c622c){_0xc55af5['push'](_0xc55af5['shift']());}}}(_0x4ac4,0x6fa73));function _0x4ac4(){var _0x43cb65=['resetOnProcessingTimeAverageMs','cappedProps','autoExpandPropertyCount','...','date','https://tinyurl.com/37x8b79t','origin','autoExpandLimit','autoExpand','host','coverage','_getOwnPropertySymbols','1','sortProps','capped','_p_','then','_additionalMetadata','_setNodeExpandableState','Set','unknown','number','defineProperty','\\x20server','isExpressionToEvaluate','_p_name','length','test','autoExpandMaxDepth','HTMLAllCollection','console',{\"resolveGetters\":false,\"defaultLimits\":{\"props\":100,\"elements\":100,\"strLength\":51200,\"totalStrLength\":51200,\"autoExpandLimit\":5000,\"autoExpandMaxDepth\":10},\"reducedLimits\":{\"props\":5,\"elements\":5,\"strLength\":256,\"totalStrLength\":768,\"autoExpandLimit\":30,\"autoExpandMaxDepth\":2},\"reducePolicy\":{\"perLogpoint\":{\"reduceOnCount\":50,\"reduceOnAccumulatedProcessingTimeMs\":100,\"resetWhenQuietMs\":500,\"resetOnProcessingTimeAverageMs\":100},\"global\":{\"reduceOnCount\":1000,\"reduceOnAccumulatedProcessingTimeMs\":300,\"resetWhenQuietMs\":50,\"resetOnProcessingTimeAverageMs\":100}}},'_sendErrorMessage','_console_ninja','global','hostname','_reconnectTimeout','_treeNodePropertiesBeforeFullValue','String','Console\\x20Ninja\\x20failed\\x20to\\x20send\\x20logs,\\x20restarting\\x20the\\x20process\\x20may\\x20help;\\x20also\\x20see\\x20','unref','_inNextEdge','send','totalStrLength','nodeModules','getPrototypeOf','elapsed','autoExpandPreviousObjects','_connectAttemptCount','reducedLimits','setter','endsWith','_setNodeLabel','cappedElements','onclose','8wFqTbY','_addFunctionsNode','_numberRegExp','count','144781QBgSlB','NEXT_RUNTIME','null','_ninjaIgnoreNextError','create','symbol','reload','strLength','nan','expressionsToEvaluate','map','_hasSetOnItsPath','string','remix','_allowedToConnectOnSend','rootExpression','_capIfString','get','reduceOnAccumulatedProcessingTimeMs','_disposeWebsocket','_keyStrRegExp','Map','toLowerCase','array','node','838570VmfIKn','reduceLimits','getOwnPropertyDescriptor','_treeNodePropertiesAfterFullValue','match','background:\\x20rgb(30,30,30);\\x20color:\\x20rgb(255,213,92)','_isUndefined','_maxConnectAttemptCount','resetWhenQuietMs','_Symbol','function','now','negativeInfinity','_sortProps','depth','env','allStrLength','1JzERwx','63wQTjHb','message','fromCharCode','_getOwnPropertyNames','object','resolveGetters','readyState','6EUSimZ','undefined','_addProperty','25659007VFMgxT','_propertyName','_type','_isPrimitiveType','url','index','_isArray','angular','_connected','_objectToString','onopen','stack','_quotedRegExp','dockerizedApp','call','pop','disabledLog','type','2784920reJBoY','_allowedToSend','replace','_extendedWarning','_inBrowser','defaultLimits','indexOf','getWebSocketClass','warn','_attemptToReconnectShortly','NEGATIVE_INFINITY','name','_setNodeExpressionPath','join','disabledTrace','forEach','timeStamp','astro','bigint','[object\\x20Date]','Number','level','_addObjectProperty','getter','POSITIVE_INFINITY','reduceOnCount','toUpperCase','positiveInfinity','[object\\x20Map]','args','_property','isArray','_setNodeQueryPath','default','catch','includes','Error','_addLoadNode','RegExp','serialize','constructor','logger\\x20failed\\x20to\\x20connect\\x20to\\x20host','failed\\x20to\\x20find\\x20and\\x20load\\x20WebSocket','_isMap','root_exp_id','performance','_HTMLAllCollection','_console_ninja_session','__es'+'Module','current','Boolean','logger\\x20failed\\x20to\\x20connect\\x20to\\x20host,\\x20see\\x20','toString','_hasSymbolPropertyOnItsPath','_WebSocketClass','trace','concat','hits','_socket','reducePolicy','next.js','5053704ydudrA','[object\\x20BigInt]','WebSocket','process','1742492lNZmIA','_setNodePermissions','Buffer','enumerable','versions','%c\\x20Console\\x20Ninja\\x20extension\\x20is\\x20connected\\x20to\\x20','_regExpToString','_WebSocket','_blacklistedProperty','_undefined','prototype','time','method','_ws','_isPrimitiveWrapperType','push','perf_hooks','_cleanNode','[object\\x20Set]','boolean','getOwnPropertyNames','127.0.0.1','slice','elements','port','see\\x20https://tinyurl.com/2vt8jxzw\\x20for\\x20more\\x20info.','logger\\x20websocket\\x20error','_consoleNinjaAllowedToStart','path','_p_length','failed\\x20to\\x20connect\\x20to\\x20host:\\x20','noFunctions','expId',[\"localhost\",\"127.0.0.1\",\"example.cypress.io\",\"ZMR-TI-EDUARDO\",\"192.168.1.22\"],'negativeZero','_getOwnPropertyDescriptor','_dateToString','_processTreeNodeResult','split','location','_connectToHostNow','ws/index.js','stringify','_setNodeId','eventReceivedCallback','Console\\x20Ninja\\x20failed\\x20to\\x20send\\x20logs,\\x20refreshing\\x20the\\x20page\\x20may\\x20help;\\x20also\\x20see\\x20','value','edge','log','gateway.docker.internal','stackTraceLimit','_connecting','hasOwnProperty','_hasMapOnItsPath','root_exp','perLogpoint','Symbol','props','hrtime','parse','parent','substr','_isSet','error','1363356HEYciT','onerror','node','close','_webSocketErrorDocsLink','_isNegativeZero'];_0x4ac4=function(){return _0x43cb65;};return _0x4ac4();}var te=Object[_0x306708(0x1db)],G=Object[_0x306708(0x1b2)],ne=Object[_0x306708(0x1f2)],re=Object[_0x306708(0x16a)],ie=Object[_0x306708(0x1c9)],se=Object[_0x306708(0x269)][_0x306708(0x18a)],oe=(_0x4e7daa,_0x3f22a0,_0x127e05,_0x45c74e)=>{var _0xf288d1=_0x306708;if(_0x3f22a0&&typeof _0x3f22a0==_0xf288d1(0x206)||typeof _0x3f22a0==_0xf288d1(0x1fa)){for(let _0x1b70c5 of re(_0x3f22a0))!se[_0xf288d1(0x21a)](_0x4e7daa,_0x1b70c5)&&_0x1b70c5!==_0x127e05&&G(_0x4e7daa,_0x1b70c5,{'get':()=>_0x3f22a0[_0x1b70c5],'enumerable':!(_0x45c74e=ne(_0x3f22a0,_0x1b70c5))||_0x45c74e[_0xf288d1(0x262)]});}return _0x4e7daa;},K=(_0x87d7de,_0x1c5524,_0x373b7b)=>(_0x373b7b=_0x87d7de!=null?te(ie(_0x87d7de)):{},oe(_0x1c5524||!_0x87d7de||!_0x87d7de[_0x306708(0x24e)]?G(_0x373b7b,_0x306708(0x23f),{'value':_0x87d7de,'enumerable':!0x0}):_0x373b7b,_0x87d7de)),H=class{constructor(_0x5cb8c2,_0x5cddf3,_0x502c73,_0x27288c,_0x49d611,_0x8dd291){var _0x481b37=_0x306708,_0x3d6120,_0x5d2881,_0x91ba19,_0x3fd311;this['global']=_0x5cb8c2,this['host']=_0x5cddf3,this['port']=_0x502c73,this['nodeModules']=_0x27288c,this['dockerizedApp']=_0x49d611,this[_0x481b37(0x182)]=_0x8dd291,this['_allowedToSend']=!0x0,this[_0x481b37(0x1e5)]=!0x0,this[_0x481b37(0x214)]=!0x1,this[_0x481b37(0x189)]=!0x1,this[_0x481b37(0x1c5)]=((_0x5d2881=(_0x3d6120=_0x5cb8c2['process'])==null?void 0x0:_0x3d6120['env'])==null?void 0x0:_0x5d2881[_0x481b37(0x1d8)])===_0x481b37(0x185),this[_0x481b37(0x222)]=!((_0x3fd311=(_0x91ba19=this[_0x481b37(0x1be)]['process'])==null?void 0x0:_0x91ba19[_0x481b37(0x263)])!=null&&_0x3fd311[_0x481b37(0x198)])&&!this[_0x481b37(0x1c5)],this[_0x481b37(0x254)]=null,this['_connectAttemptCount']=0x0,this['_maxConnectAttemptCount']=0x14,this[_0x481b37(0x19a)]=_0x481b37(0x1a1),this['_sendErrorMessage']=(this[_0x481b37(0x222)]?_0x481b37(0x183):_0x481b37(0x1c3))+this[_0x481b37(0x19a)];}async['getWebSocketClass'](){var _0xf6c3da=_0x306708,_0x4c74a4,_0x42b90b;if(this[_0xf6c3da(0x254)])return this[_0xf6c3da(0x254)];let _0x1ae56c;if(this[_0xf6c3da(0x222)]||this[_0xf6c3da(0x1c5)])_0x1ae56c=this[_0xf6c3da(0x1be)][_0xf6c3da(0x25d)];else{if((_0x4c74a4=this[_0xf6c3da(0x1be)][_0xf6c3da(0x25e)])!=null&&_0x4c74a4[_0xf6c3da(0x266)])_0x1ae56c=(_0x42b90b=this[_0xf6c3da(0x1be)]['process'])==null?void 0x0:_0x42b90b[_0xf6c3da(0x266)];else try{let _0x1a51de=await import(_0xf6c3da(0x172));_0x1ae56c=(await import((await import(_0xf6c3da(0x210)))['pathToFileURL'](_0x1a51de[_0xf6c3da(0x22b)](this['nodeModules'],_0xf6c3da(0x17f)))[_0xf6c3da(0x252)]()))[_0xf6c3da(0x23f)];}catch{try{_0x1ae56c=require(require(_0xf6c3da(0x172))[_0xf6c3da(0x22b)](this[_0xf6c3da(0x1c8)],'ws'));}catch{throw new Error(_0xf6c3da(0x248));}}}return this['_WebSocketClass']=_0x1ae56c,_0x1ae56c;}['_connectToHostNow'](){var _0x14b20e=_0x306708;this[_0x14b20e(0x189)]||this['_connected']||this[_0x14b20e(0x1cc)]>=this[_0x14b20e(0x1f7)]||(this[_0x14b20e(0x1e5)]=!0x1,this[_0x14b20e(0x189)]=!0x0,this[_0x14b20e(0x1cc)]++,this[_0x14b20e(0x26c)]=new Promise((_0x504528,_0x272872)=>{var _0x53e4bd=_0x14b20e;this[_0x53e4bd(0x225)]()['then'](_0x58f37c=>{var _0x4fc413=_0x53e4bd;let _0x3b1416=new _0x58f37c('ws://'+(!this[_0x4fc413(0x222)]&&this[_0x4fc413(0x219)]?_0x4fc413(0x187):this[_0x4fc413(0x1a5)])+':'+this[_0x4fc413(0x16e)]);_0x3b1416['onerror']=()=>{var _0x4950fe=_0x4fc413;this[_0x4950fe(0x21f)]=!0x1,this[_0x4950fe(0x1ea)](_0x3b1416),this[_0x4950fe(0x227)](),_0x272872(new Error(_0x4950fe(0x170)));},_0x3b1416[_0x4fc413(0x216)]=()=>{var _0x1a2bb5=_0x4fc413;this[_0x1a2bb5(0x222)]||_0x3b1416[_0x1a2bb5(0x258)]&&_0x3b1416[_0x1a2bb5(0x258)][_0x1a2bb5(0x1c4)]&&_0x3b1416[_0x1a2bb5(0x258)][_0x1a2bb5(0x1c4)](),_0x504528(_0x3b1416);},_0x3b1416[_0x4fc413(0x1d2)]=()=>{var _0x4e6dc4=_0x4fc413;this[_0x4e6dc4(0x1e5)]=!0x0,this['_disposeWebsocket'](_0x3b1416),this[_0x4e6dc4(0x227)]();},_0x3b1416['onmessage']=_0xe37bc=>{var _0x2b587b=_0x4fc413;try{if(!(_0xe37bc!=null&&_0xe37bc['data'])||!this[_0x2b587b(0x182)])return;let _0x118da=JSON[_0x2b587b(0x191)](_0xe37bc['data']);this[_0x2b587b(0x182)](_0x118da[_0x2b587b(0x26b)],_0x118da[_0x2b587b(0x23b)],this[_0x2b587b(0x1be)],this[_0x2b587b(0x222)]);}catch{}};})[_0x53e4bd(0x1ac)](_0x321927=>(this[_0x53e4bd(0x214)]=!0x0,this['_connecting']=!0x1,this[_0x53e4bd(0x1e5)]=!0x1,this['_allowedToSend']=!0x0,this['_connectAttemptCount']=0x0,_0x321927))[_0x53e4bd(0x240)](_0x369a11=>(this[_0x53e4bd(0x214)]=!0x1,this[_0x53e4bd(0x189)]=!0x1,console[_0x53e4bd(0x226)](_0x53e4bd(0x251)+this['_webSocketErrorDocsLink']),_0x272872(new Error(_0x53e4bd(0x174)+(_0x369a11&&_0x369a11['message'])))));}));}[_0x306708(0x1ea)](_0x105214){var _0x110a37=_0x306708;this[_0x110a37(0x214)]=!0x1,this[_0x110a37(0x189)]=!0x1;try{_0x105214[_0x110a37(0x1d2)]=null,_0x105214[_0x110a37(0x197)]=null,_0x105214[_0x110a37(0x216)]=null;}catch{}try{_0x105214[_0x110a37(0x208)]<0x2&&_0x105214[_0x110a37(0x199)]();}catch{}}['_attemptToReconnectShortly'](){var _0x4578ee=_0x306708;clearTimeout(this[_0x4578ee(0x1c0)]),!(this['_connectAttemptCount']>=this[_0x4578ee(0x1f7)])&&(this[_0x4578ee(0x1c0)]=setTimeout(()=>{var _0x51f9fb=_0x4578ee,_0x2704fd;this['_connected']||this[_0x51f9fb(0x189)]||(this[_0x51f9fb(0x17e)](),(_0x2704fd=this[_0x51f9fb(0x26c)])==null||_0x2704fd[_0x51f9fb(0x240)](()=>this[_0x51f9fb(0x227)]()));},0x1f4),this[_0x4578ee(0x1c0)]['unref']&&this[_0x4578ee(0x1c0)]['unref']());}async[_0x306708(0x1c6)](_0x4ac647){var _0x5b6043=_0x306708;try{if(!this['_allowedToSend'])return;this[_0x5b6043(0x1e5)]&&this[_0x5b6043(0x17e)](),(await this[_0x5b6043(0x26c)])['send'](JSON[_0x5b6043(0x180)](_0x4ac647));}catch(_0x4af89c){this[_0x5b6043(0x221)]?console[_0x5b6043(0x226)](this['_sendErrorMessage']+':\\x20'+(_0x4af89c&&_0x4af89c[_0x5b6043(0x203)])):(this['_extendedWarning']=!0x0,console['warn'](this[_0x5b6043(0x1bc)]+':\\x20'+(_0x4af89c&&_0x4af89c['message']),_0x4ac647)),this['_allowedToSend']=!0x1,this[_0x5b6043(0x227)]();}}};function X(_0x59e9ed,_0x435000,_0x46a0b4,_0x387ea1,_0x3d0ee1,_0x388879,_0x3b442d,_0x3a7591=ae){var _0x316efd=_0x306708;let _0x5e24ec=_0x46a0b4[_0x316efd(0x17c)](',')['map'](_0x2205c0=>{var _0x2a4a71=_0x316efd,_0x289000,_0x38e841,_0x33274a,_0x1654bd;try{if(!_0x59e9ed[_0x2a4a71(0x24d)]){let _0x376a4e=((_0x38e841=(_0x289000=_0x59e9ed[_0x2a4a71(0x25e)])==null?void 0x0:_0x289000['versions'])==null?void 0x0:_0x38e841[_0x2a4a71(0x198)])||((_0x1654bd=(_0x33274a=_0x59e9ed[_0x2a4a71(0x25e)])==null?void 0x0:_0x33274a[_0x2a4a71(0x1ff)])==null?void 0x0:_0x1654bd[_0x2a4a71(0x1d8)])===_0x2a4a71(0x185);(_0x3d0ee1==='next.js'||_0x3d0ee1===_0x2a4a71(0x1e4)||_0x3d0ee1===_0x2a4a71(0x22f)||_0x3d0ee1===_0x2a4a71(0x213))&&(_0x3d0ee1+=_0x376a4e?_0x2a4a71(0x1b3):'\\x20browser'),_0x59e9ed[_0x2a4a71(0x24d)]={'id':+new Date(),'tool':_0x3d0ee1},_0x3b442d&&_0x3d0ee1&&!_0x376a4e&&console['log'](_0x2a4a71(0x264)+(_0x3d0ee1['charAt'](0x0)[_0x2a4a71(0x238)]()+_0x3d0ee1[_0x2a4a71(0x193)](0x1))+',',_0x2a4a71(0x1f5),_0x2a4a71(0x16f));}let _0x3065a6=new H(_0x59e9ed,_0x435000,_0x2205c0,_0x387ea1,_0x388879,_0x3a7591);return _0x3065a6[_0x2a4a71(0x1c6)]['bind'](_0x3065a6);}catch(_0x5cbdc5){return console['warn'](_0x2a4a71(0x247),_0x5cbdc5&&_0x5cbdc5['message']),()=>{};}});return _0x59f8b9=>_0x5e24ec[_0x316efd(0x22d)](_0x5155f2=>_0x5155f2(_0x59f8b9));}function ae(_0x32c035,_0x386228,_0x1ba55a,_0x3db203){var _0xcccd91=_0x306708;_0x3db203&&_0x32c035===_0xcccd91(0x1dd)&&_0x1ba55a[_0xcccd91(0x17d)]['reload']();}function _0x57eb(_0x55b34c,_0x3b16e9){var _0x4ac419=_0x4ac4();return _0x57eb=function(_0x57eb0e,_0x21c986){_0x57eb0e=_0x57eb0e-0x167;var _0x1c6b34=_0x4ac419[_0x57eb0e];return _0x1c6b34;},_0x57eb(_0x55b34c,_0x3b16e9);}function B(_0x3d2273){var _0x4c09a6=_0x306708,_0x1bd3ca,_0x70cdff;let _0x3131bb=function(_0x4828d9,_0x331191){return _0x331191-_0x4828d9;},_0x121f61;if(_0x3d2273[_0x4c09a6(0x24b)])_0x121f61=function(){var _0x29e0e2=_0x4c09a6;return _0x3d2273[_0x29e0e2(0x24b)][_0x29e0e2(0x1fb)]();};else{if(_0x3d2273[_0x4c09a6(0x25e)]&&_0x3d2273[_0x4c09a6(0x25e)][_0x4c09a6(0x190)]&&((_0x70cdff=(_0x1bd3ca=_0x3d2273[_0x4c09a6(0x25e)])==null?void 0x0:_0x1bd3ca['env'])==null?void 0x0:_0x70cdff[_0x4c09a6(0x1d8)])!==_0x4c09a6(0x185))_0x121f61=function(){var _0x5b8216=_0x4c09a6;return _0x3d2273[_0x5b8216(0x25e)]['hrtime']();},_0x3131bb=function(_0x174a25,_0x4a360c){return 0x3e8*(_0x4a360c[0x0]-_0x174a25[0x0])+(_0x4a360c[0x1]-_0x174a25[0x1])/0xf4240;};else try{let {performance:_0x1423c5}=require(_0x4c09a6(0x26f));_0x121f61=function(){var _0x322a81=_0x4c09a6;return _0x1423c5[_0x322a81(0x1fb)]();};}catch{_0x121f61=function(){return+new Date();};}}return{'elapsed':_0x3131bb,'timeStamp':_0x121f61,'now':()=>Date[_0x4c09a6(0x1fb)]()};}function J(_0x42b318,_0x19743b,_0x2fa843){var _0x48a4a0=_0x306708,_0x164059,_0x17f315,_0x43da7c,_0x1142c4,_0x943066;if(_0x42b318[_0x48a4a0(0x171)]!==void 0x0)return _0x42b318[_0x48a4a0(0x171)];let _0x242317=((_0x17f315=(_0x164059=_0x42b318[_0x48a4a0(0x25e)])==null?void 0x0:_0x164059[_0x48a4a0(0x263)])==null?void 0x0:_0x17f315[_0x48a4a0(0x198)])||((_0x1142c4=(_0x43da7c=_0x42b318[_0x48a4a0(0x25e)])==null?void 0x0:_0x43da7c[_0x48a4a0(0x1ff)])==null?void 0x0:_0x1142c4[_0x48a4a0(0x1d8)])==='edge';function _0x1a94f0(_0x586890){var _0x1f649e=_0x48a4a0;if(_0x586890['startsWith']('/')&&_0x586890[_0x1f649e(0x1cf)]('/')){let _0x3e6dd8=new RegExp(_0x586890['slice'](0x1,-0x1));return _0x594d13=>_0x3e6dd8[_0x1f649e(0x1b7)](_0x594d13);}else{if(_0x586890[_0x1f649e(0x241)]('*')||_0x586890[_0x1f649e(0x241)]('?')){let _0x2ebcb8=new RegExp('^'+_0x586890[_0x1f649e(0x220)](/\\./g,String[_0x1f649e(0x204)](0x5c)+'.')[_0x1f649e(0x220)](/\\*/g,'.*')[_0x1f649e(0x220)](/\\?/g,'.')+String[_0x1f649e(0x204)](0x24));return _0x5dcdaa=>_0x2ebcb8[_0x1f649e(0x1b7)](_0x5dcdaa);}else return _0x135db6=>_0x135db6===_0x586890;}}let _0xe3393d=_0x19743b[_0x48a4a0(0x1e1)](_0x1a94f0);return _0x42b318[_0x48a4a0(0x171)]=_0x242317||!_0x19743b,!_0x42b318[_0x48a4a0(0x171)]&&((_0x943066=_0x42b318[_0x48a4a0(0x17d)])==null?void 0x0:_0x943066[_0x48a4a0(0x1bf)])&&(_0x42b318[_0x48a4a0(0x171)]=_0xe3393d['some'](_0x548db0=>_0x548db0(_0x42b318[_0x48a4a0(0x17d)]['hostname']))),_0x42b318[_0x48a4a0(0x171)];}function Y(_0x3fa09f,_0x44ab87,_0x12e5a6,_0x24945e,_0x3b9fc4){var _0x1a0229=_0x306708;_0x3fa09f=_0x3fa09f,_0x44ab87=_0x44ab87,_0x12e5a6=_0x12e5a6,_0x24945e=_0x24945e,_0x3b9fc4=_0x3b9fc4,_0x3b9fc4=_0x3b9fc4||{},_0x3b9fc4['defaultLimits']=_0x3b9fc4[_0x1a0229(0x223)]||{},_0x3b9fc4['reducedLimits']=_0x3b9fc4[_0x1a0229(0x1cd)]||{},_0x3b9fc4[_0x1a0229(0x259)]=_0x3b9fc4[_0x1a0229(0x259)]||{},_0x3b9fc4[_0x1a0229(0x259)][_0x1a0229(0x18d)]=_0x3b9fc4[_0x1a0229(0x259)][_0x1a0229(0x18d)]||{},_0x3b9fc4[_0x1a0229(0x259)]['global']=_0x3b9fc4[_0x1a0229(0x259)][_0x1a0229(0x1be)]||{};let _0x151ea4={'perLogpoint':{'reduceOnCount':_0x3b9fc4[_0x1a0229(0x259)][_0x1a0229(0x18d)][_0x1a0229(0x237)]||0x32,'reduceOnAccumulatedProcessingTimeMs':_0x3b9fc4[_0x1a0229(0x259)]['perLogpoint']['reduceOnAccumulatedProcessingTimeMs']||0x64,'resetWhenQuietMs':_0x3b9fc4[_0x1a0229(0x259)][_0x1a0229(0x18d)][_0x1a0229(0x1f8)]||0x1f4,'resetOnProcessingTimeAverageMs':_0x3b9fc4[_0x1a0229(0x259)][_0x1a0229(0x18d)][_0x1a0229(0x19c)]||0x64},'global':{'reduceOnCount':_0x3b9fc4[_0x1a0229(0x259)][_0x1a0229(0x1be)][_0x1a0229(0x237)]||0x3e8,'reduceOnAccumulatedProcessingTimeMs':_0x3b9fc4[_0x1a0229(0x259)][_0x1a0229(0x1be)][_0x1a0229(0x1e9)]||0x12c,'resetWhenQuietMs':_0x3b9fc4['reducePolicy'][_0x1a0229(0x1be)][_0x1a0229(0x1f8)]||0x32,'resetOnProcessingTimeAverageMs':_0x3b9fc4[_0x1a0229(0x259)][_0x1a0229(0x1be)][_0x1a0229(0x19c)]||0x64}},_0x2633ed=B(_0x3fa09f),_0x3e3008=_0x2633ed[_0x1a0229(0x1ca)],_0xac187d=_0x2633ed[_0x1a0229(0x22e)];class _0x111409{constructor(){var _0x179f3c=_0x1a0229;this[_0x179f3c(0x1eb)]=/^(?!(?:do|if|in|for|let|new|try|var|case|else|enum|eval|false|null|this|true|void|with|break|catch|class|const|super|throw|while|yield|delete|export|import|public|return|static|switch|typeof|default|extends|finally|package|private|continue|debugger|function|arguments|interface|protected|implements|instanceof)$)[_$a-zA-Z\\xA0-\\uFFFF][_$a-zA-Z0-9\\xA0-\\uFFFF]*$/,this[_0x179f3c(0x1d5)]=/^(0|[1-9][0-9]*)$/,this[_0x179f3c(0x218)]=/'([^\\\\']|\\\\')*'/,this[_0x179f3c(0x268)]=_0x3fa09f[_0x179f3c(0x20a)],this[_0x179f3c(0x24c)]=_0x3fa09f['HTMLAllCollection'],this[_0x179f3c(0x179)]=Object[_0x179f3c(0x1f2)],this[_0x179f3c(0x205)]=Object['getOwnPropertyNames'],this['_Symbol']=_0x3fa09f[_0x179f3c(0x18e)],this[_0x179f3c(0x265)]=RegExp[_0x179f3c(0x269)]['toString'],this[_0x179f3c(0x17a)]=Date['prototype'][_0x179f3c(0x252)];}['serialize'](_0x40d6a8,_0x554cac,_0x52039e,_0xacf72f){var _0x57ff23=_0x1a0229,_0x27498f=this,_0x3d1269=_0x52039e[_0x57ff23(0x1a4)];function _0x352c7e(_0x319167,_0x1cb4b8,_0x46d708){var _0x25615d=_0x57ff23;_0x1cb4b8[_0x25615d(0x21d)]='unknown',_0x1cb4b8[_0x25615d(0x195)]=_0x319167['message'],_0x3294e4=_0x46d708[_0x25615d(0x198)][_0x25615d(0x24f)],_0x46d708[_0x25615d(0x198)][_0x25615d(0x24f)]=_0x1cb4b8,_0x27498f[_0x25615d(0x1c1)](_0x1cb4b8,_0x46d708);}let _0x203bc0;_0x3fa09f[_0x57ff23(0x1ba)]&&(_0x203bc0=_0x3fa09f[_0x57ff23(0x1ba)]['error'],_0x203bc0&&(_0x3fa09f[_0x57ff23(0x1ba)][_0x57ff23(0x195)]=function(){}));try{try{_0x52039e[_0x57ff23(0x233)]++,_0x52039e[_0x57ff23(0x1a4)]&&_0x52039e[_0x57ff23(0x1cb)]['push'](_0x554cac);var _0x507685,_0x2b5a2a,_0x5a02a3,_0x5cc2d1,_0x191590=[],_0x5d6631=[],_0xeb0b4,_0x430667=this[_0x57ff23(0x20e)](_0x554cac),_0x5ec1b1=_0x430667===_0x57ff23(0x1ee),_0x9c9d40=!0x1,_0x359db7=_0x430667===_0x57ff23(0x1fa),_0x55f196=this[_0x57ff23(0x20f)](_0x430667),_0x1c958d=this[_0x57ff23(0x26d)](_0x430667),_0x26f774=_0x55f196||_0x1c958d,_0x28c67b={},_0x34603f=0x0,_0x22ac07=!0x1,_0x3294e4,_0x468afa=/^(([1-9]{1}[0-9]*)|0)$/;if(_0x52039e['depth']){if(_0x5ec1b1){if(_0x2b5a2a=_0x554cac[_0x57ff23(0x1b6)],_0x2b5a2a>_0x52039e[_0x57ff23(0x16d)]){for(_0x5a02a3=0x0,_0x5cc2d1=_0x52039e[_0x57ff23(0x16d)],_0x507685=_0x5a02a3;_0x507685<_0x5cc2d1;_0x507685++)_0x5d6631[_0x57ff23(0x26e)](_0x27498f[_0x57ff23(0x20b)](_0x191590,_0x554cac,_0x430667,_0x507685,_0x52039e));_0x40d6a8[_0x57ff23(0x1d1)]=!0x0;}else{for(_0x5a02a3=0x0,_0x5cc2d1=_0x2b5a2a,_0x507685=_0x5a02a3;_0x507685<_0x5cc2d1;_0x507685++)_0x5d6631[_0x57ff23(0x26e)](_0x27498f[_0x57ff23(0x20b)](_0x191590,_0x554cac,_0x430667,_0x507685,_0x52039e));}_0x52039e[_0x57ff23(0x19e)]+=_0x5d6631[_0x57ff23(0x1b6)];}if(!(_0x430667===_0x57ff23(0x1d9)||_0x430667===_0x57ff23(0x20a))&&!_0x55f196&&_0x430667!=='String'&&_0x430667!==_0x57ff23(0x261)&&_0x430667!==_0x57ff23(0x230)){var _0x48cb10=_0xacf72f[_0x57ff23(0x18f)]||_0x52039e['props'];if(this[_0x57ff23(0x194)](_0x554cac)?(_0x507685=0x0,_0x554cac[_0x57ff23(0x22d)](function(_0x5e3879){var _0x4028da=_0x57ff23;if(_0x34603f++,_0x52039e[_0x4028da(0x19e)]++,_0x34603f>_0x48cb10){_0x22ac07=!0x0;return;}if(!_0x52039e[_0x4028da(0x1b4)]&&_0x52039e['autoExpand']&&_0x52039e[_0x4028da(0x19e)]>_0x52039e[_0x4028da(0x1a3)]){_0x22ac07=!0x0;return;}_0x5d6631['push'](_0x27498f[_0x4028da(0x20b)](_0x191590,_0x554cac,'Set',_0x507685++,_0x52039e,function(_0x326cff){return function(){return _0x326cff;};}(_0x5e3879)));})):this['_isMap'](_0x554cac)&&_0x554cac[_0x57ff23(0x22d)](function(_0x21d5e9,_0x1bbf3a){var _0x572ec4=_0x57ff23;if(_0x34603f++,_0x52039e[_0x572ec4(0x19e)]++,_0x34603f>_0x48cb10){_0x22ac07=!0x0;return;}if(!_0x52039e[_0x572ec4(0x1b4)]&&_0x52039e[_0x572ec4(0x1a4)]&&_0x52039e['autoExpandPropertyCount']>_0x52039e['autoExpandLimit']){_0x22ac07=!0x0;return;}var _0x1e13a8=_0x1bbf3a[_0x572ec4(0x252)]();_0x1e13a8[_0x572ec4(0x1b6)]>0x64&&(_0x1e13a8=_0x1e13a8[_0x572ec4(0x16c)](0x0,0x64)+_0x572ec4(0x19f)),_0x5d6631[_0x572ec4(0x26e)](_0x27498f[_0x572ec4(0x20b)](_0x191590,_0x554cac,'Map',_0x1e13a8,_0x52039e,function(_0x5e237b){return function(){return _0x5e237b;};}(_0x21d5e9)));}),!_0x9c9d40){try{for(_0xeb0b4 in _0x554cac)if(!(_0x5ec1b1&&_0x468afa[_0x57ff23(0x1b7)](_0xeb0b4))&&!this[_0x57ff23(0x267)](_0x554cac,_0xeb0b4,_0x52039e)){if(_0x34603f++,_0x52039e[_0x57ff23(0x19e)]++,_0x34603f>_0x48cb10){_0x22ac07=!0x0;break;}if(!_0x52039e[_0x57ff23(0x1b4)]&&_0x52039e[_0x57ff23(0x1a4)]&&_0x52039e['autoExpandPropertyCount']>_0x52039e['autoExpandLimit']){_0x22ac07=!0x0;break;}_0x5d6631[_0x57ff23(0x26e)](_0x27498f[_0x57ff23(0x234)](_0x191590,_0x28c67b,_0x554cac,_0x430667,_0xeb0b4,_0x52039e));}}catch{}if(_0x28c67b[_0x57ff23(0x173)]=!0x0,_0x359db7&&(_0x28c67b[_0x57ff23(0x1b5)]=!0x0),!_0x22ac07){var _0xb9ad21=[][_0x57ff23(0x256)](this[_0x57ff23(0x205)](_0x554cac))[_0x57ff23(0x256)](this['_getOwnPropertySymbols'](_0x554cac));for(_0x507685=0x0,_0x2b5a2a=_0xb9ad21[_0x57ff23(0x1b6)];_0x507685<_0x2b5a2a;_0x507685++)if(_0xeb0b4=_0xb9ad21[_0x507685],!(_0x5ec1b1&&_0x468afa[_0x57ff23(0x1b7)](_0xeb0b4[_0x57ff23(0x252)]()))&&!this[_0x57ff23(0x267)](_0x554cac,_0xeb0b4,_0x52039e)&&!_0x28c67b[_0x57ff23(0x1ab)+_0xeb0b4[_0x57ff23(0x252)]()]){if(_0x34603f++,_0x52039e[_0x57ff23(0x19e)]++,_0x34603f>_0x48cb10){_0x22ac07=!0x0;break;}if(!_0x52039e[_0x57ff23(0x1b4)]&&_0x52039e[_0x57ff23(0x1a4)]&&_0x52039e[_0x57ff23(0x19e)]>_0x52039e['autoExpandLimit']){_0x22ac07=!0x0;break;}_0x5d6631['push'](_0x27498f['_addObjectProperty'](_0x191590,_0x28c67b,_0x554cac,_0x430667,_0xeb0b4,_0x52039e));}}}}}if(_0x40d6a8['type']=_0x430667,_0x26f774?(_0x40d6a8[_0x57ff23(0x184)]=_0x554cac['valueOf'](),this[_0x57ff23(0x1e7)](_0x430667,_0x40d6a8,_0x52039e,_0xacf72f)):_0x430667==='date'?_0x40d6a8[_0x57ff23(0x184)]=this[_0x57ff23(0x17a)][_0x57ff23(0x21a)](_0x554cac):_0x430667===_0x57ff23(0x230)?_0x40d6a8[_0x57ff23(0x184)]=_0x554cac[_0x57ff23(0x252)]():_0x430667===_0x57ff23(0x244)?_0x40d6a8[_0x57ff23(0x184)]=this[_0x57ff23(0x265)][_0x57ff23(0x21a)](_0x554cac):_0x430667===_0x57ff23(0x1dc)&&this['_Symbol']?_0x40d6a8[_0x57ff23(0x184)]=this[_0x57ff23(0x1f9)]['prototype'][_0x57ff23(0x252)][_0x57ff23(0x21a)](_0x554cac):!_0x52039e[_0x57ff23(0x1fe)]&&!(_0x430667===_0x57ff23(0x1d9)||_0x430667==='undefined')&&(delete _0x40d6a8[_0x57ff23(0x184)],_0x40d6a8[_0x57ff23(0x1aa)]=!0x0),_0x22ac07&&(_0x40d6a8[_0x57ff23(0x19d)]=!0x0),_0x3294e4=_0x52039e['node'][_0x57ff23(0x24f)],_0x52039e['node'][_0x57ff23(0x24f)]=_0x40d6a8,this[_0x57ff23(0x1c1)](_0x40d6a8,_0x52039e),_0x5d6631[_0x57ff23(0x1b6)]){for(_0x507685=0x0,_0x2b5a2a=_0x5d6631[_0x57ff23(0x1b6)];_0x507685<_0x2b5a2a;_0x507685++)_0x5d6631[_0x507685](_0x507685);}_0x191590[_0x57ff23(0x1b6)]&&(_0x40d6a8[_0x57ff23(0x18f)]=_0x191590);}catch(_0x3e590f){_0x352c7e(_0x3e590f,_0x40d6a8,_0x52039e);}this[_0x57ff23(0x1ad)](_0x554cac,_0x40d6a8),this[_0x57ff23(0x1f3)](_0x40d6a8,_0x52039e),_0x52039e[_0x57ff23(0x198)][_0x57ff23(0x24f)]=_0x3294e4,_0x52039e[_0x57ff23(0x233)]--,_0x52039e[_0x57ff23(0x1a4)]=_0x3d1269,_0x52039e[_0x57ff23(0x1a4)]&&_0x52039e[_0x57ff23(0x1cb)][_0x57ff23(0x21b)]();}finally{_0x203bc0&&(_0x3fa09f[_0x57ff23(0x1ba)][_0x57ff23(0x195)]=_0x203bc0);}return _0x40d6a8;}[_0x1a0229(0x1a7)](_0x5bc7aa){return Object['getOwnPropertySymbols']?Object['getOwnPropertySymbols'](_0x5bc7aa):[];}['_isSet'](_0x2b9132){var _0x64ad7f=_0x1a0229;return!!(_0x2b9132&&_0x3fa09f[_0x64ad7f(0x1af)]&&this[_0x64ad7f(0x215)](_0x2b9132)===_0x64ad7f(0x168)&&_0x2b9132[_0x64ad7f(0x22d)]);}['_blacklistedProperty'](_0x6da349,_0x27887d,_0x3ab798){var _0x15f72a=_0x1a0229;if(!_0x3ab798[_0x15f72a(0x207)]){let _0x4b858a=this[_0x15f72a(0x179)](_0x6da349,_0x27887d);if(_0x4b858a&&_0x4b858a[_0x15f72a(0x1e8)])return!0x0;}return _0x3ab798['noFunctions']?typeof _0x6da349[_0x27887d]==_0x15f72a(0x1fa):!0x1;}[_0x1a0229(0x20e)](_0x46e341){var _0xed104=_0x1a0229,_0x842a19='';return _0x842a19=typeof _0x46e341,_0x842a19==='object'?this[_0xed104(0x215)](_0x46e341)==='[object\\x20Array]'?_0x842a19='array':this[_0xed104(0x215)](_0x46e341)===_0xed104(0x231)?_0x842a19=_0xed104(0x1a0):this[_0xed104(0x215)](_0x46e341)===_0xed104(0x25c)?_0x842a19='bigint':_0x46e341===null?_0x842a19='null':_0x46e341['constructor']&&(_0x842a19=_0x46e341[_0xed104(0x246)][_0xed104(0x229)]||_0x842a19):_0x842a19===_0xed104(0x20a)&&this[_0xed104(0x24c)]&&_0x46e341 instanceof this['_HTMLAllCollection']&&(_0x842a19=_0xed104(0x1b9)),_0x842a19;}[_0x1a0229(0x215)](_0x3a4a42){var _0x52978d=_0x1a0229;return Object[_0x52978d(0x269)][_0x52978d(0x252)][_0x52978d(0x21a)](_0x3a4a42);}[_0x1a0229(0x20f)](_0x344afd){var _0x18ea96=_0x1a0229;return _0x344afd===_0x18ea96(0x169)||_0x344afd===_0x18ea96(0x1e3)||_0x344afd===_0x18ea96(0x1b1);}[_0x1a0229(0x26d)](_0x268fb2){var _0x30d14e=_0x1a0229;return _0x268fb2===_0x30d14e(0x250)||_0x268fb2===_0x30d14e(0x1c2)||_0x268fb2===_0x30d14e(0x232);}[_0x1a0229(0x20b)](_0x5a4048,_0xed6d73,_0x496d2d,_0x5200b2,_0x2ad9ae,_0x2ae99d){var _0x3ea8a2=this;return function(_0x5147f2){var _0x5c347b=_0x57eb,_0x5a16fe=_0x2ad9ae[_0x5c347b(0x198)][_0x5c347b(0x24f)],_0x344d27=_0x2ad9ae['node'][_0x5c347b(0x211)],_0x4187de=_0x2ad9ae[_0x5c347b(0x198)][_0x5c347b(0x192)];_0x2ad9ae['node']['parent']=_0x5a16fe,_0x2ad9ae[_0x5c347b(0x198)][_0x5c347b(0x211)]=typeof _0x5200b2==_0x5c347b(0x1b1)?_0x5200b2:_0x5147f2,_0x5a4048[_0x5c347b(0x26e)](_0x3ea8a2['_property'](_0xed6d73,_0x496d2d,_0x5200b2,_0x2ad9ae,_0x2ae99d)),_0x2ad9ae['node'][_0x5c347b(0x192)]=_0x4187de,_0x2ad9ae[_0x5c347b(0x198)][_0x5c347b(0x211)]=_0x344d27;};}[_0x1a0229(0x234)](_0x3e1fde,_0x3d8d61,_0x475fe8,_0x5aec1a,_0x4ff186,_0x21a460,_0x5c688a){var _0x547a69=_0x1a0229,_0x5e16c3=this;return _0x3d8d61['_p_'+_0x4ff186[_0x547a69(0x252)]()]=!0x0,function(_0x176a2d){var _0x5d8009=_0x547a69,_0x5cf964=_0x21a460[_0x5d8009(0x198)][_0x5d8009(0x24f)],_0x3bc9c4=_0x21a460[_0x5d8009(0x198)][_0x5d8009(0x211)],_0x30229a=_0x21a460['node'][_0x5d8009(0x192)];_0x21a460[_0x5d8009(0x198)]['parent']=_0x5cf964,_0x21a460[_0x5d8009(0x198)][_0x5d8009(0x211)]=_0x176a2d,_0x3e1fde['push'](_0x5e16c3[_0x5d8009(0x23c)](_0x475fe8,_0x5aec1a,_0x4ff186,_0x21a460,_0x5c688a)),_0x21a460[_0x5d8009(0x198)][_0x5d8009(0x192)]=_0x30229a,_0x21a460[_0x5d8009(0x198)][_0x5d8009(0x211)]=_0x3bc9c4;};}[_0x1a0229(0x23c)](_0x1354ea,_0x549fc8,_0x34c184,_0x3ea67a,_0x187926){var _0x54c1c6=_0x1a0229,_0x517077=this;_0x187926||(_0x187926=function(_0x560c04,_0x358223){return _0x560c04[_0x358223];});var _0x4b95cc=_0x34c184[_0x54c1c6(0x252)](),_0x2df5ee=_0x3ea67a[_0x54c1c6(0x1e0)]||{},_0x27230e=_0x3ea67a[_0x54c1c6(0x1fe)],_0x58094a=_0x3ea67a[_0x54c1c6(0x1b4)];try{var _0x551f2a=this[_0x54c1c6(0x249)](_0x1354ea),_0x258e78=_0x4b95cc;_0x551f2a&&_0x258e78[0x0]==='\\x27'&&(_0x258e78=_0x258e78[_0x54c1c6(0x193)](0x1,_0x258e78[_0x54c1c6(0x1b6)]-0x2));var _0x167185=_0x3ea67a[_0x54c1c6(0x1e0)]=_0x2df5ee[_0x54c1c6(0x1ab)+_0x258e78];_0x167185&&(_0x3ea67a[_0x54c1c6(0x1fe)]=_0x3ea67a['depth']+0x1),_0x3ea67a[_0x54c1c6(0x1b4)]=!!_0x167185;var _0x5bb1a9=typeof _0x34c184==_0x54c1c6(0x1dc),_0x4b5ab0={'name':_0x5bb1a9||_0x551f2a?_0x4b95cc:this[_0x54c1c6(0x20d)](_0x4b95cc)};if(_0x5bb1a9&&(_0x4b5ab0['symbol']=!0x0),!(_0x549fc8===_0x54c1c6(0x1ee)||_0x549fc8===_0x54c1c6(0x242))){var _0x12e894=this[_0x54c1c6(0x179)](_0x1354ea,_0x34c184);if(_0x12e894&&(_0x12e894['set']&&(_0x4b5ab0[_0x54c1c6(0x1ce)]=!0x0),_0x12e894[_0x54c1c6(0x1e8)]&&!_0x167185&&!_0x3ea67a[_0x54c1c6(0x207)]))return _0x4b5ab0[_0x54c1c6(0x235)]=!0x0,this[_0x54c1c6(0x17b)](_0x4b5ab0,_0x3ea67a),_0x4b5ab0;}var _0x117dac;try{_0x117dac=_0x187926(_0x1354ea,_0x34c184);}catch(_0x552030){return _0x4b5ab0={'name':_0x4b95cc,'type':_0x54c1c6(0x1b0),'error':_0x552030[_0x54c1c6(0x203)]},this['_processTreeNodeResult'](_0x4b5ab0,_0x3ea67a),_0x4b5ab0;}var _0x353809=this[_0x54c1c6(0x20e)](_0x117dac),_0x585700=this[_0x54c1c6(0x20f)](_0x353809);if(_0x4b5ab0[_0x54c1c6(0x21d)]=_0x353809,_0x585700)this[_0x54c1c6(0x17b)](_0x4b5ab0,_0x3ea67a,_0x117dac,function(){var _0x44f506=_0x54c1c6;_0x4b5ab0['value']=_0x117dac['valueOf'](),!_0x167185&&_0x517077[_0x44f506(0x1e7)](_0x353809,_0x4b5ab0,_0x3ea67a,{});});else{var _0x4920c5=_0x3ea67a[_0x54c1c6(0x1a4)]&&_0x3ea67a[_0x54c1c6(0x233)]<_0x3ea67a[_0x54c1c6(0x1b8)]&&_0x3ea67a[_0x54c1c6(0x1cb)][_0x54c1c6(0x224)](_0x117dac)<0x0&&_0x353809!==_0x54c1c6(0x1fa)&&_0x3ea67a[_0x54c1c6(0x19e)]<_0x3ea67a['autoExpandLimit'];_0x4920c5||_0x3ea67a[_0x54c1c6(0x233)]<_0x27230e||_0x167185?(this['serialize'](_0x4b5ab0,_0x117dac,_0x3ea67a,_0x167185||{}),this[_0x54c1c6(0x1ad)](_0x117dac,_0x4b5ab0)):this['_processTreeNodeResult'](_0x4b5ab0,_0x3ea67a,_0x117dac,function(){var _0x57d325=_0x54c1c6;_0x353809===_0x57d325(0x1d9)||_0x353809===_0x57d325(0x20a)||(delete _0x4b5ab0[_0x57d325(0x184)],_0x4b5ab0['capped']=!0x0);});}return _0x4b5ab0;}finally{_0x3ea67a[_0x54c1c6(0x1e0)]=_0x2df5ee,_0x3ea67a[_0x54c1c6(0x1fe)]=_0x27230e,_0x3ea67a[_0x54c1c6(0x1b4)]=_0x58094a;}}[_0x1a0229(0x1e7)](_0x56ea77,_0xe68ac4,_0x19079c,_0x151ab0){var _0x4ce5e3=_0x1a0229,_0x3ddd62=_0x151ab0[_0x4ce5e3(0x1de)]||_0x19079c[_0x4ce5e3(0x1de)];if((_0x56ea77===_0x4ce5e3(0x1e3)||_0x56ea77===_0x4ce5e3(0x1c2))&&_0xe68ac4['value']){let _0x1e81f3=_0xe68ac4[_0x4ce5e3(0x184)][_0x4ce5e3(0x1b6)];_0x19079c['allStrLength']+=_0x1e81f3,_0x19079c[_0x4ce5e3(0x200)]>_0x19079c[_0x4ce5e3(0x1c7)]?(_0xe68ac4[_0x4ce5e3(0x1aa)]='',delete _0xe68ac4[_0x4ce5e3(0x184)]):_0x1e81f3>_0x3ddd62&&(_0xe68ac4[_0x4ce5e3(0x1aa)]=_0xe68ac4[_0x4ce5e3(0x184)]['substr'](0x0,_0x3ddd62),delete _0xe68ac4['value']);}}[_0x1a0229(0x249)](_0x394563){var _0x5a0544=_0x1a0229;return!!(_0x394563&&_0x3fa09f[_0x5a0544(0x1ec)]&&this[_0x5a0544(0x215)](_0x394563)===_0x5a0544(0x23a)&&_0x394563[_0x5a0544(0x22d)]);}[_0x1a0229(0x20d)](_0x182c1e){var _0x45e012=_0x1a0229;if(_0x182c1e[_0x45e012(0x1f4)](/^\\d+$/))return _0x182c1e;var _0x3a5b42;try{_0x3a5b42=JSON['stringify'](''+_0x182c1e);}catch{_0x3a5b42='\\x22'+this[_0x45e012(0x215)](_0x182c1e)+'\\x22';}return _0x3a5b42['match'](/^\"([a-zA-Z_][a-zA-Z_0-9]*)\"$/)?_0x3a5b42=_0x3a5b42[_0x45e012(0x193)](0x1,_0x3a5b42[_0x45e012(0x1b6)]-0x2):_0x3a5b42=_0x3a5b42[_0x45e012(0x220)](/'/g,'\\x5c\\x27')['replace'](/\\\\\"/g,'\\x22')['replace'](/(^\"|\"$)/g,'\\x27'),_0x3a5b42;}[_0x1a0229(0x17b)](_0x42bdc4,_0x2913cb,_0x26c947,_0x1a1ce7){var _0x58d5f8=_0x1a0229;this[_0x58d5f8(0x1c1)](_0x42bdc4,_0x2913cb),_0x1a1ce7&&_0x1a1ce7(),this[_0x58d5f8(0x1ad)](_0x26c947,_0x42bdc4),this[_0x58d5f8(0x1f3)](_0x42bdc4,_0x2913cb);}[_0x1a0229(0x1c1)](_0x4e11a0,_0xbbeada){var _0x1a94cb=_0x1a0229;this[_0x1a94cb(0x181)](_0x4e11a0,_0xbbeada),this[_0x1a94cb(0x23e)](_0x4e11a0,_0xbbeada),this[_0x1a94cb(0x22a)](_0x4e11a0,_0xbbeada),this[_0x1a94cb(0x260)](_0x4e11a0,_0xbbeada);}[_0x1a0229(0x181)](_0x19de26,_0x41a25d){}[_0x1a0229(0x23e)](_0x1356cd,_0x4a5fac){}[_0x1a0229(0x1d0)](_0x1cd658,_0x4a1747){}[_0x1a0229(0x1f6)](_0x3cb148){var _0x43c24f=_0x1a0229;return _0x3cb148===this[_0x43c24f(0x268)];}[_0x1a0229(0x1f3)](_0x283677,_0x5afa0e){var _0x7f88c3=_0x1a0229;this[_0x7f88c3(0x1d0)](_0x283677,_0x5afa0e),this['_setNodeExpandableState'](_0x283677),_0x5afa0e[_0x7f88c3(0x1a9)]&&this[_0x7f88c3(0x1fd)](_0x283677),this[_0x7f88c3(0x1d4)](_0x283677,_0x5afa0e),this['_addLoadNode'](_0x283677,_0x5afa0e),this[_0x7f88c3(0x167)](_0x283677);}[_0x1a0229(0x1ad)](_0x13930e,_0x569f4b){var _0x488226=_0x1a0229;try{_0x13930e&&typeof _0x13930e[_0x488226(0x1b6)]==_0x488226(0x1b1)&&(_0x569f4b[_0x488226(0x1b6)]=_0x13930e[_0x488226(0x1b6)]);}catch{}if(_0x569f4b['type']===_0x488226(0x1b1)||_0x569f4b[_0x488226(0x21d)]===_0x488226(0x232)){if(isNaN(_0x569f4b[_0x488226(0x184)]))_0x569f4b[_0x488226(0x1df)]=!0x0,delete _0x569f4b[_0x488226(0x184)];else switch(_0x569f4b[_0x488226(0x184)]){case Number[_0x488226(0x236)]:_0x569f4b[_0x488226(0x239)]=!0x0,delete _0x569f4b['value'];break;case Number[_0x488226(0x228)]:_0x569f4b[_0x488226(0x1fc)]=!0x0,delete _0x569f4b['value'];break;case 0x0:this[_0x488226(0x19b)](_0x569f4b[_0x488226(0x184)])&&(_0x569f4b[_0x488226(0x178)]=!0x0);break;}}else _0x569f4b[_0x488226(0x21d)]===_0x488226(0x1fa)&&typeof _0x13930e['name']==_0x488226(0x1e3)&&_0x13930e[_0x488226(0x229)]&&_0x569f4b[_0x488226(0x229)]&&_0x13930e['name']!==_0x569f4b['name']&&(_0x569f4b['funcName']=_0x13930e[_0x488226(0x229)]);}[_0x1a0229(0x19b)](_0x2e602c){var _0x3d950b=_0x1a0229;return 0x1/_0x2e602c===Number[_0x3d950b(0x228)];}[_0x1a0229(0x1fd)](_0x429dd2){var _0x312c75=_0x1a0229;!_0x429dd2[_0x312c75(0x18f)]||!_0x429dd2['props'][_0x312c75(0x1b6)]||_0x429dd2[_0x312c75(0x21d)]===_0x312c75(0x1ee)||_0x429dd2[_0x312c75(0x21d)]==='Map'||_0x429dd2[_0x312c75(0x21d)]===_0x312c75(0x1af)||_0x429dd2[_0x312c75(0x18f)]['sort'](function(_0x612321,_0x1df7f8){var _0x3c5dab=_0x312c75,_0x1fba1b=_0x612321[_0x3c5dab(0x229)][_0x3c5dab(0x1ed)](),_0x1143f9=_0x1df7f8[_0x3c5dab(0x229)][_0x3c5dab(0x1ed)]();return _0x1fba1b<_0x1143f9?-0x1:_0x1fba1b>_0x1143f9?0x1:0x0;});}[_0x1a0229(0x1d4)](_0x3895f9,_0x48aadd){var _0x351d89=_0x1a0229;if(!(_0x48aadd['noFunctions']||!_0x3895f9[_0x351d89(0x18f)]||!_0x3895f9['props'][_0x351d89(0x1b6)])){for(var _0x4d9e5c=[],_0x23eb96=[],_0xd62b75=0x0,_0x5a2dfe=_0x3895f9[_0x351d89(0x18f)][_0x351d89(0x1b6)];_0xd62b75<_0x5a2dfe;_0xd62b75++){var _0x4c17b7=_0x3895f9[_0x351d89(0x18f)][_0xd62b75];_0x4c17b7[_0x351d89(0x21d)]===_0x351d89(0x1fa)?_0x4d9e5c[_0x351d89(0x26e)](_0x4c17b7):_0x23eb96[_0x351d89(0x26e)](_0x4c17b7);}if(!(!_0x23eb96[_0x351d89(0x1b6)]||_0x4d9e5c[_0x351d89(0x1b6)]<=0x1)){_0x3895f9[_0x351d89(0x18f)]=_0x23eb96;var _0x2b33a7={'functionsNode':!0x0,'props':_0x4d9e5c};this[_0x351d89(0x181)](_0x2b33a7,_0x48aadd),this['_setNodeLabel'](_0x2b33a7,_0x48aadd),this[_0x351d89(0x1ae)](_0x2b33a7),this[_0x351d89(0x260)](_0x2b33a7,_0x48aadd),_0x2b33a7['id']+='\\x20f',_0x3895f9[_0x351d89(0x18f)]['unshift'](_0x2b33a7);}}}[_0x1a0229(0x243)](_0x4abe08,_0x5b7c75){}['_setNodeExpandableState'](_0x59678d){}[_0x1a0229(0x212)](_0xdf985c){var _0x2524e2=_0x1a0229;return Array[_0x2524e2(0x23d)](_0xdf985c)||typeof _0xdf985c==_0x2524e2(0x206)&&this[_0x2524e2(0x215)](_0xdf985c)==='[object\\x20Array]';}['_setNodePermissions'](_0x3fb9a6,_0x4e6343){}['_cleanNode'](_0x23c336){var _0x1d7070=_0x1a0229;delete _0x23c336[_0x1d7070(0x253)],delete _0x23c336[_0x1d7070(0x1e2)],delete _0x23c336[_0x1d7070(0x18b)];}[_0x1a0229(0x22a)](_0x1acfab,_0x4597d6){}}let _0x3c89ee=new _0x111409(),_0x5ec458={'props':_0x3b9fc4[_0x1a0229(0x223)][_0x1a0229(0x18f)]||0x64,'elements':_0x3b9fc4[_0x1a0229(0x223)][_0x1a0229(0x16d)]||0x64,'strLength':_0x3b9fc4[_0x1a0229(0x223)][_0x1a0229(0x1de)]||0x400*0x32,'totalStrLength':_0x3b9fc4['defaultLimits'][_0x1a0229(0x1c7)]||0x400*0x32,'autoExpandLimit':_0x3b9fc4[_0x1a0229(0x223)][_0x1a0229(0x1a3)]||0x1388,'autoExpandMaxDepth':_0x3b9fc4[_0x1a0229(0x223)][_0x1a0229(0x1b8)]||0xa},_0x3a09dd={'props':_0x3b9fc4[_0x1a0229(0x1cd)][_0x1a0229(0x18f)]||0x5,'elements':_0x3b9fc4[_0x1a0229(0x1cd)][_0x1a0229(0x16d)]||0x5,'strLength':_0x3b9fc4[_0x1a0229(0x1cd)][_0x1a0229(0x1de)]||0x100,'totalStrLength':_0x3b9fc4['reducedLimits'][_0x1a0229(0x1c7)]||0x100*0x3,'autoExpandLimit':_0x3b9fc4['reducedLimits']['autoExpandLimit']||0x1e,'autoExpandMaxDepth':_0x3b9fc4[_0x1a0229(0x1cd)][_0x1a0229(0x1b8)]||0x2};function _0x4b3a63(_0x205bfc,_0x18b986,_0x503f06,_0x274aab,_0x31f6c4,_0x454f1c){var _0x290454=_0x1a0229;let _0x2396c5,_0x2aa929;try{_0x2aa929=_0xac187d(),_0x2396c5=_0x12e5a6[_0x18b986],!_0x2396c5||_0x2aa929-_0x2396c5['ts']>_0x151ea4['perLogpoint'][_0x290454(0x1f8)]&&_0x2396c5[_0x290454(0x1d6)]&&_0x2396c5[_0x290454(0x26a)]/_0x2396c5[_0x290454(0x1d6)]<_0x151ea4[_0x290454(0x18d)]['resetOnProcessingTimeAverageMs']?(_0x12e5a6[_0x18b986]=_0x2396c5={'count':0x0,'time':0x0,'ts':_0x2aa929},_0x12e5a6[_0x290454(0x257)]={}):_0x2aa929-_0x12e5a6[_0x290454(0x257)]['ts']>_0x151ea4[_0x290454(0x1be)][_0x290454(0x1f8)]&&_0x12e5a6[_0x290454(0x257)][_0x290454(0x1d6)]&&_0x12e5a6['hits'][_0x290454(0x26a)]/_0x12e5a6['hits'][_0x290454(0x1d6)]<_0x151ea4['global'][_0x290454(0x19c)]&&(_0x12e5a6[_0x290454(0x257)]={});let _0x465570=[],_0x401ade=_0x2396c5['reduceLimits']||_0x12e5a6[_0x290454(0x257)][_0x290454(0x1f1)]?_0x3a09dd:_0x5ec458,_0x5527b0=_0x17275e=>{var _0x16c392=_0x290454;let _0x3d2b1a={};return _0x3d2b1a[_0x16c392(0x18f)]=_0x17275e[_0x16c392(0x18f)],_0x3d2b1a[_0x16c392(0x16d)]=_0x17275e[_0x16c392(0x16d)],_0x3d2b1a[_0x16c392(0x1de)]=_0x17275e[_0x16c392(0x1de)],_0x3d2b1a['totalStrLength']=_0x17275e[_0x16c392(0x1c7)],_0x3d2b1a['autoExpandLimit']=_0x17275e[_0x16c392(0x1a3)],_0x3d2b1a[_0x16c392(0x1b8)]=_0x17275e[_0x16c392(0x1b8)],_0x3d2b1a[_0x16c392(0x1a9)]=!0x1,_0x3d2b1a[_0x16c392(0x175)]=!_0x44ab87,_0x3d2b1a[_0x16c392(0x1fe)]=0x1,_0x3d2b1a[_0x16c392(0x233)]=0x0,_0x3d2b1a[_0x16c392(0x176)]=_0x16c392(0x24a),_0x3d2b1a[_0x16c392(0x1e6)]=_0x16c392(0x18c),_0x3d2b1a[_0x16c392(0x1a4)]=!0x0,_0x3d2b1a[_0x16c392(0x1cb)]=[],_0x3d2b1a[_0x16c392(0x19e)]=0x0,_0x3d2b1a[_0x16c392(0x207)]=_0x3b9fc4['resolveGetters'],_0x3d2b1a[_0x16c392(0x200)]=0x0,_0x3d2b1a[_0x16c392(0x198)]={'current':void 0x0,'parent':void 0x0,'index':0x0},_0x3d2b1a;};for(var _0x7c60bb=0x0;_0x7c60bb<_0x31f6c4[_0x290454(0x1b6)];_0x7c60bb++)_0x465570['push'](_0x3c89ee[_0x290454(0x245)]({'timeNode':_0x205bfc===_0x290454(0x26a)||void 0x0},_0x31f6c4[_0x7c60bb],_0x5527b0(_0x401ade),{}));if(_0x205bfc===_0x290454(0x255)||_0x205bfc===_0x290454(0x195)){let _0x37f42a=Error[_0x290454(0x188)];try{Error[_0x290454(0x188)]=0x1/0x0,_0x465570[_0x290454(0x26e)](_0x3c89ee[_0x290454(0x245)]({'stackNode':!0x0},new Error()[_0x290454(0x217)],_0x5527b0(_0x401ade),{'strLength':0x1/0x0}));}finally{Error[_0x290454(0x188)]=_0x37f42a;}}return{'method':_0x290454(0x186),'version':_0x24945e,'args':[{'ts':_0x503f06,'session':_0x274aab,'args':_0x465570,'id':_0x18b986,'context':_0x454f1c}]};}catch(_0x4d9d42){return{'method':'log','version':_0x24945e,'args':[{'ts':_0x503f06,'session':_0x274aab,'args':[{'type':'unknown','error':_0x4d9d42&&_0x4d9d42[_0x290454(0x203)]}],'id':_0x18b986,'context':_0x454f1c}]};}finally{try{if(_0x2396c5&&_0x2aa929){let _0x120976=_0xac187d();_0x2396c5[_0x290454(0x1d6)]++,_0x2396c5['time']+=_0x3e3008(_0x2aa929,_0x120976),_0x2396c5['ts']=_0x120976,_0x12e5a6['hits'][_0x290454(0x1d6)]++,_0x12e5a6['hits'][_0x290454(0x26a)]+=_0x3e3008(_0x2aa929,_0x120976),_0x12e5a6[_0x290454(0x257)]['ts']=_0x120976,(_0x2396c5[_0x290454(0x1d6)]>_0x151ea4[_0x290454(0x18d)][_0x290454(0x237)]||_0x2396c5['time']>_0x151ea4[_0x290454(0x18d)]['reduceOnAccumulatedProcessingTimeMs'])&&(_0x2396c5[_0x290454(0x1f1)]=!0x0),(_0x12e5a6[_0x290454(0x257)][_0x290454(0x1d6)]>_0x151ea4[_0x290454(0x1be)][_0x290454(0x237)]||_0x12e5a6[_0x290454(0x257)][_0x290454(0x26a)]>_0x151ea4[_0x290454(0x1be)][_0x290454(0x1e9)])&&(_0x12e5a6['hits'][_0x290454(0x1f1)]=!0x0);}}catch{}}}return _0x4b3a63;}((_0x128c8b,_0x130c59,_0x2d3050,_0xddf41c,_0x441d00,_0x1b84a8,_0x2217b2,_0x5b051f,_0x2b48ca,_0x490710,_0x5ab68a,_0xebfbce)=>{var _0x48efd0=_0x306708;if(_0x128c8b[_0x48efd0(0x1bd)])return _0x128c8b[_0x48efd0(0x1bd)];let _0x2831c5={'consoleLog':()=>{},'consoleTrace':()=>{},'consoleTime':()=>{},'consoleTimeEnd':()=>{},'autoLog':()=>{},'autoLogMany':()=>{},'autoTraceMany':()=>{},'coverage':()=>{},'autoTrace':()=>{},'autoTime':()=>{},'autoTimeEnd':()=>{}};if(!J(_0x128c8b,_0x5b051f,_0x441d00))return _0x128c8b[_0x48efd0(0x1bd)]=_0x2831c5,_0x128c8b[_0x48efd0(0x1bd)];let _0x363e28=B(_0x128c8b),_0x2309ed=_0x363e28['elapsed'],_0x2a1744=_0x363e28['timeStamp'],_0x50681b=_0x363e28[_0x48efd0(0x1fb)],_0x3b9026={'hits':{},'ts':{}},_0x194465=Y(_0x128c8b,_0x2b48ca,_0x3b9026,_0x1b84a8,_0xebfbce),_0x4462b9=(_0x4cfe49,_0x35915b,_0x58ab0e,_0x24999c,_0x16c273,_0x2d2fae)=>{var _0x10dcd2=_0x48efd0;let _0x25b8f1=_0x128c8b[_0x10dcd2(0x1bd)];try{return _0x128c8b['_console_ninja']=_0x2831c5,_0x194465(_0x4cfe49,_0x35915b,_0x58ab0e,_0x24999c,_0x16c273,_0x2d2fae);}finally{_0x128c8b[_0x10dcd2(0x1bd)]=_0x25b8f1;}},_0x45c9b2=_0xa045db=>{_0x3b9026['ts'][_0xa045db]=_0x2a1744();},_0x5dfe65=(_0x18fdeb,_0x1126f8)=>{let _0x42fddb=_0x3b9026['ts'][_0x1126f8];if(delete _0x3b9026['ts'][_0x1126f8],_0x42fddb){let _0x998f88=_0x2309ed(_0x42fddb,_0x2a1744());_0x246d72(_0x4462b9('time',_0x18fdeb,_0x50681b(),_0x26bea9,[_0x998f88],_0x1126f8));}},_0x10aede=_0x195925=>{var _0x5c4181=_0x48efd0,_0x425e04;return _0x441d00===_0x5c4181(0x25a)&&_0x128c8b['origin']&&((_0x425e04=_0x195925==null?void 0x0:_0x195925['args'])==null?void 0x0:_0x425e04[_0x5c4181(0x1b6)])&&(_0x195925[_0x5c4181(0x23b)][0x0]['origin']=_0x128c8b[_0x5c4181(0x1a2)]),_0x195925;};_0x128c8b[_0x48efd0(0x1bd)]={'consoleLog':(_0xda0a9f,_0x9190d7)=>{var _0x257b86=_0x48efd0;_0x128c8b[_0x257b86(0x1ba)][_0x257b86(0x186)][_0x257b86(0x229)]!==_0x257b86(0x21c)&&_0x246d72(_0x4462b9('log',_0xda0a9f,_0x50681b(),_0x26bea9,_0x9190d7));},'consoleTrace':(_0x28e90d,_0x115a45)=>{var _0x3f5b82=_0x48efd0,_0x59297f,_0x582cd0;_0x128c8b['console'][_0x3f5b82(0x186)][_0x3f5b82(0x229)]!==_0x3f5b82(0x22c)&&((_0x582cd0=(_0x59297f=_0x128c8b[_0x3f5b82(0x25e)])==null?void 0x0:_0x59297f[_0x3f5b82(0x263)])!=null&&_0x582cd0['node']&&(_0x128c8b[_0x3f5b82(0x1da)]=!0x0),_0x246d72(_0x10aede(_0x4462b9(_0x3f5b82(0x255),_0x28e90d,_0x50681b(),_0x26bea9,_0x115a45))));},'consoleError':(_0x1719a2,_0x50f700)=>{var _0x18be19=_0x48efd0;_0x128c8b[_0x18be19(0x1da)]=!0x0,_0x246d72(_0x10aede(_0x4462b9(_0x18be19(0x195),_0x1719a2,_0x50681b(),_0x26bea9,_0x50f700)));},'consoleTime':_0x1b91af=>{_0x45c9b2(_0x1b91af);},'consoleTimeEnd':(_0x5e3ece,_0x45fcba)=>{_0x5dfe65(_0x45fcba,_0x5e3ece);},'autoLog':(_0x396285,_0xaf0672)=>{_0x246d72(_0x4462b9('log',_0xaf0672,_0x50681b(),_0x26bea9,[_0x396285]));},'autoLogMany':(_0xa0fc0e,_0x3df880)=>{var _0x52d754=_0x48efd0;_0x246d72(_0x4462b9(_0x52d754(0x186),_0xa0fc0e,_0x50681b(),_0x26bea9,_0x3df880));},'autoTrace':(_0x5928c5,_0x5778f0)=>{var _0x3aca45=_0x48efd0;_0x246d72(_0x10aede(_0x4462b9(_0x3aca45(0x255),_0x5778f0,_0x50681b(),_0x26bea9,[_0x5928c5])));},'autoTraceMany':(_0x214c88,_0x10d946)=>{var _0x369ebf=_0x48efd0;_0x246d72(_0x10aede(_0x4462b9(_0x369ebf(0x255),_0x214c88,_0x50681b(),_0x26bea9,_0x10d946)));},'autoTime':(_0x168d5e,_0x59e4be,_0x3bcf2b)=>{_0x45c9b2(_0x3bcf2b);},'autoTimeEnd':(_0x17c08f,_0x347576,_0x4ac253)=>{_0x5dfe65(_0x347576,_0x4ac253);},'coverage':_0x269f7a=>{var _0x4a27b2=_0x48efd0;_0x246d72({'method':_0x4a27b2(0x1a6),'version':_0x1b84a8,'args':[{'id':_0x269f7a}]});}};let _0x246d72=X(_0x128c8b,_0x130c59,_0x2d3050,_0xddf41c,_0x441d00,_0x490710,_0x5ab68a),_0x26bea9=_0x128c8b[_0x48efd0(0x24d)];return _0x128c8b['_console_ninja'];})(globalThis,_0x306708(0x16b),'60033',\"c:\\\\Users\\\\ZARAGOZA051\\\\.vscode\\\\extensions\\\\wallabyjs.console-ninja-1.0.467\\\\node_modules\",_0x306708(0x1ef),'1.0.0','1756094548226',_0x306708(0x177),'','',_0x306708(0x1a8),_0x306708(0x1bb));");}catch(e){console.error(e);}};/* istanbul ignore next */function oo_oo(/**@type{any}**/i,/**@type{any}**/...v){try{oo_cm().consoleLog(i, v);}catch(e){} return v};/* istanbul ignore next */function oo_tr(/**@type{any}**/i,/**@type{any}**/...v){try{oo_cm().consoleTrace(i, v);}catch(e){} return v};/* istanbul ignore next */function oo_tx(/**@type{any}**/i,/**@type{any}**/...v){try{oo_cm().consoleError(i, v);}catch(e){} return v};/* istanbul ignore next */function oo_ts(/**@type{any}**/v){try{oo_cm().consoleTime(v);}catch(e){} return v;};/* istanbul ignore next */function oo_te(/**@type{any}**/v, /**@type{any}**/i){try{oo_cm().consoleTimeEnd(v, i);}catch(e){} return v;};/*eslint unicorn/no-abusive-eslint-disable:,eslint-comments/disable-enable-pair:,eslint-comments/no-unlimited-disable:,eslint-comments/no-aggregating-enable:,eslint-comments/no-duplicate-disable:,eslint-comments/no-unused-disable:,eslint-comments/no-unused-enable:,*/
// hash: 1454809084