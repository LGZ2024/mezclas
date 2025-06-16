import { Router } from 'express'
import { ProductosController } from '../controller/productosSolicitud.controller.js'

export const createProductosSoliRouter = ({ productossModel }) => {
  const router = Router()
  const productossController = new ProductosController({ productossModel })

  // Crear solicitud
  router.get('/productoSolicitud/:idSolicitud', productossController.obtenerProductosSolicitud)
  router.get('/mezclasId/:id', productossController.obtenerTablaMezclasId)
  router.post('/productoSoli', productossController.create) // agregar un producto a una  solicitud
  router.post('/actualizarEstadoProductos', productossController.actulizarEstado) // guardar el esatdo de los producto de una solicitud
  router.delete('/eliminarProducto/:id', productossController.EliminarPorducto)
  return router
}
