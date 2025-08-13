import { DataTypes } from 'sequelize'
import sequelize from '../db/db.js'

const catalogoUnidadCombustible = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  no_economico: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmpty: {
        msg: 'El numero economico es requerido'
      },
      len: {
        args: [0, 3],
        msg: 'El numero economico requiere de 0 a 3 caracteres'
      }
    }
  },
  km: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      isEmpty: {
        msg: 'El kilometraje es requerido'
      },
      isNumeric: {
        msg: 'El kilometraje debe ser numerico'
      }
    }
  },
  fecha: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      isEmpty: {
        msg: 'La fecha es requerida'
      },
      isDate: {
        msg: 'La fecha debe ser valida'
      }
    }
  },
  usuario_registra: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmpty: {
        msg: 'El usuario que registra es requerido'
      },
      len: {
        args: [0, 30],
        msg: 'El usuario que registra requiere de 0 a 30 caracteres'
      }
    }
  }
}

export const unidadCombustible = sequelize.define('catalogo_unidad_combustible', catalogoUnidadCombustible, {
  tableName: 'catalogo_unidad_combustible',
  timestamps: false
})
