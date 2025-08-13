import { Empleados } from '../schema/empleados.js'
import { Op } from 'sequelize' // Agregar esta importación
import { DatabaseError, CustomError, NotFoundError, ValidationError } from '../utils/CustomError.js'
import { DbHelper } from '../utils/dbHelper.js'
export class EmpleadosModel {
  // uso
  static async getAllEmpleados () {
    return await DbHelper.executeQuery(async (sequelize) => {
      try {
        const equipo = await Empleados.findAll({
          where: {
            estado: {
              [Op.ne]: 'asignado'
            }
          },
          attributes: ['id', 'nombre', 'apellido_paterno']
        })
        if (!equipo) throw new NotFoundError('Empleados no encontrados')
        return equipo
      } catch (e) {
        if (e instanceof CustomError) throw e
        throw new DatabaseError('Error al obtener los equipos')
      }
    })
  }

  static async AllEmpleados () {
    return await DbHelper.executeQuery(async (sequelize) => {
      try {
        const equipo = await Empleados.findAll({
          attributes: ['id', 'empleado_id', 'nombre', 'apellido_paterno', 'apellido_materno', 'departamento', 'estado']
        })
        if (!equipo) throw new NotFoundError('Empleados no encontrados')
        return equipo
      } catch (e) {
        if (e instanceof CustomError) throw e
        throw new DatabaseError('Error al obtener los equipos')
      }
    })
  }

  static async getDatosEmpleado ({ id }) {
    try {
      // Verificar si se proporcionaron los parámetros requeridos
      if (!id) {
        throw new ValidationError('Datos requeridos no proporcionados')
      }
      const usuario = await Empleados.findByPk({
        where: { id },
        attributes: ['nombre', 'apellido_paterno']
      })
      // Verificar si se encontraron resultados
      if (!usuario) {
        throw new NotFoundError('No se encontro empleado con id ' + id)
      }
      return usuario
    } catch (e) {
      if (e instanceof CustomError) throw e
      throw new DatabaseError('Error al obtener todos los usuarios')
    }
  }

  static async agregarUsuario ({ logger, logContext, data }) {
    return await DbHelper.withTransaction(async (transaction) => {
      try {
        // Validar que los datos sean correctos
        if (!data || !data.nombre || !data.apellido_paterno) {
          throw new ValidationError('Datos incompletos para agregar usuario')
        }

        // Crear el nuevo empleado
        const nuevoEmpleado = await Empleados.create(data, { transaction })

        return { message: 'Usuario agregado correctamente', id: nuevoEmpleado.id }
      } catch (error) {
        logger.error('Error al agregar usuario', { ...logContext, error })
        if (error instanceof ValidationError) {
          throw error
        }

        if (error.name === 'SequelizeUniqueConstraintError') {
          throw new ValidationError('Ya existe un empleado con ese número de empleado')
        }

        throw new DatabaseError('Error al agregar usuario')
      }
    })
  }

  static async actualizarUsuario ({ id, estado }) {
    try {
      // validamos que el id sea un numero
      if (isNaN(id)) throw new ValidationError('El id debe ser un numero')
      const usuario = await Empleados.findByPk(id)
      if (!usuario) throw new NotFoundError('Usuario no encontrado')
      // Actualiza solo los campos que se han proporcionado
      if (estado) usuario.estado = estado
      await usuario.save()
      return { message: 'Usuario actualizado correctamente', id }
    } catch (e) {
      if (e instanceof CustomError) throw e
      throw new DatabaseError('Error al actualizar usuario')
    }
  }
}
