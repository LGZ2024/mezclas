import { Solicitud } from '../schema/mezclas.js'
import { SolicitudProductos } from '../schema/solicitud_receta.js'
import { Usuario } from '../schema/usuarios.js' // Asegúrate de importar el modelo de Usuario
import { Centrocoste } from '../schema/centro.js' // Asegúrate de importar el modelo de CentroCoste
import { guardarImagen } from '../config/foto.mjs'
import { CentroCosteModel } from '../models/centro.models.js'
import { NotificacionModel } from '../models/notificaciones.models.js'
import sequelize from '../db/db.js'
// utils
import { NotFoundError, ValidationError, DatabaseError, CustomError } from '../utils/CustomError.js'
import logger from '../utils/logger.js'

export class MezclaModel {
  // uso
  static async create ({ data, idUsuario }) {
    const transaction = await sequelize.transaction()
    let variedad, porcentajes, variedades
    try {
      // validamos datos
      if (!data || !idUsuario) {
        throw new ValidationError('Datos requeridos no proporcionados')
      }
      // validamos variedad si viene todo
      if (data.variedad === 'todo') {
        try {
          // Asumiendo que este método existe en tu modelo
          variedades = await CentroCosteModel.getVariedadPorCentroCoste({ id: data.centroCoste })

          // Convertir a array, eliminar último elemento y volver a string
          const variedadesArray = variedades[0].dataValues.variedad
            .split(',')
            .slice(0, -1)

          const porcentajesArray = variedades[0].dataValues.porcentajes
            .split(',')
            .slice(0, -1)

          // Filtrar ambos arrays en paralelo
          const filtrados = variedadesArray.reduce((acc, variedad, index) => {
            if (parseInt(porcentajesArray[index].trim()) !== 0) {
              acc.variedades.push(variedad)
              acc.porcentajes.push(porcentajesArray[index])
            }
            return acc
          }, { variedades: [], porcentajes: [] })

          // Convertir de vuelta a strings
          variedad = filtrados.variedades.join(',')
          porcentajes = filtrados.porcentajes.join(',')
        } catch (error) {
          if (error instanceof CustomError) throw error
          throw new DatabaseError('Error al consultar productos para la solicitud')
        }
      }
      // Creamos nueva solicitud con transacción
      const solicitud = await Solicitud.create({
        folio: data.folio,
        cantidad: data.cantidad,
        idCentroCoste: data.centroCoste,
        descripcion: data.descripcion,
        empresa: data.empresaPertece,
        idUsuarioSolicita: idUsuario,
        metodoAplicacion: data.metodoAplicacion,
        temporada: data.temporada,
        variedad: data.variedad === 'todo' ? variedad : data.variedad,
        presentacion: data.presentacion,
        ranchoDestino: data.rancho,
        porcentajes: data.variedad === 'todo' ? porcentajes : '100'
      }, { transaction })

      // Verificar si hay productos y procesar cada uno
      if (data.productos && Array.isArray(data.productos)) {
        // Filtrar productos válidos
        const productosValidos = data.productos.filter(producto =>
          producto.id_producto &&
          producto.unidad_medida &&
          producto.cantidad
        )

        // Validar que haya productos
        if (productosValidos.length === 0) {
          throw new ValidationError('No se encontraron productos válidos para procesar')
        }

        const productosPromesas = productosValidos.map(async (producto) => {
          // comprobaramos si el id_producto es numero
          try {
            await SolicitudProductos.create({
              id_solicitud: solicitud.id,
              id_producto: parseInt(producto.id_producto),
              unidad_medida: producto.unidad_medida,
              cantidad: producto.cantidad
            }, { transaction })
            return {
              idProducto: producto.id_producto,
              status: 'success'
            }
          } catch (errorProducto) {
            if (errorProducto instanceof CustomError) throw errorProducto
            throw new DatabaseError(`Error al procesar producto ${producto.id_producto}`)
          }
        })

        // Esperar a que se procesen todos los productos
        const resultadosProductos = await Promise.all(productosPromesas)

        // Verificar si hubo errores en los productos
        const productosConError = resultadosProductos.filter(resultado =>
          resultado.status === 'error'
        )

        if (productosConError.length > 0) {
          throw new CustomError(`Errores al procesar productos: ${JSON.stringify(productosConError)}`)
        }
      }

      // Confirmar transacción
      await transaction.commit()
      // Retornar mensaje de éxito con ID de solicitud
      return {
        message: 'Solicitud de mezcla registrada correctamente',
        idSolicitud: solicitud.id,
        fechaSolicitud: solicitud.fechaSolicitud
      }
    } catch (error) {
      // Revertir transacción en caso de error
      if (transaction) await transaction.rollback()
      if (error instanceof CustomError) throw error
      throw new DatabaseError('Error al registrar solicitud de mezcla')
    }
  }

  // uso
  static async cerrarSolicitid ({ data, idUsuario }) {
    const id = data.idSolicitud
    const status = 'Completada'
    try {
      // Validar datos
      if (!idUsuario || !data) {
        throw new ValidationError('Datos requeridos no proporcionados')
      }
      // Verificamos si existe la solicitud con el id proporcionado
      const solicitud = await Solicitud.findByPk(id)
      if (!solicitud) throw new NotFoundError('Solicitud con ID ' + id + ' no encontrada')

      // Guardar imagen
      const response = await guardarImagen({ imagen: data.imagen })

      // Actualiza solo los campos que se han proporcionado
      if (response.relativePath) solicitud.imagenEntrega = response.relativePath
      if (status) solicitud.status = status
      if (idUsuario) solicitud.idUsuarioMezcla = idUsuario
      if (response.fecha) solicitud.fechaEntrega = response.fecha

      await solicitud.save()

      return { message: 'Solicitud actualizada correctamente', status, idUsuarioSolicita: solicitud.idUsuarioSolicita, id }
    } catch (e) {
      if (e instanceof CustomError) throw e
      throw new DatabaseError('Error al actualizar solicitud')
    }
  }

  // uso
  static async obtenerTablaMezclasEmpresa ({ status, empresa }) {
    try {
      // Validar datos
      if (!status || !empresa) {
        throw new ValidationError('Datos requeridos no proporcionados')
      }
      logger.info('Obteniendo tabla de mezclas por empresa y status: ' + status + ' y ' + empresa)
      // Consulta para obtener las mezclas filtradas por empresa y status
      const mezclas = await Solicitud.findAll({
        where: {
          empresa,
          status
        },
        include: [
          {
            model: Usuario, // Modelo de Usuario
            attributes: ['nombre'] // Campos que quieres obtener del usuario
          },
          {
            model: Centrocoste, // Modelo de CentroCoste
            attributes: ['centroCoste'] // Campos que quieres obtener del centro de coste
          }
        ],
        attributes: [
          'id',
          'ranchoDestino',
          'variedad',
          'notaMezcla',
          'folio',
          'temporada',
          'cantidad',
          'presentacion',
          'metodoAplicacion',
          'descripcion',
          'status',
          'empresa',
          'fechaSolicitud',
          'imagenEntrega',
          'fechaEntrega',
          'respuestaSolicitud'
        ]
      })

      // Transformar los resultados
      const resultadosFormateados = mezclas.map(mezcla => {
        const m = mezcla.toJSON()
        return {
          id: m.id,
          Solicita: m.usuario ? m.usuario.nombre : 'Usuario no encontrado',
          fechaSolicitud: m.fechaSolicitud,
          ranchoDestino: m.ranchoDestino,
          notaMezcla: m.notaMezcla,
          empresa: m.empresa,
          centroCoste: m.centrocoste ? m.centrocoste.centroCoste : 'Centro no encontrado',
          variedad: m.variedad,
          FolioReceta: m.folio,
          temporada: m.temporada,
          cantidad: m.cantidad,
          prensetacion: m.presentacion,
          metodoAplicacion: m.metodoAplicacion,
          imagenEntrega: m.imagenEntrega,
          descripcion: m.descripcion,
          fechaEntrega: m.fechaEntrega,
          status: m.status,
          respuestaSolicitud: m.respuestaSolicitud
        }
      })

      // Devolver los resultados validar si hay resultados mandar vacio
      return Array.isArray(resultadosFormateados) ? resultadosFormateados : []
    } catch (e) {
      if (e instanceof CustomError) throw e
      throw new DatabaseError('Error al obtener las mezclas')
    }
  }

  // uso
  static async obtenerTablaMezclasRancho ({ status, ranchoDestino }) {
    try {
      // Validar datos
      if (!status || !ranchoDestino) {
        throw new ValidationError('Datos requeridos no proporcionados')
      }
      // Consulta para obtener las mezclas filtradas por empresa y status
      const mezclas = await Solicitud.findAll({
        where: {
          ranchoDestino,
          status
        },
        include: [
          {
            model: Usuario, // Modelo de Usuario
            attributes: ['nombre'] // Campos que quieres obtener del usuario
          },
          {
            model: Centrocoste, // Modelo de CentroCoste
            attributes: ['centroCoste'] // Campos que quieres obtener del centro de coste
          }
        ],
        attributes: [
          'id',
          'ranchoDestino',
          'variedad',
          'notaMezcla',
          'folio',
          'temporada',
          'cantidad',
          'presentacion',
          'metodoAplicacion',
          'descripcion',
          'status',
          'empresa',
          'fechaSolicitud',
          'imagenEntrega',
          'fechaEntrega',
          'respuestaSolicitud'
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
          notaMezcla: m.notaMezcla,
          empresa: m.empresa,
          centroCoste: m.centrocoste ? m.centrocoste.centroCoste : 'Centro no encontrado',
          variedad: m.variedad,
          FolioReceta: m.folio,
          temporada: m.temporada,
          cantidad: m.cantidad,
          prensetacion: m.presentacion,
          metodoAplicacion: m.metodoAplicacion,
          imagenEntrega: m.imagenEntrega,
          descripcion: m.descripcion,
          fechaEntrega: m.fechaEntrega,
          status: m.status,
          respuestaSolicitud: m.respuestaSolicitud
        }
      })

      // Devolver los resultados
      return Array.isArray(resultadosFormateados) ? resultadosFormateados : []
    } catch (e) {
      if (e instanceof CustomError) throw e
      throw new DatabaseError('Error al obtener las mezclas')
    }
  }

  // uso
  static async obtenerTablaMezclasUsuario ({ status, idUsuarioSolicita }) {
    try {
      // Validar datos
      if (!status || !idUsuarioSolicita) {
        throw new ValidationError('Datos requeridos no proporcionados')
      }
      // Consulta para obtener las mezclas filtradas por empresa y status
      const mezclas = await Solicitud.findAll({
        where: {
          idUsuarioSolicita,
          status
        },
        include: [
          {
            model: Usuario, // Modelo de Usuario
            attributes: ['nombre'] // Campos que quieres obtener del usuario
          },
          {
            model: Centrocoste, // Modelo de CentroCoste
            attributes: ['centroCoste'] // Campos que quieres obtener del centro de coste
          }
        ],
        attributes: [
          'id',
          'ranchoDestino',
          'variedad',
          'notaMezcla',
          'folio',
          'temporada',
          'cantidad',
          'presentacion',
          'metodoAplicacion',
          'descripcion',
          'status',
          'empresa',
          'fechaSolicitud',
          'imagenEntrega',
          'fechaEntrega',
          'respuestaSolicitud',
          'respuestaMezclador'
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
          notaMezcla: m.notaMezcla,
          empresa: m.empresa,
          centroCoste: m.centrocoste ? m.centrocoste.centroCoste : 'Centro no encontrado',
          variedad: m.variedad,
          FolioReceta: m.folio,
          temporada: m.temporada,
          cantidad: m.cantidad,
          prensetacion: m.presentacion,
          metodoAplicacion: m.metodoAplicacion,
          imagenEntrega: m.imagenEntrega,
          descripcion: m.descripcion,
          fechaEntrega: m.fechaEntrega,
          status: m.status,
          respuestaSolicitud: m.respuestaSolicitud,
          respuestaMezclador: m.respuestaMezclador
        }
      })

      // Devolver los resultados
      return Array.isArray(resultadosFormateados) ? resultadosFormateados : []
    } catch (e) {
      if (e instanceof CustomError) throw e
      throw new DatabaseError('Error al obtener las mezclas')
    }
  }

  // uso
  static async obtenerTablaMezclasId ({ id }) {
    try {
      // validar que el id sea un numero
      if (isNaN(id)) throw new ValidationError('El id debe ser un numero')
      // Consulta para obtener las mezclas filtradas por empresa y status
      const mezclas = await Solicitud.findAll({
        where: {
          id
        },
        include: [
          {
            model: Usuario, // Modelo de Usuario
            attributes: ['nombre'] // Campos que quieres obtener del usuario
          },
          {
            model: Centrocoste, // Modelo de CentroCoste
            attributes: ['centroCoste'] // Campos que quieres obtener del centro de coste
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
          'fechaSolicitud'
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

      return Array.isArray(resultadosFormateados) ? resultadosFormateados : []
    } catch (e) {
      if (e instanceof CustomError) throw e
      throw new DatabaseError('Error al obtener las mezclas')
    }
  }

  static async obtenerPorcentajes ({ id }) {
    try {
      // Consulta para obtener las mezclas filtradas por empresa y status
      const mezclas = await Solicitud.findAll({
        where: {
          id
        },
        attributes: [
          'porcentajes',
          'variedad'
        ]
      })

      // Verificar si se encontraron resultados
      if (mezclas.length === 0) {
        throw new NotFoundError('No se encontraron mezclas para los criterios especificados')
      }
      // Devolver los resultados
      return Array.isArray(mezclas) ? mezclas : []
    } catch (e) {
      if (e instanceof CustomError) throw e
      throw new DatabaseError('Error al obtener las mezclas')
    }
  }

  // uso para actualizar el estado de proceso
  static async estadoProceso ({ id, data }) {
    try {
      // validamos datos
      if (!id || !data) {
        throw new ValidationError('Datos requeridos no proporcionados')
      }

      // Verificamos si existe la solicitud con el id proporcionado
      const solicitud = await Solicitud.findByPk(id)
      if (!solicitud) throw new NotFoundError('Solicitud con ID ' + id + ' no encontrada')

      // Actualiza solo los campos que se han proporcionado
      if (data.notaMezcla) solicitud.notaMezcla = data.notaMezcla
      if (data.status) solicitud.status = data.status

      await solicitud.save()

      return { message: 'Solicitud Guardada correctamente', idUsuarioSolicita: solicitud.idUsuarioSolicita }
    } catch (e) {
      if (e instanceof CustomError) throw e
      throw new DatabaseError('Error al actualizar solicitud')
    }
  }

  // uso
  static async mensajeSolicita ({ id, mensajes, idUsuario }) {
    try {
      // validamos datos
      if (!id || !mensajes || !idUsuario) {
        throw new ValidationError('Datos requeridos no proporcionados')
      }
      // Verificamos si existe la solicitud con el id proporcionado
      const solicitud = await Solicitud.findByPk(id)
      if (!solicitud) throw new NotFoundError('Solicitud no encontrada')

      // Actualiza solo los campos que se han proporcionado
      if (mensajes) solicitud.respuestaSolicitud = mensajes

      await solicitud.save()

      // creamos la notificacion para mostrarla a los usuarios
      await NotificacionModel.create({ idSolicitud: id, mensaje: `Respuesta para solicitud:${id}`, idUsuario })

      return { message: 'Notificacion Guadada Correctamente' }
    } catch (e) {
      if (e instanceof CustomError) throw e
      throw new DatabaseError('Error al actualizar solicitud')
    }
  }

  // uso
  static async getAll () {
    try {
      // Consulta para obtener las mezclas filtradas por empresa y status
      const mezclas = await Solicitud.findAll({
        include: [
          {
            model: Usuario, // Modelo de Usuario
            attributes: ['nombre'] // Campos que quieres obtener del usuario
          },
          {
            model: Centrocoste, // Modelo de CentroCoste
            attributes: ['centroCoste'] // Campos que quieres obtener del centro de coste
          }
        ],
        attributes: [
          'id',
          'ranchoDestino',
          'variedad',
          'notaMezcla',
          'folio',
          'temporada',
          'cantidad',
          'presentacion',
          'metodoAplicacion',
          'descripcion',
          'status',
          'empresa',
          'fechaSolicitud',
          'imagenEntrega',
          'fechaEntrega'
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
          notaMezcla: m.notaMezcla,
          empresa: m.empresa,
          centroCoste: m.centrocoste ? m.centrocoste.centroCoste : 'Centro no encontrado',
          variedad: m.variedad,
          FolioReceta: m.folio,
          temporada: m.temporada,
          cantidad: m.cantidad,
          prensetacion: m.presentacion,
          metodoAplicacion: m.metodoAplicacion,
          imagenEntrega: m.imagenEntrega,
          descripcion: m.descripcion,
          fechaEntrega: m.fechaEntrega,
          status: m.status
        }
      })

      // Devolver los resultados
      return Array.isArray(resultadosFormateados) ? resultadosFormateados : []
    } catch (e) {
      if (e instanceof CustomError) throw e
      throw new DatabaseError('Error al obtener las mezclas')
    }
  }

  static async getOneSolicita ({ id, idSolicita }) {
    try {
      const solicitud = await Solicitud.findOne({
        where: {
          id,
          idUsuarioSolicita: idSolicita
        },
        attributes: [
          'idUsuarioMezcla',
          'respuestaMezclador'
        ]
      })
      // Verificar si se encontraron resultados
      if (!solicitud) {
        throw new NotFoundError('No se encontraron respuestas del mezclador')
      }

      return solicitud
    } catch (e) {
      if (e instanceof CustomError) throw e
      throw new DatabaseError('Error al respuesta del mezclador')
    }
  }

  static async getOneMesclador ({ id, idSolicita }) {
    try {
      const solicitud = await Solicitud.findOne({
        where: {
          id,
          idUsuarioMezcla: idSolicita
        },
        include: [
          {
            model: Usuario, // Modelo de Usuario
            attributes: ['nombre'] // Campos que quieres obtener del usuario
          },
          {
            model: Centrocoste, // Modelo de CentroCoste
            attributes: ['centroCoste'] // Campos que quieres obtener del centro de coste
          }
        ],
        attributes: [
          'id',
          'folio',
          'ranchoDestino',
          'variedad',
          'temporada',
          'cantidad',
          'presentacion',
          'metodoAplicacion',
          'descripcion',
          'empresa',
          'fechaSolicitud',
          'respuestaSolicitud',
          'respuestaMezclador'
        ]
      })

      // Verificar si se encontraron resultados
      if (!solicitud) {
        throw new NotFoundError('No se encontraron mezclas para los criterios especificados')
      }

      // Transformar el resultado
      const m = solicitud.toJSON()
      const resultadoFormateado = {
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
        descripcion: m.descripcion,
        respuestaSolicitud: m.respuestaSolicitud,
        respuestaMezclador: m.respuestaMezclador
      }

      // Devolver los resultados
      return {
        message: 'Mezcla obtenida correctamente',
        data: resultadoFormateado
      }
    } catch (e) {
      if (e instanceof CustomError) throw e
      throw new DatabaseError('Error al obtener la mezcla')
    }
  }

  // uso
  static async getAllGeneral ({ status }) {
    try {
      // Validar datos
      if (!status) {
        throw new ValidationError('Datos requeridos no proporcionados')
      }
      const mezclas = await Solicitud.findAll({
        where: {
          status
        },
        include: [
          {
            model: Usuario, // Modelo de Usuario
            attributes: ['nombre'] // Campos que quieres obtener del usuario
          },
          {
            model: Centrocoste, // Modelo de CentroCoste
            attributes: ['centroCoste'] // Campos que quieres obtener del centro de coste
          }
        ],
        attributes: [
          'id',
          'ranchoDestino',
          'variedad',
          'notaMezcla',
          'folio',
          'temporada',
          'cantidad',
          'presentacion',
          'metodoAplicacion',
          'descripcion',
          'status',
          'empresa',
          'fechaSolicitud',
          'imagenEntrega',
          'fechaEntrega'
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
          notaMezcla: m.notaMezcla,
          empresa: m.empresa,
          centroCoste: m.centrocoste ? m.centrocoste.centroCoste : 'Centro no encontrado',
          variedad: m.variedad,
          FolioReceta: m.folio,
          temporada: m.temporada,
          cantidad: m.cantidad,
          prensetacion: m.presentacion,
          metodoAplicacion: m.metodoAplicacion,
          imagenEntrega: m.imagenEntrega,
          descripcion: m.descripcion,
          fechaEntrega: m.fechaEntrega,
          status: m.status
        }
      })

      // Devolver los resultados
      return Array.isArray(resultadosFormateados) ? resultadosFormateados : []
    } catch (e) {
      if (e instanceof CustomError) throw e
      throw new DatabaseError('Error al obtener las mezclas')
    }
  }

  // uso
  static async obtenerDatosSolicitud ({ id }) {
    try {
      // Consulta para obtener las mezclas filtradas por empresa y status
      const mezclas = await Solicitud.findAll({
        where: {
          id
        },
        attributes: [
          'cantidad',
          'presentacion',
          'metodoAplicacion'
        ]
      })
      // Verificar si se encontraron resultados
      if (mezclas.length === 0) {
        throw new NotFoundError('No se encontraron datos para la solicitud')
      }
      // Devolver los resultados
      return Array.isArray(mezclas) ? mezclas : []
    } catch (e) {
      if (e instanceof CustomError) throw e
      throw new DatabaseError('Error al obtener datos para la solicitud')
    }
  }
} // fin modelo
