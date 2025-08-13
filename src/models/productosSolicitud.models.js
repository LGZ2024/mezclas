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
import { DbHelper } from '../utils/dbHelper.js'
export class SolicitudRecetaModel {
  // crear asistencia

  static async obtenerProductosSolicitud ({ idSolicitud, logContext, logger }) {
    return await DbHelper.executeQuery(async () => {
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
        return resultadosFormateados || []
      } catch (e) {
        logger.logError(e, {
          ...logContext,
          error: e.message
        })
        if (e instanceof CustomError) throw e
        throw new DatabaseError('Error al obtener las mezclas')
      }
    })
  }

  static async obtenerTablaMezclasId ({ id, logContext, logger }) {
    return await DbHelper.executeQuery(async () => {
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
        logger.logError(e, {
          ...logContext,
          error: e.message
        })
        if (e instanceof CustomError) throw e
        throw new DatabaseError('Error al obtener las mezclas')
      }
    })
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

  static async create ({ data, idUsuario, logContext, logger }) {
    return await DbHelper.withTransaction(async (transaction) => {
      try {
        // Validación inicial de datos
        this.validarDatosProducto(data)

        // Verificar si el producto ya existe
        const productoExistente = await SolicitudProductos.findOne({
          where: {
            id_solicitud: data.idSolicitud,
            id_producto: data.producto
          }
        })

        if (productoExistente) {
          logger.warn('Intento de crear producto duplicado', {
            ...logContext,
            productoId: data.producto
          })
          throw new ValidationError('Producto ya existe en la solicitud')
        }

        logger.logOperation('Creando nuevo producto', 'iniciando', {
          ...logContext,
          producto: data.producto
        })

        // Crear el producto
        const nuevoProducto = await SolicitudProductos.create({
          id_solicitud: data.idSolicitud,
          id_producto: data.producto,
          unidad_medida: data.unidadMedida,
          cantidad: data.cantidad
        }, { transaction })

        logger.logOperation('Producto creado exitosamente', 'finalizado', {
          ...logContext,
          productoId: nuevoProducto.id,
          duration: Date.now() - new Date(logContext.timestamp).getTime()
        })

        return {
          status: 'success',
          message: `Producto procesado exitosamente: ${data.producto}`,
          data: {
            id: nuevoProducto.id,
            idSolicitud: nuevoProducto.id_solicitud,
            producto: nuevoProducto.id_producto
          }
        }
      } catch (error) {
        logger.logError(error, {
          ...logContext,
          error: error.message
        })

        if (error instanceof CustomError) throw error

        throw new DatabaseError('Error al procesar producto', {
          originalError: error.message,
          context: logContext
        })
      }
    })
  }

  static async EliminarPorducto ({ id, logContext, logger }) {
    return await DbHelper.withTransaction(async (transaction) => {
      try {
        logger.logOperation('ELIMINAR_PRODUCTO_MODELO', 'started', logContext)
        // validamos que el id sea un numero
        if (isNaN(id)) throw new ValidationError('El id debe ser un numero')

        // Comprobar que el producto exista
        const producto = await SolicitudProductos.findByPk(id) // Usar findByPk correctamente
        if (!producto) throw new NotFoundError(`Producto con ID ${id} no encontrado`)

        // Eliminar el producto
        await producto.destroy({ transaction })

        logger.logOperation('ELIMINAR_PRODUCTO_MODELO completed', logContext, {
          duration: Date.now() - new Date(logContext.timestamp).getTime()
        })
        return { message: `Producto eliminado correctamente con id ${id}` }
      } catch (error) {
        logger.logError(error, {
          ...logContext,
          stack: error.stack
        })

        if (error instanceof CustomError) throw error

        throw new DatabaseError('Error al actualizar estados de productos', {
          originalError: error.message,
          context: logContext
        })
      }
    })
  }

  /**
   * Actualiza el estado de los productos y crea notificaciones relacionadas
   * @param {Object} params - Parámetros de actualización
   * @param {Object} params.data - Datos de los productos y mensaje
   * @param {string} params.idUsuarioMezcla - ID del mezclador
   * @returns {Promise<Object>} Resultado de la actualización
   */

  static async actualizarEstado ({ data, idUsuarioMezcla, logContext, logger }) {
    return await DbHelper.withTransaction(async (transaction) => {
      try {
        logger.logOperation('ACTUALIZAR_ESTADO_PRODUCTOS MODELO', 'started', {
          ...logContext,
          data: {
            idSolicitud: data.idSolicitud,
            estados: data.estados
          }
        })
        // Validación inicial
        await this.#validarDatosActualizacion(data, idUsuarioMezcla)

        // Procesar estados
        const resultado = await this.#procesarActualizacionEstados({
          data,
          transaction,
          logContext
        })

        logger.logOperation('ACTUALIZAR_ESTADO_PRODUCTOS MODELO', 'completed', {
          ...logContext,
          duration: Date.now() - new Date(logContext.timestamp).getTime(),
          ...resultado
        })

        return { ...resultado }
      } catch (error) {
        logger.logError(error, {
          ...logContext,
          error: error.message
        })

        if (error instanceof CustomError) throw error

        throw new DatabaseError('Error al actualizar estados de productos', {
          originalError: error.message,
          context: logContext
        })
      }
    })
  }

  // Método auxiliar para validación
  static validarDatosProducto (data) {
    const errores = []

    if (!data.idSolicitud) errores.push('El ID de solicitud es requerido')
    if (!data.producto) errores.push('El ID de producto es requerido')
    if (!data.unidadMedida) errores.push('La unidad de medida es requerida')
    if (!data.cantidad || data.cantidad <= 0) errores.push('La cantidad debe ser mayor a 0')

    if (errores.length > 0) {
      throw new ValidationError('Datos de producto inválidos', { details: errores })
    }
  }

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

  // Métodos privados auxiliares
  static async #validarDatosActualizacion (data, idUsuarioMezcla) {
    if (!data?.estados?.length || !idUsuarioMezcla) {
      throw new ValidationError('Datos requeridos no proporcionados')
    }
  }

  static async #iniciarTransaccion (logContext) {
    const transaction = await sequelize.transaction()
    logger.logDBTransaction('ACTUALIZAR_ESTADO_PRODUCTOS', 'started', {
      correlationId: logContext.correlationId
    })
    return transaction
  }

  static async #procesarActualizacionEstados ({ data, transaction, logContext }) {
    const noExistencia = []

    logger.info('Procesando actualización de estados', { estados: data.estados })
    // Si hay productos no existentes
    if (data.estados.some(estado => !estado.existe)) {
      return this.#procesarProductosNoExistentes({
        data,
        noExistencia,
        transaction,
        logContext
      })
    }

    logger.info('Todos los productos existen')

    // Si todos los productos existen
    logger.info('Procesando todos los productos existen')

    await this.procesarEstadosProductos(data, noExistencia, transaction)
    logger.info('Procesado todos los productos existen', { data, noExistencia })

    return { message: 'Mezcla Guardada correctamente' }
  }

  static async #procesarProductosNoExistentes ({ data, noExistencia, transaction, logContext }) {
    logger.info('Procesando productos no existentes', { data, noExistencia })
    const receta = await this.procesarEstadosProductos(data, noExistencia, transaction)
    logger.info('Receta obtenida', { receta })

    if (!receta?.dataValues?.id) {
      throw new NotFoundError('No se pudo obtener el ID de la solicitud')
    }

    await this.actualizarSolicitudYNotificacion({
      id: receta.dataValues.id_solicitud,
      idUsuarioMezcla: logContext.userId,
      mensaje: data.mensaje,
      transaction
    })

    const datosUsuario = await this.obtenerDatosUsuarioSolicitante(data.id_solicitud)

    if (noExistencia.length > 0) {
      const productosNoDisponibles = await this.obtenerProductosNoDisponibles(noExistencia)
      return {
        data: datosUsuario,
        productos: productosNoDisponibles,
        message: 'Mezcla Guardada correctamente'
      }
    }

    return {
      data: datosUsuario,
      message: 'Mezcla Guardada correctamente'
    }
  }
} // fin modelo
