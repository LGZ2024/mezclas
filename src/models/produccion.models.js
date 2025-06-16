import sequelize from '../db/db.js'
import { crearExcel, crearSolicitud, reporteSolicitudV2, reporteSolicitudv3 } from '../config/excel.js'
import { MezclaModel } from '../models/mezclas.models.js'
// utils
import { NotFoundError, ValidationError, DatabaseError, CustomError } from '../utils/CustomError.js'
import logger from '../utils/logger.js'
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

  static async getAsignacionesActivos () {
    try {
      const data = await sequelize.query(
        'SELECT * FROM total_precio_cantidad_solicitud'
      )
      // Verificamos que se hayan obtenido datos
      if (!data || data.length === 0) {
        throw new NotFoundError('No se encontraron datos para el usuario solicitante')
      }

      return data
    } catch (error) {
      if (error instanceof CustomError) throw error
      throw new DatabaseError('Error al procesar datos de solicitudes')
    }
  }

  static async solicitudReporte ({ empresa, rol, idUsuario }) {
    let data
    logger.info('solicitudReporte', { empresa, rol, idUsuario })
    try {
      // Verificar si se proporcionaron los parámetros requeridos
      if (!empresa || !rol || !idUsuario) {
        throw new ValidationError('Datos requeridos no proporcionados')
      }

      if (rol === 'admin') {
        data = await sequelize.query(
          'SELECT * FROM total_precio_cantidad_solicitud'
        )
      } else if (rol === 'administrativo' && empresa === 'General') {
        data = await sequelize.query(
          'SELECT * FROM `total_precio_cantidad_solicitud` WHERE `empresa`!="Lugar Agricola"'
        )
      } else if (rol === 'adminMezclador') { // admin de Bioagricultura id usuario 33 de francisco alvarez
        if (empresa === 'Bioagricultura') {
          data = await sequelize.query(
            'SELECT * FROM `total_precio_cantidad_solicitud` WHERE `empresa`="Bioagricultura" OR `empresa`="Moras Finas"'
          )
        } else if (empresa === 'General') {
          data = await sequelize.query(
            'SELECT * FROM `total_precio_cantidad_solicitud` WHERE `empresa`="Bayas del Centro" OR `empresa`="Moras Finas" OR `empresa`="Bioagricultura"'
          )
        } else if (empresa === 'Lugar Agricola') {
          data = await sequelize.query(
            'SELECT * FROM `total_precio_cantidad_solicitud` WHERE `empresa`="Lugar Agricola"'
          )
        }
      } else if (rol === 'administrativo') { // admin de general id usuario 49 de janet medina
        data = await sequelize.query(
          'SELECT * FROM `total_precio_cantidad_solicitud`'
        )
      } else {
        data = await sequelize.query(
          `SELECT * FROM total_precio_cantidad_solicitud WHERE empresa="${empresa}"`
        )
      }
      // Verificamos que se hayan obtenido datos
      if (!data || data.length === 0) {
        throw new NotFoundError('No se encontraron datos para el usuario solicitante')
      }
      // Verifica si hay duplicados
      const uniqueData = Array.from(new Map(data.map(item => [item.id_solicitud, item])).values())

      return uniqueData
    } catch (error) {
      if (error instanceof CustomError) throw error
      throw new DatabaseError('Error al procesar datos de solicitudes')
    }
  }

  static async descargarEcxel ({ datos }) {
    try {
      if (!datos || Array.isArray(datos)) {
        throw new ValidationError('datos invalidos, se requiere un arreglo de datos filtrados.')
      }
      const excel = await crearExcel(datos)
      return excel
    } catch (error) {
      logger.error({
        message: 'Error al procesar producto',
        error: error.message,
        stack: error.stack,
        method: 'ProduccionModel.descargarEcxel'
      })
      if (error instanceof CustomError) throw error
      throw new DatabaseError('Error al procesar datos de solicitudes')
    }
  }

  static async descargarSolicitud ({ datos }) {
    try {
      if (!datos || Array.isArray(datos)) {
        throw new ValidationError('datos invalidos, se requiere un arreglo de datos.')
      }
      const excel = await crearSolicitud(datos)
      return excel
    } catch (error) {
      if (error instanceof CustomError) throw error
      throw new DatabaseError('Error al procesar datos para el reporte')
    }
  }

  // uso
  static async descargarReporte ({ datos }) {
    try {
      if (!datos || Array.isArray(datos)) {
        throw new ValidationError('Datos invalidos, se requiere un arreglo de datos.')
      }
      const excel = await reporteSolicitudv3(datos)
      return excel
    } catch (error) {
      if (error instanceof CustomError) throw error
      throw error
    }
  }

  static async descargarReporteV2 ({ datos }) {
    try {
      if (!datos || Array.isArray(datos)) {
        throw new ValidationError('Datos invalidos, se requiere un arreglo de datos.')
      }
      const excel = await reporteSolicitudV2(datos)
      return excel
    } catch (error) {
      logger.error({
        message: 'Error al procesar producto',
        error: error.message,
        stack: error.stack,
        method: 'ProduccionModel.descargarReporteV2'
      })
      if (error instanceof CustomError) throw error
      throw error
    }
  }

  // uso
  static async descargarReportePendientes ({ empresa }) {
    try {
      if (!empresa) {
        throw new ValidationError('Se requiere especificar una empresa')
      }

      const datos = await MezclaModel.obtenerTablaMezclasEmpresa({ status: 'Pendiente', empresa, confirmacion: 'Confirmada' })

      // Validar que hay datos para procesar
      if (!datos) {
        throw new NotFoundError('No se encontraron datos para esta empresa')
      }

      const excel = await reporteSolicitudv3(datos)

      return excel
    } catch (error) {
      if (error instanceof CustomError) throw error
      throw error
    }
  }

  // uso
  static async descargarReportePendientesCompleto () {
    try {
      const datos = await MezclaModel.getAllGeneral({ status: 'Pendiente' })
      // Validar que hay datos para procesar
      if (!datos) {
        throw new NotFoundError('No se encontraron datos para esta empresa')
      }

      const excel = await reporteSolicitudv3(datos.data)

      return excel
    } catch (error) {
      if (error instanceof CustomError) throw error
      throw error
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
