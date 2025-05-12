// Modelos de Base de Datos
import { Solicitud } from '../schema/mezclas.js'
import { SolicitudProductos } from '../schema/solicitud_receta.js'
import { Usuario } from '../schema/usuarios.js'
import { Centrocoste } from '../schema/centro.js'

// Configuraciones
import sequelize from '../db/db.js'
import { guardarImagen } from '../config/foto.mjs'
import { enviarCorreo } from '../config/smtp.js'

// Modelos de Negocio
import { CentroCosteModel } from '../models/centro.models.js'
import { NotificacionModel } from '../models/notificaciones.models.js'
import { UsuarioModel } from '../models/usuario.models.js'

// Utilidades
import { format } from 'date-fns'
import logger from '../utils/logger.js'
import {
  NotFoundError,
  ValidationError,
  DatabaseError,
  CustomError
} from '../utils/CustomError.js'
import { Op } from 'sequelize' // Agregar esta importación

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
      // logger.info('Creando nueva solicitud de mezcla', data)
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
            logger.error('Error al procesar producto', errorProducto)
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
        fechaSolicitud: solicitud.fechaSolicitud,
        data: solicitud
      }
    } catch (error) {
      logger.error('Error al registrar solicitud de mezcla', error)
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
  static async obtenerTablaMezclasEmpresa ({ status, empresa, confirmacion }) {
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
          status,
          confirmacion // Solo mezclas confirmadas
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

  static async obtenerTablaMezclasValidados ({ status, empresa, confirmacion }) {
    try {
      // Validar datos
      if (!status || !empresa) {
        throw new ValidationError('Datos requeridos no proporcionados')
      }
      // Consulta para obtener las mezclas filtradas por empresa y status
      const mezclas = await Solicitud.findAll({
        where: {
          empresa,
          status,
          confirmacion, // Solo mezclas no confirmadas
          idUsuarioSolicita: {
            [Op.ne]: 33 // Excluir ID 33
          }
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
      // logger.debug('obtenerTablaMezclasEmpresa: resultadosFormateados', resultadosFormateados)
      // Devolver los resultados validar si hay resultados mandar vacio
      return Array.isArray(resultadosFormateados) ? resultadosFormateados : []
    } catch (e) {
      if (e instanceof CustomError) throw e
      throw new DatabaseError('Error al obtener las mezclas')
    }
  }

  static async obtenerTablaMezclasJalisco ({ status, empresa, confirmacion }) {
    try {
      // Validar datos
      if (!status || !empresa) {
        throw new ValidationError('Datos requeridos no proporcionados')
      }
      // Consulta para obtener las mezclas filtradas por empresa y status
      const mezclas = await Solicitud.findAll({
        where: {
          empresa,
          status,
          confirmacion // Solo mezclas no confirmadas
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
      // logger.debug('obtenerTablaMezclasEmpresa: resultadosFormateados', resultadosFormateados)
      // Devolver los resultados validar si hay resultados mandar vacio
      return Array.isArray(resultadosFormateados) ? resultadosFormateados : []
    } catch (e) {
      if (e instanceof CustomError) throw e
      throw new DatabaseError('Error al obtener las mezclas')
    }
  }

  static async obtenerTablaMezclasValidadosMichoacan ({ status, confirmacion }) {
    try {
      // Validar datos
      if (!status || !confirmacion) {
        throw new ValidationError('Datos requeridos no proporcionados')
      }
      // Consulta para obtener las mezclas filtradas por empresa y status
      const mezclas = await Solicitud.findAll({
        where: {
          empresa: {
            [Op.or]: ['Moras Finas', 'Bayas del Centro']
          },
          status,
          confirmacion // Solo mezclas no confirmadas
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
      // logger.debug('obtenerTablaMezclasEmpresa: resultadosFormateados', resultadosFormateados)
      // Devolver los resultados validar si hay resultados mandar vacio
      return Array.isArray(resultadosFormateados) ? resultadosFormateados : []
    } catch (e) {
      if (e instanceof CustomError) throw e
      throw new DatabaseError('Error al obtener las mezclas')
    }
  }

  // uso
  static async obtenerTablaMezclasRancho ({ status, ranchoDestino, confirmacion }) {
    try {
      // Validar datos
      if (!status || !ranchoDestino) {
        throw new ValidationError('Datos requeridos no proporcionados')
      }
      // Consulta para obtener las mezclas filtradas por empresa y status
      const mezclas = await Solicitud.findAll({
        where: {
          ranchoDestino,
          status,
          confirmacion // Solo mezclas confirmadas
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
  static async obtenerTablaMezclasUsuario ({ status, idUsuarioSolicita, confirmacion }) {
    try {
      // Validar datos
      if (!status || !idUsuarioSolicita) {
        throw new ValidationError('Datos requeridos no proporcionados')
      }
      logger.info('Obteniendo tabla de mezclas por status y usuario: ' + status + ' y ' + idUsuarioSolicita + ' y ' + confirmacion)

      // Consulta para obtener las mezclas filtradas por empresa y status
      const mezclas = await Solicitud.findAll({
        where: {
          idUsuarioSolicita,
          status,
          confirmacion // Solo mezclas no confirmadas
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

  static async obtenerTablaMezclasCancelada ({ idUsuario, confirmacion, rol }) {
    try {
      let mezclas
      // Validar datos
      if (!idUsuario || !rol) {
        throw new ValidationError('Datos requeridos no proporcionados')
      }

      logger.info('Obteniendo tabla de mezclas por status y usuario: ' + idUsuario + ' y ' + rol)
      // Validar rol
      if (rol === 'adminMezclador') {
        mezclas = await Solicitud.findAll({
          where: {
            idUsuarioValida: idUsuario,
            confirmacion // Solo mezclas no confirmadas
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
            'respuestaMezclador',
            'motivoCancelacion'
          ]
        })
      } else if (rol === 'solicita' || rol === 'solicita2') {
        mezclas = await Solicitud.findAll({
          where: {
            idUsuarioSolicita: idUsuario,
            confirmacion // Solo mezclas no confirmadas
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
            'respuestaMezclador',
            'motivoCancelacion'
          ]
        })
      } else if (rol === 'administrativo') {
        mezclas = await Solicitud.findAll({
          where: {
            confirmacion // Solo mezclas no confirmadas
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
            'respuestaMezclador',
            'motivoCancelacion'
          ]
        })
        // Verificar si se encontraron resultados
        if (mezclas.length === 0) {
          throw new NotFoundError('No se encontraron mezclas para los criterios especificados')
        }
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
          motivoCancelacion: m.motivoCancelacion
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

  static async obtenerMezclasMichoacan () {
    try {
      // Validar datos
      // Agregar condición para empresas específicas
      const mezclas = await Solicitud.findAll({
        where: {
          empresa: {
            [Op.or]: ['Moras Finas', 'Bayas del Centro']
          }
        },
        include: [
          {
            model: Usuario, // Modelo de Usuario
            attributes: ['nombre'] // Campos que quieres obtener del usuario
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
      return {
        message: 'Mezclas obtenidas correctamente',
        data: resultadosFormateados
      }
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
          'metodoAplicacion',
          'descripcion'
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

  static async validacion ({ data, idUsuario, user }) {
    if (!data) {
      throw new ValidationError('Datos requeridos no proporcionados')
    }

    const transaction = await sequelize.transaction()

    try {
      const resultados = await Promise.all(data.map(async (estado) => {
        // Procesar cada solicitud de manera independiente
        const resultado = await procesarSolicitud({
          estado,
          idUsuario,
          user,
          transaction
        })
        return resultado
      }))

      await transaction.commit()
      return {
        message: 'Solicitudes guardadas correctamente',
        resultados
      }
    } catch (e) {
      logger.error('Error al validar solicitud:', e)
      await transaction.rollback()
      if (e instanceof CustomError) throw e
      throw new DatabaseError('Error al validar datos')
    }
  }

  static async cancelar ({ idSolicitud, data, idUsuario }) {
    let solicitud
    let solicita
    let validacion
    if (!idSolicitud || !data || !idUsuario) {
      throw new ValidationError('Datos requeridos no proporcionados')
    }
    const transaction = await sequelize.transaction()
    try {
      solicitud = await Solicitud.findByPk(idSolicitud)
      if (!solicitud) {
        throw new NotFoundError('Solicitud no encontrada')
      }
      if (data.validacion === false) {
        validacion = 'Cancelada'
      }
      solicitud.confirmacion = validacion
      solicitud.idUsuarioValida = idUsuario
      solicitud.motivoCancelacion = data.motivo

      await solicitud.save({ transaction })

      logger.info('Solicitud actual:', solicitud)
      logger.info(`empresa:${solicitud.empresa}, fecha:${format(solicitud.fechaSolicitud, 'dd/MM/yyyy HH:mm:ss')}, confirmacion rancho:${solicitud.ranchoDestino}`)
      // obtener datos para mandar correo al mezclador

      solicita = await UsuarioModel.getOneId({ id: solicitud.idUsuarioSolicita })

      logger.info('Solicitante actual:', solicita)

      logger.info(`nombre:${solicita.nombre}, correo:${solicita.email}`)
      const respues = await enviarCorreo({
        type: 'cancelacion',
        email: solicita.email,
        nombre: solicita.nombre,
        solicitudId: solicitud.id,
        usuario: {
          empresa: solicitud.empresa,
          ranchos: solicitud.ranchoDestino
        },
        data: {
          motivo: data.motivo
        }
      })
      if (respues.error) {
        logger.error('Error al enviar correo:', respues.error)
      } else {
        logger.info('Correo enviado:', respues.messageId)
      }

      await transaction.commit()
      return { message: 'Solicitudes Guardada correctamente' }
    } catch (e) {
      logger.error('Error al cancelar solicitud:', e)
      await transaction.rollback()
      if (e instanceof CustomError) throw e
      throw new DatabaseError('Error al validar datos')
    }
  }

  static async mezclaConfirmar ({ idSolicitud, data, usuario }) {
    let solicitud
    let solicita
    const validacion = 'Pendiente'
    if (!idSolicitud || !data) {
      throw new ValidationError('Datos requeridos no proporcionados')
    }
    const transaction = await sequelize.transaction()
    try {
      solicitud = await Solicitud.findByPk(idSolicitud)

      if (!solicitud) {
        throw new NotFoundError('Solicitud no encontrada')
      }

      solicitud.confirmacion = validacion
      if (data.comentarios) solicitud.comentarios = data.comentarios
      if (data.fechaSolicitud) solicitud.fechaSolicitud = data.fechaSolicitud
      if (data.empresa) solicitud.empresa = data.empresa
      if (data.ranchoDestino) solicitud.ranchoDestino = data.ranchoDestino
      if (data.descripcion) solicitud.descripcion = data.descripcion
      if (data.folio) solicitud.folio = data.folio
      if (data.temporada) solicitud.temporada = data.temporada
      if (data.cantidad) solicitud.cantidad = data.cantidad
      if (data.presentacion) solicitud.presentacion = data.presentacion
      if (data.metodoAplicacion) solicitud.metodoAplicacion = data.metodoAplicacion
      if (data.descripcion) solicitud.descripcion = data.descripcion

      await solicitud.save({ transaction })

      logger.info('Solicitud actual:', solicitud)
      // obtener datos para mandar correo al mezclador

      solicita = await UsuarioModel.getOneId({ id: solicitud.idUsuarioValida })

      logger.info(`nombre:${solicita.nombre}, correo:${solicita.email}`)
      const respues = await enviarCorreo({
        type: 'reevaluacion',
        email: solicita.email,
        nombre: usuario.nombre,
        solicitudId: solicitud.id,
        usuario: {
          empresa: usuario.empresa,
          ranchos: solicita.ranchoDestino
        },
        data: {
          folio: solicitud.folio || 'No Aplica',
          cantidad: solicitud.cantidad || 'No Aplica',
          presentacion: solicitud.presentacion || 'No Aplica',
          metodoAplicacion: solicitud.metodoAplicacion,
          motivo: solicitud.motivoCancelacion,
          comentarios: solicitud.comentario || 'Por favor, revisar las proporciones de los productos'
        }
      })
      if (respues.error) {
        logger.error('Error al enviar correo:', respues.error)
      } else {
        logger.info('Correo enviado:', respues.messageId)
      }

      await transaction.commit()
      return { message: 'Solicitudes Guardada correctamente' }
    } catch (e) {
      logger.error('Error al cancelar solicitud:', e)
      await transaction.rollback()
      if (e instanceof CustomError) throw e
      throw new DatabaseError('Error al validar datos')
    }
  }
} // fin modelo

// Función auxiliar para procesar cada solicitud
async function procesarSolicitud ({ estado, idUsuario, user, transaction }) {
  // Buscar la solicitud
  const solicitud = await Solicitud.findByPk(estado.id_solicitud)
  if (!solicitud) {
    throw new NotFoundError(`Solicitud ${estado.id_solicitud} no encontrada`)
  }

  // Actualizar solicitud
  solicitud.confirmacion = estado.validacion === true ? 'Confirmada' : solicitud.confirmacion
  solicitud.idUsuarioValida = idUsuario
  await solicitud.save({ transaction })

  // Obtener mezclador según la empresa
  let mezclador
  if (solicitud.empresa === 'Moras Finas' || solicitud.empresa === 'Bayas del Centro') {
    mezclador = await UsuarioModel.getUserEmail({
      rol: 'mezclador',
      empresa: solicitud.empresa
    })
  } else {
    mezclador = await UsuarioModel.getUserEmailRancho({
      rol: 'mezclador',
      empresa: solicitud.empresa,
      rancho: solicitud.ranchoDestino
    })
  }

  // Obtener solicitante
  const solicitante = await UsuarioModel.getOneId({
    id: solicitud.idUsuarioSolicita
  })

  // Enviar correos si se tienen los datos necesarios
  if (mezclador?.[0] && solicitante) {
    logger.info(`nombre mezclador:${mezclador[0].nombre}, correo:${mezclador[0].email}`)
    logger.info(`nombre solicitante:${solicitante.nombre}, correo:${solicitante.email}`)
    const respues = await enviarCorreo({
      type: 'solicitud',
      email: mezclador[0].email,
      nombre: mezclador[0].nombre,
      solicitudId: solicitud.id,
      fechaSolicitud: format(solicitud.fechaSolicitud, 'dd/MM/yyyy HH:mm:ss'),
      data: solicitud,
      usuario: {
        nombre: solicitante.nombre,
        empresa: solicitante.empresa,
        ranchos: solicitud.ranchoDestino
      }
    })
    const respuesSolicitante = await enviarCorreo({
      type: 'aprobada',
      email: solicitante.email,
      nombre: solicitante.nombre,
      solicitudId: solicitud.id,
      usuario: {
        empresa: solicitante.empresa,
        ranchos: solicitud.ranchoDestino
      },
      data: {
        folio: solicitud.folio,
        cantidad: solicitud.cantidad,
        presentacion: solicitud.presentacion,
        metodoAplicacion: solicitud.metodoAplicacion
      }
    })
    if (respues.error) {
      logger.error('Error al enviar correo:', respues.error)
    } else {
      logger.info('Correo enviado:', respues.messageId)
    }
    if (respuesSolicitante.error) {
      logger.error('Error al enviar correo:', respuesSolicitante.error)
    } else {
      logger.info('Correo enviado:', respuesSolicitante.messageId)
    }
  }

  return {
    idSolicitud: estado.id_solicitud,
    empresa: solicitud.empresa,
    status: 'procesado'
  }
}
