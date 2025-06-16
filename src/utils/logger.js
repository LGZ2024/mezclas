import winston from 'winston'
import 'winston-daily-rotate-file'
import { envs } from '../config/env.mjs'
import chalk from 'chalk' // Agregar para colores en terminal
import { loggerConfig } from '../config/logger.config.js'

class Logger {
  constructor () {
    this.logger = this.createLogger()
    this.metrics = new Map()
    if (loggerConfig.metrics.enabled) {
      this.startMetricsCollection()
    }
  }

  // Agregar método para correlación
  withCorrelation (correlationId) {
    return {
      info: (message, meta = {}) => this.info(message, { ...meta, correlationId }),
      error: (message, meta = {}) => this.error(message, { ...meta, correlationId }),
      warn: (message, meta = {}) => this.warn(message, { ...meta, correlationId }),
      debug: (message, meta = {}) => this.debug(message, { ...meta, correlationId }),
      logOperation: (operation, phase, details = {}) => this.logOperation(operation, phase, { ...details, correlationId }),
      logModelOperation: (modelName, operation, data = {}) => this.logModelOperation(modelName, operation, { ...data, correlationId }),
      logTransaction: (transactionId, action, details = {}) => this.logTransaction(transactionId, action, { ...details, correlationId }),
      logError: (error, context = {}) => this.logError(error, { ...context, correlationId }),
      logDBTransaction: (operation, status, details = {}) => this.logDBTransaction(operation, status, { ...details, correlationId })
    }
  }

  // Agregar colección de métricas
  startMetricsCollection () {
    setInterval(() => {
      const metrics = {
        timestamp: new Date().toISOString(),
        operationsCount: this.metrics.get('operationsCount') || 0,
        errorCount: this.metrics.get('errorCount') || 0,
        avgResponseTime: this.calculateAverageResponseTime()
      }

      this.debug('Metrics collected', { metrics })
      this.metrics.clear()
    }, loggerConfig.metrics.interval)
  }

  // Método para registrar métricas
  recordMetric (name, value) {
    const current = this.metrics.get(name) || 0
    this.metrics.set(name, current + value)
  }

  createLogFormat () {
    const consoleFormat = winston.format.printf(({ timestamp, level, message, metadata, stack }) => {
      // Formato para la consola con colores y mejor estructura
      const levelUpperCase = level.toUpperCase().padEnd(7)
      const coloredLevel = chalk[loggerConfig.levelColors[level]](levelUpperCase)
      const time = chalk.gray(timestamp)

      let log = `${time} ${coloredLevel} │ ${message}`

      // Agregar metadata si existe
      if (Object.keys(metadata).length > 0 && metadata.metadata !== message) {
        const metadataStr = JSON.stringify(metadata.metadata, null, 2)
          .split('\n')
          .map(line => chalk.gray('│ ') + line)
          .join('\n')
        log += '\n' + metadataStr
      }

      // Agregar stack trace si existe
      if (stack) {
        const stackStr = stack
          .split('\n')
          .map(line => chalk.red('│ ') + line)
          .join('\n')
        log += '\n' + stackStr
      }

      return log
    })

    const fileFormat = winston.format.printf(({ timestamp, level, message, metadata, stack }) => {
      // Formato para archivos (sin colores)
      let log = `${timestamp} [${level.toUpperCase()}] ${message}`

      if (Object.keys(metadata).length > 0 && metadata.metadata !== message) {
        log += `\nMetadata: ${JSON.stringify(metadata.metadata, null, 2)}`
      }

      if (stack) {
        log += `\nStack: ${stack}`
      }

      return log
    })

    return {
      console: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.errors({ stack: true }),
        winston.format.metadata(),
        consoleFormat
      ),
      file: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.errors({ stack: true }),
        winston.format.metadata(),
        winston.format.json(),
        fileFormat
      )
    }
  }

  createLogger () {
    const formats = this.createLogFormat()
    const logger = winston.createLogger({
      levels: loggerConfig.logLevels,
      level: envs.MODE === 'development' ? 'debug' : 'info',
      format: formats.file,
      transports: this.createTransports(),
      exitOnError: false
    })

    if (envs.MODE !== 'production') {
      logger.add(new winston.transports.Console({
        format: formats.console
      }))
    }

    return logger
  }

  createTransports () {
    return [
      new winston.transports.DailyRotateFile({
        filename: 'logs/error-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        level: 'error',
        maxFiles: '14d',
        maxSize: '20m'
      }),
      new winston.transports.DailyRotateFile({
        filename: 'logs/combined-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        maxFiles: '14d',
        maxSize: '20m'
      })
    ]
  }

  // Método para logging de operaciones de negocio
  logOperation (operation, phase, details = {}) {
    const startTime = Date.now()
    const correlationId = details.correlationId || this.generateCorrelationId()

    const baseContext = {
      operation,
      phase,
      correlationId,
      timestamp: new Date().toISOString(),
      environment: envs.MODE,
      ...details
    }

    this.info(`${operation} ${phase}`, baseContext)

    // Registrar métricas
    this.recordMetric('operationsCount', 1)
    this.recordMetric('totalResponseTime', Date.now() - startTime)
  }

  // Método para logging de modelos
  logModelOperation (modelName, operation, data = {}) {
    const context = {
      model: modelName,
      operation,
      timestamp: new Date().toISOString(),
      ...data
    }
    this.debug(`${modelName}.${operation}`, context)
  }

  logDBTransaction (operation, status, details = {}) {
    const context = {
      operation,
      status,
      timestamp: new Date().toISOString(),
      ...details
    }
    this.debug(`DB Transaction: ${operation} ${status}`, context)
  }

  // Métodos de logging mejorados
  error (message, metadata = {}) {
    this.logger.error(message, { metadata })
  }

  warn (message, metadata = {}) {
    this.logger.warn(message, { metadata })
  }

  info (message, metadata = {}) {
    this.logger.info(message, { metadata })
  }

  debug (message, metadata = {}) {
    this.logger.debug(message, { metadata })
  }

  // Método para logging de transacciones
  logTransaction (transactionId, action, details = {}) {
    this.info(`Transaction ${action}`, {
      transactionId,
      ...details,
      timestamp: new Date().toISOString()
    })
  }

  // Método para logging de errores con contexto
  logError (error, context = {}) {
    const errorDetails = {
      correlationId: context.correlationId || this.generateCorrelationId(),
      message: error.message,
      name: error.name,
      stack: envs.MODE === 'development' ? error.stack : undefined,
      code: error.code,
      ...context
    }

    // Registrar métricas de error
    this.recordMetric('errorCount', 1)

    this.error('Error occurred', errorDetails)
  }

  // Métodos auxiliares
  calculateAverageResponseTime () {
    const total = this.metrics.get('totalResponseTime') || 0
    const count = this.metrics.get('operationsCount') || 1
    return total / count
  }

  generateCorrelationId () {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }
}

export default new Logger()
