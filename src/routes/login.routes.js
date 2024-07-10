import express from 'express';
import { login } from '../controller/login.controller.js';

/* import { authenticate } from '../../../../expo/LGZ2024-master/middleware/auth.middleware';
 */

const router = express.Router();

/* router.get('/', authenticate, async (req, res) => {
    const { user } = req.session;

    // auth.middleware.js
import jwt from 'jsonwebtoken';
export const authenticate = async (req, res, next) => {
  const token = req.cookies.accessToken;
  try {
    const data = jwt.verify(token, process.env.SECRET_JWT_KEY);
    req.session.user = data;
    next();
  } catch (error) {
    res.status(401).send({ message: 'Unauthorized' });
  }
};
  }); */


//Editar usuario
router.post('/login', login)
//Mostrar todos los usuario
router.get('/exit',)


export default router;
