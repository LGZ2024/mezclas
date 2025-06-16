import { Router } from 'express'
import { DevolucionController } from '../controller/devolucion.controller.js'

export const createDevolucionRouter = ({ devolucionModel }) => {
  const router = Router()

  const devolucionController = new DevolucionController({ devolucionModel })

  // Obtener centros de coste. pasamos
  router.post('/devoluciones', devolucionController.registrarDevolucion)
  router.patch('/devoluciones/:id', devolucionController.actualizarEstadoDevolucio)
  router.get('/devolucioness/:status', devolucionController.getAllDevoluciones)

  return router
}
