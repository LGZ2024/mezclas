import { asyncHandler } from '../utils/asyncHandler.js'
import { ValidationError } from '../utils/CustomError.js'
export class MantenimientoController {
  constructor ({ mantenimientoModel }) {
    this.mantenimientoModel = mantenimientoModel
  }

  agregarMantenimiento = asyncHandler(async (req, res) => {
    const { user } = req.session
    const logger = req.logger
    const logContext = {
      user: user.nombre,
      userId: user.id,
      userRole: user.rol,
      requestBody: req.body
    }
    try {
      logger.info('Iniciando Controlador Agregar Mantenimiento', logContext)
      this.#validarDatosCreacion(req.body)
      const response = await this.mantenimientoModel.agregarMantenimiento({ data: req.body, logger, logContext })
      logger.info('Finalizando Controlador Agregar Mantenimiento', logContext)
      res.json(response)
    } catch (error) {
      // Log detallado del error
      logger.error('Error al crear mantenimiento', {
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

  obtenerMantenimientos = asyncHandler(async (req, res) => {
    const { user } = req.session
    const logger = req.logger
    const logContext = {
      user: user.nombre,
      userId: user.id,
      userRole: user.rol,
      requestBody: req.body
    }
    try {
      logger.info('Iniciando Controlador Obtener Mantenimientos', logContext)
      const response = await this.mantenimientoModel.obtenerMantenimientos({ logger, logContext })
      logger.info('Finalizando Controlador Obtener Mantenimientos', logContext)
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

  obtenerMantenimientoTipoServicio = asyncHandler(async (req, res) => {
    const { user } = req.session
    const logger = req.logger
    const { tipoServicio } = req.params
    const logContext = {
      user: user.nombre,
      userId: user.id,
      userRole: user.rol,
      Tipo_servicio: tipoServicio
    }
    try {
      logger.info(`Iniciando Controlador Obtener Mantenimiento ${tipoServicio}`, logContext)
      const response = await this.mantenimientoModel.obtenerMantenimientoTipoServicio({ tipoServicio, logger, logContext })
      logger.info(`Finalizando Controlador Obtener Mantenimiento ${tipoServicio}`, logContext)
      res.json(response)
    } catch (error) {
      // Log detallado del error
      logger.error('obtener Mantenimiento Tipo Servicio', {
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
      if (!data.no_economico) errores.push('Numero economico es requerido')
      if (!data.marca) errores.push('La marca es requerida')
      if (!data.contacto) errores.push('El contacto es requerido')
      if (!data.tipo) errores.push('El tipo es requerido')
      if (!data.modelo) errores.push('El modelo es requerido')
      if (!data.numero_motor) errores.push('El numero de motor es requerido')
      if (!data.numero_serie) errores.push('El numero de serie es requerido')
      if (!data.ano) errores.push('El año es requerido')
      if (!data.placas) errores.push('La placa es requerida')
      if (!data.tipoCombustible) errores.push('El tipo de combustible es requerido')
      if (!data.medida_llanta) errores.push('La medida de las llantas es requerida')
      if (!data.cia_seguro) errores.push('La cia de seguro es requerida')
      if (!data.no_poliza) errores.push('El numero de poliza es requerido')
    }
    if (errores.length > 0) {
      throw new ValidationError(`Datos inválidos: ${errores.join(', ')}`, { details: errores })
    }
  }
}
