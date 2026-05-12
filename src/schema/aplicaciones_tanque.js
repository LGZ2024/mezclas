import { DataTypes } from 'sequelize'
import sequelize from '../db/db.js'

const aplicacionesTanqueConfig = {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    id_sector: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    id_responsable: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    fecha: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    litros_aplicados: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    id_tanque_preparado: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}

export const AplicacionesTanque = sequelize.define('AplicacionesTanque', aplicacionesTanqueConfig, {
    tableName: 'aplicaciones_tanque',
    timestamps: false
})
