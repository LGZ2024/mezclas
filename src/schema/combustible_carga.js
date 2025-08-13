import { DataTypes } from 'sequelize'
import sequelize from '../db/db.js'

const combustibleCargaConfig = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  fecha: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
    validate: {
      isDate: {
        msg: 'La fecha debe ser una fecha válida'
      },
      isAfter: {
        args: new Date().toISOString(),
        msg: 'La fecha no puede ser anterior a la fecha actual'
      }
    }
  },
  no_economico: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      isInt: {
        msg: 'El id de la unidad debe ser un número entero'
      }
    }
  },
  centro_coste: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El rancho es requerido'
      }
    },
    len: {
      args: [3, 50],
      msg: 'El rancho debe tener entre 3 y 50 caracteres'
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
  precio: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      isFloat: {
        msg: 'El precio debe ser un número decimal'
      },
      min: {
        args: [0.01],
        msg: 'El precio debe ser mayor a 0'
      }
    }
  },
  combustible: {
    type: DataTypes.ENUM('magna', 'diesel', 'premium'),
    allowNull: false,
    validate: {
      notEmpty: {
        args: ['magna', 'diesel', 'premium'],
        msg: 'El combustible es requerido y debe ser uno de los siguientes: magna, diesel o premium'
      }
    }
  },
  responsable: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El responsable es requerido'
      }
    },
    len: {
      args: [1, 50],
      msg: 'El responsable debe tener entre 1 y 50 caracteres'
    }
  },
  km: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      isInt: {
        msg: 'El kilometraje debe ser un número entero'
      },
      min: {
        args: [0],
        msg: 'El kilometraje debe ser mayor a 0'
      }
    }
  },
  km_recorridos: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      isInt: {
        msg: 'El kilometraje recorridos debe ser un número entero'
      },
      min: {
        args: [0],
        msg: 'El kilometraje recorridos debe ser mayor a 0'
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
  }
}
export const CombustibleCarga = sequelize.define('combustible_carga', combustibleCargaConfig, {
  tableName: 'combustible_carga',
  timestamps: false
})
