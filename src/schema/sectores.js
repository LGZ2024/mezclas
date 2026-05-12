import { DataTypes } from 'sequelize'
import sequelize from '../db/db.js'

const sectoresConfig = {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    id_rancho_dsa: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'rancho_dsa',
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
    sector_interno: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    sector_agrian: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    variedad: {
        type: DataTypes.STRING(30),
        allowNull: false
    },
    hectareas: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    status: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}

export const Sectores = sequelize.define('Sectores', sectoresConfig, {
    tableName: 'sectores',
    timestamps: false
})
