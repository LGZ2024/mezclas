import { DbHelper } from '../utils/dbHelper.js'
import { CombustibleInventario } from '../schema/combustible_inventario.js'
import { NotFoundError, DatabaseError } from '../utils/CustomError.js'

export class InventarioModel {
  static async obtenerInventario ({ logger, logContext }) {
    return await DbHelper.executeQuery(async () => {
      try {
        logger.info('Iniciando Modelo Inventario', logContext)
        const salidas = await CombustibleInventario.findAll({
          attributes: ['id', 'combustible', 'existencia', 'almacen', 'empresa', 'rancho']
        })
        return salidas
      } catch (error) {
        logger.error('Error al buscar Inventario', {
          ...logContext,
          error: {
            name: error.name,
            message: error.message,
            stack: error.stack,
            code: error.code
          }
        })
        if (error instanceof NotFoundError) throw error
        throw new DatabaseError('Error al buscar inventario')
      }
    })
  }
}

// Ejemplo de uso:
/*
// Crear usuario
const nuevoUsuario = await EjemploModel.crearUsuario({
  nombre: 'Juan Pérez',
  email: 'juan@example.com',
  rol: 'usuario'
})

// Buscar usuarios
const usuarios = await EjemploModel.buscarUsuarios({
  rol: 'admin'
})

// Actualizar usuario
const usuarioActualizado = await EjemploModel.actualizarUsuario(1, {
  nombre: 'Juan Modificado'
})
*/
