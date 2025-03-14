import { Router } from 'express'
import { MezclasController } from '../controller/mezclas.controller.js'

export const createMezclasRouter = ({ mezclaModel }) => {
  const router = Router()
  const mezclasController = new MezclasController({ mezclaModel })

  // Crear solicitud
  router.post('/solicitudes', mezclasController.create)
  router.post('/CerrarSolicitud', mezclasController.cerrarSolicitid)
  router.get('/mezclasSolicitadas/:status', mezclasController.obtenerTablaMezclasEmpresa)
  router.get('/mezclasId/:id', mezclasController.obtenerTablaMezclasId)
  router.patch('/solicitudProceso/:idSolicitud', mezclasController.estadoProceso)
  router.patch('/notificacion/:idSolicitud', mezclasController.notificacion)

  return router
}
