import { asyncHandler } from '../utils/asyncHandler.js'
import { ValidationError } from '../utils/CustomError.js'
export class TallerController {
  constructor ({ tallerModel }) {
    this.tallerModel = tallerModel
  }

  agregarTaller = asyncHandler(async (req, res) => {
    const { user } = req.session
    const logger = req.logger
    const logContext = {
      user: user.nombre,
      userId: user.id,
      userRole: user.rol,
      requestBody: req.body
    }
    try {
      logger.info('Iniciando Controlador Agregar Taller', logContext)
      this.#validarDatosCreacion(req.body)
      const response = await this.tallerModel.crearTaller({ data: req.body, logger, logContext })
      logger.info('Finalizando Controlador Agregar Taller', logContext)
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

  obtenerTaller = asyncHandler(async (req, res) => {
    const { user } = req.session
    const logger = req.logger
    const logContext = {
      user: user.nombre,
      userId: user.id,
      userRole: user.rol,
      requestBody: req.body
    }
    try {
      logger.info('Iniciando Controlador Obtener Talleres', logContext)
      const response = await this.tallerModel.obtenerTaller({ logger, logContext })
      logger.info('Finalizando Controlador Obtener Talleres', logContext)
      res.json(response)
    } catch (error) {
      // Log detallado del error
      logger.error('Error al crear taller', {
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

  #validarDatosCreacion (data) {
    const errores = []

    if (data.tipo === 'Mezcla') {
      if (!data.razon_social) errores.push('La Razon Social es requerida')
      if (!data.domicilio) errores.push('El domicilio es requerido')
      if (!data.contacto) errores.push('El contacto es requerido')
      if (!data.forma_pago) errores.push('La forma de pago es requerida')
    }
    if (errores.length > 0) {
      throw new ValidationError(`Datos inválidos: ${errores.join(', ')}`, { details: errores })
    }
  }
}
