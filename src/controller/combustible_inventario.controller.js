import { asyncHandler } from '../utils/asyncHandler.js'
import { ValidationError } from '../utils/CustomError.js'
export class InventarioController {
  constructor ({ inventarioModel }) {
    this.inventarioModel = inventarioModel
  }

  obtenerInventario = asyncHandler(async (req, res) => {
    const { user } = req.session
    const logger = req.logger

    const logContext = {
      user: user.nombre,
      userId: user.id,
      userRole: user.rol
    }
    try {
      logger.info('Iniciando Controlador Obtener Inventario', logContext)
      const response = await this.inventarioModel.obtenerInventario({ logger, logContext })
      logger.info('Finalizando Controlador Obtener Inventario', logContext)
      res.json(response)
    } catch (error) {
      // Log detallado del error
      logger.error('Error al obtener Inventario', {
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

  obtenerCargasCombustibles = asyncHandler(async (req, res) => {
    const { user } = req.session
    const logger = req.logger

    const logContext = {
      user: user.nombre,
      userId: user.id,
      userRole: user.rol
    }
    try {
      logger.info('Iniciando Controlador Obtener Carga Combustible', logContext)
      const response = await this.inventarioModel.obtenerCargasCombustibles({ logger, logContext })
      logger.info('Finalizando Controlador Obtener Carga Combustible', logContext)
      res.json(response)
    } catch (error) {
      // Log detallado del error
      logger.error('Error al obtener carga combustible', {
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

    if (!data.fecha) errores.push('La fecha es requerida')
    if (!data.no_economico) errores.push('El numero economico es requerido')
    if (!data.centro_coste) errores.push('El centro de coste es requerido')
    if (!data.prioridad) errores.push('La prioridad es requerida')
    if (!data.mantenimiento) errores.push('El mantenimiento es requerido')
    if (!data.taller_asignado) errores.push('El taller asignado es requerido')
    if (!data.reparacion_solicitada) errores.push('La reparacion solicitada es requerida')
    if (!data.responsable) errores.push('El responsable es requerido')
    if (!data.kilometraje) errores.push('El kilometraje es requerido')
    if (!data.fecha_salida) errores.push('La fecha de salida es requerida')
    if (!data.zona) errores.push('La zona es requerida')
    if (!data.ranchos) errores.push('Los ranchos son requeridos')

    if (errores.length > 0) {
      throw new ValidationError(`Datos inválidos: ${errores.join(', ')}`, { details: errores })
    }
  }
}
