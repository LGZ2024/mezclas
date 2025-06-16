export const loggerConfig = {
  // Niveles de log por ambiente
  levels: {
    development: 'debug',
    test: 'info',
    production: 'warn'
  },
  levelColors: {
    error: 'red',
    logError: 'red',
    warn: 'yellow',
    info: 'blue',
    http: 'magenta',
    debug: 'gray',
    logModelOperation: 'gray'
  },

  logLevels: {
    error: 0,
    logError: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
    logModelOperation: 4
  },

  // Configuración de rotación de archivos
  rotation: {
    maxSize: '20m',
    maxFiles: '14d',
    compress: true
  },

  // Formato de salida
  format: {
    timestamp: 'YYYY-MM-DD HH:mm:ss',
    includeMeta: true,
    colorize: true
  },

  // Métricas y monitoreo
  metrics: {
    enabled: true,
    interval: 60000, // 1 minuto
    measurements: [
      'operationsPerSecond',
      'errorRate',
      'responseTime'
    ]
  },

  // Correlación de logs
  correlation: {
    enabled: true,
    headerName: 'X-Correlation-ID'
  }
}
