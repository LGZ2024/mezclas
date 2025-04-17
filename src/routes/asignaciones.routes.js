import { Router } from 'express'
import { AsignacionesController } from '../controller/asignaciones.controller.js'

export const createAsignacionesRouter = ({ asignacionesModel }) => {
  const router = Router()

  const asignacionesController = new AsignacionesController({ asignacionesModel })

  // Obtener centros de coste. pasamos
  router.post('/asignaciones', asignacionesController.agregarAsignacion)

  return router
}
