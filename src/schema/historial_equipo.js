import { DataTypes } from 'sequelize'
import sequelize from '../db/db.js'
const historialEquipo = {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  id_equipo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El campo no puede estar vacio'
      }
    }
  },
  estado: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El campo no puede estar vacio'
      },
      len: {
        args: [3, 50],
        msg: 'El campo debe tener entre 3 y 50 caracteres'
      }
    }
  },
  fecha_registro: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El campo no puede estar vacio'
      }
    }
  },
  motivo: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El campo no puede estar vacio'
      }
    }
  }
}

export const HistorialEquipo = sequelize.define('historial_equipo', historialEquipo, {
  tableName: 'historial_equipo',
  timestamps: false
})
