import { Router } from 'express'
import { SalidaCombustibleController } from '../controller/combustible_salida.controller.js'

export const createSalidaCombustibleRouter = ({ salidaCombustibleModel }) => {
  const router = Router()
  const salidaCombustibleController = new SalidaCombustibleController({ salidaCombustibleModel })

  router.post('/salida', salidaCombustibleController.agregarSalidaCombustible)
  router.get('/salidas', salidaCombustibleController.SalidaCombustible)

  return router
}
