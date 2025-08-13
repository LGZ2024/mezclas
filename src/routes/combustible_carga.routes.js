import { Router } from 'express'
import { CargaCombustibleController } from '../controller/combustible_carga.controller.js'

export const createCargaCombustibleRouter = ({ cargaCombustibleModel }) => {
  const router = Router()
  const cargaCombustibleController = new CargaCombustibleController({ cargaCombustibleModel })

  router.post('/cargas', cargaCombustibleController.agregarCargaCombustible)
  router.get('/cargas/:id', cargaCombustibleController.obtenerCargaCombustible)
  router.get('/cargas', cargaCombustibleController.obtenerCargasCombustibles)

  return router
}
