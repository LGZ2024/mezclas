import { DataTypes } from 'sequelize'
import sequelize from '../db/db.js'

const activoMezclaConfig = {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    nombre: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
            notEmpty: { msg: 'El nombre es requerido' },
            len: { args: [1, 50], msg: 'El nombre debe tener entre 1 y 50 caracteres' }
        }
    },
    codigo: {
        type: DataTypes.STRING(20),
        allowNull: false,
        validate: {
            notEmpty: { msg: 'El código es requerido' },
            len: { args: [1, 20], msg: 'El código debe tener entre 1 y 20 caracteres' }
        }
    },
    tipo: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    es_principal: {
        type: DataTypes.TINYINT, // or BOOLEAN
        allowNull: false,
        defaultValue: 0
    },
    unidad: {
        type: DataTypes.ENUM('KG', 'LITRO'),
        allowNull: false,
        validate: {
            isIn: {
                args: [['KG', 'LITRO']],
                msg: 'La unidad debe ser KG o LITRO'
            }
        }
    }
}

export const ActivoMezcla = sequelize.define('ActivoMezcla', activoMezclaConfig, {
    tableName: 'activo_mezcla',
    timestamps: false
})
