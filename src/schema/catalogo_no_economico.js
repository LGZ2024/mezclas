import { DataTypes } from 'sequelize'
import sequelize from '../db/db'
const catalogoNoEconomico = {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  no_economico: {
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
  activo: {
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
  equipo: {
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
  }
}

export const NoEconomico = sequelize.define('catalogo_no_economico', catalogoNoEconomico, {
  tableName: 'catalogo_no_economico',
  timestamps: false
})
