import { asyncHandler } from '../utils/asyncHandler.js'
import { ValidationError, NotFoundError } from '../utils/CustomError.js'
import { enviarCorreo } from '../config/smtp.js'
import { ProductosModel } from '../models/productos.models.js'
export class DevolucionController {
  constructor ({ devolucionModel }) {
    this.devolucionModel = devolucionModel
  }

  // crear devolucion
  registrarDevolucion = asyncHandler(async (req, res) => {
    const { almacen, temporada, descripcion, productos } = req.body
    const { user } = req.session
    const logger = req.logger // Logger con correlación
    let notificationTargets

    const logContext = {
      operation: 'REGISTRO_DEVOLUCION',
      name: user.nombre,
      userId: user.id,
      userRole: user.rol,
      requestData: {
        almacen,
        temporada,
        descripcion,
        productos
      }
    }

    logger.info('REGISTRO_DEVOLUCION_controlador iniciando', logContext)
    // Validar datos
    if (!almacen || !temporada || !productos) {
      throw new ValidationError('Faltan datos requeridos')
    }
    // Validar estructura de productos
    if (!Array.isArray(productos)) {
      throw new ValidationError('productos debe ser un array')
    }
    // Validar productos
    if (!Array.isArray(productos) || productos.length === 0) {
      throw new ValidationError('Debe proporcionar al menos un producto')
    }

    productos.forEach((producto, index) => {
      if (!producto.id_producto || !producto.cantidad || !producto.unidad_medida) {
        throw new ValidationError(`Producto en posición ${index} incompleto`)
      }
    })
    try {
      const resultado = await this.devolucionModel.registrarDevolucion({
        data: { almacen, temporada, descripcion, productos },
        idUsuarioSolicita: user.id,
        logger,
        logContext
      })
      logger.info('CREATE_DEVOLUCION_controlador finalizado', {
        ...logContext,
        resultado,
        duration: Date.now() - new Date(logContext.timestamp).getTime()
      })

      logger.debug('Procesando Notificaciones', {
        ...logContext
      })

      // Proceso de notificaciones por correo
      notificationTargets = await this.#determinarDestinatariosNotificacion({
        almacen: req.body.almacen,
        logger
      })

      res.status(201).json(resultado)
    } catch (error) {
      // Log detallado del error
      logger.error('Error al crear devolucion', {
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

    await this.#enviarCorreoNotificacion({
      destinations: notificationTargets.ress,
      user,
      data: {
        almacen,
        temporada,
        descripcion,
        productos
      },
      logger
    })

    logger.info('Notificaciones enviadas', {
      ...logContext,
      ...notificationTargets
    })
  })

  // obtener devoluciones por estatus
  getAllDevoluciones = asyncHandler(async (req, res) => {
    const { status } = req.params.status
    const { user } = req.session
    const logger = req.logger // Logger con correlación
    const logContext = {
      operation: 'GET_ALL_DEVOLUCIONES',
      status,
      name: user.nombre,
      userId: user.id,
      userRole: user.rol,
      timestamp: new Date().toISOString()
    }
    try {
      logger.info('GET_ALL_DEVOLUCIONES_controlador iniciando', logContext)
      if (!status) {
        throw new ValidationError('Faltan datos requeridos')
      }
      const response = await this.devolucionModel.getAllDevoluciones({ status, logger, logContext })
      logger.info('GET_ALL_DEVOLUCIONES_controlador finalizado', {
        ...logContext
      })
      res.json(response)
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

  // extraer
  getAllEmpleados = asyncHandler(async (req, res) => {
    const response = await this.devolucionModel.getAllEmpleados()
    res.json(response)
  })

  agregarUsuario = asyncHandler(async (req, res) => {
    const response = await this.devolucionModel.agregarUsuario({ data: req.body })
    res.json(response)
  })

  // actualizar devolucion
  actualizarEstadoDevolucio = asyncHandler(async (req, res) => {
    const { id } = req.params
    const { estado } = req.body
    const { user } = req.session
    const logger = req.logger // Logger con correlación

    const logContext = {
      operation: 'UPDATE_DEVOLUCION',
      requestData: {
        id,
        estado
      },
      timestamp: new Date().toISOString(),
      correlationId: req.correlationId // Añadir ID de correlación
    }

    logger.info('UPDATE_DEVOLUCION_controlador iniciando', logContext)

    // Validar datos
    if (!id || !estado) {
      throw new ValidationError('Faltan datos requeridos')
    }

    try {
      const resultado = await this.devolucionModel.updateEstado({
        id,
        data: { estado },
        idUsuarioSolicita: user.id,
        ranchos: user.ranchos
      })
      logger.info('UPDATE_DEVOLUCION_controlador finalizado', {
        ...logContext,
        resultado,
        duration: Date.now() - new Date(logContext.timestamp).getTime()
      })

      res.json(resultado)
    } catch (error) {
      // Log detallado del error
      logger.error('Error al actualizar devolucion', {
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

  // funciones auxiliares y utilitarios
  #determinarDestinatariosNotificacion = async ({ almacen, logger }) => {
    try {
      logger.debug('Determinando destinatarios de notificación iniciada')
      const ress = await this.devolucionModel.determinarDestinatarios({ almacen, logger })
      logger.debug('Determinando destinatarios de notificación finalizada', ress)
      return ress || []
    } catch (error) {
      logger.error('Error al determinar destinatarios de notificación', {
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack
        }
      })
      throw new ValidationError('Error al determinar destinatarios de notificación')
    }
  }

  #enviarCorreoNotificacion = async ({ destinations, user, data, logger }) => {
    const logContext = {
      operation: 'SEND_NOTIFICATION_EMAIL',
      userId: user.id,
      userRole: user.rol,
      userName: user.nombre,
      destinations
    }

    try {
      logger.info('Iniciando envío de notificaciones', logContext)

      // Validar datos requeridos
      if (!destinations?.length) {
        throw new ValidationError('No hay destinatarios para enviar notificaciones')
      }

      // Usar Promise.all para manejar múltiples envíos
      const resultados = await Promise.all(
        destinations.map(async (usuario) => {
          try {
            logger.debug(`Preparando envío a: ${usuario.email}`, {
              nombre: usuario.nombre,
              empresa: usuario.empresa
            })

            const respuesta = await enviarCorreo({
              type: 'devolucion',
              email: usuario.email,
              nombre: user.nombre,
              usuario: {
                empresa: user.empresa,
                ranchos: user.ranchos
              },
              data: {
                almacen: data.almacen,
                temporada: data.temporada,
                descripcion: data.descripcion,
                productos: await this.#obtenerProductos({ productos: data.productos, logger }),
                fecha: new Date().toISOString()
              }
            })

            logger.info(`Correo enviado exitosamente a ${usuario.email}`, {
              messageId: respuesta.messageId
            })

            return {
              success: true,
              email: usuario.email,
              messageId: respuesta.messageId
            }
          } catch (error) {
            logger.error(`Error al enviar correo a ${usuario.email}:`, {
              error: error.message,
              stack: error.stack
            })

            return {
              success: false,
              email: usuario.email,
              error: error.message
            }
          }
        })
      )

      // Analizar resultados
      const exitosos = resultados.filter(r => r.success)
      const fallidos = resultados.filter(r => !r.success)

      logger.info('Proceso de notificaciones completado', {
        total: resultados.length,
        exitosos: exitosos.length,
        fallidos: fallidos.length
      })

      if (fallidos.length > 0) {
        logger.warn('Algunos correos no se enviaron:', {
          fallidos: fallidos.map(f => ({ email: f.email, error: f.error }))
        })
      }

      return {
        success: true,
        total: resultados.length,
        exitosos: exitosos.length,
        fallidos: fallidos.length
      }
    } catch (error) {
      logger.error('Error general en envío de notificaciones:', {
        ...logContext,
        error: error.message,
        stack: error.stack
      })

      throw error
    }
  }

  // obtener datos de los productos
  async #obtenerProductos ({ productos, logger }) {
    logger.info('Obteniendo datos de productos', productos)
    const productosObtenidos = []
    try {
      // Recorrer los productos y obtener sus datos
      for (const producto of productos) {
        const productoObtenido = await ProductosModel.getOne({ id: producto.id_producto })
        // al producto obtenido 'producto' agregar el nombre que vine con la cantidad y unidad y id_producto
        productosObtenidos.push({
          nombre: productoObtenido.nombre,
          cantidad: producto.cantidad,
          unidad_medida: producto.unidad_medida,
          id_producto: producto.id_producto
        })
      }

      logger.info('Productos obtenidos correctamente', productosObtenidos)

      return productosObtenidos
    } catch (error) {
      logger.error('Error al obtener productos', {
        error: error.message,
        stack: error.stack
      })
      throw new NotFoundError('Error al obtener productos')
    }
  }
}
