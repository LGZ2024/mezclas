import { Router } from 'express'
import { CentroController } from '../controller/centro.controller.js'

export const createCentroCosteRouter = ({ centroModel }) => {
  const router = Router()

  const centroController = new CentroController({ centroModel })

  // Obtener centros de coste. pasamos el rancho
  router.get('/centros_coste/:rancho/cc', centroController.getCentrosPorRancho)

  // obtener variedades de centro de coste por id
  router.get('/centros_coste/:id/variedades', centroController.getVariedadPorCentroCoste)

  // obtener todos los centros de costo
  router.get('/centros_coste', centroController.getAll)
  router.post('/centros_coste', centroController.create)
  router.delete('/centros_coste/:id', centroController.delete)
  // router.put('/centros_coste/:id', centroController.update)
  router.get('/centros_coste/option', centroController.getAllOption)

  // actualizar los datos del porcentaje de las variedades de contros de costo
  router.post('/centros_coste/porcentaje_variedad', centroController.porcentajeVariedad)

  return router
}
