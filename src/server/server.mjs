import express from 'express'
import compression from 'compression'
import helmet from 'helmet'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import crypto from 'crypto'
// Librerias
import swaggerUi from 'swagger-ui-express'
import { swaggerSpec } from '../utils/swagger.js'
// Configuraciones
import loggerWiston from '../utils/logger.js'
import { paths } from '../config/paths.js'

// middlewares
import { corsMiddleware } from '../middlewares/cors.js'
import { validateJSON } from '../middlewares/validateJsonMiddleware.js'
import { error404, errorHandler } from '../middlewares/error500Middleware.js'
import { apiLimiter } from '../middlewares/rateLimit.js'
import { authenticate } from '../middlewares/authMiddleware.js'
import { correlationMiddleware } from '../middlewares/correlationMiddleware.js'
// Rutas
import { createUsuarioRouter } from '../routes/usuario.routes.js'
import { createFertilizacionRouter } from '../routes/fertilizacion.routes.js'
import { createCorporativoRouter } from '../routes/corporativo.routes.js'

// Models
import { UsuarioModel } from '../models/usuario.models.js'

// Asociaciones
import { setupAssociations } from '../models/modelAssociations.js'

// Base de datos
import sequelize from '../db/db.js'

export const startServer = async (options) => {
  const { PORT, MODE } = options

  const app = express()

  // MOTOR DE PLANTILLAS EJS
  app.set('views', paths.views)
  app.set('view engine', 'ejs')
  app.set('trust proxy', 1)

  // Middlewares
  if (MODE === 'development') {
    loggerWiston.info('🔧 Modo de desarrollo')
  } else {
    loggerWiston.info('📦 Modo de producción')
  }
  // Agregar middleware de correlación
  app.use(correlationMiddleware)

  app.use(compression({
    filter: (req, res) => {
      if (req.headers['x-no-compression']) {
        return false
      }
      return compression.filter(req, res)
    },
    level: 6 // nivel de compresión (0-9)
  }))

  // Middleware para generar nonce
  app.use((req, res, next) => {
    res.locals.nonce = crypto.randomBytes(16).toString('base64')
    next()
  })

  // Configuración de seguridad Helmet con CSP basada en Nonce
  const isDev = MODE === 'development'

  // Configuración de seguridad para permitir recursos externos mientras se mantiene la seguridad básica
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: [
          "'self'",
          "'unsafe-inline'",
          'https://ka-f.fontawesome.com',
          'https://fertilizacion.portalrancho.com.mx',
          'https://cdn.jsdelivr.net'
        ],
        scriptSrc: [
          "'self'",
          (req, res) => `'nonce-${res.locals.nonce}'`,
          'https://cdn.jsdelivr.net',
          'https://code.jquery.com',
          ...(isDev ? ["'unsafe-inline'"] : [])
        ],
        scriptSrcAttr: ["'unsafe-inline'"],
        fontSrc: [
          "'self'",
          'https://ka-f.fontawesome.com',
          'https://fonts.googleapis.com', // ✅ dominio de la hoja de estilos
          'https://fonts.gstatic.com', // ✅ dominio donde están los archivos de fuente reales
          'data:'
        ],
        connectSrc: [
          "'self'",
          'https://ka-f.fontawesome.com',
          'https://cdn.jsdelivr.net',
          'https://fonts.googleapis.com', // ✅ necesario para el service worker
          'https://fonts.gstatic.com', // ✅ necesario para el service worker
          ...(isDev ? ['http://localhost:3000'] : [])
        ],
        imgSrc: [
          "'self'",
          'data:',
          'blob:',
          'https://fertilizacion.portalrancho.com.mx'
        ],
        mediaSrc: ["'self'", 'blob:'],
        workerSrc: ["'self'", 'blob:'],
        childSrc: ["'self'", 'blob:'],
        frameSrc: [
          "'self'",
          'https://fertilizacion.portalrancho.com.mx',
          ...(isDev ? ['http://localhost:3000'] : [])
        ],

        frameAncestors: isDev
          ? ["'self'", 'http://localhost:3000']
          : ["'self'", 'https://mezclas.portalrancho.com.mx'], // ✅ permite iframes desde tu propio dominio

        // ✅ Corregido: 'none' no puede combinarse con otros valores
        objectSrc: isDev
          ? ["'self'", 'http://localhost:3000']
          : ["'self'", 'https://mezclas.portalrancho.com.mx'],

        baseUri: ["'self'"],
        formAction: ["'self'"],

        ...(isDev ? {} : { upgradeInsecureRequests: null })

      }
    },
        hsts: isDev
      ? false
      : {
          maxAge: 31536000,
          includeSubDomains: true,
          preload: true
        },

    noSniff: true,
    frameguard: false,
    hidePoweredBy: true,
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },

    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: 'same-site' }
  }))

  // Configurar middleware para cookies y CORS
  app.use(cookieParser())
  app.use(validateJSON)
  app.use(corsMiddleware())
  app.disable('x-powered-by')

  app.use(bodyParser.json({ limit: '50mb' }))
  app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: true
  }))

  if (MODE !== 'development') {
    loggerWiston.info('🔒 limite de peticiones por IP Activado') // eslint-disable-line no-console
    app.use(apiLimiter) // Limitar el número de peticiones por IP
  }

  // Validar que la documentación está disponible solo en desarrollo
  if (MODE === 'development') {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
    loggerWiston.info('📚 Documentación API disponible en /api-docs')
  }
  // rutas API
  app.use('/api/usuario/', createUsuarioRouter({ usuarioModel: UsuarioModel }))

  // Modulo Fertilizacion
  app.use('/api/fertilizacion', authenticate, createFertilizacionRouter())

  // Modulo Corporativo
  app.use('/corporativo', authenticate, createCorporativoRouter())

  // PAGINA DE Inicio
  app.get('/', (req, res) => {
    res.render('main', { error: null, registerError: null })
  })

  app.use(express.static(paths.public))

  // Manejo de errores 404
  app.use(error404)

  // Manejo de errores 500
  app.use(errorHandler)
  try {
    // Verificar conexión a la base de datos antes de iniciar
    await sequelize.authenticate({
      retry: {
        max: 3,
        timeout: 10000
      }
    })
    // asociaciones antes de sincronizar
    setupAssociations()
    await sequelize.sync()
    loggerWiston.info('📦 Base de datos conectada y sincronizada')
    // Iniciamos el servidor en el puerto especificado
    app.listen(PORT, () => loggerWiston.info(`🚀 Servidor corriendo en puerto ${PORT}`))
  } catch (error) {
    loggerWiston.error('❌ Error al iniciar:', {
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack
      }
    })
    process.exit(1)
  }
}
