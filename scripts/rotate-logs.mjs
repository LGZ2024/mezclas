import fs from 'fs/promises'
import path from 'path'
import { createGzip } from 'zlib'
import { pipeline } from 'stream/promises'
import { createReadStream, createWriteStream } from 'fs'
import { getLogger } from '../src/utils/logger.js'
import { fileURLToPath } from 'url'

const logger = getLogger('Rotate-Logs')

const LOG_CONFIG = {
  directory: 'logs',
  maxSize: 10 * 1024 * 1024, // 10MB
  maxFiles: 5,
  compressOlder: true
}

async function rotateLogs () {
  try {
    logger.info('Iniciando rotación de logs...')

    const logsDir = path.join(process.cwd(), LOG_CONFIG.directory)

    // Crear directorio si no existe
    await fs.mkdir(logsDir, { recursive: true })

    // Obtener lista de archivos de log
    const files = await fs.readdir(logsDir)
    const logFiles = files.filter(f => f.endsWith('.log'))

    for (const file of logFiles) {
      const filePath = path.join(logsDir, file)
      const stats = await fs.stat(filePath)

      // Verificar tamaño del archivo
      if (stats.size >= LOG_CONFIG.maxSize) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
        const rotatedName = `${file}.${timestamp}`
        const rotatedPath = path.join(logsDir, rotatedName)

        // Rotar archivo
        await fs.rename(filePath, rotatedPath)

        // Comprimir archivo rotado
        if (LOG_CONFIG.compressOlder) {
          await compressFile(rotatedPath)
          await fs.unlink(rotatedPath)
        }

        // Crear nuevo archivo de log
        await fs.writeFile(filePath, '')

        logger.info(`Rotado: ${file} -> ${rotatedName}.gz`)
      }
    }

    // Limpiar archivos antiguos
    await cleanOldFiles(logsDir)

    logger.info('✅ Rotación de logs completada')
    return true
  } catch (error) {
    logger.error('❌ Error en rotación de logs:', error)
    throw error
  }
}

async function compressFile (filePath) {
  const gzipPath = `${filePath}.gz`

  await pipeline(
    createReadStream(filePath),
    createGzip(),
    createWriteStream(gzipPath)
  )
}

async function cleanOldFiles (directory) {
  const files = await fs.readdir(directory)
  const gzFiles = files.filter(f => f.endsWith('.gz'))
    .map(f => ({
      name: f,
      path: path.join(directory, f),
      time: fs.stat(path.join(directory, f)).then(s => s.mtime.getTime())
    }))

  // Ordenar por fecha
  const sortedFiles = await Promise.all(gzFiles)
  sortedFiles.sort((a, b) => b.time - a.time)

  // Eliminar archivos más antiguos que exceden el límite
  if (sortedFiles.length > LOG_CONFIG.maxFiles) {
    const filesToDelete = sortedFiles.slice(LOG_CONFIG.maxFiles)

    for (const file of filesToDelete) {
      await fs.unlink(file.path)
      logger.info(`Eliminado log antiguo: ${file.name}`)
    }
  }
}

// Si se ejecuta directamente
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  rotateLogs()
    .then(() => process.exit(0))
    .catch(() => process.exit(1))
}
