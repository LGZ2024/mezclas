import express from 'express'
import logger from 'morgan'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import fileUpload from 'express-fileupload'
import path from 'path'
import { fileURLToPath } from 'url'

// middlewares
import { corsMiddleware } from '../middlewares/cors.js'
import { validateJSON } from '../middlewares/validateJsonMiddleware.js'
import { error404 } from '../middlewares/error500Middleware.js'
import { authenticate, isGeneral } from '../middlewares/authMiddleware.js'

// Rutas
import { createProtetedRouter } from '../routes/proteted.routes.js' // protegidas
import { createUsuarioRouter } from '../routes/usuario.routes.js'
import { createCentroCosteRouter } from '../routes/centro.routes.js'
import { createMezclasRouter } from '../routes/mezclas.routes.js'
import { createProductosRouter } from '../routes/productos.routes.js'
import { createProductosSoliRouter } from '../routes/productosSolitud.routes.js'
import { createProduccionRouter } from '../routes/produccion.routes.js'

// Models
import { UsuarioModel } from '../models/usuario.models.js'
import { CentroCosteModel } from '../models/centro.models.js'
import { MezclaModel } from '../models/mezclas.models.js'
import { ProductosModel } from '../models/productos.models.js'
import { SolicitudRecetaModel } from '../models/productosSolicitud.models.js'
import { ProduccionModel } from '../models/produccion.models.js'

// Asociaciones
import { setupAssociations } from '../models/modelAssociations.js'

import sequelize from '../db/db.js'

export const startServer = async (options) => {
  const { PORT } = options

  const app = express()

  const __filename = fileURLToPath(import.meta.url)
  const __dirname = path.dirname(__filename)

  // MOTOR DE PLANTILLAS EJS
  app.set('views', path.resolve(__dirname, '..', 'views'))
  app.set('view engine', 'ejs')

  // LOGGER
  app.use(logger('dev'))

  app.use(cookieParser())
  app.use(validateJSON)
  app.use(corsMiddleware())
  app.disable('x-powered-by')

  app.use(fileUpload())
  app.use(bodyParser.json({ limit: '50mb' }))
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))

  // rutas API
  app.use('/api/usuario/', createUsuarioRouter({ usuarioModel: UsuarioModel }))
  app.use('/api/', authenticate, createCentroCosteRouter({ centroModel: CentroCosteModel }))
  app.use('/api/', authenticate, createMezclasRouter({ mezclaModel: MezclaModel }))
  app.use('/api/', authenticate, createProductosRouter({ productosModel: ProductosModel })) // Autentificacion general
  app.use('/api/', authenticate, createProductosSoliRouter({ productossModel: SolicitudRecetaModel }))
  app.use('/api/', authenticate, createProduccionRouter({ produccionModel: ProduccionModel }))

  // rutas Protegidas
  app.use('/protected/', authenticate, isGeneral, createProtetedRouter()) // Autentificacion general

  // PAGINA DE Inicio
  app.get('/', (req, res) => {
    res.render('main', { error: null, registerError: null })
  })

  // contenido estatico que ponemos disponible
  app.use(express.static('public'))

  // Manejo de errores 404
  app.use(error404)

  try {
    // Configurar asociaciones antes de sincronizar
    setupAssociations()
    await sequelize.sync()
    console.log('Base de datos sincronizada')
    app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`))
  } catch (error) {
    console.error('Error al sincronizar la base de datos:', error)
  }
}
