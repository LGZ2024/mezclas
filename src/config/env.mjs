import env from 'dotenv'
import path from 'path'

const envPath = path.resolve(process.cwd(), `.env.${process.env.NODE_ENV || 'development'}`)
// Validar versión de Node.js
// console.log('variables de entono archivo env.mjs:', process.env)

const validateNodeVersion = () => {
  const currentVersion = process.version
  const isDevelopment = process.env.NODE_ENV === 'development'

  if (isDevelopment && !currentVersion.startsWith('v21')) {
    throw new Error('Desarrollo requiere Node.js v21.6.2')
  }

  if (!isDevelopment && !currentVersion.startsWith('v24')) {
    throw new Error('Producción requiere Node.js v24.0.1')
  }
}

// Validar las variables de entorno
// const validateEnvVars = () => {
//   const required = ['DB_HOST', 'DB_USER', 'DB_NAME']
//   const optional = ['DB_PASSWORD'] // Password puede estar vacío pero debe existir

//   for (const key of required) {
//     if (!process.env[key]) {
//       throw new Error(`Falta la variable de entorno requerida: ${key}`)
//     }
//   }

//   for (const key of optional) {
//     if (!(key in process.env)) {
//       process.env[key] = '' // Valor por defecto para variables opcionales
//     }
//   }
// }

// Configuración según el entorno
const getEnvironmentConfig = () => {
  const isDevelopment = process.env.NODE_ENV === 'development'

  return {
    nodeVersion: isDevelopment ? '21.6.2' : '24.0.1',
    pool: {
      max: isDevelopment ? 5 : 10,
      min: 0,
      acquire: isDevelopment ? 30000 : 60000,
      idle: isDevelopment ? 10000 : 20000
    }
  }
}

// En src/config/env.mjs
const loadEnvVars = () => {
  const isPleskMode = process.env.PLESK_MODE === 'true'
  if (!isPleskMode) {
    env.config({ path: envPath })
    console.log('variables de desarrollo tomadas de archivo .env')
  } else {
    console.log('variables de entono del tomada del servidor:')
  }
  // Verificar variables críticas
}
// Cargar variables de entorno
loadEnvVars()

// este es un objeto que guarda nuestas variables de entorno para utilizarlas en nuestro proyecto
export const envs = {
  PORT: parseInt(process.env.PORT),
  MODE: process.env.NODE_ENV || 'development',
  DB_CONFIG: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    // Agregar configuración específica para Plesk
    ssl: process.env.DB_SSL_ENABLED === 'true' || false,
    pool: getEnvironmentConfig().pool
  },
  SECRET_JWT_KEY: process.env.SECRET_JWT_KEY,
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
  PUBLIC_KEY: process.env.PUBLIC_KEY,
  PRIVATE_KEY: process.env.PRIVATE_KEY,
  MAILTO: process.env.MAILTO,
  NOTIFICATION_ICON: process.env.NOTIFICATION_ICON,
  PLESK_MODE: process.env.PLESK_MODE || false,
  // Agregar validación
  validate () {
    // Validar versión de Node.js
    validateNodeVersion()
  }
}

// Validar variables requeridas
envs.validate()
