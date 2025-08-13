import { Router } from 'express'
import { UnidadController } from '../controller/unidad.controller.js'

export const createUnidadRouter = ({ unidadModel }) => {
  const router = Router()

  const unidadController = new UnidadController({ unidadModel })

  // Obtener centros de coste. pasamos
  router.post('/unidadesC', unidadController.agregarUnidad)
  router.get('/unidadesC', unidadController.obtenerUnidades)
  router.get('/unidadesC/:id', unidadController.obtenerUnidad)
  router.get('/unidadesCombustibles', unidadController.obtenerUnidadesCombustibles)

  return router
}
