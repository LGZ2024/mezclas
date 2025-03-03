import { Usuario } from '../schema/usuarios.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { Op } from 'sequelize'
import { envs } from '../config/env.mjs'
export class UsuarioModel {
  // obtener todos los datos
  static async getAll () {
    try {
      const usuario = await Usuario.findAll({
        attributes: ['id', 'nombre', 'usuario', 'email', 'rol', 'empresa', 'ranchos', 'variedad']
      })
      return usuario
    } catch (e) {
      console.error(e.message) // Salida: Error la usuario
      return { error: 'Error al obtener los usuarios' }
    }
  }

  static async getUserEmail ({ rol, empresa }) {
    try {
      const usuario = await Usuario.findAll({
        attributes: ['nombre', 'email', 'ranchos', 'empresa'],
        where: {
          rol,
          [Op.or]: [
            { empresa },
            { empresa: 'General' }
          ]
        }
      })
      return usuario
    } catch (e) {
      console.error(e.message) // Salida: Error la usuario
      return { error: 'Error al obtener los usuarios' }
    }
  }

  static async getUserEmailRancho ({ rol, empresa, rancho }) {
    try {
      const usuario = await Usuario.findAll({
        attributes: ['nombre', 'email', 'ranchos', 'empresa'],
        where: {
          rol, // Se filtra por rol
          empresa, // Se filtra por empresa
          ranchos: rancho // Se filtra por rancho
        }
      })
      return usuario
    } catch (e) {
      console.error(e.message) // Salida: Error la usuario
      return { error: 'Error al obtener los usuarios' }
    }
  }

  static async getUserEmailEmpresa ({ rol, empresa }) {
    try {
      const usuario = await Usuario.findAll({
        attributes: ['nombre', 'email', 'ranchos', 'empresa'],
        where: {
          rol, // Se filtra por rol
          empresa // Se filtra por empresa
        }
      })
      console.log(usuario)
      return usuario
    } catch (e) {
      console.error(e.message) // Salida: Error la usuario
      return { error: 'Error al obtener los usuarios' }
    }
  }

  // obtener todos los un ato por id
  static async getOne ({ rol, empresa }) {
    try {
      const usuario = await Usuario.findOne({
        where: { rol, empresa },
        attributes: ['nombre', 'email', 'rol']
      })
      return usuario || { error: 'usuario no encontrada' }
    } catch (e) {
      console.error(e.message) // Salida: Error la usuario
      return { error: 'Error al obtener al usuario' }
    }
  }

  static async getOneId ({ id }) {
    try {
      const usuario = await Usuario.findOne({
        where: { id },
        attributes: ['nombre', 'email', 'rol']
      })
      return usuario || { error: 'usuario no encontrada' }
    } catch (e) {
      console.error(e.message) // Salida: Error la usuario
      return { error: 'Error al obtener al usuario' }
    }
  }

  // eliminar usuario
  static async delete ({ id }) {
    try {
      const usuario = await Usuario.findByPk(id)
      if (!usuario) return { error: 'usuario no encontrado' }

      await usuario.destroy()
      return { message: `usuario eliminada correctamente con id ${id}` }
    } catch (e) {
      console.error(e.message) // Salida: Error la usuario
      return { error: 'Error al elimiar el usuario' }
    }
  }

  // crear usuario
  static async create ({ data }) {
    try {
      // verificamos que no exista el usuario
      const usuario = await Usuario.findOne({ where: { usuario: data.usuario, email: data.email } })
      if (usuario) return { error: 'usuario ya existe' }
      // creamos el usuario
      await Usuario.create({ ...data })
      return { message: `usuario registrado exitosamente ${data.nombre}` }
    } catch (e) {
      console.error(e.message) // Salida: Error la usuario
      return { error: 'Error al crear al usuario' }
    }
  }

  // para actualizar datos de usuario
  static async update ({ id, data }) {
    try {
      // verificamos si existe alguna empresa con el id proporcionado
      const usuario = await Usuario.findByPk(id)
      if (!usuario) return { error: 'usuario no encontrado' }
      // Actualiza solo los campos que se han proporcionado
      if (data.nombre) usuario.nombre = data.nombre
      if (data.email) usuario.email = data.email
      if (data.rol) usuario.rol = data.rol
      if (data.empresa) usuario.empresa = data.empresa

      await usuario.save()

      return { message: 'usuario actualizada correctamente', rol: data.rol }
    } catch (e) {
      console.error(e.message) // Salida: Error la usuario
      return { error: 'Error al obtener las usuarios' }
    }
  }

  // funcion login
  static async login ({ user, password }) {
    try {
      const usuario = await Usuario.findOne({ where: { usuario: user } })
      if (!usuario) return { error: 'usuario no encontrado' }
      const isValidPassword = await bcrypt.compare(password, usuario.password)
      if (!isValidPassword) return { error: 'contraseña incorrecta' }
      // creamos jwt
      const token = jwt.sign({ id: usuario.id, nombre: usuario.nombre, rol: usuario.rol, empresa: usuario.empresa, ranchos: usuario.ranchos, cultivo: usuario.variedad }, envs.SECRET_JWT_KEY, { expiresIn: '24h' })
      return { message: 'usuario logueado correctamente', token, rol: usuario.rol }
    } catch (e) {
      console.error(e.message)
      return { error: 'Error al iniciar sesión' }
    }
  }

  // funcion cambiar contraseña usuario
  static async changePassword ({ id, oldPassword, newPassword }) {
    try {
      const usuario = await Usuario.findByPk(id)
      if (!usuario) return { error: 'usuario no encontrado' }
      const isValidPassword = await bcrypt.compare(oldPassword, usuario.password)
      if (!isValidPassword) return { error: 'contraseña actual incorrecta' }
      usuario.password = newPassword
      await usuario.save()
      return { message: 'contraseña cambiada correctamente' }
    } catch (e) {
      console.error(e.message)
      return { error: 'Error al cambiar contraseña' }
    }
  }

  // funcion cambiar contraseña Admin
  static async changePasswordAdmin ({ id, newPassword }) {
    try {
      const usuario = await Usuario.findByPk(id)
      if (!usuario) return { error: 'usuario no encontrado' }
      usuario.password = newPassword
      await usuario.save()
      return { message: 'contraseña cambiada correctamente' }
    } catch (e) {
      console.error(e.message)
      return { error: 'Error al cambiar contraseña' }
    }
  }
}
