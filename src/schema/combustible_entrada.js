import { DataTypes } from 'sequelize'
import sequelize from '../db/db.js'

const combustibleEntradaConfig = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  factura: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'la fatura no puede estar vacia'
      },
      len: {
        args: [0, 50],
        msg: 'la fatura no puede tener mas de 50 caracteres'
      }
    }
  },
  fecha: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'la fecha no puede estar vacia'
      },
      isDate: {
        msg: 'la fecha no es valida'
      }
    }
  },
  combustible: {
    type: DataTypes.ENUM('Magna', 'Premium', 'Diesel'),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'el combustible no puede estar vacio'
      },
      isIn: {
        args: [['Magna', 'Premium', 'Diesel']],
        msg: 'el combustible no es valido'
      }
    }
  },
  almacen: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'el almacen no puede estar vacio'
      },
      len: {
        args: [0, 50],
        msg: 'el almacen no puede tener mas de 50 caracteres'
      }
    }
  },
  centro_coste: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'el centro de coste no puede estar vacio'
      },
      len: {
        args: [0, 50],
        msg: 'el centro de coste no puede tener mas de 50 caracteres'
      }
    }
  },
  cantidad: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      isFloat: {
        msg: 'la cantidad no puede estar vacia'
      },
      min: {
        args: [0],
        msg: 'la cantidad no es valida'
      }
    }
  },
  proveedor: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'el proveedor no puede estar vacio'
      },
      len: {
        args: [0, 50],
        msg: 'el proveedor no puede tener mas de 50 caracteres'
      }
    }
  },
  traslada: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'el traslado no puede estar vacio'
      },
      len: {
        args: [0, 50],
        msg: 'el traslado no puede tener mas de 50 caracteres'
      }
    }
  },
  recibe: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'el recibe no puede estar vacio'
      },
      len: {
        args: [0, 50],
        msg: 'el recibe no puede tener mas de 50 caracteres'
      }
    }
  },
  comentario: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: {
        args: [0, 255],
        msg: 'el comentario no puede tener mas de 255 caracteres'
      }
    }
  },
  pedido: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      notEmpty: {
        msg: 'el pedido no puede estar vacio'
      },
      len: {
        args: [0, 50],
        msg: 'el pedido no puede tener mas de 50 caracteres'
      }
    }
  }
}

export const CombustibleEntrada = sequelize.define('combustible_entrada', combustibleEntradaConfig, {
  tableName: 'combustible_entrada',
  timestamps: false
})
