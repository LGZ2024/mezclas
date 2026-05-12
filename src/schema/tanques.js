import { DataTypes } from 'sequelize'
import sequelize from '../db/db.js'

const tanquesConfig = {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    codigo: {
        type: DataTypes.STRING(20),
        allowNull: false,
        validate: {
            notEmpty: { msg: 'El código es requerido' }
        }
    },
    etapa: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    id_rancho: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            isInt: { msg: 'El rancho es requerido' }
        }
    },
    capacidad: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            isInt: { msg: 'La capacidad debe ser un número entero' }
        }
    },
    unidad: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    status: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 1
    }
}

export const Tanques = sequelize.define('Tanques', tanquesConfig, {
    tableName: 'tanques',
    timestamps: false
})
