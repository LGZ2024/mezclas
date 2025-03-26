import sequelize from '../db/db.js'
import { crearExcel, crearSolicitud, reporteSolicitud, reporteSolicitudV2 } from '../config/excel.js'
import { MezclaModel } from '../models/mezclas.models.js'
export class ProduccionModel {
  static async ObtenerGastoUsuario ({ tipo }) {
    // comprobar que el objeto tipo tenga alguno de los siguientes datos Usuario,temporada, empresa entre otros antes de proceder a la consulta
    const permitidos = ['usuario', 'temporada', 'empresa', 'centroCoste', 'rancho', 'variedad']
    const valido = permitidos.includes(tipo)
    try {
      if (valido) {
        const data = await sequelize.query(
          `SELECT ${tipo} , SUM(precio_cantidad) AS precio_cantidad FROM vista_solicitudes GROUP BY ${tipo}`
        )
        // Verifica si hay duplicados
        const uniqueData = Array.from(new Map(data.map(item => [valido, item])).values())
        // Si llegamos aquí, la ejecución fue exitosa
        return uniqueData
      }
    } catch (error) {
      // Manejo de errores
      console.error('Error al procesar producto:', error)
      return {
        status: 'error',
        message: error.message || 'Error desconocido'
      }
    }
  }

  static async solicitudReporte ({ empresa, rol }) {
    let data
    try {
      if (rol === 'admin') {
        data = await sequelize.query(
          'SELECT * FROM total_precio_cantidad_solicitud'
        )
      } else if (rol === 'administrativo' && empresa === 'General') {
        data = await sequelize.query(
          'SELECT * FROM `total_precio_cantidad_solicitud` WHERE `empresa`!="Lugar Agricola"'
        )
      } else {
        data = await sequelize.query(
          `SELECT * FROM total_precio_cantidad_solicitud WHERE empresa="${empresa}"`
        )
      }
      const uniqueData = Array.from(new Map(data.map(item => [item.id_solicitud, item])).values())
      // Si llegamos aquí, la ejecución fue exitosa
      return uniqueData
    } catch (error) {
      // Manejo de errores
      console.error('Error al procesar producto:', error)
      return {
        status: 'error',
        message: error.message || 'Error desconocido'
      }
    }
  }

  static async descargarEcxel ({ datos }) {
    try {
      if (!datos || Array.isArray(datos)) {
        throw new Error('datos invalidos, se requiere un arreglo de datos filtrados.')
      }
      const excel = await crearExcel(datos)
      return excel
    } catch (error) {
      // Manejo de errores
      console.error('Error al procesar producto:', error)
      return {
        status: 'error',
        message: error.message || 'Error desconocido'
      }
    }
  }

  static async descargarSolicitud ({ datos }) {
    console.log(datos)
    try {
      if (!datos || Array.isArray(datos)) {
        throw new Error('datos invalidos, se requiere un arreglo de datos filtrados.')
      }
      const excel = await crearSolicitud(datos)
      return excel
    } catch (error) {
      // Manejo de errores
      console.error('Error al procesar producto:', error)
      return {
        status: 'error',
        message: error.message || 'Error desconocido'
      }
    }
  }

  static async descargarReporte ({ datos }) {
    try {
      if (!datos || Array.isArray(datos)) {
        throw new Error('datos invalidos, se requiere un arreglo de datos filtrados.')
      }
      const excel = await reporteSolicitud(datos)
      return excel
    } catch (error) {
      // Manejo de errores
      console.error('Error al procesar producto:', error)
      return {
        status: 'error',
        message: error.message || 'Error desconocido'
      }
    }
  }

  static async descargarReporteV2 ({ datos }) {
    try {
      if (!datos || Array.isArray(datos)) {
        throw new Error('datos invalidos, se requiere un arreglo de datos filtrados.')
      }
      const excel = await reporteSolicitudV2(datos)
      return excel
    } catch (error) {
      // Manejo de errores
      console.error('Error al procesar producto:', error)
      return {
        status: 'error',
        message: error.message || 'Error desconocido'
      }
    }
  }

  static async descargarReportePendientes ({ empresa }) {
    try {
      if (!empresa) {
        return {
          status: 'error',
          message: 'Se requiere especificar una empresa'
        }
      }

      const datos = await MezclaModel.obtenerTablaMezclasEmpresa({ status: 'Pendiente', empresa })

      // Validar que hay datos para procesar
      if (!datos) {
        return {
          status: 'error',
          message: 'No se encontraron datos válidos'
        }
      }

      if (datos.length === 0) {
        return {
          status: 'error',
          message: 'No hay mezclas pendientes para esta empresa'
        }
      }

      const excel = await reporteSolicitud(datos)

      return excel
    } catch (error) {
      // Manejo de errores
      console.error('Error al procesar producto:', error)
      return {
        status: 'error',
        message: error.message || 'Error desconocido'
      }
    }
  }

  static async descargarReportePendientesCompleto () {
    try {
      const datos = await MezclaModel.getAllGeneral({ status: 'Pendiente' })
      console.log(datos)
      // Validar que hay datos para procesar
      if (!datos) {
        return {
          status: 'error',
          message: 'No se encontraron datos válidos'
        }
      }

      if (datos.length === 0) {
        return {
          status: 'error',
          message: 'No hay mezclas pendientes para esta empresa'
        }
      }

      const excel = await reporteSolicitud(datos.data)

      return excel
    } catch (error) {
      // Manejo de errores
      console.error('Error al procesar producto:', error)
      return {
        status: 'error',
        message: error.message || 'Error desconocido'
      }
    }
  }

  static async ObtenerGasto ({ data }) {
    try {
      // Llamar al procedimiento almacenado
      await sequelize.query(
        'CALL sp_calcular_precio_solicitud(:idSolicitud, :idProducto, :unidadMedida, :cantidad)',
        {
          replacements: {
            idSolicitud: data.idSolicitud,
            idProducto: data.producto,
            unidadMedida: data.unidadMedida,
            cantidad: data.cantidad
          },
          type: sequelize.QueryTypes.RAW
        }
      )

      // Si llegamos aquí, la ejecución fue exitosa
      return {
        status: 'success',
        message: 'Producto procesado exitosamente'
      }
    } catch (error) {
      // Manejo de errores
      console.error(`Error al procesar producto ${data.producto}:`, error)
      return {
        status: 'error',
        message: error.message || 'Error desconocido'
      }
    }
  }

  static async ObtenerReceta () {
    try {
      const data = await sequelize.query(
        'SELECT * FROM vista_recetas_costos'
      )
      const uniqueData = Array.from(new Map(data.map(item => [item.id_receta, item])).values())
      // Si llegamos aquí, la ejecución fue exitosa
      return uniqueData
    } catch (error) {
      // Manejo de errores
      console.error('Error al procesar producto', error)
      return {
        status: 'error',
        message: error.message || 'Error desconocido'
      }
    }
  }
} // fin modelo
