import { Router } from 'express'
import { ProduccionController } from '../controller/produccion.controller.js'

export const createProduccionRouter = ({ produccionModel }) => {
  const router = Router()
  const produccionController = new ProduccionController({ produccionModel })

  // Crear solicitud
  router.get('/gastosUsuario/:tipo', produccionController.ObtenerGastoUsuario)
  router.get('/solicitudReporte', produccionController.solicitudReporte)
  router.post('/descargar-excel', produccionController.descargarEcxel)
  router.post('/descargar-solicitud', produccionController.descargarSolicitud)
  router.get('/obetenerReceta', produccionController.ObtenerReceta)
  router.post('/descargarReporte', produccionController.descargarReporte)
  router.post('/descargarReporte-v2', produccionController.descargarReporteV2)
  router.get('/reporte-pendientes', produccionController.descargarReportePendientes)
  router.get('/reporte-pendientes/:empresa', produccionController.descargarReportePendientes)

  return router
}
