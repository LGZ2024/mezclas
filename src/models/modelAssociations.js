import { Empresas } from '../schema/empresas.js'
import { Ranchos } from '../schema/ranchos.js'
import { RanchoDsa } from '../schema/rancho_dsa.js'
import { Usuario } from '../schema/usuarios.js'

// Fertilization Module Schemas
import { ActivoMezcla } from '../schema/activo_mezcla.js'
import { Tanques } from '../schema/tanques.js'
import { Sectores } from '../schema/sectores.js'
import { MezclaCatalogo } from '../schema/mezclas_catalogo.js'
import { MezclaActivos } from '../schema/mezcla_activos.js'
import { AplicacionesTanque } from '../schema/aplicaciones_tanque.js'
import { TanquesPreparados } from '../schema/tanques_preparados.js'
import { MezclasTanque } from '../schema/mezclas_tanque.js'

// logger
import logger from '../utils/logger.js'

export function setupAssociations() {
  // --- Asociaciones Modulo Fertilizacion ---
  // Ranchos <-> Empresas
  Ranchos.belongsTo(Empresas, { foreignKey: 'id_empresa' })
  Empresas.hasMany(Ranchos, { foreignKey: 'id_empresa' })

  // Mezcla <-> Activos (Many-to-Many via MezclaActivos)
  MezclaCatalogo.hasMany(MezclaActivos, { foreignKey: 'id_mezcla' })
  MezclaActivos.belongsTo(MezclaCatalogo, { foreignKey: 'id_mezcla' })

  ActivoMezcla.hasMany(MezclaActivos, { foreignKey: 'id_activo' })
  MezclaActivos.belongsTo(ActivoMezcla, { foreignKey: 'id_activo' })

  // Relacion One-to-Many con MezclasTanque (detalle)
  TanquesPreparados.hasMany(MezclasTanque, { foreignKey: 'id_tanque_preparado' })
  MezclasTanque.belongsTo(TanquesPreparados, { foreignKey: 'id_tanque_preparado' })

  // Detalle MezclaTanque -> MezclaCatalogo
  MezclasTanque.belongsTo(MezclaCatalogo, { foreignKey: 'id_mezcla' })

  TanquesPreparados.belongsTo(Tanques, { foreignKey: 'id_tanque' })
  Tanques.hasMany(TanquesPreparados, { foreignKey: 'id_tanque' })

  TanquesPreparados.belongsTo(Ranchos, { foreignKey: 'id_rancho' })
  Ranchos.hasMany(TanquesPreparados, { foreignKey: 'id_rancho' })

  // Sectores <-> RanchoDsa
  Sectores.belongsTo(RanchoDsa, { foreignKey: 'id_rancho_dsa' })
  RanchoDsa.hasMany(Sectores, { foreignKey: 'id_rancho_dsa' })

  // RanchoDsa <-> Ranchos
  RanchoDsa.belongsTo(Ranchos, { foreignKey: 'id_rancho' })
  Ranchos.hasMany(RanchoDsa, { foreignKey: 'id_rancho' })

  // Aplicaciones
  AplicacionesTanque.belongsTo(TanquesPreparados, { foreignKey: 'id_tanque_preparado' })
  TanquesPreparados.hasMany(AplicacionesTanque, { foreignKey: 'id_tanque_preparado' })

  AplicacionesTanque.belongsTo(Sectores, { foreignKey: 'id_sector' })
  Sectores.hasMany(AplicacionesTanque, { foreignKey: 'id_sector' })

  AplicacionesTanque.belongsTo(Tanques, { foreignKey: 'id_tanque' })

  // Optional: Link Application to User if 'id_responsable' is used
  AplicacionesTanque.belongsTo(Usuario, { foreignKey: 'id_responsable' })

  // Tanques <-> Ranchos
  Tanques.belongsTo(Ranchos, { foreignKey: 'id_rancho' })
  Ranchos.hasMany(Tanques, { foreignKey: 'id_rancho' })

  logger.info('✔ Asociaciones configuradas correctamente')
}
