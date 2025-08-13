import { Router } from 'express'
import { ProductosController } from '../controller/productos.controller.js'

export const createProductosRouter = ({ productosModel }) => {
  const router = Router()

  const productosController = new ProductosController({ productosModel })

  // Obtener todos los productos
  router.get('/productos', productosController.getAll)
  router.post('/productos', productosController.create)
  router.put('/productos/:id', productosController.update)
  router.delete('/productos/:id', productosController.delete)

  return router
}
