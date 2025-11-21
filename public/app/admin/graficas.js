/* eslint-disable no-undef */
import { hideSpinner, showSpinner } from '../spinner.js'
import { mostrarMensaje } from '../funciones.js'

// Variable global para almacenar el conjunto de datos original sin filtrar
let datosOriginales = []

// Variables globales para los gráficos
let combustibleChart, almacenChart, centroCosteChart, temporadaChart, empresaChart, unidadChart, rendimientoChart

// ✅ Patrón reutilizable para crear gráficas
const crearGrafica = (canvasId, tipo, datos, opciones = {}) => {
  const canvas = document.getElementById(canvasId)
  if (!canvas) {
    console.warn(`Canvas ${canvasId} no encontrado`)
    return null
  }

  // Destruir gráfica anterior si existe
  if (window[`${canvasId}_instance`]) {
    window[`${canvasId}_instance`].destroy()
  }

  // Crear nueva gráfica
  window[`${canvasId}_instance`] = new Chart(canvas, {
    type: tipo,
    data: datos,
    options: { responsive: true, maintainAspectRatio: true, ...opciones }
  })

  return window[`${canvasId}_instance`]
}

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
      rendimiento: 'rendimiento', // ✅ CORREGIDO: typo rendimineto → rendimiento
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
      'tipo', 'usuario', 'status'
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
  },

  activos: {
    titulos: {
      pageTitle: 'Dashboard - Activos Fijos',
      totalRegistros: 'Total Activos',
      departamentosActivos: 'Departamentos'
    },
    graficas: {
      empresa: 'Activos por Empresa',
      ubicacion: 'Activos por Ubicación/Rancho',
      estado: 'Activos por Estado',
      tipoEquipo: 'Activos por Tipo de Equipo'
    },
    filtros: ['fechaInicio', 'fechaFin', 'centroCoste', 'empresa', 'estado', 'tipoEquipo', 'ubicacion'],
    campos: {
      equipo: 'equipo',
      empresa: 'empresa_pertenece',
      centroCoste: 'centro_coste',
      estado: 'status',
      departamento: 'departamento',
      ubicacion: 'ubicacion'
    }
  }
}
// Colores predefinidos para las gráficas
const chartColors = {
  primary: ['#4CAF50', '#2196F3', '#FF9800', '#9C27B0', '#F44336', '#00BCD4', '#795548', '#607D8B'],
  secondary: ['#81C784', '#64B5F6', '#FFB74D', '#BA68C8', '#E57373', '#4DD0E1', '#A1887F', '#90A4AE']
}
// Campos comunes para el valor a sumar
const camposDeValor = ['cantidad_normalizada', 'cantidad', 'existencia', 'volumen']

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
// const getCachedData = (key, processor, data) => {
//   if (!cache.has(key)) {
//     cache.set(key, processor(data))
//   }
//   return cache.get(key)
// }

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
  // Esta función parece específica para 'solicitudes', se puede eliminar si no se usa en otros lados.
  return ''
}
// Función para obtener la configuración según el tipo
const getConfig = (tipo) => CONFIGURACION[tipo] || CONFIGURACION.salidas

// Función para limpiar strings (eliminar espacios y tabulaciones)
const limpiarString = (texto) => {
  if (texto == null) return 'sin especificar' // ✅ CORREGIDO: Minúscula consistente
  return String(texto)
    .toLowerCase() // ✅ Aplicar primero para garantizar consistencia
    .trim()
    .replace(/[\t\n\r]/g, ' ') // Reemplazar tabs y enters con espacios
    .replace(/\s+/g, ' ') // Consolidar espacios múltiples a uno
    .replace(/[^\w\s-áéíóúñüáéíóúñü]/g, '') // Eliminar caracteres especiales (mantener guiones, números, letras)
    .trim() // Trim final para eliminar espacios al inicio/final después de regex
}

// Función para validar datos antes de procesarlos
const prepararYValidarDatos = (datos, tipo) => {
  if (!Array.isArray(datos)) {
    console.error('Los datos no son un array válido')
    return []
  }
  console.log('🔍 prepararYValidarDatos: Procesando', datos)

  const config = getConfig(tipo)

  // Helper para parsear fechas de forma robusta
  const parsearFecha = (fechaStr) => {
    if (!fechaStr || fechaStr === '0000-00-00' || fechaStr === '') return null

    // Intenta formato DD/MM/YYYY
    const partes = String(fechaStr).match(/^(\d{2})\/(\d{2})\/(\d{4})/)
    if (partes) {
      // Formato DD/MM/YYYY -> YYYY-MM-DD para que `new Date` sea consistente
      return new Date(`${partes[3]}-${partes[2]}-${partes[1]}T00:00:00Z`)
    }

    // Para formatos YYYY-MM-DD y otros compatibles con new Date
    const fecha = new Date(fechaStr)
    // Si la fecha es válida, la retornamos. Si no, null.
    return !isNaN(fecha.getTime()) ? fecha : null
  }

  // Helper para encontrar un campo de cantidad válido
  const obtenerCantidad = (item) => {
    // Buscar en el orden de preferencia de campos de cantidad
    for (const campo of camposDeValor) {
      if (item[campo] !== undefined && item[campo] !== null && item[campo] !== '') {
        const valor = parseFloat(item[campo])
        if (!isNaN(valor) && valor > 0) {
          return valor
        }
      }
    }
    return null
  }

  const datosNormalizados = datos.map(item => {
    const itemNormalizado = { ...item }
    // 1. Normaliza la fecha a un objeto Date o null
    const fechaParsada = parsearFecha(item[config.campos.fecha])

    // Normalizar campos de texto
    itemNormalizado.centroCosteNormalizado = limpiarString(item.centroCoste || item.centro_coste || item.centro_costos || 'sin especificar')
    itemNormalizado.empresaNormalizada = limpiarString(item.empresa || item.empresa_pertenece || 'sin especificar')

    // 2. Obtener cantidad válida de cualquier campo disponible
    if (tipo !== 'activos') itemNormalizado.cantidadValida = obtenerCantidad(item)
    // 3. Normalizar campos para filtros - TODOS los campos de filtro se normalizan aquí
    if (tipo !== 'activos') itemNormalizado.fechaNormalizada = fechaParsada || new Date() // Usar fecha actual como fallback si no hay fecha válida
    if (tipo === 'solicitudes' || tipo === 'activos' || tipo === 'entradas' || tipo === 'salidas')itemNormalizado.ubicacionNormalizada = limpiarString(item.ranchoDestino || item.almacen || item.ubicacion || item.rancho || 'sin especificar')
    if (tipo === 'salidas' || tipo === 'solicitudes')itemNormalizado.temporadaNormalizada = limpiarString(item.temporada || 'sin especificar')
    if (tipo === 'cargas' || tipo === 'entradas' || tipo === 'salidas')itemNormalizado.combustibleNormalizado = limpiarString(item.combustible || 'sin especificar')
    if (tipo === 'solicitudes' || tipo === 'activos')itemNormalizado.statusNormalizado = limpiarString(item.status || 'sin especificar')
    if (tipo === 'activos') itemNormalizado.equipoNormalizado = limpiarString(item.equipo || 'sin especificar')
    if (tipo === 'activos') itemNormalizado.departamentoNormalizado = limpiarString(item.departamento || 'sin especificar')
    return itemNormalizado
  })
  console.log('🔍 prepararYValidarDatos: Datos normalizados', datosNormalizados)

  // Para poblar filtros, incluir TODOS los registros normalizados (incluso sin cantidad)
  // Para gráficas/análisis, filtrar solo los que tienen cantidad válida
  const datosFiltradosPorCantidad = datosNormalizados.filter(item => {
    const tieneCantidad = item.cantidadValida !== null && item.cantidadValida !== undefined
    return tieneCantidad
  })

  if (datosFiltradosPorCantidad.length === 0 && datosNormalizados.length > 0) {
    console.warn('⚠️ Aviso: Todos los registros fueron filtrados. Revisando primeros registros:')
    console.log('Primeros 3 registros normalizados:', datosNormalizados.slice(0, 3))
    console.log('Campos esperados:', config.campos)
  }

  // Retornar datos normalizados (sin filtrar) para que poblarFiltros() tenga acceso a todos
  return datosNormalizados
}

// Función para formatear números
const formatearNumero = (numero) => {
  const num = parseFloat(numero)
  if (isNaN(num)) return '0'
  return new Intl.NumberFormat('es-MX', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(num)
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
    console.log(`🔍 poblarFiltros: Recibido ${datos.length} registros para tipo: ${tipoDatos}`)

    if (!config || !config.campos) {
      console.error('Configuración no válida:', config)
      return
    }

    // Mostrar primeros 3 registros para verificar que tienen ubicacionNormalizada
    if (datos.length > 0) {
      console.log('📋 Primeros registros:', datos.slice(0, 3).map(d => ({
        ubicacionNormalizada: d.ubicacionNormalizada,
        empresaNormalizada: d.empresaNormalizada,
        centroCosteNormalizado: d.centroCosteNormalizado
      })))
    }

    // Sets para valores únicos
    const conjuntos = {
      centroCoste: new Set(),
      empresa: new Set(),
      almacen: new Set(),
      rancho: new Set()
    }

    // Agregar temporada para salidas y solicitudes
    if (tipoDatos === 'salidas' || tipoDatos === 'solicitudes') {
      conjuntos.temporada = new Set()
    }

    // Agregar combustible para salidas, entradas y cargas
    if (tipoDatos === 'salidas' || tipoDatos === 'entradas' || tipoDatos === 'cargas') {
      conjuntos.combustible = new Set()
    }

    // Agregar filtros específicos para solicitudes
    if (tipoDatos === 'solicitudes') {
      conjuntos.tipo = new Set()
      conjuntos.presentacion = new Set()
      conjuntos.metodoAplicacion = new Set()
      conjuntos.producto = new Set()
      conjuntos.usuario = new Set()
      conjuntos.status = new Set()
    }
    if (tipoDatos === 'activos') {
      conjuntos.estado = new Set()
      conjuntos.tipoActivo = new Set()
      conjuntos.departamento = new Set()
      conjuntos.ubicacion = new Set()
    }

    // Poblar los conjuntos con valores de los datos
    // Nota: Los datos ya vienen con campos normalizados de prepararYValidarDatos()
    console.log('🔍 poblarFiltros: Iniciando procesamiento de datos para filtros', datos)
    datos.forEach(item => {
      // Centro de coste - usar campo ya normalizado
      if (item.centroCosteNormalizado && item.centroCosteNormalizado !== 'sin especificar') {
        conjuntos.centroCoste.add(item.centroCosteNormalizado)
      }

      // Empresa - usar campo ya normalizado
      if (item.empresaNormalizada && item.empresaNormalizada !== 'sin especificar') {
        conjuntos.empresa.add(item.empresaNormalizada)
      }

      // Almacén (para salidas y entradas) - usar campo ya normalizado
      if (tipoDatos === 'salidas' || tipoDatos === 'entradas') {
        if (item.ubicacionNormalizada && item.ubicacionNormalizada !== 'sin especificar') {
          conjuntos.almacen.add(item.ubicacionNormalizada)
        }
      }

      // Rancho (para salidas, entradas y solicitudes) - usar campo ya normalizado
      if (tipoDatos === 'salidas' || tipoDatos === 'entradas' || tipoDatos === 'solicitudes') {
        if (item.ubicacionNormalizada && item.ubicacionNormalizada !== 'sin especificar') {
          conjuntos.rancho.add(item.ubicacionNormalizada)
        }
      }

      // Temporada - usar campo ya normalizado
      if (tipoDatos === 'salidas' || tipoDatos === 'solicitudes') {
        if (item.temporadaNormalizada && item.temporadaNormalizada !== 'sin especificar') {
          conjuntos.temporada.add(item.temporadaNormalizada)
        }
      }

      // Combustible - usar campo ya normalizado
      if (tipoDatos === 'salidas' || tipoDatos === 'entradas' || tipoDatos === 'cargas') {
        if (item.combustibleNormalizado && item.combustibleNormalizado !== 'sin especificar') {
          conjuntos.combustible.add(item.combustibleNormalizado)
        }
      }

      // Filtros específicos para solicitudes
      if (tipoDatos === 'solicitudes') {
        const tipo = limpiarString(item.tipo_mezcla || '')
        if (tipo && tipo !== 'sin especificar') conjuntos.tipo.add(tipo)

        const presentacion = limpiarString(item.presentacion || '')
        if (presentacion && presentacion !== 'sin especificar') conjuntos.presentacion.add(presentacion)

        const metodo = limpiarString(item.metodoAplicacion || '')
        if (metodo && metodo !== 'sin especificar') conjuntos.metodoAplicacion.add(metodo)

        const producto = limpiarString(item.nombre_producto || '')
        if (producto && producto !== 'sin especificar') conjuntos.producto.add(producto)

        const usuario = limpiarString(item.nombre || '')
        if (usuario && usuario !== 'sin especificar') conjuntos.usuario.add(usuario)

        const status = limpiarString(item.status || '')
        if (status && status !== 'sin especificar') conjuntos.status.add(status)
      }

      // Filtros específicos para activos
      if (tipoDatos === 'activos') {
        if (item.statusNormalizado && item.statusNormalizado !== 'sin especificar') conjuntos.estado.add(item.statusNormalizado)
        if (item.equipoNormalizado && item.equipoNormalizado !== 'sin especificar') conjuntos.tipoActivo.add(item.equipoNormalizado)
        if (item.departamentoNormalizado && item.departamentoNormalizado !== 'sin especificar') conjuntos.departamento.add(item.departamentoNormalizado)
        if (item.ubicacionNormalizada && item.ubicacionNormalizada !== 'sin especificar') conjuntos.ubicacion.add(item.ubicacionNormalizada)
      }
    })

    console.log('🔍 poblarFiltros: Conjuntos únicos generados', conjuntos)
    // Poblar los selectores - mapear correctamente los nombres de los filtros
    const mapeoFiltros = {
      centroCoste: 'filtroCentroCoste',
      empresa: 'filtroEmpresa',
      almacen: 'filtroAlmacen',
      rancho: 'filtroRancho',
      temporada: 'filtroTemporada',
      combustible: 'filtroCombustible',
      tipo: 'filtroTipo',
      presentacion: 'filtroPresentacion',
      metodoAplicacion: 'filtroMetodoAplicacion',
      producto: 'filtroProducto',
      usuario: 'filtroUsuario',
      status: 'filtroStatus',
      estado: 'filtroEstado',
      tipoActivo: 'filtroTipoActivo',
      departamento: 'filtroDepartamentos',
      ubicacion: 'filtroUbicacion'
    }

    Object.entries(conjuntos).forEach(([campo, valores]) => {
      const selectId = mapeoFiltros[campo]
      if (selectId) {
        const select = document.getElementById(selectId)
        if (select) {
          poblarSelect(selectId, valores)
          console.log(`✅ ${selectId} poblado con ${valores.size} valores`)
        }
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
  console.log(`Poblando ${selectId} con`, valores)

  select.innerHTML = '<option value="">Todos</option>';
  [...valores].sort().forEach(valor => {
    const option = document.createElement('option')
    option.value = valor
    option.textContent = valor
    select.appendChild(option)
  })
}

// Función para contar solicitudes únicas sin perder los datos de los productos para cálculos.
const obtenerSolicitudesUnicas = (datos) => {
  // Usamos un Map para quedarnos con la primera aparición de cada 'id' de solicitud.
  // Esto es solo para contar, no para procesar los productos.
  return Array.from(new Map(datos.map(item => [item.id, item])).values())
}

// Función para aplicar los filtros seleccionados al conjunto de datos
const aplicarFiltros = () => {
  const tipoDatos = window.dashboardTipo

  try {
    // 1. Obtenemos los valores actuales de cada filtro
    const fechaInicio = document.getElementById('filtroFechaInicio')?.value || ''
    const fechaFin = document.getElementById('filtroFechaFin')?.value || ''
    const rancho = ['entradas', 'salidas', 'solicitudes'].includes(tipoDatos) ? (document.getElementById('filtroRancho')?.value || '') : ''
    const temporada = (tipoDatos === 'salidas' || tipoDatos === 'solicitudes') ? (document.getElementById('filtroTemporada')?.value || '') : ''
    const combustible = document.getElementById('filtroCombustible')?.value || ''
    const empresa = document.getElementById('filtroEmpresa')?.value || ''
    const centroCoste = document.getElementById('filtroCentroCoste')?.value || ''
    const eficiencia = document.getElementById('filtroEficiencia')?.value || ''
    const tiempoEntrega = document.getElementById('filtroTiempoEntrega')?.value || ''

    // Filtros específicos para solicitudes
    const tipo = tipoDatos === 'solicitudes' ? (document.getElementById('filtroTipo')?.value || '') : ''
    const presentacion = tipoDatos === 'solicitudes' ? (document.getElementById('filtroPresentacion')?.value || '') : ''
    const metodoAplicacion = tipoDatos === 'solicitudes' ? (document.getElementById('filtroMetodoAplicacion')?.value || '') : ''
    const producto = tipoDatos === 'solicitudes' ? (document.getElementById('filtroProducto')?.value || '') : ''
    const usuario = tipoDatos === 'solicitudes' ? (document.getElementById('filtroUsuario')?.value || '') : ''
    const status = tipoDatos === 'solicitudes' ? (document.getElementById('filtroStatus')?.value || '') : ''

    // Filtros específicos para activos
    const estado = tipoDatos === 'activos' ? (document.getElementById('filtroEstado')?.value || '') : ''
    const tipoActivo = tipoDatos === 'activos' ? (document.getElementById('filtroTipoActivo')?.value || '') : ''
    const departamento = tipoDatos === 'activos' ? (document.getElementById('filtroDepartamentos')?.value || '') : ''
    const ubicacion = tipoDatos === 'activos' ? (document.getElementById('filtroUbicacion')?.value || '') : ''

    // 2. Usamos .filter() sobre los datos originales
    const datosFiltrados = datosOriginales.filter(item => {
      // Primero filtrar por cantidad válida (para gráficas y análisis) - NO para activos
      if (tipoDatos !== 'activos' && (item.cantidadValida === null || item.cantidadValida === undefined)) return false

      // Filtro por Fecha (usando el campo normalizado)
      if (fechaInicio && (!item.fechaNormalizada || item.fechaNormalizada < new Date(fechaInicio + 'T00:00:00Z'))) return false
      if (fechaFin && (!item.fechaNormalizada || item.fechaNormalizada > new Date(fechaFin + 'T00:00:00Z'))) return false

      // Filtro por Rancho (si hay un valor seleccionado)
      // Usamos el campo normalizado 'ubicacionNormalizada'
      if (rancho && item.ubicacionNormalizada !== rancho) return false

      // Filtro por Temporada para salidas y solicitudes
      console.log('🔍 aplicarFiltros: Verificando temporada para item', item.temporadaNormalizada, tipoDatos, temporada)

      if ((tipoDatos === 'salidas' || tipoDatos === 'solicitudes') && temporada && item.temporadaNormalizada !== temporada) return false

      // Filtro por Combustible - usar campo normalizado
      if (combustible && item.combustibleNormalizado !== combustible) return false

      // Filtro por Empresa - usar campo normalizado
      if (empresa && item.empresaNormalizada !== empresa) return false

      // Filtro por Centro de Coste
      // Usamos el campo normalizado 'centroCosteNormalizado'
      if (centroCoste && item.centroCosteNormalizado !== centroCoste) return false

      // Filtros específicos para solicitudes
      if (tipoDatos === 'solicitudes') {
        if (tipo && limpiarString(item.tipo_mezcla || '') !== tipo) return false
        if (presentacion && limpiarString(item.presentacion || '') !== presentacion) return false
        if (metodoAplicacion && limpiarString(item.metodoAplicacion || '') !== metodoAplicacion) return false
        if (producto && limpiarString(item.nombre_producto || '') !== producto) return false
        if (usuario && limpiarString(item.nombre || '') !== usuario) return false
        if (status && limpiarString(item.status || '') !== status) return false
      }

      // Filtros específicos para activos
      if (tipoDatos === 'activos') {
        console.log('🔍 Aplicando filtros activos:', { estado, tipoActivo, ubicacion, departamento })
        console.log('🔍 Valores del item:', {
          statusNormalizado: item.statusNormalizado,
          equipoNormalizado: item.equipoNormalizado,
          ubicacionNormalizada: item.ubicacionNormalizada,
          departamentoNormalizado: item.departamentoNormalizado
        })
        if (estado && item.statusNormalizado !== estado) {
          console.log('❌ Rechazado por estado:', item.statusNormalizado, '!==', estado)
          return false
        }
        if (tipoActivo && item.equipoNormalizado !== tipoActivo) {
          console.log('❌ Rechazado por tipoActivo:', item.equipoNormalizado, '!==', tipoActivo)
          return false
        }
        if (ubicacion && item.ubicacionNormalizada !== ubicacion) {
          console.log('❌ Rechazado por ubicacion:', item.ubicacionNormalizada, '!==', ubicacion)
          return false
        }
        if (departamento && item.departamentoNormalizado !== departamento) {
          console.log('❌ Rechazado por departamento:', item.departamentoNormalizado, '!==', departamento)
          return false
        }
      }

      // Filtro de eficiencia
      if (eficiencia) {
        const eficienciaCalculada = (item.cantidad / item.cantidad_solicitada) * 100
        switch (eficiencia) {
          case 'alta':
            if (eficienciaCalculada <= 95) return false
            break
          case 'media':
            if (eficienciaCalculada < 80 || eficienciaCalculada > 95) return false
            break
          case 'baja':
            if (eficienciaCalculada >= 80) return false
            break
        }
      }
      // Filtro de tiempo de entrega
      if (tiempoEntrega && item.fechaEntrega && item.fechaSolicitud) {
        const dias = Math.floor(
          (new Date(item.fechaEntrega) - new Date(item.fechaSolicitud)) /
          (1000 * 60 * 60 * 24)
        )
        if (dias > parseInt(tiempoEntrega)) return false
      }
      return true
    })
    // VERIFICAR ALERTAS
    verificarAlertas(datosFiltrados)

    // Debug logging
    console.log('🔍 Filtros aplicados:', {
      rancho,
      temporada,
      combustible,
      centroCoste,
      empresa,
      datosOriginalesCount: datosOriginales.length,
      datosFiltradosCount: datosFiltrados.length
    })

    // Logging detallado de los primeros registros disponibles
    if (datosOriginales.length > 0 && datosFiltrados.length === 0) {
      console.log('🚨 Filtros muy restrictivos - ejemplo de datos originales:')
      datosOriginales.slice(0, 2).forEach((item, idx) => {
        console.log(`Registro ${idx}:`, {
          ubicacionNormalizada: item.ubicacionNormalizada,
          temporadaNormalizada: item.temporadaNormalizada,
          centroCosteNormalizado: item.centroCosteNormalizado,
          combustibleNormalizado: item.combustibleNormalizado,
          cantidadValida: item.cantidadValida
        })
      })
    }

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
      return acc + (parseFloat(item.rendimiento || 0)) // ✅ Corregido: rendimiento
    }, 0) / datos.length

    if (rendimientoPromedio < config.alertas.rendimientoBajo) {
      mostrarMensaje(`⚠️ Rendimiento bajo detectado: ${rendimientoPromedio.toFixed(2)} km/L`,
        'warning')
    }
  }
}

// funcion para destruir graficas
const destruirGraficas = () => {
  try {
    // Destruir gráficas locales
    [combustibleChart, almacenChart, centroCosteChart, temporadaChart,
      empresaChart, unidadChart, rendimientoChart].forEach(chart => {
      try {
        if (chart && typeof chart.destroy === 'function') {
          chart.destroy()
        }
      } catch (err) {
        console.debug('Error destroying local chart:', err.message)
      }
    })

    // Destruir gráficas de solicitudes almacenadas en window
    const graficasSolicitudes = [
      'eficienciaChart', 'tiempoEntregaChart', 'metodoChart',
      'variedadChart', 'statusChart', 'timelineChart'
    ]
    graficasSolicitudes.forEach(nombreGrafica => {
      try {
        const chart = window[nombreGrafica]
        // Validar que sea un objeto con método destroy
        if (chart && typeof chart === 'object' && typeof chart.destroy === 'function') {
          chart.destroy()
        }
      } catch (err) {
        console.debug(`Error destroying ${nombreGrafica}:`, err.message)
      }
      // Limpiar referencia
      try {
        if (window[nombreGrafica]) {
          delete window[nombreGrafica]
        }
      } catch (err) {
        // Ignorar si no se puede borrar
      }
    })
  } catch (err) {
    console.debug('Error in destruirGraficas:', err.message)
  }
}
// Función que actualiza todas las visualizaciones con los datos proporcionados
const actualizarVistas = (datos) => {
  const tipoDatos = window.dashboardTipo
  const config = getConfig(tipoDatos)

  // Destruir gráficas existentes
  destruirGraficas()

  // Actualizar estadísticas
  actualizarEstadisticas(datos, config)

  //

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
      // Gráficas existentes
      crearGraficaProductos(datos)
      crearGraficaEmpresa(datos)
      crearGraficaCentroCoste(datos)
      crearGraficaTemporada(datos)
      // Nuevas gráficas para solicitudes
      crearGraficaMetodoAplicacion(datos)
      crearGraficaTiempoEntrega(datos)
      crearGraficaVariedad(datos)
      crearGraficaEficiencia(datos)
      crearGraficaTimelineMejorado(datos)
      break
    case 'activos':
      crearGraficaEmpresaActivos(datos)
      crearGraficaUbicacion(datos)
      crearGraficaEstadoActivos(datos)
      crearGraficaTipoEquipo(datos)
      crearGraficaDepartamento(datos)
      break
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
    console.log('🔍 procesarDatosAgrupados: Procesando item', { keyFields, valueFields, label, value })
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

// Función específica para contar activos (no sumar valores)
const procesarDatosActivosConteo = (datos, { keyFields, topN = null }) => {
  const agrupacion = {}
  datos.forEach(item => {
    // Encontrar el primer campo de clave válido o usar 'Sin especificar'
    const key = keyFields.map(k => item[k]).find(val => val) || 'Sin especificar'
    const label = limpiarString(key.trim())

    // Simplemente contar: cada registro = 1 activo
    if (agrupacion[label]) {
      agrupacion[label] += 1
    } else {
      agrupacion[label] = 1
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

const procesarDatosCombustible = (datos) => {
  return procesarDatosAgrupados(datos, { keyFields: ['combustible', 'tipo_combustible'], valueFields: camposDeValor })
}

const procesarDatosAlmacen = (datos) => {
  return procesarDatosAgrupados(datos, { keyFields: ['almacen', 'ubicacion'], valueFields: camposDeValor, topN: 8 })
}

const procesarDatosCentroCoste = (datos) => {
  const tipoDatos = window.dashboardTipo
  const keyFields = tipoDatos === 'solicitudes' ? ['centroCoste'] : ['centro_coste', 'centro_costos']
  return procesarDatosAgrupados(datos, { keyFields, valueFields: camposDeValor, topN: 10 })
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
    const rendimiento = parseFloat(item.rendimiento) || 0 // ✅ Corregido: rendimiento
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
  const tipoDatos = window.dashboardTipo
  const keyFields = tipoDatos === 'solicitudes' ? ['temporada'] : ['temporada', 'estacion', 'periodo']
  return procesarDatosAgrupados(datos, { keyFields, valueFields: camposDeValor })
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
  let datosParaCalculo
  // Calcular totales y promedios
  if (tipoDatos === 'solicitudes') {
    // Para contar el número de tarjetas de solicitud, contamos los IDs únicos.
    totalRegistros = obtenerSolicitudesUnicas(datos).length
    datosParaCalculo = datos // Usamos todos los datos (productos) para los cálculos
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
    const cantidadPorPresentacion = datosParaCalculo.reduce((acc, item) => {
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
    const totalesPorTipo = datosParaCalculo.reduce((acc, item) => {
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

    // Calcular totales por status
    const statusPorTipo = datosParaCalculo.reduce((acc, item) => {
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

    // Actualizar estadísticas de tiempo
    const stats = calcularEstadisticasTiempo(datos)
    const tiempoElement = document.getElementById('tiempoEntregaTotales')
    if (tiempoElement) {
      tiempoElement.innerHTML = `
        <div class="mb-2">
            <h4 class="mb-0">${stats.promedioDias} días</h4>
            <p class="text-muted font-weight-normal">Promedio General</p>
        </div>
        ${stats.porTipo.map(t => `
            <div class="mt-2">
                <small class="text-muted">${t.tipo}: ${t.promedio} días</small>
            </div>
        `).join('')}
    `

      // Actualizar eficiencia
      const eficiencia = calcularEficiencia(datos)
      const eficienciaElement = document.getElementById('eficienciaTotales')
      if (eficienciaElement) {
        const porcentajeEficiencia = (eficiencia.totalEntregado / eficiencia.totalSolicitado * 100).toFixed(1)
        eficienciaElement.innerHTML = `
        <div class="mb-2">
            <h4 class="mb-0">${porcentajeEficiencia}%</h4>
            <p class="text-muted font-weight-normal">Eficiencia Global</p>
        </div>
        <div class="mt-2">
            <small class="text-muted">
                Entregado: ${formatearNumero(eficiencia.totalEntregado)}
                <br>
                Solicitado: ${formatearNumero(eficiencia.totalSolicitado)}
            </small>
        </div>
    `
      }
    }
    const cal = calcularEstadisticasTemporales(datos)
    console.log(cal)
  }

  if (tipoDatos === 'activos') {
    // Calcular estadísticas para activos

    // Calcular el número de departamentos únicos
    const departamentosUnicos = new Set(datos.map(item => item.departamentoNormalizado).filter(d => d !== 'sin especificar')).size

    totalRegistros = datos.length

    // Actualizar estadísticas generales
    document.getElementById('totalSalidas').textContent = formatearNumero(totalRegistros)
    document.getElementById('totalDepartamentos').textContent = formatearNumero(departamentosUnicos)
  }
}
// Función para calcular estadísticas de tiempo
const calcularEstadisticasTiempo = (datos) => {
  const solicitudesUnicas = obtenerSolicitudesUnicas(datos)

  const tiempos = solicitudesUnicas.reduce((acc, item) => {
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
  // Para la eficiencia, sí necesitamos todos los productos, no las solicitudes únicas.
  // La lógica anterior que usaba `eliminarDuplicados` era incorrecta.
  return datos.reduce((acc, item) => {
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

const obtenerSemana = (fecha) => {
  if (!fecha) return null
  const date = new Date(fecha)
  date.setHours(0, 0, 0, 0)
  // Thursday in current week decides the year.
  date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7)
  // January 4 is always in week 1.
  const week1 = new Date(date.getFullYear(), 0, 4)
  // Adjust to Thursday in week 1 and count number of weeks from date to week1.
  return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7)
}

const calcularEstadisticasTemporales = (datos) => {
  const stats = {
    promedioTiempoEntrega: 0,
    medianaEntrega: 0,
    tendenciasSemana: {},
    puntosMaximos: [],
    estacionalidad: {}
  }

  datos.forEach(item => {
    // Cálculos de estadísticas temporales
    const semana = obtenerSemana(item.fechaSolicitud)
    stats.tendenciasSemana[semana] = (stats.tendenciasSemana[semana] || 0) + 1
  })

  return stats
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

  unidadChart = crearGrafica('productoChart', 'bar', {
    labels: top10.map(([nombre]) => nombre),
    datasets: [{
      data: top10.map(([, cantidad]) => cantidad),
      backgroundColor: getColor(10)
    }]
  }, {
    maintainAspectRatio: false,
    indexAxis: 'y', // Esto hace que la barra sea horizontal
    plugins: {
      legend: { display: false },
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
  })
}
// Función para crear gráfica de unidades
const crearGraficaUnidad = (datos) => {
  const ctx = document.getElementById('unidadChart')
  if (!ctx) return

  const procesado = procesarDatosUnidad(datos)

  unidadChart = crearGrafica('unidadChart', 'bar', {
    labels: procesado.labels,
    datasets: [{
      label: 'Cargas (L)',
      data: procesado.data,
      backgroundColor: procesado.colors,
      borderColor: procesado.colors.map(color => color.replace('0.8', '1')),
      borderWidth: 1
    }]
  }, {
    maintainAspectRatio: false,
    indexAxis: 'y',
    plugins: {
      legend: { display: false },
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

  rendimientoChart = crearGrafica('rendimientoChart', 'bar', {
    labels: procesado.labels,
    datasets: [{
      label: 'Rendimiento (km/L)',
      data: procesado.data,
      backgroundColor: procesado.colors,
      borderColor: procesado.colors.map(color => color.replace('0.8', '1')),
      borderWidth: 1
    }]
  }, {
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
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

  combustibleChart = crearGrafica('combustibleChart', 'doughnut', {
    labels: procesado.labels,
    datasets: [{
      data: procesado.data,
      backgroundColor: procesado.colors,
      borderWidth: 2,
      borderColor: '#fff'
    }]
  }, {
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

  almacenChart = crearGrafica('almacenChart', 'bar', {
    labels: procesado.labels,
    datasets: [{
      label: 'Consumo (L)',
      data: procesado.data,
      backgroundColor: procesado.colors,
      borderColor: procesado.colors.map(color => color.replace('0.8', '1')),
      borderWidth: 1
    }]
  }, {
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
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

  centroCosteChart = crearGrafica('centroCosteChart', 'bar', {
    labels: procesado.labels,
    datasets: [{
      label: 'Consumo (L)',
      data: procesado.data,
      backgroundColor: procesado.colors,
      borderColor: procesado.colors.map(color => color.replace('0.8', '1')),
      borderWidth: 1
    }]
  }, {
    maintainAspectRatio: false,
    indexAxis: 'y',
    plugins: {
      legend: { display: false },
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

  temporadaChart = crearGrafica('temporadaChart', 'pie', {
    labels: procesado.labels,
    datasets: [{
      data: procesado.data,
      backgroundColor: procesado.colors,
      borderWidth: 2,
      borderColor: '#fff'
    }]
  }, {
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

  empresaChart = crearGrafica('empresaChart', 'bar', {
    labels: procesado.labels,
    datasets: [{
      label: 'Consumo (L)',
      data: procesado.data,
      backgroundColor: procesado.colors,
      borderColor: procesado.colors.map(color => color.replace('0.8', '1')),
      borderWidth: 1
    }]
  }, {
    maintainAspectRatio: false,
    indexAxis: 'y',
    plugins: {
      legend: { display: false },
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
  })
}

// A) GRÁFICA DE EFICIENCIA DE CUMPLIMIENTO
const crearGraficaEficiencia = (datos) => {
  const ctx = document.getElementById('eficienciaChart')
  if (!ctx) {
    console.log('Canvas eficienciaChart no encontrado')
    return
  }

  try {
    // Calcular eficiencia por tipo de mezcla
    const eficienciaPorTipo = datos.reduce((acc, item) => {
      const tipo = item.tipo_mezcla || 'Sin especificar'
      const solicitado = parseFloat(item.cantidad_solicitada) || 0
      const entregado = parseFloat(item.cantidad) || 0

      if (!acc[tipo]) {
        acc[tipo] = { totalSolicitado: 0, totalEntregado: 0 }
      }

      acc[tipo].totalSolicitado += solicitado
      acc[tipo].totalEntregado += entregado

      return acc
    }, {})

    // Calcular porcentajes de eficiencia
    const datosGrafica = Object.entries(eficienciaPorTipo)
      .filter(([, data]) => data.totalSolicitado > 0) // Filtrar divisiones por cero
      .map(([tipo, data]) => ({
        tipo,
        eficiencia: Math.min(100, (data.totalEntregado / data.totalSolicitado * 100).toFixed(1))
      }))

    if (datosGrafica.length === 0) {
      console.debug('No hay datos válidos para eficiencia')
      return
    }

    if (window.eficienciaChart) {
      try {
        if (typeof window.eficienciaChart.destroy === 'function') {
          window.eficienciaChart.destroy()
        } else {
          console.debug('window.eficienciaChart exists but has no destroy(), cleaning reference', window.eficienciaChart)
        }
      } catch (err) {
        console.debug('Error destroying window.eficienciaChart:', err.message)
      }
      try { delete window.eficienciaChart } catch (e) {}
    }

    window.eficienciaChart = crearGrafica('eficienciaChart', 'bar', {
      labels: datosGrafica.map(d => d.tipo),
      datasets: [{
        label: 'Eficiencia de Cumplimiento (%)',
        data: datosGrafica.map(d => d.eficiencia),
        backgroundColor: datosGrafica.map((_, i) => getColor(i)),
        borderWidth: 1
      }]
    }, {
      maintainAspectRatio: false,
      plugins: {
        tooltip: {
          callbacks: {
            label: (context) => `${context.label}: ${context.raw}% de eficiencia`
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          ticks: {
            callback: value => value + '%'
          }
        }
      }
    })
  } catch (err) {
    console.error('Error creando gráfica de eficiencia:', err.message)
  }
}

// B) GRÁFICA DE TIEMPO DE ENTREGA
const crearGraficaTiempoEntrega = (datos) => {
  const ctx = document.getElementById('tiempoEntregaChart')
  if (!ctx) {
    console.log('Canvas tiempoEntregaChart no encontrado')
    return
  }

  try {
    // Obtener solicitudes únicas (por ID) para calcular tiempos
    const solicitudesUnicas = obtenerSolicitudesUnicas(datos)

    const tiemposEntrega = solicitudesUnicas
      .filter(item => item.fechaEntrega && item.fechaSolicitud)
      .map(item => {
        const solicitud = new Date(item.fechaSolicitud)
        const entrega = new Date(item.fechaEntrega)
        const dias = Math.floor((entrega - solicitud) / (1000 * 60 * 60 * 24))

        return {
          tipo: item.tipo_mezcla,
          dias: isNaN(dias) ? 0 : dias,
          status: item.status
        }
      })

    if (tiemposEntrega.length === 0) {
      console.log('No hay datos de tiempo de entrega')
      return
    }

    // Agrupar por rangos de días
    const rangos = {
      '0-1 días': 0,
      '2-3 días': 0,
      '4-7 días': 0,
      '8-15 días': 0,
      '16+ días': 0
    }

    tiemposEntrega.forEach(item => {
      if (item.dias <= 1) rangos['0-1 días']++
      else if (item.dias <= 3) rangos['2-3 días']++
      else if (item.dias <= 7) rangos['4-7 días']++
      else if (item.dias <= 15) rangos['8-15 días']++
      else rangos['16+ días']++
    })

    if (window.tiempoEntregaChart) {
      try {
        if (typeof window.tiempoEntregaChart.destroy === 'function') {
          window.tiempoEntregaChart.destroy()
        } else {
          console.debug('window.tiempoEntregaChart exists but has no destroy(), cleaning reference', window.tiempoEntregaChart)
        }
      } catch (err) {
        console.debug('Error destroying window.tiempoEntregaChart:', err.message)
      }
      try { delete window.tiempoEntregaChart } catch (e) {}
    }

    window.tiempoEntregaChart = crearGrafica('tiempoEntregaChart', 'doughnut', {
      labels: Object.keys(rangos),
      datasets: [{
        data: Object.values(rangos),
        backgroundColor: [
          '#4CAF50', // Verde para rápido
          '#8BC34A', // Verde claro
          '#FFC107', // Amarillo para moderado
          '#FF9800', // Naranja
          '#F44336' // Rojo para lento
        ]
      }]
    }, {
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom'
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              const total = context.dataset.data.reduce((a, b) => a + b, 0)
              const percentage = ((context.raw / total) * 100).toFixed(1)
              return `${context.label}: ${context.raw} solicitudes (${percentage}%)`
            }
          }
        }
      }
    })
  } catch (err) {
    console.error('Error creando gráfica de tiempo de entrega:', err.message)
  }
}

// C) GRÁFICA DE MÉTODOS DE APLICACIÓN
const crearGraficaMetodoAplicacion = (datos) => {
  const ctx = document.getElementById('metodoChart')
  if (!ctx) {
    console.debug('Canvas metodoChart no encontrado')
    return
  }

  try {
    const metodos = datos.reduce((acc, item) => {
      const metodo = item.metodoAplicacion || 'Sin especificar'
      const cantidad = parseFloat(item.cantidad_normalizada) || 0

      if (cantidad > 0) {
        if (acc[metodo]) {
          acc[metodo] += cantidad
        } else {
          acc[metodo] = cantidad
        }
      }
      return acc
    }, {})

    const datosOrdenados = Object.entries(metodos)
      .sort((a, b) => b[1] - a[1])

    if (datosOrdenados.length === 0) {
      console.debug('No hay datos válidos para método de aplicación')
      return
    }

    if (window.metodoChart) {
      try {
        if (typeof window.metodoChart.destroy === 'function') {
          window.metodoChart.destroy()
        } else {
          console.debug('window.metodoChart exists but has no destroy(), cleaning reference', window.metodoChart)
        }
      } catch (err) {
        console.debug('Error destroying window.metodoChart:', err.message)
      }
      try { delete window.metodoChart } catch (e) {}
    }

    window.metodoChart = crearGrafica('metodoChart', 'bar', {
      labels: datosOrdenados.map(([metodo]) => metodo),
      datasets: [{
        label: 'Cantidad Total',
        data: datosOrdenados.map(([, cantidad]) => cantidad),
        backgroundColor: datosOrdenados.map((_, i) => getColor(i)),
        borderWidth: 1
      }]
    }, {
      maintainAspectRatio: false,
      indexAxis: 'y',
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (context) => `${context.label}: ${formatearNumero(context.raw)}`
          }
        }
      }
    })
  } catch (err) {
    console.error('Error creando gráfica de método de aplicación:', err.message)
  }
}

// D) GRÁFICA DE ANÁLISIS POR VARIEDAD
const crearGraficaVariedad = (datos) => {
  const ctx = document.getElementById('variedadChart')
  if (!ctx) {
    console.log('Canvas variedadChart no encontrado')
    return
  }

  try {
    const variedades = datos.reduce((acc, item) => {
      const variedad = item.variedad || 'Sin especificar'
      const cantidad = parseFloat(item.cantidad_normalizada) || 0

      if (cantidad > 0) {
        if (acc[variedad]) {
          acc[variedad] += cantidad
        } else {
          acc[variedad] = cantidad
        }
      }
      return acc
    }, {})

    const top8 = Object.entries(variedades)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)

    if (top8.length === 0) {
      console.debug('No hay datos válidos para variedades')
      return
    }

    if (window.variedadChart) {
      try {
        if (typeof window.variedadChart.destroy === 'function') {
          window.variedadChart.destroy()
        } else {
          console.debug('window.variedadChart exists but has no destroy(), cleaning reference', window.variedadChart)
        }
      } catch (err) {
        console.debug('Error destroying window.variedadChart:', err.message)
      }
      try { delete window.variedadChart } catch (e) {}
    }

    window.variedadChart = crearGrafica('variedadChart', 'pie', {
      labels: top8.map(([variedad]) => variedad),
      datasets: [{
        data: top8.map(([, cantidad]) => cantidad),
        backgroundColor: top8.map((_, i) => getColor(i))
      }]
    }, {
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
          labels: { padding: 15 }
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              const total = context.dataset.data.reduce((a, b) => a + b, 0)
              const percentage = ((context.raw / total) * 100).toFixed(1)
              return `${context.label}: ${formatearNumero(context.raw)} (${percentage}%)`
            }
          }
        }
      }
    })
  } catch (err) {
    console.error('Error creando gráfica de variedad:', err.message)
  }
}

// F) GRÁFICA DE ANÁLISIS TEMPORAL (TIMELINE MEJORADO)
const crearGraficaTimelineMejorado = (datos) => {
  const ctx = document.getElementById('timelineChart')
  if (!ctx) {
    console.debug('Canvas timelineChart no encontrado')
    return
  }

  try {
    // Agrupar por fecha de solicitud
    const solicitudesPorFecha = datos.reduce((acc, item) => {
      const fecha = item.fechaSolicitud
      if (!fecha) return acc

      const fechaKey = new Date(fecha).toISOString().split('T')[0]

      if (!acc[fechaKey]) {
        acc[fechaKey] = {
          solicitudes: 0,
          productos: 0,
          cantidadTotal: 0
        }
      }

      // Contar productos únicos por fecha
      acc[fechaKey].productos += 1
      acc[fechaKey].cantidadTotal += parseFloat(item.cantidad_normalizada) || 0

      return acc
    }, {})

    // Contar solicitudes únicas por fecha
    const solicitudesUnicas = obtenerSolicitudesUnicas(datos)
    solicitudesUnicas.forEach(item => {
      if (!item.fechaSolicitud) return
      const fechaKey = new Date(item.fechaSolicitud).toISOString().split('T')[0]
      if (solicitudesPorFecha[fechaKey]) {
        solicitudesPorFecha[fechaKey].solicitudes += 1
      }
    })

    const fechasOrdenadas = Object.keys(solicitudesPorFecha)
      .sort()
      .slice(-30) // Últimos 30 días

    if (fechasOrdenadas.length === 0) {
      console.debug('No hay datos válidos para análisis temporal')
      return
    }

    if (window.timelineChart) {
      try {
        if (typeof window.timelineChart.destroy === 'function') {
          window.timelineChart.destroy()
        } else {
          console.debug('window.timelineChart exists but has no destroy(), cleaning reference', window.timelineChart)
        }
      } catch (err) {
        console.debug('Error destroying window.timelineChart:', err.message)
      }
      try { delete window.timelineChart } catch (e) {}
    }

    window.timelineChart = crearGrafica('timelineChart', 'line', {
      labels: fechasOrdenadas.map(fecha => {
        return new Date(fecha).toLocaleDateString('es-MX', {
          month: 'short', day: 'numeric'
        })
      }),
      datasets: [{
        label: 'Solicitudes por día',
        data: fechasOrdenadas.map(fecha => solicitudesPorFecha[fecha].solicitudes),
        borderColor: '#2196F3',
        backgroundColor: 'rgba(33, 150, 243, 0.1)',
        tension: 0.4,
        yAxisID: 'y'
      }, {
        label: 'Productos solicitados',
        data: fechasOrdenadas.map(fecha => solicitudesPorFecha[fecha].productos),
        borderColor: '#4CAF50',
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        tension: 0.4,
        yAxisID: 'y1'
      }]
    }, {
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false
      },
      scales: {
        y: {
          type: 'linear',
          display: true,
          position: 'left',
          title: {
            display: true,
            text: 'Número de Solicitudes'
          }
        },
        y1: {
          type: 'linear',
          display: true,
          position: 'right',
          title: {
            display: true,
            text: 'Número de Productos'
          },
          grid: {
            drawOnChartArea: false
          }
        }
      }
    })
  } catch (err) {
    console.error('Error creando gráfica de análisis temporal:', err.message)
  }
}

// Funciones para tipo 'activos'
// realiza grafica del estatus de los activos por equipo
// Funciones para tipo 'activos'
const crearGraficaEmpresaActivos = (datos) => {
  const procesado = procesarDatosActivosConteo(datos, {
    keyFields: ['empresaNormalizada']
  })

  crearGrafica('combustibleChart', 'pie', {
    labels: procesado.labels,
    datasets: [{
      data: procesado.data,
      backgroundColor: procesado.colors,
      borderColor: '#fff',
      borderWidth: 2
    }]
  }, { responsive: true, maintainAspectRatio: true })
}

const crearGraficaUbicacion = (datos) => {
  const procesado = procesarDatosActivosConteo(datos, {
    keyFields: ['ubicacionNormalizada'],
    topN: 10
  })

  crearGrafica('almacenChart', 'bar', {
    labels: procesado.labels,
    datasets: [{
      label: 'Cantidad de Activos',
      data: procesado.data,
      backgroundColor: procesado.colors,
      borderColor: '#90CAF9',
      borderWidth: 1
    }]
  }, {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      x: {
        beginAtZero: true,
        ticks: { stepSize: 1 }
      }
    }
  })
}

const crearGraficaEstadoActivos = (datos) => {
  const procesado = procesarDatosActivosConteo(datos, {
    keyFields: ['statusNormalizado']
  })

  crearGrafica('empresaChart', 'doughnut', {
    labels: procesado.labels,
    datasets: [{
      data: procesado.data,
      backgroundColor: procesado.colors,
      borderColor: '#fff',
      borderWidth: 2
    }]
  }, { responsive: true, maintainAspectRatio: true })
}

const crearGraficaTipoEquipo = (datos) => {
  const procesado = procesarDatosActivosConteo(datos, {
    keyFields: ['equipoNormalizado']
  })

  crearGrafica('centroCosteChart', 'bar', {
    labels: procesado.labels,
    datasets: [{
      label: 'Cantidad de Equipos',
      data: procesado.data,
      backgroundColor: 'rgba(76, 175, 80, 0.7)',
      borderColor: 'rgba(76, 175, 80, 1)',
      borderWidth: 1
    }]
  }, {
    indexAxis: 'x',
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1 }
      }
    }
  })
}

const crearGraficaDepartamento = (datos) => {
  const procesado = procesarDatosActivosConteo(datos, {
    keyFields: ['departamentoNormalizado'],
    topN: 10
  })

  crearGrafica('departamentoChart', 'bar', {
    labels: procesado.labels,
    datasets: [{
      label: 'Cantidad de Activos',
      data: procesado.data,
      backgroundColor: procesado.colors,
      borderColor: '#90CAF9',
      borderWidth: 1
    }]
  }, {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      x: {
        beginAtZero: true,
        ticks: { stepSize: 1 }
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
    idsFiltros.push('filtroAlmacen')
    idsFiltros.push('filtroTemporada')
    idsFiltros.push('filtroCombustible')
  }
  // Agregar rancho solo si es entradas 'filtroCombustible',
  if (tipoDatos === 'entradas') {
    idsFiltros.push('filtroAlmacen')
    idsFiltros.push('filtroCombustible')
  }

  if (tipoDatos === 'cargas') {
    idsFiltros.push('filtroCombustible')
  }
  // Agregar filtros específicos para solicitudes
  if (tipoDatos === 'solicitudes') {
    idsFiltros.push('filtroRancho')
    idsFiltros.push('filtroTipo')
    idsFiltros.push('filtroPresentacion')
    idsFiltros.push('filtroMetodoAplicacion')
    idsFiltros.push('filtroProducto')
    idsFiltros.push('filtroUsuario')
    idsFiltros.push('filtroStatus')
    idsFiltros.push('filtroTemporada')
  }

  if (tipoDatos === 'activos') {
    idsFiltros.push('filtroEstado')
    idsFiltros.push('filtroTipoActivo')
    idsFiltros.push('filtroDepartamentos')
    idsFiltros.push('filtroUbicacion')
  }

  // 🚀 Aplicar debounce a los event listeners
  const actualizarConDebounce = debounce(() => {
    showSpinner()
    try {
      const datosFiltrados = aplicarFiltros()
      actualizarVistas(datosFiltrados)
    } catch (error) {
      console.error('Error en actualización de vistas:', error)
    } finally {
      hideSpinner()
    }
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
      showSpinner()
      try {
        idsFiltros.forEach(id => {
          const elemento = document.getElementById(id)
          if (elemento) elemento.value = ''
        })
        limpiarCache() // Limpiar cache al resetear
        actualizarVistas(datosOriginales)
        mostrarMensaje('Filtros restablecidos', 'success')
      } catch (error) {
        console.error('Error al resetear filtros:', error)
        mostrarMensaje('Error al resetear filtros', 'danger')
      } finally {
        hideSpinner()
      }
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

    // ✅ FIX #3: Validar window.dashboardTipo
    const tipoDatos = window.dashboardTipo
    if (!tipoDatos || !['salidas', 'entradas', 'cargas', 'solicitudes', 'activos'].includes(tipoDatos)) {
      hideSpinner()
      throw new Error(`Tipo de dashboard inválido: ${tipoDatos}. Debe ser: salidas, entradas, cargas, solicitudes o activos`)
    }

    // ✅ FIX #3: Validar window.dashboardData
    const datosRaw = window.dashboardData
    if (!Array.isArray(datosRaw)) {
      hideSpinner()
      throw new Error('window.dashboardData no es un array válido. Verifica que los datos se pasen correctamente desde el servidor.')
    }
    if (datosRaw.length === 0) {
      console.warn('⚠️ Aviso: window.dashboardData está vacío. El dashboard no mostrará datos.')
    }

    // Prepara, valida y normaliza los datos en un solo paso
    datosOriginales = prepararYValidarDatos(datosRaw, tipoDatos)
    const config = getConfig(tipoDatos)

    console.log(`Datos preparados para tipo: ${tipoDatos}`, datosOriginales)
    // Actualizar títulos según configuración
    actualizarTitulosDashboard(config)

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
      showSpinner()
      try {
        const datosFiltrados = aplicarFiltros()
        exportarDatos(datosFiltrados, 'csv', `${window.dashboardTipo}_dashboard`)
      } catch (error) {
        console.error('Error al exportar CSV:', error)
      } finally {
        hideSpinner()
      }
    })
  }

  // Botón exportar JSON
  const btnExportarJSON = document.getElementById('btnExportarJSON')
  if (btnExportarJSON) {
    btnExportarJSON.addEventListener('click', () => {
      showSpinner()
      try {
        const datosFiltrados = aplicarFiltros()
        exportarDatos(datosFiltrados, 'json', `${window.dashboardTipo}_dashboard`)
      } catch (error) {
        console.error('Error al exportar JSON:', error)
      } finally {
        hideSpinner()
      }
    })
  }
}

// Exportar función para uso externo
export { inicializarDashboard, exportarDatos }
// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', inicializarDashboard)
} else {
  inicializarDashboard()
}
