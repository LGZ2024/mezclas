import logger from '../utils/logger.js'
import { asyncHandler } from '../utils/asyncHandler.js'
export class NotificacionesController {
  constructor ({ notificacionModel }) {
    this.notificacionModel = notificacionModel
  }

  // uso
  getAllIdUsuario = asyncHandler(async (req, res) => {
    const { user } = req.session
    const result = await this.notificacionModel.getAllIdUsuario({ idUsuario: user.id })
    res.json(result)
  })

  // uso
  updateStatus = asyncHandler(async (req, res) => {
    const { id } = req.params
    logger.info(`id notificacion: ${id}`)
    const result = await this.notificacionModel.updateStatus({ id })
    return res.json({ message: result.message })
  })
}
