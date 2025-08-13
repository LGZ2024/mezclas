import { DataTypes } from 'sequelize'
import sequelize from '../db/db.js'

const catalogoTallerConfig = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  razon_social: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'La razon social no puede estar vacia'
      },
      len: {
        args: [1, 100],
        msg: 'La razon social debe tener entre 3 y 100 caracteres'
      }
    }
  },
  domicilio: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El domicilio no puede estar vacio'
      },
      len: {
        args: [1, 200],
        msg: 'El domicilio debe tener entre 3 y 200 caracteres'
      }
    }
  },
  contacto: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El contacto no puede estar vacio'
      },
      len: {
        args: [1, 100],
        msg: 'El contacto debe tener entre 3 y 100 caracteres'
      }
    }
  },
  tipo_pago: {
    type: DataTypes.ENUM('CREDITO', 'DEBITO', 'EFECTIVO', 'MIXTO'),
    allowNull: false,
    validate: {
      isIn: {
        args: [['CREDITO', 'DEBITO', 'EFECTIVO', 'MIXTO']],
        msg: 'El tipo de pago debe ser CREDITO, DEBITO, EFECTIVO o MIXTO'
      }
    }
  }
}

export const CatalogoTaller = sequelize.define('CatalogoTaller', catalogoTallerConfig, {
  tableName: 'catalogo_taller',
  timestamps: false
})
