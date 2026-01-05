import jwt from 'jsonwebtoken'
import { envs } from '../config/env.mjs'
import { tieneAccesoASistema, tienePermiso, tieneAccesoARancho } from '../utils/authHelper.js'

const authenticate = async (req, res, next) => {
  const token = req.cookies.access_token
  let decoded = null

  req.session = { user: null }
  try {
    if (!token) return res.status(403).render('errorSesion', { codeError: 403, title: '403 - token no proveeido', errorMsg: 'No se ha iniciado sesion' })
    // Verificamos token
    decoded = await verifyToken(token)
    if (!decoded) return res.status(401).render('errorSesion', { codeError: 401, title: '401 - Token Invalido', errorMsg: 'Error de autenticación' })
    req.session.user = decoded
    req.user = { ...decoded, idUsuario: decoded.id }
    req.userRole = decoded.userRole // Establece la propiedad req.userRole
    next()
  } catch (error) {
    req.session.user = null
    return res.status(401).render('errorSesion', { codeError: 401, title: '401 - Token Invalido', errorMsg: 'Error de autenticación' })
  }
}

const verifyToken = async (token) => {
  try {
    const decoded = jwt.verify(token, envs.SECRET_JWT_KEY)
    decoded.userRole = decoded.rol // Agrega la propiedad userRole al objeto decoded
    return decoded
  } catch (error) {
    return null
  }
}

const checkAccess = ({ idSistema, moduleClave, accion, requireRancho = false }) => {
  return async (req, res, next) => {
    const user = req.user;
    if (!user) return res.status(401).json({ msg: 'No autenticado' });

    // 1) Sistema
    const accesoSistema = await tieneAccesoASistema(user.idUsuario, idSistema);
    if (!accesoSistema) return res.status(403).json({ msg: 'Sin acceso al sistema' });

    // 2) Dominio empresa/rancho - se esperan idEmpresa e idRancho en body/query/params
    const idEmpresa = req.body.idEmpresa || req.query.idEmpresa || req.params.idEmpresa;
    const idRancho = req.body.idRancho || req.query.idRancho || req.params.idRancho || null;

    if (!idEmpresa) {
      // si la ruta requiere empresa explícita, forzarla
      return res.status(400).json({ msg: 'Falta idEmpresa en la solicitud' });
    }

    const accesoDominio = await tieneAccesoARancho(user.idUsuario, idRancho, idEmpresa);
    if (!accesoDominio) return res.status(403).json({ msg: 'Sin acceso al dominio (empresa/rancho)' });

    // 3) Permiso sobre módulo/acción
    const permiso = await tienePermiso(user.idUsuario, moduleClave, accion, idSistema);
    if (!permiso) return res.status(403).json({ msg: 'Sin permisos en el módulo' });

    // Adjuntar contexto útil
    req.ctx = { idSistema, moduleClave, accion, idEmpresa: Number(idEmpresa), idRancho: idRancho ? Number(idRancho) : null };

    next();
  };
}

export { authenticate, checkAccess }

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