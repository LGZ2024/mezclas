import express from 'express';
import { CentroCostes,Variedades} from '../controller/centro.controller.js';

const router = express.Router();


//Obtener centros de coste. pasamos
router.get('/cc/:id',CentroCostes)

//obtener variedades de contros de costo
router.get('/variedades/:id',Variedades)

export default router;
