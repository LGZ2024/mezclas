import { DataTypes } from 'sequelize'
import sequelize from '../db/db.js'

const mezclasTanqueConfig = {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    id_tanque_preparado: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    id_mezcla: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    cantidad_litros: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    }
}

export const MezclasTanque = sequelize.define('MezclasTanque', mezclasTanqueConfig, {
    tableName: 'mezclas_tanque',
    timestamps: false
})
