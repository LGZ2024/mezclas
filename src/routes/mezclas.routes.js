import { Router } from 'express'
import { MezclasController } from '../controller/mezclas.controller.js'

export const createMezclasRouter = ({ mezclaModel }) => {
  const router = Router()
  const mezclasController = new MezclasController({ mezclaModel })

  // Crear solicitud
  router.post('/solicitudes', mezclasController.create)
  router.post('/registrarSolicitud/', mezclasController.registrarSolicitud) // registrar mezcla
  router.post('/CerrarSolicitud', mezclasController.cerrarSolicitid) // cerrar mezcla
  router.get('/mezclasSolicitadas/:status', mezclasController.obtenerTablaMezclasEmpresa) // obtener mezclas
  router.get('/mezclasId/:id', mezclasController.obtenerTablaMezclasId) // obtener mezclas con id
  router.patch('/solicitudProceso/:idSolicitud', mezclasController.estadoProceso) // actualizar estado proceso
  // router.patch('/notificacion/:idSolicitud', mezclasController.notificacion) // actualizar mensaje de notificacion
  router.post('/validacion', mezclasController.validacion) // actualizar mensaje de notificacion
  router.patch('/cancelarSolicitud/:idSolicitud', mezclasController.cancelar) // actualizar mensaje de notificacion
  router.get('/mezclasConfirmar/', mezclasController.obtenerTablasConfirmar) // obtener solicitud
  router.patch('/mezclasConfirmar/:idSolicitud', mezclasController.mezclaConfirmar) // obtener solicitud
  router.get('/mezclasCancelada/', mezclasController.obtenerTablasCancelada) // obtener solicitud
  return router
}
