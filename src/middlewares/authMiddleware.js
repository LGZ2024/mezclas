import jwt from 'jsonwebtoken'
import { envs } from '../config/env.mjs'

const authenticate = async (req, res, next) => {
  const token = req.cookies.access_token
  let decoded = null

  req.session = { user: null }
  try {
    if (!token) return res.status(403).render('errorPage', { codeError: 403, errorMsg: 'No token provided' })
    // Verificamos token
    decoded = await verifyToken(token)
    if (!decoded) return res.status(401).render('errorPage', { codeError: 401, errorMsg: 'Token Invalido' })
    req.session.user = decoded
    req.userRole = decoded.userRole // Establece la propiedad req.userRole
    next()
  } catch (error) {
    req.session.user = null
    return res.status(401).render('errorPage', { codeError: 401, errorMsg: 'Error de autenticación' })
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
  if (req.userRole !== 'admin') return res.status(403).render('errorPage', { codeError: 403, errorMsg: 'No autorizado' })
  next()
}
const isGeneral = (req, res, next) => {
  if (req.userRole !== 'solicita' && req.userRole !== 'solicita2' && req.userRole !== 'mezclador' && req.userRole !== 'administrativo' && req.userRole !== 'admin') return res.status(403).render('errorPage', { codeError: 403, errorMsg: 'No autorizado' })
  next()
}

const isAdminsitrativoOrAdmin = (req, res, next) => {
  if (req.userRole !== 'administrativo' && req.userRole !== 'admin') return res.status(403).render('errorPage', { codeError: 403, errorMsg: 'No autorizado' })
  next()
}
const isSolicitaOrMezclador = (req, res, next) => {
  if (req.userRole !== 'solicita' && req.userRole !== 'solicita2' && req.userRole !== 'mezclador' && req.userRole !== 'administrativo') return res.status(403).render('errorPage', { codeError: 403, errorMsg: 'No autorizado' })
  next()
}

export { authenticate, isAdmin, isSolicitaOrMezclador, isAdminsitrativoOrAdmin, isGeneral }
