import { DataTypes } from 'sequelize'
import sequelize from '../db/db.js'

const mezclasConfig = {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    nombre: {
        type: DataTypes.STRING(30),
        allowNull: false
    },
    fabricante: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}

// User asked for creation of schemas based on SQL.
// Using 'MezclaCatalogo' as model name to avoid collision if 'Mezcla' is already used by `mezclas.js` (which was Solicitud).
export const MezclaCatalogo = sequelize.define('MezclaCatalogo', mezclasConfig, {
    tableName: 'mezclas',
    timestamps: false
})
