import * as __WEBPACK_EXTERNAL_MODULE_express__ from "express";
import * as __WEBPACK_EXTERNAL_MODULE_morgan__ from "morgan";
import * as __WEBPACK_EXTERNAL_MODULE_body_parser_496b7721__ from "body-parser";
import * as __WEBPACK_EXTERNAL_MODULE_cookie_parser_591162dd__ from "cookie-parser";
import * as __WEBPACK_EXTERNAL_MODULE_express_fileupload_7aacc68d__ from "express-fileupload";
import { createRequire as __WEBPACK_EXTERNAL_createRequire } from "node:module";
import * as __WEBPACK_EXTERNAL_MODULE_cors__ from "cors";
import * as __WEBPACK_EXTERNAL_MODULE_jsonwebtoken__ from "jsonwebtoken";
import * as __WEBPACK_EXTERNAL_MODULE_dotenv__ from "dotenv";
import * as __WEBPACK_EXTERNAL_MODULE_sequelize__ from "sequelize";
import * as __WEBPACK_EXTERNAL_MODULE_nodemailer__ from "nodemailer";
import * as __WEBPACK_EXTERNAL_MODULE_bcryptjs__ from "bcryptjs";
import * as __WEBPACK_EXTERNAL_MODULE_date_fns_f4130be9__ from "date-fns";
import * as __WEBPACK_EXTERNAL_MODULE_fs__ from "fs";
import * as __WEBPACK_EXTERNAL_MODULE_exceljs__ from "exceljs";
/******/ // The require scope
/******/ var __webpack_require__ = {};
/******/ 
/************************************************************************/
/******/ /* webpack/runtime/define property getters */
/******/ (() => {
/******/ 	// define getter functions for harmony exports
/******/ 	__webpack_require__.d = (exports, definition) => {
/******/ 		for(var key in definition) {
/******/ 			if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 				Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 			}
/******/ 		}
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/hasOwnProperty shorthand */
/******/ (() => {
/******/ 	__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ })();
/******/ 
/************************************************************************/
var __webpack_exports__ = {};

;// CONCATENATED MODULE: external "express"
var x = (y) => {
	var x = {}; __webpack_require__.d(x, y); return x
} 
var y = (x) => (() => (x))
const external_express_namespaceObject = x({ ["Router"]: () => (__WEBPACK_EXTERNAL_MODULE_express__.Router), ["default"]: () => (__WEBPACK_EXTERNAL_MODULE_express__["default"]) });
;// CONCATENATED MODULE: external "morgan"
var external_morgan_x = (y) => {
	var x = {}; __webpack_require__.d(x, y); return x
} 
var external_morgan_y = (x) => (() => (x))
const external_morgan_namespaceObject = external_morgan_x({ ["default"]: () => (__WEBPACK_EXTERNAL_MODULE_morgan__["default"]) });
;// CONCATENATED MODULE: external "body-parser"
var external_body_parser_x = (y) => {
	var x = {}; __webpack_require__.d(x, y); return x
} 
var external_body_parser_y = (x) => (() => (x))
const external_body_parser_namespaceObject = external_body_parser_x({ ["default"]: () => (__WEBPACK_EXTERNAL_MODULE_body_parser_496b7721__["default"]) });
;// CONCATENATED MODULE: external "cookie-parser"
var external_cookie_parser_x = (y) => {
	var x = {}; __webpack_require__.d(x, y); return x
} 
var external_cookie_parser_y = (x) => (() => (x))
const external_cookie_parser_namespaceObject = external_cookie_parser_x({ ["default"]: () => (__WEBPACK_EXTERNAL_MODULE_cookie_parser_591162dd__["default"]) });
;// CONCATENATED MODULE: external "express-fileupload"
var external_express_fileupload_x = (y) => {
	var x = {}; __webpack_require__.d(x, y); return x
} 
var external_express_fileupload_y = (x) => (() => (x))
const external_express_fileupload_namespaceObject = external_express_fileupload_x({ ["default"]: () => (__WEBPACK_EXTERNAL_MODULE_express_fileupload_7aacc68d__["default"]) });
;// CONCATENATED MODULE: external "path"
const external_path_namespaceObject = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("path");
;// CONCATENATED MODULE: external "url"
const external_url_namespaceObject = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("url");
;// CONCATENATED MODULE: external "cors"
var external_cors_x = (y) => {
	var x = {}; __webpack_require__.d(x, y); return x
} 
var external_cors_y = (x) => (() => (x))
const external_cors_namespaceObject = external_cors_x({ ["default"]: () => (__WEBPACK_EXTERNAL_MODULE_cors__["default"]) });
;// CONCATENATED MODULE: ./src/middlewares/cors.js

const ACCEPTED_ORIGINS = ['http://localhost:3000', 'http://192.168.1.130:3000', 'http://localhost:1234', 'https://movies.com', 'https://midu.dev'];
const corsMiddleware = ({
  acceptedOrigins = ACCEPTED_ORIGINS
} = {}) => (0,external_cors_namespaceObject["default"])({
  origin: (origin, callback) => {
    if (acceptedOrigins.includes(origin)) {
      return callback(null, true);
    }
    if (!origin) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  }
});
;// CONCATENATED MODULE: ./src/middlewares/validateJsonMiddleware.js
const validateJSON = async (err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      error: 'El cuerpo de la solicitud no es un JSON válido'
    });
  }
  next();
};

;// CONCATENATED MODULE: ./src/middlewares/error500Middleware.js
const error500 = async (req, res, next) => {
  return res.status(500).render('500', {
    error: 'Error interno del servidor'
  });
};
const error404 = async (req, res, next) => {
  res.status(404).render('404', {
    error: 'Página no encontrada'
  });
};

;// CONCATENATED MODULE: external "jsonwebtoken"
var external_jsonwebtoken_x = (y) => {
	var x = {}; __webpack_require__.d(x, y); return x
} 
var external_jsonwebtoken_y = (x) => (() => (x))
const external_jsonwebtoken_namespaceObject = external_jsonwebtoken_x({ ["default"]: () => (__WEBPACK_EXTERNAL_MODULE_jsonwebtoken__["default"]) });
;// CONCATENATED MODULE: external "dotenv"
var external_dotenv_x = (y) => {
	var x = {}; __webpack_require__.d(x, y); return x
} 
var external_dotenv_y = (x) => (() => (x))
const external_dotenv_namespaceObject = external_dotenv_x({ ["default"]: () => (__WEBPACK_EXTERNAL_MODULE_dotenv__["default"]) });
;// CONCATENATED MODULE: ./src/config/env.mjs

external_dotenv_namespaceObject["default"].config();

// este es un objeto que guarda nuestas variables de entorno para utilizarlas en nuestro proyecto
const envs = {
  PORT: process.env.PORT || 3000,
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_USER: process.env.DB_USER || 'root',
  DB_PASSWORD: process.env.DB_PASSWORD || '',
  DB_NAME: process.env.DB_NAME || 'viajes',
  SECRET_JWT_KEY: process.env.SECRET_JWT_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVpeXF5bmhhcXF5am1peHdtYWtwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTgzMzc5MjEsImV4cCI6MjAzMzkxMzkyMX0.9g4wlyxPa9KFzfsjhl0ty_GCNpvrP_4nxvi2ctEdP1M',
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD
};
;// CONCATENATED MODULE: ./src/middlewares/authMiddleware.js


const authenticate = async (req, res, next) => {
  const token = req.cookies.access_token;
  let decoded = null;
  req.session = {
    user: null
  };
  try {
    if (!token) return res.status(403).render('errorPage', {
      codeError: 403,
      errorMsg: 'No token provided'
    });
    // Verificamos token
    decoded = await verifyToken(token);
    if (!decoded) return res.status(401).render('errorPage', {
      codeError: 401,
      errorMsg: 'Token Invalido'
    });
    req.session.user = decoded;
    req.userRole = decoded.userRole; // Establece la propiedad req.userRole
    next();
  } catch (error) {
    req.session.user = null;
    return res.status(401).render('errorPage', {
      codeError: 401,
      errorMsg: 'Error de autenticación'
    });
  }
};
const verifyToken = async token => {
  try {
    const decoded = external_jsonwebtoken_namespaceObject["default"].verify(token, envs.SECRET_JWT_KEY);
    decoded.userRole = decoded.rol; // Agrega la propiedad userRole al objeto decoded
    return decoded;
  } catch (error) {
    return null;
  }
};
const isAdmin = (req, res, next) => {
  if (req.userRole !== 'admin') return res.status(403).render('errorPage', {
    codeError: 403,
    errorMsg: 'No autorizado'
  });
  next();
};
const isGeneral = (req, res, next) => {
  if (req.userRole !== 'solicita' && req.userRole !== 'solicita2' && req.userRole !== 'mezclador' && req.userRole !== 'administrativo' && req.userRole !== 'admin') return res.status(403).render('errorPage', {
    codeError: 403,
    errorMsg: 'No autorizado'
  });
  next();
};
const isAdminsitrativoOrAdmin = (req, res, next) => {
  if (req.userRole !== 'administrativo' && req.userRole !== 'admin') return res.status(403).render('errorPage', {
    codeError: 403,
    errorMsg: 'No autorizado'
  });
  next();
};
const isSolicitaOrMezclador = (req, res, next) => {
  if (req.userRole !== 'solicita' && req.userRole !== 'solicita2' && req.userRole !== 'mezclador' && req.userRole !== 'administrativo') return res.status(403).render('errorPage', {
    codeError: 403,
    errorMsg: 'No autorizado'
  });
  next();
};

;// CONCATENATED MODULE: external "sequelize"
var external_sequelize_x = (y) => {
	var x = {}; __webpack_require__.d(x, y); return x
} 
var external_sequelize_y = (x) => (() => (x))
const external_sequelize_namespaceObject = external_sequelize_x({ ["DataTypes"]: () => (__WEBPACK_EXTERNAL_MODULE_sequelize__.DataTypes), ["Op"]: () => (__WEBPACK_EXTERNAL_MODULE_sequelize__.Op), ["Sequelize"]: () => (__WEBPACK_EXTERNAL_MODULE_sequelize__.Sequelize) });
;// CONCATENATED MODULE: ./src/db/db.js


// configuraciones
const sequelizeConfig = {
  dialect: 'mysql',
  host: envs.DB_HOST,
  port: 3306,
  username: envs.DB_USER,
  password: envs.DB_PASSWORD,
  database: envs.DB_NAME,
  logging: false,
  define: {
    timestamps: false,
    freezeTableName: true,
    underscored: true
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};
const sequelize = new external_sequelize_namespaceObject.Sequelize(sequelizeConfig);
/* harmony default export */ const db = (sequelize); // Exporta el módulo de Sequelize como valor por defecto
;// CONCATENATED MODULE: ./src/schema/productos.js


const productosConfig = {
  id_producto: {
    type: external_sequelize_namespaceObject.DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: external_sequelize_namespaceObject.DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El nombre del producto es requerido'
      },
      len: {
        args: [3, 50],
        msg: 'El nombre del producto debe tener entre 3 y 50 caracteres'
      }
    }
  },
  descripcion: {
    type: external_sequelize_namespaceObject.DataTypes.STRING,
    allowNull: true,
    validate: {
      notEmpty: {
        msg: 'La presentacion del producto es requerido'
      },
      len: {
        args: [3, 50],
        msg: 'La presentacion del producto debe tener entre 3 y 50 caracteres'
      }
    }
  },
  unidad_medida: {
    type: external_sequelize_namespaceObject.DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'La unidad de medida es requerida para el producto'
      },
      len: {
        args: [2, 20],
        msg: 'El nombre del producto debe tener entre 2 y 20 caracteres'
      }
    }
  }
};
const Productos = db.define('productos', productosConfig, {
  tableName: 'productos',
  // Nombre de la tabla en la base de datos
  timestamps: true // Agrega createdAt y updatedAt automáticamente
});
;// CONCATENATED MODULE: ./src/models/productos.models.js

class ProductosModel {
  // obtener todos los datos
  static async getAll() {
    try {
      const productos = await Productos.findAll({
        attributes: ['id_producto', 'nombre', 'descripcion', 'unidad_medida']
      });
      return productos;
    } catch (e) {
      console.error(e.message); // Salida: Error la productos
      return {
        error: 'Error al obtener los productos'
      };
    }
  }

  // obtener todos los un ato por id
  static async getOne({
    id
  }) {
    try {
      const usuario = await Productos.findByPk(id);
      return usuario || {
        error: 'usuario no encontrada'
      };
    } catch (e) {
      console.error(e.message); // Salida: Error la usuario
      return {
        error: 'Error al obtener al usuario'
      };
    }
  }

  // Obtener todos los centros de coste que pertenecen a un rancho
  static async getCentrosPorRancho({
    rancho
  }) {
    try {
      const centros = await Productos.findAll({
        where: {
          rancho
        },
        attributes: ['id', 'centroCoste'] // Especifica los atributos que quieres devolver
      });
      return centros.length > 0 ? centros : {
        message: 'No se encontraron centros de coste para este rancho'
      };
    } catch (e) {
      console.error(e.message); // Salida: Error al obtener los centros de coste
      return {
        error: 'Error al obtener los centros de coste'
      };
    }
  }

  // eliminar usuario
  static async delete({
    id
  }) {
    try {
      const usuario = await Productos.findByPk(id);
      if (!usuario) return {
        error: 'usuario no encontrado'
      };
      await usuario.destroy();
      return {
        message: `usuario eliminada correctamente con id ${id}`
      };
    } catch (e) {
      console.error(e.message); // Salida: Error la usuario
      return {
        error: 'Error al elimiar el usuario'
      };
    }
  }

  // crear usuario
  static async create({
    data
  }) {
    try {
      // verificamos que no exista el usuario
      const usuario = await Productos.findOne({
        where: {
          usuario: data.usuario
        }
      });
      if (usuario) return {
        error: 'usuario ya existe'
      };
      // creamos el usuario
      await Productos.create({
        ...data
      });
      return {
        message: `usuario registrado exitosamente ${data.nombre}`
      };
    } catch (e) {
      console.error(e.message); // Salida: Error la usuario
      return {
        error: 'Error al crear al usuario'
      };
    }
  }

  // para actualizar datos de usuario
  static async update({
    id,
    data
  }) {
    try {
      // verificamos si existe alguna empresa con el id proporcionado
      const usuario = await Productos.findByPk(id);
      if (!usuario) return {
        error: 'usuario no encontrado'
      };
      // Actualiza solo los campos que se han proporcionado
      if (data.nombre) usuario.nombre = data.nombre;
      if (data.email) usuario.email = data.email;
      if (data.rol) usuario.rol = data.rol;
      if (data.empresa) usuario.empresa = data.empresa;
      await usuario.save();
      return {
        message: 'usuario actualizada correctamente',
        rol: data.rol
      };
    } catch (e) {
      console.error(e.message); // Salida: Error la usuario
      return {
        error: 'Error al obtener las usuarios'
      };
    }
  }
}
;// CONCATENATED MODULE: ./src/controller/proteted.controller.js

class ProtetedController {
  // ruta Protegida
  protected = async (req, res) => {
    const {
      user
    } = req.session;
    if (!user) return res.status(403).render('errorPage', {
      codeError: '403',
      errorMsg: 'Acceso no utorizado'
    });
    // validamos al usuario
    if (user.rol === 'admin' || user.rol === 'administrativo') {
      res.status(200).render('pages/admin/solicitudes', {
        user,
        rol: user.rol,
        titulo: 'Bienvenido'
      });
    } else if (user.rol === 'mezclador' || user.rol === 'solicita' || user.rol === 'supervisor' || user.rol === 'solicita2') {
      res.status(200).render('pages/mezclas/main', {
        rol: user.rol,
        nombre: user.nombre
      });
    }
  };

  // ruta vivienda
  solicitud = async (req, res) => {
    const {
      user
    } = req.session;
    // verificamos si existe un usuario
    if (!user) return res.status(403).render('errorPage', {
      codeError: '403',
      errorMsg: 'Acceso no utorizado'
    });
    // Separar los ranchos en un array
    const ranchos = user.ranchos.split(',');
    res.render('pages/mezclas/solicitud', {
      ranchos
    });
  };
  solicitudes = async (req, res) => {
    const {
      user
    } = req.session;
    // verificamos si existe un usuario
    if (!user) return res.status(403).render('errorPage', {
      codeError: '403',
      errorMsg: 'Acceso no utorizado'
    });
    res.render('pages/mezclas/pendientes', {
      rol: user.rol
    });
  };
  proceso = async (req, res) => {
    const {
      user
    } = req.session;
    // verificamos si existe un usuario
    if (!user) return res.status(403).render('errorPage', {
      codeError: '403',
      errorMsg: 'Acceso no utorizado'
    });
    res.render('pages/mezclas/proceso', {
      rol: user.rol
    });
  };
  completadas = async (req, res) => {
    const {
      user
    } = req.session;
    // verificamos si existe un usuario
    if (!user) return res.status(403).render('errorPage', {
      codeError: '403',
      errorMsg: 'Acceso no utorizado'
    });
    const productos = await ProductosModel.getAll();
    res.render('pages/mezclas/completadas', {
      productos
    });
  };
  tablaSolicitudes = async (req, res) => {
    const {
      user
    } = req.session;
    // verificamos si existe un usuario
    if (!user) return res.status(403).render('errorPage', {
      codeError: '403',
      errorMsg: 'Acceso no utorizado'
    });
    res.render('pages/admin/solicitudes', {
      user,
      titulo: 'hola'
    });
  };
  usuarios = async (req, res) => {
    const {
      user
    } = req.session;
    // verificamos si existe un usuario
    if (!user) return res.status(403).render('errorPage', {
      codeError: '403',
      errorMsg: 'Acceso no utorizado'
    });
    res.render('pages/admin/usuarios', {
      user,
      titulo: 'hola'
    });
  };
  productos = async (req, res) => {
    const {
      user
    } = req.session;
    // verificamos si existe un usuario
    if (!user) return res.status(403).render('errorPage', {
      codeError: '403',
      errorMsg: 'Acceso no utorizado'
    });
    res.render('pages/admin/productos', {
      user,
      titulo: 'hola'
    });
  };
  centroCoste = async (req, res) => {
    const {
      user
    } = req.session;
    // verificamos si existe un usuario
    if (!user) return res.status(403).render('errorPage', {
      codeError: '403',
      errorMsg: 'Acceso no utorizado'
    });
    res.render('pages/admin/centrosCoste', {
      user,
      titulo: 'hola'
    });
  };

  // cerras sesion
  logout = async (req, res) => {
    try {
      res.clearCookie('access_token');
      return res.redirect('/'); // Asegúrate de usar return aquí
    } catch (error) {
      console.error('Logout error:', error);
      return res.status(500).json({
        error: 'Internal Server Error'
      }); // Asegúrate de usar return aquí
    }
  };
}
;// CONCATENATED MODULE: ./src/routes/proteted.routes.js


// import { isAdmin, isSupervisorOrAdmin, isChecadorOrAdmin } from '../middlewares/authMiddleware.js'

const createProtetedRouter = () => {
  const router = (0,external_express_namespaceObject.Router)();
  const asistenciaController = new ProtetedController();
  // rutas protegidas
  router.get('/admin', asistenciaController.protected);
  router.get('/solicitud', asistenciaController.solicitud);
  router.get('/solicitudes', asistenciaController.solicitudes);
  router.get('/proceso', asistenciaController.proceso);
  router.get('/completadas', asistenciaController.completadas);
  router.get('/tablaSolicitudes', asistenciaController.tablaSolicitudes);
  router.get('/usuarios', asistenciaController.usuarios);
  router.get('/productos', asistenciaController.productos);
  router.get('/centroCoste', asistenciaController.centroCoste);

  // cerrar sesion
  router.get('/cerrarSesion', asistenciaController.logout); // logear usuario

  return router;
};
;// CONCATENATED MODULE: external "nodemailer"
var external_nodemailer_x = (y) => {
	var x = {}; __webpack_require__.d(x, y); return x
} 
var external_nodemailer_y = (x) => (() => (x))
const external_nodemailer_namespaceObject = external_nodemailer_x({ ["default"]: () => (__WEBPACK_EXTERNAL_MODULE_nodemailer__["default"]) });
;// CONCATENATED MODULE: ./src/config/smtp.js


const enviarCorreo = async ({
  type,
  email,
  nombre,
  subject,
  password,
  solicitudId,
  fechaSolicitud,
  data,
  status,
  usuario
}) => {
  let message;
  // Configuración del transportador de email
  // Configuración del transporte
  const transporter = external_nodemailer_namespaceObject["default"].createTransport({
    host: 'portalrancho.com.mx',
    // Servidor de correo saliente
    port: 465,
    // Puerto SMTP (puedes cambiarlo si tienes bloqueos)
    secure: true,
    // Cambiar a true si usas un puerto con SSL/TLS
    auth: {
      user: envs.EMAIL_USER,
      // Usuario de correo
      pass: envs.EMAIL_PASSWORD // Contraseña del correo
    },
    tls: {
      rejectUnauthorized: false // Agrega esto si tienes problemas con certificados
    }
  });
  if (type === 'status') {
    // mensaje para status de solicitudes
    message = {
      from: '"Grupo LG" <mezclas.rancho@portalrancho.com.mx>',
      to: email,
      subject: `Actualización de Solicitud - ${solicitudId}`,
      html: `<body style="font-family: Arial, sans-serif;line-height: 1.6;color: #333;max-width: 600px;margin: 0 auto;padding: 20px;">
      <div style="background-color: #4CAF50;color: white;text-align: center;padding: 20px;">
          <h1>Grupo LG</h1>
      </div>
      <div style="background-color: #f9f9f9;border-radius: 5px;padding: 20px;margin-top: 20px;">
          <h2>Actualización de Solicitud</h2>
          <p>Estimado(a) ${nombre},</p>
          <p>Le informamos que su solicitud con ID: <b>${solicitudId}</b> ha cambiado de estatus.</p>
          
          <div style="background-color: ${getStatusColor(status)}; color: white; padding: 10px; border-radius: 5px; text-align: center;">
              <h3>Estado Actual: ${status}</h3>
          </div>
  
          <h4>Detalles de la Solicitud:</h4>

          ${getAdditionalDetails(status)}
  
          <a href="http://localhost:3000//protected/${status}" style="display: inline-block;background-color:#4CAF50;color:white;padding: 10px 20px;text-decoration: none;border-radius: 5px;margin-top: 20px;">Ver Detalles de la Solicitud</a>
          
          <p>Si tiene alguna pregunta o necesita más información, por favor contacte a nuestro equipo de soporte.</p>
          <p>Atentamente,<br>El equipo de Grupo LG</p>
      </div>
  </body>`
    };
  } else if (type === 'usuario') {
    // mesaje de registro de usuarios
    message = {
      from: 'Registro Portal Checador',
      to: 'zaragoza051@lgfrutas.com.mx',
      subject,
      html: `<body style="font-family: Arial, sans-serif;line-height: 1.6;color: #333;max-width: 600px;margin: 0 auto;padding: 20px;">
      <div style="background-color: #4CAF50;color: white;text-align: center;padding: 20px;">
          <h1>Grupo LG</h1>
      </div>
      <div style="background-color: #f9f9f9;border-radius: 5px;padding: 20px;margin-top: 20px;">
          <h2>¡Bienvenido a Grupo LG!</h2>
          <p>Estimado nuevo usuario,</p>
          <p>Nos complace darte la bienvenida a Grupo LG. Tu cuenta ha sido creada exitosamente.</p>
          <p>Para acceder a tu cuenta, por favor utiliza los siguientes datos:</p>
          <ul>
              <li>Nombre de usuario:<b>${email}</b></li>
              <li>Contraseña temporal:<b>${password}</b></li>
          </ul>
          <p>Te recomendamos cambiar tu contraseña después de iniciar sesión por primera vez.</p>
          <a href="http://localhost:3000/" style="display: inline-block;background-color:#4CAF50;color:white;padding: 10px 20px;text-decoration: none;border-radius: 5px;margin-top: 20px;">Iniciar Sesión</a>
          <p>Si tienes alguna pregunta o necesitas ayuda, no dudes en contactar a nuestro equipo de soporte.</p>
          <p>¡Gracias por unirte a nosotros!</p>
          <p>Atentamente,<br>El equipo de Grupo LG</p>
      </div>
  </body>`
    };
  } else if (type === 'solicitud') {
    // Mensaje para la creación de solicitudes
    message = {
      from: '"Portal de Solicitudes Grupo LG" <mezclas.rancho@portalrancho.com.mx>',
      to: email,
      subject: `Nueva Solicitud Creada - ${solicitudId}`,
      html: `<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background-color: #4CAF50; color: white; text-align: center; padding: 20px;">
        <h1>Grupo LG</h1>
    </div>
    <div style="background-color: #f9f9f9; border-radius: 5px; padding: 20px; margin-top: 20px;">
        <h2>Nueva Solicitud Creada</h2>
        <p>Estimado(a) ${nombre},</p>
        <p>Le informamos nueva solicitud ha sido creada con éxito. ID de solicitud es: <b>${solicitudId}</b>.</p>
        
        <h4>Datos de solicitante:</h4>
        <ul>
            <li><strong>Nombre:</strong> ${usuario.nombre}</li>
            <li><strong>Empresa</strong> ${usuario.empresa}</li>
            <li><strong>Rancho:</strong> ${data.rancho}</li>
        </ul>

        <h4>Detalles de la Solicitud:</h4>
        <ul>
            <li><strong>Fecha de Solicitud:</strong> ${fechaSolicitud}</li>
            <li><strong>Descripción:</strong> ${data.descripcion}</li>
            <li><strong>Folio Receta:</strong> ${data.folio}</li>
        </ul>

        <a href="http://localhost:3000/protected/solicitudes" style="display: inline-block; background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 20px;">Ver Detalles de la Solicitud</a>
        
        <p>Si tiene alguna pregunta o necesita más información, por favor contacte a nuestro equipo de soporte.</p>
        <p>Atentamente,<br>El equipo de Grupo LG</p>
    </div>
</body>`
    };
  } else if (type === 'notificacion') {
    message = {
      from: '"Grupo LG" <mezclas.rancho@portalrancho.com.mx>',
      to: email,
      // Replace with the customer's email
      subject: `Notificación de No Disponibilidad - ${solicitudId}`,
      html: `
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #FF5733; color: white; text-align: center; padding: 20px;">
              <h1>Grupo LG</h1>
          </div>
          <div style="background-color: #f9f9f9; border-radius: 5px; padding: 20px; margin-top: 20px;">
              <h2>Notificación de No Disponibilidad de Producto</h2>
              <p>Estimado(a) ${nombre},</p>
              <p>Le informamos que el producto que solicitó no está disponible en este momento. A continuación, se detallan los datos de los productos sin existencia:</p>
              
              <h4>Solicitud: <b>${solicitudId}</b></h4>

              <ul>
                 ${data.map(product => `
              <li>
                <strong>Id del Producto:</strong> ${product.id_producto}<br>
                <strong>Nombre del Producto:</strong> ${product.nombre_producto}<br>
                <strong>Unidad de Medida:</strong> ${product.unidad_medida}<br>
                <strong>cantidad:</strong> ${product.cantidad}
              </li>
            `).join('')}
              </ul>
    
              <p>Si desea, podemos ofrecerle alternativas similares o puede optar por omitir los productos. Por favor, háganos saber cómo desea proceder.</p>
              
              <p>Si tiene alguna pregunta o necesita más información, no dude en contactar a nuestro equipo de almacen.</p>
              <p><strong>Encardado de almacen:</strong>${usuario.nombre}<br></p>
              <p><strong>Empresa:</strong>${usuario.empresa}<br></p>
              <p><strong>rancho:</strong>${usuario.ranchos}<br></p>
              <p>Atentamente,<br>El equipo de Grupo LG</p>
          </div>
        </body>`
    };
  }

  // Función auxiliar para obtener color según el estatus
  function getStatusColor(status) {
    switch (status) {
      case 'Proceso':
        return '#28a745';
      // Verde
      case 'Completada':
        return '#ffc107';
      // Amarillo
      case 'Rechazado':
        return '#dc3545';
      // Rojo
      default:
        return '#17a2b8';
      // Azul
    }
  }

  // Función auxiliar para agregar detalles adicionales según el estatus
  function getAdditionalDetails(status) {
    switch (status) {
      case 'Proceso':
        return '<p>Su solicitud está siendo procesada. Le mantendremos informado sobre cualquier actualización.</p>';
      case 'Completada':
        return '<p>Su solocitud a sido <strong>completada</strong>. Para más detalles, por favor contacte a nuestro equipo.</p>';
      default:
        return '';
    }
  }
  transporter.sendMail(message, (error, info) => {
    if (error) {
      console.error(`Error al enviar correo ${error}`);
    } else {
      console.log('Correo Enviado');
    }
  });
};
;// CONCATENATED MODULE: ./src/controller/usuario.controller.js

class UsuarioController {
  constructor({
    usuarioModel
  }) {
    this.usuarioModel = usuarioModel;
  }

  // borra usuario
  delete = async (req, res) => {
    const {
      id
    } = req.params;
    try {
      const result = await this.usuarioModel.delete({
        id
      });
      if (result.error) {
        res.status(404).json({
          error: `${result.error}`
        });
      }
      res.json({
        message: `${result.message}`
      });
    } catch (error) {
      console.error({
        error: `${error}`
      });
      res.status(500).json({
        error: 'Error de Servidor'
      });
    }
  };

  // obtener  usuario
  getAll = async (req, res) => {
    try {
      // obetenmos todos las usuario
      const usuario = await this.usuarioModel.getAll();
      if (usuario.error) {
        res.status(404).json({
          error: `${usuario.error}`
        });
      }
      res.json(usuario);
    } catch (error) {
      console.error({
        error: `${error}`
      });
      res.status(500).json({
        error: 'Error de Servidor'
      });
    }
  };

  // obtener una empresa
  getOne = async (req, res) => {
    const {
      id
    } = req.params;
    try {
      const usuario = await this.usuarioModel.getOne({
        id
      });
      if (usuario.error) {
        return res.status(404).json({
          error: usuario.error
        }); // Asegúrate de usar return aquí
      } else {
        return res.json(usuario); // Asegúrate de usar return aquí también
      }
    } catch (error) {
      console.error({
        error: `${error}`
      });
      return res.status(500).json({
        error: 'Error de Servidor'
      }); // Asegúrate de usar return aquí
    }
  };

  // crear nuevo Usuario
  create = async (req, res) => {
    try {
      const result = await this.usuarioModel.create({
        data: req.body
      });
      if (result.error) {
        return res.status(400).json({
          error: result.error
        });
      }
      await enviarCorreo({
        email: req.body.email,
        subject: 'Bienvenido Nuevo Usuario',
        password: req.body.password
      }); // si se creo con exito el usuario enviamos correo con la contraseña
      return res.json({
        message: result.message
      });
    } catch (error) {
      console.error({
        error: `${error}`
      });
      return res.status(500).render('500', {
        error: 'Error interno del servidor'
      });
    }
  };

  // actualizar datos del usuario
  update = async (req, res) => {
    const {
      id
    } = req.params;
    try {
      const result = await this.usuarioModel.update({
        id,
        data: req.body
      });
      if (result.error) {
        res.status(404).json({
          error: `${result.error}`
        });
      }
      return res.json({
        message: result.message
      });
    } catch (error) {
      console.error({
        error: `${error}`
      });
      return res.status(500).render('500', {
        error: 'Error interno del servidor'
      });
    }
  };

  // login usuario
  login = async (req, res) => {
    const {
      user,
      password
    } = req.body;
    try {
      const result = await this.usuarioModel.login({
        user,
        password
      });
      if (result.error) {
        return res.status(400).json({
          error: result.error
        });
      }
      return res.cookie('access_token', result.token, {
        httpOnly: true,
        // la cookie solo se puede acceder en el servidor
        secure: false,
        sameSite: 'strict' // la cookie solo se puede acceder en el mismo dominio
        // maxAge: 60 * 60 * 24 * 30 // la cookie expira
      }).send({
        message: result.message,
        rol: result.rol
      });
    } catch (error) {
      console.error({
        error: `${error}`
      });
      return res.status(500).render('500', {
        error: 'Error interno del servidor'
      });
    }
  };

  // actualizar contraseña del usuario
  changePassword = async (req, res) => {
    const {
      id
    } = req.params;
    const {
      newPassword
    } = req.body;
    try {
      const result = await this.usuarioModel.changePasswordAdmin({
        id,
        newPassword
      });
      if (result.error) {
        return res.status(400).json({
          error: result.error
        });
      }
      return res.json({
        message: result.message
      });
    } catch (error) {
      console.error({
        error: `${error}`
      });
      return res.status(500).render('500', {
        error: 'Error interno del servidor'
      });
    }
  };
}
;// CONCATENATED MODULE: ./src/routes/usuario.routes.js



const createUsuarioRouter = ({
  usuarioModel
}) => {
  const router = (0,external_express_namespaceObject.Router)();
  const usuarioController = new UsuarioController({
    usuarioModel
  });

  // Crear un usuario
  router.post('/', authenticate, isAdmin, usuarioController.create);
  router.get('/', authenticate, isAdmin, usuarioController.getAll);
  router.get('/:id', authenticate, isAdmin, usuarioController.getOne);
  router.patch('/:id', authenticate, isAdmin, usuarioController.update);
  router.delete('/:id', authenticate, isAdmin, usuarioController.delete);
  router.put('/:id', authenticate, isAdmin, usuarioController.changePassword);

  // rutas de inicio de sesion
  router.post('/login', usuarioController.login); // logear usuario

  return router;
};
;// CONCATENATED MODULE: ./src/controller/centro.controller.js
class CentroController {
  constructor({
    centroModel
  }) {
    this.centroModel = centroModel;
  }

  // extraer
  getCentrosPorRancho = async (req, res) => {
    const {
      rancho
    } = req.params;
    const {
      user
    } = req.session;
    let centroCoste;
    try {
      // esta validacion es especial para fransico ya que el solo podra solicitar de fresa en estos ranchos
      if (user.rol === 'administrativo' && (rancho === 'Romero' || rancho === 'Potrero')) {
        centroCoste = await this.centroModel.getCentrosPorRancho({
          rancho,
          cultivo: 'Fresa'
        });
      } else {
        centroCoste = await this.centroModel.getCentrosPorRancho({
          rancho,
          cultivo: user.cultivo
        });
      }
      if (centroCoste.error) {
        res.status(404).json({
          error: `${centroCoste.error}`
        });
      }
      res.json(centroCoste);
    } catch (error) {
      console.error('Error al crear la solicitud:', error);
      res.status(500).json({
        mensaje: 'Ocurrió un error al crear la solicitud'
      });
    }
  };

  // extraer un solo variedades
  getVariedadPorCentroCoste = async (req, res) => {
    const {
      id
    } = req.params;
    try {
      const variedad = await this.centroModel.getVariedadPorCentroCoste({
        id
      });
      if (variedad.error) {
        res.status(404).json({
          error: `${variedad.error}`
        });
      }
      res.json(variedad);
    } catch (error) {
      console.error('Error al crear la solicitud:', error);
      res.status(500).json({
        mensaje: 'Ocurrió un error al crear la solicitud'
      });
    }
  };

  // extraer un solo variedades
  getAll = async (req, res) => {
    try {
      const variedad = await this.centroModel.getAll();
      if (variedad.error) {
        res.status(404).json({
          error: `${variedad.error}`
        });
      }
      res.json(variedad);
    } catch (error) {
      console.error('Error al crear la solicitud:', error);
      res.status(500).json({
        mensaje: 'Ocurrió un error al crear la solicitud'
      });
    }
  };
}
;// CONCATENATED MODULE: ./src/routes/centro.routes.js


const createCentroCosteRouter = ({
  centroModel
}) => {
  const router = (0,external_express_namespaceObject.Router)();
  const centroController = new CentroController({
    centroModel
  });

  // Obtener centros de coste. pasamos
  router.get('/cc/:rancho', centroController.getCentrosPorRancho);

  // obtener variedades de contros de costo
  router.get('/variedades/:id', centroController.getVariedadPorCentroCoste);

  // obtener todos los centros de costo
  router.get('/centroCoste', centroController.getAll);
  return router;
};
;// CONCATENATED MODULE: external "bcryptjs"
var external_bcryptjs_x = (y) => {
	var x = {}; __webpack_require__.d(x, y); return x
} 
var external_bcryptjs_y = (x) => (() => (x))
const external_bcryptjs_namespaceObject = external_bcryptjs_x({ ["default"]: () => (__WEBPACK_EXTERNAL_MODULE_bcryptjs__["default"]) });
;// CONCATENATED MODULE: ./src/schema/usuarios.js



const usuarioConfig = {
  nombre: {
    type: external_sequelize_namespaceObject.DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El nombre es requerido'
      },
      len: {
        args: [3, 50],
        msg: 'El nombre debe tener entre 3 y 50 caracteres'
      }
    }
  },
  usuario: {
    type: external_sequelize_namespaceObject.DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: {
        msg: 'El Usuario es obligatorio'
      },
      len: {
        args: [3, 50],
        msg: 'El nombre debe tener entre 3 y 50 caracteres'
      }
    }
  },
  email: {
    type: external_sequelize_namespaceObject.DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: {
        msg: 'El email es requerido'
      },
      isEmail: {
        msg: 'El email debe ser válido'
      }
    }
  },
  password: {
    type: external_sequelize_namespaceObject.DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'La contraseña es requerida'
      },
      len: {
        args: [8, 100],
        msg: 'La contraseña debe tener al menos 8 caracteres'
      }
    }
  },
  rol: {
    type: external_sequelize_namespaceObject.DataTypes.ENUM('admin', 'supervisor', 'mezclador', 'solicita', 'administrativo'),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El rol es requerido'
      }
    }
  },
  empresa: {
    type: external_sequelize_namespaceObject.DataTypes.STRING,
    allowNull: true,
    defaultValue: 'Sin empresa asignada',
    validate: {
      len: {
        args: [0, 50],
        msg: 'La empresa debe tener entre 3 y 50 caracteres'
      }
    }
  },
  ranchos: {
    type: external_sequelize_namespaceObject.DataTypes.STRING,
    allowNull: true,
    defaultValue: 'General',
    validate: {
      len: {
        args: [0, 80],
        msg: 'El rancho debe tener entre 0 y 50 caracteres'
      }
    }
  },
  variedad: {
    type: external_sequelize_namespaceObject.DataTypes.STRING,
    allowNull: true,
    defaultValue: 'General',
    validate: {
      len: {
        args: [0, 50],
        msg: 'La variedad debe tener entre 0 y 50 caracteres'
      }
    }
  }
};
const Usuario = db.define('usuarios', usuarioConfig, {
  timestamps: false,
  hooks: {
    beforeCreate: async (usuario, options) => {
      const salt = await external_bcryptjs_namespaceObject["default"].genSalt(10);
      usuario.password = await external_bcryptjs_namespaceObject["default"].hash(usuario.password, salt);
    },
    beforeUpdate: async (usuario, options) => {
      if (usuario.changed('password')) {
        const salt = await external_bcryptjs_namespaceObject["default"].genSalt(10);
        usuario.password = await external_bcryptjs_namespaceObject["default"].hash(usuario.password, salt);
      }
    }
  }
});
;// CONCATENATED MODULE: ./src/models/usuario.models.js





class UsuarioModel {
  // obtener todos los datos
  static async getAll() {
    try {
      const usuario = await Usuario.findAll({
        attributes: ['id', 'nombre', 'email', 'rol', 'empresa', 'ranchos']
      });
      return usuario;
    } catch (e) {
      console.error(e.message); // Salida: Error la usuario
      return {
        error: 'Error al obtener los usuarios'
      };
    }
  }
  static async getUserEmail({
    rol,
    empresa
  }) {
    try {
      const usuario = await Usuario.findAll({
        attributes: ['nombre', 'email', 'ranchos', 'empresa'],
        where: {
          rol,
          [external_sequelize_namespaceObject.Op.or]: [{
            empresa
          }, {
            empresa: 'General'
          }]
        }
      });
      return usuario;
    } catch (e) {
      console.error(e.message); // Salida: Error la usuario
      return {
        error: 'Error al obtener los usuarios'
      };
    }
  }
  static async getUserEmailRancho({
    rol,
    empresa,
    rancho
  }) {
    try {
      const usuario = await Usuario.findAll({
        attributes: ['nombre', 'email', 'ranchos', 'empresa'],
        where: {
          rol,
          // Se filtra por rol
          empresa,
          // Se filtra por empresa
          ranchos: rancho // Se filtra por rancho
        }
      });
      return usuario;
    } catch (e) {
      console.error(e.message); // Salida: Error la usuario
      return {
        error: 'Error al obtener los usuarios'
      };
    }
  }
  static async getUserEmailEmpresa({
    rol,
    empresa
  }) {
    try {
      const usuario = await Usuario.findAll({
        attributes: ['nombre', 'email', 'ranchos', 'empresa'],
        where: {
          rol,
          // Se filtra por rol
          empresa // Se filtra por empresa
        }
      });
      return usuario;
    } catch (e) {
      console.error(e.message); // Salida: Error la usuario
      return {
        error: 'Error al obtener los usuarios'
      };
    }
  }

  // obtener todos los un ato por id
  static async getOne({
    rol,
    empresa
  }) {
    try {
      const usuario = await Usuario.findOne({
        where: {
          rol,
          empresa
        },
        attributes: ['nombre', 'email', 'rol']
      });
      return usuario || {
        error: 'usuario no encontrada'
      };
    } catch (e) {
      console.error(e.message); // Salida: Error la usuario
      return {
        error: 'Error al obtener al usuario'
      };
    }
  }
  static async getOneId({
    id
  }) {
    try {
      const usuario = await Usuario.findOne({
        where: {
          id
        },
        attributes: ['nombre', 'email', 'rol']
      });
      return usuario || {
        error: 'usuario no encontrada'
      };
    } catch (e) {
      console.error(e.message); // Salida: Error la usuario
      return {
        error: 'Error al obtener al usuario'
      };
    }
  }

  // eliminar usuario
  static async delete({
    id
  }) {
    try {
      const usuario = await Usuario.findByPk(id);
      if (!usuario) return {
        error: 'usuario no encontrado'
      };
      await usuario.destroy();
      return {
        message: `usuario eliminada correctamente con id ${id}`
      };
    } catch (e) {
      console.error(e.message); // Salida: Error la usuario
      return {
        error: 'Error al elimiar el usuario'
      };
    }
  }

  // crear usuario
  static async create({
    data
  }) {
    try {
      // verificamos que no exista el usuario
      const usuario = await Usuario.findOne({
        where: {
          usuario: data.usuario,
          email: data.email
        }
      });
      if (usuario) return {
        error: 'usuario ya existe'
      };
      // creamos el usuario
      await Usuario.create({
        ...data
      });
      return {
        message: `usuario registrado exitosamente ${data.nombre}`
      };
    } catch (e) {
      console.error(e.message); // Salida: Error la usuario
      return {
        error: 'Error al crear al usuario'
      };
    }
  }

  // para actualizar datos de usuario
  static async update({
    id,
    data
  }) {
    try {
      // verificamos si existe alguna empresa con el id proporcionado
      const usuario = await Usuario.findByPk(id);
      if (!usuario) return {
        error: 'usuario no encontrado'
      };
      // Actualiza solo los campos que se han proporcionado
      if (data.nombre) usuario.nombre = data.nombre;
      if (data.email) usuario.email = data.email;
      if (data.rol) usuario.rol = data.rol;
      if (data.empresa) usuario.empresa = data.empresa;
      await usuario.save();
      return {
        message: 'usuario actualizada correctamente',
        rol: data.rol
      };
    } catch (e) {
      console.error(e.message); // Salida: Error la usuario
      return {
        error: 'Error al obtener las usuarios'
      };
    }
  }

  // funcion login
  static async login({
    user,
    password
  }) {
    try {
      const usuario = await Usuario.findOne({
        where: {
          usuario: user
        }
      });
      if (!usuario) return {
        error: 'usuario no encontrado'
      };
      const isValidPassword = await external_bcryptjs_namespaceObject["default"].compare(password, usuario.password);
      if (!isValidPassword) return {
        error: 'contraseña incorrecta'
      };
      // creamos jwt
      const token = external_jsonwebtoken_namespaceObject["default"].sign({
        id: usuario.id,
        nombre: usuario.nombre,
        rol: usuario.rol,
        empresa: usuario.empresa,
        ranchos: usuario.ranchos,
        cultivo: usuario.variedad
      }, envs.SECRET_JWT_KEY, {
        expiresIn: '24h'
      });
      return {
        message: 'usuario logueado correctamente',
        token,
        rol: usuario.rol
      };
    } catch (e) {
      console.error(e.message);
      return {
        error: 'Error al iniciar sesión'
      };
    }
  }

  // funcion cambiar contraseña usuario
  static async changePassword({
    id,
    oldPassword,
    newPassword
  }) {
    try {
      const usuario = await Usuario.findByPk(id);
      if (!usuario) return {
        error: 'usuario no encontrado'
      };
      const isValidPassword = await external_bcryptjs_namespaceObject["default"].compare(oldPassword, usuario.password);
      if (!isValidPassword) return {
        error: 'contraseña actual incorrecta'
      };
      usuario.password = newPassword;
      await usuario.save();
      return {
        message: 'contraseña cambiada correctamente'
      };
    } catch (e) {
      console.error(e.message);
      return {
        error: 'Error al cambiar contraseña'
      };
    }
  }

  // funcion cambiar contraseña Admin
  static async changePasswordAdmin({
    id,
    newPassword
  }) {
    try {
      const usuario = await Usuario.findByPk(id);
      if (!usuario) return {
        error: 'usuario no encontrado'
      };
      usuario.password = newPassword;
      await usuario.save();
      return {
        message: 'contraseña cambiada correctamente'
      };
    } catch (e) {
      console.error(e.message);
      return {
        error: 'Error al cambiar contraseña'
      };
    }
  }
}
;// CONCATENATED MODULE: external "date-fns"
var external_date_fns_x = (y) => {
	var x = {}; __webpack_require__.d(x, y); return x
} 
var external_date_fns_y = (x) => (() => (x))
const external_date_fns_namespaceObject = external_date_fns_x({ ["format"]: () => (__WEBPACK_EXTERNAL_MODULE_date_fns_f4130be9__.format) });
;// CONCATENATED MODULE: ./src/controller/mezclas.controller.js



class MezclasController {
  constructor({
    mezclaModel
  }) {
    this.mezclaModel = mezclaModel;
  }
  create = async (req, res) => {
    let ress;
    try {
      // obtenemos los datos de la sesion
      const {
        user
      } = req.session;

      // Acceder a los datos de FormData
      const result = await this.mezclaModel.create({
        data: req.body,
        idUsuario: user.id
      });
      if (result.error) {
        return res.status(400).json({
          error: result.error
        });
      }
      // procesar fecha
      const fechaSolicitud = new Date(result.fechaSolicitud);
      const fechaFormateada = (0,external_date_fns_namespaceObject.format)(fechaSolicitud, 'dd/MM/yyyy HH:mm:ss');
      if (req.body.rancho === 'Atemajac' || req.body.rancho === 'Ahualulco') {
        const r1 = await UsuarioModel.getUserEmailRancho({
          rol: 'mezclador',
          empresa: req.body.empresaPertece,
          rancho: req.body.rancho
        });
        const r2 = await UsuarioModel.getUserEmailEmpresa({
          rol: 'mezclador',
          empresa: 'General'
        });
        ress = [...r1, ...r2];
      } else if (req.body.rancho === 'Seccion 7 Fresas') {
        const r1 = await UsuarioModel.getUserEmailRancho({
          rol: 'mezclador',
          empresa: 'Bioagricultura',
          rancho: 'Atemajac'
        });
        const r2 = await UsuarioModel.getUserEmailEmpresa({
          rol: 'mezclador',
          empresa: 'General'
        });
        ress = [...r1, ...r2];
      } else {
        // obtenemos los datos del usuario al que mandaremos el correo
        ress = await UsuarioModel.getUserEmail({
          rol: 'mezclador',
          empresa: req.body.empresaPertece
        });
      }
      if (ress && !ress.error) {
        // Usar forEach para mapear los resultados
        ress.forEach(async usuario => {
          // console.log(`nombre:${usuario.nombre}, correo:${usuario.email}`)
          await enviarCorreo({
            type: 'solicitud',
            email: usuario.email,
            nombre: usuario.nombre,
            solicitudId: result.idSolicitud,
            fechaSolicitud: fechaFormateada,
            data: req.body,
            usuario: user
          });
        });
      } else {
        console.error(ress.error || 'No se encontraron usuarios');
      }
      return res.json({
        message: result.message
      });
    } catch (error) {
      console.error('Error al crear la solicitud:', error);
      res.status(500).json({
        mensaje: 'Ocurrió un error al crear la solicitud'
      });
    }
  };
  cerrarSolicitid = async (req, res) => {
    try {
      // obtenemos los datos de la sesion
      const {
        user
      } = req.session;
      // Acceder a los datos de FormData
      const result = await this.mezclaModel.cerrarSolicitid({
        data: req.body,
        idUsuario: user.id
      });
      if (result.error) {
        return res.status(400).json({
          error: result.error
        });
      }
      const ress = await UsuarioModel.getOneId({
        id: result.idUsuarioSolicita
      });
      console.log(`nombre:${ress.nombre}, correo:${ress.email}`);
      await enviarCorreo({
        type: 'status',
        email: ress.email,
        nombre: ress.nombre,
        solicitudId: result.id,
        status: result.status
      });
      return res.json({
        message: result.message
      });
    } catch (error) {
      console.error('Error al crear la solicitud:', error);
      res.status(500).json({
        mensaje: 'Ocurrió un error al crear la solicitud'
      });
    }
  };
  obtenerTablaMezclasEmpresa = async (req, res) => {
    try {
      const {
        user
      } = req.session;
      const {
        status
      } = req.params;
      if (!status) {
        return res.status(400).json({
          error: 'El estado es requerido'
        });
      }

      // Inicializar result como un array vacío
      let result = [];
      switch (user.rol) {
        case 'mezclador':
          if (user.ranchos === 'General') {
            result = await this.mezclaModel.obtenerTablaMezclasEmpresa({
              status,
              empresa: user.empresa
            });
          } else if (user.ranchos === 'Atemajac' && user.rol === 'mezclador') {
            const r1 = await this.mezclaModel.obtenerTablaMezclasRancho({
              status,
              ranchoDestino: user.ranchos
            });
            const r2 = await this.mezclaModel.obtenerTablaMezclasEmpresa({
              status,
              empresa: 'Lugar Agricola'
            });
            result = [...r1, ...r2];
          } else {
            result = await this.mezclaModel.obtenerTablaMezclasRancho({
              status,
              ranchoDestino: user.ranchos
            });
          }
          break;
        case 'solicita':
          result = await this.mezclaModel.obtenerTablaMezclasUsuario({
            status,
            idUsuarioSolicita: user.id
          });
          break;
        case 'solicita2':
          result = await this.mezclaModel.obtenerTablaMezclasEmpresa({
            status,
            empresa: user.empresa
          });
          break;
        case 'supervisor':
          result = await this.mezclaModel.getAll();
          break;
        case 'administrativo':
          {
            const [res2, res1] = await Promise.all([this.mezclaModel.obtenerTablaMezclasEmpresa({
              status,
              empresa: user.empresa
            }), this.mezclaModel.obtenerTablaMezclasUsuario({
              status,
              idUsuarioSolicita: user.id
            })]);
            // Verificar y combinar resultados
            if (Array.isArray(res2)) {
              result = result.concat(res2); // Agregar res2 si es un array
            }
            if (Array.isArray(res1)) {
              result = result.concat(res1); // Agregar res1 si es un array
            }
            // Eliminar duplicados basados en un campo único, por ejemplo, 'id'
            const uniqueIds = new Set();
            const uniqueResults = result.filter(item => {
              if (!uniqueIds.has(item.id)) {
                // Cambia 'id' por el campo que identifique de manera única
                uniqueIds.add(item.id);
                return true;
              }
              return false;
            });

            // Verificar si hay resultados
            if (uniqueResults.length === 0) {
              return res.status(404).json({
                message: 'No se encontraron mezclas'
              });
            }

            // Asignar los resultados únicos a result
            result = uniqueResults;
            break;
          }
        default:
          return res.status(403).json({
            error: 'Rol no autorizado'
          });
      }
      if (result.error) {
        return res.status(400).json({
          error: result.error
        });
      }
      return res.json(result.data || result);
    } catch (error) {
      console.error('Error al obtener la tabla de mezclas:', error);
      return res.status(500).json({
        mensaje: 'Ocurrió un error al obtener la tabla de mezclas'
      });
    }
  };
  obtenerTablaMezclasId = async (req, res) => {
    try {
      const id = req.params.id;
      const result = await this.mezclaModel.obtenerTablaMezclasId({
        id
      });
      if (result.error) {
        return res.status(400).json({
          error: result.error
        });
      }
      return res.json(result.data);
    } catch (error) {
      console.error('Error al crear la solicitud:', error);
      res.status(500).json({
        mensaje: 'Ocurrió un error al crear la solicitud'
      });
    }
  };
  estadoProceso = async (req, res) => {
    try {
      const idSolicitud = req.params.idSolicitud;
      const result = await this.mezclaModel.estadoProceso({
        id: idSolicitud,
        data: req.body
      });
      if (result.error) {
        return res.status(400).json({
          error: result.error
        });
      }
      const ress = await UsuarioModel.getOneId({
        id: result.idUsuarioSolicita
      });
      console.log(`nombre:${ress.nombre}, correo:${ress.email}`);
      await enviarCorreo({
        type: 'status',
        email: ress.email,
        nombre: ress.nombre,
        solicitudId: idSolicitud,
        status: req.body.status
      });
      return res.json({
        message: result.message
      });
    } catch (error) {
      console.error('Error al crear la solicitud:', error);
      res.status(500).json({
        error: 'Ocurrió un error al crear la solicitud'
      });
    }
  };
}
;// CONCATENATED MODULE: ./src/routes/mezclas.routes.js


const createMezclasRouter = ({
  mezclaModel
}) => {
  const router = (0,external_express_namespaceObject.Router)();
  const mezclasController = new MezclasController({
    mezclaModel
  });

  // Crear solicitud
  router.post('/solicitudes', mezclasController.create);
  router.post('/CerrarSolicitud', mezclasController.cerrarSolicitid);
  router.get('/mezclasSolicitadas/:status', mezclasController.obtenerTablaMezclasEmpresa);
  router.get('/mezclasId/:id', mezclasController.obtenerTablaMezclasId);
  router.patch('/solicitudProceso/:idSolicitud', mezclasController.estadoProceso);
  return router;
};
;// CONCATENATED MODULE: ./src/schema/recetas.js


const recetaConfig = {
  id_receta: {
    type: external_sequelize_namespaceObject.DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: external_sequelize_namespaceObject.DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El nombre del producto es requerido'
      },
      len: {
        args: [3, 50],
        msg: 'El nombre del producto debe tener entre 3 y 50 caracteres'
      }
    }
  },
  descripcion: {
    type: external_sequelize_namespaceObject.DataTypes.STRING,
    allowNull: true,
    validate: {
      notEmpty: {
        msg: 'La presentacion del producto es requerido'
      },
      len: {
        args: [0, 50],
        msg: 'La presentacion del producto debe tener entre 3 y 50 caracteres'
      }
    }
  },
  presentacion: {
    type: external_sequelize_namespaceObject.DataTypes.STRING,
    allowNull: true,
    validate: {
      notEmpty: {
        msg: 'La presentacion del producto es requerido'
      },
      len: {
        args: [0, 50],
        msg: 'La presentacion del producto debe tener entre 3 y 50 caracteres'
      }
    }
  },
  unidad_medida: {
    type: external_sequelize_namespaceObject.DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'La unidad de medida es necesaria'
      }
    }
  }
};
const Recetas = db.define('recetas', recetaConfig, {
  tableName: 'recetas',
  // Nombre de la tabla en la base de datos
  timestamps: true // Agrega createdAt y updatedAt automáticamente
});
;// CONCATENATED MODULE: ./src/models/recetas.models.js

class RecetasModel {
  // obtener todos los datos
  static async getAll() {
    try {
      const recetas = await Recetas.findAll({
        attributes: ['id_receta', 'nombre', 'descripcion', 'unidad_medida']
      });
      return recetas;
    } catch (e) {
      console.error(e.message); // Salida: Error la recetas
      return {
        error: 'Error al obtener los recetas'
      };
    }
  }

  // obtener todos los un ato por id
  static async getOne({
    id
  }) {
    try {
      const recetas = await Recetas.findByPk(id);
      return recetas || {
        error: 'recetas no encontrada'
      };
    } catch (e) {
      console.error(e.message); // Salida: Error la recetas
      return {
        error: 'Error al obtener al recetas'
      };
    }
  }

  // eliminar recetas
  static async delete({
    id
  }) {
    try {
      const recetas = await Recetas.findByPk(id);
      if (!recetas) return {
        error: 'recetas no encontrado'
      };
      await recetas.destroy();
      return {
        message: `recetas eliminada correctamente con id ${id}`
      };
    } catch (e) {
      console.error(e.message); // Salida: Error la recetas
      return {
        error: 'Error al elimiar el recetas'
      };
    }
  }

  // crear recetas
  static async create({
    data
  }) {
    try {
      // verificamos que no exista el recetas
      const recetas = await Recetas.findOne({
        where: {
          recetas: data.recetas
        }
      });
      if (recetas) return {
        error: 'recetas ya existe'
      };
      // creamos el recetas
      await Recetas.create({
        ...data
      });
      return {
        message: `recetas registrado exitosamente ${data.nombre}`
      };
    } catch (e) {
      console.error(e.message); // Salida: Error la recetas
      return {
        error: 'Error al crear al recetas'
      };
    }
  }

  // para actualizar datos de recetas
  static async update({
    id,
    data
  }) {
    try {
      // verificamos si existe alguna empresa con el id proporcionado
      const recetas = await Recetas.findByPk(id);
      if (!recetas) return {
        error: 'recetas no encontrado'
      };
      // Actualiza solo los campos que se han proporcionado
      if (data.nombre) recetas.nombre = data.nombre;
      if (data.email) recetas.email = data.email;
      if (data.rol) recetas.rol = data.rol;
      if (data.empresa) recetas.empresa = data.empresa;
      await recetas.save();
      return {
        message: 'recetas actualizada correctamente',
        rol: data.rol
      };
    } catch (e) {
      console.error(e.message); // Salida: Error la recetas
      return {
        error: 'Error al obtener las recetass'
      };
    }
  }
}
;// CONCATENATED MODULE: ./src/controller/productos.controller.js

class ProductosController {
  constructor({
    productosModel
  }) {
    this.productosModel = productosModel;
  }

  // extraer
  getAll = async (req, res) => {
    try {
      const productos = await this.productosModel.getAll();
      const recetas = await RecetasModel.getAll();
      if (productos.error || recetas.error) {
        res.status(404).json({
          error: productos.error ? productos.error : recetas.error
        });
      }
      res.json({
        productos,
        recetas
      });
    } catch (error) {
      console.error('Error al crear la solicitud:', error);
      res.status(500).json({
        mensaje: 'Ocurrió un error al crear la solicitud'
      });
    }
  };

  // eLiminar Producto
  EliminarPorducto = async (req, res) => {
    const {
      id
    } = req.params;
    try {
      const variedad = await this.productosModel.EliminarPorducto({
        id
      });
      if (variedad.error) {
        res.status(404).json({
          error: `${variedad.error}`
        });
      }
      res.json(variedad);
    } catch (error) {
      console.error('Error al crear la solicitud:', error);
      res.status(500).json({
        mensaje: 'Ocurrió un error al crear la solicitud'
      });
    }
  };
}
;// CONCATENATED MODULE: ./src/routes/productos.routes.js


const createProductosRouter = ({
  productosModel
}) => {
  const router = (0,external_express_namespaceObject.Router)();
  const productosController = new ProductosController({
    productosModel
  });

  // Obtener todos los productos
  router.get('/productos', productosController.getAll);
  return router;
};
;// CONCATENATED MODULE: ./src/controller/productosSolicitud.controller.js

class productosSolicitud_controller_ProductosController {
  constructor({
    productossModel
  }) {
    this.productossModel = productossModel;
  }
  obtenerProductosSolicitud = async (req, res) => {
    try {
      const result = await this.productossModel.obtenerProductosSolicitud({
        idSolicitud: req.params.idSolicitud
      });
      if (result.error) {
        return res.status(400).json({
          error: result.error
        });
      }
      return res.json(result);
    } catch (error) {
      console.error('Error al crear la solicitud:', error);
      res.status(500).json({
        mensaje: 'Ocurrió un error al crear la solicitud'
      });
    }
  };
  obtenerTablaMezclasId = async (req, res) => {
    try {
      const id = req.params.id;
      const result = await this.productossModel.obtenerTablaMezclasId({
        id
      });
      if (result.error) {
        return res.status(400).json({
          error: result.error
        });
      }
      return res.json(result.data);
    } catch (error) {
      console.error('Error al crear la solicitud:', error);
      res.status(500).json({
        mensaje: 'Ocurrió un error al crear la solicitud'
      });
    }
  };
  create = async (req, res) => {
    try {
      // Acceder a los datos de FormData
      const result = await this.productossModel.create({
        data: req.body
      });
      if (result.error) {
        return res.status(400).json({
          error: result.error
        });
      }
      return res.json({
        message: result.message
      });
    } catch (error) {
      console.error('Error al crear la solicitud:', error);
      res.status(500).json({
        mensaje: 'Ocurrió un error al crear la solicitud'
      });
    }
  };
  actulizarEstado = async (req, res) => {
    const {
      user
    } = req.session;
    try {
      const result = await this.productossModel.actulizarEstado({
        data: req.body
      });
      if (result.error) {
        res.status(404).json({
          error: `${result.error}`
        });
      }
      if (result.productos.length > 0) {
        await enviarCorreo({
          type: 'notificacion',
          email: result.data[0].email,
          nombre: result.data[0].nombre,
          solicitudId: req.body.id_solicitud,
          data: result.productos,
          usuario: user
        });
      }
      return res.json({
        message: result.message
      });
    } catch (error) {
      console.error({
        error: `${error}`
      });
      return res.status(500).render('500', {
        error: 'Error interno del servidor'
      });
    }
  };
  EliminarPorducto = async (req, res) => {
    const {
      id
    } = req.params;
    try {
      const result = await this.productossModel.EliminarPorducto({
        id
      });
      if (result.error) {
        res.status(404).json({
          error: `${result.error}`
        });
      }
      return res.json({
        message: result.message
      });
    } catch (error) {
      console.error({
        error: `${error}`
      });
      return res.status(500).render('500', {
        error: 'Error interno del servidor'
      });
    }
  };
}
;// CONCATENATED MODULE: ./src/routes/productosSolitud.routes.js



const createProductosSoliRouter = ({
  productossModel
}) => {
  const router = (0,external_express_namespaceObject.Router)();
  const productossController = new productosSolicitud_controller_ProductosController({
    productossModel
  });

  // Crear solicitud
  router.get('/productoSolicitud/:idSolicitud', productossController.obtenerProductosSolicitud);
  router.get('/mezclasId/:id', productossController.obtenerTablaMezclasId);
  router.post('/productoSoli', productossController.create);
  router.post('/actualizarEstadoProductos', productossController.actulizarEstado);
  router.delete('/eliminarProducto/:id', isAdmin, productossController.EliminarPorducto);
  return router;
};
;// CONCATENATED MODULE: ./src/controller/produccion.controller.js
class ProduccionController {
  constructor({
    produccionModel
  }) {
    this.produccionModel = produccionModel;
  }

  // extraer
  ObtenerGastoUsuario = async (req, res) => {
    try {
      const centroCoste = await this.produccionModel.ObtenerGastoUsuario({
        tipo: req.params.tipo
      });
      if (centroCoste.error) {
        res.status(404).json({
          error: `${centroCoste.error}`
        });
      }
      res.json(centroCoste);
    } catch (error) {
      console.error('Error al crear la solicitud:', error);
      res.status(500).json({
        mensaje: 'Ocurrió un error al crear la solicitud'
      });
    }
  };
  solicitudReporte = async (req, res) => {
    const {
      user
    } = req.session;
    try {
      const centroCoste = await this.produccionModel.solicitudReporte({
        empresa: user.empresa,
        rol: user.rol
      });
      if (centroCoste.error) {
        res.status(404).json({
          error: `${centroCoste.error}`
        });
      }
      res.json(centroCoste);
    } catch (error) {
      console.error('Error al crear la solicitud:', error);
      res.status(500).json({
        mensaje: 'Ocurrió un error al crear la solicitud'
      });
    }
  };
  descargarEcxel = async (req, res) => {
    try {
      const buffer = await this.produccionModel.descargarEcxel({
        datos: req.body
      });
      if (buffer.error) {
        res.status(404).json({
          error: `${buffer.error}`
        });
      }
      // Configurar las cabeceras para la descarga del archivo
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=solicitudes.xlsx');
      res.send(buffer);
    } catch (error) {
      console.error('Error al crear la solicitud:', error);
      res.status(500).json({
        mensaje: 'Ocurrió un error al crear la solicitud'
      });
    }
  };
  descargarSolicitud = async (req, res) => {
    try {
      const buffer = await this.produccionModel.descargarSolicitud({
        datos: req.body
      });
      if (buffer.error) {
        res.status(404).json({
          error: `${buffer.error}`
        });
      }
      // Configurar las cabeceras para la descarga del archivo
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=solicitudes.xlsx');
      res.send(buffer);
    } catch (error) {
      console.error('Error al crear la solicitud:', error);
      res.status(500).json({
        mensaje: 'Ocurrió un error al crear la solicitud'
      });
    }
  };
  descargarReporte = async (req, res) => {
    try {
      const buffer = await this.produccionModel.descargarReporte({
        datos: req.body
      });
      if (buffer.error) {
        res.status(404).json({
          error: `${buffer.error}`
        });
      }
      // Configurar las cabeceras para la descarga del archivo
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=solicitudes.xlsx');
      res.send(buffer);
    } catch (error) {
      console.error('Error al crear la solicitud:', error);
      res.status(500).json({
        mensaje: 'Ocurrió un error al crear la solicitud'
      });
    }
  };
  descargarReporteV2 = async (req, res) => {
    try {
      const buffer = await this.produccionModel.descargarReporteV2({
        datos: req.body
      });
      if (buffer.error) {
        res.status(404).json({
          error: `${buffer.error}`
        });
      }
      // Configurar las cabeceras para la descarga del archivo
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=solicitudes.xlsx');
      res.send(buffer);
    } catch (error) {
      console.error('Error al crear la solicitud:', error);
      res.status(500).json({
        mensaje: 'Ocurrió un error al crear la solicitud'
      });
    }
  };
  ObtenerReceta = async (req, res) => {
    try {
      const buffer = await this.produccionModel.ObtenerReceta();
      if (buffer.error) {
        res.status(404).json({
          error: `${buffer.error}`
        });
      }
      res.json(buffer);
    } catch (error) {
      console.error('Error al crear la solicitud:', error);
      res.status(500).json({
        mensaje: 'Ocurrió un error al crear la solicitud'
      });
    }
  };
}
;// CONCATENATED MODULE: ./src/routes/produccion.routes.js


const createProduccionRouter = ({
  produccionModel
}) => {
  const router = (0,external_express_namespaceObject.Router)();
  const produccionController = new ProduccionController({
    produccionModel
  });

  // Crear solicitud
  router.get('/gastosUsuario/:tipo', produccionController.ObtenerGastoUsuario);
  router.get('/solicitudReporte', produccionController.solicitudReporte);
  router.post('/descargar-excel', produccionController.descargarEcxel);
  router.post('/descargar-solicitud', produccionController.descargarSolicitud);
  router.get('/obetenerReceta', produccionController.ObtenerReceta);
  router.post('/descargarReporte', produccionController.descargarReporte);
  router.post('/descargarReporte-v2', produccionController.descargarReporteV2);
  return router;
};
;// CONCATENATED MODULE: ./src/schema/centro.js


const centroConfig = {
  id: {
    type: external_sequelize_namespaceObject.DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  centroCoste: {
    type: external_sequelize_namespaceObject.DataTypes.STRING,
    allowNull: false,
    field: 'centroCoste',
    // Nombre de columna en la base de datos
    validate: {
      notEmpty: {
        msg: 'El centro de coste es requerido'
      },
      len: {
        args: [3, 50],
        msg: 'El centro de coste debe tener entre 3 y 50 caracteres'
      }
    }
  },
  empresa: {
    type: external_sequelize_namespaceObject.DataTypes.STRING,
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
  rancho: {
    type: external_sequelize_namespaceObject.DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: {
        msg: 'El rancho es requerido'
      },
      len: {
        args: [3, 50],
        msg: 'El rancho debe tener entre 3 y 50 caracteres'
      }
    }
  },
  cultivo: {
    type: external_sequelize_namespaceObject.DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El cultivo es requerido'
      },
      len: {
        args: [8, 100],
        msg: 'El cultivo debe tener al menos 8 caracteres'
      }
    }
  },
  variedad: {
    type: external_sequelize_namespaceObject.DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'La variedad es requerida'
      },
      len: {
        args: [3, 50],
        msg: 'La variedad debe tener entre 3 y 50 caracteres'
      }
    }
  },
  porcentajes: {
    type: external_sequelize_namespaceObject.DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'La variedad es requerida'
      },
      len: {
        args: [3, 50],
        msg: 'La variedad debe tener entre 3 y 50 caracteres'
      }
    }
  }
};
const Centrocoste = db.define('centrocoste', centroConfig, {
  tableName: 'centrocoste',
  // Nombre de la tabla en la base de datos
  timestamps: true // Agrega createdAt y updatedAt automáticamente
});
;// CONCATENATED MODULE: ./src/models/centro.models.js

class CentroCosteModel {
  // obtener todos los datos
  static async getAll() {
    try {
      const usuario = await Centrocoste.findAll({
        attributes: ['id', 'centroCoste', 'empresa', 'rancho', 'cultivo', 'variedad']
      });
      return usuario;
    } catch (e) {
      console.error(e.message); // Salida: Error la usuario
      return {
        error: 'Error al obtener los usuarios'
      };
    }
  }

  // obtener todos los un ato por id
  static async getOne({
    id
  }) {
    try {
      const usuario = await Centrocoste.findByPk(id);
      return usuario || {
        error: 'usuario no encontrada'
      };
    } catch (e) {
      console.error(e.message); // Salida: Error la usuario
      return {
        error: 'Error al obtener al usuario'
      };
    }
  }

  // Obtener todos los centros de coste que pertenecen a un rancho
  static async getCentrosPorRancho({
    rancho,
    cultivo
  }) {
    let centros;
    try {
      if (cultivo === 'General') {
        centros = await Centrocoste.findAll({
          where: {
            rancho
          },
          attributes: ['id', 'centroCoste'] // Especifica los atributos que quieres devolver
        });
      } else {
        centros = await Centrocoste.findAll({
          where: {
            rancho,
            cultivo
          },
          attributes: ['id', 'centroCoste'] // Especifica los atributos que quieres devolver
        });
      }
      return centros.length > 0 ? centros : {
        message: 'No se encontraron centros de coste para este rancho'
      };
    } catch (e) {
      console.error(e.message); // Salida: Error al obtener los centros de coste
      return {
        error: 'Error al obtener los centros de coste'
      };
    }
  }

  // Obtener todos los centros de coste que pertenecen a un rancho
  static async getVariedadPorCentroCoste({
    id
  }) {
    try {
      const variedades = await Centrocoste.findAll({
        where: {
          id
        },
        attributes: ['variedad'] // Especifica los atributos que quieres devolver
      });
      return variedades.length > 0 ? variedades : {
        message: 'No se encontraron variedades de este centro de coste'
      };
    } catch (e) {
      console.error(e.message); // Salida: Error al obtener los variedades de coste
      return {
        error: 'Error al obtener los variedades de centro de coste'
      };
    }
  }
  static async getVariedadPorCentroCosteNombre({
    centroCoste
  }) {
    try {
      const variedades = await Centrocoste.findAll({
        where: {
          centroCoste
        },
        attributes: ['variedad', 'porcentajes'] // Especifica los atributos que quieres devolver
      });
      return variedades.length > 0 ? variedades : {
        message: 'No se encontraron variedades de este centro de coste'
      };
    } catch (e) {
      console.error(e.message); // Salida: Error al obtener los variedades de coste
      return {
        error: 'Error al obtener los variedades de centro de coste'
      };
    }
  }

  // eliminar usuario
  static async delete({
    id
  }) {
    try {
      const usuario = await Centrocoste.findByPk(id);
      if (!usuario) return {
        error: 'usuario no encontrado'
      };
      await usuario.destroy();
      return {
        message: `usuario eliminada correctamente con id ${id}`
      };
    } catch (e) {
      console.error(e.message); // Salida: Error la usuario
      return {
        error: 'Error al elimiar el usuario'
      };
    }
  }

  // crear usuario
  static async create({
    data
  }) {
    try {
      // verificamos que no exista el usuario
      const usuario = await Centrocoste.findOne({
        where: {
          usuario: data.usuario
        }
      });
      if (usuario) return {
        error: 'usuario ya existe'
      };
      // creamos el usuario
      await Centrocoste.create({
        ...data
      });
      return {
        message: `usuario registrado exitosamente ${data.nombre}`
      };
    } catch (e) {
      console.error(e.message); // Salida: Error la usuario
      return {
        error: 'Error al crear al usuario'
      };
    }
  }

  // para actualizar datos de usuario
  static async update({
    id,
    data
  }) {
    try {
      // verificamos si existe alguna empresa con el id proporcionado
      const usuario = await Centrocoste.findByPk(id);
      if (!usuario) return {
        error: 'usuario no encontrado'
      };
      // Actualiza solo los campos que se han proporcionado
      if (data.nombre) usuario.nombre = data.nombre;
      if (data.email) usuario.email = data.email;
      if (data.rol) usuario.rol = data.rol;
      if (data.empresa) usuario.empresa = data.empresa;
      await usuario.save();
      return {
        message: 'usuario actualizada correctamente',
        rol: data.rol
      };
    } catch (e) {
      console.error(e.message); // Salida: Error la usuario
      return {
        error: 'Error al obtener las usuarios'
      };
    }
  }
}
;// CONCATENATED MODULE: ./src/schema/mezclas.js


const solicitudConfig = {
  id: {
    type: external_sequelize_namespaceObject.DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  folio: {
    type: external_sequelize_namespaceObject.DataTypes.STRING,
    allowNull: true,
    validate: {
      len: {
        args: [0, 50],
        msg: 'El folio debe tener entre 3 y 50 caracteres'
      }
    }
  },
  cantidad: {
    type: external_sequelize_namespaceObject.DataTypes.STRING,
    allowNull: true,
    validate: {
      len: {
        args: [0, 10],
        msg: 'la cantidad debe tener entre 1 y 10 caracteres'
      }
    }
  },
  idCentroCoste: {
    type: external_sequelize_namespaceObject.DataTypes.INTEGER,
    allowNull: false,
    field: 'idCentroCoste',
    // Nombre de columna en la base de datos
    validate: {
      notNull: {
        msg: 'El centro de coste es requerido'
      }
    }
  },
  descripcion: {
    type: external_sequelize_namespaceObject.DataTypes.TEXT,
    allowNull: true
  },
  empresa: {
    type: external_sequelize_namespaceObject.DataTypes.STRING,
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
    type: external_sequelize_namespaceObject.DataTypes.DATEONLY,
    allowNull: true,
    field: 'fechaSolicitud',
    // Nombre de columna en la base de datos
    defaultValue: external_sequelize_namespaceObject.DataTypes.NOW
  },
  idUsuarioSolicita: {
    type: external_sequelize_namespaceObject.DataTypes.INTEGER,
    allowNull: false,
    field: 'idUsuarioSolicita',
    // Nombre de columna en la base de datos
    validate: {
      notNull: {
        msg: 'El ID de usuario en nesesario'
      }
    }
  },
  idUsuarioMezcla: {
    type: external_sequelize_namespaceObject.DataTypes.INTEGER,
    field: 'idUsuarioMezcla',
    // Nombre de columna en la base de datos
    allowNull: true
  },
  imagenEntrega: {
    type: external_sequelize_namespaceObject.DataTypes.TEXT,
    field: 'imagenEntrega',
    // Nombre de columna en la base de datos
    allowNull: true
  },
  metodoAplicacion: {
    type: external_sequelize_namespaceObject.DataTypes.STRING,
    allowNull: false,
    field: 'metodoAplicacion',
    // Nombre de columna en la base de datos
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
    type: external_sequelize_namespaceObject.DataTypes.TEXT,
    allowNull: true,
    field: 'notaMezcla',
    // Nombre de columna en la base de datos
    validate: {
      len: {
        args: [0, 500],
        msg: 'La nota de mezcla no puede exceder 500 caracteres'
      }
    }
  },
  presentacion: {
    type: external_sequelize_namespaceObject.DataTypes.STRING,
    allowNull: true,
    validate: {
      len: {
        args: [0, 100],
        msg: 'La presentación debe tener entre 3 y 100 caracteres'
      }
    }
  },
  ranchoDestino: {
    type: external_sequelize_namespaceObject.DataTypes.STRING,
    allowNull: true,
    field: 'ranchoDestino',
    // Nombre de columna en la base de datos
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
    type: external_sequelize_namespaceObject.DataTypes.ENUM('Pendiente', 'Proceso', 'Completada', 'Cancelada'),
    allowNull: true,
    defaultValue: 'Pendiente'
  },
  temporada: {
    type: external_sequelize_namespaceObject.DataTypes.STRING,
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
    type: external_sequelize_namespaceObject.DataTypes.STRING,
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
    type: external_sequelize_namespaceObject.DataTypes.DATEONLY,
    field: 'fechaEntrega',
    // Nombre de columna en la base de datos
    allowNull: true
  }
};
const Solicitud = db.define('solicitud', solicitudConfig, {
  tableName: 'solicitudes',
  timestamps: false,
  hooks: {
    beforeValidate: solicitud => {
      // Transformaciones antes de validar
      if (solicitud.folio) {
        solicitud.folio = solicitud.folio.trim().toUpperCase();
      }

      // Generar fecha de solicitud si no se proporciona
      if (!solicitud.fechaSolicitud) {
        solicitud.fechaSolicitud = new Date();
      }
    },
    afterCreate: solicitud => {
      console.log(`Nueva solicitud creada: ${solicitud.folio}`);
    }
  }
});
Solicitud.associate = models => {
  Solicitud.belongsTo(models.Usuario, {
    foreignKey: 'idUsuarioSolicita',
    as: 'usuarioSolicita'
  });
  Solicitud.belongsTo(models.Centrocoste, {
    foreignKey: 'idCentroCoste',
    as: 'centroCosto'
  });
};
;// CONCATENATED MODULE: ./src/schema/solicitud_receta.js


const solicitud_receta_productosConfig = {
  id: {
    type: external_sequelize_namespaceObject.DataTypes.INTEGER,
    field: 'id_receta',
    // Nombre de columna en la base de datos
    primaryKey: true,
    autoIncrement: true
  },
  id_solicitud: {
    type: external_sequelize_namespaceObject.DataTypes.INTEGER,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'El Id de la solicitud en nesesario'
      }
    }
  },
  id_producto: {
    type: external_sequelize_namespaceObject.DataTypes.INTEGER,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'El Id del producto en nesesario'
      }
    }
  },
  unidad_medida: {
    type: external_sequelize_namespaceObject.DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'La unidad de medida es necesaria'
      }
    }
  },
  cantidad: {
    type: external_sequelize_namespaceObject.DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'La cantidad es requerida'
      },
      min: {
        args: [0],
        msg: 'La cantidad debe ser mayor a 0'
      }
    }
  },
  status: {
    type: external_sequelize_namespaceObject.DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: 0
  }
};
const SolicitudProductos = db.define('solicitud_receta ', solicitud_receta_productosConfig, {
  tableName: 'solicitud_receta',
  // Nombre de la tabla en la base de datos
  timestamps: false // Agrega createdAt y updatedAt automáticamente
});
;// CONCATENATED MODULE: external "fs"
var external_fs_x = (y) => {
	var x = {}; __webpack_require__.d(x, y); return x
} 
var external_fs_y = (x) => (() => (x))
const external_fs_namespaceObject = external_fs_x({ ["default"]: () => (__WEBPACK_EXTERNAL_MODULE_fs__["default"]) });
;// CONCATENATED MODULE: ./src/config/foto.mjs



const foto_filename = (0,external_url_namespaceObject.fileURLToPath)("file:///C:/Users/ZARAGOZA051/Desktop/LGZ2024/src/config/foto.mjs");
const foto_dirname = (0,external_path_namespaceObject.dirname)(foto_filename);
const guardarImagen = async ({
  imagen
}) => {
  if (!imagen) {
    return {
      message: 'No se ha enviado ninguna imagen o nombre de archivo'
    };
  }
  // Procesar base64
  const matches = imagen.match(/^data:image\/([A-Za-z-+/]+);base64,(.+)$/);
  if (!matches || matches.length !== 3) {
    return {
      message: 'Formato de imagen no válido'
    };
  }
  const imageData = matches[2];
  const buffer = Buffer.from(imageData, 'base64');
  const imageExtension = external_path_namespaceObject.extname('imagen.jpg');
  const imageName = `image_${Date.now()}${imageExtension}`;
  const imagePath = external_path_namespaceObject.join(foto_dirname + '../../../public/uploads', imageName);
  // Crear la carpeta 'uploads' si no existe
  if (!external_fs_namespaceObject["default"].existsSync(external_path_namespaceObject.join(foto_dirname + '../../../public/uploads'))) {
    external_fs_namespaceObject["default"].mkdirSync(external_path_namespaceObject.join(foto_dirname + '../../../public/uploads'));
  }

  // Guardar la imagen en el servidor
  external_fs_namespaceObject["default"].writeFile(imagePath, buffer, err => {
    if (err) {
      console.error('Error al guardar la imagen:', err);
      return {
        message: 'Error al guardar la imagen'
      };
    }
  });
  const pathParts = imagePath.split('\\');

  // Obtener la última parte de la ruta (el nombre del archivo)
  const fileName = pathParts[pathParts.length - 1];
  // fecha
  const fechaActual = new Date();

  // Obtener el año
  const anio = fechaActual.getFullYear();

  // Obtener el mes (agregar 1 porque los meses comienzan desde 0)
  const mes = String(fechaActual.getMonth() + 1).padStart(2, '0');

  // Obtener el día
  const dia = String(fechaActual.getDate()).padStart(2, '0');

  // Formatear la fecha en el formato YYYY-MM-DD
  const fechaFormateada = `${anio}-${mes}-${dia}`;

  // Construir la ruta relativa
  const relativePath = `../uploads/${fileName}`;
  return {
    relativePath,
    fecha: fechaFormateada
  };
};
;// CONCATENATED MODULE: ./src/models/mezclas.models.js


 // Asegúrate de importar el modelo de Usuario
 // Asegúrate de importar el modelo de CentroCoste


class MezclaModel {
  // crear asistencia
  static async create({
    data,
    idUsuario
  }) {
    const transaction = await db.transaction();
    try {
      // Creamos nueva solicitud con transacción
      const solicitud = await Solicitud.create({
        folio: data.folio,
        cantidad: data.cantidad,
        idCentroCoste: data.centroCoste,
        descripcion: data.descripcion,
        empresa: data.empresaPertece,
        idUsuarioSolicita: idUsuario,
        metodoAplicacion: data.metodoAplicacion,
        temporada: data.temporada,
        variedad: data.variedad,
        presentacion: data.presentacion,
        ranchoDestino: data.rancho
      }, {
        transaction
      });

      // Verificar si hay productos y procesar cada uno
      if (data.productos && Array.isArray(data.productos)) {
        // Filtrar productos válidos
        const productosValidos = data.productos.filter(producto => producto.id_producto && producto.unidad_medida && producto.cantidad);

        // Validar que haya productos
        if (productosValidos.length === 0) {
          throw new Error('No hay productos válidos para registrar');
        }

        // Procesar productos con manejo de errores mejorado
        const productosPromesas = productosValidos.map(async producto => {
          // comprobaramos si el id_producto es numero
          try {
            // Llamar al procedimiento almacenado con transacción
            await SolicitudProductos.create({
              id_solicitud: solicitud.id,
              id_producto: parseInt(producto.id_producto),
              unidad_medida: producto.unidad_medida,
              cantidad: producto.cantidad
            }, {
              transaction
            });
            return {
              idProducto: producto.id_producto,
              status: 'success'
            };
          } catch (errorProducto) {
            console.error(`Error al procesar producto ${producto.id_producto}:`, errorProducto);
            return {
              idProducto: producto.id_producto,
              status: 'error',
              message: errorProducto.message
            };
          }
        });

        // Esperar a que se procesen todos los productos
        const resultadosProductos = await Promise.all(productosPromesas);

        // Verificar si hubo errores en los productos
        const productosConError = resultadosProductos.filter(resultado => resultado.status === 'error');
        if (productosConError.length > 0) {
          // Si hay errores, lanzar una excepción con detalles
          throw new Error(`Errores al procesar productos: ${JSON.stringify(productosConError)}`);
        }
      }

      // Confirmar transacción
      await transaction.commit();
      // Retornar mensaje de éxito con ID de solicitud
      return {
        message: 'Solicitud de mezcla registrada correctamente',
        idSolicitud: solicitud.id,
        fechaSolicitud: solicitud.fechaSolicitud
      };
    } catch (error) {
      // Revertir transacción en caso de error
      if (transaction) await transaction.rollback();

      // Loguear error detallado
      console.error('Error al registrar solicitud:', error);

      // Retornar mensaje de error más descriptivo
      return {
        error: 'Error al registrar solicitud',
        detalle: error.message
      };
    }
  }
  static async cerrarSolicitid({
    data,
    idUsuario
  }) {
    const id = data.idSolicitud;
    const status = 'Completada';
    try {
      // Verificamos si existe la solicitud con el id proporcionado
      const solicitud = await Solicitud.findByPk(id);
      if (!solicitud) return {
        error: 'Solicitud no encontrada'
      };

      // Guardar imagen
      const response = await guardarImagen({
        imagen: data.imagen
      });
      // Actualiza solo los campos que se han proporcionado
      if (response.relativePath) solicitud.imagenEntrega = response.relativePath;
      if (status) solicitud.status = status;
      if (idUsuario) solicitud.idUsuarioMezcla = idUsuario;
      if (response.fecha) solicitud.fechaEntrega = response.fecha;
      await solicitud.save();
      return {
        message: 'Solicitud actualizada correctamente',
        status,
        idUsuarioSolicita: solicitud.idUsuarioSolicita,
        id
      };
    } catch (e) {
      console.error(e.message); // Salida: Error la usuario
      return {
        error: 'Error al obtener las solicitudes'
      };
    }
  }
  static async obtenerTablaMezclasEmpresa({
    status,
    empresa
  }) {
    try {
      // Consulta para obtener las mezclas filtradas por empresa y status
      const mezclas = await Solicitud.findAll({
        where: {
          empresa,
          status
        },
        include: [{
          model: Usuario,
          // Modelo de Usuario
          attributes: ['nombre'] // Campos que quieres obtener del usuario
        }, {
          model: Centrocoste,
          // Modelo de CentroCoste
          attributes: ['centroCoste'] // Campos que quieres obtener del centro de coste
        }],
        attributes: ['id', 'ranchoDestino', 'variedad', 'notaMezcla', 'folio', 'temporada', 'cantidad', 'presentacion', 'metodoAplicacion', 'descripcion', 'status', 'empresa', 'fechaSolicitud', 'imagenEntrega', 'fechaEntrega']
      });

      // Verificar si se encontraron resultados
      if (mezclas.length === 0) {
        return {
          message: 'No se encontraron mezclas para los criterios especificados',
          data: []
        };
      }

      // Transformar los resultados
      // Transformar los resultados
      const resultadosFormateados = mezclas.map(mezcla => {
        const m = mezcla.toJSON();
        return {
          id: m.id,
          Solicita: m.usuario ? m.usuario.nombre : 'Usuario no encontrado',
          fechaSolicitud: m.fechaSolicitud,
          ranchoDestino: m.ranchoDestino,
          notaMezcla: m.notaMezcla,
          empresa: m.empresa,
          centroCoste: m.centrocoste ? m.centrocoste.centroCoste : 'Centro no encontrado',
          variedad: m.variedad,
          FolioReceta: m.folio,
          temporada: m.temporada,
          cantidad: m.cantidad,
          prensetacion: m.presentacion,
          metodoAplicacion: m.metodoAplicacion,
          imagenEntrega: m.imagenEntrega,
          descripcion: m.descripcion,
          fechaEntrega: m.fechaEntrega,
          status: m.status
        };
      });

      // Devolver los resultados
      return resultadosFormateados;
    } catch (e) {
      console.error('Error al obtener mezclas:', e.message);
      return {
        error: 'Error al obtener las mezclas',
        detalle: e.message
      };
    }
  }
  static async obtenerTablaMezclasRancho({
    status,
    ranchoDestino
  }) {
    try {
      // Consulta para obtener las mezclas filtradas por empresa y status
      const mezclas = await Solicitud.findAll({
        where: {
          ranchoDestino,
          status
        },
        include: [{
          model: Usuario,
          // Modelo de Usuario
          attributes: ['nombre'] // Campos que quieres obtener del usuario
        }, {
          model: Centrocoste,
          // Modelo de CentroCoste
          attributes: ['centroCoste'] // Campos que quieres obtener del centro de coste
        }],
        attributes: ['id', 'ranchoDestino', 'variedad', 'notaMezcla', 'folio', 'temporada', 'cantidad', 'presentacion', 'metodoAplicacion', 'descripcion', 'status', 'empresa', 'fechaSolicitud', 'imagenEntrega', 'fechaEntrega']
      });

      // Verificar si se encontraron resultados
      if (mezclas.length === 0) {
        return {
          message: 'No se encontraron mezclas para los criterios especificados',
          data: []
        };
      }

      // Transformar los resultados
      // Transformar los resultados
      const resultadosFormateados = mezclas.map(mezcla => {
        const m = mezcla.toJSON();
        return {
          id: m.id,
          Solicita: m.usuario ? m.usuario.nombre : 'Usuario no encontrado',
          fechaSolicitud: m.fechaSolicitud,
          ranchoDestino: m.ranchoDestino,
          notaMezcla: m.notaMezcla,
          empresa: m.empresa,
          centroCoste: m.centrocoste ? m.centrocoste.centroCoste : 'Centro no encontrado',
          variedad: m.variedad,
          FolioReceta: m.folio,
          temporada: m.temporada,
          cantidad: m.cantidad,
          prensetacion: m.presentacion,
          metodoAplicacion: m.metodoAplicacion,
          imagenEntrega: m.imagenEntrega,
          descripcion: m.descripcion,
          fechaEntrega: m.fechaEntrega,
          status: m.status
        };
      });

      // Devolver los resultados
      return resultadosFormateados;
    } catch (e) {
      console.error('Error al obtener mezclas:', e.message);
      return {
        error: 'Error al obtener las mezclas',
        detalle: e.message
      };
    }
  }
  static async obtenerTablaMezclasUsuario({
    status,
    idUsuarioSolicita
  }) {
    try {
      // Consulta para obtener las mezclas filtradas por empresa y status
      const mezclas = await Solicitud.findAll({
        where: {
          idUsuarioSolicita,
          status
        },
        include: [{
          model: Usuario,
          // Modelo de Usuario
          attributes: ['nombre'] // Campos que quieres obtener del usuario
        }, {
          model: Centrocoste,
          // Modelo de CentroCoste
          attributes: ['centroCoste'] // Campos que quieres obtener del centro de coste
        }],
        attributes: ['id', 'ranchoDestino', 'variedad', 'notaMezcla', 'folio', 'temporada', 'cantidad', 'presentacion', 'metodoAplicacion', 'descripcion', 'status', 'empresa', 'fechaSolicitud', 'imagenEntrega', 'fechaEntrega']
      });

      // Verificar si se encontraron resultados
      if (mezclas.length === 0) {
        return {
          message: 'No se encontraron mezclas para los criterios especificados',
          data: []
        };
      }

      // Transformar los resultados
      const resultadosFormateados = mezclas.map(mezcla => {
        const m = mezcla.toJSON();
        return {
          id: m.id,
          Solicita: m.usuario ? m.usuario.nombre : 'Usuario no encontrado',
          fechaSolicitud: m.fechaSolicitud,
          ranchoDestino: m.ranchoDestino,
          notaMezcla: m.notaMezcla,
          empresa: m.empresa,
          centroCoste: m.centrocoste ? m.centrocoste.centroCoste : 'Centro no encontrado',
          variedad: m.variedad,
          FolioReceta: m.folio,
          temporada: m.temporada,
          cantidad: m.cantidad,
          prensetacion: m.presentacion,
          metodoAplicacion: m.metodoAplicacion,
          imagenEntrega: m.imagenEntrega,
          descripcion: m.descripcion,
          fechaEntrega: m.fechaEntrega,
          status: m.status
        };
      });

      // Devolver los resultados
      return resultadosFormateados;
    } catch (e) {
      console.error('Error al obtener mezclas:', e.message);
      return {
        error: 'Error al obtener las mezclas',
        detalle: e.message
      };
    }
  }
  static async obtenerTablaMezclasId({
    id
  }) {
    try {
      // Consulta para obtener las mezclas filtradas por empresa y status
      const mezclas = await Solicitud.findAll({
        where: {
          id
        },
        include: [{
          model: Usuario,
          // Modelo de Usuario
          attributes: ['nombre'] // Campos que quieres obtener del usuario
        }, {
          model: Centrocoste,
          // Modelo de CentroCoste
          attributes: ['centroCoste'] // Campos que quieres obtener del centro de coste
        }],
        attributes: ['id', 'ranchoDestino', 'variedad', 'folio', 'temporada', 'cantidad', 'presentacion', 'metodoAplicacion', 'descripcion', 'status', 'empresa', 'fechaSolicitud']
      });

      // Verificar si se encontraron resultados
      if (mezclas.length === 0) {
        return {
          message: 'No se encontraron mezclas para los criterios especificados',
          data: []
        };
      }

      // Transformar los resultados
      const resultadosFormateados = mezclas.map(mezcla => {
        const m = mezcla.toJSON();
        return {
          id: m.id,
          Solicita: m.usuario ? m.usuario.nombre : 'Usuario no encontrado',
          fechaSolicitud: m.fechaSolicitud,
          ranchoDestino: m.ranchoDestino,
          empresa: m.empresa,
          centroCoste: m.centrocoste ? m.centrocoste.centroCoste : 'Centro no encontrado',
          variedad: m.variedad,
          FolioReceta: m.folio,
          temporada: m.temporada,
          cantidad: m.cantidad,
          prensetacion: m.presentacion,
          metodoAplicacion: m.metodoAplicacion,
          imagen: m.imagenSolicitud,
          descripcion: m.descripcion,
          status: m.status
        };
      });

      // Devolver los resultados
      return {
        message: 'Mezclas obtenidas correctamente',
        data: resultadosFormateados
      };
    } catch (e) {
      console.error('Error al obtener mezclas:', e.message);
      return {
        error: 'Error al obtener las mezclas',
        detalle: e.message
      };
    }
  }
  static async estadoProceso({
    id,
    data
  }) {
    try {
      // Verificamos si existe la solicitud con el id proporcionado
      const solicitud = await Solicitud.findByPk(id);
      if (!solicitud) return {
        error: 'Solicitud no encontrada'
      };

      // Actualiza solo los campos que se han proporcionado
      if (data.notaMezcla) solicitud.notaMezcla = data.notaMezcla;
      if (data.status) solicitud.status = data.status;
      await solicitud.save();
      return {
        message: 'Solicitud actualizada correctamente',
        idUsuarioSolicita: solicitud.idUsuarioSolicita
      };
    } catch (e) {
      console.error(e.message); // Salida: Error la usuario
      return {
        error: 'Error al obtener las solicitudes'
      };
    }
  }
  static async getAll() {
    try {
      // Consulta para obtener las mezclas filtradas por empresa y status
      const mezclas = await Solicitud.findAll({
        include: [{
          model: Usuario,
          // Modelo de Usuario
          attributes: ['nombre'] // Campos que quieres obtener del usuario
        }, {
          model: Centrocoste,
          // Modelo de CentroCoste
          attributes: ['centroCoste'] // Campos que quieres obtener del centro de coste
        }],
        attributes: ['id', 'ranchoDestino', 'variedad', 'notaMezcla', 'folio', 'temporada', 'cantidad', 'presentacion', 'metodoAplicacion', 'descripcion', 'status', 'empresa', 'fechaSolicitud', 'imagenEntrega', 'fechaEntrega']
      });

      // Verificar si se encontraron resultados
      if (mezclas.length === 0) {
        return {
          message: 'No se encontraron mezclas para los criterios especificados',
          data: []
        };
      }
      // Transformar los resultados
      const resultadosFormateados = mezclas.map(mezcla => {
        const m = mezcla.toJSON();
        return {
          id: m.id,
          Solicita: m.usuario ? m.usuario.nombre : 'Usuario no encontrado',
          fechaSolicitud: m.fechaSolicitud,
          ranchoDestino: m.ranchoDestino,
          notaMezcla: m.notaMezcla,
          empresa: m.empresa,
          centroCoste: m.centrocoste ? m.centrocoste.centroCoste : 'Centro no encontrado',
          variedad: m.variedad,
          FolioReceta: m.folio,
          temporada: m.temporada,
          cantidad: m.cantidad,
          prensetacion: m.presentacion,
          metodoAplicacion: m.metodoAplicacion,
          imagenEntrega: m.imagenEntrega,
          descripcion: m.descripcion,
          fechaEntrega: m.fechaEntrega,
          status: m.status
        };
      });

      // Devolver los resultados
      return {
        message: 'Mezclas obtenidas correctamente',
        data: resultadosFormateados
      };
    } catch (e) {
      console.error('Error al obtener mezclas:', e.message);
      return {
        error: 'Error al obtener las mezclas',
        detalle: e.message
      };
    }
  }
  static async obtenerDatosSolicitud({
    id
  }) {
    try {
      // Consulta para obtener las mezclas filtradas por empresa y status
      const mezclas = await Solicitud.findAll({
        where: {
          id
        },
        attributes: ['cantidad', 'presentacion', 'metodoAplicacion']
      });
      // Verificar si se encontraron resultados
      if (mezclas.length === 0) {
        return {
          message: 'No se encontraron mezclas para los criterios especificados',
          data: []
        };
      }
      // Devolver los resultados
      return mezclas;
    } catch (e) {
      console.error('Error al obtener mezclas:', e.message);
      return {
        error: 'Error al obtener las mezclas',
        detalle: e.message
      };
    }
  }
} // fin modelo
;// CONCATENATED MODULE: ./src/models/productosSolicitud.models.js



 // Asegúrate de importar el modelo de Usuario
 // Asegúrate de importar el modelo de Usuario

class SolicitudRecetaModel {
  // crear asistencia

  static async obtenerProductosSolicitud({
    idSolicitud
  }) {
    try {
      const productosSolicitud = await SolicitudProductos.findAll({
        where: {
          id_solicitud: idSolicitud
        },
        include: [{
          model: Productos,
          // producto
          attributes: ['nombre'] // Campos que quieres obtener del usuario
        }, {
          model: Recetas,
          // Modelo de Recetas
          attributes: ['nombre'] // Campos que quieres obtener del modelo Recetas
        }],
        attributes: ['id_receta', 'id_solicitud', 'id_producto', 'id_receta', 'unidad_medida', 'cantidad']
      });

      // Verificar si se encontraron resultados
      if (productosSolicitud.length === 0) {
        return {
          message: 'No se encontraron productos para los criterios especificados',
          data: []
        };
      }

      // Transformar los resultados
      const resultadosFormateados = productosSolicitud.map(productos => {
        const m = productos.toJSON();
        return {
          id_receta: m.id_receta,
          id_solicitud: m.id_solicitud,
          nombre_producto: m.producto && m.producto.nombre ? m.producto.nombre : m.receta ? m.receta.nombre : 'Producto y receta no encontrados',
          unidad_medida: m.unidad_medida,
          cantidad: m.cantidad
        };
      });

      // Devolver los resultados
      return resultadosFormateados;
    } catch (e) {
      console.error('Error al obtener productos:', e.message);
      return {
        error: 'Error al obtener las productos',
        detalle: e.message
      };
    }
  }
  static async obtenerTablaMezclasId({
    id
  }) {
    try {
      // Consulta para obtener las mezclas filtradas por empresa y status
      const mezclas = await SolicitudProductos.findAll({
        where: {
          id
        },
        include: [{
          model: Productos,
          // Modelo de Usuario
          attributes: ['nombre'] // Campos que quieres obtener del usuario
        }],
        attributes: ['id', 'ranchoDestino', 'variedad', 'folio', 'temporada', 'cantidad', 'presentacion', 'metodoAplicacion', 'descripcion', 'status', 'empresa', 'fechaSolicitud', 'imagenSolicitud']
      });

      // Verificar si se encontraron resultados
      if (mezclas.length === 0) {
        return {
          message: 'No se encontraron mezclas para los criterios especificados',
          data: []
        };
      }

      // Transformar los resultados
      // Transformar los resultados
      const resultadosFormateados = mezclas.map(mezcla => {
        const m = mezcla.toJSON();
        return {
          id: m.id,
          Solicita: m.usuario ? m.usuario.nombre : 'Usuario no encontrado',
          fechaSolicitud: m.fechaSolicitud,
          ranchoDestino: m.ranchoDestino,
          empresa: m.empresa,
          centroCoste: m.centrocoste ? m.centrocoste.centroCoste : 'Centro no encontrado',
          variedad: m.variedad,
          FolioReceta: m.folio,
          temporada: m.temporada,
          cantidad: m.cantidad,
          prensetacion: m.presentacion,
          metodoAplicacion: m.metodoAplicacion,
          imagen: m.imagenSolicitud,
          descripcion: m.descripcion,
          status: m.status
        };
      });

      // Devolver los resultados
      return {
        message: 'Mezclas obtenidas correctamente',
        data: resultadosFormateados
      };
    } catch (e) {
      console.error('Error al obtener mezclas:', e.message);
      return {
        error: 'Error al obtener las mezclas',
        detalle: e.message
      };
    }
  }
  static async create({
    data
  }) {
    try {
      // Verificar si el usuario ya existe
      const producto = await SolicitudProductos.findOne({
        where: {
          id_solicitud: data.idSolicitud,
          id_producto: data.producto
        }
      });
      if (producto) {
        return {
          error: 'producto ya existe en la solicitud'
        };
      }
      // Llamar al procedimiento almacenado
      await SolicitudProductos.create({
        id_solicitud: data.idSolicitud,
        id_producto: data.producto,
        unidad_medida: data.unidadMedida,
        cantidad: data.cantidad
      });

      // Si llegamos aquí, la ejecución fue exitosa
      return {
        status: 'success',
        message: `Producto procesado exitosamente: ${data.producto}`
      };
    } catch (error) {
      // Manejo de errores
      console.error(`Error al procesar producto ${data.producto}:`, error);
      return {
        status: 'error',
        message: error.message || 'Error desconocido'
      };
    }
  }
  static async actulizarEstado({
    data
  }) {
    let transaction;
    const noExistencia = [];
    const estados = {
      estados: [] // Inicializa el array de estados
    };
    try {
      // Iniciar transacción
      transaction = await db.transaction();

      // Verificar si hay productos y procesar cada uno
      if (data && Array.isArray(data.estados)) {
        // Validar que haya estados
        if (data.estados.length === 0) {
          throw new Error('No hay estados válidos para registrar');
        }

        // Procesar estados
        const estadosPromesas = data.estados.map(async estado => {
          if (estado.existe === false) {
            noExistencia.push({
              id_receta: estado.id_receta
            });
          }
          try {
            const receta = await SolicitudProductos.findByPk(estado.id_receta, {
              transaction
            });
            if (!receta) return {
              status: 'error',
              message: 'Producto no encontrado'
            };

            // Actualiza el estado si existe
            receta.status = estado.existe;
            await receta.save({
              transaction
            });
            return {
              message: 'Producto actualizado correctamente'
            };
          } catch (errorProducto) {
            console.error('Error al procesar producto', errorProducto);
            return {
              status: 'error',
              message: errorProducto.message
            };
          }
        });

        // Esperar a que se procesen todos los productos
        const resultadosProductos = await Promise.all(estadosPromesas);

        // Verificar si hubo errores en los productos
        const productosConError = resultadosProductos.filter(resultado => resultado.status === 'error');
        if (productosConError.length > 0) {
          throw new Error(`Errores al procesar productos: ${JSON.stringify(productosConError)}`);
        }
      }

      // Confirmar transacción
      await transaction.commit();

      // Si hay productos que no existen, buscar información sobre ellos
      if (noExistencia.length > 0) {
        const idsRecetas = noExistencia.map(item => item.id_receta);
        const datosUsuariSolicita = await SolicitudProductos.findAll({
          where: {
            id_receta: idsRecetas // Obtener todos los id_receta
          },
          include: [{
            model: Productos,
            // producto
            attributes: ['nombre'] // Campos que quieres obtener del usuario
          }],
          attributes: ['id_producto', 'unidad_medida', 'cantidad']
        });

        // Verificar si se encontraron resultados
        if (datosUsuariSolicita.length === 0) {
          return {
            message: 'No se encontraron productos para los criterios especificados',
            data: []
          };
        }

        // Transformar los resultados
        const resultadosFormateados = datosUsuariSolicita.map(item => {
          const m = item.toJSON();
          return {
            id_producto: m.id_producto,
            nombre_producto: m.producto && m.producto.nombre ? m.producto.nombre : 'Producto no encontrado',
            unidad_medida: m.unidad_medida,
            cantidad: m.cantidad
          };
        });
        estados.estados.push(...resultadosFormateados); // Agregar todos los resultados formateados a estados.estados
      }
      // Retornar mensaje de éxito
      const UsuariSolicita = await Solicitud.findAll({
        where: {
          id: data.id_solicitud // Obtener todos los id_receta
        },
        include: [{
          model: Usuario,
          // producto
          attributes: ['nombre', 'email'] // Campos que quieres obtener del usuario
        }],
        attributes: ['folio']
      });
      const resultadosFormateado = UsuariSolicita.map(item => {
        const m = item.toJSON();
        return {
          nombre: m.usuario && m.usuario.nombre ? m.usuario.nombre : 'No se encontro Nombre',
          email: m.usuario && m.usuario.email ? m.usuario.email : 'No se encontro Correo'
        };
      });
      return {
        data: resultadosFormateado,
        productos: estados.estados,
        message: 'Solicitud de mezcla registrada correctamente'
      };
    } catch (error) {
      // Revertir transacción en caso de error
      if (transaction) await transaction.rollback();

      // Loguear error detallado
      console.error('Error al registrar solicitud:', error);

      // Retornar mensaje de error más descriptivo
      return {
        error: 'Error al registrar solicitud',
        detalle: error.message
      };
    }
  }
  static async EliminarPorducto({
    id
  }) {
    try {
      // Comprobar que el producto exista
      const producto = await SolicitudProductos.findByPk(id); // Usar findByPk correctamente
      if (!producto) return {
        error: 'Producto no encontrado'
      };

      // Eliminar el producto
      await producto.destroy();
      return {
        message: `Producto eliminado correctamente con id ${id}`
      };
    } catch (e) {
      console.error('Error al eliminar el producto:', e.message); // Registrar el error
      return {
        error: 'Error al eliminar el producto'
      };
    }
  }
} // fin modelo
;// CONCATENATED MODULE: external "exceljs"
var external_exceljs_x = (y) => {
	var x = {}; __webpack_require__.d(x, y); return x
} 
var external_exceljs_y = (x) => (() => (x))
const external_exceljs_namespaceObject = external_exceljs_x({ ["default"]: () => (__WEBPACK_EXTERNAL_MODULE_exceljs__["default"]) });
;// CONCATENATED MODULE: ./src/config/excel.js




async function obtenerProductosPorSolicitud(idSolicitud) {
  try {
    // Asumiendo que este método existe en tu modelo
    const productos = await SolicitudRecetaModel.obtenerProductosSolicitud({
      idSolicitud
    });
    // Verificar si se obtuvieron productos
    if (productos && productos.length > 0) {
      return productos.map(producto => ({
        nombre: producto.nombre_producto,
        // Asegúrate de que este campo existe en tu modelo
        unidad_medida: producto.unidad_medida,
        cantidad: producto.cantidad
      }));
    } else {
      // Si no hay productos, puedes devolver un array vacío o productos por defecto
      return [];
    }
  } catch (error) {
    console.error(`Error al consultar productos para la solicitud ${idSolicitud}:`, error);
    // Puedes lanzar el error o devolver un array vacío o productos por defecto
    return []; // O puedes lanzar el error si prefieres manejarlo en otro lugar
  }
}
async function obtenerVariedades(centroCoste) {
  try {
    // Asumiendo que este método existe en tu modelo
    const variedades = await CentroCosteModel.getVariedadPorCentroCosteNombre({
      centroCoste
    });
    // Verificar si se obtuvieron variedades
    if (variedades && variedades.length > 0) {
      return variedades.map(variedad => ({
        variedad: variedad.variedad,
        // Asegúrate de que este campo existe en tu modelo
        porcentajes: variedad.porcentajes
      }));
    } else {
      // Si no hay productos, puedes devolver un array vacío o productos por defecto
      return [];
    }
  } catch (error) {
    console.error('Error al consultar productos para la solicitud', error);
    // Puedes lanzar el error o devolver un array vacío o productos por defecto
    return []; // O puedes lanzar el error si prefieres manejarlo en otro lugar
  }
}
async function obtenerDatosSolicitud(idSolicitud) {
  try {
    // Asumiendo que este método existe en tu modelo
    const solicitudes = await MezclaModel.obtenerDatosSolicitud({
      id: idSolicitud
    });
    // Verificar si se obtuvieron solicitudes
    if (solicitudes && solicitudes.length > 0) {
      return solicitudes.map(solicitud => ({
        cantidad: solicitud.cantidad,
        // Asegúrate de que este campo existe en tu modelo
        presentacion: solicitud.presentacion,
        metodoAplicacion: solicitud.metodoAplicacion
      }));
    } else {
      // Si no hay productos, puedes devolver un array vacío o productos por defecto
      return [];
    }
  } catch (error) {
    console.error('Error al consultar productos para la solicitud', error);
    // Puedes lanzar el error o devolver un array vacío o productos por defecto
    return []; // O puedes lanzar el error si prefieres manejarlo en otro lugar
  }
}
const crearExcel = async parametros => {
  try {
    // preparacion de estilos
    const font = {
      name: 'Arial',
      size: 12,
      bold: true,
      italic: false
    };

    // Extraer los datos correctamente
    const datos = Array.isArray(parametros) ? parametros : parametros.datos || [];
    console.log('Datos a procesar:', datos);
    // Verificar si hay datos
    if (!datos || datos.length === 0) {
      throw new Error('No hay datos para generar el Excel');
    }

    // Crear un nuevo libro de Excel
    const workbook = new external_exceljs_namespaceObject["default"].Workbook();

    // Crear hoja principal con los datos de DataTable
    const hojaGeneral = workbook.addWorksheet('Datos Generales');
    hojaGeneral.columns = []; // Espacio vacío
    hojaGeneral.addRow([]); // Espacio vacío entre las tablas

    hojaGeneral.columns = [{
      header: 'ID Solicitud',
      key: 'id_solicitud',
      width: 15
    }, {
      header: 'Solicita',
      key: 'usuario',
      width: 15
    }, {
      header: 'Fecha Solicitud',
      key: 'fechaSolicitud',
      width: 15
    }, {
      header: 'Fecha Cierre',
      key: 'fechaCierre',
      width: 15
    }, {
      header: 'Empresa',
      key: 'empresa',
      width: 20
    }, {
      header: 'Rancho',
      key: 'rancho',
      width: 20
    }, {
      header: 'Temporada',
      key: 'temporada',
      width: 20
    }, {
      header: 'Folio de Receta',
      key: 'folio',
      width: 20
    }, {
      header: 'Centro de Coste',
      key: 'centroCoste',
      width: 20
    }, {
      header: 'Variedad Fruta',
      key: 'variedad',
      width: 20
    }];

    // Agregar datos filtrados a la hoja principal
    datos.forEach(dato => {
      hojaGeneral.addRow({
        id_solicitud: dato.id_solicitud,
        usuario: dato.usuario,
        fechaSolicitud: dato.fechaSolicitud,
        fechaCierre: dato.fechaEntrega,
        empresa: dato.empresa,
        rancho: dato.rancho,
        temporada: dato.temporada,
        folio: dato.folio,
        centroCoste: dato.centroCoste || dato.centro_coste,
        variedad: dato.variedad
      });
    });

    // Procesar cada solicitud para crear hojas personalizadas
    for (const solicitud of datos) {
      const idSolicitud = solicitud.id_solicitud || solicitud.idSolicitud;
      const usuario = solicitud.usuario;
      const fechaSolicitud = solicitud.fechaSolicitud;
      const empresa = solicitud.empresa;
      const rancho = solicitud.rancho;
      const temporada = solicitud.temporada;
      const folio = solicitud.folio;
      const centroCoste = solicitud.centroCoste || solicitud.centro_coste;
      const variedad = solicitud.variedad;
      try {
        // Consultar productos relacionados en la base de datos
        const productos = await obtenerProductosPorSolicitud(idSolicitud);
        // console.log(productos)
        // Crear una hoja para esta solicitud
        const hojaSolicitud = workbook.addWorksheet(`Solicitud ${idSolicitud}`);
        hojaSolicitud.addRow([`Datos de la solicitud ${idSolicitud}`]); // Encabezados de la segunda tabla
        hojaSolicitud.getCell('A1').font = font;

        // Agregar información de la solicitud en la primera tabla
        hojaSolicitud.addRow(['ID Solicitud', idSolicitud]);
        hojaSolicitud.addRow(['Solicita', usuario]);
        hojaSolicitud.addRow(['Fecha Solicitud', fechaSolicitud]);
        hojaSolicitud.addRow(['Empresa', empresa]);
        hojaSolicitud.addRow(['Rancho', rancho]);
        hojaSolicitud.addRow(['Temporada', temporada]);
        hojaSolicitud.addRow(['Folio de Receta', folio]);
        hojaSolicitud.addRow(['Centro de Coste', centroCoste]);
        hojaSolicitud.addRow(['Variedad Fruta', variedad]);
        hojaSolicitud.addRow([]); // Espacio vacío

        // Agregar encabezados para los productos en la segunda tabla
        hojaSolicitud.addRow(['Datos de los productos solicitados']); // Encabezados de la segunda tabla
        hojaSolicitud.getCell('A12').font = font;
        hojaSolicitud.addRow(['Producto', 'Unidad Medida', 'Cantidad Solicitada']); // Encabezados de la segunda tabla

        // Agregar productos a la hoja
        if (productos && productos.length > 0) {
          for (let i = 0; i < productos.length; i++) {
            hojaSolicitud.addRow([productos[i].nombre, productos[i].unidad_medida, productos[i].cantidad]);
          }
        } else {
          console.error('No se encontraron productos o la estructura es incorrecta');
        }

        // Ajustar el ancho de las columnas
        hojaSolicitud.columns.forEach(column => {
          const maxLength = column.values.reduce((max, value) => {
            return Math.max(max, value ? value.toString().length : 0);
          }, 0);
          column.width = maxLength + 2; // Añadir un poco de espacio extra
        });
      } catch (error) {
        console.error(`Error al procesar solicitud ${idSolicitud}:`, error);
        const hojaError = workbook.addWorksheet(`Error ${idSolicitud}`);
        hojaError.addRow(['Error al obtener productos para esta solicitud.']);
      }
    }

    // Retornar el buffer del archivo Excel
    return await workbook.xlsx.writeBuffer();
  } catch (error) {
    console.error('Error general al generar Excel:', error);
    throw error;
  }
};
const crearSolicitudV2 = async parametros => {
  try {
    console.log('Datos a procesar:', parametros);
    // Verificar si hay datos
    if (!parametros || parametros.length === 0) {
      throw new Error('No hay datos para generar el Excel');
    }

    // Crear un nuevo libro de Excel
    const workbook = new ExcelJS.Workbook();

    // Estilo de encabezados

    const idSolicitud = parametros.id_solicitud;
    const folio = parametros.folio;
    const usuario = parametros.solicita;
    const fechaSolicitud = parametros.fecha_solicitud;
    const rancho = parametros.rancho_destino;
    const centroCoste = parametros.centro_coste;
    const variedad = parametros.variedad;
    const empresa = parametros.empresa;
    const temporada = parametros.temporada;
    const cantidad = parametros.cantidad;
    const presentacion = parametros.presentacion;
    const metodoAplicacion = parametros.metodo_aplicacion;
    const descripcion = parametros.descripcion;
    try {
      // Consultar productos relacionados en la base de datos
      const productos = await obtenerProductosPorSolicitud(idSolicitud);
      const font = {
        name: 'Arial',
        size: 12,
        bold: true,
        italic: false
      };
      // Crear una hoja para esta solicitud
      const hojaGeneral = workbook.addWorksheet(`Solicitud ${idSolicitud}`);
      hojaGeneral.addRow([`Datos de la solicitud ${idSolicitud}`]); // Encabezados de la segunda tabla
      hojaGeneral.getCell('A1').font = font;

      // Agregar información de la solicitud en la primera tabla
      hojaGeneral.addRow(['ID Solicitud', idSolicitud]);
      hojaGeneral.addRow(['Folio de Receta', folio]);
      hojaGeneral.addRow(['Solicita', usuario]);
      hojaGeneral.addRow(['Fecha Solicitud', fechaSolicitud]);
      hojaGeneral.addRow(['Rancho', rancho]);
      hojaGeneral.addRow(['Centro de Coste', centroCoste]);
      hojaGeneral.addRow(['Variedad Fruta', variedad]);
      hojaGeneral.addRow(['Empresa', empresa]);
      hojaGeneral.addRow(['Temporada', temporada]);
      hojaGeneral.addRow(['Cantidad de Mezcla', cantidad]);
      hojaGeneral.addRow(['Presentacion de la Mezcla', presentacion]);
      hojaGeneral.addRow(['Metodo de aplicacion', metodoAplicacion]);
      hojaGeneral.addRow(['Descripcion', descripcion]);
      hojaGeneral.addRow([]); // Espacio vacío

      // Agregar encabezados para los productos en la segunda tabla
      hojaGeneral.addRow(['Datos de los productos solicitados']); // Encabezados de la segunda tabla
      hojaGeneral.getCell('A16').font = font;
      hojaGeneral.addRow(['Producto', 'Unidad Medida', 'Cantidad Solicitada']); // Encabezados de la segunda tabla

      // Agregar productos a la hoja
      if (productos && productos.length > 0) {
        for (let i = 0; i < productos.length; i++) {
          hojaGeneral.addRow([productos[i].nombre, productos[i].unidad_medida, productos[i].cantidad]);
        }
      } else {
        console.error('No se encontraron productos o la estructura es incorrecta');
      }

      // Ajustar el ancho de las columnas
      hojaGeneral.columns.forEach(column => {
        const maxLength = column.values.reduce((max, value) => {
          return Math.max(max, value ? value.toString().length : 0);
        }, 0);
        column.width = maxLength + 2; // Añadir un poco de espacio extra
      });
    } catch (error) {
      console.error(`Error al procesar solicitud ${idSolicitud}:`, error);
      const hojaError = workbook.addWorksheet(`Error ${idSolicitud}`);
      hojaError.addRow(['Error al obtener productos para esta solicitud.']);
    }

    // Retornar el buffer del archivo Excel
    return await workbook.xlsx.writeBuffer();
  } catch (error) {
    console.error('Error general al generar Excel:', error);
    throw error;
  }
};
// Crear Reporte Solicitud
const reporteSolicitud = async parametros => {
  // Definir estilos
  const headerStyle = {
    font: {
      bold: true,
      color: {
        argb: 'FFFFFFFF'
      }
    },
    fill: {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {
        argb: 'FF4F81BD'
      }
    },
    border: {
      top: {
        style: 'thin'
      },
      left: {
        style: 'thin'
      },
      bottom: {
        style: 'thin'
      },
      right: {
        style: 'thin'
      }
    },
    alignment: {
      vertical: 'middle',
      horizontal: 'center'
    }
  };
  const cellStyle = {
    font: {
      color: {
        argb: 'FF000000'
      }
    },
    border: {
      top: {
        style: 'thin'
      },
      left: {
        style: 'thin'
      },
      bottom: {
        style: 'thin'
      },
      right: {
        style: 'thin'
      }
    },
    alignment: {
      vertical: 'middle',
      horizontal: 'left'
    }
  };
  // varialbles globales
  let variedades;
  try {
    // Extraer los datos correctamente
    const datos = Array.isArray(parametros) ? parametros : parametros.datos || [];
    console.log('Datos a procesar:', datos);

    // Crear un nuevo libro de Excel
    const workbook = new external_exceljs_namespaceObject["default"].Workbook();

    // Cabecera de la tabla
    let cabecera = ['Productos', 'Unidad', 'Cantidad Solicitada'];
    let porcentaje = ['', '', ''];
    try {
      // Crear una hoja para esta solicitud
      const hojaGeneral = workbook.addWorksheet('Datos Generales');
      // obtenemos datos de la variedad
      for (const dato of datos) {
        if (dato.variedad === 'todo') {
          // Obtener variedades
          variedades = await obtenerVariedades(dato.centroCoste);
          console.log('Variedades obtenidas:', variedades);

          // Agregar nombres de variedades a la cabecera
          if (variedades && variedades.length > 0) {
            for (const variedad of variedades) {
              const variedadSplit = variedad.variedad.split(',');
              const porcentajeSplit = variedad.porcentajes.split(',');
              for (const item of variedadSplit) {
                if (!cabecera.includes(item)) {
                  cabecera.push(item);
                }
              }
              for (const item of porcentajeSplit) {
                if (!porcentaje.includes(item)) {
                  porcentaje.push(item);
                }
              }
            }
          }
        } else {
          cabecera.push(dato.variedad);
        }
        if (dato.variedad === 'todo') {
          hojaGeneral.addRow(['Datos Generales Fertilizantes']).eachCell(cell => {
            cell.style = headerStyle;
          }); // Encabezado de la hoja

          hojaGeneral.addRow(['ID Solicitud', dato.id_solicitud]).eachCell(cell => {
            cell.style = cellStyle;
          });
          hojaGeneral.addRow(['Solicita', dato.usuario]).eachCell(cell => {
            cell.style = cellStyle;
          });
          hojaGeneral.addRow(['Fecha Solicitud', dato.fechaSolicitud]).eachCell(cell => {
            cell.style = cellStyle;
          });
          hojaGeneral.addRow(['Fecha Entrega', dato.fechaEntrega]).eachCell(cell => {
            cell.style = cellStyle;
          });
          hojaGeneral.addRow(['Rancho', dato.rancho]).eachCell(cell => {
            cell.style = cellStyle;
          });
          hojaGeneral.addRow(['Centro de Coste', dato.centroCoste || dato.centro_coste]).eachCell(cell => {
            cell.style = cellStyle;
          });
          hojaGeneral.addRow(['Variedad Fruta', dato.variedad !== 'todo' ? dato.variedad : variedades[0].variedad]).eachCell(cell => {
            cell.style = cellStyle;
          });
          hojaGeneral.addRow(['Empresa', dato.empresa]).eachCell(cell => {
            cell.style = cellStyle;
          });
          hojaGeneral.addRow(['Temporada', dato.temporada]).eachCell(cell => {
            cell.style = cellStyle;
          });
          hojaGeneral.addRow(['Descripcion', dato.descripcion]).eachCell(cell => {
            cell.style = cellStyle;
          });
        } else {
          hojaGeneral.addRow(['Datos Generales Mezclas']).eachCell(cell => {
            cell.style = headerStyle;
          }); // Encabezado de la hoja

          // obtenemos datos faltantes de la solicitud
          const datosF = await obtenerDatosSolicitud(dato.id_solicitud);
          console.log('Datos de la solicitud:', datosF);
          hojaGeneral.addRow(['ID Solicitud', dato.id_solicitud]).eachCell(cell => {
            cell.style = cellStyle;
          });
          hojaGeneral.addRow(['Folio de Receta', dato.folio]).eachCell(cell => {
            cell.style = cellStyle;
          });
          hojaGeneral.addRow(['Solicita', dato.usuario]).eachCell(cell => {
            cell.style = cellStyle;
          });
          hojaGeneral.addRow(['Fecha Solicitud', dato.fechaSolicitud]).eachCell(cell => {
            cell.style = cellStyle;
          });
          hojaGeneral.addRow(['Fecha Entrega', dato.fechaEntrega]).eachCell(cell => {
            cell.style = cellStyle;
          });
          hojaGeneral.addRow(['Rancho', dato.rancho]).eachCell(cell => {
            cell.style = cellStyle;
          });
          hojaGeneral.addRow(['Centro de Coste', dato.centroCoste || dato.centro_coste]).eachCell(cell => {
            cell.style = cellStyle;
          });
          hojaGeneral.addRow(['Variedad Fruta', dato.variedad !== 'todo' ? dato.variedad : variedades[0].variedad]).eachCell(cell => {
            cell.style = cellStyle;
          });
          hojaGeneral.addRow(['Empresa', dato.empresa]).eachCell(cell => {
            cell.style = cellStyle;
          });
          hojaGeneral.addRow(['Temporada', dato.temporada]).eachCell(cell => {
            cell.style = cellStyle;
          });
          hojaGeneral.addRow(['Cantidad de Mezcla', datosF[0].cantidad]).eachCell(cell => {
            cell.style = cellStyle;
          });
          hojaGeneral.addRow(['Presentacion de la Mezcla', datosF[0].presentacion]).eachCell(cell => {
            cell.style = cellStyle;
          });
          hojaGeneral.addRow(['Metodo de aplicacion', datosF[0].metodoAplicacion]).eachCell(cell => {
            cell.style = cellStyle;
          });
          hojaGeneral.addRow(['Descripcion', dato.descripcion]).eachCell(cell => {
            cell.style = cellStyle;
          });
        }
        // Agregar información de la solicitud
        hojaGeneral.addRow([]); // Espacio vacío con estilo

        // Agregar la cabecera a la hoja
        hojaGeneral.addRow(porcentaje);
        hojaGeneral.addRow(cabecera).eachCell(cell => {
          cell.style = headerStyle;
        });
        // limpiamos cabeceras
        cabecera = ['Productos', 'Unidad', 'Cantidad Solicitada'];
        porcentaje = ['', '', ''];

        // Obtener productos de la base de datos
        const productos = await obtenerProductosPorSolicitud(dato.id_solicitud);
        console.log('Productos obtenidos:', productos);

        // Crear el arreglo de datos
        const data = [];
        if (productos && productos.length > 0) {
          for (const producto of productos) {
            const fila = [producto.nombre, producto.unidad_medida, producto.cantidad];

            // Calcular porcentajes de variedades
            if (dato.variedad === 'todo') {
              if (variedades && variedades.length > 0) {
                for (const variedad of variedades) {
                  const variedadSplit = variedad.porcentajes.split(',');
                  for (const item of variedadSplit) {
                    const porcentajeVariedad = producto.cantidad * item / 100;
                    fila.push(porcentajeVariedad);
                  }
                }
              }
            } else {
              fila.push(producto.cantidad);
            }
            data.push(fila);
          }
        } else {
          console.error('No se encontraron productos o la estructura es incorrecta');
        }

        // Agregar los datos a la hoja
        data.forEach(row => {
          hojaGeneral.addRow(row).eachCell(cell => {
            cell.style = cellStyle;
          });
        });

        // Agregar un separador entre solicitudes
        hojaGeneral.addRow([]);
        hojaGeneral.addRow([]);
        hojaGeneral.addRow(['', '', '', '', '', '', '', '', '', '']).eachCell(cell => {
          cell.border = {
            top: {
              style: 'thick',
              color: {
                argb: '00000000'
              }
            },
            bottom: {
              style: 'thick',
              color: {
                argb: '00000000'
              }
            }
          };
        });
        hojaGeneral.addRow([]);
        hojaGeneral.addRow([]);
        // Agregar un separador entre solicitudes
      }

      // Ajustar el ancho de las columnas
      hojaGeneral.columns.forEach(column => {
        const maxLength = column.values.reduce((max, value) => {
          return Math.max(max, value ? value.toString().length : 0);
        }, 0);
        column.width = maxLength + 2; // Añadir un poco de espacio extra
      });
    } catch (error) {
      console.error('Error al procesar solicitud:', error);
      const hojaError = workbook.addWorksheet('Error');
      hojaError.addRow(['Error al obtener productos para esta solicitud.']);
    }

    // Retornar el buffer del archivo Excel
    return await workbook.xlsx.writeBuffer();
  } catch (error) {
    console.error('Error general al generar Excel:', error);
    throw error;
  }
};
const reporteSolicitudV2 = async parametros => {
  // Definir estilos
  const headerStyle = {
    font: {
      bold: true,
      color: {
        argb: 'FFFFFFFF'
      }
    },
    fill: {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {
        argb: 'FF4F81BD'
      }
    },
    border: {
      top: {
        style: 'thin'
      },
      left: {
        style: 'thin'
      },
      bottom: {
        style: 'thin'
      },
      right: {
        style: 'thin'
      }
    },
    alignment: {
      vertical: 'middle',
      horizontal: 'center'
    }
  };
  const cellStyle = {
    font: {
      color: {
        argb: 'FF000000'
      }
    },
    border: {
      top: {
        style: 'thin'
      },
      left: {
        style: 'thin'
      },
      bottom: {
        style: 'thin'
      },
      right: {
        style: 'thin'
      }
    },
    alignment: {
      vertical: 'middle',
      horizontal: 'left'
    }
  };
  // varialbles globales
  let variedades;
  const data = [];
  const data2 = [];
  try {
    // Extraer los datos correctamente
    const datos = Array.isArray(parametros) ? parametros : parametros.datos || [];
    console.log('Datos a procesar:', datos);

    // Crear un nuevo libro de Excel
    const workbook = new external_exceljs_namespaceObject["default"].Workbook();

    // Cabecera de la tabla
    const cabecera = ['Id Solicitud', 'Folio de Receta', 'Solicita', 'Fecha Solicitud', 'Fecha Entrega', 'Rancho', 'Centro de Coste', 'Variedad Fruta', 'Empresa', 'Temporada', 'Cantidad de Mezcla', 'Presentacion de la Mezcla', 'Metodo de aplicacion', 'Productos', 'Unidad', 'Cantidad Solicitada'];
    const cabecera2 = ['Id Solicitud', 'Solicita', 'Fecha Solicitud', 'Fecha Entrega', 'Rancho', 'Centro de Coste', 'Variedad Fruta', 'Empresa', 'Temporada', 'Metodo de aplicacion', 'Productos', 'Unidad', 'Cantidad Solicitada', 'Porcentaje Correspondiente', 'Cantidad Correspondiente'];
    try {
      // Crear una hoja para esta solicitud
      const hojaGeneral = workbook.addWorksheet('Datos de Mezclas');
      hojaGeneral.addRow(cabecera).eachCell(cell => {
        cell.style = headerStyle;
      });

      // obtenemos datos de la variedad
      for (const dato of datos) {
        variedades = await obtenerVariedades(dato.centroCoste);
        console.log('Variedades obtenidas:', variedades);
        // obtenemos datos faltantes de la solicitud
        const datosF = await obtenerDatosSolicitud(dato.id_solicitud);
        console.log('Datos de la solicitud:', datosF);

        // Obtener productos de la base de datos
        const productos = await obtenerProductosPorSolicitud(dato.id_solicitud);
        console.log('Productos obtenidos:', productos);

        // Crear el arreglo de datos

        if (dato.variedad === 'todo') {
          if (variedades && variedades.length > 0) {
            for (const variedad of variedades) {
              const porcentajeSplit = variedad.porcentajes.split(',');
              const variedadSplit = variedad.variedad.split(',');
              for (let i = 0; i < variedadSplit.length; i++) {
                if (productos && productos.length > 0) {
                  for (const producto of productos) {
                    const fila = [dato.id_solicitud, dato.usuario, dato.fechaSolicitud, dato.fechaEntrega, dato.rancho, dato.centroCoste, dato.empresa, dato.temporada, datosF[0].metodoAplicacion, variedadSplit[i], producto.nombre, producto.unidad_medida, producto.cantidad, '%' + porcentajeSplit[i], producto.cantidad * porcentajeSplit[i] / 100];
                    data2.push(fila);
                  }
                } else {
                  console.error('No se encontraron productos o la estructura es incorrecta');
                }
              }
            }
          } else {
            console.error('No se encontraron productos o la estructura es incorrecta');
          }
        } else {
          if (productos && productos.length > 0) {
            for (const producto of productos) {
              const fila = [dato.id_solicitud, dato.folio, dato.usuario, dato.fechaSolicitud, dato.fechaEntrega, dato.rancho, dato.centroCoste, dato.variedad, dato.empresa, dato.temporada, datosF[0].cantidad, datosF[0].presentacion, datosF[0].metodoAplicacion, producto.nombre, producto.unidad_medida, producto.cantidad];
              data.push(fila);
            }
          } else {
            console.error('No se encontraron productos o la estructura es incorrecta');
          }
        }
      }
      // Agregar los datos a la hoja
      data.forEach(row => {
        hojaGeneral.addRow(row).eachCell(cell => {
          cell.style = cellStyle;
        });
      });
      // creamos la sugunda hoja
      const hojaSolicitud = workbook.addWorksheet('Datos de Fertilizantes');
      hojaSolicitud.addRow(cabecera2).eachCell(cell => {
        cell.style = headerStyle;
      });
      data2.forEach(row => {
        hojaSolicitud.addRow(row).eachCell(cell => {
          cell.style = cellStyle;
        });
      });
      // Ajustar el ancho de las columnas
      hojaGeneral.columns.forEach(column => {
        const maxLength = column.values.reduce((max, value) => {
          return Math.max(max, value ? value.toString().length : 0);
        }, 0);
        column.width = maxLength + 2; // Añadir un poco de espacio extra
      });
      hojaSolicitud.columns.forEach(column => {
        const maxLength = column.values.reduce((max, value) => {
          return Math.max(max, value ? value.toString().length : 0);
        }, 0);
        column.width = maxLength + 2; // Añadir un poco de espacio extra
      });
    } catch (error) {
      console.error('Error al procesar solicitud:', error);
      const hojaError = workbook.addWorksheet('Error');
      hojaError.addRow(['Error al obtener productos para esta solicitud.']);
    }

    // Retornar el buffer del archivo Excel
    return await workbook.xlsx.writeBuffer();
  } catch (error) {
    console.error('Error general al generar Excel:', error);
    throw error;
  }
};
const crearSolicitud = async parametros => {
  console.log(parametros);
  // Definir estilos
  const headerStyle = {
    font: {
      bold: true,
      color: {
        argb: 'FFFFFFFF'
      }
    },
    fill: {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {
        argb: 'FF4F81BD'
      }
    },
    border: {
      top: {
        style: 'thin'
      },
      left: {
        style: 'thin'
      },
      bottom: {
        style: 'thin'
      },
      right: {
        style: 'thin'
      }
    },
    alignment: {
      vertical: 'middle',
      horizontal: 'center'
    }
  };
  const cellStyle = {
    font: {
      color: {
        argb: 'FF000000'
      }
    },
    border: {
      top: {
        style: 'thin'
      },
      left: {
        style: 'thin'
      },
      bottom: {
        style: 'thin'
      },
      right: {
        style: 'thin'
      }
    },
    alignment: {
      vertical: 'middle',
      horizontal: 'left'
    }
  };
  // varialbles globales
  let variedades;
  try {
    console.log('Datos a procesar:', parametros);

    // Crear un nuevo libro de Excel
    const workbook = new external_exceljs_namespaceObject["default"].Workbook();

    // Cabecera de la tabla
    let cabecera = ['Productos', 'Unidad', 'Cantidad Solicitada'];
    let porcentaje = ['', '', ''];

    // preparamos datos
    const idSolicitud = parametros.id_solicitud;
    const folio = parametros.folio;
    const usuario = parametros.solicita;
    const fechaSolicitud = parametros.fecha_solicitud;
    const rancho = parametros.rancho_destino;
    const centroCoste = parametros.centro_coste;
    const variedad = parametros.variedad;
    const empresa = parametros.empresa;
    const temporada = parametros.temporada;
    const cantidad = parametros.cantidad;
    const presentacion = parametros.presentacion;
    const metodoAplicacion = parametros.metodo_aplicacion;
    const descripcion = parametros.descripcion;
    try {
      // Crear una hoja para esta solicitud
      const hojaGeneral = workbook.addWorksheet('Datos Generales');
      // obtenemos datos de la variedad
      if (variedad === 'todo') {
        // Obtener variedades
        variedades = await obtenerVariedades(centroCoste);
        // Agregar nombres de variedades a la cabecera
        if (variedades && variedades.length > 0) {
          for (const variedad of variedades) {
            const variedadSplit = variedad.variedad.split(',');
            const porcentajeSplit = variedad.porcentajes.split(',');
            for (const item of variedadSplit) {
              if (!cabecera.includes(item)) {
                cabecera.push(item);
              }
            }
            for (const item of porcentajeSplit) {
              if (!porcentaje.includes(item)) {
                porcentaje.push(item);
              }
            }
          }
        }
      } else {
        cabecera.push(variedad);
      }
      if (variedad === 'todo') {
        hojaGeneral.addRow(['Datos Generales Fertilizantes']).eachCell(cell => {
          cell.style = headerStyle;
        }); // Encabezado de la hoja

        hojaGeneral.addRow(['ID Solicitud', idSolicitud]).eachCell(cell => {
          cell.style = cellStyle;
        });
        hojaGeneral.addRow(['Solicita', usuario]).eachCell(cell => {
          cell.style = cellStyle;
        });
        hojaGeneral.addRow(['Fecha Solicitud', fechaSolicitud]).eachCell(cell => {
          cell.style = cellStyle;
        });
        hojaGeneral.addRow(['Rancho', rancho]).eachCell(cell => {
          cell.style = cellStyle;
        });
        hojaGeneral.addRow(['Centro de Coste', centroCoste]).eachCell(cell => {
          cell.style = cellStyle;
        });
        hojaGeneral.addRow(['Variedad Fruta', variedad !== 'todo' ? variedad : variedades[0].variedad]).eachCell(cell => {
          cell.style = cellStyle;
        });
        hojaGeneral.addRow(['Empresa', empresa]).eachCell(cell => {
          cell.style = cellStyle;
        });
        hojaGeneral.addRow(['Temporada', temporada]).eachCell(cell => {
          cell.style = cellStyle;
        });
        hojaGeneral.addRow(['Descripcion', descripcion]).eachCell(cell => {
          cell.style = cellStyle;
        });
      } else {
        hojaGeneral.addRow(['Datos Generales Mezclas']).eachCell(cell => {
          cell.style = headerStyle;
        }); // Encabezado de la hoja

        // obtenemos datos faltantes de la solicitud
        const datosF = await obtenerDatosSolicitud(idSolicitud);
        console.log('Datos de la solicitud:', datosF);
        hojaGeneral.addRow(['ID Solicitud', idSolicitud]).eachCell(cell => {
          cell.style = cellStyle;
        });
        hojaGeneral.addRow(['Folio de Receta', folio]).eachCell(cell => {
          cell.style = cellStyle;
        });
        hojaGeneral.addRow(['Solicita', usuario]).eachCell(cell => {
          cell.style = cellStyle;
        });
        hojaGeneral.addRow(['Fecha Solicitud', fechaSolicitud]).eachCell(cell => {
          cell.style = cellStyle;
        });
        hojaGeneral.addRow(['Rancho', rancho]).eachCell(cell => {
          cell.style = cellStyle;
        });
        hojaGeneral.addRow(['Centro de Coste', centroCoste]).eachCell(cell => {
          cell.style = cellStyle;
        });
        hojaGeneral.addRow(['Variedad Fruta', variedad !== 'todo' ? variedad : variedades[0].variedad]).eachCell(cell => {
          cell.style = cellStyle;
        });
        hojaGeneral.addRow(['Empresa', empresa]).eachCell(cell => {
          cell.style = cellStyle;
        });
        hojaGeneral.addRow(['Temporada', temporada]).eachCell(cell => {
          cell.style = cellStyle;
        });
        hojaGeneral.addRow(['Cantidad de Mezcla', cantidad]).eachCell(cell => {
          cell.style = cellStyle;
        });
        hojaGeneral.addRow(['Presentacion de la Mezcla', presentacion]).eachCell(cell => {
          cell.style = cellStyle;
        });
        hojaGeneral.addRow(['Metodo de aplicacion', metodoAplicacion]).eachCell(cell => {
          cell.style = cellStyle;
        });
        hojaGeneral.addRow(['Descripcion', descripcion]).eachCell(cell => {
          cell.style = cellStyle;
        });
      }
      // Agregar información de la solicitud
      hojaGeneral.addRow([]); // Espacio vacío con estilo

      // Agregar la cabecera a la hoja
      hojaGeneral.addRow(porcentaje);
      hojaGeneral.addRow(cabecera).eachCell(cell => {
        cell.style = headerStyle;
      });
      // limpiamos cabeceras
      cabecera = ['Productos', 'Unidad', 'Cantidad Solicitada'];
      porcentaje = ['', '', ''];

      // Obtener productos de la base de datos
      const productos = await obtenerProductosPorSolicitud(idSolicitud);
      console.log('Productos obtenidos:', productos);

      // Crear el arreglo de datos
      const data = [];
      if (productos && productos.length > 0) {
        for (const producto of productos) {
          const fila = [producto.nombre, producto.unidad_medida, producto.cantidad];

          // Calcular porcentajes de variedades
          if (variedad === 'todo') {
            if (variedades && variedades.length > 0) {
              for (const variedad of variedades) {
                const variedadSplit = variedad.porcentajes.split(',');
                for (const item of variedadSplit) {
                  const porcentajeVariedad = producto.cantidad * item / 100;
                  fila.push(porcentajeVariedad);
                }
              }
            }
          } else {
            fila.push(producto.cantidad);
          }
          data.push(fila);
        }
      } else {
        console.error('No se encontraron productos o la estructura es incorrecta');
      }

      // Agregar los datos a la hoja
      data.forEach(row => {
        hojaGeneral.addRow(row).eachCell(cell => {
          cell.style = cellStyle;
        });
      });

      // Ajustar el ancho de las columnas
      hojaGeneral.columns.forEach(column => {
        const maxLength = column.values.reduce((max, value) => {
          return Math.max(max, value ? value.toString().length : 0);
        }, 0);
        column.width = maxLength + 2; // Añadir un poco de espacio extra
      });
    } catch (error) {
      console.error('Error al procesar solicitud:', error);
      const hojaError = workbook.addWorksheet('Error');
      hojaError.addRow(['Error al obtener productos para esta solicitud.']);
    }

    // Retornar el buffer del archivo Excel
    return await workbook.xlsx.writeBuffer();
  } catch (error) {
    console.error('Error general al generar Excel:', error);
    throw error;
  }
};
;// CONCATENATED MODULE: ./src/models/produccion.models.js


class ProduccionModel {
  static async ObtenerGastoUsuario({
    tipo
  }) {
    // comprobar que el objeto tipo tenga alguno de los siguientes datos Usuario,temporada, empresa entre otros antes de proceder a la consulta
    const permitidos = ['usuario', 'temporada', 'empresa', 'centroCoste', 'rancho', 'variedad'];
    const valido = permitidos.includes(tipo);
    try {
      if (valido) {
        const data = await db.query(`SELECT ${tipo} , SUM(precio_cantidad) AS precio_cantidad FROM vista_solicitudes GROUP BY ${tipo}`);
        // Verifica si hay duplicados
        const uniqueData = Array.from(new Map(data.map(item => [valido, item])).values());
        // Si llegamos aquí, la ejecución fue exitosa
        return uniqueData;
      }
    } catch (error) {
      // Manejo de errores
      console.error('Error al procesar producto:', error);
      return {
        status: 'error',
        message: error.message || 'Error desconocido'
      };
    }
  }
  static async solicitudReporte({
    empresa,
    rol
  }) {
    let data;
    try {
      if (rol === 'admin') {
        data = await db.query('SELECT * FROM total_precio_cantidad_solicitud');
      } else {
        data = await db.query(`SELECT * FROM total_precio_cantidad_solicitud WHERE empresa="${empresa}"`);
      }
      const uniqueData = Array.from(new Map(data.map(item => [item.id_solicitud, item])).values());
      // Si llegamos aquí, la ejecución fue exitosa
      return uniqueData;
    } catch (error) {
      // Manejo de errores
      console.error('Error al procesar producto:', error);
      return {
        status: 'error',
        message: error.message || 'Error desconocido'
      };
    }
  }
  static async descargarEcxel({
    datos
  }) {
    try {
      if (!datos || Array.isArray(datos)) {
        throw new Error('datos invalidos, se requiere un arreglo de datos filtrados.');
      }
      const excel = await crearExcel(datos);
      return excel;
    } catch (error) {
      // Manejo de errores
      console.error('Error al procesar producto:', error);
      return {
        status: 'error',
        message: error.message || 'Error desconocido'
      };
    }
  }
  static async descargarSolicitud({
    datos
  }) {
    try {
      if (!datos || Array.isArray(datos)) {
        throw new Error('datos invalidos, se requiere un arreglo de datos filtrados.');
      }
      const excel = await crearSolicitud(datos);
      return excel;
    } catch (error) {
      // Manejo de errores
      console.error('Error al procesar producto:', error);
      return {
        status: 'error',
        message: error.message || 'Error desconocido'
      };
    }
  }
  static async descargarReporte({
    datos
  }) {
    try {
      if (!datos || Array.isArray(datos)) {
        throw new Error('datos invalidos, se requiere un arreglo de datos filtrados.');
      }
      const excel = await reporteSolicitud(datos);
      return excel;
    } catch (error) {
      // Manejo de errores
      console.error('Error al procesar producto:', error);
      return {
        status: 'error',
        message: error.message || 'Error desconocido'
      };
    }
  }
  static async descargarReporteV2({
    datos
  }) {
    try {
      if (!datos || Array.isArray(datos)) {
        throw new Error('datos invalidos, se requiere un arreglo de datos filtrados.');
      }
      const excel = await reporteSolicitudV2(datos);
      return excel;
    } catch (error) {
      // Manejo de errores
      console.error('Error al procesar producto:', error);
      return {
        status: 'error',
        message: error.message || 'Error desconocido'
      };
    }
  }
  static async ObtenerGasto({
    data
  }) {
    try {
      // Llamar al procedimiento almacenado
      await db.query('CALL sp_calcular_precio_solicitud(:idSolicitud, :idProducto, :unidadMedida, :cantidad)', {
        replacements: {
          idSolicitud: data.idSolicitud,
          idProducto: data.producto,
          unidadMedida: data.unidadMedida,
          cantidad: data.cantidad
        },
        type: db.QueryTypes.RAW
      });

      // Si llegamos aquí, la ejecución fue exitosa
      return {
        status: 'success',
        message: 'Producto procesado exitosamente'
      };
    } catch (error) {
      // Manejo de errores
      console.error(`Error al procesar producto ${data.producto}:`, error);
      return {
        status: 'error',
        message: error.message || 'Error desconocido'
      };
    }
  }
  static async ObtenerReceta() {
    try {
      const data = await db.query('SELECT * FROM vista_recetas_costos');
      const uniqueData = Array.from(new Map(data.map(item => [item.id_receta, item])).values());
      // Si llegamos aquí, la ejecución fue exitosa
      return uniqueData;
    } catch (error) {
      // Manejo de errores
      console.error('Error al procesar producto', error);
      return {
        status: 'error',
        message: error.message || 'Error desconocido'
      };
    }
  }
} // fin modelo
;// CONCATENATED MODULE: ./src/models/modelAssociations.js
// models/modelAssociations.js






function setupAssociations() {
  // Asociaciones para Solicitud
  Solicitud.belongsTo(Usuario, {
    foreignKey: 'idUsuarioSolicita'
  });
  Solicitud.belongsTo(Centrocoste, {
    foreignKey: 'idCentroCoste'
  });

  // Asociaciones para productos Solicitud
  SolicitudProductos.belongsTo(Productos, {
    foreignKey: 'id_producto'
  });
  // Asociaciones para productos Solicitud
  SolicitudProductos.belongsTo(Recetas, {
    foreignKey: 'id_receta'
  });

  // Puedes agregar más asociaciones aquí si es necesario
  // Ejemplo:
  // Usuario.hasMany(Solicitud, { foreignKey: 'idUsuarioSolicita' })
  // Centrocoste.hasMany(Solicitud, { foreignKey: 'idCentroCoste' })

  console.log('Asociaciones de modelos configuradas');
}
;// CONCATENATED MODULE: ./src/server/server.mjs








// middlewares





// Rutas
 // protegidas







// Models







// Asociaciones


const startServer = async options => {
  const {
    PORT
  } = options;
  const app = (0,external_express_namespaceObject["default"])();
  const __filename = (0,external_url_namespaceObject.fileURLToPath)("file:///C:/Users/ZARAGOZA051/Desktop/LGZ2024/src/server/server.mjs");
  const __dirname = external_path_namespaceObject.dirname(__filename);

  // MOTOR DE PLANTILLAS EJS
  app.set('views', external_path_namespaceObject.resolve(__dirname, '..', 'views'));
  app.set('view engine', 'ejs');

  // LOGGER
  app.use((0,external_morgan_namespaceObject["default"])('dev'));
  app.use((0,external_cookie_parser_namespaceObject["default"])());
  app.use(validateJSON);
  app.use(corsMiddleware());
  app.disable('x-powered-by');
  app.use((0,external_express_fileupload_namespaceObject["default"])());
  app.use(external_body_parser_namespaceObject["default"].json({
    limit: '50mb'
  }));
  app.use(external_body_parser_namespaceObject["default"].urlencoded({
    limit: '50mb',
    extended: true
  }));

  // rutas API
  app.use('/api/usuario/', createUsuarioRouter({
    usuarioModel: UsuarioModel
  }));
  app.use('/api/', authenticate, createCentroCosteRouter({
    centroModel: CentroCosteModel
  }));
  app.use('/api/', authenticate, createMezclasRouter({
    mezclaModel: MezclaModel
  }));
  app.use('/api/', authenticate, createProductosRouter({
    productosModel: ProductosModel
  })); // Autentificacion general
  app.use('/api/', authenticate, createProductosSoliRouter({
    productossModel: SolicitudRecetaModel
  }));
  app.use('/api/', authenticate, createProduccionRouter({
    produccionModel: ProduccionModel
  }));

  // rutas Protegidas
  app.use('/protected/', authenticate, isGeneral, createProtetedRouter()); // Autentificacion general

  // PAGINA DE Inicio
  app.get('/', (req, res) => {
    res.render('main', {
      error: null,
      registerError: null
    });
  });

  // contenido estatico que ponemos disponible
  app.use(external_express_namespaceObject["default"]["static"]('public'));

  // Manejo de errores 404
  app.use(error404);
  try {
    // Configurar asociaciones antes de sincronizar
    setupAssociations();
    await db.sync();
    console.log('Base de datos sincronizada');
    app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
  } catch (error) {
    console.error('Error al sincronizar la base de datos:', error);
  }
};
;// CONCATENATED MODULE: ./src/app.mjs


(async () => {
  startServer({
    PORT: envs.PORT,
    SECRET_JWT_KEY: envs.SECRET_JWT_KEY
  });
})();
