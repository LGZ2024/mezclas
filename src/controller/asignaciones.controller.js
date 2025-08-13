import { asyncHandler } from '../utils/asyncHandler.js'
export class AsignacionesController {
  constructor ({ asignacionesModel }) {
    this.asignacionesModel = asignacionesModel
  }

  agregarAsignacion = asyncHandler(async (req, res) => {
    const { user } = req.session
    const logger = req.logger
    const archivo = req.file // Aquí tienes la foto subida
    const logContext = {
      operation: 'Agregar Asignación',
      user: user.nombre,
      rol: user.rol,
      userID: user.id,
      requestBody: {
        ...req.body
      }
    }
    logger.debug('Archivo recibido:', archivo) // Para depuración
    logger.info('Iniciando Controlador', logContext)
    const response = await this.asignacionesModel.agregarAsignacion({ data: req.body, responsiva: archivo, logger, logContext })
    res.json(response)
  })

  editarAsignacion = asyncHandler(async (req, res) => {
    const { user } = req.session
    const logger = req.logger
    const { id } = req.params
    const logContext = {
      operation: 'Editar Estado de Asignación',
      user: user.nombre,
      rol: user.rol,
      userID: user.id,
      requestBody: {
        ...req.body
      }
    }
    logger.info('Iniciando Controlador', logContext)
    const response = await this.asignacionesModel.editarAsignacion({ id, data: req.body, logger, logContext })
    logger.info('Asignación editada exitosamente', logContext)
    res.json(response)
  })

  editarResponsiva = asyncHandler(async (req, res) => {
    const { user } = req.session
    const logger = req.logger
    const { id } = req.params
    const archivo = req.file // Aquí tienes la foto subida
    const logContext = {
      operation: 'Editar responsiva de Asignación',
      user: user.nombre,
      rol: user.rol,
      userID: user.id
    }
    logger.info('Iniciando Controlador', logContext)
    const response = await this.asignacionesModel.editarResponsiva({ id, responsiva: archivo, logger, logContext })
    logger.info('Asignación editada exitosamente', logContext)
    res.json(response)
  })
}
