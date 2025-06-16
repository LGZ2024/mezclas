import { Sequelize } from 'sequelize'
import { envs } from '../config/env.mjs'
import logger from '../utils/logger.js'

const getConnectionConfig = () => {
  const isProduction = envs.MODE === 'production'
  const config = {
    dialect: 'mysql',
    host: envs.DB_CONFIG.host,
    port: 3306,
    username: envs.DB_CONFIG.user,
    password: envs.DB_CONFIG.password,
    database: envs.DB_CONFIG.database,
    logging: false,
    // logging: msg => logger.debug(msg),
    define: {
      timestamps: false,
      freezeTableName: true,
      underscored: true
    },
    pool: {
      max: isProduction ? 10 : 5,
      min: 0,
      acquire: isProduction ? 180000 : 60000,
      idle: isProduction ? 60000 : 20000
    },
    dialectOptions: {
      connectTimeout: isProduction ? 180000 : 60000
    }
  }

  // Log de configuración para debug
  logger.debug('Configuración de base de datos:', {
    host: config.host,
    database: config.database,
    user: config.username
  })

  return config
}

const initializeConnection = async () => {
  try {
    const config = getConnectionConfig()
    const sequelize = new Sequelize(config)

    await sequelize.authenticate()
    logger.info('✅ Conexión establecida correctamente')

    return sequelize
  } catch (error) {
    logger.error('❌ Error conectando a la base de datos:', {
      message: error.message,
      code: error.original?.code,
      sqlMessage: error.original?.sqlMessage
    })
    throw error
  }
}

const sequelize = await initializeConnection()
export default sequelize
