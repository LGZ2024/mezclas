import { DataTypes } from 'sequelize'
import sequelize from '../db/db.js'

const usuariosAccesosConfig = {
    idAcceso: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    idUsuario: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    idSistema: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'ID del sistema al que se da acceso'
    },
    idEmpresa: {
        type: DataTypes.INTEGER, // Asumiendo que empresas tiene ID numérico, ajustar si es string
        allowNull: true
    },
    idRancho: {
        type: DataTypes.INTEGER, // Asumiendo que ranchos tiene ID numérico
        allowNull: true,
        comment: 'Si es NULL, acceso a toda la empresa'
    },
    status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}

export const UsuariosAccesos = sequelize.define('usuarios_accesos', usuariosAccesosConfig, {
    tableName: 'usuarios_accesos',
    timestamps: false
})
