import { SolicitudProductos } from '../schema/solicitud_receta.js'
import { Solicitud } from '../schema/mezclas.js'
import { Usuario } from '../schema/usuarios.js'
import { Productos } from '../schema/productos.js' // Asegúrate de importar el modelo de Usuario
import { Recetas } from '../schema/recetas.js' // Asegúrate de importar el modelo de Usuario
import { Notificaciones } from '../schema/notificaciones.js' // Asegúrate de importar el modelo de Usuario
import sequelize from '../db/db.js'
export class SolicitudRecetaModel {
  // crear asistencia

  static async obtenerProductosSolicitud ({ idSolicitud }) {
    try {
      const productosSolicitud = await SolicitudProductos.findAll({
        where: {
          id_solicitud: idSolicitud
        },
        include: [
          {
            model: Productos, // producto
            attributes: ['nombre', 'id_sap'] // Campos que quieres obtener del usuario
          },
          {
            model: Recetas, // Modelo de Recetas
            attributes: ['nombre'] // Campos que quieres obtener del modelo Recetas
          }
        ],
        attributes: [
          'id_receta',
          'id_solicitud',
          'id_producto',
          'unidad_medida',
          'cantidad'
        ]
      })

      // Verificar si se encontraron resultados
      if (productosSolicitud.length === 0) {
        return {
          message: 'No se encontraron productos para los criterios especificados',
          data: []
        }
      }

      // Transformar los resultados
      const resultadosFormateados = productosSolicitud.map(productos => {
        const m = productos.toJSON()
        return {
          id_receta: m.id_receta,
          id_solicitud: m.id_solicitud,
          id_sap: m.producto.id_sap,
          nombre_producto: m.producto && m.producto.nombre ? m.producto.nombre : (m.receta ? m.receta.nombre : 'Producto y receta no encontrados'),
          unidad_medida: m.unidad_medida,
          cantidad: m.cantidad
        }
      })

      // Devolver los resultados
      return resultadosFormateados
    } catch (e) {
      console.error('Error al obtener productos:', e.message)
      return {
        error: 'Error al obtener las productos',
        detalle: e.message
      }
    }
  }

  static async obtenerTablaMezclasId ({ id }) {
    try {
      // Consulta para obtener las mezclas filtradas por empresa y status
      const mezclas = await SolicitudProductos.findAll({
        where: {
          id
        },
        include: [
          {
            model: Productos, // Modelo de Usuario
            attributes: ['nombre'] // Campos que quieres obtener del usuario
          }
        ],
        attributes: [
          'id',
          'ranchoDestino',
          'variedad',
          'folio',
          'temporada',
          'cantidad',
          'presentacion',
          'metodoAplicacion',
          'descripcion',
          'status',
          'empresa',
          'fechaSolicitud',
          'imagenSolicitud'
        ]
      })

      // Verificar si se encontraron resultados
      if (mezclas.length === 0) {
        return {
          message: 'No se encontraron mezclas para los criterios especificados',
          data: []
        }
      }

      // Transformar los resultados
      // Transformar los resultados
      const resultadosFormateados = mezclas.map(mezcla => {
        const m = mezcla.toJSON()
        return {
          id: m.id,
          Solicita: m.usuario ? m.usuario.nombre : 'Usuario no encontrado',
          fechaSolicitud: m.fechaSolicitud,
          ranchoDestino: m.ranchoDestino,
          empresa: m.empresa,
          centroCoste: m.centrocoste ? m.centrocoste.centroCoste : 'Centro no encontrado',
          variedad: m.variedad,
          FolioReceta: m.folio,
          temporada: m.temporada,
          cantidad: m.cantidad,
          prensetacion: m.presentacion,
          metodoAplicacion: m.metodoAplicacion,
          imagen: m.imagenSolicitud,
          descripcion: m.descripcion,
          status: m.status
        }
      })

      // Devolver los resultados
      return {
        message: 'Mezclas obtenidas correctamente',
        data: resultadosFormateados
      }
    } catch (e) {
      console.error('Error al obtener mezclas:', e.message)
      return {
        error: 'Error al obtener las mezclas',
        detalle: e.message
      }
    }
  }

  static async obtenerProductoNoDisponibles ({ idSolicitud }) {
    try {
      const productoSolicitud = await SolicitudProductos.findAll({
        where: {
          id_solicitud: idSolicitud,
          status: 0
        },
        include: [
          {
            model: Productos, // producto
            attributes: ['nombre', 'id_sap'] // Campos que quieres obtener del usuario
          }
        ],
        attributes: [
          'id_solicitud',
          'id_producto',
          'unidad_medida',
          'cantidad'
        ]
      })

      // Verificar si se encontraron resultados
      if (productoSolicitud.length === 0) {
        return {
          message: 'No se encontraron productos para los criterios especificados',
          data: []
        }
      }

      // Transformar los resultados
      const resultadosFormateados = productoSolicitud.map(productos => {
        const m = productos.toJSON()
        return {
          id_solicitud: m.id_solicitud,
          id_sap: m.producto.id_sap,
          nombre_producto: m.producto && m.producto.nombre ? m.producto.nombre : (m.receta ? m.receta.nombre : 'Producto y receta no encontrados'),
          unidad_medida: m.unidad_medida,
          cantidad: m.cantidad
        }
      })

      // Devolver los resultados
      return resultadosFormateados
    } catch (e) {
      console.error(e.message) // Salida: Error la productoSolicitud
      return { error: 'Error al obtener los producto solicitud' }
    }
  }

  static async create ({ data }) {
    try {
      // Verificar si el usuario ya existe
      const producto = await SolicitudProductos.findOne({
        where: { id_solicitud: data.idSolicitud, id_producto: data.producto }
      })

      if (producto) {
        return { error: 'producto ya existe en la solicitud' }
      }
      // Llamar al procedimiento almacenado
      await SolicitudProductos.create({ id_solicitud: data.idSolicitud, id_producto: data.producto, unidad_medida: data.unidadMedida, cantidad: data.cantidad })

      // Si llegamos aquí, la ejecución fue exitosa
      return {
        status: 'success',
        message: `Producto procesado exitosamente: ${data.producto}`
      }
    } catch (error) {
      // Manejo de errores
      console.error(`Error al procesar producto ${data.producto}:`, error)
      return {
        status: 'error',
        message: error.message || 'Error desconocido'
      }
    }
  }

  static async EliminarPorducto ({ id }) {
    try {
      // Comprobar que el producto exista
      const producto = await SolicitudProductos.findByPk(id) // Usar findByPk correctamente
      if (!producto) return { error: 'Producto no encontrado' }

      // Eliminar el producto
      await producto.destroy()
      return { message: `Producto eliminado correctamente con id ${id}` }
    } catch (e) {
      console.error('Error al eliminar el producto:', e.message) // Registrar el error
      return { error: 'Error al eliminar el producto' }
    }
  }

  /**
   * Actualiza el estado de los productos y crea notificaciones relacionadas
   * @param {Object} params - Parámetros de actualización
   * @param {Object} params.data - Datos de los productos y mensaje
   * @param {string} params.idUsuarioMezcla - ID del mezclador
   * @returns {Promise<Object>} Resultado de la actualización
   */

  static async actualizarEstado ({ data, idUsuarioMezcla }) {
    let transaction
    const noExistencia = []
    const estados = {
      estados: []
    }

    try {
      // Validaciones iniciales
      if (!data?.estados?.length || !idUsuarioMezcla) {
        throw new Error('Datos requeridos no proporcionados')
      }

      // Iniciar transacción
      transaction = await sequelize.transaction()

      // Procesar estados de productos
      const receta = await this.procesarEstadosProductos(data, noExistencia, transaction)
      console.log('datos de la receta')
      console.log(receta.dataValues)
      if (!receta || !receta.dataValues?.id) {
        throw new Error('No se pudo obtener el ID de la solicitud')
      }

      // // Actualizar solicitud y crear notificación
      await this.actualizarSolicitudYNotificacion({
        id: receta.dataValues.id_solicitud,
        idUsuarioMezcla,
        mensaje: data.mensaje,
        transaction
      })

      // Obtener datos del usuario solicitante
      const datosUsuario = await this.obtenerDatosUsuarioSolicitante(data.id_solicitud)

      // crear notificacion
      await this.crearNotificacion({
        id: receta.dataValues.id_solicitud,
        mensaje: `Productos no disponibles para la solicitud ${receta.dataValues.id_solicitud}`,
        idUsuario: datosUsuario[0].idUsuarioSolicita,
        transaction
      })

      await transaction.commit()

      // Procesar productos no existentes
      if (noExistencia.length > 0) {
        const productosNoDisponibles = await this.obtenerProductosNoDisponibles(noExistencia)
        estados.estados.push(...productosNoDisponibles)
      }

      return {
        data: datosUsuario,
        productos: estados.estados,
        message: 'Solicitud de mezcla registrada correctamente'
      }
    } catch (error) {
      if (transaction) await transaction.rollback()
      console.error('Error al registrar solicitud:', error)
      return {
        error: 'Error al registrar solicitud',
        detalle: error.message
      }
    }
  }

  // Métodos auxiliares
  static async procesarEstadosProductos (data, noExistencia, transaction) {
    let ultimaReceta = null

    const estadosPromesas = data.estados.map(async (estado) => {
      if (!estado.existe) {
        noExistencia.push({ id_receta: estado.id_receta })
      }

      const receta = await SolicitudProductos.findByPk(estado.id_receta, { transaction })

      if (!receta) {
        throw new Error(`Producto ${estado.id_receta} no encontrado`)
      }

      receta.status = estado.existe
      await receta.save({ transaction })
      ultimaReceta = receta
    })

    await Promise.all(estadosPromesas)
    return ultimaReceta
  }

  static async actualizarSolicitudYNotificacion ({ id, idUsuarioMezcla, mensaje, transaction }) {
    try {
      const solicitud = await Solicitud.findByPk(id, {
        transaction,
        lock: true // Bloqueo explícito
      })
      if (!solicitud) throw new Error('No se encontró la solicitud')

      solicitud.idUsuarioMezcla = idUsuarioMezcla
      if (mensaje) solicitud.respuestaMezclador = mensaje
      await solicitud.save({ transaction })
    } catch (error) {
      throw new Error(`Error en actualizarSolicitudYNotificacion: ${error.message}`)
    }
  }

  static async crearNotificacion ({ id, mensaje, idUsuario, transaction }) {
    try {
      if (mensaje) {
        const notificacionData = {
          id_solicitud: id,
          mensaje,
          id_usuario: idUsuario
        }
        const notificacion = await Notificaciones.create(notificacionData, { transaction })

        if (!notificacion) throw new Error('Error al crear la notificación')
      } else {
        console.log(`mensaje vacio:${mensaje}`)
      }
    } catch (error) {
      console.error('Error al registrar solicitud:', error)
    }
  }

  static async obtenerProductosNoDisponibles (noExistencia) {
    const idsRecetas = noExistencia.map(item => item.id_receta)
    const productos = await SolicitudProductos.findAll({
      where: { id_receta: idsRecetas },
      include: [{
        model: Productos,
        attributes: ['nombre']
      }],
      attributes: [
        'id_producto',
        'unidad_medida',
        'cantidad']
    })

    return productos.map(item => ({
      id_producto: item.id_producto,
      nombre_producto: item.producto?.nombre || 'Producto no encontrado',
      unidad_medida: item.unidad_medida,
      cantidad: item.cantidad
    }))
  }

  static async obtenerDatosUsuarioSolicitante (idSolicitud) {
    const usuarios = await Solicitud.findAll({
      where: { id: idSolicitud },
      include: [{
        model: Usuario,
        attributes: ['nombre', 'email']
      }],
      attributes: ['folio', 'idUsuarioSolicita']
    })

    return usuarios.map(item => ({
      nombre: item.usuario?.nombre || 'No se encontró Nombre',
      email: item.usuario?.email || 'No se encontró Correo',
      idUsuarioSolicita: item.idUsuarioSolicita
    }))
  }
} // fin modelo
