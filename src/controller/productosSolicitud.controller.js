import { asyncHandler } from '../utils/asyncHandler.js'
export class ProductosController {
  constructor({ productossModel }) {
    this.productossModel = productossModel
  }

  obtenerProductosSolicitud = asyncHandler(async (req, res) => {
    const { idSolicitud } = req.params
    const { user } = req.session
    const logger = req.logger
    const logContext = {
      operation: 'OBTENER_PRODUCTOS_SOLICITUD',
      idSolicitud,
      name: user.nombre,
      userId: user.id,
      userRole: user.rol
    }
    logger.info('OBTENER_PRODUCTOS_SOLICITUD iniciando operacion', logContext)
    const result = await this.productossModel.obtenerProductosSolicitud({ idSolicitud, logContext, logger })
    logger.info('OBTENER_PRODUCTOS_SOLICITUD completado operacion', logContext)
    return res.json(result)
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

    logger.info('CREAR_PRODUCTO iniciando operacion', logContext)

    const result = await this.productossModel.create({
      data: req.body,
      idUsuario: user.id,
      logContext,
      logger
    })

    logger.info('CREAR_PRODUCTO Finalizando operacion', logContext)
    return res.json({
      success: true,
      message: result.message,
      idSolicitud: result.idSolicitud
    })
  })

  // metodo para actualizar el estado de los productos
  actulizarEstado = asyncHandler(async (req, res) => {
    const { user } = req.session
    const { id } = req.params
    const logger = req.logger
    const logContext = {
      operation: 'ACTUALIZAR_ESTADO_PRODUCTOS',
      userName: user.nombre,
      userId: user.id,
      userRole: user.rol,
      requestBody: req.body
    }
    logger.info('ACTUALIZAR_ESTADO_PRODUCTOS started', logContext)
    const result = await this.productossModel.actualizarEstado({
      user,
      idSolicitud: id,
      data: req.body,
      idUsuarioMezcla: user.id, // id del usuario que actualiza
      logContext,
      logger
    })

    console.log('result', result)

    // validamos que data y productos vengan dentro de result
    // if (result.productos || result.data) {
    //   await enviarCorreo({
    //     type: 'notificacion',
    //     email: result.data[0].email,
    //     nombre: result.data[0].nombre,
    //     solicitudId: id,
    //     data: result.productos,
    //     usuario: user
    //   })
    // } else if (result.message.length > 0) {
    //   logger.info('resultados de actualizacion de productos', result.message)
    // } else {
    //   logger.warn('No se encontaron resultados', logContext)
    //   throw new ValidationError('Error al actualizar el estado de los productos')
    // }

    // await enviarCorreo({
    //   type: 'status',
    //   email: solicitante.email,
    //   nombre: solicitante.nombre,
    //   solicitudId: idSolicitud,
    //   status: req.body.status,
    //   usuario: user,
    //   data: {
    //     observaciones: req.body.observaciones,
    //     fecha: new Date().toISOString()
    //   }
    // })

    return res.json({ message: result.message })
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
