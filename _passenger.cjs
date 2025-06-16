const { spawn } = require('child_process')
const path = require('path')
const fs = require('fs')

async function loadModule () {
  // Crear directorio de logs si no existe
  const logDir = path.join(__dirname, 'logs')
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true })
  }
  const startTime = new Date()
  const logFile = fs.createWriteStream(path.join(__dirname, 'logs', 'app.log'), { flags: 'a' })

  try {
    logFile.write(`[${new Date().toISOString()}] Puerto asignado: ${process.env.PORT}\n`)

    const app = spawn('node', ['dist/bundle.mjs'], {
      stdio: ['inherit', 'pipe', 'pipe'],
      cwd: path.resolve(__dirname),
      env: {
        ...process.env
      }
    })

    app.stdout.pipe(logFile)
    app.stderr.pipe(logFile)

    app.on('error', (error) => {
      logFile.write(`[${new Date().toISOString()}] Error al iniciar: ${error.message}\n`)
      process.exit(1)
    })

    app.on('exit', (code) => {
      const runtime = (Date.now() - startTime) / 1000
      logFile.write(`[${new Date().toISOString()}] Aplicación finalizada. Código: ${code}. Tiempo: ${runtime}s\n`)
      process.exit(code || 0)
    })
  } catch (error) {
    logFile.write(`[${new Date().toISOString()}] Error fatal: ${error.message}\n`)
    process.exit(1)
  }
}

loadModule()
