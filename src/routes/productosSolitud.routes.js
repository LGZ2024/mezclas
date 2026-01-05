import { Router } from 'express'
import { ProductosController } from '../controller/productosSolicitud.controller.js'

export const createProductosSoliRouter = ({ productossModel }) => {
  const router = Router()
  const productossController = new ProductosController({ productossModel })

  // Crear solicitud
  router.get('/productos/solicitud/:idSolicitud', productossController.obtenerProductosSolicitud)
  router.get('/productos/:id', productossController.obtenerTablaMezclasId)
  router.post('/productos/agregar', productossController.create) // agregar un producto a una  solicitud
  router.patch('/productos/actualizar/estado/:id', productossController.actulizarEstado) // guardar el esatdo de los producto de una solicitud
  router.delete('/productos/eliminar/:id', productossController.EliminarPorducto)
  return router
}
