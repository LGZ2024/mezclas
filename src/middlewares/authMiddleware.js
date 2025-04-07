import jwt from 'jsonwebtoken'
import { envs } from '../config/env.mjs'

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

const isAdmin = (req, res, next) => {
  if (req.userRole !== 'admin') return res.status(403).render('errorPage', { codeError: 403, title: 'Sin Autorizacion', errorMsg: 'No autorizado' })
  next()
}
const isGeneral = (req, res, next) => {
  if (req.userRole !== 'solicita' && req.userRole !== 'solicita2' && req.userRole !== 'mezclador' && req.userRole !== 'administrativo' && req.userRole !== 'admin') return res.status(403).render('errorPage', { codeError: 403, errorMsg: 'No autorizado' })
  next()
}

const isAdminsitrativoOrAdmin = (req, res, next) => {
  if (req.userRole !== 'administrativo' && req.userRole !== 'admin') return res.status(403).render('errorPage', { codeError: 403, title: 'Sin Autorizacion', errorMsg: 'No autorizado' })
  next()
}
const isSolicitaOrMezclador = (req, res, next) => {
  if (req.userRole !== 'solicita' && req.userRole !== 'solicita2' && req.userRole !== 'mezclador' && req.userRole !== 'administrativo') return res.status(403).render('errorPage', { codeError: 403, title: 'Sin Autorizacion', errorMsg: 'No autorizado' })
  next()
}

export { authenticate, isAdmin, isSolicitaOrMezclador, isAdminsitrativoOrAdmin, isGeneral }
