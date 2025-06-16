import { enviarCorreo } from '../config/smtp.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { ValidationError } from '../utils/CustomError.js'
export class ProductosController {
  constructor ({ productossModel }) {
    this.productossModel = productossModel
  }

  obtenerProductosSolicitud = asyncHandler(async (req, res) => {
    const { idSolicitud } = req.params.idSolicitud
    const logger = req.logger
    const logContext = {
      operation: 'OBTENER_PRODUCTOS_SOLICITUD',
      idSolicitud,
      name: req.session.nombre,
      userId: req.session.id,
      userRole: req.session.rol
    }
    try {
      logger.info('OBTENER_PRODUCTOS_SOLICITUD iniciando operacion', logContext)
      const result = await this.productossModel.obtenerProductosSolicitud({ idSolicitud, logContext, logger })
      logger.info('OBTENER_PRODUCTOS_SOLICITUD completado operacion', logContext)
      return res.json(result)
    } catch (error) {
      // Log detallado del error
      logger.error('Error al crear mezcla', {
        ...logContext,
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack,
          code: error.code
        }
      })
      throw error
    }
  })

  obtenerTablaMezclasId = asyncHandler(async (req, res) => {
    const id = req.params.id
    const logger = req.logger
    const logContext = {
      operation: 'OBTENER_TABLA_MEZCLA_ID',
      id,
      name: req.session.nombre,
      userId: req.session.id,
      userRole: req.session.rol
    }
    try {
      logger.info('OBTENER_TABLA_MEZCLA_ID iniciando operacion', logContext)
      const result = await this.productossModel.obtenerTablaMezclasId({ id, logContext, logger })
      return res.json(result.data)
    } catch (error) {
      // Log detallado del error
      logger.error('Error al crear mezcla', {
        ...logContext,
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack,
          code: error.code
        }
      })
      throw error
    }
  })

  // metodo para agregar un producto a una soilicitud creada
  create = asyncHandler(async (req, res) => {
    const { user } = req.session
    const logger = req.logger
    const logContext = {
      operation: 'CREAR_PRODUCTO',
      userName: user.nombre,
      userId: user.id,
      userRole: user.rol,
      requestBody: req.body
    }
    try {
      logger.info('CREAR_PRODUCTO iniciando operacion', logContext)

      const result = await this.productossModel.create({
        data: req.body,
        idUsuario: user.id,
        logContext,
        logger
      })

      logger.info('CREAR_PRODUCTO', 'completado operacion', {
        duration: Date.now() - new Date(logContext.timestamp).getTime()
      })

      return res.json({
        success: true,
        message: result.message,
        idSolicitud: result.idSolicitud
      })
    } catch (error) {
      logger.error('Error al agregar producto', {
        ...logContext,
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack
        }
      })
      throw error
    }
  })

  // metodo para actualizar el estado de los productos
  actulizarEstado = asyncHandler(async (req, res) => {
    const { user } = req.session
    const logger = req.logger
    const logContext = {
      operation: 'ACTUALIZAR_ESTADO_PRODUCTOS',
      userName: user.nombre,
      userId: user.id,
      userRole: user.rol,
      requestBody: req.body
    }

    try {
      logger.info('ACTUALIZAR_ESTADO_PRODUCTOS started', logContext)
      const result = await this.productossModel.actualizarEstado({
        data: req.body,
        idUsuarioMezcla: user.id,
        logContext,
        logger
      })
      console.log(result.message)

      logger.info('respuesta de actulizar productos--', 'finished', {
        ...result.message
      })

      // Log de éxito
      logger.info('ACTUALIZAR_ESTADO_PRODUCTOS CONTROLLADOR', logContext, {
        resultCount: Array.isArray(result) ? result.length : 1,
        duration: Date.now() - new Date(logContext.timestamp).getTime(),
        ...result
      })

      // validamos que data y productos vengan dentro de result
      if (result.productos || result.data) {
        await enviarCorreo({
          type: 'notificacion',
          email: result.data[0].email,
          nombre: result.data[0].nombre,
          solicitudId: req.body.id_solicitud,
          data: result.productos,
          usuario: user
        })
      } else if (result.message.length > 0) {
        logger.info('resultados de actualizacion de productos', result.message)
      } else {
        logger.warn('No se encontaron resultados', logContext)
        throw new ValidationError('Error al actualizar el estado de los productos')
      }

      // Log de finalización
      logger.info('la operacion ACTUALIZAR_ESTADO_PRODUCTOS', logContext, {
        resultCount: Array.isArray(result) ? result.length : 1,
        duration: Date.now() - new Date(logContext.timestamp).getTime()
      })

      return res.json({ message: result.message })
    } catch (error) {
      // Log detallado del error
      logger.error('Error al actualizar productos', {
        ...logContext,
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack,
          code: error.code
        }
      })
      throw error
    }
  })

  EliminarPorducto = asyncHandler(async (req, res) => {
    const { id } = req.params
    const { user } = req.session
    const logger = req.logger
    const logContext = {
      operation: 'ELIMINAR_PRODUCTO',
      idPorducto: id,
      name: user.nombre,
      userId: user.id,
      userRole: user.rol
    }
    try {
      logger.info('ELIMINAR_PRODUCTO iniciando operacion', logContext)
      const result = await this.productossModel.EliminarPorducto({ id, logContext, logger })
      logger.info('ELIMINAR_PRODUCTO completado operacion', logContext, {
        duration: Date.now() - new Date(logContext.timestamp).getTime()
      })
      return res.json({ message: result.message })
    } catch (error) {
      logger.error('Error al eliminar producto', {
        ...logContext,
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack,
          code: error.code
        }
      })
      throw error
    }
  })
}
