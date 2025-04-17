import { Router } from 'express'
import { EquiposController } from '../controller/equipos.controller.js'

export const createEquiposRouter = ({ equiposModel }) => {
  const router = Router()

  const equiposController = new EquiposController({ equiposModel })

  // Obtener centros de coste. pasamos
  router.get('/equipos', equiposController.getAllDisponible)

  return router
}
