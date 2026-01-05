import { Router } from 'express'
import { ActivosPageController } from '../controller/pages/activos.page.controller.js'
import { CombustiblesPageController } from '../controller/pages/combustibles.page.controller.js'
import { MezclasPageController } from '../controller/pages/mezclas.page.controller.js'
import { AdminPageController } from '../controller/pages/admin.page.controller.js'
import { CommonPageController } from '../controller/pages/common.page.controller.js'

export const createProtetedRouter = () => {
  const router = Router()

  const activosController = new ActivosPageController()
  const combustiblesController = new CombustiblesPageController()
  const mezclasController = new MezclasPageController()
  const adminController = new AdminPageController()
  const commonController = new CommonPageController()

  // rutas protegidas
  // activos fijos
  router.get('/activos_fijos', activosController.activosFijos)
  router.get('/asignaciones', activosController.asignaciones)
  router.get('/activos_fijos/bajas', activosController.bajas)
  router.get('/asignaciones/historial', activosController.historialA)
  router.get('/activos_fijos/historial', activosController.historialE)
  router.get('/empleados', activosController.empleados)
  // combustibles
  router.get('/taller', combustiblesController.talleres)
  router.get('/taller/registrar', combustiblesController.registrarTalleres)
  router.get('/tickets', combustiblesController.tickets)
  router.get('/tickets/cerrados', combustiblesController.ticketsCerrados)
  router.get('/servicios/registrar', combustiblesController.agregarServicio)
  router.get('/status/preventivo', combustiblesController.preventivo)
  router.get('/status/correctivo', combustiblesController.correctivo)
  router.get('/status/mantenimientos', combustiblesController.mantenimientos)
  router.get('/status/servicios', combustiblesController.servicios)
  router.get('/ticket/registrar', combustiblesController.registrarTicket)
  router.get('/ticket/cerrar', combustiblesController.cerrarTicket)
  router.get('/unidades', combustiblesController.unidades)
  router.get('/unidades/registrar', combustiblesController.registrarUnidades)
  router.get('/combustibles/entrada', combustiblesController.agregarInventario)
  router.get('/combustibles/salida', combustiblesController.agregarSalidaInventario)
  router.get('/combustibles/carga', combustiblesController.agregarCargaCombustible)
  router.get('/combustible/tabla/entradas', combustiblesController.entradasCombustible)
  router.get('/combustible/tabla/salidas', combustiblesController.salidasCombustible)
  router.get('/combustible/tabla/cargas', combustiblesController.cargasCombustible)
  router.get('/combustible/inventario/', combustiblesController.inventario)
  router.get('/combustibles/', combustiblesController.combustibles)

  // mezclas
  router.get('/solicitud/registrar', mezclasController.solicitud)
  router.get('/solicitud/pendientes', mezclasController.solicitudes)
  router.get('/solicitud/validacion', mezclasController.validacion)
  router.get('/solicitud/proceso', mezclasController.proceso)
  router.get('/solicitud/completadas', mezclasController.completadas)
  router.get('/notificacion/:idSolicitud', mezclasController.notificacion)
  router.get('/solicitud/confirmacion', mezclasController.confirmacion)
  router.get('/solicitud/canceladas', mezclasController.canceladas)
  router.get('/registrar/solicitud', mezclasController.RegitrarSolicitud)
  // administrador
  router.get('/admin', adminController.protected)
  router.get('/solicitudes', adminController.tablaSolicitudes)
  router.get('/usuarios', adminController.usuarios)
  router.get('/productos', adminController.productos)
  router.get('/centro_coste', adminController.centroCoste)
  router.get('/empresas/', adminController.empresas)
  router.get('/departamentos/', adminController.departamentos)
  router.get('/ranchos/', adminController.ranchos)

  // graficas
  router.get('/grafica/:tipo', commonController.graficas)
  // cerrar sesion
  router.get('/cerrarSesion', commonController.logout) // logear usuario

  return router
}
