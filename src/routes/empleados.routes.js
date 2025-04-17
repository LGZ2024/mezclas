import { Router } from 'express'
import { EmpleadosController } from '../controller/empleados.controller.js'

export const createEmpleadosRouter = ({ equiposModel }) => {
  const router = Router()

  const empleadosController = new EmpleadosController({ equiposModel })

  // Obtener centros de coste. pasamos
  router.get('/empleados', empleadosController.getAllEmpleados)
  router.post('/empleados', empleadosController.agregarUsuario)

  return router
}
