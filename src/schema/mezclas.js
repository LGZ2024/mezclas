import { DataTypes } from 'sequelize'
import sequelize from '../db/db.js'

const solicitudConfig = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  folio: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: {
        args: [0, 50],
        msg: 'El folio debe tener entre 3 y 50 caracteres'
      }
    }
  },
  cantidad: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: {
        args: [0, 10],
        msg: 'la cantidad debe tener entre 1 y 10 caracteres'
      }
    }
  },
  idCentroCoste: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'idCentroCoste', // Nombre de columna en la base de datos
    validate: {
      notNull: {
        msg: 'El centro de coste es requerido'
      }
    }
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  empresa: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'La empresa'
      },
      len: {
        args: [3, 100],
        msg: 'El nombre de la empresa debe tener entre 3 y 100 caracteres'
      }
    }
  },
  fechaSolicitud: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    field: 'fechaSolicitud', // Nombre de columna en la base de datos
    defaultValue: DataTypes.NOW
  },
  idUsuarioSolicita: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'idUsuarioSolicita', // Nombre de columna en la base de datos
    validate: {
      notNull: {
        msg: 'El ID de usuario en nesesario'
      }
    }
  },
  idUsuarioMezcla: {
    type: DataTypes.INTEGER,
    field: 'idUsuarioMezcla', // Nombre de columna en la base de datos
    allowNull: true
  },
  imagenEntrega: {
    type: DataTypes.TEXT,
    field: 'imagenEntrega', // Nombre de columna en la base de datos
    allowNull: true
  },
  metodoAplicacion: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'metodoAplicacion', // Nombre de columna en la base de datos
    validate: {
      notEmpty: {
        msg: 'El método de aplicación es requerido'
      },
      len: {
        args: [3, 100],
        msg: 'El método de aplicación debe tener entre 3 y 100 caracteres'
      }
    }
  },
  notaMezcla: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'notaMezcla', // Nombre de columna en la base de datos
    validate: {
      len: {
        args: [0, 500],
        msg: 'La nota de mezcla no puede exceder 500 caracteres'
      }
    }
  },
  presentacion: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: {
        args: [0, 100],
        msg: 'La presentación debe tener entre 3 y 100 caracteres'
      }
    }
  },
  ranchoDestino: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'ranchoDestino', // Nombre de columna en la base de datos
    validate: {
      notEmpty: {
        msg: 'El rancho es requerido'
      },
      len: {
        args: [3, 100],
        msg: 'El rancho destino debe tener entre 3 y 100 caracteres'
      }
    }
  },
  status: {
    type: DataTypes.ENUM('Pendiente', 'Proceso', 'Completada', 'Cancelada'),
    allowNull: true,
    defaultValue: 'Pendiente'
  },
  temporada: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'La temporada es requerida'
      },
      len: {
        args: [4, 20],
        msg: 'La temporada debe tener entre 4 y 20 caracteres'
      }
    }
  },
  variedad: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'La variedad es requerida'
      },
      len: {
        args: [3, 100],
        msg: 'La variedad debe tener entre 3 y 100 caracteres'
      }
    }
  },
  fechaEntrega: {
    type: DataTypes.DATEONLY,
    field: 'fechaEntrega', // Nombre de columna en la base de datos
    allowNull: true
  },
  porcentajes: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El porcentaje es requerido'
      },
      len: {
        args: [3, 100],
        msg: 'El porcentaje debe tener entre 3 y 100 caracteres'
      }
    }
  }
}

export const Solicitud = sequelize.define('solicitud', solicitudConfig, {
  tableName: 'solicitudes',
  timestamps: false,
  hooks: {
    beforeValidate: (solicitud) => {
      // Transformaciones antes de validar
      if (solicitud.folio) {
        solicitud.folio = solicitud.folio.trim().toUpperCase()
      }

      // Generar fecha de solicitud si no se proporciona
      if (!solicitud.fechaSolicitud) {
        solicitud.fechaSolicitud = new Date()
      }
    },
    afterCreate: (solicitud) => {
      console.log(`Nueva solicitud creada: ${solicitud.folio}`)
    }
  }
})
Solicitud.associate = (models) => {
  Solicitud.belongsTo(models.Usuario, {
    foreignKey: 'idUsuarioSolicita',
    as: 'usuarioSolicita'
  })

  Solicitud.belongsTo(models.Centrocoste, {
    foreignKey: 'idCentroCoste',
    as: 'centroCosto'
  })
}
