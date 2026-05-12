import { DataTypes } from 'sequelize'
import sequelize from '../db/db.js'

const mezclaActivosConfig = {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    id_mezcla: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    id_activo: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    porcentaje: {
        type: DataTypes.DECIMAL(10, 4),
        allowNull: false
    }
}

export const MezclaActivos = sequelize.define('MezclaActivos', mezclaActivosConfig, {
    tableName: 'mezcla_activos',
    timestamps: false
})
