import { asyncHandler } from '../utils/asyncHandler.js'
import { ValidationError } from '../utils/CustomError.js'
export class EquiposController {
  constructor ({ equiposModel }) {
    this.equiposModel = equiposModel
  }

  // extraer
  getAllDisponible = asyncHandler(async (req, res) => {
    const response = await this.equiposModel.getAllDisponible()

    res.json(response)
  })

  agregarActivo = asyncHandler(async (req, res) => {
    const { user } = req.session
    const logger = req.logger

    const logContext = {
      operation: 'Agregar Activo',
      user: user.nombre,
      rol: user.rol,
      userID: user.id,
      requestBody: req.body
    }
    try {
      logger.info('Iniciando Controlador', logContext)
      this.#validarDatosCreacion(req.body)
      const activos = await this.equiposModel.agregarActivo({ logger, logContext, data: req.body })
      logger.info('Finalizando Controlador', logContext)
      res.json(activos)
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

  editarActivo = asyncHandler(async (req, res) => {
    const { user } = req.session
    const logger = req.logger
    const { id } = req.params

    const logContext = {
      operation: 'Editar Activo',
      user: user.nombre,
      rol: user.rol,
      userID: user.id,
      requestBody: req.body
    }
    try {
      logger.info('Iniciando Controlador', logContext)
      this.#validarDatosCreacion(req.body)
      const activos = await this.equiposModel.editarActivo({ logger, logContext, data: req.body, id })
      logger.info('Finalizando Controlador', logContext)
      res.json(activos)
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

  agregarFoto = asyncHandler(async (req, res) => {
    const { id } = req.params
    const { user } = req.session
    const logger = req.logger
    const archivo = req.file // Aquí tienes la foto subida

    const logContext = {
      operation: 'Agregar Imagen Activo',
      user: user.nombre,
      rol: user.rol,
      userID: user.id
    }
    try {
      logger.info('Iniciando Controlador', logContext)
      const activos = await this.equiposModel.agregarFoto({ logger, logContext, imagen: archivo.filename, id })
      logger.info('Finalizando Controlador', logContext)
      res.json(activos)
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

  cambiarEstado = asyncHandler(async (req, res) => {
    const { id } = req.params
    const { user } = req.session
    const logger = req.logger

    // Aquí puedes agregar la lógica para cambiar el estado del equipo
    const logContext = {
      operation: 'Cambiar Estado Activo',
      user: user.nombre,
      rol: user.rol,
      userID: user.id,
      id,
      requestBody: {
        ...req.body
      }
    }
    try {
      logger.info('Iniciando Controlador', logContext)
      const activos = await this.equiposModel.cambiarEstado({ logger, logContext, id, data: req.body })
      logger.info('Finalizando Controlador', logContext)
      res.json(activos)
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

  agregarFactura = asyncHandler(async (req, res) => {
    const { id } = req.params
    const { user } = req.session
    const logger = req.logger
    const archivo = req.file // Aquí tienes la foto subida
    const logContext = {
      operation: 'Agregar Factura Activo',
      user: user.nombre,
      rol: user.rol,
      userID: user.id,
      requestBody: {
        ...req.body
      }
    }

    try {
      logger.info('Iniciando Controlador', logContext)
      const activos = await this.equiposModel.agregarFactura({ logger, logContext, factura: archivo.filename, data: req.body, id })
      logger.info('Finalizando Controlador', logContext)
      res.json(activos)
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

  agregarBaja = asyncHandler(async (req, res) => {
    const { id } = req.params
    const { user } = req.session
    const logger = req.logger
    const archivo = req.file // Aquí tienes la foto subida

    const logContext = {
      operation: 'Agregar Baja Activo',
      user: user.nombre,
      rol: user.rol,
      userID: user.id,
      requestBody: {
        ...req.body
      }
    }

    try {
      logger.info('Iniciando Controlador', logContext)
      const activos = await this.equiposModel.agregarBaja({ logger, logContext, baja: archivo.filename, id })
      logger.info('Finalizando Controlador', logContext)
      res.json(activos)
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

  eliminarActivo = asyncHandler(async (req, res) => {
    const { id } = req.params
    const { user } = req.session
    const logger = req.logger
    const { estado } = req.body

    if (estado !== 'disponible') {
      throw new ValidationError('No se puede eliminar un equipo que no está disponible.')
    }

    const logContext = {
      operation: 'Eliminar Activo',
      user: user.nombre,
      rol: user.rol,
      userID: user.id,
      id
    }

    logger.info('Iniciando Controlador', logContext)
    const activos = await this.equiposModel.eliminarActivo({ logger, logContext, id, estado })
    logger.info('Finalizando Controlador', logContext)
    res.json(activos)
  })

  #validarDatosCreacion (data) {
    const errores = []

    if (data.tipo === 'Mezcla') {
      if (!data.equipo) errores.push('El equipo es requerido')
      if (!data.marca) errores.push('La marca es requerida')
      if (!data.modelo) errores.push('El modelo es requerido')
      if (!data.ns) errores.push('El numero de serie es requerido')
      if (!data.tag) errores.push('El service tag es requerido')
      if (!data.no_economico) errores.push('El Numero Economico Requerido')
    } else {
      if (!data.equipo) errores.push('El equipo es requerido')
      if (!data.marca) errores.push('La marca es requerida')
      if (!data.modelo) errores.push('El modelo es requerido')
      if (!data.ns) errores.push('El numero de serie es requerido')
      if (!data.tag) errores.push('El service tag es requerido')
      if (!data.no_economico) errores.push('El Numero Economico Requerido')
    }
    if (errores.length > 0) {
      throw new ValidationError(`Datos inválidos: ${errores.join(', ')}`, { details: errores })
    }
  }
}
