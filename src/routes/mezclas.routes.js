import { Router } from 'express'
import { MezclasController } from '../controller/mezclas.controller.js'
import { uploadFotoMezclas } from '../middlewares/upload.js'

export const createMezclasRouter = ({ mezclaModel }) => {
  const router = Router()
  const mezclasController = new MezclasController({ mezclaModel })

  // Crear solicitud
  router.post('/mezclas/registro', mezclasController.create)
  router.post('/mezclas/registrar', mezclasController.registrarSolicitud) // registrar mezcla por administrador
  router.post('/mezclas/validacion', mezclasController.validacion) // confirmacion de solicitudes por parte de produccion
  // obtener solicitud
  router.get('/mezclas/canceladas', mezclasController.obtenerTablasCancelada)
  router.get('/mezclas/confirmar', mezclasController.obtenerTablasConfirmar)
  router.get('/mezclas/:id', mezclasController.obtenerTablaMezclasId) // obtener mezclas con id
  router.get('/mezclas/solicitadas/:status', mezclasController.obtenerTablaMezclasEmpresa) // obtener mezclas
  // actualizar
  router.put(
    '/mezclas/cerrar/:idSolicitud',
    uploadFotoMezclas.single('imagen'),
    mezclasController.cerrarSolicitid) // cerrar mezcla
  router.patch('/mezclas/solicitudProceso/:idSolicitud', mezclasController.estadoProceso) // actualizar estado proceso
  router.patch('/mezclas/validacion/:idSolicitud', mezclasController.validaciones) // validacion por parte de los solicittantes
  router.patch('/mezclas/cancelar/:idSolicitud', mezclasController.cancelar) // actualizar mensaje de notificacion
  router.patch('/mezclas/confirmar/:idSolicitud', mezclasController.mezclaConfirmar) // confirmacion de solicitud por parte de produccion
  // eliminar
  router.delete('/mezclas/registro/:id', mezclasController.delete)
  return router
}
