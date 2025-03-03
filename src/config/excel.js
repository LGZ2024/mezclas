import ExcelJS from 'exceljs'
import { SolicitudRecetaModel } from '../models/productosSolicitud.models.js'
import { CentroCosteModel } from '../models/centro.models.js'
import { MezclaModel } from '../models/mezclas.models.js'

async function obtenerProductosPorSolicitud (idSolicitud) {
  try {
    // Asumiendo que este método existe en tu modelo
    const productos = await SolicitudRecetaModel.obtenerProductosSolicitud({ idSolicitud })
    // Verificar si se obtuvieron productos
    if (productos && productos.length > 0) {
      return productos.map(producto => ({
        nombre: producto.nombre_producto, // Asegúrate de que este campo existe en tu modelo
        unidad_medida: producto.unidad_medida,
        cantidad: producto.cantidad
      }))
    } else {
      // Si no hay productos, puedes devolver un array vacío o productos por defecto
      return []
    }
  } catch (error) {
    console.error(`Error al consultar productos para la solicitud ${idSolicitud}:`, error)
    // Puedes lanzar el error o devolver un array vacío o productos por defecto
    return [] // O puedes lanzar el error si prefieres manejarlo en otro lugar
  }
}
async function obtenerVariedades (centroCoste) {
  try {
    // Asumiendo que este método existe en tu modelo
    const variedades = await CentroCosteModel.getVariedadPorCentroCosteNombre({ centroCoste })
    // Verificar si se obtuvieron variedades
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
    console.error('Error al consultar productos para la solicitud', error)
    // Puedes lanzar el error o devolver un array vacío o productos por defecto
    return [] // O puedes lanzar el error si prefieres manejarlo en otro lugar
  }
}
async function obtenerDatosSolicitud (idSolicitud) {
  try {
    // Asumiendo que este método existe en tu modelo
    const solicitudes = await MezclaModel.obtenerDatosSolicitud({ id: idSolicitud })
    // Verificar si se obtuvieron solicitudes
    if (solicitudes && solicitudes.length > 0) {
      return solicitudes.map(solicitud => ({
        cantidad: solicitud.cantidad, // Asegúrate de que este campo existe en tu modelo
        presentacion: solicitud.presentacion,
        metodoAplicacion: solicitud.metodoAplicacion
      }))
    } else {
      // Si no hay productos, puedes devolver un array vacío o productos por defecto
      return []
    }
  } catch (error) {
    console.error('Error al consultar productos para la solicitud', error)
    // Puedes lanzar el error o devolver un array vacío o productos por defecto
    return [] // O puedes lanzar el error si prefieres manejarlo en otro lugar
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

    console.log('Datos a procesar:', datos)
    // Verificar si hay datos
    if (!datos || datos.length === 0) {
      throw new Error('No hay datos para generar el Excel')
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
        // console.log(productos)
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
        hojaSolicitud.addRow(['Producto', 'Unidad Medida', 'Cantidad Solicitada']) // Encabezados de la segunda tabla

        // Agregar productos a la hoja
        if (productos && productos.length > 0) {
          for (let i = 0; i < productos.length; i++) {
            hojaSolicitud.addRow([
              productos[i].nombre,
              productos[i].unidad_medida,
              productos[i].cantidad
            ])
          }
        } else {
          console.error('No se encontraron productos o la estructura es incorrecta')
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
    console.error('Error general al generar Excel:', error)
    throw error
  }
}
export const crearSolicitudV2 = async (parametros) => {
  try {
    console.log('Datos a procesar:', parametros)
    // Verificar si hay datos
    if (!parametros || parametros.length === 0) {
      throw new Error('No hay datos para generar el Excel')
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
      hojaGeneral.addRow(['Producto', 'Unidad Medida', 'Cantidad Solicitada']) // Encabezados de la segunda tabla

      // Agregar productos a la hoja
      if (productos && productos.length > 0) {
        for (let i = 0; i < productos.length; i++) {
          hojaGeneral.addRow([
            productos[i].nombre,
            productos[i].unidad_medida,
            productos[i].cantidad
          ])
        }
      } else {
        console.error('No se encontraron productos o la estructura es incorrecta')
      }

      // Ajustar el ancho de las columnas
      hojaGeneral.columns.forEach(column => {
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

    // Retornar el buffer del archivo Excel
    return await workbook.xlsx.writeBuffer()
  } catch (error) {
    console.error('Error general al generar Excel:', error)
    throw error
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

  try {
    // Extraer los datos correctamente
    const datos = Array.isArray(parametros)
      ? parametros
      : parametros.datos || []

    console.log('Datos a procesar:', datos)

    // Crear un nuevo libro de Excel
    const workbook = new ExcelJS.Workbook()

    // Cabecera de la tabla
    let cabecera = ['Productos', 'Unidad', 'Cantidad Solicitada']
    let porcentaje = ['', '', '']

    try {
      // Crear una hoja para esta solicitud
      const hojaGeneral = workbook.addWorksheet('Datos Generales')
      // obtenemos datos de la variedad
      for (const dato of datos) {
        if (dato.variedad === 'todo') {
          // Obtener variedades
          variedades = await obtenerVariedades(dato.centroCoste)
          console.log('Variedades obtenidas:', variedades)

          // Agregar nombres de variedades a la cabecera
          if (variedades && variedades.length > 0) {
            for (const variedad of variedades) {
              const variedadSplit = variedad.variedad.split(',')
              const porcentajeSplit = variedad.porcentajes.split(',')
              for (const item of variedadSplit) {
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

        if (dato.variedad === 'todo') {
          hojaGeneral.addRow(['Datos Generales Fertilizantes']).eachCell((cell) => { cell.style = headerStyle }) // Encabezado de la hoja

          hojaGeneral.addRow(['ID Solicitud', dato.id_solicitud]).eachCell((cell) => { cell.style = cellStyle })
          hojaGeneral.addRow(['Solicita', dato.usuario]).eachCell((cell) => { cell.style = cellStyle })
          hojaGeneral.addRow(['Fecha Solicitud', dato.fechaSolicitud]).eachCell((cell) => { cell.style = cellStyle })
          hojaGeneral.addRow(['Fecha Entrega', dato.fechaEntrega]).eachCell((cell) => { cell.style = cellStyle })
          hojaGeneral.addRow(['Rancho', dato.rancho]).eachCell((cell) => { cell.style = cellStyle })
          hojaGeneral.addRow(['Centro de Coste', dato.centroCoste || dato.centro_coste]).eachCell((cell) => { cell.style = cellStyle })
          hojaGeneral.addRow(['Variedad Fruta', dato.variedad !== 'todo' ? dato.variedad : variedades[0].variedad]).eachCell((cell) => { cell.style = cellStyle })
          hojaGeneral.addRow(['Empresa', dato.empresa]).eachCell((cell) => { cell.style = cellStyle })
          hojaGeneral.addRow(['Temporada', dato.temporada]).eachCell((cell) => { cell.style = cellStyle })
          hojaGeneral.addRow(['Descripcion', dato.descripcion]).eachCell((cell) => { cell.style = cellStyle })
        } else {
          hojaGeneral.addRow(['Datos Generales Mezclas']).eachCell((cell) => { cell.style = headerStyle }) // Encabezado de la hoja

          // obtenemos datos faltantes de la solicitud
          const datosF = await obtenerDatosSolicitud(dato.id_solicitud)
          console.log('Datos de la solicitud:', datosF)

          hojaGeneral.addRow(['ID Solicitud', dato.id_solicitud]).eachCell((cell) => { cell.style = cellStyle })
          hojaGeneral.addRow(['Folio de Receta', dato.folio]).eachCell((cell) => { cell.style = cellStyle })
          hojaGeneral.addRow(['Solicita', dato.usuario]).eachCell((cell) => { cell.style = cellStyle })
          hojaGeneral.addRow(['Fecha Solicitud', dato.fechaSolicitud]).eachCell((cell) => { cell.style = cellStyle })
          hojaGeneral.addRow(['Fecha Entrega', dato.fechaEntrega]).eachCell((cell) => { cell.style = cellStyle })
          hojaGeneral.addRow(['Rancho', dato.rancho]).eachCell((cell) => { cell.style = cellStyle })
          hojaGeneral.addRow(['Centro de Coste', dato.centroCoste || dato.centro_coste]).eachCell((cell) => { cell.style = cellStyle })
          hojaGeneral.addRow(['Variedad Fruta', dato.variedad !== 'todo' ? dato.variedad : variedades[0].variedad]).eachCell((cell) => { cell.style = cellStyle })
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
        cabecera = ['Productos', 'Unidad', 'Cantidad Solicitada']
        porcentaje = ['', '', '']

        // Obtener productos de la base de datos
        const productos = await obtenerProductosPorSolicitud(dato.id_solicitud)
        console.log('Productos obtenidos:', productos)

        // Crear el arreglo de datos
        const data = []
        if (productos && productos.length > 0) {
          for (const producto of productos) {
            const fila = [
              producto.nombre,
              producto.unidad_medida,
              producto.cantidad
            ]

            // Calcular porcentajes de variedades
            if (dato.variedad === 'todo') {
              if (variedades && variedades.length > 0) {
                for (const variedad of variedades) {
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
          console.error('No se encontraron productos o la estructura es incorrecta')
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
export const reporteSolicitudV2 = async (parametros) => {
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
        const datosF = await obtenerDatosSolicitud(dato.id_solicitud)
        // console.log('Datos de la solicitud:', datosF)

        // // Obtener productos de la base de datos
        const productos = await obtenerProductosPorSolicitud(dato.id_solicitud)
        // console.log('Productos obtenidos:', productos)

        // Crear el arreglo de datos
        if (dato.variedad === 'todo') {
          variedades = await obtenerVariedades(dato.centroCoste)
          // console.log('Variedades obtenidas:', variedades)
          if (variedades && variedades.length > 0) {
            for (const variedad of variedades) {
              const porcentajeSplit = variedad.porcentajes.split(',')
              const variedadSplit = variedad.variedad.split(',')
              for (let i = 0; i < variedadSplit.length; i++) {
                if (productos && productos.length > 0) {
                  for (const producto of productos) {
                    const fila = [
                      dato.id_solicitud,
                      dato.folio ? dato.folio : 'No aplica',
                      dato.usuario,
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
          console.log('folio lleno esta es una solicitud de mezclas')
          for (const producto of productos) {
            const fila = [
              dato.id_solicitud,
              dato.folio ? dato.folio : 'No aplica',
              dato.usuario,
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

  try {
    // Crear un nuevo libro de Excel
    const workbook = new ExcelJS.Workbook()

    // Cabecera de la tabla
    let cabecera = ['Productos', 'Unidad', 'Cantidad Solicitada']
    let porcentaje = ['', '', '']

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

    try {
      // Crear una hoja para esta solicitud
      const hojaGeneral = workbook.addWorksheet('Datos Generales')
      // obtenemos datos de la variedad
      if (variedad === 'todo') {
        // Obtener variedades
        variedades = await obtenerVariedades(centroCoste)
        // Agregar nombres de variedades a la cabecera
        if (variedades && variedades.length > 0) {
          for (const variedad of variedades) {
            const variedadSplit = variedad.variedad.split(',')
            const porcentajeSplit = variedad.porcentajes.split(',')
            for (const item of variedadSplit) {
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
        cabecera.push(variedad)
      }

      if (variedad === 'todo') {
        hojaGeneral.addRow(['Datos Generales Fertilizantes']).eachCell((cell) => { cell.style = headerStyle }) // Encabezado de la hoja

        hojaGeneral.addRow(['ID Solicitud', idSolicitud]).eachCell((cell) => { cell.style = cellStyle })
        hojaGeneral.addRow(['Solicita', usuario]).eachCell((cell) => { cell.style = cellStyle })
        hojaGeneral.addRow(['Fecha Solicitud', fechaSolicitud]).eachCell((cell) => { cell.style = cellStyle })
        hojaGeneral.addRow(['Rancho', rancho]).eachCell((cell) => { cell.style = cellStyle })
        hojaGeneral.addRow(['Centro de Coste', centroCoste]).eachCell((cell) => { cell.style = cellStyle })
        hojaGeneral.addRow(['Variedad Fruta', variedad !== 'todo' ? variedad : variedades[0].variedad]).eachCell((cell) => { cell.style = cellStyle })
        hojaGeneral.addRow(['Empresa', empresa]).eachCell((cell) => { cell.style = cellStyle })
        hojaGeneral.addRow(['Temporada', temporada]).eachCell((cell) => { cell.style = cellStyle })
        hojaGeneral.addRow(['Descripcion', descripcion]).eachCell((cell) => { cell.style = cellStyle })
      } else {
        hojaGeneral.addRow(['Datos Generales Mezclas']).eachCell((cell) => { cell.style = headerStyle }) // Encabezado de la hoja

        hojaGeneral.addRow(['ID Solicitud', idSolicitud]).eachCell((cell) => { cell.style = cellStyle })
        hojaGeneral.addRow(['Folio de Receta', folio]).eachCell((cell) => { cell.style = cellStyle })
        hojaGeneral.addRow(['Solicita', usuario]).eachCell((cell) => { cell.style = cellStyle })
        hojaGeneral.addRow(['Fecha Solicitud', fechaSolicitud]).eachCell((cell) => { cell.style = cellStyle })
        hojaGeneral.addRow(['Rancho', rancho]).eachCell((cell) => { cell.style = cellStyle })
        hojaGeneral.addRow(['Centro de Coste', centroCoste]).eachCell((cell) => { cell.style = cellStyle })
        hojaGeneral.addRow(['Variedad Fruta', variedad !== 'todo' ? variedad : variedades[0].variedad]).eachCell((cell) => { cell.style = cellStyle })
        hojaGeneral.addRow(['Empresa', empresa]).eachCell((cell) => { cell.style = cellStyle })
        hojaGeneral.addRow(['Temporada', temporada]).eachCell((cell) => { cell.style = cellStyle })
        hojaGeneral.addRow(['Cantidad de Mezcla', cantidad]).eachCell((cell) => { cell.style = cellStyle })
        hojaGeneral.addRow(['Presentacion de la Mezcla', presentacion]).eachCell((cell) => { cell.style = cellStyle })
        hojaGeneral.addRow(['Metodo de aplicacion', metodoAplicacion]).eachCell((cell) => { cell.style = cellStyle })
        hojaGeneral.addRow(['Descripcion', descripcion]).eachCell((cell) => { cell.style = cellStyle })
      }
      // Agregar información de la solicitud
      hojaGeneral.addRow([]) // Espacio vacío con estilo

      // Agregar la cabecera a la hoja
      hojaGeneral.addRow(porcentaje)
      hojaGeneral.addRow(cabecera).eachCell((cell) => { cell.style = headerStyle })
      // limpiamos cabeceras
      cabecera = ['Productos', 'Unidad', 'Cantidad Solicitada']
      porcentaje = ['', '', '']

      // Obtener productos de la base de datos
      const productos = await obtenerProductosPorSolicitud(idSolicitud)
      // console.log('Productos obtenidos:', productos)

      // Crear el arreglo de datos
      const data = []
      if (productos && productos.length > 0) {
        for (const producto of productos) {
          const fila = [
            producto.nombre,
            producto.unidad_medida,
            producto.cantidad
          ]

          // Calcular porcentajes de variedades
          if (variedad === 'todo') {
            if (variedades && variedades.length > 0) {
              for (const variedad of variedades) {
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
        console.error('No se encontraron productos o la estructura es incorrecta')
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
