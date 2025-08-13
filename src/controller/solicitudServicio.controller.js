import { asyncHandler } from '../utils/asyncHandler.js'
import { ValidationError } from '../utils/CustomError.js'
export class SolicitudServicioController {
  constructor ({ solicitudModel }) {
    this.solicitudModel = solicitudModel
  }

  agregarTicket = asyncHandler(async (req, res) => {
    const { user } = req.session
    const logger = req.logger
    const logContext = {
      user: user.nombre,
      userId: user.id,
      userRole: user.rol,
      requestBody: req.body
    }
    try {
      logger.info('Iniciando Controlador solicitud servicio - Agregar Ticket', logContext)
      this.#validarDatosCreacion(req.body)
      const response = await this.solicitudModel.agregarTicket({ data: req.body, logger, logContext })
      logger.info('Finalizando Controlador solicitud servicio - Agregar Ticket', logContext)
      res.json(response)
    } catch (error) {
      // Log detallado del error
      logger.error('Error al crear ticket', {
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

  obtenerTickets = asyncHandler(async (req, res) => {
    const { user } = req.session
    const logger = req.logger
    const logContext = {
      user: user.nombre,
      userId: user.id,
      userRole: user.rol,
      nombre: user.nombre
    }
    try {
      logger.info('Iniciando Controlador Obtener Tickets', logContext)
      const response = await this.solicitudModel.obtenerTickets({ logger, logContext })
      logger.info('Finalizando Controlador Obtener Tickets', logContext)
      res.json(response)
    } catch (error) {
      // Log detallado del error
      logger.error('Error al obtener tickets', {
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

  obtenerTicketsEstado = asyncHandler(async (req, res) => {
    const { user } = req.session
    const { estado } = req.params
    const logger = req.logger
    const logContext = {
      user: user.nombre,
      userId: user.id,
      userRole: user.rol,
      nombre: user.nombre
    }
    try {
      logger.info(`Iniciando Controlador Obtener Tickets ${estado}`, logContext)
      const response = await this.solicitudModel.obtenerTicketsEstado({ estado, logger, logContext })
      logger.info(`Finalizando Controlador Obtener Tickets ${estado}`, logContext)
      res.json(response)
    } catch (error) {
      // Log detallado del error
      logger.error('Error al obtener tickets', {
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

  obtenerTicket = asyncHandler(async (req, res) => {
    const { user } = req.session
    const logger = req.logger
    const logContext = {
      user: user.nombre,
      userId: user.id,
      userRole: user.rol,
      nombre: user.nombre
    }
    const { id } = req.params
    try {
      logger.info('Iniciando Controlador Obtener Ticket', logContext)
      const response = await this.solicitudModel.obtenerTicket({ id, logger, logContext })
      logger.info('Finalizando Controlador Obtener Ticket', logContext)
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

  obtenerServicios = asyncHandler(async (req, res) => {
    const { user } = req.session
    const logger = req.logger
    const logContext = {
      user: user.nombre,
      userId: user.id,
      userRole: user.rol,
      nombre: user.nombre
    }
    try {
      logger.info('Iniciando Controlador Obtener Servicios Tickets', logContext)
      const response = await this.solicitudModel.obtenerServicios({ logger, logContext })
      logger.info('Finalizando Controlador Obtener Servicios Tickets', logContext)
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

  cerrarTicket = asyncHandler(async (req, res) => {
    const { user } = req.session
    const logger = req.logger
    const { id } = req.params
    const logContext = {
      nombre: user.nombre,
      rol: user.rol,
      userID: user.id,
      solicitud: id,
      body: req.body
    }
    try {
      logger.info('Iniciando Controlador Cerrar Ticket', logContext)
      const response = await this.solicitudModel.cerrarTicket({ id, datos: req.body, logger, logContext })
      logger.info('Finalizando Controlador Cerrar Ticket', logContext)
      res.json(response)
    } catch (error) {
      // Log detallado del error
      logger.error('Error al cerrar ticket', {
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

  PendienteTicket = asyncHandler(async (req, res) => {
    const { user } = req.session
    const logger = req.logger
    const { id } = req.params
    const logContext = {
      nombre: user.nombre,
      rol: user.rol,
      userID: user.id,
      solicitud: id,
      body: req.body
    }
    try {
      logger.info('Iniciando Controlador Pendiente Ticket', logContext)
      const response = await this.solicitudModel.PendienteTicket({ id, datos: req.body, logger, logContext })
      logger.info('Finalizando Controlador Pendiente Ticket', logContext)
      res.json(response)
    } catch (error) {
      // Log detallado del error
      logger.error('Error al cerrar ticket', {
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
    }
    if (errores.length > 0) {
      throw new ValidationError(`Datos inválidos: ${errores.join(', ')}`, { details: errores })
    }
  }
}
