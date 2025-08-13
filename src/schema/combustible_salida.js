import { DataTypes } from 'sequelize'
import sequelize from '../db/db.js'
const combustibleSalidaConfig = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  fecha: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      isDate: {
        msg: 'La fecha de la salida de combustible debe ser una fecha válida'
      },
      isAfter: {
        args: new Date().toISOString(),
        msg: 'La fecha de la salida de combustible no puede ser anterior a la fecha actual'
      }
    }
  },
  combustible: {
    type: DataTypes.ENUM('Magna', 'Premium', 'Diesel'),
    allowNull: false,
    validate: {
      isIn: {
        args: [['Magna', 'Premium', 'Diesel']],
        msg: 'el tipo de combustible debe ser: Magna, Premium, Diesel'
      }
    }
  },
  almacen: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El nombre del almacen no puede estar vacío'
      },
      len: {
        args: [3, 20],
        msg: 'El nombre del almacen debe tener entre 3 y 20 caracteres'
      }
    }
  },
  centro_coste: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El centro de coste no puede estar vacío'
      },
      len: {
        args: [1, 50],
        msg: 'El centro de coste debe tener entre 1 y 50 caracteres'
      }
    }
  },
  cantidad: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      isFloat: {
        msg: 'La cantidad debe ser un número decimal'
      },
      min: {
        args: [0.01],
        msg: 'La cantidad debe ser mayor a 0'
      }
    }
  },
  responsable: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El responsable es requerido'
      },
      len: {
        args: [3, 50],
        msg: 'El responsable debe tener entre 3 y 50 caracteres'
      }
    }
  },
  no_economico: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El numero economico es requerido'
      },
      len: {
        args: [3, 50],
        msg: 'El numero economico debe tener entre 3 y 50 caracteres'
      }
    }
  },
  comentario: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: {
        args: [0, 255],
        msg: 'El comentario debe tener entre 0 y 255 caracteres'
      }
    }
  },
  temporada: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'La temporada es requerida'
      },
      len: {
        args: [3, 50],
        msg: 'La temporada debe tener entre 3 y 50 caracteres'
      }
    }
  },
  actividad: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'La actividad es requerida'
      },
      len: {
        args: [1, 50],
        msg: 'La actividad debe tener entre 1 y 50 caracteres'
      }
    }
  }
}

export const CombustibleSalida = sequelize.define('combustible_salida', combustibleSalidaConfig, {
  tableName: 'combustible_salida',
  timestamps: false
})
