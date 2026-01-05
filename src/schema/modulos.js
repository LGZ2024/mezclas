import { DataTypes } from 'sequelize'
import sequelize from '../db/db.js'

const modulosConfig = {
    idModulo: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    clave: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: { msg: 'La clave del módulo es requerida' }
        }
    },
    idSistema: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'ID del sistema al que pertenece el módulo (opcional)'
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

export const Modulos = sequelize.define('modulos', modulosConfig, {
    tableName: 'app_modulos',
    timestamps: false
})
