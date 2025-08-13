import { Router } from 'express'
import { EntradaCombustibleController } from '../controller/combustible_entrada.controller.js'

export const createEntradaCombustibleRouter = ({ entradaCombustibleModel }) => {
  const router = Router()
  const entradaCombustibleController = new EntradaCombustibleController({ entradaCombustibleModel })

  router.post('/entrada', entradaCombustibleController.agregarEntradaCombustible)
  router.get('/entrada', entradaCombustibleController.obtenerEntradasCombustibles)

  return router
}
