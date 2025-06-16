import { DataTypes } from 'sequelize'
import sequelize from '../db/db.js'

const devolucionConfig = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  idDevolucion: {
    type: DataTypes.STRING,
    field: 'idDevolucion',
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El id de la devolución es requerido'
      },
      len: {
        args: [3, 50],
        msg: 'El id de la devolución debe tener entre 3 y 50 caracteres'
      }
    }
  },
  idUsuarioSolicita: {
    type: DataTypes.INTEGER,
    field: 'idUsuarioSolicita',
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El Solicitante es requerido'
      },
      isInt: {
        msg: 'El id del solicitante debe ser un número entero'
      }
    }
  },
  empresa: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Empresa pertenece es requerido'
      },
      len: {
        args: [3, 50],
        msg: 'La Empresa debe tener entre 3 y 50 caracteres'
      }
    }
  },
  almacen: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El almacen es requerido'
      },
      len: {
        args: [3, 50],
        msg: 'El almacen debe tener entre 3 y 50 caracteres'
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
        args: [8, 100],
        msg: 'La temporada debe tener al menos 8 caracteres'
      }
    }
  },
  descripcion: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'La descripcion es requerida'
      },
      len: {
        args: [3, 255],
        msg: 'La descripcion debe tener entre 3 y 255 caracteres'
      }
    }
  },
  fechaDevolucion: {
    type: DataTypes.DATE,
    field: 'fechaDevolucion',
    allowNull: false,
    validate: {
      isDate: {
        msg: 'La fecha de devolución debe ser una fecha válida'
      },
      isAfter: {
        args: new Date().toISOString(),
        msg: 'La fecha de devolución no puede ser anterior a la fecha actual'
      }
    }
  },
  producto: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El producto es requerido'
      },
      isInt: {
        msg: 'El producto debe ser un número entero'
      }
    }
  },
  cantidad: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'La cantidad es requerida'
      },
      isDecimal: {
        msg: 'La cantidad debe ser un número decimal'
      },
      min: {
        args: [0.01],
        msg: 'La cantidad debe ser mayor a 0'
      },
      max: {
        args: [999999.99],
        msg: 'La cantidad no puede ser mayor a 999,999.99'
      }
    }
  },
  unidad: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'La unidad es requerida'
      },
      len: {
        args: [1, 50],
        msg: 'La unidad debe tener entre 1 y 50 caracteres'
      }
    }
  },
  status: {
    type: DataTypes.ENUM('Pendiente', 'Confirmada', 'Rechazado', 'Cancelado'),
    allowNull: false,
    defaultValue: 'Pendiente',
    validate: {
      isIn: {
        args: [['Pendiente', 'Confirmada', 'Rechazado', 'Cancelado']],
        msg: 'El estado debe ser: Pendiente, Confirmada, Rechazado o Cancelado'
      }
    }
  },
  autoriza: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      isInt: {
        msg: 'El id del autorizador debe ser un número entero'
      }
    }
  },
  actualiza: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      isInt: {
        msg: 'El id del actualizador debe ser un número entero'
      }
    }
  },
  fechaAutoriza: {
    type: DataTypes.DATE,
    field: 'fechaAutoriza',
    allowNull: true,
    validate: {
      isDate: {
        msg: 'La fecha de autorización debe ser una fecha válida'
      }
    }
  },
  fechaActualiza: {
    type: DataTypes.DATE,
    field: 'fechaActualiza',
    allowNull: true,
    validate: {
      isDate: {
        msg: 'La fecha de actualización debe ser una fecha válida'
      }
    }
  }
}

export const Devoluciones = sequelize.define('devoluciones', devolucionConfig, {
  tableName: 'devoluciones',
  timestamps: false // Agrega createdAt y updatedAt automáticamente
})
