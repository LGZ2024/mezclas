import express from 'express';
import { usuarios,usuario,crearUsuario,actulizarUsuarioPut,actulizarUsuarioPatch,borrarUsuario} from '../controller/users.controller.js';

const router = express.Router();

//Mostrar todos los usuario
router.get('/users', usuarios)

//mostrar un solo usuarios
router.get('/user/:id',usuario)

//Crear un usuario
router.post('/user',crearUsuario)

//Editar usuario put
router.put('/user/:id',actulizarUsuarioPut)

//Editar usuario patch
router.patch('/user/:id',actulizarUsuarioPatch)


//Eliminar usuario
router.delete('/user/:id',borrarUsuario)


export default router;
