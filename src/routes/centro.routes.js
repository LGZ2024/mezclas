import { Router } from 'express'
import { CentroController } from '../controller/centro.controller.js'

export const createCentroCosteRouter = ({ centroModel }) => {
  const router = Router()

  const centroController = new CentroController({ centroModel })

  // Obtener centros de coste. pasamos
  router.get('/cc/:rancho', centroController.getCentrosPorRancho)

  // obtener variedades de contros de costo
  router.get('/variedades/:id', centroController.getVariedadPorCentroCoste)

  // obtener todos los centros de costo
  router.get('/centroCoste', centroController.getAll)
  router.post('/centroCoste', centroController.create)
  router.delete('/centroCoste/:id', centroController.delete)

  router.get('/centroCostess', centroController.getAllOption)

  // actualizar los datos del porcentaje de las variedades de contros de costo
  router.post('/porcentajeVariedad', centroController.porcentajeVariedad)

  return router
}
