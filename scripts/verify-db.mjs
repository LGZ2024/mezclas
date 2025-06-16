import { Sequelize } from 'sequelize'
import { envs } from '../src/config/env.mjs'
import logger from '../src/utils/logger.js'
import { fileURLToPath } from 'url'

export async function checkDatabase () {
  const sequelize = new Sequelize({
    dialect: 'mysql',
    host: envs.DB_CONFIG.host,
    port: 3306,
    username: envs.DB_CONFIG.user,
    password: envs.DB_CONFIG.password,
    database: envs.DB_CONFIG.database,
    logging: false,
    dialectOptions: {
      connectTimeout: 5000,
      ...(envs.PLESK_MODE === 'true' && {
        socketPath: '/var/lib/mysql/mysql.sock'
      })
    }
  })

  try {
    logger.info('Verificando conexión a base de datos...', {
      host: envs.DB_CONFIG.host,
      database: envs.DB_CONFIG.database
    })

    // Probar conexión
    await sequelize.authenticate()

    // Verificar permisos básicos
    const checks = await Promise.all([
      checkTablePermissions(sequelize),
      checkDatabaseSize(sequelize),
      checkActiveConnections(sequelize)
    ])

    const [tableAccess, dbSize, connections] = checks

    logger.info('✅ Conexión a base de datos exitosa', {
      details: {
        version: await getDatabaseVersion(sequelize),
        tableAccess,
        dbSize,
        connections
      }
    })

    await sequelize.close()
    return true
  } catch (error) {
    logger.error('❌ Error al verificar base de datos:', {
      error: {
        message: error.message,
        code: error.code
      },
      config: {
        host: envs.DB_CONFIG.host,
        database: envs.DB_CONFIG.database,
        user: envs.DB_CONFIG.user
      }
    })

    if (sequelize) {
      await sequelize.close()
    }

    throw error
  }
}

// Funciones auxiliares para verificaciones específicas
async function checkTablePermissions (sequelize) {
  try {
    const [results] = await sequelize.query('SHOW TABLES')
    const tables = results.map(r => Object.values(r)[0])

    logger.debug('Tablas encontradas:', { count: tables.length, tables })

    return {
      status: 'OK',
      tablesCount: tables.length
    }
  } catch (error) {
    logger.warn('No se pudieron verificar permisos de tablas:', error.message)
    return {
      status: 'WARNING',
      error: error.message
    }
  }
}

async function checkDatabaseSize (sequelize) {
  try {
    const [results] = await sequelize.query(`
      SELECT 
        table_schema as 'database',
        ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) as 'size_mb'
      FROM information_schema.tables
      WHERE table_schema = :database
      GROUP BY table_schema
    `, {
      replacements: { database: envs.DB_CONFIG.database }
    })

    return {
      status: 'OK',
      sizeMB: results[0]?.size_mb || 0
    }
  } catch (error) {
    logger.warn('No se pudo verificar tamaño de base de datos:', error.message)
    return {
      status: 'WARNING',
      error: error.message
    }
  }
}

async function checkActiveConnections (sequelize) {
  try {
    const [results] = await sequelize.query(`
      SELECT COUNT(*) as count 
      FROM information_schema.processlist 
      WHERE db = :database
    `, {
      replacements: { database: envs.DB_CONFIG.database }
    })

    return {
      status: 'OK',
      activeConnections: results[0].count
    }
  } catch (error) {
    logger.warn('No se pudieron verificar conexiones activas:', error.message)
    return {
      status: 'WARNING',
      error: error.message
    }
  }
}

async function getDatabaseVersion (sequelize) {
  try {
    const [results] = await sequelize.query('SELECT VERSION() as version')
    return results[0].version
  } catch (error) {
    return 'Unknown'
  }
}

// Si se ejecuta directamente
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  checkDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1))
}
