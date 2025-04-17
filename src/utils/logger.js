import winston from 'winston'
import 'winston-daily-rotate-file'
import { envs } from '../config/env.mjs'

// Definir niveles personalizados
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  verbose: 4,
  debug: 5,
  silly: 6
}

// Formato personalizado
const customFormat = winston.format.combine(
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss'
  }),
  winston.format.json(),
  winston.format.prettyPrint(),
  winston.format.colorize({
    all: true,
    colors: {
      error: 'red',
      warn: 'yellow',
      info: 'green',
      http: 'magenta',
      debug: 'blue'
    }
  }),
  winston.format.label({
    label: envs.MODE.toUpperCase()
  }),
  winston.format.align(),
  winston.format.printf(({ timestamp, level, message, label, ...metadata }) => {
    const metaStr = Object.keys(metadata).length
      ? `\n${JSON.stringify(metadata, null, 2)}`
      : ''

    return `[${timestamp}] ${level} [${label}]: ${message}${metaStr}`
  })
)

const logger = winston.createLogger({
  level: envs.MODE === 'development' ? 'debug' : 'info',
  levels,
  format: customFormat,
  transports: [
    // Logs de error con rotación diaria
    new winston.transports.DailyRotateFile({
      filename: 'logs/error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      maxFiles: '14d',
      compress: true, // Comprimir logs antiguos
      format: customFormat
    }),

    // Logs de advertencia con rotación diaria
    new winston.transports.DailyRotateFile({
      filename: 'logs/warn-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      level: 'warn',
      maxFiles: '14d',
      compress: true, // Comprimir logs antiguos
      format: customFormat
    }),

    // Logs combinados con rotación diaria
    new winston.transports.DailyRotateFile({
      filename: 'logs/combined-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxFiles: '14d',
      compress: true, // Comprimir logs antiguos
      format: customFormat
    }),

    // Archivo estático para errores críticos
    new winston.transports.File({
      filename: 'logs/critical-errors.log',
      level: 'error',
      format: customFormat
    })
  ]
})

// Agregar consola en desarrollo
if (envs.MODE !== 'production') {
  logger.add(new winston.transports.Console({
    format: customFormat,
    // Niveles personalizados por tipo de log
    levels: {
      error: { color: 'red', background: 'black' },
      warn: { color: 'yellow', background: 'black' },
      info: { color: 'green', background: 'black' },
      http: { color: 'magenta', background: 'black' },
      debug: { color: 'blue', background: 'black' }
    }
  }))
}

// Agregar métodos de conveniencia
const metrics = {
  operations: new Map()
}

logger.startOperation = (operationName, metadata = {}) => {
  metrics.operations.set(operationName, Date.now())
  logger.info(`Iniciando operación: ${operationName}`, metadata)
}

logger.endOperation = (operationName, metadata = {}) => {
  const startTime = metrics.operations.get(operationName)
  const duration = Date.now() - startTime
  logger.info(`Finalizando operación: ${operationName}`, {
    ...metadata,
    duration_ms: duration
  })
  metrics.operations.delete(operationName)
}

logger.logError = (error, metadata = {}) => {
  logger.error({
    message: error.message,
    stack: error.stack,
    ...metadata
  })
}

logger.correlateEvents = (correlationId) => {
  return {
    start: (operationName, metadata = {}) => {
      logger.info(`Iniciando: ${operationName}`, {
        correlationId,
        ...metadata
      })
    },
    end: (operationName, metadata = {}) => {
      logger.info(`Finalizando: ${operationName}`, {
        correlationId,
        ...metadata
      })
    }
  }
}

logger.exceptions.handle(
  new winston.transports.File({
    filename: 'logs/exceptions.log',
    format: customFormat
  })
)

logger.rejections.handle(
  new winston.transports.File({
    filename: 'logs/rejections.log',
    format: customFormat
  })
)

export default logger
