import express from 'express'
// import logger from 'morgan'
import compression from 'compression'
import helmet from 'helmet'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import fileUpload from 'express-fileupload'

import { join } from 'path'

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
// import { apiLimiter } from '../middlewares/rateLimit.js'
import { authenticate } from '../middlewares/authMiddleware.js'
import { correlationMiddleware } from '../middlewares/correlationMiddleware.js'
// Rutas
import { createProtetedRouter } from '../routes/proteted.routes.js' // protegidas
import { createUsuarioRouter } from '../routes/usuario.routes.js'
import { createCentroCosteRouter } from '../routes/centro.routes.js'
import { createMezclasRouter } from '../routes/mezclas.routes.js'
import { createProductosRouter } from '../routes/productos.routes.js'
import { createProductosSoliRouter } from '../routes/productosSolitud.routes.js'
import { createProduccionRouter } from '../routes/produccion.routes.js'
import { createNotificacionesRouter } from '../routes/notificaciones.routes.js'
import { createEquiposRouter } from '../routes/equipos.routes.js'
import { createEmpleadosRouter } from '../routes/empleados.routes.js'
import { createUploadsRouter } from '../routes/uploads.routes.js'
import { createDevolucionRouter } from '../routes/devolucion.routes.js'
// Models
import { UsuarioModel } from '../models/usuario.models.js'
import { CentroCosteModel } from '../models/centro.models.js'
import { MezclaModel } from '../models/mezclas.models.js'
import { ProductosModel } from '../models/productos.models.js'
import { SolicitudRecetaModel } from '../models/productosSolicitud.models.js'
import { ProduccionModel } from '../models/produccion.models.js'
import { NotificacionModel } from '../models/notificaciones.models.js'
import { EquiposModel } from '../models/equipos.models.js'
import { EmpleadosModel } from '../models/empleados.models.js'
import { DevolucionModel } from '../models/devolucion.models.js'
// Asociaciones
import { setupAssociations } from '../models/modelAssociations.js'

// Base de datos
import sequelize from '../db/db.js'

export const startServer = async (options) => {
  const { PORT, MODE } = options

  const app = express()

  // Configura el directorio de uploads
  const uploadsDir = paths.uploads
  const imagesDir = join(uploadsDir, 'images')

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

  // Configuración de seguridad para permitir recursos externos mientras se mantiene la seguridad básica
  if (MODE !== 'development') {
    loggerWiston.info('🔒 helmet configurado')
    app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: [
            "'self'",
            "'unsafe-inline'",
            'https://ka-f.fontawesome.com',
            'http://localhost:3000'
          ],
          scriptSrc: [
            "'self'",
            "'unsafe-inline'",
            'https://ka-f.fontawesome.com'
          ],
          fontSrc: [
            "'self'",
            'https://ka-f.fontawesome.com',
            'data:'
          ],
          connectSrc: [
            "'self'",
            'https://ka-f.fontawesome.com',
            'http://localhost:3000'
          ],
          imgSrc: ["'self'", 'data:', 'https:'],
          upgradeInsecureRequests: []
        }
      },
      crossOriginEmbedderPolicy: false,
      crossOriginResourcePolicy: { policy: 'cross-origin' }
    }))
  }
  // Configurar middleware para cookies y validar JSON en los request
  app.use(cookieParser())
  app.use(validateJSON)
  app.use(corsMiddleware())
  app.disable('x-powered-by')

  app.use(fileUpload())
  app.use(bodyParser.json({ limit: '50mb' }))
  app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: true
  }))

  // if (MODE !== 'development') {
  //   loggerWiston.info('🔒 limite de peticiones por IP Activado') // eslint-disable-line no-console
  //   app.use(apiLimiter) // Limitar el número de peticiones por IP
  // }

  // Validar que la documentación está disponible solo en desarrollo
  if (MODE === 'development') {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
    loggerWiston.info('📚 Documentación API disponible en /api-docs')
  }
  // rutas API
  app.use('/api/usuario/', createUsuarioRouter({ usuarioModel: UsuarioModel }))
  app.use('/api/', authenticate, createCentroCosteRouter({ centroModel: CentroCosteModel }))
  app.use('/api/', authenticate, createMezclasRouter({ mezclaModel: MezclaModel }))
  app.use('/api/', authenticate, createProductosRouter({ productosModel: ProductosModel }))
  app.use('/api/', authenticate, createProductosSoliRouter({ productossModel: SolicitudRecetaModel }))
  app.use('/api/', authenticate, createNotificacionesRouter({ notificacionModel: NotificacionModel }))
  app.use('/api/', authenticate, createProduccionRouter({ produccionModel: ProduccionModel }))
  app.use('/api/', authenticate, createEquiposRouter({ equiposModel: EquiposModel }))
  app.use('/api/', authenticate, createEmpleadosRouter({ empleadosModel: EmpleadosModel }))
  app.use('/api/', createDevolucionRouter({ devolucionModel: DevolucionModel }))

  // rutas Protegidas
  app.use('/protected/', authenticate, createProtetedRouter())

  // Rutas para imágenes (antes de las rutas API)
  app.use('/api/', authenticate, createUploadsRouter())

  // Servir archivos estáticos de imágenes
  app.use('/api/uploads/images', authenticate, express.static(imagesDir))

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
