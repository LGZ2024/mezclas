import { Sequelize } from 'sequelize'
import { envs } from '../config/env.mjs'
import logger from '../utils/logger.js'

class DatabaseConnection {
  constructor () {
    this.connection = null
    this.retryCount = 0
    this.maxRetries = 5
    this.retryDelay = 5000 // 5 segundos
  }

  getConfig () {
    return {
      dialect: 'mysql',
      host: envs.DB_CONFIG.host,
      port: 3306,
      username: envs.DB_CONFIG.user,
      password: envs.DB_CONFIG.password,
      database: envs.DB_CONFIG.database,
      logging: msg => logger.debug(msg),
      define: {
        timestamps: false,
        freezeTableName: true,
        underscored: true
      },
      pool: {
        max: 20, // Máximo de conexiones para XAMPP
        min: 0,
        acquire: 60000, // Tiempo máximo para obtener una conexión (60 segundos)
        idle: 10000, // Tiempo máximo que una conexión puede estar inactiva (10 segundos)
        evict: 1000 // Frecuencia para comprobar conexiones muertas
      },
      dialectOptions: {
        connectTimeout: 60000,
        options: {
          // Opciones específicas para MariaDB
          trustServerCertificate: true,
          enableArithAbort: true,
          validateBulkLoadParameters: true
        }
      },
      retry: {
        match: [
          /Deadlock/i,
          /SequelizeConnectionError/,
          /SequelizeConnectionRefusedError/,
          /SequelizeHostNotFoundError/,
          /SequelizeHostNotReachableError/,
          /SequelizeInvalidConnectionError/,
          /SequelizeConnectionTimedOutError/,
          /SequelizeConnectionAcquireTimeoutError/,
          /ETIMEDOUT/,
          /ECONNRESET/,
          /ECONNREFUSED/
        ],
        max: 5 // Número máximo de reintentos
      }
    }
  }

  async connect () {
    try {
      const config = this.getConfig()

      if (!this.connection) {
        this.connection = new Sequelize(config)
      }

      await this.connection.authenticate()
      logger.info('✅ Conexión a la base de datos establecida correctamente')

      // Reiniciar contador de reintentos después de una conexión exitosa
      this.retryCount = 0

      return this.connection
    } catch (error) {
      logger.error('❌ Error al conectar con la base de datos:', {
        message: error.message,
        code: error.original?.code,
        sqlMessage: error.original?.sqlMessage,
        attempt: this.retryCount + 1
      })

      if (this.retryCount < this.maxRetries) {
        this.retryCount++
        logger.info(`Reintentando conexión en ${this.retryDelay / 1000} segundos... (Intento ${this.retryCount} de ${this.maxRetries})`)

        await new Promise(resolve => setTimeout(resolve, this.retryDelay))
        return this.connect()
      }

      throw new Error('No se pudo establecer conexión con la base de datos después de múltiples intentos')
    }
  }

  async disconnect () {
    if (this.connection) {
      try {
        await this.connection.close()
        logger.info('Conexión a la base de datos cerrada correctamente')
      } catch (error) {
        logger.error('Error al cerrar la conexión:', error)
      } finally {
        this.connection = null
      }
    }
  }

  getInstance () {
    return this.connection
  }

  // Método para verificar el estado de la conexión
  async checkConnection () {
    if (!this.connection) {
      return false
    }

    try {
      await this.connection.authenticate()
      return true
    } catch (error) {
      return false
    }
  }

  // Método para reconectar si es necesario
  async ensureConnection () {
    const isConnected = await this.checkConnection()
    if (!isConnected) {
      logger.warn('Conexión perdida, intentando reconectar...')
      await this.connect()
    }
    return this.connection
  }

  // Método para limpiar conexiones muertas
  async cleanDeadConnections () {
    if (this.connection) {
      try {
        const [results] = await this.connection.query('SELECT 1')
        if (!results) {
          logger.warn('Detectadas conexiones muertas, limpiando...')
          await this.disconnect()
          await this.connect()
        }
      } catch (error) {
        logger.error('Error al limpiar conexiones:', error)
        await this.disconnect()
        await this.connect()
      }
    }
  }
}

// Singleton instance
const dbConnection = new DatabaseConnection()
export default dbConnection
