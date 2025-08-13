import { Router } from 'express'
import { SolicitudServicioController } from '../controller/solicitudServicio.controller.js'

export const createSolicitudServicioRouter = ({ solicitudModel }) => {
  const router = Router()

  const solicitudController = new SolicitudServicioController({ solicitudModel })

  // Obtener centros de coste. pasamos
  router.post('/solicitudServicio', solicitudController.agregarTicket)
  router.get('/solicitudServicio/:id', solicitudController.obtenerTicket)
  router.get('/servicios', solicitudController.obtenerServicios)
  router.put('/solicitudServicio/:id', solicitudController.cerrarTicket)
  router.put('/solicitudServicio/pendiente/:id', solicitudController.PendienteTicket)
  router.get('/solicitudServicio/', solicitudController.obtenerTickets)
  router.get('/solicitudServicio/estado/:estado', solicitudController.obtenerTicketsEstado)

  return router
}
