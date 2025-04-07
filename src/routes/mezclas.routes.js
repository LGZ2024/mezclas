import { Router } from 'express'
import { MezclasController } from '../controller/mezclas.controller.js'

export const createMezclasRouter = ({ mezclaModel }) => {
  const router = Router()
  const mezclasController = new MezclasController({ mezclaModel })

  // Crear solicitud
  router.post('/solicitudes', mezclasController.create)
  router.post('/CerrarSolicitud', mezclasController.cerrarSolicitid) // cerrar mezcla
  router.get('/mezclasSolicitadas/:status', mezclasController.obtenerTablaMezclasEmpresa) // obtener mezclas
  router.get('/mezclasId/:id', mezclasController.obtenerTablaMezclasId) // obtener mezclas con id
  router.patch('/solicitudProceso/:idSolicitud', mezclasController.estadoProceso) // actualizar estado proceso
  router.patch('/notificacion/:idSolicitud', mezclasController.notificacion) // actualizar mensaje de notificacion

  return router
}
