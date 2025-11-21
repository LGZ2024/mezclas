import { asyncHandler } from '../utils/asyncHandler.js'
export class CatalogoController {
  constructor ({ catalogoModel }) {
    this.catalogoModel = catalogoModel
  }

  agregarEmpresa = asyncHandler(async (req, res) => {
    const { user } = req.session
    const logger = req.logger

    const logContext = {
      operation: 'Creacion empresa',
      userName: user.nombre,
      userId: user.id,
      userRole: user.rol,
      data: {
        ...req.body
      }
    }
    logger.info('Iniciando controlador', logContext)
    const empresa = await this.catalogoModel.agregarEmpresa({ datos: req.body, logger, logContext })
    logger.info('Finalizando controlador', logContext)
    res.json(empresa)
  })

  agregarDepartamento = asyncHandler(async (req, res) => {
    const { user } = req.session
    const logger = req.logger

    const logContext = {
      operation: 'Creacion departamento',
      userName: user.nombre,
      userId: user.id,
      userRole: user.rol,
      data: {
        ...req.body
      }
    }
    logger.info('Iniciando controlador', logContext)
    const departamento = await this.catalogoModel.agregarDepartamento({ datos: req.body, logger, logContext })
    logger.info('Finalizando controlador', logContext)
    res.json(departamento)
  })

  agregarRol = asyncHandler(async (req, res) => {
    const { user } = req.session
    const logger = req.logger

    const logContext = {
      operation: 'Creacion rol',
      userName: user.nombre,
      userId: user.id,
      userRole: user.rol,
      data: {
        ...req.body
      }
    }
    logger.info('Iniciando controlador', logContext)
    const rol = await this.catalogoModel.agregarRol({ datos: req.body, logger, logContext })
    logger.info('Finalizando controlador', logContext)
    res.json(rol)
  })

  agregarRancho = asyncHandler(async (req, res) => {
    const { user } = req.session
    const logger = req.logger

    const logContext = {
      operation: 'Creacion rancho',
      userName: user.nombre,
      userId: user.id,
      userRole: user.rol,
      data: {
        ...req.body
      }
    }
    logger.info('Iniciando controlador', logContext)
    const rancho = await this.catalogoModel.agregarRancho({ datos: req.body, logger, logContext })
    logger.info('Finalizando controlador', logContext)
    res.json(rancho)
  })

  agregarTemporada = asyncHandler(async (req, res) => {
    const { user } = req.session
    const logger = req.logger

    const logContext = {
      operation: 'Creacion temporada',
      userName: user.nombre,
      userId: user.id,
      userRole: user.rol,
      data: {
        ...req.body
      }
    }
    logger.info('Iniciando controlador', logContext)
    const temporada = await this.catalogoModel.agregarTemporada({ datos: req.body, logger, logContext })
    logger.info('Finalizando controlador', logContext)
    res.json(temporada)
  })

  agregarTipoAplicacion = asyncHandler(async (req, res) => {
    const { user } = req.session
    const logger = req.logger

    const logContext = {
      operation: 'Creacion tipo de aplicacion',
      userName: user.nombre,
      userId: user.id,
      userRole: user.rol,
      data: {
        ...req.body
      }
    }
    logger.info('Iniciando controlador', logContext)
    const tipoAplicacion = await this.catalogoModel.agregarTipoAplicacion({ datos: req.body, logger, logContext })
    logger.info('Finalizando controlador', logContext)
    res.json(tipoAplicacion)
  })

  agregarAplicacion = asyncHandler(async (req, res) => {
    const { user } = req.session
    const logger = req.logger

    const logContext = {
      operation: 'Creacion aplicacion',
      userName: user.nombre,
      userId: user.id,
      userRole: user.rol,
      data: {
        ...req.body
      }
    }
    logger.info('Iniciando controlador', logContext)
    const aplicacion = await this.catalogoModel.agregarAplicacion({ datos: req.body, logger, logContext })
    logger.info('Finalizando controlador', logContext)
    res.json(aplicacion)
  })

  // controladores para actualizar los catalogos
  actualizarEmpresa = asyncHandler(async (req, res) => {
    const { user } = req.session
    const { id } = req.params
    const logger = req.logger

    const logContext = {
      operation: 'Actualizacion empresa',
      userName: user.nombre,
      userId: user.id,
      userRole: user.rol,
      data: {
        ...req.body
      }
    }
    logger.info('Iniciando controlador', logContext)
    const empresa = await this.catalogoModel.actualizarEmpresa(id, req.body)
    logger.info('Finalizando controlador', logContext)
    res.json(empresa)
  })

  actualizarDepartamento = asyncHandler(async (req, res) => {
    const { user } = req.session
    const { id } = req.params
    const logger = req.logger

    const logContext = {
      operation: 'Actualizacion departamento',
      userName: user.nombre,
      userId: user.id,
      userRole: user.rol,
      data: {
        ...req.body
      }
    }
    logger.info('Iniciando controlador', logContext)
    const departamento = await this.catalogoModel.actualizarDepartamento(id, req.body)
    logger.info('Finalizando controlador', logContext)
    res.json(departamento)
  })

  actualizarRancho = asyncHandler(async (req, res) => {
    const { user } = req.session
    const { id } = req.params
    const logger = req.logger

    const logContext = {
      operation: 'Actualizacion rancho',
      userName: user.nombre,
      userId: user.id,
      userRole: user.rol,
      data: {
        ...req.body
      }
    }
    logger.info('Iniciando controlador', logContext)
    const rancho = await this.catalogoModel.actualizarRancho(id, req.body)
    logger.info('Finalizando controlador', logContext)
    res.json(rancho)
  })

  actualizarTemporada = asyncHandler(async (req, res) => {
    const { user } = req.session
    const { id } = req.params
    const logger = req.logger

    const logContext = {
      operation: 'Actualizacion temporada',
      userName: user.nombre,
      userId: user.id,
      userRole: user.rol,
      data: {
        ...req.body
      }
    }
    logger.info('Iniciando controlador', logContext)
    const temporada = await this.catalogoModel.actualizarTemporada(id, req.body)
    logger.info('Finalizando controlador', logContext)
    res.json(temporada)
  })

  actualizarRol = asyncHandler(async (req, res) => {
    const { user } = req.session
    const { id } = req.params
    const logger = req.logger

    const logContext = {
      operation: 'Actualizacion rol',
      userName: user.nombre,
      userId: user.id,
      userRole: user.rol,
      data: {
        ...req.body
      }
    }
    logger.info('Iniciando controlador', logContext)
    const rol = await this.catalogoModel.actualizarRol(id, req.body)
    logger.info('Finalizando controlador', logContext)
    res.json(rol)
  })

  actualizarTipoAplicacion = asyncHandler(async (req, res) => {
    const { user } = req.session
    const { id } = req.params
    const logger = req.logger

    const logContext = {
      operation: 'Actualizacion tipo de aplicacion',
      userName: user.nombre,
      userId: user.id,
      userRole: user.rol,
      data: {
        ...req.body
      }
    }
    logger.info('Iniciando controlador', logContext)
    const tipoAplicacion = await this.catalogoModel.actualizarTipoAplicacion(id, req.body)
    logger.info('Finalizando controlador', logContext)
    res.json(tipoAplicacion)
  })

  actualizarAplicacion = asyncHandler(async (req, res) => {
    const { user } = req.session
    const { id } = req.params
    const logger = req.logger

    const logContext = {
      operation: 'Actualizacion aplicacion',
      userName: user.nombre,
      userId: user.id,
      userRole: user.rol,
      data: {
        ...req.body
      }
    }
    logger.info('Iniciando controlador', logContext)
    const aplicacion = await this.catalogoModel.actualizarAplicacion(id, req.body)
    logger.info('Finalizando controlador', logContext)
    res.json(aplicacion)
  })

  // controladores para obtener los catalogos
  obtenerEmpresas = asyncHandler(async (req, res) => {
    const { user } = req.session
    const logger = req.logger

    const logContext = {
      operation: 'Obtencion de empresas1111',
      userName: user.nombre,
      userId: user.id,
      userRole: user.rol
    }
    logger.info('Iniciando controlador', logContext)
    const empresas = await this.catalogoModel.obtenerEmpresas()
    logger.info('Finalizando controlador', logContext)
    res.json(empresas)
  })

  obtenerDepartamentos = asyncHandler(async (req, res) => {
    const { user } = req.session
    const logger = req.logger

    const logContext = {
      operation: 'Obtencion de departamentos',
      userName: user.nombre,
      userId: user.id,
      userRole: user.rol
    }
    logger.info('Iniciando controlador', logContext)
    const departamentos = await this.catalogoModel.obtenerDepartamentos()
    logger.info('Finalizando controlador', logContext)
    res.json(departamentos)
  })

  obtenerRanchos = asyncHandler(async (req, res) => {
    const { user } = req.session
    const logger = req.logger

    const logContext = {
      operation: 'Obtencion de ranchos',
      userName: user.nombre,
      userId: user.id,
      userRole: user.rol
    }
    logger.info('Iniciando controlador', logContext)
    const ranchos = await this.catalogoModel.obtenerRanchos()
    logger.info('Finalizando controlador', logContext)
    res.json(ranchos)
  })

  obtenerTemporadas = asyncHandler(async (req, res) => {
    const { user } = req.session
    const logger = req.logger

    const logContext = {
      operation: 'Obtencion de temporadas',
      userName: user.nombre,
      userId: user.id,
      userRole: user.rol
    }
    logger.info('Iniciando controlador', logContext)
    const temporadas = await this.catalogoModel.obtenerTemporadas()
    logger.info('Finalizando controlador', logContext)
    console.log('Temporadas obtenidas:', temporadas)
    res.json(temporadas)
  })

  obtenerRoles = asyncHandler(async (req, res) => {
    const { user } = req.session
    const logger = req.logger

    const logContext = {
      operation: 'Obtencion de roles',
      userName: user.nombre,
      userId: user.id,
      userRole: user.rol
    }
    logger.info('Iniciando controlador', logContext)
    const roles = await this.catalogoModel.obtenerRoles()
    logger.info('Finalizando controlador', logContext)
    res.json(roles)
  })

  obtenerTiposAplicacion = asyncHandler(async (req, res) => {
    const { user } = req.session
    const logger = req.logger

    const logContext = {
      operation: 'Obtencion de tipos de aplicacion',
      userName: user.nombre,
      userId: user.id,
      userRole: user.rol
    }
    logger.info('Iniciando controlador', logContext)
    const tiposAplicacion = await this.catalogoModel.obtenerTiposAplicacion()
    logger.info('Finalizando controlador', logContext)
    res.json(tiposAplicacion)
  })

  obtenerAplicaciones = asyncHandler(async (req, res) => {
    const { user } = req.session
    const logger = req.logger

    const logContext = {
      operation: 'Obtencion de aplicaciones',
      userName: user.nombre,
      userId: user.id,
      userRole: user.rol
    }
    logger.info('Iniciando controlador', logContext)
    const aplicaciones = await this.catalogoModel.obtenerAplicaciones()
    logger.info('Finalizando controlador', logContext)
    res.json(aplicaciones)
  })

  // controladores para obtener los catalogos por id
  obtenerTipoAplicacionPorId = asyncHandler(async (req, res) => {
    const { user } = req.session
    const { id } = req.params
    const logger = req.logger
    console.log('ID recibido en el controlador:', id)
    const logContext = {
      operation: 'Obtencion de tipo de aplicacion por ID',
      userName: user.nombre,
      userId: user.id,
      userRole: user.rol
    }
    logger.info('Iniciando controlador', logContext)
    const tipoAplicacion = await this.catalogoModel.obtenerTipoAplicacionPorId(id)
    logger.info('Finalizando controlador', logContext)
    res.json(tipoAplicacion)
  })

  obtenerAplicacionesPorId = asyncHandler(async (req, res) => {
    const { user } = req.session
    const { id } = req.params
    const logger = req.logger

    const logContext = {
      operation: 'Obtencion de aplicacion por ID',
      userName: user.nombre,
      userId: user.id,
      userRole: user.rol
    }
    logger.info('Iniciando controlador', logContext)
    const aplicaciones = await this.catalogoModel.obtenerAplicacionesPorId(id)
    logger.info('Finalizando controlador', logContext)
    res.json(aplicaciones)
  })
}
