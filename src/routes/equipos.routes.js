import { Router } from 'express'
import { EquiposController } from '../controller/equipos.controller.js'
import { uploadArchivosActivos } from '../middlewares/upload.js'
export const createEquiposRouter = ({ equiposModel }) => {
  const router = Router()

  const equiposController = new EquiposController({ equiposModel })

  // Obtener centros de coste. pasamos
  router.get('/equipos', equiposController.getAllDisponible)
  router.post('/equipos', equiposController.agregarActivo)
  router.put('/equipos/editar/:id', equiposController.editarActivo)
  router.put('/equipo/estado/:id', equiposController.cambiarEstado)
  router.put(
    '/equipo/:id',
    uploadArchivosActivos.single('foto'),
    equiposController.agregarFoto)
  router.put(
    '/equipo/factura/:id',
    uploadArchivosActivos.single('factura'),
    equiposController.agregarFactura)
  router.put(
    '/equipo/baja/:id',
    uploadArchivosActivos.single('baja'),
    equiposController.agregarBaja
  )
  router.delete('/equipos/:id', equiposController.eliminarActivo)

  return router
}
