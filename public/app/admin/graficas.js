/* eslint-disable no-undef */
import { hideSpinner, showSpinner } from '../spinner.js'
import { mostrarMensaje } from '../funciones.js'

// Variable global para almacenar el conjunto de datos original sin filtrar
let datosOriginales = []

// Variables globales para los gráficos
let combustibleChart, almacenChart, centroCosteChart, temporadaChart, empresaChart, unidadChart, rendimientoChart

// configuracion para entradas o salidas de combustible, cargas o solicitudes
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
    filtros: ['fechaInicio', 'fechaFin', 'almacen', 'temporada', 'combustible', 'centroCoste', 'empresa'],
    campos: {
      fecha: 'fecha',
      combustible: 'combustible',
      cantidad: 'cantidad',
      almacen: 'almacen',
      centroCoste: 'centro_coste',
      empresa: 'empresa',
      temporada: 'temporada',
      responsable: 'responsable',
      unidad: 'no_economico'
    },
    alertas: {
      consumoAlto: 10000,
      stockBajo: 1000,
      rendimientoBajo: 5
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
    filtros: ['fechaInicio', 'fechaFin', 'almacen', 'combustible', 'centroCoste', 'empresa'],
    campos: {
      fecha: 'fecha',
      combustible: 'combustible',
      cantidad: 'cantidad',
      almacen: 'almacen',
      centroCoste: 'centro_coste',
      empresa: 'empresa',
      proveedor: 'proveedor',
      factura: 'factura'
    },
    alertas: {
      consumoAlto: 10000,
      stockBajo: 1000
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
      combustible: 'combustible',
      cantidad: 'cantidad',
      centroCoste: 'centro_coste',
      empresa: 'empresa',
      unidad: 'no_economico',
      rendimiento: 'rendimineto', // Mantener el typo hasta que se corrija en BD
      kmRecorridos: 'km_recorridos',
      precio: 'precio',
      responsable: 'responsable'
    },
    alertas: {
      consumoAlto: 10000,
      rendimientoBajo: 5,
      gastoAlto: 50000
    }
  },

  solicitudes: {
    titulos: {
      pageTitle: 'Dashboard - Solicitudes de Mezcla',
      totalRegistros: 'Total Solicitudes',
      totalCantidadPresentacion: 'Total Cantidad Por Presentación',
      promedioRegistros: 'Promedio por Solicitud',
      almacenesActivos: 'Ranchos Activos'
    },
    graficas: {
      metodo: 'Solicitudes por Método de Aplicación',
      producto: 'Top Productos Solicitados',
      timeline: 'Análisis Temporal de Solicitudes',
      centroCoste: 'Solicitudes por Centro de Coste',
      temporada: 'Solicitudes por Temporada'
    },
    filtros: [
      'fechaInicio', 'fechaFin', 'rancho', 'centroCoste', 'empresa',
      'metodoAplicacion', 'presentacion', 'temporada', 'producto',
      'tipo', 'usuario'
    ],
    campos: {
      fecha: 'fechaSolicitud',
      fechaEntrega: 'fechaEntrega',
      cantidadNormalizada: 'cantidad_normalizada',
      rancho: 'ranchoDestino',
      centroCoste: 'centroCoste',
      empresa: 'empresa',
      metodoAplicacion: 'metodoAplicacion',
      presentacion: 'presentacion',
      temporada: 'temporada',
      producto: 'nombre_producto',
      tipo: 'tipo_mezcla',
      usuario: 'nombre',
      cantidad: 'cantidad',
      cantidadSolicitada: 'cantidad_solicitada',
      status: 'status',
      variedad: 'variedad'
    },
    // Identificador único compuesto para manejar duplicados correctamente
    uniqueKey: ['id', 'id_sap'], // Combinación de ID solicitud + ID producto
    alertas: {
      tiempoEntregaAlto: 7, // días
      eficienciaBaja: 80 // porcentaje
    }
  }
}

// Colores predefinidos para las gráficas
const chartColors = {
  primary: ['#4CAF50', '#2196F3', '#FF9800', '#9C27B0', '#F44336', '#00BCD4', '#795548', '#607D8B'],
  secondary: ['#81C784', '#64B5F6', '#FFB74D', '#BA68C8', '#E57373', '#4DD0E1', '#A1887F', '#90A4AE']
}

// Función debounce para optimizar filtros
const debounce = (func, wait) => {
  let timeout
  return function executedFunction (...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Sistema de cache para datos procesados
const cache = new Map()
const getCachedData = (key, processor, data) => {
  if (!cache.has(key)) {
    cache.set(key, processor(data))
  }
  return cache.get(key)
}

// Función para limpiar cache cuando cambien los datos
const limpiarCache = () => {
  cache.clear()
  console.log('Cache limpiado')
}

// Función para generar colores consistentes
const getColor = (index) => {
  return chartColors.primary[index % chartColors.primary.length]
}

// Función auxiliar para obtener la clase de color según el status
const getStatusColor = (status) => {
  const colores = {
    Proceso: 'text-warning',
    Completada: 'text-success',
    Pendiente: 'text-info',
    Cancelada: 'text-danger',
    'Sin especificar': 'text-muted'
  }
  return colores[status] || 'text-muted'
}
// Función para obtener la configuración según el tipo
const getConfig = (tipo) => CONFIGURACION[tipo] || CONFIGURACION.salidas

// Función para limpiar strings (eliminar espacios y tabulaciones)
const limpiarString = (texto) => {
  if (!texto) return 'Sin especificar'
  return texto.toString().trim().replace(/\t/g, '').replace(/\s+/g, ' ')
}

// Función para validar datos antes de procesarlos
const validarDatos = (datos) => {
  if (!Array.isArray(datos)) {
    console.error('Los datos no son un array válido')
    return []
  }

  const datosValidos = datos.filter(item => {
    // Validar que tenga al menos los campos mínimos requeridos
    return item && (item.fecha || item.combustible || item.cantidad)
  })

  console.log(`Datos validados: ${datosValidos.length}/${datos.length} registros válidos`)
  return datosValidos
}

// Función para formatear números
const formatearNumero = (numero) => {
  if (isNaN(numero)) return '0'
  return new Intl.NumberFormat('es-MX').format(numero)
}

// 🚀 APLICAR CACHE A PROCESAMIENTO DE DATOS - Modificar funciones existentes
const procesarDatosConCache = (datos, tipo, procesador) => {
  const cacheKey = `${tipo}_${JSON.stringify(datos).slice(0, 100)}` // Hash simple
  return getCachedData(cacheKey, procesador, datos)
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
  if (tipoDatos === 'cargas' || tipoDatos === 'salidas' || tipoDatos === 'entradas') {
    const combustibleTitle = document.querySelector('#combustibleChart').closest('.card').querySelector('.card-title')
    if (combustibleTitle) {
      combustibleTitle.textContent = config.graficas.combustible
    }
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

  if (tipoDatos === 'salidas' || tipoDatos === 'solicitudes') {
    const temporadaTitle = document.querySelector('#temporadaChart').closest('.card').querySelector('.card-title')
    if (temporadaTitle) {
      temporadaTitle.textContent = config.graficas.temporada
    }
  }
}

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
      centroCoste: new Set(),
      empresa: new Set()
    }

    // Si es salidas, agregar temporada
    if (tipoDatos === 'salidas' || tipoDatos === 'entradas') {
      conjuntos.almacen = new Set()
    }
    if (tipoDatos === 'salidas' || tipoDatos === 'solicitudes') {
      conjuntos.temporada = new Set()
    }
    if (tipoDatos === 'salidas' || tipoDatos === 'entradas' || tipoDatos === 'cargas') {
      conjuntos.combustible = new Set()
    }
    if (tipoDatos === 'solicitudes') {
      conjuntos.tipo = new Set()
      conjuntos.presentacion = new Set()
      conjuntos.metodoAplicacion = new Set()
      conjuntos.ranchos = new Set()
      conjuntos.producto = new Set()
      conjuntos.usuario = new Set()
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
      console.log(`Poblando ${selectId} con valores:`, [...valores])
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

// Función para eliminar duplicados basados en un campo único (ej. id)
const eliminarDuplicados = (datos) => {
  const uniqueData = Array.from(
    new Map(datos.map(item => [item.id, item])).values()
  )
  return uniqueData
}
// Función para aplicar los filtros seleccionados al conjunto de datos
const aplicarFiltros = () => {
  const tipoDatos = window.dashboardTipo

  // Mostrar loading
  showSpinner()

  try {
    // 1. Obtenemos los valores actuales de cada filtro
    const fechaInicio = document.getElementById('filtroFechaInicio').value
    const fechaFin = document.getElementById('filtroFechaFin').value
    const rancho = ['entradas', 'salidas', 'solicitudes'].includes(tipoDatos) ? document.getElementById('filtroRancho').value : ''
    const temporada = tipoDatos === 'salidas' ? document.getElementById('filtroTemporada').value : ''
    const combustible = document.getElementById('filtroCombustible').value
    const empresa = document.getElementById('filtroEmpresa').value
    const centroCoste = document.getElementById('filtroCentroCoste').value
    // IMPORTANTE: Ajusta 'fecha_salida' al nombre real del campo de fecha en tus datos.
    const campoFecha = 'fecha'

    // 2. Usamos .filter() sobre los datos originales
    const datosFiltrados = datosOriginales.filter(item => {
      // Filtro por Fecha
      const fechaItem = item[campoFecha] ? new Date(item[campoFecha] + 'T00:00:00') : null
      if (fechaInicio && (!fechaItem || fechaItem < new Date(fechaInicio + 'T00:00:00'))) return false
      if (fechaFin && (!fechaItem || fechaItem > new Date(fechaFin + 'T00:00:00'))) return false

      // Filtro por Rancho (si hay un valor seleccionado)
      if (['salidas', 'entradas', 'solicitudes'].includes(tipoDatos) && rancho && limpiarString(item.almacen || '') !== rancho) return false

      // Filtro por Temporada solo para salidas
      if (tipoDatos === 'salidas' && temporada && limpiarString(item.temporada || '') !== temporada) return false

      // Filtro por Combustible
      const tipoCombustible = limpiarString(item.combustible || '')
      if (combustible && tipoCombustible !== combustible) return false

      // Filtro por Empresa
      if (empresa && limpiarString(item.empresa || '') !== empresa) return false

      // Filtro por Centro de Coste
      if (centroCoste && limpiarString(item.centro_coste || '') !== centroCoste) return false

      // Si el item pasó todos los filtros, lo incluimos
      return true
    })
    // VERIFICAR ALERTAS
    verificarAlertas(datosFiltrados)

    // Limpiar cache cuando se aplican filtros
    limpiarCache()

    return datosFiltrados
  } catch (error) {
    console.error('Error al aplicar filtros:', error)
    mostrarMensaje('Error al aplicar filtros. Por favor, inténtalo de nuevo.', 'danger')
    return datosOriginales
  }
}

// 🚀 SISTEMA DE ALERTAS AUTOMÁTICAS
const verificarAlertas = (datos) => {
  const config = getConfig(window.dashboardTipo)
  if (!config.alertas) return

  // Verificar consumo alto
  const consumoTotal = datos.reduce((acc, item) => {
    return acc + (parseFloat(item.cantidad || item.existencia || 0))
  }, 0)

  if (consumoTotal > config.alertas.consumoAlto) {
    mostrarMensaje(`⚠️ Consumo alto detectado: ${formatearNumero(consumoTotal.toFixed(2))} L`, 'warning')
  }

  // Verificar rendimiento bajo (solo para cargas)
  if (window.dashboardTipo === 'cargas') {
    const rendimientoPromedio = datos.reduce((acc, item) => {
      return acc + (parseFloat(item.rendimineto || 0))
    }, 0) / datos.length

    if (rendimientoPromedio < config.alertas.rendimientoBajo) {
      mostrarMensaje(`⚠️ Rendimiento bajo detectado: ${rendimientoPromedio.toFixed(2)} km/L`,
        'warning')
    }
  }
}

// funcion para destruir graficas
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

  // Actualizar tabla de detalles
  // actualizarTablaDetalles(datos, config)

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
    case 'solicitudes':
      crearGraficaMetodo(datos)
      crearGraficaProductos(datos)
      crearGraficaTimeline(datos)
  }
}

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
  // variables globales funcion
  let almacenesUnicos = 0
  const totalesCombustible = {}
  let totalCombustibleGeneral = 0
  let totalPrecio, promedioRegistros
  let totalRegistros
  let dataSinDuplicados = []
  // Calcular totales y promedios
  if (tipoDatos === 'solicitudes') {
    dataSinDuplicados = eliminarDuplicados(datos)
    totalRegistros = dataSinDuplicados.length
  } else {
    totalRegistros = datos.length
  }
  if (tipoDatos === 'salidas' || tipoDatos === 'entradas') {
    almacenesUnicos = new Set(datos.map(item => limpiarString(item.almacen || item.ubicacion)).filter(almacen => almacen !== 'Sin especificar')).size
  }

  if (tipoDatos === 'cargas') {
    almacenesUnicos = new Set(datos.map(item => limpiarString(item.no_economico || item.unidad)).filter(unidad => unidad !== 'Sin especificar')).size
  }
  // Objeto para almacenar los totales por tipo de combustible
  if (tipoDatos === 'cargas' || tipoDatos === 'salidas' || tipoDatos === 'entradas') {
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

    // Calcular promedio de registros
    if (tipoDatos === 'cargas' || tipoDatos === 'salidas' || tipoDatos === 'entradas') {
      promedioRegistros = totalRegistros > 0 ? totalCombustibleGeneral / totalRegistros : 0
    }
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
  if (tipoDatos === 'cargas') {
    // Calcular Total de precio
    totalPrecio = datos.reduce((acc, item) => {
      const precio = parseFloat(item.precio) || 0
      return acc + (precio)
    }, 0)
    document.getElementById('gastoTotales').textContent = formatearNumero(totalPrecio)
  }

  if (tipoDatos === 'solicitudes') {
    // calcular cantidad por presentacion
    const cantidadPorPresentacion = dataSinDuplicados.reduce((acc, item) => {
      const presentacion = limpiarString(item.presentacion)
      const cantidad = parseFloat(item.cantidad_normalizada) || 0
      if (presentacion) {
        if (!acc[presentacion]) {
          acc[presentacion] = 0
        }
        acc[presentacion] += cantidad
      }
      return acc
    }, {})
    // Dentro de actualizarEstadisticas, después de calcular cantidadPorPresentacion
    const presentacionesFiltradas = Object.entries(cantidadPorPresentacion)
      .filter(([presentacion, cantidad]) =>
        presentacion !== 'Sin especificar' && presentacion !== 'No aplica' && cantidad > 0
      )
      .sort((a, b) => b[1] - a[1]) // Opcional: ordenar por cantidad

    const contenedorPresentacion = document.getElementById('presentacionTotales')
    contenedorPresentacion.innerHTML = '' // Limpiar contenido previo

    presentacionesFiltradas.forEach(([presentacion, cantidad]) => {
      const elemento = document.createElement('div')
      elemento.className = 'mb-2'
      elemento.innerHTML = `
    <h4 class="mb-0">${formatearNumero(cantidad.toFixed(2))}</h4>
    <p class="text-muted font-weight-normal small text-capitalize">${presentacion.toLowerCase()}</p>
  `
      contenedorPresentacion.appendChild(elemento)
    })

    // Calcular totales por tipo
    const totalesPorTipo = dataSinDuplicados.reduce((acc, item) => {
      const tipo = item.tipo_mezcla || 'Sin especificar'
      acc[tipo] = (acc[tipo] || 0) + 1
      return acc
    }, {})

    // Actualizar el total general
    const totalElement = document.getElementById('totalSalidas')
    totalElement.innerHTML = `
        <h3 class="mb-0">${formatearNumero(totalRegistros)}</h3>
    `

    // Actualizar los totales por tipo
    const tipoElement = document.getElementById('totalPorTipo')
    if (tipoElement) {
      tipoElement.innerHTML = Object.entries(totalesPorTipo)
        .sort((a, b) => b[1] - a[1]) // Ordenar por cantidad
        .map(([tipo, cantidad]) => `
                <div class="text-muted">
                    <span class="text-capitalize">${tipo.toLowerCase()}</span>: 
                    <span class="font-weight-bold">${formatearNumero(cantidad)}</span>
                </div>
            `).join('')
    }
  }

  // En la función actualizarEstadisticas
  if (tipoDatos === 'solicitudes') {
    // Calcular totales por tipo
    const totalesPorTipo = dataSinDuplicados.reduce((acc, item) => {
      const tipo = item.tipo_mezcla || 'Sin especificar'
      acc[tipo] = (acc[tipo] || 0) + 1
      return acc
    }, {})

    // Actualizar el total general
    const totalElement = document.getElementById('totalSalidas')
    if (totalElement) {
      totalElement.innerHTML = `
            <h4 class="mb-0">${formatearNumero(dataSinDuplicados.length)}</h4>
            <p class="text-muted mb-0">Total General</p>
        `
    }

    // Actualizar los totales por tipo
    const tipoElement = document.getElementById('totalPorTipo')
    if (tipoElement) {
      tipoElement.innerHTML = Object.entries(totalesPorTipo)
        .sort((a, b) => b[1] - a[1])
        .map(([tipo, cantidad]) => `
                <div class="mb-2">
                    <h4 class="mb-0">${formatearNumero(cantidad)}</h4>
                    <p class="text-muted font-weight-normal small">${tipo}</p>
                </div>
            `).join('')
    }

    // Calcular cantidad por presentación (código existente)
    const cantidadPorPresentacion = dataSinDuplicados.reduce((acc, item) => {
      const presentacion = limpiarString(item.presentacion)
      const cantidad = parseFloat(item.cantidad_normalizada) || 0
      if (presentacion) {
        acc[presentacion] = (acc[presentacion] || 0) + cantidad
      }
      return acc
    }, {})

    // Actualizar presentaciones
    const presentacionElement = document.getElementById('presentacionTotales')
    if (presentacionElement) {
      const presentacionesFiltradas = Object.entries(cantidadPorPresentacion)
        .filter(([pres, cant]) =>
          pres !== 'Sin especificar' &&
                    pres !== 'No aplica' &&
                    cant > 0)
        .sort((a, b) => b[1] - a[1])

      presentacionElement.innerHTML = presentacionesFiltradas
        .map(([presentacion, cantidad]) => `
                    <div class="mb-2">
                        <h4 class="mb-0">${formatearNumero(cantidad.toFixed(2))}</h4>
                        <p class="text-muted font-weight-normal small">${presentacion}</p>
                    </div>
                `).join('')
    }

    // Calcular totales por status
    const statusPorTipo = dataSinDuplicados.reduce((acc, item) => {
      const status = item.status || 'Sin especificar'
      acc[status] = (acc[status] || 0) + 1
      return acc
    }, {})

    // Actualizar el contenedor de status
    const statusElement = document.getElementById('statusTotales')
    if (statusElement) {
      const ordenStatus = ['Proceso', 'Completada', 'Pendiente', 'Cancelada']
      statusElement.innerHTML = Object.entries(statusPorTipo)
        .sort((a, b) => {
          const indexA = ordenStatus.indexOf(a[0])
          const indexB = ordenStatus.indexOf(b[0])
          return indexA - indexB
        })
        .map(([status, cantidad]) => `
                    <div class="mb-2">
                        <h4 class="mb-0 ${getStatusColor(status)}">${formatearNumero(cantidad)}</h4>
                        <p class="text-muted font-weight-normal small">${status}</p>
                    </div>
                `).join('')
    }
    const stats = calcularEstadisticasTiempo(datos)
    const eficiencia = calcularEficiencia(datos)

    // Actualizar estadísticas de tiempo
    document.getElementById('tiempoEntregaTotales').innerHTML = `
            <h4 class="mb-0">${stats.promedioDias} días</h4>
            <p class="text-muted mb-0">Promedio General</p>
            ${stats.porTipo.map(t => `
                <div class="mt-2">
                    <small class="text-muted">${t.tipo}: ${t.promedio} días</small>
                </div>
            `).join('')}
        `

    // Actualizar eficiencia
    const porcentajeEficiencia = (eficiencia.totalEntregado / eficiencia.totalSolicitado * 100).toFixed(1)
    document.getElementById('eficienciaTotales').innerHTML = `
            <h4 class="mb-0">${porcentajeEficiencia}%</h4>
            <p class="text-muted mb-0">Eficiencia Global</p>
            <div class="mt-2">
                <small class="text-muted">
                    ${formatearNumero(eficiencia.totalEntregado)} / 
                    ${formatearNumero(eficiencia.totalSolicitado)}
                </small>
            </div>
        `
  }
}

// Función para calcular estadísticas de tiempo
const calcularEstadisticasTiempo = (datos) => {
  const dataSinDuplicados = eliminarDuplicados(datos)

  const tiempos = dataSinDuplicados.reduce((acc, item) => {
    if (item.fechaEntrega && item.fechaSolicitud) {
      const entrega = new Date(item.fechaEntrega)
      const solicitud = new Date(item.fechaSolicitud)
      const dias = Math.floor((entrega - solicitud) / (1000 * 60 * 60 * 24))

      acc.totalDias += dias
      acc.count++
      acc.porTipo[item.tipo_mezcla] = acc.porTipo[item.tipo_mezcla] ||
                { total: 0, count: 0 }
      acc.porTipo[item.tipo_mezcla].total += dias
      acc.porTipo[item.tipo_mezcla].count++
    }
    return acc
  }, { totalDias: 0, count: 0, porTipo: {} })

  return {
    promedioDias: tiempos.count > 0
      ? (tiempos.totalDias / tiempos.count).toFixed(1)
      : 0,
    porTipo: Object.entries(tiempos.porTipo).map(([tipo, data]) => ({
      tipo,
      promedio: (data.total / data.count).toFixed(1)
    }))
  }
}

// Función para calcular eficiencia
const calcularEficiencia = (datos) => {
  const dataSinDuplicados = eliminarDuplicados(datos)

  return dataSinDuplicados.reduce((acc, item) => {
    const solicitado = parseFloat(item.cantidad_solicitada) || 0
    const entregado = parseFloat(item.cantidad) || 0

    if (solicitado > 0) {
      acc.totalSolicitado += solicitado
      acc.totalEntregado += entregado
      acc.count++
    }
    return acc
  }, { totalSolicitado: 0, totalEntregado: 0, count: 0 })
}

// Función para crear gráfica de método de aplicación
const crearGraficaMetodo = (datos) => {
  const ctx = document.getElementById('metodoChart')
  if (!ctx) return

  const porMetodo = datos.reduce((acc, item) => {
    const metodo = item.metodoAplicacion || 'Sin especificar'
    acc[metodo] = (acc[metodo] || 0) + parseFloat(item.cantidad || 0)
    return acc
  }, {})

  console.log(porMetodo)
  // Crear gráfica
  // Destruir gráfico existente si existe
  if (unidadChart) {
    unidadChart.destroy()
  }

  unidadChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: Object.keys(porMetodo),
      datasets: [{
        data: Object.values(porMetodo),
        backgroundColor: getColor(Object.keys(porMetodo).length)
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false }
      }
    }
  })
}

// Función para crear gráfica de productos
const crearGraficaProductos = (datos) => {
  const ctx = document.getElementById('productoChart')
  if (!ctx) return

  const porProducto = datos.reduce((acc, item) => {
    const producto = item.nombre_producto
    acc[producto] = (acc[producto] || 0) + parseFloat(item.cantidad || 0)
    return acc
  }, {})

  // Ordenar y tomar top 10
  const top10 = Object.entries(porProducto)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)

  // Destruir gráfico existente si existe
  if (unidadChart) {
    unidadChart.destroy()
  }

  unidadChart = new Chart(ctx, {
    type: 'bar', // Cambiado de 'horizontalBar' a 'bar'
    data: {
      labels: top10.map(([nombre]) => nombre),
      datasets: [{
        data: top10.map(([, cantidad]) => cantidad),
        backgroundColor: getColor(10)
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: 'y', // Esto hace que la barra sea horizontal
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              return `${context.label}: ${formatearNumero(context.raw)}`
            }
          }
        }
      },
      scales: {
        x: {
          beginAtZero: true,
          ticks: {
            callback: function (value) {
              return formatearNumero(value)
            }
          }
        }
      }
    }
  })
}
// Función para crear timeline
const crearGraficaTimeline = (datos) => {
  const ctx = document.getElementById('timelineChart')
  if (!ctx) return

  // Destruir gráfico existente si existe
  if (unidadChart) {
    unidadChart.destroy()
  }

  const sinDuplicados = eliminarDuplicados(datos)

  // Procesar datos para agrupar por fecha
  const porFecha = sinDuplicados.reduce((acc, item) => {
    const fecha = item.fechaSolicitud.split('T')[0]
    if (!acc[fecha]) {
      acc[fecha] = 0
    }
    acc[fecha] += parseFloat(item.cantidad || 0)
    return acc
  }, {})

  // Convertir a array de objetos para mejor manejo de fechas
  const datosOrdenados = Object.entries(porFecha)
    .map(([fecha, cantidad]) => ({
      x: new Date(fecha),
      y: cantidad
    }))
    .sort((a, b) => a.x - b.x)

  unidadChart = new Chart(ctx, {
    type: 'line',
    data: {
      datasets: [{
        label: 'Cantidad Solicitada',
        data: datosOrdenados,
        borderColor: '#4CAF50',
        tension: 0.1,
        fill: false
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        tooltip: {
          callbacks: {
            label: (context) => `Cantidad: ${formatearNumero(context.parsed.y)}`
          }
        }
      },
      scales: {
        x: {
          type: 'time',
          time: {
            unit: 'day',
            displayFormats: {
              day: 'dd/MM/yyyy'
            }
          },
          ticks: {
            callback: function (value) {
              const date = new Date(value)
              return date.toLocaleDateString('es-MX', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
              })
            }
          }
        },
        y: {
          beginAtZero: true,
          ticks: {
            callback: value => formatearNumero(value)
          }
        }
      }
    }
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

// Función para actualizar el dashboard
const configurarEventListenersFiltros = () => {
  const tipoDatos = window.dashboardTipo
  const idsFiltros = [
    'filtroFechaInicio',
    'filtroFechaFin',
    'filtroEmpresa',
    'filtroCentroCoste'
  ]
  // Agregar temporada y rancho solo si es salidas
  if (tipoDatos === 'salidas') {
    idsFiltros.push('filtroRancho')
    idsFiltros.push('filtroTemporada')
    idsFiltros.push('filtroCombustible')
  }
  // Agregar rancho solo si es entradas 'filtroCombustible',
  if (tipoDatos === 'entradas') {
    idsFiltros.push('filtroRancho')
    idsFiltros.push('filtroCombustible')
  }

  // Agregar rancho solo si es solicitudes
  if (tipoDatos === 'solicitudes') {
    idsFiltros.push('filtroRancho')
  }

  // 🚀 Aplicar debounce a los event listeners
  const actualizarConDebounce = debounce(() => {
    const datosFiltrados = aplicarFiltros()
    actualizarVistas(datosFiltrados)
  }, 300) // 300ms de delay

  idsFiltros.forEach(id => {
    const elemento = document.getElementById(id)
    if (elemento) {
      elemento.addEventListener('change', actualizarConDebounce)
    }
  })

  // Botón para resetear todos los filtros
  const btnReset = document.getElementById('btnResetFiltros')
  if (btnReset) {
    btnReset.addEventListener('click', () => {
      idsFiltros.forEach(id => {
        const elemento = document.getElementById(id)
        if (elemento) elemento.value = ''
      })
      limpiarCache() // Limpiar cache al resetear
      actualizarVistas(datosOriginales)
      mostrarMensaje('Filtros restablecidos', 'success')
    })
  }
}

// 🚀 MEJORA 12: EXPORTACIÓN DE DATOS - Nueva funcionalidad
const exportarDatos = (datos, formato = 'csv', nombre = 'dashboard_data') => {
  try {
    let contenido, tipo, extension

    switch (formato) {
      case 'csv':
        contenido = convertirACSV(datos)
        tipo = 'text/csv'
        extension = 'csv'
        break
      case 'json':
        contenido = JSON.stringify(datos, null, 2)
        tipo = 'application/json'
        extension = 'json'
        break
      default:
        throw new Error('Formato no soportado')
    }

    const blob = new Blob([contenido], { type: tipo })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${nombre}_${new Date().toISOString().split('T')[0]}.${extension}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    mostrarNotificacion(`Datos exportados como ${formato.toUpperCase()}`, 'success')
  } catch (error) {
    console.error('Error al exportar:', error)
    mostrarNotificacion('Error al exportar datos', 'danger')
  }
}

const convertirACSV = (datos) => {
  if (!datos.length) return ''

  const headers = Object.keys(datos[0])
  const csv = [
    headers.join(','),
    ...datos.map(row =>
      headers.map(field => {
        const value = row[field]
        return typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value
      }).join(',')
    )
  ].join('\n')

  return csv
}

// Función principal para inicializar el dashboard
const inicializarDashboard = async () => {
  try {
    console.log('Inicializando dashboard...')

    // Mostrar loading
    showSpinner()

    // Validar y guardar datos
    const datosRaw = window.dashboardData || []
    datosOriginales = validarDatos(datosRaw)

    console.log('Datos validados:', datosOriginales)
    const tipoDatos = window.dashboardTipo
    const config = getConfig(tipoDatos)

    // Actualizar títulos según configuración
    actualizarTitulosDashboard(config)

    // console.log('Datos obtenidos:', datosOriginales)

    if (datosOriginales.length === 0) {
      console.warn('No se encontraron datos para mostrar')
      mostrarMensaje('No se encontraron datos para mostrar', 'warning')
      return
    }

    // 1. Llenar los filtros con las opciones disponibles
    poblarFiltros(datosOriginales, config)

    // 2. Mostrar el estado inicial del dashboard con todos los datos
    actualizarVistas(datosOriginales, config)

    // 3. Configurar los eventos para que los filtros funcionen
    configurarEventListenersFiltros(config)

    // 4. Configurar botones de exportación si existen
    configurarExportacion()

    console.log('Dashboard inicializado correctamente')

    mostrarMensaje('Dashboard cargado correctamente', 'success', 3000)
    // Ocultar loading
    hideSpinner()
  } catch (error) {
    console.error('Error al inicializar dashboard:', error)
    mostrarMensaje('Error al cargar el dashboard. Por favor, inténtalo de nuevo más tarde.', 'error')
    // Ocultar loading
    hideSpinner()
  }
}

const configurarExportacion = () => {
  // Botón exportar CSV
  const btnExportarCSV = document.getElementById('btnExportarCSV')
  if (btnExportarCSV) {
    btnExportarCSV.addEventListener('click', () => {
      const datosFiltrados = aplicarFiltros()
      exportarDatos(datosFiltrados, 'csv', `${window.dashboardTipo}_dashboard`)
    })
  }

  // Botón exportar JSON
  const btnExportarJSON = document.getElementById('btnExportarJSON')
  if (btnExportarJSON) {
    btnExportarJSON.addEventListener('click', () => {
      const datosFiltrados = aplicarFiltros()
      exportarDatos(datosFiltrados, 'json', `${window.dashboardTipo}_dashboard`)
    })
  }
}

export const actualizarDashboard = async () => {
  await inicializarDashboard()
}

// Exportar función para uso externo
export { inicializarDashboard, exportarDatos }
// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', inicializarDashboard)
} else {
  inicializarDashboard()
}
