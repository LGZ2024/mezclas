import { Router } from 'express'
import { TallerController } from '../controller/taller.controller.js'

export const createTallerRouter = ({ tallerModel }) => {
  const router = Router()

  const tallerController = new TallerController({ tallerModel })

  // Obtener centros de coste. pasamos
  router.post('/taller', tallerController.agregarTaller)
  router.get('/taller', tallerController.obtenerTaller)

  return router
}
