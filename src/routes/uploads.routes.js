import { Router } from 'express'
import { validateBase64Image } from '../middlewares/validateFormatoImg.js'
import { UploadsController } from '../controller/uploads.controller.js'

export const createUploadsRouter = () => {
  const router = Router()

  const uploadsController = new UploadsController()

  // agregar Imagenes
  router.post('/images', validateBase64Image, uploadsController.agregarImagenes)

  // obtener imagenes
  router.get('/images/:filename', uploadsController.obtenerImagenes)

  return router
}
