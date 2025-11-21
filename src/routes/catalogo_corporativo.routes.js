import { Router } from 'express'
import { CatalogoController } from '../controller/catalogo_corporativo.controller.js'

export const createCatalogoRouter = ({ catalogoModel }) => {
  const router = Router()

  const catalogoController = new CatalogoController({ catalogoModel })

  router.post('/catalogos/empresas', catalogoController.agregarEmpresa)
  router.patch('/catalogos/empresas/:id', catalogoController.actualizarEmpresa)
  router.get('/catalogos/empresas', catalogoController.obtenerEmpresas)

  router.post('/catalogos/departamentos', catalogoController.agregarDepartamento)
  router.patch('/catalogos/departamentos/:id', catalogoController.actualizarDepartamento)
  router.get('/catalogos/departamentos', catalogoController.obtenerDepartamentos)

  router.post('/catalogos/roles', catalogoController.agregarRol)
  router.patch('/catalogos/roles/:id', catalogoController.actualizarRol)
  router.get('/catalogos/roles', catalogoController.obtenerRoles)

  router.post('/catalogos/ranchos', catalogoController.agregarRancho)
  router.patch('/catalogos/ranchos/:id', catalogoController.actualizarRancho)
  router.get('/catalogos/ranchos', catalogoController.obtenerRanchos)

  router.post('/catalogos/temporadas', catalogoController.agregarTemporada)
  router.patch('/catalogos/temporadas/:id', catalogoController.actualizarTemporada)
  router.get('/catalogos/temporadas', catalogoController.obtenerTemporadas)

  router.post('/catalogos/tipos_aplicacion', catalogoController.agregarTipoAplicacion)
  router.patch('/catalogos/tipos_aplicacion/:id', catalogoController.actualizarTipoAplicacion)
  router.get('/catalogos/tipos_aplicacion', catalogoController.obtenerTiposAplicacion)
  router.get('/catalogos/tipos_aplicacion/:id', catalogoController.obtenerTipoAplicacionPorId)

  // aplicaciones
  router.post('/catalogos/aplicaciones', catalogoController.agregarAplicacion)
  router.patch('/catalogos/aplicaciones/:id', catalogoController.actualizarAplicacion)
  router.get('/catalogos/aplicaciones', catalogoController.obtenerAplicaciones)
  router.get('/catalogos/aplicaciones/:id', catalogoController.obtenerAplicacionesPorId)
  return router
}
