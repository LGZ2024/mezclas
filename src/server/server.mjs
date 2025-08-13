import express from 'express'
// import logger from 'morgan'
import compression from 'compression'
import helmet from 'helmet'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
// import fileUpload from 'express-fileupload'

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
// import { validateBase64Image } from '../middlewares/validateFormatoImg.js'
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
import { createUnidadRouter } from '../routes/unidad.routes.js'
import { createTallerRouter } from '../routes/taller.routes.js'
import { createSolicitudServicioRouter } from '../routes/solicitudServicio.routes.js'
import { createManteniminetoRouter } from '../routes/mantenimiento.routes.js'
import { createServicioRouter } from '../routes/servicios.routes.js'
import { createEntradaCombustibleRouter } from '../routes/combustible_entrada.routes.js'
import { createSalidaCombustibleRouter } from '../routes/combustible_salida.routes.js'
import { createCargaCombustibleRouter } from '../routes/combustible_carga.routes.js'
import { createInventarioRouter } from '../routes/combustible_inventario.routes.js'
import { createAsignacionesRouter } from '../routes/asignaciones.routes.js'
// ruta para creacion de archivops pdf
import { createPdfRouter } from '../routes/pdf.routes.js'

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
import { UnidadModel } from '../models/unidad.models.js'
import { TallerModel } from '../models/taller.models.js'
import { SolicitudServicioModel } from '../models/solicitudServicio.models.js'
import { MantenimientosModel } from '../models/mantenimiento.models.js'
import { ServiciosModel } from '../models/servicios.models.js'
import { EntradaCombustibleModel } from '../models/combustible_entrada.models.js'
import { SalidaCombustibleModel } from '../models/combustible_salida.models.js'
import { CargaCombustibleModel } from '../models/combustible_carga.models.js'
import { InventarioModel } from '../models/combustible_inventario.models.js'
import { AsignacionesModel } from '../models/asignaciones.models.js'

// Asociaciones
import { setupAssociations } from '../models/modelAssociations.js'

// Base de datos
import sequelize from '../db/db.js'

export const startServer = async (options) => {
  const { PORT, MODE } = options

  const app = express()

  // Configura el directorio de uploads
  const uploadsDir = paths.uploads
  const imagesDir = join(uploadsDir)

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

  // app.use(fileUpload())
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
  app.use('/api/', authenticate, createDevolucionRouter({ devolucionModel: DevolucionModel }))
  app.use('/api/', authenticate, createUnidadRouter({ unidadModel: UnidadModel }))
  app.use('/api/', authenticate, createTallerRouter({ tallerModel: TallerModel }))
  app.use('/api/', authenticate, createSolicitudServicioRouter({ solicitudModel: SolicitudServicioModel }))
  app.use('/api/', authenticate, createManteniminetoRouter({ mantenimientoModel: MantenimientosModel }))
  app.use('/api/', authenticate, createServicioRouter({ servicioModel: ServiciosModel }))
  app.use('/api/', authenticate, createEntradaCombustibleRouter({ entradaCombustibleModel: EntradaCombustibleModel }))
  app.use('/api/', authenticate, createSalidaCombustibleRouter({ salidaCombustibleModel: SalidaCombustibleModel }))
  app.use('/api/', authenticate, createCargaCombustibleRouter({ cargaCombustibleModel: CargaCombustibleModel }))
  app.use('/api/', authenticate, createInventarioRouter({ inventarioModel: InventarioModel }))
  app.use('/api/', authenticate, createAsignacionesRouter({ asignacionesModel: AsignacionesModel }))
  // ruta para creacion de pdf
  app.use('/pdf/', authenticate, createPdfRouter())

  // rutas Protegidas
  app.use('/protected/', authenticate, createProtetedRouter())

  // Rutas para imágenes (antes de las rutas API)
  app.use('/api/', authenticate, createUploadsRouter())

  // Servir archivos estáticos
  app.use('/api/uploads/', authenticate, express.static(imagesDir))

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
