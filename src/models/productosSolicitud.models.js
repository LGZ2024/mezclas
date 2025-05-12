import { SolicitudProductos } from '../schema/solicitud_receta.js'
import { Solicitud } from '../schema/mezclas.js'
import { Usuario } from '../schema/usuarios.js'
import { Productos } from '../schema/productos.js' // Asegúrate de importar el modelo de Usuario
import { Recetas } from '../schema/recetas.js' // Asegúrate de importar el modelo de Usuario
import { Notificaciones } from '../schema/notificaciones.js' // Asegúrate de importar el modelo de Usuario
import sequelize from '../db/db.js'
// utlis
import logger from '../utils/logger.js'
import { NotFoundError, ValidationError, DatabaseError, CustomError } from '../utils/CustomError.js'
export class SolicitudRecetaModel {
  // crear asistencia

  static async obtenerProductosSolicitud ({ idSolicitud }) {
    try {
      logger.info('Obteniendo productos de solicitud...', { idSolicitud })
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

      // Transformar los resultados
      const resultadosFormateados = productosSolicitud.map(productos => {
        const m = productos.toJSON()
        logger.info('Productos obtenidos exitosamente', { productos: m })
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
      return resultadosFormateados || []
    } catch (e) {
      console.log(e)
      if (e instanceof CustomError) throw e
      throw new DatabaseError('Error al obtener los productos')
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
        throw new NotFoundError('No se encontraron mezclas para los criterios especificados')
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
      if (e instanceof CustomError) throw e
      throw new DatabaseError('Error al obtener las mezclas')
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
        throw new NotFoundError('No se encontraron productos para los criterios especificados')
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
      if (e instanceof CustomError) throw e
      throw new DatabaseError('Error al obtener los producto solicitud')
    }
  }

  static async create ({ data }) {
    try {
      // Verificar si el usuario ya existe
      const producto = await SolicitudProductos.findOne({
        where: { id_solicitud: data.idSolicitud, id_producto: data.producto }
      })

      if (producto) {
        throw new ValidationError('Producto ya existe en la solicitud')
      }
      // Llamar al procedimiento almacenado
      await SolicitudProductos.create({ id_solicitud: data.idSolicitud, id_producto: data.producto, unidad_medida: data.unidadMedida, cantidad: data.cantidad })

      // Si llegamos aquí, la ejecución fue exitosa
      return {
        status: 'success',
        message: `Producto procesado exitosamente: ${data.producto}`
      }
    } catch (error) {
      if (error instanceof CustomError) throw error
      throw new DatabaseError('Error al procesar producto')
    }
  }

  // uso
  static async EliminarPorducto ({ id }) {
    try {
      // validamos que el id sea un numero
      if (isNaN(id)) throw new ValidationError('El id debe ser un numero')

      // Comprobar que el producto exista
      const producto = await SolicitudProductos.findByPk(id) // Usar findByPk correctamente
      if (!producto) throw new NotFoundError(`Producto con ID ${id} no encontrado`)

      // Eliminar el producto
      await producto.destroy()
      return { message: `Producto eliminado correctamente con id ${id}` }
    } catch (e) {
      if (e instanceof CustomError) throw e
      throw new DatabaseError('Error al eliminar el producto')
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

    logger.info('Iniciando actualización de estado de productos', { data, idUsuarioMezcla })
    try {
      // Validaciones iniciales
      if (!data?.estados?.length || !idUsuarioMezcla) {
        throw new ValidationError('Datos requeridos no proporcionados')
      }
      // Iniciar transacción
      transaction = await sequelize.transaction()

      // validamos  que todos los estados sea existe true  o false
      if (data.estados.some(estado => !estado.existe)) {
        logger.info('Iniciando transacción de mezcla', data.estados)
        // Procesar estados de productos
        const receta = await this.procesarEstadosProductos(data, noExistencia, transaction)

        if (!receta || !receta.dataValues?.id) {
          throw new NotFoundError('No se pudo obtener el ID de la solicitud')
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
        if (!datosUsuario || !datosUsuario.length) {
          throw new NotFoundError('No se encontró el usuario solicitante')
        }

        // crear notificacion
        // await this.crearNotificacion({
        //   id: receta.dataValues.id_solicitud,
        //   mensaje: `Productos no disponibles para la solicitud ${receta.dataValues.id_solicitud}`,
        //   idUsuario: datosUsuario[0].idUsuarioSolicita,
        //   transaction
        // })

        logger.verbose({
          message: 'Procesando transacción',
          transactionId: transaction.id,
          steps: ['proceso']
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
          message: 'Mezcla Guardada correctamente'
        }
      }

      await this.procesarEstadosProductos(data, noExistencia, transaction)

      return {
        message: 'Mezcla Guardada correctamente'
      }
    } catch (error) {
      if (transaction) await transaction.rollback()
      if (error instanceof CustomError) throw error
      throw new DatabaseError('Error al registrar mezcla de productos')
    }
  }

  // Métodos auxiliares
  static async procesarEstadosProductos (data, noExistencia, transaction) {
    let ultimaReceta = null

    try {
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
    } catch (error) {
      if (error instanceof CustomError) throw error
      throw new DatabaseError('Error al procesar estados productos')
    }
  }

  static async actualizarSolicitudYNotificacion ({ id, idUsuarioMezcla, mensaje, transaction }) {
    logger.info('Actualizando solicitud y notificación', { id, idUsuarioMezcla, mensaje })
    try {
      const solicitud = await Solicitud.findByPk(id, {
        transaction,
        lock: true // Bloqueo explícito
      })
      if (!solicitud) throw new NotFoundError('No se encontró la solicitud')

      solicitud.idUsuarioMezcla = idUsuarioMezcla
      if (mensaje) solicitud.respuestaMezclador = mensaje
      await solicitud.save({ transaction })
    } catch (error) {
      if (error instanceof CustomError) throw error
      throw new DatabaseError('Error al actualizar solicitud y notificacion')
    }
  }

  static async crearNotificacion ({ id, mensaje, idUsuario, transaction }) {
    try {
      if (!id || !mensaje || !idUsuario) {
        throw new ValidationError('Datos requeridos no proporcionados')
      }
      // Crear la notificación
      const notificacionData = {
        id_solicitud: id,
        mensaje,
        id_usuario: idUsuario
      }
      await Notificaciones.create(notificacionData, { transaction })
    } catch (error) {
      if (error instanceof CustomError) throw error
      throw new DatabaseError('Error al crear la notificación')
    }
  }

  static async obtenerProductosNoDisponibles (noExistencia) {
    const idsRecetas = noExistencia.map(item => item.id_receta)
    try {
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
      // Verificar si se encontraron resultados
      if (productos.length === 0) {
        throw new NotFoundError('No se encontraron productos para los criterios especificados')
      }

      return productos.map(item => ({
        id_producto: item.id_producto,
        nombre_producto: item.producto?.nombre || 'Producto no encontrado',
        unidad_medida: item.unidad_medida,
        cantidad: item.cantidad
      }))
    } catch (error) {
      if (error instanceof CustomError) throw error
      throw new DatabaseError('Error al obtener productos no disponibles')
    }
  }

  static async obtenerDatosUsuarioSolicitante (idSolicitud) {
    try {
      const usuarios = await Solicitud.findAll({
        where: { id: idSolicitud },
        include: [{
          model: Usuario,
          attributes: ['nombre', 'email']
        }],
        attributes: ['folio', 'idUsuarioSolicita']
      })
      // Verificar si se encontraron resultados
      if (usuarios.length === 0) {
        throw new NotFoundError('No se encontraron usuarios para los criterios especificados')
      }

      return usuarios.map(item => ({
        nombre: item.usuario?.nombre || 'No se encontró Nombre',
        email: item.usuario?.email || 'No se encontró Correo',
        idUsuarioSolicita: item.idUsuarioSolicita
      }))
    } catch (error) {
      if (error instanceof CustomError) throw error
      throw new DatabaseError('Error al obtener datos usuario solicitante')
    }
  }
} // fin modelo
