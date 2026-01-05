import { asyncHandler } from '../utils/asyncHandler.js'
import { RoleService } from '../services/role.service.js'

export class CatalogoController {
  constructor({ catalogoModel }) {
    this.catalogoModel = catalogoModel
  }

  agregarEmpresa = asyncHandler(async (req, res) => {
    const { user } = req.session
    const logger = req.logger
    const logContext = { operation: 'Creacion empresa', userName: user.nombre, userId: user.id, userRole: user.rol, data: { ...req.body } }
    logger.info('Iniciando controlador', logContext)
    const empresa = await this.catalogoModel.agregarEmpresa(req.body)
    logger.info('Finalizando controlador', logContext)
    res.json(empresa)
  })

  actualizarEmpresa = asyncHandler(async (req, res) => {
    const { user } = req.session
    const { id } = req.params
    const logger = req.logger
    const logContext = { operation: 'Actualizacion empresa', userName: user.nombre, userId: user.id, userRole: user.rol, data: { ...req.body } }
    logger.info('Iniciando controlador', logContext)
    const empresa = await this.catalogoModel.actualizarEmpresa(id, req.body)
    logger.info('Finalizando controlador', logContext)
    res.json(empresa)
  })

  obtenerEmpresas = asyncHandler(async (req, res) => {
    const { user } = req.session
    const logger = req.logger
    const logContext = { operation: 'Obtencion de empresas', userName: user.nombre, userId: user.id, userRole: user.rol }
    logger.info('Iniciando controlador', logContext)
    const empresas = await this.catalogoModel.obtenerEmpresas()
    logger.info('Finalizando controlador', logContext)
    res.json(empresas)
  })

  agregarDepartamento = asyncHandler(async (req, res) => {
    const { user } = req.session
    const logger = req.logger
    const logContext = { operation: 'Creacion departamento', userName: user.nombre, userId: user.id, userRole: user.rol, data: { ...req.body } }
    logger.info('Iniciando controlador', logContext)
    const departamento = await this.catalogoModel.agregarDepartamento(req.body)
    logger.info('Finalizando controlador', logContext)
    res.json(departamento)
  })

  actualizarDepartamento = asyncHandler(async (req, res) => {
    const { user } = req.session
    const { id } = req.params
    const logger = req.logger
    const logContext = { operation: 'Actualizacion departamento', userName: user.nombre, userId: user.id, userRole: user.rol, data: { ...req.body } }
    logger.info('Iniciando controlador', logContext)
    const departamento = await this.catalogoModel.actualizarDepartamento(id, req.body)
    logger.info('Finalizando controlador', logContext)
    res.json(departamento)
  })

  obtenerDepartamentos = asyncHandler(async (req, res) => {
    const { user } = req.session
    const logger = req.logger
    const logContext = { operation: 'Obtencion de departamentos', userName: user.nombre, userId: user.id, userRole: user.rol }
    logger.info('Iniciando controlador', logContext)
    const departamentos = await this.catalogoModel.obtenerDepartamentos()
    logger.info('Finalizando controlador', logContext)
    res.json(departamentos)
  })

  agregarRancho = asyncHandler(async (req, res) => {
    const { user } = req.session
    const logger = req.logger
    const logContext = { operation: 'Creacion rancho', userName: user.nombre, userId: user.id, userRole: user.rol, data: { ...req.body } }
    logger.info('Iniciando controlador', logContext)
    const rancho = await this.catalogoModel.agregarRancho(req.body)
    logger.info('Finalizando controlador', logContext)
    res.json(rancho)
  })

  actualizarRancho = asyncHandler(async (req, res) => {
    const { user } = req.session
    const { id } = req.params
    const logger = req.logger
    const logContext = { operation: 'Actualizacion rancho', userName: user.nombre, userId: user.id, userRole: user.rol, data: { ...req.body } }
    logger.info('Iniciando controlador', logContext)
    const rancho = await this.catalogoModel.actualizarRancho(id, req.body)
    logger.info('Finalizando controlador', logContext)
    res.json(rancho)
  })

  obtenerRanchos = asyncHandler(async (req, res) => {
    const { user } = req.session
    const logger = req.logger
    const logContext = { operation: 'Obtencion de ranchos', userName: user.nombre, userId: user.id, userRole: user.rol }
    logger.info('Iniciando controlador', logContext)
    const ranchos = await this.catalogoModel.obtenerRanchos()
    logger.info('Finalizando controlador', logContext)
    res.json(ranchos)
  })

  agregarTemporada = asyncHandler(async (req, res) => {
    const { user } = req.session
    const logger = req.logger
    const logContext = { operation: 'Creacion temporada', userName: user.nombre, userId: user.id, userRole: user.rol, data: { ...req.body } }
    logger.info('Iniciando controlador', logContext)
    const temporada = await this.catalogoModel.agregarTemporada(req.body)
    logger.info('Finalizando controlador', logContext)
    res.json(temporada)
  })

  actualizarTemporada = asyncHandler(async (req, res) => {
    const { user } = req.session
    const { id } = req.params
    const logger = req.logger
    const logContext = { operation: 'Actualizacion temporada', userName: user.nombre, userId: user.id, userRole: user.rol, data: { ...req.body } }
    logger.info('Iniciando controlador', logContext)
    const temporada = await this.catalogoModel.actualizarTemporada(id, req.body)
    logger.info('Finalizando controlador', logContext)
    res.json(temporada)
  })

  obtenerTemporadas = asyncHandler(async (req, res) => {
    const { user } = req.session
    const logger = req.logger
    const logContext = { operation: 'Obtencion de temporadas', userName: user.nombre, userId: user.id, userRole: user.rol }
    logger.info('Iniciando controlador', logContext)
    const temporadas = await this.catalogoModel.obtenerTemporadas()
    logger.info('Finalizando controlador', logContext)
    res.json(temporadas)
  })

  agregarTipoAplicacion = asyncHandler(async (req, res) => {
    const { user } = req.session
    const logger = req.logger
    const logContext = { operation: 'Creacion tipo aplicacion', userName: user.nombre, userId: user.id, userRole: user.rol, data: { ...req.body } }
    logger.info('Iniciando controlador', logContext)
    const tipoAplicacion = await this.catalogoModel.agregarTipoAplicacion(req.body)
    logger.info('Finalizando controlador', logContext)
    res.json(tipoAplicacion)
  })

  actualizarTipoAplicacion = asyncHandler(async (req, res) => {
    const { user } = req.session
    const { id } = req.params
    const logger = req.logger
    const logContext = { operation: 'Actualizacion tipo aplicacion', userName: user.nombre, userId: user.id, userRole: user.rol, data: { ...req.body } }
    logger.info('Iniciando controlador', logContext)
    const tipoAplicacion = await this.catalogoModel.actualizarTipoAplicacion(id, req.body)
    logger.info('Finalizando controlador', logContext)
    res.json(tipoAplicacion)
  })

  agregarAplicacion = asyncHandler(async (req, res) => {
    const { user } = req.session
    const logger = req.logger
    const logContext = { operation: 'Creacion aplicacion', userName: user.nombre, userId: user.id, userRole: user.rol, data: { ...req.body } }
    logger.info('Iniciando controlador', logContext)
    const aplicacion = await this.catalogoModel.agregarAplicacion(req.body)
    logger.info('Finalizando controlador', logContext)
    res.json(aplicacion)
  })

  actualizarAplicacion = asyncHandler(async (req, res) => {
    const { user } = req.session
    const { id } = req.params
    const logger = req.logger
    const logContext = { operation: 'Actualizacion aplicacion', userName: user.nombre, userId: user.id, userRole: user.rol, data: { ...req.body } }
    logger.info('Iniciando controlador', logContext)
    const aplicacion = await this.catalogoModel.actualizarAplicacion(id, req.body)
    logger.info('Finalizando controlador', logContext)
    res.json(aplicacion)
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
    // Adaptar req.body si es necesario. RoleService espera { nombre, descripcion }
    // Si el frontend envía 'rol', lo mapeamos a 'nombre'
    const data = {
      nombre: req.body.rol || req.body.nombre,
      descripcion: req.body.descripcion
    }
    const rol = await RoleService.createRole(data)
    logger.info('Finalizando controlador', logContext)
    res.json(rol)
  })

  // ...

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
    const data = {
      nombre: req.body.rol || req.body.nombre,
      descripcion: req.body.descripcion,
      status: req.body.status
    }
    const rol = await RoleService.updateRole(id, data)
    logger.info('Finalizando controlador', logContext)
    res.json(rol)
  })

  // ...

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
    const roles = await RoleService.getRoles()
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
