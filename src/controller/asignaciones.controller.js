import { asyncHandler } from '../utils/asyncHandler.js'
export class AsignacionesController {
  constructor ({ asignacionesModel }) {
    this.asignacionesModel = asignacionesModel
  }

  agregarAsignacion = asyncHandler(async (req, res) => {
    const response = await this.asignacionesModel.agregarAsignacion({ usuarioId: req.body.usuario_id, equipoId: req.body.equipo_id, fechaAsignacion: req.body.fecha, ubicacion: req.body.ubicacion, responsiva: req.body.archivoRespon })
    res.json(response)
  })
}
