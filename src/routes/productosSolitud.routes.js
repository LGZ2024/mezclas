import { Router } from 'express'
import { ProductosController } from '../controller/productosSolicitud.controller.js'

export const createProductosSoliRouter = ({ productossModel }) => {
  const router = Router()
  const productossController = new ProductosController({ productossModel })

  // Crear solicitud
  router.get('/productoSolicitud/:idSolicitud', productossController.obtenerProductosSolicitud)
  router.get('/mezclasId/:id', productossController.obtenerTablaMezclasId)
  router.post('/productoSoli', productossController.create)
  router.post('/actualizarEstadoProductos', productossController.actulizarEstado)
  router.delete('/eliminarProducto/:id', productossController.EliminarPorducto)
  return router
}
