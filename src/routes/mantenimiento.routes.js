import { Router } from 'express'
import { MantenimientoController } from '../controller/mantenimiento.controller.js'

export const createManteniminetoRouter = ({ mantenimientoModel }) => {
  const router = Router()

  const mantenimientoController = new MantenimientoController({ mantenimientoModel })

  // Obtener centros de coste. pasamos
  router.post('/mantenimiento', mantenimientoController.agregarMantenimiento)
  router.get('/mantenimiento', mantenimientoController.obtenerMantenimientos)
  router.get('/mantenimiento/:tipoServicio', mantenimientoController.obtenerMantenimientoTipoServicio)

  return router
}
