import ExcelJS from 'exceljs'
import { SolicitudRecetaModel } from '../models/productosSolicitud.models.js'
import { MezclaModel } from '../models/mezclas.models.js'

// utils
import logger from '../utils/logger.js'
import { NotFoundError, ValidationError, DatabaseError, CustomError } from '../utils/CustomError.js'

async function obtenerProductosPorSolicitud (idSolicitud) {
  try {
    // Asumiendo que este método existe en tu modelo
    const productos = await SolicitudRecetaModel.obtenerProductosSolicitud({ idSolicitud })

    // Verificamos que se hayan obtenido datos
    if (!productos || productos.length === 0) {
      throw new NotFoundError(`No se encontraron productos para la solicitud ${idSolicitud}`)
    }

    return productos.map(producto => ({
      id_sap: producto.id_sap, // Asegúrate de que este campo existe en tu modelo
      nombre: producto.nombre_producto, // Asegúrate de que este campo existe en tu modelo
      unidad_medida: producto.unidad_medida,
      cantidad: producto.cantidad
    }))
  } catch (error) {
    if (error instanceof CustomError) throw error
    throw new DatabaseError('Error al obtener productos para la solicitud')
  }
}
async function obtenerVariedades (idSolicitud) {
  try {
    const variedades = await MezclaModel.obtenerPorcentajes({ id: idSolicitud })
    // Verificamos que se hayan obtenido datos
    if (!variedades || variedades.length === 0) {
      throw new NotFoundError(`No se encontraron variedades para la solicitud ${idSolicitud}`)
    }

    if (variedades && variedades.length > 0) {
      return variedades.map(variedad => ({
        variedad: variedad.variedad, // Asegúrate de que este campo existe en tu modelo
        porcentajes: variedad.porcentajes
      }))
    } else {
      // Si no hay productos, puedes devolver un array vacío o productos por defecto
      return []
    }
  } catch (error) {
    if (error instanceof CustomError) throw error
    throw new DatabaseError('Error al obtener variedades para la solicitud')
  }
}
async function obtenerPorcentajes (id) {
  try {
    // Asumiendo que este método existe en tu modelo
    const variedades = await MezclaModel.obtenerPorcentajes({ id })
    // Verificamos que se hayan obtenido datos
    if (!variedades || variedades.length === 0) {
      throw new NotFoundError(`No se encontraron variedades para el centro de coste ${id}`)
    }

    return variedades
  } catch (error) {
    if (error instanceof CustomError) throw error
    throw new DatabaseError('Error al obtener variedades para el centro de coste')
  }
}

async function obtenerDatosSolicitud (idSolicitud) {
  try {
    // Asumiendo que este método existe en tu modelo
    const solicitudes = await MezclaModel.obtenerDatosSolicitud({ id: idSolicitud })
    logger.debug('solicitudes', solicitudes)
    // Verificamos que se hayan obtenido datos
    if (!solicitudes || solicitudes.length === 0) {
      throw new NotFoundError(`No se encontraron datos para la solicitud ${idSolicitud}`)
    }
    // Verificar si se obtuvieron solicitudes
    if (solicitudes && solicitudes.length > 0) {
      return solicitudes.map(solicitud => ({
        cantidad: solicitud.cantidad, // Asegúrate de que este campo existe en tu modelo
        presentacion: solicitud.presentacion,
        metodoAplicacion: solicitud.metodoAplicacion,
        descripcion: solicitud.descripcion
      }))
    } else {
      // Si no hay productos, puedes devolver un array vacío o productos por defecto
      return []
    }
  } catch (error) {
    if (error instanceof CustomError) throw error
    throw new DatabaseError('Error al obtener datos para la solicitud')
  }
}

export const crearExcel = async (parametros) => {
  try {
    // preparacion de estilos
    const font = {
      name: 'Arial',
      size: 12,
      bold: true,
      italic: false
    }

    // Extraer los datos correctamente
    const datos = Array.isArray(parametros)
      ? parametros
      : parametros.datos || []

    // Verificar si hay datos
    if (!datos || datos.length === 0) {
      throw new NotFoundError('No hay datos para generar el Excel')
    }

    // Crear un nuevo libro de Excel
    const workbook = new ExcelJS.Workbook()

    // Crear hoja principal con los datos de DataTable
    const hojaGeneral = workbook.addWorksheet('Datos Generales')
    hojaGeneral.columns = [] // Espacio vacío
    hojaGeneral.addRow([]) // Espacio vacío entre las tablas

    hojaGeneral.columns = [
      { header: 'ID Solicitud', key: 'id_solicitud', width: 15 },
      { header: 'Solicita', key: 'usuario', width: 15 },
      { header: 'Fecha Solicitud', key: 'fechaSolicitud', width: 15 },
      { header: 'Fecha Cierre', key: 'fechaCierre', width: 15 },
      { header: 'Empresa', key: 'empresa', width: 20 },
      { header: 'Rancho', key: 'rancho', width: 20 },
      { header: 'Temporada', key: 'temporada', width: 20 },
      { header: 'Folio de Receta', key: 'folio', width: 20 },
      { header: 'Centro de Coste', key: 'centroCoste', width: 20 },
      { header: 'Variedad Fruta', key: 'variedad', width: 20 }
    ]

    // Agregar datos filtrados a la hoja principal
    datos.forEach(dato => {
      hojaGeneral.addRow({
        id_solicitud: dato.id_solicitud,
        usuario: dato.usuario,
        fechaSolicitud: dato.fechaSolicitud,
        fechaCierre: dato.fechaEntrega,
        empresa: dato.empresa,
        rancho: dato.rancho,
        temporada: dato.temporada,
        folio: dato.folio,
        centroCoste: dato.centroCoste || dato.centro_coste,
        variedad: dato.variedad
      })
    })

    // Procesar cada solicitud para crear hojas personalizadas
    for (const solicitud of datos) {
      const idSolicitud = solicitud.id_solicitud || solicitud.idSolicitud
      const usuario = solicitud.usuario
      const fechaSolicitud = solicitud.fechaSolicitud
      const empresa = solicitud.empresa
      const rancho = solicitud.rancho
      const temporada = solicitud.temporada
      const folio = solicitud.folio
      const centroCoste = solicitud.centroCoste || solicitud.centro_coste
      const variedad = solicitud.variedad
      try {
        // Consultar productos relacionados en la base de datos
        const productos = await obtenerProductosPorSolicitud(idSolicitud)

        // Crear una hoja para esta solicitud
        const hojaSolicitud = workbook.addWorksheet(`Solicitud ${idSolicitud}`)
        hojaSolicitud.addRow([`Datos de la solicitud ${idSolicitud}`]) // Encabezados de la segunda tabla
        hojaSolicitud.getCell('A1').font = font

        // Agregar información de la solicitud en la primera tabla
        hojaSolicitud.addRow(['ID Solicitud', idSolicitud])
        hojaSolicitud.addRow(['Solicita', usuario])
        hojaSolicitud.addRow(['Fecha Solicitud', fechaSolicitud])
        hojaSolicitud.addRow(['Empresa', empresa])
        hojaSolicitud.addRow(['Rancho', rancho])
        hojaSolicitud.addRow(['Temporada', temporada])
        hojaSolicitud.addRow(['Folio de Receta', folio])
        hojaSolicitud.addRow(['Centro de Coste', centroCoste])
        hojaSolicitud.addRow(['Variedad Fruta', variedad])
        hojaSolicitud.addRow([]) // Espacio vacío

        // Agregar encabezados para los productos en la segunda tabla
        hojaSolicitud.addRow(['Datos de los productos solicitados']) // Encabezados de la segunda tabla
        hojaSolicitud.getCell('A12').font = font
        hojaSolicitud.addRow(['id_sap', 'Producto', 'Unidad Medida', 'Cantidad Solicitada']) // Encabezados de la segunda tabla

        // Agregar productos a la hoja
        if (productos && productos.length > 0) {
          for (let i = 0; i < productos.length; i++) {
            hojaSolicitud.addRow([
              productos[i].id_sap,
              productos[i].nombre,
              productos[i].unidad_medida,
              productos[i].cantidad
            ])
          }
        } else {
          logger.error({
            message: 'No se encontraron productos o la estructura es incorrecta',
            error: 'No se encontraron productos o la estructura es incorrecta'
          })
        }

        // Ajustar el ancho de las columnas
        hojaSolicitud.columns.forEach(column => {
          const maxLength = column.values.reduce((max, value) => {
            return Math.max(max, (value ? value.toString().length : 0))
          }, 0)
          column.width = maxLength + 2 // Añadir un poco de espacio extra
        })
      } catch (error) {
        console.error(`Error al procesar solicitud ${idSolicitud}:`, error)
        const hojaError = workbook.addWorksheet(`Error ${idSolicitud}`)
        hojaError.addRow(['Error al obtener productos para esta solicitud.'])
      }
    }

    // Retornar el buffer del archivo Excel
    return await workbook.xlsx.writeBuffer()
  } catch (error) {
    if (error instanceof CustomError) throw error
    throw new DatabaseError('Error al procesar datos para el reporte')
  }
}
export const crearSolicitudV2 = async (parametros) => {
  try {
    if (!parametros || parametros.length === 0) {
      throw new ValidationError('No se encontraron datos para la solicitud')
    }

    // Crear un nuevo libro de Excel
    const workbook = new ExcelJS.Workbook()

    // Estilo de encabezados

    const idSolicitud = parametros.id_solicitud
    const folio = parametros.folio
    const usuario = parametros.solicita
    const fechaSolicitud = parametros.fecha_solicitud
    const rancho = parametros.rancho_destino
    const centroCoste = parametros.centro_coste
    const variedad = parametros.variedad
    const empresa = parametros.empresa
    const temporada = parametros.temporada
    const cantidad = parametros.cantidad
    const presentacion = parametros.presentacion
    const metodoAplicacion = parametros.metodo_aplicacion
    const descripcion = parametros.descripcion
    try {
      // Consultar productos relacionados en la base de datos
      const productos = await obtenerProductosPorSolicitud(idSolicitud)
      const font = {
        name: 'Arial',
        size: 12,
        bold: true,
        italic: false
      }
      // Crear una hoja para esta solicitud
      const hojaGeneral = workbook.addWorksheet(`Solicitud ${idSolicitud}`)
      hojaGeneral.addRow([`Datos de la solicitud ${idSolicitud}`]) // Encabezados de la segunda tabla
      hojaGeneral.getCell('A1').font = font

      // Agregar información de la solicitud en la primera tabla
      hojaGeneral.addRow(['ID Solicitud', idSolicitud])
      hojaGeneral.addRow(['Folio de Receta', folio])
      hojaGeneral.addRow(['Solicita', usuario])
      hojaGeneral.addRow(['Fecha Solicitud', fechaSolicitud])
      hojaGeneral.addRow(['Rancho', rancho])
      hojaGeneral.addRow(['Centro de Coste', centroCoste])
      hojaGeneral.addRow(['Variedad Fruta', variedad])
      hojaGeneral.addRow(['Empresa', empresa])
      hojaGeneral.addRow(['Temporada', temporada])
      hojaGeneral.addRow(['Cantidad de Mezcla', cantidad])
      hojaGeneral.addRow(['Presentacion de la Mezcla', presentacion])
      hojaGeneral.addRow(['Metodo de aplicacion', metodoAplicacion])
      hojaGeneral.addRow(['Descripcion', descripcion])
      hojaGeneral.addRow([]) // Espacio vacío

      // Agregar encabezados para los productos en la segunda tabla
      hojaGeneral.addRow(['Datos de los productos solicitados']) // Encabezados de la segunda tabla
      hojaGeneral.getCell('A16').font = font
      hojaGeneral.addRow(['id_sap', 'Producto', 'Unidad Medida', 'Cantidad Solicitada']) // Encabezados de la segunda tabla

      // Agregar productos a la hoja
      if (productos && productos.length > 0) {
        for (let i = 0; i < productos.length; i++) {
          hojaGeneral.addRow([
            productos[i].id_sap,
            productos[i].nombre,
            productos[i].unidad_medida,
            productos[i].cantidad
          ])
        }
      } else {
        logger.info('No se encontraron productos o la estructura es incorrecta')
      }

      // Ajustar el ancho de las columnas
      hojaGeneral.columns.forEach(column => {
        const maxLength = column.values.reduce((max, value) => {
          return Math.max(max, (value ? value.toString().length : 0))
        }, 0)
        column.width = maxLength + 2 // Añadir un poco de espacio extra
      })
    } catch (error) {
      const hojaError = workbook.addWorksheet(`Error ${idSolicitud}`)
      hojaError.addRow(['Error al obtener productos para esta solicitud.'])
      // Manejo de errores
      if (error instanceof CustomError) throw error
      throw new DatabaseError('Error al procesar datos para el reporte')
    }

    // Retornar el buffer del archivo Excel
    return await workbook.xlsx.writeBuffer()
  } catch (error) {
    if (error instanceof CustomError) throw error
    throw new DatabaseError('Error al procesar datos para el reporte')
  }
}
// Crear Reporte Solicitud
export const reporteSolicitud = async (parametros) => {
  // Definir estilos
  const headerStyle = {
    font: { bold: true, color: { argb: 'FFFFFFFF' } },
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4F81BD' } },
    border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } },
    alignment: { vertical: 'middle', horizontal: 'center' }
  }

  const cellStyle = {
    font: { color: { argb: 'FF000000' } },
    border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } },
    alignment: { vertical: 'middle', horizontal: 'left' }
  }
  // varialbles globales
  let variedades
  let filtrados = []
  try {
    // Extraer los datos correctamente
    const datos = Array.isArray(parametros)
      ? parametros
      : parametros.datos || []

    // console.log('Datos a procesar:', datos)

    // Verificar si hay datos
    if (!datos || datos.length === 0) {
      throw new NotFoundError('No hay datos para generar el Excel')
    }

    // Crear un nuevo libro de Excel
    const workbook = new ExcelJS.Workbook()

    // Cabecera de la tabla
    let cabecera = ['id_sap', 'Productos', 'Unidad', 'Cantidad Solicitada']
    let porcentaje = ['', '', '']

    try {
      // Crear una hoja para esta solicitud
      const hojaGeneral = workbook.addWorksheet('Datos Generales')
      // obtenemos datos de la variedad
      for (const dato of datos) {
        if (dato.variedad.split(',').length > 1) {
          // Obtener variedades
          variedades = await obtenerVariedades(dato.id)
          // console.log('Variedades obtenidas:', variedades)

          // Agregar nombres de variedades a la cabecera
          if (variedades && variedades.length > 0) {
            for (const variedad of variedades) {
              const variedadSplit = variedad.variedad.split(',')
              const porcentajeSplit = variedad.porcentajes.split(',')
              // Filtrar ambos arrays en paralelo
              filtrados = variedadSplit.reduce((acc, variedad, index) => {
                if (parseInt(porcentajeSplit[index].trim()) !== 0) {
                  acc.variedades.push(variedad)
                  acc.porcentajes.push(porcentajeSplit[index])
                }
                return acc
              }, { variedades: [], porcentajes: [] })

              for (const item of filtrados.variedades) {
                if (!cabecera.includes(item)) {
                  cabecera.push(item)
                }
              }
              for (const item of porcentajeSplit) {
                if (!porcentaje.includes(item)) {
                  porcentaje.push(item)
                }
              }
            }
          }
        } else {
          cabecera.push(dato.variedad)
        }

        if (dato.variedad.split(',').length > 1) {
          hojaGeneral.addRow(['Datos Generales Fertilizantes']).eachCell((cell) => { cell.style = headerStyle }) // Encabezado de la hoja

          hojaGeneral.addRow(['ID Solicitud', dato.id_solicitud ? dato.id_solicitud : dato.id]).eachCell((cell) => { cell.style = cellStyle })
          hojaGeneral.addRow(['Solicita', dato.usuario]).eachCell((cell) => { cell.style = cellStyle })
          hojaGeneral.addRow(['Fecha Solicitud', dato.fechaSolicitud]).eachCell((cell) => { cell.style = cellStyle })
          hojaGeneral.addRow(['Fecha Entrega', dato.fechaEntrega]).eachCell((cell) => { cell.style = cellStyle })
          hojaGeneral.addRow(['Rancho', dato.rancho]).eachCell((cell) => { cell.style = cellStyle })
          hojaGeneral.addRow(['Centro de Coste', dato.centroCoste || dato.centro_coste]).eachCell((cell) => { cell.style = cellStyle })
          hojaGeneral.addRow(['Variedad Fruta', dato.variedad !== 'todo' ? dato.variedad : filtrados.variedades]).eachCell((cell) => { cell.style = cellStyle })
          hojaGeneral.addRow(['Empresa', dato.empresa]).eachCell((cell) => { cell.style = cellStyle })
          hojaGeneral.addRow(['Temporada', dato.temporada]).eachCell((cell) => { cell.style = cellStyle })
          hojaGeneral.addRow(['Descripcion', dato.descripcion]).eachCell((cell) => { cell.style = cellStyle })
        } else {
          hojaGeneral.addRow(['Datos Generales Mezclas']).eachCell((cell) => { cell.style = headerStyle }) // Encabezado de la hoja

          // obtenemos datos faltantes de la solicitud
          const datosF = await obtenerDatosSolicitud(dato.id_solicitud ? dato.id_solicitud : dato.id)
          // console.log('Datos de la solicitud:', datosF)

          hojaGeneral.addRow(['ID Solicitud', dato.id_solicitud ? dato.idSolicitud : dato.id]).eachCell((cell) => { cell.style = cellStyle })
          hojaGeneral.addRow(['Folio de Receta', dato.folio ? dato.folio : dato.FolioReceta]).eachCell((cell) => { cell.style = cellStyle })
          hojaGeneral.addRow(['Solicita', dato.usuario ? dato.usuario : dato.Solicita]).eachCell((cell) => { cell.style = cellStyle })
          hojaGeneral.addRow(['Fecha Solicitud', dato.fechaSolicitud]).eachCell((cell) => { cell.style = cellStyle })
          hojaGeneral.addRow(['Fecha Entrega', dato.fechaEntrega ? dato.fechaEntrega : 'No aplica']).eachCell((cell) => { cell.style = cellStyle })
          hojaGeneral.addRow(['Rancho', dato.rancho ? dato.rancho : dato.ranchoDestino]).eachCell((cell) => { cell.style = cellStyle })
          hojaGeneral.addRow(['Centro de Coste', dato.centroCoste || dato.centro_coste]).eachCell((cell) => { cell.style = cellStyle })
          hojaGeneral.addRow(['Variedad Fruta', dato.variedad !== 'todo' ? dato.variedad : filtrados.variedades]).eachCell((cell) => { cell.style = cellStyle })
          hojaGeneral.addRow(['Empresa', dato.empresa]).eachCell((cell) => { cell.style = cellStyle })
          hojaGeneral.addRow(['Temporada', dato.temporada]).eachCell((cell) => { cell.style = cellStyle })
          hojaGeneral.addRow(['Cantidad de Mezcla', datosF[0].cantidad]).eachCell((cell) => { cell.style = cellStyle })
          hojaGeneral.addRow(['Presentacion de la Mezcla', datosF[0].presentacion]).eachCell((cell) => { cell.style = cellStyle })
          hojaGeneral.addRow(['Metodo de aplicacion', datosF[0].metodoAplicacion]).eachCell((cell) => { cell.style = cellStyle })
          hojaGeneral.addRow(['Descripcion', dato.descripcion]).eachCell((cell) => { cell.style = cellStyle })
        }
        // Agregar información de la solicitud
        hojaGeneral.addRow([]) // Espacio vacío con estilo

        // Agregar la cabecera a la hoja
        hojaGeneral.addRow(porcentaje)
        hojaGeneral.addRow(cabecera).eachCell((cell) => { cell.style = headerStyle })
        // limpiamos cabeceras
        cabecera = ['id_sap', 'Productos', 'Unidad', 'Cantidad Solicitada']
        porcentaje = ['', '', '']

        // Obtener productos de la base de datos
        const productos = await obtenerProductosPorSolicitud(dato.id_solicitud ? dato.id_solicitud : dato.id)
        // console.log('Productos obtenidos:', productos)

        // Crear el arreglo de datos
        const data = []
        if (productos && productos.length > 0) {
          for (const producto of productos) {
            const fila = [
              producto.id_sap,
              producto.nombre,
              producto.unidad_medida,
              producto.cantidad
            ]

            // Calcular porcentajes de variedades
            if (dato.variedad.split(',').length > 1) {
              if (variedades && variedades.length > 0) {
                for (const variedad of filtrados) {
                  const variedadSplit = variedad.porcentajes.split(',')
                  for (const item of variedadSplit) {
                    const porcentajeVariedad = (producto.cantidad * item) / 100
                    fila.push(porcentajeVariedad)
                  }
                }
              }
            } else {
              fila.push(producto.cantidad)
            }
            data.push(fila)
          }
        } else {
          logger.info('No se encontraron productos o la estructura es incorrecta')
        }

        // Agregar los datos a la hoja
        data.forEach(row => {
          hojaGeneral.addRow(row).eachCell((cell) => { cell.style = cellStyle })
        })

        // Agregar un separador entre solicitudes
        hojaGeneral.addRow([])
        hojaGeneral.addRow([])
        hojaGeneral.addRow(['', '', '', '', '', '', '', '', '', '']).eachCell((cell) => {
          cell.border = {
            top: { style: 'thick', color: { argb: '00000000' } },
            bottom: { style: 'thick', color: { argb: '00000000' } }
          }
        })
        hojaGeneral.addRow([])
        hojaGeneral.addRow([])
        // Agregar un separador entre solicitudes
      }

      // Ajustar el ancho de las columnas
      hojaGeneral.columns.forEach(column => {
        const maxLength = column.values.reduce((max, value) => {
          return Math.max(max, (value ? value.toString().length : 0))
        }, 0)
        column.width = maxLength + 2 // Añadir un poco de espacio extra
      })
    } catch (error) {
      const hojaError = workbook.addWorksheet('Error')
      hojaError.addRow(['Error al obtener productos para esta solicitud.'])

      logger.error({
        message: 'Error al procesar solicitud',
        error: error.message,
        stack: error.stack,
        method: 'reporteSolicitudv3'
      })

      if (error instanceof CustomError) throw error
      throw new DatabaseError('Error al procesar datos para el reporte')
    }

    // Retornar el buffer del archivo Excel
    return await workbook.xlsx.writeBuffer()
  } catch (error) {
    if (error instanceof CustomError) throw error
    throw new DatabaseError('Error al procesar datos para el reporte')
  }
}
export const reporteSolicitudV2 = async (parametros) => {
  // console.log(parametros)
  // Definir estilos
  const headerStyle = {
    font: { bold: true, color: { argb: 'FFFFFFFF' } },
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4F81BD' } },
    border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } },
    alignment: { vertical: 'middle', horizontal: 'center' }
  }

  const cellStyle = {
    font: { color: { argb: 'FF000000' } },
    border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } },
    alignment: { vertical: 'middle', horizontal: 'left' }
  }
  // varialbles globales
  let variedades
  const dataMescla = []
  // const dataFertilizante = []
  try {
    // Extraer los datos correctamente
    const datos = Array.isArray(parametros)
      ? parametros
      : parametros.datos || []

    // console.log('Datos a procesar:', datos)

    // Crear un nuevo libro de Excel
    const workbook = new ExcelJS.Workbook()

    // Cabecera de la tabla mezclas
    const cabeceraMezclas = [
      'Id Solicitud',
      'Folio de Receta',
      'Solicita',
      'Comentario de solicitante',
      'Fecha Solicitud',
      'Fecha Entrega',
      'Rancho',
      'Centro de Coste',
      'Empresa',
      'Temporada',
      'Variedad Fruta',
      'Cantidad de Mezcla',
      'Presentacion de la Mezcla',
      'Metodo de aplicacion',
      'id_sap',
      'Productos',
      'Unidad',
      'Cantidad Solicitada',
      'Porcentaje Correspondiente',
      'Cantidad Correspondiente'
    ]

    try {
      // Crear una hoja para esta solicitud
      const hojaGeneral = workbook.addWorksheet('Datos Generales')
      hojaGeneral.addRow(cabeceraMezclas).eachCell((cell) => { cell.style = headerStyle })

      // obtenemos datos de la variedad
      for (const dato of datos) {
        // // obtenemos datos faltantes de la solicitud
        const datosF = await obtenerDatosSolicitud(dato.id_solicitud ? dato.id_solicitud : dato.id)
        console.log('Datos de la solicitud:', datosF)
        console.log('Datos de la solicitud:', datosF[0].descripcion)

        // // Obtener productos de la base de datos
        const productos = await obtenerProductosPorSolicitud(dato.id_solicitud ? dato.id_solicitud : dato.id)
        // console.log('Productos obtenidos:', productos)
        // Crear el arreglo de datos
        if (dato.variedad.split(',').length > 1) {
          variedades = await obtenerPorcentajes(dato.id_solicitud ? dato.id_solicitud : dato.id)
          // console.log('Variedades obtenidas:', variedades)
          if (variedades && variedades.length > 0) {
            for (const variedad of variedades) {
              const porcentajeSplit = variedad.dataValues.porcentajes.split(',')
              const variedadSplit = dato.variedad.split(',')
              for (let i = 0; i < variedadSplit.length; i++) {
                if (productos && productos.length > 0) {
                  for (const producto of productos) {
                    const fila = [
                      dato.id_solicitud,
                      dato.folio ? dato.folio : 'No aplica',
                      dato.usuario,
                      datosF[0].descripcion ? datosF[0].descripcion : 'hola',
                      dato.fechaSolicitud,
                      dato.fechaEntrega,
                      dato.rancho,
                      dato.centroCoste,
                      dato.empresa,
                      dato.temporada,
                      variedadSplit[i],
                      datosF[0].cantidad ? datosF[0].cantidad : 'No aplica',
                      datosF[0].presentacion ? datosF[0].presentacion : 'No aplica',
                      datosF[0].metodoAplicacion,
                      producto.id_sap,
                      producto.nombre,
                      producto.unidad_medida,
                      producto.cantidad,
                      '%' + porcentajeSplit[i],
                      (producto.cantidad * porcentajeSplit[i]) / 100
                    ]
                    dataMescla.push(fila)
                  }
                } else {
                  console.error('No se encontraron productos o la estructura es incorrecta')
                }
              }
            }
          } else {
            console.error('No se encontraron productos o la estructura es incorrecta')
          }
        } else {
          for (const producto of productos) {
            const fila = [
              dato.id_solicitud,
              dato.folio ? dato.folio : 'No aplica',
              dato.usuario,
              datosF[0].descripcion ? datosF[0].descripcion : 'hola',
              dato.fechaSolicitud,
              dato.fechaEntrega,
              dato.rancho,
              dato.centroCoste,
              dato.empresa,
              dato.temporada,
              dato.variedad,
              datosF[0].cantidad ? datosF[0].cantidad : 'No aplica',
              datosF[0].presentacion ? datosF[0].presentacion : 'No aplica',
              datosF[0].metodoAplicacion,
              producto.id_sap,
              producto.nombre,
              producto.unidad_medida,
              producto.cantidad,
              '% 100',
              producto.cantidad
            ]
            dataMescla.push(fila)
          }
        }
      }
      // Agregar los datos a la hoja de mezclas
      dataMescla.forEach(row => {
        hojaGeneral.addRow(row).eachCell((cell) => { cell.style = cellStyle })
      })
      // Ajustar el ancho de las columnas
      hojaGeneral.columns.forEach(column => {
        const maxLength = column.values.reduce((max, value) => {
          return Math.max(max, (value ? value.toString().length : 0))
        }, 0)
        column.width = maxLength + 2 // Añadir un poco de espacio extra
      })
    } catch (error) {
      console.error('Error al procesar solicitud:', error)
      const hojaError = workbook.addWorksheet('Error')
      hojaError.addRow(['Error al obtener productos para esta solicitud.'])
    }

    // Retornar el buffer del archivo Excel
    return await workbook.xlsx.writeBuffer()
  } catch (error) {
    console.error('Error general al generar Excel:', error)
    throw error
  }
}
export const crearSolicitud = async (parametros) => { // Definir estilos
  const headerStyle = {
    font: { bold: true, color: { argb: 'FFFFFFFF' } },
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4F81BD' } },
    border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } },
    alignment: { vertical: 'middle', horizontal: 'center' }
  }

  const cellStyle = {
    font: { color: { argb: 'FF000000' } },
    border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } },
    alignment: { vertical: 'middle', horizontal: 'left' }
  }
  // varialbles globales
  let variedades
  let filtrados

  try {
    // Crear un nuevo libro de Excel
    const workbook = new ExcelJS.Workbook()

    // Cabecera de la tabla
    let cabecera = ['id_sap', 'Productos', 'Unidad', 'Cantidad Solicitada']

    // preparamos datos
    const idSolicitud = parametros.id_solicitud
    const folio = parametros.folio
    const usuario = parametros.solicita
    const fechaSolicitud = parametros.fecha_solicitud
    const rancho = parametros.rancho_destino
    const centroCoste = parametros.centro_coste
    const variedad = parametros.variedad
    const empresa = parametros.empresa
    const temporada = parametros.temporada
    const cantidad = parametros.cantidad
    const presentacion = parametros.presentacion
    const metodoAplicacion = parametros.metodo_aplicacion
    const descripcion = parametros.descripcion

    const varie = variedad.split(',')
    // console.log(varie)
    try {
      // Crear una hoja para esta solicitud
      const hojaGeneral = workbook.addWorksheet('Datos Generales')

      // Modificación del manejo de variedades múltiples
      if (varie.length > 1) {
        variedades = await obtenerPorcentajes(idSolicitud)

        if (variedades && variedades.length > 0) {
          // Arrays para almacenar todas las variedades y porcentajes únicos
          const todasVariedades = []
          const todosPorcentajes = []

          // Primero recolectamos todas las variedades y porcentajes
          variedades.forEach(variedad => {
            const variedadSplit = varie
            const porcentajeSplit = variedad.dataValues.porcentajes.split(',')
            // Filtrar ambos arrays en paralelo
            filtrados = variedadSplit.reduce((acc, variedad, index) => {
              if (parseInt(porcentajeSplit[index].trim()) !== 0) {
                acc.variedades.push(variedad)
                acc.porcentajes.push(porcentajeSplit[index])
              }
              return acc
            }, { variedades: [], porcentajes: [] })

            filtrados.variedades.forEach((v, index) => {
              if (!todasVariedades.includes(v)) {
                todasVariedades.push(v + ' ' + '%' + filtrados.porcentajes[index])
                todosPorcentajes.push(porcentajeSplit[index])
              }
            })
          })

          // Ahora agregamos a las cabeceras
          todasVariedades.forEach(v => {
            if (!cabecera.includes(v)) {
              cabecera.push(v)
            }
          })
        }
      } else {
        cabecera.push(variedad)
      }

      hojaGeneral.addRow(['Datos Generales Mezclas']).eachCell((cell) => { cell.style = headerStyle }) // Encabezado de la hoja

      hojaGeneral.addRow(['ID Solicitud', idSolicitud]).eachCell((cell) => { cell.style = cellStyle })
      hojaGeneral.addRow(['Folio de Receta', folio === '' ? 'No aplica' : folio]).eachCell((cell) => { cell.style = cellStyle })
      hojaGeneral.addRow(['Solicita', usuario]).eachCell((cell) => { cell.style = cellStyle })
      hojaGeneral.addRow(['Fecha Solicitud', fechaSolicitud]).eachCell((cell) => { cell.style = cellStyle })
      hojaGeneral.addRow(['Rancho', rancho]).eachCell((cell) => { cell.style = cellStyle })
      hojaGeneral.addRow(['Centro de Coste', centroCoste]).eachCell((cell) => { cell.style = cellStyle })
      hojaGeneral.addRow(['Variedad Fruta', variedad]).eachCell((cell) => { cell.style = cellStyle })
      hojaGeneral.addRow(['Empresa', empresa]).eachCell((cell) => { cell.style = cellStyle })
      hojaGeneral.addRow(['Temporada', temporada]).eachCell((cell) => { cell.style = cellStyle })
      hojaGeneral.addRow(['Cantidad de Mezcla', cantidad === '' ? 'No aplica' : cantidad]).eachCell((cell) => { cell.style = cellStyle })
      hojaGeneral.addRow(['Presentacion de la Mezcla', presentacion === '' ? 'No aplica' : presentacion]).eachCell((cell) => { cell.style = cellStyle })
      hojaGeneral.addRow(['Metodo de aplicacion', metodoAplicacion]).eachCell((cell) => { cell.style = cellStyle })
      hojaGeneral.addRow(['Descripcion', descripcion]).eachCell((cell) => { cell.style = cellStyle })

      // Agregar información de la solicitud
      hojaGeneral.addRow([]) // Espacio vacío con estilo

      // Agregar la cabecera a la hoja

      hojaGeneral.addRow(cabecera).eachCell((cell) => { cell.style = headerStyle })
      // limpiamos cabeceras
      cabecera = ['id_sap', 'Productos', 'Unidad', 'Cantidad Solicitada']

      // Obtener productos de la base de datos
      const productos = await obtenerProductosPorSolicitud(idSolicitud)

      // Crear el arreglo de datos
      const data = []
      if (productos && productos.length > 0) {
        productos.forEach(producto => {
          const fila = [
            producto.id_sap,
            producto.nombre,
            producto.unidad_medida,
            producto.cantidad
          ]

          if (varie.length > 1 && variedades && variedades.length > 0) {
            // Agregamos un valor para cada variedad
            filtrados.porcentajes.forEach(porcentaje => {
              const cantidadPorcentaje = (producto.cantidad * parseFloat(porcentaje)) / 100
              fila.push(Number(cantidadPorcentaje.toFixed(2))) // Redondear a 2 decimales
            })
          } else {
            fila.push(producto.cantidad)
          }

          data.push(fila)
        })
      } else {
        logger.info('No se encontraron productos o la estructura es incorrecta')
      }

      // Agregar los datos a la hoja
      data.forEach(row => {
        hojaGeneral.addRow(row).eachCell((cell) => { cell.style = cellStyle })
      })

      // Ajustar el ancho de las columnas
      hojaGeneral.columns.forEach(column => {
        const maxLength = column.values.reduce((max, value) => {
          return Math.max(max, (value ? value.toString().length : 0))
        }, 0)
        column.width = maxLength + 2 // Añadir un poco de espacio extra
      })
    } catch (error) {
      const hojaError = workbook.addWorksheet('Error')
      hojaError.addRow(['Error al obtener productos para esta solicitud.'])
      // Manejo de errores
      logger.error({
        message: 'Error al procesar solicitud',
        error: error.message,
        stack: error.stack,
        method: 'reporteSolicitudV2'
      })
      if (error instanceof CustomError) throw error
      throw new DatabaseError('Error al procesar datos para el reporte')
    }

    // Retornar el buffer del archivo Excel
    return await workbook.xlsx.writeBuffer()
  } catch (error) {
    console.error('Error general al generar Excel:', error)
    throw error
  }
}

// Extraer estilos a un objeto de configuración
const EXCEL_STYLES = {
  header: {
    font: { bold: true, color: { argb: 'FFFFFFFF' } },
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4F81BD' } },
    border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } },
    alignment: { vertical: 'middle', horizontal: 'center' }
  },
  cell: {
    font: { color: { argb: 'FF000000' } },
    border: { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } },
    alignment: { vertical: 'middle', horizontal: 'left' }
  }
}

// Separar la lógica de procesamiento de datos
const procesarDatosSolicitud = async (dato) => {
  const idSolicitud = dato.id_solicitud || dato.id

  const productos = await obtenerProductosPorSolicitud(idSolicitud)
  if (!productos?.length) {
    throw new NotFoundError('No se encontraron productos para la solicitud')
  }

  // Procesar variedades si es necesario
  let variedadesInfo = null
  if (dato.variedad.split(',').length > 1) {
    variedadesInfo = await procesarVariedades(idSolicitud)
  }

  return {
    productos,
    variedadesInfo,
    datosSolicitud: await obtenerDatosSolicitud(idSolicitud)
  }
}

// Separar la generación de filas
const generarFilasProductos = (productos, variedadesInfo) => {
  return productos.map(producto => {
    const fila = [
      producto.id_sap,
      producto.nombre,
      producto.unidad_medida,
      producto.cantidad
    ]

    if (variedadesInfo) {
      variedadesInfo.porcentajes.forEach(porcentaje => {
        const cantidad = (producto.cantidad * parseFloat(porcentaje)) / 100
        fila.push(Number(cantidad.toFixed(2)))
      })
    } else {
      fila.push(producto.cantidad)
    }

    return fila
  })
}

const procesarVariedades = async (idSolicitud) => {
  const variedades = await obtenerVariedades(idSolicitud)
  if (!variedades?.length) {
    throw new NotFoundError('No se encontraron variedades para el centro de coste')
  }

  // Convertir a array, eliminar último elemento y volver a string
  const variedadesArray = variedades[0].variedad.split(',')
  const porcentajesArray = variedades[0].porcentajes.split(',')

  // Filtrar ambos arrays en paralelo
  const filtrados = variedadesArray.reduce((acc, variedad, index) => {
    if (parseInt(porcentajesArray[index].trim()) !== 0) {
      acc.variedades.push(variedad)
      acc.porcentajes.push(porcentajesArray[index])
    }
    return acc
  }, { variedades: [], porcentajes: [] })

  return filtrados
}

// Agregar encabezados a la hoja
const agregarEncabezadoSolicitud = async (hojaGeneral, dato, datosSolicitud, variedadesInfo) => {
  // Agregar encabezados
  hojaGeneral.addRow(['Datos Generales']).eachCell((cell) => { cell.style = EXCEL_STYLES.header })

  // Cabecera de la tabla
  let cabecera = ['id_sap', 'Productos', 'Unidad', 'Cantidad Solicitada']
  let porcentaje = ['', '', '']
  const todasVariedades = []

  // obtenemos datos faltantes de la solicitud
  if (dato.variedad.split(',').length > 1) {
    // Filtrar ambos arrays en paralelo
    variedadesInfo.variedades.forEach((v, index) => {
      if (!todasVariedades.includes(v)) {
        todasVariedades.push(v + ' ' + '%' + variedadesInfo.porcentajes[index])
      }
    })
  } else {
    cabecera.push(dato.variedad)
  }
  // Ahora agregamos a las cabeceras
  todasVariedades.forEach(v => {
    if (!cabecera.includes(v)) {
      cabecera.push(v)
    }
  })
  hojaGeneral.addRow(['ID Solicitud', dato.id_solicitud ? dato.id_solicitud : dato.id]).eachCell((cell) => { cell.style = EXCEL_STYLES.cell })
  hojaGeneral.addRow(['Folio de Receta', dato.FolioReceta === '' || dato.folio === '' ? 'No aplica' : dato.FolioReceta || dato.folio]).eachCell((cell) => { cell.style = EXCEL_STYLES.cell })
  hojaGeneral.addRow(['Solicita', dato.usuario ? dato.usuario : dato.Solicita]).eachCell((cell) => { cell.style = EXCEL_STYLES.cell })
  hojaGeneral.addRow(['Comentario de solicitante', datosSolicitud[0].respuestaSolicitud === '' ? 'Sin Comentario' : datosSolicitud[0].respuestaSolicitud]).eachCell((cell) => { cell.style = EXCEL_STYLES.cell })
  hojaGeneral.addRow(['Fecha Solicitud', dato.fechaSolicitud]).eachCell((cell) => { cell.style = EXCEL_STYLES.cell })
  hojaGeneral.addRow(['Fecha Entrega', dato.fechaEntrega ? dato.fechaEntrega : 'No aplica']).eachCell((cell) => { cell.style = EXCEL_STYLES.cell })
  hojaGeneral.addRow(['Rancho', dato.rancho ? dato.rancho : dato.ranchoDestino]).eachCell((cell) => { cell.style = EXCEL_STYLES.cell })
  hojaGeneral.addRow(['Centro de Coste', dato.centroCoste || dato.centro_coste]).eachCell((cell) => { cell.style = EXCEL_STYLES.cell })
  hojaGeneral.addRow(['Variedad Fruta', dato.variedad]).eachCell((cell) => { cell.style = EXCEL_STYLES.cell })
  hojaGeneral.addRow(['Empresa', dato.empresa]).eachCell((cell) => { cell.style = EXCEL_STYLES.cell })
  hojaGeneral.addRow(['Temporada', dato.temporada]).eachCell((cell) => { cell.style = EXCEL_STYLES.cell })
  hojaGeneral.addRow(['Cantidad de Mezcla', datosSolicitud[0].cantidad === '' ? 'No aplica' : datosSolicitud[0].cantidad]).eachCell((cell) => { cell.style = EXCEL_STYLES.cell })
  hojaGeneral.addRow(['Presentacion de la Mezcla', datosSolicitud[0].cantidad === '' ? 'No aplica' : datosSolicitud[0].cantidad]).eachCell((cell) => { cell.style = EXCEL_STYLES.cell })
  hojaGeneral.addRow(['Metodo de aplicacion', datosSolicitud[0].metodoAplicacion]).eachCell((cell) => { cell.style = EXCEL_STYLES.cell })
  hojaGeneral.addRow(['Descripcion', dato.descripcion]).eachCell((cell) => { cell.style = EXCEL_STYLES.cell })

  // Agregar información de la solicitud
  hojaGeneral.addRow([]) // Espacio vacío con estilo

  // Agregar la cabecera a la hoja
  hojaGeneral.addRow(porcentaje)
  hojaGeneral.addRow(cabecera).eachCell((cell) => { cell.style = EXCEL_STYLES.header })
  // limpiamos cabeceras
  cabecera = ['id_sap', 'Productos', 'Unidad', 'Cantidad Solicitada']
  porcentaje = ['', '', '']
}

const agregarFilasProductos = (hojaGeneral, filas) => {
  filas.forEach(fila => {
    hojaGeneral.addRow(fila).eachCell((cell) => { cell.style = EXCEL_STYLES.cell })
  })
}

const agregarSeparador = (hojaGeneral) => {
  hojaGeneral.addRow([])
  hojaGeneral.addRow([])
  hojaGeneral.addRow(['', '', '', '', '', '', '', '', '', '']).eachCell((cell) => {
    cell.border = {
      top: { style: 'thick', color: { argb: '00000000' } },
      bottom: { style: 'thick', color: { argb: '00000000' } }
    }
  })
  hojaGeneral.addRow([])
  hojaGeneral.addRow([])
}
const ajustarColumnasExcel = (hojaGeneral) => {
  hojaGeneral.columns.forEach(column => {
    const maxLength = column.values.reduce((max, value) => {
      return Math.max(max, (value ? value.toString().length : 0))
    }, 0)
    column.width = maxLength + 2 // Añadir un poco de espacio extra
  })
}
// uso
export const reporteSolicitudv3 = async (parametros) => {
  try {
    logger.debug('reporteSolicitudv3', parametros)

    const datos = Array.isArray(parametros) ? parametros : parametros.datos || []
    if (!datos.length) throw new NotFoundError('No hay datos para generar el Excel')

    const workbook = new ExcelJS.Workbook()
    const hojaGeneral = workbook.addWorksheet('Datos Generales')

    for (const dato of datos) {
      try {
        const { productos, variedadesInfo, datosSolicitud } = await procesarDatosSolicitud(dato)

        // Agregar encabezados
        agregarEncabezadoSolicitud(hojaGeneral, dato, datosSolicitud, variedadesInfo)

        // Agregar productos
        const filas = generarFilasProductos(productos, variedadesInfo)
        // console.table(filas)
        agregarFilasProductos(hojaGeneral, filas)

        // Agregar separador
        agregarSeparador(hojaGeneral)
      } catch (error) {
        logger.error(`Error procesando solicitud ${dato.id_solicitud || dato.id}:`, error)
        continue // Continuar con la siguiente solicitud
      }
    }

    ajustarColumnasExcel(hojaGeneral)
    return await workbook.xlsx.writeBuffer()
  } catch (error) {
    if (error instanceof CustomError) throw error
    throw new DatabaseError('Error al procesar datos para el reporte')
  }
}
