import { readFileSync, existsSync } from 'fs'
import { resolve } from 'path'

const checkPleskConfig = () => {
  const config = {
    node: process.version,
    env: process.env.NODE_ENV,
    mysql: {
      socket: existsSync('/var/lib/mysql/mysql.sock'),
      host: process.env.DB_HOST
    },
    memory: process.memoryUsage()
  }

  console.log('Configuración Plesk:', config)
}

checkPleskConfig()
const checkEnvFile = () => {
  const envPath = resolve(process.cwd(), `.env.${process.env.NODE_ENV || 'development'}`)
  const envContent = readFileSync(envPath, 'utf-8')
  console.log('Contenido del archivo .env:', envContent)
}

checkEnvFile()
const checkNodeVersion = () => {
  const currentVersion = process.version
  const isDevelopment = process.env.NODE_ENV === 'development'

  if (isDevelopment && !currentVersion.startsWith('v21')) {
    throw new Error('Desarrollo requiere Node.js v21.6.2')
  }

  if (!isDevelopment && !currentVersion.startsWith('v24')) {
    throw new Error('Producción requiere Node.js v24.0.1')
  }
}
checkNodeVersion()
