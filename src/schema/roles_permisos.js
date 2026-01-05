import { DataTypes } from 'sequelize'
import sequelize from '../db/db.js'

const rolesPermisosConfig = {
    idRol: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    idPermiso: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
    }
}

export const RolesPermisos = sequelize.define('roles_permisos', rolesPermisosConfig, {
    tableName: 'roles_permisos',
    timestamps: false
})
