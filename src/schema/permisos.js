import { DataTypes } from 'sequelize'
import sequelize from '../db/db.js'

const permisosConfig = {
    idPermiso: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    idModulo: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    accion: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'Ej: create, read, update, delete, approve',
        validate: {
            notEmpty: { msg: 'La acción es requerida' }
        }
    },
    descripcion: {
        type: DataTypes.STRING,
        allowNull: true
    },
    status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}

export const Permisos = sequelize.define('permisos', permisosConfig, {
    tableName: 'permisos',
    timestamps: false
})
