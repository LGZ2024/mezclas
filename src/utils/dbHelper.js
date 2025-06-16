import sequelize from '../db/db.js'
import logger from './logger.js'

export class DbHelper {
  static async executeQuery (callback) {
    try {
      const result = await callback(sequelize)
      return result
    } catch (error) {
      logger.error('Error ejecutando consulta:', {
        error: error.message,
        stack: error.stack
      })
      throw error
    }
  }

  static async withTransaction (callback) {
    const transaction = await sequelize.transaction()
    try {
      const result = await callback(transaction)
      await transaction.commit()
      return result
    } catch (error) {
      await transaction.rollback()
      logger.error('Error en transacción:', {
        error: error.message
      })
      throw error
    }
  }
}

// Ejemplo de uso:
/*
import { DbHelper } from '../utils/dbHelper.js'

// Para consultas simples:
const resultado = await DbHelper.executeQuery(async (sequelize) => {
  return await MiModelo.findAll()
})

// Para transacciones:
const resultado = await DbHelper.withTransaction(async (transaction) => {
  const user = await Usuario.create({
    nombre: 'Juan',
    email: 'juan@example.com'
  }, { transaction })

  await Perfil.create({
    usuarioId: user.id,
    tipo: 'admin'
  }, { transaction })

  return user
})
*/
