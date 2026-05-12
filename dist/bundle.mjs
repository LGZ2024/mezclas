import { createRequire as __WEBPACK_EXTERNAL_createRequire } from "node:module";
import * as __WEBPACK_EXTERNAL_MODULE_compression__ from "compression";
import * as __WEBPACK_EXTERNAL_MODULE_exceljs__ from "exceljs";
import * as __WEBPACK_EXTERNAL_MODULE_body_parser_496b7721__ from "body-parser";
import * as __WEBPACK_EXTERNAL_MODULE_cors__ from "cors";
import * as __WEBPACK_EXTERNAL_MODULE_express__ from "express";
import * as __WEBPACK_EXTERNAL_MODULE_winston__ from "winston";
import * as __WEBPACK_EXTERNAL_MODULE_winston_daily_rotate_file_69928d76__ from "winston-daily-rotate-file";
import * as __WEBPACK_EXTERNAL_MODULE_chalk__ from "chalk";
import * as __WEBPACK_EXTERNAL_MODULE_bcryptjs__ from "bcryptjs";
import * as __WEBPACK_EXTERNAL_MODULE_swagger_ui_express_613ebf08__ from "swagger-ui-express";
import * as __WEBPACK_EXTERNAL_MODULE_cookie_parser_591162dd__ from "cookie-parser";
import * as __WEBPACK_EXTERNAL_MODULE_nodemailer__ from "nodemailer";
import * as __WEBPACK_EXTERNAL_MODULE_dotenv__ from "dotenv";
import * as __WEBPACK_EXTERNAL_MODULE_swagger_jsdoc_4cc0b3b9__ from "swagger-jsdoc";
import * as __WEBPACK_EXTERNAL_MODULE_helmet__ from "helmet";
import * as __WEBPACK_EXTERNAL_MODULE_sequelize__ from "sequelize";
import * as __WEBPACK_EXTERNAL_MODULE_jsonwebtoken__ from "jsonwebtoken";
import * as __WEBPACK_EXTERNAL_MODULE_express_rate_limit_c965cf1c__ from "express-rate-limit";
/******/ var __webpack_modules__ = ({

/***/ 43:
/***/ ((__webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(__webpack_module__, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Y: () => (/* binding */ withDatabaseQuery),
/* harmony export */   r: () => (/* binding */ withTransaction)
/* harmony export */ });
/* harmony import */ var _db_db_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9815);
/* harmony import */ var _utils_errorHandlers_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6963);
/* harmony import */ var _utils_retryOperation_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(6717);
/* harmony import */ var _utils_logger_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(3014);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_db_db_js__WEBPACK_IMPORTED_MODULE_0__]);
_db_db_js__WEBPACK_IMPORTED_MODULE_0__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];





// Circuit breaker compartido para operaciones de base de datos
const dbCircuitBreaker = new _utils_retryOperation_js__WEBPACK_IMPORTED_MODULE_2__/* .CircuitBreaker */ .aG({
  failureThreshold: 5,
  resetTimeout: 60000
});

// Opciones por defecto para retry
const defaultRetryOptions = {
  maxRetries: 3,
  baseDelay: 1000,
  circuitBreaker: dbCircuitBreaker
};

/**
 * Ejecuta una operación dentro de una transacción con retry y circuit breaker
 * @param {Function} operation - Función que recibe la transacción como parámetro
 * @param {Object} context - Contexto de la operación para logs y errores
 * @param {Object} options - Opciones de retry y circuit breaker
 */
const withTransaction = async (operation, context = {}, options = {}) => {
  const retryOpts = {
    ...defaultRetryOptions,
    ...options
  };
  const transaction = await _db_db_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A.transaction();
  try {
    const result = await (0,_utils_retryOperation_js__WEBPACK_IMPORTED_MODULE_2__/* .retryOperation */ .Uq)(async () => operation(transaction), {
      ...context,
      transactionId: transaction.id
    }, retryOpts);
    await transaction.commit();
    _utils_logger_js__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .A.info('Transacción completada exitosamente', {
      ...context,
      transactionId: transaction.id
    });
    return result;
  } catch (error) {
    await transaction.rollback();
    _utils_logger_js__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .A.error('Error en transacción - rollback ejecutado', {
      ...context,
      transactionId: transaction.id,
      error: {
        message: error.message,
        code: error.code,
        stack: error.stack
      }
    });
    throw (0,_utils_errorHandlers_js__WEBPACK_IMPORTED_MODULE_1__/* .enrichError */ .eX)(error, {
      ...context,
      transactionId: transaction.id,
      rolledBack: true
    });
  }
};

/**
 * Ejecuta una consulta de base de datos con retry y circuit breaker
 * @param {Function} query - Función que ejecuta la consulta
 * @param {Object} context - Contexto de la operación
 * @param {Object} options - Opciones de retry y circuit breaker
 */
const withDatabaseQuery = async (query, context = {}, options = {}) => {
  const retryOpts = {
    ...defaultRetryOptions,
    ...options
  };
  try {
    return await (0,_utils_retryOperation_js__WEBPACK_IMPORTED_MODULE_2__/* .retryOperation */ .Uq)(query, context, retryOpts);
  } catch (error) {
    throw (0,_utils_errorHandlers_js__WEBPACK_IMPORTED_MODULE_1__/* .handleDatabaseError */ .ie)(error, context.operation || 'QUERY', context);
  }
};
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 245:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  f: () => (/* binding */ paths)
});

;// external "url"
const external_url_namespaceObject = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("url");
// EXTERNAL MODULE: external "path"
var external_path_ = __webpack_require__(6928);
;// ./src/config/paths.js


const paths_filename = (0,external_url_namespaceObject.fileURLToPath)("file:///C:/Users/ZARAGOZA051/Desktop/FERILIZACION/src/config/paths.js");
const paths_dirname = (0,external_path_.dirname)(paths_filename);
const paths = {
  root: (0,external_path_.join)(paths_dirname, '..'),
  views: (0,external_path_.join)(paths_dirname, '..', 'views'),
  public: (0,external_path_.join)(paths_dirname, '..', '..', 'public'),
  uploads: (0,external_path_.join)(paths_dirname, '..', 'uploads')
};

/***/ }),

/***/ 702:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   B: () => (/* binding */ validateJSON)
/* harmony export */ });
const validateJSON = async (err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      error: 'El cuerpo de la solicitud no es un JSON válido'
    });
  }
  next();
};


/***/ }),

/***/ 731:
/***/ ((__webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(__webpack_module__, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   B: () => (/* binding */ ActivoMezcla)
/* harmony export */ });
/* harmony import */ var sequelize__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8265);
/* harmony import */ var _db_db_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9815);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_db_db_js__WEBPACK_IMPORTED_MODULE_1__]);
_db_db_js__WEBPACK_IMPORTED_MODULE_1__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];


const activoMezclaConfig = {
  id: {
    type: sequelize__WEBPACK_IMPORTED_MODULE_0__.DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  nombre: {
    type: sequelize__WEBPACK_IMPORTED_MODULE_0__.DataTypes.STRING(50),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El nombre es requerido'
      },
      len: {
        args: [1, 50],
        msg: 'El nombre debe tener entre 1 y 50 caracteres'
      }
    }
  },
  codigo: {
    type: sequelize__WEBPACK_IMPORTED_MODULE_0__.DataTypes.STRING(20),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El código es requerido'
      },
      len: {
        args: [1, 20],
        msg: 'El código debe tener entre 1 y 20 caracteres'
      }
    }
  },
  tipo: {
    type: sequelize__WEBPACK_IMPORTED_MODULE_0__.DataTypes.STRING(20),
    allowNull: true
  },
  es_principal: {
    type: sequelize__WEBPACK_IMPORTED_MODULE_0__.DataTypes.TINYINT,
    // or BOOLEAN
    allowNull: false,
    defaultValue: 0
  },
  unidad: {
    type: sequelize__WEBPACK_IMPORTED_MODULE_0__.DataTypes.ENUM('KG', 'LITRO'),
    allowNull: false,
    validate: {
      isIn: {
        args: [['KG', 'LITRO']],
        msg: 'La unidad debe ser KG o LITRO'
      }
    }
  }
};
const ActivoMezcla = _db_db_js__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .A.define('ActivoMezcla', activoMezclaConfig, {
  tableName: 'activo_mezcla',
  timestamps: false
});
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 777:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  development: {
    nodeVersion: '21.6.2',
    env: {
      NODE_ENV: 'development',
      PORT: 3000,
      HOST: 'localhost'
    },
    build: {
      sourceMaps: false,
      minify: true,
      target: 'node24.0'
    }
  },
  production: {
    nodeVersion: '24.0.1',
    env: {
      NODE_ENV: 'production',
      PORT: process.env.PORT || process.env.PLESK_PORT || 3000,
      HOST: '0.0.0.0'
    },
    build: {
      sourceMaps: false,
      minify: true,
      target: 'node24.0'
    }
  },
  common: {
    appName: 'mezclas-lg',
    logLevel: process.env.LOG_LEVEL || 'info',
    database: {
      dialect: 'mysql',
      logging: false
    }
  }
});

/***/ }),

/***/ 876:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var x = (y) => {
	var x = {}; __webpack_require__.d(x, y); return x
} 
var y = (x) => (() => (x))
module.exports = x({ ["default"]: () => (__WEBPACK_EXTERNAL_MODULE_compression__["default"]) });

/***/ }),

/***/ 936:
/***/ ((__webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(__webpack_module__, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   QF: () => (/* binding */ authenticate),
/* harmony export */   tE: () => (/* binding */ checkRoleAuth)
/* harmony export */ });
/* unused harmony export checkAccess */
/* harmony import */ var jsonwebtoken__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9071);
/* harmony import */ var _config_env_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9097);
/* harmony import */ var _utils_authHelper_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(9648);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_utils_authHelper_js__WEBPACK_IMPORTED_MODULE_2__]);
_utils_authHelper_js__WEBPACK_IMPORTED_MODULE_2__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];



const authenticate = async (req, res, next) => {
  const token = req.cookies.access_token;
  let decoded = null;
  req.session = {
    user: null
  };
  try {
    if (!token) return res.status(403).render('errorSesion', {
      codeError: 403,
      title: '403 - token no proveeido',
      errorMsg: 'No se ha iniciado sesion'
    });
    // Verificamos token
    decoded = await verifyToken(token);
    if (!decoded) return res.status(401).render('errorSesion', {
      codeError: 401,
      title: '401 - Token Invalido',
      errorMsg: 'Error de autenticación'
    });
    req.session.user = decoded;
    req.user = {
      ...decoded,
      idUsuario: decoded.id
    };
    req.userRole = decoded.userRole; // Establece la propiedad req.userRole
    next();
  } catch (error) {
    req.session.user = null;
    return res.status(401).render('errorSesion', {
      codeError: 401,
      title: '401 - Token Invalido',
      errorMsg: 'Error de autenticación'
    });
  }
};
const verifyToken = async token => {
  try {
    const decoded = jsonwebtoken__WEBPACK_IMPORTED_MODULE_0__["default"].verify(token, _config_env_mjs__WEBPACK_IMPORTED_MODULE_1__/* .envs */ .D.SECRET_JWT_KEY);
    decoded.userRole = decoded.rol; // Agrega la propiedad userRole al objeto decoded
    return decoded;
  } catch (error) {
    return null;
  }
};
const checkAccess = ({
  idSistema,
  moduleClave,
  accion,
  requireRancho = false
}) => {
  return async (req, res, next) => {
    const user = req.user;
    if (!user) return res.status(401).json({
      msg: 'No autenticado'
    });

    // 1) Sistema
    const accesoSistema = await tieneAccesoASistema(user.idUsuario, idSistema);
    if (!accesoSistema) return res.status(403).json({
      msg: 'Sin acceso al sistema'
    });

    // 2) Dominio empresa/rancho - se esperan idEmpresa e idRancho en body/query/params
    const idEmpresa = req.body.idEmpresa || req.query.idEmpresa || req.params.idEmpresa;
    const idRancho = req.body.idRancho || req.query.idRancho || req.params.idRancho || null;
    if (!idEmpresa) {
      // si la ruta requiere empresa explícita, forzarla
      return res.status(400).json({
        msg: 'Falta idEmpresa en la solicitud'
      });
    }
    const accesoDominio = await tieneAccesoARancho(user.idUsuario, idRancho, idEmpresa);
    if (!accesoDominio) return res.status(403).json({
      msg: 'Sin acceso al dominio (empresa/rancho)'
    });

    // 3) Permiso sobre módulo/acción
    const permiso = await tienePermiso(user.idUsuario, moduleClave, accion, idSistema);
    if (!permiso) return res.status(403).json({
      msg: 'Sin permisos en el módulo'
    });

    // Adjuntar contexto útil
    req.ctx = {
      idSistema,
      moduleClave,
      accion,
      idEmpresa: Number(idEmpresa),
      idRancho: idRancho ? Number(idRancho) : null
    };
    next();
  };
};
const checkRoleAuth = roles => (req, res, next) => {
  if (req.user && roles.includes(req.user.userRole)) {
    next();
  } else {
    res.status(403).render('errorSesion', {
      codeError: 403,
      title: '403 - Acceso Denegado',
      errorMsg: 'No tienes permisos para acceder a este recurso'
    });
  }
};


/**
Sistema 1 = almacén (ejemplo), modulo clave 'almacen', acción 'create'
router.post(
  '/solicitudes',
  auth,
  checkAccess({ idSistema: 1, moduleClave: 'almacen', accion: 'create', requireRancho: true }),
  async (req, res) => {
    try {
      const { idEmpresa, idRancho } = req.ctx;
      const { descripcion, cantidad } = req.body;
      const [result] = await pool.query(
        `INSERT INTO solicitudes (idEmpresa, idRancho, descripcion, cantidad, idUsuarioSolicita, fechaSolicitud, status)
         VALUES (?, ?, ?, ?, ?, NOW(), 'PENDIENTE')`,
        [idEmpresa, idRancho, descripcion, cantidad, req.user.idUsuario]
      );
      res.json({ ok: true, id: result.insertId });
    } catch (err) {
      res.status(500).json({ ok: false, error: err.message });
    }
  }
);

Ruta para aprobar (accion 'approve', módulo 'almacen')
router.post(
  '/solicitudes/:id/aprobar',
  auth,
  checkAccess({ idSistema: 1, moduleClave: 'almacen', accion: 'approve', requireRancho: true }),
  async (req, res) => {
    const idSolicitud = req.params.id;
    // lógica de aprobación...
    res.json({ ok: true });
  }
);
*/
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 1078:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var x = (y) => {
	var x = {}; __webpack_require__.d(x, y); return x
} 
var y = (x) => (() => (x))
module.exports = x({ ["default"]: () => (__WEBPACK_EXTERNAL_MODULE_exceljs__["default"]) });

/***/ }),

/***/ 1087:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   r: () => (/* binding */ errorHandler),
/* harmony export */   v: () => (/* binding */ error404)
/* harmony export */ });
/* harmony import */ var _utils_logger_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3014);
/* harmony import */ var _utils_CustomError_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2551);
/* harmony import */ var _config_env_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(9097);



const error404 = async (req, res, next) => {
  res.status(404).render('errorPage', {
    codeError: '404',
    title: '404 - Página no encontrada',
    errorMsg: 'La página que buscas no fue encontrada.'
  });
};
const errorHandler = (err, req, res, next) => {
  const errorContext = {
    url: req.originalUrl,
    method: req.method,
    userId: req.session?.user?.id,
    userRole: req.session?.user?.rol,
    ip: req.ip,
    userAgent: req.headers['user-agent']
  };
  _utils_logger_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A.logError(err, errorContext);

  // Errores conocidos
  if (err instanceof _utils_CustomError_js__WEBPACK_IMPORTED_MODULE_1__/* .CustomError */ .eo) {
    return res.status(err.statusCode).json({
      error: err.errorCode,
      message: err.message,
      details: _config_env_mjs__WEBPACK_IMPORTED_MODULE_2__/* .envs */ .D.MODE === 'development' ? err.details : undefined,
      timestamp: err.timestamp
    });
  }

  // Error de Sequelize
  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({
      error: 'VALIDATION_ERROR',
      message: 'Error de validación en la base de datos',
      details: err.errors.map(e => ({
        field: e.path,
        message: e.message
      }))
    });
  }

  // Error no controlado
  const statusCode = err.statusCode || 500;
  return res.status(statusCode).json({
    error: 'INTERNAL_SERVER_ERROR',
    message: _config_env_mjs__WEBPACK_IMPORTED_MODULE_2__/* .envs */ .D.MODE === 'production' ? 'Error interno del servidor' : err.message,
    timestamp: new Date().toISOString()
  });
};

/***/ }),

/***/ 1148:
/***/ ((__webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(__webpack_module__, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   i: () => (/* binding */ setupAssociations)
/* harmony export */ });
/* harmony import */ var _schema_empresas_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5458);
/* harmony import */ var _schema_ranchos_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(5964);
/* harmony import */ var _schema_rancho_dsa_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(1682);
/* harmony import */ var _schema_usuarios_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(9491);
/* harmony import */ var _schema_activo_mezcla_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(731);
/* harmony import */ var _schema_tanques_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(8293);
/* harmony import */ var _schema_sectores_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(2692);
/* harmony import */ var _schema_mezclas_catalogo_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(8118);
/* harmony import */ var _schema_mezcla_activos_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(6386);
/* harmony import */ var _schema_aplicaciones_tanque_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(8300);
/* harmony import */ var _schema_tanques_preparados_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(4831);
/* harmony import */ var _schema_mezclas_tanque_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(8518);
/* harmony import */ var _utils_logger_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(3014);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_schema_empresas_js__WEBPACK_IMPORTED_MODULE_0__, _schema_ranchos_js__WEBPACK_IMPORTED_MODULE_1__, _schema_rancho_dsa_js__WEBPACK_IMPORTED_MODULE_2__, _schema_usuarios_js__WEBPACK_IMPORTED_MODULE_3__, _schema_activo_mezcla_js__WEBPACK_IMPORTED_MODULE_4__, _schema_tanques_js__WEBPACK_IMPORTED_MODULE_5__, _schema_sectores_js__WEBPACK_IMPORTED_MODULE_6__, _schema_mezclas_catalogo_js__WEBPACK_IMPORTED_MODULE_7__, _schema_mezcla_activos_js__WEBPACK_IMPORTED_MODULE_8__, _schema_aplicaciones_tanque_js__WEBPACK_IMPORTED_MODULE_9__, _schema_tanques_preparados_js__WEBPACK_IMPORTED_MODULE_10__, _schema_mezclas_tanque_js__WEBPACK_IMPORTED_MODULE_11__]);
([_schema_empresas_js__WEBPACK_IMPORTED_MODULE_0__, _schema_ranchos_js__WEBPACK_IMPORTED_MODULE_1__, _schema_rancho_dsa_js__WEBPACK_IMPORTED_MODULE_2__, _schema_usuarios_js__WEBPACK_IMPORTED_MODULE_3__, _schema_activo_mezcla_js__WEBPACK_IMPORTED_MODULE_4__, _schema_tanques_js__WEBPACK_IMPORTED_MODULE_5__, _schema_sectores_js__WEBPACK_IMPORTED_MODULE_6__, _schema_mezclas_catalogo_js__WEBPACK_IMPORTED_MODULE_7__, _schema_mezcla_activos_js__WEBPACK_IMPORTED_MODULE_8__, _schema_aplicaciones_tanque_js__WEBPACK_IMPORTED_MODULE_9__, _schema_tanques_preparados_js__WEBPACK_IMPORTED_MODULE_10__, _schema_mezclas_tanque_js__WEBPACK_IMPORTED_MODULE_11__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);





// Fertilization Module Schemas









// logger

function setupAssociations() {
  // --- Asociaciones Modulo Fertilizacion ---
  // Ranchos <-> Empresas
  _schema_ranchos_js__WEBPACK_IMPORTED_MODULE_1__/* .Ranchos */ .h.belongsTo(_schema_empresas_js__WEBPACK_IMPORTED_MODULE_0__/* .Empresas */ .p, {
    foreignKey: 'id_empresa'
  });
  _schema_empresas_js__WEBPACK_IMPORTED_MODULE_0__/* .Empresas */ .p.hasMany(_schema_ranchos_js__WEBPACK_IMPORTED_MODULE_1__/* .Ranchos */ .h, {
    foreignKey: 'id_empresa'
  });

  // Mezcla <-> Activos (Many-to-Many via MezclaActivos)
  _schema_mezclas_catalogo_js__WEBPACK_IMPORTED_MODULE_7__/* .MezclaCatalogo */ .p.hasMany(_schema_mezcla_activos_js__WEBPACK_IMPORTED_MODULE_8__/* .MezclaActivos */ .k, {
    foreignKey: 'id_mezcla'
  });
  _schema_mezcla_activos_js__WEBPACK_IMPORTED_MODULE_8__/* .MezclaActivos */ .k.belongsTo(_schema_mezclas_catalogo_js__WEBPACK_IMPORTED_MODULE_7__/* .MezclaCatalogo */ .p, {
    foreignKey: 'id_mezcla'
  });
  _schema_activo_mezcla_js__WEBPACK_IMPORTED_MODULE_4__/* .ActivoMezcla */ .B.hasMany(_schema_mezcla_activos_js__WEBPACK_IMPORTED_MODULE_8__/* .MezclaActivos */ .k, {
    foreignKey: 'id_activo'
  });
  _schema_mezcla_activos_js__WEBPACK_IMPORTED_MODULE_8__/* .MezclaActivos */ .k.belongsTo(_schema_activo_mezcla_js__WEBPACK_IMPORTED_MODULE_4__/* .ActivoMezcla */ .B, {
    foreignKey: 'id_activo'
  });

  // Relacion One-to-Many con MezclasTanque (detalle)
  _schema_tanques_preparados_js__WEBPACK_IMPORTED_MODULE_10__/* .TanquesPreparados */ .t.hasMany(_schema_mezclas_tanque_js__WEBPACK_IMPORTED_MODULE_11__/* .MezclasTanque */ .e, {
    foreignKey: 'id_tanque_preparado'
  });
  _schema_mezclas_tanque_js__WEBPACK_IMPORTED_MODULE_11__/* .MezclasTanque */ .e.belongsTo(_schema_tanques_preparados_js__WEBPACK_IMPORTED_MODULE_10__/* .TanquesPreparados */ .t, {
    foreignKey: 'id_tanque_preparado'
  });

  // Detalle MezclaTanque -> MezclaCatalogo
  _schema_mezclas_tanque_js__WEBPACK_IMPORTED_MODULE_11__/* .MezclasTanque */ .e.belongsTo(_schema_mezclas_catalogo_js__WEBPACK_IMPORTED_MODULE_7__/* .MezclaCatalogo */ .p, {
    foreignKey: 'id_mezcla'
  });
  _schema_tanques_preparados_js__WEBPACK_IMPORTED_MODULE_10__/* .TanquesPreparados */ .t.belongsTo(_schema_tanques_js__WEBPACK_IMPORTED_MODULE_5__/* .Tanques */ .C, {
    foreignKey: 'id_tanque'
  });
  _schema_tanques_js__WEBPACK_IMPORTED_MODULE_5__/* .Tanques */ .C.hasMany(_schema_tanques_preparados_js__WEBPACK_IMPORTED_MODULE_10__/* .TanquesPreparados */ .t, {
    foreignKey: 'id_tanque'
  });
  _schema_tanques_preparados_js__WEBPACK_IMPORTED_MODULE_10__/* .TanquesPreparados */ .t.belongsTo(_schema_ranchos_js__WEBPACK_IMPORTED_MODULE_1__/* .Ranchos */ .h, {
    foreignKey: 'id_rancho'
  });
  _schema_ranchos_js__WEBPACK_IMPORTED_MODULE_1__/* .Ranchos */ .h.hasMany(_schema_tanques_preparados_js__WEBPACK_IMPORTED_MODULE_10__/* .TanquesPreparados */ .t, {
    foreignKey: 'id_rancho'
  });

  // Sectores <-> RanchoDsa
  _schema_sectores_js__WEBPACK_IMPORTED_MODULE_6__/* .Sectores */ .d.belongsTo(_schema_rancho_dsa_js__WEBPACK_IMPORTED_MODULE_2__/* .RanchoDsa */ .M, {
    foreignKey: 'id_rancho_dsa'
  });
  _schema_rancho_dsa_js__WEBPACK_IMPORTED_MODULE_2__/* .RanchoDsa */ .M.hasMany(_schema_sectores_js__WEBPACK_IMPORTED_MODULE_6__/* .Sectores */ .d, {
    foreignKey: 'id_rancho_dsa'
  });

  // RanchoDsa <-> Ranchos
  _schema_rancho_dsa_js__WEBPACK_IMPORTED_MODULE_2__/* .RanchoDsa */ .M.belongsTo(_schema_ranchos_js__WEBPACK_IMPORTED_MODULE_1__/* .Ranchos */ .h, {
    foreignKey: 'id_rancho'
  });
  _schema_ranchos_js__WEBPACK_IMPORTED_MODULE_1__/* .Ranchos */ .h.hasMany(_schema_rancho_dsa_js__WEBPACK_IMPORTED_MODULE_2__/* .RanchoDsa */ .M, {
    foreignKey: 'id_rancho'
  });

  // Aplicaciones
  _schema_aplicaciones_tanque_js__WEBPACK_IMPORTED_MODULE_9__/* .AplicacionesTanque */ .y.belongsTo(_schema_tanques_preparados_js__WEBPACK_IMPORTED_MODULE_10__/* .TanquesPreparados */ .t, {
    foreignKey: 'id_tanque_preparado'
  });
  _schema_tanques_preparados_js__WEBPACK_IMPORTED_MODULE_10__/* .TanquesPreparados */ .t.hasMany(_schema_aplicaciones_tanque_js__WEBPACK_IMPORTED_MODULE_9__/* .AplicacionesTanque */ .y, {
    foreignKey: 'id_tanque_preparado'
  });
  _schema_aplicaciones_tanque_js__WEBPACK_IMPORTED_MODULE_9__/* .AplicacionesTanque */ .y.belongsTo(_schema_sectores_js__WEBPACK_IMPORTED_MODULE_6__/* .Sectores */ .d, {
    foreignKey: 'id_sector'
  });
  _schema_sectores_js__WEBPACK_IMPORTED_MODULE_6__/* .Sectores */ .d.hasMany(_schema_aplicaciones_tanque_js__WEBPACK_IMPORTED_MODULE_9__/* .AplicacionesTanque */ .y, {
    foreignKey: 'id_sector'
  });
  _schema_aplicaciones_tanque_js__WEBPACK_IMPORTED_MODULE_9__/* .AplicacionesTanque */ .y.belongsTo(_schema_tanques_js__WEBPACK_IMPORTED_MODULE_5__/* .Tanques */ .C, {
    foreignKey: 'id_tanque'
  });

  // Optional: Link Application to User if 'id_responsable' is used
  _schema_aplicaciones_tanque_js__WEBPACK_IMPORTED_MODULE_9__/* .AplicacionesTanque */ .y.belongsTo(_schema_usuarios_js__WEBPACK_IMPORTED_MODULE_3__/* .Usuario */ .P, {
    foreignKey: 'id_responsable'
  });

  // Tanques <-> Ranchos
  _schema_tanques_js__WEBPACK_IMPORTED_MODULE_5__/* .Tanques */ .C.belongsTo(_schema_ranchos_js__WEBPACK_IMPORTED_MODULE_1__/* .Ranchos */ .h, {
    foreignKey: 'id_rancho'
  });
  _schema_ranchos_js__WEBPACK_IMPORTED_MODULE_1__/* .Ranchos */ .h.hasMany(_schema_tanques_js__WEBPACK_IMPORTED_MODULE_5__/* .Tanques */ .C, {
    foreignKey: 'id_rancho'
  });
  _utils_logger_js__WEBPACK_IMPORTED_MODULE_12__/* ["default"] */ .A.info('✔ Asociaciones configuradas correctamente');
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 1242:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var x = (y) => {
	var x = {}; __webpack_require__.d(x, y); return x
} 
var y = (x) => (() => (x))
module.exports = x({ ["default"]: () => (__WEBPACK_EXTERNAL_MODULE_body_parser_496b7721__["default"]) });

/***/ }),

/***/ 1682:
/***/ ((__webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(__webpack_module__, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   M: () => (/* binding */ RanchoDsa)
/* harmony export */ });
/* harmony import */ var sequelize__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8265);
/* harmony import */ var _db_db_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9815);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_db_db_js__WEBPACK_IMPORTED_MODULE_1__]);
_db_db_js__WEBPACK_IMPORTED_MODULE_1__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];


const ranchoDsaConfig = {
  id: {
    type: sequelize__WEBPACK_IMPORTED_MODULE_0__.DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  id_rancho: {
    type: sequelize__WEBPACK_IMPORTED_MODULE_0__.DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'ranchos',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  nombre_rancho_dsa: {
    type: sequelize__WEBPACK_IMPORTED_MODULE_0__.DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El nombre del rancho DSA es requerido'
      },
      len: {
        args: [3, 100],
        msg: 'El nombre del rancho DSA debe tener entre 3 y 100 caracteres'
      }
    }
  },
  numero_rancho_dsa: {
    type: sequelize__WEBPACK_IMPORTED_MODULE_0__.DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: {
        msg: 'El número de rancho DSA es requerido'
      },
      min: {
        args: 1,
        msg: 'El número de rancho DSA debe ser mayor a 0'
      }
    }
  },
  status: {
    type: sequelize__WEBPACK_IMPORTED_MODULE_0__.DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
};
const RanchoDsa = _db_db_js__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .A.define('rancho_dsa', ranchoDsaConfig, {
  tableName: 'rancho_dsa',
  timestamps: true // Agrega createdAt y updatedAt automáticamente
});
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 1764:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  C: () => (/* binding */ corsMiddleware)
});

;// external "cors"
var x = (y) => {
	var x = {}; __webpack_require__.d(x, y); return x
} 
var y = (x) => (() => (x))
const external_cors_namespaceObject = x({ ["default"]: () => (__WEBPACK_EXTERNAL_MODULE_cors__["default"]) });
;// ./src/middlewares/cors.js

const ACCEPTED_ORIGINS = ['http://localhost:3000', 'http://localhost', 'https://solicitudmezclas.portalrancho.com.mx', 'https://mezclas.portalrancho.com.mx', 'https://5xx636dm-3000.usw3.devtunnels.ms/'];
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

/***/ }),

/***/ 1938:
/***/ ((__webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(__webpack_module__, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   w: () => (/* binding */ FertilizacionController)
/* harmony export */ });
/* harmony import */ var _schema_activo_mezcla_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(731);
/* harmony import */ var _schema_tanques_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(8293);
/* harmony import */ var _schema_sectores_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(2692);
/* harmony import */ var _schema_mezclas_catalogo_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(8118);
/* harmony import */ var _schema_mezcla_activos_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(6386);
/* harmony import */ var _schema_aplicaciones_tanque_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(8300);
/* harmony import */ var _schema_ranchos_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(5964);
/* harmony import */ var _schema_rancho_dsa_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(1682);
/* harmony import */ var _schema_tanques_preparados_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(4831);
/* harmony import */ var _schema_mezclas_tanque_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(8518);
/* harmony import */ var exceljs__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(1078);
/* harmony import */ var _db_db_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(9815);
/* harmony import */ var sequelize__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(8265);
/* harmony import */ var _utils_transactionUtils_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(43);
/* harmony import */ var _utils_errorHandlers_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(6963);
/* harmony import */ var _utils_CustomError_js__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(2551);
/* harmony import */ var _utils_asyncHandler_js__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(6466);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_schema_activo_mezcla_js__WEBPACK_IMPORTED_MODULE_0__, _schema_tanques_js__WEBPACK_IMPORTED_MODULE_1__, _schema_sectores_js__WEBPACK_IMPORTED_MODULE_2__, _schema_mezclas_catalogo_js__WEBPACK_IMPORTED_MODULE_3__, _schema_mezcla_activos_js__WEBPACK_IMPORTED_MODULE_4__, _schema_aplicaciones_tanque_js__WEBPACK_IMPORTED_MODULE_5__, _schema_ranchos_js__WEBPACK_IMPORTED_MODULE_6__, _schema_rancho_dsa_js__WEBPACK_IMPORTED_MODULE_7__, _schema_tanques_preparados_js__WEBPACK_IMPORTED_MODULE_8__, _schema_mezclas_tanque_js__WEBPACK_IMPORTED_MODULE_9__, _db_db_js__WEBPACK_IMPORTED_MODULE_11__, _utils_transactionUtils_js__WEBPACK_IMPORTED_MODULE_13__]);
([_schema_activo_mezcla_js__WEBPACK_IMPORTED_MODULE_0__, _schema_tanques_js__WEBPACK_IMPORTED_MODULE_1__, _schema_sectores_js__WEBPACK_IMPORTED_MODULE_2__, _schema_mezclas_catalogo_js__WEBPACK_IMPORTED_MODULE_3__, _schema_mezcla_activos_js__WEBPACK_IMPORTED_MODULE_4__, _schema_aplicaciones_tanque_js__WEBPACK_IMPORTED_MODULE_5__, _schema_ranchos_js__WEBPACK_IMPORTED_MODULE_6__, _schema_rancho_dsa_js__WEBPACK_IMPORTED_MODULE_7__, _schema_tanques_preparados_js__WEBPACK_IMPORTED_MODULE_8__, _schema_mezclas_tanque_js__WEBPACK_IMPORTED_MODULE_9__, _db_db_js__WEBPACK_IMPORTED_MODULE_11__, _utils_transactionUtils_js__WEBPACK_IMPORTED_MODULE_13__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* eslint-disable camelcase */












// DB



// Utils




class FertilizacionController {
  static getCatalogos = (0,_utils_asyncHandler_js__WEBPACK_IMPORTED_MODULE_16__/* .asyncHandler */ .L)(async (req, res) => {
    const logger = req.logger;
    const catalogos = await (0,_utils_transactionUtils_js__WEBPACK_IMPORTED_MODULE_13__/* .withDatabaseQuery */ .Y)(async () => {
      const [activos, tanques, sectores, mezclas, ranchos, ranchos_dsa, temporadas] = await Promise.all([_schema_activo_mezcla_js__WEBPACK_IMPORTED_MODULE_0__/* .ActivoMezcla */ .B.findAll(), _schema_tanques_js__WEBPACK_IMPORTED_MODULE_1__/* .Tanques */ .C.findAll({
        where: {
          status: 1
        },
        include: [{
          model: _schema_ranchos_js__WEBPACK_IMPORTED_MODULE_6__/* .Ranchos */ .h,
          attributes: ['id', 'rancho']
        }]
      }), _schema_sectores_js__WEBPACK_IMPORTED_MODULE_2__/* .Sectores */ .d.findAll({
        where: {
          status: 1
        },
        include: [{
          model: _schema_rancho_dsa_js__WEBPACK_IMPORTED_MODULE_7__/* .RanchoDsa */ .M,
          attributes: ['id', 'nombre_rancho_dsa', 'numero_rancho_dsa'],
          include: [{
            model: _schema_ranchos_js__WEBPACK_IMPORTED_MODULE_6__/* .Ranchos */ .h,
            attributes: ['id', 'rancho']
          }]
        }]
      }), _schema_mezclas_catalogo_js__WEBPACK_IMPORTED_MODULE_3__/* .MezclaCatalogo */ .p.findAll({
        include: [{
          model: _schema_mezcla_activos_js__WEBPACK_IMPORTED_MODULE_4__/* .MezclaActivos */ .k,
          include: [_schema_activo_mezcla_js__WEBPACK_IMPORTED_MODULE_0__/* .ActivoMezcla */ .B]
        }]
      }), _schema_ranchos_js__WEBPACK_IMPORTED_MODULE_6__/* .Ranchos */ .h.findAll({
        where: {
          status: 1
        }
      }), _schema_rancho_dsa_js__WEBPACK_IMPORTED_MODULE_7__/* .RanchoDsa */ .M.findAll({
        where: {
          status: 1
        }
      }), _db_db_js__WEBPACK_IMPORTED_MODULE_11__/* ["default"] */ .A.query(`
                    SELECT anio FROM npk_fertilizacion_completo GROUP by anio
                    `, {
        type: _db_db_js__WEBPACK_IMPORTED_MODULE_11__/* ["default"] */ .A.QueryTypes.SELECT
      }), _db_db_js__WEBPACK_IMPORTED_MODULE_11__/* ["default"] */ .A.query(`
                    SELECT temporada FROM temporada WHERE status=1`, {
        type: _db_db_js__WEBPACK_IMPORTED_MODULE_11__/* ["default"] */ .A.QueryTypes.SELECT
      })]);
      return {
        activos,
        tanques,
        sectores,
        mezclas,
        ranchos,
        ranchos_dsa,
        anios: [],
        temporadas
      };
    }, {
      operation: 'GET_CATALOGOS',
      userId: req.user?.id
    });
    logger.logOperation('GET_CATALOGOS', 'success', {
      activosCount: catalogos.activos.length,
      tanquesCount: catalogos.tanques.length,
      sectoresCount: catalogos.sectores.length,
      mezclasCount: catalogos.mezclas.length,
      ranchosCount: catalogos.ranchos.length,
      anios: catalogos.anios.length,
      temporadas: catalogos.temporadas.length
    });
    res.json({
      success: true,
      data: catalogos
    });
  });

  // ========== RENDERIZAR PÁGINAS ==========
  static renderMezclas = (0,_utils_asyncHandler_js__WEBPACK_IMPORTED_MODULE_16__/* .asyncHandler */ .L)(async (req, res) => {
    res.render('pages/fertilizacion/mezclas', {
      title: 'Catálogo de Mezclas',
      user: req.user,
      rol: req.user.rol
    });
  });
  static renderGraficas = (0,_utils_asyncHandler_js__WEBPACK_IMPORTED_MODULE_16__/* .asyncHandler */ .L)(async (req, res) => {
    res.render('pages/fertilizacion/graficas', {
      title: 'Reportes de Fertilización',
      user: req.user,
      rol: req.user.rol
    });
  });
  static renderRegistro = (0,_utils_asyncHandler_js__WEBPACK_IMPORTED_MODULE_16__/* .asyncHandler */ .L)(async (req, res) => {
    res.render('pages/fertilizacion/nueva_estructura_registro', {
      title: 'Registro de Aplicación',
      user: req.user,
      rol: req.user.rol
    });
  });
  static renderNuevaEstructuraRegistro = (0,_utils_asyncHandler_js__WEBPACK_IMPORTED_MODULE_16__/* .asyncHandler */ .L)(async (req, res) => {
    res.render('pages/fertilizacion/nueva_estructura_registro', {
      title: 'Registro de Fertilización - Nueva Estructura',
      user: req.user,
      rol: req.user.rol
    });
  });
  static renderNuevaEstructuraReportes = (0,_utils_asyncHandler_js__WEBPACK_IMPORTED_MODULE_16__/* .asyncHandler */ .L)(async (req, res) => {
    res.render('pages/fertilizacion/nueva_estructura_reportes', {
      title: 'Reportes V2 - Nueva Estructura',
      user: req.user,
      rol: req.user.rol
    });
  });
  static renderPrepararTanque = (0,_utils_asyncHandler_js__WEBPACK_IMPORTED_MODULE_16__/* .asyncHandler */ .L)(async (req, res) => {
    res.render('pages/fertilizacion/preparar_tanque', {
      title: 'Preparar Tanque',
      user: req.user,
      rol: req.user.rol
    });
  });

  // ========== GESTIÓN DE MEZCLAS CATÁLOGO ==========
  static crearMezcla = (0,_utils_asyncHandler_js__WEBPACK_IMPORTED_MODULE_16__/* .asyncHandler */ .L)(async (req, res) => {
    const logger = req.logger;
    const {
      nombre,
      fabricante,
      descripcion
    } = req.body;
    (0,_utils_errorHandlers_js__WEBPACK_IMPORTED_MODULE_14__/* .validateRequiredData */ .ip)(req.body, ['nombre', 'fabricante'], {
      operation: 'CREATE_MEZCLA'
    });
    const nuevaMezcla = await (0,_utils_transactionUtils_js__WEBPACK_IMPORTED_MODULE_13__/* .withTransaction */ .r)(async transaction => {
      const mezcla = await _schema_mezclas_catalogo_js__WEBPACK_IMPORTED_MODULE_3__/* .MezclaCatalogo */ .p.create({
        nombre: nombre.trim(),
        fabricante: fabricante.trim(),
        descripcion: descripcion ? descripcion.trim() : null
      }, {
        transaction
      });
      logger.logOperation('CREATE_MEZCLA', 'success', {
        mezclaId: mezcla.id,
        nombre: mezcla.nombre
      });
      return mezcla;
    }, {
      operation: 'CREATE_MEZCLA',
      userId: req.user?.id
    });
    res.status(201).json({
      success: true,
      message: 'Mezcla creada correctamente',
      data: nuevaMezcla
    });
  });
  static actualizarMezcla = (0,_utils_asyncHandler_js__WEBPACK_IMPORTED_MODULE_16__/* .asyncHandler */ .L)(async (req, res) => {
    const logger = req.logger;
    const {
      id
    } = req.params;
    const {
      nombre,
      fabricante,
      descripcion
    } = req.body;
    (0,_utils_errorHandlers_js__WEBPACK_IMPORTED_MODULE_14__/* .validateRequiredData */ .ip)(req.body, ['nombre', 'fabricante'], {
      operation: 'UPDATE_MEZCLA'
    });
    const mezclaActualizada = await (0,_utils_transactionUtils_js__WEBPACK_IMPORTED_MODULE_13__/* .withTransaction */ .r)(async transaction => {
      const mezcla = await _schema_mezclas_catalogo_js__WEBPACK_IMPORTED_MODULE_3__/* .MezclaCatalogo */ .p.findByPk(id, {
        transaction
      });
      if (!mezcla) {
        throw new _utils_CustomError_js__WEBPACK_IMPORTED_MODULE_15__/* .NotFoundError */ .m_('Mezcla no encontrada', {
          mezclaId: id
        });
      }
      await mezcla.update({
        nombre,
        fabricante,
        descripcion
      }, {
        transaction
      });
      logger.logOperation('UPDATE_MEZCLA', 'success', {
        mezclaId: mezcla.id,
        nombre: mezcla.nombre
      });
      return mezcla;
    }, {
      operation: 'UPDATE_MEZCLA',
      mezclaId: id,
      userId: req.user?.id
    });
    res.json({
      success: true,
      message: 'Mezcla actualizada correctamente',
      data: mezclaActualizada
    });
  });
  static eliminarMezcla = (0,_utils_asyncHandler_js__WEBPACK_IMPORTED_MODULE_16__/* .asyncHandler */ .L)(async (req, res) => {
    const logger = req.logger;
    const {
      id
    } = req.params;
    await (0,_utils_transactionUtils_js__WEBPACK_IMPORTED_MODULE_13__/* .withTransaction */ .r)(async transaction => {
      const mezcla = await _schema_mezclas_catalogo_js__WEBPACK_IMPORTED_MODULE_3__/* .MezclaCatalogo */ .p.findByPk(id, {
        transaction
      });
      if (!mezcla) {
        throw new _utils_CustomError_js__WEBPACK_IMPORTED_MODULE_15__/* .NotFoundError */ .m_('Mezcla no encontrada', {
          mezclaId: id
        });
      }

      // Eliminar los activos asociados a la mezcla
      await _schema_mezcla_activos_js__WEBPACK_IMPORTED_MODULE_4__/* .MezclaActivos */ .k.destroy({
        where: {
          id_mezcla: id
        },
        transaction
      });

      // Eliminar la mezcla
      await mezcla.destroy({
        transaction
      });
      logger.logOperation('DELETE_MEZCLA', 'success', {
        mezclaId: id,
        userId: req.user?.id
      });
    }, {
      operation: 'DELETE_MEZCLA',
      mezclaId: id,
      userId: req.user?.id
    });
    res.json({
      success: true,
      message: 'Mezcla eliminada correctamente'
    });
  });
  static obtenerMezclas = (0,_utils_asyncHandler_js__WEBPACK_IMPORTED_MODULE_16__/* .asyncHandler */ .L)(async (req, res) => {
    const mezclas = await (0,_utils_transactionUtils_js__WEBPACK_IMPORTED_MODULE_13__/* .withDatabaseQuery */ .Y)(() => _schema_mezclas_catalogo_js__WEBPACK_IMPORTED_MODULE_3__/* .MezclaCatalogo */ .p.findAll({
      include: [{
        model: _schema_mezcla_activos_js__WEBPACK_IMPORTED_MODULE_4__/* .MezclaActivos */ .k,
        include: [_schema_activo_mezcla_js__WEBPACK_IMPORTED_MODULE_0__/* .ActivoMezcla */ .B]
      }]
    }), {
      operation: 'GET_MEZCLAS',
      userId: req.user?.id
    });
    res.json({
      success: true,
      data: mezclas
    });
  });
  static obtenerMezclaPorId = (0,_utils_asyncHandler_js__WEBPACK_IMPORTED_MODULE_16__/* .asyncHandler */ .L)(async (req, res) => {
    const {
      id
    } = req.params;
    const mezcla = await (0,_utils_transactionUtils_js__WEBPACK_IMPORTED_MODULE_13__/* .withDatabaseQuery */ .Y)(() => _schema_mezclas_catalogo_js__WEBPACK_IMPORTED_MODULE_3__/* .MezclaCatalogo */ .p.findByPk(id, {
      include: [{
        model: _schema_mezcla_activos_js__WEBPACK_IMPORTED_MODULE_4__/* .MezclaActivos */ .k,
        include: [_schema_activo_mezcla_js__WEBPACK_IMPORTED_MODULE_0__/* .ActivoMezcla */ .B]
      }]
    }), {
      operation: 'GET_MEZCLA_BY_ID',
      userId: req.user?.id,
      mezclaId: id
    });
    if (!mezcla) {
      throw new _utils_CustomError_js__WEBPACK_IMPORTED_MODULE_15__/* .NotFoundError */ .m_('Mezcla no encontrada', {
        id
      });
    }
    res.json({
      success: true,
      data: mezcla
    });
  });

  // ========== ASIGNACIÓN DE ACTIVOS A MEZCLAS ==========
  static asignarActivosMezcla = (0,_utils_asyncHandler_js__WEBPACK_IMPORTED_MODULE_16__/* .asyncHandler */ .L)(async (req, res) => {
    const logger = req.logger;
    const {
      id_mezcla
    } = req.params;
    const {
      activos
    } = req.body;
    (0,_utils_errorHandlers_js__WEBPACK_IMPORTED_MODULE_14__/* .validateRequiredData */ .ip)({
      id_mezcla,
      activos
    }, ['id_mezcla', 'activos'], {
      operation: 'ASSIGN_MEZCLA_ACTIVOS'
    });
    if (!Array.isArray(activos) || activos.length === 0) {
      throw new _utils_CustomError_js__WEBPACK_IMPORTED_MODULE_15__/* .ValidationError */ .yI('Debe proporcionar al menos un activo', {
        field: 'activos'
      });
    }
    const nuevosActivos = await (0,_utils_transactionUtils_js__WEBPACK_IMPORTED_MODULE_13__/* .withTransaction */ .r)(async transaction => {
      const mezcla = await _schema_mezclas_catalogo_js__WEBPACK_IMPORTED_MODULE_3__/* .MezclaCatalogo */ .p.findByPk(id_mezcla, {
        transaction
      });
      if (!mezcla) {
        throw new _utils_CustomError_js__WEBPACK_IMPORTED_MODULE_15__/* .NotFoundError */ .m_('Mezcla no encontrada', {
          mezclaId: id_mezcla
        });
      }
      await _schema_mezcla_activos_js__WEBPACK_IMPORTED_MODULE_4__/* .MezclaActivos */ .k.destroy({
        where: {
          id_mezcla
        }
      }, {
        transaction
      });
      const nuevos = await _schema_mezcla_activos_js__WEBPACK_IMPORTED_MODULE_4__/* .MezclaActivos */ .k.bulkCreate(activos.map(a => ({
        id_mezcla,
        id_activo: a.id_activo,
        porcentaje: a.porcentaje || a.cantidad // Fallback for transition
      })), {
        transaction
      });
      logger.logOperation('ASSIGN_MEZCLA_ACTIVOS', 'success', {
        mezclaId: id_mezcla,
        activosCount: nuevos.length
      });
      return nuevos;
    }, {
      operation: 'ASSIGN_MEZCLA_ACTIVOS',
      mezclaId: id_mezcla,
      userId: req.user?.id
    });
    res.json({
      success: true,
      message: 'Ingredientes asignados a la mezcla',
      data: nuevosActivos
    });
  });
  static actualizarActivosMezcla = (0,_utils_asyncHandler_js__WEBPACK_IMPORTED_MODULE_16__/* .asyncHandler */ .L)(async (req, res) => {
    const logger = req.logger;
    const {
      id_mezcla
    } = req.params;
    const {
      activos
    } = req.body;
    (0,_utils_errorHandlers_js__WEBPACK_IMPORTED_MODULE_14__/* .validateRequiredData */ .ip)({
      id_mezcla,
      activos
    }, ['id_mezcla', 'activos'], {
      operation: 'UPDATE_MEZCLA_ACTIVOS'
    });
    if (!Array.isArray(activos) || activos.length === 0) {
      throw new _utils_CustomError_js__WEBPACK_IMPORTED_MODULE_15__/* .ValidationError */ .yI('Debe proporcionar al menos un activo', {
        field: 'activos'
      });
    }
    const nuevosActivos = await (0,_utils_transactionUtils_js__WEBPACK_IMPORTED_MODULE_13__/* .withTransaction */ .r)(async transaction => {
      const mezcla = await _schema_mezclas_catalogo_js__WEBPACK_IMPORTED_MODULE_3__/* .MezclaCatalogo */ .p.findByPk(id_mezcla, {
        transaction
      });
      if (!mezcla) {
        throw new _utils_CustomError_js__WEBPACK_IMPORTED_MODULE_15__/* .NotFoundError */ .m_('Mezcla no encontrada', {
          mezclaId: id_mezcla
        });
      }
      await _schema_mezcla_activos_js__WEBPACK_IMPORTED_MODULE_4__/* .MezclaActivos */ .k.destroy({
        where: {
          id_mezcla
        }
      }, {
        transaction
      });
      const nuevos = await _schema_mezcla_activos_js__WEBPACK_IMPORTED_MODULE_4__/* .MezclaActivos */ .k.bulkCreate(activos.map(a => ({
        id_mezcla,
        id_activo: a.id_activo,
        porcentaje: a.porcentaje || a.cantidad
      })), {
        transaction
      });
      logger.logOperation('UPDATE_MEZCLA_ACTIVOS', 'success', {
        mezclaId: id_mezcla,
        activosCount: nuevos.length
      });
      return nuevos;
    }, {
      operation: 'UPDATE_MEZCLA_ACTIVOS',
      mezclaId: id_mezcla,
      userId: req.user?.id
    });
    res.json({
      success: true,
      message: 'Receta actualizada correctamente',
      data: nuevosActivos
    });
  });
  static obtenerActivosMezcla = (0,_utils_asyncHandler_js__WEBPACK_IMPORTED_MODULE_16__/* .asyncHandler */ .L)(async (req, res) => {
    const {
      id_mezcla
    } = req.params;
    const mezcla = await (0,_utils_transactionUtils_js__WEBPACK_IMPORTED_MODULE_13__/* .withDatabaseQuery */ .Y)(() => _schema_mezclas_catalogo_js__WEBPACK_IMPORTED_MODULE_3__/* .MezclaCatalogo */ .p.findByPk(id_mezcla, {
      include: [{
        model: _schema_mezcla_activos_js__WEBPACK_IMPORTED_MODULE_4__/* .MezclaActivos */ .k,
        include: [_schema_activo_mezcla_js__WEBPACK_IMPORTED_MODULE_0__/* .ActivoMezcla */ .B]
      }]
    }), {
      operation: 'GET_MEZCLA_ACTIVOS',
      mezclaId: id_mezcla,
      userId: req.user?.id
    });
    if (!mezcla) {
      throw new _utils_CustomError_js__WEBPACK_IMPORTED_MODULE_15__/* .NotFoundError */ .m_('Mezcla no encontrada', {
        id_mezcla
      });
    }
    res.json({
      success: true,
      data: mezcla
    });
  });

  // ========== PREPARACIÓN DE TANQUES EN CAMPO ==========
  static crearTanquePreparado = (0,_utils_asyncHandler_js__WEBPACK_IMPORTED_MODULE_16__/* .asyncHandler */ .L)(async (req, res) => {
    const logger = req.logger;
    const {
      id_tanque,
      mezclas,
      fecha_preparacion,
      litros_totales,
      id_rancho,
      codigo_tanque_preparado,
      tasa_inyeccion
    } = req.body;
    (0,_utils_errorHandlers_js__WEBPACK_IMPORTED_MODULE_14__/* .validateRequiredData */ .ip)({
      id_tanque,
      mezclas,
      fecha_preparacion,
      litros_totales,
      id_rancho,
      tasa_inyeccion
    }, ['id_tanque', 'mezclas', 'fecha_preparacion', 'litros_totales', 'id_rancho', 'tasa_inyeccion'], {
      operation: 'CREATE_TANQUE_PREPARADO'
    });
    if (!Array.isArray(mezclas) || mezclas.length === 0) {
      throw new _utils_CustomError_js__WEBPACK_IMPORTED_MODULE_15__/* .ValidationError */ .yI('Debe especificar al menos una mezcla', {
        field: 'mezclas'
      });
    }
    const nuevaTanquePreparado = await (0,_utils_transactionUtils_js__WEBPACK_IMPORTED_MODULE_13__/* .withTransaction */ .r)(async transaction => {
      const creado = await _schema_tanques_preparados_js__WEBPACK_IMPORTED_MODULE_8__/* .TanquesPreparados */ .t.create({
        id_tanque,
        id_rancho,
        fecha_preparacion,
        litros_totales,
        litros_disponibles: litros_totales,
        codigo_tanque_preparado: codigo_tanque_preparado || null,
        tasa_inyeccion: tasa_inyeccion || 0
      }, {
        transaction
      });
      const mezclasData = mezclas.map(m => ({
        id_tanque_preparado: creado.id,
        id_mezcla: m.id_mezcla,
        cantidad_litros: m.cantidad_litros
      }));
      await _schema_mezclas_tanque_js__WEBPACK_IMPORTED_MODULE_9__/* .MezclasTanque */ .e.bulkCreate(mezclasData, {
        transaction
      });
      logger.logOperation('CREATE_TANQUE_PREPARADO', 'success', {
        tanqueId: id_tanque,
        tanquePreparadoId: creado.id,
        mezclasCount: mezclas.length,
        litrosTotales: litros_totales,
        ranchoId: id_rancho
      });
      return creado;
    }, {
      operation: 'CREATE_TANQUE_PREPARADO',
      userId: req.user?.id
    });
    res.status(201).json({
      success: true,
      message: 'Tanque preparado registrado',
      data: nuevaTanquePreparado
    });
  });
  static getTanquesPreparados = (0,_utils_asyncHandler_js__WEBPACK_IMPORTED_MODULE_16__/* .asyncHandler */ .L)(async (req, res) => {
    const tanques = await (0,_utils_transactionUtils_js__WEBPACK_IMPORTED_MODULE_13__/* .withDatabaseQuery */ .Y)(async () => {
      return _schema_tanques_preparados_js__WEBPACK_IMPORTED_MODULE_8__/* .TanquesPreparados */ .t.findAll({
        where: {
          litros_disponibles: {
            [sequelize__WEBPACK_IMPORTED_MODULE_12__.Op.gt]: 0
          }
        },
        include: [{
          model: _schema_mezclas_tanque_js__WEBPACK_IMPORTED_MODULE_9__/* .MezclasTanque */ .e,
          include: [{
            model: _schema_mezclas_catalogo_js__WEBPACK_IMPORTED_MODULE_3__/* .MezclaCatalogo */ .p,
            attributes: ['nombre']
          }]
        }, {
          model: _schema_tanques_js__WEBPACK_IMPORTED_MODULE_1__/* .Tanques */ .C,
          attributes: ['codigo', 'etapa']
        }, {
          model: _schema_ranchos_js__WEBPACK_IMPORTED_MODULE_6__/* .Ranchos */ .h,
          attributes: ['rancho']
        }],
        order: [['fecha_preparacion', 'DESC']]
      });
    }, {
      operation: 'GET_TANQUES_PREPARADOS',
      userId: req.user?.id
    });
    res.json({
      success: true,
      data: tanques
    });
  });
  static getTanquesPreparadosPorRancho = (0,_utils_asyncHandler_js__WEBPACK_IMPORTED_MODULE_16__/* .asyncHandler */ .L)(async (req, res) => {
    const {
      id_rancho
    } = req.params;
    const tanques = await (0,_utils_transactionUtils_js__WEBPACK_IMPORTED_MODULE_13__/* .withDatabaseQuery */ .Y)(async () => {
      return _schema_tanques_preparados_js__WEBPACK_IMPORTED_MODULE_8__/* .TanquesPreparados */ .t.findAll({
        where: {
          id_rancho,
          litros_disponibles: {
            [sequelize__WEBPACK_IMPORTED_MODULE_12__.Op.gt]: 0
          }
        },
        include: [{
          model: _schema_mezclas_tanque_js__WEBPACK_IMPORTED_MODULE_9__/* .MezclasTanque */ .e,
          include: [{
            model: _schema_mezclas_catalogo_js__WEBPACK_IMPORTED_MODULE_3__/* .MezclaCatalogo */ .p,
            attributes: ['nombre']
          }]
        }, {
          model: _schema_tanques_js__WEBPACK_IMPORTED_MODULE_1__/* .Tanques */ .C,
          attributes: ['codigo', 'etapa']
        }, {
          model: _schema_ranchos_js__WEBPACK_IMPORTED_MODULE_6__/* .Ranchos */ .h,
          attributes: ['rancho']
        }],
        order: [['fecha_preparacion', 'DESC']]
      });
    }, {
      operation: 'GET_TANQUES_PREPARADOS_POR_RANCHO',
      userId: req.user?.id
    });
    res.json({
      success: true,
      data: tanques
    });
  });
  static getDetalleTanque = (0,_utils_asyncHandler_js__WEBPACK_IMPORTED_MODULE_16__/* .asyncHandler */ .L)(async (req, res) => {
    const {
      id
    } = req.params;
    const logger = req.logger;
    const logContext = {
      operation: 'GET_DETALLE_TANQUE',
      userId: req.user?.id
    };
    logger.info('Obteniendo detalle del tanque', logContext);
    const tanque = await (0,_utils_transactionUtils_js__WEBPACK_IMPORTED_MODULE_13__/* .withDatabaseQuery */ .Y)(() => _schema_tanques_preparados_js__WEBPACK_IMPORTED_MODULE_8__/* .TanquesPreparados */ .t.findByPk(id, {
      include: [{
        model: _schema_mezclas_tanque_js__WEBPACK_IMPORTED_MODULE_9__/* .MezclasTanque */ .e,
        attributes: ['cantidad_litros'],
        include: [{
          model: _schema_mezclas_catalogo_js__WEBPACK_IMPORTED_MODULE_3__/* .MezclaCatalogo */ .p,
          attributes: ['nombre', 'fabricante'],
          include: [{
            model: _schema_mezcla_activos_js__WEBPACK_IMPORTED_MODULE_4__/* .MezclaActivos */ .k,
            include: [{
              model: _schema_activo_mezcla_js__WEBPACK_IMPORTED_MODULE_0__/* .ActivoMezcla */ .B
            }]
          }]
        }]
      }, {
        model: _schema_tanques_js__WEBPACK_IMPORTED_MODULE_1__/* .Tanques */ .C
      }, {
        model: _schema_ranchos_js__WEBPACK_IMPORTED_MODULE_6__/* .Ranchos */ .h,
        include: [{
          model: _schema_rancho_dsa_js__WEBPACK_IMPORTED_MODULE_7__/* .RanchoDsa */ .M
        }]
      }]
    }), {
      operation: 'GET_DETALLE_TANQUE',
      userId: req.user?.id,
      tanqueId: id
    });
    logger.info('Detalle del tanque obtenido', {
      ...logContext,
      tanqueId: id
    });
    if (!tanque) throw new _utils_CustomError_js__WEBPACK_IMPORTED_MODULE_15__/* .NotFoundError */ .m_('Tanque preparado no encontrado', {
      id
    });
    res.json({
      success: true,
      message: 'Detalle de tanque obtenido',
      data: tanque
    });
  });
  static registrarAplicacion = (0,_utils_asyncHandler_js__WEBPACK_IMPORTED_MODULE_16__/* .asyncHandler */ .L)(async (req, res) => {
    const {
      id_tanque_preparado,
      id_sector,
      litros_aplicados,
      fecha,
      id_responsable
    } = req.body;
    (0,_utils_errorHandlers_js__WEBPACK_IMPORTED_MODULE_14__/* .validateRequiredData */ .ip)({
      id_tanque_preparado,
      id_sector,
      litros_aplicados,
      fecha,
      id_responsable
    }, ['id_tanque_preparado', 'id_sector', 'litros_aplicados', 'fecha', 'id_responsable'], {
      operation: 'REGISTER_APLICACION_TANQUE'
    });
    const resultado = await (0,_utils_transactionUtils_js__WEBPACK_IMPORTED_MODULE_13__/* .withTransaction */ .r)(async transaction => {
      const tanque = await _schema_tanques_preparados_js__WEBPACK_IMPORTED_MODULE_8__/* .TanquesPreparados */ .t.findByPk(id_tanque_preparado, {
        transaction
      });
      if (!tanque) throw new _utils_CustomError_js__WEBPACK_IMPORTED_MODULE_15__/* .NotFoundError */ .m_('Tanque no encontrado', {
        id_tanque_preparado
      });
      const disponibles = parseFloat(tanque.litros_disponibles);
      const aplicados = parseFloat(litros_aplicados);
      if (Number.isNaN(disponibles) || Number.isNaN(aplicados)) {
        throw new _utils_CustomError_js__WEBPACK_IMPORTED_MODULE_15__/* .ValidationError */ .yI('Valores numéricos inválidos', {
          litros_disponibles: tanque.litros_disponibles,
          litros_aplicados
        });
      }
      if (disponibles < aplicados) {
        throw new _utils_CustomError_js__WEBPACK_IMPORTED_MODULE_15__/* .BusinessError */ .H0(`Volumen insuficiente. Disponible: ${tanque.litros_disponibles}L`, {
          disponibles: tanque.litros_disponibles,
          solicitados: litros_aplicados
        });
      }
      const sector = await _schema_sectores_js__WEBPACK_IMPORTED_MODULE_2__/* .Sectores */ .d.findByPk(id_sector, {
        transaction
      });
      if (!sector) throw new _utils_CustomError_js__WEBPACK_IMPORTED_MODULE_15__/* .NotFoundError */ .m_('Sector no encontrado', {
        id_sector
      });
      const nuevaAplicacion = await _schema_aplicaciones_tanque_js__WEBPACK_IMPORTED_MODULE_5__/* .AplicacionesTanque */ .y.create({
        id_sector,
        id_tanque_preparado,
        id_responsable,
        fecha,
        litros_aplicados
      }, {
        transaction
      });
      const nuevosDisponibles = disponibles - aplicados;
      await tanque.update({
        litros_disponibles: nuevosDisponibles
      }, {
        transaction
      });
      return {
        nuevaAplicacion,
        nuevosDisponibles
      };
    }, {
      operation: 'REGISTER_APLICACION_TANQUE',
      userId: req.user?.id
    });
    res.status(201).json({
      success: true,
      message: 'Aplicación registrada correctamente',
      data: {
        ...resultado.nuevaAplicacion.toJSON(),
        litros_restantes: resultado.nuevosDisponibles
      }
    });
  });

  // ========== REPORTES - VISTAS ==========
  static renderReportes = (0,_utils_asyncHandler_js__WEBPACK_IMPORTED_MODULE_16__/* .asyncHandler */ .L)(async (req, res) => {
    res.render('pages/fertilizacion/reportes', {
      title: 'Reportes de Fertilización',
      user: req.user,
      rol: req.user.rol
    });
  });
  static reporteInventario = (0,_utils_asyncHandler_js__WEBPACK_IMPORTED_MODULE_16__/* .asyncHandler */ .L)(async (req, res) => {
    const results = await (0,_utils_transactionUtils_js__WEBPACK_IMPORTED_MODULE_13__/* .withDatabaseQuery */ .Y)(() => _db_db_js__WEBPACK_IMPORTED_MODULE_11__/* ["default"] */ .A.query('CALL sp_inventario_tanques()', {
      type: _db_db_js__WEBPACK_IMPORTED_MODULE_11__/* ["default"] */ .A.QueryTypes.RAW
    }), {
      operation: 'GET_REPORTE_INVENTARIO',
      userId: req.user?.id
    });
    res.json({
      success: true,
      message: 'Reporte de inventario generado',
      data: results[0]
    });
  });
  static reporteResumenAnual = (0,_utils_asyncHandler_js__WEBPACK_IMPORTED_MODULE_16__/* .asyncHandler */ .L)(async (req, res) => {
    const {
      anio
    } = req.query;
    (0,_utils_errorHandlers_js__WEBPACK_IMPORTED_MODULE_14__/* .validateRequiredData */ .ip)(req.query, ['anio'], {
      operation: 'REPORTE_RESUMEN_ANUAL'
    });
    const results = await (0,_utils_transactionUtils_js__WEBPACK_IMPORTED_MODULE_13__/* .withDatabaseQuery */ .Y)(() => _db_db_js__WEBPACK_IMPORTED_MODULE_11__/* ["default"] */ .A.query('CALL sp_resumen_anual(?)', {
      replacements: [parseInt(anio)],
      type: _db_db_js__WEBPACK_IMPORTED_MODULE_11__/* ["default"] */ .A.QueryTypes.RAW
    }), {
      operation: 'REPORTE_RESUMEN_ANUAL',
      userId: req.user?.id,
      anio
    });
    res.json({
      success: true,
      message: 'Reporte resumen anual generado',
      data: results[0]
    });
  });
  static reportePorVariedad = (0,_utils_asyncHandler_js__WEBPACK_IMPORTED_MODULE_16__/* .asyncHandler */ .L)(async (req, res) => {
    const {
      anio,
      mes
    } = req.query;
    (0,_utils_errorHandlers_js__WEBPACK_IMPORTED_MODULE_14__/* .validateRequiredData */ .ip)(req.query, ['anio', 'mes'], {
      operation: 'REPORTE_POR_VARIEDAD'
    });
    const results = await (0,_utils_transactionUtils_js__WEBPACK_IMPORTED_MODULE_13__/* .withDatabaseQuery */ .Y)(() => _db_db_js__WEBPACK_IMPORTED_MODULE_11__/* ["default"] */ .A.query('CALL sp_reporte_por_variedad(?, ?)', {
      replacements: [parseInt(anio), parseInt(mes)],
      type: _db_db_js__WEBPACK_IMPORTED_MODULE_11__/* ["default"] */ .A.QueryTypes.RAW
    }), {
      operation: 'REPORTE_POR_VARIEDAD',
      userId: req.user?.id,
      anio,
      mes
    });
    res.json({
      success: true,
      message: 'Reporte por variedad generado',
      data: results[0]
    });
  });
  static reporteMensualRancho = (0,_utils_asyncHandler_js__WEBPACK_IMPORTED_MODULE_16__/* .asyncHandler */ .L)(async (req, res) => {
    const {
      anio,
      mes,
      id_rancho
    } = req.query;
    (0,_utils_errorHandlers_js__WEBPACK_IMPORTED_MODULE_14__/* .validateRequiredData */ .ip)(req.query, ['anio', 'mes', 'id_rancho'], {
      operation: 'REPORTE_MENSUAL_RANCHO'
    });
    const results = await (0,_utils_transactionUtils_js__WEBPACK_IMPORTED_MODULE_13__/* .withDatabaseQuery */ .Y)(() => _db_db_js__WEBPACK_IMPORTED_MODULE_11__/* ["default"] */ .A.query('CALL sp_reporte_mensual_rancho(?, ?, ?)', {
      replacements: [parseInt(anio), parseInt(mes), parseInt(id_rancho)],
      type: _db_db_js__WEBPACK_IMPORTED_MODULE_11__/* ["default"] */ .A.QueryTypes.RAW
    }), {
      operation: 'REPORTE_MENSUAL_RANCHO',
      userId: req.user?.id,
      anio,
      mes,
      id_rancho
    });
    res.json({
      success: true,
      message: 'Reporte mensual por rancho obtenido',
      data: results[0]
    });
  });
  static reporteComparativoMensual = (0,_utils_asyncHandler_js__WEBPACK_IMPORTED_MODULE_16__/* .asyncHandler */ .L)(async (req, res) => {
    const {
      anio,
      id_rancho
    } = req.query;
    (0,_utils_errorHandlers_js__WEBPACK_IMPORTED_MODULE_14__/* .validateRequiredData */ .ip)(req.query, ['anio'], {
      operation: 'REPORTE_COMPARATIVO_MENSUAL'
    });
    const results = await (0,_utils_transactionUtils_js__WEBPACK_IMPORTED_MODULE_13__/* .withDatabaseQuery */ .Y)(() => _db_db_js__WEBPACK_IMPORTED_MODULE_11__/* ["default"] */ .A.query('CALL sp_comparativo_mensual(?, ?)', {
      replacements: [parseInt(anio), id_rancho ? parseInt(id_rancho) : null],
      type: _db_db_js__WEBPACK_IMPORTED_MODULE_11__/* ["default"] */ .A.QueryTypes.RAW
    }), {
      operation: 'REPORTE_COMPARATIVO_MENSUAL',
      userId: req.user?.id,
      anio,
      id_rancho
    });
    res.json({
      success: true,
      message: 'Reporte comparativo mensual obtenido',
      data: results[0]
    });
  });
  static reporteTopSectores = (0,_utils_asyncHandler_js__WEBPACK_IMPORTED_MODULE_16__/* .asyncHandler */ .L)(async (req, res) => {
    const {
      anio,
      mes,
      limite
    } = req.query;
    (0,_utils_errorHandlers_js__WEBPACK_IMPORTED_MODULE_14__/* .validateRequiredData */ .ip)(req.query, ['anio', 'mes'], {
      operation: 'REPORTE_TOP_SECTORES'
    });
    const results = await (0,_utils_transactionUtils_js__WEBPACK_IMPORTED_MODULE_13__/* .withDatabaseQuery */ .Y)(() => _db_db_js__WEBPACK_IMPORTED_MODULE_11__/* ["default"] */ .A.query('CALL sp_top_sectores(?, ?, ?)', {
      replacements: [parseInt(anio), parseInt(mes), limite ? parseInt(limite) : 10],
      type: _db_db_js__WEBPACK_IMPORTED_MODULE_11__/* ["default"] */ .A.QueryTypes.RAW
    }), {
      operation: 'REPORTE_TOP_SECTORES',
      userId: req.user?.id,
      anio,
      mes,
      limite
    });
    res.json({
      success: true,
      message: 'Top sectores obtenido',
      data: results[0]
    });
  });
  static registrarFertilizacion = (0,_utils_asyncHandler_js__WEBPACK_IMPORTED_MODULE_16__/* .asyncHandler */ .L)(async (req, res) => {
    const {
      id_sector,
      id_tanque_preparado,
      litros_aplicados,
      observaciones,
      temporada
    } = req.body;
    (0,_utils_errorHandlers_js__WEBPACK_IMPORTED_MODULE_14__/* .validateRequiredData */ .ip)({
      id_sector,
      id_tanque_preparado,
      litros_aplicados,
      temporada
    }, ['id_sector', 'id_tanque_preparado', 'litros_aplicados', 'temporada'], {
      operation: 'CREATE_FERTILIZACION'
    });
    const fertilizacion = await (0,_utils_transactionUtils_js__WEBPACK_IMPORTED_MODULE_13__/* .withTransaction */ .r)(async transaction => {
      const idResponsable = req.user?.id;
      if (!idResponsable) {
        throw new _utils_CustomError_js__WEBPACK_IMPORTED_MODULE_15__/* .ValidationError */ .yI('Usuario no autenticado', {
          field: 'user.id'
        });
      }
      await _db_db_js__WEBPACK_IMPORTED_MODULE_11__/* ["default"] */ .A.query('SET @p_id_fertilizacion = 0', {
        transaction,
        type: _db_db_js__WEBPACK_IMPORTED_MODULE_11__/* ["default"] */ .A.QueryTypes.RAW
      });
      await _db_db_js__WEBPACK_IMPORTED_MODULE_11__/* ["default"] */ .A.query('CALL sp_crear_fertilizacion(?, ?, ?, ?, ?, @p_id_fertilizacion, ?)', {
        replacements: [id_sector, idResponsable, id_tanque_preparado, litros_aplicados, observaciones || null, temporada],
        transaction,
        type: _db_db_js__WEBPACK_IMPORTED_MODULE_11__/* ["default"] */ .A.QueryTypes.RAW
      });
      const [outRow] = await _db_db_js__WEBPACK_IMPORTED_MODULE_11__/* ["default"] */ .A.query('SELECT @p_id_fertilizacion AS id', {
        transaction,
        type: _db_db_js__WEBPACK_IMPORTED_MODULE_11__/* ["default"] */ .A.QueryTypes.SELECT
      });
      if (!outRow?.id) {
        throw new _utils_CustomError_js__WEBPACK_IMPORTED_MODULE_15__/* .BusinessError */ .H0('No se pudo obtener el ID de la fertilización generada', {
          id_sector,
          id_tanque_preparado
        });
      }
      return {
        id: outRow.id,
        id_sector,
        id_responsable: idResponsable,
        id_tanque_preparado,
        litros_aplicados,
        observaciones: observaciones || null,
        temporada
      };
    }, {
      operation: 'CREATE_FERTILIZACION',
      userId: req.user?.id,
      id_sector
    });
    res.status(201).json({
      success: true,
      message: 'Fertilización registrada exitosamente',
      data: fertilizacion
    });
  });
  static registrarFertilizacionBulk = (0,_utils_asyncHandler_js__WEBPACK_IMPORTED_MODULE_16__/* .asyncHandler */ .L)(async (req, res) => {
    const {
      sectores,
      id_tanque_preparado,
      horas_aplicadas,
      observaciones,
      temporada
    } = req.body;
    (0,_utils_errorHandlers_js__WEBPACK_IMPORTED_MODULE_14__/* .validateRequiredData */ .ip)({
      sectores,
      id_tanque_preparado,
      horas_aplicadas,
      temporada
    }, ['sectores', 'id_tanque_preparado', 'horas_aplicadas', 'temporada'], {
      operation: 'CREATE_FERTILIZACION_BULK'
    });
    if (!Array.isArray(sectores) || sectores.length === 0) {
      throw new _utils_CustomError_js__WEBPACK_IMPORTED_MODULE_15__/* .ValidationError */ .yI('Debe especificar al menos un sector', {
        field: 'sectores'
      });
    }
    const idsCreados = await (0,_utils_transactionUtils_js__WEBPACK_IMPORTED_MODULE_13__/* .withTransaction */ .r)(async transaction => {
      const idResponsable = req.user?.id;
      if (!idResponsable) {
        throw new _utils_CustomError_js__WEBPACK_IMPORTED_MODULE_15__/* .ValidationError */ .yI('Usuario no autenticado', {
          field: 'user.id'
        });
      }

      // 1. Obtener información del tanque
      const tanque = await _schema_tanques_preparados_js__WEBPACK_IMPORTED_MODULE_8__/* .TanquesPreparados */ .t.findByPk(id_tanque_preparado, {
        transaction
      });
      if (!tanque) throw new _utils_CustomError_js__WEBPACK_IMPORTED_MODULE_15__/* .NotFoundError */ .m_('Tanque preparado no encontrado', {
        id_tanque_preparado
      });
      const tasa = parseFloat(tanque.tasa_inyeccion || 0);
      const litrosTotales = parseFloat(horas_aplicadas) * tasa;
      if (parseFloat(tanque.litros_disponibles) < litrosTotales - 0.01) {
        throw new _utils_CustomError_js__WEBPACK_IMPORTED_MODULE_15__/* .BusinessError */ .H0(`Volumen insuficiente en el tanque. Disponible: ${tanque.litros_disponibles}L, Requerido: ${litrosTotales.toFixed(2)}L`);
      }

      // 2. Obtener hectáreas de los sectores para distribución proporcional
      const sectoresData = await _schema_sectores_js__WEBPACK_IMPORTED_MODULE_2__/* .Sectores */ .d.findAll({
        where: {
          id: sectores
        },
        attributes: ['id', 'hectareas'],
        transaction
      });
      if (sectoresData.length === 0) {
        throw new _utils_CustomError_js__WEBPACK_IMPORTED_MODULE_15__/* .NotFoundError */ .m_('No se encontraron los sectores seleccionados');
      }
      const hectareasTotales = sectoresData.reduce((sum, s) => sum + parseFloat(s.hectareas || 0), 0);
      if (hectareasTotales <= 0) {
        throw new _utils_CustomError_js__WEBPACK_IMPORTED_MODULE_15__/* .BusinessError */ .H0('La suma de las hectáreas de los sectores seleccionados debe ser mayor a cero');
      }
      const createdIds = [];

      // 3. Registrar fertilización para cada sector
      for (const sector of sectoresData) {
        const haSector = parseFloat(sector.hectareas || 0);
        const litrosProporcionales = haSector / hectareasTotales * litrosTotales;

        // Llamar al SP para cada sector
        await _db_db_js__WEBPACK_IMPORTED_MODULE_11__/* ["default"] */ .A.query('SET @p_id_fertilizacion = 0', {
          transaction,
          type: _db_db_js__WEBPACK_IMPORTED_MODULE_11__/* ["default"] */ .A.QueryTypes.RAW
        });
        await _db_db_js__WEBPACK_IMPORTED_MODULE_11__/* ["default"] */ .A.query('CALL sp_crear_fertilizacion(?, ?, ?, ?, ?, @p_id_fertilizacion, ?)', {
          replacements: [sector.id, idResponsable, id_tanque_preparado, litrosProporcionales.toFixed(2), observaciones || null, temporada],
          transaction,
          type: _db_db_js__WEBPACK_IMPORTED_MODULE_11__/* ["default"] */ .A.QueryTypes.RAW
        });
        const [outRow] = await _db_db_js__WEBPACK_IMPORTED_MODULE_11__/* ["default"] */ .A.query('SELECT @p_id_fertilizacion AS id', {
          transaction,
          type: _db_db_js__WEBPACK_IMPORTED_MODULE_11__/* ["default"] */ .A.QueryTypes.SELECT
        });
        if (outRow?.id) createdIds.push(outRow.id);
      }
      return createdIds;
    }, {
      operation: 'CREATE_FERTILIZACION_BULK',
      userId: req.user?.id
    });
    res.status(201).json({
      success: true,
      message: 'Fertilización múltiple registrada exitosamente',
      data: {
        ids: idsCreados
      }
    });
  });
  static obtenerFertilizaciones = (0,_utils_asyncHandler_js__WEBPACK_IMPORTED_MODULE_16__/* .asyncHandler */ .L)(async (req, res) => {
    const {
      anio,
      mes
    } = req.query;
    (0,_utils_errorHandlers_js__WEBPACK_IMPORTED_MODULE_14__/* .validateRequiredData */ .ip)(req.query, ['anio', 'mes'], {
      operation: 'OBTENER_FERTILIZACIONES'
    });
    const results = await (0,_utils_transactionUtils_js__WEBPACK_IMPORTED_MODULE_13__/* .withDatabaseQuery */ .Y)(() => _db_db_js__WEBPACK_IMPORTED_MODULE_11__/* ["default"] */ .A.query('CALL sp_obtener_fertilizaciones(?, ?)', {
      replacements: [parseInt(anio), parseInt(mes)],
      type: _db_db_js__WEBPACK_IMPORTED_MODULE_11__/* ["default"] */ .A.QueryTypes.RAW
    }), {
      operation: 'OBTENER_FERTILIZACIONES',
      userId: req.user?.id,
      anio,
      mes
    });
    res.json({
      success: true,
      message: 'Fertilizaciones obtenidas exitosamente',
      data: results[0]
    });
  });
  static reporteSemanal = (0,_utils_asyncHandler_js__WEBPACK_IMPORTED_MODULE_16__/* .asyncHandler */ .L)(async (req, res) => {
    const {
      anio,
      mes
    } = req.query;
    (0,_utils_errorHandlers_js__WEBPACK_IMPORTED_MODULE_14__/* .validateRequiredData */ .ip)(req.query, ['anio', 'mes'], {
      operation: 'REPORTE_SEMANAL'
    });
    const results = await (0,_utils_transactionUtils_js__WEBPACK_IMPORTED_MODULE_13__/* .withDatabaseQuery */ .Y)(() => _db_db_js__WEBPACK_IMPORTED_MODULE_11__/* ["default"] */ .A.query('CALL sp_reporte_semanal_v2(?, ?)', {
      replacements: [parseInt(anio), parseInt(mes)],
      type: _db_db_js__WEBPACK_IMPORTED_MODULE_11__/* ["default"] */ .A.QueryTypes.RAW
    }), {
      operation: 'REPORTE_SEMANAL',
      userId: req.user?.id,
      anio,
      mes
    });
    res.json({
      success: true,
      message: 'Reporte semanal V2 generado',
      data: results[0]
    });
  });
  static agregarTanque = (0,_utils_asyncHandler_js__WEBPACK_IMPORTED_MODULE_16__/* .asyncHandler */ .L)(async (req, res) => {
    const {
      id
    } = req.params;
    const {
      id_tanque,
      litros_aplicados
    } = req.body;
    (0,_utils_errorHandlers_js__WEBPACK_IMPORTED_MODULE_14__/* .validateRequiredData */ .ip)({
      id,
      id_tanque,
      litros_aplicados
    }, ['id', 'id_tanque', 'litros_aplicados'], {
      operation: 'ADD_TANQUE_FERTILIZACION'
    });
    const resultado = await (0,_utils_transactionUtils_js__WEBPACK_IMPORTED_MODULE_13__/* .withTransaction */ .r)(async transaction => {
      const fertilizacion = await (0,_utils_transactionUtils_js__WEBPACK_IMPORTED_MODULE_13__/* .withDatabaseQuery */ .Y)(() => _db_db_js__WEBPACK_IMPORTED_MODULE_11__/* ["default"] */ .A.query('SELECT * FROM fertilizaciones WHERE id = ?', {
        replacements: [id],
        type: _db_db_js__WEBPACK_IMPORTED_MODULE_11__/* ["default"] */ .A.QueryTypes.SELECT,
        transaction
      }));
      if (!fertilizacion || fertilizacion.length === 0) {
        throw new _utils_CustomError_js__WEBPACK_IMPORTED_MODULE_15__/* .NotFoundError */ .m_('Fertilización no encontrada', {
          id
        });
      }
      const tanque = await _schema_tanques_preparados_js__WEBPACK_IMPORTED_MODULE_8__/* .TanquesPreparados */ .t.findByPk(id_tanque, {
        transaction,
        lock: transaction.LOCK_UPDATE
      });
      if (!tanque) throw new _utils_CustomError_js__WEBPACK_IMPORTED_MODULE_15__/* .NotFoundError */ .m_('Tanque preparado no encontrado', {
        id_tanque
      });
      if (parseFloat(tanque.litros_disponibles) < parseFloat(litros_aplicados)) {
        throw new _utils_CustomError_js__WEBPACK_IMPORTED_MODULE_15__/* .BusinessError */ .H0(`Litros insuficientes. Disponibles: ${tanque.litros_disponibles}`, {
          disponible: tanque.litros_disponibles,
          solicitado: litros_aplicados
        });
      }
      await _db_db_js__WEBPACK_IMPORTED_MODULE_11__/* ["default"] */ .A.query(`INSERT INTO detalle_fertilizacion_tanques (id_fertilizacion, id_tanque_preparado, litros_aplicados)
                     VALUES (?, ?, ?)`, {
        replacements: [id, id_tanque, litros_aplicados],
        transaction
      });
      await tanque.update({
        litros_disponibles: _db_db_js__WEBPACK_IMPORTED_MODULE_11__/* ["default"] */ .A.literal(`litros_disponibles - ${litros_aplicados}`)
      }, {
        transaction
      });
      return {
        message: 'Tanque agregado correctamente',
        id_fertilizacion: id
      };
    }, {
      operation: 'ADD_TANQUE_FERTILIZACION',
      userId: req.user?.id,
      fertilizacionId: id
    });
    res.json({
      success: true,
      message: 'Tanque agregado a la fertilización',
      data: resultado
    });
  });
  static reporteFertilizacionCompleto = (0,_utils_asyncHandler_js__WEBPACK_IMPORTED_MODULE_16__/* .asyncHandler */ .L)(async (req, res) => {
    const {
      anio,
      mes,
      id_rancho_dsa,
      id_sector,
      temporada
    } = req.query;
    const results = await (0,_utils_transactionUtils_js__WEBPACK_IMPORTED_MODULE_13__/* .withDatabaseQuery */ .Y)(async () => {
      let query = 'SELECT * FROM npk_fertilizacion_completo WHERE 1=1';
      const replacements = [];
      if (anio) {
        query += ' AND anio = ?';
        replacements.push(parseInt(anio));
      }
      if (mes) {
        query += ' AND mes = ?';
        replacements.push(parseInt(mes));
      }
      if (id_rancho_dsa) {
        query += ' AND id_rancho_dsa = ?';
        replacements.push(parseInt(id_rancho_dsa));
      }
      if (id_sector) {
        query += ' AND id_sector = ?';
        replacements.push(parseInt(id_sector));
      }
      if (temporada) {
        query += ' AND temporada = ?';
        replacements.push(temporada);
      }
      query += ' ORDER BY fecha DESC';
      return await _db_db_js__WEBPACK_IMPORTED_MODULE_11__/* ["default"] */ .A.query(query, {
        replacements,
        type: _db_db_js__WEBPACK_IMPORTED_MODULE_11__/* ["default"] */ .A.QueryTypes.SELECT
      });
    }, {
      operation: 'GET_REPORTE_FERTILIZACION_COMPLETO',
      userId: req.user?.id
    });
    res.json({
      success: true,
      data: results
    });
  });
  static getDetalleTanquesPorCodigos = (0,_utils_asyncHandler_js__WEBPACK_IMPORTED_MODULE_16__/* .asyncHandler */ .L)(async (req, res) => {
    const {
      codigos
    } = req.query;
    if (!codigos) {
      return res.json({
        success: true,
        data: []
      });
    }
    const listaCodigos = codigos.split(',').map(c => c.trim()).filter(Boolean);
    if (listaCodigos.length === 0) {
      return res.json({
        success: true,
        data: []
      });
    }
    const resultado = await (0,_utils_transactionUtils_js__WEBPACK_IMPORTED_MODULE_13__/* .withDatabaseQuery */ .Y)(async () => {
      // Obtener tanques preparados con sus mezclas y activos
      const placeholders = listaCodigos.map(() => '?').join(',');
      const tanques = await _db_db_js__WEBPACK_IMPORTED_MODULE_11__/* ["default"] */ .A.query(`SELECT 
                        tp.id,
                        tp.codigo_tanque_preparado AS codigo,
                        tp.litros_totales,
                        tp.fecha_preparacion,
                        rd.nombre_rancho_dsa AS rancho,
                        mc.nombre AS nombre_mezcla,
                        mc.fabricante,
                        mt.cantidad_litros AS litros_mezcla,
                        am.nombre AS nombre_activo,
                        am.codigo AS codigo_activo,
                        ma.porcentaje,
                        am.unidad
                    FROM tanques_preparados tp
                    LEFT JOIN ranchos r ON r.id = tp.id_rancho
                    LEFT JOIN rancho_dsa rd on rd.id_rancho=r.id
                    LEFT JOIN mezclas_tanque mt ON mt.id_tanque_preparado = tp.id
                    LEFT JOIN mezclas mc ON mc.id = mt.id_mezcla
                    LEFT JOIN mezcla_activos ma ON ma.id_mezcla = mc.id
                    LEFT JOIN activo_mezcla am ON am.id = ma.id_activo
                    WHERE tp.codigo_tanque_preparado IN (${placeholders})
                    ORDER BY tp.codigo_tanque_preparado, mc.nombre, am.nombre`, {
        replacements: listaCodigos,
        type: _db_db_js__WEBPACK_IMPORTED_MODULE_11__/* ["default"] */ .A.QueryTypes.SELECT
      });

      // Agrupar por código de tanque
      const agrupado = {};
      tanques.forEach(row => {
        const cod = row.codigo;
        if (!agrupado[cod]) {
          agrupado[cod] = {
            codigo: cod,
            litros_totales: row.litros_totales,
            fecha_preparacion: row.fecha_preparacion,
            rancho: row.rancho,
            mezclas: {}
          };
        }
        if (row.nombre_mezcla) {
          const mezKey = row.nombre_mezcla;
          if (!agrupado[cod].mezclas[mezKey]) {
            agrupado[cod].mezclas[mezKey] = {
              nombre: row.nombre_mezcla,
              fabricante: row.fabricante,
              litros: row.litros_mezcla,
              activos: []
            };
          }
          if (row.nombre_activo) {
            agrupado[cod].mezclas[mezKey].activos.push({
              nombre: row.nombre_activo,
              codigo: row.codigo_activo,
              porcentaje: row.porcentaje,
              unidad: row.unidad
            });
          }
        }
      });

      // Convertir mezclas de objeto a array
      return Object.values(agrupado).map(t => ({
        ...t,
        mezclas: Object.values(t.mezclas)
      }));
    }, {
      operation: 'GET_DETALLE_TANQUES_POR_CODIGOS',
      userId: req.user?.id
    });
    res.json({
      success: true,
      data: resultado
    });
  });
  static duplicarTanquePreparado = (0,_utils_asyncHandler_js__WEBPACK_IMPORTED_MODULE_16__/* .asyncHandler */ .L)(async (req, res) => {
    const {
      id
    } = req.params;
    const logger = req.logger;
    const logContext = {
      operation: 'DUPLICAR_TANQUE_PREPARADO',
      userId: req.user?.id
    };
    logger.info('Iniciando duplicación de tanque preparado', {
      ...logContext,
      tanqueId: id
    });

    // Obtener el tanque original con todas sus mezclas
    const tanqueOriginal = await (0,_utils_transactionUtils_js__WEBPACK_IMPORTED_MODULE_13__/* .withDatabaseQuery */ .Y)(() => _schema_tanques_preparados_js__WEBPACK_IMPORTED_MODULE_8__/* .TanquesPreparados */ .t.findByPk(id, {
      include: [{
        model: _schema_mezclas_tanque_js__WEBPACK_IMPORTED_MODULE_9__/* .MezclasTanque */ .e,
        include: [{
          model: _schema_mezclas_catalogo_js__WEBPACK_IMPORTED_MODULE_3__/* .MezclaCatalogo */ .p,
          include: [{
            model: _schema_mezcla_activos_js__WEBPACK_IMPORTED_MODULE_4__/* .MezclaActivos */ .k,
            include: [{
              model: _schema_activo_mezcla_js__WEBPACK_IMPORTED_MODULE_0__/* .ActivoMezcla */ .B
            }]
          }]
        }]
      }, {
        model: _schema_tanques_js__WEBPACK_IMPORTED_MODULE_1__/* .Tanques */ .C
      }, {
        model: _schema_ranchos_js__WEBPACK_IMPORTED_MODULE_6__/* .Ranchos */ .h,
        include: [{
          model: _schema_rancho_dsa_js__WEBPACK_IMPORTED_MODULE_7__/* .RanchoDsa */ .M
        }]
      }]
    }), {
      operation: 'GET_TANQUE_ORIGINAL_PARA_DUPLICAR',
      userId: req.user?.id,
      tanqueId: id
    });
    if (!tanqueOriginal) {
      throw new _utils_CustomError_js__WEBPACK_IMPORTED_MODULE_15__/* .NotFoundError */ .m_('Tanque preparado no encontrado', {
        id
      });
    }

    // Iniciar transacción para garantizar consistencia
    const resultado = await (0,_utils_transactionUtils_js__WEBPACK_IMPORTED_MODULE_13__/* .withDatabaseQuery */ .Y)(async transaction => {
      // Generar código basado en el código original del tanque
      const codigoOriginal = tanqueOriginal.codigo_tanque_preparado || 'TANQUE-SIN-CODIGO';

      // Buscar duplicados existentes con el mismo código base
      const existingDuplicates = await _schema_tanques_preparados_js__WEBPACK_IMPORTED_MODULE_8__/* .TanquesPreparados */ .t.findAll({
        where: {
          codigo_tanque_preparado: {
            [sequelize__WEBPACK_IMPORTED_MODULE_12__.Op.like]: `${codigoOriginal}-%`
          }
        },
        attributes: ['codigo_tanque_preparado'],
        order: [['codigo_tanque_preparado', 'ASC']],
        transaction
      });

      // Extraer el número más alto de los duplicados existentes
      let maxSuffix = 0;
      existingDuplicates.forEach(tanque => {
        const codigo = tanque.codigo_tanque_preparado;
        const match = codigo.match(new RegExp(`^${codigoOriginal}-(\\d+)$`));
        if (match) {
          const suffix = parseInt(match[1], 10);
          if (suffix > maxSuffix) {
            maxSuffix = suffix;
          }
        }
      });

      // Generar nuevo código con sufijo incremental
      const codigoTanquePreparado = `${codigoOriginal}-${maxSuffix + 1}`;

      // Crear nuevo tanque preparado
      const nuevoTanque = await _schema_tanques_preparados_js__WEBPACK_IMPORTED_MODULE_8__/* .TanquesPreparados */ .t.create({
        id_tanque: tanqueOriginal.id_tanque,
        id_rancho: tanqueOriginal.id_rancho,
        litros_totales: tanqueOriginal.litros_totales,
        litros_disponibles: tanqueOriginal.litros_totales,
        fecha_preparacion: new Date(),
        estado: 'preparado',
        codigo_tanque_preparado: codigoTanquePreparado,
        creado_por: req.user?.id
      }, {
        transaction
      });

      // Duplicar todas las mezclas
      if (tanqueOriginal.MezclasTanques && tanqueOriginal.MezclasTanques.length > 0) {
        for (const mezclaOriginal of tanqueOriginal.MezclasTanques) {
          await _schema_mezclas_tanque_js__WEBPACK_IMPORTED_MODULE_9__/* .MezclasTanque */ .e.create({
            id_tanque_preparado: nuevoTanque.id,
            id_mezcla: mezclaOriginal.id_mezcla,
            cantidad_litros: mezclaOriginal.cantidad_litros
          }, {
            transaction
          });
        }
      }

      // Obtener el tanque creado con todas sus relaciones
      const tanqueCreado = await _schema_tanques_preparados_js__WEBPACK_IMPORTED_MODULE_8__/* .TanquesPreparados */ .t.findByPk(nuevoTanque.id, {
        include: [{
          model: _schema_mezclas_tanque_js__WEBPACK_IMPORTED_MODULE_9__/* .MezclasTanque */ .e,
          include: [{
            model: _schema_mezclas_catalogo_js__WEBPACK_IMPORTED_MODULE_3__/* .MezclaCatalogo */ .p,
            include: [{
              model: _schema_mezcla_activos_js__WEBPACK_IMPORTED_MODULE_4__/* .MezclaActivos */ .k,
              include: [{
                model: _schema_activo_mezcla_js__WEBPACK_IMPORTED_MODULE_0__/* .ActivoMezcla */ .B
              }]
            }]
          }]
        }, {
          model: _schema_tanques_js__WEBPACK_IMPORTED_MODULE_1__/* .Tanques */ .C
        }, {
          model: _schema_ranchos_js__WEBPACK_IMPORTED_MODULE_6__/* .Ranchos */ .h,
          include: [{
            model: _schema_rancho_dsa_js__WEBPACK_IMPORTED_MODULE_7__/* .RanchoDsa */ .M
          }]
        }],
        transaction
      });
      return tanqueCreado;
    }, {
      operation: 'DUPLICAR_TANQUE_PREPARADO',
      userId: req.user?.id,
      tanqueOriginalId: id,
      nuevoTanqueId: null
    });
    logger.info('Tanque duplicado exitosamente', {
      ...logContext,
      tanqueOriginalId: id,
      nuevoTanqueId: resultado.id
    });
    res.json({
      success: true,
      message: 'Tanque duplicado exitosamente',
      data: resultado
    });
  });
  static reporteExcelFertilizacion = (0,_utils_asyncHandler_js__WEBPACK_IMPORTED_MODULE_16__/* .asyncHandler */ .L)(async (req, res) => {
    const {
      anio,
      mes,
      id_rancho_dsa,
      id_sector,
      temporada
    } = req.query;
    const data = await (0,_utils_transactionUtils_js__WEBPACK_IMPORTED_MODULE_13__/* .withDatabaseQuery */ .Y)(async () => {
      let query = 'SELECT * FROM npk_fertilizacion_completo WHERE 1=1';
      const replacements = [];
      if (anio) {
        query += ' AND anio = ?';
        replacements.push(parseInt(anio));
      }
      if (mes) {
        query += ' AND mes = ?';
        replacements.push(parseInt(mes));
      }
      if (id_rancho_dsa) {
        query += ' AND id_rancho_dsa = ?';
        replacements.push(parseInt(id_rancho_dsa));
      }
      if (id_sector) {
        query += ' AND id_sector = ?';
        replacements.push(parseInt(id_sector));
      }
      if (temporada) {
        query += ' AND temporada = ?';
        replacements.push(temporada);
      }
      query += ' ORDER BY fecha DESC';
      return await _db_db_js__WEBPACK_IMPORTED_MODULE_11__/* ["default"] */ .A.query(query, {
        replacements,
        type: _db_db_js__WEBPACK_IMPORTED_MODULE_11__/* ["default"] */ .A.QueryTypes.SELECT
      });
    }, {
      operation: 'EXPORT_EXCEL_FERTILIZACION',
      userId: req.user?.id
    });
    if (!data || data.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No hay datos para exportar'
      });
    }
    const workbook = new exceljs__WEBPACK_IMPORTED_MODULE_10__["default"].Workbook();

    // 1. Hoja de Detalle de Fertilizaciones
    const worksheetDetalle = workbook.addWorksheet('Detalle Fertilizaciones');
    worksheetDetalle.columns = [{
      header: 'Fecha',
      key: 'fecha',
      width: 15
    }, {
      header: 'Rancho DSA',
      key: 'nombre_rancho_dsa',
      width: 20
    }, {
      header: 'Sector',
      key: 'sector_interno',
      width: 15
    }, {
      header: 'Variedad',
      key: 'variedad',
      width: 15
    }, {
      header: 'Hectáreas',
      key: 'hectareas',
      width: 12
    }, {
      header: 'Tanque',
      key: 'codigo_tanque_preparado',
      width: 18
    }, {
      header: 'Litros Aplicados',
      key: 'litros_aplicados',
      width: 15
    }, {
      header: 'N (kg)',
      key: 'N_kg',
      width: 12
    }, {
      header: 'P (kg)',
      key: 'P_kg',
      width: 12
    }, {
      header: 'K (kg)',
      key: 'K_kg',
      width: 12
    }, {
      header: 'N/ha',
      key: 'N_kg_ha',
      width: 12
    }, {
      header: 'P/ha',
      key: 'P_kg_ha',
      width: 12
    }, {
      header: 'K/ha',
      key: 'K_kg_ha',
      width: 12
    }, {
      header: 'Temporada',
      key: 'temporada',
      width: 12
    }];
    worksheetDetalle.addRows(data);

    // 2. Hoja de KPIs Generales
    const worksheetKPIs = workbook.addWorksheet('KPIs Generales');

    // Calcular KPIs
    const totalEventos = data.length;
    const totalLitros = data.reduce((acc, curr) => acc + (parseFloat(curr.litros_aplicados) || 0), 0);
    const tanquesUnicos = [...new Set(data.map(d => d.codigo_tanque_preparado))].length;
    const totalHectareas = data.reduce((acc, curr) => acc + (parseFloat(curr.hectareas) || 0), 0);
    const totalN = data.reduce((acc, curr) => acc + (parseFloat(curr.N_kg) || 0), 0);
    const totalP = data.reduce((acc, curr) => acc + (parseFloat(curr.P_kg) || 0), 0);
    const totalK = data.reduce((acc, curr) => acc + (parseFloat(curr.K_kg) || 0), 0);
    worksheetKPIs.columns = [{
      header: 'Indicador',
      key: 'indicador',
      width: 25
    }, {
      header: 'Valor',
      key: 'valor',
      width: 20
    }];
    worksheetKPIs.addRows([{
      indicador: 'Total Fertilizaciones',
      valor: totalEventos
    }, {
      indicador: 'Total Litros Aplicados',
      valor: totalLitros.toFixed(2)
    }, {
      indicador: 'Total Tanques Utilizados',
      valor: tanquesUnicos
    }, {
      indicador: 'Total Hectáreas',
      valor: totalHectareas.toFixed(2)
    }, {
      indicador: 'Total Nitrógeno (kg)',
      valor: totalN.toFixed(2)
    }, {
      indicador: 'Total Fósforo (kg)',
      valor: totalP.toFixed(2)
    }, {
      indicador: 'Total Potasio (kg)',
      valor: totalK.toFixed(2)
    }]);

    // 3. Hoja de NPK por Rancho
    const worksheetRancho = workbook.addWorksheet('NPK por Rancho');
    const npkPorRancho = {};
    data.forEach(row => {
      const key = row.nombre_rancho_dsa || 'Sin definir';
      if (!npkPorRancho[key]) npkPorRancho[key] = {
        N: 0,
        P: 0,
        K: 0,
        ha: 0
      };
      npkPorRancho[key].N += parseFloat(row.N_kg) || 0;
      npkPorRancho[key].P += parseFloat(row.P_kg) || 0;
      npkPorRancho[key].K += parseFloat(row.K_kg) || 0;
      npkPorRancho[key].ha += parseFloat(row.hectareas) || 0;
    });
    worksheetRancho.columns = [{
      header: 'Rancho DSA',
      key: 'rancho',
      width: 25
    }, {
      header: 'N (kg)',
      key: 'N',
      width: 15
    }, {
      header: 'P (kg)',
      key: 'P',
      width: 15
    }, {
      header: 'K (kg)',
      key: 'K',
      width: 15
    }, {
      header: 'N/ha',
      key: 'N_ha',
      width: 15
    }, {
      header: 'P/ha',
      key: 'P_ha',
      width: 15
    }, {
      header: 'K/ha',
      key: 'K_ha',
      width: 15
    }];
    Object.entries(npkPorRancho).sort(([, a], [, b]) => b.N - a.N).forEach(([nombre, npk]) => {
      const ha = npk.ha || 1;
      worksheetRancho.addRow({
        rancho: nombre,
        N: npk.N.toFixed(2),
        P: npk.P.toFixed(2),
        K: npk.K.toFixed(2),
        N_ha: (npk.N / ha).toFixed(2),
        P_ha: (npk.P / ha).toFixed(2),
        K_ha: (npk.K / ha).toFixed(2)
      });
    });

    // 4. Hoja de Tanques y Composición
    const worksheetTanques = workbook.addWorksheet('Tanques y Composición');

    // Obtener códigos únicos de tanques
    const codigosTanques = [...new Set(data.map(d => d.codigo_tanque_preparado).filter(Boolean))];
    if (codigosTanques.length > 0) {
      // Obtener detalle de tanques
      const placeholders = codigosTanques.map(() => '?').join(',');
      const detalleTanques = await _db_db_js__WEBPACK_IMPORTED_MODULE_11__/* ["default"] */ .A.query(`SELECT 
                    tp.codigo_tanque_preparado AS codigo,
                    tp.litros_totales,
                    tp.fecha_preparacion,
                    rd.nombre_rancho_dsa AS rancho,
                    mc.nombre AS nombre_mezcla,
                    mc.fabricante,
                    mt.cantidad_litros AS litros_mezcla,
                    am.nombre AS nombre_activo,
                    am.codigo AS codigo_activo,
                    ma.porcentaje,
                    am.unidad,
                    (mt.cantidad_litros * ma.porcentaje / 100) AS litros_activo
                FROM tanques_preparados tp
                LEFT JOIN ranchos r ON r.id = tp.id_rancho
                LEFT JOIN rancho_dsa rd on rd.id_rancho=r.id
                LEFT JOIN mezclas_tanque mt ON mt.id_tanque_preparado = tp.id
                LEFT JOIN mezclas mc ON mc.id = mt.id_mezcla
                LEFT JOIN mezcla_activos ma ON ma.id_mezcla = mc.id
                LEFT JOIN activo_mezcla am ON am.id = ma.id_activo
                WHERE tp.codigo_tanque_preparado IN (${placeholders})
                ORDER BY tp.codigo_tanque_preparado, mc.nombre, am.nombre`, {
        replacements: codigosTanques,
        type: _db_db_js__WEBPACK_IMPORTED_MODULE_11__/* ["default"] */ .A.QueryTypes.SELECT
      });

      // Agrupar tanques
      const tanquesAgrupados = {};
      detalleTanques.forEach(row => {
        const cod = row.codigo;
        if (!tanquesAgrupados[cod]) {
          tanquesAgrupados[cod] = {
            codigo: cod,
            litros_totales: row.litros_totales,
            fecha_preparacion: row.fecha_preparacion,
            rancho: row.rancho,
            mezclas: {}
          };
        }
        if (row.nombre_mezcla) {
          const mezKey = row.nombre_mezcla;
          if (!tanquesAgrupados[cod].mezclas[mezKey]) {
            tanquesAgrupados[cod].mezclas[mezKey] = {
              nombre: row.nombre_mezcla,
              fabricante: row.fabricante,
              litros: row.litros_mezcla,
              activos: []
            };
          }
          if (row.nombre_activo) {
            tanquesAgrupados[cod].mezclas[mezKey].activos.push({
              nombre: row.nombre_activo,
              codigo: row.codigo_activo,
              porcentaje: row.porcentaje,
              unidad: row.unidad,
              litros_activo: row.litros_activo
            });
          }
        }
      });

      // Agregar encabezados
      worksheetTanques.columns = [{
        header: 'Tanque',
        key: 'tanque',
        width: 15
      }, {
        header: 'Rancho',
        key: 'rancho',
        width: 20
      }, {
        header: 'Fecha Preparación',
        key: 'fecha',
        width: 15
      }, {
        header: 'Litros Totales',
        key: 'litros_totales',
        width: 12
      }, {
        header: 'Mezcla',
        key: 'mezcla',
        width: 20
      }, {
        header: 'Fabricante',
        key: 'fabricante',
        width: 15
      }, {
        header: 'Litros Mezcla',
        key: 'litros_mezcla',
        width: 12
      }, {
        header: 'Activo',
        key: 'activo',
        width: 20
      }, {
        header: 'Código Activo',
        key: 'codigo_activo',
        width: 12
      }, {
        header: 'Porcentaje',
        key: 'porcentaje',
        width: 10
      }, {
        header: 'Litros Activo',
        key: 'litros_activo',
        width: 12
      }, {
        header: 'Unidad',
        key: 'unidad',
        width: 8
      }];

      // Agregar datos de tanques
      Object.values(tanquesAgrupados).forEach(tanque => {
        if (Object.keys(tanque.mezclas).length === 0) {
          worksheetTanques.addRow({
            tanque: tanque.codigo,
            rancho: tanque.rancho,
            fecha: tanque.fecha_preparacion,
            litros_totales: tanque.litros_totales,
            mezcla: 'Sin mezclas',
            fabricante: '',
            litros_mezcla: '',
            activo: '',
            codigo_activo: '',
            porcentaje: '',
            litros_activo: '',
            unidad: ''
          });
        } else {
          Object.values(tanque.mezclas).forEach((mezcla, idx) => {
            if (mezcla.activos.length === 0) {
              worksheetTanques.addRow({
                tanque: idx === 0 ? tanque.codigo : '',
                rancho: idx === 0 ? tanque.rancho : '',
                fecha: idx === 0 ? tanque.fecha_preparacion : '',
                litros_totales: idx === 0 ? tanque.litros_totales : '',
                mezcla: mezcla.nombre,
                fabricante: mezcla.fabricante,
                litros_mezcla: mezcla.litros,
                activo: 'Sin activos',
                codigo_activo: '',
                porcentaje: '',
                litros_activo: '',
                unidad: ''
              });
            } else {
              mezcla.activos.forEach((activo, actIdx) => {
                worksheetTanques.addRow({
                  tanque: idx === 0 && actIdx === 0 ? tanque.codigo : '',
                  rancho: idx === 0 && actIdx === 0 ? tanque.rancho : '',
                  fecha: idx === 0 && actIdx === 0 ? tanque.fecha_preparacion : '',
                  litros_totales: idx === 0 && actIdx === 0 ? tanque.litros_totales : '',
                  mezcla: actIdx === 0 ? mezcla.nombre : '',
                  fabricante: actIdx === 0 ? mezcla.fabricante : '',
                  litros_mezcla: actIdx === 0 ? mezcla.litros : '',
                  activo: activo.nombre,
                  codigo_activo: activo.codigo,
                  porcentaje: activo.porcentaje,
                  litros_activo: activo.litros_activo ? parseFloat(activo.litros_activo).toFixed(2) : '',
                  unidad: activo.unidad
                });
              });
            }
          });
        }
      });
    } else {
      worksheetTanques.columns = [{
        header: 'Mensaje',
        key: 'mensaje',
        width: 30
      }];
      worksheetTanques.addRow({
        mensaje: 'No hay tanques disponibles para los datos seleccionados'
      });
    }

    // Estilizar encabezados en todas las hojas
    [worksheetDetalle, worksheetKPIs, worksheetRancho, worksheetTanques].forEach(worksheet => {
      worksheet.getRow(1).font = {
        bold: true
      };
      worksheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {
          argb: 'FFE6B8AF'
        }
      };
      worksheet.columns.forEach(column => {
        column.width = Math.max(column.width || 10, 10);
      });
    });

    // Generar nombre de archivo
    const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const filename = `reporte_fertilizacion_${timestamp}.xlsx`;

    // Configurar headers para descarga
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    // Enviar archivo
    await workbook.xlsx.write(res);
    res.end();
  });
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 2477:
/***/ ((__webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(__webpack_module__, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   S: () => (/* binding */ UsuarioModel)
/* harmony export */ });
/* harmony import */ var _schema_usuarios_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9491);
/* harmony import */ var bcryptjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3139);
/* harmony import */ var jsonwebtoken__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(9071);
/* harmony import */ var sequelize__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(8265);
/* harmony import */ var _config_env_mjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(9097);
/* harmony import */ var _utils_CustomError_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(2551);
/* harmony import */ var _utils_logger_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(3014);
/* harmony import */ var _utils_dbHelper_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(7084);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_schema_usuarios_js__WEBPACK_IMPORTED_MODULE_0__, _utils_dbHelper_js__WEBPACK_IMPORTED_MODULE_7__]);
([_schema_usuarios_js__WEBPACK_IMPORTED_MODULE_0__, _utils_dbHelper_js__WEBPACK_IMPORTED_MODULE_7__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);








/**
Los operadores de Sequelize (Op) son necesarios para realizar consultas complejas. Algunos operadores comunes son:
Op.eq: Igual
Op.ne: No igual
Op.gt: Mayor que
Op.lt: Menor que
Op.in: Dentro de un array
Op.like: Búsqueda con comodín
 */
class UsuarioModel {
  // obtener todos los datos
  static async getAll() {
    try {
      const usuario = await _schema_usuarios_js__WEBPACK_IMPORTED_MODULE_0__/* .Usuario */ .P.findAll({
        attributes: ['id', 'nombre', 'usuario', 'email', 'rol', 'empresa', 'ranchos', 'variedad']
      });
      // Verificar si se encontraron resultados
      if (usuario.length === 0) {
        throw new _utils_CustomError_js__WEBPACK_IMPORTED_MODULE_5__/* .NotFoundError */ .m_('No se encontraron usuarios para los criterios especificados');
      }
      return usuario;
    } catch (e) {
      if (e instanceof _utils_CustomError_js__WEBPACK_IMPORTED_MODULE_5__/* .CustomError */ .eo) throw e;
      throw new _utils_CustomError_js__WEBPACK_IMPORTED_MODULE_5__/* .DatabaseError */ .a$('Error al obtener todos los usuarios');
    }
  }
  static async getUsuarios({
    nombre,
    rol,
    empresa
  }) {
    const logContext = {
      operation: 'getUsuarios Model',
      nombre,
      rol,
      empresa,
      timestamp: new Date().toISOString()
    };
    try {
      // Verificar si se proporcionaron los parámetros requeridos
      if (!nombre || !rol || !empresa) {
        throw new _utils_CustomError_js__WEBPACK_IMPORTED_MODULE_5__/* .ValidationError */ .yI('Datos requeridos no proporcionados');
      }

      // Filtrar por empresa y rancho no nulo
      if (empresa === 'Bioagricultura' && rol === 'adminMezclador') {
        const usuario = await _schema_usuarios_js__WEBPACK_IMPORTED_MODULE_0__/* .Usuario */ .P.findAll({
          attributes: ['id', 'nombre', 'rol', 'empresa', 'ranchos'],
          where: {
            empresa,
            rol: {
              [sequelize__WEBPACK_IMPORTED_MODULE_3__.Op.in]: ['solicita', 'solicita2']
            },
            // Filtrar por rol
            ranchos: {
              [sequelize__WEBPACK_IMPORTED_MODULE_3__.Op.ne]: 'Ahualulco'
            } // Filtrar por rancho no nulo
          }
        });
        // Verificar si se encontraron resultados
        if (usuario.length === 0) {
          throw new _utils_CustomError_js__WEBPACK_IMPORTED_MODULE_5__/* .NotFoundError */ .m_('No se encontraron usuarios para los criterios especificados');
        }
        return usuario;
      } else if (empresa === 'General' && rol === 'adminMezclador') {
        const usuario = await _schema_usuarios_js__WEBPACK_IMPORTED_MODULE_0__/* .Usuario */ .P.findAll({
          attributes: ['id', 'nombre', 'rol', 'empresa', 'ranchos'],
          where: {
            empresa,
            rol: {
              [sequelize__WEBPACK_IMPORTED_MODULE_3__.Op.in]: ['solicita', 'solicita2']
            },
            // Filtrar por rol
            ranchos: {
              [sequelize__WEBPACK_IMPORTED_MODULE_3__.Op.eq]: 'Ahualulco'
            } // Filtrar por rancho no nulo
          }
        });
        // Verificar si se encontraron resultados
        if (usuario.length === 0) {
          throw new _utils_CustomError_js__WEBPACK_IMPORTED_MODULE_5__/* .NotFoundError */ .m_('No se encontraron usuarios para los criterios especificados');
        }
        return usuario;
      }
      return {
        message: 'No se encontraron usuarios para los criterios especificados'
      };
    } catch (e) {
      _utils_logger_js__WEBPACK_IMPORTED_MODULE_6__/* ["default"] */ .A.logError(e, {
        ...logContext,
        stack: e.stack
      });
      if (e instanceof _utils_CustomError_js__WEBPACK_IMPORTED_MODULE_5__/* .CustomError */ .eo) throw e;
      throw new _utils_CustomError_js__WEBPACK_IMPORTED_MODULE_5__/* .DatabaseError */ .a$('Error al obtener todos los usuarios', {
        originalError: e.message,
        context: logContext
      });
    }
  }
  static async getSolicitantes() {
    try {
      const usuario = await _schema_usuarios_js__WEBPACK_IMPORTED_MODULE_0__/* .Usuario */ .P.findAll({
        attributes: ['id', 'nombre', 'rol', 'empresa', 'ranchos'],
        where: {
          rol: {
            [sequelize__WEBPACK_IMPORTED_MODULE_3__.Op.in]: ['solicita', 'solicita2', 'adminMezclador']
          } // Filtrar por rol
        }
      });
      // Verificar si se encontraron resultados
      if (usuario.length === 0) {
        throw new _utils_CustomError_js__WEBPACK_IMPORTED_MODULE_5__/* .NotFoundError */ .m_('No se encontraron usuarios para los criterios especificados');
      }
      return usuario;
    } catch (e) {
      throw new _utils_CustomError_js__WEBPACK_IMPORTED_MODULE_5__/* .DatabaseError */ .a$('Error al obtener todos los usuarios', {
        originalError: e.message
      });
    }
  }

  // uso
  static async getUserEmail({
    rol,
    empresa
  }) {
    try {
      // Verificar si se proporcionaron los parámetros requeridos
      if (!rol || !empresa) {
        throw new _utils_CustomError_js__WEBPACK_IMPORTED_MODULE_5__/* .ValidationError */ .yI('Datos requeridos no proporcionados');
      }
      const usuario = await _schema_usuarios_js__WEBPACK_IMPORTED_MODULE_0__/* .Usuario */ .P.findAll({
        attributes: ['nombre', 'email', 'ranchos', 'empresa'],
        where: {
          rol,
          [sequelize__WEBPACK_IMPORTED_MODULE_3__.Op.or]: [{
            empresa
          }, {
            empresa: 'General'
          }]
        }
      });
      // Verificar si se encontraron resultados
      if (usuario.length === 0) {
        throw new _utils_CustomError_js__WEBPACK_IMPORTED_MODULE_5__/* .NotFoundError */ .m_('No se encontraron usuarios para los criterios especificados');
      }
      return usuario;
    } catch (e) {
      if (e instanceof _utils_CustomError_js__WEBPACK_IMPORTED_MODULE_5__/* .CustomError */ .eo) throw e;
      throw new _utils_CustomError_js__WEBPACK_IMPORTED_MODULE_5__/* .DatabaseError */ .a$('Error al obtener todos los usuarios');
    }
  }

  // uso
  static async getUserEmailRancho({
    rol,
    empresa,
    rancho
  }) {
    try {
      // Verificar si se proporcionaron los parámetros requeridos
      if (!rol || !empresa || !rancho) {
        throw new _utils_CustomError_js__WEBPACK_IMPORTED_MODULE_5__/* .ValidationError */ .yI('Datos requeridos no proporcionados');
      }
      const usuario = await _schema_usuarios_js__WEBPACK_IMPORTED_MODULE_0__/* .Usuario */ .P.findAll({
        attributes: ['nombre', 'email', 'ranchos', 'empresa'],
        where: {
          rol,
          // Se filtra por rol
          empresa,
          // Se filtra por empresa
          ranchos: rancho // Se filtra por rancho
        }
      });
      // Verificar si se encontraron resultados
      if (usuario.length === 0) {
        throw new _utils_CustomError_js__WEBPACK_IMPORTED_MODULE_5__/* .NotFoundError */ .m_('No se encontraron usuarios para los criterios especificados');
      }
      return usuario;
    } catch (e) {
      if (e instanceof _utils_CustomError_js__WEBPACK_IMPORTED_MODULE_5__/* .CustomError */ .eo) throw e;
      throw new _utils_CustomError_js__WEBPACK_IMPORTED_MODULE_5__/* .DatabaseError */ .a$('Error al obtener todos los usuarios');
    }
  }
  static async getUserEmailRanchoRol({
    rol,
    rancho
  }) {
    try {
      // Verificar si se proporcionaron los parámetros requeridos
      if (!rol || !rancho) {
        throw new _utils_CustomError_js__WEBPACK_IMPORTED_MODULE_5__/* .ValidationError */ .yI('Datos requeridos no proporcionados');
      }
      const usuario = await _schema_usuarios_js__WEBPACK_IMPORTED_MODULE_0__/* .Usuario */ .P.findAll({
        attributes: ['nombre', 'email', 'ranchos', 'empresa'],
        where: {
          rol,
          // Se filtra por rol
          ranchos: rancho // Se filtra por rancho
        }
      });
      // Verificar si se encontraron resultados
      if (usuario.length === 0) {
        throw new _utils_CustomError_js__WEBPACK_IMPORTED_MODULE_5__/* .NotFoundError */ .m_('No se encontraron usuarios para los criterios especificados');
      }
      return usuario;
    } catch (e) {
      if (e instanceof _utils_CustomError_js__WEBPACK_IMPORTED_MODULE_5__/* .CustomError */ .eo) throw e;
      throw new _utils_CustomError_js__WEBPACK_IMPORTED_MODULE_5__/* .DatabaseError */ .a$('Error al obtener todos los usuarios');
    }
  }
  static async getUserEmailGerente({
    rol,
    idUsuario
  }) {
    try {
      // Verificar si se proporcionaron los parámetros requeridos
      if (!rol || !idUsuario) {
        throw new _utils_CustomError_js__WEBPACK_IMPORTED_MODULE_5__/* .ValidationError */ .yI('Datos requeridos no proporcionados');
      }
      const usuario = await _schema_usuarios_js__WEBPACK_IMPORTED_MODULE_0__/* .Usuario */ .P.findAll({
        attributes: ['nombre', 'email', 'ranchos', 'empresa'],
        where: {
          rol,
          // Se filtra por rol
          id: idUsuario // Se filtra por rancho
        }
      });
      // Verificar si se encontraron resultados
      if (usuario.length === 0) {
        throw new _utils_CustomError_js__WEBPACK_IMPORTED_MODULE_5__/* .NotFoundError */ .m_('No se encontraron usuarios para los criterios especificados');
      }
      return usuario;
    } catch (e) {
      if (e instanceof _utils_CustomError_js__WEBPACK_IMPORTED_MODULE_5__/* .CustomError */ .eo) throw e;
      throw new _utils_CustomError_js__WEBPACK_IMPORTED_MODULE_5__/* .DatabaseError */ .a$('Error al obtener todos los usuarios');
    }
  }

  // uso
  static async getUserEmailEmpresa({
    rol,
    empresa
  }) {
    try {
      // Verificar si se proporcionaron los parámetros requeridos
      if (!rol || !empresa) {
        throw new _utils_CustomError_js__WEBPACK_IMPORTED_MODULE_5__/* .ValidationError */ .yI('Datos requeridos no proporcionados');
      }
      const usuario = await _schema_usuarios_js__WEBPACK_IMPORTED_MODULE_0__/* .Usuario */ .P.findAll({
        attributes: ['nombre', 'email', 'ranchos', 'empresa'],
        where: {
          rol,
          // Se filtra por rol
          empresa // Se filtra por empresa
        }
      });
      // Verificar si se encontraron resultados
      if (usuario.length === 0) {
        throw new _utils_CustomError_js__WEBPACK_IMPORTED_MODULE_5__/* .NotFoundError */ .m_('No se encontraron usuarios para los criterios especificados');
      }
      return usuario;
    } catch (e) {
      if (e instanceof _utils_CustomError_js__WEBPACK_IMPORTED_MODULE_5__/* .CustomError */ .eo) throw e;
      throw new _utils_CustomError_js__WEBPACK_IMPORTED_MODULE_5__/* .DatabaseError */ .a$('Error al obtener todos los usuarios');
    }
  }

  // obtener todos los un ato por id
  static async getOne({
    rol,
    empresa
  }) {
    try {
      // Verificar si se proporcionaron los parámetros requeridos
      if (!rol || !empresa) {
        throw new _utils_CustomError_js__WEBPACK_IMPORTED_MODULE_5__/* .ValidationError */ .yI('Datos requeridos no proporcionados');
      }
      const usuario = await _schema_usuarios_js__WEBPACK_IMPORTED_MODULE_0__/* .Usuario */ .P.findOne({
        where: {
          rol,
          empresa
        },
        attributes: ['nombre', 'email', 'rol']
      });
      // Verificar si se encontraron resultados
      if (!usuario) {
        throw new _utils_CustomError_js__WEBPACK_IMPORTED_MODULE_5__/* .NotFoundError */ .m_('No se encontraron usuarios para los criterios especificados');
      }
      return usuario;
    } catch (error) {
      _utils_logger_js__WEBPACK_IMPORTED_MODULE_6__/* ["default"] */ .A.error('Error al determinar destinatarios de notificación', {
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack
        }
      });
      if (error instanceof _utils_CustomError_js__WEBPACK_IMPORTED_MODULE_5__/* .CustomError */ .eo) throw error;
      throw new _utils_CustomError_js__WEBPACK_IMPORTED_MODULE_5__/* .DatabaseError */ .a$('Error al obtener todos los usuarios');
    }
  }
  static async getOneId({
    id
  }) {
    try {
      if (!id) {
        throw new _utils_CustomError_js__WEBPACK_IMPORTED_MODULE_5__/* .ValidationError */ .yI('ID no proporcionados');
      }
      const usuario = await _schema_usuarios_js__WEBPACK_IMPORTED_MODULE_0__/* .Usuario */ .P.findOne({
        where: {
          id
        },
        attributes: ['nombre', 'email', 'rol', 'empresa']
      });
      // Verificar si se encontraron resultados
      if (!usuario) {
        throw new _utils_CustomError_js__WEBPACK_IMPORTED_MODULE_5__/* .NotFoundError */ .m_('No se encontro usuario');
      }
      return usuario;
    } catch (e) {
      if (e instanceof _utils_CustomError_js__WEBPACK_IMPORTED_MODULE_5__/* .CustomError */ .eo) throw e;
      throw new _utils_CustomError_js__WEBPACK_IMPORTED_MODULE_5__/* .DatabaseError */ .a$('Error al obtener todos los usuarios');
    }
  }

  // eliminar usuario
  static async delete({
    id,
    logContext,
    logger
  }) {
    return await _utils_dbHelper_js__WEBPACK_IMPORTED_MODULE_7__/* .DbHelper */ .D.withTransaction(async transaction => {
      try {
        // Verificar si se proporcionaron los parámetros requeridos
        if (!id) {
          throw new _utils_CustomError_js__WEBPACK_IMPORTED_MODULE_5__/* .ValidationError */ .yI('ID no proporcionados');
        }
        const usuario = await _schema_usuarios_js__WEBPACK_IMPORTED_MODULE_0__/* .Usuario */ .P.findByPk(id);
        if (!usuario) throw new _utils_CustomError_js__WEBPACK_IMPORTED_MODULE_5__/* .NotFoundError */ .m_('Usuario no encontrado');
        await usuario.destroy({
          transaction
        });
        return {
          message: `Usuario eliminado correctamente con id ${id}`
        };
      } catch (error) {
        logger.logError(error, {
          ...logContext,
          error: error.message
        });
        if (error instanceof _utils_CustomError_js__WEBPACK_IMPORTED_MODULE_5__/* .CustomError */ .eo) throw error;
        throw new _utils_CustomError_js__WEBPACK_IMPORTED_MODULE_5__/* .DatabaseError */ .a$('Error al eliminar usuario');
      }
    });
  }

  // crear usuario
  static async create({
    data
  }) {
    try {
      // Verificar si se proporcionaron los parámetros requeridos
      if (!data.usuario || !data.email || !data.password || !data.rol || !data.empresa) {
        throw new _utils_CustomError_js__WEBPACK_IMPORTED_MODULE_5__/* .ValidationError */ .yI('Datos requeridos no proporcionados');
      }
      // verificamos que no exista el usuario
      const usuario = await _schema_usuarios_js__WEBPACK_IMPORTED_MODULE_0__/* .Usuario */ .P.findOne({
        where: {
          usuario: data.usuario,
          email: data.email
        }
      });
      if (usuario) throw new _utils_CustomError_js__WEBPACK_IMPORTED_MODULE_5__/* .ValidationError */ .yI('El usuario o email ya existe');
      // creamos el usuario
      const newUser = await _schema_usuarios_js__WEBPACK_IMPORTED_MODULE_0__/* .Usuario */ .P.create({
        ...data
      });
      return {
        message: `usuario registrado exitosamente ${data.nombre}`,
        user: newUser
      };
    } catch (e) {
      if (e instanceof _utils_CustomError_js__WEBPACK_IMPORTED_MODULE_5__/* .CustomError */ .eo) throw e;
      throw new _utils_CustomError_js__WEBPACK_IMPORTED_MODULE_5__/* .DatabaseError */ .a$('Error al crear usuario');
    }
  }

  // para actualizar datos de usuario
  static async update({
    id,
    data
  }) {
    try {
      // Verificar si se proporcionaron los parámetros requeridos
      if (!id || !data.nombre || !data.email || !data.password || !data.rol || !data.empresa) {
        throw new _utils_CustomError_js__WEBPACK_IMPORTED_MODULE_5__/* .ValidationError */ .yI('Datos requeridos no proporcionados');
      }
      // verificamos si existe alguna empresa con el id proporcionado
      const usuario = await _schema_usuarios_js__WEBPACK_IMPORTED_MODULE_0__/* .Usuario */ .P.findByPk(id);
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
      if (e instanceof _utils_CustomError_js__WEBPACK_IMPORTED_MODULE_5__/* .CustomError */ .eo) throw e;
      throw new _utils_CustomError_js__WEBPACK_IMPORTED_MODULE_5__/* .DatabaseError */ .a$('Error al actualizar usuario');
    }
  }

  // funcion login
  static async login({
    user,
    password,
    logContext,
    logger
  }) {
    return await _utils_dbHelper_js__WEBPACK_IMPORTED_MODULE_7__/* .DbHelper */ .D.executeQuery(async () => {
      try {
        // Verificar si se proporcionaron los parámetros requeridos
        if (!user || !password) {
          throw new _utils_CustomError_js__WEBPACK_IMPORTED_MODULE_5__/* .ValidationError */ .yI('Datos requeridos no proporcionados');
        }
        const usuario = await _schema_usuarios_js__WEBPACK_IMPORTED_MODULE_0__/* .Usuario */ .P.findOne({
          where: {
            usuario: user
          }
        });
        if (!usuario) throw new _utils_CustomError_js__WEBPACK_IMPORTED_MODULE_5__/* .NotFoundError */ .m_('Usuario no encontrado');
        const isValidPassword = await bcryptjs__WEBPACK_IMPORTED_MODULE_1__["default"].compare(password, usuario.password);
        if (!isValidPassword) throw new _utils_CustomError_js__WEBPACK_IMPORTED_MODULE_5__/* .ValidationError */ .yI('Contraseña incorrecta');

        // creamos jwt
        const token = jsonwebtoken__WEBPACK_IMPORTED_MODULE_2__["default"].sign({
          id: usuario.id,
          nombre: usuario.nombre,
          rol: usuario.rol,
          empresa: usuario.empresa,
          ranchos: usuario.ranchos,
          cultivo: usuario.variedad
        }, _config_env_mjs__WEBPACK_IMPORTED_MODULE_4__/* .envs */ .D.SECRET_JWT_KEY, {
          expiresIn: '24h'
        });
        return {
          message: 'Usuario logueado correctamente',
          token,
          rol: usuario.rol,
          usuario: {
            nombre: usuario.nombre,
            rol: usuario.rol,
            empresa: usuario.empresa,
            ranchos: usuario.ranchos
          }
        };
      } catch (error) {
        logger.logError(error, {
          ...logContext,
          error: error.message
        });
        if (error instanceof _utils_CustomError_js__WEBPACK_IMPORTED_MODULE_5__/* .CustomError */ .eo) throw error;
        throw new _utils_CustomError_js__WEBPACK_IMPORTED_MODULE_5__/* .DatabaseError */ .a$('Error al iniciar sesión');
      }
    });
  }

  // funcion cambiar contraseña usuario
  static async changePassword({
    id,
    oldPassword,
    newPassword,
    logContext,
    logger
  }) {
    return await _utils_dbHelper_js__WEBPACK_IMPORTED_MODULE_7__/* .DbHelper */ .D.withTransaction(async transaction => {
      try {
        const usuario = await _schema_usuarios_js__WEBPACK_IMPORTED_MODULE_0__/* .Usuario */ .P.findByPk(id);
        if (!usuario) return {
          error: 'usuario no encontrado'
        };
        const isValidPassword = await bcryptjs__WEBPACK_IMPORTED_MODULE_1__["default"].compare(oldPassword, usuario.password);
        if (!isValidPassword) return {
          error: 'contraseña actual incorrecta'
        };
        usuario.password = newPassword;
        await usuario.save({
          transaction
        });
        return {
          message: 'contraseña cambiada correctamente'
        };
      } catch (error) {
        logger.logError(error, {
          ...logContext,
          error: error.message
        });
        if (error instanceof _utils_CustomError_js__WEBPACK_IMPORTED_MODULE_5__/* .CustomError */ .eo) throw error;
        throw new _utils_CustomError_js__WEBPACK_IMPORTED_MODULE_5__/* .ValidationError */ .yI('Error al actulizar la contraseña');
      }
    });
  }

  // funcion cambiar contraseña Admin
  static async changePasswordAdmin({
    id,
    newPassword,
    logContext,
    logger
  }) {
    return await _utils_dbHelper_js__WEBPACK_IMPORTED_MODULE_7__/* .DbHelper */ .D.withTransaction(async transaction => {
      try {
        // Cambiar contraseña Admin
        // Verificar si se proporcionaron los parámetros requeridos
        if (!id || !newPassword) {
          throw new _utils_CustomError_js__WEBPACK_IMPORTED_MODULE_5__/* .ValidationError */ .yI('Datos requeridos no proporcionados');
        }
        const usuario = await _schema_usuarios_js__WEBPACK_IMPORTED_MODULE_0__/* .Usuario */ .P.findByPk(id);
        if (!usuario) throw new _utils_CustomError_js__WEBPACK_IMPORTED_MODULE_5__/* .NotFoundError */ .m_('usuario no encontrado');
        usuario.password = newPassword;
        await usuario.save({
          transaction
        });
        return {
          message: 'Contraseña cambiada correctamente'
        };
      } catch (e) {
        logger.logError(e, {
          ...logContext,
          error: e.message
        });
        if (e instanceof _utils_CustomError_js__WEBPACK_IMPORTED_MODULE_5__/* .CustomError */ .eo) throw e;
        throw new _utils_CustomError_js__WEBPACK_IMPORTED_MODULE_5__/* .DatabaseError */ .a$('Error al cambiar contraseña');
      }
    });
  }
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 2551:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Cr: () => (/* binding */ MezclaOperationError),
/* harmony export */   H0: () => (/* binding */ BusinessError),
/* harmony export */   MU: () => (/* binding */ TimeoutError),
/* harmony export */   a$: () => (/* binding */ DatabaseError),
/* harmony export */   eo: () => (/* binding */ CustomError),
/* harmony export */   m_: () => (/* binding */ NotFoundError),
/* harmony export */   us: () => (/* binding */ ServiceUnavailableError),
/* harmony export */   yI: () => (/* binding */ ValidationError)
/* harmony export */ });
/* unused harmony exports BadRequestError, UnauthorizedError, ForbiddenError, ConflictError, RateLimitError, InternalServerError, NotImplementedError */
/**
 * Clase base para errores personalizados
 * Extiende Error y proporciona estructura estándar para todos los errores de la aplicación
 */
class CustomError extends Error {
  constructor(message, statusCode, errorCode, details = {}) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.details = details;
    this.timestamp = new Date().toISOString();
    this.status = this.getStatusType(statusCode);
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * Determina el tipo de estado basado en el código HTTP
   * @param {number} statusCode - Código de estado HTTP
   * @returns {string} 'error' (5xx), 'fail' (4xx), o 'success'
   */
  getStatusType(statusCode) {
    if (statusCode >= 500) return 'error';
    if (statusCode >= 400) return 'fail';
    return 'success';
  }
}

/**
 * Error de validación de datos (400)
 * Usado cuando los datos enviados no cumplen las reglas de validación
 * @example new ValidationError('El email no es válido', { field: 'email' })
 */
class ValidationError extends CustomError {
  constructor(message = 'Error de validación', details = {}) {
    super(message, 400, 'VALIDATION_ERROR', details);
  }
}

/**
 * Error de solicitud incorrecta (400)
 * Usado cuando la solicitud está malformada o es inválida
 * @example new BadRequestError('Parámetros faltantes')
 */
class BadRequestError extends CustomError {
  constructor(message = 'Solicitud incorrecta', details = {}) {
    super(message, 400, 'BAD_REQUEST', details);
  }
}

/**
 * Error de autenticación (401)
 * Usado cuando el usuario no está autenticado
 * @example new UnauthorizedError('Token expirado')
 */
class UnauthorizedError extends CustomError {
  constructor(message = 'No autorizado', details = {}) {
    super(message, 401, 'UNAUTHORIZED', details);
  }
}

/**
 * Error de autorización (403)
 * Usado cuando el usuario no tiene permisos para acceder al recurso
 * @example new ForbiddenError('No tienes permiso para eliminar activos')
 */
class ForbiddenError extends CustomError {
  constructor(message = 'Acceso denegado', details = {}) {
    super(message, 403, 'FORBIDDEN', details);
  }
}

/**
 * Error de recurso no encontrado (404)
 * Usado cuando se intenta acceder a un recurso que no existe
 * @example new NotFoundError('Activo no encontrado', { id: 123 })
 */
class NotFoundError extends CustomError {
  constructor(message = 'Recurso no encontrado', details = {}) {
    super(message, 404, 'NOT_FOUND', details);
  }
}

/**
 * Error de conflicto (409)
 * Usado cuando hay un conflicto con el estado actual (ej: duplicado)
 * @example new ConflictError('El código ya existe en la base de datos')
 */
class ConflictError extends CustomError {
  constructor(message = 'Conflicto', details = {}) {
    super(message, 409, 'CONFLICT', details);
  }
}

/**
 * Error de límite de solicitudes (429)
 * Usado cuando se excede el límite de solicitudes (rate limiting)
 * @example new RateLimitError('Demasiadas solicitudes, intenta más tarde')
 */
class RateLimitError extends CustomError {
  constructor(message = 'Límite de solicitudes alcanzado', details = {}) {
    super(message, 429, 'RATE_LIMIT', details);
  }
}

/**
 * Error de negocio (422)
 * Usado cuando la lógica de negocio rechaza la operación
 * @example new BusinessError('No se puede eliminar un activo en uso')
 */
class BusinessError extends CustomError {
  constructor(message = 'Error de negocio', details = {}) {
    super(message, 422, 'BUSINESS_ERROR', details);
  }
}

/**
 * Error de base de datos (500)
 * Usado cuando hay un error en la operación de base de datos
 * @example new DatabaseError('Error al insertar registro', { table: 'activos' })
 */
class DatabaseError extends CustomError {
  constructor(message = 'Error en la base de datos', details = {}) {
    super(message, 500, 'DB_ERROR', details);
  }
}

/**
 * Error interno del servidor (500)
 * Usado para errores genéricos del servidor
 * @example new InternalServerError('Algo salió mal')
 */
class InternalServerError extends CustomError {
  constructor(message = 'Error interno del servidor', details = {}) {
    super(message, 500, 'INTERNAL_SERVER_ERROR', details);
  }
}

/**
 * Error de funcionalidad no implementada (501)
 * Usado cuando se intenta usar una funcionalidad aún no disponible
 * @example new NotImplementedError('El reporte de depreciación aún no está disponible')
 */
class NotImplementedError extends CustomError {
  constructor(message = 'Funcionalidad no implementada', details = {}) {
    super(message, 501, 'NOT_IMPLEMENTED', details);
  }
}

/**
 * Error de servicio no disponible (503)
 * Usado cuando un servicio externo no está disponible
 * @example new ServiceUnavailableError('Base de datos no disponible')
 */
class ServiceUnavailableError extends CustomError {
  constructor(message = 'Servicio no disponible', details = {}) {
    super(message, 503, 'SERVICE_UNAVAILABLE', details);
  }
}

/**
 * Error de timeout (504)
 * Usado cuando se agota el tiempo de espera de una operación
 * @example new TimeoutError('La solicitud tardó demasiado')
 */
class TimeoutError extends CustomError {
  constructor(message = 'Tiempo de espera agotado', details = {}) {
    super(message, 504, 'TIMEOUT', details);
  }
}

/**
 * Error específico de operaciones con mezclas (500)
 * Usado para errores relacionados con la creación, actualización o eliminación de mezclas
 * @example new MezclaOperationError('CREATE', 'No hay suficientes productos disponibles')
 */
class MezclaOperationError extends CustomError {
  constructor(operation, message, details = {}) {
    super(message, 500, `MEZCLA_${operation}_ERROR`, {
      operation,
      ...details
    });
  }
}

/***/ }),

/***/ 2674:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var x = (y) => {
	var x = {}; __webpack_require__.d(x, y); return x
} 
var y = (x) => (() => (x))
module.exports = x({ ["Router"]: () => (__WEBPACK_EXTERNAL_MODULE_express__.Router), ["default"]: () => (__WEBPACK_EXTERNAL_MODULE_express__["default"]) });

/***/ }),

/***/ 2692:
/***/ ((__webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(__webpack_module__, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   d: () => (/* binding */ Sectores)
/* harmony export */ });
/* harmony import */ var sequelize__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8265);
/* harmony import */ var _db_db_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9815);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_db_db_js__WEBPACK_IMPORTED_MODULE_1__]);
_db_db_js__WEBPACK_IMPORTED_MODULE_1__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];


const sectoresConfig = {
  id: {
    type: sequelize__WEBPACK_IMPORTED_MODULE_0__.DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  id_rancho_dsa: {
    type: sequelize__WEBPACK_IMPORTED_MODULE_0__.DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'rancho_dsa',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  sector_interno: {
    type: sequelize__WEBPACK_IMPORTED_MODULE_0__.DataTypes.STRING(20),
    allowNull: false
  },
  sector_agrian: {
    type: sequelize__WEBPACK_IMPORTED_MODULE_0__.DataTypes.STRING(20),
    allowNull: false
  },
  variedad: {
    type: sequelize__WEBPACK_IMPORTED_MODULE_0__.DataTypes.STRING(30),
    allowNull: false
  },
  hectareas: {
    type: sequelize__WEBPACK_IMPORTED_MODULE_0__.DataTypes.FLOAT,
    allowNull: false
  },
  status: {
    type: sequelize__WEBPACK_IMPORTED_MODULE_0__.DataTypes.INTEGER,
    allowNull: false
  }
};
const Sectores = _db_db_js__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .A.define('Sectores', sectoresConfig, {
  tableName: 'sectores',
  timestamps: false
});
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 2936:
/***/ ((__webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(__webpack_module__, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   U: () => (/* binding */ startServer)
/* harmony export */ });
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2674);
/* harmony import */ var compression__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(876);
/* harmony import */ var helmet__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(7979);
/* harmony import */ var body_parser__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(1242);
/* harmony import */ var cookie_parser__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(3328);
/* harmony import */ var crypto__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(6982);
/* harmony import */ var swagger_ui_express__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(3158);
/* harmony import */ var _utils_swagger_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(6210);
/* harmony import */ var _utils_logger_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(3014);
/* harmony import */ var _config_paths_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(245);
/* harmony import */ var _middlewares_cors_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(1764);
/* harmony import */ var _middlewares_validateJsonMiddleware_js__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(702);
/* harmony import */ var _middlewares_error500Middleware_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(1087);
/* harmony import */ var _middlewares_rateLimit_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(9250);
/* harmony import */ var _middlewares_authMiddleware_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(936);
/* harmony import */ var _middlewares_correlationMiddleware_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(7176);
/* harmony import */ var _routes_usuario_routes_js__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(5541);
/* harmony import */ var _routes_fertilizacion_routes_js__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(8258);
/* harmony import */ var _routes_corporativo_routes_js__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(8261);
/* harmony import */ var _models_usuario_models_js__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(2477);
/* harmony import */ var _models_modelAssociations_js__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(1148);
/* harmony import */ var _db_db_js__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(9815);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_middlewares_authMiddleware_js__WEBPACK_IMPORTED_MODULE_13__, _routes_usuario_routes_js__WEBPACK_IMPORTED_MODULE_15__, _routes_fertilizacion_routes_js__WEBPACK_IMPORTED_MODULE_16__, _routes_corporativo_routes_js__WEBPACK_IMPORTED_MODULE_17__, _models_usuario_models_js__WEBPACK_IMPORTED_MODULE_18__, _models_modelAssociations_js__WEBPACK_IMPORTED_MODULE_19__, _db_db_js__WEBPACK_IMPORTED_MODULE_20__]);
([_middlewares_authMiddleware_js__WEBPACK_IMPORTED_MODULE_13__, _routes_usuario_routes_js__WEBPACK_IMPORTED_MODULE_15__, _routes_fertilizacion_routes_js__WEBPACK_IMPORTED_MODULE_16__, _routes_corporativo_routes_js__WEBPACK_IMPORTED_MODULE_17__, _models_usuario_models_js__WEBPACK_IMPORTED_MODULE_18__, _models_modelAssociations_js__WEBPACK_IMPORTED_MODULE_19__, _db_db_js__WEBPACK_IMPORTED_MODULE_20__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);






// Librerias


// Configuraciones



// middlewares






// Rutas




// Models


// Asociaciones


// Base de datos

const startServer = async options => {
  const {
    PORT,
    MODE
  } = options;
  const app = (0,express__WEBPACK_IMPORTED_MODULE_0__["default"])();

  // MOTOR DE PLANTILLAS EJS
  app.set('views', _config_paths_js__WEBPACK_IMPORTED_MODULE_9__/* .paths */ .f.views);
  app.set('view engine', 'ejs');
  app.set('trust proxy', 1);

  // Middlewares
  if (MODE === 'development') {
    _utils_logger_js__WEBPACK_IMPORTED_MODULE_8__/* ["default"] */ .A.info('🔧 Modo de desarrollo');
  } else {
    _utils_logger_js__WEBPACK_IMPORTED_MODULE_8__/* ["default"] */ .A.info('📦 Modo de producción');
  }
  // Agregar middleware de correlación
  app.use(_middlewares_correlationMiddleware_js__WEBPACK_IMPORTED_MODULE_14__/* .correlationMiddleware */ .t);
  app.use((0,compression__WEBPACK_IMPORTED_MODULE_1__["default"])({
    filter: (req, res) => {
      if (req.headers['x-no-compression']) {
        return false;
      }
      return compression__WEBPACK_IMPORTED_MODULE_1__["default"].filter(req, res);
    },
    level: 6 // nivel de compresión (0-9)
  }));

  // Middleware para generar nonce
  app.use((req, res, next) => {
    res.locals.nonce = crypto__WEBPACK_IMPORTED_MODULE_5__.randomBytes(16).toString('base64');
    next();
  });

  // Configuración de seguridad Helmet con CSP basada en Nonce
  const isDev = MODE === 'development';

  // Configuración de seguridad para permitir recursos externos mientras se mantiene la seguridad básica
  app.use((0,helmet__WEBPACK_IMPORTED_MODULE_2__["default"])({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://ka-f.fontawesome.com', 'https://fertilizacion.portalrancho.com.mx', 'https://cdn.jsdelivr.net'],
        scriptSrc: ["'self'", (req, res) => `'nonce-${res.locals.nonce}'`, 'https://cdn.jsdelivr.net', 'https://code.jquery.com', ...(isDev ? ["'unsafe-inline'"] : [])],
        scriptSrcAttr: ["'unsafe-inline'"],
        fontSrc: ["'self'", 'https://ka-f.fontawesome.com', 'https://fonts.googleapis.com',
        // ✅ dominio de la hoja de estilos
        'https://fonts.gstatic.com',
        // ✅ dominio donde están los archivos de fuente reales
        'data:'],
        connectSrc: ["'self'", 'https://ka-f.fontawesome.com', 'https://cdn.jsdelivr.net', 'https://fonts.googleapis.com',
        // ✅ necesario para el service worker
        'https://fonts.gstatic.com',
        // ✅ necesario para el service worker
        ...(isDev ? ['http://localhost:3000'] : [])],
        imgSrc: ["'self'", 'data:', 'blob:', 'https://fertilizacion.portalrancho.com.mx'],
        mediaSrc: ["'self'", 'blob:'],
        workerSrc: ["'self'", 'blob:'],
        childSrc: ["'self'", 'blob:'],
        frameSrc: ["'self'", 'https://fertilizacion.portalrancho.com.mx', ...(isDev ? ['http://localhost:3000'] : [])],
        frameAncestors: isDev ? ["'self'", 'http://localhost:3000'] : ["'self'", 'https://mezclas.portalrancho.com.mx'],
        // ✅ permite iframes desde tu propio dominio

        // ✅ Corregido: 'none' no puede combinarse con otros valores
        objectSrc: isDev ? ["'self'", 'http://localhost:3000'] : ["'self'", 'https://mezclas.portalrancho.com.mx'],
        baseUri: ["'self'"],
        formAction: ["'self'"],
        ...(isDev ? {} : {
          upgradeInsecureRequests: null
        })
      }
    },
    hsts: isDev ? false : {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true
    },
    noSniff: true,
    frameguard: false,
    hidePoweredBy: true,
    referrerPolicy: {
      policy: 'strict-origin-when-cross-origin'
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: {
      policy: 'same-site'
    }
  }));

  // Configurar middleware para cookies y CORS
  app.use((0,cookie_parser__WEBPACK_IMPORTED_MODULE_4__["default"])());
  app.use(_middlewares_validateJsonMiddleware_js__WEBPACK_IMPORTED_MODULE_21__/* .validateJSON */ .B);
  app.use((0,_middlewares_cors_js__WEBPACK_IMPORTED_MODULE_10__/* .corsMiddleware */ .C)());
  app.disable('x-powered-by');
  app.use(body_parser__WEBPACK_IMPORTED_MODULE_3__["default"].json({
    limit: '50mb'
  }));
  app.use(body_parser__WEBPACK_IMPORTED_MODULE_3__["default"].urlencoded({
    limit: '50mb',
    extended: true
  }));
  if (MODE !== 'development') {
    _utils_logger_js__WEBPACK_IMPORTED_MODULE_8__/* ["default"] */ .A.info('🔒 limite de peticiones por IP Activado'); // eslint-disable-line no-console
    app.use(_middlewares_rateLimit_js__WEBPACK_IMPORTED_MODULE_12__/* .apiLimiter */ .N); // Limitar el número de peticiones por IP
  }

  // Validar que la documentación está disponible solo en desarrollo
  if (MODE === 'development') {
    app.use('/api-docs', swagger_ui_express__WEBPACK_IMPORTED_MODULE_6__["default"].serve, swagger_ui_express__WEBPACK_IMPORTED_MODULE_6__["default"].setup(_utils_swagger_js__WEBPACK_IMPORTED_MODULE_7__/* .swaggerSpec */ ._));
    _utils_logger_js__WEBPACK_IMPORTED_MODULE_8__/* ["default"] */ .A.info('📚 Documentación API disponible en /api-docs');
  }
  // rutas API
  app.use('/api/usuario/', (0,_routes_usuario_routes_js__WEBPACK_IMPORTED_MODULE_15__/* .createUsuarioRouter */ .G)({
    usuarioModel: _models_usuario_models_js__WEBPACK_IMPORTED_MODULE_18__/* .UsuarioModel */ .S
  }));

  // Modulo Fertilizacion
  app.use('/api/fertilizacion', _middlewares_authMiddleware_js__WEBPACK_IMPORTED_MODULE_13__/* .authenticate */ .QF, (0,_routes_fertilizacion_routes_js__WEBPACK_IMPORTED_MODULE_16__/* .createFertilizacionRouter */ .Z)());

  // Modulo Corporativo
  app.use('/corporativo', _middlewares_authMiddleware_js__WEBPACK_IMPORTED_MODULE_13__/* .authenticate */ .QF, (0,_routes_corporativo_routes_js__WEBPACK_IMPORTED_MODULE_17__/* .createCorporativoRouter */ .S)());

  // PAGINA DE Inicio
  app.get('/', (req, res) => {
    res.render('main', {
      error: null,
      registerError: null
    });
  });
  app.use(express__WEBPACK_IMPORTED_MODULE_0__["default"]["static"](_config_paths_js__WEBPACK_IMPORTED_MODULE_9__/* .paths */ .f.public));

  // Manejo de errores 404
  app.use(_middlewares_error500Middleware_js__WEBPACK_IMPORTED_MODULE_11__/* .error404 */ .v);

  // Manejo de errores 500
  app.use(_middlewares_error500Middleware_js__WEBPACK_IMPORTED_MODULE_11__/* .errorHandler */ .r);
  try {
    // Verificar conexión a la base de datos antes de iniciar
    await _db_db_js__WEBPACK_IMPORTED_MODULE_20__/* ["default"] */ .A.authenticate({
      retry: {
        max: 3,
        timeout: 10000
      }
    });
    // asociaciones antes de sincronizar
    (0,_models_modelAssociations_js__WEBPACK_IMPORTED_MODULE_19__/* .setupAssociations */ .i)();
    await _db_db_js__WEBPACK_IMPORTED_MODULE_20__/* ["default"] */ .A.sync();
    _utils_logger_js__WEBPACK_IMPORTED_MODULE_8__/* ["default"] */ .A.info('📦 Base de datos conectada y sincronizada');
    // Iniciamos el servidor en el puerto especificado
    app.listen(PORT, () => _utils_logger_js__WEBPACK_IMPORTED_MODULE_8__/* ["default"] */ .A.info(`🚀 Servidor corriendo en puerto ${PORT}`));
  } catch (error) {
    _utils_logger_js__WEBPACK_IMPORTED_MODULE_8__/* ["default"] */ .A.error('❌ Error al iniciar:', {
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack
      }
    });
    process.exit(1);
  }
};
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 3014:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  A: () => (/* binding */ logger)
});

;// external "winston"
var x = (y) => {
	var x = {}; __webpack_require__.d(x, y); return x
} 
var y = (x) => (() => (x))
const external_winston_namespaceObject = x({ ["default"]: () => (__WEBPACK_EXTERNAL_MODULE_winston__["default"]) });
;// external "winston-daily-rotate-file"
var external_winston_daily_rotate_file_x = (y) => {
	var x = {}; __webpack_require__.d(x, y); return x
} 
var external_winston_daily_rotate_file_y = (x) => (() => (x))
const external_winston_daily_rotate_file_namespaceObject = external_winston_daily_rotate_file_x({  });
// EXTERNAL MODULE: ./src/config/env.mjs
var env = __webpack_require__(9097);
;// external "chalk"
var external_chalk_x = (y) => {
	var x = {}; __webpack_require__.d(x, y); return x
} 
var external_chalk_y = (x) => (() => (x))
const external_chalk_namespaceObject = external_chalk_x({ ["default"]: () => (__WEBPACK_EXTERNAL_MODULE_chalk__["default"]) });
// EXTERNAL MODULE: ./src/config/logger.config.js
var logger_config = __webpack_require__(9021);
;// ./src/utils/logger.js



 // Agregar para colores en terminal

class Logger {
  constructor() {
    this.logger = this.createLogger();
    this.metrics = new Map();
    if (logger_config/* loggerConfig */.D.metrics.enabled) {
      this.startMetricsCollection();
    }
  }

  // Agregar método para correlación
  withCorrelation(correlationId) {
    return {
      info: (message, meta = {}) => this.info(message, {
        ...meta,
        correlationId
      }),
      error: (message, meta = {}) => this.error(message, {
        ...meta,
        correlationId
      }),
      warn: (message, meta = {}) => this.warn(message, {
        ...meta,
        correlationId
      }),
      debug: (message, meta = {}) => this.debug(message, {
        ...meta,
        correlationId
      }),
      logOperation: (operation, phase, details = {}) => this.logOperation(operation, phase, {
        ...details,
        correlationId
      }),
      logModelOperation: (modelName, operation, data = {}) => this.logModelOperation(modelName, operation, {
        ...data,
        correlationId
      }),
      logTransaction: (transactionId, action, details = {}) => this.logTransaction(transactionId, action, {
        ...details,
        correlationId
      }),
      logError: (error, context = {}) => this.logError(error, {
        ...context,
        correlationId
      }),
      logDBTransaction: (operation, status, details = {}) => this.logDBTransaction(operation, status, {
        ...details,
        correlationId
      })
    };
  }

  // Agregar colección de métricas
  startMetricsCollection() {
    setInterval(() => {
      const metrics = {
        timestamp: new Date().toISOString(),
        operationsCount: this.metrics.get('operationsCount') || 0,
        errorCount: this.metrics.get('errorCount') || 0,
        avgResponseTime: this.calculateAverageResponseTime()
      };
      this.debug('Metrics collected', {
        metrics
      });
      this.metrics.clear();
    }, logger_config/* loggerConfig */.D.metrics.interval);
  }

  // Método para registrar métricas
  recordMetric(name, value) {
    const current = this.metrics.get(name) || 0;
    this.metrics.set(name, current + value);
  }
  createLogFormat() {
    const consoleFormat = external_winston_namespaceObject["default"].format.printf(({
      timestamp,
      level,
      message,
      metadata,
      stack
    }) => {
      // Formato para la consola con colores y mejor estructura
      const levelUpperCase = level.toUpperCase().padEnd(7);
      const coloredLevel = external_chalk_namespaceObject["default"][logger_config/* loggerConfig */.D.levelColors[level]](levelUpperCase);
      const time = external_chalk_namespaceObject["default"].gray(timestamp);
      let log = `${time} ${coloredLevel} │ ${message}`;

      // Agregar metadata si existe
      if (Object.keys(metadata).length > 0 && metadata.metadata !== message) {
        const metadataStr = JSON.stringify(metadata.metadata, null, 2).split('\n').map(line => external_chalk_namespaceObject["default"].gray('│ ') + line).join('\n');
        log += '\n' + metadataStr;
      }

      // Agregar stack trace si existe
      if (stack) {
        const stackStr = stack.split('\n').map(line => external_chalk_namespaceObject["default"].red('│ ') + line).join('\n');
        log += '\n' + stackStr;
      }
      return log;
    });
    const fileFormat = external_winston_namespaceObject["default"].format.printf(({
      timestamp,
      level,
      message,
      metadata,
      stack
    }) => {
      // Formato para archivos (sin colores)
      let log = `${timestamp} [${level.toUpperCase()}] ${message}`;
      if (Object.keys(metadata).length > 0 && metadata.metadata !== message) {
        log += `\nMetadata: ${JSON.stringify(metadata.metadata, null, 2)}`;
      }
      if (stack) {
        log += `\nStack: ${stack}`;
      }
      return log;
    });
    return {
      console: external_winston_namespaceObject["default"].format.combine(external_winston_namespaceObject["default"].format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
      }), external_winston_namespaceObject["default"].format.errors({
        stack: true
      }), external_winston_namespaceObject["default"].format.metadata(), consoleFormat),
      file: external_winston_namespaceObject["default"].format.combine(external_winston_namespaceObject["default"].format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
      }), external_winston_namespaceObject["default"].format.errors({
        stack: true
      }), external_winston_namespaceObject["default"].format.metadata(), external_winston_namespaceObject["default"].format.json(), fileFormat)
    };
  }
  createLogger() {
    const formats = this.createLogFormat();
    const logger = external_winston_namespaceObject["default"].createLogger({
      levels: logger_config/* loggerConfig */.D.logLevels,
      level: env/* envs */.D.MODE === 'development' ? 'debug' : 'info',
      format: formats.file,
      transports: this.createTransports(),
      exitOnError: false
    });
    if (env/* envs */.D.MODE !== 'production') {
      logger.add(new external_winston_namespaceObject["default"].transports.Console({
        format: formats.console
      }));
    }
    return logger;
  }
  createTransports() {
    return [new external_winston_namespaceObject["default"].transports.DailyRotateFile({
      filename: 'logs/error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      maxFiles: '14d',
      maxSize: '20m'
    }), new external_winston_namespaceObject["default"].transports.DailyRotateFile({
      filename: 'logs/combined-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxFiles: '14d',
      maxSize: '20m'
    })];
  }

  // Método para logging de operaciones de negocio
  logOperation(operation, phase, details = {}) {
    const startTime = Date.now();
    const correlationId = details.correlationId || this.generateCorrelationId();
    const baseContext = {
      operation,
      phase,
      correlationId,
      timestamp: new Date().toISOString(),
      environment: env/* envs */.D.MODE,
      ...details
    };
    this.info(`${operation} ${phase}`, baseContext);

    // Registrar métricas
    this.recordMetric('operationsCount', 1);
    this.recordMetric('totalResponseTime', Date.now() - startTime);
  }

  // Método para logging de modelos
  logModelOperation(modelName, operation, data = {}) {
    const context = {
      model: modelName,
      operation,
      timestamp: new Date().toISOString(),
      ...data
    };
    this.debug(`${modelName}.${operation}`, context);
  }
  logDBTransaction(operation, status, details = {}) {
    const context = {
      operation,
      status,
      timestamp: new Date().toISOString(),
      ...details
    };
    this.debug(`DB Transaction: ${operation} ${status}`, context);
  }

  // Métodos de logging mejorados
  error(message, metadata = {}) {
    this.logger.error(message, {
      metadata
    });
  }
  warn(message, metadata = {}) {
    this.logger.warn(message, {
      metadata
    });
  }
  info(message, metadata = {}) {
    this.logger.info(message, {
      metadata
    });
  }
  debug(message, metadata = {}) {
    this.logger.debug(message, {
      metadata
    });
  }

  // Método para logging de transacciones
  logTransaction(transactionId, action, details = {}) {
    this.info(`Transaction ${action}`, {
      transactionId,
      ...details,
      timestamp: new Date().toISOString()
    });
  }

  // Método para logging de errores con contexto
  logError(error, context = {}) {
    const errorDetails = {
      correlationId: context.correlationId || this.generateCorrelationId(),
      message: error.message,
      name: error.name,
      stack: env/* envs */.D.MODE === 'development' ? error.stack : undefined,
      code: error.code,
      ...context
    };

    // Registrar métricas de error
    this.recordMetric('errorCount', 1);
    this.error('Error occurred', errorDetails);
  }

  // Métodos auxiliares
  calculateAverageResponseTime() {
    const total = this.metrics.get('totalResponseTime') || 0;
    const count = this.metrics.get('operationsCount') || 1;
    return total / count;
  }
  generateCorrelationId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
/* harmony default export */ const logger = (new Logger());

/***/ }),

/***/ 3139:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var x = (y) => {
	var x = {}; __webpack_require__.d(x, y); return x
} 
var y = (x) => (() => (x))
module.exports = x({ ["default"]: () => (__WEBPACK_EXTERNAL_MODULE_bcryptjs__["default"]) });

/***/ }),

/***/ 3158:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var x = (y) => {
	var x = {}; __webpack_require__.d(x, y); return x
} 
var y = (x) => (() => (x))
module.exports = x({ ["default"]: () => (__WEBPACK_EXTERNAL_MODULE_swagger_ui_express_613ebf08__["default"]) });

/***/ }),

/***/ 3328:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var x = (y) => {
	var x = {}; __webpack_require__.d(x, y); return x
} 
var y = (x) => (() => (x))
module.exports = x({ ["default"]: () => (__WEBPACK_EXTERNAL_MODULE_cookie_parser_591162dd__["default"]) });

/***/ }),

/***/ 3902:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  d: () => (/* binding */ UsuarioController)
});

// EXTERNAL MODULE: ./src/config/env.mjs
var env = __webpack_require__(9097);
;// external "nodemailer"
var x = (y) => {
	var x = {}; __webpack_require__.d(x, y); return x
} 
var y = (x) => (() => (x))
const external_nodemailer_namespaceObject = x({ ["default"]: () => (__WEBPACK_EXTERNAL_MODULE_nodemailer__["default"]) });
// EXTERNAL MODULE: ./src/utils/logger.js + 3 modules
var logger = __webpack_require__(3014);
// EXTERNAL MODULE: ./src/utils/CustomError.js
var CustomError = __webpack_require__(2551);
;// ./src/config/smtp.js


// utils



// Configuración del transportador SMTP
const createTransporter = () => {
  const transporter = external_nodemailer_namespaceObject["default"].createTransport({
    host: 'portalrancho.com.mx',
    port: 465,
    secure: true,
    auth: {
      user: env/* envs */.D.EMAIL_USER,
      pass: env/* envs */.D.EMAIL_PASSWORD
    },
    tls: {
      rejectUnauthorized: true,
      minVersion: 'TLSv1.2' // Versión mínima de TLS
    },
    pool: true,
    debug: true,
    logger: false
  });

  // Verificar conexión
  transporter.verify((error, success) => {
    if (error) {
      logger/* default */.A.error('Error en verificación SMTP:', error);
    } else {
      logger/* default */.A.info('Servidor SMTP listo');
    }
  });
  return transporter;
};

// Función auxiliar para obtener color según el estatus
const getStatusColor = status => {
  const colors = {
    Proceso: '#28a745',
    // Verde
    Completada: '#ffc107',
    // Amarillo
    Rechazado: '#dc3545',
    // Rojo
    default: '#17a2b8' // Azul
  };
  return colors[status] || colors.default;
};

// Función auxiliar para detalles adicionales según estatus
const getAdditionalDetails = status => {
  const details = {
    Proceso: '<p>Su solicitud está siendo procesada. Le mantendremos informado sobre cualquier actualización.</p>',
    Completada: '<p>Su solicitud ha sido <strong>completada</strong>. Para más detalles, por favor contacte a nuestro equipo.</p>',
    default: ''
  };
  return details[status] || details.default;
};

// Función para enviar correo con manejo de errores
const sendMail = async message => {
  const transporter = createTransporter();
  try {
    const info = await transporter.sendMail(message);
    logger/* default */.A.info('Correo enviado:', {
      messageId: info.messageId,
      response: info.response
    });
    return info;
  } catch (error) {
    logger/* default */.A.error('Error al enviar correo:', {
      error: error.message,
      code: error.code,
      command: error.command,
      response: error.response
    });
    throw error;
  }
};
const validateEmailData = (type, data) => {
  const requiredFields = {
    status: ['email', 'nombre', 'solicitudId', 'status'],
    solicitud: ['email', 'nombre', 'solicitudId', 'fechaSolicitud', 'usuario', 'data'],
    notificacion: ['email', 'nombre', 'solicitudId', 'data'],
    usuario: ['email', 'password'],
    respuestaSolicitante: ['email', 'nombre', 'solicitudId', 'data', 'usuario'],
    cancelacion: ['email', 'nombre', 'solicitudId', 'data', 'usuario'],
    aprobada: ['email', 'nombre', 'solicitudId', 'data', 'usuario'],
    confirmacionInicial: ['email', 'nombre', 'solicitudId', 'data', 'usuario'],
    devolucion: ['email', 'nombre', 'usuario', 'data'],
    reporteMensualFertilizacion: ['email', 'nombre', 'data']
  };
  const fields = requiredFields[type] || [];
  const missing = fields.filter(field => !data[field]);
  if (missing.length > 0) {
    throw new CustomError/* ValidationError */.yI(`Faltan campos requeridos para el tipo ${type}: ${missing.join(', ')}`);
  }
};
// Función principal para enviar correos
const enviarCorreo = async params => {
  const {
    type,
    email,
    password = '',
    fechaSolicitud = '',
    nombre = 'Usuario',
    solicitudId = '',
    status = '',
    usuario = {},
    data = {}
  } = params;
  // Definir constantes de desarrollo
  const DEV_EMAIL = 'zaragoza051@lgfrutas.com.mx';
  const PRODUCTION_MODE = 'Produccion';

  // Validar datos requeridos según el tipo
  validateEmailData(type, params);

  // Configurar mensaje según tipo
  if (!email || !type) {
    throw new CustomError/* ValidationError */.yI('Email y tipo de mensaje son requeridos');
  }

  // Configurar mensaje según tipo
  const templates = {
    status: {
      from: '"Grupo LG" <mezclas.rancho@portalrancho.com.mx>',
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
      
               <a href="https://solicitudmezclas.portalrancho.com.mx/protected/${status}" style="display: inline-block;background-color:#4CAF50;color:white;padding: 10px 20px;text-decoration: none;border-radius: 5px;margin-top: 20px;">Ver Detalles de la Solicitud</a>
      
               <p>Si tiene alguna pregunta o necesita más información, por favor contacte a nuestro equipo de soporte.</p>
               <p>Atentamente,<br>El equipo de Grupo LG</p>
          </div>
      </body>`
    },
    usuario: {
      from: '"Registro Portal Checador" <mezclas.rancho@portalrancho.com.mx>',
      subject: 'Usuario Creado Exitosamente',
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
             <a href="https://solicitudmezclas.portalrancho.com.mx/" style="display: inline-block;background-color:#4CAF50;color:white;padding: 10px 20px;text-decoration: none;border-radius: 5px;margin-top: 20px;">Iniciar Sesión</a>
            <p>Si tienes alguna pregunta o necesitas ayuda, no dudes en contactar a nuestro equipo de soporte.</p>
            <p>¡Gracias por unirte a nosotros!</p>
            <p>Atentamente,<br>El equipo de Grupo LG</p>
        </div>
    </body>`
    },
    solicitud: {
      from: '"Portal de Solicitudes Grupo LG" <mezclas.rancho@portalrancho.com.mx>',
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
                <li><strong>Rancho:</strong> ${data.rancho || data.ranchoDestino}</li>
            </ul>

            <h4>Detalles de la Solicitud:</h4>
            <ul>
                <li><strong>Fecha de Solicitud:</strong> ${fechaSolicitud}</li>
                <li><strong>Descripción:</strong> ${data.descripcion}</li>
                <li><strong>Folio Receta:</strong> ${data.folio}</li>
            </ul>

            <a href="https://solicitudmezclas.portalrancho.com.mx/protected/solicitudes" style="display: inline-block; background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 20px;">Ver Detalles de la Solicitud</a>

            <p>Si tiene alguna pregunta o necesita más información, por favor contacte a nuestro equipo de soporte.</p>
            <p>Atentamente,<br>El equipo de Grupo LG</p>
        </div>
    </body>`
    },
    notificacion: {
      from: '"Grupo LG" <mezclas.rancho@portalrancho.com.mx>',
      subject: `Notificación de No Disponibilidad - ${solicitudId}`,
      html: ` <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
               <div style="background-color: #FF5733; color: white; text-align: center; padding: 20px;">
                   <h1>Grupo LG</h1>
               </div>
               <div style="background-color: #f9f9f9; border-radius: 5px; padding: 20px; margin-top: 20px;">
                   <h2>Notificación de No Disponibilidad de Producto</h2>
                   <p>Estimado(a) ${nombre},</p>
                   <p>Le informamos que el producto que solicitó no está disponible en este momento. A continuación, se detallan los datos de los productos sin existencia:</p>
      
                   <h4>Solicitud: <b>${solicitudId}</b></h4>
      
                   <ul>
                      ${Array.isArray(data) ? data.map(product => `
                   <li>
                     <strong>Id del Producto:</strong> ${product.id_producto}<br>
                     <strong>Nombre del Producto:</strong> ${product.nombre_producto}<br>
                     <strong>Unidad de Medida:</strong> ${product.unidad_medida}<br>
                     <strong>cantidad:</strong> ${product.cantidad}
                   </li>
                 `).join('') : '<li>No hay productos para mostrar</li>'}
                   </ul>
      
                   <p>Si desea, podemos ofrecerle alternativas similares o puede optar por omitir los productos. Por favor, háganos saber cómo desea proceder.</p>
                  <div style="text-align: center; margin-top: 20px;">
                      <a href="https://solicitudmezclas.portalrancho.com.mx/protected/solicitudes" 
                        style="display: inline-block; background-color: #2196F3; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                        Ver Solicitud
                      </a>
                  </div>
                   <p>Si tiene alguna pregunta o necesita más información, no dude en contactar a nuestro equipo de almacen.</p>
                   <p><strong>Encargado de almacen:</strong> ${usuario?.nombre || 'No especificado'}<br></p>
                   <p><strong>Empresa:</strong> ${usuario?.empresa || 'No especificada'}<br></p>
                   <p><strong>Rancho:</strong> ${usuario?.ranchos || 'No especificado'}<br></p>
                   <p>Atentamente,<br>El equipo de Grupo LG</p>
               </div>
             </body>`
    },
    respuestaSolicitante: {
      from: '"Grupo LG" <mezclas.rancho@portalrancho.com.mx>',
      subject: `Respuesta de Solicitante - Solicitud ${solicitudId}`,
      html: `<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #2196F3; color: white; text-align: center; padding: 20px;">
          <h1>Grupo LG - Respuesta de Solicitante</h1>
        </div>
        
        <div style="background-color: #f9f9f9; border-radius: 5px; padding: 20px; margin-top: 20px;">
          <h2>Nueva Respuesta del Solicitante</h2>
          
          <div style="background-color: #E3F2FD; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h4 style="margin-top: 0;">Detalles de la Solicitud:</h4>
            <ul style="list-style: none; padding: 0;">
              <li><strong>ID Solicitud:</strong> ${solicitudId}</li>
              <li><strong>Solicitante:</strong> ${nombre}</li>
              <li><strong>Empresa:</strong> ${usuario?.empresa || 'No especificada'}</li>
              <li><strong>Ranchos:</strong> ${usuario?.ranchos || 'No especificado'}</li>
            </ul>
          </div>
  
          <div style="background-color: #FFFFFF; padding: 15px; border-left: 4px solid #2196F3; margin: 20px 0;">
            <h4 style="margin-top: 0;">Mensaje del Solicitante:</h4>
            <p style="margin-bottom: 0;">${data.mensaje}</p>
          </div>
  
          <div style="text-align: center; margin-top: 20px;">
            <a href="https://solicitudmezclas.portalrancho.com.mx/protected/solicitudes" 
               style="display: inline-block; background-color: #2196F3; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
               Ver Solicitud
            </a>
          </div>
  
          <p style="margin-top: 20px;">Por favor, revise la respuesta y tome las acciones necesarias.</p>
          
          <hr style="border: 1px solid #eee; margin: 20px 0;">
          
          <p style="color: #666; font-size: 0.9em;">
            Este es un mensaje automático. Si necesita ayuda adicional, contacte al departamento de soporte.
          </p>
          
          <p>Atentamente,<br>El equipo de Grupo LG</p>
        </div>
      </body>`
    },
    cancelacion: {
      from: '"Grupo LG" <mezclas.rancho@portalrancho.com.mx>',
      subject: `Solicitud Cancelada - ${solicitudId}`,
      html: `<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #dc3545; color: white; text-align: center; padding: 20px;">
          <h1>Grupo LG - Solicitud Cancelada</h1>
        </div>
        
        <div style="background-color: #f9f9f9; border-radius: 5px; padding: 20px; margin-top: 20px;">
          <h2>Cancelación de Solicitud</h2>
          
          <div style="background-color: #ffe6e6; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h4 style="margin-top: 0; color: #dc3545;">Detalles de la Solicitud Cancelada:</h4>
            <ul style="list-style: none; padding: 0;">
              <li><strong>ID Solicitud:</strong> ${solicitudId}</li>
              <li><strong>Solicitante:</strong> ${nombre}</li>
              <li><strong>Empresa:</strong> ${usuario?.empresa || 'No especificada'}</li>
              <li><strong>Rancho:</strong> ${usuario?.ranchos || 'No especificado'}</li>
              <li><strong>Fecha de Cancelación:</strong> ${new Date().toLocaleDateString()}</li>
            </ul>
          </div>
  
          <div style="background-color: #FFFFFF; padding: 15px; border-left: 4px solid #dc3545; margin: 20px 0;">
            <h4 style="margin-top: 0;">Motivo de Cancelación:</h4>
            <p style="margin-bottom: 0;">${data.motivo || 'No se especificó motivo'}</p>
          </div>
  
          <p style="margin-top: 20px;">Si considera que esto fue un error o necesita realizar una nueva solicitud, por favor:</p>
          
          <div style="text-align: center; margin-top: 20px;">
            <a href="https://solicitudmezclas.portalrancho.com.mx/protected/solicitud" 
               style="display: inline-block; background-color: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 10px;">
               Crear Nueva Solicitud
            </a>
          </div>
  
          <hr style="border: 1px solid #eee; margin: 20px 0;">
          
          <p style="color: #666; font-size: 0.9em;">
            Si tiene alguna pregunta o necesita aclaraciones, no dude en contactar a nuestro equipo de soporte.
          </p>
          
          <p>Atentamente,<br>El equipo de Grupo LG</p>
        </div>
      </body>`
    },
    aprobada: {
      from: '"Grupo LG" <mezclas.rancho@portalrancho.com.mx>',
      subject: `Solicitud Aprobada - ${solicitudId}`,
      html: `<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #28a745; color: white; text-align: center; padding: 20px;">
          <h1>Grupo LG - Solicitud Aprobada</h1>
        </div>
        
        <div style="background-color: #f9f9f9; border-radius: 5px; padding: 20px; margin-top: 20px;">
          <h2>¡Su Solicitud ha sido Aprobada!</h2>
          
          <div style="background-color: #e8f5e9; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h4 style="margin-top: 0; color: #28a745;">Detalles de la Solicitud:</h4>
            <ul style="list-style: none; padding: 0;">
              <li><strong>ID Solicitud:</strong> ${solicitudId}</li>
              <li><strong>Solicitante:</strong> ${nombre}</li>
              <li><strong>Empresa:</strong> ${usuario?.empresa || 'No especificada'}</li>
              <li><strong>Rancho:</strong> ${usuario?.ranchos || 'No especificado'}</li>
              <li><strong>Fecha de Aprobación:</strong> ${new Date().toLocaleDateString()}</li>
            </ul>
          </div>
  
          <div style="background-color: #FFFFFF; padding: 15px; border-left: 4px solid #28a745; margin: 20px 0;">
            <h4 style="margin-top: 0;">Información Importante:</h4>
            <ul style="list-style: none; padding: 0;">
              <li><strong>Folio:</strong> ${data.folio || 'No especificado'}</li>
              <li><strong>Cantidad:</strong> ${data.cantidad || 'No especificada'}</li>
              <li><strong>Presentación:</strong> ${data.presentacion || 'No especificada'}</li>
              <li><strong>Método de Aplicación:</strong> ${data.metodoAplicacion || 'No especificado'}</li>
            </ul>
          </div>
  
          <p style="background-color: #fff3cd; padding: 10px; border-radius: 5px; border-left: 4px solid #ffc107;">
            <strong>Nota:</strong> La mezcla estará lista para su aprobacion en el almacén asignado.
          </p>

          <hr style="border: 1px solid #eee; margin: 20px 0;">
          
          <p style="color: #666; font-size: 0.9em;">
            Si tiene alguna pregunta o necesita aclaraciones, no dude en contactar a nuestro equipo de soporte.
          </p>
          
          <p>Atentamente,<br>El equipo de Grupo LG</p>
        </div>
      </body>`
    },
    confirmacionInicial: {
      from: '"Grupo LG" <mezclas.rancho@portalrancho.com.mx>',
      subject: `Solicitud Pendiente de Confirmación - ${solicitudId}`,
      html: `<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #2196F3; color: white; text-align: center; padding: 20px;">
          <h1>Grupo LG - Nueva Solicitud por Confirmar</h1>
        </div>
        
        <div style="background-color: #f9f9f9; border-radius: 5px; padding: 20px; margin-top: 20px;">
          <h2>Nueva Solicitud Requiere Confirmación</h2>
          
          <div style="background-color: #E3F2FD; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h4 style="margin-top: 0; color: #2196F3;">Detalles de la Solicitud:</h4>
            <ul style="list-style: none; padding: 0;">
              <li><strong>ID Solicitud:</strong> ${solicitudId}</li>
              <li><strong>Solicitante:</strong> ${nombre}</li>
              <li><strong>Empresa:</strong> ${usuario?.empresa || 'No especificada'}</li>
              <li><strong>Rancho:</strong> ${usuario?.ranchos || 'No especificado'}</li>
              <li><strong>Fecha de Solicitud:</strong> ${new Date().toLocaleDateString()}</li>
            </ul>
          </div>
  
          <div style="background-color: #FFFFFF; padding: 15px; border-left: 4px solid #2196F3; margin: 20px 0;">
            <h4 style="margin-top: 0;">Información de la Mezcla:</h4>
            <ul style="list-style: none; padding: 0;">
              <li><strong>Folio de Receta:</strong> ${data.folio || 'No especificado'}</li>
              <li><strong>Cantidad:</strong> ${data.cantidad || 'No especificada'}</li>
              <li><strong>Presentación:</strong> ${data.presentacion || 'No especificada'}</li>
              <li><strong>Método de Aplicación:</strong> ${data.metodoAplicacion || 'No especificado'}</li>
              <li><strong>Descripción:</strong> ${data.descripcion || 'Sin descripción'}</li>
            </ul>
          </div>
  
          <p style="background-color: #fff3cd; padding: 10px; border-radius: 5px; border-left: 4px solid #ffc107;">
            <strong>Acción Requerida:</strong> Esta solicitud necesita su confirmación para proceder con la preparación.
          </p>
          
          <div style="text-align: center; margin-top: 20px;">
            <a href="https://solicitudmezclas.portalrancho.com.mx/protected/confirmacion" 
               style="display: inline-block; background-color: #2196F3; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 10px;">
               Revisar y Confirmar Solicitud
            </a>
          </div>
  
          <hr style="border: 1px solid #eee; margin: 20px 0;">
          
          <p style="color: #666; font-size: 0.9em;">
            Este es un mensaje automático. Por favor, revise y confirme la solicitud lo antes posible.
          </p>
          
          <p>Atentamente,<br>El equipo de Grupo LG</p>
        </div>
      </body>`
    },
    reevaluacion: {
      from: '"Grupo LG" <mezclas.rancho@portalrancho.com.mx>',
      subject: `Solicitud en Reevaluación - ${solicitudId}`,
      html: `<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #FFA500; color: white; text-align: center; padding: 20px;">
          <h1>Grupo LG - Solicitud en Reevaluación</h1>
        </div>
        
        <div style="background-color: #f9f9f9; border-radius: 5px; padding: 20px; margin-top: 20px;">
          <h2>Solicitud Requiere Reevaluación</h2>
          
          <div style="background-color: #FFF3E0; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h4 style="margin-top: 0; color: #E65100;">Detalles de la Solicitud:</h4>
            <ul style="list-style: none; padding: 0;">
              <li><strong>ID Solicitud:</strong> ${solicitudId}</li>
              <li><strong>Solicitante:</strong> ${nombre}</li>
              <li><strong>Empresa:</strong> ${usuario?.empresa || 'No especificada'}</li>
              <li><strong>Rancho:</strong> ${usuario?.ranchos || 'No especificado'}</li>
              <li><strong>Fecha de Reevaluación:</strong> ${new Date().toLocaleDateString()}</li>
            </ul>
          </div>
  
          <div style="background-color: #FFFFFF; padding: 15px; border-left: 4px solid #FFA500; margin: 20px 0;">
            <h4 style="margin-top: 0;">Observaciones para Reevaluación:</h4>
            <ul style="list-style: none; padding: 0;">
              <li><strong>Motivo:</strong> ${data.motivo || 'No especificado'}</li>
              <li><strong>Comentarios:</strong> ${data.comentarios || 'Sin comentarios adicionales'}</li>
            </ul>
          </div>
  
          <div style="background-color: #FFFFFF; padding: 15px; border-left: 4px solid #2196F3; margin: 20px 0;">
            <h4 style="margin-top: 0;">Detalles de la Mezcla:</h4>
            <ul style="list-style: none; padding: 0;">
              <li><strong>Folio de Receta:</strong> ${data.folio || 'No especificado'}</li>
              <li><strong>Cantidad:</strong> ${data.cantidad || 'No especificada'}</li>
              <li><strong>Presentación:</strong> ${data.presentacion || 'No especificada'}</li>
              <li><strong>Método de Aplicación:</strong> ${data.metodoAplicacion || 'No especificado'}</li>
            </ul>
          </div>
  
          <p style="background-color: #fff3cd; padding: 10px; border-radius: 5px; border-left: 4px solid #ffc107;">
            <strong>Acción Requerida:</strong> Por favor, revise los comentarios y realice las correcciones necesarias.
          </p>
          
          <div style="text-align: center; margin-top: 20px;">
            <a href="https://solicitudmezclas.portalrancho.com.mx/protected/reevaluacion/${solicitudId}" 
               style="display: inline-block; background-color: #FFA500; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 10px;">
               Revisar Solicitud
            </a>
          </div>
  
          <hr style="border: 1px solid #eee; margin: 20px 0;">
          
          <p style="color: #666; font-size: 0.9em;">
            Si necesita asistencia adicional, contacte al departamento de soporte.
          </p>
          
          <p>Atentamente,<br>El equipo de Grupo LG</p>
        </div>
      </body>`
    },
    devolucion: {
      from: '"Grupo LG" <mezclas.rancho@portalrancho.com.mx>',
      subject: `Nueva Solicitud de Devolución - ${solicitudId}`,
      html: `<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background-color: #2196F3; color: white; text-align: center; padding: 20px;">
        <h1>Grupo LG - Nueva Devolución</h1>
      </div>
      
      <div style="background-color: #f9f9f9; border-radius: 5px; padding: 20px; margin-top: 20px;">
        <h2>Nueva Solicitud de Devolución de Productos</h2>
        
        <div style="background-color: #E3F2FD; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h4 style="margin-top: 0; color: #2196F3;">Información del Solicitante:</h4>
          <ul style="list-style: none; padding: 0;">
            <li><strong>Solicitante:</strong> ${nombre}</li>
            <li><strong>Empresa:</strong> ${usuario?.empresa || 'No especificada'}</li>
            <li><strong>Rancho:</strong> ${usuario?.ranchos || 'No especificado'}</li>
            <li><strong>Fecha de Solicitud:</strong> ${new Date().toLocaleDateString()}</li>
          </ul>
        </div>

        <div style="background-color: #FFFFFF; padding: 15px; border-left: 4px solid #2196F3; margin: 20px 0;">
          <h4 style="margin-top: 0;">Productos a Devolver:</h4>
          <div style="margin: 10px 0;">
            ${Array.isArray(data.productos) ? data.productos.map(producto => `
                <div style="border-bottom: 1px solid #eee; padding: 10px 0;">
                  <strong>Producto:</strong> ${producto.nombre}<br>
                  <strong>Cantidad:</strong> ${producto.cantidad} ${producto.unidad_medida}
                </div>
              `).join('') : '<p>No hay productos especificados</p>'}
          </div>
        </div>

        <div style="background-color: #FFFFFF; padding: 15px; border-left: 4px solid #FFA500; margin: 20px 0;">
          <h4 style="margin-top: 0;">Detalles Adicionales:</h4>
          <ul style="list-style: none; padding: 0;">
            <li><strong>Almacén:</strong> ${data.almacen}</li>
            <li><strong>Temporada:</strong> ${data.temporada}</li>
            <li><strong>Descripción:</strong> ${data.descripcion || 'Sin descripción'}</li>
          </ul>
        </div>

        <p style="background-color: #fff3cd; padding: 10px; border-radius: 5px; border-left: 4px solid #ffc107;">
          <strong>Acción Requerida:</strong> Por favor revise y procese esta solicitud de devolución.
        </p>
        
        <div style="text-align: center; margin-top: 20px;">
          <a href="https://solicitudmezclas.portalrancho.com.mx/protected/devoluciones" 
             style="display: inline-block; background-color: #2196F3; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 10px;">
             Gestionar Devolución
          </a>
        </div>

        <hr style="border: 1px solid #eee; margin: 20px 0;">
        
        <p style="color: #666; font-size: 0.9em;">
          Este es un mensaje automático. Por favor, procese la devolución lo antes posible.
        </p>
        
        <p>Atentamente,<br>El equipo de Grupo LG</p>
      </div>
    </body>`
    },
    reporteMensualFertilizacion: {
      from: '"Grupo LG" <mezclas.rancho@portalrancho.com.mx>',
      subject: `Reporte Mensual de Fertilización - ${data.mes || ''}`,
      html: `<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 1200px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #2196F3; color: white; text-align: center; padding: 20px;">
          <h1>Grupo LG - Reporte Mensual de Fertilización</h1>
        </div>
        
        <div style="background-color: #f9f9f9; border-radius: 5px; padding: 20px; margin-top: 20px;">
          <h2>Reporte Detallado de Fertilización</h2>
          <div style="background-color: #E3F2FD; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <ul style="list-style: none; padding: 0;">
              <li><strong>Rancho:</strong> ${data.rancho}</li>
              <li><strong>Mes:</strong> ${data.mes}</li>
              <li><strong>Fecha de Generación:</strong> ${new Date().toLocaleString('es-MX')}</li>
            </ul>
          </div>

          <div style="background-color: #FFFFFF; padding: 15px; border-left: 4px solid #2196F3; margin: 20px 0; overflow-x: auto;">
             <!-- El contenido HTML de la tabla se inyecta aquí -->
             ${data.htmlContent}
          </div>

          <p style="color: #666; font-size: 0.9em; margin-top: 20px;">
            Este es un reporte generado automáticamente.
          </p>
          
          <p>Atentamente,<br>El equipo de Grupo LG</p>
        </div>
      </body>`
    }
  };
  try {
    const template = templates[type];
    if (!template) {
      throw new CustomError/* ValidationError */.yI(`Tipo de mensaje "${type}" no válido`);
    }
    logger/* default */.A.debug('Enviando correo con los siguientes datos:', {
      MODE: env/* envs */.D.MODE,
      type,
      to: env/* envs */.D.MODE !== PRODUCTION_MODE ? DEV_EMAIL : usuario?.email || DEV_EMAIL
    });
    // Configurar el mensaje
    const message = {
      ...template,
      to: env/* envs */.D.MODE !== PRODUCTION_MODE ? DEV_EMAIL : usuario?.email || DEV_EMAIL
    };
    const result = await sendMail(message);
    return {
      success: true,
      messageId: result.messageId
    };
  } catch (error) {
    logger/* default */.A.error('Error en enviarCorreo:', error);
    throw error;
  }
};
// EXTERNAL MODULE: ./src/utils/asyncHandler.js
var asyncHandler = __webpack_require__(6466);
;// ./src/controller/usuario.controller.js



class UsuarioController {
  constructor({
    usuarioModel
  }) {
    this.usuarioModel = usuarioModel;
  }
  delete = (0,asyncHandler/* asyncHandler */.L)(async (req, res) => {
    const {
      id
    } = req.params;
    const logger = req.logger;
    const {
      user
    } = req.session;
    const logContext = {
      operation: 'ELIMINAR USUARIO',
      nombre: user.nombre,
      rol: user.rol,
      id_eliminado: id
    };
    logger.info('Iniciando controlador', logContext);
    const result = await this.usuarioModel.delete({
      id,
      logContext,
      logger
    });
    logger.info('Finalizando controlador', logContext);
    res.json({
      message: `${result.message}`
    });
  });

  // obtener  usuario
  getAll = (0,asyncHandler/* asyncHandler */.L)(async (req, res) => {
    const usuario = await this.usuarioModel.getAll();
    return res.json(usuario);
  });

  // obtener todos los usuarios por empresa
  getUsuarios = (0,asyncHandler/* asyncHandler */.L)(async (req, res) => {
    const {
      user
    } = req.session;
    const usuario = await this.usuarioModel.getUsuarios({
      nombre: user.nombre,
      rol: user.rol,
      empresa: user.empresa
    });
    return res.json(usuario);
  });
  create = (0,asyncHandler/* asyncHandler */.L)(async (req, res) => {
    const result = await this.usuarioModel.create({
      data: req.body
    });
    await enviarCorreo({
      email: req.body.email,
      subject: 'Bienvenido Nuevo Usuario',
      password: req.body.password
    }); // si se creo con exito el usuario enviamos correo con la contraseña
    return res.json({
      message: result.message
    });
  });
  update = (0,asyncHandler/* asyncHandler */.L)(async (req, res) => {
    const {
      id
    } = req.params;
    const result = await this.usuarioModel.update({
      id,
      data: req.body
    });
    return res.json({
      message: result.message
    });
  });
  login = (0,asyncHandler/* asyncHandler */.L)(async (req, res) => {
    const {
      user,
      password
    } = req.body;
    const logger = req.logger;
    const logContext = {
      operation: 'LOGIN',
      user,
      password
    };
    try {
      logger.info('LOGIN started', logContext);
      const result = await this.usuarioModel.login({
        user,
        password,
        logContext,
        logger
      });
      return res.cookie('access_token', result.token, {
        httpOnly: true,
        // la cookie solo se puede acceder en el servidor
        secure: false,
        sameSite: 'strict' // la cookie solo se puede acceder en el mismo dominio
        // maxAge: 60 * 60 * 24 * 30 // la cookie expira
      }).send({
        message: result.message,
        rol: result.rol,
        usuario: result.usuario
      });
    } catch (error) {
      // Log detallado del error
      logger.error('Error al iniciar sesion', {
        ...logContext,
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack,
          code: error.code
        }
      });
      throw error;
    }
  });

  // actualizar contraseña del usuario
  changePassword = (0,asyncHandler/* asyncHandler */.L)(async (req, res) => {
    const {
      id
    } = req.params;
    const {
      contrasenaRes,
      contrasenaRepRes
    } = req.body;
    const logger = req.logger;
    const {
      user
    } = req.session;
    const logContext = {
      operation: 'Cambio de contraseña',
      nombre: user.nombre,
      rol: user.rol,
      id_cambio: id
    };
    // Datos del body
    if (contrasenaRes !== contrasenaRepRes) {
      throw new CustomError/* ValidationError */.yI('Las contraseñas no coinciden', {
        statusCode: 400,
        logContext
      });
    }
    logger.info('Iniciando controlador', logContext);
    const result = await this.usuarioModel.changePasswordAdmin({
      id,
      newPassword: contrasenaRes,
      logContext,
      logger
    });
    logger.info('Finalizando controlador', logContext);
    return res.json({
      message: result.message
    });
  });

  // obtener un usuario por id
  getOne = (0,asyncHandler/* asyncHandler */.L)(async (req, res) => {
    const {
      id
    } = req.params;
    const usuario = await this.usuarioModel.getOneId({
      id
    });
    return res.json(usuario);
  });

  // cerrar sesion
  logout = (0,asyncHandler/* asyncHandler */.L)(async (req, res) => {
    res.clearCookie('access_token');
    // Destruir la sesión si existe
    if (req.session) {
      req.session.user = null;
    }
    return res.redirect('/');
  });
}

/***/ }),

/***/ 4831:
/***/ ((__webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(__webpack_module__, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   t: () => (/* binding */ TanquesPreparados)
/* harmony export */ });
/* harmony import */ var sequelize__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8265);
/* harmony import */ var _db_db_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9815);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_db_db_js__WEBPACK_IMPORTED_MODULE_1__]);
_db_db_js__WEBPACK_IMPORTED_MODULE_1__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];


const tanquesPreparadosConfig = {
  id: {
    type: sequelize__WEBPACK_IMPORTED_MODULE_0__.DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  id_tanque: {
    type: sequelize__WEBPACK_IMPORTED_MODULE_0__.DataTypes.INTEGER,
    allowNull: false
  },
  id_rancho: {
    type: sequelize__WEBPACK_IMPORTED_MODULE_0__.DataTypes.INTEGER,
    allowNull: false
  },
  fecha_preparacion: {
    type: sequelize__WEBPACK_IMPORTED_MODULE_0__.DataTypes.DATEONLY,
    allowNull: false
  },
  litros_totales: {
    type: sequelize__WEBPACK_IMPORTED_MODULE_0__.DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  litros_disponibles: {
    type: sequelize__WEBPACK_IMPORTED_MODULE_0__.DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  codigo_tanque_preparado: {
    type: sequelize__WEBPACK_IMPORTED_MODULE_0__.DataTypes.STRING(50),
    allowNull: true
  },
  tasa_inyeccion: {
    type: sequelize__WEBPACK_IMPORTED_MODULE_0__.DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00
  }
};
const TanquesPreparados = _db_db_js__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .A.define('TanquesPreparados', tanquesPreparadosConfig, {
  tableName: 'tanques_preparados',
  timestamps: false
});
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 5129:
/***/ ((__webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(__webpack_module__, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   r: () => (/* binding */ CorporativoController)
/* harmony export */ });
/* harmony import */ var _schema_empresas_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5458);
/* harmony import */ var _schema_sectores_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2692);
/* harmony import */ var _schema_ranchos_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(5964);
/* harmony import */ var _schema_rancho_dsa_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(1682);
/* harmony import */ var _schema_tanques_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(8293);
/* harmony import */ var _schema_activo_mezcla_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(731);
/* harmony import */ var _schema_temporada_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(6073);
/* harmony import */ var _utils_asyncHandler_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(6466);
/* harmony import */ var _utils_errorHandlers_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(6963);
/* harmony import */ var _utils_CustomError_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(2551);
/* harmony import */ var _db_db_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(9815);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_schema_empresas_js__WEBPACK_IMPORTED_MODULE_0__, _schema_sectores_js__WEBPACK_IMPORTED_MODULE_1__, _schema_ranchos_js__WEBPACK_IMPORTED_MODULE_2__, _schema_rancho_dsa_js__WEBPACK_IMPORTED_MODULE_3__, _schema_tanques_js__WEBPACK_IMPORTED_MODULE_4__, _schema_activo_mezcla_js__WEBPACK_IMPORTED_MODULE_5__, _schema_temporada_js__WEBPACK_IMPORTED_MODULE_6__, _db_db_js__WEBPACK_IMPORTED_MODULE_9__]);
([_schema_empresas_js__WEBPACK_IMPORTED_MODULE_0__, _schema_sectores_js__WEBPACK_IMPORTED_MODULE_1__, _schema_ranchos_js__WEBPACK_IMPORTED_MODULE_2__, _schema_rancho_dsa_js__WEBPACK_IMPORTED_MODULE_3__, _schema_tanques_js__WEBPACK_IMPORTED_MODULE_4__, _schema_activo_mezcla_js__WEBPACK_IMPORTED_MODULE_5__, _schema_temporada_js__WEBPACK_IMPORTED_MODULE_6__, _db_db_js__WEBPACK_IMPORTED_MODULE_9__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);
/* eslint-disable camelcase */











class CorporativoController {
  // ========== VISTAS ==========
  static renderEmpresas = (0,_utils_asyncHandler_js__WEBPACK_IMPORTED_MODULE_10__/* .asyncHandler */ .L)(async (req, res) => {
    res.render('pages/catalogo/empresas', {
      title: 'Empresas',
      user: req.user,
      rol: req.user.rol
    });
  });
  static renderSectores = (0,_utils_asyncHandler_js__WEBPACK_IMPORTED_MODULE_10__/* .asyncHandler */ .L)(async (req, res) => {
    const ranchosDsa = await _schema_rancho_dsa_js__WEBPACK_IMPORTED_MODULE_3__/* .RanchoDsa */ .M.findAll({
      include: [{
        model: _schema_ranchos_js__WEBPACK_IMPORTED_MODULE_2__/* .Ranchos */ .h,
        attributes: ['id', 'rancho']
      }],
      where: {
        status: 1
      }
    });
    res.render('pages/catalogo/sectores', {
      title: 'Sectores',
      user: req.user,
      rol: req.user.rol,
      ranchosDsa
    });
  });
  static renderRanchos = (0,_utils_asyncHandler_js__WEBPACK_IMPORTED_MODULE_10__/* .asyncHandler */ .L)(async (req, res) => {
    const empresas = await _schema_empresas_js__WEBPACK_IMPORTED_MODULE_0__/* .Empresas */ .p.findAll({
      where: {
        status: 1
      }
    });
    res.render('pages/catalogo/ranchos', {
      title: 'Ranchos',
      user: req.user,
      rol: req.user.rol,
      empresas
    });
  });
  static renderTanques = (0,_utils_asyncHandler_js__WEBPACK_IMPORTED_MODULE_10__/* .asyncHandler */ .L)(async (req, res) => {
    const ranchos = await _schema_ranchos_js__WEBPACK_IMPORTED_MODULE_2__/* .Ranchos */ .h.findAll({
      where: {
        status: 1
      }
    });
    res.render('pages/catalogo/tanques', {
      title: 'Tanques',
      user: req.user,
      rol: req.user.rol,
      ranchos
    });
  });
  static renderActivosMezcla = (0,_utils_asyncHandler_js__WEBPACK_IMPORTED_MODULE_10__/* .asyncHandler */ .L)(async (req, res) => {
    res.render('pages/catalogo/activos_mezcla', {
      title: 'Activos de Mezcla',
      user: req.user,
      rol: req.user.rol
    });
  });
  static renderRanchoDsa = (0,_utils_asyncHandler_js__WEBPACK_IMPORTED_MODULE_10__/* .asyncHandler */ .L)(async (req, res) => {
    const ranchos = await _schema_ranchos_js__WEBPACK_IMPORTED_MODULE_2__/* .Ranchos */ .h.findAll({
      where: {
        status: 1
      }
    });
    res.render('pages/catalogo/rancho_dsa', {
      title: 'Rancho DSA',
      user: req.user,
      rol: req.user.rol,
      ranchos
    });
  });

  // ========== API GET (READ) ==========
  static getEmpresas = (0,_utils_asyncHandler_js__WEBPACK_IMPORTED_MODULE_10__/* .asyncHandler */ .L)(async (req, res) => {
    const empresas = await _schema_empresas_js__WEBPACK_IMPORTED_MODULE_0__/* .Empresas */ .p.findAll();
    res.json(empresas);
  });
  static getSectores = (0,_utils_asyncHandler_js__WEBPACK_IMPORTED_MODULE_10__/* .asyncHandler */ .L)(async (req, res) => {
    const sectores = await _schema_sectores_js__WEBPACK_IMPORTED_MODULE_1__/* .Sectores */ .d.findAll({
      include: [{
        model: _schema_rancho_dsa_js__WEBPACK_IMPORTED_MODULE_3__/* .RanchoDsa */ .M,
        attributes: ['id', 'nombre_rancho_dsa', 'numero_rancho_dsa'],
        include: [{
          model: _schema_ranchos_js__WEBPACK_IMPORTED_MODULE_2__/* .Ranchos */ .h,
          attributes: ['id', 'rancho']
        }]
      }]
    });
    res.json(sectores);
  });
  static getSectoresPorRancho = (0,_utils_asyncHandler_js__WEBPACK_IMPORTED_MODULE_10__/* .asyncHandler */ .L)(async (req, res) => {
    const {
      rancho_id
    } = req.params;
    const sectores = await _schema_sectores_js__WEBPACK_IMPORTED_MODULE_1__/* .Sectores */ .d.findAll({
      where: {
        id_rancho_dsa: rancho_id,
        status: 1
      },
      include: [{
        model: _schema_rancho_dsa_js__WEBPACK_IMPORTED_MODULE_3__/* .RanchoDsa */ .M,
        attributes: ['id', 'nombre_rancho_dsa', 'numero_rancho_dsa'],
        include: [{
          model: _schema_ranchos_js__WEBPACK_IMPORTED_MODULE_2__/* .Ranchos */ .h,
          attributes: ['id', 'rancho']
        }]
      }]
    });
    res.json(sectores);
  });
  static getRanchos = (0,_utils_asyncHandler_js__WEBPACK_IMPORTED_MODULE_10__/* .asyncHandler */ .L)(async (req, res) => {
    const ranchos = await _schema_ranchos_js__WEBPACK_IMPORTED_MODULE_2__/* .Ranchos */ .h.findAll({
      include: [{
        model: _schema_empresas_js__WEBPACK_IMPORTED_MODULE_0__/* .Empresas */ .p,
        attributes: ['id', 'nombre_comercial']
      }]
    });
    res.json(ranchos);
  });
  static getTanques = (0,_utils_asyncHandler_js__WEBPACK_IMPORTED_MODULE_10__/* .asyncHandler */ .L)(async (req, res) => {
    const tanques = await _schema_tanques_js__WEBPACK_IMPORTED_MODULE_4__/* .Tanques */ .C.findAll({
      include: [{
        model: _schema_ranchos_js__WEBPACK_IMPORTED_MODULE_2__/* .Ranchos */ .h,
        attributes: ['id', 'rancho']
      }]
    });
    res.json(tanques);
  });
  static getTanquesPorRancho = (0,_utils_asyncHandler_js__WEBPACK_IMPORTED_MODULE_10__/* .asyncHandler */ .L)(async (req, res) => {
    const {
      rancho_id
    } = req.params;
    const tanques = await _schema_tanques_js__WEBPACK_IMPORTED_MODULE_4__/* .Tanques */ .C.findAll({
      where: {
        id_rancho: rancho_id,
        status: 1
      },
      include: [{
        model: _schema_ranchos_js__WEBPACK_IMPORTED_MODULE_2__/* .Ranchos */ .h,
        attributes: ['id', 'rancho']
      }]
    });
    res.json(tanques);
  });
  static getActivosMezcla = (0,_utils_asyncHandler_js__WEBPACK_IMPORTED_MODULE_10__/* .asyncHandler */ .L)(async (req, res) => {
    const activos = await _schema_activo_mezcla_js__WEBPACK_IMPORTED_MODULE_5__/* .ActivoMezcla */ .B.findAll();
    res.json(activos);
  });
  static getRanchosDsa = (0,_utils_asyncHandler_js__WEBPACK_IMPORTED_MODULE_10__/* .asyncHandler */ .L)(async (req, res) => {
    const ranchos = await _schema_rancho_dsa_js__WEBPACK_IMPORTED_MODULE_3__/* .RanchoDsa */ .M.findAll({
      include: [{
        model: _schema_ranchos_js__WEBPACK_IMPORTED_MODULE_2__/* .Ranchos */ .h,
        attributes: ['id', 'rancho']
      }],
      where: {
        status: 1
      }
    });
    res.json(ranchos);
  });

  // ========== API POST (CREATE), PUT (UPDATE), DELETE ==========

  // --- EMPRESAS ---
  static createEmpresa = (0,_utils_asyncHandler_js__WEBPACK_IMPORTED_MODULE_10__/* .asyncHandler */ .L)(async (req, res) => {
    const {
      nombre_comercial,
      razon_social,
      rfc
    } = req.body;
    (0,_utils_errorHandlers_js__WEBPACK_IMPORTED_MODULE_7__/* .validateRequiredData */ .ip)(req.body, ['nombre_comercial', 'razon_social', 'rfc'], {
      operation: 'CREATE_EMPRESA'
    });
    const nuevaEmpresa = await _schema_empresas_js__WEBPACK_IMPORTED_MODULE_0__/* .Empresas */ .p.create({
      nombre_comercial,
      razon_social,
      rfc,
      status: 1
    });
    res.status(201).json({
      success: true,
      message: 'Empresa creada correctamenta',
      data: nuevaEmpresa
    });
  });
  static updateEmpresa = (0,_utils_asyncHandler_js__WEBPACK_IMPORTED_MODULE_10__/* .asyncHandler */ .L)(async (req, res) => {
    const {
      id
    } = req.params;
    const {
      nombre_comercial,
      razon_social,
      rfc,
      status
    } = req.body;
    const empresa = await _schema_empresas_js__WEBPACK_IMPORTED_MODULE_0__/* .Empresas */ .p.findByPk(id);
    if (!empresa) throw new _utils_CustomError_js__WEBPACK_IMPORTED_MODULE_8__/* .NotFoundError */ .m_('Empresa no encontrada');
    await empresa.update({
      nombre_comercial,
      razon_social,
      rfc,
      status
    });
    res.json({
      success: true,
      message: 'Empresa actualizada correctamente',
      data: empresa
    });
  });
  static deleteEmpresa = (0,_utils_asyncHandler_js__WEBPACK_IMPORTED_MODULE_10__/* .asyncHandler */ .L)(async (req, res) => {
    const {
      id
    } = req.params;
    const empresa = await _schema_empresas_js__WEBPACK_IMPORTED_MODULE_0__/* .Empresas */ .p.findByPk(id);
    if (!empresa) throw new _utils_CustomError_js__WEBPACK_IMPORTED_MODULE_8__/* .NotFoundError */ .m_('Empresa no encontrada');

    // Soft delete (cambiar status a 0)
    await empresa.update({
      status: 0
    });
    res.json({
      success: true,
      message: 'Empresa eliminada correctamente'
    });
  });

  // --- RANCHOS ---
  static createRancho = (0,_utils_asyncHandler_js__WEBPACK_IMPORTED_MODULE_10__/* .asyncHandler */ .L)(async (req, res) => {
    const {
      rancho,
      id_empresa
    } = req.body;
    (0,_utils_errorHandlers_js__WEBPACK_IMPORTED_MODULE_7__/* .validateRequiredData */ .ip)(req.body, ['rancho', 'id_empresa'], {
      operation: 'CREATE_RANCHO'
    });
    const nuevoRancho = await _schema_ranchos_js__WEBPACK_IMPORTED_MODULE_2__/* .Ranchos */ .h.create({
      rancho,
      id_empresa,
      status: 1
    });
    res.status(201).json({
      success: true,
      message: 'Rancho creado correctamente',
      data: nuevoRancho
    });
  });
  static updateRancho = (0,_utils_asyncHandler_js__WEBPACK_IMPORTED_MODULE_10__/* .asyncHandler */ .L)(async (req, res) => {
    const {
      id
    } = req.params;
    const {
      rancho,
      id_empresa,
      status
    } = req.body;
    const ranchoItem = await _schema_ranchos_js__WEBPACK_IMPORTED_MODULE_2__/* .Ranchos */ .h.findByPk(id);
    if (!ranchoItem) throw new _utils_CustomError_js__WEBPACK_IMPORTED_MODULE_8__/* .NotFoundError */ .m_('Rancho no encontrado');
    await ranchoItem.update({
      rancho,
      id_empresa,
      status
    });
    res.json({
      success: true,
      message: 'Rancho actualizado correctamente',
      data: ranchoItem
    });
  });
  static deleteRancho = (0,_utils_asyncHandler_js__WEBPACK_IMPORTED_MODULE_10__/* .asyncHandler */ .L)(async (req, res) => {
    const {
      id
    } = req.params;
    const rancho = await _schema_ranchos_js__WEBPACK_IMPORTED_MODULE_2__/* .Ranchos */ .h.findByPk(id);
    if (!rancho) throw new _utils_CustomError_js__WEBPACK_IMPORTED_MODULE_8__/* .NotFoundError */ .m_('Rancho no encontrado');
    await rancho.update({
      status: 0
    });
    res.json({
      success: true,
      message: 'Rancho eliminado correctamente'
    });
  });

  // --- SECTORES ---
  static createSector = (0,_utils_asyncHandler_js__WEBPACK_IMPORTED_MODULE_10__/* .asyncHandler */ .L)(async (req, res) => {
    const {
      sector_interno,
      sector_agrian,
      variedad,
      hectareas,
      id_rancho_dsa
    } = req.body;
    (0,_utils_errorHandlers_js__WEBPACK_IMPORTED_MODULE_7__/* .validateRequiredData */ .ip)(req.body, ['sector_interno', 'variedad', 'hectareas', 'id_rancho_dsa'], {
      operation: 'CREATE_SECTOR'
    });
    const nuevoSector = await _schema_sectores_js__WEBPACK_IMPORTED_MODULE_1__/* .Sectores */ .d.create({
      sector_interno,
      sector_agrian,
      variedad,
      hectareas,
      id_rancho_dsa,
      status: 1
    });
    res.status(201).json({
      success: true,
      message: 'Sector creado correctamente',
      data: nuevoSector
    });
  });
  static updateSector = (0,_utils_asyncHandler_js__WEBPACK_IMPORTED_MODULE_10__/* .asyncHandler */ .L)(async (req, res) => {
    const {
      id
    } = req.params;
    const {
      sector_interno,
      sector_agrian,
      variedad,
      hectareas,
      id_rancho_dsa,
      status
    } = req.body;
    const sector = await _schema_sectores_js__WEBPACK_IMPORTED_MODULE_1__/* .Sectores */ .d.findByPk(id);
    if (!sector) throw new _utils_CustomError_js__WEBPACK_IMPORTED_MODULE_8__/* .NotFoundError */ .m_('Sector no encontrado');
    await sector.update({
      sector_interno,
      sector_agrian,
      variedad,
      hectareas,
      id_rancho_dsa,
      status
    });
    res.json({
      success: true,
      message: 'Sector actualizado correctamente',
      data: sector
    });
  });
  static deleteSector = (0,_utils_asyncHandler_js__WEBPACK_IMPORTED_MODULE_10__/* .asyncHandler */ .L)(async (req, res) => {
    const {
      id
    } = req.params;
    const sector = await _schema_sectores_js__WEBPACK_IMPORTED_MODULE_1__/* .Sectores */ .d.findByPk(id);
    if (!sector) throw new _utils_CustomError_js__WEBPACK_IMPORTED_MODULE_8__/* .NotFoundError */ .m_('Sector no encontrado');
    await sector.update({
      status: 0
    });
    res.json({
      success: true,
      message: 'Sector eliminado correctamente'
    });
  });

  // --- TANQUES ---
  static createTanque = (0,_utils_asyncHandler_js__WEBPACK_IMPORTED_MODULE_10__/* .asyncHandler */ .L)(async (req, res) => {
    const {
      codigo,
      etapa,
      capacidad,
      unidad,
      id_rancho
    } = req.body;
    (0,_utils_errorHandlers_js__WEBPACK_IMPORTED_MODULE_7__/* .validateRequiredData */ .ip)(req.body, ['codigo', 'etapa', 'capacidad', 'id_rancho'], {
      operation: 'CREATE_TANQUE'
    });
    const nuevoTanque = await _schema_tanques_js__WEBPACK_IMPORTED_MODULE_4__/* .Tanques */ .C.create({
      codigo,
      etapa,
      capacidad,
      unidad: unidad || 'L',
      status: 1,
      id_rancho
    });
    res.status(201).json({
      success: true,
      message: 'Tanque creado correctamente',
      data: nuevoTanque
    });
  });
  static updateTanque = (0,_utils_asyncHandler_js__WEBPACK_IMPORTED_MODULE_10__/* .asyncHandler */ .L)(async (req, res) => {
    const {
      id
    } = req.params;
    const {
      codigo,
      etapa,
      capacidad,
      unidad,
      id_rancho,
      status
    } = req.body;
    const tanque = await _schema_tanques_js__WEBPACK_IMPORTED_MODULE_4__/* .Tanques */ .C.findByPk(id);
    if (!tanque) throw new _utils_CustomError_js__WEBPACK_IMPORTED_MODULE_8__/* .NotFoundError */ .m_('Tanque no encontrado');
    await tanque.update({
      codigo,
      etapa,
      capacidad,
      unidad,
      id_rancho,
      status
    });
    res.json({
      success: true,
      message: 'Tanque actualizado correctamente',
      data: tanque
    });
  });
  static deleteTanque = (0,_utils_asyncHandler_js__WEBPACK_IMPORTED_MODULE_10__/* .asyncHandler */ .L)(async (req, res) => {
    const {
      id
    } = req.params;
    const tanque = await _schema_tanques_js__WEBPACK_IMPORTED_MODULE_4__/* .Tanques */ .C.findByPk(id);
    if (!tanque) throw new _utils_CustomError_js__WEBPACK_IMPORTED_MODULE_8__/* .NotFoundError */ .m_('Tanque no encontrado');
    await tanque.update({
      status: 0
    });
    res.json({
      success: true,
      message: 'Tanque eliminado correctamente'
    });
  });

  // --- ACTIVOS MEZCLA ---
  static createActivoMezcla = (0,_utils_asyncHandler_js__WEBPACK_IMPORTED_MODULE_10__/* .asyncHandler */ .L)(async (req, res) => {
    const {
      nombre,
      codigo,
      tipo,
      es_principal,
      unidad
    } = req.body;
    (0,_utils_errorHandlers_js__WEBPACK_IMPORTED_MODULE_7__/* .validateRequiredData */ .ip)(req.body, ['nombre', 'codigo', 'unidad'], {
      operation: 'CREATE_ACTIVO_MEZCLA'
    });
    const nuevoActivo = await _schema_activo_mezcla_js__WEBPACK_IMPORTED_MODULE_5__/* .ActivoMezcla */ .B.create({
      nombre,
      codigo,
      tipo,
      es_principal: es_principal || 0,
      unidad
    });
    res.status(201).json({
      success: true,
      message: 'Activo creado correctamente',
      data: nuevoActivo
    });
  });
  static updateActivoMezcla = (0,_utils_asyncHandler_js__WEBPACK_IMPORTED_MODULE_10__/* .asyncHandler */ .L)(async (req, res) => {
    const {
      id
    } = req.params;
    const {
      nombre,
      codigo,
      tipo,
      es_principal,
      unidad
    } = req.body;
    const activo = await _schema_activo_mezcla_js__WEBPACK_IMPORTED_MODULE_5__/* .ActivoMezcla */ .B.findByPk(id);
    if (!activo) throw new _utils_CustomError_js__WEBPACK_IMPORTED_MODULE_8__/* .NotFoundError */ .m_('Activo no encontrado');
    await activo.update({
      nombre,
      codigo,
      tipo,
      es_principal,
      unidad
    });
    res.json({
      success: true,
      message: 'Activo actualizado correctamente',
      data: activo
    });
  });
  static deleteActivoMezcla = (0,_utils_asyncHandler_js__WEBPACK_IMPORTED_MODULE_10__/* .asyncHandler */ .L)(async (req, res) => {
    const {
      id
    } = req.params;
    const activo = await _schema_activo_mezcla_js__WEBPACK_IMPORTED_MODULE_5__/* .ActivoMezcla */ .B.findByPk(id);
    if (!activo) throw new _utils_CustomError_js__WEBPACK_IMPORTED_MODULE_8__/* .NotFoundError */ .m_('Activo no encontrado');

    // Note: activo_mezcla schema doesn't have status field, so we'll do hard delete
    await activo.destroy();
    res.json({
      success: true,
      message: 'Activo eliminado correctamente'
    });
  });

  // ---Ranchos DSA--
  static createRanchoDsa = (0,_utils_asyncHandler_js__WEBPACK_IMPORTED_MODULE_10__/* .asyncHandler */ .L)(async (req, res) => {
    const {
      nombre_rancho_dsa,
      id_rancho,
      numero_rancho_dsa
    } = req.body;
    (0,_utils_errorHandlers_js__WEBPACK_IMPORTED_MODULE_7__/* .validateRequiredData */ .ip)(req.body, ['id_rancho', 'nombre_rancho_dsa', 'numero_rancho_dsa'], {
      operation: 'CREATE_RANCHO_DSA'
    });
    const nuevoRancho = await _schema_rancho_dsa_js__WEBPACK_IMPORTED_MODULE_3__/* .RanchoDsa */ .M.create({
      nombre_rancho_dsa,
      id_rancho,
      numero_rancho_dsa
    });
    res.status(201).json({
      success: true,
      message: 'Rancho DSA creado correctamente',
      data: nuevoRancho
    });
  });
  static updateRanchoDsa = (0,_utils_asyncHandler_js__WEBPACK_IMPORTED_MODULE_10__/* .asyncHandler */ .L)(async (req, res) => {
    const {
      id
    } = req.params;
    const {
      nombre_rancho_dsa,
      id_rancho,
      numero_rancho_dsa
    } = req.body;
    (0,_utils_errorHandlers_js__WEBPACK_IMPORTED_MODULE_7__/* .validateRequiredData */ .ip)(req.body, ['id_rancho', 'nombre_rancho_dsa', 'numero_rancho_dsa'], {
      operation: 'UPDATE_RANCHO_DSA'
    });
    const rancho = await _schema_rancho_dsa_js__WEBPACK_IMPORTED_MODULE_3__/* .RanchoDsa */ .M.findByPk(id);
    if (!rancho) throw new _utils_CustomError_js__WEBPACK_IMPORTED_MODULE_8__/* .NotFoundError */ .m_('Rancho DSA no encontrado');
    await rancho.update({
      nombre_rancho_dsa,
      id_rancho,
      numero_rancho_dsa
    });
    res.json({
      success: true,
      message: 'Rancho DSA actualizado correctamente',
      data: rancho
    });
  });
  static deleteRanchoDsa = (0,_utils_asyncHandler_js__WEBPACK_IMPORTED_MODULE_10__/* .asyncHandler */ .L)(async (req, res) => {
    const {
      id
    } = req.params;
    const rancho = await _schema_rancho_dsa_js__WEBPACK_IMPORTED_MODULE_3__/* .RanchoDsa */ .M.findByPk(id);
    if (!rancho) throw new _utils_CustomError_js__WEBPACK_IMPORTED_MODULE_8__/* .NotFoundError */ .m_('Rancho DSA no encontrado');
    await rancho.destroy();
    res.json({
      success: true,
      message: 'Rancho DSA eliminado correctamente'
    });
  });

  // --- TEMPORADAS ---
  static getTemporadas = (0,_utils_asyncHandler_js__WEBPACK_IMPORTED_MODULE_10__/* .asyncHandler */ .L)(async (req, res) => {
    const temporadas = await _schema_temporada_js__WEBPACK_IMPORTED_MODULE_6__/* .Temporada */ .S.findAll({
      where: {
        status: 1
      }
    });
    res.json({
      temporadas
    });
  });
  static getAnios = (0,_utils_asyncHandler_js__WEBPACK_IMPORTED_MODULE_10__/* .asyncHandler */ .L)(async (req, res) => {
    const anios = await _db_db_js__WEBPACK_IMPORTED_MODULE_9__/* ["default"] */ .A.query(`
                    SELECT anio FROM npk_fertilizacion_completo GROUP by anio
                    `, {
      type: _db_db_js__WEBPACK_IMPORTED_MODULE_9__/* ["default"] */ .A.QueryTypes.SELECT
    });
    res.json({
      anios
    });
  });
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 5458:
/***/ ((__webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(__webpack_module__, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   p: () => (/* binding */ Empresas)
/* harmony export */ });
/* harmony import */ var sequelize__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8265);
/* harmony import */ var _db_db_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9815);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_db_db_js__WEBPACK_IMPORTED_MODULE_1__]);
_db_db_js__WEBPACK_IMPORTED_MODULE_1__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];


const empresasConfig = {
  id: {
    type: sequelize__WEBPACK_IMPORTED_MODULE_0__.DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false // Añadir esta línea
  },
  razon_social: {
    type: sequelize__WEBPACK_IMPORTED_MODULE_0__.DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'La razón social es requerida'
      },
      len: {
        args: [3, 50],
        msg: 'La razón social debe tener entre 3 y 50 caracteres'
      }
    }
  },
  nombre_comercial: {
    type: sequelize__WEBPACK_IMPORTED_MODULE_0__.DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El nombre comercial es requerido'
      },
      len: {
        args: [3, 50],
        msg: 'El nombre comercial debe tener entre 3 y 50 caracteres'
      }
    }
  },
  rfc: {
    type: sequelize__WEBPACK_IMPORTED_MODULE_0__.DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El RFC es requerido'
      },
      len: {
        args: [12, 13],
        msg: 'El RFC debe tener 12 o 13 caracteres'
      }
    }
  },
  status: {
    type: sequelize__WEBPACK_IMPORTED_MODULE_0__.DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: true
  }
};
const Empresas = _db_db_js__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .A.define('empresas', empresasConfig, {
  tableName: 'empresas',
  // Nombre de la tabla en la base de datos
  timestamps: false // Agrega createdAt y updatedAt automáticamente
});
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 5541:
/***/ ((__webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(__webpack_module__, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   G: () => (/* binding */ createUsuarioRouter)
/* harmony export */ });
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2674);
/* harmony import */ var _controller_usuario_controller_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3902);
/* harmony import */ var _middlewares_authMiddleware_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(936);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_middlewares_authMiddleware_js__WEBPACK_IMPORTED_MODULE_2__]);
_middlewares_authMiddleware_js__WEBPACK_IMPORTED_MODULE_2__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];



const createUsuarioRouter = ({
  usuarioModel
}) => {
  const router = (0,express__WEBPACK_IMPORTED_MODULE_0__.Router)();
  const usuarioController = new _controller_usuario_controller_js__WEBPACK_IMPORTED_MODULE_1__/* .UsuarioController */ .d({
    usuarioModel
  });

  // rutas de inicio de sesion

  router.post('/login', usuarioController.login); // logear usuario
  router.get('/logout', _middlewares_authMiddleware_js__WEBPACK_IMPORTED_MODULE_2__/* .authenticate */ .QF, usuarioController.logout); // Para enlaces de navegación

  // Crear un usuario
  router.post('/', _middlewares_authMiddleware_js__WEBPACK_IMPORTED_MODULE_2__/* .authenticate */ .QF, usuarioController.create);
  router.get('/usuarios', _middlewares_authMiddleware_js__WEBPACK_IMPORTED_MODULE_2__/* .authenticate */ .QF, usuarioController.getUsuarios);
  router.get('/', _middlewares_authMiddleware_js__WEBPACK_IMPORTED_MODULE_2__/* .authenticate */ .QF, usuarioController.getAll);
  router.get('/:id', _middlewares_authMiddleware_js__WEBPACK_IMPORTED_MODULE_2__/* .authenticate */ .QF, usuarioController.getOne);
  router.patch('/:id', _middlewares_authMiddleware_js__WEBPACK_IMPORTED_MODULE_2__/* .authenticate */ .QF, usuarioController.update);
  router.delete('/:id', _middlewares_authMiddleware_js__WEBPACK_IMPORTED_MODULE_2__/* .authenticate */ .QF, usuarioController.delete);
  router.put('/:id', _middlewares_authMiddleware_js__WEBPACK_IMPORTED_MODULE_2__/* .authenticate */ .QF, usuarioController.changePassword);
  return router;
};
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 5708:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var x = (y) => {
	var x = {}; __webpack_require__.d(x, y); return x
} 
var y = (x) => (() => (x))
module.exports = x({ ["config"]: () => (__WEBPACK_EXTERNAL_MODULE_dotenv__.config), ["default"]: () => (__WEBPACK_EXTERNAL_MODULE_dotenv__["default"]) });

/***/ }),

/***/ 5964:
/***/ ((__webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(__webpack_module__, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   h: () => (/* binding */ Ranchos)
/* harmony export */ });
/* harmony import */ var sequelize__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8265);
/* harmony import */ var _db_db_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9815);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_db_db_js__WEBPACK_IMPORTED_MODULE_1__]);
_db_db_js__WEBPACK_IMPORTED_MODULE_1__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];


const ranchosConfig = {
  id: {
    type: sequelize__WEBPACK_IMPORTED_MODULE_0__.DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false // Añadir esta línea
  },
  rancho: {
    type: sequelize__WEBPACK_IMPORTED_MODULE_0__.DataTypes.STRING,
    allowNull: false,
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
  status: {
    type: sequelize__WEBPACK_IMPORTED_MODULE_0__.DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: true
  }
};
const Ranchos = _db_db_js__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .A.define('ranchos', ranchosConfig, {
  tableName: 'ranchos',
  // Nombre de la tabla en la base de datos
  timestamps: false // Agrega createdAt y updatedAt automáticamente
});
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 6073:
/***/ ((__webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(__webpack_module__, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   S: () => (/* binding */ Temporada)
/* harmony export */ });
/* harmony import */ var sequelize__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8265);
/* harmony import */ var _db_db_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9815);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_db_db_js__WEBPACK_IMPORTED_MODULE_1__]);
_db_db_js__WEBPACK_IMPORTED_MODULE_1__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];


const empleadosConfig = {
  id: {
    type: sequelize__WEBPACK_IMPORTED_MODULE_0__.DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false // Añadir esta línea
  },
  temporada: {
    type: sequelize__WEBPACK_IMPORTED_MODULE_0__.DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'La temporada es requerida'
      },
      len: {
        args: [3, 20],
        msg: 'La temporada debe tener entre 3 y 20 caracteres'
      }
    }
  },
  status: {
    type: sequelize__WEBPACK_IMPORTED_MODULE_0__.DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: true
  }
};
const Temporada = _db_db_js__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .A.define('temporada', empleadosConfig, {
  tableName: 'temporada',
  // Nombre de la tabla en la base de datos
  timestamps: false // Agrega createdAt y updatedAt automáticamente
});
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 6210:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  _: () => (/* binding */ swaggerSpec)
});

;// external "swagger-jsdoc"
var x = (y) => {
	var x = {}; __webpack_require__.d(x, y); return x
} 
var y = (x) => (() => (x))
const external_swagger_jsdoc_namespaceObject = x({ ["default"]: () => (__WEBPACK_EXTERNAL_MODULE_swagger_jsdoc_4cc0b3b9__["default"]) });
// EXTERNAL MODULE: external "dotenv"
var external_dotenv_ = __webpack_require__(5708);
;// ./src/utils/swagger.js


(0,external_dotenv_.config)();
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Mezclas',
      version: '1.0.0',
      description: 'API para el sistema de mezclas',
      contact: {
        name: 'Soporte',
        email: 'soporte@example.com'
      }
    },
    servers: [{
      url: process.env.API_URL || 'http://localhost:3000',
      description: 'Servidor de desarrollo'
    }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Ingrese su token JWT'
        }
      },
      responses: {
        UnauthorizedError: {
          description: 'Token no proporcionado o inválido',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: {
                    type: 'string',
                    example: 'No autorizado'
                  }
                }
              }
            }
          }
        }
      }
    },
    security: [{
      bearerAuth: []
    }]
  },
  apis: ['./src/routes/*.js']
};
const swaggerSpec = (0,external_swagger_jsdoc_namespaceObject["default"])(options);

/***/ }),

/***/ 6386:
/***/ ((__webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(__webpack_module__, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   k: () => (/* binding */ MezclaActivos)
/* harmony export */ });
/* harmony import */ var sequelize__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8265);
/* harmony import */ var _db_db_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9815);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_db_db_js__WEBPACK_IMPORTED_MODULE_1__]);
_db_db_js__WEBPACK_IMPORTED_MODULE_1__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];


const mezclaActivosConfig = {
  id: {
    type: sequelize__WEBPACK_IMPORTED_MODULE_0__.DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  id_mezcla: {
    type: sequelize__WEBPACK_IMPORTED_MODULE_0__.DataTypes.INTEGER,
    allowNull: false
  },
  id_activo: {
    type: sequelize__WEBPACK_IMPORTED_MODULE_0__.DataTypes.INTEGER,
    allowNull: false
  },
  porcentaje: {
    type: sequelize__WEBPACK_IMPORTED_MODULE_0__.DataTypes.DECIMAL(10, 4),
    allowNull: false
  }
};
const MezclaActivos = _db_db_js__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .A.define('MezclaActivos', mezclaActivosConfig, {
  tableName: 'mezcla_activos',
  timestamps: false
});
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 6466:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   L: () => (/* binding */ asyncHandler)
/* harmony export */ });
const asyncHandler = fn => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/***/ }),

/***/ 6717:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Uq: () => (/* binding */ retryOperation),
/* harmony export */   aG: () => (/* binding */ CircuitBreaker)
/* harmony export */ });
/* unused harmony export withRetry */
/* harmony import */ var _CustomError_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2551);
/* harmony import */ var _logger_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3014);


const TRANSIENT_ERROR_CODES = ['ECONNRESET', 'ETIMEDOUT', 'ECONNREFUSED', 'DEADLOCK', 'LOCK_TIMEOUT', 'PROTOCOL_CONNECTION_LOST', 'ER_CON_COUNT_ERROR', 'ECONNABORTED', 'ER_LOCK_DEADLOCK'];
const isTransientError = error => {
  if (!error) return false;

  // Verificar códigos de error conocidos
  if (TRANSIENT_ERROR_CODES.includes(error.code)) return true;

  // Verificar tipos de error específicos
  if (error instanceof _CustomError_js__WEBPACK_IMPORTED_MODULE_0__/* .TimeoutError */ .MU || error instanceof _CustomError_js__WEBPACK_IMPORTED_MODULE_0__/* .ServiceUnavailableError */ .us) return true;

  // Verificar mensajes de error
  const errorMsg = error.message?.toLowerCase() || '';
  return errorMsg.includes('deadlock') || errorMsg.includes('timeout') || errorMsg.includes('connection') || errorMsg.includes('network') || errorMsg.includes('unavailable');
};
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// Circuit breaker para prevenir sobrecarga
class CircuitBreaker {
  constructor(options = {}) {
    this.failureThreshold = options.failureThreshold || 5;
    this.resetTimeout = options.resetTimeout || 60000;
    this.failures = 0;
    this.lastFailureTime = null;
    this.state = 'CLOSED'; // CLOSED, OPEN, HALF_OPEN
  }
  async execute(operation, context = {}) {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailureTime >= this.resetTimeout) {
        this.state = 'HALF_OPEN';
        _logger_js__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .A.info('Circuit breaker entrando en estado HALF_OPEN', context);
      } else {
        throw new _CustomError_js__WEBPACK_IMPORTED_MODULE_0__/* .ServiceUnavailableError */ .us('Circuit breaker abierto - Servicio temporalmente no disponible');
      }
    }
    try {
      const result = await operation();
      if (this.state === 'HALF_OPEN') {
        this.reset();
        _logger_js__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .A.info('Circuit breaker restaurado a estado CLOSED', context);
      }
      return result;
    } catch (error) {
      this.recordFailure(error, context);
      throw error;
    }
  }
  recordFailure(error, context) {
    this.failures++;
    this.lastFailureTime = Date.now();
    if (this.failures >= this.failureThreshold) {
      this.state = 'OPEN';
      _logger_js__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .A.warn('Circuit breaker abierto por exceso de fallos', {
        ...context,
        failures: this.failures,
        error: error.message
      });
    }
  }
  reset() {
    this.failures = 0;
    this.lastFailureTime = null;
    this.state = 'CLOSED';
  }
}

// Función principal de retry con circuit breaker
const retryOperation = async (operation, context = {}, options = {}) => {
  const {
    maxRetries = 3,
    circuitBreaker = null,
    baseDelay = 1000,
    errorFilter = isTransientError
  } = options;
  let lastError;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      // Si hay un circuit breaker, usarlo
      if (circuitBreaker) {
        return await circuitBreaker.execute(operation, context);
      } else {
        return await operation();
      }
    } catch (error) {
      lastError = error;
      if (!errorFilter(error)) {
        _logger_js__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .A.error('Error no transitorio detectado', {
          ...context,
          error: error.message,
          attempt,
          maxRetries
        });
        throw error;
      }
      if (attempt === maxRetries) {
        _logger_js__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .A.error('Operación fallida después del máximo de reintentos', {
          ...context,
          error: error.message,
          maxRetries
        });
        throw new _CustomError_js__WEBPACK_IMPORTED_MODULE_0__/* .DatabaseError */ .a$('Operación fallida después de múltiples reintentos', {
          originalError: error.message,
          attempts: maxRetries,
          context
        });
      }
      const waitTime = baseDelay * Math.pow(2, attempt - 1); // Backoff exponencial

      _logger_js__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .A.warn('Reintentando operación después de error transitorio', {
        ...context,
        error: error.message,
        attempt,
        maxRetries,
        nextRetryMs: waitTime
      });
      await delay(waitTime);
    }
  }
  throw lastError;
};

// Helper para crear una versión con retry de cualquier función
const withRetry = (operation, options = {}) => {
  return (...args) => retryOperation(() => operation(...args), options);
};
/* unused harmony default export */ var __WEBPACK_DEFAULT_EXPORT__ = ((/* unused pure expression or super */ null && (retryOperation)));

/***/ }),

/***/ 6928:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("path");

/***/ }),

/***/ 6963:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   eX: () => (/* binding */ enrichError),
/* harmony export */   ie: () => (/* binding */ handleDatabaseError),
/* harmony export */   ip: () => (/* binding */ validateRequiredData)
/* harmony export */ });
/* unused harmony exports handleOperationError, handleTransactionError, withErrorHandling */
/* harmony import */ var _logger_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3014);
/* harmony import */ var _CustomError_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2551);



// Utilidad para enriquecer el contexto del error
const enrichError = (error, context = {}) => {
  if (error instanceof _CustomError_js__WEBPACK_IMPORTED_MODULE_1__/* .CustomError */ .eo) {
    error.details = {
      ...error.details,
      ...context,
      timestamp: new Date().toISOString()
    };
  }
  return error;
};

// Manejo genérico de errores de base de datos
const handleDatabaseError = (error, operation, context = {}) => {
  _logger_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A.logError(error, {
    operation,
    ...context,
    stack: error.stack
  });
  if (error instanceof _CustomError_js__WEBPACK_IMPORTED_MODULE_1__/* .CustomError */ .eo) {
    throw enrichError(error, context);
  }
  throw new _CustomError_js__WEBPACK_IMPORTED_MODULE_1__/* .DatabaseError */ .a$(`Error en operación: ${operation}`, {
    originalError: error.message,
    context: {
      ...context,
      operation
    }
  });
};

// Manejo genérico de errores de operaciones
const handleOperationError = (error, operation, context = {}) => {
  logger.logError(error, {
    operation,
    ...context,
    stack: error.stack
  });
  if (error instanceof CustomError) {
    throw enrichError(error, context);
  }
  throw new MezclaOperationError(operation, `Error en operación: ${operation}`, {
    originalError: error.message,
    context: {
      ...context,
      operation
    }
  });
};

// Manejador de errores para transacciones
const handleTransactionError = async (transaction, error, operation, context = {}) => {
  try {
    await transaction.rollback();
    logger.logDBTransaction(operation, 'rolled_back', {
      error: error.message,
      correlationId: context.correlationId
    });
  } catch (rollbackError) {
    logger.logError(rollbackError, {
      operation: `${operation}_ROLLBACK`,
      originalError: error.message,
      ...context
    });
  }
  handleOperationError(error, operation, context);
};

// Validador genérico de datos requeridos
const validateRequiredData = (data = {}, requiredFields = [], context = {}) => {
  const missing = requiredFields.filter(field => {
    const value = data[field];
    return value === undefined || value === null || value === '';
  });
  if (missing.length > 0) {
    throw enrichError(new _CustomError_js__WEBPACK_IMPORTED_MODULE_1__/* .MezclaOperationError */ .Cr('VALIDATION', 'Datos requeridos no proporcionados', {
      required: requiredFields,
      missing,
      received: Object.keys(data),
      context
    }));
  }
};

// Manejo de excepciones async
const withErrorHandling = (operation, handler) => {
  return async (...args) => {
    try {
      return await handler(...args);
    } catch (error) {
      handleOperationError(error, operation, {
        args
      });
    }
  };
};

/***/ }),

/***/ 6982:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("crypto");

/***/ }),

/***/ 7084:
/***/ ((__webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(__webpack_module__, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   D: () => (/* binding */ DbHelper)
/* harmony export */ });
/* harmony import */ var _db_db_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9815);
/* harmony import */ var _logger_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3014);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_db_db_js__WEBPACK_IMPORTED_MODULE_0__]);
_db_db_js__WEBPACK_IMPORTED_MODULE_0__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];


class DbHelper {
  static async executeQuery(callback) {
    try {
      const result = await callback(_db_db_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A);
      return result;
    } catch (error) {
      _logger_js__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .A.error('Error ejecutando consulta:', {
        error: error.message,
        stack: error.stack
      });
      throw error;
    }
  }
  static async withTransaction(callback) {
    const transaction = await _db_db_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A.transaction();
    try {
      const result = await callback(transaction);
      await transaction.commit();
      return result;
    } catch (error) {
      await transaction.rollback();
      _logger_js__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .A.error('Error en transacción:', {
        error: error.message
      });
      throw error;
    }
  }
}

// Ejemplo de uso:
/*
import { DbHelper } from '../utils/dbHelper.js'

// Para consultas simples:
const resultado = await DbHelper.executeQuery(async (sequelize) => {
  return await MiModelo.findAll()
})

// Para transacciones:
const resultado = await DbHelper.withTransaction(async (transaction) => {
  const user = await Usuario.create({
    nombre: 'Juan',
    email: 'juan@example.com'
  }, { transaction })

  await Perfil.create({
    usuarioId: user.id,
    tipo: 'admin'
  }, { transaction })

  return user
})
*/
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 7176:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   t: () => (/* binding */ correlationMiddleware)
/* harmony export */ });
/* harmony import */ var _config_logger_config_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9021);
/* harmony import */ var _utils_logger_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3014);


const correlationMiddleware = (req, res, next) => {
  // Obtener o generar ID de correlación
  const correlationId = req.headers[_config_logger_config_js__WEBPACK_IMPORTED_MODULE_0__/* .loggerConfig */ .D.correlation.headerName] || _utils_logger_js__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .A.generateCorrelationId();

  // Agregar a request
  req.correlationId = correlationId;

  // Agregar a headers de respuesta
  res.setHeader(_config_logger_config_js__WEBPACK_IMPORTED_MODULE_0__/* .loggerConfig */ .D.correlation.headerName, correlationId);

  // Crear logger con correlación
  req.logger = _utils_logger_js__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .A.withCorrelation(correlationId);
  next();
};

/***/ }),

/***/ 7979:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var x = (y) => {
	var x = {}; __webpack_require__.d(x, y); return x
} 
var y = (x) => (() => (x))
module.exports = x({ ["default"]: () => (__WEBPACK_EXTERNAL_MODULE_helmet__["default"]) });

/***/ }),

/***/ 8118:
/***/ ((__webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(__webpack_module__, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   p: () => (/* binding */ MezclaCatalogo)
/* harmony export */ });
/* harmony import */ var sequelize__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8265);
/* harmony import */ var _db_db_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9815);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_db_db_js__WEBPACK_IMPORTED_MODULE_1__]);
_db_db_js__WEBPACK_IMPORTED_MODULE_1__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];


const mezclasConfig = {
  id: {
    type: sequelize__WEBPACK_IMPORTED_MODULE_0__.DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  nombre: {
    type: sequelize__WEBPACK_IMPORTED_MODULE_0__.DataTypes.STRING(30),
    allowNull: false
  },
  fabricante: {
    type: sequelize__WEBPACK_IMPORTED_MODULE_0__.DataTypes.STRING(50),
    allowNull: false
  },
  descripcion: {
    type: sequelize__WEBPACK_IMPORTED_MODULE_0__.DataTypes.TEXT,
    allowNull: true
  }
};

// User asked for creation of schemas based on SQL.
// Using 'MezclaCatalogo' as model name to avoid collision if 'Mezcla' is already used by `mezclas.js` (which was Solicitud).
const MezclaCatalogo = _db_db_js__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .A.define('MezclaCatalogo', mezclasConfig, {
  tableName: 'mezclas',
  timestamps: false
});
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 8258:
/***/ ((__webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(__webpack_module__, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (/* binding */ createFertilizacionRouter)
/* harmony export */ });
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2674);
/* harmony import */ var _controller_fertilizacion_controller_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(1938);
/* harmony import */ var _middlewares_authMiddleware_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(936);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_controller_fertilizacion_controller_js__WEBPACK_IMPORTED_MODULE_1__, _middlewares_authMiddleware_js__WEBPACK_IMPORTED_MODULE_2__]);
([_controller_fertilizacion_controller_js__WEBPACK_IMPORTED_MODULE_1__, _middlewares_authMiddleware_js__WEBPACK_IMPORTED_MODULE_2__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);



const createFertilizacionRouter = () => {
  const router = (0,express__WEBPACK_IMPORTED_MODULE_0__.Router)();

  // ========== CATÁLOGOS Y DATOS ==========
  router.get('/catalogos', _controller_fertilizacion_controller_js__WEBPACK_IMPORTED_MODULE_1__/* .FertilizacionController */ .w.getCatalogos);
  router.get('/tanques-preparados', (0,_middlewares_authMiddleware_js__WEBPACK_IMPORTED_MODULE_2__/* .checkRoleAuth */ .tE)(['inocuidad', 'produccion', 'master']), _controller_fertilizacion_controller_js__WEBPACK_IMPORTED_MODULE_1__/* .FertilizacionController */ .w.getTanquesPreparados);
  router.post('/tanques-preparados/:id/duplicar', (0,_middlewares_authMiddleware_js__WEBPACK_IMPORTED_MODULE_2__/* .checkRoleAuth */ .tE)(['inocuidad', 'produccion', 'master']), _controller_fertilizacion_controller_js__WEBPACK_IMPORTED_MODULE_1__/* .FertilizacionController */ .w.duplicarTanquePreparado);
  router.get('/tanques-preparados/rancho/:id_rancho', (0,_middlewares_authMiddleware_js__WEBPACK_IMPORTED_MODULE_2__/* .checkRoleAuth */ .tE)(['inocuidad', 'produccion', 'master']), _controller_fertilizacion_controller_js__WEBPACK_IMPORTED_MODULE_1__/* .FertilizacionController */ .w.getTanquesPreparadosPorRancho);

  // ========== RENDERIZAR PÁGINAS ==========
  router.get('/mezclas', (0,_middlewares_authMiddleware_js__WEBPACK_IMPORTED_MODULE_2__/* .checkRoleAuth */ .tE)(['inocuidad', 'produccion', 'master']), _controller_fertilizacion_controller_js__WEBPACK_IMPORTED_MODULE_1__/* .FertilizacionController */ .w.renderMezclas);
  router.get('/graficas', (0,_middlewares_authMiddleware_js__WEBPACK_IMPORTED_MODULE_2__/* .checkRoleAuth */ .tE)(['inocuidad', 'produccion', 'master']), _controller_fertilizacion_controller_js__WEBPACK_IMPORTED_MODULE_1__/* .FertilizacionController */ .w.renderGraficas);
  router.get('/preparar-tanque', (0,_middlewares_authMiddleware_js__WEBPACK_IMPORTED_MODULE_2__/* .checkRoleAuth */ .tE)(['produccion', 'master']), _controller_fertilizacion_controller_js__WEBPACK_IMPORTED_MODULE_1__/* .FertilizacionController */ .w.renderPrepararTanque);
  router.get('/nueva-estructura/registro', (0,_middlewares_authMiddleware_js__WEBPACK_IMPORTED_MODULE_2__/* .checkRoleAuth */ .tE)(['inocuidad', 'master']), _controller_fertilizacion_controller_js__WEBPACK_IMPORTED_MODULE_1__/* .FertilizacionController */ .w.renderNuevaEstructuraRegistro);
  router.get('/nueva-estructura/reportes', (0,_middlewares_authMiddleware_js__WEBPACK_IMPORTED_MODULE_2__/* .checkRoleAuth */ .tE)(['inocuidad', 'produccion', 'master']), _controller_fertilizacion_controller_js__WEBPACK_IMPORTED_MODULE_1__/* .FertilizacionController */ .w.renderNuevaEstructuraReportes);

  // ========== GESTIÓN DE MEZCLAS CATÁLOGO (API) ==========
  // Crear nueva mezcla catálogo
  router.post('/mezclas', (0,_middlewares_authMiddleware_js__WEBPACK_IMPORTED_MODULE_2__/* .checkRoleAuth */ .tE)(['inocuidad', 'produccion', 'master']), _controller_fertilizacion_controller_js__WEBPACK_IMPORTED_MODULE_1__/* .FertilizacionController */ .w.crearMezcla);
  // Actualizar mezcla catálogo
  router.put('/mezclas/:id', (0,_middlewares_authMiddleware_js__WEBPACK_IMPORTED_MODULE_2__/* .checkRoleAuth */ .tE)(['inocuidad', 'produccion', 'master']), _controller_fertilizacion_controller_js__WEBPACK_IMPORTED_MODULE_1__/* .FertilizacionController */ .w.actualizarMezcla);
  // Eliminar mezcla catálogo
  router.delete('/mezclas/:id', (0,_middlewares_authMiddleware_js__WEBPACK_IMPORTED_MODULE_2__/* .checkRoleAuth */ .tE)(['inocuidad', 'produccion', 'master']), _controller_fertilizacion_controller_js__WEBPACK_IMPORTED_MODULE_1__/* .FertilizacionController */ .w.eliminarMezcla);
  // Obtener todas las mezclas catálogo (API)
  router.get('/catalogo/mezclas', _controller_fertilizacion_controller_js__WEBPACK_IMPORTED_MODULE_1__/* .FertilizacionController */ .w.obtenerMezclas);
  // Obtener una mezcla específica por ID
  router.get('/mezclas/:id', _controller_fertilizacion_controller_js__WEBPACK_IMPORTED_MODULE_1__/* .FertilizacionController */ .w.obtenerMezclaPorId);
  // Asignar ingredientes a una mezcla catálogo (definir receta)
  router.post('/mezclas/:id_mezcla/ingredientes', (0,_middlewares_authMiddleware_js__WEBPACK_IMPORTED_MODULE_2__/* .checkRoleAuth */ .tE)(['inocuidad', 'produccion', 'master']), _controller_fertilizacion_controller_js__WEBPACK_IMPORTED_MODULE_1__/* .FertilizacionController */ .w.asignarActivosMezcla);
  // Obtener ingredientes de una mezcla
  router.get('/mezclas/:id_mezcla/ingredientes', _controller_fertilizacion_controller_js__WEBPACK_IMPORTED_MODULE_1__/* .FertilizacionController */ .w.obtenerActivosMezcla);
  // Actualizar ingredientes de una mezcla (eliminar los viejos y agregar los nuevos)
  router.put('/mezclas/:id_mezcla/ingredientes', (0,_middlewares_authMiddleware_js__WEBPACK_IMPORTED_MODULE_2__/* .checkRoleAuth */ .tE)(['inocuidad', 'produccion', 'master']), _controller_fertilizacion_controller_js__WEBPACK_IMPORTED_MODULE_1__/* .FertilizacionController */ .w.actualizarActivosMezcla);

  // ========== PREPARACIÓN DE TANQUES EN CAMPO ==========
  // PASO 1: Preparar tanque (seleccionar mezcla existente + tanque físico)
  router.post('/preparar-tanque', (0,_middlewares_authMiddleware_js__WEBPACK_IMPORTED_MODULE_2__/* .checkRoleAuth */ .tE)(['inocuidad', 'produccion', 'master']), _controller_fertilizacion_controller_js__WEBPACK_IMPORTED_MODULE_1__/* .FertilizacionController */ .w.crearTanquePreparado);
  router.get('/tanques-preparados/:id', _controller_fertilizacion_controller_js__WEBPACK_IMPORTED_MODULE_1__/* .FertilizacionController */ .w.getDetalleTanque);
  router.get('/tanques-preparados/rancho/:id_rancho', _controller_fertilizacion_controller_js__WEBPACK_IMPORTED_MODULE_1__/* .FertilizacionController */ .w.getTanquesPreparadosPorRancho);

  // ========== FERTILIZACIONES ==========
  // Registrar nueva fertilización
  router.post('/fertilizaciones', (0,_middlewares_authMiddleware_js__WEBPACK_IMPORTED_MODULE_2__/* .checkRoleAuth */ .tE)(['inocuidad', 'produccion', 'master']), _controller_fertilizacion_controller_js__WEBPACK_IMPORTED_MODULE_1__/* .FertilizacionController */ .w.registrarFertilizacion);
  // Registrar fertilización múltiple (sectores + horas)
  router.post('/fertilizaciones/bulk', (0,_middlewares_authMiddleware_js__WEBPACK_IMPORTED_MODULE_2__/* .checkRoleAuth */ .tE)(['inocuidad', 'produccion', 'master']), _controller_fertilizacion_controller_js__WEBPACK_IMPORTED_MODULE_1__/* .FertilizacionController */ .w.registrarFertilizacionBulk);
  // Agregar tanque a fertilización existente
  router.post('/fertilizaciones/:id/tanques', (0,_middlewares_authMiddleware_js__WEBPACK_IMPORTED_MODULE_2__/* .checkRoleAuth */ .tE)(['inocuidad', 'produccion', 'master']), _controller_fertilizacion_controller_js__WEBPACK_IMPORTED_MODULE_1__/* .FertilizacionController */ .w.agregarTanque);

  // ========== REPORTES ESPECIALIZADOS (API) ==========
  router.get('/reportes/inventario', _controller_fertilizacion_controller_js__WEBPACK_IMPORTED_MODULE_1__/* .FertilizacionController */ .w.reporteInventario);
  router.get('/reportes/resumen-anual', _controller_fertilizacion_controller_js__WEBPACK_IMPORTED_MODULE_1__/* .FertilizacionController */ .w.reporteResumenAnual);
  router.get('/reportes/semanal', _controller_fertilizacion_controller_js__WEBPACK_IMPORTED_MODULE_1__/* .FertilizacionController */ .w.reporteSemanal);
  router.get('/reportes/por-variedad', _controller_fertilizacion_controller_js__WEBPACK_IMPORTED_MODULE_1__/* .FertilizacionController */ .w.reportePorVariedad);
  router.get('/reportes/mensual-rancho', _controller_fertilizacion_controller_js__WEBPACK_IMPORTED_MODULE_1__/* .FertilizacionController */ .w.reporteMensualRancho);
  router.get('/reportes/comparativo-mensual', _controller_fertilizacion_controller_js__WEBPACK_IMPORTED_MODULE_1__/* .FertilizacionController */ .w.reporteComparativoMensual);
  router.get('/reportes/top-sectores', _controller_fertilizacion_controller_js__WEBPACK_IMPORTED_MODULE_1__/* .FertilizacionController */ .w.reporteTopSectores);
  router.get('/reportes/fertilizacion', _controller_fertilizacion_controller_js__WEBPACK_IMPORTED_MODULE_1__/* .FertilizacionController */ .w.reporteFertilizacionCompleto);
  router.get('/reportes/exportar', _controller_fertilizacion_controller_js__WEBPACK_IMPORTED_MODULE_1__/* .FertilizacionController */ .w.reporteExcelFertilizacion);
  router.get('/reportes/detalle-tanques', _controller_fertilizacion_controller_js__WEBPACK_IMPORTED_MODULE_1__/* .FertilizacionController */ .w.getDetalleTanquesPorCodigos);
  return router;
};
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 8261:
/***/ ((__webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(__webpack_module__, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   S: () => (/* binding */ createCorporativoRouter)
/* harmony export */ });
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2674);
/* harmony import */ var _controller_corporativo_controller_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(5129);
/* harmony import */ var _middlewares_authMiddleware_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(936);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_controller_corporativo_controller_js__WEBPACK_IMPORTED_MODULE_1__, _middlewares_authMiddleware_js__WEBPACK_IMPORTED_MODULE_2__]);
([_controller_corporativo_controller_js__WEBPACK_IMPORTED_MODULE_1__, _middlewares_authMiddleware_js__WEBPACK_IMPORTED_MODULE_2__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);



const createCorporativoRouter = () => {
  const router = (0,express__WEBPACK_IMPORTED_MODULE_0__.Router)();

  // ========== RENDERIZAR PÁGINAS ==========
  router.get('/empresas', (0,_middlewares_authMiddleware_js__WEBPACK_IMPORTED_MODULE_2__/* .checkRoleAuth */ .tE)(['master']), _controller_corporativo_controller_js__WEBPACK_IMPORTED_MODULE_1__/* .CorporativoController */ .r.renderEmpresas);
  router.get('/sectores', (0,_middlewares_authMiddleware_js__WEBPACK_IMPORTED_MODULE_2__/* .checkRoleAuth */ .tE)(['master']), _controller_corporativo_controller_js__WEBPACK_IMPORTED_MODULE_1__/* .CorporativoController */ .r.renderSectores);
  router.get('/ranchos', (0,_middlewares_authMiddleware_js__WEBPACK_IMPORTED_MODULE_2__/* .checkRoleAuth */ .tE)(['master']), _controller_corporativo_controller_js__WEBPACK_IMPORTED_MODULE_1__/* .CorporativoController */ .r.renderRanchos);
  router.get('/tanques', (0,_middlewares_authMiddleware_js__WEBPACK_IMPORTED_MODULE_2__/* .checkRoleAuth */ .tE)(['master']), _controller_corporativo_controller_js__WEBPACK_IMPORTED_MODULE_1__/* .CorporativoController */ .r.renderTanques);
  router.get('/rancho-dsa', (0,_middlewares_authMiddleware_js__WEBPACK_IMPORTED_MODULE_2__/* .checkRoleAuth */ .tE)(['master']), _controller_corporativo_controller_js__WEBPACK_IMPORTED_MODULE_1__/* .CorporativoController */ .r.renderRanchoDsa);
  router.get('/activos-mezcla', (0,_middlewares_authMiddleware_js__WEBPACK_IMPORTED_MODULE_2__/* .checkRoleAuth */ .tE)(['master']), _controller_corporativo_controller_js__WEBPACK_IMPORTED_MODULE_1__/* .CorporativoController */ .r.renderActivosMezcla);

  // ========== RUTAS API ==========
  // --- EMPRESAS ---
  router.get('/api/empresas', (0,_middlewares_authMiddleware_js__WEBPACK_IMPORTED_MODULE_2__/* .checkRoleAuth */ .tE)(['produccion', 'inocuidad', 'master']), _controller_corporativo_controller_js__WEBPACK_IMPORTED_MODULE_1__/* .CorporativoController */ .r.getEmpresas);
  router.post('/api/empresas', (0,_middlewares_authMiddleware_js__WEBPACK_IMPORTED_MODULE_2__/* .checkRoleAuth */ .tE)(['master']), _controller_corporativo_controller_js__WEBPACK_IMPORTED_MODULE_1__/* .CorporativoController */ .r.createEmpresa);
  router.put('/api/empresas/:id', (0,_middlewares_authMiddleware_js__WEBPACK_IMPORTED_MODULE_2__/* .checkRoleAuth */ .tE)(['master']), _controller_corporativo_controller_js__WEBPACK_IMPORTED_MODULE_1__/* .CorporativoController */ .r.updateEmpresa);
  router.delete('/api/empresas/:id', (0,_middlewares_authMiddleware_js__WEBPACK_IMPORTED_MODULE_2__/* .checkRoleAuth */ .tE)(['master']), _controller_corporativo_controller_js__WEBPACK_IMPORTED_MODULE_1__/* .CorporativoController */ .r.deleteEmpresa);

  // --- SECTORES ---
  router.get('/api/sectores/', (0,_middlewares_authMiddleware_js__WEBPACK_IMPORTED_MODULE_2__/* .checkRoleAuth */ .tE)(['produccion', 'inocuidad', 'master']), _controller_corporativo_controller_js__WEBPACK_IMPORTED_MODULE_1__/* .CorporativoController */ .r.getSectores);
  router.get('/api/sectores/:rancho_id', (0,_middlewares_authMiddleware_js__WEBPACK_IMPORTED_MODULE_2__/* .checkRoleAuth */ .tE)(['produccion', 'inocuidad', 'master']), _controller_corporativo_controller_js__WEBPACK_IMPORTED_MODULE_1__/* .CorporativoController */ .r.getSectoresPorRancho);
  router.post('/api/sectores', (0,_middlewares_authMiddleware_js__WEBPACK_IMPORTED_MODULE_2__/* .checkRoleAuth */ .tE)(['produccion', 'inocuidad', 'master']), _controller_corporativo_controller_js__WEBPACK_IMPORTED_MODULE_1__/* .CorporativoController */ .r.createSector);
  router.put('/api/sectores/:id', (0,_middlewares_authMiddleware_js__WEBPACK_IMPORTED_MODULE_2__/* .checkRoleAuth */ .tE)(['produccion', 'inocuidad', 'master']), _controller_corporativo_controller_js__WEBPACK_IMPORTED_MODULE_1__/* .CorporativoController */ .r.updateSector);
  router.delete('/api/sectores/:id', (0,_middlewares_authMiddleware_js__WEBPACK_IMPORTED_MODULE_2__/* .checkRoleAuth */ .tE)(['produccion', 'inocuidad', 'master']), _controller_corporativo_controller_js__WEBPACK_IMPORTED_MODULE_1__/* .CorporativoController */ .r.deleteSector);

  // --- RANCHOS ---
  router.get('/api/ranchos', (0,_middlewares_authMiddleware_js__WEBPACK_IMPORTED_MODULE_2__/* .checkRoleAuth */ .tE)(['produccion', 'inocuidad', 'master']), _controller_corporativo_controller_js__WEBPACK_IMPORTED_MODULE_1__/* .CorporativoController */ .r.getRanchos);
  router.post('/api/ranchos', (0,_middlewares_authMiddleware_js__WEBPACK_IMPORTED_MODULE_2__/* .checkRoleAuth */ .tE)(['master']), _controller_corporativo_controller_js__WEBPACK_IMPORTED_MODULE_1__/* .CorporativoController */ .r.createRancho);
  router.put('/api/ranchos/:id', (0,_middlewares_authMiddleware_js__WEBPACK_IMPORTED_MODULE_2__/* .checkRoleAuth */ .tE)(['master']), _controller_corporativo_controller_js__WEBPACK_IMPORTED_MODULE_1__/* .CorporativoController */ .r.updateRancho);
  router.delete('/api/ranchos/:id', (0,_middlewares_authMiddleware_js__WEBPACK_IMPORTED_MODULE_2__/* .checkRoleAuth */ .tE)(['master']), _controller_corporativo_controller_js__WEBPACK_IMPORTED_MODULE_1__/* .CorporativoController */ .r.deleteRancho);

  // --- TANQUES ---
  router.get('/api/tanques', (0,_middlewares_authMiddleware_js__WEBPACK_IMPORTED_MODULE_2__/* .checkRoleAuth */ .tE)(['produccion', 'inocuidad', 'master']), _controller_corporativo_controller_js__WEBPACK_IMPORTED_MODULE_1__/* .CorporativoController */ .r.getTanques);
  router.get('/api/tanques/:rancho_id', (0,_middlewares_authMiddleware_js__WEBPACK_IMPORTED_MODULE_2__/* .checkRoleAuth */ .tE)(['produccion', 'inocuidad', 'master']), _controller_corporativo_controller_js__WEBPACK_IMPORTED_MODULE_1__/* .CorporativoController */ .r.getTanquesPorRancho);
  router.post('/api/tanques', (0,_middlewares_authMiddleware_js__WEBPACK_IMPORTED_MODULE_2__/* .checkRoleAuth */ .tE)(['master']), _controller_corporativo_controller_js__WEBPACK_IMPORTED_MODULE_1__/* .CorporativoController */ .r.createTanque);
  router.put('/api/tanques/:id', (0,_middlewares_authMiddleware_js__WEBPACK_IMPORTED_MODULE_2__/* .checkRoleAuth */ .tE)(['master']), _controller_corporativo_controller_js__WEBPACK_IMPORTED_MODULE_1__/* .CorporativoController */ .r.updateTanque);
  router.delete('/api/tanques/:id', (0,_middlewares_authMiddleware_js__WEBPACK_IMPORTED_MODULE_2__/* .checkRoleAuth */ .tE)(['master']), _controller_corporativo_controller_js__WEBPACK_IMPORTED_MODULE_1__/* .CorporativoController */ .r.deleteTanque);

  // --- ACTIVOS MEZCLA ---
  router.get('/api/activos-mezcla', (0,_middlewares_authMiddleware_js__WEBPACK_IMPORTED_MODULE_2__/* .checkRoleAuth */ .tE)(['produccion', 'inocuidad', 'master']), _controller_corporativo_controller_js__WEBPACK_IMPORTED_MODULE_1__/* .CorporativoController */ .r.getActivosMezcla);
  router.post('/api/activos-mezcla', (0,_middlewares_authMiddleware_js__WEBPACK_IMPORTED_MODULE_2__/* .checkRoleAuth */ .tE)(['master']), _controller_corporativo_controller_js__WEBPACK_IMPORTED_MODULE_1__/* .CorporativoController */ .r.createActivoMezcla);
  router.put('/api/activos-mezcla/:id', (0,_middlewares_authMiddleware_js__WEBPACK_IMPORTED_MODULE_2__/* .checkRoleAuth */ .tE)(['master']), _controller_corporativo_controller_js__WEBPACK_IMPORTED_MODULE_1__/* .CorporativoController */ .r.updateActivoMezcla);
  router.delete('/api/activos-mezcla/:id', (0,_middlewares_authMiddleware_js__WEBPACK_IMPORTED_MODULE_2__/* .checkRoleAuth */ .tE)(['master']), _controller_corporativo_controller_js__WEBPACK_IMPORTED_MODULE_1__/* .CorporativoController */ .r.deleteActivoMezcla);

  // --- RANCHO DSA ---
  router.get('/api/rancho-dsa', (0,_middlewares_authMiddleware_js__WEBPACK_IMPORTED_MODULE_2__/* .checkRoleAuth */ .tE)(['produccion', 'inocuidad', 'master']), _controller_corporativo_controller_js__WEBPACK_IMPORTED_MODULE_1__/* .CorporativoController */ .r.getRanchosDsa);
  router.post('/api/rancho-dsa', (0,_middlewares_authMiddleware_js__WEBPACK_IMPORTED_MODULE_2__/* .checkRoleAuth */ .tE)(['master']), _controller_corporativo_controller_js__WEBPACK_IMPORTED_MODULE_1__/* .CorporativoController */ .r.createRanchoDsa);
  router.put('/api/rancho-dsa/:id', (0,_middlewares_authMiddleware_js__WEBPACK_IMPORTED_MODULE_2__/* .checkRoleAuth */ .tE)(['master']), _controller_corporativo_controller_js__WEBPACK_IMPORTED_MODULE_1__/* .CorporativoController */ .r.updateRanchoDsa);
  router.delete('/api/rancho-dsa/:id', (0,_middlewares_authMiddleware_js__WEBPACK_IMPORTED_MODULE_2__/* .checkRoleAuth */ .tE)(['master']), _controller_corporativo_controller_js__WEBPACK_IMPORTED_MODULE_1__/* .CorporativoController */ .r.deleteRanchoDsa);

  // --- TEMPORADAS ---
  router.get('/api/temporadas', (0,_middlewares_authMiddleware_js__WEBPACK_IMPORTED_MODULE_2__/* .checkRoleAuth */ .tE)(['produccion', 'inocuidad', 'master']), _controller_corporativo_controller_js__WEBPACK_IMPORTED_MODULE_1__/* .CorporativoController */ .r.getTemporadas);

  // --- ANIOS ---
  router.get('/api/anios', (0,_middlewares_authMiddleware_js__WEBPACK_IMPORTED_MODULE_2__/* .checkRoleAuth */ .tE)(['produccion', 'inocuidad', 'master']), _controller_corporativo_controller_js__WEBPACK_IMPORTED_MODULE_1__/* .CorporativoController */ .r.getAnios);
  return router;
};
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 8265:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var x = (y) => {
	var x = {}; __webpack_require__.d(x, y); return x
} 
var y = (x) => (() => (x))
module.exports = x({ ["DataTypes"]: () => (__WEBPACK_EXTERNAL_MODULE_sequelize__.DataTypes), ["Op"]: () => (__WEBPACK_EXTERNAL_MODULE_sequelize__.Op), ["Sequelize"]: () => (__WEBPACK_EXTERNAL_MODULE_sequelize__.Sequelize) });

/***/ }),

/***/ 8293:
/***/ ((__webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(__webpack_module__, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   C: () => (/* binding */ Tanques)
/* harmony export */ });
/* harmony import */ var sequelize__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8265);
/* harmony import */ var _db_db_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9815);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_db_db_js__WEBPACK_IMPORTED_MODULE_1__]);
_db_db_js__WEBPACK_IMPORTED_MODULE_1__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];


const tanquesConfig = {
  id: {
    type: sequelize__WEBPACK_IMPORTED_MODULE_0__.DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  codigo: {
    type: sequelize__WEBPACK_IMPORTED_MODULE_0__.DataTypes.STRING(20),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El código es requerido'
      }
    }
  },
  etapa: {
    type: sequelize__WEBPACK_IMPORTED_MODULE_0__.DataTypes.STRING(50),
    allowNull: false
  },
  id_rancho: {
    type: sequelize__WEBPACK_IMPORTED_MODULE_0__.DataTypes.INTEGER,
    allowNull: false,
    validate: {
      isInt: {
        msg: 'El rancho es requerido'
      }
    }
  },
  capacidad: {
    type: sequelize__WEBPACK_IMPORTED_MODULE_0__.DataTypes.INTEGER,
    allowNull: false,
    validate: {
      isInt: {
        msg: 'La capacidad debe ser un número entero'
      }
    }
  },
  unidad: {
    type: sequelize__WEBPACK_IMPORTED_MODULE_0__.DataTypes.STRING(20),
    allowNull: false
  },
  status: {
    type: sequelize__WEBPACK_IMPORTED_MODULE_0__.DataTypes.TINYINT,
    allowNull: false,
    defaultValue: 1
  }
};
const Tanques = _db_db_js__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .A.define('Tanques', tanquesConfig, {
  tableName: 'tanques',
  timestamps: false
});
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 8300:
/***/ ((__webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(__webpack_module__, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   y: () => (/* binding */ AplicacionesTanque)
/* harmony export */ });
/* harmony import */ var sequelize__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8265);
/* harmony import */ var _db_db_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9815);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_db_db_js__WEBPACK_IMPORTED_MODULE_1__]);
_db_db_js__WEBPACK_IMPORTED_MODULE_1__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];


const aplicacionesTanqueConfig = {
  id: {
    type: sequelize__WEBPACK_IMPORTED_MODULE_0__.DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  id_sector: {
    type: sequelize__WEBPACK_IMPORTED_MODULE_0__.DataTypes.INTEGER,
    allowNull: false
  },
  id_responsable: {
    type: sequelize__WEBPACK_IMPORTED_MODULE_0__.DataTypes.INTEGER,
    allowNull: true
  },
  fecha: {
    type: sequelize__WEBPACK_IMPORTED_MODULE_0__.DataTypes.DATEONLY,
    allowNull: false
  },
  litros_aplicados: {
    type: sequelize__WEBPACK_IMPORTED_MODULE_0__.DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  id_tanque_preparado: {
    type: sequelize__WEBPACK_IMPORTED_MODULE_0__.DataTypes.INTEGER,
    allowNull: false
  }
};
const AplicacionesTanque = _db_db_js__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .A.define('AplicacionesTanque', aplicacionesTanqueConfig, {
  tableName: 'aplicaciones_tanque',
  timestamps: false
});
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 8518:
/***/ ((__webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(__webpack_module__, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   e: () => (/* binding */ MezclasTanque)
/* harmony export */ });
/* harmony import */ var sequelize__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8265);
/* harmony import */ var _db_db_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9815);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_db_db_js__WEBPACK_IMPORTED_MODULE_1__]);
_db_db_js__WEBPACK_IMPORTED_MODULE_1__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];


const mezclasTanqueConfig = {
  id: {
    type: sequelize__WEBPACK_IMPORTED_MODULE_0__.DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  id_tanque_preparado: {
    type: sequelize__WEBPACK_IMPORTED_MODULE_0__.DataTypes.INTEGER,
    allowNull: false
  },
  id_mezcla: {
    type: sequelize__WEBPACK_IMPORTED_MODULE_0__.DataTypes.INTEGER,
    allowNull: false
  },
  cantidad_litros: {
    type: sequelize__WEBPACK_IMPORTED_MODULE_0__.DataTypes.DECIMAL(10, 2),
    allowNull: false
  }
};
const MezclasTanque = _db_db_js__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .A.define('MezclasTanque', mezclasTanqueConfig, {
  tableName: 'mezclas_tanque',
  timestamps: false
});
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 9021:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   D: () => (/* binding */ loggerConfig)
/* harmony export */ });
const loggerConfig = {
  // Niveles de log por ambiente
  levels: {
    development: 'debug',
    test: 'info',
    production: 'warn'
  },
  levelColors: {
    error: 'red',
    logError: 'red',
    warn: 'yellow',
    info: 'blue',
    http: 'magenta',
    debug: 'gray',
    logModelOperation: 'gray'
  },
  logLevels: {
    error: 0,
    logError: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
    logModelOperation: 4
  },
  // Configuración de rotación de archivos
  rotation: {
    maxSize: '20m',
    maxFiles: '14d',
    compress: true
  },
  // Formato de salida
  format: {
    timestamp: 'YYYY-MM-DD HH:mm:ss',
    includeMeta: true,
    colorize: true
  },
  // Métricas y monitoreo
  metrics: {
    enabled: true,
    interval: 60000,
    // 1 minuto
    measurements: ['operationsPerSecond', 'errorRate', 'responseTime']
  },
  // Correlación de logs
  correlation: {
    enabled: true,
    headerName: 'X-Correlation-ID'
  }
};

/***/ }),

/***/ 9071:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var x = (y) => {
	var x = {}; __webpack_require__.d(x, y); return x
} 
var y = (x) => (() => (x))
module.exports = x({ ["default"]: () => (__WEBPACK_EXTERNAL_MODULE_jsonwebtoken__["default"]) });

/***/ }),

/***/ 9097:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   D: () => (/* binding */ envs)
/* harmony export */ });
/* harmony import */ var dotenv__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5708);
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6928);


const envPath = path__WEBPACK_IMPORTED_MODULE_1__.resolve(process.cwd(), `.env.${"production" || 0}`);
// Validar versión de Node.js
// console.log('variables de entono archivo env.mjs:', process.env)

const validateNodeVersion = () => {
  const currentVersion = process.version;
  const isDevelopment = "production" === 'development';
  if (isDevelopment && !currentVersion.startsWith('v24')) {
    throw new Error('Desarrollo requiere Node.js 24.14.0');
  }
  if (!isDevelopment && !currentVersion.startsWith('v24')) {
    throw new Error('Producción requiere Node.js 24.14.0');
  }
};

// Configuración según el entorno
const getEnvironmentConfig = () => {
  const isDevelopment = "production" === 'development';
  return {
    nodeVersion: isDevelopment ? '21.6.2' : '24.0.1',
    pool: {
      max: isDevelopment ? 5 : 10,
      min: 0,
      acquire: isDevelopment ? 30000 : 60000,
      idle: isDevelopment ? 10000 : 20000
    }
  };
};

// En src/config/env.mjs
const loadEnvVars = () => {
  const isPleskMode = process.env.PLESK_MODE === 'true';
  if (!isPleskMode) {
    dotenv__WEBPACK_IMPORTED_MODULE_0__["default"].config({
      path: envPath
    });
    // Variables de desarrollo tomadas de archivo .env
  } else {
    // Variables de entorno del tomada del servidor:
  }
  // Verificar variables críticas
};
// Cargar variables de entorno
loadEnvVars();

// este es un objeto que guarda nuestas variables de entorno para utilizarlas en nuestro proyecto
const envs = {
  PORT: parseInt(process.env.PORT),
  MODE: "production" || 0,
  DB_CONFIG: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    // Agregar configuración específica para Plesk
    ssl: process.env.DB_SSL_ENABLED === 'true' || false,
    pool: getEnvironmentConfig().pool
  },
  SECRET_JWT_KEY: process.env.SECRET_JWT_KEY,
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
  PUBLIC_KEY: process.env.PUBLIC_KEY,
  PRIVATE_KEY: process.env.PRIVATE_KEY,
  MAILTO: process.env.MAILTO,
  NOTIFICATION_ICON: process.env.NOTIFICATION_ICON,
  PLESK_MODE: process.env.PLESK_MODE || false,
  CRON_JOB_VALIDACIONES_PROGRAMADAS: process.env.CRON_JOB_VALIDACIONES_PROGRAMADAS,
  // Agregar validación
  validate() {
    // Validar versión de Node.js
    validateNodeVersion();
  }
};

// Validar variables requeridas
envs.validate();

/***/ }),

/***/ 9100:
/***/ ((__webpack_module__, __unused_webpack___webpack_exports__, __webpack_require__) => {

__webpack_require__.a(__webpack_module__, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony import */ var _server_server_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2936);
/* harmony import */ var _config_env_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9097);
/* harmony import */ var _utils_logger_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(3014);
/* harmony import */ var _deploy_config_mjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(777);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_server_server_mjs__WEBPACK_IMPORTED_MODULE_0__]);
_server_server_mjs__WEBPACK_IMPORTED_MODULE_0__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];




// SCSS se manejará a través de webpack, no se importa aquí

const env = "production" || 0;
const config = {
  ..._deploy_config_mjs__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .A.common,
  ..._deploy_config_mjs__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .A[env]
};
async function bootstrap() {
  try {
    _utils_logger_js__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .A.info('Iniciando aplicación', {
      environment: env,
      nodeVersion: process.version,
      port: _config_env_mjs__WEBPACK_IMPORTED_MODULE_1__/* .envs */ .D.PORT
    });
    await (0,_server_server_mjs__WEBPACK_IMPORTED_MODULE_0__/* .startServer */ .U)({
      PORT: _config_env_mjs__WEBPACK_IMPORTED_MODULE_1__/* .envs */ .D.PORT,
      MODE: _config_env_mjs__WEBPACK_IMPORTED_MODULE_1__/* .envs */ .D.MODE,
      config
    });
    _utils_logger_js__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .A.info('✅ Servidor iniciado correctamente', {
      port: _config_env_mjs__WEBPACK_IMPORTED_MODULE_1__/* .envs */ .D.PORT,
      mode: _config_env_mjs__WEBPACK_IMPORTED_MODULE_1__/* .envs */ .D.MODE
    });
  } catch (error) {
    _utils_logger_js__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .A.error('Error al iniciar el servidor', {
      error: {
        message: error.message,
        stack: error.stack
      }
    });
    process.exit(1);
  }
}

// Manejo de errores no capturados
process.on('unhandledRejection', (reason, promise) => {
  _utils_logger_js__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .A.error('Unhandled Rejection', {
    reason,
    promise
  });
});
process.on('uncaughtException', error => {
  _utils_logger_js__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .A.error('Uncaught Exception', {
    error: {
      message: error.message,
      stack: error.stack
    }
  });
  process.exit(1);
});
bootstrap();
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 9250:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  N: () => (/* binding */ apiLimiter)
});

;// external "express-rate-limit"
var x = (y) => {
	var x = {}; __webpack_require__.d(x, y); return x
} 
var y = (x) => (() => (x))
const external_express_rate_limit_namespaceObject = x({ ["default"]: () => (__WEBPACK_EXTERNAL_MODULE_express_rate_limit_c965cf1c__["default"]) });
// EXTERNAL MODULE: ./src/utils/logger.js + 3 modules
var logger = __webpack_require__(3014);
;// ./src/middlewares/rateLimit.js


const apiLimiter = (0,external_express_rate_limit_namespaceObject["default"])({
  windowMs: 15 * 60 * 1000,
  // 15 minutos
  max: 100,
  // máximo 100 peticiones por ventana
  message: {
    error: 'Demasiadas peticiones, por favor intente más tarde'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next, options) => {
    logger/* default */.A.warn('Límite de peticiones excedido', {
      ip: req.ip,
      path: req.path
    });
    res.status(429).json(options.message);
  },
  skip: req => {
    // Ignorar rutas específicas
    return req.path.startsWith('/public');
  }
});

/***/ }),

/***/ 9491:
/***/ ((__webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(__webpack_module__, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   P: () => (/* binding */ Usuario)
/* harmony export */ });
/* harmony import */ var sequelize__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8265);
/* harmony import */ var _db_db_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9815);
/* harmony import */ var bcryptjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(3139);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_db_db_js__WEBPACK_IMPORTED_MODULE_1__]);
_db_db_js__WEBPACK_IMPORTED_MODULE_1__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];



const usuarioConfig = {
  nombre: {
    type: sequelize__WEBPACK_IMPORTED_MODULE_0__.DataTypes.STRING,
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
    type: sequelize__WEBPACK_IMPORTED_MODULE_0__.DataTypes.STRING,
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
    type: sequelize__WEBPACK_IMPORTED_MODULE_0__.DataTypes.STRING,
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
    type: sequelize__WEBPACK_IMPORTED_MODULE_0__.DataTypes.STRING,
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
    type: sequelize__WEBPACK_IMPORTED_MODULE_0__.DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El rol es requerido'
      }
    }
  },
  empresa: {
    type: sequelize__WEBPACK_IMPORTED_MODULE_0__.DataTypes.STRING,
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
    type: sequelize__WEBPACK_IMPORTED_MODULE_0__.DataTypes.STRING,
    allowNull: true,
    defaultValue: 'General',
    validate: {
      len: {
        args: [0, 80],
        msg: 'El rancho debe tener entre 0 y 50 caracteres'
      }
    }
  }
};
const Usuario = _db_db_js__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .A.define('usuarios', usuarioConfig, {
  timestamps: false,
  hooks: {
    beforeCreate: async (usuario, options) => {
      const salt = await bcryptjs__WEBPACK_IMPORTED_MODULE_2__["default"].genSalt(10);
      usuario.password = await bcryptjs__WEBPACK_IMPORTED_MODULE_2__["default"].hash(usuario.password, salt);
    },
    beforeUpdate: async (usuario, options) => {
      if (usuario.changed('password')) {
        const salt = await bcryptjs__WEBPACK_IMPORTED_MODULE_2__["default"].genSalt(10);
        usuario.password = await bcryptjs__WEBPACK_IMPORTED_MODULE_2__["default"].hash(usuario.password, salt);
      }
    }
  }
});
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 9648:
/***/ ((__webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(__webpack_module__, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* unused harmony exports tieneAccesoASistema, tieneAccesoARancho, tienePermiso */
/* harmony import */ var _db_db_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9815);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_db_db_js__WEBPACK_IMPORTED_MODULE_0__]);
_db_db_js__WEBPACK_IMPORTED_MODULE_0__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];
// accessHelpers.js


/**
 * Nivel 1: tiene acceso al sistema?
 */
async function tieneAccesoASistema(idUsuario, idSistema) {
  const [rows] = await sequelize.query('SELECT 1 FROM usuarios_accesos WHERE idUsuario = ? AND idSistema = ? LIMIT 1', {
    replacements: [idUsuario, idSistema]
  });
  return rows.length > 0;
}

/**
 * Nivel 2: acceso a rancho (o acceso global a la empresa si idRancho IS NULL)
 */
async function tieneAccesoARancho(idUsuario, idRancho, idEmpresa) {
  if (!idRancho) {
    // si no se pide rancho, validar que usuario tenga acceso a la empresa en ese sistema OR any entry for company
    const [rows] = await sequelize.query('SELECT 1 FROM usuarios_accesos WHERE idUsuario = ? AND idEmpresa = ? LIMIT 1', {
      replacements: [idUsuario, idEmpresa]
    });
    return rows.length > 0;
  }
  const [rows] = await sequelize.query('SELECT 1 FROM usuarios_accesos WHERE idUsuario = ? AND idEmpresa = ? AND (idRancho = ? OR idRancho IS NULL) LIMIT 1', {
    replacements: [idUsuario, idEmpresa, idRancho]
  });
  return rows.length > 0;
}

/**
 * Nivel 3: Permiso sobre módulo y acción
 * - moduleClave: clave del módulo (ej 'almacen')
 * - accion: 'create'|'read'|'update'|'approve' etc.
 * - idSistema: opcional para limitar por sistema
 */
async function tienePermiso(idUsuario, moduleClave, accion, idSistema = null) {
  const params = [idUsuario, moduleClave, accion];
  let sql = `
    SELECT 1
    FROM usuarios_roles ur
    JOIN roles_permisos rp ON rp.idRol = ur.idRol
    JOIN permisos p ON p.idPermiso = rp.idPermiso
    JOIN modulos m ON m.idModulo = p.idModulo
    WHERE ur.idUsuario = ?
    AND m.clave = ?
    AND p.accion = ?
    `;
  if (idSistema) {
    sql += ' AND m.idSistema = ?';
    params.push(idSistema);
  }
  sql += ' LIMIT 1';
  const [rows] = await sequelize.query(sql, {
    replacements: params
  });
  return rows.length > 0;
}
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 9815:
/***/ ((__webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(__webpack_module__, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var sequelize__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8265);
/* harmony import */ var _config_env_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9097);
/* harmony import */ var _utils_logger_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(3014);



const getConnectionConfig = () => {
  const isProduction = _config_env_mjs__WEBPACK_IMPORTED_MODULE_1__/* .envs */ .D.MODE === 'production';
  const config = {
    dialect: 'mysql',
    host: _config_env_mjs__WEBPACK_IMPORTED_MODULE_1__/* .envs */ .D.DB_CONFIG.host,
    port: 3306,
    username: _config_env_mjs__WEBPACK_IMPORTED_MODULE_1__/* .envs */ .D.DB_CONFIG.user,
    password: _config_env_mjs__WEBPACK_IMPORTED_MODULE_1__/* .envs */ .D.DB_CONFIG.password,
    database: _config_env_mjs__WEBPACK_IMPORTED_MODULE_1__/* .envs */ .D.DB_CONFIG.database,
    logging: false,
    // logging: msg => logger.debug(msg),
    define: {
      timestamps: false,
      freezeTableName: true,
      underscored: true
    },
    pool: {
      max: isProduction ? 10 : 5,
      min: 0,
      acquire: isProduction ? 180000 : 60000,
      idle: isProduction ? 60000 : 20000
    },
    dialectOptions: {
      connectTimeout: isProduction ? 180000 : 60000
    }
  };

  // Log de configuración para debug
  _utils_logger_js__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .A.debug('Configuración de base de datos:', {
    host: config.host,
    database: config.database,
    user: config.username
  });
  return config;
};
const initializeConnection = async () => {
  try {
    const config = getConnectionConfig();
    const sequelize = new sequelize__WEBPACK_IMPORTED_MODULE_0__.Sequelize(config);
    await sequelize.authenticate();
    _utils_logger_js__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .A.info('✅ Conexión establecida correctamente');
    return sequelize;
  } catch (error) {
    _utils_logger_js__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .A.error('❌ Error conectando a la base de datos:', {
      message: error.message,
      code: error.original?.code,
      sqlMessage: error.original?.sqlMessage
    });
    throw error;
  }
};
const sequelize = await initializeConnection();
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (sequelize);
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } }, 1);

/***/ })

/******/ });
/************************************************************************/
/******/ // The module cache
/******/ var __webpack_module_cache__ = {};
/******/ 
/******/ // The require function
/******/ function __webpack_require__(moduleId) {
/******/ 	// Check if module is in cache
/******/ 	var cachedModule = __webpack_module_cache__[moduleId];
/******/ 	if (cachedModule !== undefined) {
/******/ 		return cachedModule.exports;
/******/ 	}
/******/ 	// Create a new module (and put it into the cache)
/******/ 	var module = __webpack_module_cache__[moduleId] = {
/******/ 		// no module.id needed
/******/ 		// no module.loaded needed
/******/ 		exports: {}
/******/ 	};
/******/ 
/******/ 	// Execute the module function
/******/ 	__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 
/******/ 	// Return the exports of the module
/******/ 	return module.exports;
/******/ }
/******/ 
/************************************************************************/
/******/ /* webpack/runtime/async module */
/******/ (() => {
/******/ 	var webpackQueues = typeof Symbol === "function" ? Symbol("webpack queues") : "__webpack_queues__";
/******/ 	var webpackExports = typeof Symbol === "function" ? Symbol("webpack exports") : "__webpack_exports__";
/******/ 	var webpackError = typeof Symbol === "function" ? Symbol("webpack error") : "__webpack_error__";
/******/ 	var resolveQueue = (queue) => {
/******/ 		if(queue && queue.d < 1) {
/******/ 			queue.d = 1;
/******/ 			queue.forEach((fn) => (fn.r--));
/******/ 			queue.forEach((fn) => (fn.r-- ? fn.r++ : fn()));
/******/ 		}
/******/ 	}
/******/ 	var wrapDeps = (deps) => (deps.map((dep) => {
/******/ 		if(dep !== null && typeof dep === "object") {
/******/ 			if(dep[webpackQueues]) return dep;
/******/ 			if(dep.then) {
/******/ 				var queue = [];
/******/ 				queue.d = 0;
/******/ 				dep.then((r) => {
/******/ 					obj[webpackExports] = r;
/******/ 					resolveQueue(queue);
/******/ 				}, (e) => {
/******/ 					obj[webpackError] = e;
/******/ 					resolveQueue(queue);
/******/ 				});
/******/ 				var obj = {};
/******/ 				obj[webpackQueues] = (fn) => (fn(queue));
/******/ 				return obj;
/******/ 			}
/******/ 		}
/******/ 		var ret = {};
/******/ 		ret[webpackQueues] = x => {};
/******/ 		ret[webpackExports] = dep;
/******/ 		return ret;
/******/ 	}));
/******/ 	__webpack_require__.a = (module, body, hasAwait) => {
/******/ 		var queue;
/******/ 		hasAwait && ((queue = []).d = -1);
/******/ 		var depQueues = new Set();
/******/ 		var exports = module.exports;
/******/ 		var currentDeps;
/******/ 		var outerResolve;
/******/ 		var reject;
/******/ 		var promise = new Promise((resolve, rej) => {
/******/ 			reject = rej;
/******/ 			outerResolve = resolve;
/******/ 		});
/******/ 		promise[webpackExports] = exports;
/******/ 		promise[webpackQueues] = (fn) => (queue && fn(queue), depQueues.forEach(fn), promise["catch"](x => {}));
/******/ 		module.exports = promise;
/******/ 		body((deps) => {
/******/ 			currentDeps = wrapDeps(deps);
/******/ 			var fn;
/******/ 			var getResult = () => (currentDeps.map((d) => {
/******/ 				if(d[webpackError]) throw d[webpackError];
/******/ 				return d[webpackExports];
/******/ 			}))
/******/ 			var promise = new Promise((resolve) => {
/******/ 				fn = () => (resolve(getResult));
/******/ 				fn.r = 0;
/******/ 				var fnQueue = (q) => (q !== queue && !depQueues.has(q) && (depQueues.add(q), q && !q.d && (fn.r++, q.push(fn))));
/******/ 				currentDeps.map((dep) => (dep[webpackQueues](fnQueue)));
/******/ 			});
/******/ 			return fn.r ? promise : getResult();
/******/ 		}, (err) => ((err ? reject(promise[webpackError] = err) : outerResolve(exports)), resolveQueue(queue)));
/******/ 		queue && queue.d < 0 && (queue.d = 0);
/******/ 	};
/******/ })();
/******/ 
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
/******/ 
/******/ // startup
/******/ // Load entry module and return exports
/******/ // This entry module used 'module' so it can't be inlined
/******/ var __webpack_exports__ = __webpack_require__(9100);
/******/ __webpack_exports__ = await __webpack_exports__;
/******/ 
