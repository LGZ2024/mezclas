import { Router } from 'express'
import { ServicioController } from '../controller/servicios.controller.js'

export const createServicioRouter = ({ servicioModel }) => {
  const router = Router()

  const servicioController = new ServicioController({ servicioModel })

  // Obtener centros de coste. pasamos
  router.post('/servicio', servicioController.agregarServicio)
  router.get('/servicio', servicioController.obtenerServicios)
  router.get('/servicio/:id', servicioController.obtenerUnidad)

  return router
}
