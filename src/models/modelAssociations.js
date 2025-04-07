// models/modelAssociations.js
import { Usuario } from '../schema/usuarios.js'
import { Centrocoste } from '../schema/centro.js'
import { Solicitud } from '../schema/mezclas.js'
import { SolicitudProductos } from '../schema/solicitud_receta.js'
import { Productos } from '../schema/productos.js'
import { Recetas } from '../schema/recetas.js'
// logger
import logger from '../utils/logger.js'

export function setupAssociations () {
  // Asociaciones para Solicitud
  Solicitud.belongsTo(Usuario, {
    foreignKey: 'idUsuarioSolicita'
  })

  // Solicitud.belongsTo(Usuario, {
  //   foreignKey: 'idUsuarioMezcla'
  // })

  Solicitud.belongsTo(Centrocoste, {
    foreignKey: 'idCentroCoste'
  })

  // Asociaciones para productos Solicitud
  SolicitudProductos.belongsTo(Productos, {
    foreignKey: 'id_producto'
  })
  // Asociaciones para productos Solicitud
  SolicitudProductos.belongsTo(Recetas, {
    foreignKey: 'id_receta'
  })

  logger.info('✔ Asociaciones configuradas correctamente')
}
