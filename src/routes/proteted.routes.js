import { Router } from 'express'
import { ProtetedController } from '../controller/proteted.controller.js'
// import { isAdmin, isSupervisorOrAdmin, isChecadorOrAdmin } from '../middlewares/authMiddleware.js'

export const createProtetedRouter = () => {
  const router = Router()

  const asistenciaController = new ProtetedController()
  // rutas protegidas
  router.get('/admin', asistenciaController.protected)
  router.get('/solicitud', asistenciaController.solicitud)
  router.get('/solicitudes', asistenciaController.solicitudes)
  router.get('/proceso', asistenciaController.proceso)
  router.get('/completadas', asistenciaController.completadas)
  router.get('/tablaSolicitudes', asistenciaController.tablaSolicitudes)
  router.get('/usuarios', asistenciaController.usuarios)
  router.get('/productos', asistenciaController.productos)
  router.get('/centroCoste', asistenciaController.centroCoste)
  router.get('/notificacion/:idSolicitud', asistenciaController.notificacion)
  router.get('/confirmacion', asistenciaController.confirmacion)
  router.get('/canceladas/', asistenciaController.canceladas)
  router.get('/registrarSolicitud/', asistenciaController.RegitrarSolicitud) // registrar solicitud completadas

  // cerrar sesion
  router.get('/cerrarSesion', asistenciaController.logout) // logear usuario

  return router
}
