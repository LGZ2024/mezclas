import { Router } from 'express'
import { ProduccionController } from '../controller/produccion.controller.js'

export const createProduccionRouter = ({ produccionModel }) => {
  const router = Router()
  const produccionController = new ProduccionController({ produccionModel })

  router.get('/solicitudReporte', produccionController.solicitudReporte)
  router.post('/descargar-excel', produccionController.descargarEcxel)
  router.post('/descargar-solicitud', produccionController.descargarSolicitud)// uso
  router.get('/obetenerReceta', produccionController.ObtenerReceta)
  router.post('/descargarReporte', produccionController.descargarReporte) // uso
  router.post('/descargarReporte-v2', produccionController.descargarReporteV2)// uso
  router.get('/reporte-pendientes', produccionController.descargarReportePendientes)// uso
  router.get('/reporte-pendientes/:empresa', produccionController.descargarReportePendientes)// uso

  return router
}
