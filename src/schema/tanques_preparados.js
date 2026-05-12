import { DataTypes } from 'sequelize'
import sequelize from '../db/db.js'

const tanquesPreparadosConfig = {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    id_tanque: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    id_rancho: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    fecha_preparacion: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    litros_totales: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    litros_disponibles: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    codigo_tanque_preparado: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    tasa_inyeccion: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00
    }
}

export const TanquesPreparados = sequelize.define('TanquesPreparados', tanquesPreparadosConfig, {
    tableName: 'tanques_preparados',
    timestamps: false
})
