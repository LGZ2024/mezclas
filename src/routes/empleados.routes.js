import { Router } from 'express'
import { EmpleadosController } from '../controller/empleados.controller.js'

export const createEmpleadosRouter = ({ empleadosModel }) => {
  const router = Router()

  const empleadosController = new EmpleadosController({ empleadosModel })

  // Obtener centros de coste. pasamos
  router.get('/empleados', empleadosController.getAllEmpleados)
  router.get('/empleados/tabla', empleadosController.AllEmpleados)
  router.post('/empleados', empleadosController.agregarUsuario)
  router.patch('/empleados/:empleado_id', empleadosController.editarUsuario)

  return router
}
