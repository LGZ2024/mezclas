import { DataTypes } from 'sequelize'
import sequelize from '../db/db.js'

export const DetalleFertilizacionTanques = sequelize.define(
    'detalle_fertilizacion_tanques',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        id_fertilizacion: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        id_tanque: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        litros_aplicados: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        }
    },
    {
        timestamps: false,
        tableName: 'detalle_fertilizacion_tanques'
    }
)
