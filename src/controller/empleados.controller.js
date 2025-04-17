import { asyncHandler } from '../utils/asyncHandler.js'
export class EmpleadosController {
  constructor ({ empleadosModel }) {
    this.empleadosModel = empleadosModel
  }

  // extraer
  getAllEmpleados = asyncHandler(async (req, res) => {
    const response = await this.empleadosModel.getAllEmpleados()
    res.json(response)
  })

  agregarUsuario = asyncHandler(async (req, res) => {
    const response = await this.empleadosModel.agregarUsuario({ data: req.body })
    res.json(response)
  })
}
