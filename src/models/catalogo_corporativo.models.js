import { DbHelper } from '../utils/dbHelper.js'
import { Departamentos } from '../schema/departamentos.js'
import { Empresas } from '../schema/empresas.js'
import { Ranchos } from '../schema/ranchos.js'
import { Temporada } from '../schema/temporada.js'
import { Roles } from '../schema/roles.js'
import { Presentacion } from '../schema/presentacion.js'
import { Aplicaciones } from '../schema/aplicaciones.js'
import { TipoAplicacion } from '../schema/tipo_aplicacion.js'
import { MetodoAplicacion } from '../schema/metodo_aplicacion.js'

import { NotFoundError, ValidationError, DatabaseError } from '../utils/CustomError.js'

export class CatalogoModel {
  // funciones para agregar
  static async agregarEmpresa ({ datos, logger, logContext }) {
    return await DbHelper.withTransaction(async (transaction) => {
      try {
        if (!datos) {
          throw new ValidationError('Datos para la operación son requeridos')
        }

        await Empresas.create(datos, { transaction })

        return { message: 'Empresa registrada correctamente' }
      } catch (error) {
        logger.error('Error al registrar empresa:', {
          ...logContext,
          error: error.message
        })
        throw error
      }
    })
  }

  static async agregarDepartamento ({ datos, logger, logContext }) {
    return await DbHelper.withTransaction(async (transaction) => {
      try {
        if (!datos) {
          throw new ValidationError('Datos para la operación son requeridos')
        }

        await Departamentos.create(datos, { transaction })

        return { message: 'Departamento registrado correctamente' }
      } catch (error) {
        console.log(error)
        logger.error('Error al registrar departamento:', {
          ...logContext,
          error: error.message
        })
        throw error
      }
    })
  }

  static async agregarRol ({ datos, logger, logContext }) {
    return await DbHelper.withTransaction(async (transaction) => {
      try {
        if (!datos) {
          throw new ValidationError('Datos para la operación son requeridos')
        }

        await Roles.create(datos, { transaction })

        return { message: 'Rol registrado correctamente' }
      } catch (error) {
        console.log(error)
        logger.error('Error al registrar rol:', {
          ...logContext,
          error: error.message
        })
        throw error
      }
    })
  }

  static async agregarRancho ({ datos, logger, logContext }) {
    return await DbHelper.withTransaction(async (transaction) => {
      try {
        if (!datos) {
          throw new ValidationError('Datos para la operación son requeridos')
        }

        await Ranchos.create(datos, { transaction })

        return { message: 'Rancho registrado correctamente' }
      } catch (error) {
        console.log(error)
        logger.error('Error al registrar rancho:', {
          ...logContext,
          error: error.message
        })
        throw error
      }
    })
  }

  static async agregarTemporada ({ datos, logger, logContext }) {
    return await DbHelper.withTransaction(async (transaction) => {
      try {
        if (!datos) {
          throw new ValidationError('Datos para la operación son requeridos')
        }

        await Temporada.create(datos, { transaction })

        return { message: 'Temporada registrada correctamente' }
      } catch (error) {
        console.log(error)
        logger.error('Error al registrar temporada:', {
          ...logContext,
          error: error.message
        })
        throw error
      }
    })
  }

  static async agregarPresentacion ({ datos, logger, logContext }) {
    return await DbHelper.withTransaction(async (transaction) => {
      try {
        if (!datos) {
          throw new ValidationError('Datos para la operación son requeridos')
        }

        await Presentacion.create(datos, { transaction })

        return { message: 'Presentacion registrada correctamente' }
      } catch (error) {
        console.log(error)
        logger.error('Error al registrar presentacion:', {
          ...logContext,
          error: error.message
        })
        throw error
      }
    })
  }

  static async agregarAplicacion ({ datos, logger, logContext }) {
    return await DbHelper.withTransaction(async (transaction) => {
      try {
        if (!datos) {
          throw new ValidationError('Datos para la operación son requeridos')
        }
        await Aplicaciones.create(datos, { transaction })
        return { message: 'Aplicacion registrada correctamente' }
      } catch (error) {
        console.log(error)
        logger.error('Error al registrar aplicacion:', {
          ...logContext,
          error: error.message
        })
        throw error
      }
    })
  }

  static async agregarTipoAplicacion ({ datos, logger, logContext }) {
    return await DbHelper.withTransaction(async (transaction) => {
      try {
        if (!datos) {
          throw new ValidationError('Datos para la operación son requeridos')
        }
        await TipoAplicacion.create(datos, { transaction })
        return { message: 'TipoAplicacion registrada correctamente' }
      } catch (error) {
        console.log(error)
        logger.error('Error al registrar tipoAplicacion:', {
          ...logContext,
          error: error.message
        })
        throw error
      }
    })
  }

  static async agregarMetodoAplicacion ({ datos, logger, logContext }) {
    return await DbHelper.withTransaction(async (transaction) => {
      try {
        if (!datos) {
          throw new ValidationError('Datos para la operación son requeridos')
        }
        await MetodoAplicacion.create(datos, { transaction })
        return { message: 'MetodoAplicacion registrada correctamente' }
      } catch (error) {
        console.log(error)
        logger.error('Error al registrar metodoAplicacion:', {
          ...logContext,
          error: error.message
        })
        throw error
      }
    })
  }

  // funciones para actualizar
  static async actualizarEmpresa (id, datos) {
    return await DbHelper.withTransaction(async (transaction) => {
      const empresa = await Empresas.findByPk(id)
      if (!empresa) throw new NotFoundError('Empresa no encontrada con id ' + id)

      if ('razon_social' in datos) empresa.razon_social = datos.razon_social
      if ('nombre_comercial' in datos) empresa.nombre_comercial = datos.nombre_comercial
      if ('rfc' in datos) empresa.rfc = datos.rfc
      if ('status' in datos) empresa.status = datos.status

      await empresa.save({ transaction })
      return { message: 'Empresa actualizada correctamente' }
    })
  }

  static async actualizarDepartamento (id, datos) {
    return await DbHelper.withTransaction(async (transaction) => {
      const departamento = await Departamentos.findByPk(id)
      if (!departamento) throw new NotFoundError('Departamento no encontrada con id ' + id)

      if ('departamento' in datos) departamento.departamento = datos.departamento
      if ('status' in datos) departamento.status = datos.status

      await departamento.save({ transaction })
      return { message: 'Departamento actualizada correctamente' }
    })
  }

  static async actualizarRancho (id, datos) {
    return await DbHelper.withTransaction(async (transaction) => {
      const rancho = await Ranchos.findByPk(id)
      if (!rancho) throw new NotFoundError('Rancho no encontrada con id ' + id)

      if ('rancho' in datos) rancho.rancho = datos.rancho
      if ('status' in datos) rancho.status = datos.status

      await rancho.save({ transaction })
      return { message: 'Rancho actualizada correctamente' }
    })
  }

  static async actualizarTemporada (id, datos) {
    return await DbHelper.withTransaction(async (transaction) => {
      const temporada = await Temporada.findByPk(id)
      if (!temporada) throw new NotFoundError('Temporada no encontrada con id ' + id)

      if ('temporada' in datos) temporada.temporada = datos.temporada
      if ('status' in datos) temporada.status = datos.status

      await temporada.save({ transaction })
      return { message: 'Temporada actualizada correctamente' }
    })
  }

  static async actualizarRol (id, datos) {
    return await DbHelper.withTransaction(async (transaction) => {
      const rol = await Roles.findByPk(id)
      if (!rol) throw new NotFoundError('Rol no encontrada con id ' + id)
      if ('rol' in datos) rol.rol = datos.rol
      if ('status' in datos) rol.status = datos.status

      await rol.save({ transaction })
      return { message: 'Rol actualizado correctamente' }
    })
  }

  static async actualizarPresentacion (id, datos) {
    return await DbHelper.withTransaction(async (transaction) => {
      const presentacion = await Presentacion.findByPk(id)
      if (!presentacion) throw new NotFoundError('Presentacion no encontrada con id ' + id)

      if ('presentacion' in datos) presentacion.presentacion = datos.presentacion
      if ('status' in datos) presentacion.status = datos.status

      await presentacion.save({ transaction })
      return { message: 'Presentacion actualizada correctamente' }
    })
  }

  static async actualizarAplicacion (id, datos) {
    return await DbHelper.withTransaction(async (transaction) => {
      const aplicacion = await Aplicaciones.findByPk(id)
      if (!aplicacion) throw new NotFoundError('Aplicacion no encontrada con id ' + id)
      if ('aplicacion' in datos) aplicacion.aplicacion = datos.aplicacion
      if ('status' in datos) aplicacion.status = datos.status

      await aplicacion.save({ transaction })
      return { message: 'Aplicacion actualizada correctamente' }
    })
  }

  static async actualizarTipoAplicacion (id, datos) {
    return await DbHelper.withTransaction(async (transaction) => {
      const tipoAplicacion = await TipoAplicacion.findByPk(id)
      if (!tipoAplicacion) throw new NotFoundError('TipoAplicacion no encontrada con id ' + id)
      if ('tipo_aplicacion' in datos) tipoAplicacion.tipo_aplicacion = datos.tipo_aplicacion
      if ('status' in datos) tipoAplicacion.status = datos.status

      await tipoAplicacion.save({ transaction })
      return { message: 'TipoAplicacion actualizada correctamente' }
    })
  }

  static async actualizarMetodoAplicacion (id, datos) {
    return await DbHelper.withTransaction(async (transaction) => {
      const metodoAplicacion = await MetodoAplicacion.findByPk(id)
      if (!metodoAplicacion) throw new NotFoundError('MetodoAplicacion no encontrada con id ' + id)
      if ('metodo' in datos) metodoAplicacion.metodo = datos.metodo
      if ('status' in datos) metodoAplicacion.status = datos.status

      await metodoAplicacion.save({ transaction })
      return { message: 'MetodoAplicacion actualizada correctamente' }
    })
  }

  // funcion para obtener datos
  static async obtenerEmpresas () {
    try {
      const empresas = await Empresas.findAll({ where: { status: 1 } })
      return empresas
    } catch (error) {
      console.log(error)
      throw new DatabaseError('Error al obtener las empresas')
    }
  }

  static async obtenerDepartamentos () {
    try {
      const departamentos = await Departamentos.findAll({ where: { status: 1 } })
      return departamentos
    } catch (error) {
      throw new DatabaseError('Error al obtener los departamentos')
    }
  }

  static async obtenerRanchos () {
    try {
      const ranchos = await Ranchos.findAll({ where: { status: 1 } })
      return ranchos
    } catch (error) {
      throw new DatabaseError('Error al obtener los ranchos')
    }
  }

  static async obtenerTemporadas () {
    try {
      const temporadas = await Temporada.findAll({ where: { status: 1 } })
      return temporadas
    } catch (error) {
      throw new DatabaseError('Error al obtener las temporadas')
    }
  }

  static async obtenerRoles () {
    try {
      const roles = await Roles.findAll({ where: { status: 1 } })
      return roles
    } catch (error) {
      throw new DatabaseError('Error al obtener los roles')
    }
  }

  static async obtenerPresentaciones () {
    try {
      const presentaciones = await Presentacion.findAll({ where: { status: 1 } })
      return presentaciones
    } catch (error) {
      throw new DatabaseError('Error al obtener las presentaciones')
    }
  }

  static async obtenerAplicaciones () {
    try {
      const aplicaciones = await Aplicaciones.findAll({ where: { status: 1 } })
      return aplicaciones
    } catch (error) {
      throw new DatabaseError('Error al obtener las aplicaciones')
    }
  }

  static async obtenerTipoAplicaciones () {
    try {
      const tipoAplicaciones = await TipoAplicacion.findAll({ where: { status: 1 } })
      return tipoAplicaciones
    } catch (error) {
      throw new DatabaseError('Error al obtener las tipoAplicaciones')
    }
  }

  static async obtenerMetodoAplicaciones () {
    try {
      const metodoAplicaciones = await MetodoAplicacion.findAll({ where: { status: 1 } })
      return metodoAplicaciones
    } catch (error) {
      throw new DatabaseError('Error al obtener las metodoAplicaciones')
    }
  }

  // funcion para obtener tipo aplicacion por id
  static async obtenerTipoAplicacionPorId (id) {
    try {
      const tipoAplicacion = await TipoAplicacion.findByPk(id)
      if (!tipoAplicacion) throw new NotFoundError('TipoAplicacion no encontrada con id ' + id)
      return tipoAplicacion
    } catch (error) {
      throw new DatabaseError('Error al obtener el tipoAplicacion')
    }
  }

  static async obtenerAplicacionesPorId (id) {
    try {
      const aplicacion = await Aplicaciones.findAll({ where: { id_tipo_aplicacion: id, status: 1 } })
      if (!aplicacion) throw new NotFoundError('Aplicaciones no encontradas con id ' + id)
      return aplicacion
    } catch (error) {
      throw new DatabaseError('Error al obtener la aplicacion')
    }
  }
}
