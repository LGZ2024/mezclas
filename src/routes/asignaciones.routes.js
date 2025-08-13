import { Router } from 'express'
import { AsignacionesController } from '../controller/asignaciones.controller.js'
import { uploadResponsiva } from '../middlewares/upload.js'

export const createAsignacionesRouter = ({ asignacionesModel }) => {
  const router = Router()

  const asignacionesController = new AsignacionesController({ asignacionesModel })

  // Obtener centros de coste. pasamos
  router.post(
    '/asignaciones',
    uploadResponsiva.single('responsiva'),
    asignacionesController.agregarAsignacion)
  router.put('/asignaciones/:id', asignacionesController.editarAsignacion)
  router.put(
    '/asignaciones/responsiva/:id',
    uploadResponsiva.single('responsiva'),
    asignacionesController.editarResponsiva)
  return router
}
