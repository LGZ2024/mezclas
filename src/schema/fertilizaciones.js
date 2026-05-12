import { DataTypes } from 'sequelize'
import sequelize from '../db/db.js'

export const Fertilizaciones = sequelize.define(
    'fertilizaciones',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
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
        observaciones: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        status: {
            type: DataTypes.TINYINT,
            defaultValue: 1
        }
    },
    {
        timestamps: false,
        tableName: 'fertilizaciones'
    }
)
