import { asyncHandler } from '../utils/asyncHandler.js'
export class EmpleadosController {
  constructor ({ empleadosModel }) {
    this.empleadosModel = empleadosModel
  }

  // extraer
  getAllEmpleados = asyncHandler(async (req, res) => {
    const response = await this.empleadosModel.getAllEmpleados()
    res.json(response)
  })

  AllEmpleados = asyncHandler(async (req, res) => {
    const response = await this.empleadosModel.AllEmpleados()
    res.json(response)
  })

  agregarUsuario = asyncHandler(async (req, res) => {
    const { user } = req.session
    const logger = req.logger
    const logContext = {
      operation: 'Agregar Usuario',
      user: user.nombre,
      rol: user.rol,
      userID: user.id,
      requestBody: req.body
    }
    logger.info('Iniciando Controlador', logContext)
    const response = await this.empleadosModel.agregarUsuario({ logger, logContext, data: req.body })
    logger.info('Finalizando Controlador', logContext)
    res.json(response)
  })

  editarUsuario = asyncHandler(async (req, res) => {
    const { user } = req.session
    const logger = req.logger
    const logContext = {
      operation: 'Editar Usuario',
      user: user.nombre,
      rol: user.rol,
      userID: user.id,
      requestBody: req.body
    }
    logger.info('Iniciando Controlador', logContext)
    const EmpleadoId = req.params.empleado_id
    const response = await this.empleadosModel.editarUsuario({ logger, logContext, EmpleadoId, data: req.body })
    logger.info('Finalizando Controlador', logContext)
    res.json(response)
  })
}
