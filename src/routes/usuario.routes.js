import { Router } from 'express'
import { UsuarioController } from '../controller/usuario.controller.js'
import { authenticate, isAdmin } from '../middlewares/authMiddleware.js'

export const createUsuarioRouter = ({ usuarioModel }) => {
  const router = Router()

  const usuarioController = new UsuarioController({ usuarioModel })

  // Crear un usuario
  router.post('/', authenticate, isAdmin, usuarioController.create)
  router.get('/', authenticate, isAdmin, usuarioController.getAll)
  router.get('/:id', authenticate, isAdmin, usuarioController.getOne)
  router.patch('/:id', authenticate, isAdmin, usuarioController.update)
  router.delete('/:id', authenticate, isAdmin, usuarioController.delete)
  router.put('/:id', authenticate, isAdmin, usuarioController.changePassword)

  // rutas de inicio de sesion
  router.post('/login', usuarioController.login) // logear usuario

  return router
}
