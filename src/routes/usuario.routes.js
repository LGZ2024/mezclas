import { Router } from 'express'
import { UsuarioController } from '../controller/usuario.controller.js'
import { authenticate } from '../middlewares/authMiddleware.js'

export const createUsuarioRouter = ({ usuarioModel }) => {
  const router = Router()

  const usuarioController = new UsuarioController({ usuarioModel })

  // Crear un usuario
  router.post('/', authenticate, usuarioController.create)
  router.get('/usuarios', authenticate, usuarioController.getUsuarios)
  router.get('/', authenticate, usuarioController.getAll)
  router.get('/:id', authenticate, usuarioController.getOne)
  router.patch('/:id', authenticate, usuarioController.update)
  router.delete('/:id', authenticate, usuarioController.delete)
  router.put('/:id', authenticate, usuarioController.changePassword)

  // rutas de inicio de sesion
  router.post('/login', usuarioController.login) // logear usuario

  return router
}
