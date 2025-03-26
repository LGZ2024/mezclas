import { Router } from 'express'
import { NotificacionesController } from '../controller/notificaciones.controller.js'

export const createNotificacionesRouter = ({ notificacionModel }) => {
  const router = Router()

  const notificacionController = new NotificacionesController({ notificacionModel })

  // Obtener todas las notificaciones
  router.get('/notificaciones', notificacionController.getAllIdUsuario)
  router.put('/notificaciones/:id', notificacionController.updateStatus)

  return router
}
