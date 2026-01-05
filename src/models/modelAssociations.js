// models/modelAssociations.js
import { Usuario } from '../schema/usuarios.js'
import { Centrocoste } from '../schema/centro.js'
import { Solicitud } from '../schema/mezclas.js'
import { Servicios } from '../schema/servicios.js'
import { Mantenimientos } from '../schema/mantenimiento.js'
import { CatalogoTaller } from '../schema/catalogo_taller.js'
import { unidad } from '../schema/catalogo_unidad.js'
import { SolicitudProductos } from '../schema/solicitud_receta.js'
import { Productos } from '../schema/productos.js'
import { Recetas } from '../schema/recetas.js'
import { CombustibleSalida } from '../schema/combustible_salida.js'
import { CombustibleEntrada } from '../schema/combustible_entrada.js'
import { Devoluciones } from '../schema/devoluciones.js'
import { CombustibleCarga } from '../schema/combustible_carga.js'
import { unidadCombustible } from '../schema/catalogo_unidad_combustible.js'

// Nuevos esquemas para roles dinámicos
import { Roles } from '../schema/roles.js'
import { Modulos } from '../schema/modulos.js'
import { Permisos } from '../schema/permisos.js'
import { RolesPermisos } from '../schema/roles_permisos.js'
import { UsuariosRoles } from '../schema/usuarios_roles.js'
import { UsuariosAccesos } from '../schema/usuarios_accesos.js'
import { Empresas } from '../schema/empresas.js'
import { Ranchos } from '../schema/ranchos.js'

// logger
import logger from '../utils/logger.js'

export function setupAssociations() {
  // Asociaciones para combustible salida
  CombustibleSalida.belongsTo(Centrocoste, {
    foreignKey: 'centro_coste', // campo en CombustibleSalida
    targetKey: 'id' // campo en Centrocoste
  })
  // asociasion para combustible entrada
  CombustibleEntrada.belongsTo(Centrocoste, {
    foreignKey: 'centro_coste', // campo en CombustibleEntrada
    targetKey: 'id' // campo en Centrocoste
  })
  // Asociaciones para combustible carga
  CombustibleCarga.belongsTo(unidadCombustible, {
    foreignKey: 'no_economico', // campo en CombustibleCarga
    targetKey: 'id' // campo en unidadCombustible
  })
  // Asociaciones para c
  Servicios.belongsTo(CatalogoTaller, {
    foreignKey: 'taller_asignado', // campo en Servicios
    targetKey: 'id' // campo en CatalogoTaller
  })
  // asociaciones para mantenimientos
  Mantenimientos.belongsTo(unidad, {
    foreignKey: 'no_economico', // campo en Mantenimientos
    targetKey: 'id' // campo en unidad
  })
  Mantenimientos.belongsTo(CatalogoTaller, {
    foreignKey: 'taller_asignado', // campo en Mantenimientos
    targetKey: 'id' // campo en CatalogoTaller
  })
  // Asociaciones para Solicitud
  Solicitud.belongsTo(Usuario, {
    foreignKey: 'idUsuarioSolicita'
  })

  Solicitud.belongsTo(Centrocoste, {
    foreignKey: 'idCentroCoste'
  })

  Devoluciones.belongsTo(Usuario, {
    foreignKey: 'idUsuarioSolicita'
  })

  // Asociaciones para productos Solicitud
  SolicitudProductos.belongsTo(Productos, {
    foreignKey: 'id_producto'
  })
  SolicitudProductos.belongsTo(Recetas, {
    foreignKey: 'id_receta'
  })

  // asociaciones para cargas de combustible
  CombustibleCarga.belongsTo(unidadCombustible, {
    foreignKey: 'no_economico', // campo en CombustibleCarga
    targetKey: 'id' // campo en unidadCombustible
  })

  // --- Asociaciones para Roles Dinámicos ---

  // Usuarios <-> Roles (Many-to-Many)
  Usuario.belongsToMany(Roles, { through: UsuariosRoles, foreignKey: 'idUsuario', otherKey: 'idRol' })
  Roles.belongsToMany(Usuario, { through: UsuariosRoles, foreignKey: 'idRol', otherKey: 'idUsuario' })
  UsuariosRoles.belongsTo(Usuario, { foreignKey: 'idUsuario' })
  UsuariosRoles.belongsTo(Roles, { foreignKey: 'idRol' })

  // Roles <-> Permisos (Many-to-Many)
  Roles.belongsToMany(Permisos, { through: RolesPermisos, foreignKey: 'idRol', otherKey: 'idPermiso' })
  Permisos.belongsToMany(Roles, { through: RolesPermisos, foreignKey: 'idPermiso', otherKey: 'idRol' })
  RolesPermisos.belongsTo(Roles, { foreignKey: 'idRol' })
  RolesPermisos.belongsTo(Permisos, { foreignKey: 'idPermiso' })

  // Permisos -> Modulos (One-to-Many)
  Modulos.hasMany(Permisos, { foreignKey: 'idModulo' })
  Permisos.belongsTo(Modulos, { foreignKey: 'idModulo' })

  // Usuarios -> Accesos (One-to-Many)
  Usuario.hasMany(UsuariosAccesos, { foreignKey: 'idUsuario' })
  UsuariosAccesos.belongsTo(Usuario, { foreignKey: 'idUsuario' })

  // Accesos -> Empresas/Ranchos (Optional)
  UsuariosAccesos.belongsTo(Empresas, { foreignKey: 'idEmpresa' })
  UsuariosAccesos.belongsTo(Ranchos, { foreignKey: 'idRancho' })

  logger.info('✔ Asociaciones configuradas correctamente')
}
