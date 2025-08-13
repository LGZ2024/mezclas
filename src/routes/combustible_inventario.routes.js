import { Router } from 'express'
import { InventarioController } from '../controller/combustible_inventario.controller.js'

export const createInventarioRouter = ({ inventarioModel }) => {
  const router = Router()
  const inventarioController = new InventarioController({ inventarioModel })

  router.get('/inventarios', inventarioController.obtenerInventario)

  return router
}
