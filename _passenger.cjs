const fs = require('fs')
const path = require('path')

// Configuración de entorno para Plesk
const PLESK_CONFIG = {
  NODE_ENV: 'production',
  PLESK_MODE: 'true',
  APP_PATH: path.join(__dirname, 'dist', 'bundle.mjs'),
  LOG_DIR: path.join(__dirname, 'logs')
}

// Inicializar logging
function initializeLogs () {
  if (!fs.existsSync(PLESK_CONFIG.LOG_DIR)) {
    fs.mkdirSync(PLESK_CONFIG.LOG_DIR, { recursive: true })
  }
  return {
    timestamp: new Date().toISOString(),
    logFile: path.join(PLESK_CONFIG.LOG_DIR, 'passenger.log')
  }
}

// Verificar bundle
function verifyBundle () {
  if (!fs.existsSync(PLESK_CONFIG.APP_PATH)) {
    throw new Error(`Bundle no encontrado en: ${PLESK_CONFIG.APP_PATH}`)
  }
}

// Cargar aplicación
async function loadModule () {
  const { timestamp, logFile } = initializeLogs()
  try {
    // Log de inicio
    fs.appendFileSync(logFile, `[${timestamp}] Iniciando aplicación\n`)

    // Verificar bundle
    verifyBundle()

    // Configurar variables de entorno
    process.env = {
      ...process.env,
      ...PLESK_CONFIG
    }

    // Cargar aplicación
    await import('./dist/bundle.mjs')

    fs.appendFileSync(logFile, `[${timestamp}] Aplicación iniciada correctamente\n`)
  } catch (error) {
    const errorMessage = `[${new Date().toISOString()}] Error: ${error.message}\n${error.stack}\n`
    fs.appendFileSync(logFile, errorMessage)
    console.error('Error al cargar la aplicación:', error)
    process.exit(1)
  }
}

// Manejo de errores no capturados
process.on('uncaughtException', (error) => {
  const errorMessage = `[${new Date().toISOString()}] Error no capturado: ${error.message}\n${error.stack}\n`
  fs.appendFileSync(PLESK_CONFIG.LOG_DIR + '/passenger.log', errorMessage)
  process.exit(1)
})

process.on('unhandledRejection', (reason, promise) => {
  const errorMessage = `[${new Date().toISOString()}] Promesa rechazada no manejada: ${reason}\n`
  fs.appendFileSync(PLESK_CONFIG.LOG_DIR + '/passenger.log', errorMessage)
  process.exit(1)
})

// Iniciar aplicación
loadModule()
