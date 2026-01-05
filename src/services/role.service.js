import { Roles } from '../schema/roles.js'
import { Permisos } from '../schema/permisos.js'
import { Modulos } from '../schema/modulos.js'
import { UsuariosRoles } from '../schema/usuarios_roles.js'
import { RolesPermisos } from '../schema/roles_permisos.js'
import { DbHelper } from '../utils/dbHelper.js'
import { ValidationError, NotFoundError } from '../utils/CustomError.js'

export class RoleService {
    /**
     * Crea un nuevo rol
     * @param {Object} data - { nombre, descripcion }
     */
    static async createRole(data) {
        return await DbHelper.withTransaction(async (transaction) => {
            if (!data.nombre) throw new ValidationError('El nombre del rol es requerido')

            const role = await Roles.create(data, { transaction })
            return role
        })
    }

    /**
     * Actualiza un rol existente
     * @param {number} id 
     * @param {Object} data 
     */
    static async updateRole(id, data) {
        return await DbHelper.withTransaction(async (transaction) => {
            const role = await Roles.findByPk(id)
            if (!role) throw new NotFoundError(`Rol con id ${id} no encontrado`)

            await role.update(data, { transaction })
            return role
        })
    }

    /**
     * Obtiene todos los roles con sus permisos
     */
    static async getRoles() {
        return await Roles.findAll({
            include: [{
                model: Permisos,
                include: [Modulos]
            }]
        })
    }

    /**
     * Asigna un rol a un usuario
     * @param {number} userId 
     * @param {number} roleId 
     */
    static async assignRoleToUser(userId, roleId) {
        return await DbHelper.withTransaction(async (transaction) => {
            // Verificar existencia
            const role = await Roles.findByPk(roleId)
            if (!role) throw new NotFoundError('Rol no encontrado')

            // Crear relación
            await UsuariosRoles.create({ idUsuario: userId, idRol: roleId }, { transaction })
            return { message: 'Rol asignado correctamente' }
        })
    }

    /**
     * Asigna permisos a un rol
     * @param {number} roleId 
     * @param {Array<number>} permisoIds 
     */
    static async assignPermissionsToRole(roleId, permisoIds) {
        return await DbHelper.withTransaction(async (transaction) => {
            const role = await Roles.findByPk(roleId)
            if (!role) throw new NotFoundError('Rol no encontrado')

            // Eliminar permisos anteriores si se desea reemplazar, o solo agregar.
            // Aquí asumiremos reemplazo completo por simplicidad o agregar uno por uno.
            // Para este ejemplo, agregamos masivamente.

            const bulkData = permisoIds.map(pid => ({ idRol: roleId, idPermiso: pid }))
            await RolesPermisos.bulkCreate(bulkData, { transaction, ignoreDuplicates: true })

            return { message: 'Permisos asignados correctamente' }
        })
    }

    /**
     * Obtiene un rol por nombre
     * @param {string} nombre 
     */
    static async getRoleByName(nombre) {
        return await Roles.findOne({ where: { nombre } })
    }

    /**
     * Sincroniza el rol de un usuario (reemplaza anteriores)
     * @param {number} userId 
     * @param {string} roleName 
     */
    static async syncUserRole(userId, roleName) {
        return await DbHelper.withTransaction(async (transaction) => {
            const role = await Roles.findOne({ where: { nombre: roleName }, transaction })
            if (!role) {
                // Si el rol no existe en DB, podríamos crearlo automáticamente o lanzar error.
                // Para transición suave, si no existe, no hacemos nada en la tabla relacional 
                // pero el usuario ya tiene el string en su tabla.
                // O mejor, lanzamos error para forzar consistencia si ya poblamos la DB.
                // Asumiremos que la DB ya tiene los roles base.
                // throw new NotFoundError(`Rol '${roleName}' no encontrado en base de datos`)
                return { message: 'Rol no encontrado en DB, omitiendo asignación relacional' }
            }

            // Eliminar roles previos
            await UsuariosRoles.destroy({ where: { idUsuario: userId }, transaction })

            // Asignar nuevo
            await UsuariosRoles.create({ idUsuario: userId, idRol: role.id }, { transaction })
            return { message: 'Rol sincronizado' }
        })
    }
}
