import { DataTypes } from 'sequelize'
import sequelize from '../db/db.js'

const catalogoUnidad = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  no_economico: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El numero economico es requerido'
      },
      len: {
        args: [0, 30],
        msg: 'El numero economico requiere de 0 a 3 caracteres'
      }
    }
  },
  marca: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'La marca es requerida'
      },
      len: {
        args: [0, 30],
        msg: 'La marca requiere de 0 a 30 caracteres'
      }
    }
  },
  tipo: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El tipo es requerido'
      },
      len: {
        args: [0, 30],
        msg: 'El tipo requiere de 0 a 30 caracteres'
      }
    }
  },
  modelo: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El modelo es requerido'
      },
      len: {
        args: [0, 30],
        msg: 'El modelo requiere de 0 a 30 caracteres'
      }
    }
  },
  ano: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El año es requerido'
      },
      isNumeric: {
        msg: 'El año debe ser numerico'
      }
    }
  },
  no_serie: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El numero de serie es requerido'
      },
      len: {
        args: [0, 30],
        msg: 'El numero de serie requiere de 0 a 30 caracteres'
      }
    }
  },
  numero_motor: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El numero de motor es requerido'
      },
      len: {
        args: [0, 30],
        msg: 'El numero de motor requiere de 0 a 30 caracteres'
      }
    }
  },
  placas: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Las placas son requeridas'
      },
      len: {
        args: [0, 30],
        msg: 'Las placas requieren de 0 a 30 caracteres'
      }
    }
  },
  tipoCombustible: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El tipo de combustible es requerido'
      },
      len: {
        args: [0, 30],
        msg: 'El tipo de combustible requiere de 0 a 30 caracteres'
      }
    }
  },
  medida_llanta: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'La medida de las llantas es requerida'
      },
      len: {
        args: [0, 30],
        msg: ' La medida de las llantas requiere de 0 a 30 caracteres'
      }
    }
  },
  cia_seguro: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'La compania de seguro es requerida'
      },
      len: {
        args: [0, 30],
        msg: 'La compania de seguro requiere de 0 a 30 caracteres'
      }
    }
  },
  no_poliza: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El numero de poliza es requerido'
      },
      len: {
        args: [0, 30],
        msg: 'El numero de poliza requiere de 0 a 30 caracteres'
      }
    }
  }
}

export const unidad = sequelize.define('catalogo_unidad', catalogoUnidad, {
  tableName: 'catalogo_unidad',
  timestamps: false
})
