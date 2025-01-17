import { Router } from 'express'
import { ProductosController } from '../controller/productos.controller.js'

export const createProductosRouter = ({ productosModel }) => {
  const router = Router()

  const productosController = new ProductosController({ productosModel })

  // Obtener todos los productos
  router.get('/productos', productosController.getAll)

  return router
}
