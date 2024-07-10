import express from 'express';
import {crearSolicitud,obtenerTablaMezclas,obtenerTablaMezclasEmpresa,obtenerTablaMezclasStatus,obtenerTablaMezclasId,guardarTablaMezclas,cerrarMezclas} from '../controller/mesclas.contoller.js';
/* import upload from '../server/multer.config.js'; */

const app = express();

const router = express.Router();

//Crear solicitud
router.post('/solicitud',crearSolicitud)

//obtener tabla de mezclas idusuario y status
router.get('/mezclas/:id_usuario',obtenerTablaMezclas)

//obtener tabla de mezclas empresa
router.get('/mezclasEmpresa/:empresa',obtenerTablaMezclasEmpresa)

//obtener tabla de mezclas status
router.get('/mezclasEmpresas/:status',obtenerTablaMezclasStatus)

//obtener tabla de mezclas status
router.get('/mezclasId/:id',obtenerTablaMezclasId)

//guardar mezcla
router.patch('/mezclasAlmacen/:id',guardarTablaMezclas)

//cerrar mezcla
router.post('/mezclasAlmacen/',cerrarMezclas)



export default router;