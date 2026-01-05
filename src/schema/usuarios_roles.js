import { DataTypes } from 'sequelize'
import sequelize from '../db/db.js'

const usuariosRolesConfig = {
    idUsuario: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    idRol: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
    }
}

export const UsuariosRoles = sequelize.define('usuarios_roles', usuariosRolesConfig, {
    tableName: 'usuarios_roles',
    timestamps: false
})
