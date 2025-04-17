import { asyncHandler } from '../utils/asyncHandler.js'
export class EquiposController {
  constructor ({ equiposModel }) {
    this.equiposModel = equiposModel
  }

  // extraer
  getAllDisponible = asyncHandler(async (req, res) => {
    const response = await this.equiposModel.getAllDisponible()

    res.json(response)
  })
}
