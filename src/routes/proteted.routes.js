import { Router } from 'express'
import { ProtetedController } from '../controller/proteted.controller.js'
// import { isAdmin, isSupervisorOrAdmin, isChecadorOrAdmin } from '../middlewares/authMiddleware.js'

export const createProtetedRouter = () => {
  const router = Router()

  const asistenciaController = new ProtetedController()
  // rutas protegidas
  router.get('/admin', asistenciaController.protected)
  router.get('/talleres', asistenciaController.talleres)
  router.get('/registrarTalleres', asistenciaController.registrarTalleres)
  router.get('/tickets', asistenciaController.tickets)
  router.get('/ticketsCerrados', asistenciaController.ticketsCerrados)
  router.get('/agregarServicio', asistenciaController.agregarServicio)
  router.get('/preventivo', asistenciaController.preventivo)
  router.get('/correctivo', asistenciaController.correctivo)
  router.get('/mantenimientos', asistenciaController.mantenimientos)
  router.get('/servicios', asistenciaController.servicios)
  router.get('/registrarTicket', asistenciaController.registrarTicket)
  router.get('/cerrarTicket', asistenciaController.cerrarTicket)
  router.get('/unidades', asistenciaController.unidades)
  router.get('/registarUnidades', asistenciaController.registrarUnidades)
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
  router.get('/entradaCombustible/', asistenciaController.agregarInventario)
  router.get('/salidaCombustible/', asistenciaController.agregarSalidaInventario)
  router.get('/cargaCombustible/', asistenciaController.agregarCargaCombustible)
  router.get('/entradas/', asistenciaController.entradasCombustible)
  router.get('/salidas/', asistenciaController.salidasCombustible)
  router.get('/cargas/', asistenciaController.cargasCombustible)
  router.get('/inventario/', asistenciaController.inventario)
  router.get('/asignaciones/', asistenciaController.asignaciones)
  router.get('/bajas/', asistenciaController.bajas)
  router.get('/historialA/', asistenciaController.historialA)
  router.get('/historialE/', asistenciaController.historialE)
  router.get('/empleadosU/', asistenciaController.empleados)

  // cerrar sesion
  router.get('/cerrarSesion', asistenciaController.logout) // logear usuario

  return router
}
